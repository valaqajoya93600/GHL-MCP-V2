# Common Recipes (Stacks)

These are end-to-end playbooks with the exact sequence of tool calls and the arguments to pass. Treat them as blueprints; adapt inputs to your goal.

## Post a Blog Article
1) Discover blog site (if `blogId` unknown)
   - Tool: `get_blog_sites`
   - Args: `{ "limit": 10, "skip": 0, "searchTerm": "<optional name>" }`
   - Pick `site._id` as `blogId`
2) Discover author and categories
   - Tool: `get_blog_authors` → pick `author._id`
   - Tool: `get_blog_categories` → collect category IDs
3) Check slug availability
   - Tool: `check_url_slug`
   - Args: `{ "urlSlug": "my-post-slug" }`
   - Ensure `available: true`
4) Create the blog post
   - Tool: `create_blog_post`
   - Args (example):
     ```json
     {
       "title": "Announcing Our New Feature",
       "blogId": "<siteId>",
       "content": "<h1>New Feature</h1><p>Details...</p>",
       "description": "Short summary for listings",
       "imageUrl": "https://.../hero.jpg",
       "imageAltText": "Hero image",
       "urlSlug": "announcing-new-feature",
       "author": "<authorId>",
       "categories": ["<categoryId1>", "<categoryId2>"],
       "status": "DRAFT",
       "publishedAt": "2025-09-16T09:00:00.000Z"
     }
     ```
5) Verify
   - Tool: `get_blog_posts`
   - Args: `{ "blogId": "<siteId>", "limit": 10, "searchTerm": "Announcing" }`

## Update a Blog Article
1) Locate the post
   - Tool: `get_blog_posts`
   - Args: `{ "blogId": "<siteId>", "limit": 50, "searchTerm": "<title or slug>", "status": "DRAFT" }`
   - Pick the `postId`
2) Update
   - Tool: `update_blog_post`
   - Args: `{ "postId": "<postId>", "blogId": "<siteId>", "title": "New Title", "content": "<h1>Updated</h1>...", "status": "PUBLISHED" }`
3) Verify
   - Tool: `get_blog_posts` with `status: "PUBLISHED"`

## Upload Media and Reference in Blog
1) List a folder
   - Tool: `get_media_files`
   - Args: `{ "type": "folder", "limit": 25 }`
2) Upload
   - Tool: `upload_media_file`
   - Args (hosted URL): `{ "hosted": true, "fileUrl": "https://.../image.jpg", "parentId": "<folderId>" }`
3) Verify
   - Tool: `get_media_files`
   - Args: `{ "type": "file", "query": "image.jpg" }`
4) Use `imageUrl` in blog `content` and/or `imageUrl`

## Send an SMS to a Contact
1) Find contact
   - Tool: `search_contacts`
   - Args: `{ "query": "<name or email or phone>", "limit": 1 }`
   - Pick `contactId`
2) Send SMS
   - Tool: `send_sms`
   - Args: `{ "contactId": "<id>", "message": "Your appointment is confirmed for 2pm today." }`

## Send an Email (HTML)
1) Find contact (as above)
2) Send Email
   - Tool: `send_email`
   - Args:
     ```json
     {
       "contactId": "<id>",
       "subject": "Welcome!",
       "html": "<h1>Welcome</h1><p>Thanks for joining.</p>",
       "attachments": ["https://.../brochure.pdf"]
     }
     ```

## Schedule a Social Media Post
1) Choose accounts
   - Tool: `get_social_accounts`
   - Pick array of account IDs
2) Create post
   - Tool: `create_social_post`
   - Args:
     ```json
     {
       "accountIds": ["<acc1>", "<acc2>"],
       "summary": "New blog is live!",
       "media": [{ "url": "https://.../hero.jpg" }],
       "status": "scheduled",
       "scheduleDate": "2025-09-17T13:00:00Z",
       "type": "post"
     }
     ```

## Book an Appointment
1) Pick calendar
   - Tool: `get_calendars`
   - Pick `calendarId`
2) Availability
   - Tool: `get_free_slots`
   - Args: `{ "calendarId": "<id>", "startDate": "2025-09-17", "endDate": "2025-09-20", "timezone": "America/New_York" }`
3) Create appointment
   - Tool: `create_appointment`
   - Args: `{ "calendarId": "<id>", "contactId": "<contactId>", "startTime": "2025-09-18T14:00:00-04:00", "title": "Consult" }`

## Launch an Email Template to a Contact (Simple)
1) Prepare template (optional flows in templates tools)
2) Send email (see above), using the template’s compiled HTML as `html`

Notes
- When IDs are unknown, first call the listing tool; do not guess.
- Prefer smaller `limit` values (10–25) and page via `offset` to explore.
