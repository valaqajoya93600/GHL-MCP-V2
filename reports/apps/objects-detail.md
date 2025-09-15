# objects — Detailed QA

Version hints present in spec: 2021-07-28

## Param-name-only Differences
- GET /objects/{key} (Version: 2021-07-28)
  - summary: Get Object Schema by key / id
  - client candidates: GET /objects/{params.key}
  - recommended: update client path to '/objects/{key}' to match spec
- GET /objects/{schemaKey}/records/{id} (Version: 2021-07-28)
  - summary: Get Record By Id
  - client candidates: GET /objects/{schemaKey}/records/{recordId}
  - recommended: update client path to '/objects/{schemaKey}/records/{id}' to match spec
- PUT /objects/{schemaKey}/records/{id} (Version: 2021-07-28)
  - summary: Update Record
  - client candidates: PUT /objects/{schemaKey}/records/{recordId}
  - recommended: update client path to '/objects/{schemaKey}/records/{id}' to match spec
- DELETE /objects/{schemaKey}/records/{id} (Version: 2021-07-28)
  - summary: Delete Record
  - client candidates: DELETE /objects/{schemaKey}/records/{recordId}
  - recommended: update client path to '/objects/{schemaKey}/records/{id}' to match spec

## Missing Endpoints
- None
