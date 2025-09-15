#!/usr/bin/env node
/**
 * Generate detailed per-app QA docs:
 * - Param-name-only mismatches: show spec vs client candidates + recommended fix
 * - Missing endpoints: show method/path + summary + version hints
 * Output: reports/apps/<app>-detail.md
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SPEC_DIR = path.join(ROOT, 'vendor', 'highlevel-api-docs', 'apps');
const CLIENT_FILE = path.join(ROOT, 'src', 'clients', 'ghl-api-client.ts');
const OUT_DIR = path.join(ROOT, 'reports', 'apps');

function readJSON(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function isHttpMethod(k){ return ['get','post','put','delete','patch','options','head'].includes(String(k).toLowerCase()); }
function normPath(p){ if(!p) return p; const q=p.split('?')[0]; let s=q.startsWith('/')?q:'/'+q; if(s.length>1 && s.endsWith('/')) s=s.slice(0,-1); return s; }
function canonPath(p){ return normPath(p).replace(/\{[^}]+\}/g, '{}'); }
function transformTmpl(s){ return s.replace(/\$\{([^}]+)\}/g, (m,g1)=>`{${g1.trim()}}`); }

function loadClient(){
  const src = fs.readFileSync(CLIENT_FILE, 'utf8');
  const re=/this\.axiosInstance\.(get|post|put|delete|patch)\s*\(\s*([`"'])([\s\S]*?)\2/gm;
  const list=[]; let m;
  while((m=re.exec(src))!==null){
    const method=m[1].toUpperCase();
    const raw = normPath(transformTmpl(m[3]));
    list.push({ method, raw, canon: `${method} ${canonPath(raw)}`, key: `${method} ${raw}` });
  }
  const byCanon = new Map();
  for(const e of list){ const arr = byCanon.get(e.canon) || []; arr.push(e); byCanon.set(e.canon, arr); }
  const keySet = new Set(list.map(e=>e.key));
  return { list, byCanon, keySet };
}

function loadAppSpec(app){
  const file = path.join(SPEC_DIR, `${app}.json`);
  const json = readJSON(file);
  const out=[];
  const paths = json.paths || {};
  for(const [rawPath, ops] of Object.entries(paths)){
    for(const [m, op] of Object.entries(ops||{})){
      if(!isHttpMethod(m)) continue;
      const method = m.toUpperCase();
      const key = `${method} ${normPath(rawPath)}`;
      const canon = `${method} ${canonPath(rawPath)}`;
      const versions = new Set();
      for(const p of (op.parameters||[])){
        if(String(p.name).toLowerCase()==='version' && p.schema && p.schema.enum){
          for(const v of p.schema.enum) versions.add(String(v));
        }
      }
      out.push({ key, method, raw: normPath(rawPath), canon, summary: op.summary || '', operationId: op.operationId || '', versions: [...versions] });
    }
  }
  return out;
}

function buildDetail(app){
  const client = loadClient();
  const spec = loadAppSpec(app);

  const paramDiffs=[]; const missing=[]; const exact=[];
  for(const s of spec){
    const implementedExact = client.keySet.has(s.key);
    if(implementedExact){ exact.push(s); continue; }
    const canonCandidates = client.byCanon.get(s.canon) || [];
    if(canonCandidates.length>0){
      paramDiffs.push({ spec:s, candidates: canonCandidates.map(c=>c.key) });
    } else {
      missing.push(s);
    }
  }

  // Build markdown
  let md='';
  md += `# ${app} — Detailed QA\n\n`;
  const vAll = new Set(); spec.forEach(s=>s.versions.forEach(v=>vAll.add(v)));
  if(vAll.size>0) md += `Version hints present in spec: ${[...vAll].join(', ')}\n\n`;

  md += '## Param-name-only Differences\n';
  if(paramDiffs.length===0) md += '- None\n';
  for(const d of paramDiffs){
    const s = d.spec;
    const vHint = s.versions.length? ` (Version: ${s.versions.join(', ')})`:'';
    md += `- ${s.key}${vHint}\n  - summary: ${s.summary || 'n/a'}\n  - client candidates: ${d.candidates.join(' | ')}\n  - recommended: update client path to '${s.key.split(' ')[1]}' to match spec\n`;
  }

  md += '\n## Missing Endpoints\n';
  if(missing.length===0) md += '- None\n';
  for(const s of missing){
    const vHint = s.versions.length? ` (Version: ${s.versions.join(', ')})`:'';
    md += `- ${s.key}${vHint}\n  - summary: ${s.summary || 'n/a'}\n  - recommended: implement client method for this endpoint\n`;
  }

  return md;
}

function main(){
  const appsArg = process.argv.slice(2);
  let targets = appsArg;
  if (!targets.length) {
    // Default to all spec apps
    const SPEC_DIR = path.join(ROOT, 'vendor', 'highlevel-api-docs', 'apps');
    targets = require('fs')
      .readdirSync(SPEC_DIR)
      .filter(f=>f.endsWith('.json'))
      .map(f=>f.replace(/\.json$/, ''))
      .sort();
  }
  fs.mkdirSync(OUT_DIR,{recursive:true});
  for(const app of targets){
    const out = buildDetail(app);
    const outPath = path.join(OUT_DIR, `${app}-detail.md`);
    fs.writeFileSync(outPath, out, 'utf8');
    console.log(`Wrote ${outPath}`);
  }
}

try { main(); } catch(e){ console.error('qa-app-detail failed:', e.message); process.exit(1);} 
