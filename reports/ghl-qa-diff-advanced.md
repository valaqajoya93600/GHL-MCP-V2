# GHL QA Diff (Advanced Canonical)

Generated: 2025-09-15T00:33:29.901Z

- Spec: 409
- Client: 418
- Canonical matches: 409
- Exact matches: 409
- Param-name-only diffs: 0
- Missing from client (canonical): 0
- Client only (canonical): 8

## Param-name-only Differences
- None

## Missing From Client (Canonical)

## Client Only (Canonical)
- POST /contacts/tags/bulk
  - POST /contacts/tags/bulk
- POST /contacts/business/bulk
  - POST /contacts/business/bulk
- GET /locations
  - GET /locations
- DELETE /calendars/events/appointments/{}
  - DELETE /calendars/events/appointments/{eventId}
- GET /locations/timezones
  - GET /locations/timezones
- GET /social-media-posting/oauth/{}/start
  - GET /social-media-posting/oauth/{platform}/start
- GET /calendars/groups/slug/validate
  - GET /calendars/groups/slug/validate
- GET /locations/{}/surveys/submissions
  - GET /locations/{locationId}/surveys/submissions
