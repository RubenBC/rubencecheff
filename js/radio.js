/* ═══════════════════════════════════════
   RADIO EN DIRECTO  (v63)
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

  // Grupos (en este orden). 'short' es el texto de los filtros de arriba.
  const GROUPS = [
    { key: 'es',      name: 'España',                           short: 'España' },
    { key: 'amb',     name: 'Electrónica / ambient',            short: 'Ambient' },
    { key: 'house',   name: 'House / dance / IDM',              short: 'House / Dance' },
    { key: 'rock',    name: 'Rock / indie / metal',             short: 'Rock / Metal' },
    { key: 'soul',    name: 'Soul / funk / R&B',                short: 'Soul / Funk' },
    { key: 'jazz',    name: 'Jazz',                             short: 'Jazz' },
    { key: 'latin',   name: 'Brasileña / latina',               short: 'Brasil / Latina' },
    { key: 'reggae',  name: 'Reggae',                           short: 'Reggae' },
    { key: 'country', name: 'Country / americana',              short: 'Country' },
    { key: 'folk',    name: 'Celta / folk',                     short: 'Celta / Folk' },
    { key: 'lounge',  name: 'Lounge / vintage / bandas sonoras', short: 'Lounge' },
    { key: 'custom',  name: 'Otras emisoras',                   short: 'Otras' },
  ];

  // Emisoras de serie. Expuestas en window.RADIO_BUILTIN para que el panel
  // de Admin pueda listarlas y ofrecer borrarlas (tabla radio_hidden_builtin).
  // Los id llevan prefijo (es_/soma_) para que no hereden borrados de la lista anterior.
  // Los enlaces http:// de la lista original van en https:// (http no suena en la app).
  const E = (id, name, desc, url) => ({ id: 'es_' + id, group: 'es', flag: '🇪🇸', name, desc, type: 'audio', url });
  const SOMA = (group, id, name, desc) => ({ id: 'soma_' + id, group, flag: '🇺🇸', name, desc, type: 'audio', url: 'https://ice5.somafm.com/' + id + '-128-mp3' });
  const BUILTIN = [
    E('los40',        'LOS40',         'Pop, hits actuales y clásicos',                    'https://playerservices.streamtheworld.com/api/livestream-redirect/Los40.mp3'),
    E('los40classic', 'LOS40 Classic', 'Rock y pop clásicos',                              'https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_CLASSIC.mp3'),
    E('los40urban',   'LOS40 Urban',   'Reggaetón, trap, hip-hop y música urbana',          'https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_URBAN.mp3'),
    E('los40dance',   'LOS40 Dance',   'Dance, house y electrónica comercial',              'https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_DANCE.mp3'),
    E('kissfm',       'KISS FM',       'Pop/rock de los 80, 90 y 2000',                     'https://kissfm.kissfmradio.cires21.com/kissfm.mp3'),
    E('dial',         'Cadena Dial',   'Pop español',                                       'https://playerservices.streamtheworld.com/api/livestream-redirect/CADENADIAL.mp3'),
    E('cadena100',    'Cadena 100',    'Pop-rock y éxitos',                                 'https://cadena100-streamers-mp3.flumotion.com/cope/cadena100.mp3'),
    E('rockfm',       'Rock FM',       'Rock clásico',                                      'https://flucast26-h-cloud.flumotion.com/cope/rockfm-low.mp3'),
    E('radiole',      'Radiolé',       'Música española, copla, flamenco y rumba',          'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIOLE.mp3'),

    SOMA('amb', 'groovesalad',  'Groove Salad',         'Ambient, downtempo, chill electrónico'),
    SOMA('amb', 'gsclassic',    'Groove Salad Classic', 'Downtempo/electrónica estilo años 2000'),
    SOMA('amb', 'dronezone',    'Drone Zone',           'Ambient atmosférico y minimalista'),
    SOMA('amb', 'deepspaceone', 'Deep Space One',       'Ambient electrónico, experimental y espacial'),
    SOMA('amb', 'spacestation', 'Space Station Soma',   'Electrónica espacial y mid-tempo'),
    SOMA('amb', 'synphaera',    'Synphaera Radio',      'Ambient electrónico y música espacial'),
    SOMA('amb', 'darkzone',     'The Dark Zone',        'Ambient oscuro y experimental'),

    SOMA('house', 'beatblender', 'Beat Blender',   'Deep house y downtempo'),
    SOMA('house', 'thetrip',     'The Trip',       'Progressive house y trance'),
    SOMA('house', 'cliqhop',     'cliqhop idm',    'IDM, glitch y electrónica experimental'),
    SOMA('house', 'fluid',       'Fluid',          'Hip-hop instrumental, future soul y electrónica'),
    SOMA('house', 'poptron',     'PopTron',        'Electropop e indie dance'),
    SOMA('house', 'u80s',        'Underground 80s','Synthpop y New Wave británico de los 80'),

    SOMA('rock', 'indiepop',  'Indie Pop Rocks!', 'Indie pop y rock alternativo'),
    SOMA('rock', 'metal',     'Metal Detector',   'Black, doom, thrash, sludge, prog, stoner, punk e industrial'),
    SOMA('rock', 'digitalis', 'Digitalis',        'Rock con electrónica y procesamiento digital'),
    SOMA('rock', 'seventies', 'Left Coast 70s',   'Rock de álbum de los años 70'),

    SOMA('soul', '7soul',   'Seven Inch Soul', 'Soul clásico en vinilo de 45 RPM'),
    SOMA('soul', 'insound', 'The In-Sound',    'Pop europeo, psicodelia y sonidos groovy de los 60–70'),

    SOMA('jazz', 'sonicuniverse', 'Sonic Universe', 'Jazz contemporáneo, avant-garde y fusiones'),

    SOMA('latin', 'bossa',        'Bossa Beyond',    'Bossa nova, samba y ritmos brasileños'),
    SOMA('latin', 'suburbsofgoa', 'Suburbs of Goa',  'Electrónica con influencias asiáticas/indias'),

    SOMA('reggae',  'reggae',     'Heavyweight Reggae', 'Reggae, ska y rocksteady'),
    SOMA('country', 'bootliquor', 'Boot Liquor',        'Americana, country y roots'),
    SOMA('folk',    'thistle',    'ThistleRadio',       'Música celta y folk de raíces británicas'),

    SOMA('lounge', 'secretagent', 'Secret Agent',          'Lounge, jazz, funk y música con aire de película de espías'),
    SOMA('lounge', 'illstreet',   'Illinois Street Lounge', 'Exotica, lounge y sonidos vintage'),
    SOMA('lounge', 'tikitime',    'Tiki Time',              'Música tiki y ritmos tropicales vintage'),
  ];
  window.RADIO_BUILTIN = BUILTIN;
  window.RADIO_GROUPS  = GROUPS;

  function STATIONS_LIST() {
    const hidden = new Set(typeof hiddenBuiltinStations !== 'undefined' ? hiddenBuiltinStations : []);
    const builtin = BUILTIN.filter(s => !hidden.has(s.id));
    const custom = (typeof customStations !== 'undefined' ? customStations : []).map(s => ({
      id: 'custom_' + s.id, group: 'custom', flag: '📻', name: s.name, desc: 'Añadida por el admin', type: s.type || 'audio', url: s.url,
    }));
    return builtin.concat(custom);
  }

  // ───────── Favoritas (en este dispositivo) ─────────
  const LS_FAVS = 'rubencechef-radio-favs';
  let favs = [];
  try { favs = JSON.parse(localStorage.getItem(LS_FAVS)) || []; } catch (e) { favs = []; }
  const isFav = id => favs.includes(id);
  window.radioToggleFav = function (id, e) {
    if (e) e.stopPropagation();
    favs = isFav(id) ? favs.filter(x => x !== id) : favs.concat(id);
    try { localStorage.setItem(LS_FAVS, JSON.stringify(favs)); } catch (err) {}
    if (filter === 'fav' && !favs.length) filter = 'all';
    render();
  };
  window.radioToggleFavCurrent = function () { if (current) radioToggleFav(current); };

  let filter = 'all'; // 'all' | 'fav' | clave de grupo
  window.radioSetFilter = function (f) {
    filter = f;
    render();
    const list = document.getElementById('radioList');
    if (list) list.scrollTop = 0;
  };

  let current = null;   // id de la emisora sonando/cargando, o null
  let status = 'idle';  // 'idle' | 'connecting' | 'playing' | 'paused' | 'error'
  let hls = null;
  let minimized = false; // ventana minimizada a burbuja
  let pausedAt = 0;      // cuándo se pausó (para volver al directo si la pausa fue larga)
  let alarmPaused = false; // la pausó una alarma/timer: se reanuda sola al detenerla
  const LIVE_RESYNC_MS = 20000;

  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const audio = () => $('radioAudio');

  function stopHls() {
    if (hls) { try { hls.destroy(); } catch (e) {} hls = null; }
  }

  window.radioPlayPause = function () {
    if (!current) return;
    alarmPaused = false;
    if (status === 'error') { radioToggle(current); return; } // reintentar desde cero
    const a = audio();
    if (status === 'playing' || status === 'connecting') {
      try { a.pause(); } catch (e) {}
      status = 'paused';
      pausedAt = Date.now();
      render();
    } else if (status === 'paused') {
      // Es radio en directo: si la pausa fue larga, reanudar el búfer daría
      // audio atrasado (o la conexión ya se habría cortado). Mejor reconectar.
      if (Date.now() - pausedAt > LIVE_RESYNC_MS) { const id = current; radioStop(); radioToggle(id); return; }
      status = 'connecting';
      render();
      a.play().catch(() => { status = 'error'; render(); });
    }
  };

  window.radioBubblePlayPause = function (e) {
    e.stopPropagation();
    if (bubbleDragged) { bubbleDragged = false; return; } // era un arrastre agarrando el botón
    radioPlayPause();
  };

  // Cuando suena un timer o alarma, la radio se pausa para que se oiga bien
  // la melodía, y se reanuda sola al pulsar Detener (reconecta al directo si
  // la alarma ha sonado un buen rato). Si ya estaba en pausa o parada, no se toca.
  window.radioAlarmStart = function () {
    if (!current || !(status === 'playing' || status === 'connecting')) return;
    try { audio().pause(); } catch (e) {}
    status = 'paused';
    pausedAt = Date.now();
    alarmPaused = true;
    render();
  };
  window.radioAlarmEnd = function () {
    const resume = alarmPaused && current && status === 'paused';
    alarmPaused = false;
    if (resume) radioPlayPause(); else render();
  };

  window.radioStop = function () {
    alarmPaused = false;
    const a = audio();
    if (a) { try { a.pause(); } catch (e) {} a.removeAttribute('src'); try { a.load(); } catch (e) {} }
    stopHls();
    current = null;
    status = 'idle';
    renderRadio();
  };

  window.radioToggle = function (id) {
    if (current === id && status === 'paused') { radioPlayPause(); return; }
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
    // Solo cuenta como pausa si estaba sonando (p. ej. el sistema cortó el audio).
    // El 'pause' del stop de la emisora anterior llega tarde y no debe marcar "En pausa".
    a.onpause = () => { if (current === id && status === 'playing') { status = 'paused'; pausedAt = Date.now(); renderRadio(); } };

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
    if (status === 'paused' && alarmPaused) return 'En pausa · está sonando una alarma';
    if (status === 'paused') return 'En pausa';
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
    if (m && m.style.display === 'flex') radioMinimize({ keepHistory: true });
  };

  // opts.fromBack: el "atrás" ya consumió su entrada del historial.
  // opts.keepHistory: se minimiza porque se navega a otra parte; la siguiente
  //   navegación sustituye esa entrada (ver envoltorio de pushState en app.js).
  // Sin opciones (botón minimizar / tocar fuera): se retira su entrada.
  window.radioMinimize = function (opts) {
    opts = (opts && typeof opts === 'object' && !(opts instanceof Event)) ? opts : {};
    const m = $('radioModal');
    const wasOpen = m && m.style.display === 'flex';
    if (m) { m.style.display = 'none'; delete m.dataset.nav; }
    minimized = true;
    if (current) showBubble(); else hideBubble();
    if (wasOpen && !opts.fromBack && !opts.keepHistory && typeof popOwnModalEntry === 'function') popOwnModalEntry('radioModal');
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
    if (bubbleDragged) { bubbleDragged = false; return; } // era un arrastre agarrando el botón
    radioStop();
    hideBubble();
  };

  function showBubble() {
    const b = $('radioBubble');
    if (!b) return;
    if (b.style.display !== 'flex') {
      b.style.display = 'flex';
      restoreBubblePosition();
    }
    renderBubble();
  }
  function hideBubble() {
    const b = $('radioBubble');
    if (b) b.style.display = 'none';
  }

  // Mantiene la burbuja siempre dentro de la pantalla visible. Se usa al
  // restaurar su posición, al arrastrarla y al cambiar el tamaño/orientación
  // de la pantalla (si no, una posición guardada en horizontal podía quedar
  // fuera de la pantalla al volver a vertical, y la burbuja "desaparecía").
  function clampBubbleXY(x, y) {
    const b = $('radioBubble');
    const margin = 10;
    const maxX = window.innerWidth - b.offsetWidth - margin;
    const maxY = window.innerHeight - b.offsetHeight - margin;
    return [Math.min(Math.max(x, margin), Math.max(margin, maxX)), Math.min(Math.max(y, margin), Math.max(margin, maxY))];
  }

  function reclampBubble() {
    const b = $('radioBubble');
    if (!b || b.style.display !== 'flex' || b.style.left === 'auto' || !b.style.left) return;
    const [x, y] = clampBubbleXY(parseFloat(b.style.left), parseFloat(b.style.top));
    b.style.left = x + 'px'; b.style.top = y + 'px';
  }
  window.addEventListener('resize', reclampBubble);
  window.addEventListener('orientationchange', () => setTimeout(reclampBubble, 200));

  /* ───────── arrastrar la burbuja por la pantalla ───────── */
  let bubbleDragged = false;
  (function setupBubbleDrag() {
    const b = document.getElementById('radioBubble');
    if (!b) return;
    let sx = 0, sy = 0, ox = 0, oy = 0, dragging = false;

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
      const [x, y] = clampBubbleXY(ox + dx, oy + dy);
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
      const lx = saved && parseFloat(saved.left), ly = saved && parseFloat(saved.top);
      if (saved && Number.isFinite(lx) && Number.isFinite(ly)) {
        b.style.left = lx + 'px'; b.style.top = ly + 'px';
        b.style.right = 'auto'; b.style.bottom = 'auto';
        // el tamaño real solo se conoce una vez pintada (display:flex ya
        // aplicado antes de llamar aquí); reclamplamos en el siguiente frame
        requestAnimationFrame(reclampBubble);
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
    const st = currentStation();
    const nameEl = $('radioBubbleName');
    if (nameEl) nameEl.textContent = st ? st.name : '';
    const icon = $('radioBubblePlayIcon');
    if (icon) icon.textContent = (status === 'playing' || status === 'connecting') ? 'pause' : (status === 'error' ? 'refresh' : 'play_arrow');
  }

  window.renderRadio = function () {
    render();
  };

  function render() {
    const list = $('radioList');
    if (!list) return;
    const st = currentStation();
    if (current && !st) { radioStop(); return; } // la emisora que sonaba se ha borrado

    const all = STATIONS_LIST();

    // Filtros (chips): Todas · Favoritas · un chip por grupo que tenga emisoras
    const chipsEl = $('radioChips');
    const favList = all.filter(x => isFav(x.id));
    if (filter === 'fav' && !favList.length) filter = 'all';
    if (filter !== 'all' && filter !== 'fav' && !all.some(x => x.group === filter)) filter = 'all';
    if (chipsEl) {
      const chip = (key, label) => `<button class="radio-chip${filter === key ? ' active' : ''}" onclick="radioSetFilter('${key}')">${label}</button>`;
      chipsEl.innerHTML = chip('all', 'Todas')
        + (favList.length ? chip('fav', '<span class="material-symbols-outlined radio-chip-star">star</span> Favoritas') : '')
        + GROUPS.filter(g => all.some(x => x.group === g.key)).map(g => chip(g.key, esc(g.short))).join('');
      const act = chipsEl.querySelector('.radio-chip.active');
      if (act && act.scrollIntoView && chipsEl.dataset.last !== filter) { act.scrollIntoView({ block: 'nearest', inline: 'center' }); chipsEl.dataset.last = filter; }
    }

    const card = s => {
      const active = current === s.id;
      const cls = 'radio-card' + (active ? (status === 'error' ? ' error' : ' active') : '');
      let badge;
      if (!active) badge = `<span class="radio-card-flag">${s.flag || '📻'}</span>`;
      else if (status === 'playing') badge = '<span class="radio-eq"><i></i><i></i><i></i></span>';
      else if (status === 'connecting') badge = '<span class="material-symbols-outlined spin">progress_activity</span>';
      else if (status === 'paused') badge = '<span class="material-symbols-outlined">pause</span>';
      else badge = '<span class="material-symbols-outlined">error</span>';
      const fav = isFav(s.id);
      return `<div class="${cls}" role="button" tabindex="0" data-id="${esc(s.id)}" onclick="radioToggle(this.dataset.id)">
        <div class="radio-card-badge">${badge}</div>
        <div class="radio-card-text">
          <div class="radio-card-name">${esc(s.name)}</div>
          <div class="radio-card-desc">${esc(active && status !== 'playing' ? statusText() : s.desc)}</div>
        </div>
        <button class="radio-fav-btn${fav ? ' on' : ''}" data-id="${esc(s.id)}" onclick="radioToggleFav(this.dataset.id, event)" aria-label="${fav ? 'Quitar de favoritas' : 'Añadir a favoritas'}">
          <span class="material-symbols-outlined">star</span>
        </button>
      </div>`;
    };
    const section = (title, items, icon) => items.length
      ? `<div class="radio-section">${icon ? `<span class="material-symbols-outlined">${icon}</span>` : ''}${esc(title)}<span class="radio-section-count">${items.length}</span></div>` + items.map(card).join('')
      : '';

    let html = '';
    if (filter === 'all') {
      // Favoritas arriba; el resto por grupos (sin repetir las favoritas)
      html += section('Favoritas', favList, 'star');
      GROUPS.forEach(g => { html += section(g.name, all.filter(x => x.group === g.key && !isFav(x.id))); });
    } else if (filter === 'fav') {
      html += section('Favoritas', favList, 'star');
    } else {
      const g = GROUPS.find(x => x.key === filter);
      const items = all.filter(x => x.group === filter);
      html += section(g ? g.name : '', items.filter(x => isFav(x.id)).concat(items.filter(x => !isFav(x.id))));
    }
    list.innerHTML = html || '<div class="radio-empty">No hay emisoras.</div>';

    // vinilo, aguja y "ahora suena"
    const vinyl = $('radioVinyl'), arm = $('radioTonearm'), icon = $('radioVinylIcon');
    const playingLike = status === 'playing' || status === 'connecting';
    if (vinyl) vinyl.classList.toggle('spinning', status === 'playing');
    if (arm) arm.classList.toggle('down', playingLike);
    if (icon) icon.textContent = status === 'error' ? 'error' : 'radio';

    const nameEl = $('radioNpName'), subEl = $('radioNpSub'), descEl = $('radioNpDesc');
    if (nameEl && subEl) {
      subEl.classList.remove('error', 'live');
      if (!st) {
        nameEl.textContent = 'Elige una emisora';
        subEl.textContent = 'Toca una de la lista para escucharla';
        if (descEl) descEl.textContent = '';
      } else {
        nameEl.textContent = st.name;
        subEl.textContent = statusText();
        if (status === 'playing') subEl.classList.add('live');
        if (status === 'error') subEl.classList.add('error');
        if (descEl) descEl.textContent = st.desc || '';
      }
    }

    // controles de reproducción
    const playBtn = $('radioPlayPauseBtn'), playIcon = $('radioPlayPauseIcon'), stopBtn = $('radioStopBtn'), favBtn = $('radioFavBtn');
    if (playBtn && playIcon && stopBtn) {
      playBtn.disabled = !current;
      stopBtn.disabled = !current;
      playIcon.textContent = (status === 'playing' || status === 'connecting') ? 'pause' : (status === 'error' ? 'refresh' : 'play_arrow');
      playBtn.setAttribute('aria-label', status === 'playing' || status === 'connecting' ? 'Pausar' : 'Reproducir');
    }
    if (favBtn) {
      favBtn.disabled = !current;
      favBtn.classList.toggle('on', !!current && isFav(current));
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
