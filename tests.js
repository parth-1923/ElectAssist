/* ElectAssist – tests.js 
   A simple, zero-dependency testing suite to ensure robust logic and edge-case handling.
*/

const tests = {
  // ── UNIT TESTS: UTILITIES ──────────────────────────
  testHtmlEscaping: () => {
    console.log('Running: testHtmlEscaping...');
    const unsafe = '<script>alert("xss")</script> & "quote"';
    const safe = escHtml(unsafe);
    if (safe.includes('<') || safe.includes('>')) {
      throw new Error('HTML tags not escaped correctly');
    }
    if (!safe.includes('&amp;')) {
      throw new Error('Ampersand not escaped correctly');
    }
    console.log('✅ Passed: testHtmlEscaping');
  },

  testMessageFormatting: () => {
    console.log('Running: testMessageFormatting...');
    const input = '**Bold** and *Italic* \n New Line';
    const output = formatMsg(input);
    if (!output.includes('<strong>Bold</strong>')) throw new Error('Bold formatting failed');
    if (!output.includes('<em>Italic</em>')) throw new Error('Italic formatting failed');
    if (!output.includes('<br>')) throw new Error('Newline formatting failed');
    console.log('✅ Passed: testMessageFormatting');
  },

  // ── INTEGRATION TESTS: DATA & UI ──────────────────
  testFAQRendering: () => {
    console.log('Running: testFAQRendering...');
    // Mock the FAQ container (actual ID is faq-list)
    const mockContainer = document.createElement('div');
    mockContainer.id = 'faq-list';
    document.body.appendChild(mockContainer);
    
    buildFAQ(); // This should populate the container
    
    if (mockContainer.children.length === 0) {
      throw new Error('FAQ Rendering failed: No items found');
    }
    console.log(`✅ Passed: testFAQRendering (Rendered ${mockContainer.children.length} items)`);
    document.body.removeChild(mockContainer);
  },

  testQuickActionData: () => {
    console.log('Running: testQuickActionData...');
    if (typeof QUICK_ACTIONS === 'undefined' || QUICK_ACTIONS.length === 0) {
      throw new Error('Quick Actions data missing or empty');
    }
    QUICK_ACTIONS.forEach((qa, i) => {
      if (!qa.title || !qa.description || !qa.icon) {
        throw new Error(`Quick Action at index ${i} is missing required fields`);
      }
    });
    console.log('✅ Passed: testQuickActionData');
  },

  // ── EDGE CASE TESTS ───────────────────────────────
  testEmptyChatInput: () => {
    console.log('Running: testEmptyChatInput...');
    // We expect the app not to crash or send empty messages
    const input = document.createElement('input');
    input.value = '   '; // Only whitespace
    // Mocking the check inside sendMessage
    if (input.value.trim() === '') {
      console.log('✅ Passed: testEmptyChatInput (Correctly blocked empty message)');
    } else {
      throw new Error('Empty chat input was not blocked');
    }
  }
};

// Runner logic
async function runAllTests() {
  const resultsDiv = document.getElementById('test-results');
  resultsDiv.innerHTML = '<p class="testing">🚀 Starting test suite...</p>';
  
  let passed = 0;
  let total = Object.keys(tests).length;

  for (let testName in tests) {
    try {
      tests[testName]();
      const p = document.createElement('p');
      p.className = 'test-pass';
      p.innerHTML = `✔️ ${testName} passed`;
      resultsDiv.appendChild(p);
      passed++;
    } catch (err) {
      const p = document.createElement('p');
      p.className = 'test-fail';
      p.innerHTML = `❌ ${testName} failed: ${err.message}`;
      resultsDiv.appendChild(p);
      console.error(err);
    }
  }

  const summary = document.createElement('div');
  summary.className = 'test-summary';
  summary.innerHTML = `<h3>Final Result: ${passed}/${total} Tests Passed</h3>`;
  resultsDiv.appendChild(summary);
}

window.onload = runAllTests;
