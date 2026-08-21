# Additional: Sample Size Guide for NLP Projects

## Quick Reference Table

| Task | Minimum | Recommended | Ideal | Notes |
|------|---------|-------------|-------|-------|
| **Sentiment Analysis (pre-trained)** | 50 | 200 | 500+ | Using existing models |
| **Sentiment Analysis (fine-tuned)** | 500 | 2000 | 5000+ | Training your own |
| **Topic Modeling (BERTopic)** | 500 | 1000 | 3000+ | Can work with less |
| **Topic Modeling (LDA)** | 1000 | 2000 | 5000+ | Needs more than BERTopic |
| **Text Classification (traditional)** | 100/class | 500/class | 2000/class | Logistic regression, SVM |
| **Text Classification (BERT)** | 500/class | 2000/class | 5000/class | Fine-tuning transformers |
| **Zero-shot Classification** | 0 training | 10-20 validation | 50 validation | No training data needed! |
| **Few-shot Learning** | 5-10/class | 20-50/class | 100/class | With GPT/LLMs |
| **Named Entity Recognition (custom)** | 1000 | 5000 | 10000+ | Annotated examples |
| **Document Similarity** | 10+ | 100+ | 500+ | Depends on diversity |

---

## Understanding "How Much Data Do I Need?"

The answer depends on THREE key factors:

1. **What you're trying to do** (task type)
2. **What method you're using** (model type)
3. **What your data looks like** (data quality)

### The Golden Rule

**Quality > Quantity**

100 high-quality, representative examples > 1000 messy, poorly-representative ones

---

## Sample Size by Task Type

### 1. Sentiment Analysis

#### Using Pre-trained Models (VADER, Pre-trained BERT)
- **Minimum**: 50 documents (just for validation/testing)
- **Recommended**: 200+ documents
- **Why**: These models are already trained! You mainly need data to validate performance.

```python
# Example: You can use VADER with ANY amount of data
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()
# Works even with 10 documents!
sentiments = [analyzer.polarity_scores(text) for text in your_texts]
```

#### Fine-tuning Your Own Model
- **Minimum**: 500 labeled documents
- **Recommended**: 2000+ labeled documents (balanced across positive/negative/neutral)
- **Ideal**: 5000+ labeled documents
- **Why**: Training a model requires seeing enough examples of each sentiment class.

**Reality check**: If you have less than 500 labeled examples, use pre-trained models instead!

---

### 2. Topic Modeling

#### BERTopic (Modern approach)
- **Minimum**: 500 documents
- **Recommended**: 1000-2000 documents
- **Ideal**: 3000+ documents
- **Why**: BERTopic uses embeddings, so it can work with fewer documents than LDA.

**Special cases**:
- Very short texts (tweets): Need 1000+
- Very long texts (articles): Can work with 300-500
- Temporal analysis: Need at least 50-100 docs per time period

#### LDA (Traditional approach)
- **Minimum**: 1000 documents
- **Recommended**: 2000-3000 documents
- **Ideal**: 5000+ documents
- **Why**: LDA needs to see word co-occurrence patterns. More documents = better patterns.

**Warning signs you don't have enough data**:
- Topics are incoherent (random word lists)
- Many topics look the same
- Topics don't match human interpretation

```python
# Rule of thumb for LDA
num_topics = 10  # Your desired number
min_docs_needed = num_topics * 100  # At least 100 docs per topic
print(f"For {num_topics} topics, aim for at least {min_docs_needed} documents")
```

---

### 3. Text Classification

#### Traditional Methods (Logistic Regression, SVM with TF-IDF)
- **Minimum**: 100 examples per class
- **Recommended**: 500 examples per class
- **Ideal**: 2000+ examples per class

**Example**: Binary classification (spam vs. not spam)
- Minimum: 100 spam + 100 not spam = 200 total
- Recommended: 500 spam + 500 not spam = 1000 total

#### Fine-tuning BERT/Transformers
- **Minimum**: 500 examples per class
- **Recommended**: 2000 examples per class
- **Ideal**: 5000+ examples per class
- **Why**: Deep learning models need more data to avoid overfitting.

#### Zero-shot Classification (No training data!)
- **Training**: 0 examples needed
- **Validation**: 10-50 examples (to check if it works)
- **Why**: Model already knows language, you just describe your classes!

