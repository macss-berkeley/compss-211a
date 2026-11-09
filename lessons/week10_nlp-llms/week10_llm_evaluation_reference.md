# Week 10: measuring text with TF-IDF, embeddings and LLM labels

Researchers turn texts into something they can count. This week compares three ways to do that on r/AmItheAsshole posts: TF-IDF word weights, embeddings, and labels from an LLM. A label is a measurement, so before you count it you check it against labels you made by hand.

Monday's demo and notebook use the same 785 posts. HW5 checks Gemini on the 50 project texts you labeled in HW4. This page collects the code and the results.

## The posts

`data/week10_posts.csv` has 785 posts of 100 to 300 words, one row per post, with the columns `id`, `title`, `text` and `verdict`. The verdict is the post's flair, which the subreddit sets from the top comment: NTA (not the asshole) or YTA (you're the asshole).

```python
posts = pd.read_csv("week10_posts.csv")
posts["verdict"].value_counts()  # NTA 682, YTA 103
```

Each method below gives one result per post, in the same row order as `posts`.

## TF-IDF: which words go with a group

TF-IDF gives each post one weight per word. A weight is high when the word is frequent in this post and rare in the others. With `min_df=30`, only words that appear in at least 30 posts get a column; there are 350.

```python
from sklearn.feature_extraction.text import TfidfVectorizer

tfidf = TfidfVectorizer(stop_words="english", min_df=30)
weights = pd.DataFrame(tfidf.fit_transform(posts["text"]).toarray(),
                       columns=tfidf.get_feature_names_out())  # 785 rows, 350 columns
```

To compare the verdicts, average the rows of the NTA posts and of the YTA posts, then divide one average by the other:

```python
# one row per word: its average weight in the NTA posts and in the YTA posts
by_verdict = pd.DataFrame({
    "NTA": weights[posts["verdict"] == "NTA"].mean(),
    "YTA": weights[posts["verdict"] == "YTA"].mean(),
})
by_verdict["ratio"] = by_verdict["YTA"] / by_verdict["NTA"]  # above 1: more common in YTA posts
```

The six words with the highest ratio are *children*, *looks*, *born*, *wife*, *feels* and *looking*. The six with the lowest are *bedroom*, *sick*, *food*, *cut*, *sorry* and *calling*. The differences are small. The verdict is about what the poster did, and single words rarely show that. TF-IDF needs groups you already have, here the verdict.

## Embeddings: texts about the same thing

An embedding model turns each post into 384 numbers. No single number stands for a word. Posts about similar things get similar numbers, so you can search the posts with a sentence.

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")  # about 90 MB, downloaded once
embeddings = model.encode(posts["text"].tolist(), normalize_embeddings=True)  # 785 rows, 384 columns

query = model.encode(["My roommate keeps eating my food."], normalize_embeddings=True)[0]
posts["similarity"] = embeddings @ query
posts.sort_values("similarity", ascending=False).head(4)
```

The four closest posts are about sharing food and space: eating non-halal food with a roommate, locking up pots and pans, a roommate's girlfriend and a diet, and ordering a meat dish with a vegan friend. The fourth title doesn't mention a roommate. A search for the word *roommate* finds 24 posts, and would miss posts that use other words.

## LLM labels: a category you define

An LLM answers a question you write, once for each post. The answer becomes a new column. The question this week is whether the poster admits fault. No column in the data has that answer.

```python
from google import genai
from google.genai import types

client = genai.Client(api_key=GEMINI_API_KEY)  # your key, from the .env file
definition = ("Label whether the poster admits that they did something wrong.\n"
              "yes: the poster says that something they did was wrong, unfair,\n"
              "or an overreaction, even in passing.\n"
              "no: the poster does not admit any fault. Give a reason of one sentence.")

def label(text):
    response = client.models.generate_content(model="gemini-3.5-flash-lite", contents=text,
        config=types.GenerateContentConfig(system_instruction=definition))
    return response.text
