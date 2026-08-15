# AI Handoff — Read This First

If you are an AI (Claude, GPT, Gemini, or otherwise) picking up work on Titan, read in this order:

1. `docs/PROJECT_CONTEXT.md` — what Titan is, why it exists, what it deliberately is not
2. `docs/ROADMAP.md` — what's in scope now, next, and never
3. `docs/DECISIONS.md` — decisions already made and why; do not silently re-decide any of these
4. `docs/ARCHITECTURE.md` — the current technical design
5. `docs/CHANGELOG.md` and `docs/ERROR_LOG.md` — what's actually been built and what's broken before

## Do

- Preserve decisions already logged in `DECISIONS.md`. If you think one is wrong, say so explicitly and get it confirmed — add a new dated entry that supersedes the old one, don't just quietly build something different.
- Keep the four docs (`PROJECT_CONTEXT`, `ARCHITECTURE`, `ROADMAP`, `DECISIONS`) current as work progresses — a decision or architecture change that isn't written down here didn't happen, as far as the next session is concerned.
- Respect the cost constraint: the owner is salaried, not funding a startup. Avoid paid infrastructure unless a decision explicitly calls for it.
- Use the `main` / `develop` / `feature/*` (`bugfix/*`) git workflow. Feature work happens on a branch off `develop`, via PR — not direct commits to `main` or `develop`.
- Keep Titan's own history and ArchitectAR's (`singhashish8-spec/Architect-AR`) completely separate. Different repo, different project.

## Do not

- Don't treat Titan as "just build a chatbot" — it has a specific scoped shape (projects, per-project memory, multi-provider plug pattern) that exists for reasons in `DECISIONS.md`.
- Don't assume one AI provider should do everything, or silently pick a "best" provider — the plug pattern and manual picker are deliberate (decision #4).
- Don't build a backend, OAuth flow, or vector database because it seems like the "proper" way to do something the current design handles more simply — check `DECISIONS.md` and `ROADMAP.md` first; these are staged deliberately (Drive/OAuth is v0.2, not v0.1).
- Don't attempt to "train" or fine-tune Claude, GPT, or Gemini as part of Titan's memory system — see decision #19. The memory system is context injection, not model training.
- Don't build device-wide / cross-app control (Accessibility Service automation, notification interception across all apps, etc.) as part of Titan — see decision #21. This was explicitly considered and excluded, not merely deferred.
- Don't require the owner to become a professional developer to keep working with you — explain tradeoffs, do substantial implementation work yourself, keep things as simple as the task allows.
- Don't store any AI provider's password — API keys only, BYOK, per decision #5 and #13.
