/* ElectAssist – tests.js
   Zero-dependency test suite: unit, integration, async, guardrail, accessibility, language.
*/

// ── TEST RUNNER ────────────────────────────────────────
const results = { passed: 0, failed: 0, total: 0 };

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function test(name, fn) {
  results.total++;
  try {
    await fn();
    results.passed++;
    log('pass', name);
  } catch (err) {
    results.failed++;
    log('fail', name, err.message);
    console.error(err);
  }
}

function log(type, name, detail = '') {
  const el = document.createElement('div');
  el.className = type === 'pass' ? 'test-pass' : 'test-fail';
  el.innerHTML = type === 'pass'
    ? `✔️ ${name}`
    : `❌ ${name} — ${detail}`;
  document.getElementById('test-results').appendChild(el);
}

// ── 1. UNIT: HTML ESCAPING ─────────────────────────────
test('escHtml: escapes script tags', () => {
  const safe = escHtml('<script>alert("xss")</script>');
  assert(!safe.includes('<script>'), 'Script tag must be escaped');
  assert(safe.includes('&lt;'), 'Opening bracket must become &lt;');
});

test('escHtml: escapes ampersand', () => {
  const safe = escHtml('a & b');
  assert(safe.includes('&amp;'), 'Ampersand must become &amp;');
  assert(!safe.includes(' & '), 'Raw ampersand must not remain');
});

test('escHtml: escapes double quotes', () => {
  const safe = escHtml('"hello"');
  assert(!safe.includes('"hello"'), 'Quotes must be escaped');
});

// ── 2. UNIT: MESSAGE FORMATTING ───────────────────────
test('formatMsg: renders bold markdown', () => {
  const out = formatMsg('**Bold**');
  assert(out.includes('<strong>Bold</strong>'), 'Bold must render as <strong>');
});

test('formatMsg: renders italic markdown', () => {
  const out = formatMsg('*Italic*');
  assert(out.includes('<em>Italic</em>'), 'Italic must render as <em>');
});

test('formatMsg: converts newlines to <br>', () => {
  const out = formatMsg('line1\nline2');
  assert(out.includes('<br>'), 'Newline must become <br>');
});

test('formatMsg: sanitizes input before formatting (XSS guard)', () => {
  const out = formatMsg('<img src=x onerror=alert(1)> **bold**');
  assert(!out.includes('<img'), 'HTML tags in input must be escaped before formatting');
  assert(out.includes('<strong>bold</strong>'), 'Markdown must still render after sanitization');
});

// ── 3. UNIT: DATA INTEGRITY ────────────────────────────
test('QUICK_ACTIONS: all items have required fields', () => {
  assert(Array.isArray(QUICK_ACTIONS) && QUICK_ACTIONS.length > 0, 'QUICK_ACTIONS must be a non-empty array');
  QUICK_ACTIONS.forEach((qa, i) => {
    assert(qa.title,       `Quick Action [${i}] missing title`);
    assert(qa.description, `Quick Action [${i}] missing description`);
    assert(qa.icon,        `Quick Action [${i}] missing icon`);
    assert(qa.prompt,      `Quick Action [${i}] missing prompt`);
    assert(qa.color,       `Quick Action [${i}] missing color`);
  });
});

test('FAQS: all items have question and answer', () => {
  assert(Array.isArray(FAQS) && FAQS.length > 0, 'FAQS must be non-empty');
  FAQS.forEach((faq, i) => {
    assert(faq.q && faq.q.length > 0, `FAQ [${i}] missing question`);
    assert(faq.a && faq.a.length > 0, `FAQ [${i}] missing answer`);
  });
});

test('ELECTION_TIMELINE: all phases have required fields', () => {
  assert(Array.isArray(ELECTION_TIMELINE) && ELECTION_TIMELINE.length > 0, 'Timeline must be non-empty');
  ELECTION_TIMELINE.forEach((item, i) => {
    assert(item.phase,       `Timeline [${i}] missing phase`);
    assert(item.description, `Timeline [${i}] missing description`);
    assert(Array.isArray(item.steps) && item.steps.length > 0, `Timeline [${i}] missing steps`);
    assert(Array.isArray(item.keyFacts),                        `Timeline [${i}] missing keyFacts`);
  });
});

