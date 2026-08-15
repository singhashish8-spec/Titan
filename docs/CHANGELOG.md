# Changelog

Format loosely follows [Keep a Changelog](https://keepachangelog.com/). Dates are when the change actually landed, not when it was decided.

## [Unreleased]

### Added
- 2026-08-15 — Repo bootstrapped: `main` and `develop` branches established, `.gitignore`, `README.md`.
- 2026-08-15 — Full documentation set added: `PROJECT_CONTEXT.md`, `ARCHITECTURE.md`, `ROADMAP.md`, `DECISIONS.md`, `CHANGELOG.md` (this file), `ERROR_LOG.md`, `AI_HANDOFF.md`, `CLAUDE.md`, plus both original vision documents preserved verbatim under `docs/source/`.
- 2026-08-15 — v0.1 core loop: Capacitor + Ionic + React app scaffolded, Android platform added. Projects list, Chat, and Settings screens. All three provider plugs (Claude, GPT, Gemini) implemented behind one interface, calling out via `CapacitorHttp` to avoid CORS without a backend. Capacitor Preferences storage for API keys, projects, chat history, per-project provider selection, and naive-truncation notes. `.github/workflows/build-apk.yml` builds and publishes a debug APK on every push/PR, signed with a checked-in fixed debug keystore so installs upgrade in place.

### Changed
- 2026-08-15 — In-app OTA updates, planned for v0.1, evaluated and deferred to v0.2 instead — see `docs/DECISIONS.md` #24. Update friction is handled for now by the CI-built APK plus consistent signing.

Not yet done: real on-device testing (this environment has no Android SDK and cannot build or run the app itself — first real validation happens when a CI-built APK is installed and tested).
