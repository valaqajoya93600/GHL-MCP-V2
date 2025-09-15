#!/usr/bin/env node
/**
 * Advanced diff: detects param-name-only differences via canonical path shapes.
 * Outputs:
 * - reports/ghl-qa-diff-advanced.json
 * - reports/ghl-qa-diff-advanced.md
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SPEC_DIR = path.join(ROOT, 'vendor', 'highlevel-api-docs', 'apps');
const CLIENT_FILE = path.join(ROOT, 'src', 'clients', 'ghl-api-client.ts');
const REPORT_DIR = path.join(ROOT, 'reports');
const JSON_OUT = path.join(REPORT_DIR, 'ghl-qa-diff-advanced.json');
const MD_OUT = path.join(REPORT_DIR, 'ghl-qa-diff-advanced.md');

function readJSON(f){ return JSON.parse(fs.readFileSync(f,'utf8')); }
function isHttpMethod(k){ return ['get','post','put','delete','patch','options','head'].includes(String(k).toLowerCase()); }
function normPath(p){ if(!p) return p; const q=p.split('?')[0]; let s=q.startsWith('/')?q:'/'+q; if(s.length>1 && s.endsWith('/')) s=s.slice(0,-1); return s; }
function canonPath(p){ return normPath(p).replace(/\{[^}]+\}/g, '{}'); }
function transformTmpl(s){ return s.replace(/\$\{([^}]+)\}/g, (m,g1)=>`{${g1.trim()}}`); }

function loadSpec(){
  const out=[]; const files = fs.readdirSync(SPEC_DIR).filter(f=>f.endsWith('.json'));
  for(const f of files){
    const app = path.basename(f, '.json');
    let j; try { j=readJSON(path.join(SPEC_DIR,f)); } catch { continue; }
    const paths = j.paths || {};
    for (const [raw, ops] of Object.entries(paths)){
      for (const [m, op] of Object.entries(ops||{})){
        if(!isHttpMethod(m)) continue;
        const versions=new Set();
        for(const p of (op.parameters||[])){
          if(String(p.name).toLowerCase()==='version' && p.schema && p.schema.enum){
            for(const v of p.schema.enum) versions.add(String(v));
          }
        }
        const key = `${m.toUpperCase()} ${normPath(raw)}`;
        out.push({ app, method:m.toUpperCase(), raw: normPath(raw), canon: `${m.toUpperCase()} ${canonPath(raw)}`, versions:[...versions] });
      }
    }
  }
  return out;
}

function loadClient(){
  const src = fs.readFileSync(CLIENT_FILE, 'utf8');
  const re=/this\.axiosInstance\.(get|post|put|delete|patch)\s*\(\s*([`"'])([\s\S]*?)\2/gm;
  const out=[]; let m;
  while((m=re.exec(src))!==null){
    const method=m[1].toUpperCase();
    const raw = normPath(transformTmpl(m[3]));
    out.push({ method, raw, canon:`${method} ${canonPath(raw)}` });
  }
  return out;
}

function main(){
  fs.mkdirSync(REPORT_DIR,{recursive:true});
  const spec=loadSpec();
  const client=loadClient();

  const specByCanon = new Map();
  for(const s of spec){
    const arr = specByCanon.get(s.canon) || [];
    arr.push(s);
    specByCanon.set(s.canon, arr);
  }
  const clientByCanon = new Map();
  for(const c of client){
    const arr = clientByCanon.get(c.canon) || [];
    arr.push(c);
    clientByCanon.set(c.canon, arr);
  }

  const canonSpecKeys = new Set(spec.map(s=>s.canon));
  const canonClientKeys = new Set(client.map(c=>c.canon));

  const canonicalMatches = [...canonSpecKeys].filter(k=>canonClientKeys.has(k));
  const paramNameOnlyDiffs = [];
  const exactMatches = [];
  for(const k of canonicalMatches){
    const ss = specByCanon.get(k)||[];
    const cs = clientByCanon.get(k)||[];
    // Compare all pairs; if any raw equals, mark exact; otherwise param-name-only
    let anyExact=false;
    for(const s of ss){ for(const c of cs){ if(`${s.method} ${s.raw}` === `${c.method} ${c.raw}`) anyExact=true; }}
    if(anyExact) exactMatches.push({ canon:k, spec: ss.map(x=>`${x.method} ${x.raw}`), client: cs.map(x=>`${x.method} ${x.raw}`)});
    else paramNameOnlyDiffs.push({ canon:k, spec: ss.map(x=>`${x.method} ${x.raw}`), client: cs.map(x=>`${x.method} ${x.raw}`)});
  }

  const missingCanon = [...canonSpecKeys].filter(k=>!canonClientKeys.has(k));
  const clientOnlyCanon = [...canonClientKeys].filter(k=>!canonSpecKeys.has(k));

  const result = {
    generatedAt: new Date().toISOString(),
    totals: {
      specEndpoints: spec.length,
      clientEndpoints: client.length,
      canonicalMatches: canonicalMatches.length,
      exactMatches: exactMatches.length,
      paramNameOnlyDiffs: paramNameOnlyDiffs.length,
      missingFromClient: missingCanon.length,
      clientOnly: clientOnlyCanon.length
    },
    paramNameOnlyDiffs,
    missingFromClient: missingCanon.map(k=>({ canon:k, spec: (specByCanon.get(k)||[]).map(x=>({ app:x.app, endpoint:`${x.method} ${x.raw}`, versions:x.versions })) })),
    clientOnly: clientOnlyCanon.map(k=>({ canon:k, client: (clientByCanon.get(k)||[]).map(x=>`${x.method} ${x.raw}`) }))
  };
  fs.writeFileSync(JSON_OUT, JSON.stringify(result,null,2));

  // Markdown
  let md='';
  md += '# GHL QA Diff (Advanced Canonical)\n\n';
  md += `Generated: ${result.generatedAt}\n\n`;
  md += `- Spec: ${result.totals.specEndpoints}\n- Client: ${result.totals.clientEndpoints}\n- Canonical matches: ${result.totals.canonicalMatches}\n- Exact matches: ${result.totals.exactMatches}\n- Param-name-only diffs: ${result.totals.paramNameOnlyDiffs}\n- Missing from client (canonical): ${result.totals.missingFromClient}\n- Client only (canonical): ${result.totals.clientOnly}\n\n`;
  md += '## Param-name-only Differences\n';
  if(result.paramNameOnlyDiffs.length===0) md+='- None\n';
  else for(const d of result.paramNameOnlyDiffs.slice(0,200)){ md += `- ${d.canon}\n  - spec: ${d.spec.join('; ')}\n  - client: ${d.client.join('; ')}\n`; }
  md += '\n## Missing From Client (Canonical)\n';
  for(const m of result.missingFromClient.slice(0,400)){
    md += `- ${m.canon}\n`;
    for(const s of m.spec){ md += `  - ${s.endpoint}${s.versions && s.versions.length?` (Version: ${s.versions.join(', ')})`:''}\n`; }
  }
  md += '\n## Client Only (Canonical)\n';
  for(const c of result.clientOnly.slice(0,400)){
    md += `- ${c.canon}\n`;
    for(const e of c.client){ md += `  - ${e}\n`; }
  }
  fs.writeFileSync(MD_OUT, md, 'utf8');
  console.log(`Wrote advanced diff to ${MD_OUT}`);
}

try { main(); } catch(e){ console.error('qa-diff-advanced failed:', e.message); process.exit(1);} 

