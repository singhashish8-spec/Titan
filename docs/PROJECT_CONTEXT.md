# Titan — Project Context

**Owner:** Ashish Singh
**Status:** Pre-build, scoped to v0.1
**Last updated:** 2026-08-15

## What Titan is

Titan is a personal chat app: talk to Claude, GPT, or Gemini — your choice, per chat — organized into **projects**, where each project remembers what's been discussed. It is built BYOK (bring your own API key): you pay each provider directly, Titan never resells or proxies access.

Titan is deliberately **not** the full "personal AI operating system" described in its original concept doc (`docs/source/titan-complete-handoff.md`). That full vision — auto-routing between models, OAuth into Gmail/Calendar/Drive, a vector-database memory system, a dedicated backend, specialized agents — is real and worth building toward, but not as a v0.1. See `docs/ROADMAP.md` for what's actually in scope now versus later.

## Origin

1. Titan started as a handoff document (`docs/source/titan-complete-handoff.md`) describing an ambitious multi-AI personal-assistant Android app / "AI operating system."
2. That doc was brought to Claude for an honest assessment. The assessment: genuinely useful concept, but not a new category (Poe, TypingMind, OpenRouter-based apps already route between models), and the scope described was a small team's roadmap, not a solo build — auto-routing, OAuth, and a vector DB alone are each real projects.
3. The vision was scoped down to a realistic v0.1, captured in `docs/source/titan-project-definition.md` — the smallest slice that would actually get used daily, with the full vision kept as a later-phase reference.
4. A further round of discussion (August 2026) refined build order, resolved several open questions, and explicitly ruled a large scope addition (device-wide app control) out of Titan entirely — see `docs/DECISIONS.md`.

## Prior work — Budget Tracker (proof of method)

Ashish has already shipped a working Android app solo: **Budget Tracker** (Capacitor/React + Ionic, Gemini AI for receipt scanning, Google Drive sync, SMS parsing, biometric lock, OTA updates, sideloaded distribution). This is the proof that the "AI-assisted, no professional-dev-background" build method works, and Titan deliberately reuses its stack and several of its patterns (see `docs/ARCHITECTURE.md`).

## Two separate concepts to not confuse

- **Titan** = the multi-AI chat app this repo builds.
- **ArchitectAR** (`singhashish8-spec/Architect-AR`) = a completely separate Android AR/BIM app (ARCore + SceneView, Revit-sourced). Different repo, different project, different history. Never mix the two.

## How to use this doc set

- `docs/PROJECT_CONTEXT.md` (this file) — what Titan is and why, for a new AI or human picking up the project cold.
- `docs/ARCHITECTURE.md` — the actual technical design and stack.
- `docs/ROADMAP.md` — phased build plan, what's in scope now vs. later vs. never.
- `docs/DECISIONS.md` — dated log of every real decision made and why, so nothing gets re-litigated by accident.
- `docs/CHANGELOG.md` — what actually shipped, in order.
- `docs/ERROR_LOG.md` — real bugs hit during build and how they were fixed.
- `docs/source/` — the two original vision documents, kept verbatim for reference.
- `CLAUDE.md` (repo root) — quick-start pointer for any Claude Code session opening this repo.
