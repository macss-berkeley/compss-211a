# Additional: Debugging NLP Models - Troubleshooting Guide

NLP models fail, but they do so in predictable ways. This additional guide helps you diagnose and fix common problems. Use this when your model isn't working as expected!

---

## Table of Contents

1. [General Debugging Workflow](#general-debugging-workflow)
2. [Topic Modeling Problems](#topic-modeling-problems)
3. [Sentiment Analysis Problems](#sentiment-analysis-problems)
4. [Classification Problems](#classification-problems)
5. [Data Quality Issues](#data-quality-issues)
6. [Performance Problems](#performance-problems)
7. [Error Messages and Solutions](#error-messages-and-solutions)

---

## General Debugging Workflow

### Step 1: Isolate the Problem

```python
# Test on a small sample first!
sample = df.head(10)  # Start with 10 examples

# Does it work on the sample?
# YES → Problem is with scale/full dataset
# NO → Problem is with code/data format
```

### Step 2: Check Your Data

```python
def quick_data_check(df, text_column):
    # 1. Basic info
    print(f"\nTotal rows: {len(df)}")
    print(f"Missing values: {df[text_column].isna().sum()}")

    # 2. Text length distribution
    df['_text_length'] = df[text_column].str.len()
    print(f"\nText Length Statistics:")
    print(f"  Mean: {df['_text_length'].mean():.0f} characters")
    print(f"  Median: {df['_text_length'].median():.0f} characters")
    print(f"  Min: {df['_text_length'].min()}, Max: {df['_text_length'].max()}")

    # 3. Sample texts
    print(f"\nSample texts (first 100 chars):")
    for i, text in enumerate(df[text_column].head(3)):
        print(f"  [{i}]: {str(text)[:100]}...")

    # 4. Check for common issues
    issues = []
    if df[text_column].isna().sum() > 0:
        issues.append("Contains NaN values")
    if (df['_text_length'] < 10).sum() > len(df) * 0.1:
        issues.append("Many very short texts (< 10 chars)")
    if (df['_text_length'] > 5000).sum() > 0:
        issues.append("Some very long texts (> 5000 chars)")

    if issues:
        print(f"\nPotential Issues Found:")
        for issue in issues:
            print(f"  {issue}")
    else:
        print(f"\nNo obvious data issues found")

    df.drop('_text_length', axis=1, inplace=True)
    print("="*60)

# Usage
quick_data_check(df, 'your_text_column')
```

### Step 3: Check Your Model

```python
# Are you using the right model for your task?
# - Topic modeling → BERTopic, LDA
# - Sentiment → VADER, BERT sentiment models
# - Classification → Depends on data size

# Check model is loaded correctly
print(type(model))  # Should show the model class
print(model)  # Show model details
```

---

## Topic Modeling Problems

### Problem 1: "Topics are just meaningless word lists"

**Example bad output**:
```
Topic 1: the, and, a, is, to, of, for
Topic 2: it, that, this, was, be, are, have
```

#### Cause A: Stop words not removed

**Solution**:
```python
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

# Add domain-specific stop words
custom_stop_words = list(ENGLISH_STOP_WORDS) + ['reddit', 'post', 'edit', 'update']

# For sklearn (LDA)
from sklearn.feature_extraction.text import CountVectorizer
vectorizer = CountVectorizer(stop_words=custom_stop_words)

# For BERTopic
from bertopic import BERTopic
topic_model = BERTopic(stop_words=custom_stop_words)
```

#### Cause B: Not enough documents

**Solution**:
```python
# Check your data size
print(f"Number of documents: {len(documents)}")

# Minimum requirements:
# - LDA: 1000+ documents
# - BERTopic: 500+ documents

# If too few → Collect more data OR use simpler analysis
```

#### Cause C: Wrong number of topics

**Solution**:
```python
# For LDA: Use coherence score to find optimal number
from gensim.models import CoherenceModel

def find_optimal_topics(texts, min_topics=5, max_topics=20):
    """Find optimal number of topics using coherence"""
    coherence_scores = []

    for num_topics in range(min_topics, max_topics + 1):
        lda_model = LatentDirichletAllocation(n_components=num_topics)
        lda_model.fit(dtm)

        # Calculate coherence (simplified - use gensim for full implementation)
        # coherence = calculate_coherence(lda_model, texts)
        # coherence_scores.append((num_topics, coherence))

    # Plot and choose the "elbow" point
    # plt.plot([x[0] for x in coherence_scores], [x[1] for x in coherence_scores])
    # plt.show()

# For BERTopic: Let it choose automatically
topic_model = BERTopic(nr_topics='auto')
```

### Problem 2: "All topics look the same"

#### Cause: Documents are too similar or too few

**Solution**:
```python
# Check document diversity
def check_diversity(texts, sample_size=100):
    """Calculate average similarity between random pairs"""
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    import numpy as np

    # Sample for speed
    if len(texts) > sample_size:
        texts = np.random.choice(texts, sample_size, replace=False)

    vectorizer = TfidfVectorizer()
    tfidf = vectorizer.fit_transform(texts)

    # Calculate pairwise similarities
    similarities = cosine_similarity(tfidf)

    # Get upper triangle (exclude diagonal)
    upper_tri = similarities[np.triu_indices_from(similarities, k=1)]

    print(f"Average similarity: {upper_tri.mean():.3f}")
    print(f"(0 = completely different, 1 = identical)")

    if upper_tri.mean() > 0.7:
        print("Documents are very similar - topics may not be meaningful")
    elif upper_tri.mean() < 0.3:
        print("Documents are diverse - good for topic modeling")
    else:
        print("Moderate similarity - results may vary")

# Usage
check_diversity(df['text'].tolist())
```

### Problem 3: "BERTopic returns -1 for most documents"

**Cause**: Documents assigned to "outlier" topic

**Solution**:
```python
# Option 1: Reduce outlier threshold
from bertopic import BERTopic

topic_model = BERTopic(min_topic_size=10,  # Smaller = fewer outliers
                       calculate_probabilities=True)

# Option 2: Reassign outliers to nearest topics
topics, probs = topic_model.fit_transform(documents)

# Check how many outliers
outliers = (topics == -1).sum()
print(f"Outliers: {outliers} ({outliers/len(topics)*100:.1f}%)")

# Option 3: Use probability threshold to reassign
if probs is not None:
    # Reassign documents with high probability to any topic
    for i, topic in enumerate(topics):
        if topic == -1 and probs[i].max() > 0.3:  # Threshold
            topics[i] = probs[i].argmax()
```

---

## Sentiment Analysis Problems

### Problem 1: "Sentiment doesn't match ratings/labels"

#### This might be a FINDING, not a problem!

**Example**: Amazon review with negative text but 5-star rating
- Text: "The product broke after one week, terrible quality"
- Rating: 5 stars
- Sentiment: Negative

**This could indicate**:
- Sarcasm
- Mistake by reviewer
- Changed opinion after initially reviewing
- → This is interesting! Report it!

#### Diagnosis: Check correlation

```python
# If you have ground truth ratings
from scipy.stats import spearmanr

# Calculate correlation between sentiment and ratings
correlation, p_value = spearmanr(df['sentiment_score'], df['rating'])

print(f"Correlation: {correlation:.3f} (p={p_value:.4f})")

# Interpretation:
# - correlation > 0.5: Good match 
# - correlation 0.3-0.5: Moderate match 
# - correlation < 0.3: Poor match 

# Find mismatches
df['mismatch'] = (
    ((df['sentiment_score'] > 0) & (df['rating'] < 3)) |  # Positive sentiment, low rating
    ((df['sentiment_score'] < 0) & (df['rating'] > 3))    # Negative sentiment, high rating
)

print(f"\nMismatches: {df['mismatch'].sum()} ({df['mismatch'].mean()*100:.1f}%)")

# Inspect mismatches
print("\nExample mismatches:")
print(df[df['mismatch']][['text', 'sentiment_score', 'rating']].head())
```

#### Solution A: Model is wrong → Try different model

```python
# Try multiple sentiment models
from transformers import pipeline
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# 1. VADER (good for social media)
vader = SentimentIntensityAnalyzer()
df['vader_score'] = df['text'].apply(lambda x: vader.polarity_scores(x)['compound'])

# 2. DistilBERT (general purpose)
classifier = pipeline('sentiment-analysis',
                      model='distilbert-base-uncased-finetuned-sst-2-english')
df['distilbert_sentiment'] = df['text'].apply(lambda x: classifier(x[:512])[0])

# 3. Twitter-RoBERTa (social media)
classifier = pipeline('sentiment-analysis',
                      model='cardiffnlp/twitter-roberta-base-sentiment-latest')
df['roberta_sentiment'] = df['text'].apply(lambda x: classifier(x[:512])[0])

# Compare correlations
for col in ['vader_score', 'distilbert_sentiment', 'roberta_sentiment']:
    if col in df.columns:
        corr, _ = spearmanr(df[col], df['rating'])
        print(f"{col}: correlation = {corr:.3f}")
```

#### Solution B: Domain-specific → Fine-tune your own model

```python
# If you have 500+ labeled examples, fine-tune BERT
# See Week 9 for detailed fine-tuning tutorial

from transformers import AutoModelForSequenceClassification, Trainer, TrainingArguments

# This requires labeled data and more setup
# But gives best results for domain-specific sentiment!
```

### Problem 2: "All sentiments are neutral/similar"

#### Cause: Text is genuinely neutral OR model isn't sensitive enough

**Solution**:
```python
# Check if your text actually HAS sentiment
sample_texts = [
    "I love this product, it's amazing!",  # Clearly positive
    "Terrible, worst purchase ever",  # Clearly negative
    "It arrived on time"  # Neutral
]

vader = SentimentIntensityAnalyzer()
for text in sample_texts:
    score = vader.polarity_scores(text)['compound']
    print(f"{text}: {score:.3f}")

# If clearly positive/negative texts get neutral scores → Model issue
# If your actual texts are like "It arrived on time" → They ARE neutral!
```

### Problem 3: "Sentiment analysis is too slow"

**Solution**:
```python
# Option 1: Use faster model (VADER instead of BERT)
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
analyzer = SentimentIntensityAnalyzer()
# VADER is ~100x faster than BERT!

# Option 2: Batch processing for BERT models
from transformers import pipeline

classifier = pipeline('sentiment-analysis', device=0)  # Use GPU if available

# Process in batches
batch_size = 32
results = []
for i in range(0, len(texts), batch_size):
    batch = texts[i:i+batch_size]
    results.extend(classifier(batch))

# Option 3: Truncate long texts
texts_truncated = [text[:512] for text in texts]  # BERT max length
```

---

## Classification Problems

### Problem 1: "Accuracy is very low (< 60%)"

#### Diagnosis: Check baseline

```python
from sklearn.dummy import DummyClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Baseline 1: Most frequent class
dummy_most_frequent = DummyClassifier(strategy='most_frequent')
dummy_most_frequent.fit(X_train, y_train)
baseline_acc = accuracy_score(y_test, dummy_most_frequent.predict(X_test))

print(f"Baseline (most frequent): {baseline_acc:.3f}")
print(f"Your model: {your_model_accuracy:.3f}")

# Your model should beat baseline by at least 10-15%!
if your_model_accuracy < baseline_acc + 0.10:
    print("Model barely beats baseline, need to aadjust")
```

#### Common Causes:

**Cause A: Data is too imbalanced**
```python
# Check class distribution
print(df['label'].value_counts())
print(df['label'].value_counts(normalize=True))

# If one class > 70% → Severe imbalance
# Solution: Use class weights or resampling (see Sample Size Guide)
```

**Cause B: Features aren't informative**
```python
# Check if any words actually distinguish classes
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_selection import chi2
import numpy as np

vectorizer = TfidfVectorizer(max_features=1000)
X_tfidf = vectorizer.fit_transform(df['text'])
feature_names = vectorizer.get_feature_names_out()

# Chi-square test for each feature
chi2_scores, p_values = chi2(X_tfidf, df['label'])

# Top discriminative features
top_indices = np.argsort(chi2_scores)[-20:]
print("Most discriminative words:")
for idx in top_indices[::-1]:
    print(f"  {feature_names[idx]}: {chi2_scores[idx]:.1f}")

# If scores are all low (< 10) → Features don't distinguish classes well
```

**Cause C: Not enough training data**
```python
# Rule of thumb: need at least 100 examples per class
print(f"Examples per class:")
print(df['label'].value_counts())

# If < 100 per class → Use zero-shot or few-shot instead
```

### Problem 2: "Model works in training but fails on test set (overfitting)"

**Symptoms**:
- Training accuracy: 95%
- Test accuracy: 60%

#### Solution:

```python
# 1. Reduce model complexity
from sklearn.linear_model import LogisticRegression

# Increase regularization (smaller C = more regularization)
model = LogisticRegression(C=0.1)  # Try 0.01, 0.1, 1, 10

# 2. Reduce vocabulary size
vectorizer = TfidfVectorizer(max_features=1000)  # Instead of 10000

# 3. Use cross-validation
from sklearn.model_selection import cross_val_score
scores = cross_val_score(model, X, y, cv=5)
print(f"Cross-validation accuracy: {scores.mean():.3f} (+/- {scores.std():.3f})")

# 4. Get more training data (best solution!)
```

### Problem 3: "Zero-shot classification gives wrong results"

```python
from transformers import pipeline

classifier = pipeline("zero-shot-classification",
                      model="facebook/bart-large-mnli")

text = "I love this product!"
labels = ["positive", "negative", "neutral"]

result = classifier(text, labels)
print(result)

# If results are wrong, try:
```

**Solution A: Rephrase your labels**
```python
# Bad labels (too vague)
labels = ["good", "bad"]

# Better labels (more descriptive)
labels = ["this is a positive review", "this is a negative review"]

# Even better (hypothesis format)
labels = ["The reviewer is satisfied with the product",
          "The reviewer is dissatisfied with the product"]
```

**Solution B: Add context to your text**
```python
# Instead of just the review text
text = review_text

# Add context
text = f"Customer review: {review_text}"
```

**Solution C: Try few-shot with LLM instead**
```python
# If zero-shot doesn't work, provide examples!
# See Week 10 for LLM few-shot learning
```

---

## Data Quality Issues

### Problem: "Model gives unexpected results on some examples"

**Solution**: Error analysis

```python
def error_analysis(df, text_col, true_label_col, pred_label_col, n_examples=10):
    """Analyze misclassified examples"""

    # Find errors
    errors = df[df[true_label_col] != df[pred_label_col]].copy()

    print(f"Total errors: {len(errors)} ({len(errors)/len(df)*100:.1f}%)")

    # Sample errors
    print(f"\nRandom sample of {n_examples} errors:")
    for i, row in errors.sample(min(n_examples, len(errors))).iterrows():
        print(f"\n{'='*60}")
        print(f"Text: {row[text_col][:200]}...")
        print(f"True label: {row[true_label_col]}")
        print(f"Predicted: {row[pred_label_col]}")

    # Error patterns
    print(f"\n{'='*60}")
    print("Error patterns:")
    print(errors.groupby([true_label_col, pred_label_col]).size().sort_values(ascending=False))

# Usage
df['predicted'] = model.predict(X_test)
error_analysis(df_test, 'text', 'true_label', 'predicted')

# Look for patterns in errors:
# - Are certain classes always confused?
# - Are errors on short/long texts?
# - Are there annotation errors in your labels?
```

---

## Performance Problems

### Problem: "My code is too slow"

```python
import time

def time_function(func):
    """Decorator to time function execution"""
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end-start:.2f} seconds")
        return result
    return wrapper

@time_function
def slow_preprocessing(texts):
    return [preprocess(text) for text in texts]

# Find bottlenecks
```

**Solution A: Vectorize operations**
```python
# Slow (loop)
for i, text in enumerate(texts):
    df.loc[i, 'cleaned'] = clean(text)

# Fast (vectorized)
df['cleaned'] = df['text'].apply(clean)

# Even faster (for simple operations)
df['cleaned'] = df['text'].str.lower().str.strip()
```

**Solution B: Sample during development**
```python
# Use small sample while developing
df_dev = df.sample(1000, random_state=42)

# Develop and test on sample
# Once working, run on full dataset
```

**Solution C: Use multiprocessing**
```python
from multiprocessing import Pool

def parallel_apply(func, data, n_jobs=4):
    """Apply function in parallel"""
    with Pool(n_jobs) as pool:
        result = pool.map(func, data)
    return result

# Usage
cleaned_texts = parallel_apply(clean_text, df['text'].tolist())
```

---

## Error Messages and Solutions

### ValueError: empty vocabulary

**Cause**: All words filtered out during preprocessing

```python
# Check your stop words and min_df
vectorizer = TfidfVectorizer(
    stop_words='english',
    min_df=0.01,  # Appears in at least 1% of documents
    max_df=0.9    # Appears in at most 90% of documents
)

# If min_df too high or max_df too low → empty vocabulary
```

### KeyError: word not in vocabulary

**Cause**: Trying to access word not seen during training

```python
# Solution: Check if word exists first
if word in model.wv:
    vector = model.wv[word]
else:
    print(f"Word '{word}' not in vocabulary")

# Or use FastText (handles out-of-vocabulary words)
from gensim.models import FastText
model = FastText(sentences, min_count=1)  # Include rare words
```

### RuntimeError: CUDA out of memory

**Cause**: Model or batch too large for GPU

```python
# Solution 1: Reduce batch size
batch_size = 16  # Try 8, 4, or even 1

# Solution 2: Use CPU instead
model = model.to('cpu')

# Solution 3: Clear cache
import torch
torch.cuda.empty_cache()

# Solution 4: Use smaller model
# Instead of: bert-large
# Use: distilbert-base or bert-base
```

### IndexError: index out of range

**Cause**: Text longer than model's maximum length

```python
# Solution: Truncate text
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')

# Tokenize with truncation
inputs = tokenizer(
    text,
    truncation=True,
    max_length=512,
    padding='max_length',
    return_tensors='pt'
)
```

---

## Quick Debugging Checklist

Before asking for help, check:

- [ ] Did you check your data? (Run `quick_data_check()`)
- [ ] Did you try on a small sample? (10-100 examples)
- [ ] Did you check for missing values?
- [ ] Did you check text length distribution?
- [ ] Did you verify your labels/ratings are correct?
- [ ] Did you check class balance?
- [ ] Did you look at actual examples (not just numbers)?
- [ ] Did you check the error message carefully?
- [ ] Did you search the error message online?
- [ ] Did you read the documentation for the function causing issues?

---

## Getting Help

When asking for help (in office hours, online, etc.), provide:

1. **What you're trying to do**
   - Task type (classification, topic modeling, etc.)
   - Data type (Reddit, reviews, etc.)

2. **What you tried**
   - Code you ran
   - Models/parameters you used

3. **What happened**
   - Error message (full traceback!)
   - Unexpected output (with examples)

4. **What you've already checked**
   - From the checklist above

**Good question**:
> "I'm trying to do sentiment analysis on Reddit posts using VADER. I have 500 posts, but I'm getting mostly neutral scores even for clearly positive/negative posts like 'This is amazing!' Here's my code: [code]. I checked for missing data and text lengths look normal. Any ideas?"

**Bad question**:
> "My sentiment analysis doesn't work help"

---

**Need more help?** Come to office hours with specific examples!
