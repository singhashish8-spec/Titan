# Titan — Roadmap

Phased plan. Each phase should be genuinely usable before starting the next — no phase begins because it's next on the list, it begins because the previous one earned it.

## v0.1 — Core chat app

Goal: a personal chat app where Ashish can talk to Claude, GPT, or Gemini, organized into projects that remember what's been discussed.

Build order (as actually executed — see `DECISIONS.md` #24–28 for where this diverged from the original plan and why):
1. ~~CORS / native-HTTP spike as a standalone step~~ — folded into step 2: `CapacitorHttp` enabled in `capacitor.config.ts`, all three providers call it via plain `fetch`. Real on-device confirmation is the first thing to check when testing the first build.
2. App shell — Projects list, Chat, and Settings screens, all three provider plugs (Claude/GPT/Gemini), Capacitor Preferences storage, per-project notes (naive truncation), missing/invalid-key handling — built together in one pass rather than staged, since the plug interface made the marginal cost of all three low, and Settings couldn't reasonably come after Chat (decision #28).
3. ~~Basic OTA update check~~ — evaluated and **not shipped** in v0.1 (decision #24). Update friction is instead handled by CI building an installable debug APK on every push (decision #25), signed with a fixed debug keystore so installs upgrade in place instead of colliding (decision #26).
4. CI workflow to build a downloadable debug APK — done, `.github/workflows/build-apk.yml`.
5. Install on phone, use it for real, daily, for 1–2 weeks — **no new features during this window**, current step.

## v0.2 — Google Drive integration

Only after the v0.1 trial validates the core loop is worth using daily.

- Google Sign-In + Drive REST API
- Project notes + chat history synced to a visible Drive folder
- File attachments in chat, stored/read via Drive (resolves the file-attachment open question left over from the original v0.1 spec)
- True in-app OTA updates, deferred from v0.1 (decision #24): self-hosted via the user's own Drive folder rather than a third-party update service, and testable on-device before it ships — both conditions v0.1 couldn't meet

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
