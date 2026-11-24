/* 🎄 MODO NAVIDAD — lo activa o desactiva el admin (Admin → Sistema → Modo de temporada).
   Se carga solo cuando está activo (app.js: applySeason). Guirnalda de luces, bolas colgando, nieve
   acumulada abajo y una nevada de copos de distintas formas y tamaños (canvas), sin tapar ni bloquear
   nada. En la ventana de la alarma pone de fondo una ilustración nocturna: el trineo de Papá Noel cruza la luna sobre un pueblo nevado.
   Expone window.SeasonNavidad = { start, stop }. */
(function () {
  'use strict';
  var COLORS = { light: '#0A2E21', dark: '#0B1410' }; // barra de estado del móvil
  var BULBS = ['#ff3b3b', '#ffd23f', '#38d27a', '#4aa8ff'];
  var BALLS = [['#ff5a5a', '#a50f1c'], ['#ffe08a', '#b8860b'], ['#7cc4ff', '#1f5fa8'], ['#f4f6fa', '#8d98a8']];

  // ── Fondo de la alarma: ilustración nocturna — el trineo de Papá Noel cruza la luna sobre un pueblo nevado ──
  var SANTA_SVG = '<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMax meet"><defs>' +
    '<linearGradient id="xmSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1230"/><stop offset=".5" stop-color="#22377a"/><stop offset=".82" stop-color="#6b4a8e"/><stop offset="1" stop-color="#e9a77c"/></linearGradient>' +
    '<radialGradient id="xmMoon" r=".5"><stop offset="0" stop-color="#fff3c8" stop-opacity=".55"/><stop offset="1" stop-color="#fff3c8" stop-opacity="0"/></radialGradient></defs>' +
    '<rect width="400" height="600" fill="url(#xmSky)"/>' +
    '<g><circle class="xmr-star" cx="132" cy="52" r="0.9" fill="#fff" style="animation-delay:-0.3s"/><circle class="xmr-star" cx="214" cy="115" r="0.9" fill="#fff" style="animation-delay:-3.6s"/><circle class="xmr-star" cx="90" cy="33" r="1.9" fill="#fff" style="animation-delay:-0.3s"/><circle class="xmr-star" cx="43" cy="132" r="0.9" fill="#fff" style="animation-delay:-3.8s"/><circle class="xmr-star" cx="250" cy="178" r="0.9" fill="#fff" style="animation-delay:-2.3s"/><circle class="xmr-star" cx="160" cy="293" r="0.9" fill="#fff" style="animation-delay:-2.2s"/><circle class="xmr-star" cx="59" cy="130" r="0.9" fill="#fff" style="animation-delay:-2.3s"/><circle class="xmr-star" cx="223" cy="207" r="0.9" fill="#fff" style="animation-delay:-2.3s"/><circle class="xmr-star" cx="253" cy="117" r="0.9" fill="#fff" style="animation-delay:-2.3s"/><circle class="xmr-star" cx="246" cy="153" r="1.9" fill="#fff" style="animation-delay:-3.1s"/><circle class="xmr-star" cx="187" cy="278" r="1.5" fill="#fff" style="animation-delay:-1.2s"/><circle class="xmr-star" cx="313" cy="212" r="1.2" fill="#fff" style="animation-delay:-0.3s"/><circle class="xmr-star" cx="123" cy="153" r="1.5" fill="#fff" style="animation-delay:-2.9s"/><circle class="xmr-star" cx="119" cy="294" r="0.9" fill="#fff" style="animation-delay:-2.0s"/><circle class="xmr-star" cx="71" cy="108" r="1.9" fill="#fff" style="animation-delay:-1.7s"/><circle class="xmr-star" cx="377" cy="31" r="1.5" fill="#fff" style="animation-delay:-1.4s"/><circle class="xmr-star" cx="142" cy="153" r="1.9" fill="#fff" style="animation-delay:-0.3s"/><circle class="xmr-star" cx="44" cy="87" r="0.9" fill="#fff" style="animation-delay:-0.2s"/><circle class="xmr-star" cx="277" cy="197" r="1.9" fill="#fff" style="animation-delay:-1.1s"/><circle class="xmr-star" cx="156" cy="203" r="0.9" fill="#fff" style="animation-delay:-3.8s"/><circle class="xmr-star" cx="144" cy="186" r="1.9" fill="#fff" style="animation-delay:-0.2s"/><circle class="xmr-star" cx="303" cy="46" r="1.2" fill="#fff" style="animation-delay:-1.6s"/><circle class="xmr-star" cx="360" cy="153" r="1.2" fill="#fff" style="animation-delay:-1.8s"/><circle class="xmr-star" cx="219" cy="266" r="1.9" fill="#fff" style="animation-delay:-3.5s"/><circle class="xmr-star" cx="115" cy="129" r="1.5" fill="#fff" style="animation-delay:-2.7s"/><circle class="xmr-star" cx="154" cy="75" r="0.9" fill="#fff" style="animation-delay:-0.7s"/><circle class="xmr-star" cx="97" cy="76" r="1.9" fill="#fff" style="animation-delay:-3.3s"/><circle class="xmr-star" cx="78" cy="90" r="1.2" fill="#fff" style="animation-delay:-1.7s"/><circle class="xmr-star" cx="150" cy="173" r="1.2" fill="#fff" style="animation-delay:-2.8s"/><circle class="xmr-star" cx="206" cy="188" r="0.9" fill="#fff" style="animation-delay:-1.8s"/><circle class="xmr-star" cx="342" cy="286" r="1.9" fill="#fff" style="animation-delay:-1.6s"/><circle class="xmr-star" cx="159" cy="149" r="1.9" fill="#fff" style="animation-delay:-0.2s"/><circle class="xmr-star" cx="34" cy="69" r="1.2" fill="#fff" style="animation-delay:-0.4s"/><circle class="xmr-star" cx="239" cy="38" r="1.2" fill="#fff" style="animation-delay:-2.1s"/></g>' +
    '<circle cx="250" cy="175" r="150" fill="url(#xmMoon)"/><circle cx="250" cy="175" r="78" fill="#fdf1c9"/><g fill="#ecdba8" opacity=".6"><circle cx="226" cy="150" r="13"/><circle cx="276" cy="200" r="17"/><circle cx="214" cy="204" r="8"/><circle cx="288" cy="148" r="6"/></g>' +
    '<g class="xmr-fly"><g fill="#101736" stroke="#8fa6e8" stroke-width="1" stroke-opacity=".55"><path d="M2 0 Q10 -6 36 -10" stroke="#8fa6e8" stroke-width="1.4" fill="none"/><g transform="translate(112 176) scale(0.95)"><ellipse cx="0" cy="0" rx="21" ry="9"/><path d="M-14 -4 C-22 -10 -26 -16 -28 -22 L-20 -24 C-16 -16 -10 -8 -4 -6 Z"/><ellipse cx="-31" cy="-24" rx="8" ry="5.5" transform="rotate(-18 -31 -24)"/><path d="M-37 -23 L-44 -21 L-38 -18Z"/><path d="M-31 -29 L-34 -40 M-34 -40 L-40 -43 M-34 -40 L-33 -47 M-29 -29 L-27 -40 M-27 -40 L-22 -44" stroke="#101736" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M-14 6 L-30 18 L-27 21 L-9 10Z"/><path d="M-6 8 L-16 22 L-12 24 L0 10Z"/><path d="M12 7 L26 20 L30 17 L18 5Z"/><path d="M18 3 L36 9 L36 5 L20 -1Z"/><path d="M20 -3 L28 -8 L25 0Z"/></g><g transform="translate(160 184) scale(0.9)"><ellipse cx="0" cy="0" rx="21" ry="9"/><path d="M-14 -4 C-22 -10 -26 -16 -28 -22 L-20 -24 C-16 -16 -10 -8 -4 -6 Z"/><ellipse cx="-31" cy="-24" rx="8" ry="5.5" transform="rotate(-18 -31 -24)"/><path d="M-37 -23 L-44 -21 L-38 -18Z"/><path d="M-31 -29 L-34 -40 M-34 -40 L-40 -43 M-34 -40 L-33 -47 M-29 -29 L-27 -40 M-27 -40 L-22 -44" stroke="#101736" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M-14 6 L-30 18 L-27 21 L-9 10Z"/><path d="M-6 8 L-16 22 L-12 24 L0 10Z"/><path d="M12 7 L26 20 L30 17 L18 5Z"/><path d="M18 3 L36 9 L36 5 L20 -1Z"/><path d="M20 -3 L28 -8 L25 0Z"/></g><circle cx="120.4" cy="165.1" r="2.9" fill="#ff3b3b"/><circle cx="120.4" cy="165.1" r="6.3" fill="#ff6a5a" opacity=".35"/><path d="M196 168 Q184 176 180 182" stroke="#8fa6e8" stroke-width="1.3" fill="none" stroke-opacity=".7"/><path d="M206 176 L210 196 C214 208 238 210 256 210 L304 210 C318 210 324 200 322 186 L314 190 C308 184 300 180 290 180 Z"/><path d="M200 218 C210 222 292 222 318 218 C330 216 334 204 328 198" fill="none" stroke="#101736" stroke-width="3.2" stroke-linecap="round"/><path d="M222 210 L220 220 M290 210 L292 220" stroke="#101736" stroke-width="2.4"/><ellipse cx="238" cy="176" rx="17" ry="13"/><path d="M226 168 C232 162 246 162 252 170"/><circle cx="276" cy="166" r="8.5"/><path d="M268 162 L278 142 L288 160 Z"/><circle cx="279" cy="141" r="3.6" fill="#f4f8ff" stroke="none"/><path d="M270 172 q6 8 14 0 q-2 10 -7 10 q-5 0 -7 -10z" fill="#f4f8ff" stroke="none"/><path d="M284 178 q16 4 22 16" stroke="#101736" stroke-width="7" fill="none" stroke-linecap="round"/></g><g fill="#ffd86b" class="xmr-trail"><circle cx="340" cy="204" r="2.4"/><circle cx="356" cy="198" r="1.9"/><circle cx="371" cy="205" r="1.5"/><circle cx="384" cy="199" r="1.2"/><circle cx="348" cy="214" r="1.3"/></g></g>' +
    '<path d="M0 470 C60 440 130 448 200 462 C270 474 340 450 400 438 V600 H0 Z" fill="#2c4079"/>' +
    '<path d="M0 520 C70 498 150 512 220 506 C290 500 350 488 400 500 V600 H0 Z" fill="#e7eefb"/><path d="M0 560 C90 540 180 556 260 548 C320 542 370 540 400 546 V600 H0 Z" fill="#cfdcf2"/>' +
    '<g transform="translate(40 520)"><rect x="0" y="-30" width="44" height="30" fill="#4a3a68"/><path d="M-4 -30 L22.0 -49.8 L48 -30 Z" fill="#f4f8ff" stroke="#c4d2ec" stroke-width="1"/><rect x="30.8" y="-52.0" width="6" height="12" fill="#4a3a68"/><rect x="7.9" y="-21.0" width="9.7" height="9.6" rx="1.5" fill="#ffd86b" class="xmr-win" style="animation-delay:-1.0s"/><rect x="27.7" y="-21.0" width="9.7" height="9.6" rx="1.5" fill="#ffd86b" class="xmr-win" style="animation-delay:-2.3s"/><ellipse class="xmr-smoke" cx="33.8" cy="-54.2" rx="5" ry="3.5" fill="#fff"/></g><g transform="translate(150 508)"><rect x="0" y="-36" width="52" height="36" fill="#5a3b5e"/><path d="M-4 -36 L26.0 -59.4 L56 -36 Z" fill="#f4f8ff" stroke="#c4d2ec" stroke-width="1"/><rect x="36.4" y="-62.0" width="6" height="12" fill="#5a3b5e"/><rect x="9.4" y="-25.2" width="11.4" height="11.5" rx="1.5" fill="#ffd86b" class="xmr-win" style="animation-delay:-0.0s"/><rect x="32.8" y="-25.2" width="11.4" height="11.5" rx="1.5" fill="#ffd86b" class="xmr-win" style="animation-delay:-1.3s"/><rect x="56.2" y="-25.2" width="11.4" height="11.5" rx="1.5" fill="#ffd86b" class="xmr-win" style="animation-delay:-2.6s"/><ellipse class="xmr-smoke" cx="39.4" cy="-64.6" rx="5" ry="3.5" fill="#fff"/></g><g transform="translate(290 514)"><rect x="0" y="-30" width="46" height="30" fill="#3f4a78"/><path d="M-4 -30 L23.0 -50.7 L50 -30 Z" fill="#f4f8ff" stroke="#c4d2ec" stroke-width="1"/><rect x="32.2" y="-53.0" width="6" height="12" fill="#3f4a78"/><rect x="8.3" y="-21.0" width="10.1" height="9.6" rx="1.5" fill="#ffd86b" class="xmr-win" style="animation-delay:-2.0s"/><rect x="29.0" y="-21.0" width="10.1" height="9.6" rx="1.5" fill="#ffd86b" class="xmr-win" style="animation-delay:-3.3s"/><ellipse class="xmr-smoke" cx="35.2" cy="-55.3" rx="5" ry="3.5" fill="#fff"/></g><g transform="translate(112 528)"><rect x="-3" y="-6" width="6" height="10" fill="#3a2a22"/><path d="M-33.0 -4.0 L0 -22.8 L33.0 -4.0 Z" fill="#14503a"/><path d="M-18.2 -12.0 L0 -22.8 L18.2 -12.0 Q0 -8.4 -18.2 -12.0Z" fill="#eef4ff"/><path d="M-26.400000000000002 -20.8 L0 -39.6 L26.400000000000002 -20.8 Z" fill="#14503a"/><path d="M-14.5 -28.8 L0 -39.6 L14.5 -28.8 Q0 -25.2 -14.5 -28.8Z" fill="#eef4ff"/><path d="M-19.8 -35.2 L0 -54.0 L19.8 -35.2 Z" fill="#14503a"/><path d="M-10.9 -43.2 L0 -54.0 L10.9 -43.2 Q0 -39.6 -10.9 -43.2Z" fill="#eef4ff"/><circle cx="7.5" cy="-13.8" r="1.7" fill="#ffd86b" class="xmr-light" style="animation-delay:-0.00s"/><circle cx="2.2" cy="-47.2" r="1.7" fill="#ff6a6a" class="xmr-light" style="animation-delay:-0.45s"/><circle cx="3.2" cy="-22.0" r="1.7" fill="#8fd3ff" class="xmr-light" style="animation-delay:-0.90s"/><circle cx="1.2" cy="-13.2" r="1.7" fill="#ffd86b" class="xmr-light" style="animation-delay:-1.35s"/><circle cx="-3.4" cy="-46.8" r="1.7" fill="#ff6a6a" class="xmr-light" style="animation-delay:-1.80s"/><circle cx="2.4" cy="-29.1" r="1.7" fill="#8fd3ff" class="xmr-light" style="animation-delay:-2.25s"/></g><g transform="translate(250 522)"><rect x="-3" y="-6" width="6" height="10" fill="#3a2a22"/><path d="M-41.800000000000004 -4.0 L0 -28.9 L41.800000000000004 -4.0 Z" fill="#14503a"/><path d="M-23.0 -15.2 L0 -28.9 L23.0 -15.2 Q0 -10.6 -23.0 -15.2Z" fill="#eef4ff"/><path d="M-33.440000000000005 -25.3 L0 -50.2 L33.440000000000005 -25.3 Z" fill="#14503a"/><path d="M-18.4 -36.5 L0 -50.2 L18.4 -36.5 Q0 -31.9 -18.4 -36.5Z" fill="#eef4ff"/><path d="M-25.080000000000002 -43.5 L0 -68.4 L25.080000000000002 -43.5 Z" fill="#14503a"/><path d="M-13.8 -54.7 L0 -68.4 L13.8 -54.7 Q0 -50.2 -13.8 -54.7Z" fill="#eef4ff"/><circle cx="10.3" cy="-30.9" r="1.7" fill="#ffd86b" class="xmr-light" style="animation-delay:-0.00s"/><circle cx="4.8" cy="-51.6" r="1.7" fill="#ff6a6a" class="xmr-light" style="animation-delay:-0.45s"/><circle cx="-8.3" cy="-21.3" r="1.7" fill="#8fd3ff" class="xmr-light" style="animation-delay:-0.90s"/><circle cx="-6.0" cy="-20.7" r="1.7" fill="#ffd86b" class="xmr-light" style="animation-delay:-1.35s"/><circle cx="2.5" cy="-21.7" r="1.7" fill="#ff6a6a" class="xmr-light" style="animation-delay:-1.80s"/><circle cx="-2.6" cy="-14.9" r="1.7" fill="#8fd3ff" class="xmr-light" style="animation-delay:-2.25s"/></g><g transform="translate(354 526)"><rect x="-3" y="-6" width="6" height="10" fill="#3a2a22"/><path d="M-30.800000000000004 -4.0 L0 -21.3 L30.800000000000004 -4.0 Z" fill="#14503a"/><path d="M-16.9 -11.2 L0 -21.3 L16.9 -11.2 Q0 -7.8 -16.9 -11.2Z" fill="#eef4ff"/><path d="M-24.640000000000004 -19.7 L0 -37.0 L24.640000000000004 -19.7 Z" fill="#14503a"/><path d="M-13.6 -26.9 L0 -37.0 L13.6 -26.9 Q0 -23.5 -13.6 -26.9Z" fill="#eef4ff"/><path d="M-18.48 -33.1 L0 -50.4 L18.48 -33.1 Z" fill="#14503a"/><path d="M-10.2 -40.3 L0 -50.4 L10.2 -40.3 Q0 -37.0 -10.2 -40.3Z" fill="#eef4ff"/><circle cx="7.6" cy="-21.0" r="1.7" fill="#ffd86b" class="xmr-light" style="animation-delay:-0.00s"/><circle cx="-0.6" cy="-29.5" r="1.7" fill="#ff6a6a" class="xmr-light" style="animation-delay:-0.45s"/><circle cx="6.9" cy="-23.5" r="1.7" fill="#8fd3ff" class="xmr-light" style="animation-delay:-0.90s"/><circle cx="6.5" cy="-26.5" r="1.7" fill="#ffd86b" class="xmr-light" style="animation-delay:-1.35s"/><circle cx="0.5" cy="-27.3" r="1.7" fill="#ff6a6a" class="xmr-light" style="animation-delay:-1.80s"/><circle cx="-8.1" cy="-24.2" r="1.7" fill="#8fd3ff" class="xmr-light" style="animation-delay:-2.25s"/></g><g transform="translate(16 540)"><rect x="-3" y="-6" width="6" height="10" fill="#3a2a22"/><path d="M-27.500000000000004 -4.0 L0 -19.0 L27.500000000000004 -4.0 Z" fill="#14503a"/><path d="M-15.1 -10.0 L0 -19.0 L15.1 -10.0 Q0 -7.0 -15.1 -10.0Z" fill="#eef4ff"/><path d="M-22.000000000000004 -18.0 L0 -33.0 L22.000000000000004 -18.0 Z" fill="#14503a"/><path d="M-12.1 -24.0 L0 -33.0 L12.1 -24.0 Q0 -21.0 -12.1 -24.0Z" fill="#eef4ff"/><path d="M-16.5 -30.0 L0 -45.0 L16.5 -30.0 Z" fill="#14503a"/><path d="M-9.1 -36.0 L0 -45.0 L9.1 -36.0 Q0 -33.0 -9.1 -36.0Z" fill="#eef4ff"/><circle cx="-7.0" cy="-8.1" r="1.7" fill="#ffd86b" class="xmr-light" style="animation-delay:-0.00s"/><circle cx="5.8" cy="-13.5" r="1.7" fill="#ff6a6a" class="xmr-light" style="animation-delay:-0.45s"/><circle cx="-0.3" cy="-31.2" r="1.7" fill="#8fd3ff" class="xmr-light" style="animation-delay:-0.90s"/><circle cx="0.9" cy="-18.4" r="1.7" fill="#ffd86b" class="xmr-light" style="animation-delay:-1.35s"/><circle cx="0.2" cy="-25.8" r="1.7" fill="#ff6a6a" class="xmr-light" style="animation-delay:-1.80s"/><circle cx="5.8" cy="-11.4" r="1.7" fill="#8fd3ff" class="xmr-light" style="animation-delay:-2.25s"/></g><g transform="translate(386 548)"><rect x="-3" y="-6" width="6" height="10" fill="#3a2a22"/><path d="M-35.2 -4.0 L0 -24.3 L35.2 -4.0 Z" fill="#14503a"/><path d="M-19.4 -12.8 L0 -24.3 L19.4 -12.8 Q0 -9.0 -19.4 -12.8Z" fill="#eef4ff"/><path d="M-28.160000000000004 -21.9 L0 -42.2 L28.160000000000004 -21.9 Z" fill="#14503a"/><path d="M-15.5 -30.7 L0 -42.2 L15.5 -30.7 Q0 -26.9 -15.5 -30.7Z" fill="#eef4ff"/><path d="M-21.12 -37.3 L0 -57.6 L21.12 -37.3 Z" fill="#14503a"/><path d="M-11.6 -46.1 L0 -57.6 L11.6 -46.1 Q0 -42.2 -11.6 -46.1Z" fill="#eef4ff"/><circle cx="1.4" cy="-18.7" r="1.7" fill="#ffd86b" class="xmr-light" style="animation-delay:-0.00s"/><circle cx="-2.7" cy="-41.4" r="1.7" fill="#ff6a6a" class="xmr-light" style="animation-delay:-0.45s"/><circle cx="0.1" cy="-32.3" r="1.7" fill="#8fd3ff" class="xmr-light" style="animation-delay:-0.90s"/><circle cx="2.3" cy="-47.4" r="1.7" fill="#ffd86b" class="xmr-light" style="animation-delay:-1.35s"/><circle cx="-0.9" cy="-34.5" r="1.7" fill="#ff6a6a" class="xmr-light" style="animation-delay:-1.80s"/><circle cx="0.1" cy="-30.1" r="1.7" fill="#8fd3ff" class="xmr-light" style="animation-delay:-2.25s"/></g>' +
    '<g class="xmr-snow" style="animation-duration:9s;animation-delay:-0s" fill="#fff" opacity=".85"><circle cx="375" cy="328" r="1.3"/><circle cx="346" cy="328" r="1.8"/><circle cx="252" cy="516" r="2.4"/><circle cx="190" cy="53" r="3"/><circle cx="392" cy="246" r="3"/><circle cx="127" cy="69" r="2.4"/><circle cx="294" cy="253" r="1.8"/><circle cx="206" cy="103" r="2.4"/><circle cx="62" cy="289" r="1.3"/><circle cx="301" cy="154" r="1.3"/><circle cx="277" cy="134" r="2.4"/><circle cx="359" cy="186" r="1.8"/><circle cx="213" cy="418" r="2.4"/><circle cx="253" cy="327" r="1.8"/><circle cx="319" cy="440" r="1.8"/><circle cx="83" cy="261" r="1.3"/></g><g class="xmr-snow" style="animation-duration:13s;animation-delay:-4s" fill="#fff" opacity=".85"><circle cx="391" cy="425" r="3"/><circle cx="106" cy="371" r="2.4"/><circle cx="179" cy="505" r="2.4"/><circle cx="377" cy="191" r="1.8"/><circle cx="45" cy="249" r="2.4"/><circle cx="85" cy="333" r="1.3"/><circle cx="192" cy="349" r="1.3"/><circle cx="331" cy="56" r="3"/><circle cx="310" cy="403" r="3"/><circle cx="352" cy="229" r="2.4"/><circle cx="39" cy="510" r="3"/><circle cx="186" cy="399" r="1.3"/><circle cx="288" cy="84" r="1.8"/><circle cx="16" cy="315" r="3"/></g>' +
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
  function target() { return Math.max(16, Math.min(42, Math.round(W * H / 25000))); } // v144: menos nieve
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

  // Gorro de Papá Noel sobre el disco de la radio (no gira: va en el contenedor, no en el disco)
  var HAT = '<svg viewBox="0 0 80 64"><defs><linearGradient id="xmHatG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0485a"/><stop offset="1" stop-color="#b3142a"/></linearGradient></defs>' +
    '<path d="M9 46 C10 26 22 10 40 7 C57 4 70 14 73 33 C66 27 56 27 50 33 C44 39 44 45 46 48 Z" fill="url(#xmHatG)" stroke="#7d0e1f" stroke-width="1.5" stroke-linejoin="round"/>' +
    '<path d="M18 38 C21 24 30 14 42 11" stroke="#ff8a96" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".7"/>' +
    '<path d="M56 29 C52 33 50 38 51 44" stroke="#8f1020" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".6"/>' +
    '<g fill="#fff" stroke="#cfd5de" stroke-width="1.2"><rect x="3" y="39" width="52" height="16" rx="8"/><circle cx="73" cy="36" r="7.5"/></g>' +
    '<g fill="none" stroke="#e3e7ee" stroke-width="1.2" stroke-linecap="round"><path d="M13 47 h8 M28 49 h10 M43 47 h6"/></g></svg>';
  function addHat() {
    var wrap = document.querySelector('.vinyl-wrap');
    if (!wrap || wrap.querySelector('.xm-hat')) return;
    var h = document.createElement('div'); h.className = 'xm-hat'; h.setAttribute('aria-hidden', 'true'); h.innerHTML = HAT;
    wrap.appendChild(h);
  }
  function start() {
    if (running) return;
    running = true;
    window.SEASON_MELODY = 'jingle'; if (window.refreshMelodyDefault) window.refreshMelodyDefault(); // alarma por defecto: Jingle Bells
    addHat();
    window.MODE_THEME_COLORS = COLORS;
    addRingBg();
    layer = document.createElement('div'); layer.id = 'xmLayer'; layer.setAttribute('aria-hidden', 'true');
    canvas = document.createElement('canvas'); layer.appendChild(canvas); ctx = canvas.getContext('2d');
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
    if (window.SEASON_MELODY === 'jingle') { window.SEASON_MELODY = null; if (window.refreshMelodyDefault) window.refreshMelodyDefault(); }
    cancelAnimationFrame(raf); clearTimeout(resizeT); placeTimers.forEach(clearTimeout); placeTimers = [];
    window.removeEventListener('resize', onResize);
    if (ro) { ro.disconnect(); ro = null; }
    [layer, lights, drift].forEach(function (e) { if (e) e.remove(); });
    document.querySelectorAll('.xm-hat').forEach(function (e) { e.remove(); });
    layer = lights = drift = canvas = ctx = null; flakes = []; W = H = 0;
    var bg = document.querySelector('.xm-ring-bg'); if (bg) bg.remove();
    var root = document.documentElement.style; root.removeProperty('--xm-top'); root.removeProperty('--xm-bottom'); root.removeProperty('--xm-nl'); root.removeProperty('--xm-nw');
    if (window.MODE_THEME_COLORS === COLORS) window.MODE_THEME_COLORS = null;
  }
  window.SeasonNavidad = { start: start, stop: stop };
})();
