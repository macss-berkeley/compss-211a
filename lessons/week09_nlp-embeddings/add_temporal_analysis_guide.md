# Additional: Temporal Analysis Guide - Tracking Text Data Over Time

Many computational social science projects involve tracking how discourse changes over time. This additional guide shows you how to analyze temporal patterns in your text data using the NLP methods from Week 8 and 9.

---

## Quick Reference: What Can You Track Over Time?

| What You Want to Know | Method | Difficulty | When to Use |
|----------------------|--------|------------|-------------|
| "How do topics change over time?" | BERTopic temporal | Easy | Most common use case |
| "How does sentiment change over time?" | Sentiment + groupby | Very Easy | Track emotional tone |
| "How do keywords shift over time?" | TF-IDF per time period | Very Easy | Track specific terms |
| "How do word meanings evolve?" | Multiple embeddings | Hard | Advanced research |
| "How do narratives shift?" | BERTopic + analysis | Medium | Track framing changes |

---

## Prerequisites: Data Requirements

### You Need Temporal Information

Your data MUST have timestamp/date information. Common formats:

```python
import pandas as pd

# Example 1: Unix timestamp (Reddit, Twitter)
df['created_utc'] = 1617905292
df['date'] = pd.to_datetime(df['created_utc'], unit='s')

# Example 2: Date string
df['date_string'] = '2023-04-08'
df['date'] = pd.to_datetime(df['date_string'])

# Example 3: Already datetime
df['date'] = pd.to_datetime(df['date'])

# Verify
print(df['date'].dtype)  # Should be datetime64[ns]
print(df['date'].min(), "to", df['date'].max())
```

### Create Time Periods

Decide on appropriate time granularity:

```python
# Add time period columns
df['year'] = df['date'].dt.year
df['month'] = df['date'].dt.month
df['year_month'] = df['date'].dt.to_period('M')  # e.g., "2023-04"
df['quarter'] = df['date'].dt.to_period('Q')     # e.g., "2023Q2"
df['week'] = df['date'].dt.to_period('W')        # Weekly

# For custom periods (e.g., pandemic phases)
df['period'] = pd.cut(
    df['date'],
    bins=pd.date_range('2020-01-01', '2024-01-01', freq='6M'),
    labels=['Pre-COVID', 'Early COVID', 'Vaccine Era', 'Post-COVID']
)
```

**Choosing time granularity**:
- Daily: If you have > 100 documents per day
- Weekly: Good default for social media (months to years of data)
- Monthly: Standard for most projects (years of data)
- Quarterly: Long-term trends (5+ years of data)
- Custom periods: Events-based (before/during/after election, pandemic phases)

---

## Method 1: Topics Over Time with BERTopic

### Basic Implementation

**This is the recommended approach for most temporal analyses!**

```python
from bertopic import BERTopic
import pandas as pd

# Ensure dates are datetime
df['date'] = pd.to_datetime(df['date'])

# Fit BERTopic
topic_model = BERTopic(verbose=True)
topics, probs = topic_model.fit_transform(df['text'].tolist())

# Add topics to dataframe
df['topic'] = topics

# Analyze topics over time
topics_over_time = topic_model.topics_over_time(
    docs=df['text'].tolist(),
    timestamps=df['date'].tolist(),
    nr_bins=20  # Number of time periods to create
)

# Visualize
fig = topic_model.visualize_topics_over_time(topics_over_time, top_n_topics=10)
fig.show()

# Save the figure
fig.write_html("topics_over_time.html")
```

### Custom Time Periods

Instead of automatic binning, use your own periods:

```python
# Create monthly periods
df['year_month'] = df['date'].dt.to_period('M').astype(str)

# Topics over time with custom periods
topics_over_time = topic_model.topics_over_time(
    docs=df['text'].tolist(),
    timestamps=df['year_month'].tolist(),
    datetime_format="%Y-%m"  # Specify format
)

fig = topic_model.visualize_topics_over_time(topics_over_time)
fig.show()
```

