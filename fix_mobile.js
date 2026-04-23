/**
 * fix_mobile.js — Comprehensive mobile optimisation for all 5 pages
 * Fixes: mobile drawer nav, 100dvh, overflow-x, touch-action,
 *        img max-width, tap targets, font scaling, iOS safe-area
 */
const fs = require('fs');

/* ─── Shared mobile CSS injected into every page ─── */
const MOBILE_CSS = `
    /* ═══════════════════════════════════════════════
       MOBILE OPTIMISATIONS
    ═══════════════════════════════════════════════ */

    /* Base resets */
    *, *::before, *::after { box-sizing: border-box; }
    html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
    body { overflow-x: hidden; }
    img, video, svg { max-width: 100%; height: auto; }
    button, a, [role="button"], input, select, textarea {
      touch-action: manipulation;
    }

    /* ── Mobile Drawer ── */
    .mob-drawer {
      position: fixed;
      top: 0; right: -100%;
      width: 280px; max-width: 88vw;
      height: 100vh; height: 100dvh;
      background: var(--bg2, #0a1628);
      border-left: 1px solid var(--border, rgba(255,255,255,.08));
      z-index: 400;
      display: flex; flex-direction: column;
      padding: 1.5rem 2rem 2.5rem;
      transition: right 0.32s cubic-bezier(.4,0,.2,1);
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    .mob-drawer.open { right: 0; }

    .mob-overlay {
      position: fixed; inset: 0;
      background: rgba(4,8,15,.65);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      z-index: 399;
      opacity: 0; pointer-events: none;
      transition: opacity 0.32s ease;
    }
    .mob-overlay.visible { opacity: 1; pointer-events: auto; }

    .mob-drawer-head {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 2.5rem;
    }
    .mob-drawer-logo {
      height: 36px; width: auto;
    }
    .mob-close {
      width: 38px; height: 38px; min-width: 38px;
      display: flex; align-items: center; justify-content: center;
      background: var(--card, rgba(255,255,255,.05));
      border: 1px solid var(--border, rgba(255,255,255,.08));
      border-radius: 50%; cursor: pointer; color: var(--text, #fff);
      font-size: 1.1rem; line-height: 1;
      transition: background .2s;
    }
    .mob-close:hover { background: var(--border2, rgba(255,255,255,.12)); }

    .mob-nav-links {
      list-style: none; display: flex; flex-direction: column;
      gap: 0; flex: 1;
    }
    .mob-nav-links li a {
      display: block;
      padding: 0.95rem 0;
      font-size: 0.9rem; letter-spacing: 0.12em;
      text-transform: uppercase; font-weight: 500;
      color: var(--text2, rgba(255,255,255,.7));
      text-decoration: none;
      border-bottom: 1px solid var(--border, rgba(255,255,255,.06));
      transition: color .2s;
      min-height: 48px; display: flex; align-items: center;
    }
    .mob-nav-links li a:hover,
    .mob-nav-links li a.active { color: var(--accent, #4dc8e8); }

    .mob-book-btn {
      display: block; text-align: center;
      margin-top: 2rem;
      padding: 0.9rem 1.5rem; min-height: 48px;
      background: var(--accent, #4dc8e8);
      color: #04080f !important; font-weight: 700;
      font-size: 0.8rem; letter-spacing: 0.15em;
      text-transform: uppercase; text-decoration: none;
      border-radius: 4px;
      transition: opacity .2s;
    }
    .mob-book-btn:hover { opacity: .88; }

    /* ── Ensure hamburger has minimum tap target ── */
    .nav-hamburger {
      min-width: 44px !important; min-height: 44px !important;
      display: none; align-items: center; justify-content: center;
    }
    @media(max-width:768px){ .nav-hamburger { display: flex !important; } }

    /* ── Tap target helpers ── */
    @media(max-width:768px) {
      .theme-toggle {
        min-height: 44px; display: flex; align-items: center; gap: 6px;
      }
      /* Safe-area padding for notch phones */
      #nav {
        padding-left: max(1.5rem, env(safe-area-inset-left));
        padding-right: max(1.5rem, env(safe-area-inset-right));
      }
      body {
        padding-bottom: env(safe-area-inset-bottom);
      }
    }

    /* ── 320px safety net ── */
    @media(max-width:380px) {
      .c { padding: 0 1rem; }
      .hero-h1, .page-hero-h1 { font-size: clamp(2rem, 9vw, 3rem); }
      .sec-h2 { font-size: clamp(1.5rem, 6vw, 2rem); }
      .sec-sub { font-size: 0.82rem; }
      .btn, .btn-primary, .btn-outline { padding: 0.75rem 1.25rem; font-size: 0.78rem; }
    }

    /* ── Disable mouse-only effects on touch devices ── */
    @media(hover: none) {
      canvas[style*="position:fixed"] { display: none !important; }
      .cursor-trail, .cursor-ripple { display: none !important; }
    }`;

/* ─── Shared hamburger JS injected into every page ─── */
const HAMBURGER_JS = `
  /* ── Mobile Drawer Toggle ── */
  (function(){
    const hb  = document.getElementById('navHamburger');
    const drw = document.getElementById('mobileNav');
    const ovl = document.getElementById('mobOverlay');
    const cls = document.getElementById('mobClose');
    if(!hb || !drw) return;

    function openMenu(){
      hb.setAttribute('aria-expanded','true');
      hb.setAttribute('aria-label','Close menu');
      drw.classList.add('open');
      ovl && ovl.classList.add('visible');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu(){
      hb.setAttribute('aria-expanded','false');
      hb.setAttribute('aria-label','Open menu');
      drw.classList.remove('open');
      ovl && ovl.classList.remove('visible');
      document.body.style.overflow = '';
    }

    hb.addEventListener('click', () =>
      hb.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu()
    );
    ovl && ovl.addEventListener('click', closeMenu);
    cls && cls.addEventListener('click', closeMenu);
    document.addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });
    drw.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  })();`;

