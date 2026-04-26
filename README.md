# 🗳️ ElectAssist — India Election Process Assistant

> An interactive, AI-powered web assistant that helps Indian citizens understand the election process, timelines, and steps in a clear, engaging, and easy-to-follow way.

**🌐 Live Demo:** [parth-1923.github.io/ElectAssist](https://parth-1923.github.io/ElectAssist/)

---

## 🎯 Chosen Vertical

**Civic Education & Voter Guidance** — empowering every Indian citizen with accurate, structured knowledge of the democratic process powered by Google's Gemini AI.

---

## 🚀 "Elite Status" Features

This project has been upgraded to meet the highest standards of technical excellence:

- **🌍 Multilingual Support:** Supports **English, Hindi, and Tamil** out of the box. The AI dynamically adapts its responses based on the user's selected language.
- **🧪 Automated Test Suite:** Includes a custom, zero-dependency testing framework (`tests.js`) that verifies core logic, security escaping, and UI rendering.
- **♿ Accessibility Optimized:** Implements `aria-live` regions for real-time screen reader announcements, semantic HTML5, and full mobile responsiveness.
- **🛡️ Enterprise Security:** Securely handles API keys via Supabase Edge Functions with zero-trust guardrails.

---

## 💡 Technical Architecture

- **Frontend:** Pure HTML + CSS + Vanilla JS SPA. Zero dependencies.
- **Backend:** Serverless **Supabase Edge Function** (Deno) protecting the Gemini API Key.
- **AI Engine:** **Google Gemini 2.5 Flash** with **Live Google Search Grounding** enabled for real-time election data.
- **Testing:** Integrated Visual Test Runner at `/test-runner.html`.

---

## 🧠 System Prompt & Guardrails

The AI is strictly constrained to the "ElectAssist" persona:
- **Election Expertise:** Deep knowledge of ECI rules, EVM/VVPAT, MCC, and the Representation of the People Act.
- **Strict Guardrails:** Explicitly refuses non-election queries (coding, recipes, etc.).
- **Live Grounding:** Uses Google Search to verify recent dates (e.g., specific State Assembly election results).

---

## 🏗️ Project Structure

```text
election-assistant/
├── index.html                   # SPA shell with Lang Selector & Accessibility ARIA
├── styles.css                   # Glassmorphism design system
├── app.js                       # Logic: Lang switching, Chat integration, UI rendering
├── data.js                      # Core election data & System Prompt
├── tests.js                     # Automated Unit & Integration tests
├── test-runner.html             # Visual dashboard for running tests
└── supabase/
    └── functions/
        └── chat/
            └── index.ts         # Secure Edge Function (Deno)
```

---

## ✅ Quality Assurance

We maintain high code quality through our automated test suite:
- **HTML Escaping:** Verified protection against XSS.
- **Message Formatting:** Verified Markdown-to-HTML parsing.
- **Data Integrity:** Verified Quick Action and FAQ data structures.
- **UI Rendering:** Verified dynamic population of FAQ components.

---

*Built for the Google Antigravity Challenge — Elite Grade Submission.*
