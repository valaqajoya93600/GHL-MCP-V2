# Error Handling Guide

Use error messages to adjust inputs and retry. Common cases:

- 400 Bad Request / 422 Unprocessable Entity
  - Missing/invalid required fields or wrong enum value.
  - Example: Media list requires a non-empty `type` → pass `"type": "file"` or `"folder"`.

- 401 Unauthorized
  - Server credentials missing/invalid. Surface error and stop; user must fix environment.

- 404 Not Found
  - The ID doesn’t exist or isn’t in scope. Re-list the resource and pick a valid ID.

- 429 Too Many Requests
  - Back off and retry after delay.

- Network / Timeout
  - Retry idempotent reads; never duplicate non-idempotent writes without confirmation.

## Recovery Pattern
1) Read the error message and code.
2) Validate required inputs (IDs, enums, formats).
3) Fetch missing IDs via list/search tools.
4) Retry with corrected arguments.
