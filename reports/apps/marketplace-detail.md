# marketplace — Detailed QA

Version hints present in spec: 2021-07-28

## Param-name-only Differences
- None

## Missing Endpoints
- POST /marketplace/billing/charges
  - summary: Create a new wallet charge
  - recommended: implement client method for this endpoint
- GET /marketplace/billing/charges
  - summary: Get all wallet charges
  - recommended: implement client method for this endpoint
- DELETE /marketplace/billing/charges/{chargeId}
  - summary: Delete a wallet charge
  - recommended: implement client method for this endpoint
- GET /marketplace/billing/charges/{chargeId}
  - summary: Get specific wallet charge details
  - recommended: implement client method for this endpoint
- GET /marketplace/billing/charges/has-funds
  - summary: Check if account has sufficient funds
  - recommended: implement client method for this endpoint
- DELETE /marketplace/app/{appId}/installations (Version: 2021-07-28)
  - summary: Uninstall an application
  - recommended: implement client method for this endpoint
- GET /marketplace/app/{appId}/installations
  - summary: Get Installer Details
  - recommended: implement client method for this endpoint
