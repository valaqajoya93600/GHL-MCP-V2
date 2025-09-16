// Minimal client test for MCP Streamable HTTP
// Usage:
//   SERVER_URL=https://your-app.up.railway.app node scripts/test-mcp-streamable.mjs
//   or
//   node scripts/test-mcp-streamable.mjs https://your-app.up.railway.app

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const base = (process.env.SERVER_URL || process.argv[2] || '').trim();
if (!base) {
  console.error('Missing SERVER_URL. Pass as env or first arg.');
  process.exit(1);
}

const mcpUrl = new URL(base.endsWith('/mcp') ? base : base.replace(/\/?$/, '/mcp'));
console.log(`[MCP Streamable Test] Connecting to: ${mcpUrl.href}`);

const client = new Client({ name: 'ghl-mcp-streamable-tester', version: '1.0.0' });
const transport = new StreamableHTTPClientTransport(mcpUrl);

try {
  await client.connect(transport);
  console.log('[MCP Streamable Test] Connected and initialized');

  await client.ping();
  console.log('[MCP Streamable Test] Ping OK');

  const tools = await client.listTools({});
  console.log(`[MCP Streamable Test] Tools available: ${tools.tools.length}`);
  for (const t of tools.tools.slice(0, 10)) {
    console.log(` - ${t.name}${t.description ? ' — ' + t.description : ''}`);
  }

  // Try calling a simple no-arg tool if present
  const candidateNames = ['get_pipelines', 'get_social_accounts', 'get_calendars', 'get_timezones'];
  const candidate = tools.tools.find(t => candidateNames.includes(t.name));
  if (candidate) {
    console.log(`[MCP Streamable Test] Calling tool: ${candidate.name}`);
    const result = await client.callTool({ name: candidate.name, arguments: {} });
    console.log('[MCP Streamable Test] Tool result:', JSON.stringify(result, null, 2));
  }
} catch (err) {
  console.error('[MCP Streamable Test] Error:', err?.message || err);
  process.exitCode = 1;
} finally {
  await client.close().catch(() => {});
}

