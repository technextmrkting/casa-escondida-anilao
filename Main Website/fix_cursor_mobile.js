/**
 * fix_cursor_mobile.js
 * Completely disables cursor & click animations on touch/mobile devices.
 *
 * Strategy:
 * 1. CSS: @media(pointer:coarse) hides all cursor elements + canvas
 * 2. JS:  Add is-touch class early, guard mousemove handler so it never
 *         sets mouseActive=true on touch (prevents burst rings on tap)
 */
const fs = require('fs');
const pages = ['index.html','rooms.html','dive.html','gallery.html','location.html'];

/* ── CSS: hide cursor elements on touch screens ── */
const CURSOR_HIDE_CSS = `
  /* ── Cursor off on touch (pointer:coarse covers all phones/tablets) ── */
  @media (pointer: coarse) {
    #cur-dot, #cur-ring,
    .cur-ring-burst, .cur-ripple, .cur-burst { display: none !important; }
    canvas                                   { display: none !important; }
    body, body *                             { cursor: auto !important; }
  }
  .is-touch #cur-dot, .is-touch #cur-ring,
  .is-touch .cur-ring-burst, .is-touch .cur-ripple,
  .is-touch .cur-burst                       { display: none !important; }
  .is-touch canvas                           { display: none !important; }
  .is-touch body, .is-touch body *           { cursor: auto !important; }
`;

/* ── JS: inject before cursor script — sets is-touch class early ── */
const TOUCH_DETECT_JS = `
/* ── Touch device detection — disables cursor system ── */
(function(){
  var isTouch = (window.matchMedia && window.matchMedia('(pointer:coarse)').matches)
                || 'ontouchstart' in window
                || navigator.maxTouchPoints > 0;
  if (isTouch) document.documentElement.classList.add('is-touch');
})();
`;

/* ── Patch: add is-touch guard to the mousemove handler ── */
const MOUSEMOVE_OLD = `document.addEventListener('mousemove',e=>{
    if(!mouseActive){`;
const MOUSEMOVE_NEW = `document.addEventListener('mousemove',e=>{
    if(document.documentElement.classList.contains('is-touch')) return;
    if(!mouseActive){`;

// Alternate format (index.html style with spaces)
const MOUSEMOVE_OLD2 = `document.addEventListener('mousemove', e => {
    if(!mouseActive) {`;
const MOUSEMOVE_NEW2 = `document.addEventListener('mousemove', e => {
    if(document.documentElement.classList.contains('is-touch')) return;
    if(!mouseActive) {`;

pages.forEach(filename => {
  let html = fs.readFileSync(filename, 'utf8');

  /* 1. Inject CSS into our override <style> block */
  if (!html.includes('Cursor off on touch')) {
    const marker = 'MOBILE NAV — SLIDE-IN DRAWER  (fix v2)';
    const idx = html.indexOf(marker);
    if (idx !== -1) {
      const styleClose = html.indexOf('</style>', idx);
      if (styleClose !== -1) {
        html = html.slice(0, styleClose) + CURSOR_HIDE_CSS + '\n  ' + html.slice(styleClose);
      }
    }
  }

  /* 2. Inject touch-detect JS right before the cursor <script> block */
  const cursorScriptMarker = '/* ── Cursor — mouse-only';
  const cursorIdx = html.indexOf(cursorScriptMarker);
  if (cursorIdx !== -1 && !html.includes('Touch device detection')) {
    // Find the opening <script> before the cursor marker
    const scriptOpen = html.lastIndexOf('<script>', cursorIdx);
    if (scriptOpen !== -1) {
      // Insert a new <script> tag just before the cursor script tag
      html = html.slice(0, scriptOpen) +
        '<script>' + TOUCH_DETECT_JS + '</script>\n  ' +
        html.slice(scriptOpen);
    }
  }

  /* 3. Patch the mousemove handler to bail on touch */
  if (!html.includes("classList.contains('is-touch')) return;")) {
    html = html.replace(MOUSEMOVE_OLD, MOUSEMOVE_NEW);
    html = html.replace(MOUSEMOVE_OLD2, MOUSEMOVE_NEW2);
  }

  fs.writeFileSync(filename, html, 'utf8');

  const hasCss = html.includes('Cursor off on touch');
  const hasJs  = html.includes('Touch device detection');
  const patched = html.includes("classList.contains('is-touch')) return;");
  console.log(`✓ ${filename} | css=${hasCss} js=${hasJs} guard=${patched}`);
});

console.log('\nDone.');
