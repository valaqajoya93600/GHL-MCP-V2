# oauth — Detailed QA

Version hints present in spec: 2021-07-28

## Param-name-only Differences
- None

## Missing Endpoints
- POST /oauth/token
  - summary: Get Access Token
  - recommended: implement client method for this endpoint
- POST /oauth/locationToken (Version: 2021-07-28)
  - summary: Get Location Access Token from Agency Token
  - recommended: implement client method for this endpoint
- GET /oauth/installedLocations (Version: 2021-07-28)
  - summary: Get Location where app is installed
  - recommended: implement client method for this endpoint
