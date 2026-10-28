/* 🎃 MODO HALLOWEEN (fijo, temporal) — ver css/halloween.css para cómo quitarlo.
   Dibuja criaturas (SVG propio, sin imágenes) que cruzan la pantalla sin bloquear toques. */
(function () {
  'use strict';
  // Color de la barra de estado del móvil (app.js lo lee si existe)
  window.HW_THEME_COLORS = { light: '#0E0907', dark: '#0C0908' };
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', document.body && document.body.classList.contains('dark') ? window.HW_THEME_COLORS.dark : window.HW_THEME_COLORS.light);

  var SVG = {
    bat: '<svg viewBox="0 0 140 80">' +
      '<g class="hw-wing"><path d="M64 40 C52 20 28 12 3 22 C13 28 15 37 13 48 C21 40 29 40 35 48 C39 42 47 42 51 52 C56 47 60 47 66 53 Z" fill="#1b1220" stroke="#4a3560" stroke-width="1.5"/><path d="M64 40 L14 26 M64 42 L28 40 M64 44 L44 46" stroke="#4a3560" stroke-width="1.2" fill="none"/></g>' +
      '<g transform="translate(140 0) scale(-1 1)"><g class="hw-wing"><path d="M64 40 C52 20 28 12 3 22 C13 28 15 37 13 48 C21 40 29 40 35 48 C39 42 47 42 51 52 C56 47 60 47 66 53 Z" fill="#1b1220" stroke="#4a3560" stroke-width="1.5"/><path d="M64 40 L14 26 M64 42 L28 40 M64 44 L44 46" stroke="#4a3560" stroke-width="1.2" fill="none"/></g></g>' +
      '<ellipse cx="70" cy="46" rx="11" ry="16" fill="#1b1220" stroke="#4a3560" stroke-width="1.2"/>' +
      '<circle cx="70" cy="28" r="10.5" fill="#1b1220" stroke="#4a3560" stroke-width="1.2"/>' +
      '<path d="M61 24 L58 7 L68 19 Z M79 24 L82 7 L72 19 Z" fill="#1b1220" stroke="#4a3560" stroke-width="1.2" stroke-linejoin="round"/>' +
      '<path d="M60.5 21 L60 12 L65 19 Z M79.5 21 L80 12 L75 19 Z" fill="#7a3b55"/>' +
      '<circle cx="66" cy="27" r="2.6" fill="#ff3b30"/><circle cx="74" cy="27" r="2.6" fill="#ff3b30"/><circle cx="66.6" cy="26.6" r="0.9" fill="#fff"/><circle cx="74.6" cy="26.6" r="0.9" fill="#fff"/>' +
      '<path d="M66 33 L67.5 38 L69 33 Z M71 33 L72.5 38 L74 33 Z" fill="#fff"/>' +
      '<path d="M66 60 L64 68 M74 60 L76 68" stroke="#1b1220" stroke-width="2.4" stroke-linecap="round"/></svg>',

    ghost: '<svg viewBox="0 0 80 100"><defs><linearGradient id="hwg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c9d3ee"/></linearGradient></defs>' +
      '<path d="M10 50 C10 20 25 6 40 6 C55 6 70 20 70 50 L70 92 C66 86 62 86 58 92 C54 98 50 98 46 92 C42 86 38 86 34 92 C30 98 26 98 22 92 C18 86 14 86 10 92 Z" fill="url(#hwg)" stroke="#9fb0d8" stroke-width="2"/>' +
      '<g class="hw-wave"><path d="M68 54 C78 52 82 62 76 70 C74 66 72 64 68 64 Z" fill="url(#hwg)" stroke="#9fb0d8" stroke-width="1.6"/></g>' +
      '<path d="M12 56 C3 56 -1 66 5 72 C7 68 9 66 12 66 Z" fill="url(#hwg)" stroke="#9fb0d8" stroke-width="1.6"/>' +
      '<ellipse cx="29" cy="40" rx="5.5" ry="8.5" fill="#1a1a2e"/><ellipse cx="51" cy="40" rx="5.5" ry="8.5" fill="#1a1a2e"/>' +
      '<circle cx="31" cy="37" r="1.8" fill="#fff"/><circle cx="53" cy="37" r="1.8" fill="#fff"/>' +
      '<ellipse cx="40" cy="62" rx="6.5" ry="9" fill="#1a1a2e"/><ellipse cx="22" cy="53" rx="4.5" ry="2.8" fill="#ffb3c7" opacity=".7"/><ellipse cx="58" cy="53" rx="4.5" ry="2.8" fill="#ffb3c7" opacity=".7"/></svg>',

    zombie: '<svg viewBox="0 0 100 130">' +
      '<g class="hw-leg-a" style="--ox:41px"><rect x="35" y="78" width="13" height="34" rx="4" fill="#3b4a6b"/><path d="M35 100 l5 4 l4 -5 l4 6 v6 h-13 z" fill="#2b3550"/><path d="M32 112 h20 a3 3 0 0 1 3 4 v4 h-23 z" fill="#2a1f1a"/></g>' +
      '<g class="hw-leg-b" style="--ox:54px"><rect x="48" y="78" width="13" height="34" rx="4" fill="#47577a"/><path d="M48 96 l4 5 l4 -4 l5 5 v-6 z" fill="#2b3550"/><path d="M45 112 h20 a3 3 0 0 1 3 4 v4 h-23 z" fill="#33261f"/></g>' +
      '<path d="M30 50 L64 50 L68 84 L60 79 L55 86 L48 80 L41 86 L35 79 L27 84 Z" fill="#6e3a3a" stroke="#4a2424" stroke-width="1.5"/>' +
      '<path d="M40 50 L44 64 L38 70 M54 56 L50 70" stroke="#4a2424" stroke-width="1.6" fill="none"/><path d="M42 66 L48 60 L52 68 L46 74 Z" fill="#a8b78a" opacity=".85"/>' +
      '<g class="hw-arms"><rect x="56" y="62" width="34" height="9" rx="4.5" fill="#6f9460"/><rect x="85" y="59" width="9" height="15" rx="4" fill="#6f9460"/><path d="M89 59 v-6 M92 59 v-5 M94 63 v-4" stroke="#6f9460" stroke-width="2.5" stroke-linecap="round"/>' +
      '<rect x="56" y="52" width="36" height="10" rx="5" fill="#8fb87a"/><rect x="58" y="51" width="10" height="12" rx="3" fill="#6e3a3a"/><rect x="87" y="50" width="9" height="15" rx="4" fill="#8fb87a"/><path d="M91 50 v-6 M94 50 v-5 M96 54 v-4" stroke="#8fb87a" stroke-width="2.5" stroke-linecap="round"/></g>' +
      '<rect x="40" y="44" width="10" height="10" fill="#7fa66a"/>' +
      '<circle cx="45" cy="28" r="21" fill="#8fb87a" stroke="#5c8049" stroke-width="1.5"/>' +
      '<path d="M26 18 L30 6 L35 14 L40 4 L45 13 L51 3 L55 14 L61 7 L63 18 C55 12 36 12 26 18 Z" fill="#2c2420"/>' +
      '<path d="M33 14 l6 4 M52 13 l-5 5" stroke="#5c8049" stroke-width="1.5"/>' +
      '<circle cx="37" cy="27" r="6.5" fill="#1d2418"/><circle cx="37" cy="27" r="3" fill="#e8e8c8"/><circle cx="37.6" cy="27" r="1.2" fill="#222"/>' +
      '<circle cx="55" cy="26" r="7.5" fill="#f1f1d8" stroke="#1d2418" stroke-width="2"/><circle cx="56.5" cy="27.5" r="2.4" fill="#b02020"/><circle cx="56.5" cy="27.5" r="1" fill="#000"/>' +
      '<path d="M45 30 l-2 8 h4 z" fill="#6f9460"/>' +
      '<path d="M30 40 C38 46 54 46 62 39 C60 48 52 52 46 52 C38 52 31 48 30 40 Z" fill="#2a1414"/>' +
      '<path d="M35 42 v4 M40 44 v5 M46 44 v5 M52 43 v5 M57 41 v4" stroke="#f0ecd0" stroke-width="2.4"/>' +
      '<path d="M44 12 v7 M41 14 h6 M41 17 h6" stroke="#3d5a2e" stroke-width="1.4" fill="none"/><path d="M60 32 l6 2 M61 36 l5 0" stroke="#7b2a2a" stroke-width="1.4"/></svg>',

    cat: '<svg viewBox="0 0 120 80">' +
      '<g class="hw-tail"><path d="M28 46 C8 44 6 22 20 14 C26 11 30 16 25 20 C18 26 22 38 32 42" fill="none" stroke="#14101a" stroke-width="7" stroke-linecap="round"/></g>' +
      '<g class="hw-cat">' +
      '<g class="hw-leg-a" style="--ox:36px"><rect x="32" y="50" width="8" height="24" rx="4" fill="#14101a"/></g>' +
      '<g class="hw-leg-b" style="--ox:46px"><rect x="42" y="50" width="8" height="24" rx="4" fill="#1d1824"/></g>' +
      '<g class="hw-leg-b" style="--ox:76px"><rect x="72" y="50" width="8" height="24" rx="4" fill="#14101a"/></g>' +
      '<g class="hw-leg-a" style="--ox:86px"><rect x="82" y="50" width="8" height="24" rx="4" fill="#1d1824"/></g></g>' +
      '<ellipse cx="58" cy="44" rx="34" ry="17" fill="#14101a"/>' +
      '<circle cx="94" cy="33" r="14" fill="#14101a"/>' +
      '<path d="M84 26 L85 8 L96 20 Z M95 20 L104 8 L106 27 Z" fill="#14101a"/><path d="M87 22 L87 13 L93 20 Z M99 20 L103 13 L103 24 Z" fill="#6b2a44"/>' +
      '<ellipse cx="90" cy="32" rx="3.6" ry="4.2" fill="#f7d21e"/><ellipse cx="100" cy="32" rx="3.6" ry="4.2" fill="#f7d21e"/><ellipse cx="90" cy="32" rx="1" ry="3.6" fill="#000"/><ellipse cx="100" cy="32" rx="1" ry="3.6" fill="#000"/>' +
      '<path d="M94 38 l2 2 l2 -2 z" fill="#d85a7a"/><path d="M106 36 l12 -3 M106 39 l12 2 M82 36 l-10 -3 M82 39 l-10 2" stroke="#8d86a0" stroke-width="1" fill="none"/></svg>',

    pumpkin: '<svg viewBox="0 0 80 80"><defs><radialGradient id="hwp" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#ffa43c"/><stop offset="1" stop-color="#d9480f"/></radialGradient></defs>' +
      '<ellipse cx="40" cy="47" rx="34" ry="28" fill="url(#hwp)" stroke="#9a3412" stroke-width="2"/>' +
      '<path d="M26 20 C14 34 14 60 26 73 M54 20 C66 34 66 60 54 73 M40 19 C36 36 36 58 40 75" fill="none" stroke="#b83e0c" stroke-width="2" opacity=".7"/>' +
      '<path d="M37 21 C37 12 40 8 46 5 C46 10 44 15 43 21 Z" fill="#4d6b1c" stroke="#33470f" stroke-width="1.5"/>' +
      '<path d="M22 40 L32 40 L27 30 Z M48 40 L58 40 L53 30 Z" fill="#ffe14d"/>' +
      '<path d="M40 46 L36 52 L44 52 Z" fill="#ffe14d"/>' +
      '<path d="M20 56 L26 52 L31 60 L36 54 L40 61 L44 54 L49 60 L54 52 L60 56 C56 68 24 68 20 56 Z" fill="#ffe14d" stroke="#7a2a05" stroke-width="1.2"/></svg>',

    spider: '<svg viewBox="0 0 60 56">' +
      '<g stroke="#15101b" stroke-width="2.4" fill="none" stroke-linecap="round"><path d="M24 30 L8 18 L2 28 M24 33 L6 34 L2 46 M25 37 L10 48 L8 55 M27 40 L22 52 L24 56"/><path d="M36 30 L52 18 L58 28 M36 33 L54 34 L58 46 M35 37 L50 48 L52 55 M33 40 L38 52 L36 56"/></g>' +
      '<ellipse cx="30" cy="38" rx="11" ry="14" fill="#15101b"/><path d="M30 31 l-3.5 7 l3.5 7 l3.5 -7 z" fill="#c8202f"/>' +
      '<circle cx="30" cy="22" r="8" fill="#1e1827"/><circle cx="26.5" cy="20.5" r="2.2" fill="#ff3b30"/><circle cx="33.5" cy="20.5" r="2.2" fill="#ff3b30"/><circle cx="30" cy="24" r="1.2" fill="#ff3b30"/></svg>'
  };

  // 🧟🏃 Escena: un zombi persigue a una persona, la alcanza, la muerde y se la lleva convertida.
  var ZOMBIE_BODY = SVG.zombie.replace(/^<svg[^>]*>|<\/svg>$/g, '');
  function person(z) {
    var skin = z ? '#8fb87a' : '#f3c9a3', line = z ? '#5c8049' : '#b98a62', shirt = z ? '#b8851c' : '#f0a81e', shirtL = z ? '#8a6414' : '#c98410';
    var s = '<g class="' + (z ? 'hw-pz' : 'hw-pr') + '">' +
      '<g class="hw-leg-a" style="--ox:27px"><rect x="22" y="78" width="11" height="34" rx="4" fill="#2f4f8f"/><rect x="19" y="111" width="17" height="9" rx="3.5" fill="#f2f2f2" stroke="#999" stroke-width="1"/></g>' +
      '<g class="hw-leg-b" style="--ox:40px"><rect x="35" y="78" width="11" height="34" rx="4" fill="#3b5ea8"/><rect x="32" y="111" width="17" height="9" rx="3.5" fill="#fff" stroke="#999" stroke-width="1"/></g>' +
      '<path d="M19 50 Q35 43 51 50 L53 83 L17 83 Z" fill="' + shirt + '" stroke="' + shirtL + '" stroke-width="1.5"/>' +
      (z ? '<path d="M20 70 l5 5 l4 -4 l5 6 M44 60 l-4 8 l6 3" stroke="' + shirtL + '" stroke-width="1.6" fill="none"/>'
         : '<path d="M30 52 v10 M40 52 v10" stroke="' + shirtL + '" stroke-width="1.6"/>');
    if (z) {
      s += '<g class="hw-arms" style="transform-origin:44px 55px"><rect x="44" y="56" width="25" height="8" rx="4" fill="' + skin + '"/><rect x="63" y="54" width="8" height="13" rx="3.5" fill="' + skin + '"/>' +
           '<rect x="44" y="47" width="27" height="8" rx="4" fill="#9fc58a"/><rect x="65" y="45" width="8" height="13" rx="3.5" fill="#9fc58a"/></g>';
    } else {
      s += '<g class="hw-flail"><path d="M42 54 L58 28" stroke="' + shirt + '" stroke-width="8" stroke-linecap="round"/><circle cx="59.5" cy="25.5" r="4.6" fill="' + skin + '"/>' +
           '<path d="M38 54 L48 25" stroke="' + shirtL + '" stroke-width="8" stroke-linecap="round"/><circle cx="49.5" cy="22" r="4.6" fill="' + skin + '"/></g>';
    }
    s += '<rect x="31" y="43" width="8" height="9" fill="' + skin + '"/>' +
      '<circle cx="35" cy="32" r="15" fill="' + skin + '" stroke="' + line + '" stroke-width="1.4"/>' +
      '<circle cx="26" cy="34" r="3.4" fill="' + skin + '" stroke="' + line + '" stroke-width="1"/>' +
      '<path d="M19 32 C15 12 34 6 46 13 C51 16 51 22 49 25 C43 19 32 19 25 27 L21 39 Z" fill="' + (z ? '#2c2420' : '#3a2616') + '"/>';
    if (z) {
      s += '<circle cx="42" cy="31" r="5" fill="#f1f1d8" stroke="#1d2418" stroke-width="1.4"/><circle cx="43.4" cy="32" r="1.8" fill="#b02020"/>' +
           '<path d="M38 24 L47 27" stroke="#2c2420" stroke-width="1.8"/><path d="M38 41 C42 44 47 43 50 40 C49 46 44 47 40 46 Z" fill="#2a1414"/><path d="M41 42 v3 M44 43 v3 M47 42 v3" stroke="#f0ecd0" stroke-width="1.6"/>' +
           '<path d="M27 46 l4 3 l3 -3 M30 49 l-1 5" stroke="#7b2a2a" stroke-width="2" fill="none"/>';
    } else {
      s += '<circle cx="42" cy="31" r="4.8" fill="#fff" stroke="#444" stroke-width=".9"/><circle cx="43.4" cy="31.2" r="1.8" fill="#222"/>' +
           '<path d="M37 22 L47 26" stroke="#3a2616" stroke-width="1.9" stroke-linecap="round"/>' +
           '<ellipse cx="45" cy="41" rx="3.3" ry="4.8" fill="#5a1414"/><path d="M49 34 l3 4 l-3 1" fill="none" stroke="' + line + '" stroke-width="1.2"/>' +
           '<path class="hw-sweat" d="M15 18 q-3 5 0 7 q3 -2 0 -7z" fill="#6ec6ff"/><path class="hw-sweat" style="animation-delay:-.4s" d="M53 12 q-3 5 0 7 q3 -2 0 -7z" fill="#6ec6ff"/>';
    }
    return s + '</g>';
  }
  var CHASE_SVG = '<svg viewBox="0 0 190 130">' +
    '<g transform="translate(104 18) scale(.84)">' + '<g class="hw-p1">' + person(false) + '</g><g class="hw-p2">' + person(true) + '</g></g>' +
    '<g class="hw-zoff"><g class="hw-chomp">' + ZOMBIE_BODY + '</g></g>' +
    '<g class="hw-zname"><rect x="21" y="-18" width="48" height="15" rx="3" fill="#000" fill-opacity=".6" stroke="#ff5a44" stroke-opacity=".7" stroke-width=".8"/>' +
    '<text x="45" y="-8.5" font-size="9.5" font-weight="800" fill="#fff" text-anchor="middle" font-family="system-ui,Arial,sans-serif">Rubén</text>' +
    '<rect x="25" y="-5.5" width="40" height="2" rx="1" fill="#3a0f12"/><rect x="25" y="-5.5" width="30" height="2" rx="1" fill="#e11d2e"/></g>' +
    '<g class="hw-blood"><circle class="hw-drop" cx="128" cy="62" r="2.6" fill="#c8101c"/><circle class="hw-drop" style="animation-delay:-.3s" cx="134" cy="58" r="2" fill="#e01a28"/><circle class="hw-drop" style="animation-delay:-.6s" cx="123" cy="66" r="2.2" fill="#a00c16"/></g>' +
    '<text class="hw-aah" x="172" y="11" font-size="15" font-weight="900" fill="#fff" stroke="#b3141b" stroke-width="4" paint-order="stroke" text-anchor="middle" font-family="Impact,Arial Black,sans-serif">¡AAAH!</text></svg>';
  function chase(layer) {
    var d = document.createElement('div');
    d.className = 'hw-item hw-chase';
    d.style.width = '162px'; d.style.bottom = '2px';
    d.setAttribute('style', d.getAttribute('style') + ';--cd:120s;--dl:-112s;');
    d.innerHTML = CHASE_SVG;
    layer.appendChild(d);
  }

  function mk(kind, cls, w, style) {
    var d = document.createElement('div');
    d.className = 'hw-item ' + (cls || '');
    d.style.width = w + 'px';
    if (style) d.setAttribute('style', d.getAttribute('style') + ';' + style);
    d.innerHTML = SVG[kind];
    return d;
  }
  // caminante: contenedor que cruza la pantalla + (volteo opcional) + animación interna
  function walker(layer, kind, w, opts) {
    var rtl = !!opts.rtl;
    var outer = mk(kind, 'hw-walk-' + (rtl ? 'rtl' : 'ltr'), w,
      (opts.bottom != null ? 'bottom:' + opts.bottom + ';' : 'top:' + opts.top + ';') +
      '--d:' + opts.dur + 's;--dl:-' + opts.delay + 's;');
    var svg = outer.firstChild;
    var inner = document.createElement('div');
    inner.className = (rtl ? 'hw-flip ' : '') + (opts.inner || '');
    if (opts.vars) inner.setAttribute('style', opts.vars);
    outer.removeChild(svg); inner.appendChild(svg); outer.appendChild(inner);
    if (opts.name) { // nombre sobre la cabeza, estilo videojuego (fuera del contenedor volteado para que no salga al revés)
      var n = document.createElement('div');
      n.className = 'hw-name'; n.textContent = opts.name;
      n.style.left = (opts.nx != null ? opts.nx : (rtl ? 55 : 45)) + '%'; if (opts.ny != null) n.style.top = opts.ny + 'px'; n.style.setProperty('--hp', (opts.hp || 100) + '%');
      outer.appendChild(n);
    }
    layer.appendChild(outer);
  }

  // 💀 Fondo terrorífico en la ventana del timer/alarma cuando suena
  var RING_SVG = '<svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMax meet"><defs><radialGradient id="hwrSky" cx=".7" cy=".18" r=".9"><stop offset="0" stop-color="#7a1010"/><stop offset=".35" stop-color="#2a0505"/><stop offset="1" stop-color="#050101"/></radialGradient><radialGradient id="hwrMoon" cx=".4" cy=".4" r=".7"><stop offset="0" stop-color="#ffe9d6"/><stop offset=".6" stop-color="#e79a7c"/><stop offset="1" stop-color="#9c2f1c"/></radialGradient><radialGradient id="hwrGlow" r=".5"><stop offset="0" stop-color="#ff3020" stop-opacity=".95"/><stop offset="1" stop-color="#ff0000" stop-opacity="0"/></radialGradient><linearGradient id="hwrSkin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9dccb"/><stop offset=".55" stop-color="#9aa38c"/><stop offset="1" stop-color="#4b5442"/></linearGradient><linearGradient id="hwrFog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a0606" stop-opacity="0"/><stop offset="1" stop-color="#5a0b0b" stop-opacity=".85"/></linearGradient><path id="hwrBat" d="M0 0 C-6 -8 -16 -9 -24 -4 C-18 -3 -17 1 -18 5 C-14 1 -10 1 -7 5 C-5 1 -2 1 0 4 C2 1 5 1 7 5 C10 1 14 1 18 5 C17 1 18 -3 24 -4 C16 -9 6 -8 0 0 Z" fill="#050101"/></defs><rect width="400" height="600" fill="url(#hwrSky)"/><circle cx="300" cy="105" r="72" fill="url(#hwrMoon)"/><g fill="#7a2a1a" opacity=".25"><circle cx="280" cy="90" r="12"/><circle cx="318" cy="125" r="9"/><circle cx="308" cy="78" r="6"/></g><g class="hwr-bats"><use href="#hwrBat" x="250" y="70"/><use href="#hwrBat" x="330" y="140" transform="scale(.8)"/><use href="#hwrBat" x="90" y="120" transform="scale(1.1)"/><use href="#hwrBat" x="150" y="60" transform="scale(.6)"/></g><g fill="#050101"><path d="M0 600 L0 250 C20 260 18 230 30 215 C26 245 40 250 44 230 C50 255 36 280 48 300 C60 270 80 268 92 255 C80 280 60 300 58 330 L70 600 Z"/><path d="M400 600 L400 230 C380 245 384 215 370 200 C372 232 358 236 352 216 C346 244 362 266 350 290 C336 262 318 262 304 250 C318 276 340 296 342 330 L332 600 Z"/></g><g class="hwr-ghoul"><ellipse cx="165" cy="300" rx="70" ry="60" fill="url(#hwrGlow)" opacity=".35"/><ellipse cx="235" cy="300" rx="70" ry="60" fill="url(#hwrGlow)" opacity=".35"/><path d="M118 300 C114 205 165 158 200 158 C235 158 286 205 282 300 C280 365 262 420 232 455 L168 455 C138 420 120 365 118 300 Z" fill="url(#hwrSkin)" stroke="#2a2f24" stroke-width="3"/><path d="M150 190 L162 222 L150 240 M246 188 L236 214 L250 236 M200 160 L196 190 L204 205" stroke="#3b4234" stroke-width="2.5" fill="none"/><ellipse cx="163" cy="300" rx="27" ry="34" fill="#050101" transform="rotate(-12 163 300)"/><ellipse cx="237" cy="300" rx="27" ry="34" fill="#050101" transform="rotate(12 237 300)"/><circle class="hwr-eye" cx="166" cy="305" r="7" fill="#ff2a1a"/><circle class="hwr-eye" cx="234" cy="305" r="7" fill="#ff2a1a"/><circle cx="168" cy="303" r="2" fill="#ffe0c0"/><circle cx="236" cy="303" r="2" fill="#ffe0c0"/><path d="M192 345 L200 322 L208 345 Z" fill="#1a1d16"/><path d="M142 385 Q200 420 258 385 Q250 445 200 452 Q150 445 142 385 Z" fill="#0a0202"/><path d="M150 390 L158 418 L166 396 L174 428 L183 402 L192 434 L200 404 L208 434 L217 402 L226 428 L234 396 L242 418 L250 390" fill="#e8e2cf" stroke="#0a0202" stroke-width="1.5" stroke-linejoin="round"/><path d="M160 436 L170 414 L180 442 M220 442 L230 414 L240 436" stroke="#e8e2cf" stroke-width="3" fill="none"/></g><g fill="#120a0a" stroke="#2b1c1c" stroke-width="2"><path d="M40 600 L40 520 Q40 490 70 490 Q100 490 100 520 L100 600 Z"/><path d="M300 600 L300 530 Q300 505 325 505 Q350 505 350 530 L350 600 Z"/><path d="M150 600 L150 555 Q150 540 165 540 Q180 540 180 555 L180 600 Z"/></g><g fill="#3a2a2a" font-family="Georgia,serif" font-weight="700" text-anchor="middle"><text x="70" y="535" font-size="15">R.I.P.</text><text x="325" y="548" font-size="12">R.I.P.</text></g><rect class="hwr-fog" x="-60" y="430" width="520" height="170" fill="url(#hwrFog)"/><path d="M0 0 H400 V14 C390 14 388 34 383 34 C378 34 378 14 368 14 C350 14 352 52 345 52 C338 52 340 14 320 14 C300 14 302 26 296 26 C290 26 292 14 270 14 C250 14 252 70 244 70 C236 70 238 14 214 14 C190 14 194 30 188 30 C182 30 184 14 160 14 C140 14 142 46 135 46 C128 46 130 14 108 14 C90 14 92 24 86 24 C80 24 82 14 60 14 C40 14 42 58 35 58 C28 58 30 14 12 14 L0 14 Z" fill="#6d0000"/></svg>';
  function addRingBg() {
    var sheet = document.getElementById('timerSheet');
    if (!sheet || sheet.querySelector('.hw-ring-bg')) return;
    var bg = document.createElement('div');
    bg.className = 'hw-ring-bg'; bg.setAttribute('aria-hidden', 'true');
    bg.innerHTML = RING_SVG;
    sheet.insertBefore(bg, sheet.firstChild);
  }

  function build() {
    addRingBg();
    if (document.getElementById('hwLayer')) return;
    var L = document.createElement('div');
    L.id = 'hwLayer'; L.setAttribute('aria-hidden', 'true');
    // murciélagos
    walker(L, 'bat', 58, { top: '6%',  dur: 26, delay: 4,  rtl: false, inner: 'hw-bob', vars: '--amp:14px;--b:1.9s' });
    walker(L, 'bat', 46, { top: '24%', dur: 34, delay: 20, rtl: true,  stat: 20, inner: 'hw-bob', vars: '--amp:18px;--b:2.4s' });
    walker(L, 'bat', 66, { top: '42%', dur: 40, delay: 9,  rtl: false, inner: 'hw-bob', vars: '--amp:22px;--b:2.9s' });
    // fantasmas
    walker(L, 'ghost', 56, { top: '33%', dur: 70, delay: 15, rtl: true,  stat: 78, inner: 'hw-bob hw-ghost', vars: '--amp:16px;--b:3.2s', name: 'Lucho', nx: 50, ny: -42, hp: 100 });
    walker(L, 'ghost', 46, { top: '58%', dur: 85, delay: 50, rtl: false, inner: 'hw-bob hw-ghost', vars: '--amp:12px;--b:2.7s', name: 'Alejandro', nx: 50, ny: -38, hp: 85 });
    walker(L, 'ghost', 52, { top: '48%', dur: 78, delay: 33, rtl: true,  stat: 40, inner: 'hw-bob hw-ghost', vars: '--amp:14px;--b:2.9s', name: 'Alfredo', nx: 50, ny: -40, hp: 60 });
    // en el suelo (encima del menú de abajo)
    walker(L, 'zombie', 78,  { bottom: '2px', dur: 80, delay: 10, rtl: false, name: 'Emerson', hp: 100 });
    walker(L, 'zombie', 68,  { bottom: '2px', dur: 95, delay: 62, rtl: true,  stat: 60, name: 'Virginia', hp: 72 });
    walker(L, 'cat',    64,  { bottom: '2px', dur: 46, delay: 30, rtl: true,  stat: 36, name: 'Elena', nx: 22, ny: -20, hp: 100 });
    walker(L, 'pumpkin',46,  { bottom: '2px', dur: 58, delay: 3,  rtl: false, inner: 'hw-hop', name: 'Carmen', nx: 50, ny: -40, hp: 100 });
    walker(L, 'pumpkin',40,  { bottom: '2px', dur: 66, delay: 41, rtl: true,  stat: 30, inner: 'hw-hop', name: 'Luis', nx: 50, ny: -38, hp: 90 });
    chase(L);   // el zombi que persigue y muerde (aparece de vez en cuando)
    // arañas colgando
    var s1 = mk('spider', 'hw-spider', 30, 'left:12%;--d:6.5s;--dl:-1s;'); L.appendChild(s1);
    var s2 = mk('spider', 'hw-spider', 24, 'left:86%;--d:8.5s;--dl:-4s;'); L.appendChild(s2);
    document.body.appendChild(L);
    place();
  }
  // ⚡ Rayo de vez en cuando (cada 15-40 s): destello suave + rayo dibujado (sin destello si el dispositivo pide menos movimiento: ver CSS).
  function lightning() {
    var L = document.getElementById('hwLayer');
    if (L && !document.hidden) {
      var x = 8 + Math.random() * 80, flip = Math.random() < 0.5 ? -1 : 1;
      var bolt = document.createElement('div');
      bolt.className = 'hw-bolt';
      bolt.style.left = x + '%';
      bolt.style.transform = 'scaleX(' + flip + ')';
      bolt.innerHTML = '<svg viewBox="0 0 60 200" preserveAspectRatio="none"><path d="M38 0 L14 78 L30 82 L8 200 L52 66 L34 62 L50 0 Z" fill="#fffbe0" stroke="#ffe27a" stroke-width="2" stroke-linejoin="round"/></svg>';
      var flash = document.createElement('div');
      flash.className = 'hw-flash';
      L.appendChild(flash); L.appendChild(bolt);
      setTimeout(function () { flash.remove(); bolt.remove(); }, 1300);
    }
    setTimeout(lightning, 15000 + Math.random() * 25000);
  }
  setTimeout(lightning, 6000);

  // El área libre va entre la barra de arriba y el menú de abajo
  function place() {
    var tb = document.getElementById('mainTopbar') || document.querySelector('.topbar');
    var nav = document.querySelector('.bottom-nav');
    var root = document.documentElement.style;
    if (tb) root.setProperty('--hw-top', Math.round(tb.getBoundingClientRect().bottom) + 'px');
    if (nav) root.setProperty('--hw-bottom', Math.round(nav.getBoundingClientRect().height) + 'px');
  }
  window.addEventListener('resize', place);
  [300, 1200, 3000].forEach(function (t) { setTimeout(place, t); });
  if (window.ResizeObserver) { var ro = new ResizeObserver(place); setTimeout(function () { var a = document.getElementById('mainTopbar'), b = document.querySelector('.bottom-nav'); if (a) ro.observe(a); if (b) ro.observe(b); }, 100); }
  window.addEventListener('load', place);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
