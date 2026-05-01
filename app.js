/* ElectAssist – app.js */

// ── STATE ──────────────────────────────────────────────
let chatHistory = [];
let currentLang = 'en';
let isTyping = false;

// ── GOOGLE ANALYTICS 4 HELPER ──────────────────────────
/**
 * Fires a Google Analytics 4 custom event if gtag is available.
 * @param {string} eventName - GA4 event name (snake_case)
 * @param {Object} [params={}] - Additional event parameters
 */
function gaEvent(eventName, params = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
  }
}

// ── INIT ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildParticles();
  buildTimeline();
  buildGuide();
  buildFAQ();
  buildQuickActions();
  initChat();
  initLang();
  initScrollAnimations();
  initFAQSearch();   // moved here — single DOMContentLoaded listener
});

// ── PARTICLES ──────────────────────────────────────────
/**
 * Generates decorative floating particles in the hero section.
 */
function buildParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const sizes = [4, 6, 8, 10, 14];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      --dur:${6 + Math.random() * 8}s;
      --delay:${-Math.random() * 8}s;
    `;
    container.appendChild(p);
  }
}

// ── TIMELINE ───────────────────────────────────────────
/**
 * Dynamically renders the election timeline from ELECTION_TIMELINE data.
 */
function buildTimeline() {
  const container = document.getElementById('timeline-items');
  if (!container) return;
  ELECTION_TIMELINE.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'tl-item animate-on-scroll';
    el.style.setProperty('--item-color', item.color);
    el.style.animationDelay = `${i * 0.08}s`;
    el.innerHTML = `
      <div class="tl-header" onclick="toggleTL(this)">
        <span class="tl-phase-icon">${item.icon}</span>
        <div class="tl-phase-info">
          <h3>${item.phase}</h3>
          <div class="tl-duration">⏱ ${item.duration}</div>
        </div>
        <span class="material-symbols-rounded tl-toggle">expand_more</span>
      </div>
      <div class="tl-body">
        <div class="tl-body-inner">
          <p class="tl-desc">${item.description}</p>
          <ul class="tl-steps">${item.steps.map(s => `<li>${s}</li>`).join('')}</ul>
          <div class="tl-facts">${item.keyFacts.map(f => `<div class="tl-fact">${f}</div>`).join('')}</div>
        </div>
      </div>`;
    container.appendChild(el);
  });
}

/**
 * Toggles a timeline accordion item open/closed.
 * @param {HTMLElement} header - The clicked .tl-header element
 */
function toggleTL(header) {
  const item = header.closest('.tl-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.tl-item.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ── VOTER GUIDE ────────────────────────────────────────
/**
 * Renders the role-based voter guide tabs and step content from ROLE_GUIDES data.
 */
function buildGuide() {
  const tabsEl = document.getElementById('guide-tabs');
  const contentEl = document.getElementById('guide-content');
  if (!tabsEl || !contentEl) return;

  Object.entries(ROLE_GUIDES).forEach(([key, guide], idx) => {
    const tab = document.createElement('button');
    tab.className = `guide-tab${idx === 0 ? ' active' : ''}`;
    tab.dataset.role = key;
    tab.style.background = idx === 0 ? guide.color : '';
    tab.innerHTML = `<span class="material-symbols-rounded">${guide.icon}</span>${guide.title}`;
    tab.onclick = () => switchGuide(key);
    tabsEl.appendChild(tab);

    const div = document.createElement('div');
    div.className = `guide-content${idx === 0 ? ' active' : ''}`;
    div.id = `guide-${key}`;
    div.innerHTML = `
      <div class="guide-header">
        <h3>${guide.title}</h3>
        <p>${guide.description}</p>
      </div>
      <div class="guide-steps">
        ${guide.steps.map((step, si) => `
          <div class="gs-item">
            <div class="gs-header" onclick="toggleGS(this)">
              <div class="gs-num" style="background:${guide.color}22;color:${guide.color}">${si + 1}</div>
              <h4>${step.title}</h4>
              <span class="material-symbols-rounded gs-chevron">expand_more</span>
            </div>
            <div class="gs-body">
              <div class="gs-body-inner">
                <p class="gs-detail">${step.detail}</p>
                <div class="gs-checklist">
                  ${step.checklist.map(c => `
                    <label class="gs-check">
                      <input type="checkbox" aria-label="${escHtml(c)}">
                      <div class="check-box"></div>
                      <span>${c}</span>
                    </label>`).join('')}
                </div>
              </div>
            </div>
          </div>`).join('')}
      </div>`;
    contentEl.appendChild(div);
  });
}

/**
 * Switches the active voter guide tab and content panel.
 * @param {string} key - Role key matching a ROLE_GUIDES entry
 */
function switchGuide(key) {
  document.querySelectorAll('.guide-tab').forEach(t => {
    t.classList.remove('active');
    t.style.background = '';
  });
  document.querySelectorAll('.guide-content').forEach(c => c.classList.remove('active'));
  const guide = ROLE_GUIDES[key];
  const activeTab = document.querySelector(`.guide-tab[data-role="${key}"]`);
  if (activeTab) { activeTab.classList.add('active'); activeTab.style.background = guide.color; }
  const activeContent = document.getElementById(`guide-${key}`);
  if (activeContent) activeContent.classList.add('active');
  gaEvent('guide_tab_switch', { role: key });
}

/**
 * Toggles a guide step accordion open/closed.
 * @param {HTMLElement} header - The clicked .gs-header element
 */
function toggleGS(header) {
  header.closest('.gs-item').classList.toggle('open');
}

// ── FAQ ─────────────────────────────────────────────────
/**
 * Renders the FAQ list from FAQS data into the #faq-list container.
 */
function buildFAQ() {
  const list = document.getElementById('faq-list');
  if (!list) return;
  FAQS.forEach(faq => {
    const el = document.createElement('div');
    el.className = 'faq-item';
    el.dataset.q = faq.q.toLowerCase();
    el.innerHTML = `
      <div class="faq-q" onclick="toggleFAQ(this)" role="button" tabindex="0"
           aria-expanded="false" onkeydown="if(event.key==='Enter')toggleFAQ(this)">
        <span>${faq.q}</span>
        <span class="material-symbols-rounded faq-arrow" aria-hidden="true">expand_more</span>
      </div>
      <div class="faq-a" role="region"><p>${faq.a}</p></div>`;
    list.appendChild(el);
  });
}

/**
 * Toggles a FAQ item open/closed and updates ARIA state.
 * @param {HTMLElement} header - The clicked .faq-q element
 */
function toggleFAQ(header) {
  const item = header.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(el => {
    el.classList.remove('open');
    el.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
  });
  if (!isOpen) {
    item.classList.add('open');
    header.setAttribute('aria-expanded', 'true');
  }
}

/**
 * Initialises the FAQ live search/filter input.
 * Must be called once after buildFAQ().
 */
function initFAQSearch() {
  const searchEl = document.getElementById('faq-search');
  if (!searchEl) return;
  searchEl.setAttribute('aria-label', 'Search frequently asked questions');
  searchEl.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.toggle('hidden', !!q && !item.dataset.q.includes(q));
    });
  });
}

// ── QUICK ACTIONS ──────────────────────────────────────
/**
 * Renders quick-action cards from QUICK_ACTIONS data into the #qa-grid container.
 */
function buildQuickActions() {
  const grid = document.getElementById('qa-grid');
  if (!grid) return;
  QUICK_ACTIONS.forEach(qa => {
    const card = document.createElement('div');
    card.className = 'qa-card animate-on-scroll';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', qa.title);
    card.onclick = () => { openChat(qa.prompt); gaEvent('quick_action_click', { action: qa.id }); };
    card.onkeydown = e => { if (e.key === 'Enter') card.onclick(); };
    card.innerHTML = `
      <div class="qa-icon" style="background:${qa.color}22">
        <span class="material-symbols-rounded" style="color:${qa.color}" aria-hidden="true">${qa.icon}</span>
      </div>
      <div>
        <h3>${qa.title}</h3>
        <p>${qa.description}</p>
      </div>`;
    grid.appendChild(card);
  });
}

// ── CHAT ───────────────────────────────────────────────
/**
 * Initialises all chat UI event listeners and renders the welcome message.
 */
function initChat() {
  const fab      = document.getElementById('chat-fab');
  const closeBtn = document.getElementById('chat-close');
  const sendBtn  = document.getElementById('chat-send');
  const input    = document.getElementById('chat-input');

  fab.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', closeChat);
  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  document.getElementById('lang-select').addEventListener('change', e => {
    currentLang = e.target.value;
    updateUILanguage();
    gaEvent('language_change', { language: currentLang });
  });

  document.querySelectorAll('.chat-chip').forEach(chip => {
    chip.addEventListener('click', () => sendUserMessage(chip.dataset.msg));
  });

  addAIMessage("Jai Hind! 🇮🇳 I'm **ElectAssist**, your guide to India's democratic process.\n\nAsk me anything about voter registration, election timelines, EVMs, how to contest elections, or anything else. How can I help you today?");
}

/** Opens or closes the chat panel. */
function toggleChat() {
  document.getElementById('chat-panel').classList.toggle('open');
}

/**
 * Opens the chat panel and optionally sends a pre-filled prompt.
 * @param {string} [prompt] - Optional message to send automatically
 */
function openChat(prompt) {
  const panel = document.getElementById('chat-panel');
  panel.classList.add('open');
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  if (prompt) setTimeout(() => sendUserMessage(prompt), 300);
}

/** Closes the chat panel. */
function closeChat() {
  document.getElementById('chat-panel').classList.remove('open');
}

/**
 * Appends an AI message bubble to the chat window.
 * @param {string} text - Markdown-formatted message text
 */
function addAIMessage(text) {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg ai';
  div.setAttribute('aria-live', 'polite');
  div.innerHTML = `
    <div class="msg-avatar" aria-hidden="true">🗳️</div>
    <div class="msg-bubble">${formatMsg(text)}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

