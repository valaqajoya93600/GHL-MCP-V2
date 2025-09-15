# custom-fields — Detailed QA

Version hints present in spec: 2021-07-28

## Param-name-only Differences
- GET /custom-fields/object-key/{objectKey} (Version: 2021-07-28)
  - summary: Get Custom Fields By Object Key
  - client candidates: GET /custom-fields/object-key/{params.objectKey}
  - recommended: update client path to '/custom-fields/object-key/{objectKey}' to match spec
- DELETE /custom-fields/folder/{id} (Version: 2021-07-28)
  - summary: Delete Custom Field Folder
  - client candidates: DELETE /custom-fields/folder/{params.id}
  - recommended: update client path to '/custom-fields/folder/{id}' to match spec

## Missing Endpoints
- None
