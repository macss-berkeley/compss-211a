# Additional: NLP Method Selection Cheatsheet

## Quick Reference: Research Question → Method Mapping

### 1. What are the main themes or topics in my text data?
**→ Topic Modeling**

| Method | Best For | Min. Sample Size | Pros | Cons |
|--------|----------|------------------|------|------|
| **BERTopic** | Modern approach, any domain | 500+ documents | Coherent topics, works with short texts, temporal analysis | Requires computational resources |
| **LDA** | Traditional, interpretable | 1000+ documents | Well-established, interpretable | Requires longer texts, manual tuning |
| **TF-IDF + Clustering** | Quick exploration | 100+ documents | Fast, simple | Less sophisticated, manual interpretation |

**When to use what:**
- **BERTopic**: Default choice for most projects, especially with mixed text lengths
- **LDA**: When you need traditional academic approach or have very large corpus
- **TF-IDF**: Initial exploration or when computational resources are limited

---

### 2. What is the sentiment or emotional tone?
**→ Sentiment Analysis**

| Method | Best For | Min. Sample Size | Pros | Cons |
|--------|----------|------------------|------|------|
| **Pre-trained BERT** | Nuanced sentiment, sarcasm | 50+ documents | High accuracy, context-aware | Slower, needs GPU |
| **VADER** | Social media, informal text | 50+ documents | Fast, handles emojis/slang | Rule-based, less nuanced |
| **TextBlob** | Quick analysis, simple text | 50+ documents | Very fast, simple API | Basic, less accurate |
| **Custom Fine-tuned Model** | Domain-specific sentiment | 500+ labeled | Highest accuracy for your domain | Requires labeled data |

**When to use what:**
- **VADER**: Social media (Reddit, Twitter), product reviews with emojis
- **Pre-trained BERT**: Nuanced text (news articles, formal reviews)
- **TextBlob**: Quick exploration or simple positive/negative classification
- **Fine-tuned**: When domain-specific sentiment differs from general (e.g., financial sentiment)

---

### 3. How do topics or sentiments change over time?
**→ Temporal Analysis**

| Method | Best For | Min. Sample Size | What You Need |
|--------|----------|------------------|---------------|
| **BERTopic + Time** | Topic evolution | 1000+ documents | Timestamps for each document |
| **Dynamic Topic Models** | Academic research | 2000+ documents | Timestamps, computational power |
| **Sentiment + Time Series** | Sentiment trends | 200+ documents | Timestamps, sentiment scores |

**Key Considerations:**
- Ensure even distribution of documents across time periods
- Consider smoothing for sparse time periods
- Visualize with line plots or heatmaps

---

### 4. How similar are documents or how do I find duplicates?
**→ Document Similarity**

| Method | Best For | Min. Sample Size | Speed |
|--------|----------|------------------|-------|
| **Sentence Transformers** | Semantic similarity | Any | Medium |
| **TF-IDF + Cosine Similarity** | Quick similarity | Any | Fast |
| **MinHash/LSH** | Near-duplicate detection at scale | 1000+ | Very Fast |

**When to use what:**
- **Sentence Transformers**: Finding semantically similar documents (different words, same meaning)
- **TF-IDF**: Finding lexically similar documents (same/similar words)
- **MinHash**: Detecting near-duplicates in very large datasets

---

### 5. What are the key entities or concepts?
**→ Named Entity Recognition (NER) / Keyword Extraction**

| Method | Best For | Min. Sample Size | Pros | Cons |
|--------|----------|------------------|------|------|
| **spaCy NER** | Standard entities (people, orgs, locations) | Any | Fast, accurate | Limited to trained categories |
| **KeyBERT** | Domain-specific keywords | 50+ | Context-aware, flexible | Slower than TF-IDF |
| **TF-IDF** | Quick keyword extraction | 100+ | Very fast | Ignores semantics |
| **Custom NER** | Domain-specific entities | 1000+ labeled | Tailored to your domain | Requires annotation |

**When to use what:**
- **spaCy NER**: Standard entities in news, articles, general text
- **KeyBERT**: Extracting key concepts from academic papers, reports
- **TF-IDF**: Quick and dirty keyword extraction
- **Custom NER**: Domain-specific entities (medical terms, legal concepts)

---

### 6. How do I classify documents into categories?
**→ Text Classification**

| Method | Best For | Min. Sample Size | Accuracy |
|--------|----------|------------------|----------|
| **Fine-tuned BERT** | High-stakes classification | 500+ per class | Highest |
| **Zero-shot Classification** | No labeled data | 10+ examples for validation | Good |
| **Logistic Regression + TF-IDF** | Simple, interpretable | 100+ per class | Good |
| **Few-shot with LLMs** | Limited labeled data | 5-20 per class | Very Good |

**When to use what:**
- **Zero-shot**: No labeled data, exploratory phase
- **Few-shot with LLMs**: 5-20 examples per class, quick iteration
- **Logistic Regression**: Need interpretability, understand which words predict which class
- **Fine-tuned BERT**: Have labeled data (500+), need highest accuracy

---

## Decision Tree

```
START: What is your research question?

├─ I want to discover patterns/themes
│  ├─ Do you have timestamps? → YES → BERTopic with temporal analysis
│  └─ No timestamps → BERTopic or LDA
│
├─ I want to measure sentiment/emotion
│  ├─ Social media text? → YES → VADER
│  ├─ Formal text/nuanced? → YES → Pre-trained BERT sentiment
│  └─ Over time? → Sentiment Analysis + Time Series
│
├─ I want to classify documents
│  ├─ Have labeled data?
│  │  ├─ YES (500+) → Fine-tuned BERT
│  │  ├─ YES (100-500) → Logistic Regression + TF-IDF
│  │  ├─ Few (5-50) → Few-shot with LLM
│  │  └─ NO → Zero-shot classification
│
├─ I want to find similar documents
│  ├─ Semantic similarity? → YES → Sentence Transformers
│  ├─ Exact/near duplicates? → YES → MinHash/LSH
│  └─ General similarity → TF-IDF + Cosine Similarity
│
└─ I want to extract information
   ├─ Standard entities (people, places) → spaCy NER
   ├─ Keywords/concepts → KeyBERT or TF-IDF
   └─ Domain-specific entities → Custom NER (requires labeled data)
```

