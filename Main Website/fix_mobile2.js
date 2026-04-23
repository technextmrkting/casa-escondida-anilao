/**
 * fix_mobile2.js — Converts full-screen overlay mobile nav → slide-in drawer,
 * removes duplicate hamburger JS listeners, adds overlay backdrop,
 * disables heavy animations on touch, and fixes layout issues on mobile.
 *
 * All 5 pages share the same .mobile-nav structure — fix applied uniformly.
 */
const fs = require('fs');

/* ─── CSS overrides injected as a new <style> block ─── */
const MOBILE_NAV_OVERRIDE_CSS = `
  /* ══════════════════════════════════════════
     MOBILE NAV — SLIDE-IN DRAWER  (fix v2)
     Overrides the full-screen overlay style
  ══════════════════════════════════════════ */

  /* Convert full-screen overlay → right-side slide-in drawer */
  .mobile-nav {
    display: flex !important;
    position: fixed !important;
    top: 0 !important; right: -100% !important;
    left: auto !important; bottom: auto !important;
    width: 280px !important; max-width: 88vw !important;
    height: 100vh !important; height: 100dvh !important;
    background: var(--bg-primary, #08111e) !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    justify-content: flex-start !important;
    gap: 0 !important;
    padding: 4.5rem 2rem 2.5rem !important;
    z-index: 400 !important;
    opacity: 1 !important;
    transition: right 0.32s cubic-bezier(.4,0,.2,1) !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
    border-left: 1px solid var(--border, rgba(255,255,255,.08)) !important;
    box-shadow: -10px 0 40px rgba(0,0,0,.45) !important;
  }
  .mobile-nav.open { right: 0 !important; }

  /* Reduce link font: 2rem Playfair → clean 0.88rem DM Sans */
  .mobile-nav a {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.88rem !important;
    font-weight: 500 !important;
    letter-spacing: 0.13em !important;
    text-transform: uppercase !important;
    color: var(--text-secondary, rgba(255,255,255,.7)) !important;
    text-decoration: none !important;
    border-bottom: 1px solid var(--border, rgba(255,255,255,.07)) !important;
    padding: 0.95rem 0 !important;
    width: 100% !important;
    min-height: 48px !important;
    display: flex !important;
    align-items: center !important;
    transition: color .2s !important;
    background: none !important;
    border-radius: 0 !important;
    margin-top: 0 !important;
    box-shadow: none !important;
  }
  .mobile-nav a:hover,
  .mobile-nav a.active { color: var(--accent, #4dc8e8) !important; }

  /* Book Now CTA button */
  .mobile-nav .mobile-nav-cta,
  .mobile-nav a.mobile-nav-cta {
    margin-top: 1.5rem !important;
    background: var(--accent, #4dc8e8) !important;
    color: #04080f !important;
    padding: 0.9rem 1.5rem !important;
    min-height: 48px !important;
    border-radius: 4px !important;
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.8rem !important;
    letter-spacing: 0.15em !important;
    text-transform: uppercase !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    border-bottom: none !important;
    width: 100% !important;
    font-weight: 700 !important;
  }
  .mobile-nav .mobile-nav-cta:hover,
  .mobile-nav a.mobile-nav-cta:hover { opacity: .88 !important; }

  /* Hide old thin line dividers */
  .mobile-nav-divider { display: none !important; }

  /* ── Backdrop overlay ── */
  .mob-nav-bkdrop {
    position: fixed; inset: 0;
    background: rgba(4,8,15,.65);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    z-index: 399;
    opacity: 0; pointer-events: none;
    transition: opacity 0.32s ease;
  }
  .mob-nav-bkdrop.visible { opacity: 1; pointer-events: auto; }

  /* ── Kill heavy animations on touch screens ── */
  @media (hover: none) {
    .orb-layer      { display: none !important; }
    .hero-bubbles   { display: none !important; }
    .hb             { display: none !important; }
    canvas[style*="position:fixed"],
    canvas[style*="position: fixed"] { display: none !important; }
    .cursor-trail, .cursor-ripple { display: none !important; }
    /* Disable card lift animations on touch */
    .svc-card, .rm-card, .rv-card, .di-stat {
      transition: border-color .3s !important;
      transform: none !important;
    }
  }

  /* ── Mobile layout fixes (≤768px) ── */
  @media (max-width: 768px) {
    /* Smaller hero title */
    .hero-h1 { font-size: 2.4rem !important; line-height: 1.2 !important; }
    .hero-sub { font-size: 0.85rem !important; }

    /* Smaller section headings */
    .sec-h2 { font-size: clamp(1.4rem, 5.5vw, 1.9rem) !important; }
    .page-hero-h1 { font-size: clamp(2rem, 8vw, 2.8rem) !important; }

    /* Service cards: stronger gradient + tighter text */
    .svc-card { height: 220px !important; }
    .svc-card::before {
      background: linear-gradient(
        to top,
        rgba(4,8,15,.98) 0%,
        rgba(4,8,15,.70) 45%,
        rgba(4,8,15,.18) 100%
      ) !important;
    }
    .svc-content { padding: 1rem 1.2rem !important; }
    .svc-name { font-size: 0.98rem !important; margin-bottom: 0.25rem !important; }
    .svc-desc {
      font-size: 0.73rem !important;
      display: -webkit-box !important;
      -webkit-box-orient: vertical !important;
      -webkit-line-clamp: 2 !important;
      overflow: hidden !important;
    }

    /* About section: stack photos above text cleanly */
    .about-grid {
      display: flex !important;
      flex-direction: column !important;
      gap: 2rem !important;
    }
    .about-photos {
      height: 260px !important;
      overflow: hidden !important;
    }
    .about-text { order: 2; }

    /* Mosaic tiles */
    .mo { height: 140px !important; }

    /* Room cards text always visible */
    .rm-info { padding: 1.2rem !important; }
    .rm-name { font-size: 1.05rem !important; }
  }
`;

