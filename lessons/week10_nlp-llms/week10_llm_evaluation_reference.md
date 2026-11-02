# Week 10: evaluating predictions

How do you know whether a model's labels are good enough to use? This week you predict the verdicts of r/AmItheAsshole posts and replies with three methods: always guessing the most common verdict, a TF-IDF classifier, and Gemini. You score each on the same texts and read the mistakes.

Monday's notebook uses the posts from HW4. Lab 10 uses the replies from Weeks 8 and 9. HW5 asks Gemini about 40 posts and about your project texts. This page collects the code and the results from Monday and the lab.

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

TF-IDF turns each text into a row of word weights (Week 8). Logistic regression learns which weights go with which label. Fit TF-IDF on the training texts only, and use `transform` for the test texts so they get the same columns.

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

On the replies in Lab 10, Gemini got 17 of 20 right, the classifier 7, and always guessing NTA 10. Two of Gemini's misses were NTA replies that went on to criticize the poster.

## How much to trust a number

- **The split.** Five other splits of the posts gave the balanced classifier accuracies between 0.70 and 0.75.
- **Small samples.** On 40 posts, one post is 2.5 percentage points. Differences of a few posts between methods can come from which posts were picked.
- **Repeated runs.** Gemini can give a different label to the same text on another run, and models are updated or retired. Save every answer with the model name and the date, and keep the system instruction you used.
- **The label.** The AITA verdict is the result of a vote, not a fact about who was right. In HW4 you labeled your own texts; when you and Gemini disagree, either of you can be wrong, or the definition can be unclear.

## Using this in your final project

If your project labels texts with a classifier or an LLM, report:

- what one text is, how many you labeled by hand, and who labeled them;
- the baseline: always guessing your most common label;
- how you split the texts, or which texts the LLM labeled;
- accuracy overall and for each label, with the number of texts;
- a confusion table;
- three texts the method got wrong, and why;
- the model name, the date, and the system instruction, if you used an LLM.

Not every project needs a classifier. A study that describes a corpus needs checks that fit its claims, such as reading a sample of the texts behind each number.

## Keys and data

Keep your Gemini key in the `.env` file (see "API keys" in `SETUP.md`), never in a notebook or an AI chat. Everything you send to Gemini goes to Google, so leave out texts with names, usernames, or other details that identify a person.

## About the course data

The posts are 3,832 of the 5,000 most upvoted r/AmItheAsshole posts from 2018 to 2021 that have one of the four verdicts and a text that was not removed: 3,239 NTA, 386 YTA, 108 ESH, and 99 NAH. The replies are 1,035 historical replies that start with NTA or YTA. Both samples favor highly scored posts and replies and do not represent Reddit users or public opinion.

## Documentation

- [train_test_split](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html)
- [LogisticRegression](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html)
- [pandas crosstab](https://pandas.pydata.org/docs/reference/api/pandas.crosstab.html)
- [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output)
- [Törnberg, Best Practices for Text Annotation with Large Language Models](https://sociologica.unibo.it/article/view/19461)
