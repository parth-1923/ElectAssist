/* ElectAssist – app.js */

// ── STATE ──────────────────────────────────────────────
let chatHistory = [];
let currentLang = 'en';
let isTyping = false;

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
});

// ── PARTICLES ──────────────────────────────────────────
function buildParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const sizes = [4,6,8,10,14];
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

function toggleTL(header) {
  const item = header.closest('.tl-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.tl-item.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ── VOTER GUIDE ────────────────────────────────────────
function buildGuide() {
  const tabsEl = document.getElementById('guide-tabs');
  const contentEl = document.getElementById('guide-content');
  if (!tabsEl || !contentEl) return;

  Object.entries(ROLE_GUIDES).forEach(([key, guide], idx) => {
    // Tab
    const tab = document.createElement('button');
    tab.className = `guide-tab${idx === 0 ? ' active' : ''}`;
    tab.dataset.role = key;
    tab.style.background = idx === 0 ? guide.color : '';
    tab.innerHTML = `<span class="material-symbols-rounded">${guide.icon}</span>${guide.title}`;
    tab.onclick = () => switchGuide(key);
    tabsEl.appendChild(tab);

    // Content
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
                      <input type="checkbox">
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
}

function toggleGS(header) {
  const item = header.closest('.gs-item');
  item.classList.toggle('open');
}

// ── FAQ ─────────────────────────────────────────────────
function buildFAQ() {
  const list = document.getElementById('faq-list');
  if (!list) return;
  FAQS.forEach((faq, i) => {
    const el = document.createElement('div');
    el.className = 'faq-item';
    el.dataset.q = faq.q.toLowerCase();
    el.innerHTML = `
      <div class="faq-q" onclick="toggleFAQ(this)">
        <span>${faq.q}</span>
        <span class="material-symbols-rounded faq-arrow">expand_more</span>
      </div>
      <div class="faq-a"><p>${faq.a}</p></div>`;
    list.appendChild(el);
  });
}

function toggleFAQ(header) {
  const item = header.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

document.addEventListener('DOMContentLoaded', () => {
  const searchEl = document.getElementById('faq-search');
  if (searchEl) {
    searchEl.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.toggle('hidden', q && !item.dataset.q.includes(q));
      });
    });
  }
});

// ── QUICK ACTIONS ──────────────────────────────────────
function buildQuickActions() {
  const grid = document.getElementById('qa-grid');
  if (!grid) return;
  QUICK_ACTIONS.forEach(qa => {
    const card = document.createElement('div');
    card.className = 'qa-card animate-on-scroll';
    card.onclick = () => { openChat(qa.prompt); };
    card.innerHTML = `
      <div class="qa-icon" style="background:${qa.color}22">
        <span class="material-symbols-rounded" style="color:${qa.color}">${qa.icon}</span>
      </div>
      <div>
        <h3>${qa.title}</h3>
        <p>${qa.description}</p>
      </div>`;
    grid.appendChild(card);
  });
}

// ── CHAT ───────────────────────────────────────────────
function initChat() {
  const fab = document.getElementById('chat-fab');
  const panel = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close');
  const sendBtn = document.getElementById('chat-send');
  const input = document.getElementById('chat-input');

  fab.addEventListener('click', () => toggleChat());
  closeBtn.addEventListener('click', () => closeChat());
  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });

  // Lang selection
  document.getElementById('lang-select').addEventListener('change', (e) => {
    currentLang = e.target.value;
    updateUILanguage();
  });

  // Quick chips
  document.querySelectorAll('.chat-chip').forEach(chip => {
    chip.addEventListener('click', () => sendUserMessage(chip.dataset.msg));
  });

  addAIMessage("Jai Hind! 🇮🇳 I'm **ElectAssist**, your guide to India's democratic process.\n\nAsk me anything about voter registration, election timelines, EVMs, how to contest elections, or anything else. How can I help you today?");
}

function toggleChat() {
  const panel = document.getElementById('chat-panel');
  panel.classList.toggle('open');
}