```python
from transformers import pipeline

classifier = pipeline("zero-shot-classification",
                      model="facebook/bart-large-mnli")

# Works with NO training data!
result = classifier(
    "I love this product!",
    candidate_labels=["positive", "negative", "neutral"]
)
```

#### Few-shot Learning with LLMs
- **Training**: 5-20 examples per class
- **Recommended**: 20-50 examples per class
- **Why**: LLMs can learn from very few examples in the prompt!

**When to use each**:
- Zero-shot: No labeled data, want quick results
- Few-shot: Have 5-50 examples, want better accuracy
- Fine-tuning: Have 500+ examples, want best accuracy

---

### 4. Named Entity Recognition (NER)

#### Using Pre-trained (spaCy, Hugging Face)
- **Minimum**: 10+ documents (just to validate)
- **Why**: Already trained on standard entities!

#### Training Custom NER
- **Minimum**: 1000 annotated examples
- **Recommended**: 5000 annotated examples
- **Ideal**: 10,000+ annotated examples
- **Why**: Need to see entities in many different contexts.

**Annotation burden**:
- Annotating 1000 examples typically takes 10-20 hours
- Consider if pre-trained models + rules might be enough!

---

## Data Quality Matters More Than Quantity

### High-Quality Data Checklist

- **Representative**: Covers the diversity of your real-world data
- **Balanced**: Similar amounts for each class/category
- **Clean**: Properly formatted, no excessive noise
- **Relevant**: Actually related to your research question
- **Diverse**: Different authors, time periods, contexts

### Warning Signs of Low-Quality Data

- All examples from a single source/author
- Very imbalanced classes (90% one class, 10% another)
- Many duplicates or near-duplicates
- Extremely short or long outliers
- Different from your target population

---

## The Class Balance Problem

### What is Class Balance?

In classification, **class balance** means having similar amounts of data for each category.

**Bad (Imbalanced)**:
- Positive: 900 examples
- Negative: 100 examples
- Problem: Model will just predict "positive" for everything!

**Good (Balanced)**:
- Positive: 500 examples
- Negative: 500 examples

### How Much Imbalance is OK?

| Ratio | Status | Action |
|-------|--------|--------|
| 1:1 to 1:1.5 | Perfect | No action needed |
| 1:2 to 1:3 | Acceptable | Consider class weights |
| 1:4 to 1:10 | Problematic | Use oversampling/undersampling |
| 1:10+ | Severe | Collect more data or use specialized techniques |

### Solutions for Imbalanced Data

```python
from sklearn.utils import resample
from sklearn.linear_model import LogisticRegression

# Option 1: Undersample majority class
majority = df[df['label'] == 'majority_class']
minority = df[df['label'] == 'minority_class']

majority_downsampled = resample(majority,
                                n_samples=len(minority),
                                random_state=42)

balanced_df = pd.concat([majority_downsampled, minority])

# Option 2: Oversample minority class
minority_upsampled = resample(minority,
                              n_samples=len(majority),
                              random_state=42,
                              replace=True)

balanced_df = pd.concat([majority, minority_upsampled])

# Option 3: Use class weights
model = LogisticRegression(class_weight='balanced')
```

---

## Calculating Required Sample Size

### For Classification Tasks

Use this formula as a rough guide:

```
Minimum samples per class = (number of features / 10) to (number of features / 5)
```

**Example with TF-IDF**:
- Vocabulary size (features): 5000 words
- Minimum per class: 5000/10 = 500
- Recommended per class: 5000/5 = 1000

**Note**: Deep learning (BERT) generally needs MORE data despite having fewer "features" because it has millions of parameters.

### For Topic Modeling

```
Minimum documents = desired_num_topics × 100
Recommended documents = desired_num_topics × 200
```

**Example**:
- Want 10 topics
- Minimum: 10 × 100 = 1000 documents
- Recommended: 10 × 200 = 2000 documents

---

## Statistical Power and Sample Size

### When Does Sample Size Actually Matter Statistically?

If you're doing **statistical comparisons** (e.g., "Is sentiment significantly different between groups?"), you need:

