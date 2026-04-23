/**
 * remove_pricing.js — Strip all pricing / rate references from all 5 pages.
 */
const fs = require('fs');

function patch(filename, replacements) {
  let html = fs.readFileSync(filename, 'utf8');
  const orig = html;
  for (const [from, to] of replacements) {
    if (typeof from === 'string') {
      if (!html.includes(from)) {
        console.warn(`  ⚠ NOT FOUND in ${filename}: "${from.slice(0, 60)}"`);
        continue;
      }
      html = html.split(from).join(to);
    } else {
      // RegExp
      html = html.replace(from, to);
    }
  }
  if (html !== orig) {
    fs.writeFileSync(filename, html, 'utf8');
    console.log(`✓ Patched: ${filename}`);
  } else {
    console.log(`– No changes: ${filename}`);
  }
}

/* ─── index.html ─── */
patch('index.html', [
  // Meta description — remove rate
  [
    'World-class diving, ocean-front rooms, island BBQ. Rates from ₱6,441/night with breakfast.',
    'World-class diving, ocean-front rooms, island BBQ and island excursions.'
  ],
  // JSON-LD schema — remove priceRange
  [
    '\n    "priceRange": "₱₱₱",\n',
    '\n'
  ],
  // Rooms section footer note — remove rate, keep breakfast & non-smoking note
  [
    'All rates include breakfast · Non-smoking rooms available · <a href="#booking" style="color:var(--accent);text-decoration:none">Contact us for dive &amp; stay packages →</a>',
    'Breakfast included for all guests · Non-smoking rooms available · <a href="#booking" style="color:var(--accent);text-decoration:none">Contact us for dive &amp; stay packages →</a>'
  ],
  // Booking section subtitle — remove rate
  [
    'Book your stay at Casa Escondida Anilao — rates from ₱6,441/night including breakfast. Dive packages available.',
    'Book your stay at Casa Escondida Anilao — ocean-front rooms, world-class diving, and warm Filipino hospitality. Enquire about dive &amp; stay packages.'
  ],
]);

/* ─── rooms.html ─── */
patch('rooms.html', [
  // Meta description
  [
    '31 ocean-side rooms and suites at Casa Escondida Anilao — standard doubles to spacious ocean suites and family rooms. All rates include breakfast.',
    '31 ocean-side rooms and suites at Casa Escondida Anilao — standard doubles to spacious ocean suites and family rooms. Breakfast included for all guests.'
  ],
  // Amenities paragraph
  [
    'All rates include a full Filipino breakfast for all guests.',
    'A full Filipino breakfast is included for all guests.'
  ],
  // Footer note
  [
    'All rates include breakfast for all registered guests',
    'Breakfast is included for all registered guests'
  ],
  // Contact CTA
  [
    'Contact us directly for the best rates, dive &amp; stay packages, and group bookings.',
    'Contact us directly for dive &amp; stay packages and group bookings.'
  ],
]);

/* ─── dive.html ─── */
patch('dive.html', [
  // Both occurrences of the same footer note (deduped automatically by split/join)
  [
    ' Contact us for group &amp; liveaboard rates.',
    ''
  ],
  [
    ' Contact us for group & liveaboard rates.',
    ''
  ],
]);

/* ─── location.html ─── */
patch('location.html', [
  // Transport card: self-drive price div
  [
    '\n          <div class="tr-price">Fuel + tolls · ~₱1,500 one-way</div>',
    ''
  ],
  // Transport card: private van price div
  [
    '\n          <div class="tr-price">From ₱5,500 per van (4–6 pax)</div>',
    ''
  ],
  // Transport card: public bus price div
  [
    '\n          <div class="tr-price">~₱400 total per person</div>',
    ''
  ],
  // Bus route step — remove ₱180 fare
  [
    '<span><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>~₱180</span>',
    '<span><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>~2 hr</span>'
  ],
  // Tricycle step — remove ₱200 fare
  [
    '<span><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>~₱200</span>',
    '<span><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>~15 min</span>'
  ],
  // FAQ: remove pricing sentence from van transfer answer
  [
    ' Rates start at ₱5,500 per van (seats 4–6 with luggage and dive gear).',
    ''
  ],
  // "pick the one that fits your schedule and budget" → remove "budget"
  [
    'Every route leads to the same hidden cove — pick the one that fits your schedule and budget.',
    'Every route leads to the same hidden cove — pick the one that fits your schedule.'
  ],
]);

console.log('\nAll done. Verifying…');

/* ─── Verify no ₱ or "rate" left ─── */
['index.html', 'rooms.html', 'dive.html', 'gallery.html', 'location.html'].forEach(f => {
  const h = fs.readFileSync(f, 'utf8');
  const pesoMatches = [...h.matchAll(/₱/g)].map(m => {
    const ctx = h.slice(Math.max(0, m.index - 30), m.index + 40).replace(/\n/g, ' ');
    return `  char ${m.index}: "${ctx}"`;
  });
  const rateMatches = [...h.matchAll(/\bRates? from\b|\brates? from\b/g)].map(m => {
    const ctx = h.slice(Math.max(0, m.index - 20), m.index + 50).replace(/\n/g, ' ');
    return `  char ${m.index}: "${ctx}"`;
  });
  if (pesoMatches.length || rateMatches.length) {
    console.log(`\n${f} still has:`);
    pesoMatches.forEach(l => console.log(l));
    rateMatches.forEach(l => console.log(l));
  } else {
    console.log(`✓ ${f}: clean`);
  }
});
