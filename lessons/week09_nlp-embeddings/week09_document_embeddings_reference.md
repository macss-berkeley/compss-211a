# Week 9: comparing texts with embeddings

Which texts are about similar things, even when they use different words? In Week 8 each text became a row of TF-IDF weights. This week each text also becomes an embedding: a row of numbers made by a trained language model. We score pairs of rows with cosine similarity, search the texts with a sentence, and read the results to decide whether they make sense.

Monday's notebook compares sentence embeddings with TF-IDF on the AITA replies. Lab 9 searches the replies or your project texts four ways: a word search, TF-IDF, word embeddings, and sentence embeddings. This page collects the code and the results from both.

## Install the packages

The models come from the `gensim` and `sentence-transformers` libraries, which are in the course's optional NLP group. Both Week 9 notebooks start with this cell. Run it once on your own computer. Colab already has the packages.

```python
!uv sync --frozen --group optional-nlp
```

The first time you load them, the GloVe word embeddings download about 66 MB and the sentence model about 90 MB.

## Three kinds of row

| | TF-IDF row | Average word embedding | Sentence embedding |
|---|---|---|---|
| Columns | One per word in the vocabulary (773 for the AITA replies with `min_df=5`) | 50 numbers, with no names | 384 numbers, with no names |
| Made by | Counting words in your own texts | Averaging the GloVe rows of a text's words | A model that reads the whole text |
| Two texts with no words in common | Score 0 | Can score high | Can score high |
| Can you read one column? | Yes: it is a word | No | No |
| Changes if you add texts | Yes: the vocabulary and weights are refit | No | No |

All three work with the same tools: `cosine_similarity`, sorting, and reading the texts.

## Word embeddings

A word embedding is a row of numbers for one word. A model learns the rows from a large amount of text, and words that appear in similar contexts get similar rows. Lab 9 uses GloVe, trained on Wikipedia and news articles, with rows for 400,000 words and 50 numbers per word.

```python
import gensim.downloader

glove = gensim.downloader.load("glove-wiki-gigaword-50")
glove.most_similar("therapist")  # psychologist 0.80, pediatrician 0.80, psychotherapist 0.79, ...
glove.similarity("therapist", "counselor")  # 0.74
glove.similarity("therapist", "guitar")  # 0.31
glove.similarity("right", "wrong")  # 0.76
```

*Right* and *wrong* are close because they are used in the same places ("you are ___", "that's not ___"). A word embedding records where a word is used, so opposites can get similar rows.

### Pretrained or trained on your texts

Learning good rows takes far more text than one project has. In the AITA replies, *therapist* appears 9 times. A word2vec model trained on the 1,512 replies gives it nearest words such as *small*, *standard*, *costs*, and *pepper*, and the list changes each time you train it. *Wife* appears 110 times, and its nearest words (*son*, *girlfriend*, *sister*, *husband*) make more sense. Use pretrained embeddings unless you have millions of words of your own text.

### From words to texts

To get one row per text, average the rows of its words:

```python
import re
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

def average_word_vector(text):
    words = re.findall(r"[a-z]+", text.lower())
    words = [w for w in words if w in glove and w not in ENGLISH_STOP_WORDS]
    return sum(glove[w] for w in words) / len(words)
```

The average loses most of what a text is about. Lab 9 scores the query "You should talk to a therapist." against four sentences with each method:

| Sentence | TF-IDF | Average word embedding | Sentence embedding |
|---|---|---|---|
| Please seek counseling. | 0.00 | 0.67 | 0.75 |
| You need new friends. | 0.00 | 0.72 | 0.41 |
| Don't talk during the movie. | 0.41 | 0.68 | 0.16 |
| A therapist will keep it confidential. | 0.50 | 0.76 | 0.59 |

TF-IDF scores only shared words. Average word embeddings give all four sentences similar scores and put "You need new friends." above "Please seek counseling." The sentence model puts counseling first and the movie last.

