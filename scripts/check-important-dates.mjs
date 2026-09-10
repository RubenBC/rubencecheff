// scripts/check-important-dates.mjs
//
// Se ejecuta a diario desde GitHub Actions (ver .github/workflows/important-dates.yml).
// Le pide a Gemini que busque, con acceso a la web en tiempo real, partidos
// de fútbol y eventos en el WiZink Center que puedan llenar el restaurante,
// según los criterios acordados. Las sugerencias nuevas se guardan en
// Supabase con estado "pendiente" para que el admin las apruebe o descarte
// desde el panel de la app.

const GEMINI_API_KEY       = process.env.GEMINI_API_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SUPABASE_URL         = 'https://rswzirygkeyainerfzjx.supabase.co';

// Modelo con soporte de búsqueda web en tiempo real y nivel gratuito.
// Si Google lo retira en el futuro, basta con cambiar esta línea.
const GEMINI_MODEL = 'gemini-3.5-flash';

if (!GEMINI_API_KEY || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Faltan variables de entorno (GEMINI_API_KEY / SUPABASE_SERVICE_KEY). Revisa los secretos del repositorio.');
  process.exit(1);
}

const PROMPT = `
Eres un asistente que ayuda a un hotel-restaurante en Madrid, situado junto
al WiZink Center, a anticipar los días con más afluencia para reforzar la
producción de cocina.

Busca información actualizada (usa siempre la búsqueda web, no te fíes solo
de tu memoria) sobre PARTIDOS DE FÚTBOL y EVENTOS EN EL WIZINK CENTER
(conciertos, boxeo u otros espectáculos con aforo grande) que vayan a
ocurrir entre hoy y los próximos 14 días.

Un PARTIDO DE FÚTBOL es importante si cumple algo de esto:
- Juega el Real Madrid, el Atlético de Madrid o el FC Barcelona (en
  cualquier competición, jueguen en casa o fuera).
- Es un Clásico (Real Madrid - Barcelona) o un Derbi madrileño
  (Real Madrid - Atlético).
- Juega la Selección Española en fase final de un Mundial o una Eurocopa.
- Es semifinal o final de la Champions League (aunque no juegue ningún
  equipo español).
Y ADEMÁS, el horario del partido debe solapar con el servicio de comida
(aprox. 13:00-16:30, hora de España) o de cena (aprox. 20:00-23:30), porque
el motivo de que importe es que se ve en la televisión del restaurante.

Un EVENTO EN WIZINK CENTER (concierto, boxeo u otro espectáculo) es
importante si:
- Tiene aforo grande o las entradas están agotadas o casi agotadas. No
  importa si el artista es internacional o nacional: lo que importa es el
  aforo, porque genera afluencia de gente cerca del hotel antes y después
  del evento.
- Si un artista hace varias noches seguidas, trata cada noche como un
  evento independiente (una entrada por noche).

Devuelve SOLO un array JSON, sin texto antes ni después, sin explicaciones,
sin bloques de código markdown, con este formato EXACTO:

[
  {
    "event_date": "YYYY-MM-DD",
    "event_time": "HH:MM o null si no se sabe",
    "title": "texto corto, ej. 'Real Madrid - Barcelona' o 'Concierto de X en WiZink'",
    "category": "futbol o concierto o evento",
    "note": "razón breve, ej. 'Champions League, semifinal' o 'Entradas agotadas'"
  }
]

Si no encuentras ningún evento que cumpla los criterios, devuelve
exactamente: []

No inventes partidos ni conciertos: si no tienes datos fiables sobre un
evento concreto, no lo incluyas en la lista.
`.trim();

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Llama a Gemini con reintentos: 3 intentos en total, con espera creciente
// entre cada uno (30s, luego 2 min). Si los 3 fallan, el robot no rompe
// nada: simplemente no hay sugerencias nuevas hoy, y mañana se reintenta solo.
async function callGeminiWithRetry() {
  const waits = [0, 30_000, 120_000];
  let lastError;

  for (let attempt = 0; attempt < waits.length; attempt++) {
    if (waits[attempt] > 0) {
      console.log(`Reintentando en ${waits[attempt] / 1000}s… (intento ${attempt + 1}/${waits.length})`);
      await sleep(waits[attempt]);
    }
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: PROMPT }] }],
            tools: [{ google_search: {} }],
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini respondió ${res.status}: ${errText.slice(0, 300)}`);
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
      if (!text.trim()) throw new Error('Respuesta de Gemini vacía');

      return text;
    } catch (err) {
      console.warn(`Intento ${attempt + 1} falló: ${err.message}`);
      lastError = err;
    }
  }

  throw lastError;
}

// Limpia la respuesta (por si Gemini la envuelve en ```json ... ``` a pesar
// de que se le pide explícitamente que no lo haga) y la parsea como JSON.
function parseEvents(rawText) {
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) throw new Error('La respuesta no es un array JSON');
  return parsed;
}

async function supabaseFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase ${options.method || 'GET'} ${path} → ${res.status}: ${errText.slice(0, 300)}`);
  }
  return res.status === 204 ? null : res.json();
}

function normalize(s) {
  return (s || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

async function main() {
  console.log('🔎 Consultando a Gemini…');
  const rawText = await callGeminiWithRetry();

  let events;
  try {
    events = parseEvents(rawText);
  } catch (err) {
    console.error('❌ No se pudo interpretar la respuesta de Gemini como JSON:', err.message);
    console.error('Respuesta recibida (primeros 1000 caracteres):', rawText.slice(0, 1000));
    process.exit(1);
  }

  console.log(`Gemini propone ${events.length} evento(s).`);
  if (events.length === 0) { console.log('✅ Nada que añadir hoy.'); return; }

  console.log('📥 Comprobando duplicados contra la base de datos…');
  const existing = await supabaseFetch('important_dates?select=event_date,title,category');

  const isDuplicate = ev =>
    existing.some(e =>
      e.event_date === ev.event_date &&
      e.category === ev.category &&
      normalize(e.title) === normalize(ev.title)
    );

  const newEvents = events.filter(ev => {
    if (!ev.event_date || !ev.title || !ev.category) return false;
    return !isDuplicate(ev);
  });

  console.log(`${newEvents.length} de ${events.length} son nuevos (el resto ya estaban en la base de datos).`);
  if (newEvents.length === 0) { console.log('✅ Nada nuevo que añadir.'); return; }

  const rows = newEvents.map(ev => ({
    event_date: ev.event_date,
    event_time: ev.event_time || null,
    title:      ev.title,
    category:   ['futbol', 'concierto', 'evento'].includes(ev.category) ? ev.category : 'evento',
    note:       ev.note || null,
    status:     'pendiente',
    source:     'ia',
  }));

  await supabaseFetch('important_dates', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify(rows),
  });

  console.log(`✅ ${rows.length} sugerencia(s) nueva(s) guardada(s) como pendiente(s).`);
  rows.forEach(r => console.log(`   · ${r.event_date} — ${r.title} (${r.category})`));
}

main().catch(err => {
  console.error('❌ El robot falló hoy:', err.message);
  // Salimos con código de error para que GitHub marque el run como fallido
  // (así se ve en el historial de Actions), pero no rompe nada de la app:
  // mañana se reintenta solo, sin que tengas que hacer nada.
  process.exit(1);
});
