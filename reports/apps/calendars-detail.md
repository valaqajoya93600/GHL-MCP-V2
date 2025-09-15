# calendars — Detailed QA

Version hints present in spec: 2021-04-15

## Param-name-only Differences
- PUT /calendars/events/appointments/{eventId} (Version: 2021-04-15)
  - summary: Update Appointment
  - client candidates: PUT /calendars/events/appointments/{appointmentId}
  - recommended: update client path to '/calendars/events/appointments/{eventId}' to match spec
- GET /calendars/events/appointments/{eventId} (Version: 2021-04-15)
  - summary: Get Appointment
  - client candidates: GET /calendars/events/appointments/{appointmentId}
  - recommended: update client path to '/calendars/events/appointments/{eventId}' to match spec
- PUT /calendars/events/block-slots/{eventId} (Version: 2021-04-15)
  - summary: Update Block Slot
  - client candidates: PUT /calendars/events/block-slots/{blockSlotId}
  - recommended: update client path to '/calendars/events/block-slots/{eventId}' to match spec
- GET /calendars/{calendarId}/free-slots (Version: 2021-04-15)
  - summary: Get Free Slots
  - client candidates: GET /calendars/{slotParams.calendarId}/free-slots
  - recommended: update client path to '/calendars/{calendarId}/free-slots' to match spec
- GET /calendars/resources/{resourceType}/{id} (Version: 2021-04-15)
  - summary: Get Calendar Resource
  - client candidates: GET /calendars/resources/{resourceType}/{resourceId}
  - recommended: update client path to '/calendars/resources/{resourceType}/{id}' to match spec
- PUT /calendars/resources/{resourceType}/{id} (Version: 2021-04-15)
  - summary: Update Calendar Resource
  - client candidates: PUT /calendars/resources/{resourceType}/{resourceId}
  - recommended: update client path to '/calendars/resources/{resourceType}/{id}' to match spec
- DELETE /calendars/resources/{resourceType}/{id} (Version: 2021-04-15)
  - summary: Delete Calendar Resource
  - client candidates: DELETE /calendars/resources/{resourceType}/{resourceId}
  - recommended: update client path to '/calendars/resources/{resourceType}/{id}' to match spec

## Missing Endpoints
- POST /calendars/groups/validate-slug (Version: 2021-04-15)
  - summary: Validate group slug
  - recommended: implement client method for this endpoint
- PUT /calendars/groups/{groupId}/status (Version: 2021-04-15)
  - summary: Disable Group
  - recommended: implement client method for this endpoint
- POST /calendars/events/block-slots (Version: 2021-04-15)
  - summary: Create Block Slot
  - recommended: implement client method for this endpoint
- DELETE /calendars/events/{eventId} (Version: 2021-04-15)
  - summary: Delete Event
  - recommended: implement client method for this endpoint
- GET /calendars/appointments/{appointmentId}/notes (Version: 2021-04-15)
  - summary: Get Notes
  - recommended: implement client method for this endpoint
- POST /calendars/appointments/{appointmentId}/notes (Version: 2021-04-15)
  - summary: Create Note
  - recommended: implement client method for this endpoint
- PUT /calendars/appointments/{appointmentId}/notes/{noteId} (Version: 2021-04-15)
  - summary: Update Note
  - recommended: implement client method for this endpoint
- DELETE /calendars/appointments/{appointmentId}/notes/{noteId} (Version: 2021-04-15)
  - summary: Delete Note
  - recommended: implement client method for this endpoint
