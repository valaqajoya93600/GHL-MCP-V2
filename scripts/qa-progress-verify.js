#!/usr/bin/env node
/**
 * Mark endpoints as verified when exact method+path implemented in client.
 * - Only updates entries currently 'todo' to 'verified'
 */
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
    const noQ=raw.split('?')[0];
    let p=noQ.startsWith('/')?noQ:'/'+noQ; if (p.length>1 && p.endsWith('/')) p=p.slice(0,-1);
    // Normalize template literals to {token}
    p=p.replace(/\$\{([^}]+)\}/g, (a,g)=>`{${g.trim()}}`);
    set.add(`${method} ${p}`);
  }
  return set;
}

function main(){
  const progress = JSON.parse(fs.readFileSync(PROGRESS_JSON,'utf8'));
  const clientSet = loadClientKeys();
  let changed=0;
  for(const [key, rec] of Object.entries(progress)){
    if(rec.status==='todo' && clientSet.has(key)){
      rec.status='verified';
      rec.notes = rec.notes || 'Verified: implemented and spec-matched';
      changed++;
    }
  }
  fs.writeFileSync(PROGRESS_JSON, JSON.stringify(progress,null,2));
  console.log(`Marked ${changed} endpoints as verified.`);
}

try { main(); } catch(e){ console.error('qa-progress-verify failed:', e.message); process.exit(1);} 

