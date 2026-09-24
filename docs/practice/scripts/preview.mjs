// Development only. Binds loopback, uses an isolated temporary database, and collects anonymous test events.
// Not included in the hosted worker or public asset allowlist.
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {webcrypto} from 'node:crypto';
import {api} from '../server.mjs';
import {sqliteDatabase} from '../tests/sqlite-adapter.mjs';
globalThis.crypto??=webcrypto;
const dir=mkdtempSync(join(tmpdir(),'practice-preview-'));
const env={DB:sqliteDatabase(join(dir,'preview.sqlite')),CLASS_CODE:'a'.repeat(48),REPORT_KEY:'local-preview-only'};
const files=new Set(['index.html','styles.css','app.mjs','catalog.mjs','schedule.mjs','flashcards.mjs','flashcard-ui.mjs','exercises.mjs','python-worker.mjs','skill-checks.mjs','activity-client.mjs']);
createServer(async(req,res)=>{
 try{
 const url=new URL(req.url,'http://127.0.0.1:8766');
 if(url.pathname.startsWith('/api/')){
  const parts=[];for await(const part of req)parts.push(part);
  const headers={...req.headers};
  const request=new Request(url,{method:req.method,headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(parts)}:{})});
  const response=await api(request,env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));return;
 }
 const file=url.pathname==='/'?'index.html':url.pathname.slice(1);
 if(!files.has(file)){res.writeHead(404);res.end();return;}
 const text=await readFile(new URL('../'+file,import.meta.url));res.setHeader('Content-Type',file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':'text/javascript');res.end(text);
 }catch(e){res.writeHead(500);res.end('Preview error');console.error(e);}
}).listen(8766,'127.0.0.1',()=>console.log('Local practice preview: http://127.0.0.1:8766/#class/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa (disposable data)'));
