# Describing patterns in text

Statistical text analysis makes recurring language visible across many documents. We can describe word use, compare groups, or find documents that share vocabulary. Word counts and TF-IDF are representations; comparing groups or predicting labels are tasks that can use those representations.

Week 8 follows this workflow:

> question → features → summary or comparison → read source examples

## Start with word counts

The lesson uses three texts throughout: “The cat sat on the mat.”, “The cat sat on the rug.”, and “The capital of France is Paris.” A shared vocabulary makes a matrix with 3 document rows and 11 word columns. A feature is something measured consistently for every document.

Sum a column to count occurrences: the occurs 5 times. Turn counts into True/False values to record presence: cat appears in 2 documents. The mean of that cat feature is 2/3, the matching-document share. Repetition increases counts while reordering the same words leaves bag-of-words counts unchanged.

TF-IDF combines counts within documents with a larger factor for words found in fewer documents, then rescales each row by default. In document 1, cat and mat both have count 1, but their weights are about 0.37 and 0.49: mat occurs in fewer documents. The words, documents, and column meanings stay consistent as we change the numeric representation.

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

## Real corpus used on Monday

The guided notebook uses `docs/interactives/data/week08/aita_replies.csv`: 1,512 screened, historical comments that reply directly to r/AmItheAsshole posts. This is a subset of the 5,000-comment course file, so its results differ from examples using that complete file. The sample favors highly scored comments and is not representative of Reddit users or public opinion.

The comparison retains 1,035 replies with an explicit NTA or YTA marker at the beginning: 657 NTA and 378 YTA. Other replies stay unassigned. These are comment markers, not the post-level community verdict used in HW4.

For the main AITA comparison, keep the original `body` and let the vectorizers lowercase and tokenize it. Both use `stop_words="english"` and `min_df=5`. The vocabulary retains `nta` and `yta`, which makes the grouping markers visible in the ranked lists. The English stop-word list removes negation words such as `not`; this is one of the representation choices discussed in the lesson.

Monday's AITA exercise builds a whole-word presence feature for `wife`, compares group shares, and reads source replies. Revising the rule to include `partner` is optional. Students then adapt a supplied full-corpus count comparison to TF-IDF. Both methods average each word's value within each group and subtract YTA minus NTA. Positive means a higher group average in YTA. Compare the top-15 lists and calculate mean reply lengths: 45.2 words for NTA and 54.1 for YTA.

Friday's required lab applies the presence-feature and reading workflow to project data. Building a full word-count matrix is optional. Keep the document IDs, original text, and grouping column together.

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


## Operations you can use in a project

Keep a table with the document ID, original text, and any grouping variable, such as a rating, period, source, or human label. Decide whether a document is a review, paragraph, turn, or whole conversation before summarizing it.

1. **Select usable documents.** Count missing, empty, or deleted text before excluding it. Inspect duplicates before deciding whether they represent repeated data or different observations.
2. **Find texts mentioning a term.** Use `.str.contains(...)` to build a True/False column, then read the matching texts. A search for a word does not cover every way of expressing a concept. `case=False` ignores case, `na=False` handles missing text, and word boundaries can distinguish a whole word from part of another word.
3. **Compare shares within groups.** The mean of a True/False mention column is the share of documents that match. Report each group's size. A group can contain more matches simply because it contains more documents.
4. **Inspect features.** Use column means and sorting to inspect average counts or TF-IDF weights. Counts reflect occurrences. TF-IDF gives each document a length-normalized set of weights by default. A high average weight can arise from many documents or a few strong contributions, so also check how many documents contain the term.
5. **Return to the source.** Save IDs with a summary and read complete examples. The first few rows may follow a source-specific order. A fixed random seed makes sample selection repeatable without making the underlying corpus representative.

The Monday comparison uses comments with an explicit leading NTA or YTA marker. Friday uses students’ own project groups and code; use Monday’s AITA notebook for practice before transferring the steps.

## How this connects to Weeks 9 and 10

- **Week 9:** use each TF-IDF row as a document vector, compute similarity, and read the nearest documents and shared terms. Matrix rows follow the input order. If you filter or reorder the document table, keep its matrix rows aligned or rebuild the matrix.
- **Week 10:** keep IDs and reference labels, score predictions on identical held-out documents, and read disagreements. Fit vocabulary and IDF on training texts only, then transform held-out texts. Related turns or paragraphs from the same source should stay together when splitting data.

Group comparisons and similarity are descriptive methods. Neither explains why a label was assigned or establishes that a word measures a social concept.
