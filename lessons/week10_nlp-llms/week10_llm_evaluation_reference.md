# Week 10: labeling text with models

Researchers label texts with models so they don't have to read every text. A label is a measurement, so you check it against texts labeled by hand before you count it. This week you practice on r/AmItheAsshole posts and replies, where the community's verdict is known. You compare three methods on the same texts: always guessing the most common verdict, a TF-IDF classifier, and Gemini. You read the mistakes, and you see what a change to Gemini's prompt does.

Monday's notebook uses the posts from HW4. Lab 10 checks Gemini on AITA replies that start with a verdict, then uses it on replies that have none. HW5 asks Gemini about 40 posts and about your project texts. This page collects the code and the results from Monday and the lab.

## When to label texts with a model

A label for each text turns many texts into a column you can count and compare, such as the share of app reviews that complain about ads. Labeling works like any measurement. You start from a concept, write a definition for each label, choose an instrument that applies the definitions, and check the instrument against texts you labeled by hand. Then you use it on the texts nobody read.

| Method | What it needs | Works well for | Struggles with |
|---|---|---|---|
| Reading the texts yourself | Time | Anything you can define | More than a few hundred texts |
| A keyword rule | A list of words | Concepts marked by words, such as *refund* or *price* | Sarcasm, negation, other wordings |
| A classifier | Hundreds of labeled texts | Many texts, fast and free | Rare labels, meaning beyond single words |
| An LLM | A written definition of each label | Sarcasm, stance, framing | Cost, model updates, texts sent to Google |

An LLM is worth trying when you have thousands of texts, a concept you can define in a sentence or two, and about 50 texts you can label by hand to check it. If a keyword finds the concept, use the keyword. If you can't define the concept, you can't check the labels either.

## Start with a baseline

Before you judge a model, check how well you could do without one. The simplest baseline always guesses the most common label. Its accuracy is the share of texts with that label.

```python
(posts["verdict"] == "NTA").mean()  # 0.85
```

A model has to beat this number to show that it learned something from the text. The baseline depends on the texts it is scored on:

| Texts | Always guessing NTA |
|---|---|
| 3,832 posts | 0.85 |
| 1,035 replies with a verdict | 0.63 |
| 40 posts, 10 of each verdict | 0.25 |

## Split the data

A model has to be judged on texts it did not learn from. `train_test_split` keeps a share of the texts aside as a test set. `stratify` keeps the share of each label the same in both parts, and `random_state` gives the same split every time.

```python
from sklearn.model_selection import train_test_split

train, test = train_test_split(posts, test_size=0.25, stratify=posts["verdict"], random_state=211)
```

## Train a classifier

TF-IDF turns each text into a row of word weights. Logistic regression learns which weights go with which label. Fit TF-IDF on the training texts only, and use `transform` for the test texts so they get the same columns.

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

tfidf = TfidfVectorizer(stop_words="english", min_df=5)
train_rows = tfidf.fit_transform(train["text"])
test_rows = tfidf.transform(test["text"])

