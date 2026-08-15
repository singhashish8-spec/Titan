# Titan — Project Definition & Build Brief

**Owner:** Ashish Singh
**Status:** Pre-build, scoped to v0.1
**Purpose of this doc:** Full history of the Titan concept — original vision, decisions made, what was cut and why, and the concrete v0.1 spec — consolidated into one reference so Claude Code can pick up the project with full context.

---

## 1. Origin & Context

- Titan started as a handoff document from an earlier, separate discussion (not in this chat history) describing an ambitious **multi-AI personal-assistant Android app**.
- That original document was brought into a conversation with Claude for an honest assessment.
- Separately, Ashish has already **shipped a working Android app, Budget Tracker** (Capacitor/React + Ionic, Gemini AI for receipt scanning, Google Drive sync, SMS parsing, biometric lock, OTA updates) — proof the "AI-assisted, no-code-background" build method works. Titan reuses that same playbook.

---

## 2. Original Vision (as described in the handoff doc)

The original concept was a **multi-AI orchestration platform**, including:

| Component | Description |
|---|---|
| AI Router | Auto-decides which AI (GPT / Claude / Gemini) should answer a given query |
| Connections | OAuth into Gmail, Google Calendar, Google Drive, and other files |
| Memory | Vector database for long-term memory across all conversations |
| Backend | A dedicated backend server (not just client-to-API calls) |
| Platform | Native Android (Kotlin / Jetpack Compose) |
| Future | Multi-agent marketplace |

This is the **full, unscoped vision** — useful as a reference for "someday" features, but not the v0.1 build target.

---

## 3. Assessment of the Original Vision — Pros & Cons

**Pros**
- Genuinely useful concept — one assistant, all your AIs, all your context, no re-explaining yourself
- Extensible long-term into something with real differentiation (agent marketplace, smart routing)
- Ashish has already proven he can ship a real app solo via AI-assisted coding (Budget Tracker)

**Cons**
- **Not a new category.** Poe, TypingMind, OpenRouter-based apps, and Raycast AI already do "route between multiple AI models."
- **Scope is a small team's roadmap, not a solo weekend build.** Even the doc's own "v0.1 MVP" bundled: Android app + auth + one AI API + file upload + a memory system — already a full project on its own.
- **Auto-routing (AI deciding which model to use) is a hard problem** — easy to get subtly wrong, and you'd be building it blind without knowing what "good routing" even looks like yet.
- **OAuth into Gmail/Calendar/Drive** adds real complexity (consent screens, scopes, token refresh) for no v0.1 payoff.
- **Vector database** is overkill at small scale — a simple notes file does the same job with none of the infrastructure.
- **Business/legal snag:** reselling access to GPT + Claude + Gemini through your own app can run into each provider's terms of service. Paying for three subscriptions to route between them gets expensive fast **unless users bring their own API keys** (which is the model Titan adopted).

**Resolution:** scope down to a realistic v0.1 (Section 5), keep the full vision as a later-phase reference, not a build target.

---

## 4. Key Decisions Made (in order)

1. **Don't build the full doc.** Build the smallest slice that would actually get used daily.
2. **New, separate app** — not folded into Budget Tracker. Clean slate, but reusing the same proven stack.
3. **Reuse the Capacitor + Ionic + React pipeline** from Budget Tracker rather than starting over with native Kotlin.
4. **Skip AI auto-routing.** User manually picks which AI answers each chat (dropdown/toggle). Simpler, works immediately, and teaches what "smart routing" should even look like before anyone tries to automate it.
5. **All 3 AI providers (Claude, GPT, Gemini) from day one** — explicitly requested by Ashish, overriding Claude's initial suggestion to start with just one provider. Made viable by using a shared "plug" pattern (see Section 5.5) so it doesn't blow up scope, and by keeping it BYOK (bring your own key) so there's no reselling/ToS problem and no cost to Ashish.
6. **Architecture must stay extensible** — future providers should be addable as a new "plug," not a redesign.
7. **Skip OAuth / Gmail / Calendar / Drive integration for v0.1.** Manual file attach/select only.
8. **Skip vector database for v0.1.** Use simple per-project text notes files instead — mirrors how Claude's own memory system works (short saved summaries, not raw transcript replay).
9. **No backend server for v0.1.** App calls each AI's API directly from the client.
10. **Token/context limits are not a real v0.1 concern** — current model context windows are far larger than a project's notes + a few files would ever use. The right long-term design isn't "a bigger limit," it's "save short summaries, retrieve only what's relevant" — same principle already validated by decision #8.

---

## 5. Titan v0.1 — Scoped Build Spec

### 5.1 Goal
A personal chat app where Ashish can talk to Claude, GPT, or Gemini (his choice, per chat), organized into **"projects,"** where each project remembers what's been discussed.