### Analyzing Specific Topics Over Time

Focus on specific topics of interest:

```python
# Get topic information
topic_info = topic_model.get_topic_info()
print(topic_info[['Topic', 'Count', 'Name']].head(10))

# Let's say topic 5 is about "vaccine hesitancy"
topic_of_interest = 5

# Filter topics_over_time for this topic
topic_5_over_time = topics_over_time[topics_over_time['Topic'] == topic_of_interest]

# Plot manually
import matplotlib.pyplot as plt
import seaborn as sns

plt.figure(figsize=(14, 6))
plt.plot(topic_5_over_time['Timestamp'], topic_5_over_time['Frequency'], marker='o')
plt.xlabel('Time')
plt.ylabel('Frequency')
plt.title(f'Topic {topic_of_interest} Over Time: {topic_model.get_topic(topic_of_interest)[:5]}')
plt.xticks(rotation=45)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
```

### Comparing Multiple Topics

```python
# Select topics to compare (e.g., topics 2, 5, 8)
topics_to_compare = [2, 5, 8]

plt.figure(figsize=(14, 6))
for topic_num in topics_to_compare:
    topic_data = topics_over_time[topics_over_time['Topic'] == topic_num]
    label = topic_model.get_topic(topic_num)[0][0]  # Top word as label
    plt.plot(topic_data['Timestamp'], topic_data['Frequency'],
             marker='o', label=f'Topic {topic_num}: {label}')

plt.xlabel('Time')
plt.ylabel('Frequency')
plt.title('Topic Evolution Over Time')
plt.legend()
plt.xticks(rotation=45)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
```

### Topic Distribution Heatmap

```python
# Create pivot table: time periods × topics
topic_distribution = df.groupby(['year_month', 'topic']).size().unstack(fill_value=0)

# Normalize by time period (show proportions)
topic_distribution_norm = topic_distribution.div(topic_distribution.sum(axis=1), axis=0)

# Plot heatmap
plt.figure(figsize=(14, 8))
sns.heatmap(topic_distribution_norm.T, cmap='YlOrRd', cbar_kws={'label': 'Proportion'})
plt.xlabel('Time Period')
plt.ylabel('Topic')
plt.title('Topic Distribution Over Time (Normalized)')
plt.tight_layout()
plt.show()
```

---

## Method 2: Sentiment Over Time

### VADER Sentiment Over Time

```python
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import pandas as pd
import matplotlib.pyplot as plt

# Calculate sentiment
analyzer = SentimentIntensityAnalyzer()
df['sentiment_compound'] = df['text'].apply(
    lambda x: analyzer.polarity_scores(str(x))['compound']
)

# Group by time period
sentiment_over_time = df.groupby('year_month').agg({
    'sentiment_compound': ['mean', 'std', 'count']
}).reset_index()

sentiment_over_time.columns = ['year_month', 'mean_sentiment', 'std_sentiment', 'count']

# Plot
fig, ax = plt.subplots(figsize=(14, 6))
ax.plot(sentiment_over_time['year_month'].astype(str),
        sentiment_over_time['mean_sentiment'],
        marker='o', linewidth=2, color='steelblue')

# Add confidence interval
ax.fill_between(
    range(len(sentiment_over_time)),
    sentiment_over_time['mean_sentiment'] - sentiment_over_time['std_sentiment'],
    sentiment_over_time['mean_sentiment'] + sentiment_over_time['std_sentiment'],
    alpha=0.3, color='steelblue'
)

ax.axhline(y=0, color='gray', linestyle='--', alpha=0.5)
ax.set_xlabel('Time Period')
ax.set_ylabel('Average Sentiment (VADER Compound)')
ax.set_title('Sentiment Over Time')
ax.grid(True, alpha=0.3)
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

### Sentiment by Category Over Time

```python
# If you have categories (e.g., different subreddits, topics)
sentiment_by_category = df.groupby(['year_month', 'subreddit'])['sentiment_compound'].mean().unstack()