/**
 * Appends a user message bubble to the chat window.
 * @param {string} text - Raw user input (will be HTML-escaped)
 */
function addUserMessage(text) {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg user';
  div.innerHTML = `
    <div class="msg-avatar" aria-hidden="true">👤</div>
    <div class="msg-bubble">${escHtml(text)}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

/** Shows the animated typing indicator while awaiting an AI response. */
function showTyping() {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg ai';
  div.id = 'typing-indicator';
  div.setAttribute('aria-label', 'ElectAssist is typing');
  div.innerHTML = `
    <div class="msg-avatar" aria-hidden="true">🗳️</div>
    <div class="msg-bubble">
      <div class="typing-indicator" role="status">
        <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
      </div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

/** Removes the typing indicator from the chat window. */
function hideTyping() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

/**
 * Reads the chat input, validates it, then delegates to sendUserMessage.
 */
async function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text || isTyping) return;
  input.value = '';
  await sendUserMessage(text);
}

/**
 * Sends a user message to the AI, updates the chat history, and renders the reply.
 * @param {string} text - The message to send
 */
async function sendUserMessage(text) {
  if (!text || isTyping) return;
  addUserMessage(text);
  chatHistory.push({ role: 'user', parts: [{ text }] });

  isTyping = true;
  document.getElementById('chat-send').disabled = true;
  showTyping();

  gaEvent('chat_message_sent', { language: currentLang, message_length: text.length });

  try {
    const reply = await callGemini(text);
    hideTyping();
    addAIMessage(reply);
    chatHistory.push({ role: 'model', parts: [{ text: reply }] });
  } catch (err) {
    hideTyping();
    addAIMessage('Sorry, I encountered an error. Please try again shortly.');
    console.error(err);
  } finally {
    isTyping = false;
    document.getElementById('chat-send').disabled = false;
  }
}

