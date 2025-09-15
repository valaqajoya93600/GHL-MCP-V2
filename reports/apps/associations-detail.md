# associations — Detailed QA

Version hints present in spec: 2021-07-28

## Param-name-only Differences
- GET /associations/relations/{recordId} (Version: 2021-07-28)
  - summary: Get all relations By record Id
  - client candidates: GET /associations/relations/{params.recordId}
  - recommended: update client path to '/associations/relations/{recordId}' to match spec
- DELETE /associations/relations/{relationId} (Version: 2021-07-28)
  - summary: Delete Relation
  - client candidates: DELETE /associations/relations/{params.relationId}
  - recommended: update client path to '/associations/relations/{relationId}' to match spec
- GET /associations/key/{key_name} (Version: 2021-07-28)
  - summary: Get association key by key name
  - client candidates: GET /associations/key/{params.keyName}
  - recommended: update client path to '/associations/key/{key_name}' to match spec
- GET /associations/objectKey/{objectKey} (Version: 2021-07-28)
  - summary: Get association by object keys
  - client candidates: GET /associations/objectKey/{params.objectKey}
  - recommended: update client path to '/associations/objectKey/{objectKey}' to match spec

## Missing Endpoints
- None
