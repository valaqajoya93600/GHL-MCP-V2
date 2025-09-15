#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PROGRESS_JSON = path.join(ROOT, 'reports', 'ghl-endpoints-progress.json');
const CLIENT_FILE = path.join(ROOT, 'src', 'clients', 'ghl-api-client.ts');

function loadClientKeys(){
  const src = fs.readFileSync(CLIENT_FILE,'utf8');
  const re=/this\.axiosInstance\.(get|post|put|delete|patch)\s*\(\s*([`"'])([\s\S]*?)\2/gm;
  const set = new Set(); let m;
  while((m=re.exec(src))!==null){
    const method=m[1].toUpperCase();
    const raw=m[3];
    // normalize
    const noQ = raw.split('?')[0];
    let p = noQ.startsWith('/')?noQ:'/'+noQ;
    if (p.length>1 && p.endsWith('/')) p = p.slice(0,-1);
    set.add(`${method} ${p}`);
  }
  return set;
}

function main(){
  const progress = JSON.parse(fs.readFileSync(PROGRESS_JSON,'utf8'));
  const clientSet = loadClientKeys();
  let changed=0; let fixed=0;
  for(const [key, rec] of Object.entries(progress)){
    if(rec.status==='needs-fix' && clientSet.has(key)){
      rec.status = 'todo';
      rec.notes = rec.notes ? `${rec.notes} | reconciled: spec tokens aligned in client` : 'reconciled: spec tokens aligned in client';
      changed++;
    }
    if(rec.status==='todo' && clientSet.has(key)){
      // leave as todo for manual verification
      fixed++;
    }
  }
  fs.writeFileSync(PROGRESS_JSON, JSON.stringify(progress,null,2));
  console.log(`Reconciled ${changed} needs-fix -> todo; todo present: ${fixed}`);
}

try { main(); } catch(e){ console.error('qa-progress-reconcile failed:', e.message); process.exit(1);} 

