#!/usr/bin/env node
/**
 * Compare endpoints in local GHL API client vs official HighLevel API docs
 * - Reads OpenAPI JSON specs from vendor/highlevel-api-docs/apps/*.json
 * - Extracts all path+method combos
 * - Parses src/clients/ghl-api-client.ts for axios calls and extracts method+path
 * - Prints a gap report and writes to reports/ghl-endpoint-gap.md
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SPEC_DIR = path.join(ROOT, 'vendor', 'highlevel-api-docs', 'apps');
const CLIENT_FILE = path.join(ROOT, 'src', 'clients', 'ghl-api-client.ts');
const REPORT_DIR = path.join(ROOT, 'reports');
const REPORT_FILE = path.join(REPORT_DIR, 'ghl-endpoint-gap.md');

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function listSpecFiles() {
  if (!fs.existsSync(SPEC_DIR)) {
    throw new Error(`Specs directory not found: ${SPEC_DIR}`);
  }
  return fs
    .readdirSync(SPEC_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => path.join(SPEC_DIR, f));
}

function isHttpMethod(k) {
  return ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(String(k).toLowerCase());
}

function normalizePath(p) {
  if (!p) return p;
  // remove query string
  const noQuery = p.split('?')[0];
  // ensure leading slash
  const lead = noQuery.startsWith('/') ? noQuery : '/' + noQuery;
  // remove trailing slash except for root
  if (lead.length > 1 && lead.endsWith('/')) return lead.slice(0, -1);
  return lead;
}

function collectSpecEndpoints() {
  const files = listSpecFiles();
  const endpoints = new Map(); // key: METHOD PATH, value: {file, versionHints:Set}
  for (const file of files) {
    let json;
    try {
      json = readJSON(file);
    } catch (e) {
      // skip invalid JSON
      continue;
    }
    const appName = path.basename(file, '.json');
    const paths = json.paths || {};
    for (const [rawPath, obj] of Object.entries(paths)) {
      const npath = normalizePath(rawPath);
      if (!obj || typeof obj !== 'object') continue;
      for (const [method, op] of Object.entries(obj)) {
        if (!isHttpMethod(method)) continue;
        const key = `${method.toUpperCase()} ${npath}`;
        const prev = endpoints.get(key) || { files: new Set(), apps: new Set(), versionHints: new Set() };
        prev.files.add(path.relative(ROOT, file));
        prev.apps.add(appName);
        // Attempt to capture Version header enum
        const params = (op && op.parameters) || [];
        for (const p of params) {
          if (String(p.name).toLowerCase() === 'version' && p.schema && p.schema.enum) {
            for (const v of p.schema.enum) prev.versionHints.add(String(v));
          }
        }
        endpoints.set(key, prev);
      }
    }
  }
  return endpoints;
}

function transformTemplateLiteral(str) {
  // Replace ${foo} with {foo}
  return str.replace(/\$\{([^}]+)\}/g, (m, g1) => `{${g1.trim()}}`);
}

function collectClientEndpoints() {
  const src = fs.readFileSync(CLIENT_FILE, 'utf8');
  const endpoints = new Map(); // key: METHOD PATH, value: occurrences count

  // Regex to match axiosInstance.<method>( 'path' or "path" or `path` )
  // Capture method and first string-like argument
  const regex = /this\.axiosInstance\.(get|post|put|delete|patch)\s*\(\s*([`"'])([\s\S]*?)\2/gm;
  let match;
  while ((match = regex.exec(src)) !== null) {
    const method = match[1].toUpperCase();
    let raw = match[3];
    // Only take first line up to end of literal; regex already does
    // Normalize template literals
    raw = transformTemplateLiteral(raw);
    // Drop query strings
    const pathOnly = normalizePath(raw);
    const key = `${method} ${pathOnly}`;
    endpoints.set(key, (endpoints.get(key) || 0) + 1);
  }

  return endpoints;
}

function groupByTopSegment(keys) {
  const groups = new Map();
  for (const key of keys) {
    const [, pathPart] = key.split(' ');
    const seg = pathPart.split('/').filter(Boolean)[0] || '';
    const g = groups.get(seg) || [];
    g.push(key);
    groups.set(seg, g);
  }
  return groups;
}

function main() {
  const specEndpoints = collectSpecEndpoints();
  const clientEndpoints = collectClientEndpoints();

  const specKeys = new Set(specEndpoints.keys());
  const clientKeys = new Set(clientEndpoints.keys());

  // Differences
  const inClientNotInSpec = [...clientKeys].filter((k) => !specKeys.has(k));
  const inSpecNotInClient = [...specKeys].filter((k) => !clientKeys.has(k));

  // Prepare report content
  let out = '';
  out += '# GHL Endpoint Gap Report\n\n';
  out += `Generated: ${new Date().toISOString()}\n\n`;
  out += '## Summary\n';
  out += `- Spec endpoints: ${specKeys.size}\n`;
  out += `- Client endpoints: ${clientKeys.size}\n`;
  out += `- In client only: ${inClientNotInSpec.length}\n`;
  out += `- In spec only: ${inSpecNotInClient.length}\n\n`;

  const clientGroups = groupByTopSegment(inClientNotInSpec);
  const specGroups = groupByTopSegment(inSpecNotInClient);

  out += '## In Client Only\n';
  if (inClientNotInSpec.length === 0) out += '- None\n';
  for (const [seg, items] of [...clientGroups.entries()].sort()) {
    out += `\n### /${seg}\n`;
    for (const k of items.sort()) {
      out += `- ${k}\n`;
    }
  }

  out += '\n## In Spec Only\n';
  if (inSpecNotInClient.length === 0) out += '- None\n';
  for (const [seg, items] of [...specGroups.entries()].sort()) {
    out += `\n### /${seg}\n`;
    for (const k of items.sort()) {
      const meta = specEndpoints.get(k);
      const versions = meta ? [...meta.versionHints].join(', ') : '';
      out += `- ${k}${versions ? ` (Version: ${versions})` : ''}\n`;
    }
  }

  // Ensure report dir
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(REPORT_FILE, out, 'utf8');

  // Also print a concise console summary
  console.log(out.split('\n').slice(0, 30).join('\n'));
  console.log(`\nFull report written to: ${REPORT_FILE}`);
}

try {
  main();
} catch (e) {
  console.error('Failed to generate gap report:', e.message);
  process.exit(1);
}