Word embeddings are more useful one word at a time. `glove.most_similar` can suggest words to add to a word search.

## The sentence model

The class uses `all-MiniLM-L6-v2`. It was trained on over a billion pairs of related sentences, including Reddit comments from 2015 to 2018, to give similar rows to sentences with similar meanings. Words that appear in similar contexts in that training text end up with similar rows.

The model reads only the first 256 word pieces of a text, roughly 200 words, and ignores the rest. In the AITA file, 22 of the 1,512 replies are longer than 200 words. With longer project texts, decide whether to embed the opening, or to split each text into paragraphs and embed those.

## Make embeddings

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = model.encode(texts["text"].tolist())  # needs a list of strings
embeddings.shape  # (number of texts, 384)
```

Row `i` of `embeddings` belongs to row `i` of `texts`. Run `texts.reset_index(drop=True)` after any filtering so the row numbers match.

On Monday's four sentences, "The cat sat on the mat." and "A kitten rested on the carpet." score 0.61 with embeddings and 0.0 with TF-IDF. Once stop words are removed, the two sentences share no words, but the model places cat and kitten, sat and rested, and mat and carpet close together.

## Cosine similarity

`cosine_similarity(embeddings)` scores every pair of texts and returns a square table, as with TF-IDF. `cosine_similarity(a, b)` scores each row of `a` against each row of `b`. That is how you compare one query with every text.

The two methods give scores on different scales. Among the 1,035 AITA replies with an NTA or YTA marker, the median pair scores 0.16 with embeddings and 0.01 with TF-IDF. A third of the TF-IDF pairs score exactly 0, because they share no words in the vocabulary. Embedding scores can be negative (6% of the AITA pairs), but they are rarely far below 0. Compare scores within one method and one set of texts. A score of 0.5 does not mean the same thing for TF-IDF and embeddings, or for two different corpora.

A high score means two texts use similar words in similar ways and are about similar things. It does not mean they agree. "You are not wrong." and "You are wrong." score 0.83. "You did nothing wrong." means the same as the first sentence but scores 0.44 against it.

## Find the nearest texts

To find the texts closest to one anchor text:

```python
nearest = emb_scores[anchor].argsort()[::-1][1:4]
```

`argsort()` lists row numbers from the lowest score to the highest, and `[::-1]` reverses that order. The first entry is the anchor itself, with a score of 1, so `[1:4]` skips it and keeps the next three.

For anchor 92 on Monday ("your wife's accomplishments aren't a slight against your struggles"), the three nearest replies by embedding are YTA replies about wives, housework, and parenting, with scores of 0.58, 0.54, and 0.52. The nearest reply by TF-IDF is about a smoker who laughs at a comment. It shares only *make* and *feel* with the anchor.

## Search with a sentence

Encode a query with the same model and score it against every text. Lab 9 saves the scores in a column, so you can sort and filter them with pandas:

```python
query_embedding = model.encode(["You should talk to a therapist."])
texts["query_score"] = cosine_similarity(query_embedding, embeddings)[0]
texts.sort_values("query_score", ascending=False).head(10)
```

On the 1,512 AITA replies:

- The top result is "SHP. If not, please seek counseling. ASAP." (0.64). It does not contain the word *therapist*.
- A word search for `\btherap` finds 20 replies. It finds 7 of the sentence search's top 10, 6 of the TF-IDF top 10, and 1 of the top 10 by average word embedding.
- The TF-IDF results that are not about therapy share *talk* with the query ("Sit down and talk to each other"). The top 10 by average word embedding all score between 0.78 and 0.85 and are mostly about family, partners, and friends.
- Two of the top 10 are "You need new friends." and a similar reply. They are short advice addressed to *you*, like the query, but they are not about therapy.
- The word match with the lowest score (0.04) is a long reply about guitar pedals that suggests therapy in one sentence. An embedding describes the whole text, so a single mention barely changes it.
- Rephrasing the query as "Have you thought about getting professional help?" keeps only 4 of the 10. The new results share *help* but are about disability, money, and a lawsuit.

A search always returns its nearest texts, even when none are about your topic. On Monday, "My roommate keeps eating my food." returns replies about food and eating with a partner or a mother, none about roommates. Read the results and count how many are about your topic before you report them. Try more than one wording.

| Use | When |
|---|---|
| A word search | The exact term matters, or a single mention should count |
| A sentence search | The topic can be written in many ways, and you want texts that are mostly about it |
| TF-IDF | You want to know which words a comparison rests on |
| Word embeddings | You want related words to add to a word search |

## Check what the scores match on

Embeddings respond to everything in a text, including parts you may not care about. On Monday, for each reply, we found its nearest other reply and checked whether the two had the same marker:

| Rows | Share of nearest pairs with the same marker |
|---|---|
| Embeddings | 0.79 |
| TF-IDF | 0.65 |
| Embeddings, with NTA and YTA removed from the text | 0.57 |
| Random pairs (expected) | about 0.54 |

Most of the agreement came from the NTA or YTA at the start of each reply, not from what the replies say about the situation. Markers, signatures, quoted text, and repeated headers can drive matches in the same way. Remove them, rerun, and compare.

## Optional: a meaning axis

Average the embeddings of two groups of words and subtract one average from the other. The result is a direction from one group to the other, and `cosine_similarity` with it scores where any text falls along that direction.

```python
female_words = ["she", "her", "woman", "girl", "wife", "mother", "daughter", "sister"]
male_words = ["he", "him", "man", "boy", "husband", "father", "son", "brother"]

