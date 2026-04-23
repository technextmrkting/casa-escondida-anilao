/**
 * fix_perf_mobile.js
 * Mobile performance optimizations:
 *  1. CSS: hide orb-layer, hero-rays, hero-bubbles on mobile (mix-blend-mode:screen / animation cost)
 *  2. CSS: remove backdrop-filter from scrolled nav on mobile (most expensive GPU effect)
 *  3. JS:  guard hero parallax scroll handler with is-touch check (prevents floating image on scroll)
 *  4. JS:  guard section image parallax with is-touch check
 *  5. JS:  stop animRing rAF loop on touch (cursor ring — already hidden by CSS but JS still runs)
 */
const fs = require('fs');
const pages = ['index.html','rooms.html','dive.html','gallery.html','location.html'];

/* ── CSS to inject into MOBILE COMPACT block ── */
const PERF_CSS = `
    /* ── MOBILE PERF: orb-layer uses mix-blend-mode:screen — kills mobile GPU ── */
    .orb-layer { display: none !important; }

    /* ── MOBILE PERF: hero rays & bubbles — heavy animations, not visible on small screens ── */
    .hero-bubbles, .hb, .h-ray { display: none !important; }

    /* ── MOBILE PERF: nav backdrop-filter is the most expensive GPU effect ── */
    #nav.scrolled {
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      background: rgba(4,8,15,0.94) !important;
    }
    [data-theme="day"] #nav.scrolled {
      background: rgba(245,240,234,0.96) !important;
    }
`;

/* ── JS: guard hero parallax so it doesn't run on touch ── */
const HERO_PAR_OLD = `  /* ── Parallax hero ── */
  const heroPhoto = document.querySelector('.hero-photo');
  const heroContent = document.querySelector('.hero-content');
  window.addEventListener('scroll',()=>{
    const y = window.scrollY;
    if(heroPhoto) heroPhoto.style.transform=\`scale(1.08) translateY(\${y*0.22}px)\`;
    if(heroContent) heroContent.style.transform=\`translateY(\${y*0.28}px) scale(\${1 - y*0.0002})\`;
  },{passive:true});`;

const HERO_PAR_NEW = `  /* ── Parallax hero (desktop only — touch guard prevents floating image on scroll) ── */
  const heroPhoto = document.querySelector('.hero-photo');
  const heroContent = document.querySelector('.hero-content');
  if(!document.documentElement.classList.contains('is-touch')){
    window.addEventListener('scroll',()=>{
      const y = window.scrollY;
      if(heroPhoto) heroPhoto.style.transform=\`scale(1.08) translateY(\${y*0.22}px)\`;
      if(heroContent) heroContent.style.transform=\`translateY(\${y*0.28}px) scale(\${1 - y*0.0002})\`;
    },{passive:true});
  }`;

/* ── JS: guard section image parallax ── */
const SEC_PAR_OLD = `  /* ── Section image parallax ── */
  document.querySelectorAll('.parallax-img img').forEach(img=>{
    const section = img.closest('section');
    if(!section) return;
    window.addEventListener('scroll',()=>{
      const rect = section.getBoundingClientRect();
      const offset = rect.top / window.innerHeight;
      img.style.transform = \`translateY(\${offset * 30}px)\`;
    },{passive:true});
  });`;

const SEC_PAR_NEW = `  /* ── Section image parallax (desktop only) ── */
  if(!document.documentElement.classList.contains('is-touch')){
    document.querySelectorAll('.parallax-img img').forEach(img=>{
      const section = img.closest('section');
      if(!section) return;
      window.addEventListener('scroll',()=>{
        const rect = section.getBoundingClientRect();
        const offset = rect.top / window.innerHeight;
        img.style.transform = \`translateY(\${offset * 30}px)\`;
      },{passive:true});
    });
  }`;

/* ── JS: stop animRing rAF on touch ── */
const ANIM_RING_OLD = `  /* smooth ring follow */
  (function animRing(){
    rx+=(mx-rx)*0.11; ry+=(my-ry)*0.11;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(animRing);
  })();`;

const ANIM_RING_NEW = `  /* smooth ring follow (stops on touch — cursor hidden but rAF loop still costs battery) */
  (function animRing(){
    if(document.documentElement.classList.contains('is-touch')) return;
    rx+=(mx-rx)*0.11; ry+=(my-ry)*0.11;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(animRing);
  })();`;

pages.forEach(filename => {
  let html = fs.readFileSync(filename, 'utf8');

  /* 1. Inject PERF CSS into mobile compact block */
  if (!html.includes('MOBILE PERF: orb-layer')) {
    /* Target the end of the MOBILE COMPACT @media block */
    const compactMarker = '/* ── Hero image: remove large translate values';
    const heroFixIdx = html.indexOf(compactMarker);
    if (heroFixIdx !== -1) {
      /* Insert PERF_CSS just before the hero fix comment */
      html = html.slice(0, heroFixIdx) + PERF_CSS + '\n    ' + html.slice(heroFixIdx);
    } else {
      /* Fallback: find the closing brace of MOBILE COMPACT block */
      const fallbackMarker = '/* General: reduce letter-spacing on body copy */';
      const fallbackIdx = html.indexOf(fallbackMarker);
      if (fallbackIdx !== -1) {
        html = html.slice(0, fallbackIdx) + PERF_CSS + '\n    ' + html.slice(fallbackIdx);
      }
    }
  }

  /* 2. Guard hero parallax JS */
  if (html.includes(HERO_PAR_OLD) && !html.includes('touch guard prevents floating')) {
    html = html.replace(HERO_PAR_OLD, HERO_PAR_NEW);
  }

  /* 3. Guard section image parallax JS */
  if (html.includes(SEC_PAR_OLD) && !html.includes('Section image parallax (desktop only)')) {
    html = html.replace(SEC_PAR_OLD, SEC_PAR_NEW);
  }

  /* 4. Guard animRing rAF loop */
  if (html.includes(ANIM_RING_OLD) && !html.includes('stops on touch — cursor hidden')) {
    html = html.replace(ANIM_RING_OLD, ANIM_RING_NEW);
  }

  fs.writeFileSync(filename, html, 'utf8');

  const hasPerfCss    = html.includes('MOBILE PERF: orb-layer');
  const heroPar       = html.includes('touch guard prevents floating');
  const secPar        = html.includes('Section image parallax (desktop only)');
  const ringGuard     = html.includes('stops on touch — cursor hidden');
  console.log(`✓ ${filename} | perf-css=${hasPerfCss} hero-par=${heroPar} sec-par=${secPar} ring=${ringGuard}`);
});

console.log('\nDone.');
