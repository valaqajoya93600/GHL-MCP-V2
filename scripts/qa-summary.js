#!/usr/bin/env node
/**
 * Generate per-app QA coverage summary from official specs vs local client.
 * Outputs:
 * - reports/ghl-qa-summary.json
 * - reports/ghl-qa-summary.md
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SPEC_DIR = path.join(ROOT, 'vendor', 'highlevel-api-docs', 'apps');
const CLIENT_FILE = path.join(ROOT, 'src', 'clients', 'ghl-api-client.ts');
const REPORT_DIR = path.join(ROOT, 'reports');
const JSON_OUT = path.join(REPORT_DIR, 'ghl-qa-summary.json');
const MD_OUT = path.join(REPORT_DIR, 'ghl-qa-summary.md');

function readJSON(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function isHttpMethod(k){ return ['get','post','put','delete','patch','options','head'].includes(String(k).toLowerCase()); }
function normalizePath(p){ if(!p) return p; const noQ=p.split('?')[0]; const lead=noQ.startsWith('/')?noQ:'/'+noQ; return (lead.length>1 && lead.endsWith('/'))?lead.slice(0,-1):lead; }
function transformTemplateLiteral(s){ return s.replace(/\$\{([^}]+)\}/g, (m,g1)=>`{${g1.trim()}}`); }

function loadSpec() {
  const out = [];
  const files = fs.existsSync(SPEC_DIR) ? fs.readdirSync(SPEC_DIR).filter(f=>f.endsWith('.json')) : [];
  for (const f of files) {
    const app = path.basename(f, '.json');
    let json; try { json = readJSON(path.join(SPEC_DIR, f)); } catch { continue; }
    const paths = json.paths || {};
    for (const [raw, ops] of Object.entries(paths)) {
      if (!ops || typeof ops !== 'object') continue;
      for (const [m, _op] of Object.entries(ops)) {
        if (!isHttpMethod(m)) continue;
        out.push({ app, key: `${m.toUpperCase()} ${normalizePath(raw)}` });
      }
    }
  }
  return out;
}

function loadClientKeys(){
  const src = fs.readFileSync(CLIENT_FILE, 'utf8');
  const re = /this\.axiosInstance\.(get|post|put|delete|patch)\s*\(\s*([`"'])([\s\S]*?)\2/gm;
  const set = new Set();
  let m; while ((m = re.exec(src)) !== null) {
    const method = m[1].toUpperCase();
    const p = normalizePath(transformTemplateLiteral(m[3]));
    set.add(`${method} ${p}`);
  }
  return set;
}

function main(){
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const spec = loadSpec();
  const client = loadClientKeys();

  // Per app aggregation
  const byApp = new Map();
  for (const e of spec) {
    const v = byApp.get(e.app) || { app: e.app, specTotal: 0, implemented: 0, missing: 0 };
    v.specTotal += 1;
    if (client.has(e.key)) v.implemented += 1;
    byApp.set(e.app, v);
  }
  for (const v of byApp.values()) v.missing = v.specTotal - v.implemented;

  const summary = {
    generatedAt: new Date().toISOString(),
    totals: {
      specEndpoints: spec.length,
      clientEndpoints: client.size
    },
    apps: [...byApp.values()].sort((a,b)=> a.app.localeCompare(b.app))
  };

  fs.writeFileSync(JSON_OUT, JSON.stringify(summary, null, 2));

  // Markdown
  let md = '';
  md += '# GHL QA Summary (Spec vs Client)\n\n';
  md += `Generated: ${summary.generatedAt}\n\n`;
  md += `- Spec endpoints: ${summary.totals.specEndpoints}\n`;
  md += `- Client endpoints: ${summary.totals.clientEndpoints}\n\n`;
  md += '## Per App Coverage\n';
  md += '| App | Spec | Implemented | Missing |\n|---|---:|---:|---:|\n';
  for (const v of summary.apps) {
    md += `| ${v.app} | ${v.specTotal} | ${v.implemented} | ${v.missing} |\n`;
  }
  fs.writeFileSync(MD_OUT, md, 'utf8');

  console.log(`Wrote summary to ${MD_OUT}`);
}

try { main(); } catch (e) { console.error('qa-summary failed:', e.message); process.exit(1); }

