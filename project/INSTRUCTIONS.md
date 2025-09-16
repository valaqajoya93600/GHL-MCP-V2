# GoHighLevel MCP — ChatGPT Project Instructions

These instructions equip ChatGPT to use the GoHighLevel MCP server effectively. They cover how to discover tools, fetch required IDs, and compose reliable multi-step workflows ("stacks").

## Operate With MCP First Principles
- Prefer tools over freeform reasoning: always call a tool when data or side-effects are needed.
- Never invent IDs: fetch them via the appropriate listing/search tool, then pass them forward.
- Cache context: remember IDs (siteId, authorId, categoryId, contactId, calendarId, etc.) for this session and reuse them.
- Handle validation: when an API returns 4xx with a message, adjust inputs and retry.
- Work incrementally: list → pick → act → verify. After each mutation, verify via a read.

## Start-of-Session Checklist
1) List tools to confirm capabilities
   - Call `tools/list` (MCP). Cache tool names + output schemas for validation.
2) Health and connectivity
   - Optional: call health endpoint (`/health`) if accessible; not strictly needed when MCP is connected.
3) Load location context
   - You do not need to set `locationId`; the server reads it from configuration. When an ID is required, fetch the resource that provides it.

## Tool Discovery and ID Sourcing
- Blogs
  - Sites: `get_blog_sites` → pick a `site._id` as `blogId`
  - Authors: `get_blog_authors` → pick `author._id`
  - Categories: `get_blog_categories` → pick category IDs
  - Slug check: `check_url_slug` before create/update
- Media Library
  - List: `get_media_files` (requires `type`: `file` or `folder`; defaults to `file`)
  - Upload: `upload_media_file` (direct file or hosted URL)
- Conversations / Messaging
  - Send SMS: `send_sms` (plain text only)
  - Send Email: `send_email` (supports `message` and/or `html`)
- Social Media
  - Accounts: `get_social_accounts`
  - Create post: `create_social_post`
- Calendars
  - Sites/groups/calendars: `get_calendar_groups`, `get_calendars`
  - Availability: `get_free_slots`
  - Appointments: `create_appointment`
- Contacts
  - Search: `search_contacts`
  - Upsert: `upsert_contact`
  - Tags: `add_contact_tags`, `remove_contact_tags`

See project/TOOL-INDEX.md for a curated map of key tools.

## Reliable Workflow Pattern
- Pattern: Find → Validate → Act → Verify
  - Example: "Post a blog"
    1) Find: `get_blog_sites` → choose `blogId`
    2) Validate: `get_blog_authors`, `get_blog_categories`, `check_url_slug`
    3) Act: `create_blog_post`
    4) Verify: `get_blog_posts` (with `status` if desired)

## Error Handling
- 400/422 input issues: check required fields and enums. For media list, pass `type` (`file` or `folder`).
- 401 authorization: ensure environment/server tokens are set; MCP will report clear errors.
- 404 not found: validate IDs; re-fetch lists to select a valid ID.
- Timeouts / network: retry idempotent reads; avoid repeating non-idempotent writes.

## Content Formatting Essentials
- SMS (send_sms)
  - Plain text only; keep concise, avoid HTML; links should be `https://...`.
  - Practical max ~ 1600 chars; prefer < 320 chars for deliverability.
- Email (send_email)
  - Supports `message` (plain) and `html` (HTML). If both exist, HTML is preferred.
  - Include a clear subject; sanitize external HTML if given.
- Blogs
  - `content` is HTML; keep semantic structure (h1–h3, p, ul/ol, img with alt attributes).
  - Validate slug uniqueness via `check_url_slug`.

## Verification After Changes
- After create/update, immediately read back the resource:
  - Blog: `get_blog_posts` (filter by slug or recent), or fetch by returned ID if provided.
  - Media: re-list or fetch specific record where supported.
  - Appointment: `get_appointment` or list range via `get_calendar_events`.

For concrete, step-by-step task playbooks and examples, see project/RECIPES.md.
