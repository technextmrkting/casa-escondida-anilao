const fs = require('fs');
let html = fs.readFileSync('dive.html', 'utf8');

/* ─── 1. Replace sites-section CSS ─── */
const oldCSS = `    .sites-section{background:var(--bg2);border-top:1px solid var(--border);}`;
const newCSS = `    .sites-section{background:var(--bg2);border-top:1px solid var(--border);}

    /* ── Interactive Dive Map ── */
    .sitemap-wrap{display:grid;grid-template-columns:1fr 300px;gap:1.5rem;align-items:start;margin-top:2.5rem;}
    @media(max-width:960px){.sitemap-wrap{grid-template-columns:1fr;}}
    .sitemap-map-outer{position:relative;border-radius:8px;overflow:hidden;border:1px solid var(--border);background:#0a1628;}
    .sitemap-img{width:100%;height:auto;display:block;opacity:.9;}
    .sitemap-pin{position:absolute;transform:translate(-50%,-50%);width:22px;height:22px;border-radius:50%;background:var(--accent);border:2px solid rgba(255,255,255,.9);color:#04080f;font-size:.55rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;z-index:3;font-family:'DM Sans',sans-serif;padding:0;line-height:1;}
    .sitemap-pin:hover,.sitemap-pin.active{background:#fff;border-color:var(--accent);color:var(--accent);transform:translate(-50%,-50%) scale(1.35);z-index:10;box-shadow:0 0 0 5px rgba(77,194,232,.25);}
    .sitemap-pin.casa{background:var(--gold);border-color:#fff;color:#04080f;}
    .sitemap-pin.casa:hover,.sitemap-pin.casa.active{background:#fff;border-color:var(--gold);color:var(--gold);}

    .sitemap-detail{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:1.6rem;position:sticky;top:80px;}
    .sitemap-detail-empty{text-align:center;padding:2.5rem 1rem;color:var(--text3);}
    .sitemap-detail-empty svg{width:36px;height:36px;margin:0 auto 1rem;display:block;opacity:.3;}
    .sitemap-detail-empty p{font-size:.78rem;letter-spacing:.06em;}
    .sitemap-detail-num{font-family:'Playfair Display',serif;font-size:2.4rem;font-weight:300;color:var(--accent);line-height:1;margin-bottom:.3rem;}
    .sitemap-detail-name{font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:400;color:var(--text);margin-bottom:.25rem;line-height:1.2;}
    .sitemap-detail-type{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:1.2rem;}
    .sitemap-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:.8rem;border-top:1px solid var(--border);padding-top:1.2rem;}
    .sitemap-spec{display:flex;flex-direction:column;gap:.2rem;}
    .sitemap-spec-lbl{font-size:.56rem;letter-spacing:.18em;text-transform:uppercase;color:var(--text3);font-weight:600;}
    .sitemap-spec-val{font-size:.82rem;color:var(--text);font-weight:500;}
    .sitemap-detail-desc{font-size:.82rem;line-height:1.65;color:var(--text2);margin:1rem 0;border-top:1px solid var(--border);padding-top:1rem;}

    .sitemap-list-wrap{margin-top:2rem;}
    .sitemap-list-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;}
    .sitemap-list-title{font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);}
    .sitemap-search{background:transparent;border:1px solid var(--border);border-radius:4px;padding:.4rem .8rem;font-size:.75rem;color:var(--text);font-family:inherit;outline:none;width:180px;transition:border-color .3s;}
    .sitemap-search::placeholder{color:var(--text3);}
    .sitemap-search:focus{border-color:var(--accent);}
    .sitemap-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:.5rem;max-height:320px;overflow-y:auto;padding-right:.3rem;}
    .sitemap-list::-webkit-scrollbar{width:4px;}
    .sitemap-list::-webkit-scrollbar-track{background:var(--bg2);}
    .sitemap-list::-webkit-scrollbar-thumb{background:var(--border2);border-radius:4px;}
    .smap-list-item{display:flex;align-items:center;gap:.65rem;padding:.55rem .75rem;background:var(--card);border:1px solid var(--border);border-radius:4px;cursor:pointer;transition:all .25s;font-size:.78rem;text-align:left;}
    .smap-list-item:hover,.smap-list-item.active{border-color:var(--accent);background:var(--accent-g);color:var(--accent);}
    .smap-list-num{font-family:'Playfair Display',serif;font-size:.85rem;font-weight:300;color:var(--accent);min-width:20px;}
    .smap-list-item.active .smap-list-num{color:var(--accent);}
    .smap-no-results{grid-column:1/-1;text-align:center;padding:1.5rem;color:var(--text3);font-size:.8rem;}`;

