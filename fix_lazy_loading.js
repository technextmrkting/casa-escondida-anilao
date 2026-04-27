/**
 * fix_lazy_loading.js
 * Comprehensive lazy-loading & image optimisation for all 5 pages.
 *
 * Per-page changes
 * ─────────────────────────────────────────────────────────────────
 * ALL PAGES
 *   1. Add decoding="async" to every <img> that is missing it
 *   2. Nav logos: add fetchpriority="high" width="180" height="44"
 *   3. Add <link rel="preload"> for the hero background image (night mode)
 *      so it starts fetching before CSS is parsed
 *
 * dive.html  (CRITICAL)
 *   4. Hero <img> is missing every attribute — add eager + fetchpriority + decoding
 *
 * rooms.html
 *   5. Room slide images: add width="700" height="467" (same as index.html rooms)
 *
 * index.html
 *   6. About-section + service-card + mosaic images: add width/height hints
 *      to prevent layout shift
 */

const fs = require('fs');

/* ── helpers ─────────────────────────────────────────────── */

/** Add an attribute to an <img> tag if not already present */
function addAttr(tag, attr, value) {
  if (new RegExp(`\\b${attr}\\s*=`).test(tag)) return tag; // already has it
  return tag.replace(/^<img/, `<img ${attr}="${value}"`);
}

/** Add decoding="async" to every <img> missing it */
function addDecodingAsync(html) {
  return html.replace(/<img\b([^>]*)>/g, (match) => {
    if (/\bdecoding\s*=/.test(match)) return match;
    return match.replace(/^<img/, '<img decoding="async"');
  });
}

/** Add fetchpriority="high" to nav logo imgs */
function addNavLogoPriority(html) {
  // Both nav-logo-night and nav-logo-day imgs
  return html.replace(
    /<img\s([^>]*class="[^"]*nav-logo-img[^"]*"[^>]*)>/g,
    (match) => {
      let t = match;
      t = addAttr(t, 'fetchpriority', 'high');
      t = addAttr(t, 'width', '180');
      t = addAttr(t, 'height', '44');
      return t;
    }
  );
}

/** Inject <link rel="preload"> for the night-mode hero background
 *  right after the opening <head> tag */
function addHeroPreload(html, imagePath) {
  if (html.includes('rel="preload"') && html.includes(imagePath)) return html; // already done
  const preloadTag = `  <link rel="preload" as="image" href="${imagePath}" />\n`;
  return html.replace(/(<head[^>]*>)/, `$1\n${preloadTag}`);
}

/* ── page-specific fixes ──────────────────────────────────── */

function fixIndex(html) {
  // Nav logos
  html = addNavLogoPriority(html);

  // Preload the hero photo (day mode — most common first load)
  html = addHeroPreload(html, 'images/Hero Image/generate_different_angle_202604220023.png');

  // About section photos — add width/height (square-ish layout: 600×450)
  html = html.replace(
    /<img src="images\/Home%20page%20images\/([^"]+)" alt="([^"]*)" loading="lazy" \/>/g,
    '<img src="images/Home%20page%20images/$1" alt="$2" loading="lazy" decoding="async" width="600" height="450" />'
  );

  // Service card photos — 16:9-ish content images (800×533)
  html = html.replace(
    /<img src="images\/(Nature%20Folder|Home%20Page%20Image%20Gallery|rooms)\/([^"]+)" alt="([^"]*)" loading="lazy" \/>/g,
    '<img src="images/$1/$2" alt="$3" loading="lazy" decoding="async" width="800" height="533" />'
  );

  // Mosaic gallery images (square)
  html = html.replace(
    /<img src="images\/Home%20Page%20Image%20Gallery\/([^"]+)" alt="([^"]*)" loading="lazy" \/>/g,
    '<img src="images/Home%20Page%20Image%20Gallery/$1" alt="$2" loading="lazy" decoding="async" width="600" height="600" />'
  );

  // decoding="async" sweep for anything still missing
  html = addDecodingAsync(html);
  return html;
}

