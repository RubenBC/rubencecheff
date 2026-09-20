/* ═══════════════════════════════════════
   TEMPORIZADORES Y ALARMAS  (v48)
   - Puedes tener VARIOS a la vez (timers y alarmas mezclados)
   - Timer: 5 · 7 · 9 · 12 min o tiempo manual, con nombre opcional
   - Alarma a una hora concreta, con nombre opcional
   - Al terminar suena una melodía fuerte en bucle hasta pulsar "Detener"
   - Puntualidad con la pestaña en segundo plano (PC): conteo en Web Worker
     y melodía programada por adelantado en el reloj de audio
   - Solo Android: opción "Reloj" → avisa también en la app Reloj del móvil
   - Usa la hora real (Date.now) y se guarda en localStorage
═══════════════════════════════════════ */
(function () {
  'use strict';

  const LS_KEY = 'rubencechef-timer';
  const LS_CLOCK = 'rubencechef-timer-clock';
  const LOOP_MS = 3400;              // duración de un ciclo de la melodía
  const LOOP_S = LOOP_MS / 1000;
  const PRE_MS = 30 * 60000;         // programa la melodía cuando faltan ≤ 30 min
  const IS_ANDROID = /Android/i.test(navigator.userAgent);
  const $ = id => document.getElementById(id);

  let tab = 'timer';                 // 'timer' | 'alarm' | 'list'
  let runs = [];                     // [{ id, type, endAt, totalMs, pausedLeft, label, name, clock, ringing }]
  let tickId = null, worker = null, vibId = null, lastPre = 0;
  let audioCtx = null, master = null, sched = null, wakeLock = null;
  let baseTitle = document.title;

  /* ───────── utilidades ───────── */
  function pad(n) { return String(n).padStart(2, '0'); }
  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  function fmtClock(ms) {
    const t = Math.max(0, Math.ceil(ms / 1000));
    const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  }
  function fmtLeftHuman(ms) {
    const mins = Math.max(1, Math.ceil(ms / 60000));
    const h = Math.floor(mins / 60), m = mins % 60;
    return h > 0 ? `${h} h ${m} min` : `${m} min`;
  }
  function fmtHM(ts) { const d = new Date(ts); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; }

  // "5" · "3,5" · "1:30" (mm:ss) → milisegundos, o NaN
  function parseToMs(str) {
    let s = String(str || '').trim().replace(',', '.');
    if (!s) return NaN;
    if (s.includes(':')) {
      const [a, b] = s.split(':');
      const m = parseInt(a, 10), sec = parseInt(b, 10);
      if (isNaN(m) || isNaN(sec) || sec < 0 || sec > 59) return NaN;
      return (m * 60 + sec) * 1000;
    }
    const v = parseFloat(s);
    return isNaN(v) ? NaN : Math.round(v * 60000);
  }

  function save() {
    try {
      if (runs.length) localStorage.setItem(LS_KEY, JSON.stringify(runs.map(r => Object.assign({}, r, { ringing: false }))));
      else localStorage.removeItem(LS_KEY);
    } catch (e) {}
  }

  function clockEnabled() {
    try { return IS_ANDROID && localStorage.getItem(LS_CLOCK) === '1'; } catch (e) { return false; }
  }

  const anyRinging = () => runs.some(r => r.ringing);
  const firstRinging = () => runs.find(r => r.ringing) || null;
  const nextRun = () => runs.filter(r => r.pausedLeft == null && !r.ringing).sort((a, b) => a.endAt - b.endAt)[0] || null;
  const findRun = id => runs.find(r => r.id === id) || null;

  /* ───────── audio ───────── */
  function ensureAudio() {
    try {
      if (!audioCtx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        audioCtx = new AC();
        // compresor para poder subir el volumen sin que sature
        const comp = audioCtx.createDynamicsCompressor();
        comp.threshold.value = -18; comp.ratio.value = 6;
        master = audioCtx.createGain();
        master.gain.value = 1.0;
        master.connect(comp); comp.connect(audioCtx.destination);
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch (e) {}
    return audioCtx;
  }

  function beep(freq, t, dur) {
    const ctx = audioCtx;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.9, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    g.connect(sched.bus);
    [['square', 0.45], ['triangle', 1.0]].forEach(([type, vol]) => {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = type; o.frequency.value = freq; og.gain.value = vol;
      o.connect(og); og.connect(g);
      o.start(t); o.stop(t + dur + 0.02);
      sched.oscs.push({ o, end: t + dur + 0.02 });
    });
  }

  // Un ciclo: arpegio ascendente y descendente, dos veces, con acento final
  const NOTES = [880, 1108.7, 1318.5, 1760, 1318.5, 1108.7, 880];
  function scheduleLoop(t0) {
    const step = 0.16, repLen = NOTES.length * step + 0.25;
    for (let rep = 0; rep < 2; rep++) {
      NOTES.forEach((f, i) => beep(f, t0 + rep * repLen + i * step, 0.15));
    }
    beep(1760, t0 + 2 * repLen, 0.5);
  }

  // Programa ciclos en el reloj de audio a partir de 'base' (segundos del AudioContext)
  function scheduleFrom(base, minLoops, forEnd) {
    cancelScheduled();
    const bus = audioCtx.createGain();
    bus.connect(master);
    sched = { bus, oscs: [], base, n: 0, min: minLoops, forEnd: forEnd || 0 };
    topUp();
  }

  // Mantiene programados ≥ 60 s de melodía por delante (y los primeros 'min' ciclos)
  function topUp() {
    if (!sched || !audioCtx) return;
    const now = audioCtx.currentTime, horizon = now + 60;
    while ((sched.n < sched.min || sched.base + sched.n * LOOP_S < horizon) && sched.n < 5000) {
      scheduleLoop(sched.base + sched.n * LOOP_S);
      sched.n++;
    }
    sched.oscs = sched.oscs.filter(x => x.end > now - 1); // limpia los ya terminados
  }

  function cancelScheduled() {
    if (!sched) return;
    try { sched.bus.disconnect(); } catch (e) {}
    sched.oscs.forEach(x => { try { x.o.stop(); } catch (e) {} });
    sched = null;
  }

  // Deja la melodía lista para que suene EXACTAMENTE cuando termine el próximo timer/alarma,
  // aunque la pestaña esté dormida. Solo hay una melodía programada: la del más cercano.
  function refreshSched() {
    if (anyRinging()) return;                       // ya hay melodía sonando
    const n = nextRun();
    if (!n) { cancelScheduled(); return; }
    if (sched && sched.forEnd === n.endAt) return;  // ya está programada para este
    cancelScheduled();
    const ctx = ensureAudio();
    if (!ctx) return;
    const doIt = () => {
      if (sched || anyRinging() || audioCtx.state !== 'running') return;
      const nx = nextRun();
      if (!nx) return;
      const left = nx.endAt - Date.now();
      if (left <= 0 || left > PRE_MS) return;
      scheduleFrom(audioCtx.currentTime + left / 1000, 10, nx.endAt);
    };
    if (ctx.state === 'running') doIt();
    else ctx.resume().then(doIt).catch(() => {});
  }

  function vibrate() { if (navigator.vibrate) { try { navigator.vibrate([500, 200, 500, 200, 500]); } catch (e) {} } }

  function startMelody() {
    vibrate();
    if (!vibId) vibId = setInterval(vibrate, LOOP_MS);
    const ctx = ensureAudio();
    const go = () => {
      if (!anyRinging() || !audioCtx || audioCtx.state !== 'running') return false;
      if (!sched) scheduleFrom(audioCtx.currentTime + 0.05, 1, 0);
      topUp();
      return true;
    };
    if (go()) return;
    // El navegador bloquea el audio (no hubo toque previo): descarta lo programado y arranca en el primer toque
    cancelScheduled();
    const unlock = () => { ensureAudio(); setTimeout(go, 60); };
    ['pointerdown', 'touchstart', 'keydown'].forEach(ev =>
      document.addEventListener(ev, unlock, { once: true, passive: true }));
    if (ctx) ctx.resume().then(go).catch(() => {});
  }

  function stopMelody() {
    cancelScheduled();
    if (vibId) { clearInterval(vibId); vibId = null; }
    if (navigator.vibrate) { try { navigator.vibrate(0); } catch (e) {} }
  }

  /* ───────── pantalla encendida mientras corre ───────── */
  async function acquireWakeLock() {
    try {
      if ('wakeLock' in navigator && !wakeLock) {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => { wakeLock = null; });
      }
    } catch (e) {}
  }
  function releaseWakeLock() {
    try { if (wakeLock) wakeLock.release(); } catch (e) {}
    wakeLock = null;
  }

  /* ───────── motor: el conteo lo lleva un Web Worker ───────── */
  function startTick() {
    stopTick();
    try {
      if (!worker) {
        const src = 'let id=null;onmessage=e=>{clearInterval(id);id=null;if(e.data==="start")id=setInterval(()=>postMessage(0),250)}';
        worker = new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' })));
        worker.onmessage = tick;
      }
      worker.postMessage('start');
    } catch (e) {
      worker = null;
      tickId = setInterval(tick, 250); // sin Worker: temporizador normal
    }
    tick();
  }
  function stopTick() {
    if (worker) worker.postMessage('stop');
    if (tickId) { clearInterval(tickId); tickId = null; }
  }

  function tick() {
    if (!runs.length) return;
    const now = Date.now();
    runs.slice().forEach(r => {
      if (!r.ringing && r.pausedLeft == null && r.endAt <= now) ring(r);
    });
    if (anyRinging()) topUp();
    else if (now - lastPre > 5000) { lastPre = now; refreshSched(); }
    updateTimes(now);
  }

  function begin() {
    ensureAudio();
    acquireWakeLock();
    save();
    startTick();
    refreshSched();
    render();
  }

  function ring(r) {
    r.ringing = true;
    updateTitle();
    startMelody();
    acquireWakeLock();
    openTimerModal();
    render();
  }

  function updateTitle() {
    const r = firstRinging();
    document.title = r ? '⏰ ¡Tiempo!' + (r.name ? ' ' + r.name : '') + ' — ' + baseTitle : baseTitle;
  }

  // Quita un timer/alarma (cancelar o detener cuando suena)
  function removeRun(id) {
    const r = findRun(id);
    if (!r) return null;
    const wasRinging = r.ringing;
    runs = runs.filter(x => x.id !== id);
    if (!anyRinging()) stopMelody();
    if (wasRinging && !anyRinging()) tab = runs.length ? 'list' : 'timer';
    updateTitle();
    save();
    if (!runs.length) { stopTick(); releaseWakeLock(); }
    refreshSched();
    render();
    return r;
  }

  /* ───────── Android: avisar también en la app Reloj ───────── */
  function launchClock(r) {
    let url;
    const msg = encodeURIComponent(r.name || 'RubenceChef');
    if (r.type === 'timer') {
      url = 'intent:#Intent;action=android.intent.action.SET_TIMER;'
          + 'i.android.intent.extra.alarm.LENGTH=' + Math.round(r.totalMs / 1000) + ';'
          + 'S.android.intent.extra.alarm.MESSAGE=' + msg + ';'
          + 'B.android.intent.extra.alarm.SKIP_UI=true;end';
    } else {
      const [h, m] = r.label.split(':').map(Number);
      url = 'intent:#Intent;action=android.intent.action.SET_ALARM;'
          + 'i.android.intent.extra.alarm.HOUR=' + h + ';'
          + 'i.android.intent.extra.alarm.MINUTES=' + m + ';'
          + 'S.android.intent.extra.alarm.MESSAGE=' + msg + ';'
          + 'B.android.intent.extra.alarm.SKIP_UI=true;end';
    }
    try {
      const a = document.createElement('a');
      a.href = url;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast('Enviado al Reloj del móvil');
    } catch (e) {}
  }

  // Arranca un timer/alarma nuevo (siempre desde un toque del usuario). Los anteriores siguen en marcha.
  function startRun(r) {
    const nameEl = $('timerNameInput');
    const nm = nameEl ? nameEl.value.trim().slice(0, 40) : '';
    r.id = newId();
    r.ringing = false;
    if (nm) r.name = nm;              // sin nombre: no se guarda nada
    if (nameEl) nameEl.value = '';
    if (clockEnabled()) r.clock = true;
    runs.push(r);
    tab = 'list';
    begin();
    if (r.clock) launchClock(r);
  }

  /* ───────── acciones (llamadas desde el HTML) ───────── */
  window.openTimerModal = function () {
    ensureAudio(); // este toque desbloquea el audio para cuando suene
    const m = $('timerModal');
    if (m.style.display !== 'flex') {
      if (!anyRinging()) tab = runs.length ? 'list' : 'timer';
      openModalNav('timerModal');
    }
    render();
  };

  window.closeTimerModal = function () {
    if (anyRinging()) return; // sonando solo se cierra con "Detener"
    closeModal('timerModal');
  };

  window.setTimerTab = function (t) { tab = t; render(); };

  window.timerToggleClock = function () {
    const on = !clockEnabled();
    try { localStorage.setItem(LS_CLOCK, on ? '1' : '0'); } catch (e) {}
    render();
    showToast(on ? 'Avisará también en el Reloj' : 'Solo en la app');
  };

  window.timerStartMinutes = function (min) {
    startRun({ type: 'timer', endAt: Date.now() + min * 60000, totalMs: min * 60000, pausedLeft: null });
  };

  window.timerStartManual = function () {
    const ms = parseToMs($('timerManualInput').value);
    if (!(ms >= 1000) || ms > 999 * 60000) { showToast('Introduce un tiempo válido (ej. 3,5 o 1:30)'); return; }
    $('timerManualInput').value = '';
    startRun({ type: 'timer', endAt: Date.now() + ms, totalMs: ms, pausedLeft: null });
  };

  window.timerStartAlarm = function () {
    const v = $('alarmInput').value;
    if (!v) { showToast('Elige la hora de la alarma'); return; }
    const [h, m] = v.split(':').map(Number);
    const d = new Date(); d.setHours(h, m, 0, 0);
    if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1); // ya pasó hoy → mañana
    startRun({ type: 'alarm', endAt: d.getTime(), totalMs: d.getTime() - Date.now(), pausedLeft: null, label: v });
  };

  window.timerPause = function (id) {
    const r = findRun(id);
    if (!r || r.type !== 'timer' || r.pausedLeft != null || r.ringing) return;
    r.pausedLeft = Math.max(0, r.endAt - Date.now());
    save(); refreshSched(); render();
  };

  window.timerResume = function (id) {
    const r = findRun(id);
    if (!r || r.pausedLeft == null) return;
    r.endAt = Date.now() + r.pausedLeft;
    r.pausedLeft = null;
    save(); refreshSched(); render();
  };

  window.timerCancel = function (id) {
    const r = removeRun(id);
    if (r && r.clock) showToast('Cancélalo también en el Reloj');
  };
  window.timerStop = function (id) {   // "Detener" cuando suena
    const r = removeRun(id);
    if (r && r.clock) showToast('Si el Reloj también suena, páralo allí');
  };

  window.timerManualPreview = function () {
    const ms = parseToMs($('timerManualInput').value);
    const d = $('timerDisplay');
    d.textContent = ms >= 1000 && ms <= 999 * 60000 ? fmtClock(ms) : '00:00';
    d.classList.toggle('dim', !(ms >= 1000));
    d.classList.toggle('long', d.textContent.length > 5);
  };

  window.timerAlarmPreview = function () {
    const v = $('alarmInput').value;
    if (!v) { $('timerSub').textContent = 'Elige la hora a la que quieres que suene'; return; }
    const [h, m] = v.split(':').map(Number);
    const d = new Date(); d.setHours(h, m, 0, 0);
    $('timerSub').textContent = d.getTime() > Date.now() ? 'Sonará hoy' : 'Sonará mañana';
  };

  // Para app.js: no recargar la app si algo está sonando o va a sonar pronto
  window.timerIsRinging = () => anyRinging();
  window.timerBlocksReload = () =>
    anyRinging() || runs.some(r => r.pausedLeft == null && r.endAt - Date.now() < 20 * 60000);

  /* ───────── pintado ───────── */
  function rowTexts(r, now) {
    const isT = r.type === 'timer';
    const left = r.pausedLeft != null ? r.pausedLeft : Math.max(0, r.endAt - now);
    const ck = r.clock ? ' · Reloj' : '';
    return {
      time: isT ? fmtClock(left) : r.label,
      sub: r.pausedLeft != null ? 'En pausa' : (isT ? 'Termina a las ' + fmtHM(r.endAt) + ck : 'Faltan ' + fmtLeftHuman(left) + ck),
      pct: isT ? Math.max(0, Math.min(100, (left / r.totalMs) * 100)) : 0
    };
  }

  // Solo actualiza los textos de las filas (no las reconstruye, para no perder toques en los botones)
  function updateTimes(now) {
    runs.forEach(r => {
      const t = $('tt-' + r.id);
      if (!t) return;
      const x = rowTexts(r, now);
      t.textContent = x.time;
      t.classList.toggle('long', x.time.length > 5);
      const s = $('ts-' + r.id); if (s) s.textContent = x.sub;
      const b = $('tb-' + r.id); if (b) b.style.width = x.pct + '%';
    });
    applyWarn(now);
  }

  function rowHtml(r, now, single) {
    const isT = r.type === 'timer';
    const x = rowTexts(r, now);
    const name = (isT ? '⏱ ' : '⏰ ') + esc(r.name || (isT ? 'Timer' : 'Alarma'));
    let btns = '';
    if (isT && !r.clock) {
      btns += r.pausedLeft != null
        ? `<button class="trow-btn" onclick="timerResume('${r.id}')">Continuar</button>`
        : `<button class="trow-btn" onclick="timerPause('${r.id}')">Pausar</button>`;
    }
    btns += `<button class="trow-btn ghost" onclick="timerCancel('${r.id}')">Cancelar</button>`;
    return `<div class="trow${single ? ' single' : ''}">
      <div class="trow-name">${name}</div>
      <div class="trow-line">
        <div class="trow-time${r.pausedLeft != null ? ' dim' : ''}${x.time.length > 5 ? ' long' : ''}" id="tt-${r.id}">${x.time}</div>
        <div class="trow-btns">${btns}</div>
      </div>
      ${isT ? `<div class="timer-bar"><div class="timer-bar-fill" id="tb-${r.id}" style="width:${x.pct}%"></div></div>` : ''}
      <div class="trow-sub" id="ts-${r.id}">${x.sub}</div>
    </div>`;
  }

  // Últimos 10 s de cualquier timer/alarma en marcha (sin pausar): la ventana parpadea en rojo
  function applyWarn(now) {
    const s = $('timerSheet');
    if (!s) return;
    const warn = !anyRinging() && runs.some(r => r.pausedLeft == null && !r.ringing && r.endAt - now > 0 && r.endAt - now <= 10000);
    s.classList.toggle('warn', warn);
  }

  function show(id, on) { const el = $(id); if (el) el.style.display = on ? '' : 'none'; }

  function btn(cls, label, fn) { return `<button class="timer-btn ${cls}" onclick="${fn}">${label}</button>`; }

  function render() {
    const sheet = $('timerSheet');
    if (!sheet) return;
    const rr = firstRinging();
    const ring = !!rr;
    if (!ring && tab === 'list' && !runs.length) tab = 'timer';
    const now = Date.now();

    sheet.classList.toggle('ringing', ring);
    $('timerDisplay').classList.remove('dim');
    $('timerSub').classList.toggle('big', ring);

    // cabecera
    show('timerTabs', !ring);
    show('timerTitle', ring);
    show('timerClose', !ring);
    show('timerTabList', runs.length > 0);
    $('timerTabList').textContent = 'Activos ' + runs.length;
    show('timerClockToggle', !ring && tab !== 'list' && IS_ANDROID);
    $('timerClockToggle').classList.toggle('on', clockEnabled());
    ['timer', 'alarm', 'list'].forEach(t => {
      const el = $('timerTab' + t.charAt(0).toUpperCase() + t.slice(1));
      if (el) el.classList.toggle('active', tab === t);
    });
    if (ring) $('timerTitle').textContent = (rr.type === 'alarm' ? '⏰ ' : '⏱ ') + (rr.name || (rr.type === 'alarm' ? 'Alarma' : 'Timer'));

    // qué se ve en cada modo
    const mode = ring ? 'ring' : tab;
    show('timerDisplay', mode === 'ring' || mode === 'timer');
    show('alarmInput', mode === 'alarm');
    show('timerNameInput', mode === 'timer' || mode === 'alarm');
    show('timerSub', mode === 'ring' || mode === 'alarm');
    show('timerPresets', mode === 'timer');
    show('timerManual', mode === 'timer');
    show('timerList', mode === 'list');
    show('timerActions', mode === 'ring' || mode === 'alarm');

    const actions = $('timerActions');
    if (mode === 'ring') {
      $('timerDisplay').textContent = rr.type === 'alarm' ? '¡Alarma!' : '¡Tiempo!';
      const more = runs.filter(r => r.ringing).length - 1;
      $('timerSub').textContent = [rr.name, rr.type === 'alarm' ? 'Son las ' + rr.label : '', more > 0 ? `(+${more} más)` : ''].filter(Boolean).join(' · ');
      actions.innerHTML = btn('stop', 'Detener', `timerStop('${rr.id}')`);
    } else if (mode === 'timer') {
      $('timerDisplay').textContent = '00:00';
      $('timerDisplay').classList.add('dim');
      $('timerManualInput').value = '';
    } else if (mode === 'alarm') {
      actions.innerHTML = btn('', 'Activar alarma', 'timerStartAlarm()');
      window.timerAlarmPreview();
    } else {
      $('timerList').innerHTML = runs.slice().sort((a, b) => (a.pausedLeft != null) - (b.pausedLeft != null) || a.endAt - b.endAt)
        .map(r => rowHtml(r, now, runs.length === 1)).join('');
    }

    $('timerDisplay').classList.toggle('long', $('timerDisplay').textContent.length > 5);
    applyWarn(now);

    // icono del menú inferior
    const nav = $('nav-timer');
    if (nav) {
      nav.classList.toggle('timer-active', runs.length > 0 && !ring);
      nav.classList.toggle('timer-ringing', ring);
    }
  }

  /* ───────── arranque ───────── */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    if (runs.length) acquireWakeLock(); // el sistema suelta el wake lock al ocultar la app
    tick();
  });

  (function restore() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        let arr = JSON.parse(raw);
        if (arr && !Array.isArray(arr)) arr = [arr];           // formato antiguo: un solo timer
        runs = (arr || []).filter(r => r && (r.type === 'timer' || r.type === 'alarm')
          && !(r.pausedLeft == null && r.endAt < Date.now() - 30 * 60000)) // caducó hace >30 min
          .map(r => Object.assign({}, r, { id: r.id || newId(), ringing: false }));
        save();
      }
    } catch (e) { runs = []; }
    if (runs.some(r => r.pausedLeft == null)) { acquireWakeLock(); startTick(); }
    else if (runs.length) startTick();
    render();
  })();
})();
