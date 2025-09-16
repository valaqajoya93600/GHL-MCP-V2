# Content & Formatting Guidelines

## SMS (send_sms)
- Plain text only. No HTML.
- Prefer short messages (< 320 chars). Absolute upper bound ~1600 chars.
- Include safe links with `https://` if needed.
- Avoid ALL CAPS and excessive punctuation.

Example args:
```json
{ "contactId": "<id>", "message": "Reminder: Your session starts at 2:00 PM. Reply YES to confirm." }
```

## Email (send_email)
- Provide a clear `subject`.
- Use either `message` (plain text) or `html` (HTML). If both are present, HTML is preferred.
- Keep HTML simple and semantic (headings, paragraphs, lists, links). Add alt text for images.
- Attachments are URLs.

Example args:
```json
{
  "contactId": "<id>",
  "subject": "Welcome to Acme",
  "html": "<h1>Welcome!</h1><p>We’re glad you’re here.</p>",
  "attachments": ["https://.../welcome.pdf"]
}
```

## Blog Content (create/update)
- `content` is HTML. Structure with headings (h2–h3), paragraphs, images with `alt`, and lists.
- Keep the main title in `title` and first `h1`; use `h2`/`h3` for sections.
- Validate uniqueness with `check_url_slug`.
- Use a descriptive `description` for listings/previews.

## Social Media
- Craft platform-agnostic copy in `summary`.
- Provide high-quality media URLs in `media[].url`.
- For scheduled posts, ensure `scheduleDate` is an ISO timestamp in the future.

## Calendar & Appointments
- Use ISO date/time with timezone offsets (e.g., `2025-09-18T14:00:00-04:00`).
- Prefer checking availability via `get_free_slots` before booking.
