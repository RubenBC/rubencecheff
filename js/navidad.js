/* 🎄 MODO NAVIDAD — lo activa o desactiva el admin (Admin → Sistema → Modo de temporada).
   Se carga solo cuando está activo (app.js: applySeason). Guirnalda de luces, bolas colgando, nieve
   acumulada abajo y una nevada de copos de distintas formas y tamaños (canvas), sin tapar ni bloquear
   nada. En la ventana de la alarma pone de fondo un Papá Noel sangriento.
   Expone window.SeasonNavidad = { start, stop }. */
(function () {
  'use strict';
  var COLORS = { light: '#0A2E21', dark: '#0B1410' }; // barra de estado del móvil
  var BULBS = ['#ff3b3b', '#ffd23f', '#38d27a', '#4aa8ff'];
  var BALLS = [['#ff5a5a', '#a50f1c'], ['#ffe08a', '#b8860b'], ['#7cc4ff', '#1f5fa8'], ['#f4f6fa', '#8d98a8']];

  // ── Papá Noel sangriento (fondo de la alarma) ──
  var SANTA_SVG = '<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMax meet"><defs>' +
    '<linearGradient id="xmSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1020"/><stop offset=".55" stop-color="#1c0a1c"/><stop offset="1" stop-color="#3a0a10"/></linearGradient>' +
    '<linearGradient id="xmSteel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f0f3f7"/><stop offset=".5" stop-color="#aab2bc"/><stop offset="1" stop-color="#6d747d"/></linearGradient>' +
    '<radialGradient id="xmGlow" r=".5"><stop offset="0" stop-color="#ff2a1a" stop-opacity=".5"/><stop offset="1" stop-color="#ff0000" stop-opacity="0"/></radialGradient></defs>' +
    '<rect width="400" height="600" fill="url(#xmSky)"/>' +
    '<circle cx="330" cy="75" r="70" fill="url(#xmGlow)"/><circle cx="330" cy="75" r="32" fill="#f1e2cc"/><g fill="#b9a58a" opacity=".5"><circle cx="320" cy="68" r="7"/><circle cx="340" cy="86" r="5"/></g>' +
    '<g fill="#07140e"><path d="M42 250 L74 330 H58 L92 410 H72 L108 500 H-20 L18 410 H-2 L28 330 H12 Z"/><path d="M360 270 L388 340 H374 L404 420 H386 L420 510 H300 L334 420 H318 L346 340 H332 Z"/></g>' +
    '<path d="M0 520 C80 500 140 515 200 510 C270 505 330 495 400 515 V600 H0 Z" fill="#8c9db4"/>' +
    '<g fill="#6a0610"><ellipse cx="200" cy="584" rx="160" ry="15"/><ellipse cx="86" cy="548" rx="26" ry="6"/><ellipse cx="332" cy="552" rx="22" ry="5"/><circle cx="40" cy="570" r="4"/><circle cx="364" cy="574" r="5"/><circle cx="130" cy="560" r="3"/><circle cx="270" cy="566" r="3.5"/></g>' +
    '<g class="xmr-santa">' +
      // abrigo
      '<path d="M92 600 C92 470 128 408 200 398 C272 408 308 470 308 600 Z" fill="#b3121c" stroke="#5a0a10" stroke-width="3"/>' +
      '<rect x="184" y="448" width="32" height="152" fill="#f4efe6" stroke="#cfc8bb" stroke-width="2"/>' +
      '<rect x="92" y="538" width="216" height="30" fill="#14100e"/><rect x="176" y="532" width="48" height="42" rx="5" fill="#d4a93a" stroke="#8a6a1c" stroke-width="3"/><rect x="186" y="542" width="28" height="22" rx="3" fill="#14100e"/>' +
      '<g fill="#5e0509" opacity=".9"><path d="M118 470 c20 -10 42 5 32 26 c-10 15 -36 10 -32 -26z"/><path d="M250 498 c20 -8 40 8 30 28 c-8 12 -36 6 -30 -28z"/><path d="M150 560 c10 -6 22 2 18 14 c-6 8 -20 4 -18 -14z"/></g>' +
      '<g fill="#d4001a"><path d="M188 470 q6 18 0 34 q-8 -14 0 -34z"/><path d="M205 520 q8 24 0 40 q-10 -16 0 -40z"/><circle cx="196" cy="590" r="3"/></g>' +
      // brazo caído
      '<path d="M268 420 C305 432 322 490 322 560 L290 566 C292 520 284 480 262 458 Z" fill="#b3121c" stroke="#5a0a10" stroke-width="3"/>' +
      '<rect x="288" y="556" width="40" height="20" rx="9" fill="#f4efe6" stroke="#cfc8bb" stroke-width="2"/><circle cx="310" cy="588" r="17" fill="#17120f"/>' +
      '<path d="M303 598 q4 14 0 22 q-6 -8 0 -22z" fill="#c4001a"/><path d="M300 560 c8 -4 16 2 12 10 c-6 4 -14 0 -12 -10z" fill="#9a0010"/>' +
      // brazo en alto (sin el cuchillo)
      '<path d="M132 424 C92 420 52 392 46 336 L90 326 C98 366 118 384 148 392 Z" fill="#b3121c" stroke="#5a0a10" stroke-width="3"/>' +
      '<rect x="40" y="318" width="58" height="20" rx="9" fill="#f4efe6" stroke="#cfc8bb" stroke-width="2" transform="rotate(-8 69 328)"/><path d="M52 330 c8 -4 16 2 12 10 c-6 4 -14 0 -12 -10z" fill="#a00010"/>' +
      // cabeza
      '<circle cx="122" cy="298" r="12" fill="#f0bf9b" stroke="#a8704f" stroke-width="2"/><circle cx="278" cy="298" r="12" fill="#f0bf9b" stroke="#a8704f" stroke-width="2"/>' +
      '<ellipse cx="200" cy="290" rx="80" ry="72" fill="#f0bf9b" stroke="#a8704f" stroke-width="3"/>' +
      '<path d="M114 240 C108 152 164 90 232 92 C270 94 300 112 316 144 C334 138 350 154 348 176 C346 198 326 206 312 198 C318 162 298 142 282 138 C300 168 304 204 302 242 Z" fill="#b3121c" stroke="#5a0a10" stroke-width="3" stroke-linejoin="round"/>' +
      '<circle cx="336" cy="184" r="22" fill="#f7f3ea" stroke="#cfc8bb" stroke-width="2.5"/><path d="M326 178 c8 -6 18 2 14 12 c-6 6 -16 2 -14 -12z" fill="#a00010"/>' +
      '<rect x="104" y="218" width="196" height="40" rx="20" fill="#f7f3ea" stroke="#cfc8bb" stroke-width="2.5"/>' +
      '<path d="M138 230 c14 -6 30 6 24 20 c-10 10 -28 2 -24 -20z" fill="#9a0010"/><path d="M246 250 q6 22 0 36 q-8 -14 0 -36z" fill="#b0000f"/>' +
      '<ellipse cx="168" cy="290" rx="23" ry="16" fill="#3b1218"/><ellipse cx="232" cy="290" rx="23" ry="16" fill="#3b1218"/>' +
      '<ellipse cx="168" cy="288" rx="15" ry="11" fill="#fff4d6"/><ellipse cx="232" cy="288" rx="15" ry="11" fill="#fff4d6"/>' +
      '<circle class="xmr-eye" cx="171" cy="289" r="7" fill="#e0001a"/><circle class="xmr-eye" cx="229" cy="289" r="7" fill="#e0001a"/><circle cx="172" cy="289" r="2.6" fill="#000"/><circle cx="228" cy="289" r="2.6" fill="#000"/>' +
      '<path d="M138 262 L190 281 M262 262 L210 281" stroke="#bdb6a8" stroke-width="17" stroke-linecap="round"/><path d="M138 262 L190 281 M262 262 L210 281" stroke="#f7f3ea" stroke-width="12" stroke-linecap="round"/>' +
      '<circle cx="150" cy="320" r="14" fill="#e0867a" opacity=".55"/><circle cx="250" cy="320" r="14" fill="#e0867a" opacity=".55"/>' +
      '<circle cx="200" cy="314" r="17" fill="#e6786c" stroke="#a84a40" stroke-width="2"/><circle cx="195" cy="308" r="5" fill="#ffb3a8"/>' +
      '<path d="M118 284 C102 350 110 430 156 466 C178 482 222 482 244 466 C290 430 298 350 282 284 C262 324 234 336 200 336 C166 336 138 324 118 284 Z" fill="#f7f3ea" stroke="#cfc8bb" stroke-width="3"/>' +
      '<path d="M150 472 q10 18 22 6 q10 14 22 2 q12 14 24 -2 q10 12 20 -4" fill="none" stroke="#cfc8bb" stroke-width="3"/>' +
      '<path d="M200 328 C180 312 150 320 138 338 C150 350 176 350 200 340 C224 350 250 350 262 338 C250 320 220 312 200 328 Z" fill="#fbf8f1" stroke="#cfc8bb" stroke-width="2.5"/>' +
      '<path d="M158 352 C170 410 230 410 242 352 C222 368 178 368 158 352 Z" fill="#2a0508" stroke="#1a0305" stroke-width="2"/>' +
      '<ellipse cx="200" cy="398" rx="14" ry="7" fill="#b0112a"/>' +
      '<path d="M164 357 L170 373 L177 361 L184 377 L192 363 L200 379 L208 363 L216 377 L223 361 L230 373 L236 357 Z" fill="#f4efe2" stroke="#1a0305" stroke-width="1.2" stroke-linejoin="round"/>' +
      '<path d="M228 400 q5 26 0 42 q-9 -16 0 -42z" fill="#c4001a"/><path d="M174 402 q4 18 0 28 q-7 -10 0 -28z" fill="#c4001a"/>' +
      '<g fill="#9a0010" opacity=".92"><path d="M148 400 c16 -10 38 2 32 24 c-8 16 -34 10 -32 -24z"/><path d="M236 424 c14 -6 30 4 24 20 c-8 12 -26 6 -24 -20z"/><path d="M194 442 c10 -6 22 2 18 14 c-6 8 -18 4 -18 -14z" fill="#7a0610"/><path d="M168 440 q4 30 0 44 q-6 -16 0 -44z"/></g>' +
      '<g fill="#b0000f"><circle cx="140" cy="300" r="3"/><circle cx="150" cy="274" r="2.5"/><circle cx="258" cy="272" r="3"/><circle cx="262" cy="312" r="2"/><circle cx="120" cy="332" r="3"/><circle cx="276" cy="340" r="3.5"/><circle cx="188" cy="270" r="2"/></g>' +
    '</g>' +
    // cuchillo (se balancea)
    '<g class="xmr-knife"><circle cx="70" cy="306" r="20" fill="#17120f"/>' +
      '<rect x="62" y="262" width="16" height="66" rx="5" fill="#3a2418" stroke="#1a0f09" stroke-width="2"/><circle cx="70" cy="306" r="20" fill="#17120f"/><rect x="62" y="262" width="16" height="22" rx="5" fill="#3a2418" stroke="#1a0f09" stroke-width="2"/>' +
      '<rect x="52" y="254" width="36" height="10" rx="3" fill="#8c939c" stroke="#555c64" stroke-width="1.5"/>' +
      '<path d="M54 254 L54 152 C54 128 64 108 72 92 C82 108 94 130 94 154 L94 254 Z" fill="url(#xmSteel)" stroke="#555c64" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M60 250 V156" stroke="#fff" stroke-width="2" opacity=".7"/>' +
      '<path d="M56 156 C62 146 70 154 74 146 C80 156 88 148 92 160 L92 206 C88 216 82 202 78 226 C74 246 68 214 62 232 C58 240 56 222 56 202 Z" fill="#b0000f"/><path d="M56 190 L56 232 C58 240 62 236 62 230 L62 190 Z" fill="#6a0009"/>' +
    '</g>' +
    '<g fill="#d4001a"><ellipse class="xmr-drip" cx="62" cy="262" rx="3.4" ry="5"/><ellipse class="xmr-drip d2" cx="88" cy="262" rx="3" ry="4.6"/><ellipse class="xmr-drip d3" cx="76" cy="266" rx="3.2" ry="5"/></g>' +
    '<g fill="#fff" opacity=".75" class="xmr-snow"><circle cx="30" cy="40" r="2"/><circle cx="90" cy="120" r="1.6"/><circle cx="150" cy="30" r="2.2"/><circle cx="220" cy="90" r="1.8"/><circle cx="280" cy="40" r="2"/><circle cx="370" cy="120" r="2.4"/><circle cx="60" cy="200" r="2"/><circle cx="350" cy="230" r="1.8"/><circle cx="20" cy="320" r="2.2"/><circle cx="380" cy="360" r="2"/><circle cx="110" cy="440" r="1.8"/><circle cx="300" cy="470" r="2.2"/><circle cx="40" cy="520" r="2"/><circle cx="240" cy="150" r="1.6"/></g>' +
    '</svg>';

  var running = false, raf = 0, last = 0, W = 0, H = 0, dpr = 1;
  var canvas, ctx, flakes = [], ro = null, placeTimers = [], layer, lights, drift, resizeT = 0;

  function rnd(a, b) { return a + Math.random() * (b - a); }

  // ── Nieve: 4 formas (punto, estrella, cristal, hexágono) y tamaños distintos ──
  function newFlake(initial) {
    var r = Math.random(), type, s;
    if (r < 0.42)      { type = 0; s = rnd(1.6, 4.2); }
    else if (r < 0.62) { type = 1; s = rnd(3.5, 7); }
    else if (r < 0.84) { type = 2; s = rnd(6, 11); }
    else               { type = 3; s = rnd(4, 8); }
    return { x: rnd(0, W), y: initial ? rnd(0, H) : -rnd(6, 20), s: s, type: type,
             vy: rnd(14, 24) + s * 2.2, amp: rnd(6, 24), fr: rnd(0.5, 1.2), ph: rnd(0, 6.28),
             rot: rnd(0, 6.28), vr: rnd(-0.7, 0.7), a: rnd(0.7, 1) };
  }
  function target() { return Math.max(28, Math.min(70, Math.round(W * H / 15000))); }
  function resize() {
    if (!canvas) return;
    var w = layer.clientWidth, h = layer.clientHeight;
    if (!w || !h) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = w; H = h;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = target();
    while (flakes.length < n) flakes.push(newFlake(true));
    if (flakes.length > n) flakes.length = n;
  }
  function drawFlake(f, dark) {
    var s = f.s, c = dark ? '#eaf4ff' : '#5f8fc4';
    ctx.save();
    ctx.translate(f.sx, f.y); ctx.rotate(f.rot); ctx.globalAlpha = f.a;
    ctx.strokeStyle = c; ctx.fillStyle = '#fff'; ctx.lineCap = 'round';
    if (f.type === 0) {                       // copo redondo
      ctx.beginPath(); ctx.arc(0, 0, s, 0, 6.2832); ctx.fill();
      if (!dark) { ctx.lineWidth = 0.9; ctx.stroke(); }
    } else if (f.type === 1) {                // estrella de 6 puntas
      ctx.lineWidth = Math.max(1.1, s / 4.5);
      ctx.beginPath();
      for (var i = 0; i < 3; i++) { var a = i * 1.0472; ctx.moveTo(-Math.cos(a) * s, -Math.sin(a) * s); ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s); }
      ctx.stroke();
    } else if (f.type === 2) {                // cristal con ramitas
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      for (var k = 0; k < 6; k++) {
        var ang = k * 1.0472, ca = Math.cos(ang), sa = Math.sin(ang);
        ctx.moveTo(0, 0); ctx.lineTo(ca * s, sa * s);
        var bx = ca * s * 0.58, by = sa * s * 0.58, bl = s * 0.34;
        ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(ang + 0.85) * bl, by + Math.sin(ang + 0.85) * bl);
        ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(ang - 0.85) * bl, by + Math.sin(ang - 0.85) * bl);
      }
      ctx.stroke();
    } else {                                  // hexágono con radios
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (var j = 0; j < 6; j++) { var an = j * 1.0472; var px = Math.cos(an) * s, py = Math.sin(an) * s; if (j) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
      ctx.closePath(); ctx.stroke();
      ctx.beginPath();
      for (var m = 0; m < 6; m++) { var am = m * 1.0472; ctx.moveTo(0, 0); ctx.lineTo(Math.cos(am) * s * 0.55, Math.sin(am) * s * 0.55); }
      ctx.stroke();
    }
    ctx.restore();
  }
  function frame(t) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    var dt = Math.min(0.05, (t - last) / 1000); last = t;
    if (!W || !H) { resize(); return; }
    var dark = document.body.classList.contains('dark');
    var wind = Math.sin(t / 5000) * 9;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      f.y += f.vy * dt; f.x += wind * dt; f.ph += f.fr * dt; f.rot += f.vr * dt;
      if (f.x < -20) f.x = W + 20; else if (f.x > W + 20) f.x = -20;
      f.sx = f.x + Math.sin(f.ph) * f.amp;
      if (f.y > H + 14) flakes[i] = newFlake(false);
      else drawFlake(f, dark);
    }
  }

  // ── Criaturas navideñas: trineo volando + reno, muñeco de nieve y hombre de jengibre por el suelo ──
  function reindeer(x, y, k, nose) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')">' +
      '<g stroke="#6f4620" stroke-width="4" stroke-linecap="round" fill="none"><path d="M-14 8 L-28 20 L-20 24"/><path d="M-8 9 L-16 26 L-8 28"/><path d="M12 8 L28 12 L33 20"/><path d="M18 7 L32 2 L40 8"/></g>' +
      '<ellipse cx="0" cy="0" rx="22" ry="11" fill="#9a6a3a"/><ellipse cx="2" cy="5" rx="14" ry="5" fill="#c9a06a" opacity=".6"/><circle cx="-22" cy="-3" r="3.4" fill="#f4efe6"/>' +
      '<path d="M14 -4 C20 -14 24 -20 28 -24 L36 -20 C32 -12 26 -2 20 6 Z" fill="#9a6a3a"/>' +
      '<ellipse cx="34" cy="-24" rx="9" ry="6.5" transform="rotate(20 34 -24)" fill="#a8763f"/><ellipse cx="42" cy="-21" rx="5" ry="4" fill="#c9a06a"/>' +
      '<circle cx="46" cy="-20" r="3.2" fill="' + (nose ? '#ff2a2a' : '#4a2f16') + '"' + (nose ? ' class="xm-nose"' : '') + '/><circle cx="34" cy="-26" r="1.4" fill="#1a1008"/>' +
      '<ellipse cx="28" cy="-30" rx="2.4" ry="5" transform="rotate(-30 28 -30)" fill="#7a4f26"/>' +
      '<path d="M31 -30 L28 -44 M28 -38 L22 -42 M28 -44 L32 -50 M35 -30 L38 -44 M38 -38 L44 -42" stroke="#e3d3b0" stroke-width="2" stroke-linecap="round" fill="none"/>' +
      '<path d="M8 -9 L8 10" stroke="#d4a93a" stroke-width="2.4"/></g>';
  }
  var STAR = 'M0 -6 L1.6 -1.6 L6 0 L1.6 1.6 L0 6 L-1.6 1.6 L-6 0 L-1.6 -1.6 Z';
  var XSVG = {
    sleigh: '<svg viewBox="0 0 270 100">' +
      '<g fill="#ffe08a"><path class="xm-tw" transform="translate(-10 44)" d="' + STAR + '"/><path class="xm-tw" style="animation-delay:-.3s" transform="translate(-32 60) scale(.7)" d="' + STAR + '"/><path class="xm-tw" style="animation-delay:-.6s" transform="translate(-4 68) scale(.8)" d="' + STAR + '"/><path class="xm-tw" style="animation-delay:-.9s" transform="translate(-26 30) scale(.6)" d="' + STAR + '"/></g>' +
      '<path d="M132 56 L152 50 L178 46 M196 44 L212 40" stroke="#d4a93a" stroke-width="2" fill="none"/>' +
      reindeer(172, 58, 0.9, false) + reindeer(236, 52, 1, true) +
      '<path d="M18 52 C4 36 18 14 38 20 C48 24 50 40 48 52 Z" fill="#8a5a2b" stroke="#4e2f10" stroke-width="2"/><path d="M30 21 l-4 -7 h15 l-4 7" fill="#c0242f"/>' +
      '<rect x="52" y="34" width="17" height="16" fill="#2f7d4a" stroke="#1d5a33" stroke-width="1.5"/><path d="M60.5 34 V50 M52 42 H69" stroke="#ffd23f" stroke-width="2.2"/>' +
      '<path d="M72 54 C72 38 84 32 94 34 C104 36 108 46 106 54 Z" fill="#c0242f" stroke="#7a0f18" stroke-width="1.5"/>' +
      '<path d="M101 42 L114 28" stroke="#c0242f" stroke-width="6" stroke-linecap="round"/><circle cx="115" cy="26.5" r="4" fill="#f7f3ea"/>' +
      '<circle cx="90" cy="26" r="9" fill="#f0bf9b" stroke="#a8704f" stroke-width="1"/><path d="M81 28 C81 42 99 42 99 28 C94 33 86 33 81 28 Z" fill="#f7f3ea" stroke="#cfc8bb" stroke-width="1"/>' +
      '<circle cx="87" cy="25" r="1.2" fill="#222"/><circle cx="93" cy="25" r="1.2" fill="#222"/><circle cx="90" cy="28" r="2" fill="#e6786c"/>' +
      '<path d="M80 22 C80 8 98 8 100 20 C104 14 112 17 109 24 C106 20 102 21 100 24 Z" fill="#c0242f" stroke="#7a0f18" stroke-width="1"/><rect x="80" y="19" width="19" height="5" rx="2.5" fill="#f7f3ea"/><circle cx="109" cy="22" r="3.6" fill="#f7f3ea"/>' +
      '<path d="M14 52 L116 52 C124 52 130 46 134 36 L139 40 C137 60 124 78 100 78 L38 78 C22 78 14 68 14 52 Z" fill="#c0242f" stroke="#7a0f18" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M18 60 H122" stroke="#d4a93a" stroke-width="3"/><path d="M134 36 C142 28 150 32 146 40" stroke="#d4a93a" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
      '<path d="M6 90 C30 98 112 98 132 88 C144 83 148 74 141 70 M40 78 V92 M100 78 V92" stroke="#d4a93a" stroke-width="3.6" fill="none" stroke-linecap="round"/></svg>',

    rudolph: '<svg viewBox="0 0 120 92">' +
      '<g class="xm-leg-a" style="--ox:42px;--oy:54px"><rect x="39" y="52" width="7" height="30" rx="3.5" fill="#7a4f26"/><rect x="38" y="80" width="9" height="6" rx="2" fill="#2a1a0c"/></g>' +
      '<g class="xm-leg-b" style="--ox:52px;--oy:54px"><rect x="49" y="52" width="7" height="30" rx="3.5" fill="#8a5b2e"/><rect x="48" y="80" width="9" height="6" rx="2" fill="#2a1a0c"/></g>' +
      '<g class="xm-leg-b" style="--ox:76px;--oy:54px"><rect x="73" y="52" width="7" height="30" rx="3.5" fill="#7a4f26"/><rect x="72" y="80" width="9" height="6" rx="2" fill="#2a1a0c"/></g>' +
      '<g class="xm-leg-a" style="--ox:86px;--oy:54px"><rect x="83" y="52" width="7" height="30" rx="3.5" fill="#8a5b2e"/><rect x="82" y="80" width="9" height="6" rx="2" fill="#2a1a0c"/></g>' +
      '<ellipse cx="62" cy="46" rx="32" ry="16" fill="#9a6a3a"/><ellipse cx="64" cy="53" rx="22" ry="7" fill="#c9a06a" opacity=".6"/><circle cx="30" cy="42" r="4.4" fill="#f4efe6"/>' +
      '<path d="M84 38 C90 28 94 20 98 14 L108 18 C104 28 98 38 92 50 Z" fill="#9a6a3a"/>' +
      '<ellipse cx="103" cy="14" rx="11" ry="8" transform="rotate(18 103 14)" fill="#a8763f"/><ellipse cx="112" cy="18" rx="6" ry="4.6" fill="#c9a06a"/>' +
      '<circle cx="116" cy="19" r="4" fill="#ff2a2a" class="xm-nose"/><circle cx="103" cy="11" r="1.7" fill="#1a1008"/>' +
      '<ellipse cx="96" cy="6" rx="3" ry="6" transform="rotate(-30 96 6)" fill="#7a4f26"/>' +
      '<path d="M100 4 L96 -10 M97 -3 L90 -7 M96 -10 L100 -16 M105 3 L109 -9 M108 -3 L115 -6" stroke="#e3d3b0" stroke-width="2.4" stroke-linecap="round" fill="none"/>' +
      '<path d="M82 36 L82 56" stroke="#d62839" stroke-width="3"/><circle cx="82" cy="58" r="3" fill="#ffd23f"/></svg>',

    snowman: '<svg viewBox="0 0 60 94">' +
      '<path d="M14 54 L1 44 M1 44 L-1 37 M1 44 L-3 45 M46 54 L59 46 M59 46 L62 40 M59 46 L63 48" stroke="#6b4423" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
      '<circle cx="30" cy="75" r="18" fill="#fff" stroke="#9fb4c8" stroke-width="2"/><circle cx="30" cy="52" r="15" fill="#fff" stroke="#9fb4c8" stroke-width="2"/><circle cx="30" cy="29" r="12" fill="#fff" stroke="#9fb4c8" stroke-width="2"/>' +
      '<rect x="17" y="17" width="26" height="4.5" rx="2" fill="#1d1a1a"/><rect x="22" y="4" width="16" height="15" fill="#1d1a1a"/><rect x="22" y="13" width="16" height="3.4" fill="#d62839"/>' +
      '<circle cx="26" cy="27" r="1.7" fill="#1d1a1a"/><circle cx="34" cy="27" r="1.7" fill="#1d1a1a"/><path d="M30 30 L45 32.5 L30 35 Z" fill="#f28c28"/>' +
      '<path d="M24 36 C27 40 33 40 36 36" stroke="#1d1a1a" stroke-width="1.4" fill="none" stroke-dasharray="1.6 2.2" stroke-linecap="round"/>' +
      '<path d="M17 41 C25 47 35 47 43 41 L43 46 C35 52 25 52 17 46 Z" fill="#d62839"/><path d="M37 46 L42 62 L35 60 Z" fill="#b01c2c"/>' +
      '<circle cx="30" cy="56" r="1.9" fill="#1d1a1a"/><circle cx="30" cy="64" r="1.9" fill="#1d1a1a"/><circle cx="30" cy="76" r="2" fill="#1d1a1a"/><circle cx="30" cy="84" r="2" fill="#1d1a1a"/></svg>',

    ginger: '<svg viewBox="0 0 58 78">' +
      '<g class="xm-leg-a" style="--ox:22px;--oy:48px"><rect x="17" y="46" width="11" height="26" rx="5.5" fill="#b8743a" stroke="#8a5224" stroke-width="1.2"/><path d="M18 66 H27" stroke="#fff" stroke-width="2"/></g>' +
      '<g class="xm-leg-b" style="--ox:36px;--oy:48px"><rect x="30" y="46" width="11" height="26" rx="5.5" fill="#c8823f" stroke="#8a5224" stroke-width="1.2"/><path d="M31 66 H40" stroke="#fff" stroke-width="2"/></g>' +
      '<g class="xm-arm-a"><rect x="2" y="27" width="16" height="10" rx="5" fill="#b8743a" stroke="#8a5224" stroke-width="1.2"/><path d="M4 35 l3 -3 l3 3 l3 -3" stroke="#fff" stroke-width="1.6" fill="none"/></g>' +
      '<g class="xm-arm-b"><rect x="40" y="27" width="16" height="10" rx="5" fill="#c8823f" stroke="#8a5224" stroke-width="1.2"/><path d="M43 35 l3 -3 l3 3 l3 -3" stroke="#fff" stroke-width="1.6" fill="none"/></g>' +
      '<rect x="14" y="26" width="30" height="26" rx="10" fill="#c8823f" stroke="#8a5224" stroke-width="1.5"/>' +
      '<circle cx="29" cy="16" r="13.5" fill="#c8823f" stroke="#8a5224" stroke-width="1.5"/>' +
      '<circle cx="24" cy="14" r="1.8" fill="#fff"/><circle cx="34" cy="14" r="1.8" fill="#fff"/><path d="M23 20 C26 25 32 25 35 20" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="20" cy="19" r="2" fill="#f19aa8" opacity=".8"/><circle cx="38" cy="19" r="2" fill="#f19aa8" opacity=".8"/>' +
      '<circle cx="29" cy="34" r="2.3" fill="#d62839"/><circle cx="29" cy="42" r="2.3" fill="#2f9e5a"/><circle cx="29" cy="49" r="1.9" fill="#d62839"/><path d="M17 31 H41" stroke="#fff" stroke-width="1.4" stroke-dasharray="2 2.2"/></svg>'
  };
  function critter(kind, w, o) {
    var outer = document.createElement('div'), rtl = !!o.rtl;
    outer.className = 'xm-item ' + (o.cls || 'xm-walk-' + (rtl ? 'rtl' : 'ltr'));
    outer.style.width = w + 'px';
    outer.style.cssText += ';' + (o.bottom != null ? 'bottom:' + o.bottom + ';' : 'top:' + o.top + ';') + (o.vars || '');
    var inner = document.createElement('div');
    inner.className = (rtl ? 'xm-flip ' : '') + (o.inner || '');
    inner.innerHTML = XSVG[kind];
    outer.appendChild(inner); layer.appendChild(outer);
  }
  function addCritters() {
    critter('sleigh', 178, { cls: 'xm-sleigh', top: '7%', inner: 'xm-sleigh-in', vars: '--cd:100s;--dl:-94s;' });
    critter('rudolph', 84, { bottom: '2px', rtl: true,  vars: '--d:74s;--dl:-12s;' });
    critter('snowman', 46, { bottom: '2px', rtl: false, inner: 'xm-waddle', vars: '--d:96s;--dl:-44s;' });
    critter('ginger',  42, { bottom: '2px', rtl: false, vars: '--d:52s;--dl:-6s;' });
  }

  // ── Guirnalda de luces y bolas colgando (bajo la barra de arriba) ──
  function buildLights() {
    var w = window.innerWidth, sw = 66, d = 11, n = Math.ceil(w / sw) + 1, i, k;
    var path = 'M0 1', bulbs = '', defs = '';
    for (i = 0; i < n; i++) path += ' Q' + (i * sw + sw / 2) + ' ' + (2 * d + 1) + ' ' + ((i + 1) * sw) + ' 1';
    var idx = 0;
    for (i = 0; i < n; i++) {
      [0.2, 0.5, 0.8].forEach(function (t) {
        var x = i * sw + t * sw, y = 1 + 4 * d * t * (1 - t), c = idx % 4;
        bulbs += '<g class="xm-bulb c' + c + '" style="color:' + BULBS[c] + '"><rect x="' + (x - 1.6) + '" y="' + (y - 0.5) + '" width="3.2" height="4" fill="#1a2b22"/><ellipse cx="' + x + '" cy="' + (y + 7) + '" rx="3.2" ry="4.6" fill="' + BULBS[c] + '"/><ellipse cx="' + (x - 1) + '" cy="' + (y + 5.4) + '" rx="1" ry="1.5" fill="#fff" opacity=".7"/></g>';
        idx++;
      });
    }
    // 4 bolas colgando de hilos de distinta longitud
    var balls = '';
    [0.09, 0.33, 0.61, 0.88].forEach(function (p, j) {
      var x = Math.round(w * p), len = [8, 14, 10, 16][j], r = [7, 8, 6.5, 8][j], b = BALLS[j];
      defs += '<radialGradient id="xmB' + j + '" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="' + b[0] + '"/><stop offset="1" stop-color="' + b[1] + '"/></radialGradient>';
      balls += '<g class="xm-swing" style="transform-origin:' + x + 'px 0px;animation-duration:' + (3 + j * 0.7) + 's;animation-delay:-' + (j * 0.9) + 's"><line x1="' + x + '" y1="0" x2="' + x + '" y2="' + len + '" stroke="#d4a93a" stroke-width="1"/><rect x="' + (x - 3) + '" y="' + len + '" width="6" height="4" rx="1" fill="#d4a93a"/><circle cx="' + x + '" cy="' + (len + 4 + r) + '" r="' + r + '" fill="url(#xmB' + j + ')"/><circle cx="' + (x - r * 0.35) + '" cy="' + (len + 4 + r * 0.6) + '" r="' + (r * 0.22) + '" fill="#fff" opacity=".75"/></g>';
    });
    lights.innerHTML = '<svg viewBox="0 0 ' + w + ' 60" width="' + w + '" height="60" preserveAspectRatio="xMinYMin meet"><defs>' + defs + '</defs><path d="' + path + '" fill="none" stroke="#1a2b22" stroke-width="1.6"/>' + bulbs + balls + '</svg>';
  }

  function addRingBg() {
    var sheet = document.getElementById('timerSheet');
    if (!sheet || sheet.querySelector('.xm-ring-bg')) return;
    var bg = document.createElement('div');
    bg.className = 'xm-ring-bg'; bg.setAttribute('aria-hidden', 'true');
    bg.innerHTML = SANTA_SVG;
    sheet.insertBefore(bg, sheet.firstChild);
  }

  // El área libre va entre la barra de arriba y el menú de abajo
  function place() {
    var tb = document.getElementById('mainTopbar') || document.querySelector('.topbar');
    var nav = document.querySelector('.bottom-nav');
    var root = document.documentElement.style;
    if (tb) root.setProperty('--xm-top', Math.round(tb.getBoundingClientRect().bottom) + 'px');
    if (nav) {
      var r = nav.getBoundingClientRect();
      root.setProperty('--xm-bottom', Math.round(r.height) + 'px');
      root.setProperty('--xm-nl', Math.round(r.left) + 'px'); root.setProperty('--xm-nw', Math.round(r.width) + 'px'); // en PC el menú es más estrecho que la pantalla
    }
    resize();
  }
  function onResize() { clearTimeout(resizeT); resizeT = setTimeout(function () { place(); buildLights(); }, 120); }

  function start() {
    if (running) return;
    running = true;
    window.MODE_THEME_COLORS = COLORS;
    addRingBg();
    layer = document.createElement('div'); layer.id = 'xmLayer'; layer.setAttribute('aria-hidden', 'true');
    canvas = document.createElement('canvas'); layer.appendChild(canvas); ctx = canvas.getContext('2d');
    addCritters();
    lights = document.createElement('div'); lights.id = 'xmLights'; lights.setAttribute('aria-hidden', 'true');
    drift = document.createElement('div'); drift.id = 'xmDrift'; drift.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer); document.body.appendChild(lights); document.body.appendChild(drift);
    place(); buildLights();
    window.addEventListener('resize', onResize);
    [300, 1200, 3000].forEach(function (t) { placeTimers.push(setTimeout(function () { place(); buildLights(); }, t)); });
    if (window.ResizeObserver) {
      ro = new ResizeObserver(place);
      var a = document.getElementById('mainTopbar'), b = document.querySelector('.bottom-nav');
      if (a) ro.observe(a); if (b) ro.observe(b);
    }
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf); clearTimeout(resizeT); placeTimers.forEach(clearTimeout); placeTimers = [];
    window.removeEventListener('resize', onResize);
    if (ro) { ro.disconnect(); ro = null; }
    [layer, lights, drift].forEach(function (e) { if (e) e.remove(); });
    layer = lights = drift = canvas = ctx = null; flakes = []; W = H = 0;
    var bg = document.querySelector('.xm-ring-bg'); if (bg) bg.remove();
    var root = document.documentElement.style; root.removeProperty('--xm-top'); root.removeProperty('--xm-bottom'); root.removeProperty('--xm-nl'); root.removeProperty('--xm-nw');
    if (window.MODE_THEME_COLORS === COLORS) window.MODE_THEME_COLORS = null;
  }
  window.SeasonNavidad = { start: start, stop: stop };
})();
