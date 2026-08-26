# Week 9: word and document embeddings

An embedding is a row of numbers that places an item in a vector space. We use the space to compare items, but the space does not tell us what a result means. That part still requires reading, judgment, and knowledge of the data.

## Two kinds of rows

| Model | One row represents | What nearness can suggest |
|---|---|---|
| Word embedding | A word | The words appear in similar documents or contexts |
| Document embedding | A whole document | The documents use similar language or occupy similar model dimensions |

Near words are not always synonyms. Near documents do not necessarily agree or belong to one clear topic.

## Word vectors from the AITA comments

The lecture starts with a TF-IDF table whose rows are Reddit comments and whose columns are words. `TruncatedSVD` compresses that table. We then turn the result around so that each row represents a word.

With the current course file, the shapes are:

- comment-by-word TF-IDF table: `(5000, 1727)`
- word-vector table: `(1727, 50)`

The model places words near each other when they are used in similar comments. For example, `wedding` is close to words about brides, clothing, and events. `family` is close to words about relatives and traditions. These results describe this corpus. A news archive or a medical corpus would produce another space.

This is a small LSA word embedding built for class. Pretrained models such as Word2Vec, GloVe, and newer neural embedding models are trained differently and on much more text. The basic workflow is still recognizable: get a vector for each item, compare the vectors, and read the source material before interpreting the comparison.

## Document vectors from OpenAlex

For documents, the TF-IDF table already has the orientation we want: one abstract per row. LSA compresses its many term columns into a smaller number of dimensions.

The current OpenAlex sample produces:

- TF-IDF table: `(80, 1264)`
- LSA table: `(80, 8)`

The number of rows stays at 80 because the unit is still an abstract. The number of columns falls from 1,264 terms to eight model dimensions.

In the current run, those eight dimensions retain about 14 percent of the variation in the TF-IDF table. That is substantial compression. It makes a small example easy to inspect, but some information is lost.

## TF-IDF and LSA can give different neighbors

TF-IDF similarity is driven by shared weighted terms. LSA similarity is based on compressed patterns across terms. An abstract can therefore have one set of neighbors under TF-IDF and another under LSA.

Neither list should be accepted from titles alone. Read the anchor abstract and its nearest matches. Look for the language or subject matter that explains the score, and note anything that makes the match doubtful.

## Cosine similarity

Cosine similarity compares the direction of two vectors. A value closer to 1 means that the two vectors point in more similar directions in the chosen representation.

A high score does not prove that two documents make the same argument, agree with each other, or belong to a natural category. The score can also change when you change preprocessing, the corpus, or the number of LSA dimensions.

## Clustering choices

| Choice | What it changes | What to check |
|---|---|---|
| `n_components` | Number of LSA dimensions | How much information did compression retain? |
| `n_clusters` | Number of KMeans groups | Do the groups remain useful at another reasonable value? |
| `random_state` | Random steps in the procedure | Can someone reproduce this particular result? |
| `n_init` | Number of starting solutions tried | Is the result based on a weak starting point? |

A fixed random seed helps someone rerun the analysis. It does not make a cluster valid.

Before naming a cluster:

1. Check its size.
2. Read several titles and abstracts.
3. Look for documents that do not fit the tempting label.
4. Compare the result with another value of `k`.
5. Describe it as a group made by this model, not a category discovered in the world.

It is acceptable to leave a cluster unlabeled when its documents do not support a clear description.

## About the course data

The AITA file is a fixed historical sample of Reddit comments included for teaching. It is not a sample of Reddit as a whole.

The OpenAlex file contains 80 works with abstracts and at least one UC Berkeley-affiliated authorship. That filter does not mean every work was led by Berkeley or written by Berkeley faculty. The small sample is useful for practicing the workflow, not for making broad claims about Berkeley research.

## Newer embedding models

Current embedding models can handle context and word order better than this small LSA model. A library or API can create those vectors with very little code. It cannot decide what counts as a document, whether the corpus fits the research question, or whether a nearest neighbor makes sense after close reading.

## Documentation

- [Scikit-learn text feature extraction](https://scikit-learn.org/stable/modules/feature_extraction.html#text-feature-extraction)
- [TruncatedSVD](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.TruncatedSVD.html)
- [Cosine similarity](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html)
- [KMeans](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html)

For a later discussion of bias, the Caliskan, Bryson, and Narayanan study shows how word embeddings can reproduce historical associations found in their training data.