| Effect Size | Minimum Sample per Group |
|-------------|-------------------------|
| Large effect (Cohen's d > 0.8) | 30 |
| Medium effect (Cohen's d ≈ 0.5) | 100 |
| Small effect (Cohen's d < 0.3) | 300+ |

**Example**: Comparing Reddit posts from two subreddits
- If differences are obvious: 30 posts per subreddit might be enough
- If differences are subtle: Need 300+ per subreddit

```python
# Calculate required sample size for t-test
from statsmodels.stats.power import TTestIndPower

analysis = TTestIndPower()
required_n = analysis.solve_power(
    effect_size=0.5,  # Medium effect
    power=0.8,        # 80% power
    alpha=0.05        # 95% confidence
)
print(f"Required sample size per group: {required_n:.0f}")
```

---

## What If I Don't Have Enough Data?

### Option 1: Use Pre-trained Models
Instead of training your own, use models already trained on large datasets.

**Good for**: Sentiment analysis, NER, general classification

```python
# Zero-shot classification needs NO training data!
from transformers import pipeline

classifier = pipeline("zero-shot-classification")
# Use immediately with any data amount
```

### Option 2: Few-shot Learning with LLMs
Provide 5-20 examples in your prompt instead of training a model.

**Good for**: Custom classification, labeling, analysis tasks

### Option 3: Data Augmentation
Artificially increase your dataset size.

```python
# Example: Back-translation for data augmentation
from googletrans import Translator

def augment_via_translation(text):
    translator = Translator()
    # English -> French -> English
    french = translator.translate(text, dest='fr').text
    back = translator.translate(french, dest='en').text
    return back

# Original: "This product is great!"
# Augmented: "This product is excellent!" (slightly different)
```

### Option 4: Transfer Learning
Fine-tune a pre-trained model with your small dataset.

**Good for**: Domain-specific classification with 200-500 examples

### Option 5: Combine Multiple Small Sources
Aggregate data from multiple sources to reach sufficient size.

### Option 6: Qualitative Analysis
With very small samples (<50), consider qualitative/interpretive approaches instead of ML.

**Good for**: Rich, detailed analysis of a few cases

---

## Validation Set Size

Don't forget: You need to split your data for validation/testing!

### Common Split Ratios

| Total Data Size | Train | Validation | Test | Reasoning |
|----------------|-------|------------|------|-----------|
| < 1000 | 70% | 15% | 15% | Maximize training data |
| 1000-10000 | 70% | 15% | 15% | Standard split |
| 10000+ | 80% | 10% | 10% | More data = less need for large validation |

### Minimum Validation Sizes

Even with small datasets:
- **Minimum validation set**: 50 examples
- **Minimum test set**: 50 examples

**Why**: Need enough to reliably estimate performance.

```python
from sklearn.model_selection import train_test_split

# For datasets < 1000
X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)

print(f"Train: {len(X_train)}, Val: {len(X_val)}, Test: {len(X_test)}")
```

---

## Cross-Validation for Small Datasets

When data is limited, use k-fold cross-validation instead of a single train/test split.

```python
from sklearn.model_selection import cross_val_score
from sklearn.linear_model import LogisticRegression

model = LogisticRegression()

# 5-fold cross-validation
scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')

print(f"Accuracy: {scores.mean():.2f} (+/- {scores.std():.2f})")
```

**When to use**:
- Dataset < 1000 examples
- Want more reliable performance estimate
- Can't afford to "waste" data on test set

---

## Temporal/Time Series Considerations

### For Temporal Analysis (sentiment over time, topic evolution)

Minimum requirements **per time period**:
- **Sentiment analysis**: 50+ documents per period
- **Topic modeling**: 100+ documents per period

**Example**: Analyzing Reddit posts over 12 months
- Minimum: 50 posts/month × 12 months = 600 posts
- Recommended: 200 posts/month × 12 months = 2400 posts

### Handling Sparse Time Periods

If some time periods have few documents:
1. **Aggregate**: Combine into longer periods (daily → weekly)
2. **Smooth**: Use moving averages
3. **Interpolate**: Fill gaps with predicted values (use cautiously!)

```python
# Example: Aggregate sparse daily data into weeks
df['week'] = df['date'].dt.to_period('W')
weekly_data = df.groupby('week').agg({
    'text': lambda x: ' '.join(x),  # Combine texts
    'sentiment': 'mean'              # Average sentiment
})
```

---

## Multilingual Considerations

If analyzing multiple languages:
- Need sample size **per language**
- Can't combine across languages for most tasks
- Some models (mBERT, XLM-R) work across languages

**Minimum per language**: Follow same guidelines as above, but for each language separately.

---

## Real-World Examples from Student Projects

### Project 1: Reddit Misinformation Analysis
- **Data collected**: 500 posts
- **Task**: Topic modeling + sentiment analysis
- **Verdict**: Sufficient for BERTopic + pre-trained sentiment
- **Recommendation**: Could benefit from 1000+ for more stable topics

### Project 2: Spotify Review Sentiment
- **Data collected**: 150 reviews, 90% positive
- **Task**: Classification (positive vs. negative)
- **Verdict**: Too imbalanced, too few negatives
- **Recommendation**: Oversample negatives or use zero-shot classification

### Project 3: Presidential Speech Analysis
- **Data collected**: 50 speeches
- **Task**: Temporal topic modeling
- **Verdict**: Too few for topic modeling
- **Recommendation**: Use qualitative analysis OR aggregate speeches into fewer time periods

### Project 4: E-commerce Product Reviews
- **Data collected**: 5000 reviews, balanced positive/negative
- **Task**: Sentiment classification
- **Verdict**: Excellent! Can fine-tune custom model
- **Recommendation**: Perfect amount for supervised learning

---

## Summary Decision Tree

```
How much data do I need?

├─ Using pre-trained models (sentiment, NER, zero-shot)?
│  └─ ANY amount! (minimum 50 for validation)
│
├─ Topic modeling?
│  ├─ BERTopic → 500-1000 documents
│  └─ LDA → 1000-2000 documents
│
├─ Classification?
│  ├─ Zero-shot → 0 training, 10-50 validation
│  ├─ Few-shot → 5-20 per class
│  ├─ Traditional ML → 100-500 per class
│  └─ Fine-tuning BERT → 500-2000 per class
│
└─ Custom NER/Complex task?
   └─ 1000-10000 labeled examples
```

---

## Your Turn: Assess Your Sample Size

```python
def assess_sample_size(num_samples, task_type, num_classes=None):
    """
    Quick assessment of whether you have enough data.

    Parameters:
    - num_samples: Total number of documents/examples
    - task_type: 'topic_modeling', 'classification', 'sentiment', 'ner'
    - num_classes: Number of classes (for classification)
    """
    recommendations = {
        'topic_modeling': {
            'minimum': 1000,
            'recommended': 2000,
            'method': 'Use BERTopic if < 1000, LDA if 1000+'
        },
        'classification': {
            'minimum': 100 * (num_classes or 2),
            'recommended': 500 * (num_classes or 2),
            'method': 'Consider zero-shot if < minimum'
        },
        'sentiment': {
            'minimum': 50,
            'recommended': 200,
            'method': 'Use pre-trained models (VADER, BERT)'
        },
        'ner': {
            'minimum': 1000,
            'recommended': 5000,
            'method': 'Use spaCy pre-trained unless domain-specific'
        }
    }

    task_info = recommendations.get(task_type, {})
    min_required = task_info.get('minimum', 100)
    recommended = task_info.get('recommended', 500)

    print(f"\n{'='*60}")
    print(f"SAMPLE SIZE ASSESSMENT: {task_type.upper()}")
    print(f"{'='*60}")
    print(f"Your data: {num_samples} samples")
    print(f"Minimum required: {min_required}")
    print(f"Recommended: {recommended}")

    if num_samples < min_required:
        print(f"\n❌ INSUFFICIENT DATA")
        print(f"You have {min_required - num_samples} too few samples.")
        print(f"Recommendation: {task_info.get('method', 'Collect more data or use simpler methods')}")
    elif num_samples < recommended:
        print(f"\n⚠️  ACCEPTABLE BUT LIMITED")
        print(f"Results may be less reliable. Consider collecting {recommended - num_samples} more samples.")
        print(f"Recommendation: {task_info.get('method', 'Proceed with caution')}")
    else:
        print(f"\n✅ SUFFICIENT DATA")
        print(f"You have enough data for reliable results!")

    print(f"{'='*60}\n")

# Usage examples
assess_sample_size(500, 'topic_modeling')
assess_sample_size(300, 'classification', num_classes=3)
assess_sample_size(150, 'sentiment')
```

---

**Last Updated:** Week 8, 2025
**Questions?** Bring your specific project details to office hours!
