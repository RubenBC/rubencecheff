/* ═══════════════════════════════════════
   RADIO EN DIRECTO  (v56)
   Ventana emergente con vinilo, que se puede minimizar a una burbuja
   movible visible en cualquier pestaña de la app.
   - MP3/AAC: el <audio> las reproduce de forma nativa.
   - M3U8 (HLS): se usa hls.js si el navegador no sabe reproducir HLS él solo.
   - Nombre de canción/grupo: no se intenta (la mayoría de emisoras no lo dan
     al navegador); siempre se muestra el nombre de la emisora + "En directo".
   Solo suena una emisora a la vez.
═══════════════════════════════════════ */
(function () {
  'use strict';

  // Emisoras de serie. Expuestas en window.RADIO_BUILTIN para que el panel
  // de Admin pueda listarlas y ofrecer borrarlas (tabla radio_hidden_builtin).
  const BUILTIN = [
    { id: 'ser',    name: 'Cadena SER',  desc: 'Actualidad y radio generalista', type: 'audio', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/CADENASER.mp3' },
    { id: 'los40',  name: 'LOS40',       desc: 'La radio musical más escuchada', type: 'audio', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/Los40.mp3' },
    { id: 'cope',   name: 'COPE',        desc: 'Actualidad, deportes y tertulia', type: 'audio', url: 'https://flucast09-h-cloud.flumotion.com/cope/net1.mp3' },
    { id: 'ondacero', name: 'Onda Cero', desc: 'Actualidad y radio generalista', type: 'hls',   url: 'https://atres-live.ondacero.es/live/ondaceroeventos1/master.m3u8' },
    { id: 'rne',    name: 'RNE · Radio Nacional', desc: 'Radiotelevisión Española', type: 'hls', url: 'https://rtvelivestream.rtve.es/rtvesec/rne/rne_r1_main.m3u8' },
    { id: 'dial',   name: 'Cadena Dial', desc: 'Música en español', type: 'audio', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/CADENADIAL.mp3' },
    { id: 'kiss',   name: 'Kiss FM',     desc: 'Éxitos y música pop', type: 'audio', url: 'https://kissfm.kissfmradio.cires21.com/kissfm.mp3' },
    { id: 'c100',   name: 'Cadena 100',  desc: 'Música variada, todos los públicos', type: 'hls', url: 'https://cadena100-cope.flumotion.com/chunks.m3u8' },
    { id: 'rockfm', name: 'Rock FM',     desc: 'Rock en español e internacional', type: 'hls', url: 'https://rockfm-cope.flumotion.com/playlist.m3u8' },
    { id: 'marca',  name: 'Radio Marca', desc: 'Deportes las 24 horas', type: 'audio', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIOMARCA_NACIONAL.mp3' },
    { id: 'los40urban', name: 'LOS40 Urban', desc: 'Hip hop, trap y urbana', type: 'audio', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_URBAN.mp3' },
  ];
  window.RADIO_BUILTIN = BUILTIN;

  function STATIONS_LIST() {
    const hidden = new Set(typeof hiddenBuiltinStations !== 'undefined' ? hiddenBuiltinStations : []);
    const builtin = BUILTIN.filter(s => !hidden.has(s.id));
    const custom = (typeof customStations !== 'undefined' ? customStations : []).map(s => ({
      id: 'custom_' + s.id, name: s.name, desc: 'Añadida por el admin', type: s.type || 'audio', url: s.url,
    }));
    return builtin.concat(custom);
  }

  let current = null;   // id de la emisora sonando/cargando, o null
  let status = 'idle';  // 'idle' | 'connecting' | 'playing' | 'error'
  let hls = null;
  let minimized = false; // ventana minimizada a burbuja

  const $ = id => document.getElementById(id);
  const audio = () => $('radioAudio');

  function stopHls() {
    if (hls) { try { hls.destroy(); } catch (e) {} hls = null; }
  }

  window.radioStop = function () {
    const a = audio();
    if (a) { try { a.pause(); } catch (e) {} a.removeAttribute('src'); try { a.load(); } catch (e) {} }
    stopHls();
    current = null;
    status = 'idle';
    renderRadio();
  };

  window.radioToggle = function (id) {
    if (current === id && status !== 'error') { radioStop(); return; }
    radioStop();
    const st = STATIONS_LIST().find(s => s.id === id);
    if (!st) return;
    current = id;
    status = 'connecting';
    renderRadio();

    const a = audio();
    a.onerror = () => { if (current === id) { status = 'error'; renderRadio(); } };
    a.onwaiting = () => { if (current === id && status === 'playing') { status = 'connecting'; renderRadio(); } };
    a.onplaying = () => { if (current === id) { status = 'playing'; renderRadio(); } };

    if (st.type === 'hls' && !a.canPlayType('application/vnd.apple.mpegurl')) {
      if (typeof Hls !== 'undefined' && Hls.isSupported()) {
        hls = new Hls();
        hls.on(Hls.Events.ERROR, (evt, data) => {
          if (data && data.fatal && current === id) { status = 'error'; renderRadio(); }
        });
        hls.loadSource(st.url);
        hls.attachMedia(a);
        a.play().catch(() => {});
      } else {
        status = 'error'; renderRadio(); // navegador sin soporte HLS y sin hls.js disponible
      }
    } else {
      a.src = st.url;
      a.play().catch(() => { if (current === id) { status = 'error'; renderRadio(); } });
    }
  };

  function statusText() {
    if (status === 'connecting') return 'Conectando…';
    if (status === 'playing') return 'En directo';
    if (status === 'error') return 'No se pudo conectar · toca para reintentar';
    return '';
  }

  function currentStation() { return current ? STATIONS_LIST().find(s => s.id === current) : null; }

  /* ───────── abrir / minimizar / cerrar la ventana ───────── */
  window.openRadioModal = function () {
    const m = $('radioModal');
    hideBubble();
    minimized = false;
    if (m.style.display !== 'flex') openModalNav('radioModal');
    render();
  };

  // Minimiza si la ventana está abierta; no hace nada si ya estaba cerrada o
  // ya minimizada. La llaman showPage() y openTimerModal() al cambiar de pestaña.
  window.radioMinimizeIfOpen = function () {
    const m = $('radioModal');
    if (m && m.style.display === 'flex') radioMinimize();
  };

  window.radioMinimize = function () {
    const m = $('radioModal');
    if (m) m.style.display = 'none';
    minimized = true;
    if (current) showBubble(); else hideBubble();
  };

  window.radioBubbleClick = function (e) {
    if (bubbleDragged) { bubbleDragged = false; return; } // fue un arrastre, no un toque
    minimized = false;
    hideBubble();
    openModalNav('radioModal');
    render();
  };

  window.radioBubbleStop = function (e) {
    e.stopPropagation();
    radioStop();
    hideBubble();
  };

  function showBubble() {
    const b = $('radioBubble');
    if (!b) return;
    b.style.display = 'flex';
    restoreBubblePosition();
    renderBubble();
  }
  function hideBubble() {
    const b = $('radioBubble');
    if (b) b.style.display = 'none';
  }

  /* ───────── arrastrar la burbuja por la pantalla ───────── */
  let bubbleDragged = false;
  (function setupBubbleDrag() {
    const b = document.getElementById('radioBubble');
    if (!b) return;
    let sx = 0, sy = 0, ox = 0, oy = 0, dragging = false;

    function clamp(x, y) {
      const margin = 8;
      const maxX = window.innerWidth - b.offsetWidth - margin;
      const maxY = window.innerHeight - b.offsetHeight - margin;
      return [Math.min(Math.max(x, margin), Math.max(margin, maxX)), Math.min(Math.max(y, margin), Math.max(margin, maxY))];
    }

    function onDown(e) {
      const p = e.touches ? e.touches[0] : e;
      dragging = true; bubbleDragged = false;
      sx = p.clientX; sy = p.clientY;
      const r = b.getBoundingClientRect();
      ox = r.left; oy = r.top;
      b.style.transition = 'none';
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    }
    function onMove(e) {
      if (!dragging) return;
      const p = e.touches ? e.touches[0] : e;
      const dx = p.clientX - sx, dy = p.clientY - sy;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) bubbleDragged = true;
      const [x, y] = clamp(ox + dx, oy + dy);
      b.style.left = x + 'px'; b.style.top = y + 'px';
      b.style.right = 'auto'; b.style.bottom = 'auto';
    }
    function onUp() {
      dragging = false;
      b.style.transition = '';
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      try {
        localStorage.setItem('rubencechef-radio-bubble-pos', JSON.stringify({ left: b.style.left, top: b.style.top }));
      } catch (e) {}
    }
    b.addEventListener('pointerdown', onDown);
  })();

  function restoreBubblePosition() {
    const b = $('radioBubble');
    if (!b) return;
    try {
      const saved = JSON.parse(localStorage.getItem('rubencechef-radio-bubble-pos'));
      if (saved && saved.left && saved.top) {
        b.style.left = saved.left; b.style.top = saved.top;
        b.style.right = 'auto'; b.style.bottom = 'auto';
        return;
      }
    } catch (e) {}
    // posición por defecto: esquina inferior derecha, encima del menú
    b.style.left = 'auto'; b.style.top = 'auto';
    b.style.right = '14px'; b.style.bottom = 'calc(84px + env(safe-area-inset-bottom))';
  }

  /* ───────── pintado ───────── */
  function renderBubble() {
    const v = $('radioBubbleVinyl');
    if (!v) return;
    v.classList.toggle('spinning', status === 'playing');
    v.classList.toggle('connecting', status === 'connecting');
    v.classList.toggle('error', status === 'error');
  }

  window.renderRadio = function () {
    render();
  };

  function render() {
    const list = $('radioList');
    if (!list) return;
    const st = currentStation();

    list.innerHTML = STATIONS_LIST().map(s => {
      const active = current === s.id;
      const cls = active ? (status === 'error' ? 'radio-card error' : 'radio-card active') : 'radio-card';
      return `<button class="${cls}" onclick="radioToggle('${s.id}')">
        <span class="material-symbols-outlined radio-card-icon">${active ? (status === 'playing' ? 'graphic_eq' : status === 'error' ? 'error' : 'more_horiz') : 'radio'}</span>
        <div class="radio-card-text">
          <div class="radio-card-name">${s.name}</div>
          <div class="radio-card-desc">${active ? statusText() : s.desc}</div>
        </div>
      </button>`;
    }).join('');

    // vinilo, aguja y "ahora suena"
    const vinyl = $('radioVinyl'), arm = $('radioTonearm'), icon = $('radioVinylIcon');
    const playingLike = status === 'playing' || status === 'connecting';
    if (vinyl) vinyl.classList.toggle('spinning', status === 'playing');
    if (arm) arm.classList.toggle('down', playingLike);
    if (icon) icon.textContent = status === 'error' ? 'error' : 'radio';

    const nameEl = $('radioNpName'), subEl = $('radioNpSub');
    if (nameEl && subEl) {
      if (!st) {
        nameEl.textContent = 'Elige una emisora';
        subEl.innerHTML = '&nbsp;';
      } else {
        nameEl.textContent = st.name;
        subEl.textContent = statusText();
        subEl.classList.toggle('error', status === 'error');
      }
    }

    // burbuja (si está minimizada y hay algo sonando/cargando)
    if (minimized && current) { showBubble(); } else if (minimized && !current) { hideBubble(); }
    renderBubble();

    // icono del menú inferior: puntito si suena algo aunque la ventana esté minimizada
    const nav = $('nav-radio');
    if (nav) nav.classList.toggle('radio-active', !!current);
  }

  document.addEventListener('DOMContentLoaded', render);
})();
