# funnels — Detailed QA

Version hints present in spec: 2021-07-28

## Param-name-only Differences
- None

## Missing Endpoints
- POST /funnels/lookup/redirect (Version: 2021-07-28)
  - summary: Create Redirect
  - recommended: implement client method for this endpoint
- PATCH /funnels/lookup/redirect/{id} (Version: 2021-07-28)
  - summary: Update Redirect By Id
  - recommended: implement client method for this endpoint
- DELETE /funnels/lookup/redirect/{id} (Version: 2021-07-28)
  - summary: Delete Redirect By Id
  - recommended: implement client method for this endpoint
- GET /funnels/lookup/redirect/list (Version: 2021-07-28)
  - summary: Fetch List of Redirects
  - recommended: implement client method for this endpoint
- GET /funnels/funnel/list
  - summary: Fetch List of Funnels
  - recommended: implement client method for this endpoint
- GET /funnels/page
  - summary: Fetch list of funnel pages
  - recommended: implement client method for this endpoint
- GET /funnels/page/count
  - summary: Fetch count of funnel pages
  - recommended: implement client method for this endpoint
