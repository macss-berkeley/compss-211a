# Additional: Embeddings & Topic Modeling: Which Method for My Project?

This additional guide is based on office hour questions raised so far. Hopefully it can help you choose the right NLP method for your computational social science project. 

We cover the progression from basic frequency counts to advanced neural models, helping you understand when to use each approach.

---

## The NLP Methods Hierarchy

Think of NLP methods as a ladder - start at the bottom and climb up only as needed:

```
┌─────────────────────────────────────────────────────┐
│  Level 5: Large Language Models (LLMs)              │  ← Week 10-11
│  - ChatGPT, GPT-4, Llama                           │  Most powerful,
│  - For: Complex reasoning, generation, Q&A          │  Most expensive
│  - Example: "Classify these posts by ideology"      │
├─────────────────────────────────────────────────────┤
│  Level 4: Fine-tuned Transformers                   │
│  - BERT, RoBERTa for specific tasks                │  High accuracy,
│  - For: Classification, NER, sentiment              │  Needs GPU
│  - Example: "Is this post about healthcare?"        │
├─────────────────────────────────────────────────────┤
│  Level 3: Pre-trained Embeddings + Topic Models     │  ← Week 9 (YOU ARE HERE)
│  - BERTopic, Sentence Transformers                 │  Good balance,
│  - For: Topic discovery, semantic similarity        │  Practical for
│  - Example: "What themes emerge in this corpus?"    │  most projects
├─────────────────────────────────────────────────────┤
│  Level 2: Trained Word Embeddings                   │  ← Week 9
│  - Word2Vec, FastText, GloVe                       │  Domain-specific,
│  - For: Word relationships, bias detection          │  Interpretable
│  - Example: "How are concepts related in tweets?"   │
├─────────────────────────────────────────────────────┤
│  Level 1: Frequency-Based Methods                   │  ← Week 8
│  - TF-IDF, word counts, n-grams                    │  Fast, simple,
│  - For: Keywords, basic patterns                    │  Great baseline
│  - Example: "What words are most distinctive?"      │
└─────────────────────────────────────────────────────┘
```

**Golden Rule**: Start at Level 1 and only move up if you need to!

---

## Decision Flow

### START HERE: What's your research question?

#### Question Type A: "What are people talking about?"
→ **You need topic modeling**
```
Dataset < 500 docs?
├─ Yes → TF-IDF + manual inspection (Week 8)
└─ No  → BERTopic (Week 9)
```

#### Question Type B: "How do concepts relate to each other?"
→ **You need embeddings**
```
Need to understand YOUR corpus specifically?
├─ Yes → Train Word2Vec/FastText (Week 9)
└─ No  → Use pre-trained embeddings (Week 9)
```

#### Question Type C: "What's the sentiment/emotion/stance?"
→ **You need classification**
```
See sentiment_analysis_guide.md
└─ Usually: HuggingFace pre-trained models
```

#### Question Type D: "How does X change over time?"
→ **You need temporal analysis**
```
See temporal_analysis_guide.md
└─ Combine your chosen method with time grouping
```

#### Question Type E: "What distinguishes group A from group B?"
→ **You need comparison analysis**
```
├─ Keyword differences → TF-IDF (Week 8)
├─ Topic differences → BERTopic + group comparison
└─ Semantic differences → Embeddings + semantic axes
```

---

## Method Deep Dive

### Level 1: Frequency-Based Methods (Week 8)

#### TF-IDF (Term Frequency - Inverse Document Frequency)

**What it does**: Finds words that are important to specific documents

**When to use**:
- Want to find distinctive keywords per group/topic
- Need fast, interpretable results
- Have clear document groupings (e.g., comparing subreddits)
- Dataset < 10,000 documents
- Preliminary exploration

**When NOT to use**:
- Need to understand word meanings or relationships
- Want to discover unknown topics
- Have very short documents (< 50 words)

**Implementation**:
```python
from sklearn.feature_extraction.text import TfidfVectorizer

# Basic TF-IDF
vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
tfidf_matrix = vectorizer.fit_transform(df['text'])

# Get top words per document
feature_names = vectorizer.get_feature_names_out()
```

**Example research questions**:
- "What words distinguish r/conservative from r/liberal?"
- "What terms are most characteristic of COVID-19 misinformation?"
- "Which keywords are unique to homelessness discussions in SF vs LA?"

---

### Level 2: Word Embeddings

#### Word2Vec / FastText (Train Your Own)

**What it does**: Learns word meanings from YOUR corpus

**When to use**:
- Domain-specific vocabulary (medical, legal, technical)
- Need to understand word relationships IN YOUR DATA
- Detecting bias in your specific corpus
- Dataset > 5,000 documents with > 1M words total
- Want to create word analogies specific to your domain

