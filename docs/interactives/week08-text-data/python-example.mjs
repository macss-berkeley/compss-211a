// Return runnable notebook/CLI examples for the exact active texts and settings.
import {STOP_WORDS} from './model.mjs';

export function makePythonExample(texts, options = {}, kind = 'counts') {
  const countMode = kind === 'counts' || (kind === 'similarity' && options.simMode === 'counts');
  const vectorizer = countMode ? 'CountVectorizer' : 'TfidfVectorizer';
  const params = [];
  if (options.stop) params.push(`stop_words=${JSON.stringify(STOP_WORDS)}`);
  if (options.bigrams) params.push('ngram_range=(1, 2)');
  if (options.fixed) params.push('vocabulary=["cat", "mat", "rug"]');
  const constructor = params.length ? `${vectorizer}(\n    ${params.join(',\n    ')}\n)` : `${vectorizer}()`;
  const labels = JSON.stringify(texts.map((_,i)=>`D${i+1}`));
  const setup = `import pandas as pd\nfrom sklearn.feature_extraction.text import ${vectorizer}\n`+
    (kind==='similarity'?'from sklearn.metrics.pairwise import cosine_similarity\n':'')+
    `\ntexts = [\n${texts.map(t=>`    ${JSON.stringify(t)},`).join('\n')}\n]\n`;
  let body = `vectorizer = ${constructor}\nmatrix = vectorizer.fit_transform(texts)\n\n`;
  if (kind==='similarity') {
    body += `similarities = cosine_similarity(matrix)\n\nscores = pd.DataFrame(\n    similarities,\n    index=${labels},\n    columns=${labels}\n)\nprint(scores.round(2))`;
  } else {
    const name=countMode?'counts':'weights';
    body += `${name} = pd.DataFrame(\n    matrix.toarray(),\n    columns=vectorizer.get_feature_names_out(),\n    index=${labels}\n)\nprint(${name}${countMode?'':'.round(2)'})`;
  }
  return {setup,body,script:`${setup}\n${body}\n`,vectorizer};
}