/* ─── Per-page mobile drawer HTML ─── */
const DRAWERS = {
  'index.html': {
    active: '',
    links: [
      ['#about','About'], ['rooms.html','Rooms'], ['dive.html','Dive'],
      ['gallery.html','Gallery'], ['location.html','Location']
    ],
    bookHref: '#booking'
  },
  'rooms.html': {
    active: 'rooms.html',
    links: [
      ['index.html#about','About'], ['rooms.html','Rooms'], ['dive.html','Dive'],
      ['gallery.html','Gallery'], ['location.html','Location']
    ],
    bookHref: '#booking'
  },
  'dive.html': {
    active: 'dive.html',
    links: [
      ['index.html#about','About'], ['rooms.html','Rooms'], ['dive.html','Dive'],
      ['gallery.html','Gallery'], ['location.html','Location']
    ],
    bookHref: 'index.html#booking'
  },
  'gallery.html': {
    active: 'gallery.html',
    links: [
      ['index.html#about','About'], ['rooms.html','Rooms'], ['dive.html','Dive'],
      ['gallery.html','Gallery'], ['location.html','Location']
    ],
    bookHref: 'index.html#booking'
  },
  'location.html': {
    active: 'location.html',
    links: [
      ['index.html#about','About'], ['rooms.html','Rooms'], ['dive.html','Dive'],
      ['gallery.html','Gallery'], ['location.html','Location']
    ],
    bookHref: 'index.html#booking'
  }
};

function buildDrawer(page, logoNight) {
  const d = DRAWERS[page];
  const liHtml = d.links.map(([href, label]) => {
    const isActive = href === d.active || href.endsWith(d.active) ? ' class="active"' : '';
    return `      <li><a href="${href}"${isActive}>${label}</a></li>`;
  }).join('\n');

  return `
  <!-- ── Mobile Drawer ── -->
  <div id="mobileNav" class="mob-drawer" role="dialog" aria-modal="true" aria-label="Site navigation">
    <div class="mob-drawer-head">
      <img class="mob-drawer-logo" src="${logoNight}" alt="Casa Escondida" loading="lazy" />
      <button class="mob-close" id="mobClose" aria-label="Close menu">&times;</button>
    </div>
    <ul class="mob-nav-links">
${liHtml}
    </ul>
    <a href="${d.bookHref}" class="mob-book-btn">Book Now</a>
  </div>
  <div id="mobOverlay" class="mob-overlay" aria-hidden="true"></div>`;
}

/* ─── Main patch function ─── */
function patchPage(filename) {
  let html = fs.readFileSync(filename, 'utf8');
  const orig = html;

  /* 1. Inject mobile CSS before </style> (first style block) */
  if (!html.includes('MOBILE OPTIMISATIONS')) {
    const styleEnd = html.indexOf('</style>');
    if (styleEnd !== -1) {
      html = html.slice(0, styleEnd) + MOBILE_CSS + '\n  ' + html.slice(styleEnd);
    }
  }

  /* 2. Fix 100vh → 100dvh (add fallback) */
  // Replace standalone `height:100vh` with dual declaration
  html = html.replace(/height:\s*100vh\b(?!;[\s\S]{0,5}100dvh)/g, 'height:100vh;height:100dvh');
  html = html.replace(/min-height:\s*100vh\b(?!;[\s\S]{0,5}100dvh)/g, 'min-height:100vh;min-height:100dvh');

  /* 3. Add mobile drawer HTML after </nav> (only if not already added) */
  if (!html.includes('id="mobileNav"')) {
    const navClose = html.indexOf('</nav>');
    if (navClose !== -1) {
      // Find the logo img src for night theme
      const logoMatch = html.match(/class="nav-logo-img nav-logo-night"\s+src="([^"]+)"/);
      const logoNight = logoMatch ? logoMatch[1] : 'images/Logo/Untitled_design__3_-removebg-preview.png';
      const drawer = buildDrawer(filename, logoNight);
      html = html.slice(0, navClose + 6) + drawer + html.slice(navClose + 6);
    }
  }

  /* 4. Inject hamburger JS before </body> (only if not already added) */
  if (!html.includes('Mobile Drawer Toggle')) {
    const bodyClose = html.lastIndexOf('</body>');
    if (bodyClose !== -1) {
      // Add as inline script before </body>
      html = html.slice(0, bodyClose) +
        '\n  <script>' + HAMBURGER_JS + '\n  </script>\n' +
        html.slice(bodyClose);
    }
  }

  /* 5. Fix images missing loading="lazy" (except logo/eager ones) */
  // Already fine — skip to avoid unintended changes

  if (html !== orig) {
    fs.writeFileSync(filename, html, 'utf8');
    console.log('✓ Patched:', filename);
  } else {
    console.log('– No changes:', filename);
  }
}

/* ─── Run on all pages ─── */
['index.html','rooms.html','dive.html','gallery.html','location.html']
  .forEach(patchPage);

console.log('\nAll done. JS syntax check next…');