**When NOT to use**:
- Small dataset (< 1M words total)
- General vocabulary (use pre-trained instead)
- Just need document-level analysis

**Which one: Word2Vec or FastText?**
- **FastText** if: Social media, typos, slang, abbreviations (e.g., Reddit, Twitter)
- **Word2Vec** if: Clean, formal text (e.g., news articles, academic papers)

**Implementation**:
```python
from gensim.models import FastText, Word2Vec

# Preprocessing: tokenize
corpus = [text.lower().split() for text in df['text']]

# FastText (better for social media)
model = FastText(
    sentences=corpus,
    vector_size=100,
    window=5,
    min_count=5,
    sg=1,  # Skip-gram
    epochs=10
)

# Find similar words
model.wv.most_similar('homeless', topn=10)

# Word analogies
model.wv.most_similar(positive=['woman', 'king'], negative=['man'])
```

**Example research questions**:
- "How is 'homeless' discussed differently in SF vs national news?"
- "What gender biases exist in AITA discourse?"
- "How do progressive and conservative media frame 'immigration'?"

---

#### Pre-trained Embeddings (GloVe, word2vec-google-news)

**What it does**: Uses embeddings trained on massive general corpora

**When to use**:
- Small dataset (< 1M words)
- General vocabulary
- Need quick results
- Baseline comparison

**When NOT to use**:
- Highly domain-specific text
- Lots of slang/abbreviations not in standard English

**Implementation**:
```python
import gensim.downloader as api

# Load pre-trained model
glove = api.load('glove-wiki-gigaword-100')

# Use same as trained models
glove.most_similar('politics')
```

---

### Level 3: BERTopic (Modern Topic Modeling)

**What it does**: Automatically discovers topics using transformer embeddings

**When to use**:
- **PRIMARY RECOMMENDATION FOR MOST PROJECTS**
- Want to discover what people are talking about
- Dataset > 500 documents
- Don't know the topics in advance
- Need to track topics over time
- Want interpretable topic labels
- Need to classify new documents into topics

**When NOT to use**:
- Very small dataset (< 100 documents)
- Documents are very short (< 20 words)
- No GPU and dataset > 50,000 documents (will be slow)

**Why BERTopic > traditional LDA?**
- Better at capturing semantic meaning
- Automatically determines number of topics
- More coherent topics
- Better visualization tools
- Handles modern text (social media) better

**Implementation**:
```python
from bertopic import BERTopic

# Basic BERTopic
topic_model = BERTopic(verbose=True)
topics, probabilities = topic_model.fit_transform(df['text'].tolist())

# Add topics to dataframe
df['topic'] = topics

# Get topic info
topic_model.get_topic_info()

# Visualize
topic_model.visualize_topics()
topic_model.visualize_barchart(top_n_topics=10)

# Topics over time
timestamps = df['date'].tolist()
topics_over_time = topic_model.topics_over_time(
    df['text'].tolist(),
    timestamps,
    nr_bins=20
)
topic_model.visualize_topics_over_time(topics_over_time)
```

**Improving BERTopic results**:
```python
# If topics are too granular, reduce them
topic_model.reduce_topics(docs, nr_topics=15)

# If you want more control
from sklearn.feature_extraction.text import CountVectorizer

# Remove stopwords and very common words
vectorizer = CountVectorizer(stop_words='english', min_df=5)

topic_model = BERTopic(
    vectorizer_model=vectorizer,
    min_topic_size=30,  # Minimum documents per topic
    verbose=True
)
```

**Example research questions**:
- "What themes emerge in homelessness discussions on Reddit?"
- "How do misinformation topics evolve over time?"
- "What are people concerned about in vaccine-related tweets?"
- "How do topics differ between r/politics and r/conservative?"

---

### Level 4: Classification with Transformers

**What it does**: Assigns predefined labels to documents

**When to use**:
- You have specific categories you want to detect
- Pre-trained model exists for your task (sentiment, toxicity, etc.)
- Need high accuracy
- Documents are well-formed

**When NOT to use**:
- Exploratory analysis (use BERTopic instead)
- Don't have labeled data and need custom categories
- Very large datasets without GPU

**See sentiment_analysis_guide.md for details**

---

## Method Comparison Matrix

| Method | Speed | Setup | Interpretability | Best For | Min Corpus Size |
|--------|-------|-------|------------------|----------|-----------------|
| **TF-IDF** | ⚡⚡⚡⚡⚡ | Very Easy | ⭐⭐⭐⭐⭐ | Keywords, comparison | 100 docs |
| **Word2Vec/FastText** | ⚡⚡⚡⚡ | Medium | ⭐⭐⭐⭐ | Word relationships | 5,000 docs |
| **Pre-trained Embeddings** | ⚡⚡⚡⚡⚡ | Easy | ⭐⭐⭐ | General similarity | Any |
| **BERTopic** | ⚡⚡⚡ | Easy | ⭐⭐⭐⭐ | Topic discovery | 500 docs |
| **HuggingFace Classification** | ⚡⚡ | Easy | ⭐⭐ | Specific tasks | Any |
| **Fine-tuned BERT** | ⚡ | Very Hard | ⭐ | Custom classification | 1,000+ labeled |

