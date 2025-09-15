# GHL Endpoint Gap Report

Generated: 2025-09-13T21:11:47.389Z

## Summary
- Spec endpoints: 409
- Client endpoints: 284
- In client only: 60
- In spec only: 185

## In Client Only

### /associations
- DELETE /associations/relations/{params.relationId}
- GET /associations/key/{params.keyName}
- GET /associations/objectKey/{params.objectKey}
- GET /associations/relations/{params.recordId}

### /calendars
- DELETE /calendars/events/appointments/{appointmentId}
- DELETE /calendars/events/appointments/{appointmentId}/notes/{noteId}
- DELETE /calendars/resources/{resourceType}/{resourceId}
- GET /calendars/events/appointments/{appointmentId}
- GET /calendars/events/appointments/{appointmentId}/notes
- GET /calendars/groups/slug/validate
- GET /calendars/resources/{resourceType}/{resourceId}
- GET /calendars/{slotParams.calendarId}/free-slots
- POST /calendars/blocked-slots
- POST /calendars/events/appointments/{appointmentId}/notes
- POST /calendars/groups/{groupId}/status
- PUT /calendars/events/appointments/{appointmentId}
- PUT /calendars/events/appointments/{appointmentId}/notes/{noteId}
- PUT /calendars/events/block-slots/{blockSlotId}
- PUT /calendars/resources/{resourceType}/{resourceId}

### /contacts
- DELETE /contacts/{contactId}/campaigns
- DELETE /contacts/{contactId}/notes/{noteId}
- GET /contacts/{contactId}/notes/{noteId}
- POST /contacts/business/bulk
- POST /contacts/tags/bulk
- PUT /contacts/{contactId}/notes/{noteId}

### /conversations
- GET /conversations/locations/{locId}/messages/{messageId}/transcription
- GET /conversations/locations/{locId}/messages/{messageId}/transcription/download
- GET /conversations/messages/email/{emailMessageId}
- GET /conversations/messages/{messageId}
- GET /conversations/messages/{messageId}/locations/{locId}/recording

### /custom-fields
- DELETE /custom-fields/folder/{params.id}
- GET /custom-fields/object-key/{params.objectKey}

### /emails
- DELETE /emails/builder/{this.config.locationId}/{templateId}

### /locations
- DELETE /locations/{locationId}/customFields/{customFieldId}
- DELETE /locations/{locationId}/customValues/{customValueId}
- DELETE /locations/{locationId}/templates/{templateId}
- GET /locations
- GET /locations/{locationId}/customFields/{customFieldId}
- GET /locations/{locationId}/customValues/{customValueId}
- GET /locations/{locationId}/surveys/submissions
- PUT /locations/{locationId}/customFields/{customFieldId}
- PUT /locations/{locationId}/customValues/{customValueId}

### /medias
- DELETE /medias/{deleteParams.id}

### /objects
- DELETE /objects/{schemaKey}/records/{recordId}
- GET /objects/{params.key}
- GET /objects/{schemaKey}/records/{recordId}
- PUT /objects/{schemaKey}/records/{recordId}

### /opportunities
- DELETE /opportunities/{opportunityId}
- DELETE /opportunities/{opportunityId}/followers
- GET /opportunities/{opportunityId}
- POST /opportunities/{opportunityId}/followers
- PUT /opportunities/{opportunityId}
- PUT /opportunities/{opportunityId}/status

### /social-media-posting
- DELETE /social-media-posting/{locationId}/accounts/{accountId}
- DELETE /social-media-posting/{locationId}/csv/{csvId}
- DELETE /social-media-posting/{locationId}/posts/{postId}
- GET /social-media-posting/{locationId}/csv/{csvId}
- GET /social-media-posting/{locationId}/posts/{postId}
- PATCH /social-media-posting/{locationId}/csv/{csvId}
- PUT /social-media-posting/{locationId}/posts/{postId}

## In Spec Only

### /associations
- DELETE /associations/relations/{relationId} (Version: 2021-07-28)
- GET /associations/key/{key_name} (Version: 2021-07-28)
- GET /associations/objectKey/{objectKey} (Version: 2021-07-28)
- GET /associations/relations/{recordId} (Version: 2021-07-28)

### /businesses
- DELETE /businesses/{businessId} (Version: 2021-07-28)
- GET /businesses (Version: 2021-07-28)
- GET /businesses/{businessId} (Version: 2021-07-28)
- POST /businesses (Version: 2021-07-28)
- PUT /businesses/{businessId} (Version: 2021-07-28)

