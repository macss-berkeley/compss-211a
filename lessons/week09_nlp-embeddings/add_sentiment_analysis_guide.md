# Additional: Sentiment Analysis Guide - Choosing and Implementing the Right Approach

This additional guide helps you choose between different sentiment analysis approaches and implement them effectively for your project. We'll cover three main approaches: dictionary-based (VADER), pre-trained transformer models (HuggingFace), and custom embedding-based approaches.

---

## Quick Decision Tree

```
START: What kind of text are you analyzing?

├─ Social media (Twitter, Reddit) with slang/emojis
│  └─ Use VADER (fast, handles internet language well)
│
├─ Formal text (news, reviews, academic)
│  ├─ Need nuanced emotions beyond positive/negative?
│  │  └─ Use HuggingFace emotion model
│  └─ Just positive/negative/neutral?
│     └─ Use HuggingFace sentiment model or VADER
│
├─ Domain-specific language (medical, legal, technical)
│  └─ Use domain-specific HuggingFace model OR
│     └─ Train custom model (advanced)
│
└─ Need to track sentiment over time?
   └─ Use VADER (faster for large datasets) OR
      └─ HuggingFace with batching
```

---

## Approach 1: VADER (Dictionary-Based)

### When to Use VADER
- Social media text (Twitter, Reddit, Facebook)
- Text with emojis, slang, abbreviations
- Large datasets (VADER is very fast)
- Need interpretable results
- Limited computational resources

### When NOT to Use VADER
- Highly contextual or sarcastic text
- Domain-specific language (medical, legal, etc.)
- Need fine-grained emotion detection
- Text in languages other than English

### Implementation

```python
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import pandas as pd

# Initialize VADER
analyzer = SentimentIntensityAnalyzer()

# Example: Analyze a single text
text = "I absolutely love this product! It's amazing! 😍"
scores = analyzer.polarity_scores(text)
print(scores)
# Output: {'neg': 0.0, 'neu': 0.294, 'pos': 0.706, 'compound': 0.8877}

# Apply to dataframe
df['sentiment_scores'] = df['text'].apply(lambda x: analyzer.polarity_scores(str(x)))

# Extract compound score (most commonly used)
df['sentiment_compound'] = df['sentiment_scores'].apply(lambda x: x['compound'])

# Categorize sentiment
def categorize_sentiment(compound_score):
    if compound_score >= 0.05:
        return 'positive'
    elif compound_score <= -0.05:
        return 'negative'
    else:
        return 'neutral'

df['sentiment_category'] = df['sentiment_compound'].apply(categorize_sentiment)

# View distribution
print(df['sentiment_category'].value_counts())
```

### Understanding VADER Scores
- **compound**: Overall sentiment (-1 to +1) - **Use this for most analyses**
- **pos**: Proportion of positive words (0 to 1)
- **neu**: Proportion of neutral words (0 to 1)
- **neg**: Proportion of negative words (0 to 1)

### VADER Best Practices
1. **Threshold adjustment**: Default thresholds are ≥0.05 (positive) and ≤-0.05 (negative). Adjust based on your data.
2. **Handle missing data**: Always convert to string with `str(x)`
3. **Preprocessing considerations**: VADER is designed for raw text - don't remove punctuation/emojis!

---

## Approach 2: HuggingFace Transformer Models

### When to Use HuggingFace Models
- Need high accuracy on complex text
- Handling sarcasm, irony, or subtle sentiment
- Domain-specific analysis (with appropriate model)
- Multi-class emotion detection (joy, anger, sadness, etc.)
- Moderate-sized datasets (thousands of documents)

### When NOT to Use HuggingFace
- Very large datasets (millions of documents) - slow without GPU
- Real-time analysis requirements (unless you have GPU)
- Extremely limited computational resources

### Popular Pre-trained Models

| Model | Best For | Speed | Accuracy |
|-------|----------|-------|----------|
| `distilbert-base-uncased-finetuned-sst-2-english` | General sentiment (pos/neg) | Fast | High |
| `cardiffnlp/twitter-roberta-base-sentiment` | Twitter/social media | Medium | High |
| `j-hartmann/emotion-english-distilroberta-base` | Emotion detection (7 emotions) | Medium | High |
| `ProsusAI/finbert` | Financial text | Medium | High (finance) |
| `nlptown/bert-base-multilingual-uncased-sentiment` | Product reviews (1-5 stars) | Slow | Very High |

