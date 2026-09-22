/* ═══════════════════════════════════════
   RADIO EN DIRECTO  (v54)
   Emisoras españolas por streaming (URLs oficiales de cada cadena).
   - MP3/AAC: el <audio> las reproduce de forma nativa.
   - M3U8 (HLS): se usa hls.js si el navegador no sabe reproducir HLS él solo
     (Safari sí puede, Chrome/Firefox/Android necesitan la librería).
   Solo suena una emisora a la vez.
═══════════════════════════════════════ */
(function () {
  'use strict';

  // type: 'audio' (mp3/aac directo) | 'hls' (m3u8, necesita hls.js)
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

  // De serie + las que haya añadido el admin (variable global de app.js, tabla radio_stations)
  function STATIONS_LIST() {
    const custom = (typeof customStations !== 'undefined' ? customStations : []).map(s => ({
      id: 'custom_' + s.id, name: s.name, desc: 'Añadida por el admin', type: s.type || 'audio', url: s.url,
    }));
    return BUILTIN.concat(custom);
  }

  let current = null;   // id de la emisora sonando o cargando
  let status = 'idle';  // 'idle' | 'connecting' | 'playing' | 'error'
  let hls = null;

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

  window.renderRadio = function () {
    const list = $('radioList');
    if (!list) return;
    list.innerHTML = STATIONS_LIST().map(st => {
      const active = current === st.id;
      const cls = active ? (status === 'error' ? 'radio-card error' : 'radio-card active') : 'radio-card';
      const icon = active && status === 'connecting' ? 'progress_activity'
                 : active && status === 'playing' ? 'pause_circle'
                 : active && status === 'error' ? 'error'
                 : 'play_circle';
      return `<button class="${cls}" onclick="radioToggle('${st.id}')">
        <span class="material-symbols-outlined radio-card-icon${active && status === 'connecting' ? ' spin' : ''}">${icon}</span>
        <div class="radio-card-text">
          <div class="radio-card-name">${st.name}</div>
          <div class="radio-card-desc">${active ? statusText() : st.desc}</div>
        </div>
      </button>`;
    }).join('');

    const bar = $('radioBar');
    if (current) {
      const st = STATIONS_LIST().find(s => s.id === current);
      bar.style.display = '';
      $('radioBarName').textContent = st ? st.name : '';
      $('radioBarStatus').textContent = statusText();
      bar.classList.toggle('error', status === 'error');
    } else {
      bar.style.display = 'none';
    }
  };
})();