### /calendars
- DELETE /calendars/appointments/{appointmentId}/notes/{noteId} (Version: 2021-04-15)
- DELETE /calendars/events/{eventId} (Version: 2021-04-15)
- DELETE /calendars/resources/{resourceType}/{id} (Version: 2021-04-15)
- GET /calendars/appointments/{appointmentId}/notes (Version: 2021-04-15)
- GET /calendars/events/appointments/{eventId} (Version: 2021-04-15)
- GET /calendars/resources/{resourceType}/{id} (Version: 2021-04-15)
- GET /calendars/{calendarId}/free-slots (Version: 2021-04-15)
- POST /calendars/appointments/{appointmentId}/notes (Version: 2021-04-15)
- POST /calendars/events/block-slots (Version: 2021-04-15)
- POST /calendars/groups/validate-slug (Version: 2021-04-15)
- PUT /calendars/appointments/{appointmentId}/notes/{noteId} (Version: 2021-04-15)
- PUT /calendars/events/appointments/{eventId} (Version: 2021-04-15)
- PUT /calendars/events/block-slots/{eventId} (Version: 2021-04-15)
- PUT /calendars/groups/{groupId}/status (Version: 2021-04-15)
- PUT /calendars/resources/{resourceType}/{id} (Version: 2021-04-15)

### /campaigns
- GET /campaigns (Version: 2021-07-28)

### /companies
- GET /companies/{companyId} (Version: 2021-07-28)

### /contacts
- DELETE /contacts/{contactId}/campaigns/removeAll (Version: 2021-07-28)
- DELETE /contacts/{contactId}/notes/{id} (Version: 2021-07-28)
- GET /contacts (Version: 2021-07-28)
- GET /contacts/{contactId}/notes/{id} (Version: 2021-07-28)
- POST /contacts/bulk/business (Version: 2021-07-28)
- POST /contacts/bulk/tags/update/{type} (Version: 2021-07-28)
- PUT /contacts/{contactId}/notes/{id} (Version: 2021-07-28)

### /conversations
- GET /conversations/locations/{locationId}/messages/{messageId}/transcription (Version: 2021-04-15)
- GET /conversations/locations/{locationId}/messages/{messageId}/transcription/download (Version: 2021-04-15)
- GET /conversations/messages/email/{id}
- GET /conversations/messages/{id} (Version: 2021-04-15)
- GET /conversations/messages/{messageId}/locations/{locationId}/recording (Version: 2021-04-15)

### /courses
- POST /courses/courses-exporter/public/import (Version: 2021-07-28)

### /custom-fields
- DELETE /custom-fields/folder/{id} (Version: 2021-07-28)
- GET /custom-fields/object-key/{objectKey} (Version: 2021-07-28)

### /custom-menus
- DELETE /custom-menus/{customMenuId} (Version: 2021-07-28)
- GET /custom-menus (Version: 2021-07-28)
- GET /custom-menus/{customMenuId} (Version: 2021-07-28)
- POST /custom-menus (Version: 2021-07-28)
- PUT /custom-menus/{customMenuId} (Version: 2021-07-28)

### /emails
- DELETE /emails/builder/{locationId}/{templateId} (Version: 2021-07-28)

### /forms
- GET /forms (Version: 2021-07-28)
- GET /forms/submissions (Version: 2021-07-28)
- POST /forms/upload-custom-files (Version: 2021-07-28)

### /funnels
- DELETE /funnels/lookup/redirect/{id} (Version: 2021-07-28)
- GET /funnels/funnel/list
- GET /funnels/lookup/redirect/list (Version: 2021-07-28)
- GET /funnels/page
- GET /funnels/page/count
- PATCH /funnels/lookup/redirect/{id} (Version: 2021-07-28)
- POST /funnels/lookup/redirect (Version: 2021-07-28)

### /links
- DELETE /links/{linkId} (Version: 2021-07-28)
- GET /links (Version: 2021-07-28)
- GET /links/id/{linkId} (Version: 2021-07-28)
- GET /links/search (Version: 2021-04-15)
- POST /links (Version: 2021-07-28)
- PUT /links/{linkId} (Version: 2021-07-28)

### /locations
- DELETE /locations/{locationId}/customFields/{id} (Version: 2021-07-28)
- DELETE /locations/{locationId}/customValues/{id} (Version: 2021-07-28)
- DELETE /locations/{locationId}/recurring-tasks/{id} (Version: 2021-07-28)
- DELETE /locations/{locationId}/templates/{id} (Version: 2021-07-28)
- GET /locations/{locationId}/customFields/{id} (Version: 2021-07-28)
- GET /locations/{locationId}/customValues/{id} (Version: 2021-07-28)
- GET /locations/{locationId}/recurring-tasks/{id} (Version: 2021-07-28)
- GET /locations/{locationId}/timezones (Version: 2021-07-28)
- POST /locations/{locationId}/recurring-tasks (Version: 2021-07-28)
- PUT /locations/{locationId}/customFields/{id} (Version: 2021-07-28)
- PUT /locations/{locationId}/customValues/{id} (Version: 2021-07-28)
- PUT /locations/{locationId}/recurring-tasks/{id} (Version: 2021-07-28)