```

The definition goes in as the system instruction, and the post is the content. Each post is one call, and another run can give a different answer. TF-IDF weights and embeddings come out the same whatever your question is. A label depends on the question you ask.

## Choosing a method

| | Words (TF-IDF) | Embeddings | LLM labels |
|---|---|---|---|
| Gives each text | One weight per word | 384 numbers | One label you define |
| Question it answers | Which words go with a group? | Which texts are about the same thing? | Does each text fit a category you define? |
| What you need | Groups you already have | Only the texts | A definition, and texts you labeled by hand |
| Project example | Words that differ between 2019 and 2023 reviews | Posts about rent, including ones without the word | The share of speeches that frame homelessness as crime |

## Check for existing labels first

Before you use an LLM, check whether you already have the label.

1. **The metadata.** The verdict is in the flair, so you don't need a model for it. No column says whether the poster admits fault.
2. **The text.** A keyword rule finds some admissions. It labels 87 of the 785 posts yes. Check that it finds what you mean: a phrase can appear without an admission, and an admission can use other words.
3. **The rest.** Use an LLM for what no column and no keyword rule gives you, and check its labels.

```python
words = r"my fault|I was wrong|I overreacted|I shouldn|I admit|I regret|I feel bad|I apologi"
posts["keyword"] = posts["text"].str.contains(words, case=False).map({True: "yes", False: "no"})
```

## Labeling is measurement

A label measures a concept, the way a survey question does. The steps and terms below come from Adcock and Collier (2001), Krippendorff (2018) and Grimmer, Roberts and Stewart (2022).

| Step | What it means | For the AITA posts |
|---|---|---|
| Concept | The idea you want to measure | Does the poster admit fault? |
| Conceptualization | A written definition with a rule for each label (a codebook) | yes: says something they did was wrong, unfair, or an overreaction. no: admits no fault. |
| Operationalization | A procedure that applies the definition to each text: hand coding, a keyword rule, a classifier, or an LLM | Gemini, with the definition as its instruction |
| Validation | Validity: the labels agree with labels you trust. Reliability: the same text gets the same label from another coder or another run. | Validity: 24 to 27 of 30 agree with the hand labels, by run. Reliability: 26 of 30 get the same answer in 5 runs. |
| Scoring | Apply the procedure to the rest of the texts and analyze the labels | Label more posts and compare NTA posts with YTA posts |

## Your answer key: label texts by hand

To check Gemini, you need labels you trust for some of the posts. Label a sample yourself, with the same definition and without looking at the model's labels. For this week, 30 posts, 15 NTA and 15 YTA, were labeled with the verdicts hidden: 4 yes and 26 no.

`data/week10_post_labels.csv` has those 30 posts with the hand label (`hand`), the keyword rule (`keyword`), and Gemini's label and reason from one run (`gemini`, `gemini_reason`).

### Two labelers: agreement and kappa

One person's labels can be wrong too. Before you use hand labels as an answer key, have two people label the same texts with the same definition, without talking. **Agreement** is the share of texts they give the same label. If they often disagree, fix the definition before you check a model.

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

## Start with a baseline

Before you judge a method, check how well you could do without one. The simplest baseline always guesses the most common label. Its accuracy is the share of texts with that label. On the 30 hand-labeled posts, the most common label is no (26 of 30), so always guessing no gets 0.87. Compare every method with this number.

## Checking Gemini against the hand labels

```python
labels = pd.read_csv("week10_post_labels.csv")
(labels["gemini"] == labels["hand"]).mean()  # accuracy: the share of posts where gemini agrees with hand
```

| Method | Accuracy on the 30 posts |
|---|---|
| Always guessing no | 0.87 |
| Keyword rule | 0.73 |
| Gemini, one run | 0.83 |

Both methods score below the baseline. With only 4 yes posts in 30, a rule that never says yes is right 26 times, but it never finds a post that admits fault. Gemini's other four runs agree with the hand labels on 24 to 27 of 30, so its accuracy is close to the baseline either way. Accuracy can't show which method finds the admissions. The two kinds of mistakes can.

## False positives and false negatives

Say you are looking for posts where the poster admits fault, so yes is the positive label.

| | Gemini: no | Gemini: yes |
|---|---|---|
| Hand label: no | True negative | False positive |
| Hand label: yes | False negative | True positive |

A confusion table counts each kind. Put the hand labels in the rows:

```python
pd.crosstab(labels["hand"], labels["gemini"])
```

Accuracy counts both kinds of mistakes the same way, but they matter in different ways:

| Method | Accuracy | False positives | False negatives | Share labeled yes |
|---|---|---|---|---|
| Keyword rule | 0.73 | 5 | 3 | 0.20 |
| Gemini | 0.83 | 4 | 1 | 0.23 |

The share of yes in the hand labels is 0.13. Both methods say yes more often, because they make more false positives than false negatives. Used to estimate how many posters admit fault, Gemini would give a share that is too high. Used to collect posts that admit fault, 4 of the 7 posts it collected would not.

Two common summaries for the positive label: **precision** is the share of posts labeled yes that have yes as the hand label, and **recall** is the share of hand-labeled yes posts that were labeled yes. Gemini has precision 0.43 and recall 0.75.

## Reliability: the same post, five runs

Gemini labeled each of the 30 posts five times with the same instruction. 26 got the same answer in all five runs. These four changed:

| Post | Verdict | Yes | No |
|---|---|---|---|
| AITA for getting mad at my parents after they didn't tell me about my autism diagnosis…? | NTA | 2 | 3 |
| WIBTA for telling the bride I'm backing out as her bridesmaid | NTA | 1 | 4 |
| AITA for announcing my pregnancy at my best friend's wedding? | YTA | 1 | 4 |
| AITA for making my girlfriend's son give me his gambling winnings? | YTA | 1 | 4 |

An LLM writes its answer one token (a word or part of a word) at a time. For each token it picks from the likely next tokens, with some randomness. When yes and no are about equally likely, a rerun can flip the answer. If labels change between runs, so do your counts. Across the five runs, 24 to 27 of the 30 labels agree with the hand labels.

Reliable is not the same as valid. The keyword rule gives the same label every time, but it agrees with the hand labels on 22 of 30. Reliability needs no answer key: compare two runs, or two labelers. Validity needs one.

## A rule for each borderline case

Read the posts where Gemini changed its answer. Group them by theme, and write one rule for each theme:

| Theme | From the post | Rule |
|---|---|---|
| Punished, not admitting | "I got grounded for saying that." | Saying you were punished, or that someone got angry, is not admitting fault: no. |
| Apologizing to keep the peace | "I was apologetic but explained my reasoning." | An apology counts only if the poster says they did something wrong. |
| Asking, not admitting | "I'm wondering if I was wrong." | Asking whether you were wrong is not admitting it: no. |
| Changing plans | "I might as well commit to it." | Changing plans after advice is not admitting fault, unless the poster says the first plan was wrong. |

Other ways to get more reliable labels:

- add two or three labeled borderline examples, taken from texts you won't score;
- add an `unclear` label for texts that can't be judged from the text alone;
- label each text three or five times and keep the most common label;
- use a stronger model, which costs more.

After each change, check again on texts you did not use to write the instruction.

## Using the label

Once the label is checked, label more posts and compare groups. Gemini and the keyword rule labeled all 103 YTA posts and 103 NTA posts, one run each:

| Method | NTA posts that admit fault | YTA posts that admit fault |
|---|---|---|
| Keyword rule | 9 of 103 (9%) | 12 of 103 (12%) |
| Gemini | 13 of 103 (13%) | 24 of 103 (23%) |

The two methods give different answers: almost no difference, or YTA posters admitting fault about twice as often. On the 30 hand-labeled posts both methods said yes too often, so both shares are probably too high. The hand labels found 2 admissions in 15 NTA posts and 2 in 15 YTA posts, but 30 posts are too few to settle the question. Before you report a difference between groups, check the method on texts from each group.

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

- **Small samples.** On 30 posts, one post is about 3 percentage points. A difference of a post or two between methods can come from which posts were picked.
- **Reruns.** The same instruction on the same 30 posts agreed with the hand labels 24 to 27 times, depending on the run. Models are also updated and retired. Save every answer with the model name and the date, and keep the system instruction you used.
- **The answer key.** Hand labels are one person's reading of the definition. If two of you label the same texts, fix the definition where you disagree before you check a model.
- **Disagreements.** When you and Gemini disagree, either of you can be wrong, or the definition can be unclear. Read the posts before you decide.

## Using this in your final project

If your project labels texts with a model, report:

- the baseline: always guessing your most common label;
- which texts each method was scored on, and how many;
- accuracy overall and for each label;
- a confusion table, with false positives and false negatives for the label you care about;
- three texts a method got wrong, and why;
- agreement and kappa between two labelers, if two of you labeled the same texts;
- for an LLM: the model name, the date, the system instruction, and which texts you used to write it.

Not every project needs labels. A study that describes a corpus with word weights or embeddings needs checks that fit its claims, such as reading a sample of the texts behind each number.

## Keys and data

Keep your Gemini key in the `.env` file (see "API keys" in `SETUP.md`), never in a notebook or an AI chat. Everything you send to Gemini goes to Google, so leave out texts with names, usernames, or other details that identify a person.

## About the course data

The 785 posts come from the 5,000 most upvoted r/AmItheAsshole posts from 2018 to 2021. They are the posts with the flair "Not the A-hole" or "Asshole", 100 to 300 words, and a text that was not removed. The 30 hand-labeled posts are 15 of each verdict, drawn at random. The sample favors highly upvoted posts and does not represent Reddit users or public opinion.

## Documentation

- [TfidfVectorizer](https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html)
- [Sentence Transformers](https://sbert.net/)
- [pandas crosstab](https://pandas.pydata.org/docs/reference/api/pandas.crosstab.html)
- [cohen_kappa_score](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.cohen_kappa_score.html)
- [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output)
- [Törnberg, Best Practices for Text Annotation with Large Language Models](https://sociologica.unibo.it/article/view/19461)