gender_axis = model.encode(female_words).mean(axis=0) - model.encode(male_words).mean(axis=0)
cosine_similarity(model.encode(["king", "queen"]), [gender_axis])  # -0.08 and 0.25
```

An axis from "justified" words to "unjustified" words did not separate the replies: NTA replies average -0.048 and YTA replies -0.049. A reply's embedding reflects its whole topic, and ten words describe only a small part of it. Test an axis against texts with known labels before you use it as a measure.

## Using this in your final project

A small, complete project could be: pick one question, embed one set of texts, search them with a few queries you chose for a reason, and report what you found when you read the results. You can also compare groups among the texts closest to a query, as in the last step of Lab 9.

In your write-up, report:

- what one text is and how many you have;
- the cleaning you did, and what you did with texts longer than about 200 words;
- the model name;
- each query, the number of top results you read, and how many were about your topic;
- what a word search for the same topic found, with an example that one search found and the other missed;
- how the results changed when you rephrased a query.

## Going further

- Groups of texts: KMeans (`sklearn.cluster.KMeans`) works on embeddings in the same way as on TF-IDF rows. Fix `random_state`, read several texts in each group before you describe it, and check whether the groups hold together with a different `n_clusters`.
- Other models: larger sentence-transformers models and embedding APIs often give longer rows and read longer texts. Report the model you used, because scores from different models cannot be compared.
- Other word embeddings: GloVe also comes with 100, 200, or 300 numbers per word (`glove-wiki-gigaword-300`). Researchers train word2vec on large corpora, such as decades of newspapers, to study how word meanings and associations change.

## About the course data

The AITA file has 1,512 historical replies to r/AmItheAsshole posts. 1,035 of them start with an NTA or YTA marker (657 NTA, 378 YTA). The sample favors highly scored comments and does not represent Reddit users or public opinion.

## Documentation

- [GloVe](https://nlp.stanford.edu/projects/glove/)
- [gensim word vectors](https://radimrehurek.com/gensim/models/keyedvectors.html)
- [Sentence Transformers](https://sbert.net/)
- [all-MiniLM-L6-v2 model card](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
- [Cosine similarity](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html)
- [KMeans](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html)
