import {referenceGroups} from './reference.mjs?v=20261005-ref';
import {drillLoaded,drillSetup} from './drills.mjs';

// The Python and pandas reference: look up how to do something, read a short example with its real output, and try it.
// An entry appears when its week starts. "Try it" runs the example in the same worker the code drills use.
export function createReference({getWeek,skills,esc,title,announce=()=>{},refresh}){
  const state={search:'',group:'all',open:{},editing:{},code:{},output:{},error:{},status:''};
  let worker=null,runTimer=null,runId=0,busy=null;
  const all=referenceGroups.flatMap(g=>g.entries.map(e=>({...e,group:g.id,groupTitle:g.title})));
  const released=()=>all.filter(e=>e.week<=getWeek());
  const find=id=>released().find(e=>e.id===id);
  const skillOf=e=>skills.find(s=>s.id===e.skill);
  const matches=e=>{
    if(state.group!=='all'&&e.group!==state.group)return false;
    const words=state.search.toLowerCase().split(/\s+/).filter(Boolean);
    const text=(e.code+' '+e.does+' '+e.groupTitle+' '+e.example).toLowerCase();
    return words.every(w=>text.includes(w));
  };
  function outputHTML(items){return items.length?items.map(o=>o.kind==='err'?`<span class="drill-err">${esc(o.text)}</span>`:esc(o.text)).join(''):'<span class="drill-dim">(no output)</span>';}

  function entryHTML(e){
    const s=skillOf(e),editing=state.editing[e.id],running=busy?.entry===e.id,open=state.open[e.id];
    const loaded=e.setup!=='none'&&drillLoaded[e.setup]?`<p class="drill-loaded">${drillLoaded[e.setup]}</p>`:'';
    const example=editing
      ?`<label class="editor-label" for="ref-code-${e.id}">Change the example and run it</label>
        <textarea class="editor ref-editor" id="ref-code-${e.id}" data-ref-code="${e.id}" spellcheck="false" autocapitalize="off" autocomplete="off" rows="${Math.max(4,(state.code[e.id]??e.example).split('\n').length+1)}" ${running?'readonly':''}>${esc(state.code[e.id]??e.example)}</textarea>
        <div class="actions drill-small-actions"><button class="primary" data-action="ref-run" data-id="${e.id}" ${busy?'disabled':''}>${running?'Running…':'Run'}</button>${running?`<button data-action="ref-stop" data-id="${e.id}">Stop</button>`:''}<button data-action="ref-reset" data-id="${e.id}" ${busy?'disabled':''}>Back to the example</button></div>
        ${running&&state.status?`<div class="feedback"><span class="busy-spinner" aria-hidden="true"></span>${esc(state.status)}</div>`:state.error[e.id]||''}
        ${state.output[e.id]?`<pre class="drill-output" aria-label="Output">${outputHTML(state.output[e.id])}</pre>`:''}`
      :`<pre class="code">${esc(e.example)}</pre>
        ${e.output?`<pre class="drill-output" aria-label="Output">${esc(e.output)}</pre>`:''}
        ${e.note?`<p class="micro">${esc(e.note)}</p>`:''}
        ${e.run?`<div class="actions drill-small-actions"><button data-action="ref-try" data-id="${e.id}">Try it</button></div>`:''}`;
    return `<details class="ref-entry" data-ref="${e.id}" ${open?'open':''}>
      <summary><code class="ref-code">${esc(e.code)}</code><span class="ref-does">${esc(e.does)}</span></summary>
      <div class="ref-body">
        <p class="ref-meta">Week ${e.week}${s?` · Skill: <a href="#skill/${s.id}">${esc(s.title)}</a>`:''}</p>${loaded}${example}
      </div></details>`;
  }

  function render(){
    const list=released(),hidden=all.length-list.length,shown=list.filter(matches);
    const groups=referenceGroups.filter(g=>list.some(e=>e.group===g.id));
    const sections=groups.map(g=>{const entries=shown.filter(e=>e.group===g.id);return entries.length?`<section class="ref-group" aria-labelledby="ref-${g.id}"><h2 id="ref-${g.id}">${esc(g.title)}</h2><div class="ref-list">${entries.map(entryHTML).join('')}</div></section>`:'';}).join('');
    return title('Python and pandas reference','Look up how to do something. Open an entry for a short example on the course data. New entries appear when their week starts.')+
      `<div class="filters"><label>Search<input id="ref-search" type="search" value="${esc(state.search)}" placeholder="For example: group, missing, sort" autocomplete="off"></label>
        <label>Topic<select id="ref-group"><option value="all" ${state.group==='all'?'selected':''}>All topics</option>${groups.map(g=>`<option value="${g.id}" ${state.group===g.id?'selected':''}>${esc(g.title)}</option>`).join('')}</select></label></div>
      <p class="drill-progress" id="ref-count"><strong>${shown.length} of ${list.length}</strong> entries shown${hidden?` · ${hidden} more open in later weeks`:''}</p>
      ${sections||`<div class="empty"><h2>No entries match</h2><p>Try a shorter word, or another topic.</p><button data-action="ref-clear">Show all entries</button></div>`}`;
  }

  function stop(message){
    clearTimeout(runTimer);worker?.terminate();worker=null;runId++;
    const id=busy?.entry;busy=null;state.status='';
    if(id&&message!==null)state.error[id]=`<div class="feedback needs-work"><strong>${esc(message||'The run was stopped. Your code is still here.')}</strong></div>`;
  }
  function start(e){
    if(!e||busy)return;
    const code=state.code[e.id]??e.example;
    if(code.length>20000){state.error[e.id]='<div class="feedback error">Keep your code below 20,000 characters.</div>';refresh();return;}
    const id=++runId;busy={entry:e.id};state.error[e.id]='';delete state.output[e.id];
    state.status=worker?'Running…':'Loading Python and pandas. The first run needs a download of about 30 MB.';
    try{
      if(!worker)worker=new Worker(new URL('./drill-worker.mjs?v=20261005-ref',import.meta.url),{type:'module'});
      worker.onerror=()=>{if(id===runId){stop('Python could not load. Check your connection and try again.');refresh();}};
      worker.onmessage=({data})=>{
        if(data.id!==runId)return;
        if(data.type==='loading')return;
        if(data.type==='running'){clearTimeout(runTimer);runTimer=setTimeout(()=>{stop('This took too long. Check for a loop that never ends, then try again.');refresh();},20000);state.status='Running…';refresh();return;}
        clearTimeout(runTimer);busy=null;state.status='';
        if(data.type==='error')state.error[e.id]=`<div class="feedback error"><strong>Something went wrong.</strong><p>${esc(data.message)}</p></div>`;
        else{state.output[e.id]=data.output;if(!data.ok)state.error[e.id]='<div class="feedback needs-work"><strong>The code stopped with an error.</strong><p>Read the last line of the error below first.</p></div>';announce(data.ok?'The code ran.':'The code stopped with an error.');}
        refresh();
      };
      runTimer=setTimeout(()=>{stop('Python did not finish loading. Check your connection and try again.');refresh();},120000);
      worker.postMessage({id,mode:'reference',setup:e.setup,packages:e.packages||[],code});
    }catch{stop('This browser could not start Python. Try a current browser.');}
    refresh();
  }

  function action(name,button){
    if(name==='ref-clear'){state.search='';state.group='all';return true;}
    const e=find(button?.dataset.id);if(!e)return false;
    if(name==='ref-try'){state.editing[e.id]=true;state.code[e.id]=e.example;state.open[e.id]=true;return true;}
    if(name==='ref-run'){start(e);return false;}
    if(name==='ref-stop'){stop();return true;}
    if(name==='ref-reset'){delete state.editing[e.id];delete state.code[e.id];delete state.output[e.id];state.error[e.id]='';return true;}
    return false;
  }
  // Search and topic redraw the list. Typing in an example only stores the text.
  function input(target){
    if(target.id==='ref-search'){state.search=target.value;return true;}
    if(target.dataset?.refCode){state.code[target.dataset.refCode]=target.value;}
    return false;
  }
  function change(target){if(target.id!=='ref-group')return false;state.group=target.value;return true;}
  // Remember which entries are open, so they stay open when the list is redrawn.
  function toggled(target){const id=target?.dataset?.ref;if(id&&target.matches('details.ref-entry'))state.open[id]=target.open;}
  function keydown(event){
    const id=event.target.dataset?.refCode;if(!id)return;
    if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){event.preventDefault();start(find(id));return;}
    if(event.key==='Enter'&&!event.shiftKey&&!event.altKey){const t=event.target,before=t.value.slice(0,t.selectionStart),line=before.slice(before.lastIndexOf('\n')+1),indent=line.match(/^ */)[0]+(/:\s*$/.test(line)?'    ':'');if(!indent)return;event.preventDefault();t.setRangeText('\n'+indent,t.selectionStart,t.selectionEnd,'end');state.code[id]=t.value;}
  }
  function counts(){return {open:released().length,total:all.length};}
  return {render,action,input,change,toggled,keydown,stop,counts,isBusy:()=>!!busy,setups:()=>Object.keys(drillSetup)};
}