/**
 * Calls the Google Apps Script proxy, which forwards the request to Gemini 2.5 Flash
 * with Google Search grounding and the ElectAssist system prompt.
 *
 * Google Services used:
 *  - Google Apps Script (secure API proxy / serverless backend)
 *  - Google Gemini 2.5 Flash (AI model via Generative Language API)
 *  - Google Search grounding (live search tool within Gemini)
 *  - Google Firebase Hosting (static site deployment)
 *  - Google Analytics 4 (usage and event tracking)
 *
 * @param {string} userText - The user's message
 * @returns {Promise<string>} The AI-generated reply
 * @throws {Error} On non-OK HTTP response or API error
 */
async function callGemini(userText) {
  const url = `https://script.google.com/macros/s/AKfycbyIH_xVueM5F7-RWg9CoNUdeZRQ-i6Q9EsgateBYYYxoV_t5FVIXXXP-CgI9A7GnkNm4A/exec`;

  const langContext = ` IMPORTANT: The user's preferred language is ${currentLang}.
    - If language is 'hi', respond in Hindi.
    - If language is 'ta', respond in Tamil.
    - Always maintain the expert ElectAssist persona regardless of language.`;

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT + langContext }] },
    contents: chatHistory,
    generationConfig: { maxOutputTokens: 1000, temperature: 0.4 },
    tools: [{ googleSearch: {} }]
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error?.message || res.statusText;
    throw new Error(msg);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.';
}

// ── LANGUAGE ───────────────────────────────────────────
/**
 * Restores the last-used language preference from localStorage on page load.
 */
function initLang() {
  const savedLang = localStorage.getItem('ea_lang');
  if (savedLang) {
    currentLang = savedLang;
    const sel = document.getElementById('lang-select');
    if (sel) sel.value = savedLang;
    updateUILanguage();
  }
}

/**
 * Persists the current language to localStorage and updates the page lang attribute.
 */
function updateUILanguage() {
  localStorage.setItem('ea_lang', currentLang);
  document.documentElement.lang = currentLang;
}

// ── SCROLL ANIMATIONS ──────────────────────────────────
/**
 * Sets up an IntersectionObserver to add the 'visible' class when elements scroll into view.
 */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

// ── UTILITIES ──────────────────────────────────────────
/**
 * Converts basic Markdown to HTML and sanitizes input against XSS.
 * Sanitization (escHtml) runs first so Markdown is applied to safe text only.
 * @param {string} text - Raw message text (may contain Markdown)
 * @returns {string} HTML-safe formatted string
 */
function formatMsg(text) {
  return escHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/• /g, '• ');
}

/**
 * Escapes HTML special characters to prevent XSS injection.
 * @param {string} text - Raw input string
 * @returns {string} HTML-escaped string safe for innerHTML
 */
function escHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
