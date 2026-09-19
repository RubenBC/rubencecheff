/* ═══════════════════════════════════════
   TEMPORIZADOR / ALARMA  (v44)
   - Solo cuenta atrás (5 · 7 · 9 · 12 min o tiempo manual)
   - Alarma a una hora concreta
   - Al terminar suena una melodía fuerte en bucle hasta pulsar "Detener"
   - Puntualidad con la pestaña en segundo plano (PC):
       · el conteo lo lleva un Web Worker (no lo frena el navegador)
       · la melodía se programa por adelantado en el reloj de audio
   - Solo Android: opción "Reloj" → avisa también en la app Reloj del móvil
   - Usa la hora real (Date.now) y se guarda en localStorage (sobrevive a recargas)
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

  let tab = 'timer';                 // pestaña visible cuando está parado
  let run = null;                    // { type, endAt, totalMs, pausedLeft, label, clock }
  let ringing = false;
  let tickId = null, worker = null, vibId = null, lastPre = 0;
  let audioCtx = null, master = null, sched = null, wakeLock = null;
  let baseTitle = document.title;

  /* ───────── utilidades ───────── */
  function pad(n) { return String(n).padStart(2, '0'); }

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
      if (run) localStorage.setItem(LS_KEY, JSON.stringify(run));
      else localStorage.removeItem(LS_KEY);
    } catch (e) {}
  }

  function clockEnabled() {
    try { return IS_ANDROID && localStorage.getItem(LS_CLOCK) === '1'; } catch (e) { return false; }
  }

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
  function scheduleFrom(base, minLoops) {
    cancelScheduled();
    const bus = audioCtx.createGain();
    bus.connect(master);
    sched = { bus, oscs: [], base, n: 0, min: minLoops };
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

  // Deja la melodía lista para que suene EXACTAMENTE al terminar, aunque la pestaña esté dormida
  function preschedule() {
    if (!run || run.pausedLeft != null || ringing || sched) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    const doIt = () => {
      if (!run || ringing || run.pausedLeft != null || sched || audioCtx.state !== 'running') return;
      const left = run.endAt - Date.now();
      if (left <= 0 || left > PRE_MS) return;
      scheduleFrom(audioCtx.currentTime + left / 1000, 10);
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
      if (!ringing || !audioCtx || audioCtx.state !== 'running') return false;
      if (!sched) scheduleFrom(audioCtx.currentTime + 0.05, 1);
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
    if (!run) return;
    if (ringing) { topUp(); return; }
    if (run.pausedLeft != null) return;
    const left = run.endAt - Date.now();
    if (left <= 0) { ring(); return; }
    if (!sched && left <= PRE_MS && Date.now() - lastPre > 5000) { lastPre = Date.now(); preschedule(); }
    renderClock(left);
  }

  function begin() {
    ensureAudio();
    acquireWakeLock();
    save();
    startTick();
    render();
    preschedule();
  }

  function ring() {
    ringing = true;                 // el Worker sigue vivo para mantener la melodía programada
    document.title = '⏰ ¡Tiempo!' + (run && run.name ? ' ' + run.name : '') + ' — ' + baseTitle;
    startMelody();
    acquireWakeLock();
    openTimerModal();
    render();
  }

  function clearAll() {
    ringing = false;
    stopMelody();
    stopTick();
    run = null;
    save();
    releaseWakeLock();
    document.title = baseTitle;
    render();
  }

  /* ───────── Android: avisar también en la app Reloj ───────── */
  function launchClock(r) {
    let url;
    if (r.type === 'timer') {
      url = 'intent:#Intent;action=android.intent.action.SET_TIMER;'
          + 'i.android.intent.extra.alarm.LENGTH=' + Math.round(r.totalMs / 1000) + ';'
          + 'S.android.intent.extra.alarm.MESSAGE=' + encodeURIComponent(r.name || 'RubenceChef') + ';'
          + 'B.android.intent.extra.alarm.SKIP_UI=true;end';
    } else {
      const [h, m] = r.label.split(':').map(Number);
      url = 'intent:#Intent;action=android.intent.action.SET_ALARM;'
          + 'i.android.intent.extra.alarm.HOUR=' + h + ';'
          + 'i.android.intent.extra.alarm.MINUTES=' + m + ';'
          + 'S.android.intent.extra.alarm.MESSAGE=' + encodeURIComponent(r.name || 'RubenceChef') + ';'
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

  // Arranca un timer/alarma (siempre desde un toque del usuario)
  function startRun(r) {
    const nameEl = $('timerNameInput');
    const nm = nameEl ? nameEl.value.trim().slice(0, 40) : '';
    if (nm) r.name = nm;              // sin nombre: no se guarda nada
    if (nameEl) nameEl.value = '';
    if (clockEnabled()) r.clock = true;
    run = r;
    begin();
    if (r.clock) launchClock(r);
  }

  /* ───────── acciones (llamadas desde el HTML) ───────── */
  window.openTimerModal = function () {
    ensureAudio(); // este toque desbloquea el audio para cuando suene
    const m = $('timerModal');
    if (m.style.display !== 'flex') openModalNav('timerModal');
    render();
  };

  window.closeTimerModal = function () {
    if (ringing) return; // sonando solo se cierra con "Detener"
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

  window.timerPause = function () {
    if (!run || run.type !== 'timer' || run.pausedLeft != null) return;
    run.pausedLeft = Math.max(0, run.endAt - Date.now());
    cancelScheduled();
    stopTick(); save(); render();
  };

  window.timerResume = function () {
    if (!run || run.pausedLeft == null) return;
    run.endAt = Date.now() + run.pausedLeft;
    run.pausedLeft = null;
    begin();
  };

  window.timerCancel = function () {
    const c = run && run.clock;
    clearAll();
    if (c) showToast('Cancélalo también en el Reloj');
  };
  window.timerStop = function () {   // "Detener" cuando suena
    const c = run && run.clock;
    clearAll();
    if (c) showToast('Si el Reloj también suena, páralo allí');
  };

  window.timerManualPreview = function () {
    const ms = parseToMs($('timerManualInput').value);
    const d = $('timerDisplay');
    d.textContent = ms >= 1000 && ms <= 999 * 60000 ? fmtClock(ms) : '00:00';
    d.classList.toggle('dim', !(ms >= 1000));
  };

  window.timerAlarmPreview = function () {
    const v = $('alarmInput').value;
    if (!v) { $('timerSub').textContent = 'Elige la hora a la que quieres que suene'; return; }
    const [h, m] = v.split(':').map(Number);
    const d = new Date(); d.setHours(h, m, 0, 0);
    $('timerSub').textContent = d.getTime() > Date.now() ? 'Sonará hoy' : 'Sonará mañana';
  };

  // Para app.js: no recargar la app si algo está sonando o va a sonar pronto
  window.timerIsRinging = () => ringing;
  window.timerBlocksReload = () =>
    ringing || (!!run && run.pausedLeft == null && run.endAt - Date.now() < 20 * 60000);

  /* ───────── pintado ───────── */
  function renderClock(left) {
    $('timerDisplay').textContent = run.type === 'alarm' ? run.label : fmtClock(left);
    if (run.type === 'timer') {
      $('timerBarFill').style.width = Math.max(0, Math.min(100, (left / run.totalMs) * 100)) + '%';
      $('timerSub').textContent = 'Termina a las ' + fmtHM(run.endAt) + (run.clock ? ' · también en el Reloj' : '');
    } else {
      $('timerSub').textContent = 'Faltan ' + fmtLeftHuman(left) + (run.clock ? ' · también en el Reloj' : '');
    }
  }

  function show(id, on) { const el = $(id); if (el) el.style.display = on ? '' : 'none'; }

  function btn(cls, label, fn) { return `<button class="timer-btn ${cls}" onclick="${fn}()">${label}</button>`; }

  function render() {
    const sheet = $('timerSheet');
    if (!sheet) return;
    const idle = !run && !ringing;
    const paused = !!run && run.pausedLeft != null && !ringing;
    const idleTimer = idle && tab === 'timer';
    const idleAlarm = idle && tab === 'alarm';

    sheet.classList.toggle('ringing', ringing);
    $('timerDisplay').classList.remove('dim');

    // cabecera
    show('timerTabs', idle);
    show('timerTitle', !idle);
    show('timerClose', !ringing);
    show('timerClockToggle', idle && IS_ANDROID);
    $('timerClockToggle').classList.toggle('on', clockEnabled());
    $('timerTabTimer').classList.toggle('active', tab === 'timer');
    $('timerTabAlarm').classList.toggle('active', tab === 'alarm');
    if (!idle) {
      const ico = run && run.type === 'alarm' ? '⏰' : '⏱';
      $('timerTitle').textContent = ico + ' ' + (run && run.name ? run.name : (run && run.type === 'alarm' ? 'Alarma' : 'Timer'));
    }

    // cuerpo
    show('timerNameInput', idle);
    show('timerSub', !idleTimer);
    $('timerSub').classList.toggle('big', ringing);
    show('timerDisplay', !idleAlarm);
    show('alarmInput', idleAlarm);
    show('timerBar', !!run && run.type === 'timer' && !ringing);
    show('timerPresets', idleTimer);
    show('timerManual', idleTimer);
    show('timerActions', !idleTimer);

    const actions = $('timerActions');
    if (idleTimer) {
      $('timerDisplay').textContent = '00:00';
      $('timerDisplay').classList.add('dim');
      $('timerManualInput').value = '';
    } else if (idleAlarm) {
      actions.innerHTML = btn('', 'Activar alarma', 'timerStartAlarm');
      window.timerAlarmPreview();
    } else if (ringing) {
      $('timerDisplay').textContent = run && run.type === 'alarm' ? '¡Alarma!' : '¡Tiempo!';
      $('timerSub').textContent = [run && run.name, run && run.type === 'alarm' ? 'Son las ' + run.label : ''].filter(Boolean).join(' · ');
      actions.innerHTML = btn('stop', 'Detener', 'timerStop');
    } else if (paused) {
      $('timerDisplay').textContent = fmtClock(run.pausedLeft);
      $('timerBarFill').style.width = Math.max(0, Math.min(100, (run.pausedLeft / run.totalMs) * 100)) + '%';
      $('timerSub').textContent = 'En pausa';
      actions.innerHTML = btn('', 'Continuar', 'timerResume') + btn('ghost', 'Cancelar', 'timerCancel');
    } else if (run.type === 'timer') {
      renderClock(Math.max(0, run.endAt - Date.now()));
      // Si también está en el Reloj no se puede pausar (el del Reloj seguiría corriendo)
      actions.innerHTML = (run.clock ? '' : btn('', 'Pausar', 'timerPause')) + btn('ghost', 'Cancelar', 'timerCancel');
    } else {
      renderClock(Math.max(0, run.endAt - Date.now()));
      actions.innerHTML = btn('ghost', 'Cancelar alarma', 'timerCancel');
    }

    // icono del menú inferior
    const nav = $('nav-timer');
    if (nav) {
      nav.classList.toggle('timer-active', !!run && !ringing);
      nav.classList.toggle('timer-ringing', ringing);
    }
  }

  /* ───────── arranque ───────── */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    if (run || ringing) acquireWakeLock(); // el sistema suelta el wake lock al ocultar la app
    tick();
  });

  (function restore() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const r = JSON.parse(raw);
        const stale = r && r.pausedLeft == null && r.endAt < Date.now() - 30 * 60000; // caducó hace >30 min
        if (r && (r.type === 'timer' || r.type === 'alarm') && !stale) run = r;
        else localStorage.removeItem(LS_KEY);
      }
    } catch (e) { run = null; }
    if (run && run.pausedLeft == null) { acquireWakeLock(); startTick(); }
    render();
  })();
})();