# Plot
sentiment_by_category.plot(figsize=(14, 6), marker='o')
plt.xlabel('Time Period')
plt.ylabel('Average Sentiment')
plt.title('Sentiment Over Time by Subreddit')
plt.axhline(y=0, color='gray', linestyle='--', alpha=0.5)
plt.legend(title='Subreddit')
plt.xticks(rotation=45)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
```

### HuggingFace Sentiment Over Time

```python
from transformers import pipeline

# Initialize sentiment pipeline
sentiment_pipeline = pipeline("sentiment-analysis")

# Analyze sentiment (batch processing for efficiency)
def get_sentiment_batch(texts, batch_size=16):
    results = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i+batch_size]
        try:
            batch_results = sentiment_pipeline(batch, truncation=True, max_length=512)
            results.extend(batch_results)
        except:
            results.extend([{'label': 'ERROR', 'score': 0}] * len(batch))
    return results

# Apply to sample (HuggingFace is slower)
sample = df.sample(n=min(5000, len(df)))  # Sample for speed
results = get_sentiment_batch(sample['text'].tolist())

sample['hf_sentiment'] = [r['label'] for r in results]

# Calculate proportions over time
sentiment_proportions = pd.crosstab(
    sample['year_month'],
    sample['hf_sentiment'],
    normalize='index'
)

# Plot
sentiment_proportions.plot(kind='area', stacked=True, figsize=(14, 6))
plt.xlabel('Time Period')
plt.ylabel('Proportion')
plt.title('Sentiment Distribution Over Time')
plt.legend(title='Sentiment')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

---

## Method 3: Keywords Over Time with TF-IDF

### Track Distinctive Keywords Per Period

```python
from sklearn.feature_extraction.text import TfidfVectorizer

# Create time period groups
time_periods = df.groupby('year_month')['text'].apply(lambda x: ' '.join(x)).to_dict()

# Calculate TF-IDF per period
vectorizer = TfidfVectorizer(max_features=50, stop_words='english')

keyword_evolution = {}
for period, text in time_periods.items():
    tfidf_matrix = vectorizer.fit_transform([text])
    feature_names = vectorizer.get_feature_names_out()
    scores = tfidf_matrix.toarray()[0]

    # Get top 10 keywords
    top_indices = scores.argsort()[-10:][::-1]
    top_keywords = [(feature_names[i], scores[i]) for i in top_indices]
    keyword_evolution[period] = top_keywords

# Display
for period, keywords in list(keyword_evolution.items())[:3]:
    print(f"\n{period}:")
    for word, score in keywords[:5]:
        print(f"  {word}: {score:.3f}")
```

### Track Specific Keywords Over Time

```python
# Track specific keywords of interest
keywords_of_interest = ['vaccine', 'covid', 'mask', 'lockdown']

# Count occurrences per time period
keyword_counts = {}
for keyword in keywords_of_interest:
    df[f'{keyword}_mention'] = df['text'].str.lower().str.contains(keyword, regex=False)
    keyword_counts[keyword] = df.groupby('year_month')[f'{keyword}_mention'].sum()

# Create dataframe
keyword_df = pd.DataFrame(keyword_counts)

# Plot
keyword_df.plot(figsize=(14, 6), marker='o')
plt.xlabel('Time Period')
plt.ylabel('Number of Mentions')
plt.title('Keyword Mentions Over Time')
plt.legend(title='Keyword')
plt.xticks(rotation=45)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()

# Normalized version (proportion of documents mentioning)
keyword_proportions = {}
for keyword in keywords_of_interest:
    keyword_proportions[keyword] = df.groupby('year_month')[f'{keyword}_mention'].mean()

keyword_prop_df = pd.DataFrame(keyword_proportions)
keyword_prop_df.plot(figsize=(14, 6), marker='o')
plt.ylabel('Proportion of Documents')
plt.title('Keyword Prevalence Over Time')
plt.show()
```

