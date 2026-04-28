(function () {
  'use strict';

  // API key is injected server-side; leave empty in source control
  var API_KEY = '';
  var ACCENT  = '#2a7fa8';

  var SYSTEM_PROMPT =
    'You are a friendly, helpful assistant for Casa Escondida Anilao Resort & Dive Center — ' +
    'a boutique dive resort in Brgy. Ligaya, Mabini, Batangas 4202, Philippines. ' +
    'Help guests with questions about: ' +
    'rooms (standard doubles, ocean suites, family rooms — breakfast included for all guests); ' +
    'dive programs (PADI Open Water, Advanced OW, Rescue Diver, guided dives, night dives); ' +
    'dive sites (Kirby\'s Rock, Secret Bay, Twin Rocks, Ligaya\'s Garden); ' +
    'getting there from Manila — 140 km south via SLEX + STAR Tollway, about 2–3 hours; ' +
    'marine life (nudibranchs, frogfish, pygmy seahorses, sea turtles, mantis shrimp); ' +
    'resort amenities (beachfront deck, freshwater camera rinse station, Saturday Island BBQ, kayaks, snorkel gear); ' +
    'conservation (coral nursery, monthly reef clean-up dives, MPA monitoring). ' +
    'For specific prices or real-time availability, direct guests to contact the resort: ' +
    'hello@casaescondidaanilao.com. Keep replies warm, concise, and helpful. Do not invent prices.';

  /* ── Load Deep Chat ─────────────────────────────────────────── */
  function loadScript(cb) {
    if (customElements.get('deep-chat')) { cb(); return; }
    var s = document.createElement('script');
    s.type = 'module';
    s.src = 'https://unpkg.com/deep-chat/dist/deepChat.bundle.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  /* ── Build widget ───────────────────────────────────────────── */
  function buildWidget() {
    var wrap = document.createElement('div');
    wrap.id = 'ce-chat-wrap';
    wrap.style.cssText =
      'position:fixed;bottom:1.4rem;right:1.4rem;z-index:9999;' +
      'display:flex;flex-direction:column;align-items:flex-end;gap:.6rem;';

    var panel = document.createElement('div');
    panel.id = 'ce-chat-panel';
    panel.style.cssText =
      'display:none;width:340px;height:480px;border-radius:16px;overflow:hidden;' +
      'box-shadow:0 12px 40px rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.15);' +
      'opacity:0;transform:translateY(12px);transition:opacity .22s ease,transform .22s ease;';

    var chat = document.createElement('deep-chat');
    chat.style.cssText = 'width:100%;height:100%;border-radius:16px;';

    chat.setAttribute('directConnection', JSON.stringify({
      openAI: {
        key: API_KEY,
        chat: {
          model: 'gpt-4o-mini',
          max_tokens: 400,
          system_prompt: SYSTEM_PROMPT
        }
      }
    }));

    chat.setAttribute('introMessage', JSON.stringify({
      text: '🤿 Hi! I\'m the Casa Escondida assistant. Ask me anything about our dive programs, rooms, or how to get to Anilao!'
    }));

    chat.setAttribute('textInput', JSON.stringify({
      placeholder: { text: 'Ask about Casa Escondida…' }
    }));

    chat.setAttribute('messageStyles', JSON.stringify({
      default: {
        shared: { bubble: { borderRadius: '10px', fontSize: '0.875rem', maxWidth: '82%' } },
        user:   { bubble: { background: ACCENT, color: '#fff' } },
        ai:     { bubble: { background: '#f0f4f8', color: '#1a2e3b' } }
      }
    }));

    chat.setAttribute('submitButtonStyles', JSON.stringify({
      submit: { container: { default: { background: ACCENT } } }
    }));

    panel.appendChild(chat);

    var btn = document.createElement('button');
    btn.id = 'ce-chat-btn';
    btn.setAttribute('aria-label', 'Open chat assistant');
    btn.setAttribute('aria-expanded', 'false');
    btn.style.cssText =
      'width:3.1rem;height:3.1rem;border-radius:50%;background:' + ACCENT + ';color:#fff;' +
      'border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;' +
      'box-shadow:0 4px 18px rgba(0,0,0,.22);transition:transform .18s,box-shadow .18s;flex-shrink:0;';

    var iconChat  = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    var iconClose = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    btn.innerHTML = iconChat;

    btn.addEventListener('mouseenter', function () {
      btn.style.transform = 'scale(1.09)';
      btn.style.boxShadow = '0 6px 24px rgba(0,0,0,.3)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = '0 4px 18px rgba(0,0,0,.22)';
    });

    var open = false;
    btn.addEventListener('click', function () {
      open = !open;
      btn.setAttribute('aria-expanded', open);
      btn.innerHTML = open ? iconClose : iconChat;
      if (open) {
        panel.style.display = 'block';
        requestAnimationFrame(function () {
          panel.style.opacity = '1';
          panel.style.transform = 'translateY(0)';
        });
      } else {
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(12px)';
        setTimeout(function () { panel.style.display = 'none'; }, 220);
      }
    });

    var mq = window.matchMedia('(max-width:480px)');
    function applyMobile(e) {
      if (e.matches) {
        panel.style.width = 'calc(100vw - 2rem)';
        panel.style.height = '420px';
        wrap.style.right = '1rem';
        wrap.style.bottom = '1rem';
      } else {
        panel.style.width = '340px';
        panel.style.height = '480px';
        wrap.style.right = '1.4rem';
        wrap.style.bottom = '1.4rem';
      }
    }
    applyMobile(mq);
    mq.addEventListener('change', applyMobile);

    wrap.appendChild(panel);
    wrap.appendChild(btn);
    document.body.appendChild(wrap);
  }

  /* ── Init ───────────────────────────────────────────────────── */
  function init() {
    if (document.getElementById('ce-chat-wrap')) return;
    loadScript(buildWidget);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