### /marketplace
- DELETE /marketplace/app/{appId}/installations (Version: 2021-07-28)
- DELETE /marketplace/billing/charges/{chargeId}
- GET /marketplace/app/{appId}/installations
- GET /marketplace/billing/charges
- GET /marketplace/billing/charges/has-funds
- GET /marketplace/billing/charges/{chargeId}
- POST /marketplace/billing/charges

### /medias
- DELETE /medias/{id} (Version: 2021-07-28)
- POST /medias/folder (Version: 2021-07-28)
- POST /medias/{id} (Version: 2021-07-28)
- PUT /medias/delete-files (Version: 2021-07-28)
- PUT /medias/update-files (Version: 2021-07-28)

### /oauth
- GET /oauth/installedLocations (Version: 2021-07-28)
- POST /oauth/locationToken (Version: 2021-07-28)
- POST /oauth/token

### /objects
- DELETE /objects/{schemaKey}/records/{id} (Version: 2021-07-28)
- GET /objects/{key} (Version: 2021-07-28)
- GET /objects/{schemaKey}/records/{id} (Version: 2021-07-28)
- PUT /objects/{schemaKey}/records/{id} (Version: 2021-07-28)

### /opportunities
- DELETE /opportunities/{id} (Version: 2021-07-28)
- DELETE /opportunities/{id}/followers (Version: 2021-07-28)
- GET /opportunities/{id} (Version: 2021-07-28)
- POST /opportunities/{id}/followers (Version: 2021-07-28)
- PUT /opportunities/{id} (Version: 2021-07-28)
- PUT /opportunities/{id}/status (Version: 2021-07-28)

### /phone-system
- GET /phone-system/number-pools (Version: 2021-07-28)
- GET /phone-system/numbers/location/{locationId} (Version: 2021-07-28)

### /products
- POST /products/bulk-update/edit (Version: 2021-07-28)
- POST /products/store/{storeId}/priority (Version: 2021-07-28)

### /proposals
- GET /proposals/document (Version: 2021-07-28)
- GET /proposals/templates (Version: 2021-07-28)
- POST /proposals/document/send (Version: 2021-07-28)
- POST /proposals/templates/send (Version: 2021-07-28)

### /saas
- GET /saas/agency-plans/{companyId} (Version: 2021-04-15)
- GET /saas/get-saas-subscription/{locationId} (Version: 2021-04-15)
- GET /saas/locations (Version: 2021-04-15)
- GET /saas/saas-locations/{companyId} (Version: 2021-04-15)
- GET /saas/saas-plan/{planId} (Version: 2021-04-15)
- POST /saas/bulk-disable-saas/{companyId} (Version: 2021-04-15)
- POST /saas/bulk-enable-saas/{companyId} (Version: 2021-04-15)
- POST /saas/enable-saas/{locationId} (Version: 2021-04-15)
- POST /saas/pause/{locationId} (Version: 2021-04-15)
- POST /saas/update-rebilling/{companyId} (Version: 2021-04-15)
- PUT /saas/update-saas-subscription/{locationId} (Version: 2021-04-15)

### /saas-api
- GET /saas-api/public-api/agency-plans/{companyId} (Version: 2021-04-15)
- GET /saas-api/public-api/get-saas-subscription/{locationId} (Version: 2021-04-15)
- GET /saas-api/public-api/locations (Version: 2021-04-15)
- GET /saas-api/public-api/saas-locations/{companyId} (Version: 2021-04-15)
- GET /saas-api/public-api/saas-plan/{planId} (Version: 2021-04-15)
- POST /saas-api/public-api/bulk-disable-saas/{companyId} (Version: 2021-04-15)
- POST /saas-api/public-api/bulk-enable-saas/{companyId} (Version: 2021-04-15)
- POST /saas-api/public-api/enable-saas/{locationId} (Version: 2021-04-15)
- POST /saas-api/public-api/pause/{locationId} (Version: 2021-04-15)
- POST /saas-api/public-api/update-rebilling/{companyId} (Version: 2021-04-15)
- PUT /saas-api/public-api/update-saas-subscription/{locationId} (Version: 2021-04-15)

### /snapshots
- GET /snapshots (Version: 2021-07-28)
- GET /snapshots/snapshot-status/{snapshotId} (Version: 2021-07-28)
- GET /snapshots/snapshot-status/{snapshotId}/location/{locationId} (Version: 2021-07-28)
- POST /snapshots/share/link (Version: 2021-07-28)

