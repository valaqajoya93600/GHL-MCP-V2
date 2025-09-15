#!/usr/bin/env node
/**
 * Auto-tag progress statuses based on spec vs client and advanced diff.
 * Rules:
 * - If spec endpoint not in client -> status = needs-fix (note: missing in client)
 * - If param-name-only diff -> status = needs-fix (note: param token mismatch)
 * - Else if implemented exactly -> leave as todo (note: exists; verify semantics/headers)
 * Does not set 'verified' or 'skipped'.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SPEC_DIR = path.join(ROOT, 'vendor', 'highlevel-api-docs', 'apps');
const CLIENT_FILE = path.join(ROOT, 'src', 'clients', 'ghl-api-client.ts');
const REPORT_DIR = path.join(ROOT, 'reports');
const PROGRESS_JSON = path.join(REPORT_DIR, 'ghl-endpoints-progress.json');
const ADV_DIFF_JSON = path.join(REPORT_DIR, 'ghl-qa-diff-advanced.json');

function readJSON(file){ return JSON.parse(fs.readFileSync(file,'utf8')); }
function isHttpMethod(k){ return ['get','post','put','delete','patch','options','head'].includes(String(k).toLowerCase()); }
function normPath(p){ if(!p) return p; const q=p.split('?')[0]; let s=q.startsWith('/')?q:'/'+q; if(s.length>1 && s.endsWith('/')) s=s.slice(0,-1); return s; }
function transformTmpl(s){ return s.replace(/\$\{([^}]+)\}/g, (m,g1)=>`{${g1.trim()}}`); }

function loadSpecKeys(){
  const keys=[]; const files=fs.readdirSync(SPEC_DIR).filter(f=>f.endsWith('.json'));
  for(const f of files){
    let j; try{ j=readJSON(path.join(SPEC_DIR,f)); } catch { continue; }
    const app = path.basename(f,'.json');
    for(const [raw,ops] of Object.entries(j.paths||{})){
      for(const [m,op] of Object.entries(ops||{})){
        if(!isHttpMethod(m)) continue;
        keys.push({ key: `${m.toUpperCase()} ${normPath(raw)}`, app });
      }
    }
  }
  return keys;
}

function loadClientSet(){
  const src = fs.readFileSync(CLIENT_FILE,'utf8');
  const re=/this\.axiosInstance\.(get|post|put|delete|patch)\s*\(\s*([`"'])([\s\S]*?)\2/gm;
  const set = new Set(); let m;
  while((m=re.exec(src))!==null){
    const method=m[1].toUpperCase();
    const p=normPath(transformTmpl(m[3]));
    set.add(`${method} ${p}`);
  }
  return set;
}

function main(){
  if(!fs.existsSync(PROGRESS_JSON)) throw new Error('progress file not found');
  const progress = readJSON(PROGRESS_JSON);
  const specKeys = loadSpecKeys();
  const clientSet = loadClientSet();
  const adv = fs.existsSync(ADV_DIFF_JSON) ? readJSON(ADV_DIFF_JSON) : null;

  const paramNameOnlySpecSet = new Set();
  const paramNameMap = new Map();
  if(adv && Array.isArray(adv.paramNameOnlyDiffs)){
    for(const d of adv.paramNameOnlyDiffs){
      for(const s of d.spec){
        paramNameOnlySpecSet.add(s);
        const list = paramNameMap.get(s) || [];
        for(const c of d.client) list.push(c);
        paramNameMap.set(s, list);
      }
    }
  }

  let needsFix=0, updated=0, todo=0;
  for(const {key, app} of specKeys){
    const rec = progress[key];
    if(!rec) continue; // progress initialized should include all
    let note = rec.notes || '';
    const implemented = clientSet.has(key);
    const isParamNameOnly = paramNameOnlySpecSet.has(key);

    if(isParamNameOnly){
      rec.status = 'needs-fix';
      const examples = (paramNameMap.get(key)||[]).slice(0,2).join(' | ');
      note = note ? note : `Parameter token mismatch vs client: ${examples}`;
      rec.notes = note;
      needsFix++;
      updated++;
      continue;
    }
    if(!implemented){
      rec.status = 'needs-fix';
      note = note ? note : 'Missing in client (implement endpoint)';
      rec.notes = note;
      needsFix++;
      updated++;
      continue;
    }
    // Implemented exact match: keep as todo with a helpful note
    if(rec.status === 'todo' || !rec.status){
      const vHint = (rec.versions && rec.versions.length)? `Version hint: ${rec.versions.join(', ')}` : '';
      const defaultNote = ['Exists in client; verify semantics/headers', vHint].filter(Boolean).join(' — ');
      rec.notes = rec.notes || defaultNote;
      todo++;
      updated++;
    }
  }

  fs.writeFileSync(PROGRESS_JSON, JSON.stringify(progress,null,2));
  console.log(`Auto-tag complete. needs-fix: ${needsFix}, todo: ${todo}`);
}

try { main(); } catch(e){ console.error('qa-progress-auto-tag failed:', e.message); process.exit(1);} 

