// Lightweight MCP client test against an SSE endpoint
// Usage:
//   SERVER_URL=https://your-railway-app.up.railway.app node scripts/test-mcp-sse.mjs
//   or
//   node scripts/test-mcp-sse.mjs https://your-railway-app.up.railway.app

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

const base = (process.env.SERVER_URL || process.argv[2] || '').trim();
if (!base) {
  console.error('Missing SERVER_URL. Pass as env or first arg.');
  process.exit(1);
}

const sseUrl = new URL(base.endsWith('/sse') ? base : base.replace(/\/?$/, '/sse'));

console.log(`[MCP Test] Connecting to SSE: ${sseUrl.href}`);

const client = new Client({ name: 'ghl-mcp-tester', version: '1.0.0' });
const transport = new SSEClientTransport(sseUrl);

try {
  await client.connect(transport);
  console.log('[MCP Test] Connected and initialized');

  // Protocol ping
  await client.ping();
  console.log('[MCP Test] Ping OK');

  // List tools
  const tools = await client.listTools({});
  console.log(`[MCP Test] Tools available: ${tools.tools.length}`);
  for (const t of tools.tools.slice(0, 10)) {
    console.log(` - ${t.name}${t.description ? ' — ' + t.description : ''}`);
  }

  // Optional: call a harmless tool if present
  const healthTool = tools.tools.find(t => /health|status/i.test(t.name));
  if (healthTool) {
    console.log(`[MCP Test] Calling tool: ${healthTool.name}`);
    const result = await client.callTool({ name: healthTool.name, arguments: {} });
    console.log('[MCP Test] Tool result:', JSON.stringify(result, null, 2));
  }
} catch (err) {
  console.error('[MCP Test] Error:', err?.message || err);
  process.exitCode = 1;
} finally {
  await client.close().catch(() => {});
}