html = html.replace(oldCSS, newCSS);

/* ─── 2. Replace the sites-section HTML ─── */
const oldSection = `    <div class="sites-mosaic rvl">
      <div class="site-tile st-large">
        <img src="images/Nature Folder/Leaf Sheep sea slug (Costasiella kuroshimae).jpg" alt="Leaf sheep sea slug — Secret Bay macro critter" loading="lazy" />
        <div class="site-tile-info"><div class="site-tile-name">Secret Bay</div><div class="site-tile-depth">5–18m · Macro Heaven</div></div>
      </div>
      <div class="site-tile">
        <img src="images/Nature Folder/Sea Anemone Coral Reef.jpg" alt="Anilao coral garden and anemones" loading="lazy" />
        <div class="site-tile-info"><div class="site-tile-name">Coral Garden</div><div class="site-tile-depth">8–25m · Soft Coral</div></div>
      </div>
      <div class="site-tile">
        <img src="images/Nature Folder/bigeye trevally (Caranx sexfasciatus).jpg" alt="Bigeye trevally school — Twin Rocks Anilao" loading="lazy" />
        <div class="site-tile-info"><div class="site-tile-name">Twin Rocks</div><div class="site-tile-depth">10–28m · Wall Dive</div></div>
      </div>
      <div class="site-tile st-tall">
        <img src="images/Nature Folder/Wunderpus octopus (Wunderpus photogenicus).jpg" alt="Wunderpus octopus — Sombrero Island" loading="lazy" />
        <div class="site-tile-info"><div class="site-tile-name">Sombrero Island</div><div class="site-tile-depth">12–35m · Drop-off</div></div>
      </div>
      <div class="site-tile">
        <img src="images/Nature Folder/Spotfin Lionfish (Pterois antennata).jpg" alt="Spotfin lionfish — Mainit Point deep dive" loading="lazy" />
        <div class="site-tile-info"><div class="site-tile-name">Mainit Point</div><div class="site-tile-depth">15–40m · Deep Dive</div></div>
      </div>
    </div>
    <div class="sites-list rvl">
      <div class="site-row"><div class="site-num">01</div><div><div class="site-info-name">Beatrice Rock</div><div class="site-info-meta">5–22m · Beginner-friendly · Critters & coral</div></div></div>
      <div class="site-row"><div class="site-num">02</div><div><div class="site-info-name">Cathedral Rock</div><div class="site-info-meta">10–30m · Intermediate · Dramatic formations</div></div></div>
      <div class="site-row"><div class="site-num">03</div><div><div class="site-info-name">Kirby's Rock</div><div class="site-info-meta">8–25m · All levels · Frogfish & ghost pipefish</div></div></div>
      <div class="site-row"><div class="site-num">04</div><div><div class="site-info-name">Arthur's Rock</div><div class="site-info-meta">12–35m · Advanced · Thresher shark encounters</div></div></div>
      <div class="site-row"><div class="site-num">05</div><div><div class="site-info-name">Washing Machine</div><div class="site-info-meta">15–40m · Advanced · Strong current & pelagics</div></div></div>
      <div class="site-row"><div class="site-num">06</div><div><div class="site-info-name">Night Dive — House Reef</div><div class="site-info-meta">3–12m · All levels · Octopus, mandarin fish</div></div></div>
    </div>`;