function fixRooms(html) {
  html = addNavLogoPriority(html);
  html = addHeroPreload(html, 'images/background/594413266_1405022098297117_5892045775093709556_n.jpg');

  // Room slide images — add width/height
  html = html.replace(
    /<img src="(images\/rooms\/[^"]+)" class="rm-slide([^"]*)" alt="([^"]*)" loading="lazy" \/>/g,
    '<img src="$1" class="rm-slide$2" alt="$3" loading="lazy" decoding="async" width="700" height="467" />'
  );

  html = addDecodingAsync(html);
  return html;
}

function fixDive(html) {
  html = addNavLogoPriority(html);
  html = addHeroPreload(html, 'images/Nature Folder/Chromodoris willani.jpg');

  // CRITICAL: hero image is missing ALL attributes
  html = html.replace(
    /<img src="images\/Nature Folder\/Chromodoris willani\.jpg" alt="([^"]*)" \/>/,
    '<img src="images/Nature Folder/Chromodoris willani.jpg" alt="$1" loading="eager" fetchpriority="high" decoding="async" width="1920" height="1080" />'
  );

  // Dive photo grid images
  html = html.replace(
    /<img src="(images\/[^"]+)" alt="([^"]*)" loading="lazy" \/>/g,
    '<img src="$1" alt="$2" loading="lazy" decoding="async" width="800" height="533" />'
  );

  html = addDecodingAsync(html);
  return html;
}

function fixGallery(html) {
  html = addNavLogoPriority(html);
  html = addHeroPreload(html, 'images/background/594413266_1405022098297117_5892045775093709556_n.jpg');

  // Facebook photo cards (500×500 aspect ratio)
  html = html.replace(
    /<img src="(images\/[^"]+)" alt="([^"]*)" loading="lazy" \/>/g,
    '<img src="$1" alt="$2" loading="lazy" decoding="async" width="600" height="600" />'
  );

  // YouTube thumbnails (16:9)
  html = html.replace(
    /(<img )([^>]*src="https:\/\/img\.youtube\.com[^"]*"[^>]*)(>)/g,
    (match, open, attrs, close) => {
      let t = open + attrs + close;
      t = addAttr(t, 'decoding', 'async');
      t = addAttr(t, 'width', '480');
      t = addAttr(t, 'height', '270');
      return t;
    }
  );

  // Unsplash images
  html = html.replace(
    /(<img )([^>]*src="https:\/\/images\.unsplash\.com[^"]*"[^>]*)(>)/g,
    (match, open, attrs, close) => {
      let t = open + attrs + close;
      t = addAttr(t, 'decoding', 'async');
      t = addAttr(t, 'width', '800');
      t = addAttr(t, 'height', '533');
      return t;
    }
  );

  html = addDecodingAsync(html);
  return html;
}

function fixLocation(html) {
  html = addNavLogoPriority(html);
  html = addHeroPreload(html, 'images/background/594413266_1405022098297117_5892045775093709556_n.jpg');
  html = addDecodingAsync(html);
  return html;
}

/* ── run ──────────────────────────────────────────────────── */

const fixes = {
  'index.html':    fixIndex,
  'rooms.html':    fixRooms,
  'dive.html':     fixDive,
  'gallery.html':  fixGallery,
  'location.html': fixLocation,
};

Object.entries(fixes).forEach(([filename, fn]) => {
  let html = fs.readFileSync(filename, 'utf8');
  const before = (html.match(/decoding="async"/g) || []).length;
  html = fn(html);
  const after = (html.match(/decoding="async"/g) || []).length;
  const hasPreload    = html.includes('rel="preload"');
  const hasNavPrio    = html.includes('fetchpriority="high"');
  const heroCritical  = filename === 'dive.html'
    ? html.includes('fetchpriority="high"') && html.includes('loading="eager"')
    : true;
  fs.writeFileSync(filename, html, 'utf8');
  console.log(`✓ ${filename} | preload=${hasPreload} navPrio=${hasNavPrio} heroCritical=${heroCritical} | decoding: ${before}→${after}`);
});

console.log('\nDone.');
