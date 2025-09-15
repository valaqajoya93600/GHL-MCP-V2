# contacts — Detailed QA

Version hints present in spec: 2021-07-28

## Param-name-only Differences
- GET /contacts/{contactId}/notes/{id} (Version: 2021-07-28)
  - summary: Get Note
  - client candidates: GET /contacts/{contactId}/notes/{noteId}
  - recommended: update client path to '/contacts/{contactId}/notes/{id}' to match spec
- PUT /contacts/{contactId}/notes/{id} (Version: 2021-07-28)
  - summary: Update Note
  - client candidates: PUT /contacts/{contactId}/notes/{noteId}
  - recommended: update client path to '/contacts/{contactId}/notes/{id}' to match spec
- DELETE /contacts/{contactId}/notes/{id} (Version: 2021-07-28)
  - summary: Delete Note
  - client candidates: DELETE /contacts/{contactId}/notes/{noteId}
  - recommended: update client path to '/contacts/{contactId}/notes/{id}' to match spec

## Missing Endpoints
- POST /contacts/bulk/tags/update/{type} (Version: 2021-07-28)
  - summary: Update Contacts Tags
  - recommended: implement client method for this endpoint
- POST /contacts/bulk/business (Version: 2021-07-28)
  - summary: Add/Remove Contacts From Business
  - recommended: implement client method for this endpoint
- DELETE /contacts/{contactId}/campaigns/removeAll (Version: 2021-07-28)
  - summary: Remove Contact From Every Campaign
  - recommended: implement client method for this endpoint
- GET /contacts (Version: 2021-07-28)
  - summary: Get Contacts
  - recommended: implement client method for this endpoint