const newSection = `    <!-- ── Interactive Dive Sites Map ── -->
    <div class="sitemap-wrap rvl">

      <!-- MAP -->
      <div>
        <div class="sitemap-map-outer" id="sitemapMapOuter">
          <img class="sitemap-img" src="images/dive-map.jpg" alt="Mabini and Tingloy Dive Sites Map" loading="lazy" id="sitemapImg" />
          <!-- Pins are injected by JS -->
        </div>

        <!-- LIST BELOW MAP -->
        <div class="sitemap-list-wrap rvl">
          <div class="sitemap-list-head">
            <div class="sitemap-list-title">All 55 Dive Sites</div>
            <input class="sitemap-search" id="sitemapSearch" type="search" placeholder="Search sites\u2026" aria-label="Search dive sites" />
          </div>
          <div class="sitemap-list" id="sitemapList"></div>
        </div>
      </div>

      <!-- DETAIL PANEL -->
      <div class="sitemap-detail" id="sitemapDetail">
        <div class="sitemap-detail-empty" id="sitemapEmpty">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          <p>Click any numbered marker<br>or site name to view details</p>
        </div>
        <div id="sitemapInfo" style="display:none">
          <div class="sitemap-detail-num" id="sdNum"></div>
          <div class="sitemap-detail-name" id="sdName"></div>
          <div class="sitemap-detail-type" id="sdType"></div>
          <div class="sitemap-detail-desc" id="sdDesc"></div>
          <div class="sitemap-detail-grid">
            <div class="sitemap-spec"><div class="sitemap-spec-lbl">Depth</div><div class="sitemap-spec-val" id="sdDepth"></div></div>
            <div class="sitemap-spec"><div class="sitemap-spec-lbl">Level</div><div class="sitemap-spec-val" id="sdLevel"></div></div>
            <div class="sitemap-spec"><div class="sitemap-spec-lbl">Highlights</div><div class="sitemap-spec-val" id="sdHL"></div></div>
            <div class="sitemap-spec"><div class="sitemap-spec-lbl">Best Time</div><div class="sitemap-spec-val" id="sdSeason"></div></div>
          </div>
        </div>
      </div>

    </div>`;

html = html.replace(oldSection, newSection);

/* ─── 3. Inject dive-map JS before the ECOSYSTEM LIBRARY block ─── */
const ecoComment = `  /* ────────────────────────────────────────────────────────
     ECOSYSTEM LIBRARY — data, render, filter, modal
  ──────────────────────────────────────────────────────── */`;

