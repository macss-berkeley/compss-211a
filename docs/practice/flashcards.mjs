import {skills} from './catalog.mjs';
const card=(id,skill,deck,prompt,code,answer,answerCode='',explanation='')=>({id,skill,deck,prompt,code,answer,answerCode,explanation});
export const flashcards=[
card('assignment-copy','variables-and-assignment','Python','What does print(y) display?','x = 4\ny = x + 2\nx = 10\nprint(y)','6','','y was assigned 6 before x changed.'),
card('type-conversion','basic-data-types','Python','What value and type does total have?','total = int("3") + 2','The integer 5.'),
card('list-index','lists-and-indexing','Python','What does this print?','modes = ["bus", "bike", "walk"]\nprint(modes[-1])','walk','','Index -1 selects the last item.'),
card('list-slice','lists-and-indexing','Python','What does this slice return?','values = [10, 20, 30, 40]\nvalues[1:3]','[20, 30]','','The start index is included; the stop index is excluded.'),
card('dict-key','dictionaries-and-keys','Python','Write the expression that returns the days value.','record = {"mode": "bus", "days": 3}','','record["days"]'),
card('string-clean','strings','Python','What string does this return?','"  Bus Stop  ".strip().lower()','"bus stop"'),
card('compare-assign','operators','Python','What is the difference between = and ==?','','= assigns a value. == compares values for equality.'),
card('remainder','operators','Python','What does 17 % 5 return?','','2','','% returns the remainder after division.'),
card('conditional-boundary','conditionals','Python','What does this print?','cost = 20\nif cost < 20:\n    print("low")\nelse:\n    print("high")','high','','20 is not less than 20.'),
card('loop-total','for-loops','Python','What is the final value of total?','total = 0\nfor n in [2, 3, 4]:\n    total += n','9'),
card('call-default','calling-functions','Python','What does add_fee(10, fee=3) return?','def add_fee(cost, fee=2):\n    return cost + fee','13','','The supplied fee replaces the default for this call.'),
card('return-print','writing-functions','Python','What does result contain?','def double(n):\n    print(n * 2)\n\nresult = double(3)','None','','The function prints 6, but has no return statement.'),
card('write-function','writing-functions','Python','Write a function called double that returns twice its input.','','','def double(n):\n    return n * 2'),
card('method-call','values-variables-functions-and-methods','Python','Which call is a method, and which is a function?','text.strip()\nlen(text)','text.strip() is a method call. len(text) is a function call.'),
card('trace-loop','read-code-line-by-line','Python','What does this print?','kept = []\nfor n in [2, 5, 8]:\n    if n > 4:\n        kept.append(n * 2)\nprint(kept)','[10, 16]'),
card('import-alias','import-packages','Python','Import pandas using its usual alias.','','','import pandas as pd'),
card('keyerror','read-tracebacks','Python','What does this error tell you to check?','df["seat"]\n# KeyError: \'seat\'','Check whether the column "seat" exists, including spelling and capitalization.','','Inspect df.columns.'),
card('assert-count','test-your-code','Python','Write an assertion that checks df has 100 rows.','','','assert len(df) == 100'),
card('module-call','import-your-own-code','Python','Call summarize_requests from this imported module, passing requests.','import case_summary','','case_summary.summarize_requests(requests)'),
card('load-csv','load-tabular-data','pandas','Read data/commute.csv into a DataFrame named df. Assume pandas is imported as pd.','','','df = pd.read_csv("data/commute.csv")'),
card('shape','inspect-a-dataframe','pandas','What do the two numbers mean?','df.shape\n# (120, 5)','120 rows and 5 columns.'),
card('select-columns','select-and-filter','pandas','Select the mode and days columns as a DataFrame.','','','df[["mode", "days"]]'),
card('filter-rows','select-and-filter','pandas','Keep rows where days is at least 3.','','','df[df["days"] >= 3]'),
card('combine-pandas','combining-conditions','pandas','Keep rows where days is at least 3 AND mode is "bus".','','','df[(df["days"] >= 3) & (df["mode"] == "bus")]','Put parentheses around each comparison. Use & for elementwise AND.'),
card('new-column','create-or-modify-columns','pandas','Create a total column by multiplying fare by trips.','','','df["total"] = df["fare"] * df["trips"]'),
card('missing-mean','missing-values','pandas','What is the mean of the known values: 10, missing, 30?','','20','','Replacing the missing value with zero would change the mean to about 13.3.'),
card('count-size','summaries-and-grouping','pandas','How do count() and size() differ when summarizing a group?','','count() counts nonmissing values in a column. size() counts all rows in the group.'),
card('category-shares','sort-and-count','pandas','Return proportions for each value in the mode column.','','','df["mode"].value_counts(normalize=True)'),
card('preserve-id','convert-data-types','pandas','Why store an ID such as "00123" as text?','','To preserve the leading zeros. An identifier is a label, not a quantity.'),
card('join-duplicates','join-tables','pandas','How many rows will the inner join produce?','left IDs:  A, B\nright IDs: A, A, B\nleft.merge(right, on="id", how="inner")','3','','A produces two matching pairs; B produces one.'),
card('nested-access','csv-and-json','Python','Return the first result’s title.','response = {"results": [{"title": "Transit"}]}','','response["results"][0]["title"]'),
card('month-year','dates-and-times','pandas','Create a year-and-month grouping key from a datetime column called date.','','','df["date"].dt.to_period("M")','Using .dt.month alone combines the same month across different years.')
];
export const cardIds=new Set(flashcards.map(c=>c.id));
const DAY=86400000;
export function reviewOptions(previous){
  const days=previous?.intervalDays||0;
  return [
    {grade:'again',label:'Again',days:1/1440},
    {grade:'hard',label:'Hard',days:days<1?10/1440:Math.min(365,Math.ceil(days*1.2))},
    {grade:'good',label:'Good',days:days<1?1:Math.min(365,Math.ceil(days*2))},
    {grade:'easy',label:'Easy',days:days<1?4:Math.min(365,Math.ceil(days*3))}
  ];
}
export function scheduleReview(previous,grade,now=new Date()){
  const option=reviewOptions(previous).find(o=>o.grade===grade);
  if(!option)throw new Error('Invalid review rating');
  return {intervalDays:grade==='again'?0:option.days,dueAt:new Date(now.getTime()+Math.round(option.days*DAY)).toISOString(),updatedAt:now.toISOString(),reviews:(previous?.reviews||0)+1,grade};
}
export function intervalLabel(days){return days<1?`${Math.round(days*1440)} min`:`${days} ${days===1?'day':'days'}`;}
export function availableCards({week,scope='covered',deck='all',skill=null}){
  return flashcards.filter(c=>(!skill||c.skill===skill)&&(deck==='all'||c.deck===deck)&&(scope==='all'||skills.find(s=>s.id===c.skill).releaseWeek<=week));
}
export function dueCards(cards,reviews,now=new Date()){
  return cards.filter(c=>!reviews[c.id]||Date.parse(reviews[c.id].dueAt)<=now.getTime()).sort((a,b)=>{
    const x=reviews[a.id],y=reviews[b.id];
    return x&&y?Date.parse(x.dueAt)-Date.parse(y.dueAt):x?-1:y?1:0;
  });
}
export function validateCardReviews(raw={}){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Invalid flashcard backup.');
  const result={};
  for(const [id,r] of Object.entries(raw)){
    if(!cardIds.has(id))continue;
    if(!r||!Number.isFinite(r.intervalDays)||r.intervalDays<0||r.intervalDays>365||!Number.isInteger(r.reviews)||r.reviews<1||r.reviews>1000000||!['again','hard','good','easy'].includes(r.grade)||!Number.isFinite(Date.parse(r.dueAt))||!Number.isFinite(Date.parse(r.updatedAt)))throw new Error('Invalid flashcard review.');
    result[id]={intervalDays:r.intervalDays,reviews:r.reviews,grade:r.grade,dueAt:r.dueAt,updatedAt:r.updatedAt};
  }
  return result;
}
