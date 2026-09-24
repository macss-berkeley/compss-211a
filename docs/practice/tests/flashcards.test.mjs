import {test} from 'node:test';
import assert from 'node:assert/strict';
import {flashcards,reviewOptions,scheduleReview,dueCards,availableCards,validateCardReviews} from '../flashcards.mjs';
import {freshProgress,validateProgress,mergeProgress} from '../exercises.mjs';
import {skills} from '../catalog.mjs';
const now=new Date('2026-09-24T12:00:00Z');
test('flashcard content has stable IDs, standalone questions, answers and real course skills',()=>{
 assert.equal(flashcards.length,100);assert.equal(new Set(flashcards.map(c=>c.id)).size,100);
 assert.deepEqual([...new Set(flashcards.map(c=>c.deck))].sort(),["Analysis","Python","SQL","pandas"]);
 for(const c of flashcards){assert.ok(skills.some(s=>s.id===c.skill));assert.ok(c.prompt);assert.ok(c.answer||c.answerCode);}
 assert.ok(availableCards({week:3}).every(c=>skills.find(s=>s.id===c.skill).releaseWeek<=3));
 assert.equal(availableCards({week:3,scope:'all'}).length,100);
 assert.ok(availableCards({week:13,deck:'pandas'}).every(c=>c.deck==='pandas'));
});
test('review intervals distinguish forgotten, difficult and recalled cards and cap growth',()=>{
 const again=scheduleReview(undefined,'again',now),hard=scheduleReview(undefined,'hard',now),good=scheduleReview(undefined,'good',now),easy=scheduleReview(undefined,'easy',now);
 assert.equal(Date.parse(again.dueAt)-now,60000);assert.equal(again.intervalDays,0);
 assert.equal(Date.parse(hard.dueAt)-now,600000);assert.equal(Date.parse(good.dueAt)-now,86400000);assert.equal(Date.parse(easy.dueAt)-now,4*86400000);
 assert.equal(scheduleReview(good,'good',now).intervalDays,2);
 assert.equal(scheduleReview(easy,'easy',now).intervalDays,12);
 assert.equal(scheduleReview(easy,'again',now).intervalDays,0);
 assert.ok(reviewOptions({intervalDays:360}).every(o=>o.days<=365));
 assert.throws(()=>scheduleReview(undefined,'invalid',now));
});
test('overdue cards precede new cards; reviews return only when due',()=>{
 const cards=flashcards.slice(0,3),reviews={};
 reviews[cards[0].id]=scheduleReview(undefined,'good',now);
 reviews[cards[2].id]=scheduleReview(undefined,'again',now);
 assert.deepEqual(dueCards(cards,reviews,now).map(c=>c.id),[cards[1].id]);
 assert.deepEqual(dueCards(cards,reviews,new Date(now.getTime()+60000)).map(c=>c.id),[cards[2].id,cards[1].id]);
});
test('flashcard schedules survive restore, merge by recency and preserve old backups',()=>{
 const id=flashcards[0].id,a=freshProgress(),b=freshProgress();
 a.flashcards[id]=scheduleReview(undefined,'good',now);b.flashcards[id]=scheduleReview(a.flashcards[id],'easy',new Date(now.getTime()+86400000));
 assert.deepEqual(validateProgress(JSON.parse(JSON.stringify(a)),skills.map(s=>s.id)).flashcards,a.flashcards);
 assert.deepEqual(mergeProgress(b,a).flashcards,b.flashcards);assert.deepEqual(mergeProgress(a,b).flashcards,b.flashcards);
 delete a.flashcards;assert.deepEqual(validateProgress(a,skills.map(s=>s.id)).flashcards,{});
 assert.throws(()=>validateCardReviews({[id]:{...b.flashcards[id],dueAt:'bad date'}}));
 assert.throws(()=>validateCardReviews({[id]:{...b.flashcards[id],intervalDays:Infinity}}));
 assert.deepEqual(validateCardReviews({unknown:{}}),{});
});