const mapJS = `  /* ────────────────────────────────────────────────────────
     INTERACTIVE DIVE SITES MAP
  ──────────────────────────────────────────────────────── */
  (function(){
    const SITES = [
      {n:1,  name:"Cathedral",                   type:"Intermediate",  depth:"6\u201322 m", level:"Intermediate", hl:"Cathedral formations, rich coral",    season:"Year-round",   x:25.0, y:64.5},
      {n:2,  name:"Eagle Point",                 type:"All Levels",    depth:"5\u201318 m", level:"All levels",    hl:"Macro critters, soft coral",          season:"Year-round",   x:21.5, y:68.5},
      {n:3,  name:"Koala",                       type:"Beginner",      depth:"5\u201318 m", level:"Beginner",      hl:"Reef fish, nudibranchs",              season:"Year-round",   x:27.5, y:72.0},
      {n:4,  name:"Koala Aquarium",              type:"Beginner",      depth:"5\u201315 m", level:"Beginner",      hl:"Schooling fish, coral bommies",       season:"Year-round",   x:22.0, y:74.5},
      {n:5,  name:"Arthur\u2019s Rock",          type:"Advanced",      depth:"12\u201335 m",level:"Advanced",      hl:"Thresher sharks, pelagics",           season:"Nov\u2013Apr", x:22.5, y:74.0},
      {n:6,  name:"Twin Rocks",                  type:"All Levels",    depth:"8\u201328 m", level:"All levels",    hl:"Wall dive, schooling fish",           season:"Year-round",   x:29.0, y:77.0},
      {n:7,  name:"Mainit",                      type:"Advanced",      depth:"18\u201340 m",level:"Advanced",      hl:"Thermocline, rare critters",          season:"Year-round",   x:29.5, y:81.5},
      {n:8,  name:"Bubble\u2019s Point",         type:"Intermediate",  depth:"10\u201330 m",level:"Intermediate",  hl:"Giant frogfish, ghost pipefish",      season:"Year-round",   x:37.5, y:77.0},
      {n:9,  name:"Bahura",                      type:"All Levels",    depth:"5\u201325 m", level:"All levels",    hl:"Coral gardens, turtles",              season:"Year-round",   x:17.0, y:72.5},
      {n:10, name:"Bahura Kanto",                type:"Intermediate",  depth:"8\u201325 m", level:"Intermediate",  hl:"Mandarin fish, pygmy seahorse",       season:"Year-round",   x:20.0, y:73.0},
      {n:11, name:"Layag-layag",                 type:"All Levels",    depth:"5\u201322 m", level:"All levels",    hl:"Nudibranchs, flatworms",              season:"Year-round",   x:13.5, y:74.5},
      {n:12, name:"Layag-layag Bahura",          type:"All Levels",    depth:"6\u201322 m", level:"All levels",    hl:"Critters, coral rubble",              season:"Year-round",   x:16.5, y:74.0},
      {n:13, name:"Kirby\u2019s Rock",           type:"All Levels",    depth:"8\u201325 m", level:"All levels",    hl:"Frogfish, ghost pipefish",            season:"Year-round",   x:18.5, y:76.5},
      {n:14, name:"Bahay Kambing",               type:"Intermediate",  depth:"8\u201325 m", level:"Intermediate",  hl:"Macro critters, coral",               season:"Year-round",   x:21.0, y:76.5},
      {n:15, name:"Caban Cove",                  type:"Beginner",      depth:"5\u201318 m", level:"Beginner",      hl:"Reef fish, nudibranchs",              season:"Year-round",   x:15.5, y:79.5},
      {n:16, name:"Betlehem",                    type:"All Levels",    depth:"5\u201320 m", level:"All levels",    hl:"Soft coral, reef fish",               season:"Year-round",   x:11.5, y:81.0},
      {n:17, name:"Darilaut",                    type:"All Levels",    depth:"6\u201320 m", level:"All levels",    hl:"Macro critters",                      season:"Year-round",   x:13.5, y:81.5},
      {n:18, name:"Sepoc Wall",                  type:"Intermediate",  depth:"10\u201330 m",level:"Intermediate",  hl:"Wall, coral fans, turtles",           season:"Year-round",   x:11.0, y:76.5},
      {n:19, name:"Sepoc 2 (Phillip\u2019s Garden)", type:"Intermediate", depth:"8\u201325 m", level:"Intermediate", hl:"Nudibranchs, flatworms",           season:"Year-round",   x:10.0, y:78.5},
      {n:20, name:"Sombrero Island",             type:"Intermediate",  depth:"10\u201335 m",level:"Intermediate",  hl:"Drop-off, schooling fish",            season:"Year-round",   x:10.5, y:74.5},
      {n:21, name:"Beatrize Rock",               type:"Beginner",      depth:"5\u201322 m", level:"Beginner",      hl:"Critters, coral rubble",              season:"Year-round",   x:12.5, y:72.5},
      {n:22, name:"Beatrize 2 (Larry\u2019s Garden)", type:"Beginner", depth:"5\u201320 m", level:"Beginner",      hl:"Nudibranchs, macro",                  season:"Year-round",   x:8.5,  y:72.5},
      {n:23, name:"Apol\u2019s Point",           type:"Intermediate",  depth:"8\u201328 m", level:"Intermediate",  hl:"Macro critters, coral",               season:"Year-round",   x:42.0, y:91.5},
      {n:24, name:"Coconut",                     type:"All Levels",    depth:"5\u201322 m", level:"All levels",    hl:"Reef fish, coral",                    season:"Year-round",   x:35.5, y:93.5},
      {n:25, name:"Grotto",                      type:"Intermediate",  depth:"8\u201325 m", level:"Intermediate",  hl:"Cave, coral garden",                  season:"Year-round",   x:64.5, y:96.0},
      {n:26, name:"Bonito Island",               type:"All Levels",    depth:"5\u201322 m", level:"All levels",    hl:"Schooling fish, reef",                season:"Year-round",   x:65.5, y:98.0},
      {n:27, name:"Light House (Malahibo Manok)",type:"Advanced",      depth:"15\u201340 m",level:"Advanced",      hl:"Pelagics, current dive",              season:"Apr\u2013Oct", x:71.0, y:97.5},
      {n:28, name:"Devil\u2019s Point",          type:"Advanced",      depth:"15\u201340 m",level:"Advanced",      hl:"Pelagics, strong current",            season:"Apr\u2013Oct", x:17.0, y:95.5},
      {n:29, name:"Mapating",                    type:"Advanced",      depth:"15\u201340 m",level:"Advanced",      hl:"Current, open water pelagics",        season:"Apr\u2013Oct", x:5.0,  y:87.5},
      {n:30, name:"Vistamar",                    type:"All Levels",    depth:"5\u201322 m", level:"All levels",    hl:"Coral garden, reef fish",             season:"Year-round",   x:47.0, y:52.5},
      {n:31, name:"Basura",                      type:"Intermediate",  depth:"8\u201325 m", level:"Intermediate",  hl:"Muck dive, critters",                 season:"Year-round",   x:47.0, y:55.5},
      {n:32, name:"Dive N Trek (Cave)",          type:"Intermediate",  depth:"8\u201325 m", level:"Intermediate",  hl:"Cave dive, coral",                    season:"Year-round",   x:47.0, y:34.0},
      {n:33, name:"Dive N Trek (Clams)",         type:"Beginner",      depth:"5\u201318 m", level:"Beginner",      hl:"Giant clams, reef fish",              season:"Year-round",   x:48.5, y:38.5},
      {n:34, name:"Ligpo Island",                type:"Intermediate",  depth:"8\u201328 m", level:"Intermediate",  hl:"Reef fish, macro",                    season:"Year-round",   x:43.5, y:29.0},
      {n:35, name:"Ligpo Cave",                  type:"Advanced",      depth:"10\u201330 m",level:"Advanced",      hl:"Cave system, schooling fish",         season:"Year-round",   x:44.5, y:20.0},
      {n:36, name:"Batalan Rock",                type:"Intermediate",  depth:"8\u201325 m", level:"Intermediate",  hl:"Rock pinnacle, reef fish",            season:"Year-round",   x:9.0,  y:93.0},
      {n:37, name:"Agahuta",                     type:"All Levels",    depth:"5\u201322 m", level:"All levels",    hl:"Coral garden",                        season:"Year-round",   x:21.5, y:85.5},
      {n:38, name:"Red Rocks",                   type:"Intermediate",  depth:"10\u201328 m",level:"Intermediate",  hl:"Macro critters, coral",               season:"Year-round",   x:62.5, y:71.0},
      {n:39, name:"3\u2019s Cuevas",             type:"All Levels",    depth:"5\u201322 m", level:"All levels",    hl:"Caves, reef fish",                    season:"Year-round",   x:17.5, y:83.5},
      {n:40, name:"Dead Palm",                   type:"Beginner",      depth:"5\u201318 m", level:"Beginner",      hl:"Macro critters, soft coral",          season:"Year-round",   x:28.5, y:77.5},
      {n:41, name:"Secret Bay",                  type:"All Levels",    depth:"3\u201318 m", level:"All levels",    hl:"Macro heaven, wunderpus, frogfish",   season:"Year-round",   x:46.5, y:79.5},
      {n:42, name:"Anilao Pier",                 type:"Beginner",      depth:"3\u201315 m", level:"Beginner",      hl:"Night dive, mandarin fish",           season:"Year-round",   x:48.0, y:76.5},
      {n:43, name:"Sunview",                     type:"All Levels",    depth:"5\u201322 m", level:"All levels",    hl:"Reef fish, coral",                    season:"Year-round",   x:39.5, y:72.0},
      {n:44, name:"Buceo (Balanoy)",             type:"All Levels",    depth:"5\u201322 m", level:"All levels",    hl:"Reef fish, macro",                    season:"Year-round",   x:34.0, y:81.5},
      {n:45, name:"Matu",                        type:"All Levels",    depth:"5\u201322 m", level:"All levels",    hl:"Coral garden, turtles",               season:"Year-round",   x:40.5, y:52.0},
      {n:46, name:"Mayumi",                      type:"Beginner",      depth:"5\u201318 m", level:"Beginner",      hl:"Macro, coral",                        season:"Year-round",   x:27.0, y:68.5},
      {n:47, name:"Helicopter",                  type:"Intermediate",  depth:"8\u201325 m", level:"Intermediate",  hl:"Wreck, coral",                        season:"Year-round",   x:31.5, y:62.5},
      {n:48, name:"Dive 7000",                   type:"Intermediate",  depth:"8\u201325 m", level:"Intermediate",  hl:"Critters, macro dive",                season:"Year-round",   x:38.5, y:64.5},
      {n:49, name:"Onad\u2019s Point (Vivere)",  type:"All Levels",    depth:"5\u201322 m", level:"All levels",    hl:"Coral garden, reef fish",             season:"Year-round",   x:38.5, y:78.5},
      {n:50, name:"Minilog",                     type:"All Levels",    depth:"5\u201320 m", level:"All levels",    hl:"Macro critters, coral",               season:"Year-round",   x:14.5, y:83.5},
      {n:51, name:"Hiedi\u2019s Point",          type:"Intermediate",  depth:"8\u201328 m", level:"Intermediate",  hl:"Macro, coral fans",                   season:"Year-round",   x:61.0, y:78.5},
      {n:52, name:"Saimsim",                     type:"All Levels",    depth:"5\u201322 m", level:"All levels",    hl:"Reef fish, coral",                    season:"Year-round",   x:56.5, y:71.0},
      {n:53, name:"Anilao (Black Water)",        type:"Advanced",      depth:"Open water",  level:"Advanced",      hl:"Pelagic larvae, blackwater dive",     season:"Year-round",   x:53.5, y:62.5},
      {n:54, name:"Mandarin Reef",               type:"All Levels",    depth:"3\u201315 m", level:"All levels",    hl:"Mandarin fish, coral garden",         season:"Year-round",   x:55.5, y:62.5},
      {n:55, name:"El Pinoy",                    type:"Beginner",      depth:"5\u201318 m", level:"Beginner",      hl:"Reef fish, soft coral",               season:"Year-round",   x:36.5, y:72.5}
    ];

    const DESC = {
      1:"Dramatic cathedral-like rock formations draped in soft coral, gorgonians and sponges. A signature Anilao site with resident turtles and schooling fusiliers.",
      2:"Gentle sloping reef perfect for all skill levels. Rich in nudibranchs, flatworms and macro critters on the rubble zone.",
      3:"Shallow, colourful reef teeming with reef fish, clownfish and the occasional leafy scorpionfish hiding in the rubble.",
      4:"An underwater aquarium of schooling anthias, butterflyfish and damselfish hovering above pristine coral bommies.",
      5:"A legendary site for advanced divers. Thresher sharks, hammerheads and other pelagics patrol the deep blue beyond the wall.",
      6:"Twin pinnacles rising from the sand, blanketed in soft coral and surrounded by swirling schools of jacks and snappers.",
      7:"Anilao\u2019s deepest regularly dived site, famous for its extreme thermocline and the rare critters found on the cold sand below.",
      8:"Named for the constant stream of micro-bubbles rising from volcanic vents. Home to giant frogfish and ornate ghost pipefish.",
      9:"Expansive coral garden sloping to a sandy plateau. Green sea turtles graze on the algae-coated boulders year-round.",
      10:"A macro photographer\u2019s dream patch: pygmy seahorses on sea fans, mandarin fish in the rubble, and nudibranch after nudibranch.",
      11:"A rubbly slope rich in aeolid and dorid nudibranchs, with the occasional flamboyant cuttlefish strutting across the sand.",
      12:"Combines critter-rich rubble with healthy hard coral shelves \u2014 a reliable site for both macro and wide-angle photography.",
      13:"Home to one of Anilao\u2019s most productive frogfish and ghost pipefish populations. Every visit turns up something new.",
      14:"Rocky boulders and coral heads shelter a surprising density of macro subjects on this often-overlooked site.",
      15:"A sheltered cove ideal for beginners and snorkellers. Clownfish, damselfish and wrasse dart through healthy staghorn coral.",
      16:"Gentle current delivers plankton to the soft coral fans here, attracting pygmy seahorses and barrel sponge micro-communities.",
      17:"Mixed rubble and coral slope with a reputation for unusual flatworms, nudibranchs and the occasional wunderpus in the sand.",
      18:"A dramatic vertical wall festooned with huge sea fans and barrel sponges. Green turtles rest on ledges along the wall face.",
      19:"Named after local diver Phillip, this garden of hard and soft coral is one of the best nudibranch sites on the Sombrero side.",
      20:"A remote island drop-off with schooling jacks, barracuda and the occasional hammerhead patrolling the blue water off the wall.",
      21:"Beginners love this gently sloping reef packed with nudibranchs, flatworms and the occasional pipefish in the coral rubble.",
      22:"Larry\u2019s personal nudibranch hunting ground. Expect to find species here that nowhere else in Anilao can reliably produce.",
      23:"A mixed reef site on Tingloy\u2019s eastern edge with healthy staghorn thickets and a productive sandy rubble macro zone.",
      24:"Shallow, beginner-friendly site on Tingloy\u2019s north shore with coconut-palm-style coral heads and reef fish galore.",
      25:"A stunning underwater grotto flooded with blue light. Coral-encrusted walls and a ceiling alive with glassfish and sweepers.",
      26:"A small island pinnacle surrounded by schooling bigeye trevally, jacks and the occasional whale shark on passage.",
      27:"Strong current dive for experienced divers only. Thresher sharks, manta rays and large pelagics frequent the channel.",
      28:"Exposed to open-ocean swells, Devil\u2019s Point rewards advanced divers with big schooling fish and pelagic encounters.",
      29:"One of Anilao\u2019s most remote sites. Current-swept and wild \u2014 only visited when conditions align, but worth every metre of boat ride.",
      30:"A gentle coral garden popular with underwater photographers. Resident mandarin fish emerge at dusk from the rubble.",
      31:"Classic Anilao muck diving. Sand and rubble patches harbour wunderpus, mimic octopus, hairy frogfish and rare pipefish.",
      32:"A lava-tube cave system with skylights that illuminate the coral-crusted ceiling. Exit through a swim-through into the blue.",
      33:"Giant clam sanctuary with specimens over a metre wide. Reef fish schools shelter inside the clam garden year-round.",
      34:"An island pinnacle with excellent visibility and a healthy reef crest for snorkelling directly above the dive site.",
      35:"Advanced cave system requiring a torch. The chambers are decorated with rare cave corals and schooling glassfish.",
      36:"A lonely rock pinnacle rising from deep water. Schooling fish gather at the summit and current pushes past the sides.",
      37:"Tranquil coral garden on the southern Balagbag shoreline \u2014 ideal for beginners and macro photography.",
      38:"Distinctive reddish iron-rich rocks support unusual encrusting coral and a surprising density of nudibranchs and flatworms.",
      39:"Three interconnected cuevas (caves) that make an exciting swim-through dive. Glassfish pack the interiors.",
      40:"Named for a dead coconut palm visible from the surface. Excellent frogfish and scorpionfish on the rubble below.",
      41:"Anilao\u2019s most celebrated macro site. Wunderpus, mimic octopus, leaf sheep sea slugs, and flamboyant cuttlefish all call it home.",
      42:"Easy shore entry makes this the top night dive site. Mandarin fish mate at dusk; octopus and cuttlefish hunt after dark.",
      43:"Scenic sloping reef with good visibility and a healthy mix of hard coral, schooling anthias and resident moray eels.",
      44:"One of the most accessible beginner dives close to Anilao town \u2014 reef fish, coral bommies and the occasional turtle.",
      45:"Sheltered garden of staghorn and table coral with excellent resident reef fish populations. Great snorkel site too.",
      46:"A pretty macro site close to Balagbag. Leaf sheep sea slugs, bumblebee shrimp and various nudibranchs on the rubble.",
      47:"Named for a helicopter wreck on the sandy bottom. The wreck is now colonised by coral and home to frogfish.",
      48:"A productive muck dive on a black-sand slope with numerous \u201ccritter\u201d species including hairy octopus and pegasus sea moths.",
      49:"The Vivere dive resort\u2019s house reef \u2014 shallow, colourful and home to an impressive variety of nudibranchs and reef fish.",
      50:"A small outcrop on the inner Balagbag bay with productive rubble patches for macro photography.",
      51:"Rocky bommie on the Anilao east coast with coral fans and a mix of nudibranch species on the deeper rubble.",
      52:"A quiet reef garden on the east side of the peninsula \u2014 reliable for turtles, moray eels and schooling snappers.",
      53:"Night / blackwater dive done in open water. Pelagic larvae, paper nautilus and juvenile cephalopods rise after dark.",
      54:"The best site in Anilao for watching mandarin fish courtship at dusk \u2014 a magical five-minute ritual at 3\u20136 m depth.",
      55:"Beginner-friendly sloping reef close to San Teodoro \u2014 soft coral, reef fish and a reliable nudibranch zone."
    };

    const mapOuter = document.getElementById('sitemapMapOuter');
    const sitemapImg = document.getElementById('sitemapImg');
    const detail = document.getElementById('sitemapDetail');
    const infoPanel = document.getElementById('sitemapInfo');
    const emptyMsg = document.getElementById('sitemapEmpty');
    const listEl = document.getElementById('sitemapList');
    const searchEl = document.getElementById('sitemapSearch');
    if (!mapOuter || !listEl) return;

    let activeSite = null;

    // Build pins
    const pins = {};
    SITES.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'sitemap-pin';
      btn.textContent = s.n;
      btn.title = s.name;
      btn.style.left = s.x + '%';
      btn.style.top  = s.y + '%';
      btn.setAttribute('aria-label', 'Site ' + s.n + ': ' + s.name);
      btn.addEventListener('click', () => selectSite(s.n));
      mapOuter.appendChild(btn);
      pins[s.n] = btn;
    });

    // Build list
    function buildList(filter) {
      listEl.innerHTML = '';
      const term = filter ? filter.toLowerCase() : '';
      const shown = SITES.filter(s => !term || s.name.toLowerCase().includes(term) || String(s.n).includes(term));
      if (!shown.length) { listEl.innerHTML = '<div class="smap-no-results">No results</div>'; return; }
      shown.forEach(s => {
        const item = document.createElement('button');
        item.className = 'smap-list-item' + (activeSite === s.n ? ' active' : '');
        item.innerHTML = '<span class="smap-list-num">' + s.n + '</span><span>' + s.name + '</span>';
        item.addEventListener('click', () => selectSite(s.n));
        listEl.appendChild(item);
      });
    }

    function selectSite(num) {
      activeSite = num;
      const s = SITES.find(x => x.n === num);
      if (!s) return;

      // Update pins
      Object.values(pins).forEach(p => p.classList.remove('active'));
      if (pins[num]) pins[num].classList.add('active');

      // Update list
      listEl.querySelectorAll('.smap-list-item').forEach(el => {
        el.classList.toggle('active', parseInt(el.querySelector('.smap-list-num').textContent) === num);
      });

      // Scroll pin into view on mobile
      if (pins[num] && window.innerWidth < 960) {
        pins[num].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Update detail panel
      emptyMsg.style.display = 'none';
      infoPanel.style.display = 'block';
      document.getElementById('sdNum').textContent = String(s.n).padStart(2,'0');
      document.getElementById('sdName').textContent = s.name;
      document.getElementById('sdType').textContent = s.type;
      document.getElementById('sdDesc').textContent = DESC[s.n] || '';
      document.getElementById('sdDepth').textContent = s.depth;
      document.getElementById('sdLevel').textContent = s.level;
      document.getElementById('sdHL').textContent = s.hl;
      document.getElementById('sdSeason').textContent = s.season;

      // Scroll detail panel to top
      detail.scrollTop = 0;
    }

    searchEl.addEventListener('input', () => buildList(searchEl.value));
    buildList();

  })();

  `;

html = html.replace(ecoComment, mapJS + ecoComment);

fs.writeFileSync('dive.html', html, 'utf8');
console.log('Sitemap done.');