/* ─── Replacement hamburger JS (clones button to clear all old listeners) ─── */
const MOBILE_NAV_FIX_JS = `
/* MOBILE-NAV-FIX-V2 */
(function(){
  /* Insert backdrop overlay into DOM */
  var bkdrop = document.querySelector('.mob-nav-bkdrop');
  if (!bkdrop) {
    bkdrop = document.createElement('div');
    bkdrop.className = 'mob-nav-bkdrop';
    document.body.appendChild(bkdrop);
  }

  /* Clone hamburger button to strip ALL previously attached listeners */
  var hbOld = document.getElementById('navHamburger');
  if (!hbOld) return;
  var hb = hbOld.cloneNode(true);
  hbOld.parentNode.replaceChild(hb, hbOld);

  var nav = document.getElementById('mobileNav');
  if (!nav) return;

  function openMenu() {
    hb.setAttribute('aria-expanded', 'true');
    hb.setAttribute('aria-label', 'Close menu');
    nav.classList.add('open');
    nav.setAttribute('aria-hidden', 'false');
    bkdrop.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    hb.setAttribute('aria-expanded', 'false');
    hb.setAttribute('aria-label', 'Open menu');
    nav.classList.remove('open');
    nav.setAttribute('aria-hidden', 'true');
    bkdrop.classList.remove('visible');
    document.body.style.overflow = '';
  }

  hb.addEventListener('click', function () {
    hb.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
  });
  bkdrop.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
})();
`;

/* ─── Main patch function ─── */
function patchPage(filename) {
  let html = fs.readFileSync(filename, 'utf8');
  const orig = html;

  /* 1. Inject CSS override block before </head> */
  if (!html.includes('MOBILE NAV — SLIDE-IN DRAWER  (fix v2)')) {
    const headClose = html.indexOf('</head>');
    if (headClose !== -1) {
      html = html.slice(0, headClose) +
        '\n  <style>' + MOBILE_NAV_OVERRIDE_CSS + '\n  </style>\n' +
        html.slice(headClose);
    }
  }

  /* 2. Remove the HAMBURGER_JS block previously injected by fix_mobile.js.
        Identified by the unique comment "Mobile Drawer Toggle" inside a <script> tag. */
  const triggerStr = 'Mobile Drawer Toggle';
  let searchFrom = 0;
  while (true) {
    const triggerIdx = html.indexOf(triggerStr, searchFrom);
    if (triggerIdx === -1) break;

    // Find the opening <script> tag before triggerIdx
    const scriptOpen = html.lastIndexOf('<script>', triggerIdx);
    // Find the closing </script> tag after triggerIdx
    const scriptClose = html.indexOf('</script>', triggerIdx);
    if (scriptOpen !== -1 && scriptClose !== -1) {
      // Remove from the newline before <script> to end of </script>
      let removeStart = scriptOpen;
      // Include the preceding newline/whitespace if any
      while (removeStart > 0 && (html[removeStart - 1] === '\n' || html[removeStart - 1] === ' ')) {
        removeStart--;
      }
      html = html.slice(0, removeStart) + html.slice(scriptClose + 9);
      // Don't update searchFrom — re-scan from same position
    } else {
      searchFrom = triggerIdx + triggerStr.length;
    }
  }

  /* 3. Inject new clean JS before </body> */
  if (!html.includes('MOBILE-NAV-FIX-V2')) {
    const bodyClose = html.lastIndexOf('</body>');
    if (bodyClose !== -1) {
      html = html.slice(0, bodyClose) +
        '\n  <script>\n' + MOBILE_NAV_FIX_JS + '\n  </script>\n' +
        html.slice(bodyClose);
    }
  }

  if (html !== orig) {
    fs.writeFileSync(filename, html, 'utf8');
    console.log('✓ Patched:', filename);
  } else {
    console.log('– No changes:', filename);
  }
}

/* ─── Run ─── */
['index.html', 'rooms.html', 'dive.html', 'gallery.html', 'location.html']
  .forEach(patchPage);

console.log('\nAll done.');
