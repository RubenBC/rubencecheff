/* ═══════════════════════════════════════
   LECTOR DE ARCHIVOS MIDI  (v85)
   Sirve para que el admin recorte un trozo de un .mid suyo y lo use como
   melodía del timer. Todo ocurre en el navegador: el archivo se lee aquí,
   se eligen las pistas y el fragmento, y se convierte en la misma lista de
   notas [frecuencia, inicio, duración] que usan las otras melodías del timer.
   No lleva ninguna canción incluida: solo trabaja con el archivo que se le da.
═══════════════════════════════════════ */
(function () {
  'use strict';

  const MAX_BYTES = 2 * 1024 * 1024;   // un .mid normal pesa unas decenas de KB
  const MAX_NOTES = 20000;             // límite de seguridad al leer
  const MAX_LOOP_S = 20;               // duración máxima del fragmento (la alarma se repite en bucle)
  const MAX_TONE_NOTES = 200;          // notas máximas por vuelta (cada nota son 2 osciladores)
  const MAX_VOICES = 6;                // notas sonando a la vez

  // Lee un archivo MIDI estándar (SMF formato 0 o 1). Lanza Error con un mensaje
  // comprensible si no se puede leer.
  function parse(buffer) {
    if (!buffer || buffer.byteLength < 14) throw new Error('El archivo está vacío o no es un MIDI');
    if (buffer.byteLength > MAX_BYTES) throw new Error('El archivo es demasiado grande para ser un MIDI normal');
    const d = new DataView(buffer);
    const u8 = new Uint8Array(buffer);
    const tag = (o) => String.fromCharCode(u8[o], u8[o + 1], u8[o + 2], u8[o + 3]);
    if (tag(0) !== 'MThd') throw new Error('No es un archivo MIDI (.mid)');
    const hdrLen = d.getUint32(4);
    const format = d.getUint16(8), nTracks = d.getUint16(10), division = d.getUint16(12);
    if (division & 0x8000) throw new Error('Este MIDI usa un tipo de tiempo (SMPTE) que no se puede leer');
    if (format > 1) throw new Error('Este MIDI es de un formato que no se puede leer');
    const ppq = division || 480;

    let pos = 8 + hdrLen;
    const rawTracks = [];
    const tempos = [[0, 500000]]; // [tick, microsegundos por negra] (por defecto 120 ppm)
    let totalNotes = 0;

    for (let ti = 0; ti < nTracks && pos + 8 <= u8.length; ti++) {
      if (tag(pos) !== 'MTrk') { const l = d.getUint32(pos + 4); pos += 8 + l; continue; }
      const len = d.getUint32(pos + 4);
      let p = pos + 8;
      const end = Math.min(u8.length, p + len);
      pos = p + len;
      let tick = 0, running = 0, name = '';
      const channels = new Set();
      const open = new Map();    // "canal:nota" → [tickInicio, velocidad, ...]
      const notes = [];          // [tickInicio, tickFin, nota, velocidad, canal]

      const vlq = () => { let v = 0, b, n = 0; do { if (p >= end) throw new Error('MIDI dañado'); b = u8[p++]; v = (v << 7) | (b & 0x7f); n++; } while ((b & 0x80) && n < 5); return v; };

      while (p < end) {
        tick += vlq();
        let st = u8[p];
        if (st === 0xff) { // meta
          const type = u8[p + 1]; p += 2;
          const l = vlq();
          if (type === 0x51 && l === 3) tempos.push([tick, (u8[p] << 16) | (u8[p + 1] << 8) | u8[p + 2]]);
          else if (type === 0x03 && !name) name = new TextDecoder('latin1').decode(u8.subarray(p, p + l)).replace(/[\u0000-\u001f]/g, '').trim();
          p += l;
          if (type === 0x2f) break;
          continue;
        }
        if (st === 0xf0 || st === 0xf7) { p += 1; const l = vlq(); p += l; continue; } // sysex
        if (st & 0x80) { running = st; p++; } else { st = running; if (!st) throw new Error('MIDI dañado'); }
        const kind = st & 0xf0, ch = st & 0x0f;
        if (kind === 0xc0 || kind === 0xd0) { p += 1; continue; }
        const a = u8[p], b2 = u8[p + 1]; p += 2;
        if (kind === 0x90 && b2 > 0) {
          const key = ch + ':' + a;
          if (!open.has(key)) open.set(key, []);
          open.get(key).push([tick, b2]);
          channels.add(ch);
        } else if (kind === 0x80 || kind === 0x90) {
          const arr = open.get(ch + ':' + a);
          if (arr && arr.length) {
            const [t0, vel] = arr.shift();
            if (tick > t0) { notes.push([t0, tick, a, vel, ch]); if (++totalNotes > MAX_NOTES) throw new Error('El MIDI tiene demasiadas notas'); }
          }
        }
      }
      // notas que no llegan a cerrarse: terminan al acabar la pista
      open.forEach((arr, key) => arr.forEach(([t0, vel]) => { if (tick > t0) notes.push([t0, tick, +key.split(':')[1], vel, +key.split(':')[0]]); }));
      rawTracks.push({ name, channels: [...channels].sort((x, y) => x - y), notes });
    }
    if (!rawTracks.length) throw new Error('El MIDI no contiene pistas');

    // mapa de tempos → conversión de ticks a segundos
    tempos.sort((x, y) => x[0] - y[0]);
    const seg = []; // [tickInicio, segundosInicio, µs por negra]
    let secs = 0, lastTick = 0, lastTempo = tempos[0][1];
    tempos.forEach(([t, us], i) => {
      if (i === 0 && t === 0) { seg.push([0, 0, us]); lastTempo = us; return; }
      secs += (t - lastTick) * lastTempo / 1e6 / ppq;
      seg.push([t, secs, us]); lastTick = t; lastTempo = us;
    });
    if (!seg.length || seg[0][0] !== 0) seg.unshift([0, 0, 500000]);
    const toSec = (tk) => {
      let s = seg[0];
      for (let i = seg.length - 1; i >= 0; i--) if (seg[i][0] <= tk) { s = seg[i]; break; }
      return s[1] + (tk - s[0]) * s[2] / 1e6 / ppq;
    };

    let duration = 0;
    const tracks = rawTracks.map((rt, i) => {
      const notes = rt.notes.map(([a, b, m, v, ch]) => ({ t: toSec(a), d: toSec(b) - toSec(a), m, v, ch }))
        .sort((x, y) => x.t - y.t);
      notes.forEach(n => { duration = Math.max(duration, n.t + n.d); });
      const drums = rt.channels.length > 0 && rt.channels.every(c => c === 9);
      const ms = notes.map(n => n.m);
      return { index: i, name: rt.name, channels: rt.channels, drums, count: notes.length, low: ms.length ? Math.min.apply(null, ms) : 0, high: ms.length ? Math.max.apply(null, ms) : 0, notes };
    }).filter(t => t.count > 0);
    if (!tracks.length) throw new Error('El MIDI no tiene notas');
    return { duration, tracks, ppq };
  }

  // Convierte las pistas elegidas y el fragmento [start, end) en notas para el timer:
  // [frecuencia, inicio, duración]. Los graves que un móvil no reproduce se suben de
  // octava, se limita cuántas notas suenan a la vez y cuántas hay en total, y se
  // ignora la percusión (un MIDI la lleva en el canal 10 y no tiene sonido de notas).
  function toTone(parsed, trackIdx, start, end) {
    const sel = new Set(trackIdx);
    const raw = [];
    parsed.tracks.forEach(t => {
      if (!sel.has(t.index) || t.drums) return;
      t.notes.forEach(n => {
        if (n.ch === 9) return;
        if (n.t < start - 1e-6 || n.t >= end) return;
        raw.push({ t: n.t - start, d: Math.min(n.d, end - n.t), m: n.m });
      });
    });
    raw.sort((a, b) => a.t - b.t || b.m - a.m);
    const out = [];
    const active = []; // finales de las notas que están sonando
    let dropped = 0, lastKey = '';
    raw.forEach(n => {
      while (active.length && active[0] <= n.t) active.shift();
      let f = 440 * Math.pow(2, (n.m - 69) / 12);
      while (f < 130) f *= 2;
      while (f > 2100) f /= 2;
      const dur = Math.max(0.09, Math.min(n.d, 1.5));
      const key = Math.round(f) + '@' + n.t.toFixed(2);
      if (key === lastKey) return;                      // la misma nota repetida en dos pistas
      if (active.length >= MAX_VOICES || out.length >= MAX_TONE_NOTES) { dropped++; return; }
      lastKey = key;
      out.push([Math.round(f * 100) / 100, Math.round(n.t * 1000) / 1000, Math.round(dur * 1000) / 1000]);
      active.push(n.t + dur); active.sort((a, b) => a - b);
    });
    return { notes: out, dropped, seconds: Math.max(0, end - start) };
  }

  window.RCMidi = { parse, toTone, MAX_LOOP_S, MAX_TONE_NOTES, MAX_VOICES };
})();