### /social-media-posting
- DELETE /social-media-posting/{locationId}/accounts/{id} (Version: 2021-07-28)
- DELETE /social-media-posting/{locationId}/csv/{id} (Version: 2021-07-28)
- DELETE /social-media-posting/{locationId}/posts/{id} (Version: 2021-07-28)
- GET /social-media-posting/oauth/facebook/start (Version: 2021-07-28)
- GET /social-media-posting/oauth/google/start (Version: 2021-07-28)
- GET /social-media-posting/oauth/instagram/start (Version: 2021-07-28)
- GET /social-media-posting/oauth/linkedin/start (Version: 2021-07-28)
- GET /social-media-posting/oauth/tiktok-business/start (Version: 2021-07-28)
- GET /social-media-posting/oauth/tiktok/start (Version: 2021-07-28)
- GET /social-media-posting/oauth/twitter/start (Version: 2021-07-28)
- GET /social-media-posting/oauth/{locationId}/facebook/accounts/{accountId} (Version: 2021-07-28)
- GET /social-media-posting/oauth/{locationId}/google/locations/{accountId} (Version: 2021-07-28)
- GET /social-media-posting/oauth/{locationId}/instagram/accounts/{accountId} (Version: 2021-07-28)
- GET /social-media-posting/oauth/{locationId}/linkedin/accounts/{accountId} (Version: 2021-07-28)
- GET /social-media-posting/oauth/{locationId}/tiktok-business/accounts/{accountId} (Version: 2021-07-28)
- GET /social-media-posting/oauth/{locationId}/tiktok/accounts/{accountId} (Version: 2021-07-28)
- GET /social-media-posting/oauth/{locationId}/twitter/accounts/{accountId} (Version: 2021-07-28)
- GET /social-media-posting/{locationId}/categories (Version: 2021-07-28)
- GET /social-media-posting/{locationId}/categories/{id} (Version: 2021-07-28)
- GET /social-media-posting/{locationId}/csv/{id} (Version: 2021-07-28)
- GET /social-media-posting/{locationId}/posts/{id} (Version: 2021-07-28)
- GET /social-media-posting/{locationId}/tags (Version: 2021-07-28)
- PATCH /social-media-posting/{locationId}/csv/{id} (Version: 2021-07-28)
- POST /social-media-posting/oauth/{locationId}/facebook/accounts/{accountId} (Version: 2021-07-28)
- POST /social-media-posting/oauth/{locationId}/google/locations/{accountId} (Version: 2021-07-28)
- POST /social-media-posting/oauth/{locationId}/instagram/accounts/{accountId} (Version: 2021-07-28)
- POST /social-media-posting/oauth/{locationId}/linkedin/accounts/{accountId} (Version: 2021-07-28)
- POST /social-media-posting/oauth/{locationId}/tiktok/accounts/{accountId} (Version: 2021-07-28)
- POST /social-media-posting/oauth/{locationId}/twitter/accounts/{accountId} (Version: 2021-07-28)
- POST /social-media-posting/statistics (Version: 2021-07-28)
- POST /social-media-posting/{locationId}/tags/details (Version: 2021-07-28)
- PUT /social-media-posting/{locationId}/posts/{id} (Version: 2021-07-28)

### /surveys
- GET /surveys/submissions (Version: 2021-07-28)

### /users
- DELETE /users/{userId} (Version: 2021-07-28)
- GET /users (Version: 2021-07-28)
- GET /users/search (Version: 2021-07-28)
- GET /users/{userId} (Version: 2021-07-28)
- POST /users (Version: 2021-07-28)
- POST /users/search/filter-by-email (Version: 2021-07-28)
- PUT /users/{userId} (Version: 2021-07-28)

### /voice-ai
- DELETE /voice-ai/actions/{actionId} (Version: 2021-04-15)
- DELETE /voice-ai/agents/{agentId} (Version: 2021-04-15)
- GET /voice-ai/actions/{actionId} (Version: 2021-04-15)
- GET /voice-ai/agents (Version: 2021-04-15)
- GET /voice-ai/agents/{agentId} (Version: 2021-04-15)
- GET /voice-ai/dashboard/call-logs (Version: 2021-04-15)
- GET /voice-ai/dashboard/call-logs/{callId} (Version: 2021-04-15)
- PATCH /voice-ai/agents/{agentId} (Version: 2021-04-15)
- POST /voice-ai/actions (Version: 2021-04-15)
- POST /voice-ai/agents (Version: 2021-04-15)
- PUT /voice-ai/actions/{actionId} (Version: 2021-04-15)