---

## Method 4: Advanced - Word Embeddings Over Time

### Training Period-Specific Embeddings

**Warning**: This is computationally intensive and requires substantial data per period!

```python
from gensim.models import Word2Vec
import numpy as np

# Define time periods (need enough data per period - at least 1M words)
periods = ['2020', '2021', '2022', '2023']

# Train separate embeddings per period
models = {}
for period in periods:
    period_df = df[df['year'] == int(period)]

    # Need enough data!
    if len(period_df) < 1000:
        print(f"Warning: Not enough data for {period}")
        continue

    corpus = [text.lower().split() for text in period_df['text']]

    model = Word2Vec(
        sentences=corpus,
        vector_size=100,
        window=5,
        min_count=10,
        sg=1,
        epochs=10,
        seed=42
    )
    models[period] = model
    print(f"Trained model for {period}: {len(model.wv)} words")
```

### Tracking Word Similarity Over Time

```python
# Track how a word's neighbors change over time
target_word = 'vaccine'

for period, model in models.items():
    if target_word in model.wv:
        print(f"\n{period} - Most similar to '{target_word}':")
        for word, score in model.wv.most_similar(target_word, topn=5):
            print(f"  {word}: {score:.3f}")
```

### Tracking Semantic Drift

```python
# Track how the meaning of a word changes (cosine similarity to anchor words)
target_word = 'vaccine'
anchor_words_positive = ['health', 'safety', 'protection']
anchor_words_negative = ['risk', 'danger', 'harm']

drift_results = []
for period, model in models.items():
    if target_word not in model.wv:
        continue

    # Calculate similarity to positive anchors
    pos_sim = np.mean([
        model.wv.similarity(target_word, anchor)
        for anchor in anchor_words_positive
        if anchor in model.wv
    ])

    # Calculate similarity to negative anchors
    neg_sim = np.mean([
        model.wv.similarity(target_word, anchor)
        for anchor in anchor_words_negative
        if anchor in model.wv
    ])

    drift_results.append({
        'period': period,
        'positive_association': pos_sim,
        'negative_association': neg_sim,
        'net_sentiment': pos_sim - neg_sim
    })

drift_df = pd.DataFrame(drift_results)

# Plot
fig, ax = plt.subplots(figsize=(12, 6))
ax.plot(drift_df['period'], drift_df['positive_association'],
        marker='o', label='Positive Association', color='green')
ax.plot(drift_df['period'], drift_df['negative_association'],
        marker='s', label='Negative Association', color='red')
ax.set_xlabel('Period')
ax.set_ylabel('Cosine Similarity')
ax.set_title(f'Semantic Drift of "{target_word}" Over Time')
ax.legend()
ax.grid(True, alpha=0.3)
plt.show()
```

---

## Method 5: Event-Based Analysis

### Comparing Before/After Major Events

```python
# Define event date
event_date = pd.to_datetime('2020-03-15')  # e.g., COVID lockdown

# Split data
df['period'] = df['date'].apply(lambda x: 'Before' if x < event_date else 'After')

# Compare topics
before_topics = df[df['period'] == 'Before']['topic'].value_counts()
after_topics = df[df['period'] == 'After']['topic'].value_counts()

# Create comparison dataframe
comparison = pd.DataFrame({
    'Before': before_topics,
    'After': after_topics
}).fillna(0)

comparison['Change'] = comparison['After'] - comparison['Before']
comparison = comparison.sort_values('Change', ascending=False)

print("Topics that increased most:")
print(comparison.head(10))

print("\nTopics that decreased most:")
print(comparison.tail(10))

# Visualize
comparison[['Before', 'After']].head(10).plot(kind='bar', figsize=(12, 6))
plt.xlabel('Topic')
plt.ylabel('Frequency')
plt.title('Topic Distribution: Before vs After Event')
plt.legend()
plt.tight_layout()
plt.show()
```

