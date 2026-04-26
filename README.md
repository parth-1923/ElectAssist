# 🗳️ ElectAssist — India Election Process Assistant

> An interactive, AI-powered web assistant that helps Indian citizens understand the election process, timelines, and steps in a clear, engaging, and easy-to-follow way.

---

## 🎯 Chosen Vertical

**Civic Education & Voter Guidance** — empowering every Indian citizen with accurate, structured knowledge of the democratic process powered by Google's Gemini AI.

---

## 🚀 How to Run

Open `index.html` directly in any modern browser — **no installation, no build step, no server required.**

```
election-assistant/
├── index.html   ← Open this file in your browser
├── styles.css
├── app.js
├── data.js
└── README.md
```

---

## 💡 Approach & Logic

### Architecture

- **Single-Page Application** built with pure HTML + CSS + JavaScript
- **Zero external dependencies** — no npm, no frameworks, no build tools
- **Total size ~74 KB** — well within the 1 MB submission limit

### AI Integration — Google Gemini API

The assistant uses **Google Gemini 2.5 Flash** (`gemini-2.5-flash`) via REST API for all conversational responses.

- A detailed **election-specific system prompt** pre-seeds the model with knowledge of:
  - ECI structure and constitutional powers (Article 324)
  - Voter registration (Form 6, EPIC, e-EPIC, voters.eci.gov.in)
  - EVM and VVPAT mechanics and security
  - Model Code of Conduct (MCC) rules and enforcement
  - Polling day procedures and the 12 valid photo IDs
  - Vote counting, result declaration, and government formation
  - Grievance reporting (cVIGIL app, Helpline 1950)
  - Candidate nomination process and expenditure limits
  - NRI voting rights under Section 20A of the RPA

- **Conversation history** is maintained for multi-turn contextual chats
- **Graceful degradation**: 7+ keyword-matched built-in answers work even if the API is unavailable

### Decision Logic

```
User types question
        ↓
API key present? ──Yes──→ Call Gemini 2.5 Flash API with system prompt + history
        │                            ↓
        No                  Stream response to chat
        ↓
Keyword-match fallback response
```

---

## 🌟 Features

| Feature | Description |
|---|---|
| 💬 **AI Chat** | Gemini 2.5 Flash — answers any Indian election question conversationally |
| ⚡ **Quick Actions** | 6 one-click cards that pre-fill common questions into the chat |
| 📅 **Interactive Timeline** | 9 election phases from announcement → government formation, each expandable |
| 📚 **Role-Based Voter Guide** | Personalized step-by-step guide for 4 roles: First-Time Voter, Candidate, Observer, Polling Official |
| ✅ **Interactive Checklists** | Tick off preparation steps as you complete them in the Voter Guide |
| ❓ **FAQ Section** | 12 common questions with a live search/filter |
| 🌙 **Dark Mode Design** | Glassmorphism UI with India flag-inspired color palette |
| 📱 **Fully Responsive** | Works seamlessly on mobile, tablet, and desktop |

---

## 🧠 How It Works

1. **Open** `index.html` in any browser
2. **Explore** the election timeline by clicking any phase to expand detailed steps and key facts
3. **Select your role** in the Voter Guide — steps and checklists adapt to your role
4. **Search the FAQ** for instant answers to the most common election questions
5. **Click "Ask ElectAssist AI"** floating button to open the chat panel
6. Ask any election question in plain English — Gemini 2.5 Flash answers with context-aware responses

---

## 📋 Google Services Used

| Service | Integration |
|---|---|
| **Gemini 2.5 Flash API** | Core AI engine — answers all election queries via `generateContent` REST endpoint |
| **Google Fonts** (Outfit + Inter) | Premium typography loaded via Google CDN |
| **Material Symbols Rounded** | Icon system served via Google Fonts CDN |

---

## 🏗️ Project Structure

```
election-assistant/
├── index.html    # SPA shell — all sections, nav, hero, chat panel markup
├── styles.css    # Full design system: dark mode, glassmorphism, animations, responsive
├── app.js        # Application logic: Gemini API calls, chat, timeline, guide, FAQ interactions
├── data.js       # All election content: 9-phase timeline, 12 FAQs, 4 role guides, system prompt
└── README.md     # This file
```

---

## 📌 Assumptions Made

1. **India-focused**: All content covers Indian elections (ECI, EVM, VVPAT, MCC, RPA 1950/1951, Form 6, cVIGIL)
2. **Lok Sabha primary**: Focuses on general/Lok Sabha elections; principles apply to State Assembly elections too
3. **Client-side only**: No backend required; API key stored in `sessionStorage` (cleared on tab close)
4. **Educational tool**: Users are encouraged to verify critical information with official sources at [eci.gov.in](https://eci.gov.in)
5. **Modern browser**: Requires a browser with ES6+ support (Chrome, Firefox, Edge, Safari — all 2020+)

---

## ✅ Evaluation Criteria Coverage

| Criteria | Implementation |
|---|---|
| **Code Quality** | Separated into `data.js` (content) + `app.js` (logic) + `styles.css` (design); clean naming conventions |
| **Security** | API key only sent to Google's official `generativelanguage.googleapis.com` endpoint; XSS prevented via `escHtml()` utility |
| **Efficiency** | No npm dependencies; DOM built dynamically; `IntersectionObserver` for scroll animations; ~74KB total |
| **Testing** | Keyword fallback ensures all features work without an API key; all interactive elements verified |
| **Accessibility** | ARIA labels on chat panel and buttons; semantic HTML5 elements; keyboard navigation; mobile-first responsive design |
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
| Google AI Studio | [aistudio.google.com](https://aistudio.google.com) |

---

*Built for the Google Antigravity Challenge — Civic Education vertical. For educational purposes only.*
