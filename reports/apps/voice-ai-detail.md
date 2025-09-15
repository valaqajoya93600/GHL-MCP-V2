# voice-ai — Detailed QA

Version hints present in spec: 2021-04-15

## Param-name-only Differences
- None

## Missing Endpoints
- POST /voice-ai/agents (Version: 2021-04-15)
  - summary: Create Agent
  - recommended: implement client method for this endpoint
- GET /voice-ai/agents (Version: 2021-04-15)
  - summary: List Agents
  - recommended: implement client method for this endpoint
- PATCH /voice-ai/agents/{agentId} (Version: 2021-04-15)
  - summary: Patch Agent
  - recommended: implement client method for this endpoint
- GET /voice-ai/agents/{agentId} (Version: 2021-04-15)
  - summary: Get Agent
  - recommended: implement client method for this endpoint
- DELETE /voice-ai/agents/{agentId} (Version: 2021-04-15)
  - summary: Delete Agent
  - recommended: implement client method for this endpoint
- GET /voice-ai/dashboard/call-logs (Version: 2021-04-15)
  - summary: List Call Logs
  - recommended: implement client method for this endpoint
- GET /voice-ai/dashboard/call-logs/{callId} (Version: 2021-04-15)
  - summary: Get Call Log
  - recommended: implement client method for this endpoint
- POST /voice-ai/actions (Version: 2021-04-15)
  - summary: Create Agent Action
  - recommended: implement client method for this endpoint
- PUT /voice-ai/actions/{actionId} (Version: 2021-04-15)
  - summary: Update Agent Action
  - recommended: implement client method for this endpoint
- GET /voice-ai/actions/{actionId} (Version: 2021-04-15)
  - summary: Get Agent Action
  - recommended: implement client method for this endpoint
- DELETE /voice-ai/actions/{actionId} (Version: 2021-04-15)
  - summary: Delete Agent Action
  - recommended: implement client method for this endpoint
