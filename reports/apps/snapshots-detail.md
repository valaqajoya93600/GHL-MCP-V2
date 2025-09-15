# snapshots — Detailed QA

Version hints present in spec: 2021-07-28

## Param-name-only Differences
- None

## Missing Endpoints
- GET /snapshots (Version: 2021-07-28)
  - summary: Get Snapshots
  - recommended: implement client method for this endpoint
- POST /snapshots/share/link (Version: 2021-07-28)
  - summary: Create Snapshot Share Link
  - recommended: implement client method for this endpoint
- GET /snapshots/snapshot-status/{snapshotId} (Version: 2021-07-28)
  - summary: Get Snapshot Push between Dates
  - recommended: implement client method for this endpoint
- GET /snapshots/snapshot-status/{snapshotId}/location/{locationId} (Version: 2021-07-28)
  - summary: Get Last Snapshot Push
  - recommended: implement client method for this endpoint
