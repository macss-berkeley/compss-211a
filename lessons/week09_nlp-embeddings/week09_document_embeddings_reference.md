# Week 9: document embeddings, similarity, and clustering

This week asks how we can organize a collection of documents without treating a model's geometry as social truth.

## Representation ladder

| Representation | One row represents | One column represents | Main use |
|---|---|---|---|
| Count matrix | A document | A word or phrase | Record which features occur |
| TF-IDF matrix | A document | A weighted word or phrase | Emphasize features that distinguish documents |
| LSA matrix | A document | A compressed direction of term-use variation | Compare and organize documents in fewer dimensions |

`TruncatedSVD` creates the LSA matrix from TF-IDF. Its dimensions summarize correlated patterns in feature use. They are not automatically topics, causes, attitudes, or natural social categories.

## Word and document embeddings

- A **word embedding** gives one vector to a word or token. Word2Vec and GloVe are examples.
- A **document embedding** gives one vector to an entire document. This week uses TF-IDF followed by TruncatedSVD.

Both are geometric representations learned from data. Neither is a dictionary definition or guaranteed measure of meaning.

## Shape glossary

Suppose 80 documents produce 1,200 TF-IDF features and we retain 8 LSA dimensions.

- TF-IDF shape: `(80, 1200)`
- LSA shape: `(80, 8)`
- The number of rows stays 80 because the unit is still a document.
- The number of columns changes because 1,200 text features were compressed into 8 dimensions.

Always inspect shapes, missing text, duplicate IDs, zero vectors, and nonfinite values before interpretation.

## Cosine similarity

Cosine similarity compares the direction of two vectors. Values closer to 1 indicate more similar directions in the chosen representation.

High cosine similarity does **not** prove that two documents:

- make the same argument;
- belong to a true topic;
- come from the same social group;
- agree with each other;
- are similar under a different preprocessing or representation choice.

Inspect the original documents before explaining a similarity score.

## Clustering parameters

| Choice | What it controls | Question to ask |
|---|---|---|
| `n_components` | LSA dimension count | Which variation may compression preserve or hide? |
| `n_clusters` / `k` | Number of KMeans groups | Is this a useful partition for the research purpose? |
| `random_state` | Reproduces a particular randomized procedure | Can another person obtain the same result? |
| `n_init` | Number of initial KMeans solutions compared | Is the chosen solution sensitive to a weak initialization? |

A fixed seed supports reproducibility. It does not establish validity.

## Cluster-inspection checklist

Before assigning a provisional label:

1. Check how many documents are in the cluster.
2. Inspect several high-weight features.
3. Read at least three original documents.
4. Look for documents that contradict the tempting label.
5. Compare another defensible value of `k` or another representation choice.
6. State what the corpus and acquisition filter exclude.
7. Write "documents grouped by this model," not "natural kinds discovered in the data."

## Data note

The frozen Week 6 OpenAlex fixture contains two genuine public OpenAlex records and demonstrates data lineage. Two documents are not enough for a useful clustering exercise. The Week 9 modeling corpus is therefore a separate, clearly labeled synthetic teaching fixture. It supports learning the workflow but cannot support claims about Berkeley scholarship, students, or public opinion.

## Documentation

- [Scikit-learn text feature extraction](https://scikit-learn.org/stable/modules/feature_extraction.html#text-feature-extraction)
- [TruncatedSVD](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.TruncatedSVD.html)
- [Cosine similarity](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html)
- [KMeans](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html)

Optional ethical extension: the Caliskan, Bryson, and Narayanan study on historical stereotypes in word embeddings is relevant to the broader claim that representations inherit associations from their training corpora. Word2Vec and GloVe are not required methods this week.