model = LogisticRegression(max_iter=1000, class_weight="balanced")
model.fit(train_rows, train["verdict"])
test["prediction"] = model.predict(test_rows)
(test["prediction"] == test["verdict"]).mean()
```

With the course's versions of scikit-learn and SciPy, `LogisticRegression` prints `OptimizeWarning: Unknown solver options: iprint`. It does not change the results. The Week 10 notebooks hide it with `warnings.filterwarnings("ignore", message="Unknown solver options")`.

## Look past accuracy

Without `class_weight="balanced"`, the classifier predicted NTA for all 958 test posts. Its accuracy, 0.85, was the same as the baseline's. A confusion table shows this at once:

```python
pd.crosstab(test["verdict"], test["prediction"])  # rows: true label, columns: prediction
```

`class_weight="balanced"` makes mistakes on rare labels count more during training, so the model cannot win by always guessing NTA. Its accuracy is lower, but it finds some of the rare verdicts:

| Model | Accuracy | NTA | YTA | ESH | NAH |
|---|---|---|---|---|---|
| Default | 0.85 | 1.00 | 0.00 | 0.00 | 0.00 |
| `class_weight="balanced"` | 0.74 | 0.83 | 0.35 | 0.00 | 0.12 |

The columns after Accuracy give the accuracy for each verdict:

```python
test["correct"] = test["prediction"] == test["verdict"]
test.groupby("verdict")["correct"].mean()
```

Which model is better depends on which mistakes matter for your question. Report accuracy for each label, not only the total.

## Read the words and the errors

`model.coef_` holds one weight per word for each label. The words with the largest weights for ESH include names (*amber*, *drew*, *jake*) and details of single stories (*costume*, *piercing*). With 81 ESH posts to learn from, the model learned those posts, not what makes everyone behave badly.

```python
weights = pd.DataFrame(model.coef_.T, index=tfidf.get_feature_names_out(), columns=model.classes_)
weights["ESH"].sort_values(ascending=False).head(10)
```

Read texts the model got wrong, too. Many YTA posts read like NTA posts: someone describes a conflict with a partner or parent and explains why they were right. TF-IDF sees the topic, not the judgment.

The replies are harder still. With NTA and YTA removed from the text, the balanced classifier scores 0.58, below the baseline's 0.63. The verdict of a reply is in how it judges the poster ("That's way too dark a joke"), and NTA and YTA replies use the same topic words.

## Compare with an LLM

Score an LLM on the same texts as the other methods. On Monday we used Gemini's labels for 40 test posts, 10 of each verdict, made with the HW5 system instruction and schema:

| Method | Accuracy on the 40 posts |
|---|---|
| Always guessing NTA | 0.25 |
| Balanced classifier | 0.35 |
| Gemini (`gemini-3.5-flash-lite`) | 0.475 |

Gemini got 8 of 10 NTA posts and 7 of 10 YTA posts right, but only 3 ESH and 1 NAH post. It called 6 of the NAH posts NTA. Its reasons sound sensible even when the label is wrong: for one ESH post it wrote that leaving a date stranded "makes you an asshole too", then answered YTA.

## Free text or a fixed form

The labels above were made with a schema: Gemini had to answer with one of the four labels and a reason. We also asked Gemini about 8 of the posts in two other ways: with only the post, and with the system instruction but no schema. With no instruction, Gemini wrote essays of 138 to 642 words, with headings and bold text. With the instruction but no schema, it put a label first, in a different format each time ("NTA.", "**YTA**", "NTA" followed by "**Reason:**"). On 4 of the 8 posts, the label changed with the way of asking.

```python
SCHEMA = {
    "type": "object",
    "properties": {
        "llm_label": {"type": "string", "enum": ["ESH", "NAH", "NTA", "YTA"]},
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

`enum` lists the only labels allowed. A schema fixes the form of the answer, not its quality: the label can still be wrong.

## Change the prompt

The first prompt names the four labels but never says what separates them. The second prompt defines each one:

```text
- NTA (not the asshole): the poster was not in the wrong, and someone else was.
- YTA (you're the asshole): the poster was in the wrong, and the others were not.
- ESH (everyone sucks here): the poster was in the wrong, and someone else was too.
- NAH (no assholes here): nobody was in the wrong. They disagree, but each has a fair point.
```

We wrote the second prompt after reading Gemini's errors on the 40 posts above. We then asked Gemini about those 40 posts and about 40 other test posts, 10 of each verdict, with both prompts. Correct labels out of 10 for each verdict:

| Posts | Prompt | NTA | YTA | ESH | NAH | All 40 |
|---|---|---|---|---|---|---|
| same 40 | first | 8 | 7 | 3 | 1 | 19 |
| same 40 | second | 8 | 6 | 5 | 2 | 21 |
| other 40 | first | 7 | 8 | 6 | 0 | 21 |
| other 40 | second | 7 | 8 | 7 | 0 | 22 |

The second prompt helped a little. ESH went up by two posts on the same 40 and by one on the other 40. NAH barely moved: on the other 40, Gemini never answered NAH with either prompt. The first prompt, run again a week later on the same 40 posts, got 22 right instead of 19, so a difference of one or two posts can come from rerunning alone.

The second prompt was written for the same 40 posts, so its score there is too optimistic. The other 40 posts played no part in writing it, so that is the score to report. This is the train and test split again: change the prompt on some texts, and report the score on others. With 50 hand-labeled texts, you could write the prompt on 20 and report the score on the other 30.

Other changes to try, one at a time: add an `unclear` label; say what one text is and where it comes from; give two or three examples taken from texts you won't score; split a hard label into yes/no questions; tell the model to use only what is in the text. When you and the model disagree because the definition is unclear, fix the definition first.

## An easier label: false positives and false negatives

Replies are easier to label than posts. `data/week10_reply_labels.csv` has 20 replies with the verdict word removed, 10 NTA and 10 YTA, labeled by a word search, the TF-IDF classifier and three Gemini prompts. Say you are looking for YTA replies. A **false positive** is an NTA reply labeled YTA: the method finds something that is not there. A **false negative** is a YTA reply labeled NTA: the method misses something that is there.

| Method | Accuracy | False positives | False negatives | Share labeled YTA |
|---|---|---|---|---|
| Word search (*rude*, *apologize*, *should have*, ...) | 0.55 | 2 | 7 | 0.25 |
| Classifier | 0.35 | 6 | 7 | 0.45 |
| Gemini: `Label this reply NTA or YTA.` | 0.80 | 0 | 4 | 0.30 |
| Gemini: careful instruction | 0.80 | 2 | 2 | 0.50 |
| Gemini: `Is this comment positive or negative?` | 0.60 | 7 | 1 | 0.80 |

The true share of YTA replies is 0.50. A one-line prompt does as well as the careful instruction, but the two make different mistakes. The tone prompt measures tone, not the verdict: many NTA replies are negative about someone else in the story. If you want the share of a label, mistakes that cancel can still give the right share, as the classifier shows. If you want to collect texts with a label to read, false positives waste your time and false negatives hide cases.

Two common summaries for the label you are looking for: **precision** is the share of texts labeled YTA that are YTA, and **recall** is the share of YTA texts that were labeled YTA. The short prompt has precision 1.00 and recall 0.60; the tone prompt has precision 0.56 and recall 0.90.

## Lab 10: check, then use

Most replies start with a verdict, and for those the verdict already says whether the reply found the poster in the wrong. That gives you a check for free. Lab 10 asks Gemini a yes/no question, whether the reply says the poster was in the wrong, on the 20 replies above with the verdict words removed. Then it uses the same instruction on 20 of the 176 replies that have no verdict word, where nothing else gives the answer.

On the 20 replies with a verdict, always guessing "no" gets 0.50 and the word search gets 0.55. In Monday's file, the short and the careful Gemini prompts each got 16 of 20; the lab's yes/no instruction is different, so its score can differ. On all 1,035 replies with a verdict, the word search gets 0.61, below always guessing "no" at 0.63. It labels 87 replies yes, 54 of them wrongly, and misses 345 of the 378 YTA replies.

The check has a limit. Every reply with a verdict takes a side. Some replies with no verdict take no side, such as a reply that only points to another subreddit, and the check can't tell you how Gemini labels those. Read them before you count them.

## How much to trust a number

- **The split.** Five other splits of the posts gave the balanced classifier accuracies between 0.70 and 0.75.
- **Small samples.** On 40 posts, one post is 2.5 percentage points. Differences of a few posts between methods can come from which posts were picked.
- **Repeated runs.** Gemini can give a different label to the same text on another run, and models are updated or retired. The first prompt, run again a week later on the same 40 posts, gave the same label for 34 of them. Save every answer with the model name and the date, and keep the system instruction you used.
- **The label.** The AITA verdict is the result of a vote, not a fact about who was right. In HW4 you labeled your own texts; when you and Gemini disagree, either of you can be wrong, or the definition can be unclear.

## Using this in your final project

If your project labels texts with a classifier or an LLM, report:

- what one text is, how many you labeled by hand, and who labeled them;
- the baseline: always guessing your most common label;
- how you split the texts, or which texts the LLM labeled, and which texts you used to write the prompt;
- accuracy overall and for each label, with the number of texts;
- a confusion table;
- three texts the method got wrong, and why;
- the model name, the date, and the system instruction, if you used an LLM.

Not every project needs a classifier. A study that describes a corpus needs checks that fit its claims, such as reading a sample of the texts behind each number.

## Keys and data

Keep your Gemini key in the `.env` file (see "API keys" in `SETUP.md`), never in a notebook or an AI chat. Everything you send to Gemini goes to Google, so leave out texts with names, usernames, or other details that identify a person.

## About the course data

The posts are 3,832 of the 5,000 most upvoted r/AmItheAsshole posts from 2018 to 2021 that have one of the four verdicts and a text that was not removed: 3,239 NTA, 386 YTA, 108 ESH, and 99 NAH. The replies are 1,512 historical replies: 1,035 start with NTA or YTA, and 176 have no verdict word. Both samples favor highly scored posts and replies and do not represent Reddit users or public opinion.

## Documentation

- [train_test_split](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html)
- [LogisticRegression](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html)
- [pandas crosstab](https://pandas.pydata.org/docs/reference/api/pandas.crosstab.html)
- [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output)
- [Törnberg, Best Practices for Text Annotation with Large Language Models](https://sociologica.unibo.it/article/view/19461)
