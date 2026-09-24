// Local test/preview adapter: execute the production SQL against a real SQLite file.
import {spawnSync} from 'node:child_process';
import {readFileSync,readdirSync} from 'node:fs';
export function sqliteDatabase(filename){
  function execute(sql,args=[],script=false){
    const python=`import sqlite3,json,sys\np=json.load(sys.stdin)\nc=sqlite3.connect(p['file'])\nc.row_factory=sqlite3.Row\nif p['script']:\n c.executescript(p['sql']);result=[]\nelse:\n result=[dict(r) for r in c.execute(p['sql'],p['args']).fetchall()]\nc.commit()\nprint(json.dumps(result))\n`;
    const result=spawnSync('python3',['-c',python],{input:JSON.stringify({file:filename,sql,args,script}),encoding:'utf8'});
    if(result.status!==0)throw new Error(result.stderr);
    return JSON.parse(result.stdout);
  }
  for(const name of readdirSync(new URL('../drizzle/',import.meta.url)).filter(n=>n.endsWith('.sql')).sort())execute(readFileSync(new URL('../drizzle/'+name,import.meta.url),'utf8'),[],true);
  return {async batch(statements){return Promise.all(statements.map(s=>s.run()));},prepare(sql){let args=[];return {bind(...values){args=values;return this;},async first(){return execute(sql,args)[0]||null;},async all(){return {results:execute(sql,args)};},async run(){execute(sql,args);return {success:true};}};}};
}
