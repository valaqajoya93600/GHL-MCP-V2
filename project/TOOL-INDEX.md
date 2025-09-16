# Key Tools Map (Curated)

This is a quick reference for common tools. Always call `tools/list` at session start to cache the full, authoritative list and output schemas.

## Blogs
- `get_blog_sites` (discover sites; returns `_id` used as `blogId`)
- `get_blog_posts` (requires `blogId`; supports `limit`, `offset`, `searchTerm`, `status`)
- `create_blog_post` (requires: `title`, `blogId`, `content`, `description`, `imageUrl`, `imageAltText`, `urlSlug`, `author`, `categories`)
- `update_blog_post` (requires: `postId`, `blogId`; other fields optional)
- `get_blog_authors` (list authors)
- `get_blog_categories` (list categories)
- `check_url_slug` (validate slug before create/update)

## Media Library
- `get_media_files` (requires `type`: `file` or `folder`; defaults to `file`)
- `upload_media_file` (direct file or `hosted`+`fileUrl`)
- `delete_media_file` (by `id`)

## Conversations / Messaging
- `send_sms` (plain text only; `contactId`, `message`, optional `fromNumber`)
- `send_email` (supports `subject`, `message` and/or `html`, optional `emailFrom`, `attachments`, `emailCc`, `emailBcc`)

## Social Media
- `get_social_accounts`
- `create_social_post` (multi-account posting, scheduling)
- CSV Utilities: `upload_social_csv`, `get_csv_upload_status`, `set_csv_accounts`
- Taxonomy: `get_social_categories`, `get_social_tags`, `get_social_tags_by_ids`
- OAuth Helpers: `start_social_oauth`, `get_platform_accounts`

## Calendars
- `get_calendar_groups`, `get_calendars`
- `get_free_slots` (availability)
- `create_appointment`, `get_appointment`, `update_appointment`, `delete_appointment`

## Contacts
- `search_contacts`, `get_contact`, `upsert_contact`
- Tasks/Notes: `create_contact_task`, `update_contact_task`, `get_contact_tasks`, `create_contact_note`, `get_contact_notes`
- Tags: `add_contact_tags`, `remove_contact_tags`

## Opportunities (CRM)
- `get_pipelines`, `search_opportunities`, `get_opportunity`, `create_opportunity`, `update_opportunity_status`, `delete_opportunity`, `upsert_opportunity`

## Email Templates & Campaigns
- `get_email_campaigns`
- `create_email_template`, `get_email_templates`, `update_email_template`, `delete_email_template`

Tip: Use `searchTerm` arguments to find by name; otherwise list then filter in the client.
