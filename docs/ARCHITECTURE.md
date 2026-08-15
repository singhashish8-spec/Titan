# Titan — Architecture

**Status:** target design for v0.1–v0.2. Update this file whenever an architectural decision changes; log the *why* in `DECISIONS.md`, keep this file as the current-state reference.

## Stack

- **Capacitor + Ionic + React** — same pipeline as Budget Tracker, proven to work for a solo AI-assisted build.
- **No dedicated backend for v0.1.** The app calls each AI provider's API directly from the client.
- **Android first.** Sideloaded distribution, not Play Store (same precedent as Budget Tracker — minimizes review friction; Titan's permission set is expected to be minimal: network + storage).

## Why no backend, and how the client-to-API call actually works

A plain browser `fetch()` from the Capacitor WebView to Anthropic/OpenAI/Google's APIs risks CORS restrictions, since these APIs are not designed for direct browser-origin calls. The fix is **not** standing up a backend — it's using Capacitor's **native HTTP plugin** (`CapacitorHttp`) instead of the WebView's `fetch`. Native HTTP requests are made from native code, not the browser sandbox, so the CORS restriction doesn't apply. This keeps the "no backend" decision intact. This should be the first thing validated when build starts (see `ROADMAP.md` step 1 — CORS/native-HTTP spike).

## The "plug" pattern — AI provider integration

Every provider (Claude, GPT, Gemini, and any future one) implements the same interface:

- **Input:** user's message + relevant project notes
- **Action:** sends to that provider's API using its saved key, via the native HTTP plugin
- **Output:** reply text

The chat screen only ever talks to this shared shape — `send(message) → reply`. A future 4th provider (or a future backend-mediated provider) is a new plug into the same slot, not a rewrite of the chat screen. This directly satisfies the original vision's "AI-model-agnostic architecture" requirement without needing the abstraction to be more complex than it has to be right now.

## Screens (v0.1 — 3 total)

1. **Projects list (home)** — list of projects (name only), "+ New Project", tap to open.
2. **Chat** — message list, text box + send, AI picker (Claude/GPT/Gemini) at top, persists as the default per project (not reset per message). Each project has its own chat history. UI reference: ChatGPT-style bubbles, markdown rendering, streaming text as the reply arrives.
3. **Settings** — 3 API key fields (Claude, OpenAI, Gemini), saved on-device via the **Capacitor Preferences plugin**. Not a hardware-keystore-backed secure storage — the threat model for a single-user sideloaded app is "someone else picks up my phone," not "attacker with root," so the added complexity of a Keychain-backed plugin isn't justified for v0.1.

## Missing / invalid key handling

If a project's selected provider has no saved key, disable send and show an inline prompt to add it in Settings. Don't validate keys proactively (no test call on keystroke) — just surface the provider's real 401 response when it happens.

## Memory strategy (v0.1)

One small notes file per project. After each exchange, append a short line via **naive truncation** — a trimmed slice of the user message + reply, not an AI-generated summary. This is free (no extra API call), instant, and good enough to evaluate during the real-use trial. When a project's chat reopens, its notes are quietly included as context. If naive truncation proves too low-quality during daily use, the upgrade path is smarter retrieval over saved notes (v0.3) — **not** fine-tuning or "training" any provider's model. Anthropic does not offer fine-tuning on the Claude API at all; OpenAI's fine-tuning is a heavyweight, per-provider, non-portable process that breaks the plug pattern. The "gets smarter about you over time" feeling Titan wants comes entirely from context injection (notes → prompt), same principle as decision that current model context windows already comfortably fit a project's notes + a few files.

## Build distribution (v0.1 — CI, not true OTA)

True in-app OTA (checking a manifest and swapping the running web bundle without reinstalling) was evaluated for v0.1 and **not shipped** — see decision #24. The realistic options were a third-party plugin whose defaults phone home to its own servers unless carefully disabled (a real conflict with Titan's BYOK/no-third-party posture), or hand-written native code to redirect which folder the WebView serves from, which risks bricking the app on a bad update with no way to test it on a real device before it ships. Neither was worth the risk for what's still a convenience feature.

Instead: `.github/workflows/build-apk.yml` builds a debug APK on every push/PR and uploads it as a workflow artifact — since this development environment has no Android SDK and cannot build one itself. Getting a new build onto the phone is "download the latest artifact, tap install," not a full local rebuild. The APK is signed with a checked-in, fixed debug keystore (`android/app/debug.keystore`, debug-only, no meaningful access) specifically so this stays a smooth in-place upgrade: without a pinned key, CI's ephemeral runners would produce a differently-signed APK on every run, which Android refuses to install over the previous one without an uninstall first — wiping all on-device Preferences data (projects, chat history, notes) on every single test cycle.

True in-app OTA is deferred to v0.2, self-hosted via the user's own Drive folder rather than a third-party update service, once on-device testing is actually possible before it ships.

## v0.2 — Google Drive integration

Google Sign-In + Drive REST API (mirrors Budget Tracker's pattern):
- Project notes + chat history synced to a visible Drive folder (backup + cross-device)
- File attachments in chat, stored/read via Drive
- This reopens OAuth (deferred in v0.1) deliberately, once the core loop is proven — not before.

## Explicitly out of architecture for now

- AI auto-routing / auto-selection — no router yet; user picks the AI per project.
- Vector database — not needed at this scale; flat notes file + context injection covers it.
- Device-wide app control / cross-app automation (Accessibility Service, Notification Listener, Device Admin) — a fundamentally different engineering domain (Android automation/RPA) with a much larger security surface than a chat app. Explicitly not part of Titan's architecture; if ever pursued, it's a separate project with its own dedicated design discussion. See `DECISIONS.md`.
