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

    skull: '<svg viewBox="0 0 70 76">' +
      '<path d="M35 3 C16 3 6 17 8 33 C9 41 14 45 17 49 L17 57 L53 57 L53 49 C56 45 61 41 62 33 C64 17 54 3 35 3 Z" fill="#efe8d6" stroke="#9a9078" stroke-width="2"/>' +
      '<path d="M45 5 l-3 10 l5 6 M14 22 l6 3" stroke="#9a9078" stroke-width="1.4" fill="none"/>' +
      '<ellipse cx="24" cy="31" rx="8" ry="9.5" fill="#14100c"/><ellipse cx="46" cy="31" rx="8" ry="9.5" fill="#14100c"/>' +
      '<circle class="hw-glow" cx="25" cy="33" r="2.8" fill="#ff6a1a"/><circle class="hw-glow" cx="45" cy="33" r="2.8" fill="#ff6a1a"/>' +
      '<path d="M35 39 l-4.5 9 h9 z" fill="#14100c"/>' +
      '<path d="M20 57 v-5 M26 57 v-6 M32 57 v-6 M38 57 v-6 M44 57 v-6 M50 57 v-5" stroke="#9a9078" stroke-width="1.4"/>' +
      '<g class="hw-jaw"><path d="M19 58 h32 v6 a5 5 0 0 1 -5 5 h-22 a5 5 0 0 1 -5 -5 z" fill="#efe8d6" stroke="#9a9078" stroke-width="2"/><path d="M26 59 v8 M35 59 v9 M44 59 v8" stroke="#9a9078" stroke-width="1.4"/></g></svg>'
  };

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
    walker(L, 'bat', 54, { top: '8%',  dur: 28, delay: 4,  rtl: false, inner: 'hw-bob', vars: '--amp:14px;--b:1.9s' });
    walker(L, 'bat', 46, { top: '30%', dur: 38, delay: 20, rtl: true,  inner: 'hw-bob', vars: '--amp:18px;--b:2.4s' });
    // fantasmas
    walker(L, 'ghost', 54, { top: '38%', dur: 75, delay: 15, rtl: true,  inner: 'hw-bob hw-ghost', vars: '--amp:16px;--b:3.2s' });
    walker(L, 'ghost', 46, { top: '60%', dur: 88, delay: 50, rtl: false, inner: 'hw-bob hw-ghost', vars: '--amp:12px;--b:2.7s' });
    // calaveras flotando
    walker(L, 'skull', 40, { top: '20%', dur: 84, delay: 36, rtl: false, inner: 'hw-bob', vars: '--amp:10px;--b:2.2s' });
    walker(L, 'skull', 34, { top: '50%', dur: 98, delay: 66, rtl: true,  inner: 'hw-bob', vars: '--amp:8px;--b:2.6s' });
    // gatos negros por el suelo (encima del menú de abajo)
    walker(L, 'cat', 62, { bottom: '2px', dur: 48, delay: 30, rtl: true });
    walker(L, 'cat', 54, { bottom: '2px', dur: 66, delay: 8,  rtl: false });
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
