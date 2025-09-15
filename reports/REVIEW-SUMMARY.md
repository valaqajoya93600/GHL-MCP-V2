# GHL MCP — Implementation & QA Review Summary

Audience: Reviewer AI with access to this repository.

Goal: Double-check that all GoHighLevel API endpoints in the official specs are implemented correctly in this project’s client and are callable through the MCP server where tools exist. If anything deviates, please flag it and summarize the issue.

## Key References
- Coverage summary: `reports/ghl-qa-summary.md`
- Canonical diff (param tokens, missing shapes): `reports/ghl-qa-diff-advanced.md`
- Fix queue (should be empty of gaps): `reports/ghl-fix-queue.md`
- Endpoint checklist (human scan): `reports/ghl-endpoint-checklist.md`
- Progress tracker (statuses/notes): `reports/ghl-endpoints-progress.json`
- Usage guide (examples): `reports/USAGE-GUIDE.md`
- Per-app detail (before/after and expectations): `reports/apps/*-detail.md`

## Code
- Client implementation: `src/clients/ghl-api-client.ts` (all endpoints live here; grouped by “API METHODS” headings)
- MCP stdio server (Claude): `src/server.ts`
- MCP HTTP/SSE server (ChatGPT/web): `src/http-server.ts`
- Tools: `src/tools/*`
- Tests: `tests/**/*.test.ts` (see `tests/clients/ghl-api-extra.test.ts` for route/header checks)

## Scripts (for your checks)
- `node scripts/qa-summary.js` — regenerates coverage summary
- `node scripts/qa-diff-advanced.js` — verifies no param‑token diffs and lists missing canonical shapes (should be none)
- `node scripts/qa-build-fix-queues.js` — regenerates fix queues (should show no gaps)
- `node scripts/qa-progress-verify.js` — marks implemented todos as verified (idempotent)
- `node scripts/qa-checklist.js` — rebuilds the checklist

## What You Should Find (Flag if not true)
For each app below, validate:
- Every spec path+method appears in the client with the exact route tokens (e.g., `{id}`, `{locationId}`) and appropriate HTTP verb.
- Required headers exist (notably Version for some APIs).
- Methods accept/forward required path/query/body parameters per spec.
- Usage examples in `reports/USAGE-GUIDE.md` work with correct shapes.
- Where MCP tools exist, they route correctly (see `src/tools/*`).

### Calendars
- Expect: 100% endpoints for appointments, notes, groups (status), validate‑slug, resources, events (block slots, delete), free slots.
- Headers: Some calendar endpoints in spec indicate Version 2021‑04‑15; ensure requests are accepted by the API (flag if Version header mismatch prevents calls).

### Social Media Posting
- Expect: Posts (list/create/get/update/delete/bulk‑delete), Accounts list/delete, CSV import (upload/status/get/finalize/delete), Categories/Tags, OAuth start per platform, Attach accounts, Statistics endpoint.

### Voice AI
- Expect: Agents (POST/GET/LIST/PATCH/DELETE), Call logs (LIST/GET), Actions (POST/GET/PUT/DELETE).
- Headers: Version 2021‑04‑15 must be set; confirm route calls include this header.

### SaaS API
- Expect: Public and internal routes for subscription update/enable/pause, bulk enable/disable, rebilling, agency plans, subscription lookup, saas locations by company, plan by id.

### Businesses, Users
- Expect: Full CRUD (Businesses), List/Create/GET/PUT/DELETE, Search, Filter‑by‑email (Users).

### Locations
- Expect: Recurring Tasks CRUD, Timezones (`/locations/timezones` and `/locations/{locationId}/timezones`).

### Medias
- Expect: Upload, Update item, Create folder, Bulk update/delete, Delete item by id.

### Products
- Expect: Bulk edit; store product priority update.

### Surveys
- Expect: Submissions pagination and filters.

### Funnels
- Expect: Redirect POST, list, PATCH/DELETE by id; funnel list; page list/count.

### Links
- Expect: List, create, get by id, update, delete, search.

### Marketplace
- Expect: Charges POST/GET/LIST/DELETE/GET by id; has‑funds; app installations LIST/DELETE.

### Custom Menus
- Expect: List, create, get, update, delete.

### Snapshots
- Expect: List, share link, snapshot status, snapshot location status.

### Proposals
- Expect: Documents LIST/SEND; Templates LIST/SEND.

### Forms
- Expect: Forms LIST with filters; Submissions LIST with filters; Upload custom files (multipart).

### OAuth / Singletons / Phone System
- OAuth: Token, Location Token, Installed Locations.
- Singletons: Campaigns list, Company get, Courses import.
- Phone System: Number pools, Numbers by location.

If any check fails (e.g., route mismatch, missing required headers, missing parameters, incorrect HTTP verb):
- Flag the app and specific endpoint(s).
- Summarize findings: spec vs client route, expected headers/params, and suggested correction.

## Final Status (Verified)

- Coverage summary: `reports/ghl-qa-summary.md` shows all apps Implemented == Spec and Missing == 0.
- Advanced diff: `reports/ghl-qa-diff-advanced.md` shows Param‑name‑only differences == 0 and Missing from client (canonical) == 0.
- Contacts: 100% coverage; four new endpoints implemented and tested.
- Surveys: Canonical GET `/surveys/submissions` added with `locationId` as query param (Version: 2021‑07‑28). Legacy location‑scoped variant retained for backward compatibility.
- Tests: Full suite green — 155/155 passing, including client core (62/62) and tools.
- Build/Type checking: `npm run build` and `npm run lint` succeed.

## How to Run Your Checks (locally)
```bash
# Summaries
node scripts/qa-summary.js
node scripts/qa-diff-advanced.js
node scripts/qa-build-fix-queues.js
node scripts/qa-progress-verify.js
node scripts/qa-checklist.js

# Core client tests
npm test -- tests/clients/ghl-api-client.test.ts tests/clients/ghl-api-extra.test.ts

# Full suite
npm test
```

---

# Message to Provide to the Reviewing AI

Use this file as the entry point. Confirm the Final Status above by running the scripts and tests. If any deviation is found, provide a concise spec‑vs‑client diff and a suggested fix.

