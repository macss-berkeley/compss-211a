import test from 'node:test';
import assert from 'node:assert/strict';
import {EXAMPLES, buildModel, tokenize, experiment, search, pairwiseSimilarity} from './model.mjs';
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-10, `${actual} != ${expected}`);

test('the original corpus matches the notebook count and numeric questions', () => {
  const m=buildModel(EXAMPLES);
  assert.equal(m.n,3); assert.equal(m.vocabulary.length,11);
  assert.deepEqual(m.vocabulary,['capital','cat','france','is','mat','of','on','paris','rug','sat','the']);
  assert.equal(m.totals[m.vocabulary.indexOf('the')],5);
  assert.equal(m.df[m.vocabulary.indexOf('cat')],2);
});
test('smoothed and normalized weights match the saved sklearn example',()=>{
  const m=buildModel(EXAMPLES), j=t=>m.vocabulary.indexOf(t);
  near(m.idf[j('the')],1);
  near(m.weights[0][j('cat')],0.37420725915942793);
  near(m.weights[0][j('mat')],0.49203757615766286);
  near(m.weights[0][j('the')],0.5812106375713182);
  m.weights.forEach(row=>near(Math.hypot(...row),1));
  assert.equal(m.weights[2][j('cat')],0);
});
test('reordering leaves unigrams and their weights unchanged; repetition does not',()=>{
  const base=buildModel(EXAMPLES), reordered=buildModel(experiment('reorder'));
  assert.deepEqual(base.counts,reordered.counts); assert.deepEqual(base.weights,reordered.weights);
  const repeat=buildModel(experiment('repeat'));
  assert.equal(repeat.counts[0][repeat.vocabulary.indexOf('cat')],2);
  assert.notDeepEqual(repeat.weights[0],base.weights[0]);
});
test('changing the corpus changes IDF even when the original row counts do not change',()=>{
  const base=buildModel(EXAMPLES), four=buildModel(experiment('fourth'));
  assert.deepEqual(base.counts[0],four.counts[0]);
  const j=base.vocabulary.indexOf('mat');assert.ok(four.idf[j]<base.idf[j]);
  assert.notEqual(base.weights[0][j],four.weights[0][j]);
});
test('vocabulary choices can yield a zero document vector without NaNs',()=>{
  const m=buildModel(EXAMPLES,{fixed:true});
  assert.deepEqual(m.vocabulary,['cat','mat','rug']);
  assert.deepEqual(m.counts,[[1,1,0],[1,0,1],[0,0,0]]);
  assert.deepEqual(m.weights[2],[0,0,0]);
});
test('bigrams are built after stopword removal and preserve adjacency in the retained sequence',()=>{
  const m=buildModel(EXAMPLES,{bigrams:true,stop:true});
  assert.ok(m.vocabulary.includes('sat mat'));
  assert.ok(!m.vocabulary.includes('the cat'));
  const re=buildModel(experiment('reorder'),{bigrams:true});
  assert.ok(re.vocabulary.includes('mat sat'));
});
test('empty texts, only stopwords, and unicode words are handled',()=>{
  const m=buildModel(['','the is'],{stop:true});
  assert.deepEqual(m.vocabulary,[]); assert.deepEqual(m.weights,[[],[]]);
  assert.deepEqual(tokenize('CAFÉ café! a x 20 _ab'),['café','café','20','_ab']);
});
test('search uses only matching query terms, ranks stably, and handles no matches',()=>{
  const m=buildModel(EXAMPLES);
  const results=search(m,'cat mat');
  assert.equal(results[0].document,0); assert.equal(results[2].score,0);
  assert.deepEqual(search(m,'cat cat mat'),results);
  assert.deepEqual(search(m,'zzzz').map(r=>r.score),[0,0,0]);
  assert.equal(search(m,'cat mat','counts')[0].score,2);
});
test('cosine similarity compares patterns, is symmetric, and treats empty vectors as zero',()=>{
  const m=buildModel(EXAMPLES), scores=pairwiseSimilarity(m);
  near(scores[0][0],1); near(scores[1][0],scores[0][1]);
  assert.ok(scores[0][1]>scores[0][2]);
  assert.deepEqual(pairwiseSimilarity(buildModel(['cat','cat cat'])) , [[1,1],[1,1]]);
  const fixed=pairwiseSimilarity(buildModel(EXAMPLES,{fixed:true}));
  assert.deepEqual(fixed[2],[0,0,0]);
  const clean=pairwiseSimilarity(buildModel(EXAMPLES,{stop:true}));
  assert.equal(clean[0][2],0);
});
