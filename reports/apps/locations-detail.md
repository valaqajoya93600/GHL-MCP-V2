# locations — Detailed QA

Version hints present in spec: 2021-07-28

## Param-name-only Differences
- GET /locations/{locationId}/customFields/{id} (Version: 2021-07-28)
  - summary: Get Custom Field
  - client candidates: GET /locations/{locationId}/customFields/{customFieldId}
  - recommended: update client path to '/locations/{locationId}/customFields/{id}' to match spec
- PUT /locations/{locationId}/customFields/{id} (Version: 2021-07-28)
  - summary: Update Custom Field
  - client candidates: PUT /locations/{locationId}/customFields/{customFieldId}
  - recommended: update client path to '/locations/{locationId}/customFields/{id}' to match spec
- DELETE /locations/{locationId}/customFields/{id} (Version: 2021-07-28)
  - summary: Delete Custom Field
  - client candidates: DELETE /locations/{locationId}/customFields/{customFieldId}
  - recommended: update client path to '/locations/{locationId}/customFields/{id}' to match spec
- GET /locations/{locationId}/customValues/{id} (Version: 2021-07-28)
  - summary: Get Custom Value
  - client candidates: GET /locations/{locationId}/customValues/{customValueId}
  - recommended: update client path to '/locations/{locationId}/customValues/{id}' to match spec
- PUT /locations/{locationId}/customValues/{id} (Version: 2021-07-28)
  - summary: Update Custom Value
  - client candidates: PUT /locations/{locationId}/customValues/{customValueId}
  - recommended: update client path to '/locations/{locationId}/customValues/{id}' to match spec
- DELETE /locations/{locationId}/customValues/{id} (Version: 2021-07-28)
  - summary: Delete Custom Value
  - client candidates: DELETE /locations/{locationId}/customValues/{customValueId}
  - recommended: update client path to '/locations/{locationId}/customValues/{id}' to match spec
- DELETE /locations/{locationId}/templates/{id} (Version: 2021-07-28)
  - summary: DELETE an email/sms template
  - client candidates: DELETE /locations/{locationId}/templates/{templateId}
  - recommended: update client path to '/locations/{locationId}/templates/{id}' to match spec

## Missing Endpoints
- GET /locations/{locationId}/recurring-tasks/{id} (Version: 2021-07-28)
  - summary: Get Recurring Task By Id
  - recommended: implement client method for this endpoint
- PUT /locations/{locationId}/recurring-tasks/{id} (Version: 2021-07-28)
  - summary: Update Recurring Task
  - recommended: implement client method for this endpoint
- DELETE /locations/{locationId}/recurring-tasks/{id} (Version: 2021-07-28)
  - summary: Delete Recurring Task
  - recommended: implement client method for this endpoint
- POST /locations/{locationId}/recurring-tasks (Version: 2021-07-28)
  - summary: Create Recurring Task
  - recommended: implement client method for this endpoint
- GET /locations/{locationId}/timezones (Version: 2021-07-28)
  - summary: Fetch Timezones
  - recommended: implement client method for this endpoint
