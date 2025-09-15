# medias — Detailed QA

Version hints present in spec: 2021-07-28

## Param-name-only Differences
- DELETE /medias/{id} (Version: 2021-07-28)
  - summary: Delete File or Folder
  - client candidates: DELETE /medias/{deleteParams.id}
  - recommended: update client path to '/medias/{id}' to match spec

## Missing Endpoints
- POST /medias/{id} (Version: 2021-07-28)
  - summary: Update File/ Folder
  - recommended: implement client method for this endpoint
- POST /medias/folder (Version: 2021-07-28)
  - summary: Create Folder
  - recommended: implement client method for this endpoint
- PUT /medias/update-files (Version: 2021-07-28)
  - summary: Bulk Update Files/ Folders
  - recommended: implement client method for this endpoint
- PUT /medias/delete-files (Version: 2021-07-28)
  - summary: Bulk Delete / Trash Files or Folders
  - recommended: implement client method for this endpoint
