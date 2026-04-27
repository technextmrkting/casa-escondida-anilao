/**
 * perf_fixes.js
 * Implements High + Medium performance fixes:
 *
 *  3.  Google Fonts → async (non-blocking) on ALL 5 pages
 *  4.  Extract shared CSS (tokens, nav, hamburger, footer, orbs, mobile opts)
 *      to style.css; link it from all 5 pages; keep page-specific CSS inline
 *  5.  Remove oversized preload from dive.html
 *  6.  Lazy-load Facebook SDK on gallery.html via IntersectionObserver
 *  8.  Fix missing lazy-loading on dive.html static images
 *  9.  DNS prefetch for external domains on all 5 pages
 */

const fs = require('fs');
const path = require('path');

const BASE = __dirname;
const PAGES = ['index.html','rooms.html','dive.html','gallery.html','location.html'];
const SUBPAGES = ['rooms.html','dive.html','gallery.html','location.html'];

/* ─────────────────────────────────────────────────────────────────
   HELPER: read/write
───────────────────────────────────────────────────────────────── */
function read(f)    { return fs.readFileSync(path.join(BASE, f), 'utf8'); }
function write(f,s) { fs.writeFileSync(path.join(BASE, f), s, 'utf8'); }

/* ─────────────────────────────────────────────────────────────────
   FIX 3 — Google Fonts: convert render-blocking <link> to async
   Uses the rel=preload / onload trick; noscript fallback kept.
───────────────────────────────────────────────────────────────── */
function makeGFontsAsync(html) {
  // Match the render-blocking Google Fonts stylesheet link
  return html.replace(
    /<link\s+href="(https:\/\/fonts\.googleapis\.com\/css2[^"]+)"\s+rel="stylesheet"\s*\/>/g,
    (_, href) =>
      `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'" />\n  <noscript><link rel="stylesheet" href="${href}" /></noscript>`
  );
}

/* ─────────────────────────────────────────────────────────────────
   FIX 9 — DNS prefetch for common external domains
───────────────────────────────────────────────────────────────── */
const DNS_PREFETCH = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://www.facebook.com',
  'https://connect.facebook.net',
  'https://www.instagram.com',
  'https://www.tripadvisor.com.ph',
  'https://www.booking.com',
  'https://maps.google.com',
  'https://img.youtube.com',
].map(d => `  <link rel="dns-prefetch" href="${d}" />`).join('\n');

function addDnsPrefetch(html) {
  if (html.includes('rel="dns-prefetch"')) return html; // already done
  // Insert after the last preconnect line
  return html.replace(
    /(<link rel="preconnect"[^>]+>\s*\n)/,
    (m) => m + DNS_PREFETCH + '\n'
  );
}

/* ─────────────────────────────────────────────────────────────────
   FIX 4 — Extract shared CSS from sub-pages to style.css
   Shared sections (identical across rooms/dive/gallery/location):
     • Tokens block
     • NAV block
     • Hamburger + Mobile Nav Drawer block
     • FOOTER block
     • Scroll reveal block
     • UNIFIED FOOTER block
     • Night ambient orbs block
     • MOBILE OPTIMISATIONS block (second <style> tag in each sub-page)
───────────────────────────────────────────────────────────────── */

/**
 * Splits a sub-page's <style> content into
 * { shared_top, page_specific, shared_bottom }
 * by locating the HERO section as the cut point.
 *
 * Everything before /* ── HERO ──  goes to style.css (shared top)
 * Everything from HERO to just before /* ── FOOTER ── is page-specific
 * Everything from FOOTER to end goes to style.css (shared bottom)
 */
function splitCss(css) {
  // Match HERO comment regardless of delimiter style (── or ══════)
  const heroIdx  = css.search(/\/\*[\s═─]*HERO[\s═─]/i);
  // Match FOOTER comment regardless of delimiter style
  const footIdx  = css.search(/\/\*[\s═─]*FOOTER[\s═─]/i);
  // Ensure footer marker is AFTER the hero marker
  const actualFootIdx = footIdx > heroIdx ? footIdx : -1;

  if (heroIdx === -1 || actualFootIdx === -1) {
    console.warn('  Could not split CSS — hero or footer marker missing');
    return null;
  }
  const footIdx_final = actualFootIdx;

  return {
    shared_top:     css.slice(0, heroIdx).trimEnd(),
    page_specific:  css.slice(heroIdx, footIdx_final).trimEnd(),
    shared_bottom:  css.slice(footIdx_final).trimStart(),
  };
}

function buildSharedCss() {
  // Use rooms.html as the authoritative source for shared sections
  const html = read('rooms.html');
  const styleBlocks = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)];

  if (styleBlocks.length < 2) {
    console.error('rooms.html: expected 2 <style> blocks');
    return null;
  }

  const firstBlock  = styleBlocks[0][1];
  const secondBlock = styleBlocks[1][1];

  const split = splitCss(firstBlock);
  if (!split) return null;

  const shared = [
    '/* ====================================================',
    '   style.css — shared across all sub-pages',
    '   (rooms / dive / gallery / location)',
    '==================================================== */',
    '',
    split.shared_top,
    '',
    split.shared_bottom,
    '',
    '/* ── Second block: mobile optimisations (shared) ── */',
    secondBlock.trim(),
  ].join('\n');

  return shared;
}

