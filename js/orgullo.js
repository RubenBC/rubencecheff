/* 🏳️‍🌈 MODO ORGULLO — lo activa o desactiva el admin (Admin → Sistema → Modo de temporada).
   Inspirado en la fiesta del Orgullo de Madrid: banderines bajo la barra de arriba, confeti cayendo,
   una carroza con bola de discoteca, globos que suben, un abanderado y un bailarín con boa. En la
   alarma: fiesta ante la Puerta de Alcalá. Se carga solo cuando está activo (app.js: applySeason).
   Expone window.SeasonOrgullo = { start, stop }. */
(function () {
  'use strict';
  var COLORS = { light: '#160A28', dark: '#120A1A' }; // barra de estado del móvil
  var RB = ['#e40303', '#ff8c00', '#ffed00', '#008026', '#004dff', '#750787'];            // bandera arcoíris
  var CONF = ['#e40303', '#ff8c00', '#ffed00', '#18a34a', '#2563eb', '#a21caf', '#ff4fa3', '#5bcefa', '#ffffff'];

  function stripes(x, y, w, h, extra) { // bandera arcoíris: 6 franjas
    var s = '', sh = h / 6;
    for (var i = 0; i < 6; i++) s += '<rect x="' + x + '" y="' + (y + i * sh) + '" width="' + w + '" height="' + (sh + 0.4) + '" fill="' + RB[i] + '"' + (extra || '') + '/>';
    return s;
  }
  function star(cx, cy, k, cls, delay) {
    return '<path class="' + cls + '"' + (delay ? ' style="animation-delay:' + delay + 's"' : '') + ' transform="translate(' + cx + ' ' + cy + ') scale(' + k + ')" d="M0 -6 L1.6 -1.6 L6 0 L1.6 1.6 L0 6 L-1.6 1.6 L-6 0 L-1.6 -1.6 Z" fill="#fff6b0"/>';
  }

  // ── Alarma: fiesta ante la Puerta de Alcalá, con bola de discoteca y público bailando ──
  function ringSvg() {
    var i, s = '<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMax meet"><defs>' +
      '<linearGradient id="ogSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14072b"/><stop offset=".6" stop-color="#3a0f4f"/><stop offset="1" stop-color="#7a1a5e"/></linearGradient>' +
      '<linearGradient id="ogRb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e40303"/><stop offset=".2" stop-color="#ff8c00"/><stop offset=".4" stop-color="#ffed00"/><stop offset=".6" stop-color="#18a34a"/><stop offset=".8" stop-color="#2563eb"/><stop offset="1" stop-color="#a21caf"/></linearGradient>' +
      '<radialGradient id="ogBall" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#b9c2d6"/><stop offset="1" stop-color="#5b6580"/></radialGradient></defs>' +
      '<rect width="400" height="600" fill="url(#ogSky)"/>';
    // haces de luz de colores desde la bola
    s += '<g class="ogr-beams" opacity=".28">';
    for (i = 0; i < 6; i++) { var a = -50 + i * 20; s += '<path d="M200 66 L' + (200 + Math.tan(a * Math.PI / 180) * 520) + ' 586 L' + (200 + Math.tan((a + 9) * Math.PI / 180) * 520) + ' 586 Z" fill="' + RB[i] + '"/>'; }
    s += '</g>';
    // Puerta de Alcalá (silueta iluminada en arcoíris)
    s += '<g stroke="#ffb3ea" stroke-width="1.6" stroke-linejoin="round">' +
      '<rect x="92" y="418" width="216" height="62" fill="#2b1850"/><rect x="92" y="418" width="216" height="62" fill="url(#ogRb)" opacity=".5" stroke="none"/>' +
      '<rect x="150" y="352" width="100" height="128" fill="#2b1850"/><rect x="150" y="352" width="100" height="128" fill="url(#ogRb)" opacity=".5" stroke="none"/>' +
      '<rect x="144" y="344" width="112" height="10" fill="#3a2266"/><path d="M168 344 L200 318 L232 344 Z" fill="#3a2266"/>' +
      '<rect x="104" y="404" width="192" height="14" fill="#3a2266"/><g fill="#3a2266"><rect x="112" y="396" width="6" height="8"/><rect x="132" y="396" width="6" height="8"/><rect x="262" y="396" width="6" height="8"/><rect x="282" y="396" width="6" height="8"/></g>' +
      '<path d="M178 480 V430 C178 412 222 412 222 430 V480 Z" fill="#0a0414"/><path d="M110 480 V440 C110 426 138 426 138 440 V480 Z" fill="#0a0414"/><path d="M262 480 V440 C262 426 290 426 290 440 V480 Z" fill="#0a0414"/>' +
      '<rect x="100" y="456" width="8" height="24" fill="#0a0414"/><rect x="292" y="456" width="8" height="24" fill="#0a0414"/></g>' +
      '<g class="ogr-glow"><rect x="92" y="418" width="216" height="62" fill="url(#ogRb)" opacity=".35"/></g>';
    // bola de discoteca
    s += '<g class="ogr-ball"><line x1="200" y1="0" x2="200" y2="42" stroke="#c7cbe0" stroke-width="2"/><circle cx="200" cy="70" r="30" fill="url(#ogBall)" stroke="#6b7494" stroke-width="1.5"/>' +
      '<path d="M170 70 H230 M175 56 H225 M175 84 H225 M200 40 V100 M184 42 C176 70 184 98 184 98 M216 42 C224 70 216 98 216 98" stroke="#7c86a6" stroke-width="1" fill="none" opacity=".8"/>' +
      star(184, 58, .7, 'og-tw') + star(220, 80, .6, 'og-tw', -.4) + star(206, 48, .5, 'og-tw', -.7) + '</g>';
    // banderas ondeando a los lados
    s += '<g stroke="#cfd3dc" stroke-width="3"><line x1="26" y1="120" x2="26" y2="320"/><line x1="374" y1="150" x2="374" y2="350"/></g>' +
      '<g class="ogr-flag" style="transform-origin:28px 130px">' + stripes(28, 124, 78, 54) + '</g><g class="ogr-flag" style="transform-origin:372px 160px;animation-delay:-.4s"><g transform="translate(266 0)">' + stripes(28, 154, 78, 54) + '</g></g>';
    // público bailando (siluetas con los brazos en alto)
    var xs = [24, 70, 118, 166, 214, 262, 310, 358], cl = ['', 'c2', 'c3'];
    for (i = 0; i < xs.length; i++) {
      var x = xs[i], y = 540 + (i % 3) * 10, col = i % 2 ? '#0a0414' : '#14081f';
      s += '<g class="ogr-crowd ' + cl[i % 3] + '"><path d="M' + (x - 9) + ' ' + (y + 8) + ' L' + (x - 22) + ' ' + (y - 28) + ' M' + (x + 9) + ' ' + (y + 8) + ' L' + (x + 22) + ' ' + (y - 30) + '" stroke="' + col + '" stroke-width="7" stroke-linecap="round"/>' +
        '<circle cx="' + x + '" cy="' + (y - 12) + '" r="13" fill="' + col + '"/><rect x="' + (x - 16) + '" y="' + (y + 2) + '" width="32" height="70" rx="12" fill="' + col + '"/>' +
        (i % 3 === 0 ? '<path d="M' + (x + 22) + ' ' + (y - 30) + ' l16 4 l-16 8z" fill="' + RB[i % 6] + '"/>' : '') + '</g>';
    }
    // confeti cayendo
    for (i = 0; i < 24; i++) {
      var cx = 8 + (i * 53) % 384, cc = CONF[(i * 5) % 8];
      s += '<rect class="ogr-conf ' + cl[i % 3] + '" style="animation-delay:-' + ((i * 0.37) % 5).toFixed(2) + 's" x="' + cx + '" y="0" width="' + (5 + i % 4) + '" height="' + (3 + i % 3) + '" fill="' + cc + '"/>';
    }
    return s + '</svg>';
  }

  // ── Criaturas ──
  function dancer(x, y, body, skin, hair) {
    return '<g transform="translate(' + x + ' ' + y + ')"><g class="og-bounce" style="animation-delay:-' + (x % 7) / 10 + 's">' +
      '<path d="M-4 0 L-5 -16 M4 0 L5 -16" stroke="#2a1450" stroke-width="4" stroke-linecap="round"/><rect x="-7" y="-34" width="14" height="20" rx="5" fill="' + body + '"/>' +
      '<g class="og-armup" style="transform-origin:0px -30px"><path d="M-7 -30 L-15 -48 M7 -30 L15 -50" stroke="' + body + '" stroke-width="4" stroke-linecap="round"/><circle cx="-15.5" cy="-49.5" r="2.6" fill="' + skin + '"/><circle cx="15.5" cy="-51.5" r="2.6" fill="' + skin + '"/></g>' +
      '<circle cx="0" cy="-42" r="7" fill="' + skin + '"/><path d="M-7.5 -42 C-8 -52 8 -52 7.5 -42 C4 -46 -4 -46 -7.5 -42 Z" fill="' + hair + '"/></g></g>';
  }
  function balloon(cx, cy, col) {
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="13" ry="16" fill="' + col + '"/><ellipse cx="' + (cx - 4.5) + '" cy="' + (cy - 6) + '" rx="3" ry="5" fill="#fff" opacity=".5"/><path d="M' + (cx - 2.5) + ' ' + (cy + 15.5) + ' l2.5 3 l2.5 -3z" fill="' + col + '"/>';
  }
  var ARCH = '', k, FL = '';
  for (k = 0; k < 10; k++) { // arco de globos sobre la carroza
    ARCH += '<circle cx="' + (34 + k * 24) + '" cy="' + (66 - 30 * Math.sin(Math.PI * k / 9)).toFixed(1) + '" r="' + (8 + (k % 3)) + '" fill="' + CONF[(k * 3) % 8 === 8 ? 6 : (k * 3) % 8] + '" stroke="rgba(0,0,0,.18)" stroke-width="1"/>';
  }
  var OSVG = {
    float: '<svg viewBox="0 0 300 130">' +
      '<line x1="14" y1="12" x2="14" y2="80" stroke="#cfd3dc" stroke-width="2.5"/><g class="og-flagwave" style="transform-origin:15px 14px">' + stripes(15, 12, 46, 30) + '</g>' +
      ARCH +
      '<g fill="#15101f" stroke="#7a6aa0" stroke-width="1"><rect x="24" y="42" width="22" height="38" rx="3"/><rect x="214" y="42" width="22" height="38" rx="3"/></g><g fill="#3a3050" stroke="#9a8ac0" stroke-width="1"><circle cx="35" cy="53" r="5.5"/><circle cx="35" cy="68" r="8"/><circle cx="225" cy="53" r="5.5"/><circle cx="225" cy="68" r="8"/></g>' +
      '<line x1="130" y1="0" x2="130" y2="22" stroke="#9aa0b8" stroke-width="1.6"/><circle cx="130" cy="34" r="13" fill="#d6dbea" stroke="#6b7494" stroke-width="1.2"/><path d="M117 34 H143 M120 26 H140 M120 42 H140 M130 21 V47" stroke="#8892b0" stroke-width=".9"/>' +
      star(112, 24, .7, 'og-tw') + star(152, 40, .6, 'og-tw', -.4) + star(136, 14, .5, 'og-tw', -.7) +
      '<g class="og-rumble"><rect x="8" y="80" width="250" height="30" rx="4" fill="#2a1450"/>' + stripes(8, 86, 250, 19) +
      dancer(78, 80, '#ff4fa3', '#f0c8a0', '#3a2616') + dancer(128, 80, '#35c2ff', '#8d5524', '#1a0f0a') + dancer(182, 80, '#ffd23f', '#c68642', '#b266ff') +
      '<path d="M258 110 V72 C258 66 262 62 268 62 H284 C290 62 296 68 296 76 V110 Z" fill="#d81b8c" stroke="#8a0f5a" stroke-width="1.5"/><rect x="266" y="68" width="22" height="16" rx="3" fill="#bfe9ff"/></g>' +
      '<g fill="#17101f" stroke="#555" stroke-width="1"><circle cx="48" cy="114" r="13"/><circle cx="96" cy="114" r="13"/><circle cx="214" cy="114" r="13"/><circle cx="270" cy="114" r="13"/></g><g fill="#9a9aa8"><circle cx="48" cy="114" r="5"/><circle cx="96" cy="114" r="5"/><circle cx="214" cy="114" r="5"/><circle cx="270" cy="114" r="5"/></g></svg>',

    balloons: '<svg viewBox="0 0 80 130">' +
      '<path d="M22 40 Q36 90 40 124 M40 28 L40 124 M58 42 Q44 90 40 124" stroke="#9a8ab0" stroke-width="1.2" fill="none"/>' +
      balloon(22, 28, '#ff4fa3') + balloon(40, 16, '#ffd23f') + balloon(58, 30, '#35a8ff') + '</svg>',

    flag: '<svg viewBox="0 -14 94 124">' +
      '<g class="og-flagwave" style="transform-origin:4px 40px">' + stripes(2, 36, 34, 30) + '</g>' +
      '<g class="og-leg-a" style="--ox:40px;--oy:68px"><rect x="35" y="66" width="11" height="34" rx="4" fill="#2f4f8f"/><rect x="33" y="98" width="16" height="8" rx="3" fill="#fff" stroke="#999"/></g>' +
      '<g class="og-leg-b" style="--ox:52px;--oy:68px"><rect x="47" y="66" width="11" height="34" rx="4" fill="#3b5ea8"/><rect x="45" y="98" width="16" height="8" rx="3" fill="#fff" stroke="#999"/></g>' +
      '<rect x="34" y="38" width="24" height="32" rx="9" fill="#fff" stroke="#ddd" stroke-width="1.2"/>' +
      '<path d="M54 46 L68 22" stroke="#8d5524" stroke-width="6" stroke-linecap="round"/><circle cx="69" cy="19.5" r="4.2" fill="#8d5524"/>' +
      '<line x1="69" y1="19" x2="69" y2="-12" stroke="#cfd3dc" stroke-width="2.2"/><g class="og-flagwave" style="transform-origin:70px -10px">' + stripes(70, -12, 22, 18) + '</g>' +
      '<path d="M38 48 L32 66" stroke="#8d5524" stroke-width="6" stroke-linecap="round"/>' +
      '<circle cx="46" cy="26" r="11" fill="#8d5524"/><g fill="#1a0f0a"><circle cx="38" cy="19" r="5"/><circle cx="46" cy="15" r="5.5"/><circle cx="54" cy="19" r="5"/><circle cx="36" cy="26" r="3.6"/></g>' +
      '<rect x="40" y="24" width="18" height="6.5" rx="3" fill="#111"/><path d="M42 26 h5" stroke="#ff7ac8" stroke-width="1.4"/><path d="M44 35 C47 38 52 38 55 35" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>',

    bailarin: '<svg viewBox="0 -4 80 114">' +
      '<g class="og-sway-body">' +
      '<g class="og-leg-a" style="--ox:30px;--oy:70px"><rect x="26" y="68" width="9" height="32" rx="4" fill="#5a2d82"/><path d="M24 98 h13 l-1 8 h-3 l-1 -4 h-8 z" fill="#ff4fa3"/></g>' +
      '<g class="og-leg-b" style="--ox:44px;--oy:70px"><rect x="40" y="68" width="9" height="32" rx="4" fill="#6d3a9c"/><path d="M38 98 h13 l-1 8 h-3 l-1 -4 h-8 z" fill="#ff4fa3"/></g>' +
      '<rect x="24" y="38" width="28" height="34" rx="10" fill="#f5b301" stroke="#b07f00" stroke-width="1.2"/><g fill="#fff6b0"><circle cx="32" cy="48" r="1.4"/><circle cx="42" cy="54" r="1.4"/><circle cx="34" cy="62" r="1.4"/><circle cx="46" cy="44" r="1.2"/></g>' +
      '<g class="og-armup" style="transform-origin:50px 42px"><path d="M50 42 L66 20" stroke="#f0c8a0" stroke-width="5.5" stroke-linecap="round"/>' +
        '<path d="M66 20 L52 6 A22 22 0 0 1 80 10 Z" fill="#fff" stroke="#c9b6e0" stroke-width="1"/><path d="M66 20 L56 4 M66 20 L64 0 M66 20 L74 2 M66 20 L80 10" stroke="#a21caf" stroke-width="1"/></g>' +
      '<path d="M26 46 L18 62" stroke="#f0c8a0" stroke-width="5.5" stroke-linecap="round"/>' +
      '<g fill="#ff7ac8"><circle cx="20" cy="40" r="5.5"/><circle cx="27" cy="37" r="6"/><circle cx="36" cy="36" r="6"/><circle cx="45" cy="37" r="6"/><circle cx="52" cy="41" r="5.5"/><circle cx="19" cy="49" r="5"/><circle cx="17" cy="58" r="4.6"/><circle cx="15" cy="67" r="4.2"/></g>' +
      '<circle cx="38" cy="22" r="11.5" fill="#f0c8a0"/><path d="M26 24 C24 6 52 6 50 24 C48 14 28 14 26 24 Z" fill="#b266ff"/><path d="M26 22 C22 32 24 42 28 44 C28 36 28 28 30 22 Z" fill="#b266ff"/>' +
      '<g fill="#ff4fa3"><path d="M30 21 q4 -4 7 0 q-1 5 -3.5 6 q-2.5 -1 -3.5 -6z"/><path d="M39 21 q4 -4 7 0 q-1 5 -3.5 6 q-2.5 -1 -3.5 -6z"/></g><path d="M33 33 C36 36 41 36 44 33" stroke="#c0245a" stroke-width="1.8" fill="none" stroke-linecap="round"/></g></svg>'
  };

  var running = false, raf = 0, last = 0, W = 0, H = 0, dpr = 1;
  var canvas, ctx, pieces = [], ro = null, placeTimers = [], layer, bunting, resizeT = 0;
  function rnd(a, b) { return a + Math.random() * (b - a); }

  function critter(kind, w, o) {
    var outer = document.createElement('div'), rtl = !!o.rtl;
    outer.className = 'og-item ' + (o.cls || 'og-walk-' + (rtl ? 'rtl' : 'ltr'));
    outer.style.width = w + 'px';
    outer.style.cssText += ';' + (o.bottom != null ? 'bottom:' + o.bottom + ';' : '') + (o.left ? 'left:' + o.left + ';' : '') + (o.vars || '');
    var inner = document.createElement('div');
    inner.className = (rtl ? 'og-flip ' : '') + (o.inner || '');
    inner.innerHTML = OSVG[kind];
    outer.appendChild(inner); layer.appendChild(outer);
  }
  function addCritters() {
    critter('float', 230, { cls: 'og-float', bottom: '2px', vars: '--cd:120s;--dl:-112s;' });
    critter('balloons', 52, { cls: 'og-item og-balloons', left: '16%', inner: 'og-drift', vars: '--cd:90s;--dl:-80s;' });
    critter('balloons', 44, { cls: 'og-item og-balloons', left: '70%', inner: 'og-drift', vars: '--cd:110s;--dl:-60s;' });
    critter('flag', 62, { bottom: '2px', rtl: false, vars: '--d:64s;--dl:-10s;' });
    critter('bailarin', 56, { bottom: '2px', rtl: true, inner: '', vars: '--d:82s;--dl:-46s;' });
  }

  // ── Confeti: rectángulos que giran, redondos, serpentinas y corazones ──
  function newPiece(initial) {
    var r = Math.random(), type, s;
    if (r < 0.5)       { type = 0; s = rnd(3.5, 7); }
    else if (r < 0.7)  { type = 1; s = rnd(2, 3.8); }
    else if (r < 0.88) { type = 2; s = rnd(8, 15); }
    else               { type = 3; s = rnd(4, 7); }
    return { x: rnd(0, W), y: initial ? rnd(0, H) : -rnd(6, 20), s: s, type: type, ci: Math.floor(Math.random() * CONF.length),
             vy: rnd(26, 52), amp: rnd(6, 22), fr: rnd(0.8, 1.8), ph: rnd(0, 6.28), rot: rnd(0, 6.28), vr: rnd(-3, 3), a: rnd(0.8, 1) };
  }
  function target() { return Math.max(24, Math.min(60, Math.round(W * H / 17000))); }
  function resize() {
    if (!canvas) return;
    var w = layer.clientWidth, h = layer.clientHeight;
    if (!w || !h) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = w; H = h;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = target();
    while (pieces.length < n) pieces.push(newPiece(true));
    if (pieces.length > n) pieces.length = n;
  }
  function drawPiece(f, dark) {
    var c = CONF[f.ci]; if (c === '#ffffff' && !dark) c = '#ff4fa3';
    ctx.save(); ctx.translate(f.sx, f.y); ctx.globalAlpha = f.a; ctx.fillStyle = c; ctx.strokeStyle = c;
    if (f.type === 0) {                      // rectángulo que gira en 3D
      ctx.rotate(f.rot); ctx.scale(1, Math.cos(f.ph * 2.2)); ctx.fillRect(-f.s, -f.s * 0.5, f.s * 2, f.s);
    } else if (f.type === 1) {               // redondo
      ctx.beginPath(); ctx.arc(0, 0, f.s, 0, 6.2832); ctx.fill();
    } else if (f.type === 2) {               // serpentina
      ctx.rotate(f.rot * 0.3); ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.beginPath();
      for (var i = 0; i <= 8; i++) { var t = i / 8; var px = Math.sin(t * 9 + f.ph * 2) * 3, py = (t - 0.5) * f.s * 2; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
      ctx.stroke();
    } else {                                 // corazón
      ctx.rotate(f.rot * 0.2); var s = f.s; ctx.beginPath();
      ctx.moveTo(0, s * 0.35); ctx.bezierCurveTo(-s * 1.3, -s * 0.5, -s * 0.4, -s * 1.3, 0, -s * 0.4);
      ctx.bezierCurveTo(s * 0.4, -s * 1.3, s * 1.3, -s * 0.5, 0, s * 0.35); ctx.fill();
    }
    ctx.restore();
  }
  function frame(t) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    var dt = Math.min(0.05, (t - last) / 1000); last = t;
    if (!W || !H) { resize(); return; }
    var dark = document.body.classList.contains('dark'), wind = Math.sin(t / 4500) * 10;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < pieces.length; i++) {
      var f = pieces[i];
      f.y += f.vy * dt; f.x += wind * dt; f.ph += f.fr * dt; f.rot += f.vr * dt;
      if (f.x < -20) f.x = W + 20; else if (f.x > W + 20) f.x = -20;
      f.sx = f.x + Math.sin(f.ph) * f.amp;
      if (f.y > H + 16) pieces[i] = newPiece(false); else drawPiece(f, dark);
    }
  }

  // ── Banderines de colores colgando bajo la barra de arriba ──
  function buildBunting() {
    var w = window.innerWidth, sw = 80, d = 11, n = Math.ceil(w / sw) + 1, i, p, path = 'M0 1', flags = '', idx = 0;
    for (i = 0; i < n; i++) path += ' Q' + (i * sw + sw / 2) + ' ' + (2 * d + 1) + ' ' + ((i + 1) * sw) + ' 1';
    for (i = 0; i < n; i++) {
      for (p = 0; p < 5; p++) {
        var t = 0.1 + p * 0.2, x = i * sw + t * sw, y = 1 + 4 * d * t * (1 - t), c = idx % 6;
        flags += '<g class="og-sway" style="transform-origin:' + x.toFixed(1) + 'px ' + y.toFixed(1) + 'px;animation-delay:-' + ((idx * 0.37) % 2.2).toFixed(2) + 's"><path d="M' + (x - 6).toFixed(1) + ' ' + y.toFixed(1) + ' L' + (x + 6).toFixed(1) + ' ' + y.toFixed(1) + ' L' + x.toFixed(1) + ' ' + (y + 16).toFixed(1) + ' Z" fill="' + RB[c] + '" stroke="rgba(0,0,0,.2)" stroke-width=".6"/></g>';
        idx++;
      }
    }
    bunting.innerHTML = '<svg viewBox="0 0 ' + w + ' 40" width="' + w + '" height="40" preserveAspectRatio="xMinYMin meet"><path d="' + path + '" fill="none" stroke="#7a6a90" stroke-width="1.4"/>' + flags + '</svg>';
  }

  function addRingBg() {
    var sheet = document.getElementById('timerSheet');
    if (!sheet || sheet.querySelector('.og-ring-bg')) return;
    var bg = document.createElement('div');
    bg.className = 'og-ring-bg'; bg.setAttribute('aria-hidden', 'true');
    bg.innerHTML = ringSvg();
    sheet.insertBefore(bg, sheet.firstChild);
  }

  function place() {
    var tb = document.getElementById('mainTopbar') || document.querySelector('.topbar');
    var nav = document.querySelector('.bottom-nav');
    var root = document.documentElement.style;
    if (tb) root.setProperty('--og-top', Math.round(tb.getBoundingClientRect().bottom) + 'px');
    if (nav) root.setProperty('--og-bottom', Math.round(nav.getBoundingClientRect().height) + 'px');
    resize();
  }
  function onResize() { clearTimeout(resizeT); resizeT = setTimeout(function () { place(); buildBunting(); }, 120); }

  function start() {
    if (running) return;
    running = true;
    window.MODE_THEME_COLORS = COLORS;
    addRingBg();
    layer = document.createElement('div'); layer.id = 'ogLayer'; layer.setAttribute('aria-hidden', 'true');
    canvas = document.createElement('canvas'); layer.appendChild(canvas); ctx = canvas.getContext('2d');
    addCritters();
    bunting = document.createElement('div'); bunting.id = 'ogBunting'; bunting.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer); document.body.appendChild(bunting);
    place(); buildBunting();
    window.addEventListener('resize', onResize);
    [300, 1200, 3000].forEach(function (t) { placeTimers.push(setTimeout(function () { place(); buildBunting(); }, t)); });
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
    [layer, bunting].forEach(function (e) { if (e) e.remove(); });
    layer = bunting = canvas = ctx = null; pieces = []; W = H = 0;
    var bg = document.querySelector('.og-ring-bg'); if (bg) bg.remove();
    var root = document.documentElement.style; root.removeProperty('--og-top'); root.removeProperty('--og-bottom');
    if (window.MODE_THEME_COLORS === COLORS) window.MODE_THEME_COLORS = null;
  }
  window.SeasonOrgullo = { start: start, stop: stop };
})();
