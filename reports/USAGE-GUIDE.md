# GHL MCP Client Usage Guide (Quick Examples)

Below are concise examples for calling commonly used endpoints via `GHLApiClient`. Replace placeholders with real IDs.

## Setup

```ts
import { GHLApiClient } from '../src/clients/ghl-api-client';

const ghl = new GHLApiClient({
  accessToken: process.env.GHL_API_KEY!,
  baseUrl: process.env.GHL_BASE_URL || 'https://services.leadconnectorhq.com',
  version: '2021-07-28',
  locationId: process.env.GHL_LOCATION_ID!,
});
```

## Calendars

```ts
// Get appointment
await ghl.getAppointment('event_123');

// Create / Update / Delete notes
await ghl.createAppointmentNote('appointment_123', { note: 'Follow up' });
await ghl.updateAppointmentNote('appointment_123', 'note_1', { note: 'Updated' });
await ghl.deleteAppointmentNote('appointment_123', 'note_1');

// Block slots
await ghl.createBlockSlot({ calendarId: 'cal_1', startTime: 1700000000, endTime: 1700003600 });
await ghl.updateBlockSlot('event_456', { startTime: 1700000600 });

// Groups
await ghl.validateCalendarGroupSlugPost('sales');
await ghl.disableCalendarGroup('group_123', false);
```

## Social Media Posting

```ts
// Posts
await ghl.createSocialPost({ content: 'Hello world', platforms: ['facebook'] });
await ghl.getSocialPost('post_1');
await ghl.updateSocialPost('post_1', { content: 'Hello again' });
await ghl.deleteSocialPost('post_1');

// OAuth start (explicit)
await ghl.startFacebookOAuth('user_1', 'integration');
await ghl.getFacebookPages('acct_fb_1');
await ghl.attachFacebookPages('acct_fb_1', { pages: ['page_1'] });

// Categories & Tags
await ghl.getSocialCategories('marketing', 10, 0);
await ghl.getSocialTags('promo', 10, 0);
await ghl.getSocialTagsByIds(['tag_1', 'tag_2']);

// Stats
await ghl.getSocialStatistics(['profile_1', 'profile_2'], ['facebook', 'instagram']);
```

## Voice AI

```ts
await ghl.createVoiceAIAgent({ name: 'AI Sales Agent' });
await ghl.listVoiceAIAgents({ locationId: 'loc_1', page: 1, pageSize: 10 });
await ghl.patchVoiceAIAgent('agent_1', { name: 'Renamed' });
await ghl.listVoiceAICallLogs({ locationId: 'loc_1', callType: 'LIVE' });
await ghl.createVoiceAIAction({ type: 'SMS', payload: { message: 'Hello' } });
```

## SaaS API

```ts
await ghl.saasPublicListLocations({ companyId: 'comp_1' });
await ghl.saasPublicEnable('loc_1', { planId: 'plan_1' });
await ghl.saasPublicGetSubscription('loc_1', 'comp_1');
// Internal equivalents: ghl.saasEnable, ghl.saasGetSubscription, etc.
```

## Locations — Recurring Tasks

```ts
await ghl.createLocationRecurringTask('loc_1', { name: 'Weekly sync', frequency: 'WEEKLY' });
await ghl.getLocationRecurringTask('loc_1', 'task_1');
await ghl.updateLocationRecurringTask('loc_1', 'task_1', { name: 'Updated name' });
await ghl.deleteLocationRecurringTask('loc_1', 'task_1');
```

## Medias / Products / Surveys

```ts
// Medias
await ghl.createMediaFolder({ name: 'New Folder', parentId: 'root' });
await ghl.updateMediaItem('media_1', { name: 'Renamed.png' });
await ghl.bulkUpdateMediaItems({ ids: ['m1','m2'], visibility: 'private' });
await ghl.bulkDeleteMediaItems({ ids: ['m1','m2'] });

// Products
await ghl.bulkEditProducts({ products: [{ id: 'p1', price: 100 }] });
await ghl.updateStoreProductPriority('store_1', { priorities: [{ productId: 'p1', priority: 1 }] });

// Surveys
await ghl.getSurveySubmissions({ locationId: 'loc_1', surveyId: 's1', page: 1, limit: 20 });
```

## Funnels / Links / Marketplace / Custom Menus / Snapshots / Proposals / Forms

```ts
await ghl.createFunnelRedirect({ source: '/old', destination: '/new' });
await ghl.listFunnelPages({ locationId: 'loc_1', funnelId: 'fun_1' });

await ghl.createLink({ url: 'https://example.com', name: 'Example' });
await ghl.searchLinks({ query: 'example' });

await ghl.createMarketplaceCharge({ amount: 100, currency: 'USD' });
await ghl.getMarketplaceAppInstallations('app_1');

await ghl.createCustomMenu({ name: 'Support', items: [] });
await ghl.listCustomMenus({ locationId: 'loc_1', limit: 10 });

await ghl.listSnapshots('comp_1');
await ghl.getSnapshotStatus('snap_1', 'comp_1');

await ghl.listProposalDocuments({ locationId: 'loc_1', status: 'SENT' });
await ghl.sendProposalTemplate({ templateId: 'tpl_1', recipients: ['john@example.com'] });

await ghl.listForms({ locationId: 'loc_1', type: 'FORM' });
await ghl.listFormSubmissions({ locationId: 'loc_1', formId: 'form_1' });
await ghl.uploadFormCustomFiles('contact_1', 'loc_1', new FormData());
```

## OAuth / Campaigns / Companies / Courses / Phone System

```ts
await ghl.oauthToken({ client_id: 'id', client_secret: 'secret', grant_type: 'client_credentials' });
await ghl.oauthInstalledLocations({ companyId: 'comp_1', isInstalled: true });

await ghl.listCampaigns();
await ghl.getCompany('comp_1');
await ghl.importCoursesPublic({ url: 'https://example.com/course.json' });

await ghl.getPhoneNumberPools();
await ghl.getPhoneNumbersByLocation('loc_1');
```

Notes
- Headers: Version is handled automatically in most methods; Voice AI endpoints use 2021‑04‑15 via `getHeadersForVersion`.
- Errors: All methods throw with a standardized `GHL API Error (status): message`.
- Pagination: Many list endpoints accept `page`/`limit` or `offset`/`limit`; check the examples above.

