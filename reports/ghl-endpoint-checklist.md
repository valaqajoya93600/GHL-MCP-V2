# GHL Endpoint QA Checklist

Legend: [x] verified | [ ] not verified.

Instructions:
- Update status in `reports\ghl-endpoints-progress.json` (todo|verified|needs-fix|skipped) and re-run this script.
- “Implemented” indicates presence in local client, not QA status.

## associations
- [x] GET /associations (Version: 2021-07-28) — implemented: yes
- [x] POST /associations (Version: 2021-07-28) — implemented: yes
- [x] DELETE /associations/{associationId} (Version: 2021-07-28) — implemented: yes
- [x] GET /associations/{associationId} (Version: 2021-07-28) — implemented: yes
- [x] PUT /associations/{associationId} (Version: 2021-07-28) — implemented: yes
- [x] GET /associations/key/{key_name} (Version: 2021-07-28) — implemented: yes
- [x] GET /associations/objectKey/{objectKey} (Version: 2021-07-28) — implemented: yes
- [x] POST /associations/relations (Version: 2021-07-28) — implemented: yes
- [x] GET /associations/relations/{recordId} (Version: 2021-07-28) — implemented: yes
- [x] DELETE /associations/relations/{relationId} (Version: 2021-07-28) — implemented: yes

## blogs
- [x] GET /blogs/authors (Version: 2021-07-28) — implemented: yes
- [x] GET /blogs/categories (Version: 2021-07-28) — implemented: yes
- [x] POST /blogs/posts (Version: 2021-07-28) — implemented: yes
- [x] PUT /blogs/posts/{postId} (Version: 2021-07-28) — implemented: yes
- [x] GET /blogs/posts/all (Version: 2021-07-28) — implemented: yes
- [x] GET /blogs/posts/url-slug-exists (Version: 2021-07-28) — implemented: yes
- [x] GET /blogs/site/all (Version: 2021-07-28) — implemented: yes

