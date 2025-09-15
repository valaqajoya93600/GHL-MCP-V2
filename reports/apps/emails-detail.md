# emails — Detailed QA

Version hints present in spec: 2021-07-28

## Param-name-only Differences
- DELETE /emails/builder/{locationId}/{templateId} (Version: 2021-07-28)
  - summary: Delete a template
  - client candidates: DELETE /emails/builder/{this.config.locationId}/{templateId}
  - recommended: update client path to '/emails/builder/{locationId}/{templateId}' to match spec

## Missing Endpoints
- None