function openChat(prompt) {
  document.getElementById('chat-panel').classList.add('open');
  document.getElementById('chat-panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  if (prompt) setTimeout(() => sendUserMessage(prompt), 300);
}

function closeChat() {
  document.getElementById('chat-panel').classList.remove('open');
}

function addAIMessage(text) {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg ai';
  div.innerHTML = `
    <div class="msg-avatar">🗳️</div>
    <div class="msg-bubble">${formatMsg(text)}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function addUserMessage(text) {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg user';
  div.innerHTML = `
    <div class="msg-avatar">👤</div>
    <div class="msg-bubble">${escHtml(text)}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg ai'; div.id = 'typing-indicator';
  div.innerHTML = `
    <div class="msg-avatar">🗳️</div>
    <div class="msg-bubble">
      <div class="typing-indicator">
        <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
      </div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function hideTyping() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text || isTyping) return;
  input.value = '';
  await sendUserMessage(text);
}

async function sendUserMessage(text) {
  if (!text || isTyping) return;
  addUserMessage(text);
  chatHistory.push({ role: 'user', parts: [{ text }] });

  isTyping = true;
  document.getElementById('chat-send').disabled = true;
  showTyping();

  try {
    let reply = await callGemini(text);
    hideTyping();
    addAIMessage(reply);
    chatHistory.push({ role: 'model', parts: [{ text: reply }] });
  } catch (err) {
    hideTyping();
    addAIMessage('Sorry, I encountered an error. Please check your API key or try again shortly.');
    console.error(err);
  } finally {
    isTyping = false;
    document.getElementById('chat-send').disabled = false;
  }
}

async function callGemini(userText) {
  const url = `https://script.google.com/macros/s/AKfycbyIH_xVueM5F7-RWg9CoNUdeZRQ-i6Q9EsgateBYYYxoV_t5FVIXXXP-CgI9A7GnkNm4A/exec`;
  
  // Inject language context into the system prompt dynamiclly
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
    headers: { 'Content-Type': 'application/json' },
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

function getFallbackResponse(text) {
  const t = text.toLowerCase();
  if (t.includes('register') || t.includes('voter id') || t.includes('form 6')) {
    return "To register as a voter in India:\n\n• Visit **voters.eci.gov.in** or use the **Voter Helpline App**\n• Fill **Form 6** online\n• Upload age proof (Aadhaar/birth certificate) and address proof\n• Submit and track your application\n• Collect your EPIC card or download e-EPIC\n\n💡 You can also visit your local Electoral Registration Officer (ERO) office in person.";
  }
  if (t.includes('evm') || t.includes('electronic voting')) {
    return "**EVM (Electronic Voting Machine)**:\n\n• A standalone device with **no internet/network connection**\n• Has two units: Control Unit (with polling officer) + Ballot Unit (where you vote)\n• Uses **one-time programmable chips** — cannot be remotely tampered\n• **VVPAT** prints a paper slip visible for 7 seconds to verify your vote\n• Upheld as secure and reliable by the **Supreme Court of India**";
  }
  if (t.includes('vvpat')) {
    return "**VVPAT (Voter Verifiable Paper Audit Trail)**:\n\n• Attached to the EVM ballot unit\n• When you press a button, it prints a slip showing the **candidate name and symbol**\n• The slip is visible through a transparent window for **7 seconds**\n• It then falls into a sealed box for audit purposes\n• Introduced to enhance **voter confidence and transparency**";
  }
  if (t.includes('nota')) {
    return "**NOTA (None of the Above)**:\n\n• Allows you to reject ALL candidates on the ballot\n• Introduced in **2013** after a Supreme Court directive\n• Appears as the last option on the EVM\n• If NOTA gets the most votes, the **candidate with the next highest votes still wins**\n• Your NOTA vote is counted and publicly disclosed in results";
  }
  if (t.includes('booth') || t.includes('polling station') || t.includes('where to vote')) {
    return "To find your polling booth:\n\n• Visit **voters.eci.gov.in** → Search by EPIC number or name\n• Use the **Voter Helpline App** (available on Android/iOS)\n• Call the toll-free helpline: **1950**\n• Contact your local **BLO (Booth Level Officer)**\n• Check your **Voter Slip** distributed before polling day";
  }
  if (t.includes('document') || t.includes('id') || t.includes('bring') || t.includes('valid')) {
    return "**12 Valid IDs accepted at polling stations:**\n\n1. Voter ID (EPIC card)\n2. Aadhaar Card\n3. MNREGA Job Card\n4. Bank/Post Office Passbook with photo\n5. Health Insurance Smart Card\n6. Driving License\n7. PAN Card\n8. Smart Card (RGI)\n9. Indian Passport\n10. Pension document with photo\n11. Service ID card (Central/State Govt)\n12. Unique Disability ID (UDID) Card\n\n💡 Your **name must be in the electoral roll** regardless of which ID you carry.";
  }
  if (t.includes('mcc') || t.includes('model code')) {
    return "**Model Code of Conduct (MCC)**:\n\n• Issued by ECI; comes into force **on the day of election announcement**\n• Prohibits ruling government from announcing new welfare schemes\n• Bans use of state machinery for political campaigns\n• Prohibits hate speech, communal appeals, and voter bribery\n• **cVIGIL App**: Report violations with guaranteed 100-min response\n• Remains in effect until the entire election process concludes";
  }
  if (t.includes('report') || t.includes('violation') || t.includes('complaint') || t.includes('cvigil')) {
    return "**How to report election violations:**\n\n🔴 **cVIGIL App** (fastest): Take photo/video of violation → Submit with GPS location → Guaranteed response within **100 minutes**\n\n📞 **Helpline 1950** (toll-free): Call from anywhere in India\n\n🌐 **ECI Website**: eci.gov.in → Citizen Services\n\n🏢 **District Election Officer**: Visit your local DEO office\n\n💡 Your complaint is tracked in real-time and remains anonymous.";
  }
  // Generic fallback
  return "Great question! To get the most accurate and detailed answer, please **enter your Gemini API key** above (click the key icon) — it's free to get at [ai.google.dev](https://ai.google.dev).\n\nIn the meantime, you can explore our **Timeline**, **Voter Guide**, and **FAQ** sections for comprehensive information about Indian elections. 🗳️";
}

function initLang() {
  const savedLang = localStorage.getItem('ea_lang');
  if (savedLang) {
    currentLang = savedLang;
    document.getElementById('lang-select').value = savedLang;
    updateUILanguage();
  }
}

function updateUILanguage() {
  localStorage.setItem('ea_lang', currentLang);
  // We can add logic here to translate static labels like "Ask AI", "Timeline" etc.
  // For now, it mainly affects the AI response language
}

// ── SCROLL ANIMATIONS ──────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

function formatMsg(text) {
  return escHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/• /g, '• ');
}

function escHtml(text) {
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
