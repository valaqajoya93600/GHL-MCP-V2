# Glossary & ID Sourcing

Core entities and how to obtain their IDs via tools.

- blogId (Blog Site ID)
  - Get via `get_blog_sites` → pick `site._id`

- postId (Blog Post ID)
  - Search via `get_blog_posts` with `blogId`, `searchTerm`, `status`; select a specific post

- authorId (Blog Author ID)
  - Get via `get_blog_authors` → `author._id`

- categoryId (Blog Category ID)
  - Get via `get_blog_categories` → `category._id`

- contactId (Contact ID)
  - Search via `search_contacts` → `contact.id`

- calendarId (Calendar ID)
  - Get via `get_calendars` → `calendar.id`

- opportunityId (CRM Opportunity ID)
  - Search via `search_opportunities` or create via `create_opportunity`

- social account IDs
  - Get via `get_social_accounts` → account IDs per platform

Tips
- Never invent IDs; always fetch then pass forward.
- Cache IDs in memory for the duration of the session to reduce listing calls.
