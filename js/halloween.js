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
  function build() {
    if (document.getElementById('hwLayer')) return;
    var L = document.createElement('div');
    L.id = 'hwLayer'; L.setAttribute('aria-hidden', 'true');
    // murciélagos
    walker(L, 'bat', 58, { top: '6%',  dur: 26, delay: 4,  rtl: false, inner: 'hw-bob', vars: '--amp:14px;--b:1.9s' });
    walker(L, 'bat', 46, { top: '24%', dur: 34, delay: 20, rtl: true,  stat: 20, inner: 'hw-bob', vars: '--amp:18px;--b:2.4s' });
    walker(L, 'bat', 66, { top: '42%', dur: 40, delay: 9,  rtl: false, inner: 'hw-bob', vars: '--amp:22px;--b:2.9s' });
    // fantasmas
    walker(L, 'ghost', 56, { top: '33%', dur: 70, delay: 15, rtl: true,  stat: 78, inner: 'hw-bob hw-ghost', vars: '--amp:16px;--b:3.2s' });
    walker(L, 'ghost', 46, { top: '58%', dur: 85, delay: 50, rtl: false, inner: 'hw-bob hw-ghost', vars: '--amp:12px;--b:2.7s' });
    // en el suelo (encima del menú de abajo)
    walker(L, 'zombie', 78,  { bottom: '2px', dur: 80, delay: 10, rtl: false });
    walker(L, 'zombie', 68,  { bottom: '2px', dur: 95, delay: 62, rtl: true,  stat: 60 });
    walker(L, 'cat',    64,  { bottom: '2px', dur: 46, delay: 30, rtl: true,  stat: 36 });
    walker(L, 'pumpkin',46,  { bottom: '2px', dur: 58, delay: 3,  rtl: false, inner: 'hw-hop' });
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
