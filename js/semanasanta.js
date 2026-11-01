/* 🕯️ MODO SEMANA SANTA — lo activa o desactiva el admin (Admin → Sistema → Modo de temporada).
   Colgaduras moradas con flecos bajo la barra de arriba, velas sobre el menú, incienso y pétalos
   (canvas), y por la pantalla: nazarenos en procesión, un paso de palio con costaleros, un tambor,
   palomas y una torrija saltarina. En la alarma: procesión nocturna. Se carga solo cuando está
   activo (app.js: applySeason). Expone window.SeasonSemanaSanta = { start, stop }. */
(function () {
  'use strict';
  var COLORS = { light: '#240E3C', dark: '#0F0A15' }; // barra de estado del móvil
  var GOLD = '#d4af37';

  function flame(x, y, k, cls) { // llama de vela (x, y = base)
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + (k || 1) + ')"><path class="ss-flame ' + (cls || '') + '" d="M0 -9 C-3.6 -4.6 -2.6 -0.6 0 0.4 C2.6 -0.6 3.6 -4.6 0 -9Z" fill="#ffb347"/><path d="M0 -5.6 C-1.4 -3.6 -1 -1.6 0 -1 C1 -1.6 1.4 -3.6 0 -5.6Z" fill="#fff3b0"/></g>';
  }
  // Nazareno: túnica, capirote, capa, cinturón y cirio. (0,0) = punta del capirote.
  function naz(x, y, k, c, o) {
    o = o || {};
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')"><g class="ss-sway" style="animation-delay:-' + ((x * 7) % 13) / 10 + 's">' +
      '<path d="M-17 44 C-24 70 -26 100 -28 122 H28 C26 100 24 70 17 44 Z" fill="' + c.cape + '"/>' +
      '<path d="M-12 40 C-16 64 -20 96 -22 122 H22 C20 96 16 64 12 40 Z" fill="' + c.robe + '" stroke="rgba(0,0,0,.25)" stroke-width="1"/>' +
      '<path d="M-12 38 C-22 42 -20 54 -19 62 L19 62 C20 54 22 42 12 38 Z" fill="' + c.robe + '"/>' +
      '<path d="M0 -2 L-9 36 H9 Z" fill="' + c.cone + '" stroke="rgba(0,0,0,.3)" stroke-width="1" stroke-linejoin="round"/><ellipse cx="0" cy="37" rx="10" ry="6.4" fill="' + c.cone + '"/>' +
      '<ellipse cx="-3.7" cy="36" rx="1.7" ry="2.3" fill="#0b0614"/><ellipse cx="3.7" cy="36" rx="1.7" ry="2.3" fill="#0b0614"/>' +
      '<rect x="-14" y="72" width="28" height="5" fill="' + c.acc + '"/><path d="M8 77 v15" stroke="' + c.acc + '" stroke-width="2.6"/><circle cx="8" cy="93" r="2" fill="' + c.acc + '"/>' +
      (o.noCandle ? '' :
        '<path d="M12 52 L24 64" stroke="' + c.robe + '" stroke-width="7" stroke-linecap="round"/><rect x="23" y="40" width="4.4" height="30" rx="1" fill="#f2e6c8"/>' + flame(25.2, 40, 1, 'f' + (1 + Math.round(x) % 3)) + '<circle cx="25" cy="65" r="3.4" fill="#f4efe6"/>') +
      '<ellipse cx="-8" cy="123" rx="6" ry="2.6" fill="#15101c"/><ellipse cx="8" cy="123" rx="6" ry="2.6" fill="#15101c"/></g></g>';
  }
  var PURPLE = { robe: '#5b2a86', cone: '#4a2070', cape: '#3d1a63', acc: GOLD };
  var WHITE  = { robe: '#f3ede0', cone: '#f3ede0', cape: '#2a1a3a', acc: '#7a1fa2' };
  var WINE   = { robe: '#8a1530', cone: '#8a1530', cape: '#5e0f22', acc: GOLD };

  function fringe(x0, x1, y, h) { var s = '', x; for (x = x0; x <= x1; x += 5) s += '<line x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="' + (y + h) + '" stroke="' + GOLD + '" stroke-width="1.4"/>'; return s; }
  var P = '', FEET = '', i;
  for (i = 0; i < 9; i++) { P += '<path d="M' + (34 + i * 21.8) + ' 22 q10.9 14 21.8 0" fill="#f6ecd0" stroke="' + GOLD + '" stroke-width="1.4"/>'; }
  for (i = 0; i < 9; i++) { FEET += '<g class="ss-feet-' + (i % 2 ? 'b' : 'a') + '"><ellipse cx="' + (40 + i * 22) + '" cy="143" rx="7" ry="3.2" fill="#15101c"/></g>'; }
  var FL = '';
  for (i = 0; i < 12; i++) { FL += '<circle cx="' + (72 + i * 10.5) + '" cy="' + (100 + (i % 2) * 2) + '" r="5" fill="' + ['#d62839', '#fff', '#ff8fa8'][i % 3] + '" stroke="rgba(0,0,0,.15)" stroke-width=".6"/>'; }
  var CN = '';
  for (i = 0; i < 8; i++) { var cx = 66 + i * 18; CN += '<rect x="' + (cx - 1.6) + '" y="84" width="3.2" height="14" fill="#f2e6c8"/>' + flame(cx, 84, 0.9, 'f' + (1 + i % 3)); }
  var RAYS = '';
  for (i = 0; i < 12; i++) { var a = i * Math.PI / 6; RAYS += 'M' + (130 + Math.cos(a) * 11).toFixed(1) + ' ' + (44 + Math.sin(a) * 11).toFixed(1) + ' L' + (130 + Math.cos(a) * 17).toFixed(1) + ' ' + (44 + Math.sin(a) * 17).toFixed(1) + ' '; }

  var SVG = {
    nazarenos: '<svg viewBox="0 0 200 130">' + naz(36, 12, 0.88, PURPLE) + naz(100, 4, 0.96, WHITE) + naz(164, 12, 0.88, WINE) + '</svg>',

    paso: '<svg viewBox="0 0 260 150"><g class="ss-rock">' +
      '<ellipse cx="130" cy="64" rx="76" ry="44" fill="#ffe9a6" opacity=".22"/>' +
      '<g stroke="' + GOLD + '" stroke-width="3"><line x1="44" y1="22" x2="44" y2="102"/><line x1="98" y1="22" x2="98" y2="102"/><line x1="162" y1="22" x2="162" y2="102"/><line x1="216" y1="22" x2="216" y2="102"/></g>' +
      '<path d="M30 14 Q130 -6 230 14 L226 22 H34 Z" fill="#f6ecd0" stroke="' + GOLD + '" stroke-width="2"/>' + P +
      '<path d="M130 36 C112 48 100 76 98 100 H162 C160 76 148 48 130 36 Z" fill="#2a4a9a" stroke="#1b3272" stroke-width="1.4"/>' +
      '<path d="M130 36 C120 40 116 52 118 64 C126 58 134 58 142 64 C144 52 140 40 130 36 Z" fill="#f6efe0"/><circle cx="130" cy="44" r="5.4" fill="#f1d5bb"/>' +
      '<circle cx="130" cy="44" r="11" fill="none" stroke="#ffd23f" stroke-width="1.6"/><path d="' + RAYS + '" stroke="#ffd23f" stroke-width="1.6" stroke-linecap="round"/>' +
      CN + FL +
      '<rect x="26" y="104" width="208" height="12" rx="3" fill="#3d1a63" stroke="' + GOLD + '" stroke-width="1.6"/>' +
      '<path d="M24 116 H236 V134 H24 Z" fill="#5b2a86"/><path d="M24 124 H236" stroke="' + GOLD + '" stroke-width="1.4"/>' + fringe(26, 234, 134, 5) +
      '</g>' + FEET + '</svg>',

    tambor: '<svg viewBox="-34 -2 100 130">' + naz(0, 0, 1, { robe: '#f3ede0', cone: '#1d1228', cape: '#3d1a63', acc: GOLD }, { noCandle: true }) +
      '<path d="M-7 56 L6 64" stroke="#f3ede0" stroke-width="7" stroke-linecap="round"/>' +
      '<g class="ss-stick" style="--ox:9px;--oy:52px"><path d="M9 52 L20 66" stroke="#f3ede0" stroke-width="7" stroke-linecap="round"/><path d="M20 66 L34 56" stroke="#e8d8a8" stroke-width="2.4" stroke-linecap="round"/><circle cx="35" cy="55" r="2.6" fill="#e8d8a8"/><circle cx="20" cy="67" r="3.3" fill="#f4efe6"/></g>' +
      '<g class="ss-stick b" style="--ox:-9px;--oy:52px"><path d="M-9 52 L8 70" stroke="#f3ede0" stroke-width="7" stroke-linecap="round"/><path d="M8 70 L22 62" stroke="#e8d8a8" stroke-width="2.4" stroke-linecap="round"/><circle cx="23" cy="61" r="2.6" fill="#e8d8a8"/></g>' +
      '<rect x="8" y="64" width="34" height="26" rx="3" fill="#5b2a86" stroke="' + GOLD + '" stroke-width="1.6"/><ellipse cx="25" cy="64" rx="17" ry="5.4" fill="#f4efe6" stroke="' + GOLD + '" stroke-width="1.6"/>' +
      '<path d="M12 68 L22 88 M20 66 L30 88 M28 66 L38 88 M36 68 L40 82" stroke="#d4af37" stroke-width="1.2" opacity=".8"/></svg>',

    torrija: '<svg viewBox="0 0 64 62">' +
      '<rect x="8" y="50" width="9" height="9" rx="3" fill="#8a5a22"/><rect x="40" y="50" width="9" height="9" rx="3" fill="#8a5a22"/>' +
      '<rect x="4" y="8" width="56" height="46" rx="15" fill="#c98a2a" stroke="#8a5a22" stroke-width="1.5"/><rect x="9" y="13" width="46" height="36" rx="12" fill="#f0b94d"/>' +
      '<ellipse cx="26" cy="21" rx="15" ry="6" fill="#f8d27a" opacity=".65"/>' +
      '<g fill="#fff"><circle cx="16" cy="19" r="1.2"/><circle cx="30" cy="16" r="1.2"/><circle cx="44" cy="21" r="1.2"/><circle cx="22" cy="26" r="1"/><circle cx="48" cy="28" r="1"/></g>' +
      '<g fill="#8a4a1a"><circle cx="20" cy="17" r="1"/><circle cx="36" cy="19" r="1.1"/><circle cx="14" cy="25" r="1"/><circle cx="42" cy="15" r="1"/></g>' +
      '<path d="M12 23 C20 29 26 21 34 27 C42 33 48 25 54 29" stroke="#ffcf4a" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M46 29 q-1 8 2 10 q3 -2 2 -10z" fill="#ffcf4a"/>' +
      '<circle cx="23" cy="36" r="2.5" fill="#3a2210"/><circle cx="39" cy="36" r="2.5" fill="#3a2210"/><circle cx="23.8" cy="35.2" r=".8" fill="#fff"/><circle cx="39.8" cy="35.2" r=".8" fill="#fff"/>' +
      '<path d="M26 41 q5 5 10 0" stroke="#3a2210" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="17" cy="41" r="3" fill="#ff8f7a" opacity=".55"/><circle cx="46" cy="41" r="3" fill="#ff8f7a" opacity=".55"/></svg>',

    paloma: '<svg viewBox="0 0 100 64">' +
      '<g class="ss-wing" style="opacity:.8"><path d="M44 30 C36 10 20 2 10 6 C18 14 22 22 26 30 Z" fill="#e8e3f0" stroke="#b9b0cc" stroke-width="1"/></g>' +
      '<path d="M28 34 L6 28 L9 36 L5 43 L28 39 Z" fill="#fff" stroke="#b9b0cc" stroke-width="1" stroke-linejoin="round"/>' +
      '<ellipse cx="46" cy="34" rx="21" ry="11" fill="#fff" stroke="#b9b0cc" stroke-width="1.2"/><circle cx="68" cy="28" r="8.4" fill="#fff" stroke="#b9b0cc" stroke-width="1.2"/>' +
      '<path d="M75 27 L84 30 L75 32.4 Z" fill="#f2a33a"/><circle cx="70" cy="26" r="1.5" fill="#2a2030"/>' +
      '<path d="M83 31 q8 7 14 3" stroke="#5a7a2a" stroke-width="1.6" fill="none"/><g fill="#6f9a30"><ellipse cx="88" cy="37" rx="4" ry="2" transform="rotate(40 88 37)"/><ellipse cx="93" cy="31" rx="4" ry="2" transform="rotate(-30 93 31)"/><ellipse cx="96" cy="37" rx="3.6" ry="1.8" transform="rotate(30 96 37)"/></g>' +
      '<g class="ss-wing"><path d="M46 30 C38 6 20 -4 8 0 C18 10 24 20 28 30 Z" fill="#fff" stroke="#b9b0cc" stroke-width="1.2"/><path d="M40 28 C34 16 26 8 18 6 M44 28 C38 14 30 6 22 3" stroke="#d3cce4" stroke-width="1" fill="none"/></g></svg>'
  };

  // ── Alarma: procesión nocturna ──
  function nazSil(x, y, k, col, rim) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')"><path d="M0 0 L-10 40 H10 Z" fill="' + col + '" stroke="' + rim + '" stroke-width="1.2"/><path d="M-12 40 C-22 44 -20 56 -19 62 L-26 150 H26 L19 62 C20 56 22 44 12 40 Z" fill="' + col + '" stroke="' + rim + '" stroke-width="1.2"/>' +
      '<rect x="22" y="44" width="4.4" height="34" rx="1" fill="#f2e6c8"/>' + flame(24.2, 44, 1.3, 'f' + (1 + Math.round(x) % 3)) + '<circle cx="24" cy="44" r="14" fill="#ffb347" opacity=".18"/></g>';
  }
  function ringSvg() {
    var s = '<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMax meet"><defs>' +
      '<linearGradient id="ssSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0614"/><stop offset=".6" stop-color="#2a1245"/><stop offset="1" stop-color="#4a1a52"/></linearGradient>' +
      '<radialGradient id="ssGold" r=".5"><stop offset="0" stop-color="#ffd878" stop-opacity=".75"/><stop offset="1" stop-color="#ff9a30" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="400" height="600" fill="url(#ssSky)"/><circle cx="330" cy="70" r="26" fill="#f3e9d2"/><circle cx="322" cy="64" r="5" fill="#d9ccb0" opacity=".6"/>' +
      '<g fill="#fff" opacity=".8"><circle cx="40" cy="40" r="1.4"/><circle cx="150" cy="60" r="1.2"/><circle cx="230" cy="30" r="1.5"/><circle cx="270" cy="90" r="1.1"/><circle cx="380" cy="130" r="1.3"/><circle cx="110" cy="130" r="1.1"/></g>' +
      // iglesia con campanario a la izquierda
      '<g fill="#0a0612"><path d="M18 150 L62 66 L106 150 Z"/><rect x="18" y="150" width="88" height="292"/><rect x="0" y="330" width="180" height="112"/><path d="M0 330 L90 290 L180 330 Z"/><rect x="300" y="300" width="100" height="142"/></g>' +
      '<path d="M42 244 V190 a20 20 0 0 1 40 0 V244 Z" fill="#1c1030"/><g class="ssr-bell"><line x1="62" y1="170" x2="62" y2="186" stroke="#7a6a50" stroke-width="2"/><path d="M50 214 C50 198 55 188 62 186 C69 188 74 198 74 214 Z" fill="#d4af37" stroke="#8a6d1c"/><circle cx="62" cy="217" r="3.2" fill="#8a6d1c"/></g>' +
      '<g fill="#ffcf6a" opacity=".85"><rect x="30" y="360" width="10" height="20" rx="5"/><rect x="60" y="360" width="10" height="20" rx="5"/><rect x="90" y="360" width="10" height="20" rx="5"/><rect x="318" y="326" width="9" height="16"/><rect x="346" y="326" width="9" height="16"/><rect x="372" y="326" width="9" height="16"/><rect x="318" y="366" width="9" height="16"/><rect x="346" y="366" width="9" height="16"/></g>' +
      '<rect y="440" width="400" height="160" fill="#0a0612"/><ellipse cx="200" cy="470" rx="190" ry="36" fill="#ffb347" opacity=".14"/>' +
      '<ellipse class="ssr-glow" cx="200" cy="380" rx="130" ry="110" fill="url(#ssGold)"/>';
    // paso de palio (centro)
    var i, v = '', cn = '';
    for (i = 0; i < 8; i++) v += '<path d="M' + (104 + i * 24) + ' 274 q12 16 24 0" fill="#f6ecd0" stroke="' + GOLD + '" stroke-width="1.4"/>';
    for (i = 0; i < 9; i++) cn += '<rect x="' + (123 + i * 19.4 - 1.6) + '" y="428" width="3.2" height="14" fill="#f2e6c8"/>' + flame(123 + i * 19.4, 428, 1.1, 'f' + (1 + i % 3));
    s += '<g class="ssr-rock"><g stroke="' + GOLD + '" stroke-width="3"><line x1="116" y1="276" x2="116" y2="446"/><line x1="166" y1="276" x2="166" y2="446"/><line x1="234" y1="276" x2="234" y2="446"/><line x1="284" y1="276" x2="284" y2="446"/></g>' +
      '<path d="M100 262 Q200 232 300 262 L294 274 H106 Z" fill="#f6ecd0" stroke="' + GOLD + '" stroke-width="2"/>' + v +
      '<path d="M200 308 C176 324 162 368 160 430 H240 C238 368 224 324 200 308 Z" fill="#2a4a9a" stroke="#1b3272" stroke-width="1.6"/><path d="M200 308 C189 313 185 326 187 338 C194 332 206 332 213 338 C215 326 211 313 200 308 Z" fill="#f6efe0"/><circle cx="200" cy="316" r="7" fill="#f1d5bb"/>' +
      '<circle cx="200" cy="316" r="14" fill="none" stroke="#ffd23f" stroke-width="2"/><g stroke="#ffd23f" stroke-width="2" stroke-linecap="round">';
    for (i = 0; i < 12; i++) { var a = i * Math.PI / 6; s += '<line x1="' + (200 + Math.cos(a) * 15).toFixed(1) + '" y1="' + (316 + Math.sin(a) * 15).toFixed(1) + '" x2="' + (200 + Math.cos(a) * 23).toFixed(1) + '" y2="' + (316 + Math.sin(a) * 23).toFixed(1) + '"/>'; }
    s += '</g>' + cn + '<g>';
    for (i = 0; i < 14; i++) s += '<circle cx="' + (120 + i * 12.4) + '" cy="' + (446 + (i % 2) * 2) + '" r="5.4" fill="' + ['#d62839', '#fff', '#ff8fa8'][i % 3] + '"/>';
    s += '</g><rect x="106" y="450" width="188" height="14" rx="3" fill="#3d1a63" stroke="' + GOLD + '" stroke-width="1.6"/><path d="M102 464 H298 V492 H102 Z" fill="#5b2a86"/><path d="M102 474 H298" stroke="' + GOLD + '" stroke-width="1.4"/>';
    for (var x = 104; x <= 296; x += 6) s += '<line x1="' + x + '" y1="492" x2="' + x + '" y2="498" stroke="' + GOLD + '" stroke-width="1.4"/>';
    s += '</g>';
    // nazarenos a los lados, en perspectiva
    s += nazSil(36, 430, 1.25, '#12091c', '#6a3a9a') + nazSil(86, 452, 1.0, '#190d26', '#7a4aa8') + nazSil(366, 432, 1.25, '#12091c', '#6a3a9a') + nazSil(318, 454, 1.0, '#190d26', '#7a4aa8');
    // incienso
    s += '<g fill="#cfc4e6"><ellipse class="ssr-smoke" cx="196" cy="250" rx="22" ry="14"/><ellipse class="ssr-smoke s2" cx="226" cy="250" rx="26" ry="15"/><ellipse class="ssr-smoke s3" cx="170" cy="252" rx="20" ry="13"/></g>';
    return s + '</svg>';
  }

  var running = false, raf = 0, last = 0, W = 0, H = 0, dpr = 1;
  var canvas, ctx, petals = [], smoke = [], ro = null, placeTimers = [], layer, drapes, candles, resizeT = 0;
  function rnd(a, b) { return a + Math.random() * (b - a); }

  function critter(kind, w, o) {
    var outer = document.createElement('div'), rtl = !!o.rtl;
    outer.className = 'ss-item ' + (o.cls || 'ss-walk-' + (rtl ? 'rtl' : 'ltr'));
    outer.style.width = w + 'px';
    outer.style.cssText += ';' + (o.bottom != null ? 'bottom:' + o.bottom + ';' : 'top:' + o.top + ';') + (o.vars || '');
    var inner = document.createElement('div');
    inner.className = (rtl ? 'ss-flip ' : '') + (o.inner || '');
    inner.innerHTML = SVG[kind];
    outer.appendChild(inner); layer.appendChild(outer);
  }
  function addCritters() {
    critter('paloma', 58, { top: '6%',  rtl: false, inner: 'ss-fly', vars: '--d:38s;--dl:-9s;' });
    critter('paloma', 46, { top: '24%', rtl: true,  inner: 'ss-fly', vars: '--d:54s;--dl:-30s;' });
    critter('paso', 190, { cls: 'ss-paso', bottom: '2px', vars: '--cd:140s;--dl:-132s;' });
    critter('nazarenos', 168, { bottom: '2px', rtl: false, vars: '--d:112s;--dl:-48s;' });
    critter('tambor', 60, { bottom: '2px', rtl: true, vars: '--d:84s;--dl:-20s;' });
    critter('torrija', 40, { bottom: '2px', rtl: false, inner: 'ss-hop', vars: '--d:62s;--dl:-6s;' });
  }

  // ── Pétalos (claveles rojos, azahar blanco y rosa) e incienso subiendo ──
  var PET = ['#d62839', '#e8394a', '#ffffff', '#ff8fa8', '#f6ecd0'];
  function newPetal(initial) {
    return { x: rnd(0, W), y: initial ? rnd(0, H) : -rnd(6, 20), s: rnd(3, 6.5), ci: Math.floor(Math.random() * PET.length), vy: rnd(18, 34), amp: rnd(8, 26), fr: rnd(0.6, 1.4), ph: rnd(0, 6.28), rot: rnd(0, 6.28), vr: rnd(-2, 2), a: rnd(0.8, 1) };
  }
  function newSmoke(initial) {
    var life = rnd(7, 11);
    return { x: rnd(0.08, 0.92) * W, y: initial ? rnd(H * 0.4, H) : H + 20, r: rnd(14, 26), age: initial ? rnd(0, life) : 0, life: life, vy: rnd(14, 24), amp: rnd(8, 20), ph: rnd(0, 6.28) };
  }
  function resize() {
    if (!canvas) return;
    var w = layer.clientWidth, h = layer.clientHeight;
    if (!w || !h) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = w; H = h;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.max(16, Math.min(36, Math.round(W * H / 24000))), m = Math.max(5, Math.min(9, Math.round(W / 70)));
    while (petals.length < n) petals.push(newPetal(true));
    if (petals.length > n) petals.length = n;
    while (smoke.length < m) smoke.push(newSmoke(true));
    if (smoke.length > m) smoke.length = m;
  }
  function frame(t) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    var dt = Math.min(0.05, (t - last) / 1000); last = t;
    if (!W || !H) { resize(); return; }
    var dark = document.body.classList.contains('dark'), wind = Math.sin(t / 5500) * 7, i;
    ctx.clearRect(0, 0, W, H);
    // incienso: bolas suaves que suben, crecen y se desvanecen
    for (i = 0; i < smoke.length; i++) {
      var m = smoke[i]; m.age += dt; m.y -= m.vy * dt; m.ph += dt * 0.7;
      if (m.age > m.life) { smoke[i] = newSmoke(false); continue; }
      var p = m.age / m.life, r = m.r * (1 + p * 2.2), al = Math.sin(p * Math.PI) * (dark ? 0.2 : 0.17), x = m.x + Math.sin(m.ph) * m.amp;
      var g = ctx.createRadialGradient(x, m.y, 0, x, m.y, r);
      g.addColorStop(0, (dark ? 'rgba(215,205,235,' : 'rgba(130,110,150,') + al + ')'); g.addColorStop(1, (dark ? 'rgba(215,205,235,0)' : 'rgba(130,110,150,0)'));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, m.y, r, 0, 6.2832); ctx.fill();
    }
    // pétalos
    for (i = 0; i < petals.length; i++) {
      var f = petals[i];
      f.y += f.vy * dt; f.x += wind * dt; f.ph += f.fr * dt; f.rot += f.vr * dt;
      if (f.x < -20) f.x = W + 20; else if (f.x > W + 20) f.x = -20;
      if (f.y > H + 14) { petals[i] = newPetal(false); continue; }
      var c = PET[f.ci]; if ((c === '#ffffff' || c === '#f6ecd0') && !dark) c = '#ff8fa8';
      ctx.save(); ctx.translate(f.x + Math.sin(f.ph) * f.amp, f.y); ctx.rotate(f.rot); ctx.scale(1, Math.cos(f.ph * 1.7)); ctx.globalAlpha = f.a; ctx.fillStyle = c;
      ctx.beginPath(); ctx.ellipse(0, 0, f.s, f.s * 0.62, 0, 0, 6.2832); ctx.fill();
      ctx.restore();
    }
  }

  // ── Colgaduras moradas con flecos dorados bajo la barra de arriba ──
  function buildDrapes() {
    var w = window.innerWidth, sw = 92, d = 15, n = Math.ceil(w / sw) + 1, s = '', i, k;
    for (i = 0; i < n; i++) {
      var x0 = i * sw, x1 = x0 + sw, xm = x0 + sw / 2;
      s += '<path d="M' + x0 + ' 0 Q' + xm + ' ' + (2 * d) + ' ' + x1 + ' 0 Z" fill="#5b2a86"/>';
      for (k = 1; k <= 4; k++) { var t = k / 5, x = x0 + sw * t, y = 4 * d * t * (1 - t); s += '<path d="M' + x.toFixed(1) + ' 0 Q' + (x + (t - 0.5) * 6).toFixed(1) + ' ' + (y / 2).toFixed(1) + ' ' + x.toFixed(1) + ' ' + (y - 1).toFixed(1) + '" stroke="#7a43a8" stroke-width="1.6" fill="none"/>'; }
      s += '<path d="M' + x0 + ' 0 Q' + xm + ' ' + (2 * d) + ' ' + x1 + ' 0" stroke="' + GOLD + '" stroke-width="3" fill="none"/>';
      for (k = 0; k <= 18; k++) { var tt = k / 18, fx = x0 + sw * tt, fy = 4 * d * tt * (1 - tt); s += '<line x1="' + fx.toFixed(1) + '" y1="' + fy.toFixed(1) + '" x2="' + fx.toFixed(1) + '" y2="' + (fy + 5).toFixed(1) + '" stroke="' + GOLD + '" stroke-width="1.3"/>'; }
      s += '<g class="ss-tassel" style="transform-origin:' + x1 + 'px 0px"><circle cx="' + x1 + '" cy="2" r="3.4" fill="' + GOLD + '"/><path d="M' + (x1 - 3) + ' 5 L' + (x1 + 3) + ' 5 L' + (x1 + 4.4) + ' 19 L' + (x1 - 4.4) + ' 19 Z" fill="#b8902c"/>' + fringe(x1 - 4, x1 + 4, 19, 6) + '</g>';
    }
    drapes.innerHTML = '<svg viewBox="0 0 ' + w + ' 46" width="' + w + '" height="46" preserveAspectRatio="xMinYMin meet">' + s + '</svg>';
  }
  // ── Velas sobre el menú de abajo ──
  function buildCandles() {
    var w = candles.clientWidth || window.innerWidth, n = Math.max(3, Math.floor(w / 84)), s = '', i;
    for (i = 0; i < n; i++) {
      var x = (i + 0.5) * (w / n), h = 9 + (i * 5) % 8;
      s += '<rect x="' + (x - 2.6) + '" y="' + (34 - h) + '" width="5.2" height="' + h + '" rx="1" fill="#f2e6c8" stroke="#d8c89c" stroke-width=".6"/>' + flame(x, 34 - h, 1.1, 'f' + (1 + i % 3)) + '<ellipse cx="' + x + '" cy="' + (34 - h - 4) + '" rx="9" ry="9" fill="#ffb347" opacity=".13"/>';
    }
    candles.innerHTML = '<svg viewBox="0 0 ' + w + ' 34" width="' + w + '" height="34" preserveAspectRatio="xMinYMin meet">' + s + '</svg>';
  }

  function addRingBg() {
    var sheet = document.getElementById('timerSheet');
    if (!sheet || sheet.querySelector('.ss-ring-bg')) return;
    var bg = document.createElement('div');
    bg.className = 'ss-ring-bg'; bg.setAttribute('aria-hidden', 'true');
    bg.innerHTML = ringSvg();
    sheet.insertBefore(bg, sheet.firstChild);
  }

  function place() {
    var tb = document.getElementById('mainTopbar') || document.querySelector('.topbar');
    var nav = document.querySelector('.bottom-nav');
    var root = document.documentElement.style;
    if (tb) root.setProperty('--ss-top', Math.round(tb.getBoundingClientRect().bottom) + 'px');
    if (nav) {
      var r = nav.getBoundingClientRect();
      root.setProperty('--ss-bottom', Math.round(r.height) + 'px');
      root.setProperty('--ss-nl', Math.round(r.left) + 'px'); root.setProperty('--ss-nw', Math.round(r.width) + 'px');
    }
    resize();
  }
  function redo() { place(); if (drapes) buildDrapes(); if (candles) buildCandles(); }
  function onResize() { clearTimeout(resizeT); resizeT = setTimeout(redo, 120); }

  function start() {
    if (running) return;
    running = true;
    window.MODE_THEME_COLORS = COLORS;
    addRingBg();
    layer = document.createElement('div'); layer.id = 'ssLayer'; layer.setAttribute('aria-hidden', 'true');
    canvas = document.createElement('canvas'); layer.appendChild(canvas); ctx = canvas.getContext('2d');
    addCritters();
    drapes = document.createElement('div'); drapes.id = 'ssDrapes'; drapes.setAttribute('aria-hidden', 'true');
    candles = document.createElement('div'); candles.id = 'ssCandles'; candles.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer); document.body.appendChild(drapes); document.body.appendChild(candles);
    redo();
    window.addEventListener('resize', onResize);
    [300, 1200, 3000].forEach(function (t) { placeTimers.push(setTimeout(redo, t)); });
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
    [layer, drapes, candles].forEach(function (e) { if (e) e.remove(); });
    layer = drapes = candles = canvas = ctx = null; petals = []; smoke = []; W = H = 0;
    var bg = document.querySelector('.ss-ring-bg'); if (bg) bg.remove();
    var root = document.documentElement.style;
    ['--ss-top', '--ss-bottom', '--ss-nl', '--ss-nw'].forEach(function (p) { root.removeProperty(p); });
    if (window.MODE_THEME_COLORS === COLORS) window.MODE_THEME_COLORS = null;
  }
  window.SeasonSemanaSanta = { start: start, stop: stop };
})();