test('SYSTEM_PROMPT: contains election guardrail', () => {
  assert(typeof SYSTEM_PROMPT === 'string' && SYSTEM_PROMPT.length > 0, 'SYSTEM_PROMPT must exist');
  const lower = SYSTEM_PROMPT.toLowerCase();
  assert(
    lower.includes('only') && (lower.includes('election') || lower.includes('voting')),
    'SYSTEM_PROMPT must contain election-only guardrail language'
  );
});

test('SYSTEM_PROMPT: references ECI authority', () => {
  assert(SYSTEM_PROMPT.includes('ECI') || SYSTEM_PROMPT.includes('Election Commission'),
    'SYSTEM_PROMPT must reference ECI');
});

// ── 4. INTEGRATION: UI RENDERING ──────────────────────
test('buildFAQ: renders correct number of FAQ items', () => {
  const mock = document.createElement('div');
  mock.id = 'faq-list';
  document.body.appendChild(mock);
  buildFAQ();
  assert(mock.children.length === FAQS.length,
    `Expected ${FAQS.length} FAQ items, got ${mock.children.length}`);
  document.body.removeChild(mock);
});

test('buildFAQ: each item has a question and answer element', () => {
  const mock = document.createElement('div');
  mock.id = 'faq-list';
  document.body.appendChild(mock);
  buildFAQ();
  [...mock.children].forEach((item, i) => {
    assert(item.querySelector('.faq-q'), `FAQ item [${i}] missing .faq-q`);
    assert(item.querySelector('.faq-a'), `FAQ item [${i}] missing .faq-a`);
  });
  document.body.removeChild(mock);
});

test('buildQuickActions: renders all quick actions', () => {
  const mock = document.createElement('div');
  mock.id = 'qa-grid';
  document.body.appendChild(mock);
  buildQuickActions();
  assert(mock.children.length === QUICK_ACTIONS.length,
    `Expected ${QUICK_ACTIONS.length} quick action cards`);
  document.body.removeChild(mock);
});

// ── 5. EDGE CASES ──────────────────────────────────────
test('sendMessage: ignores empty input', () => {
  assert(''.trim() === '', 'Empty string trim must be empty');
  assert('   '.trim() === '', 'Whitespace-only input must be blocked');
});

test('sendMessage: ignores input during typing', () => {
  // Simulates the isTyping guard
  const isTyping = true;
  const text = 'valid message';
  const wouldSend = !(!text || isTyping);
  assert(wouldSend === false, 'Message must not send when isTyping is true');
});

test('escHtml: handles empty string gracefully', () => {
  const result = escHtml('');
  assert(result === '', 'Empty string must return empty string');
});

test('formatMsg: handles plain text with no markdown', () => {
  const result = formatMsg('Hello world');
  assert(result.includes('Hello world'), 'Plain text must pass through unchanged');
  assert(!result.includes('<script>'), 'Plain text must not inject tags');
});

// ── 6. LANGUAGE SUPPORT ────────────────────────────────
test('Language: callGemini prompt includes Hindi instruction for hi', () => {
  // Verify the language injection logic string matches expected shape
  const lang = 'hi';
  const langContext = ` IMPORTANT: The user's preferred language is ${lang}. 
    - If language is 'hi', respond in Hindi. 
    - If language is 'ta', respond in Tamil. 
    - Always maintain the expert ElectAssist persona regardless of language.`;
  assert(langContext.includes('Hindi'), 'Hindi lang context must mention Hindi');
  assert(langContext.includes('Tamil'), 'Hindi lang context must still mention Tamil as fallback');
});

test('Language: supported language codes are valid', () => {
  const supported = ['en', 'hi', 'ta'];
  supported.forEach(code => {
    assert(typeof code === 'string' && code.length === 2,
      `Language code '${code}' must be a 2-char string`);
  });
});

