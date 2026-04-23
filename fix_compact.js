/**
 * fix_compact.js
 * 1. Remove the animation-reset (orb/bubble/card) rules on mobile
 * 2. Inject compact spacing CSS to reduce scroll length on mobile
 */
const fs = require('fs');
const pages = ['index.html','rooms.html','dive.html','gallery.html','location.html'];

/* ─── CSS: remove animation kills + compress spacing ─── */
const COMPACT_CSS = `
  /* ════════════════════════════════════════════
     MOBILE COMPACT — reduce scroll, tighten spacing
  ════════════════════════════════════════════ */
  @media (max-width: 768px) {

    /* Section padding: 8rem → 2.8rem */
    .pad    { padding: 2.8rem 0 !important; }
    .pad-sm { padding: 1.8rem 0 !important; }
    .c { padding: 0 1.2rem !important; }

    /* Section header spacing */
    .sec-header { margin-bottom: 1.4rem !important; }
    .sec-h2, .page-hero-h1 {
      margin-bottom: 0.5rem !important;
      line-height: 1.15 !important;
      letter-spacing: -0.01em !important;
    }
    .eyebrow, .sec-eyebrow {
      margin-bottom: 0.4rem !important;
      letter-spacing: 0.1em !important;
      font-size: 0.58rem !important;
    }
    .sec-sub, .sec-lead {
      font-size: 0.82rem !important;
      line-height: 1.6 !important;
      margin-bottom: 0.8rem !important;
      letter-spacing: 0 !important;
    }

    /* Hero */
    .hero-h1 {
      font-size: 2.1rem !important;
      line-height: 1.1 !important;
      margin-bottom: 0.5rem !important;
      letter-spacing: -0.02em !important;
    }
    .hero-sub {
      font-size: 0.78rem !important;
      margin-bottom: 1.2rem !important;
      letter-spacing: 0.01em !important;
    }
    .hero-content { padding: 0 1.2rem 3rem !important; }
    .hero-btns { gap: 0.6rem !important; }
    .btn, .btn-primary, .btn-outline {
      padding: 0.65rem 1.2rem !important;
      font-size: 0.7rem !important;
      letter-spacing: 0.07em !important;
    }

    /* About */
    .about-grid { gap: 1.2rem !important; }
    .about-photos { height: 200px !important; }

    /* Service cards */
    .services-grid { gap: 5px !important; }
    .svc-card { height: 170px !important; }
    .svc-name { font-size: 0.88rem !important; }
    .svc-desc {
      font-size: 0.68rem !important;
      line-height: 1.45 !important;
    }

    /* Rooms */
    .rooms-grid { gap: 0.9rem !important; }
    .rm-info { padding: 0.9rem !important; }
    .rm-name { font-size: 0.9rem !important; letter-spacing: 0 !important; }
    .rm-desc { font-size: 0.72rem !important; line-height: 1.5 !important; }

    /* Reviews */
    .reviews-grid { gap: 0.9rem !important; }
    .rv-quote { font-size: 0.82rem !important; line-height: 1.5 !important; }

    /* Booking section */
    .booking-title { font-size: 1.7rem !important; margin-bottom: 0.4rem !important; }

    /* Gallery grid */
    .gal-grid { gap: 3px !important; }

    /* Mosaic */
    .mo { height: 120px !important; }
    .mosaic { gap: 4px !important; }

    /* Dive photo grid */
    .dpg-item { height: 170px !important; }

    /* Footer */
    .foot-grid { gap: 1.2rem !important; }
    .foot-bottom { padding-top: 0.8rem !important; }

    /* General: reduce letter-spacing on body copy */
    .sec-lead, .sec-sub, .rm-desc, .svc-desc,
    .rv-quote, .foot-desc, p { letter-spacing: 0 !important; }
  }
`;

/* Strings to remove (animation-reset blocks) */
const ANIM_KILL = [
  // From fix_mobile2 hover:none block
  `  /* ── Kill heavy animations on touch screens ── */
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
  }`,
  // From original MOBILE_CSS (fix_mobile.js) inside first style block
  `    /* ── Disable mouse-only effects on touch devices ── */
    @media(hover: none) {
      canvas[style*="position:fixed"] { display: none !important; }
      .cursor-trail, .cursor-ripple { display: none !important; }
    }`,
];

pages.forEach(filename => {
  let html = fs.readFileSync(filename, 'utf8');

  // Remove animation-kill blocks
  ANIM_KILL.forEach(block => {
    html = html.split(block).join('');
  });

  // Inject compact CSS if not already present
  if (!html.includes('MOBILE COMPACT')) {
    const marker = 'MOBILE NAV — SLIDE-IN DRAWER  (fix v2)';
    const idx = html.indexOf(marker);
    if (idx !== -1) {
      const styleClose = html.indexOf('</style>', idx);
      if (styleClose !== -1) {
        html = html.slice(0, styleClose) + COMPACT_CSS + '\n  ' + html.slice(styleClose);
      }
    }
  }

  fs.writeFileSync(filename, html, 'utf8');

  const animGone  = !html.includes('.orb-layer      { display: none');
  const compacted = html.includes('MOBILE COMPACT');
  console.log(`✓ ${filename} | anim restored=${animGone} | compact=${compacted}`);
});

console.log('\nDone.');
