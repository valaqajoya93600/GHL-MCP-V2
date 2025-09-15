# GHL API QA Package

This package consolidates spec vs implementation analysis so another reviewer/AI can assess coverage and propose changes without modifying code.

Contents
- Overall summary: `reports/ghl-qa-summary.md`
- Full checklist: `reports/ghl-endpoint-checklist.md`
- Progress tracker (edit statuses): `reports/ghl-endpoints-progress.json`
- Gap report (exact string compare): `reports/ghl-endpoint-gap.md`
- Advanced diff (canonical param shapes): `reports/ghl-qa-diff-advanced.md`

Definitions
- Implemented: Present in client (`src/clients/ghl-api-client.ts`) as an axios call.
- Missing: Exists in spec but not in client.
- Client-only: Exists in client but not in spec (candidate for deprecation or wrong path).
- Param-name-only difference: Same method and path shape, but parameter tokens differ (e.g., `{id}` vs `{noteId}`).
- Version hint: Spec requires a `Version` header (e.g., `2021-04-15`) that may need verification in code.

How to update
1) Update endpoint statuses in `reports/ghl-endpoints-progress.json` with:
   - `todo`, `verified`, `needs-fix`, or `skipped`
   - Add `notes` for context.
2) Regenerate docs (from repo root):
   - `node scripts/qa-checklist.js`
   - `node scripts/qa-summary.js`
   - `node scripts/qa-diff-advanced.js`

Review guidance
- Start with `ghl-qa-summary.md` to prioritize apps with highest missing count (e.g., social-media-posting, voice-ai, saas-api).
- Use `ghl-qa-diff-advanced.md` to quickly identify endpoints that likely only need parameter token normalization.
- Check `Version` requirements (e.g., Conversations/Calendars frequently use `2021-04-15`).

Scope
- Specs sourced from `vendor/highlevel-api-docs/apps/*.json`.
- This package is read-only; no code changes are included.

