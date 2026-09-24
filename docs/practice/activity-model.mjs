import {skills} from './catalog.mjs';

const kinds={rating:['green','yellow','red','unrated'],check:['pass','fail'],hint:['opened'],solution:['opened'],flashcard:['again','hard','good','easy']};
export function validateEvents(raw){
  if(!Array.isArray(raw)||!raw.length||raw.length>40)throw new Error('Send between 1 and 40 activity records.');
  return raw.map(e=>{
    if(!e||!/^[-a-f0-9]{36}$/.test(e.id||''))throw new Error('Invalid activity ID.');
    const skill=skills.find(s=>s.id===e.skill);
    if(!skill||!kinds[e.kind]?.includes(e.value))throw new Error('Invalid activity.');
    const variant=e.variant??'skill';
    if(typeof variant!=='string'||!['skill','0','1','2','flashcard'].includes(variant))throw new Error('Invalid example.');
    if(e.kind==='check'&&(skill.activity?!['0','1','2'].includes(variant):variant!=='skill'))throw new Error('Invalid checked example.');
    return {id:e.id,skill:e.skill,kind:e.kind,value:e.value,variant};
  });
}

export function activityReport(events,{week,now=Date.now(),days=7}={}){
  // Legacy hint/solution rows are excluded; CSV columns stay for Sheet compatibility.
 events=events.filter(e=>['rating','check','flashcard'].includes(e.kind));
 const browsers=new Set(events.map(e=>e.browser_hash)),latest=events.length?Math.max(...events.map(e=>e.received_at)):null;
  const rows=skills.filter(s=>s.releaseWeek<=week||events.some(e=>e.skill===s.id)).map(s=>{
    const ratings=new Map(),results=new Map();
    const row={skill:s.title,category:s.category,week:s.releaseWeek,needsHelp:0,guidance:0,confident:0,rated:0,checks:0,incorrect:0,tried:0,latestIncorrect:0,hints:0,solutions:0,flashcards:0,difficultCards:0};
    const tried=new Set();
    for(const e of events.filter(e=>e.skill===s.id)){
      if(e.kind==='rating')ratings.set(e.browser_hash,e.value);
      if(e.kind==='check'){row.checks++;if(e.value==='fail')row.incorrect++;tried.add(e.browser_hash);results.set(e.browser_hash+':'+e.variant,e);}
      if(e.kind==='hint')row.hints++;
      if(e.kind==='solution')row.solutions++;
      if(e.kind==='flashcard'){row.flashcards++;if(['again','hard'].includes(e.value))row.difficultCards++;}
    }
    row.tried=tried.size;
    row.latestIncorrect=new Set([...results.values()].filter(e=>e.value==='fail').map(e=>e.browser_hash)).size;
    for(const value of ratings.values()){if(value==='unrated')continue;row.rated++;if(value==='red')row.needsHelp++;if(value==='yellow')row.guidance++;if(value==='green')row.confident++;}
    return row;
  }).sort((a,b)=>(b.needsHelp+b.guidance)-(a.needsHelp+a.guidance)||b.latestIncorrect-a.latestIncorrect||b.incorrect-a.incorrect||a.week-b.week||a.skill.localeCompare(b.skill));
  return {rows,browsers:browsers.size,latest,generatedAt:now,days,week};
}

export const csvHeaders=['Skill','Category','Course week','Need help','Need guidance','Confident','Rated browsers','Check attempts','Incorrect attempts','Browsers tried','Browsers latest incorrect','Hint opens','Solution opens','Flashcard reviews','Hard or again reviews','Active browsers','Period days','Report refreshed UTC','Latest activity UTC'];
export function reportCSV(report){
  const field=value=>'"'+String(value??'').replace(/"/g,'""')+'"';
  return [csvHeaders,...report.rows.map(r=>[r.skill,r.category,r.week,r.needsHelp,r.guidance,r.confident,r.rated,r.checks,r.incorrect,r.tried,r.latestIncorrect,r.hints,r.solutions,r.flashcards,r.difficultCards,report.browsers,report.days,new Date(report.generatedAt).toISOString(),report.latest?new Date(report.latest).toISOString():'No activity yet'])].map(r=>r.map(field).join(',')).join('\r\n');
}
