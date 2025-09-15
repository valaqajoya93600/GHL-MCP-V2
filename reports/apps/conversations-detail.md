# conversations — Detailed QA

Version hints present in spec: 2021-04-15

## Param-name-only Differences
- GET /conversations/messages/email/{id}
  - summary: Get email by Id
  - client candidates: GET /conversations/messages/email/{emailMessageId}
  - recommended: update client path to '/conversations/messages/email/{id}' to match spec
- GET /conversations/messages/{id} (Version: 2021-04-15)
  - summary: Get message by message id
  - client candidates: GET /conversations/messages/{messageId}
  - recommended: update client path to '/conversations/messages/{id}' to match spec
- GET /conversations/messages/{messageId}/locations/{locationId}/recording (Version: 2021-04-15)
  - summary: Get Recording by Message ID
  - client candidates: GET /conversations/messages/{messageId}/locations/{locId}/recording
  - recommended: update client path to '/conversations/messages/{messageId}/locations/{locationId}/recording' to match spec
- GET /conversations/locations/{locationId}/messages/{messageId}/transcription (Version: 2021-04-15)
  - summary: Get transcription by Message ID
  - client candidates: GET /conversations/locations/{locId}/messages/{messageId}/transcription
  - recommended: update client path to '/conversations/locations/{locationId}/messages/{messageId}/transcription' to match spec
- GET /conversations/locations/{locationId}/messages/{messageId}/transcription/download (Version: 2021-04-15)
  - summary: Download transcription by Message ID
  - client candidates: GET /conversations/locations/{locId}/messages/{messageId}/transcription/download
  - recommended: update client path to '/conversations/locations/{locationId}/messages/{messageId}/transcription/download' to match spec

## Missing Endpoints
- None
