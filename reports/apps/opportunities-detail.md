# opportunities — Detailed QA

Version hints present in spec: 2021-07-28

## Param-name-only Differences
- GET /opportunities/{id} (Version: 2021-07-28)
  - summary: Get Opportunity
  - client candidates: GET /opportunities/{opportunityId}
  - recommended: update client path to '/opportunities/{id}' to match spec
- DELETE /opportunities/{id} (Version: 2021-07-28)
  - summary: Delete Opportunity
  - client candidates: DELETE /opportunities/{opportunityId}
  - recommended: update client path to '/opportunities/{id}' to match spec
- PUT /opportunities/{id} (Version: 2021-07-28)
  - summary: Update Opportunity
  - client candidates: PUT /opportunities/{opportunityId}
  - recommended: update client path to '/opportunities/{id}' to match spec
- PUT /opportunities/{id}/status (Version: 2021-07-28)
  - summary: Update Opportunity Status
  - client candidates: PUT /opportunities/{opportunityId}/status
  - recommended: update client path to '/opportunities/{id}/status' to match spec
- POST /opportunities/{id}/followers (Version: 2021-07-28)
  - summary: Add Followers
  - client candidates: POST /opportunities/{opportunityId}/followers
  - recommended: update client path to '/opportunities/{id}/followers' to match spec
- DELETE /opportunities/{id}/followers (Version: 2021-07-28)
  - summary: Remove Followers
  - client candidates: DELETE /opportunities/{opportunityId}/followers
  - recommended: update client path to '/opportunities/{id}/followers' to match spec

## Missing Endpoints
- None