### Implementation: Basic Sentiment

```python
from transformers import pipeline
import pandas as pd
from tqdm import tqdm

# Initialize sentiment pipeline
# Default model is distilbert-base-uncased-finetuned-sst-2-english
sentiment_pipeline = pipeline("sentiment-analysis")

# Analyze single text
text = "This movie was surprisingly disappointing despite the hype."
result = sentiment_pipeline(text)
print(result)
# Output: [{'label': 'NEGATIVE', 'score': 0.9998}]

# Apply to dataframe (with progress bar)
def analyze_sentiment_batch(texts, batch_size=16):
    """Batch processing for efficiency"""
    results = []
    for i in tqdm(range(0, len(texts), batch_size)):
        batch = texts[i:i+batch_size]
        # Handle errors gracefully
        try:
            batch_results = sentiment_pipeline(batch, truncation=True, max_length=512)
            results.extend(batch_results)
        except Exception as e:
            print(f"Error in batch {i}: {e}")
            # Add None for failed items
            results.extend([{'label': 'ERROR', 'score': 0.0}] * len(batch))
    return results

# Apply to dataframe
texts = df['text'].fillna("").tolist()
sentiment_results = analyze_sentiment_batch(texts, batch_size=16)

# Extract results
df['sentiment_label'] = [r['label'] for r in sentiment_results]
df['sentiment_score'] = [r['score'] for r in sentiment_results]

print(df['sentiment_label'].value_counts())
```

### Implementation: Emotion Detection

```python
# Use emotion detection model
emotion_pipeline = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=None  # Return all emotion scores
)

text = "I can't believe they cancelled my flight again! This is so frustrating!"
emotions = emotion_pipeline(text)
print(emotions)
# Output: List of all 7 emotions with scores

# Apply to dataframe
def get_dominant_emotion(text):
    """Get the emotion with highest score"""
    if not text or pd.isna(text):
        return {'emotion': 'unknown', 'score': 0.0}
    try:
        results = emotion_pipeline(str(text)[:512], top_k=1)  # Truncate long texts
        return {'emotion': results[0][0]['label'], 'score': results[0][0]['score']}
    except:
        return {'emotion': 'error', 'score': 0.0}

# Apply with progress tracking
tqdm.pandas()
df['emotion_result'] = df['text'].progress_apply(get_dominant_emotion)
df['emotion'] = df['emotion_result'].apply(lambda x: x['emotion'])
df['emotion_score'] = df['emotion_result'].apply(lambda x: x['score'])

# Available emotions: anger, disgust, fear, joy, neutral, sadness, surprise
print(df['emotion'].value_counts())
```

### Implementation: Social Media Specific

```python
# Twitter-specific model (better for social media)
twitter_sentiment = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment"
)

# This model outputs: LABEL_0 (negative), LABEL_1 (neutral), LABEL_2 (positive)
def analyze_tweet_sentiment(text):
    if not text or pd.isna(text):
        return {'label': 'neutral', 'score': 0.0}
    try:
        result = twitter_sentiment(str(text)[:512])[0]
        # Convert labels to readable format
        label_map = {'LABEL_0': 'negative', 'LABEL_1': 'neutral', 'LABEL_2': 'positive'}
        return {'label': label_map[result['label']], 'score': result['score']}
    except:
        return {'label': 'error', 'score': 0.0}

df['twitter_sentiment'] = df['text'].apply(analyze_tweet_sentiment)
df['twitter_label'] = df['twitter_sentiment'].apply(lambda x: x['label'])
df['twitter_score'] = df['twitter_sentiment'].apply(lambda x: x['score'])
```

### HuggingFace Best Practices

1. **Truncation**: Always set `truncation=True, max_length=512` for long texts
2. **Batch processing**: Use batch_size=8-32 for faster processing
3. **Error handling**: Wrap in try-except to handle edge cases
4. **GPU acceleration**: Use `device=0` if you have GPU access
5. **Memory management**: Process in chunks if dealing with large datasets