### 5.2 Explicitly NOT building yet (deferred, not abandoned)
- AI auto-routing / auto-selection
- Google/Gmail/Calendar OAuth login
- Backend server
- Vector database
- Voice input
- Agent marketplace

### 5.3 Tech Stack
- **Capacitor + Ionic + React** (same stack as Budget Tracker)
- Same OTA update setup as Budget Tracker, once stable
- No backend — calls go straight from the app to each AI provider's API

### 5.4 Screens (3 total)

**1. Projects list (home screen)**
- List of projects (name only)
- "+ New Project" button
- Tap a project → opens its Chat screen

**2. Chat screen**
- Message list (user messages + AI replies)
- Text box + send button
- Dropdown/toggle at top: **Claude / GPT / Gemini** — picks which AI answers *this* message
- Each project keeps its own separate chat history

**3. Settings screen**
- Three fields: Claude API key, OpenAI API key, Gemini API key
- Keys saved securely on-device (not plain text)

### 5.5 AI Provider Integration Pattern ("plug" model)
Every provider (Claude, GPT, Gemini, and any future one) implements the **same interface**:
- **Input:** user's message + relevant project notes
- **Action:** sends to that provider's API using its saved key
- **Output:** reply text

The app's chat screen only ever talks to this shared shape — `send(message) → reply`. A future 4th provider is a new plug into the same slot, not a rewrite.

### 5.6 Memory Strategy (v0.1)
- One small notes file per project
- After each exchange, append a short line: what was asked, what was decided
- When a project's chat is reopened, those notes are quietly included as context — no separate memory database

### 5.7 Token / Context Handling
- Not a v0.1 problem in practice — current model context windows comfortably fit a project's notes + a few attached files
- Design principle to carry forward: save short summaries, not raw transcripts; retrieve only what's relevant to the current question

### 5.8 Build Order
1. App shell — Projects list screen, empty state
2. Settings screen — save/load 3 API keys on-device
3. Chat screen — hardcode to Claude first, get send/reply working end-to-end
4. Add the AI picker — wire up GPT and Gemini using the same plug pattern
5. Add per-project notes file — write after each exchange, read back in on open
6. Install on phone, use it for real for 1–2 weeks before adding anything else

---

## 6. Practical / Business Considerations

- **3 separate paid API accounts = 3 separate bills**, not one combined bill. Ashish is funding his own usage (BYOK model), not reselling — this sidesteps the ToS issue raised in Section 3.
- Distribution note (carried over from Budget Tracker precedent): apps requesting sensitive permissions may hit Play Store review friction — Budget Tracker was sideloaded rather than Play Store–distributed for this reason. Worth checking whether Titan's permission set (likely minimal — just network + storage) avoids this.

---

## 7. Open Questions (not yet decided in any conversation)

- App name/branding beyond "Titan" — confirmed, no changes discussed
- Exact on-device storage method for API keys (e.g., Capacitor Secure Storage vs. Preferences plugin) — flagged as "secure," not yet specified
- Whether project notes files sync anywhere (e.g., Google Drive, like Budget Tracker's data) or stay fully local for v0.1 — not discussed; current spec implies local-only
- Whether/how a project's AI picker choice persists as a default vs. resets per message
- What happens when API key is missing/invalid — no error-state UX defined yet
- File attachment for chat context — mentioned in the earlier (pre-decision) draft plan but not present in the final v0.1 spec Ashish approved; needs a decision on whether it's in v0.1 or deferred

---

## 8. First Prompt for Claude Code

> Set up a new Capacitor + Ionic + React Android app called Titan. Start with two screens: a Projects list (just names, tap to open) and a Chat screen. For now, hardcode a single Claude API call in the Chat screen — text input, send button, message list showing my messages and Claude's replies. No login, no backend — API key can be a placeholder for now. Keep the code structured so a new AI provider can be added later without rewriting the chat screen.

*(Follow with Settings screen for the 3 API keys, then the AI picker dropdown, then the per-project notes file — in that order, per Section 5.8.)*

---

## 9. Reference — Budget Tracker (prior shipped app, stack precedent)

Included because Titan deliberately reuses this app's proven patterns:
- Capacitor/React hybrid, package `com.budgettracker.app`
- Encrypted local SQLite storage
- Gemini AI integration (receipt/document scanning)
- Google Sign-In + Drive REST API for data sync (JSON files in a visible Drive folder)
- SMS BroadcastReceiver for bank/UPI transaction parsing
- Biometric lock (BiometricPrompt + PIN fallback)
- OTA update pipeline
- Sideloaded distribution (not Play Store) due to SMS permission review friction

This is the "known-good" foundation Titan's tech-stack decisions (Section 5.3) are built on.
