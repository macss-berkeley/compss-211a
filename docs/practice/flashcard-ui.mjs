import {availableCards,dueCards,reviewOptions,scheduleReview,intervalLabel} from './flashcards.mjs';
export function createFlashcards({getProgress,save,getWeek,skills,esc,title}){
  const state={deck:'all',scope:'covered',skill:null,card:null,revealed:false,note:'',draft:''};
  const reviews=()=>getProgress().flashcards||{};
  const available=()=>availableCards({week:getWeek(),scope:state.scope,deck:state.deck,skill:state.skill});
  function reset(){state.card=null;state.revealed=false;state.draft='';state.note='';}
  function route(skill){if(state.skill!==(skill||null)){reset();state.skill=skills.some(s=>s.id===skill)?skill:null;if(state.skill){state.deck='all';state.scope='all';}else state.scope='covered';}}
  function render(){
    const cards=available(),due=dueCards(cards,reviews());
    if(state.card&&!cards.some(c=>c.id===state.card))reset();
    if(!state.card&&due.length)state.card=due[0].id;
    const card=cards.find(c=>c.id===state.card),skill=skills.find(s=>s.id===card?.skill);
    const pending=cards.filter(c=>reviews()[c.id]).sort((a,b)=>Date.parse(reviews()[a.id].dueAt)-Date.parse(reviews()[b.id].dueAt));
    const next=pending[0]&&reviews()[pending[0].id].dueAt;
    return title('Python flashcards','Answer from memory, then reveal the answer.')+`
      ${state.skill?`<p><a href="#flashcards">All flashcards</a> · ${esc(skills.find(s=>s.id===state.skill).title)}</p>`:''}
      <div class="filters flash-filters"><label>Deck<select id="flash-deck"><option value="all">Python + pandas</option>${['Python','pandas'].map(d=>`<option value="${d}" ${state.deck===d?'selected':''}>${d}</option>`).join('')}</select></label><label>Coverage<select id="flash-scope"><option value="covered" ${state.scope==='covered'?'selected':''}>Covered through Week ${getWeek()}</option><option value="all" ${state.scope==='all'?'selected':''}>Entire course</option></select></label></div>
      <p class="flash-stats">${due.filter(c=>reviews()[c.id]).length} due · ${due.filter(c=>!reviews()[c.id]).length} new · ${cards.length} cards</p>
      ${state.note?`<p class="micro" role="status">${esc(state.note)}</p>`:''}
      ${card?`<article class="flashcard" data-card-id="${card.id}">
        <div class="flash-meta">${card.deck} · ${esc(skill.title)}${skill.releaseWeek>getWeek()?' · Later in the course':''}</div>
        <h2 id="flash-question" tabindex="-1">${esc(card.prompt)}</h2>
        ${card.code?`<pre class="code">${esc(card.code)}</pre>`:''}
        ${!state.revealed?`<label class="editor-label" for="flash-draft">Your answer (optional)</label><textarea id="flash-draft" class="flash-draft" rows="3" spellcheck="false">${esc(state.draft)}</textarea><button class="primary" data-action="flash-reveal">Show answer</button>`:`
          ${state.draft?`<details><summary>Your answer</summary><pre class="flash-written">${esc(state.draft)}</pre></details>`:''}
          <section class="flash-answer" aria-label="Answer"><h3>Answer</h3>${card.answer?`<p>${esc(card.answer)}</p>`:''}${card.answerCode?`<pre class="code">${esc(card.answerCode)}</pre>`:''}${card.explanation?`<p>${esc(card.explanation)}</p>`:''}</section>
          <div class="flash-ratings" aria-label="Choose the next review interval">${reviewOptions(reviews()[card.id]).map(o=>`<button data-action="flash-grade" data-grade="${o.grade}"><strong>${o.label}</strong><span>${intervalLabel(o.days)}</span></button>`).join('')}</div>`}
        <a class="flash-skill" href="#skill/${card.skill}">Open skill practice →</a>
      </article>`:`<section class="panel flash-empty"><h2>${cards.length?'No cards due':'No cards in this selection'}</h2>${next?`<p>Next review: ${esc(new Date(next).toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'}))} (your local time).</p><button data-action="flash-ahead">Review ahead</button>`:'<p>Change the deck or coverage filter to see more cards.</p>'}<a class="flash-skill" href="#skills">Skills checklist →</a></section>`}`;
  }
  function action(name,button){
    if(name==='flash-reveal'&&state.card){state.revealed=true;return true;}
    if(name==='flash-grade'&&state.card&&state.revealed){
      const grade=button.dataset.grade;if(!['again','hard','good','easy'].includes(grade))return false;
      const p=getProgress(),next=scheduleReview(reviews()[state.card],grade);
      p.flashcards??={};p.flashcards[state.card]=next;
      save();reset();state.note=`Saved. Next review: ${new Date(next.dueAt).toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'})}.`;return true;
    }
    if(name==='flash-ahead'){
      const card=available().filter(c=>reviews()[c.id]).sort((a,b)=>Date.parse(reviews()[a.id].dueAt)-Date.parse(reviews()[b.id].dueAt))[0];
      if(card){reset();state.card=card.id;state.note='Reviewing before the scheduled date.';}return true;
    }
    return false;
  }
  function change(target){if(target.id==='flash-deck'){state.deck=target.value;reset();return true;}if(target.id==='flash-scope'){state.scope=target.value;reset();return true;}return false;}
  function input(target){if(target.id==='flash-draft')state.draft=target.value;}
  return {render,action,change,input,route,reset};
}