---

## Recommended Workflow for Your Project

### Week 9 Workflow

**Phase 1: Baseline (30 minutes)**
```python
# 1. Start with basic frequency analysis
from sklearn.feature_extraction.text import CountVectorizer
vectorizer = CountVectorizer(max_features=50, stop_words='english')
word_counts = vectorizer.fit_transform(df['text'])
print("Top words:", vectorizer.get_feature_names_out())
```

**Phase 2: Topic Discovery (2-3 hours)**
```python
# 2. Apply BERTopic to discover themes
from bertopic import BERTopic
topic_model = BERTopic()
topics, _ = topic_model.fit_transform(df['text'].tolist())
df['topic'] = topics

# Examine topics
print(topic_model.get_topic_info())

# Visualize
topic_model.visualize_barchart(top_n_topics=10)

# If needed, reduce overlapping topics
topic_model.reduce_topics(df['text'].tolist(), nr_topics=10)
```

**Phase 3: Semantic Analysis (2-3 hours)**
```python
# 3. IF your research question requires understanding word relationships
# Train embeddings on your corpus
from gensim.models import FastText

corpus_tokenized = [text.lower().split() for text in df['text']]
model = FastText(corpus_tokenized, vector_size=100, window=5, min_count=5)

# Explore semantic relationships
model.wv.most_similar('your_keyword')

# Create semantic axes for bias analysis (see lesson notebook)
```

**Phase 4: Temporal/Group Comparisons (1-2 hours)**
```python
# 4. IF you need to track changes over time or between groups
# See temporal_analysis_guide.md

# Topics over time
topics_over_time = topic_model.topics_over_time(
    df['text'].tolist(),
    df['date'].tolist(),
    nr_bins=20
)

# OR compare topics between groups
topic_dist_group1 = df[df['group'] == 'A']['topic'].value_counts()
topic_dist_group2 = df[df['group'] == 'B']['topic'].value_counts()
```

---

## Common Project Types & Recommended Methods

### Project: Analyzing Homelessness Discourse on Reddit

**Research Question**: "What themes emerge in discussions about homelessness, and how do they vary by subreddit?"

**Recommended Approach**:
1. **BERTopic** to discover themes (primary method)
2. **TF-IDF** to find distinctive keywords per subreddit (supplementary)
3. **Temporal analysis** if tracking over time

```python
# Main analysis
topic_model = BERTopic(min_topic_size=30)
topics, _ = topic_model.fit_transform(df['text'].tolist())
df['topic'] = topics

# Compare topic distributions by subreddit
topic_by_sub = pd.crosstab(df['topic'], df['subreddit'], normalize='columns')
```

---

### Project: Misinformation Narratives Analysis

**Research Question**: "What misinformation narratives exist, and how do they evolve?"

**Recommended Approach**:
1. **BERTopic** with temporal analysis (primary method)
2. **Sentiment analysis** to track emotional tone (supplementary)
3. **Word embeddings** to detect framing differences (advanced)

```python
# Topics over time
topics, _ = topic_model.fit_transform(df['text'].tolist())
topics_over_time = topic_model.topics_over_time(
    df['text'].tolist(),
    df['timestamp'].tolist()
)
topic_model.visualize_topics_over_time(topics_over_time)
```

---

### Project: Gender Bias in Language

**Research Question**: "How are gender stereotypes encoded in online discourse?"

**Recommended Approach**:
1. **Train FastText embeddings** (primary method)
2. **Semantic axis analysis** for bias detection (from lesson)
3. **BERTopic** to find gendered topics (supplementary)

```python
# Train embeddings
model = FastText(corpus, vector_size=100, window=5)

# Create gender axis
female_terms = ['she', 'her', 'woman', 'mother']
male_terms = ['he', 'him', 'man', 'father']
gender_axis = create_semantic_axis(female_terms, male_terms, model)

# Project occupation words
occupations = ['nurse', 'engineer', 'teacher', 'CEO']
for occ in occupations:
    score = project_on_axis(occ, model, gender_axis)
    print(f"{occ}: {score:.3f}")
```

---

### Project: Vaccine Hesitancy on Social Media

**Research Question**: "What concerns drive vaccine hesitancy, and what's the sentiment?"

**Recommended Approach**:
1. **BERTopic** to identify concern themes (primary method)
2. **HuggingFace sentiment** for emotional tone (primary method)
3. **Temporal analysis** to track changes (supplementary)

