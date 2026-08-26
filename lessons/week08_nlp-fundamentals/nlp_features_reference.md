# NLP features: what survives preprocessing?

Week 8 follows one workflow:

> question → corpus → preprocessing choice → representation → inspection → claim

**A model cannot use evidence that preprocessing removed or the corpus never contained.**

## Then and now

About a decade ago, many practical sentiment systems combined sentiment dictionaries, aggressive normalization, bag-of-words features, and conventional classifiers. Those systems could mistake `Love waiting 40 minutes for the bus 🙃` for praise because `love` is positive while the sarcasm, emoji, and situation are poorly represented.

Modern contextual language models can use word order and more surrounding context, so sentiment and sarcasm are easier to attempt. They are not solved. Culture, dialect, domain shifts, ambiguous quotation, and missing conversational context can still defeat a model. More powerful models also cannot reconstruct cues deleted before analysis.

## Core vocabulary

- **Corpus:** the collection of texts selected for analysis.
- **Document:** one row or unit represented in the feature matrix. A document might be a post, reply, sentence, article, or complete thread.
- **Token:** a unit produced by a tokenizer. Tokens need not correspond perfectly to words.
- **Vocabulary:** the set of features learned from the corpus.
- **Document-term matrix:** rows are documents, columns are vocabulary terms, and cells contain counts or weights.
- **Sparse matrix:** a matrix stored by recording mostly the nonzero cells; text matrices are usually sparse.
- **Count feature:** the number of times a term occurs in a document.
- **TF-IDF:** a weight that increases for terms present in a document but not ubiquitous across the fitted corpus.
- **N-gram:** a sequence of `n` tokens. A bigram such as `not safe` preserves some local word order that unigrams lose.

## Signals that cleaning can change

| Signal | Example | What may be lost | Question before changing it |
|---|---|---|---|
| Negation | `not safe` | Removing `not` or using only unigrams can reverse or fragment meaning. | Is stance or evaluation part of the research question? |
| Emoji | `Love waiting 🙃` | Removing the emoji can hide a cue to irony or affect. | Are emoji meaningful in this community and task? |
| Capitalization and punctuation | `This is SAFE?!` | Lowercasing and punctuation removal erase emphasis and incredulity. | Is emphasis useful evidence or merely orthographic variation? |
| Hashtags | `#NotSafeAfterDark` | Default tokenization may retain one opaque token rather than its components. | Should the tag remain intact, be segmented, or be represented both ways? |
| Repeated characters | `soooo reliable` | Normalizing repeats improves matching but removes intensity. | Does the downstream task need emphasis? |
| Quotation | `They called it "safe."` | Removing quotation can blur whose language or stance is represented. | Do attribution and reported speech matter? |
| Conversation | Reply: `Exactly.` | An isolated reply may have almost no interpretable stance. | Is the document the reply, its parent, or the whole exchange? |

Keep an untouched `text` column. Put any transformed version in a new column so that you can compare it with the source.

## Real corpus used in lecture

After the six synthetic opening examples, the live notebook uses `data/aita_top_comments.csv`: 5,000 historical comments from r/AmItheAsshole. The lesson keeps only the comment body and score and does not display usernames.

The corpus supports three concrete preprocessing questions:

1. What evidence disappears when lowercasing removes capitalization?
2. What happens when a standard English stop-word list removes negation such as `not`?
3. Should AITA verdict labels such as `NTA` and `YTA` remain features when the research question concerns commenters' reasons rather than their verdicts?

The answer depends on the research question. Removing a platform-specific label may reduce noise for one task and destroy the outcome of interest for another. This historical, highly scored snapshot is not representative of Reddit users or public opinion.

## Vectorizer choices

- `lowercase=True` merges case variants but removes case as a feature.
- `stop_words="english"` reduces common vocabulary but can remove meaningful words, including negation in some lists.
- `ngram_range=(1, 1)` uses unigrams; `(1, 2)` includes unigrams and bigrams.
- `min_df=2` keeps terms found in at least two documents. The same value means something very different in a corpus of six documents and a corpus of six thousand.
- `token_pattern` determines what the default word analyzer recognizes. Punctuation and emoji are not ordinary word features under the default pattern.
- `fit` learns vocabulary and, for TF-IDF, corpus-level document frequencies. `transform` applies the learned representation to new documents.

For evaluated prediction, split raw documents first and fit the vectorizer only on the training documents. Otherwise vocabulary and IDF statistics leak information from the held-out set. Fitting on the full corpus can be appropriate for a clearly described exploratory analysis of that corpus; it is not appropriate for an honest held-out performance estimate.

## Preprocessing decision log

For every operation, record the decision rather than calling it "standard cleaning."

| Operation | Intended benefit | Information lost | Evidence it helps this task | Keep or reject? |
|---|---|---|---|---|
| Example: lowercase | Merge `Safe` and `safe` | Capitalization emphasis | Compare the vocabulary and target errors | Decide after inspection |

## Before interpreting features

1. Confirm what one row represents.
2. Inspect source, sampling, missingness, duplicates, and conversation structure.
3. Compare raw and transformed text.
4. Inspect matrix shape, vocabulary, and nonzero entries.
5. Inspect individual documents as well as global term rankings.
6. Distinguish a useful model feature from a social concept.
7. Match the claim to the corpus. A synthetic teaching corpus is not evidence about Berkeley students or campus opinion.
