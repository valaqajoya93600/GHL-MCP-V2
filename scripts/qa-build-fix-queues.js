#!/usr/bin/env node
/**
 * Build per-app needs-fix queues using:
 * - reports/ghl-endpoints-progress.json (statuses + notes)
 * - reports/ghl-qa-diff-advanced.json (param-name-only diffs & missing canonical)
 * - vendor/highlevel-api-docs/apps/*.json (for version hints if needed)
 * Outputs:
 * - reports/ghl-fix-queue.md (global)
 * - reports/apps/<app>-fixes.md (per app)
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'reports');
const APPS_DIR = path.join(REPORT_DIR, 'apps');
const PROGRESS_JSON = path.join(REPORT_DIR, 'ghl-endpoints-progress.json');
const ADV_DIFF_JSON = path.join(REPORT_DIR, 'ghl-qa-diff-advanced.json');

function read(file){ return fs.readFileSync(file,'utf8'); }
function readJSON(file){ return JSON.parse(read(file)); }

function main(){
  fs.mkdirSync(REPORT_DIR,{recursive:true});
  fs.mkdirSync(APPS_DIR,{recursive:true});
  const progress = readJSON(PROGRESS_JSON);
  const adv = readJSON(ADV_DIFF_JSON);

  // Build quick lookup for param-name-only diffs
  const paramOnly = new Set();
  const paramExamples = new Map();
  for(const d of (adv.paramNameOnlyDiffs||[])){
    for(const s of d.spec){
      paramOnly.add(s);
      paramExamples.set(s, d.client);
    }
  }
  // Build set of missing canonicals -> expand to raw specs list
  const missing = new Set();
  for(const m of (adv.missingFromClient||[])){
    for(const s of m.spec){ missing.add(s.endpoint); }
  }

  // Gather needs-fix endpoints grouped by app
  const byApp = new Map();
  for(const [key, rec] of Object.entries(progress)){
    if(rec.status !== 'needs-fix') continue;
    const app = rec.app || 'unknown';
    const type = paramOnly.has(key) ? 'param-name-only' : (missing.has(key) ? 'missing' : 'other');
    const examples = paramExamples.get(key) || [];
    const item = {
      key,
      app,
      type,
      versions: rec.versions || [],
      notes: rec.notes || '',
      clientExamples: examples
    };
    const arr = byApp.get(app) || [];
    arr.push(item);
    byApp.set(app, arr);
  }

  // Global markdown
  let global = '';
  global += '# GHL Fix Queue (Needs-Fix by App)\n\n';
  global += `Generated: ${new Date().toISOString()}\n\n`;
  const appRanks = [...byApp.entries()].map(([app, items])=>({app, total:items.length, missing:items.filter(i=>i.type==='missing').length, paramOnly:items.filter(i=>i.type==='param-name-only').length }));
  appRanks.sort((a,b)=> b.total - a.total);
  global += '## Apps by Needs-Fix Count\n';
  for(const r of appRanks){
    global += `- ${r.app}: ${r.total} (missing: ${r.missing}, param-name-only: ${r.paramOnly})\n`;
  }
  global += '\n';

  // Per app files
  for(const [app, items] of byApp.entries()){
    const outPath = path.join(APPS_DIR, `${app}-fixes.md`);
    let md = '';
    md += `# ${app} — Needs-Fix Endpoints\n\n`;
    const sorted = items.sort((a,b)=> a.type.localeCompare(b.type) || a.key.localeCompare(b.key));
    for(const it of sorted){
      const vh = it.versions.length ? ` (Version: ${it.versions.join(', ')})` : '';
      md += `- ${it.key}${vh} — type: ${it.type}`;
      if(it.notes) md += ` — notes: ${it.notes}`;
      if(it.clientExamples && it.clientExamples.length){ md += ` — client variants: ${it.clientExamples.join(' | ')}`; }
      md += '\n';
    }
    fs.writeFileSync(outPath, md, 'utf8');
  }

  fs.writeFileSync(path.join(REPORT_DIR,'ghl-fix-queue.md'), global, 'utf8');
  console.log('Wrote global fix queue and per-app files in reports/apps');
}

try{ main(); } catch(e){ console.error('qa-build-fix-queues failed:', e.message); process.exit(1);} 