## businesses
- [ ] GET /businesses (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /businesses (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] DELETE /businesses/{businessId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /businesses/{businessId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] PUT /businesses/{businessId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)

## calendars
- [x] GET /calendars (Version: 2021-04-15) — implemented: yes
- [x] POST /calendars (Version: 2021-04-15) — implemented: yes
- [x] DELETE /calendars/{calendarId} (Version: 2021-04-15) — implemented: yes
- [x] GET /calendars/{calendarId} (Version: 2021-04-15) — implemented: yes
- [x] PUT /calendars/{calendarId} (Version: 2021-04-15) — implemented: yes
- [x] GET /calendars/{calendarId}/free-slots (Version: 2021-04-15) — implemented: yes
- [x] GET /calendars/{calendarId}/notifications (Version: 2021-04-15) — implemented: yes
- [x] POST /calendars/{calendarId}/notifications (Version: 2021-04-15) — implemented: yes
- [x] DELETE /calendars/{calendarId}/notifications/{notificationId} (Version: 2021-04-15) — implemented: yes
- [x] GET /calendars/{calendarId}/notifications/{notificationId} (Version: 2021-04-15) — implemented: yes
- [x] PUT /calendars/{calendarId}/notifications/{notificationId} (Version: 2021-04-15) — implemented: yes
- [ ] GET /calendars/appointments/{appointmentId}/notes (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /calendars/appointments/{appointmentId}/notes (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] DELETE /calendars/appointments/{appointmentId}/notes/{noteId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] PUT /calendars/appointments/{appointmentId}/notes/{noteId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [x] GET /calendars/blocked-slots (Version: 2021-04-15) — implemented: yes
- [x] GET /calendars/events (Version: 2021-04-15) — implemented: yes
- [ ] DELETE /calendars/events/{eventId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [x] POST /calendars/events/appointments (Version: 2021-04-15) — implemented: yes
- [x] GET /calendars/events/appointments/{eventId} (Version: 2021-04-15) — implemented: yes
- [x] PUT /calendars/events/appointments/{eventId} (Version: 2021-04-15) — implemented: yes
- [x] POST /calendars/events/block-slots (Version: 2021-04-15) — implemented: yes
- [x] PUT /calendars/events/block-slots/{eventId} (Version: 2021-04-15) — implemented: yes
- [x] GET /calendars/groups (Version: 2021-04-15) — implemented: yes
- [x] POST /calendars/groups (Version: 2021-04-15) — implemented: yes
- [x] DELETE /calendars/groups/{groupId} (Version: 2021-04-15) — implemented: yes
- [x] PUT /calendars/groups/{groupId} (Version: 2021-04-15) — implemented: yes
- [ ] PUT /calendars/groups/{groupId}/status (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [x] POST /calendars/groups/validate-slug (Version: 2021-04-15) — implemented: yes
- [x] GET /calendars/resources/{resourceType} (Version: 2021-04-15) — implemented: yes
- [x] POST /calendars/resources/{resourceType} (Version: 2021-04-15) — implemented: yes
- [x] DELETE /calendars/resources/{resourceType}/{id} (Version: 2021-04-15) — implemented: yes
- [x] GET /calendars/resources/{resourceType}/{id} (Version: 2021-04-15) — implemented: yes
- [x] PUT /calendars/resources/{resourceType}/{id} (Version: 2021-04-15) — implemented: yes

## campaigns
- [ ] GET /campaigns (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)

## companies
- [ ] GET /companies/{companyId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)

## contacts
- [ ] GET /contacts (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [x] POST /contacts (Version: 2021-07-28) — implemented: yes
- [x] DELETE /contacts/{contactId} (Version: 2021-07-28) — implemented: yes
- [x] GET /contacts/{contactId} (Version: 2021-07-28) — implemented: yes
- [x] PUT /contacts/{contactId} (Version: 2021-07-28) — implemented: yes
- [x] GET /contacts/{contactId}/appointments (Version: 2021-07-28) — implemented: yes
- [x] DELETE /contacts/{contactId}/campaigns/{campaignId} (Version: 2021-07-28) — implemented: yes
- [x] POST /contacts/{contactId}/campaigns/{campaignId} (Version: 2021-07-28) — implemented: yes
- [ ] DELETE /contacts/{contactId}/campaigns/removeAll (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [x] DELETE /contacts/{contactId}/followers (Version: 2021-07-28) — implemented: yes
- [x] POST /contacts/{contactId}/followers (Version: 2021-07-28) — implemented: yes
- [x] GET /contacts/{contactId}/notes (Version: 2021-07-28) — implemented: yes
- [x] POST /contacts/{contactId}/notes (Version: 2021-07-28) — implemented: yes
- [x] DELETE /contacts/{contactId}/notes/{id} (Version: 2021-07-28) — implemented: yes
- [x] GET /contacts/{contactId}/notes/{id} (Version: 2021-07-28) — implemented: yes
- [x] PUT /contacts/{contactId}/notes/{id} (Version: 2021-07-28) — implemented: yes
- [x] DELETE /contacts/{contactId}/tags (Version: 2021-07-28) — implemented: yes
- [x] POST /contacts/{contactId}/tags (Version: 2021-07-28) — implemented: yes
- [x] GET /contacts/{contactId}/tasks (Version: 2021-07-28) — implemented: yes
- [x] POST /contacts/{contactId}/tasks (Version: 2021-07-28) — implemented: yes
- [x] DELETE /contacts/{contactId}/tasks/{taskId} (Version: 2021-07-28) — implemented: yes
- [x] GET /contacts/{contactId}/tasks/{taskId} (Version: 2021-07-28) — implemented: yes
- [x] PUT /contacts/{contactId}/tasks/{taskId} (Version: 2021-07-28) — implemented: yes
- [x] PUT /contacts/{contactId}/tasks/{taskId}/completed (Version: 2021-07-28) — implemented: yes
- [x] DELETE /contacts/{contactId}/workflow/{workflowId} (Version: 2021-07-28) — implemented: yes
- [x] POST /contacts/{contactId}/workflow/{workflowId} (Version: 2021-07-28) — implemented: yes
- [ ] POST /contacts/bulk/business (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /contacts/bulk/tags/update/{type} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [x] GET /contacts/business/{businessId} (Version: 2021-07-28) — implemented: yes
- [x] POST /contacts/search (Version: 2021-07-28) — implemented: yes
- [x] GET /contacts/search/duplicate (Version: 2021-07-28) — implemented: yes
- [x] POST /contacts/upsert (Version: 2021-07-28) — implemented: yes

## conversations
- [x] POST /conversations (Version: 2021-04-15) — implemented: yes
- [x] DELETE /conversations/{conversationId} (Version: 2021-04-15) — implemented: yes
- [x] GET /conversations/{conversationId} (Version: 2021-04-15) — implemented: yes
- [x] PUT /conversations/{conversationId} (Version: 2021-04-15) — implemented: yes
- [x] GET /conversations/{conversationId}/messages (Version: 2021-04-15) — implemented: yes
- [x] GET /conversations/locations/{locationId}/messages/{messageId}/transcription (Version: 2021-04-15) — implemented: yes
- [x] GET /conversations/locations/{locationId}/messages/{messageId}/transcription/download (Version: 2021-04-15) — implemented: yes
- [x] POST /conversations/messages (Version: 2021-04-15) — implemented: yes
- [x] GET /conversations/messages/{id} (Version: 2021-04-15) — implemented: yes
- [x] GET /conversations/messages/{messageId}/locations/{locationId}/recording (Version: 2021-04-15) — implemented: yes
- [x] DELETE /conversations/messages/{messageId}/schedule (Version: 2021-04-15) — implemented: yes
- [x] PUT /conversations/messages/{messageId}/status (Version: 2021-04-15) — implemented: yes
- [x] DELETE /conversations/messages/email/{emailMessageId}/schedule — implemented: yes
- [x] GET /conversations/messages/email/{id} — implemented: yes
- [x] POST /conversations/messages/inbound (Version: 2021-04-15) — implemented: yes
- [x] POST /conversations/messages/outbound (Version: 2021-04-15) — implemented: yes
- [x] POST /conversations/messages/upload (Version: 2021-04-15) — implemented: yes
- [x] POST /conversations/providers/live-chat/typing (Version: 2021-04-15) — implemented: yes
- [x] GET /conversations/search (Version: 2021-04-15) — implemented: yes

## courses
- [ ] POST /courses/courses-exporter/public/import (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)

## custom-fields
- [x] POST /custom-fields (Version: 2021-07-28) — implemented: yes
- [x] DELETE /custom-fields/{id} (Version: 2021-07-28) — implemented: yes
- [x] GET /custom-fields/{id} (Version: 2021-07-28) — implemented: yes
- [x] PUT /custom-fields/{id} (Version: 2021-07-28) — implemented: yes
- [x] POST /custom-fields/folder (Version: 2021-07-28) — implemented: yes
- [x] DELETE /custom-fields/folder/{id} (Version: 2021-07-28) — implemented: yes
- [x] PUT /custom-fields/folder/{id} (Version: 2021-07-28) — implemented: yes
- [x] GET /custom-fields/object-key/{objectKey} (Version: 2021-07-28) — implemented: yes

## custom-menus
- [ ] GET /custom-menus (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /custom-menus (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] DELETE /custom-menus/{customMenuId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /custom-menus/{customMenuId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] PUT /custom-menus/{customMenuId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)

## email-isv
- [x] POST /email/verify (Version: 2021-07-28) — implemented: yes

## emails
- [x] GET /emails/builder (Version: 2021-07-28) — implemented: yes
- [x] POST /emails/builder (Version: 2021-07-28) — implemented: yes
- [x] DELETE /emails/builder/{locationId}/{templateId} (Version: 2021-07-28) — implemented: yes
- [x] POST /emails/builder/data (Version: 2021-07-28) — implemented: yes
- [x] GET /emails/schedule (Version: 2021-07-28) — implemented: yes

## forms
- [ ] GET /forms (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /forms/submissions (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /forms/upload-custom-files (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)

## funnels
- [ ] GET /funnels/funnel/list — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /funnels/lookup/redirect (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] DELETE /funnels/lookup/redirect/{id} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] PATCH /funnels/lookup/redirect/{id} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /funnels/lookup/redirect/list (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /funnels/page — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /funnels/page/count — implemented: yes — needs-fix: Missing in client (implement endpoint)

## invoices
- [x] GET /invoices (Version: 2021-07-28) — implemented: yes
- [x] POST /invoices (Version: 2021-07-28) — implemented: yes
- [x] DELETE /invoices/{invoiceId} (Version: 2021-07-28) — implemented: yes
- [x] GET /invoices/{invoiceId} (Version: 2021-07-28) — implemented: yes
- [x] PUT /invoices/{invoiceId} (Version: 2021-07-28) — implemented: yes
- [x] PATCH /invoices/{invoiceId}/late-fees-configuration (Version: 2021-07-28) — implemented: yes
- [x] POST /invoices/{invoiceId}/record-payment (Version: 2021-07-28) — implemented: yes
- [x] POST /invoices/{invoiceId}/send (Version: 2021-07-28) — implemented: yes
- [x] POST /invoices/{invoiceId}/void (Version: 2021-07-28) — implemented: yes
- [x] POST /invoices/estimate (Version: 2021-07-28) — implemented: yes
- [x] DELETE /invoices/estimate/{estimateId} (Version: 2021-07-28) — implemented: yes
- [x] PUT /invoices/estimate/{estimateId} (Version: 2021-07-28) — implemented: yes
- [x] POST /invoices/estimate/{estimateId}/invoice (Version: 2021-07-28) — implemented: yes
- [x] POST /invoices/estimate/{estimateId}/send (Version: 2021-07-28) — implemented: yes
- [x] GET /invoices/estimate/list (Version: 2021-07-28) — implemented: yes
- [x] GET /invoices/estimate/number/generate (Version: 2021-07-28) — implemented: yes
- [x] PATCH /invoices/estimate/stats/last-visited-at (Version: 2021-07-28) — implemented: yes
- [x] GET /invoices/estimate/template (Version: 2021-07-28) — implemented: yes
- [x] POST /invoices/estimate/template (Version: 2021-07-28) — implemented: yes
- [x] DELETE /invoices/estimate/template/{templateId} (Version: 2021-07-28) — implemented: yes
- [x] PUT /invoices/estimate/template/{templateId} (Version: 2021-07-28) — implemented: yes
- [x] GET /invoices/estimate/template/preview (Version: 2021-07-28) — implemented: yes
- [x] GET /invoices/generate-invoice-number (Version: 2021-07-28) — implemented: yes
- [x] GET /invoices/schedule (Version: 2021-07-28) — implemented: yes
- [x] POST /invoices/schedule (Version: 2021-07-28) — implemented: yes
- [x] DELETE /invoices/schedule/{scheduleId} (Version: 2021-07-28) — implemented: yes
- [x] GET /invoices/schedule/{scheduleId} (Version: 2021-07-28) — implemented: yes
- [x] PUT /invoices/schedule/{scheduleId} (Version: 2021-07-28) — implemented: yes
- [x] POST /invoices/schedule/{scheduleId}/auto-payment (Version: 2021-07-28) — implemented: yes
- [x] POST /invoices/schedule/{scheduleId}/cancel (Version: 2021-07-28) — implemented: yes
- [x] POST /invoices/schedule/{scheduleId}/schedule (Version: 2021-07-28) — implemented: yes
- [x] POST /invoices/schedule/{scheduleId}/updateAndSchedule (Version: 2021-07-28) — implemented: yes
- [x] PATCH /invoices/stats/last-visited-at (Version: 2021-07-28) — implemented: yes
- [x] GET /invoices/template (Version: 2021-07-28) — implemented: yes
- [x] POST /invoices/template (Version: 2021-07-28) — implemented: yes
- [x] DELETE /invoices/template/{templateId} (Version: 2021-07-28) — implemented: yes
- [x] GET /invoices/template/{templateId} (Version: 2021-07-28) — implemented: yes
- [x] PUT /invoices/template/{templateId} (Version: 2021-07-28) — implemented: yes
- [x] PATCH /invoices/template/{templateId}/late-fees-configuration (Version: 2021-07-28) — implemented: yes
- [x] PATCH /invoices/template/{templateId}/payment-methods-configuration (Version: 2021-07-28) — implemented: yes
- [x] POST /invoices/text2pay (Version: 2021-07-28) — implemented: yes

## links
- [ ] GET /links (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /links (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] DELETE /links/{linkId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] PUT /links/{linkId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /links/id/{linkId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /links/search (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)

## locations
- [x] POST /locations (Version: 2021-07-28) — implemented: yes
- [x] DELETE /locations/{locationId} (Version: 2021-07-28) — implemented: yes
- [x] GET /locations/{locationId} (Version: 2021-07-28) — implemented: yes
- [x] PUT /locations/{locationId} (Version: 2021-07-28) — implemented: yes
- [x] GET /locations/{locationId}/customFields (Version: 2021-07-28) — implemented: yes
- [x] POST /locations/{locationId}/customFields (Version: 2021-07-28) — implemented: yes
- [x] DELETE /locations/{locationId}/customFields/{id} (Version: 2021-07-28) — implemented: yes
- [x] GET /locations/{locationId}/customFields/{id} (Version: 2021-07-28) — implemented: yes
- [x] PUT /locations/{locationId}/customFields/{id} (Version: 2021-07-28) — implemented: yes
- [x] POST /locations/{locationId}/customFields/upload (Version: 2021-07-28) — implemented: yes
- [x] GET /locations/{locationId}/customValues (Version: 2021-07-28) — implemented: yes
- [x] POST /locations/{locationId}/customValues (Version: 2021-07-28) — implemented: yes
- [x] DELETE /locations/{locationId}/customValues/{id} (Version: 2021-07-28) — implemented: yes
- [x] GET /locations/{locationId}/customValues/{id} (Version: 2021-07-28) — implemented: yes
- [x] PUT /locations/{locationId}/customValues/{id} (Version: 2021-07-28) — implemented: yes
- [ ] POST /locations/{locationId}/recurring-tasks (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] DELETE /locations/{locationId}/recurring-tasks/{id} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /locations/{locationId}/recurring-tasks/{id} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] PUT /locations/{locationId}/recurring-tasks/{id} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [x] GET /locations/{locationId}/tags (Version: 2021-07-28) — implemented: yes
- [x] POST /locations/{locationId}/tags (Version: 2021-07-28) — implemented: yes
- [x] DELETE /locations/{locationId}/tags/{tagId} (Version: 2021-07-28) — implemented: yes
- [x] GET /locations/{locationId}/tags/{tagId} (Version: 2021-07-28) — implemented: yes
- [x] PUT /locations/{locationId}/tags/{tagId} (Version: 2021-07-28) — implemented: yes
- [x] POST /locations/{locationId}/tasks/search (Version: 2021-07-28) — implemented: yes
- [x] GET /locations/{locationId}/templates (Version: 2021-07-28) — implemented: yes
- [x] DELETE /locations/{locationId}/templates/{id} (Version: 2021-07-28) — implemented: yes
- [ ] GET /locations/{locationId}/timezones (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [x] GET /locations/search (Version: 2021-07-28) — implemented: yes

## marketplace
- [ ] DELETE /marketplace/app/{appId}/installations (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /marketplace/app/{appId}/installations — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /marketplace/billing/charges — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /marketplace/billing/charges — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] DELETE /marketplace/billing/charges/{chargeId} — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /marketplace/billing/charges/{chargeId} — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /marketplace/billing/charges/has-funds — implemented: yes — needs-fix: Missing in client (implement endpoint)

## medias
- [x] DELETE /medias/{id} (Version: 2021-07-28) — implemented: yes
- [ ] POST /medias/{id} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] PUT /medias/delete-files (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [x] GET /medias/files (Version: 2021-07-28) — implemented: yes
- [ ] POST /medias/folder (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] PUT /medias/update-files (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [x] POST /medias/upload-file (Version: 2021-07-28) — implemented: yes

## oauth
- [ ] GET /oauth/installedLocations (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /oauth/locationToken (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /oauth/token — implemented: yes — needs-fix: Missing in client (implement endpoint)

## objects
- [x] GET /objects (Version: 2021-07-28) — implemented: yes
- [x] POST /objects (Version: 2021-07-28) — implemented: yes
- [x] GET /objects/{key} (Version: 2021-07-28) — implemented: yes
- [x] PUT /objects/{key} (Version: 2021-07-28) — implemented: yes
- [x] POST /objects/{schemaKey}/records (Version: 2021-07-28) — implemented: yes
- [x] DELETE /objects/{schemaKey}/records/{id} (Version: 2021-07-28) — implemented: yes
- [x] GET /objects/{schemaKey}/records/{id} (Version: 2021-07-28) — implemented: yes
- [x] PUT /objects/{schemaKey}/records/{id} (Version: 2021-07-28) — implemented: yes
- [x] POST /objects/{schemaKey}/records/search (Version: 2021-07-28) — implemented: yes

## opportunities
- [x] POST /opportunities (Version: 2021-07-28) — implemented: yes
- [x] DELETE /opportunities/{id} (Version: 2021-07-28) — implemented: yes
- [x] GET /opportunities/{id} (Version: 2021-07-28) — implemented: yes
- [x] PUT /opportunities/{id} (Version: 2021-07-28) — implemented: yes
- [x] DELETE /opportunities/{id}/followers (Version: 2021-07-28) — implemented: yes
- [x] POST /opportunities/{id}/followers (Version: 2021-07-28) — implemented: yes
- [x] PUT /opportunities/{id}/status (Version: 2021-07-28) — implemented: yes
- [x] GET /opportunities/pipelines (Version: 2021-07-28) — implemented: yes
- [x] GET /opportunities/search (Version: 2021-07-28) — implemented: yes
- [x] POST /opportunities/upsert (Version: 2021-07-28) — implemented: yes

## payments
- [x] DELETE /payments/coupon (Version: 2021-07-28) — implemented: yes
- [x] GET /payments/coupon (Version: 2021-07-28) — implemented: yes
- [x] POST /payments/coupon (Version: 2021-07-28) — implemented: yes
- [x] PUT /payments/coupon (Version: 2021-07-28) — implemented: yes
- [x] GET /payments/coupon/list (Version: 2021-07-28) — implemented: yes
- [x] GET /payments/custom-provider/connect (Version: 2021-07-28) — implemented: yes
- [x] POST /payments/custom-provider/connect (Version: 2021-07-28) — implemented: yes
- [x] POST /payments/custom-provider/disconnect (Version: 2021-07-28) — implemented: yes
- [x] DELETE /payments/custom-provider/provider (Version: 2021-07-28) — implemented: yes
- [x] POST /payments/custom-provider/provider (Version: 2021-07-28) — implemented: yes
- [x] GET /payments/integrations/provider/whitelabel (Version: 2021-07-28) — implemented: yes
- [x] POST /payments/integrations/provider/whitelabel (Version: 2021-07-28) — implemented: yes
- [x] GET /payments/orders (Version: 2021-07-28) — implemented: yes
- [x] GET /payments/orders/{orderId} (Version: 2021-07-28) — implemented: yes
- [x] GET /payments/orders/{orderId}/fulfillments (Version: 2021-07-28) — implemented: yes
- [x] POST /payments/orders/{orderId}/fulfillments (Version: 2021-07-28) — implemented: yes
- [x] GET /payments/subscriptions (Version: 2021-07-28) — implemented: yes
- [x] GET /payments/subscriptions/{subscriptionId} (Version: 2021-07-28) — implemented: yes
- [x] GET /payments/transactions (Version: 2021-07-28) — implemented: yes
- [x] GET /payments/transactions/{transactionId} (Version: 2021-07-28) — implemented: yes

## phone-system
- [ ] GET /phone-system/number-pools (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /phone-system/numbers/location/{locationId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)

## products
- [x] GET /products (Version: 2021-07-28) — implemented: yes
- [x] POST /products (Version: 2021-07-28) — implemented: yes
- [x] DELETE /products/{productId} (Version: 2021-07-28) — implemented: yes
- [x] GET /products/{productId} (Version: 2021-07-28) — implemented: yes
- [x] PUT /products/{productId} (Version: 2021-07-28) — implemented: yes
- [x] GET /products/{productId}/price (Version: 2021-07-28) — implemented: yes
- [x] POST /products/{productId}/price (Version: 2021-07-28) — implemented: yes
- [x] DELETE /products/{productId}/price/{priceId} (Version: 2021-07-28) — implemented: yes
- [x] GET /products/{productId}/price/{priceId} (Version: 2021-07-28) — implemented: yes
- [x] PUT /products/{productId}/price/{priceId} (Version: 2021-07-28) — implemented: yes
- [x] POST /products/bulk-update (Version: 2021-07-28) — implemented: yes
- [ ] POST /products/bulk-update/edit (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [x] GET /products/collections (Version: 2021-07-28) — implemented: yes
- [x] POST /products/collections (Version: 2021-07-28) — implemented: yes
- [x] DELETE /products/collections/{collectionId} (Version: 2021-07-28) — implemented: yes
- [x] GET /products/collections/{collectionId} (Version: 2021-07-28) — implemented: yes
- [x] PUT /products/collections/{collectionId} (Version: 2021-07-28) — implemented: yes
- [x] GET /products/inventory (Version: 2021-07-28) — implemented: yes
- [x] POST /products/inventory (Version: 2021-07-28) — implemented: yes
- [x] GET /products/reviews (Version: 2021-07-28) — implemented: yes
- [x] DELETE /products/reviews/{reviewId} (Version: 2021-07-28) — implemented: yes
- [x] PUT /products/reviews/{reviewId} (Version: 2021-07-28) — implemented: yes
- [x] POST /products/reviews/bulk-update (Version: 2021-07-28) — implemented: yes
- [x] GET /products/reviews/count (Version: 2021-07-28) — implemented: yes
- [x] POST /products/store/{storeId} (Version: 2021-07-28) — implemented: yes
- [ ] POST /products/store/{storeId}/priority (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [x] GET /products/store/{storeId}/stats (Version: 2021-07-28) — implemented: yes

## proposals
- [ ] GET /proposals/document (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /proposals/document/send (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /proposals/templates (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /proposals/templates/send (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)

## saas-api
- [ ] GET /saas-api/public-api/agency-plans/{companyId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /saas-api/public-api/bulk-disable-saas/{companyId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /saas-api/public-api/bulk-enable-saas/{companyId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /saas-api/public-api/enable-saas/{locationId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /saas-api/public-api/get-saas-subscription/{locationId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /saas-api/public-api/locations (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /saas-api/public-api/pause/{locationId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /saas-api/public-api/saas-locations/{companyId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /saas-api/public-api/saas-plan/{planId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /saas-api/public-api/update-rebilling/{companyId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] PUT /saas-api/public-api/update-saas-subscription/{locationId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /saas/agency-plans/{companyId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /saas/bulk-disable-saas/{companyId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /saas/bulk-enable-saas/{companyId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /saas/enable-saas/{locationId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /saas/get-saas-subscription/{locationId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /saas/locations (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /saas/pause/{locationId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /saas/saas-locations/{companyId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /saas/saas-plan/{planId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /saas/update-rebilling/{companyId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] PUT /saas/update-saas-subscription/{locationId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)

## snapshots
- [ ] GET /snapshots (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /snapshots/share/link (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /snapshots/snapshot-status/{snapshotId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /snapshots/snapshot-status/{snapshotId}/location/{locationId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)

## social-media-posting
- [x] GET /social-media-posting/{locationId}/accounts (Version: 2021-07-28) — implemented: yes
- [x] DELETE /social-media-posting/{locationId}/accounts/{id} (Version: 2021-07-28) — implemented: yes
- [ ] GET /social-media-posting/{locationId}/categories (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /social-media-posting/{locationId}/categories/{id} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [x] GET /social-media-posting/{locationId}/csv (Version: 2021-07-28) — implemented: yes
- [x] POST /social-media-posting/{locationId}/csv (Version: 2021-07-28) — implemented: yes
- [x] DELETE /social-media-posting/{locationId}/csv/{csvId}/post/{postId} (Version: 2021-07-28) — implemented: yes
- [x] DELETE /social-media-posting/{locationId}/csv/{id} (Version: 2021-07-28) — implemented: yes
- [x] GET /social-media-posting/{locationId}/csv/{id} (Version: 2021-07-28) — implemented: yes
- [x] PATCH /social-media-posting/{locationId}/csv/{id} (Version: 2021-07-28) — implemented: yes
- [x] POST /social-media-posting/{locationId}/posts (Version: 2021-07-28) — implemented: yes
- [x] DELETE /social-media-posting/{locationId}/posts/{id} (Version: 2021-07-28) — implemented: yes
- [x] GET /social-media-posting/{locationId}/posts/{id} (Version: 2021-07-28) — implemented: yes
- [x] PUT /social-media-posting/{locationId}/posts/{id} (Version: 2021-07-28) — implemented: yes
- [x] POST /social-media-posting/{locationId}/posts/bulk-delete (Version: 2021-07-28) — implemented: yes
- [x] POST /social-media-posting/{locationId}/posts/list (Version: 2021-07-28) — implemented: yes
- [x] POST /social-media-posting/{locationId}/set-accounts (Version: 2021-07-28) — implemented: yes
- [ ] GET /social-media-posting/{locationId}/tags (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /social-media-posting/{locationId}/tags/details (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /social-media-posting/oauth/{locationId}/facebook/accounts/{accountId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /social-media-posting/oauth/{locationId}/facebook/accounts/{accountId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /social-media-posting/oauth/{locationId}/google/locations/{accountId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /social-media-posting/oauth/{locationId}/google/locations/{accountId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /social-media-posting/oauth/{locationId}/instagram/accounts/{accountId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /social-media-posting/oauth/{locationId}/instagram/accounts/{accountId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /social-media-posting/oauth/{locationId}/linkedin/accounts/{accountId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /social-media-posting/oauth/{locationId}/linkedin/accounts/{accountId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /social-media-posting/oauth/{locationId}/tiktok-business/accounts/{accountId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /social-media-posting/oauth/{locationId}/tiktok/accounts/{accountId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /social-media-posting/oauth/{locationId}/tiktok/accounts/{accountId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /social-media-posting/oauth/{locationId}/twitter/accounts/{accountId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /social-media-posting/oauth/{locationId}/twitter/accounts/{accountId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /social-media-posting/oauth/facebook/start (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /social-media-posting/oauth/google/start (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /social-media-posting/oauth/instagram/start (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /social-media-posting/oauth/linkedin/start (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /social-media-posting/oauth/tiktok-business/start (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /social-media-posting/oauth/tiktok/start (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /social-media-posting/oauth/twitter/start (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /social-media-posting/statistics (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)

## store
- [x] GET /store/shipping-carrier — implemented: yes
- [x] POST /store/shipping-carrier — implemented: yes
- [x] DELETE /store/shipping-carrier/{shippingCarrierId} — implemented: yes
- [x] GET /store/shipping-carrier/{shippingCarrierId} — implemented: yes
- [x] PUT /store/shipping-carrier/{shippingCarrierId} — implemented: yes
- [x] GET /store/shipping-zone — implemented: yes
- [x] POST /store/shipping-zone — implemented: yes
- [x] DELETE /store/shipping-zone/{shippingZoneId} — implemented: yes
- [x] GET /store/shipping-zone/{shippingZoneId} — implemented: yes
- [x] PUT /store/shipping-zone/{shippingZoneId} — implemented: yes
- [x] GET /store/shipping-zone/{shippingZoneId}/shipping-rate — implemented: yes
- [x] POST /store/shipping-zone/{shippingZoneId}/shipping-rate — implemented: yes
- [x] DELETE /store/shipping-zone/{shippingZoneId}/shipping-rate/{shippingRateId} — implemented: yes
- [x] GET /store/shipping-zone/{shippingZoneId}/shipping-rate/{shippingRateId} — implemented: yes
- [x] PUT /store/shipping-zone/{shippingZoneId}/shipping-rate/{shippingRateId} — implemented: yes
- [x] POST /store/shipping-zone/shipping-rates — implemented: yes
- [x] GET /store/store-setting — implemented: yes
- [x] POST /store/store-setting — implemented: yes

## surveys
- [x] GET /surveys (Version: 2021-07-28) — implemented: yes
- [ ] GET /surveys/submissions (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)

## users
- [ ] GET /users (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /users (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] DELETE /users/{userId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /users/{userId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] PUT /users/{userId} (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /users/search (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /users/search/filter-by-email (Version: 2021-07-28) — implemented: yes — needs-fix: Missing in client (implement endpoint)

## voice-ai
- [ ] POST /voice-ai/actions (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] DELETE /voice-ai/actions/{actionId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /voice-ai/actions/{actionId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] PUT /voice-ai/actions/{actionId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /voice-ai/agents (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] POST /voice-ai/agents (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] DELETE /voice-ai/agents/{agentId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /voice-ai/agents/{agentId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] PATCH /voice-ai/agents/{agentId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /voice-ai/dashboard/call-logs (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)
- [ ] GET /voice-ai/dashboard/call-logs/{callId} (Version: 2021-04-15) — implemented: yes — needs-fix: Missing in client (implement endpoint)

## workflows
- [x] GET /workflows (Version: 2021-07-28) — implemented: yes

## Client-only Endpoints
- DELETE /calendars/events/appointments/{eventId}
- GET /calendars/groups/slug/validate
- GET /locations
- GET /locations/timezones
- GET /locations/{locationId}/surveys/submissions
- GET /social-media-posting/oauth/{platform}/start
- POST /calendars/blocked-slots
- POST /contacts/business/bulk
- POST /contacts/tags/bulk