```python
# GPU acceleration example
sentiment_pipeline = pipeline("sentiment-analysis", device=0)  # Use GPU

# Process very large datasets in chunks
def process_large_dataset(df, text_column, chunk_size=1000):
    all_results = []
    for i in range(0, len(df), chunk_size):
        chunk = df[text_column].iloc[i:i+chunk_size].tolist()
        results = analyze_sentiment_batch(chunk)
        all_results.extend(results)
        print(f"Processed {i+chunk_size}/{len(df)}")
    return all_results
```

---

## Approach 3: Custom Embedding-Based Sentiment

### When to Use Custom Approaches
- Highly domain-specific language
- Need to understand sentiment dimensions unique to your data
- Have labeled training data available
- Research-focused project

### Implementation Sketch

```python
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import numpy as np

# Assume you have embeddings from your FastText/Word2Vec model
# and labeled sentiment data

# Get document embeddings (average word vectors)
def get_doc_embedding(text, model):
    words = text.split()
    word_vecs = [model.wv[word] for word in words if word in model.wv]
    if not word_vecs:
        return np.zeros(model.vector_size)
    return np.mean(word_vecs, axis=0)

X = np.array([get_doc_embedding(text, your_model) for text in df['text']])
y = df['sentiment_label']  # Your labels

# Train classifier
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
clf = LogisticRegression(max_iter=1000)
clf.fit(X_train, y_train)

# Evaluate
print(f"Accuracy: {clf.score(X_test, y_test):.3f}")

# Predict on new data
df['predicted_sentiment'] = clf.predict(X)
```

---

## Comparing Approaches on Your Data

### Evaluation Code

```python
import matplotlib.pyplot as plt
import seaborn as sns

# If you have ground truth labels, compare accuracy
# Otherwise, compare agreement between methods

# Compare VADER vs HuggingFace
comparison = pd.DataFrame({
    'vader': df['sentiment_category'],  # from VADER
    'huggingface': df['sentiment_label'].str.lower()  # from HF
})

# Calculate agreement
agreement = (comparison['vader'] == comparison['huggingface']).mean()
print(f"Agreement between VADER and HuggingFace: {agreement:.2%}")

# Where do they disagree?
disagreements = df[comparison['vader'] != comparison['huggingface']]
print(f"\nNumber of disagreements: {len(disagreements)}")

# Sample disagreements for manual inspection
print("\nSample disagreements:")
for idx, row in disagreements.head(5).iterrows():
    print(f"\nText: {row['text'][:100]}...")
    print(f"VADER: {row['sentiment_category']} ({row['sentiment_compound']:.2f})")
    print(f"HuggingFace: {row['sentiment_label']} ({row['sentiment_score']:.2f})")
```

### Visualization

```python
# Plot sentiment distribution comparison
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# VADER distribution
df['sentiment_category'].value_counts().plot(kind='bar', ax=axes[0], color='skyblue')
axes[0].set_title('VADER Sentiment Distribution')
axes[0].set_ylabel('Count')

# HuggingFace distribution
df['sentiment_label'].value_counts().plot(kind='bar', ax=axes[1], color='coral')
axes[1].set_title('HuggingFace Sentiment Distribution')
axes[1].set_ylabel('Count')

plt.tight_layout()
plt.show()

# Confusion matrix style comparison
confusion = pd.crosstab(
    df['sentiment_category'],
    df['sentiment_label'],
    margins=True
)
print("\nConfusion Matrix (VADER vs HuggingFace):")
print(confusion)
```

---

## Temporal Sentiment Analysis

### Track Sentiment Over Time