---

## Sample Size Requirements Summary

### Minimum Viable Samples
- **Sentiment Analysis (pre-trained)**: 50-100 documents
- **Zero-shot Classification**: 10-20 for validation
- **Topic Modeling (BERTopic)**: 500-1000 documents
- **Topic Modeling (LDA)**: 1000-2000 documents
- **Few-shot Learning**: 5-20 examples per class
- **Supervised Classification**: 100-500 per class minimum
- **Fine-tuning Models**: 500-5000+ per class

### Quality Considerations
- More data ≠ always better (diminishing returns after certain point)
- **Quality > Quantity**: 100 clean, representative examples > 1000 messy ones
- **Class Balance**: Aim for similar numbers across categories
- **Diversity**: Ensure samples represent real-world variation

---

## When Traditional NLP > Modern LLMs

Use **traditional methods** (TF-IDF, Bag-of-Words, Logistic Regression) when:
- You need interpretability (understand exact features driving predictions)
- You have limited computational resources
- You need real-time/fast processing
- Your data is structured and clean
- Simple patterns are sufficient (keyword matching, basic classification)
- Cost is a concern (no API costs, runs locally)

Use **modern methods** (BERT, LLMs) when:
- You need to capture nuance, context, and semantics
- You're dealing with sarcasm, irony, or complex language
- You have short texts with limited context
- You need multilingual support
- Traditional methods fail to capture necessary patterns
- You have limited or no labeled data (zero/few-shot)

---

## Common Pitfalls & Solutions

### 1. "My topic model returns meaningless words"
**Causes:**
- Too many stop words not filtered
- Text not properly cleaned
- Too few documents
- Wrong number of topics specified

**Solutions:**
- Improve preprocessing (remove domain-specific stop words)
- Try BERTopic instead of LDA (more robust)
- Increase minimum document frequency
- Use topic coherence metrics to find optimal number

### 2. "Sentiment doesn't match my ratings/labels"
**Possible reasons:**
- This might be your research finding! (e.g., reviews with negative text but high ratings)
- Model trained on different domain (e.g., movie reviews vs. product reviews)
- Sarcasm or irony not detected

**Solutions:**
- Investigate mismatches qualitatively
- Try domain-specific sentiment models
- Consider fine-tuning on your labeled data
- Use this as a research finding, not a problem

### 3. "My text is too short/long for the model"
**For short texts (<10 words):**
- Use BERTopic (better than LDA)
- Use Sentence Transformers instead of TF-IDF
- Consider aggregating short texts by author/session

**For long texts (>512 tokens):**
- Truncate to model's max length (keep first 512 tokens or use sliding window)
- Use models with longer context (Longformer, LED)
- Split into chunks and aggregate predictions

### 4. "Model accuracy is low"
**Check:**
- Is your data clean? (see Data Cleaning Cookbook)
- Is your data balanced? (equal representation of classes)
- Is your validation set representative?
- Do you have enough training data?

**Try:**
- Better preprocessing
- More training data
- Different model architecture
- Fine-tuning instead of using off-the-shelf
- Ensemble methods (combine multiple models)

---

## Quick Start Recommendations by Project Type

### Reddit/Social Media Analysis
1. **Preprocessing**: VADER + emoji handling
2. **Topics**: BERTopic
3. **Sentiment**: VADER or Twitter-RoBERTa
4. **Classification**: Few-shot with GPT or fine-tuned RoBERTa

### News/Articles Analysis
1. **Preprocessing**: Standard (spaCy)
2. **Topics**: LDA or BERTopic
3. **Entities**: spaCy NER
4. **Sentiment**: FinBERT (financial) or generic BERT

### Product Reviews
1. **Preprocessing**: Remove HTML, handle ratings
2. **Sentiment**: BERT-based sentiment or fine-tuned on your domain
3. **Topics**: BERTopic or LDA
4. **Aspect-based**: Custom NER + sentiment

### Academic/Formal Text
1. **Preprocessing**: Minimal (preserve structure)
2. **Topics**: LDA
3. **Keywords**: KeyBERT or RAKE
4. **Similarity**: Sentence Transformers (SciB ERT)

---

## Resources & Libraries

### Essential Libraries
```python
# Traditional NLP
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
import nltk
import spacy

# Modern NLP
from transformers import pipeline, AutoTokenizer, AutoModel
from sentence_transformers import SentenceTransformer
from bertopic import BERTopic

# Sentiment
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob

# Utilities
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
```

### Pre-trained Models (Hugging Face)

**Sentiment:**
- `cardiffnlp/twitter-roberta-base-sentiment-latest` (social media)
- `distilbert-base-uncased-finetuned-sst-2-english` (general)
- `ProsusAI/finbert` (financial sentiment)

**Zero-shot Classification:**
- `facebook/bart-large-mnli`
- `MoritzLaurer/DeBERTa-v3-base-mnli-fever-anli`

**Embeddings:**
- `sentence-transformers/all-MiniLM-L6-v2` (fast, general)
- `sentence-transformers/all-mpnet-base-v2` (best quality)

---

**Last Updated:** Week 8, 2025
**Questions?** Bring them to office hours!