### Multiple Event Periods

```python
# Define multiple periods based on events
def assign_period(date):
    if date < pd.to_datetime('2020-03-01'):
        return 'Pre-Pandemic'
    elif date < pd.to_datetime('2020-12-01'):
        return 'Pandemic Wave 1'
    elif date < pd.to_datetime('2021-06-01'):
        return 'Vaccine Rollout'
    else:
        return 'Post-Vaccine'

df['event_period'] = df['date'].apply(assign_period)

# Compare topics across periods
topic_by_period = pd.crosstab(df['topic'], df['event_period'], normalize='columns')

# Heatmap
plt.figure(figsize=(10, 12))
sns.heatmap(topic_by_period, cmap='YlOrRd', annot=False, cbar_kws={'label': 'Proportion'})
plt.xlabel('Event Period')
plt.ylabel('Topic')
plt.title('Topic Distribution Across Event Periods')
plt.tight_layout()
plt.show()
```

---

## Visualization Best Practices

### 1. Smoothing Noisy Temporal Data

```python
# If your data is noisy, apply rolling average
sentiment_over_time['smoothed'] = sentiment_over_time['mean_sentiment'].rolling(window=3, center=True).mean()

plt.figure(figsize=(14, 6))
plt.plot(sentiment_over_time['year_month'].astype(str),
         sentiment_over_time['mean_sentiment'],
         alpha=0.3, label='Raw')
plt.plot(sentiment_over_time['year_month'].astype(str),
         sentiment_over_time['smoothed'],
         linewidth=2, label='Smoothed (3-period MA)')
plt.xlabel('Time')
plt.ylabel('Sentiment')
plt.title('Sentiment Over Time (Raw vs Smoothed)')
plt.legend()
plt.xticks(rotation=45)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
```

### 2. Annotating Events

```python
fig, ax = plt.subplots(figsize=(14, 6))

# Plot your data
ax.plot(sentiment_over_time['year_month'].astype(str),
        sentiment_over_time['mean_sentiment'],
        marker='o', linewidth=2)

# Add event annotations
events = {
    '2020-03': 'Lockdown',
    '2020-12': 'Vaccine Approved',
    '2021-06': 'Reopening'
}

for period, event_name in events.items():
    if period in sentiment_over_time['year_month'].astype(str).values:
        idx = sentiment_over_time[sentiment_over_time['year_month'].astype(str) == period].index[0]
        ax.axvline(x=idx, color='red', linestyle='--', alpha=0.5)
        ax.text(idx, ax.get_ylim()[1] * 0.9, event_name,
                rotation=90, verticalalignment='top')

ax.set_xlabel('Time Period')
ax.set_ylabel('Average Sentiment')
ax.set_title('Sentiment Over Time with Key Events')
plt.xticks(rotation=45)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
```

### 3. Interactive Plots with Plotly

```python
import plotly.graph_objects as go

# Create interactive plot
fig = go.Figure()

fig.add_trace(go.Scatter(
    x=sentiment_over_time['year_month'].astype(str),
    y=sentiment_over_time['mean_sentiment'],
    mode='lines+markers',
    name='Sentiment',
    hovertemplate='<b>%{x}</b><br>Sentiment: %{y:.3f}<extra></extra>'
))

fig.update_layout(
    title='Interactive Sentiment Over Time',
    xaxis_title='Time Period',
    yaxis_title='Average Sentiment',
    hovermode='x unified',
    height=500
)

fig.show()

# Save
fig.write_html("sentiment_over_time_interactive.html")
```

---

## Common Patterns & Interpretations

### Pattern 1: Sudden Spike/Drop

```
        ●
       /
      /
-----●--------●----
```