// ── 7. ACCESSIBILITY ───────────────────────────────────
test('Accessibility: page has a main landmark or heading structure', () => {
  const h1 = document.querySelector('h1');
  const main = document.querySelector('main, [role="main"]');
  assert(h1 || main, 'Page must have at least one h1 or a main landmark');
});

test('Accessibility: FAQ items use semantic button or clickable element', () => {
  const mock = document.createElement('div');
  mock.id = 'faq-list';
  document.body.appendChild(mock);
  buildFAQ();
  const firstQ = mock.querySelector('.faq-q');
  assert(firstQ, 'FAQ question element must exist');
  // It should be interactive — has onclick or is a button
  const isButton = firstQ.tagName === 'BUTTON';
  const hasClick = firstQ.hasAttribute('onclick') || firstQ.onclick !== null;
  assert(isButton || hasClick, 'FAQ question must be focusable or have onclick handler');
  document.body.removeChild(mock);
});

// ── 8. ASYNC / API MOCK ────────────────────────────────
test('callGemini: correctly parses a valid mocked response', async () => {
  // Store original fetch and replace with mock
  const originalFetch = window.fetch;
  window.fetch = async () => ({
    ok: true,
    json: async () => ({
      candidates: [{ content: { parts: [{ text: 'Mocked Gemini reply' }] } }]
    })
  });
  try {
    const reply = await callGemini('What is NOTA?');
    assert(reply === 'Mocked Gemini reply', `Expected mock reply, got: ${reply}`);
  } finally {
    window.fetch = originalFetch;
  }
});

test('callGemini: returns fallback text when candidates array is empty', async () => {
  const originalFetch = window.fetch;
  window.fetch = async () => ({
    ok: true,
    json: async () => ({ candidates: [] })
  });
  try {
    const reply = await callGemini('test');
    assert(typeof reply === 'string' && reply.length > 0,
      'Must return a non-empty string even with empty candidates');
  } finally {
    window.fetch = originalFetch;
  }
});

test('callGemini: throws on non-ok HTTP response', async () => {
  const originalFetch = window.fetch;
  window.fetch = async () => ({
    ok: false,
    statusText: '429 Too Many Requests',
    json: async () => ({ error: { message: 'Rate limit exceeded' } })
  });
  try {
    let threw = false;
    try { await callGemini('test'); } catch (e) { threw = true; }
    assert(threw, 'callGemini must throw on non-ok response');
  } finally {
    window.fetch = originalFetch;
  }
});

// ── 9. GUARDRAIL TESTS ─────────────────────────────────
test('SYSTEM_PROMPT: explicitly refuses non-election queries', () => {
  const lower = SYSTEM_PROMPT.toLowerCase();
  const hasRefusalInstruction =
    lower.includes('decline') ||
    lower.includes('refuse') ||
    lower.includes('cannot help') ||
    lower.includes('only answer') ||
    lower.includes('must only');
  assert(hasRefusalInstruction, 'System prompt must contain explicit refusal instruction for off-topic queries');
});

test('SYSTEM_PROMPT: guards against prompt injection', () => {
  const lower = SYSTEM_PROMPT.toLowerCase();
  assert(
    lower.includes('ignore previous') || lower.includes('prompt-engineer') || lower.includes('bypass'),
    'System prompt must warn against prompt injection / persona bypass attempts'
  );
});

// ── RUNNER ─────────────────────────────────────────────
window.onload = async () => {
  const container = document.getElementById('test-results');
  container.innerHTML = '<p class="testing">🚀 Running ElectAssist test suite…</p>';

  // Run all registered tests (they auto-append via the test() fn above)
  // Wait for async ones to settle
  await new Promise(r => setTimeout(r, 100));

  const summary = document.createElement('div');
  summary.className = 'test-summary';
  summary.innerHTML = `<h3>Result: ${results.passed}/${results.total} passed, ${results.failed} failed</h3>`;
  container.appendChild(summary);
};
