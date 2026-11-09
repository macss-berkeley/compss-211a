# Week 10: labeling text with models

Researchers turn texts into something they can count. This week compares three ways to do that on r/AmItheAsshole comments: TF-IDF word weights, embeddings, and labels from an LLM. A label is a measurement, so you check it before you count it, either against an answer you already have or against labels you made by hand.

Monday's notebook works with 1,035 comments that start with a verdict. Lab 10 checks Gemini on comments with a verdict, then uses it on comments with none. HW5 checks Gemini on the 50 project texts you labeled in HW4. This page collects the code and the results.

## The comments

Most comments in r/AmItheAsshole start with a verdict: NTA (not the asshole) or YTA (you're the asshole). The code takes the verdict from the first word, then removes every verdict word from the text, so no method can just read it.

```python
comments = pd.read_csv("aita_replies.csv")
comments["verdict"] = comments["body"].str.upper().str.extract(r"^(NTA|YTA)\b")[0]
comments = comments.dropna(subset=["verdict"]).reset_index(drop=True)  # 1,035 comments

verdict_words = r"\b(NTA|YTA|ESH|NAH|INFO)\b"
comments["text"] = comments["body"].str.replace(verdict_words, "", regex=True, case=False)
comments["text"] = comments["text"].str.lstrip(" .,:;!-–—")
```

Each method below gives one result per comment, in the same row order as `comments`.

## TF-IDF: which words go with a group

TF-IDF gives each comment one weight per word. A weight is high when the word is frequent in this comment and rare in the others. With `min_df=15`, only words that appear in at least 15 comments get a column; there are 220.

```python
from sklearn.feature_extraction.text import TfidfVectorizer

tfidf = TfidfVectorizer(stop_words="english", min_df=15)
weights = pd.DataFrame(tfidf.fit_transform(comments["text"]).toarray(),
                       columns=tfidf.get_feature_names_out())  # 1,035 rows, 220 columns
```

To compare the verdicts, average the rows in each group and divide one average by the other:

```python
by_verdict = weights.groupby(comments["verdict"]).mean().T  # one row per word, columns NTA and YTA
by_verdict["ratio"] = by_verdict["YTA"] / by_verdict["NTA"]  # above 1: more common in YTA comments
```

The six words with the highest ratio are *fun*, *look*, *knew*, *world*, *dude* and *yeah*; *look*, *knew* and *dude* address the poster. The six with the lowest are *behavior*, *respect*, *able*, *change*, *won* and *guy*; *behavior*, *respect* and *guy* describe other people in the story. TF-IDF needs groups you already have, here the verdict.

## Embeddings: texts about the same thing

An embedding model turns each comment into 384 numbers. No single number stands for a word. Comments about similar things get similar numbers, so you can search the comments with a sentence.

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")  # about 90 MB, downloaded once
embeddings = model.encode(comments["text"].tolist(), normalize_embeddings=True)  # 1,035 rows, 384 columns

query = model.encode(["Your partner is controlling you."], normalize_embeddings=True)[0]
comments["similarity"] = embeddings @ query
comments.sort_values("similarity", ascending=False).head(4)
```

Only 6 comments use the word *controlling*. Two of the four closest comments don't: "your girlfriend is disregarding your discomfort" and "your GF has some insecurity/trust issues". The closest one calls the poster controlling, not the partner. An embedding finds what a comment is about, not what it says about it.

## LLM labels: a category you define

An LLM answers a question you write, once for each comment. The answer becomes a new column.

```python
from google import genai

client = genai.Client(api_key=GEMINI_API_KEY)  # your key, from the .env file
question = ("Does this comment say the poster was in the wrong? "
            "Answer yes or no, then give a one-sentence reason.")

def label(text):
    response = client.models.generate_content(model="gemini-3.5-flash-lite",
                                              contents=question + "\n\nComment: " + text)
    return response.text
```

Each comment is one call, and another run can give a different answer. TF-IDF weights and embeddings come out the same whatever your question is. A label depends on the question you ask.

## Choosing a method

| | Words (TF-IDF) | Embeddings | LLM labels |
|---|---|---|---|
| Gives each text | One weight per word | 384 numbers | One label you define |
| Question it answers | Which words go with a group? | Which texts are about the same thing? | Does each text fit a category you define? |
| What you need | Groups you already have | Only the texts | A definition, and texts you labeled by hand |
| Project example | Words that differ between 2019 and 2023 reviews | Posts about rent, including ones without the word | The share of speeches that frame homelessness as crime |

## Labeling is measurement

A label measures a concept, the way a survey question does. The steps and terms below come from Adcock and Collier (2001), Krippendorff (2018) and Grimmer, Roberts and Stewart (2022).

| Step | What it means | For the AITA comments |
|---|---|---|
| Concept | The idea you want to measure | Does a comment say the poster was in the wrong? |
| Conceptualization | A written definition with a rule for each label (a codebook) | yes: says the poster did something wrong. no: says they didn't, or blames someone else. |
| Operationalization | A procedure that applies the definition to each text: hand coding, a keyword rule, a classifier, or an LLM | Gemini, with the definition as its instruction |
| Validation | Validity: the labels agree with labels you trust. Reliability: the same text gets the same label from another coder or another run. | 16 of 20 labels agree with the commenter's verdict. Two runs got 16 and 17. |
| Scoring | Apply the procedure to the rest of the texts and analyze the labels | Label the 176 comments with no verdict word and count the yes labels |

Before you use an LLM, check whether you already have the label. Posts have the verdict in their flair. Of the 1,512 comments, 1,336 use a verdict word, so a keyword rule gets their label. Only the 176 comments with no verdict word need another method.

## Start with a baseline

Before you judge a method, check how well you could do without one. The simplest baseline always guesses the most common label. Its accuracy is the share of texts with that label, so it depends on which texts you score:

| Texts | Always guessing NTA |
|---|---|
| 1,035 comments with a verdict | 0.63 |
| 20 comments, 10 of each verdict | 0.50 |

A method has to beat this number to show that it learned something from the text.

## Checking labels on 20 comments

`data/week10_reply_labels.csv` has 20 comments, 10 NTA and 10 YTA, with the verdict word removed before labeling. Four methods labeled them:

| Method | Accuracy |
|---|---|
| Always guessing NTA | 0.50 |
| Word search (*rude*, *should have*, ...) | 0.55 |
| Gemini, short prompt: `Label this reply NTA or YTA.` | 0.80 |
| Gemini, longer instruction that defines NTA and YTA | 0.80 |

This check has limits. Removing the verdict word can remove the evidence, since some comments only make sense with the word or the post. And comments that start with a verdict may differ from the 176 that don't.

## False positives and false negatives

Say you are looking for YTA comments, so YTA is the positive label.

| | Labeled NTA | Labeled YTA |
|---|---|---|
| True NTA | True negative | False positive |
| True YTA | False negative | True positive |

A confusion table counts each kind. Put the true label in the rows:

```python
pd.crosstab(reply_labels["verdict"], reply_labels["gemini_careful"])
```

Accuracy counts both kinds of mistakes the same way, but they matter in different ways:

| Method | Accuracy | False positives | False negatives | Share labeled YTA |
|---|---|---|---|---|
| Gemini, short prompt | 0.80 | 0 | 4 | 0.30 |
| Gemini, longer instruction | 0.80 | 2 | 2 | 0.50 |

The true share of YTA is 0.50. If you want the share of a label, mistakes that cancel can still give the right share, as the longer instruction does. If you want to collect YTA comments to read, they don't cancel: false positives waste your time and false negatives hide cases.

Two common summaries for the positive label: **precision** is the share of comments labeled YTA that are YTA, and **recall** is the share of YTA comments that were labeled YTA. The short prompt has precision 1.00 and recall 0.60.

## Sentiment is not the verdict

Sentiment is a label too: is a text positive or negative? VADER, in NLTK, uses a list of about 7,500 words, each with a score (*good* +1.9, *bad* −2.5). It adds up the scores in a text and gives a number from −1 to +1. It is free and gives the same result every run.

```python
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

nltk.download("vader_lexicon", quiet=True)  # the word list, downloaded once
sia = SentimentIntensityAnalyzer()
comments["vader"] = comments["text"].map(lambda text: sia.polarity_scores(text)["compound"])
```

Gemini, asked "Is this comment positive or negative?", reads the whole comment. On the 20 comments, VADER and Gemini agree on 10. VADER scores "That table absolutely deserved to be kicked out ... Good for you for sticking up for your worth!" at −0.86, negative; Gemini calls it positive.

If negative counts as YTA, VADER gets 0.50 against the verdict and Gemini 0.60. Gemini's sentiment labels include 7 false positives: NTA comments that are negative because they criticize someone else in the story. Its precision is 0.56 and its recall 0.90. Sentiment measures tone, not who is at fault.

With a written definition, an LLM can apply more specific labels, such as whom a comment criticizes (the poster, someone else, or no one). Each one is a new concept that needs its own definition and its own check.

## A label with no answer key: agreement and kappa

Does the poster admit fault? No column holds the answer for that. Gemini labeled 40 short posts, 10 of each verdict, with this definition:

```text
Label whether the poster admits that they did something wrong.
- yes: the poster says that something they did was wrong, unfair, or an overreaction, even in passing.
- no: the poster does not admit any fault.
```

It said yes for 4 of the 40: 1 ESH, 2 NAH, 0 NTA and 1 YTA post. To check labels like these, two people label the same texts with the same definition, without talking. **Agreement** is the share of texts they give the same label.

When one label is rare, agreement is high by chance. Say labelers A and B each say yes to 2 of 10 posts and agree on 8. Two labelers who said yes at random at that rate would still agree on about 7. **Cohen's kappa** (Cohen 1960) corrects for chance:

```text
expected by chance = P(A yes) × P(B yes) + P(A no) × P(B no) = 0.2 × 0.2 + 0.8 × 0.8 = 0.68
kappa = (agreement − expected) / (1 − expected) = (0.80 − 0.68) / (1 − 0.68) = 0.375
```

```python
from sklearn.metrics import cohen_kappa_score

cohen_kappa_score(labels_a, labels_b)  # 0.375
```

Kappa is 1 for perfect agreement, 0 for what chance would give, and below 0 for less than chance. For more than two labelers, use Krippendorff's alpha (Krippendorff 2018).

## Free text or a fixed form

Asked about one post with no instruction, Gemini wrote 449 words that began with its own verdict ("This is a classic case of 'Everyone Sucks Here'"). With an instruction but no schema, it wrote 15 words that began with the label. With a schema, it returned a label from a fixed list and a reason, which Python can read with `json.loads(response.text)`:

```python
SCHEMA = {
    "type": "object",
    "properties": {
        "llm_label": {"type": "string", "enum": ["yes", "no"]},
        "llm_reason": {"type": "string"},
    },
    "required": ["llm_label", "llm_reason"],
}
config = types.GenerateContentConfig(
    system_instruction=SYSTEM,
    response_mime_type="application/json",
    response_schema=SCHEMA,
)
```

`enum` lists the only labels allowed, and `required` makes every answer include a label and a reason. A schema controls the format of the answer, not whether the label is correct.

## When to use an LLM

Use an LLM when you have thousands of texts, the concept fits in a sentence or two, the meaning goes beyond single words (sarcasm, stance, framing), and you can label about 50 texts by hand to check it.

Don't use one when:

- you have about 50 texts: label them by hand;
- a keyword rule works, such as "mentions a price";
- you can't define the concept, so you can't check the labels;
- the texts can't be sent to Google, such as texts with names or private messages.

Each call costs money. At current prices, $50 buys about 150,000 calls to `gemini-3.5-flash-lite`, the model used this week. Models that think (hidden reasoning, billed as output) cost more: on 20 posts, thinking set to high cost 6 times as much. Prices change, so check them before a large run.

## Lab 10: check, then use

Most comments start with a verdict, and for those the verdict already says whether the comment found the poster in the wrong. That gives you a check for free. Lab 10 asks Gemini a yes/no question, whether the comment says the poster was in the wrong, on the 20 comments above with the verdict words removed. Then it uses the same instruction on 20 of the 176 comments with no verdict word, where nothing else gives the answer.

On the 20 comments with a verdict, always guessing "no" gets 0.50, and the lab's keyword rule (*rude*, *selfish*, *should have*, or a word starting with *apologi*) gets 0.55. The lab's yes/no instruction is not the same as the two NTA/YTA prompts above, so its score can differ from their 0.80. On all 1,035 comments with a verdict, the keyword rule gets 0.61, below always guessing "no" at 0.63. It labels 87 comments yes, 54 of them wrongly, and misses 345 of the 378 YTA comments.

The check has a limit. Every comment with a verdict takes a side. Some comments with no verdict take no side, such as a comment that only points to another subreddit, and the check can't tell you how Gemini labels those. Read them before you count them.

## For HW5: write the instruction on some texts, score it on others

If you change an instruction until it fits the texts you are reading, its score on those texts is too high. In HW5 you read Gemini's mistakes and change the instruction on 20 of your 50 hand-labeled texts. Then you score the final instruction once on the other 30 and report that score.

Ways to improve an instruction, one change at a time:

- define each label in one sentence, including how to tell similar labels apart;
- add an `unclear` label;
- describe the texts and where they come from;
- add two or three examples from texts you won't score;
- split a complex label into yes/no questions.

When you and the model disagree because the definition is unclear, fix the definition first.

## How much to trust a number

- **Small samples.** On 20 comments, one comment is 5 percentage points. A difference of a comment or two between methods can come from which comments were picked.
- **Reruns.** The same prompt on the same 20 comments got 17 right one day and 16 the next. Models are also updated and retired. Save every answer with the model name and the date, and keep the system instruction you used.
- **The answer key.** A commenter's verdict is one person's view, not a fact about who was right.
- **Your hand labels.** When you and Gemini disagree, either of you can be wrong, or the definition can be unclear. If two of you label the same texts, fix the definition where you disagree before you check a model.

## Using this in your final project

If your project labels texts with a model, report:

- the baseline: always guessing your most common label;
- which texts each method was scored on, and how many;
- accuracy overall and for each label;
- a confusion table, with false positives and false negatives for the label you care about;
- three texts a method got wrong, and why;
- with no answer key: agreement and kappa between two labelers;
- for an LLM: the model name, the date, the system instruction, and which texts you used to write it.

Not every project needs labels. A study that describes a corpus with word weights or embeddings needs checks that fit its claims, such as reading a sample of the texts behind each number.

## Keys and data

Keep your Gemini key in the `.env` file (see "API keys" in `SETUP.md`), never in a notebook or an AI chat. Everything you send to Gemini goes to Google, so leave out texts with names, usernames, or other details that identify a person.

## About the course data

The comments are 1,512 historical comments on r/AmItheAsshole posts: 1,035 start with NTA or YTA, and 176 have no verdict word. The 40 posts for the admits-fault label are 10 of each verdict, with 120 to 300 words, drawn from 3,832 of the 5,000 most upvoted r/AmItheAsshole posts from 2018 to 2021 that have one of the four verdicts and a text that was not removed. Both samples favor highly scored posts and comments and do not represent Reddit users or public opinion.

## Documentation

- [TfidfVectorizer](https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html)
- [Sentence Transformers](https://sbert.net/)
- [NLTK sentiment analysis, including VADER](https://www.nltk.org/howto/sentiment.html)
- [pandas crosstab](https://pandas.pydata.org/docs/reference/api/pandas.crosstab.html)
- [cohen_kappa_score](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.cohen_kappa_score.html)
- [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output)
- [Törnberg, Best Practices for Text Annotation with Large Language Models](https://sociologica.unibo.it/article/view/19461)
