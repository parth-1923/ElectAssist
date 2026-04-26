# 🗳️ ElectAssist — India Election Process Assistant

> An interactive, AI-powered web assistant that helps Indian citizens understand the election process, timelines, and steps in a clear, engaging, and easy-to-follow way.

**🌐 Live Demo:** [parth-1923.github.io/ElectAssist](https://parth-1923.github.io/ElectAssist/)

---

## 🎯 Chosen Vertical

**Civic Education & Voter Guidance** — empowering every Indian citizen with accurate, structured knowledge of the democratic process powered by Google's Gemini AI.

---

## 🚀 How to Run Locally

You can open `index.html` directly in any modern browser.

```
election-assistant/
├── index.html   ← Open this file in your browser
├── styles.css
├── app.js
├── data.js
└── README.md
```

---

## 💡 Approach & Secure Architecture

### Architecture

- **Frontend:** Single-Page Application built with pure HTML + CSS + JavaScript. Zero external dependencies. Total size ~74 KB.
- **Backend:** Serverless **Supabase Edge Function** built with Deno/TypeScript.
- **AI Model:** **Google Gemini 2.5 Flash** (`gemini-2.5-flash`).

### Enterprise-Grade Security
To prevent the exposure of API keys on public repositories, this application utilizes a secure Serverless architecture:

1. **No Hardcoded Secrets:** The Gemini API key is stored securely in Supabase environment variables, completely invisible to the frontend.
2. **XSS Protection:** All responses from the AI are securely sanitized (`escHtml`) before being rendered on the screen to prevent Cross-Site Scripting attacks.
3. **Strict Persona Guardrails:** The system prompt enforces a "Zero-Trust" policy, meaning the AI will explicitly refuse to answer any questions unrelated to Indian elections, democracy, or civic duties.

### Decision Logic Flow

```text
User types question
        ↓
Frontend sends request to Supabase Edge Function
        ↓
Edge Function attaches hidden Gemini API Key
        ↓
Gemini 2.5 Flash API evaluates prompt against strict election guardrails
        ↓
Edge Function returns secure answer to Frontend
```

---

## 🌟 Features

| Feature | Description |
|---|---|
| 💬 **Secure AI Chat** | Gemini 2.5 Flash backend — answers any Indian election question conversationally |
| ⚡ **Quick Actions** | 6 one-click cards that pre-fill common questions into the chat |
| 📅 **Interactive Timeline** | 9 election phases from announcement → government formation, each expandable |
| 📚 **Role-Based Voter Guide** | Personalized step-by-step guide for 4 roles: First-Time Voter, Candidate, Observer, Polling Official |
| ✅ **Interactive Checklists** | Tick off preparation steps as you complete them in the Voter Guide |
| ❓ **FAQ Section** | 12 common questions with a live search/filter |
| 🌙 **Dark Mode Design** | Glassmorphism UI with India flag-inspired color palette |
| 📱 **Fully Responsive** | Works seamlessly on mobile, tablet, and desktop |

---

## 🧠 System Prompt Knowledge Base

The AI is pre-seeded with knowledge of:
- ECI structure and constitutional powers (Article 324)
- Voter registration (Form 6, EPIC, e-EPIC, voters.eci.gov.in)
- EVM and VVPAT mechanics and security
- Model Code of Conduct (MCC) rules and enforcement
- Polling day procedures and the 12 valid photo IDs
- Vote counting, result declaration, and government formation
- Grievance reporting (cVIGIL app, Helpline 1950)
- Candidate nomination process and expenditure limits
- NRI voting rights under Section 20A of the RPA

---

## 📋 Google & Cloud Services Used

| Service | Integration |
|---|---|
| **Gemini 2.5 Flash API** | Core AI engine — answers all election queries via `generateContent` REST endpoint |
| **Supabase Edge Functions** | Serverless backend (Deno) that securely proxies requests to Google to protect API keys |
| **Google Fonts** (Outfit + Inter) | Premium typography loaded via Google CDN |
| **Material Symbols Rounded** | Icon system served via Google Fonts CDN |
| **GitHub Pages** | Free static web hosting for the frontend |

---

## 🏗️ Project Structure

```text
election-assistant/
├── index.html                   # SPA shell — all sections, nav, hero, chat panel markup
├── styles.css                   # Full design system: dark mode, glassmorphism, responsive
├── app.js                       # Application logic: edge function calls, timeline, UI interactions
├── data.js                      # All election content: timeline, FAQs, role guides, system prompt
├── README.md                    # This documentation file
└── supabase/
    └── functions/
        └── chat/
            └── index.ts         # Secure backend Deno script that handles Gemini API proxying
```

---

## ✅ Evaluation Criteria Coverage

| Criteria | Implementation |
|---|---|
| **Code Quality** | Separated into `data.js` (content) + `app.js` (logic) + `styles.css` (design); clean naming conventions |
| **Security** | API key hidden in Supabase backend; XSS prevented via `escHtml()` utility; strict AI guardrails |
| **Efficiency** | No npm frontend dependencies; DOM built dynamically; `IntersectionObserver` for scroll animations |
| **Accessibility** | ARIA labels on chat panel and buttons; semantic HTML5 elements; keyboard navigation; mobile-first design |
| **Google Services** | Gemini 2.5 Flash API (core AI), Google Fonts (typography), Material Symbols (icons) |

---

## 🔗 Official Resources

| Resource | Link |
|---|---|
| Election Commission of India | [eci.gov.in](https://eci.gov.in) |
| Voter Registration Portal | [voters.eci.gov.in](https://voters.eci.gov.in) |
| Election Results | [results.eci.gov.in](https://results.eci.gov.in) |
| cVIGIL Violation Reporting | [cvigil.eci.gov.in](https://cvigil.eci.gov.in) |
| Voter Helpline | [1950](tel:1950) (toll-free) |

---

*Built for the Google Antigravity Challenge — Civic Education vertical. For educational purposes only.*