```python
# Ensure you have datetime column
df['date'] = pd.to_datetime(df['created_utc'], unit='s')  # if timestamp
df['year_month'] = df['date'].dt.to_period('M')

# Calculate average sentiment over time
temporal_sentiment = df.groupby('year_month').agg({
    'sentiment_compound': 'mean',  # VADER
    'sentiment_score': 'mean'      # HuggingFace
}).reset_index()

# Plot
fig, ax = plt.subplots(figsize=(12, 5))
temporal_sentiment['year_month'] = temporal_sentiment['year_month'].astype(str)
ax.plot(temporal_sentiment['year_month'], temporal_sentiment['sentiment_compound'],
        marker='o', label='VADER')
ax.plot(temporal_sentiment['year_month'], temporal_sentiment['sentiment_score'],
        marker='s', label='HuggingFace')
ax.set_xlabel('Time')
ax.set_ylabel('Average Sentiment')
ax.set_title('Sentiment Over Time')
ax.legend()
ax.grid(True, alpha=0.3)
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

---

## Common Pitfalls and Solutions

### Pitfall 1: Processing Speed
**Problem**: HuggingFace is too slow for my dataset
**Solutions**:
- Use batch processing (`batch_size=16-32`)
- Use a smaller/faster model (distilbert instead of bert)
- Use GPU if available (`device=0`)
- Sample your data for initial exploration
- Consider VADER for very large datasets

### Pitfall 2: Memory Errors
**Problem**: Running out of memory with HuggingFace
**Solutions**:
```python
# Process in smaller chunks
chunk_size = 500
for i in range(0, len(df), chunk_size):
    chunk = df.iloc[i:i+chunk_size]
    # Process chunk and save results
    results = analyze_sentiment_batch(chunk['text'].tolist())
    # Save to disk incrementally
    chunk['sentiment'] = results
    chunk.to_csv(f'results_chunk_{i}.csv', index=False)
```

### Pitfall 3: Inconsistent Results
**Problem**: Getting different results each time
**Solutions**:
- HuggingFace models are deterministic (should be consistent)
- If using custom models, set random seeds
- Check for data preprocessing inconsistencies

### Pitfall 4: Poor Performance on Domain Text
**Problem**: Sentiment analysis doesn't work well on my specific domain
**Solutions**:
- Try domain-specific models (financial: finbert, medical: bio-bert, etc.)
- Consider fine-tuning a model (advanced)
- Create custom lexicon for VADER
- Manually label sample and evaluate which method works best

---

## Quick Reference: Method Comparison

| Feature | VADER | HuggingFace | Custom Embedding |
|---------|-------|-------------|------------------|
| **Speed** | Very Fast (1000s/sec) | Medium (10-100s/sec) | Fast (after training) |
| **Accuracy** | Good for social media | Very High | Depends on data |
| **Setup Complexity** | Very Easy | Easy | Hard |
| **Computational Resources** | Minimal | Medium-High | Medium |
| **Domain Adaptation** | Manual lexicon update | Model selection | Full control |
| **Interpretability** | High (word scores) | Low (black box) | Medium |
| **Handles Emojis/Slang** | Yes | Depends on model | No |
| **Multilingual** | English only | Yes (with right model) | Depends |
| **Best Use Case** | Social media, quick analysis | Complex text, high accuracy | Research, unique domains |

---

## Recommendation for Your Project

**For most CSS projects, we recommend:**

1. **Start with VADER** - Get baseline quickly
2. **Try HuggingFace** - Compare with a pre-trained model appropriate for your domain
3. **Evaluate agreement** - Look at where they disagree
4. **Choose based on**:
   - Dataset size (VADER for large, HF for smaller)
   - Text type (VADER for social media, HF for formal)
   - Computational resources (VADER if limited)
   - Required accuracy (HF if critical)

**Example workflow:**
```python
# 1. Quick baseline with VADER
df['vader_sentiment'] = df['text'].apply(lambda x: analyzer.polarity_scores(str(x))['compound'])

# 2. Sample for HuggingFace comparison
sample_df = df.sample(n=min(1000, len(df)))
sample_df['hf_sentiment'] = analyze_sentiment_batch(sample_df['text'].tolist())

# 3. Check agreement
agreement = (sample_df['vader_sentiment'] > 0) == (sample_df['hf_sentiment'] == 'POSITIVE')
print(f"Agreement: {agreement.mean():.2%}")

# 4. Inspect disagreements and choose method
# 5. Apply chosen method to full dataset
```

---

## Getting Help

If you're stuck:
1. Check which method is appropriate for your text type (decision tree above)
2. Start with the simplest method (usually VADER)
3. Sample your data (100-1000 examples) before processing everything
4. Compare methods on sample before committing
5. Ask in office hours with specific error messages

Remember: **No single method is always best** - the right choice depends on your specific data, research question, and computational resources!
