# Titan — Roadmap

Phased plan. Each phase should be genuinely usable before starting the next — no phase begins because it's next on the list, it begins because the previous one earned it.

## v0.1 — Core chat app

Goal: a personal chat app where Ashish can talk to Claude, GPT, or Gemini, organized into projects that remember what's been discussed.

Build order:
1. **CORS / native-HTTP spike** (half day) — confirm a direct client → Claude API call works from the Capacitor WebView on Android via `CapacitorHttp`. This determines whether "no backend" survives contact with reality; see `ARCHITECTURE.md`.
2. App shell — Projects list screen, empty state, "+ New Project"
3. Chat screen — hardcoded Claude key, send/reply working end-to-end on-device, ChatGPT-style bubbles + markdown + streaming
4. Basic OTA update check (manifest-based `www` swap) — reduces reinstall friction for every step after this one
5. Settings screen — save/load 3 API keys via Capacitor Preferences plugin; wire Chat to read the real key; missing/invalid-key error state
6. AI picker — GPT + Gemini plugs wired up via the same interface, default persists per project
7. Per-project notes file — naive-truncation append after each exchange, read back in on open
8. Install on phone, use it for real, daily, for 1–2 weeks — **no new features during this window**

## v0.2 — Google Drive integration

Only after the v0.1 trial validates the core loop is worth using daily.

- Google Sign-In + Drive REST API
- Project notes + chat history synced to a visible Drive folder
- File attachments in chat, stored/read via Drive (resolves the file-attachment open question left over from the original v0.1 spec)
- Move the OTA update manifest to the user's own Drive folder, dropping any third-party OTA service dependency

## v0.3 — Smarter memory (conditional)

Only if the v0.1 trial shows naive-truncation notes are actually insufficient.

- Smarter summarization or lightweight retrieval over saved notes
- Still local-first; no hosted vector-DB service unless a real need is demonstrated
- Explicitly not "training" any provider's model — see `ARCHITECTURE.md` for why that's not achievable via these providers' consumer/BYOK APIs

## Someday — reference only, not a near-term target

From the original vision (`docs/source/titan-complete-handoff.md`), kept as "someday" rather than abandoned:

- AI auto-routing (intent detection → model selection)
- Real-time usage/cost/quota awareness across providers
- Dedicated backend for auth, routing, memory, task execution
- Specialized agents (coding, research, planning, etc.) coordinated by Titan
- Multi-agent marketplace

## Explicitly excluded, not just deferred

- **Device-wide / cross-app control** ("Titan manages every other app on my phone"). This is not a smaller version of any roadmap item above — it's a different project (Android automation/RPA) with a materially larger security surface (an app with Accessibility Service access is effectively a master key to the whole device) and no clean incremental path from a chat app. If this is pursued at all, it should be its own separate, deliberately-scoped effort with a dedicated design discussion — not a Titan roadmap phase.
