#!/usr/bin/env node
/**
 * Summarize MCP tool definitions and server routing coverage.
 * Outputs: reports/tools-summary.md
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TOOLS_DIR = path.join(ROOT, 'src', 'tools');
const SERVER_FILE = path.join(ROOT, 'src', 'server.ts');
const REPORTS_DIR = path.join(ROOT, 'reports');
const OUT = path.join(REPORTS_DIR, 'tools-summary.md');

function listToolFiles(){
  return fs.readdirSync(TOOLS_DIR).filter(f=>f.endsWith('.ts'));
}

function extractToolNamesFromFile(file){
  const src = fs.readFileSync(path.join(TOOLS_DIR, file), 'utf8');
  // Heuristic: within getToolDefinitions() or getTools(), find name: '...'
  const names = [];
  const re = /name:\s*'([^']+)'/g;
  let m; while((m=re.exec(src))!==null){ names.push(m[1]); }
  return names;
}

function extractServerAllowlists(){
  const src = fs.readFileSync(SERVER_FILE, 'utf8');
  const blocks = {};
  const reBlock = /private\s+is([A-Za-z0-9]+)Tool\(toolName: string\): boolean\s*{[\s\S]*?const\s+[a-zA-Z]+\s*=\s*\[([\s\S]*?)\];[\s\S]*?return\s+[a-zA-Z]+\.includes\(toolName\);[\s\S]*?}/g;
  let m;
  while((m=reBlock.exec(src))!==null){
    const family = m[1];
    const arr = m[2];
    const names = Array.from(arr.matchAll(/'([^']+)'/g)).map(x=>x[1]);
    blocks[family] = names;
  }
  return blocks;
}

function main(){
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  const toolFiles = listToolFiles();
  const byFile = toolFiles.map(f=>({ file:f, names: extractToolNamesFromFile(f) }));
  const serverLists = extractServerAllowlists();

  let md = '';
  md += '# MCP Tools Summary\n\n';
  md += '## Tool Files\n';
  for(const {file, names} of byFile){ md += `- ${file}: ${names.length} tools\n`; for(const n of names) md += `  - ${n}\n`; }

  md += '\n## Server Allowlists (is*Tool)\n';
  for(const [fam, names] of Object.entries(serverLists)){ md += `- ${fam}: ${names.length} names\n`; for(const n of names) md += `  - ${n}\n`; }

  // Simple coverage: every server allowlist name should appear in some tool file
  md += '\n## Coverage Checks\n';
  const toolNameSet = new Set(byFile.flatMap(x=>x.names));
  for(const [fam, names] of Object.entries(serverLists)){
    const missing = names.filter(n=>!toolNameSet.has(n));
    if(missing.length){ md += `- Missing tool definitions for ${fam}: ${missing.join(', ')}\n`; }
  }
  const serverNames = new Set(Object.values(serverLists).flat());
  const extra = [...toolNameSet].filter(n=>!serverNames.has(n));
  if(extra.length){ md += `- Tools defined but not included in any allowlist: ${extra.join(', ')}\n`; }

  fs.writeFileSync(OUT, md, 'utf8');
  console.log(`Wrote ${OUT}`);
}

try { main(); } catch (e) { console.error(e); process.exit(1);} 