**Interpretation**: External event likely occurred
**Action**:
- Identify the time period
- Research what events happened then
- Examine specific documents from that period

```python
# Find spike
spike_period = sentiment_over_time.loc[sentiment_over_time['mean_sentiment'].idxmax(), 'year_month']
print(f"Spike occurred in: {spike_period}")

# Examine documents from that period
spike_docs = df[df['year_month'] == spike_period]
print(f"\nSample documents from {spike_period}:")
print(spike_docs['text'].head())
```

### Pattern 2: Gradual Trend

```
           ●
          /
         ●
        /
       ●
------
```

**Interpretation**: Slow cultural/discourse shift
**Action**:
- Compare start and end periods
- Identify which topics/words are driving the change

### Pattern 3: Cyclical Pattern

```
     ●   ●   ●
    / \ / \ /
   ●   ●   ●
```

**Interpretation**: Seasonal effects or recurring events
**Action**:
- Check if pattern aligns with calendar (holidays, elections, etc.)
- Aggregate by month/quarter across years to confirm

```python
# Check for seasonality
df['month_num'] = df['date'].dt.month
seasonal_pattern = df.groupby('month_num')['sentiment_compound'].mean()

seasonal_pattern.plot(kind='bar', figsize=(10, 5))
plt.xlabel('Month')
plt.ylabel('Average Sentiment')
plt.title('Seasonal Sentiment Pattern')
plt.show()
```

---

## Common Pitfalls & Solutions

### Pitfall 1: Uneven Data Distribution

**Problem**: 10 posts in Jan 2020, 10,000 in Jan 2021

**Solution**: Normalize or use proportions instead of raw counts

```python
# Check data distribution
posts_per_period = df.groupby('year_month').size()
print(posts_per_period)

# If uneven, use proportions
topic_props = df.groupby(['year_month', 'topic']).size().unstack(fill_value=0)
topic_props_norm = topic_props.div(topic_props.sum(axis=1), axis=0)

# Or filter to periods with sufficient data
min_docs = 100
valid_periods = posts_per_period[posts_per_period >= min_docs].index
df_filtered = df[df['year_month'].isin(valid_periods)]
```

### Pitfall 2: Too Fine-Grained Time Periods

**Problem**: Daily granularity with sparse data leads to noise

**Solution**: Aggregate to appropriate level

```python
# Instead of daily
df['week'] = df['date'].dt.to_period('W')  # Weekly
df['month'] = df['date'].dt.to_period('M')  # Monthly

# Choose based on data density
docs_per_day = df.groupby(df['date'].dt.date).size()
print(f"Average docs per day: {docs_per_day.mean():.1f}")

if docs_per_day.mean() < 50:
    print("Use weekly or monthly granularity")
```

### Pitfall 3: Ignoring Statistical Significance

**Problem**: Small fluctuations might just be noise

**Solution**: Add confidence intervals or significance tests

```python
# Add confidence intervals (95% = ±1.96 * standard error)
sentiment_over_time['se'] = sentiment_over_time['std_sentiment'] / np.sqrt(sentiment_over_time['count'])
sentiment_over_time['ci_lower'] = sentiment_over_time['mean_sentiment'] - 1.96 * sentiment_over_time['se']
sentiment_over_time['ci_upper'] = sentiment_over_time['mean_sentiment'] + 1.96 * sentiment_over_time['se']

# Plot with CI
plt.figure(figsize=(14, 6))
plt.plot(sentiment_over_time['year_month'].astype(str),
         sentiment_over_time['mean_sentiment'],
         marker='o', label='Mean')
plt.fill_between(
    range(len(sentiment_over_time)),
    sentiment_over_time['ci_lower'],
    sentiment_over_time['ci_upper'],
    alpha=0.3, label='95% CI'
)
plt.legend()
plt.title('Sentiment Over Time with Confidence Intervals')
plt.show()
```

---

## Complete Example Workflow