function rewriteSubpage(filename, sharedCss) {
  let html = read(filename);
  const styleBlocks = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)];

  if (styleBlocks.length < 1) {
    console.warn(filename + ': no <style> block found');
    return html;
  }

  // First <style> block
  const firstFull  = styleBlocks[0][0]; // <style>...</style>
  const firstInner = styleBlocks[0][1];
  const split      = splitCss(firstInner);

  if (!split) {
    console.warn(filename + ': could not split CSS, skipping');
    return html;
  }

  // Build the replacement: keep only the page-specific middle part
  const newInline = `<style>\n${split.page_specific.trim()}\n</style>`;

  // Remove the first <style> block and replace with page-specific only
  html = html.replace(firstFull, newInline);

  // Remove second <style> block entirely (now in style.css)
  if (styleBlocks.length >= 2) {
    html = html.replace(styleBlocks[1][0], '');
  }

  // Add <link> to style.css right after <meta charset> or at top of <head>
  if (!html.includes('href="style.css"')) {
    html = html.replace(
      /(<meta\s+charset[^>]*>\s*\n)/i,
      '$1  <link rel="stylesheet" href="style.css" />\n'
    );
  }

  return html;
}

/* ─────────────────────────────────────────────────────────────────
   FIX 5 — Remove large preload from dive.html
───────────────────────────────────────────────────────────────── */
function removeDivePreload(html) {
  // Remove the <link rel="preload"> for the large background PNG
  return html.replace(
    /<link\s+rel="preload"\s+as="image"\s+href="images\/Nature Folder\/Chromodoris willani\.jpg"\s*\/>\s*\n?/,
    ''
  );
}

/* ─────────────────────────────────────────────────────────────────
   FIX 8 — Fix lazy-loading on dive.html
   Ensure all below-fold images (non-hero, non-logo) are lazy
───────────────────────────────────────────────────────────────── */
function fixDiveLazyLoading(html) {
  // Images that should be EAGER: logo imgs + hero img
  // All others should be lazy
  // The hero image already has loading="eager" and fetchpriority="high"
  // Static species images in the page (not JS-generated) need loading="lazy"
  return html.replace(
    /<img\s+decoding="async"\s+src="images\/Nature Folder\/([^"]+)"\s+alt="([^"]*)"\s+width="(\d+)"\s+height="(\d+)"\s*\/>/g,
    '<img decoding="async" loading="lazy" src="images/Nature Folder/$1" alt="$2" width="$3" height="$4" />'
  );
}

/* ─────────────────────────────────────────────────────────────────
   FIX 6 — Lazy-load Facebook SDK on gallery.html
   Replace the inline <script> tag with an IntersectionObserver
   that fires only when the user scrolls near the Facebook section.
───────────────────────────────────────────────────────────────── */
function lazyLoadFacebookSdk(html) {
  const oldScript = `<script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0"></script>`;

  if (!html.includes(oldScript)) {
    console.warn('gallery.html: Facebook SDK tag not found (already patched?)');
    return html;
  }

  const newScript = `<script>
  /* Lazy-load Facebook SDK — fires only when user scrolls near the section */
  (function(){
    var fbLoaded = false;
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting && !fbLoaded){
          fbLoaded = true;
          observer.disconnect();
          var s = document.createElement('script');
          s.async = true; s.defer = true; s.crossOrigin = 'anonymous';
          s.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
          document.head.appendChild(s);
        }
      });
    }, { rootMargin: '400px 0px' });
    var target = document.getElementById('fb-root') || document.querySelector('.fb-section');
    if(target) observer.observe(target);
  })();
</script>`;

  return html.replace(oldScript, newScript);
}

/* ─────────────────────────────────────────────────────────────────
   ALSO add style.css link to index.html (shares nav/footer tokens
   with index through the preconnect + font chain, but index.html
   uses different CSS variable names so we only add a minimal link
   — this is a no-op for index since shared CSS uses --bg / --text
   tokens not used by index.  We skip index CSS extraction but still
   apply fonts-async + dns-prefetch to it.)
───────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────────────── */

console.log('=== Building style.css ===');
const sharedCss = buildSharedCss();
if (sharedCss) {
  write('style.css', sharedCss);
  console.log('✓ style.css written (' + sharedCss.split('\n').length + ' lines)');
} else {
  console.error('✗ Could not build style.css — aborting CSS extraction');
  process.exit(1);
}

console.log('\n=== Rewriting sub-pages ===');
SUBPAGES.forEach(page => {
  let html = rewriteSubpage(page, sharedCss);
  // Apply all other fixes
  html = makeGFontsAsync(html);
  html = addDnsPrefetch(html);
  if (page === 'dive.html') {
    html = removeDivePreload(html);
    html = fixDiveLazyLoading(html);
  }
  if (page === 'gallery.html') {
    html = lazyLoadFacebookSdk(html);
  }
  write(page, html);

  // Report results
  const remaining = (html.match(/<style>/g) || []).length;
  const hasStyleCss = html.includes('href="style.css"');
  const hasAsync   = html.includes('onload="this.onload=null');
  const hasDns     = html.includes('rel="dns-prefetch"');
  console.log(`✓ ${page} | style.css link=${hasStyleCss} | gfonts-async=${hasAsync} | dns-prefetch=${hasDns} | inline <style> blocks remaining=${remaining}`);
});

console.log('\n=== Patching index.html (fonts + dns only) ===');
let indexHtml = read('index.html');
indexHtml = makeGFontsAsync(indexHtml);
indexHtml = addDnsPrefetch(indexHtml);
write('index.html', indexHtml);
const idxAsync = indexHtml.includes('onload="this.onload=null');
const idxDns   = indexHtml.includes('rel="dns-prefetch"');
console.log(`✓ index.html | gfonts-async=${idxAsync} | dns-prefetch=${idxDns}`);

console.log('\nDone.');
