// The teaching model follows CountVectorizer / TfidfVectorizer defaults.
export const EXAMPLES = Object.freeze([
  'The cat sat on the mat.',
  'The cat sat on the rug.',
  'The capital of France is Paris.'
]);
export const STOP_WORDS = Object.freeze(['the', 'on', 'of', 'is']);

export function tokenize(text) {
  // Like sklearn's default token pattern: word tokens of at least two characters.
  return text.toLowerCase().match(/[\p{L}\p{N}_]{2,}/gu) || [];
}

export function buildModel(texts, options = {}) {
  const tokens = texts.map(tokenize);
  const retained = tokens.map(row => row.filter(t => !options.stop || !STOP_WORDS.includes(t)));
  const features = retained.map(row => options.bigrams
    ? row.concat(row.slice(1).map((word, i) => `${row[i]} ${word}`)) : row.slice());
  const vocabulary = options.fixed ? ['cat', 'mat', 'rug']
    : [...new Set(features.flat())].sort();
  const counts = features.map(row => {
    const freq = new Map();
    row.forEach(t => freq.set(t, (freq.get(t) || 0) + 1));
    return vocabulary.map(t => freq.get(t) || 0);
  });
  const n = texts.length;
  const df = vocabulary.map((_, j) => counts.reduce((sum, row) => sum + Number(row[j] > 0), 0));
  const idf = df.map(d => Math.log((1 + n) / (1 + d)) + 1);
  const raw = counts.map(row => row.map((count, j) => count * idf[j]));
  const norms = raw.map(row => Math.hypot(...row));
  const weights = raw.map((row, i) => row.map(value => norms[i] ? value / norms[i] : 0));
  const totals = vocabulary.map((_, j) => counts.reduce((sum, row) => sum + row[j], 0));
  const cells = n * vocabulary.length;
  const zeros = counts.flat().filter(value => value === 0).length;
  return {texts: texts.slice(), tokens, retained, features, vocabulary, counts, df, idf,
    raw, norms, weights, totals, n, cells, zeros};
}

export function search(model, query, mode = 'weights') {
  const terms = [...new Set(tokenize(query))];
  const columns = terms.map(t => model.vocabulary.indexOf(t)).filter(j => j !== -1);
  const values = mode === 'counts' ? model.counts : model.weights;
  return model.texts.map((text, i) => ({
    document: i, text,
    score: columns.reduce((sum, j) => sum + values[i][j], 0),
    matches: columns.filter(j => values[i][j] > 0).map(j => ({
      term: model.vocabulary[j], value: values[i][j]
    }))
  })).sort((a, b) => b.score - a.score || a.document - b.document);
}

export function experiment(name) {
  const texts = EXAMPLES.slice();
  if (name === 'repeat') texts[0] = 'The cat cat sat on the mat.';
  if (name === 'reorder') texts[0] = 'On the mat sat the cat.';
  if (name === 'fourth') texts.push(EXAMPLES[0]);
  return texts;
}

export function pairwiseSimilarity(model, mode = 'weights') {
  const rows = mode === 'counts' ? model.counts : model.weights;
  const lengths = rows.map(row => Math.hypot(...row));
  return rows.map((row,i) => rows.map((other,j) => {
    if (!lengths[i] || !lengths[j]) return 0;
    const dot = row.reduce((sum,value,k) => sum + value * other[k],0);
    return Math.max(0,Math.min(1,dot / (lengths[i] * lengths[j])));
  }));
}
