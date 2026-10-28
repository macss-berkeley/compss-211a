import {EXAMPLES, STOP_WORDS, buildModel, experiment, search, pairwiseSimilarity} from './model.mjs';
import {makePythonExample} from './python-example.mjs';

const $ = selector => document.querySelector(selector);
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = value => value.toFixed(2);
const steps = ['words', 'counts', 'vocabulary', 'tfidf', 'practice', 'similarity', 'search'];
const state = {texts:EXAMPLES.slice(), stage:'words', term:'cat', doc:0,
  stop:false, bigrams:false, fixed:false, matrix:'weights', query:'cat mat', searchMode:'weights', simMode:'weights', pair:[0,1]};
let model, timer;

function updateModel() {
  model = buildModel(state.texts, state);
  if (!model.vocabulary.includes(state.term)) state.term = model.vocabulary[0] || '';
  state.doc = Math.min(state.doc, model.n - 1);
}

function docList() {
  $('#doc-list').innerHTML = state.texts.map((text, i) => `<li><b>D${i+1}</b>${esc(text)}</li>`).join('');
}

function editors() {
  $('#docs').classList.toggle('four', state.texts.length === 4);
  $('#docs').innerHTML = state.texts.map((text, i) => `<div class="doc"><label for="doc-${i}">D${i+1}</label><textarea id="doc-${i}" data-editor="${i}" rows="2" maxlength="3000" spellcheck="false">${esc(text)}</textarea></div>`).join('');
}

function heading(title, prompt) {
  return `<h2 id="stage-title" tabindex="-1">${title}</h2><p class="intro">${prompt}</p>`;
}

function selection() {
  if (!model.vocabulary.length) return '';
  return `<div class="selection"><label for="selected-term">Word</label><select id="selected-term">${model.vocabulary.map(t => `<option ${state.term===t?'selected':''}>${esc(t)}</option>`).join('')}</select><label for="selected-doc">in</label><select id="selected-doc">${state.texts.map((_,i) => `<option value="${i}" ${state.doc===i?'selected':''}>D${i+1}</option>`).join('')}</select></div>`;
}

