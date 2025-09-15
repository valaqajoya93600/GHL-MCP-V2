#!/usr/bin/env node
/**
 * Build a QA checklist from official specs and our client implementation.
 * Outputs:
 * - reports/ghl-endpoints-progress.json (statuses: todo|verified|needs-fix|skipped)
 * - reports/ghl-endpoint-checklist.md (human-readable grouped list)
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SPEC_DIR = path.join(ROOT, 'vendor', 'highlevel-api-docs', 'apps');
const CLIENT_FILE = path.join(ROOT, 'src', 'clients', 'ghl-api-client.ts');
const REPORT_DIR = path.join(ROOT, 'reports');
const PROGRESS_JSON = path.join(REPORT_DIR, 'ghl-endpoints-progress.json');
const CHECKLIST_MD = path.join(REPORT_DIR, 'ghl-endpoint-checklist.md');

function readJSON(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function isHttpMethod(k){ return ['get','post','put','delete','patch','options','head'].includes(String(k).toLowerCase()); }
function normalizePath(p){ if(!p) return p; const noQ=p.split('?')[0]; const lead=noQ.startsWith('/')?noQ:'/'+noQ; return (lead.length>1 && lead.endsWith('/'))?lead.slice(0,-1):lead; }
function transformTemplateLiteral(s){ return s.replace(/\$\{([^}]+)\}/g, (m,g1)=>`{${g1.trim()}}`); }

function loadSpec() {
  const endpoints = []; // {app, method, path, versions:Set}
  const files = fs.existsSync(SPEC_DIR) ? fs.readdirSync(SPEC_DIR).filter(f=>f.endsWith('.json')) : [];
  for (const fname of files) {
    const app = path.basename(fname, '.json');
    let json;
    try { json = readJSON(path.join(SPEC_DIR, fname)); } catch { continue; }
    const paths = json.paths || {};
    for (const [rawPath, ops] of Object.entries(paths)) {
      if (!ops || typeof ops !== 'object') continue;
      for (const [m, op] of Object.entries(ops)) {
        if (!isHttpMethod(m)) continue;
        const versions = new Set();
        for (const p of (op.parameters||[])) {
          if (String(p.name).toLowerCase() === 'version' && p.schema && p.schema.enum) {
            for (const v of p.schema.enum) versions.add(String(v));
          }
        }
        endpoints.push({ app, method: m.toUpperCase(), path: normalizePath(rawPath), versions });
      }
    }
  }
  return endpoints;
}

function loadClientEndpoints() {
  const src = fs.readFileSync(CLIENT_FILE, 'utf8');
  const re = /this\.axiosInstance\.(get|post|put|delete|patch)\s*\(\s*([`"'])([\s\S]*?)\2/gm;
  const set = new Set();
  let m;
  while ((m = re.exec(src)) !== null) {
    const method = m[1].toUpperCase();
    let p = transformTemplateLiteral(m[3]);
    p = normalizePath(p);
    set.add(`${method} ${p}`);
  }
  return set;
}

function loadOrInitProgress(specList) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  if (fs.existsSync(PROGRESS_JSON)) {
    try { return readJSON(PROGRESS_JSON); } catch { /* fallthrough */ }
  }
  // Initialize default progress map
  const progress = {};
  for (const e of specList) {
    const key = `${e.method} ${e.path}`;
    progress[key] = {
      app: e.app,
      method: e.method,
      path: e.path,
      versions: [...e.versions],
      status: 'todo', // todo|verified|needs-fix|skipped
      notes: ''
    };
  }
  fs.writeFileSync(PROGRESS_JSON, JSON.stringify(progress, null, 2));
  return progress;
}

function buildChecklist(specList, clientSet, progress) {
  const byApp = new Map();
  for (const e of specList) {
    const arr = byApp.get(e.app) || [];
    arr.push(e);
    byApp.set(e.app, arr);
  }

  let out = '';
  out += '# GHL Endpoint QA Checklist\n\n';
  out += 'Legend: [x] verified | [ ] not verified.\n\n';
  out += 'Instructions:\n';
  out += `- Update status in \`${path.relative(ROOT, PROGRESS_JSON)}\` (todo|verified|needs-fix|skipped) and re-run this script.\n`;
  out += '- “Implemented” indicates presence in local client, not QA status.\n\n';

  const appsSorted = [...byApp.keys()].sort();
  for (const app of appsSorted) {
    out += `## ${app}\n`;
    const items = byApp.get(app).sort((a,b)=> (a.path===b.path? a.method.localeCompare(b.method) : a.path.localeCompare(b.path)));
    for (const e of items) {
      const key = `${e.method} ${e.path}`;
      const prog = progress[key] || { status: 'todo' };
      const box = prog.status === 'verified' ? 'x' : ' ';
      const implemented = clientSet.has(key) ? 'yes' : 'no';
      const version = e.versions && e.versions.size ? ` (Version: ${[...e.versions].join(', ')})` : '';
      const note = prog.status === 'needs-fix' && prog.notes ? ` — needs-fix: ${prog.notes}` : '';
      out += `- [${box}] ${e.method} ${e.path}${version} — implemented: ${implemented}${note}\n`;
    }
    out += '\n';
  }

  // Client-only endpoints (helpful for cleanup)
  const specKeys = new Set(specList.map(e=>`${e.method} ${e.path}`));
  const clientOnly = [...clientSet].filter(k=>!specKeys.has(k)).sort();
  out += '## Client-only Endpoints\n';
  if (clientOnly.length === 0) out += '- None\n';
  for (const k of clientOnly) out += `- ${k}\n`;

  return out;
}

function main(){
  const specList = loadSpec();
  const clientSet = loadClientEndpoints();
  const progress = loadOrInitProgress(specList);
  const md = buildChecklist(specList, clientSet, progress);
  fs.writeFileSync(CHECKLIST_MD, md, 'utf8');
  console.log(`Wrote checklist to ${CHECKLIST_MD}`);
}

try { main(); } catch (e) { console.error('qa-checklist failed:', e.message); process.exit(1);} 