### Research Question: "How did vaccine discussion topics evolve during the pandemic?"

```python
import pandas as pd
from bertopic import BERTopic
import matplotlib.pyplot as plt

# 1. Load and prepare data
df = pd.read_csv('vaccine_tweets.csv')
df['date'] = pd.to_datetime(df['created_at'])
df['year_month'] = df['date'].dt.to_period('M')

# 2. Fit BERTopic
topic_model = BERTopic(min_topic_size=50, verbose=True)
topics, probs = topic_model.fit_transform(df['text'].tolist())
df['topic'] = topics

# 3. Temporal analysis
topics_over_time = topic_model.topics_over_time(
    docs=df['text'].tolist(),
    timestamps=df['year_month'].astype(str).tolist(),
    datetime_format="%Y-%m"
)

# 4. Visualize
fig1 = topic_model.visualize_topics_over_time(topics_over_time, top_n_topics=8)
fig1.write_html("vaccine_topics_over_time.html")

# 5. Identify key periods
# Pre-vaccine (before Dec 2020)
# Vaccine rollout (Dec 2020 - Jun 2021)
# Post-rollout (after Jun 2021)

df['period'] = pd.cut(
    df['date'],
    bins=[pd.Timestamp('2019-01-01'),
          pd.Timestamp('2020-12-01'),
          pd.Timestamp('2021-06-01'),
          pd.Timestamp('2023-01-01')],
    labels=['Pre-Vaccine', 'Rollout', 'Post-Rollout']
)

# 6. Compare topic distributions
topic_by_period = pd.crosstab(df['topic'], df['period'], normalize='columns')

# 7. Get top topics per period
for period in ['Pre-Vaccine', 'Rollout', 'Post-Rollout']:
    print(f"\n{period} - Top 5 topics:")
    top_topics = topic_by_period[period].sort_values(ascending=False).head(5)
    for topic_num, proportion in top_topics.items():
        if topic_num == -1:
            continue
        top_words = topic_model.get_topic(topic_num)[:3]
        print(f"  Topic {topic_num} ({proportion:.1%}): {top_words}")

# 8. Statistical test for topic emergence
from scipy.stats import chi2_contingency

contingency_table = pd.crosstab(df['topic'], df['period'])
chi2, p_value, dof, expected = chi2_contingency(contingency_table)
print(f"\nTopic distribution differs significantly across periods: p = {p_value:.4f}")
```

---

## Reporting Temporal Results

### In Your Analysis, Include:

1. **Time range**: "Data spans from [start] to [end]"
2. **Granularity choice**: "Using monthly aggregation because..."
3. **Data distribution**: "Average of X documents per period"
4. **Key patterns**: "Three main trends emerged..."
5. **Statistical significance**: "Changes were significant (p < 0.05)"
6. **Context**: "The spike in March 2020 coincides with..."

### Example Results Section:

> We analyzed 50,000 vaccine-related tweets from January 2020 to December 2022, aggregated by month. BERTopic identified 15 distinct discussion topics. Topic prevalence varied significantly over time (χ² = 452.3, p < 0.001).
>
> Three temporal patterns emerged:
> 1. **Safety concerns** (Topic 3) dominated pre-vaccine period (42% of tweets)
> 2. **Side effects** (Topic 7) spiked during rollout (peak: 31% in Feb 2021)
> 3. **Mandate debates** (Topic 12) emerged post-rollout (sustained at 15-20%)
>
> Sentiment analysis revealed decreasing negativity over time (r = -0.45, p < 0.01), with mean sentiment rising from -0.23 (early 2020) to 0.11 (late 2022).

---

## Getting Help

**Before asking for help:**
1. Check your date column is properly formatted (datetime64)
2. Verify you have reasonable data per time period
3. Make sure your chosen granularity matches your data density

**Come to office hours with:**
1. Description of your temporal pattern/question
2. Sample of your code and data structure
3. Specific visualization or analysis issue