```python
# Topics
topics, _ = topic_model.fit_transform(df['text'].tolist())
df['topic'] = topics

# Sentiment per topic
from transformers import pipeline
sentiment = pipeline('sentiment-analysis')
df['sentiment'] = df['text'].apply(lambda x: sentiment(x[:512])[0]['label'])

# Cross-tabulate
pd.crosstab(df['topic'], df['sentiment'], normalize='index')
```

---

## Troubleshooting Common Issues

### Issue: "BERTopic creates too many topics / topics overlap"

**Solution**:
```python
# Reduce topics after fitting
topic_model.reduce_topics(docs, nr_topics=15)

# OR adjust parameters before fitting
topic_model = BERTopic(
    min_topic_size=50,  # Increase for fewer, larger topics
    n_gram_range=(1, 2),  # Include bigrams
    verbose=True
)
```

### Issue: "My corpus is too small for Word2Vec"

**Solution**:
- Use **pre-trained embeddings** instead (GloVe, word2vec-google-news)
- OR combine with external corpus in same domain
- OR use **BERTopic** (works with smaller corpora)

### Issue: "Processing is too slow"

**Solution**:
- **BERTopic**: Sample your data first (e.g., 5,000 docs), or use lighter embedding model
- **HuggingFace**: Use batch processing, smaller model (distilbert), or sample
- Consider using **TF-IDF** or **VADER** for very large datasets

```python
# Sample large dataset
sample_size = 5000
df_sample = df.sample(n=min(sample_size, len(df)))

# Fit on sample
topic_model.fit(df_sample['text'].tolist())

# Apply to full dataset
topics = topic_model.transform(df['text'].tolist())
```

### Issue: "Topics don't make sense"

**Solutions**:
1. Improve preprocessing (remove URLs, handles, etc.)
2. Remove very common words with CountVectorizer
3. Adjust min_topic_size parameter
4. Try reducing number of topics
5. Check if documents are too short

```python
from sklearn.feature_extraction.text import CountVectorizer

# Better preprocessing
vectorizer = CountVectorizer(
    stop_words='english',
    min_df=5,  # Word must appear in at least 5 docs
    max_df=0.7  # Ignore words in > 70% of docs
)

topic_model = BERTopic(vectorizer_model=vectorizer)
```

---

## When to Move to More Advanced Methods (Week 10-11)

Consider **LLMs (GPT-4, Llama)** if:
- Need complex reasoning ("Is this sarcastic?")
- Want to generate summaries or synthetic data
- Classification into many nuanced categories
- Zero-shot classification without training data

Consider **fine-tuning transformers** if:
- Have 1,000+ labeled examples
- Need very high accuracy on specific task
- Have GPU resources
- Classification task with clear categories

**For Week 9, stick with BERTopic and embeddings** - they're powerful enough for most CSS projects!

---

## Final Recommendations

### For Most Teams:
1. **Start with BERTopic** - It's the sweet spot for exploration
2. **Add sentiment** if emotions/attitudes matter (see sentiment_analysis_guide.md)
3. **Add embeddings** only if you need to study specific word relationships

### Only Use Custom Word Embeddings If:
- You have domain-specific vocabulary
- You specifically want to study word relationships/biases
- Your corpus is large enough (> 5,000 documents)

### Red Flags:
- "I'll just try everything" → Pick methods based on research question
- "I'll train BERT from scratch" → Use pre-trained models
- "I'll skip the baseline" → Always start simple (TF-IDF)

---

## Getting Help

**Before office hours, answer these:**
1. What is your research question?
2. What does your data look like? (size, type, length)
3. What have you tried so far?
4. What specific error or issue are you facing?

**In office hours, we can:**
- Help you choose the right method
- Debug implementation issues
- Interpret results
- Suggest next steps

Remember: **Simpler is often better!** Start with the simplest method that answers your research question. You can always add complexity later.

---

## Quick Reference: Method Selection

```python
# Decision tree in code:

def choose_method(research_question, corpus_size, text_type):
    """
    Help choose the right NLP method
    """
    if "what are people talking about" in research_question.lower():
        if corpus_size < 500:
            return "TF-IDF + manual inspection"
        else:
            return "BERTopic"

    elif "sentiment" in research_question.lower():
        return "See sentiment_analysis_guide.md"

    elif "how do words relate" in research_question.lower():
        if corpus_size < 5000:
            return "Pre-trained embeddings (GloVe)"
        else:
            return "Train Word2Vec/FastText"

    elif "over time" in research_question.lower():
        return "BERTopic + temporal analysis"

    else:
        return "Start with BERTopic, add methods as needed"

# Example
print(choose_method(
    "What themes emerge in vaccine discussions over time?",
    corpus_size=10000,
    text_type="twitter"
))
# Output: "BERTopic + temporal analysis"
```