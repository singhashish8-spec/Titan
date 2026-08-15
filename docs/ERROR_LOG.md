# Error Log

Real bugs/failures hit during the build, and how they were actually resolved — not a general troubleshooting guide. Purpose: stop the same mistake from being rediscovered from scratch in a future session.

Log format per entry:

```
## YYYY-MM-DD — short title

**Symptom:** what broke / what was observed
**Root cause:** what was actually wrong
**Fix:** what changed
**Notes:** anything worth remembering (e.g. "this will resurface if X changes")
```

No entries yet — nothing has been built. First candidate to watch for: whether the CORS/native-HTTP spike (`ROADMAP.md` step 1) hits any provider-specific quirk (e.g. Gemini or OpenAI behaving differently from Claude under `CapacitorHttp`) — log it here the moment it happens, not after it's forgotten.