function matrix(mode) {
  if (!model.vocabulary.length) return '<p class="empty">No terms remain. Edit a text or change the vocabulary choices.</p>';
  const values = mode==='weights' ? model.weights : model.counts;
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="${mode==='weights'?'TF-IDF':'Word-count'} matrix; scroll for more columns"><table><caption class="sr-only">One document per row, one term per column. Select a cell to inspect it.</caption><thead><tr><th scope="col">Document</th>${model.vocabulary.map(t => `<th scope="col" class="${t===state.term?'column':''}">${esc(t)}</th>`).join('')}</tr></thead><tbody>${values.map((row,i) => `<tr><th scope="row" class="${state.doc===i?'active-row':''}">D${i+1}</th>${row.map((v,j) => `<td class="${model.vocabulary[j]===state.term?'column':''}"><button type="button" class="cell ${v===0?'zero':''} ${state.doc===i&&model.vocabulary[j]===state.term?'active':''}" data-cell="${i}" data-term="${esc(model.vocabulary[j])}" aria-pressed="${state.doc===i&&model.vocabulary[j]===state.term}" aria-label="D${i+1}, ${esc(model.vocabulary[j])}: ${mode==='weights'?fmt(v):v}">${mode==='weights'?fmt(v):v}</button></td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function metric(value, label) {
  return `<div class="metric"><span class="value">${value}</span><span class="label">${label}</span></div>`;
}

function highlightedPython(source) {
  const tokens=/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[^\n]*|\b(?:from|import|as|True|False|None|CountVectorizer|TfidfVectorizer|DataFrame|cosine_similarity|fit_transform|get_feature_names_out|toarray|print)\b)/g;
  let result='', previous=0;
  for (const match of source.matchAll(tokens)) {
    const token=match[0];
    const kind=/^["']/.test(token)?'string':token.startsWith('#')?'comment':/^(from|import|as|True|False|None)$/.test(token)?'keyword':'function';
    result+=esc(source.slice(previous,match.index))+`<span class="py-${kind}">${esc(token)}</span>`;
    previous=match.index+token.length;
  }
  return result+esc(source.slice(previous));
}

function pythonPanel(kind) {
  if(!model.vocabulary.length)return '';
  const example=makePythonExample(state.texts,state,kind);
  return `<details class="python-example"><summary>The same example in Python</summary><div class="code-toolbar"><span>${example.vectorizer}</span><button type="button" data-copy-python="${kind}">Copy complete example</button></div><pre><code>${highlightedPython(example.body)}</code></pre><details class="python-inputs"><summary>Imports and texts</summary><pre><code>${highlightedPython(example.setup)}</code></pre></details><p class="copy-status small" role="status"></p></details>`;
}

function words() {
  return heading('Split each document into words', 'Each document is split into words, called <b>tokens</b>. This step is called <b>tokenization</b>. All words are made lowercase, punctuation is removed, and one-letter words are left out. The right column shows each document as a <b>bag of words</b>: the same words, sorted, without their original order.')+
    `<div class="word-heads"><span></span><span>Words in their original order</span><span></span><span>Bag of words (sorted)</span></div>`+
    model.tokens.map((row,i) => {
      const bag = [...row].sort();
      const chips = terms => terms.map(t => `<button type="button" class="token ${t===state.term?'selected':''}" data-token="${esc(t)}">${esc(t)}</button>`).join('');
      return `<div class="token-row"><span class="doc-id">D${i+1}</span><div class="tokens">${chips(row)||'<span class="small">No word tokens</span>'}</div><span class="arrow" aria-hidden="true">→</span><div class="tokens bag">${chips(bag)||'<span class="small">Empty bag</span>'}</div></div>`;
    }).join('')+'<p class="small">Select a word to highlight it in this tab and the next tabs.</p>';
}

function counts() {
  const j = model.vocabulary.indexOf(state.term);
  return heading('Count each word in each document', 'This table is a <b>document–word matrix</b>. Each row is a document, and each column is a word that appears in at least one document. Each cell is the number of times the word appears in the document. Select a cell to see its counts below the table.')+
    `<div class="stage-bar">${selection()}</div>`+matrix('counts')+
    (j<0?'':`<div class="metrics">${metric(model.counts[state.doc][j],`times “${esc(state.term)}” appears in D${state.doc+1}`)}${metric(model.totals[j],'times it appears in all documents')}${metric(`${model.df[j]} / ${model.n}`,'documents that contain it')}</div>`)+pythonPanel('counts');
}

function vocabulary() {
  return heading('Choose which words become columns', 'The columns of the table are the <b>vocabulary</b>. Three settings change it. <b>Stop words</b> are common words, such as <i>the</i> and <i>of</i>, that are removed. <b>Bigrams</b> are pairs of neighboring words, such as <i>cat sat</i>, added as extra columns. A fixed list keeps only the words it names. Tick a setting to see which columns are removed or added.')+
    `<div class="controls"><label class="check-option"><input type="checkbox" data-option="stop" ${state.stop?'checked':''}>Remove stop words: ${STOP_WORDS.join(', ')}</label><label class="check-option"><input type="checkbox" data-option="bigrams" ${state.bigrams?'checked':''}>Add bigrams (word pairs)</label><label class="check-option"><input type="checkbox" data-option="fixed" ${state.fixed?'checked':''}>Keep only cat, mat and rug</label></div>`+
    `<div class="metrics">${metric(model.n,'documents')}${metric(model.vocabulary.length,'word columns')}${metric(model.cells?`${Math.round(100*model.zeros/model.cells)}%`:'—','cells that are 0')}</div>`+
    matrix('counts')+`<p class="small">Bigrams are made after the stop words are removed.</p>`;
}

function tfidf() {
  const j = model.vocabulary.indexOf(state.term), i=state.doc;
  const modes = `<div class="segmented" aria-label="Matrix values"><button type="button" data-matrix="counts" aria-pressed="${state.matrix==='counts'}">Counts</button><button type="button" data-matrix="weights" aria-pressed="${state.matrix==='weights'}">TF-IDF</button></div>`;
  let trace = '';
  if (j>=0) trace = `<div class="calc" aria-label="Weight calculation for ${esc(state.term)} in D${i+1}"><div><span class="number">${model.counts[i][j]}</span><span class="label">TF: count in D${i+1}</span></div><span class="op" aria-hidden="true">×</span><div><span class="number">${fmt(model.idf[j])}</span><span class="label">IDF: in ${model.df[j]} of ${model.n} documents</span></div><span class="op" aria-hidden="true">=</span><div><span class="number">${fmt(model.raw[i][j])}</span><span class="label">TF × IDF</span></div><span class="op" aria-hidden="true">→</span><div class="result"><span class="number">${fmt(model.weights[i][j])}</span><span class="label">weight after rescaling the row</span></div></div>`;
  return heading('Weight each word by how many documents contain it', '<b>TF-IDF</b> replaces each count with a weight. <b>TF</b> (term frequency) is the count from tab 2. <b>IDF</b> (inverse document frequency) is smaller for words that appear in many documents and larger for words that appear in few. The weight is TF × IDF. Each row is then rescaled to the same length, so that long and short documents can be compared. Select a cell to see how its weight is calculated below the table.')+
    `<div class="stage-bar">${selection()}${modes}</div>`+matrix(state.matrix)+trace+
    `<details class="formula"><summary>How these numbers are calculated</summary><p>TF is the word count. Smoothed IDF = <code>1 + ln((1 + N) / (1 + DF))</code>. Multiply TF by IDF, then divide each value by the length of its document’s row (L2 normalization).</p><p>These are the defaults used by <code>TfidfVectorizer()</code> in the notebook. A word found in every document has IDF = 1. The final weights are not percentages.</p></details>`+pythonPanel('tfidf');
}

function similarTexts() {
  const scores=pairwiseSimilarity(model,state.simMode);
  const pairs=[];
  for(let i=0;i<model.n;i++)for(let j=i+1;j<model.n;j++)pairs.push({i,j,score:scores[i][j]});
  pairs.sort((a,b)=>b.score-a.score||a.i-b.i||a.j-b.j);
  if(state.pair.some(i=>i>=model.n))state.pair=[0,1];
  const [a,b]=state.pair;
  const shared=model.vocabulary.filter((_,j)=>model.counts[a][j]>0&&model.counts[b][j]>0);
  const matches=shared.map(term=>({term}));
  const emptyRows=model.counts.flatMap((row,i)=>row.some(v=>v>0)?[]:[`D${i+1}`]);
  const table=`<div class="table-wrap similarity-table"><table><caption class="sr-only">Cosine similarity between the numeric document rows. Select two different documents.</caption><thead><tr><th scope="col">Document</th>${model.texts.map((_,i)=>`<th scope="col">D${i+1}</th>`).join('')}</tr></thead><tbody>${scores.map((row,i)=>`<tr><th scope="row">D${i+1}</th>${row.map((v,j)=>`<td style="background:rgba(253,186,18,${(v*.45).toFixed(3)})">${i===j?`<span class="self-score">${fmt(v)}</span>`:`<button type="button" class="cell ${Math.min(a,b)===Math.min(i,j)&&Math.max(a,b)===Math.max(i,j)?'active':''}" data-pair="${i},${j}" aria-label="Compare D${i+1} and D${j+1}: ${fmt(v)}">${fmt(v)}</button>`}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  return heading('Compare documents', 'Each document is now a row of numbers. <b>Cosine similarity</b> compares two rows. It is 0 when two documents share no words and 1 when they contain the same words in the same proportions. The table shows the score for every pair. Select a cell to see the two documents and the words they share.')+
    `<div class="stage-bar"><label class="check-option"><input type="checkbox" data-option="stop" ${state.stop?'checked':''}>Remove stop words: ${STOP_WORDS.join(', ')}</label><div class="segmented" aria-label="Vectors to compare"><button type="button" data-sim-mode="counts" aria-pressed="${state.simMode==='counts'}">Counts</button><button type="button" data-sim-mode="weights" aria-pressed="${state.simMode==='weights'}">TF-IDF</button></div></div>`+
    `<div class="similarity-layout">${table}<div class="pair-detail"><h3>D${a+1} + D${b+1} <span class="pair-score">${fmt(scores[a][b])}</span></h3><p>${markedText(model.texts[a],matches)}</p><p>${markedText(model.texts[b],matches)}</p><div class="shared-terms"><span class="small">Shared words</span>${shared.map(t=>`<span class="shared-term">${esc(t)}</span>`).join('')||'<span>None</span>'}</div></div></div>`+
    `<div class="similarity-result"><span>${pairs[0]?.score>0?`Most similar: <b>D${pairs[0].i+1} and D${pairs[0].j+1}</b>`:'No two documents share a word.'}</span></div>`+
    (emptyRows.length?`<p class="small">${emptyRows.join(', ')} ${emptyRows.length===1?'has':'have'} no words left. Their similarity scores are shown as 0.</p>`:'')+
    pythonPanel('similarity');
}

const questions = [
  {id:'total', prompt:'How many times does “the” occur across all three documents?', numeric:true, answer:'5', hint:'Count every occurrence, including repeats within a document.', why:'D1 has 2, D2 has 2, and D3 has 1: 5 occurrences.'},
  {id:'documents', prompt:'How many documents contain “cat”?', numeric:true, answer:'2', hint:'Count documents, not occurrences.', why:'D1 and D2 contain cat: 2 of the 3 documents.'},
  {id:'order', prompt:'If the words in D1 are rearranged, do its word counts change?', choices:[['yes','Yes'],['no','No']], answer:'no', hint:'The words are the same; only their positions change.', why:'No. A bag of words leaves out word order.'},
  {id:'weight', prompt:'In D1, “cat” and “mat” both occur once. Which has the larger TF-IDF weight?', choices:[['cat','cat'],['mat','mat'],['equal','Same weight']], answer:'mat', hint:'Compare how many documents contain each word.', why:'Mat: 0.49, compared with cat: 0.37. Mat occurs in fewer documents.'}
];
const answers = new Map();

function practice() {
  return heading('Practice questions', 'The questions use the original three documents.')+
    `<div class="practice-texts">${EXAMPLES.map((t,i)=>`<p><b>D${i+1}</b> ${esc(t)}</p>`).join('')}</div>`+
    questions.map((q,i) => `<form class="question" data-question="${q.id}"><fieldset><legend>${i+1}. ${q.prompt}</legend><div class="answers">${q.numeric?`<label class="sr-only" for="answer-${q.id}">Your answer</label><input type="number" id="answer-${q.id}" name="answer" min="0" step="1" inputmode="numeric" required>`:q.choices.map(([v,t])=>`<label><input type="radio" name="answer" value="${v}" required>${t}</label>`).join('')}<button type="submit" class="check-answer">Check</button></div></fieldset><div class="feedback" id="feedback-${q.id}" role="status" hidden></div></form>`).join('');
}

function markedText(text, matches) {
  const terms = new Set(matches.map(m=>m.term));
  return text.split(/([\p{L}\p{N}_]+)/gu).map(part => terms.has(part.toLowerCase())?`<mark>${esc(part)}</mark>`:esc(part)).join('');
}

function searchView() {
  const results = search(model,state.query,state.searchMode);
  const matches = results.some(r=>r.score>0);
  return heading('Search the documents', 'A simple search uses the same table. For each document, it adds up the numbers for the search words, and the document with the highest total is listed first. The buttons switch between counts and TF-IDF weights.')+
    `<form class="query-form" id="search-form"><label class="sr-only" for="query">Search words</label><input type="search" id="query" value="${esc(state.query)}" placeholder="cat mat" maxlength="200"><button type="submit" class="primary">Search</button></form>`+
    `<div class="segmented" aria-label="Search values"><button type="button" data-search="counts" aria-pressed="${state.searchMode==='counts'}">Counts</button><button type="button" data-search="weights" aria-pressed="${state.searchMode==='weights'}">TF-IDF</button></div>`+
    (matches?'':`<p class="empty">None of the search words are in the vocabulary.</p>`)+
    results.map(r=>`<div class="search-result"><span class="doc-id">D${r.document+1}</span><div><p>${markedText(r.text,r.matches)}</p><div class="matched">${r.matches.map(m=>`${esc(m.term)} ${state.searchMode==='counts'?m.value:m.value.toFixed(3)}`).join(' + ')||'No matching words'}</div></div><span class="score">${state.searchMode==='counts'?r.score:r.score.toFixed(3)}</span></div>`).join('')+
    `<p class="small">The search adds up the ${state.searchMode==='counts'?'counts':'TF-IDF weights'} of the search words. A word repeated in the search counts once.</p>`;
}

function restoreAnswers() {
  for (const [id, entry] of answers) {
    const form = $(`[data-question="${id}"]`);
    if (!form) continue;
    form.elements.answer.value=entry.value;
    const el=$(`#feedback-${id}`);
    el.hidden=false; el.className=`feedback ${entry.correct?'good':'bad'}`; el.textContent=entry.feedback;
  }
}

function render() {
  const active=document.activeElement;
  const focusedInStage=$('#stage').contains(active);
  const focusId=focusedInStage?active.id:'';
  const focusData=focusedInStage?Object.entries(active.dataset):[];
  const scrollLeft=$('.table-wrap')?.scrollLeft||0;
  const pythonOpen=$('.python-example')?.open;
  const inputsOpen=$('.python-inputs')?.open;
  const formulaOpen=$('.formula')?.open;
  updateModel();
  const views = {words, counts, vocabulary, tfidf, practice, similarity:similarTexts, search:searchView};
  $('#stage').innerHTML=views[state.stage]();
  docList();
  $('#stage').setAttribute('aria-labelledby',`tab-${state.stage}`);
  $('#experiment').closest('label').hidden=state.stage==='practice';
  $('#corpus details').hidden=state.stage==='practice';
  document.querySelectorAll('[data-stage]').forEach(b=>{
    b.setAttribute('aria-selected',String(b.dataset.stage===state.stage));
    b.tabIndex=b.dataset.stage===state.stage?0:-1;
  });
  const index=steps.indexOf(state.stage);
  $('#previous').disabled=index===0;
  $('#next').disabled=index===steps.length-1;
  $('#next').textContent=index===3?'Next: practice':index===4?'Next: similar documents':index===5?'Optional: search':'Next';
  $('#progress').textContent=index<6?`${index+1} of 6`:'Optional application';
  if (state.stage==='practice') restoreAnswers();
  if ($('.table-wrap')) $('.table-wrap').scrollLeft=scrollLeft;
  if ($('.python-example')&&pythonOpen) $('.python-example').open=true;
  if ($('.python-inputs')&&inputsOpen) $('.python-inputs').open=true;
  if ($('.formula')&&formulaOpen) $('.formula').open=true;
  if (focusId) document.getElementById(focusId)?.focus({preventScroll:true});
  else if (focusData.length) {
    const replacement=[...$('#stage').querySelectorAll('button,input')].find(el=>focusData.every(([k,v])=>el.dataset[k]===v));
    replacement?.focus({preventScroll:true});
  }
}

function go(stage, focus=true) {
  clearTimeout(timer); state.stage=stage; render();
  if (focus) $('#stage-title').focus({preventScroll:true});
}

$('#docs').addEventListener('input',event=>{
  const i=event.target.dataset.editor;
  if(i===undefined) return;
  state.texts[Number(i)]=event.target.value;
  $('#experiment').value='';
  clearTimeout(timer); timer=setTimeout(()=>{render();$('#announcement').textContent='The tables have been updated.';},150);
});
$('#experiment').addEventListener('change',event=>{
  clearTimeout(timer); state.texts=experiment(event.target.value); state.doc=0;editors();render();
  $('#announcement').textContent='Example changed. All tables have been recalculated.';
});
$('#reset').addEventListener('click',()=>{
  clearTimeout(timer); Object.assign(state,{texts:EXAMPLES.slice(),term:'cat',doc:0,stop:false,bigrams:false,fixed:false,matrix:'weights',query:'cat mat',searchMode:'weights',simMode:'weights',pair:[0,1]});
  $('#experiment').value='original';answers.clear();editors();render();$('#announcement').textContent='Original texts and settings restored.';
});
$('.steps').addEventListener('click',event=>{const b=event.target.closest('[data-stage]');if(b)go(b.dataset.stage);});
$('.steps').addEventListener('keydown',event=>{
  const b=event.target.closest('[data-stage]');if(!b)return;
  const i=steps.indexOf(b.dataset.stage);
  let n;
  if(event.key==='ArrowRight')n=(i+1)%steps.length;
  if(event.key==='ArrowLeft')n=(i+steps.length-1)%steps.length;
  if(event.key==='Home')n=0;
  if(event.key==='End')n=steps.length-1;
  if(n!==undefined){event.preventDefault();go(steps[n],false);$(`#tab-${steps[n]}`).focus();}
});
$('#previous').addEventListener('click',()=>go(steps[steps.indexOf(state.stage)-1]));
$('#next').addEventListener('click',()=>go(steps[steps.indexOf(state.stage)+1]));
$('#stage').addEventListener('click',async event=>{
  const b=event.target.closest('button');if(!b)return;
  if(b.dataset.copyPython){
    const example=makePythonExample(state.texts,state,b.dataset.copyPython);
    try {
      await navigator.clipboard.writeText(example.script);
      if($('.copy-status'))$('.copy-status').textContent='Complete example copied. Paste it into your notebook.';
    } catch {
      if($('.copy-status'))$('.copy-status').textContent='Copy is unavailable here. Open “Imports and texts” and copy both code blocks.';
    }
    return;
  }
  if(b.dataset.pair){state.pair=b.dataset.pair.split(',').map(Number);render();return;}
  if(b.dataset.simMode){state.simMode=b.dataset.simMode;render();return;}
  if(b.dataset.token!==undefined){state.term=b.dataset.token;render();return;}
  if(b.dataset.cell!==undefined){state.doc=Number(b.dataset.cell);state.term=b.dataset.term;render();return;}
  if(b.dataset.matrix){state.matrix=b.dataset.matrix;render();return;}
  if(b.dataset.search){state.searchMode=b.dataset.search;render();}
});
$('#stage').addEventListener('change',event=>{
  if(event.target.id==='selected-term'){state.term=event.target.value;render();}
  if(event.target.id==='selected-doc'){state.doc=Number(event.target.value);render();}
  if(event.target.dataset.option){state[event.target.dataset.option]=event.target.checked;render();}
});
$('#stage').addEventListener('submit',event=>{
  event.preventDefault();
  const form=event.target;
  if(form.id==='search-form'){state.query=$('#query').value;render();return;}
  const q=questions.find(q=>q.id===form.dataset.question);if(!q)return;
  const value=new FormData(form).get('answer');
  const correct=q.numeric?Number(value)===Number(q.answer):value===q.answer;
  const feedback=correct?`Correct. ${q.why}`:`Try again. ${q.hint}`;
  answers.set(q.id,{value,correct,feedback});
  const el=$(`#feedback-${q.id}`);el.hidden=false;el.className=`feedback ${correct?'good':'bad'}`;el.textContent=feedback;
});
editors();render();
