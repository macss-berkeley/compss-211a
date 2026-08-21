# Additional: Data Cleaning Cookbook for Text Analysis

## Introduction

Data cleaning is **THE MOST IMPORTANT** step in your NLP pipeline. This cookbook provides practical recipes for handling real-world messy text data. Each recipe includes the problem, the solution, and ready-to-use code.

**Time allocation**: Plan to spend 30-40% of your project time on data cleaning. It's not glamorous, but it's critical.

---

## Table of Contents

1. [Handling Missing Data](#1-handling-missing-data)
2. [Dealing with Emojis](#2-dealing-with-emojis)
3. [Cleaning URLs and Links](#3-cleaning-urls-and-links)
4. [Handling Special Characters](#4-handling-special-characters)
5. [Managing Text Length Issues](#5-managing-text-length-issues)
6. [Removing Duplicate Content](#6-removing-duplicate-content)
7. [Handling Different Encodings](#7-handling-different-encodings)
8. [Social Media Specific Cleaning](#8-social-media-specific-cleaning)
9. [Dealing with HTML and Markdown](#9-dealing-with-html-and-markdown)
10. [Normalizing Repeated Characters](#10-normalizing-repeated-characters)
11. [Complete Cleaning Pipelines](#11-complete-cleaning-pipelines)

---

## 1. Handling Missing Data

### Problem: NaN values, empty strings, placeholder text

```python
import pandas as pd
import numpy as np

# Check for missing data
def check_missing(df, text_column):
    """Comprehensive missing data check"""
    print(f"Total rows: {len(df)}")
    print(f"NaN values: {df[text_column].isna().sum()}")
    print(f"Empty strings: {(df[text_column] == '').sum()}")
    print(f"Whitespace only: {df[text_column].str.strip().eq('').sum()}")

    # Check for placeholder text
    placeholders = ['[deleted]', '[removed]', 'N/A', 'null', 'None', '--']
    for placeholder in placeholders:
        count = (df[text_column] == placeholder).sum()
        if count > 0:
            print(f"'{placeholder}' placeholders: {count}")

# Usage
check_missing(df, 'text_column')
```

### Solution: Remove or handle missing data

```python
def clean_missing_data(df, text_column, min_length=10):
    """Remove rows with missing or insufficient text"""
    initial_count = len(df)

    # Remove NaN
    df = df.dropna(subset=[text_column])

    # Convert to string and strip whitespace
    df[text_column] = df[text_column].astype(str).str.strip()

    # Remove common placeholders
    placeholders = ['[deleted]', '[removed]', 'N/A', 'null', 'None', '--', 'nan']
    df = df[~df[text_column].isin(placeholders)]

    # Remove too-short texts
    df = df[df[text_column].str.len() >= min_length]

    # Reset index
    df = df.reset_index(drop=True)

    removed = initial_count - len(df)
    print(f"Removed {removed} rows ({removed/initial_count*100:.1f}%)")
    print(f"Remaining: {len(df)} rows")

    return df

# Usage
df_clean = clean_missing_data(df, 'text_column', min_length=20)
```

---

## 2. Dealing with Emojis

### Problem: Emojis can break tokenizers or add noise

### Solution A: Remove emojis entirely

```python
import re

def remove_emojis(text):
    """Remove all emojis from text"""
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"  # emoticons
        "\U0001F300-\U0001F5FF"  # symbols & pictographs
        "\U0001F680-\U0001F6FF"  # transport & map symbols
        "\U0001F1E0-\U0001F1FF"  # flags (iOS)
        "\U00002702-\U000027B0"
        "\U000024C2-\U0001F251"
        "]+",
        flags=re.UNICODE
    )
    return emoji_pattern.sub(r'', text)

# Usage
df['text_clean'] = df['text'].apply(remove_emojis)
```

### Solution B: Convert emojis to text descriptions (better for sentiment analysis!)

```python
# pip install emoji
import emoji

def demojize_text(text):
    """Convert emojis to text descriptions"""
    return emoji.demojize(text, delimiters=(" ", " "))

# Examples
text = "I love this! 😍🎉"
print(demojize_text(text))
# Output: "I love this!  red_heart  party_popper "

# Usage
df['text_clean'] = df['text'].apply(demojize_text)
```

### Solution C: Keep only emojis (for emoji-based analysis)

```python
def extract_emojis(text):
    """Extract only emojis from text"""
    return ''.join(c for c in text if c in emoji.EMOJI_DATA)

# Usage
df['emojis'] = df['text'].apply(extract_emojis)
```

---

## 3. Cleaning URLs and Links

### Problem: URLs add noise and explode vocabulary

```python
def remove_urls(text):
    """Remove all types of URLs"""
    # Remove http(s) URLs
    text = re.sub(r'http\S+|www\.\S+', '', text)

    # Remove URLs without protocol
    text = re.sub(r'\w+\.(com|org|net|edu|gov|co\.uk|io|ai)\S*', '', text)

    # Remove remaining URL-like patterns
    text = re.sub(r'\S+\.(com|org|net|edu)', '', text)

    return text

# Usage
df['text_clean'] = df['text'].apply(remove_urls)
```

### Alternative: Replace with placeholder

```python
def replace_urls(text):
    """Replace URLs with [URL] placeholder"""
    text = re.sub(r'http\S+|www\.\S+', ' [URL] ', text)
    return text

# Usage (better for keeping sentence structure)
df['text_clean'] = df['text'].apply(replace_urls)
```

---

## 4. Handling Special Characters

### Problem: Special characters, symbols, and non-ASCII characters

```python
def remove_special_characters(text, keep_punctuation=True):
    """Remove special characters while optionally keeping punctuation"""
    if keep_punctuation:
        # Keep letters, numbers, and basic punctuation
        text = re.sub(r'[^a-zA-Z0-9\s.,!?;:\'\"-]', '', text)
    else:
        # Keep only letters, numbers, and spaces
        text = re.sub(r'[^a-zA-Z0-9\s]', '', text)

    return text

# Usage
df['text_clean'] = df['text'].apply(lambda x: remove_special_characters(x, keep_punctuation=True))
```

### Handling Accented Characters

```python
import unicodedata

def remove_accents(text):
    """Remove accents from text"""
    return ''.join(
        c for c in unicodedata.normalize('NFD', text)
        if unicodedata.category(c) != 'Mn'
    )

# Example
text = "café, résumé, naïve"
print(remove_accents(text))
# Output: "cafe, resume, naive"
```

---

## 5. Managing Text Length Issues

### Problem A: Very short texts (1-5 words)

```python
def filter_short_texts(df, text_column, min_words=5):
    """Remove texts with too few words"""
    df['word_count'] = df[text_column].str.split().str.len()

    print(f"Texts with < {min_words} words: {(df['word_count'] < min_words).sum()}")

    df_filtered = df[df['word_count'] >= min_words].copy()
    df_filtered = df_filtered.drop('word_count', axis=1)

    return df_filtered

# Usage
df_clean = filter_short_texts(df, 'text', min_words=10)
```

### Problem B: Very long texts (exceeding model limits)

```python
def truncate_long_texts(text, max_tokens=512, tokenizer=None):
    """Truncate texts exceeding maximum length"""
    if tokenizer:
        # Use model's tokenizer
        tokens = tokenizer.encode(text, add_special_tokens=False)
        if len(tokens) > max_tokens:
            tokens = tokens[:max_tokens]
            return tokenizer.decode(tokens)
        return text
    else:
        # Simple word-based truncation
        words = text.split()
        if len(words) > max_tokens:
            return ' '.join(words[:max_tokens])
        return text

# Usage with simple truncation
df['text_clean'] = df['text'].apply(lambda x: truncate_long_texts(x, max_tokens=512))

# Usage with BERT tokenizer
from transformers import AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
df['text_clean'] = df['text'].apply(lambda x: truncate_long_texts(x, max_tokens=512, tokenizer=tokenizer))
```

### Analyze text length distribution

```python
def analyze_text_lengths(df, text_column):
    """Visualize text length distribution"""
    import matplotlib.pyplot as plt

    df['text_length'] = df[text_column].str.len()
    df['word_count'] = df[text_column].str.split().str.len()

    fig, axes = plt.subplots(1, 2, figsize=(14, 5))

    # Character length distribution
    axes[0].hist(df['text_length'], bins=50, edgecolor='black')
    axes[0].set_xlabel('Character Length')
    axes[0].set_ylabel('Frequency')
    axes[0].set_title('Distribution of Text Length (Characters)')
    axes[0].axvline(df['text_length'].median(), color='red', linestyle='--', label='Median')
    axes[0].legend()

    # Word count distribution
    axes[1].hist(df['word_count'], bins=50, edgecolor='black')
    axes[1].set_xlabel('Word Count')
    axes[1].set_ylabel('Frequency')
    axes[1].set_title('Distribution of Text Length (Words)')
    axes[1].axvline(df['word_count'].median(), color='red', linestyle='--', label='Median')
    axes[1].legend()

    plt.tight_layout()
    plt.show()

    print(f"Character Length - Mean: {df['text_length'].mean():.0f}, Median: {df['text_length'].median():.0f}")
    print(f"Word Count - Mean: {df['word_count'].mean():.1f}, Median: {df['word_count'].median():.0f}")
    print(f"Min words: {df['word_count'].min()}, Max words: {df['word_count'].max()}")

# Usage
analyze_text_lengths(df, 'text')
```

---

## 6. Removing Duplicate Content

### Problem: Duplicate or near-duplicate texts

```python
def remove_exact_duplicates(df, text_column):
    """Remove exact duplicate texts"""
    initial_count = len(df)
    df_dedup = df.drop_duplicates(subset=[text_column], keep='first')
    removed = initial_count - len(df_dedup)

    print(f"Removed {removed} exact duplicates ({removed/initial_count*100:.1f}%)")
    return df_dedup

# Find near-duplicates using fuzzy matching
from difflib import SequenceMatcher

def find_near_duplicates(df, text_column, threshold=0.9, sample_size=None):
    """Find near-duplicate texts (WARNING: slow for large datasets)"""
    if sample_size and len(df) > sample_size:
        print(f"Sampling {sample_size} rows for speed...")
        df_sample = df.sample(sample_size, random_state=42)
    else:
        df_sample = df

    texts = df_sample[text_column].tolist()
    duplicates = []

    for i in range(len(texts)):
        for j in range(i+1, len(texts)):
            similarity = SequenceMatcher(None, texts[i], texts[j]).ratio()
            if similarity >= threshold:
                duplicates.append((i, j, similarity))

    print(f"Found {len(duplicates)} near-duplicate pairs (threshold: {threshold})")
    return duplicates

# Usage
df_clean = remove_exact_duplicates(df, 'text')
near_dups = find_near_duplicates(df_clean, 'text', threshold=0.85, sample_size=1000)
```

---

## 7. Handling Different Encodings

### Problem: Mixed encodings causing garbled text

```python
def fix_encoding(text):
    """Attempt to fix encoding issues"""
    if isinstance(text, bytes):
        # Try common encodings
        for encoding in ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']:
            try:
                return text.decode(encoding)
            except (UnicodeDecodeError, AttributeError):
                continue

    # Fix common encoding artifacts
    text = text.encode('latin-1').decode('utf-8', errors='ignore')

    return text

def clean_encoding_artifacts(text):
    """Remove common encoding artifacts"""
    # Remove null bytes
    text = text.replace('\x00', '')

    # Remove other control characters
    text = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', text)

    # Fix common smart quotes and dashes
    replacements = {
        '\u2018': "'",  # Left single quote
        '\u2019': "'",  # Right single quote
        '\u201c': '"',  # Left double quote
        '\u201d': '"',  # Right double quote
        '\u2013': '-',  # En dash
        '\u2014': '-',  # Em dash
        '\u2026': '...',  # Ellipsis
    }

    for old, new in replacements.items():
        text = text.replace(old, new)

    return text

# Usage
df['text_clean'] = df['text'].apply(clean_encoding_artifacts)
```

---

## 8. Social Media Specific Cleaning

### Reddit Specific

```python
def clean_reddit_text(text):
    """Clean Reddit-specific elements"""
    # Remove user mentions
    text = re.sub(r'/u/\w+|u/\w+', ' [USER] ', text)

    # Remove subreddit mentions
    text = re.sub(r'/r/\w+|r/\w+', ' [SUBREDDIT] ', text)

    # Remove markdown links [text](url)
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)

    # Remove quote markers
    text = re.sub(r'^&gt;.*$', '', text, flags=re.MULTILINE)

    # Remove edit markers
    text = re.sub(r'EDIT:.*$', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Edit \d+:.*$', '', text, flags=re.IGNORECASE | re.MULTILINE)

    return text

# Usage
df['text_clean'] = df['text'].apply(clean_reddit_text)
```

### Twitter/X Specific

```python
def clean_twitter_text(text):
    """Clean Twitter-specific elements"""
    # Remove @mentions (optionally replace with placeholder)
    text = re.sub(r'@\w+', ' [USER] ', text)

    # Remove or keep hashtags (your choice)
    # Option 1: Remove # but keep text
    text = re.sub(r'#(\w+)', r'\1', text)
    # Option 2: Remove hashtags entirely
    # text = re.sub(r'#\w+', '', text)

    # Remove RT (retweet) markers
    text = re.sub(r'\bRT\b', '', text, flags=re.IGNORECASE)

    # Handle repeated characters (looool -> lol)
    text = re.sub(r'(.)\1{2,}', r'\1\1', text)

    return text

# Usage
df['text_clean'] = df['text'].apply(clean_twitter_text)
```

---

## 9. Dealing with HTML and Markdown

```python
from bs4 import BeautifulSoup
import html

def remove_html(text):
    """Remove HTML tags and entities"""
    # Unescape HTML entities (&amp; -> &)
    text = html.unescape(text)

    # Remove HTML tags
    soup = BeautifulSoup(text, 'html.parser')
    text = soup.get_text(separator=' ')

    # Remove extra whitespace
    text = ' '.join(text.split())

    return text

def remove_markdown(text):
    """Remove Markdown formatting"""
    # Remove headers
    text = re.sub(r'#{1,6}\s', '', text)

    # Remove bold/italic markers
    text = re.sub(r'\*\*?([^*]+)\*\*?', r'\1', text)
    text = re.sub(r'__?([^_]+)__?', r'\1', text)

    # Remove links [text](url)
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)

    # Remove code blocks
    text = re.sub(r'```[^```]+```', '', text)
    text = re.sub(r'`([^`]+)`', r'\1', text)

    # Remove blockquotes
    text = re.sub(r'^>\s.*$', '', text, flags=re.MULTILINE)

    return text

# Usage
df['text_clean'] = df['text'].apply(remove_html).apply(remove_markdown)
```

---

## 10. Normalizing Repeated Characters

### Problem: "Sooooo goooood" and "Whaaaat?!?!?!?"

```python
def normalize_repetitions(text, max_repeats=2):
    """Reduce character repetitions to maximum length"""
    # Reduce repeated characters (looool -> lool or lol)
    pattern = r'(.)\1{' + str(max_repeats) + r',}'
    text = re.sub(pattern, r'\1' * max_repeats, text)

    return text

# Examples
texts = ["Sooooo goooood!!!", "Whaaaat?!?!?!?", "Yessssss"]
for text in texts:
    print(f"Original: {text}")
    print(f"max_repeats=1: {normalize_repetitions(text, max_repeats=1)}")
    print(f"max_repeats=2: {normalize_repetitions(text, max_repeats=2)}")
    print()

# Usage
df['text_clean'] = df['text'].apply(lambda x: normalize_repetitions(x, max_repeats=2))
```

---

## 11. Complete Cleaning Pipelines

### Basic Pipeline (for formal text)

```python
def basic_cleaning_pipeline(text):
    """Basic cleaning for formal text (news articles, papers)"""
    # Convert to lowercase
    text = text.lower()

    # Remove URLs
    text = re.sub(r'http\S+|www\.\S+', '', text)

    # Remove emails
    text = re.sub(r'\S+@\S+', '', text)

    # Remove extra whitespace
    text = ' '.join(text.split())

    # Remove special characters (keep basic punctuation)
    text = re.sub(r'[^a-z0-9\s.,!?;:\'\"-]', '', text)

    # Remove extra whitespace again
    text = ' '.join(text.split())

    return text.strip()

# Usage
df['text_clean'] = df['text'].apply(basic_cleaning_pipeline)
```

### Advanced Pipeline (for social media)

```python
def social_media_cleaning_pipeline(text, platform='reddit'):
    """Comprehensive cleaning for social media text"""
    # Fix encoding issues
    text = clean_encoding_artifacts(text)

    # Convert emojis to text
    text = demojize_text(text)

    # Platform-specific cleaning
    if platform == 'reddit':
        text = clean_reddit_text(text)
    elif platform == 'twitter':
        text = clean_twitter_text(text)

    # Remove URLs
    text = re.sub(r'http\S+|www\.\S+', ' [URL] ', text)

    # Remove HTML/Markdown
    text = remove_html(text)
    text = remove_markdown(text)

    # Normalize repeated characters
    text = normalize_repetitions(text, max_repeats=2)

    # Convert to lowercase
    text = text.lower()

    # Remove extra whitespace
    text = ' '.join(text.split())

    return text.strip()

# Usage
df['text_clean'] = df['text'].apply(lambda x: social_media_cleaning_pipeline(x, platform='reddit'))
```

### Customizable Pipeline (build your own)

```python
class TextCleaner:
    """Flexible text cleaning pipeline"""

    def __init__(self):
        self.steps = []

    def add_step(self, func, **kwargs):
        """Add a cleaning step"""
        self.steps.append((func, kwargs))
        return self

    def clean(self, text):
        """Apply all cleaning steps"""
        for func, kwargs in self.steps:
            text = func(text, **kwargs) if kwargs else func(text)
        return text

    def clean_dataframe(self, df, text_column, output_column='text_clean'):
        """Clean a dataframe column"""
        df[output_column] = df[text_column].apply(self.clean)
        return df

# Usage: Build a custom pipeline
cleaner = TextCleaner()
cleaner.add_step(clean_encoding_artifacts)
cleaner.add_step(demojize_text)
cleaner.add_step(clean_reddit_text)
cleaner.add_step(remove_urls)
cleaner.add_step(normalize_repetitions, max_repeats=2)
cleaner.add_step(str.lower)

# Apply to dataframe
df = cleaner.clean_dataframe(df, 'text', 'text_clean')

# Or apply to single text
cleaned_text = cleaner.clean("Some messy text here 😊")
```

---

## Validation: Check Your Cleaning

Always inspect your cleaning results!

```python
def validate_cleaning(df, original_column, cleaned_column, n_samples=10):
    """Compare original and cleaned texts"""
    print("="*80)
    print("CLEANING VALIDATION")
    print("="*80)

    # Random sample
    sample = df.sample(n_samples, random_state=42)

    for idx, row in sample.iterrows():
        print(f"\n--- Example {idx} ---")
        print(f"ORIGINAL ({len(row[original_column])} chars):")
        print(row[original_column][:200] + "..." if len(row[original_column]) > 200 else row[original_column])
        print(f"\nCLEANED ({len(row[cleaned_column])} chars):")
        print(row[cleaned_column][:200] + "..." if len(row[cleaned_column]) > 200 else row[cleaned_column])
        print("-"*80)

    # Statistics
    print("\n" + "="*80)
    print("STATISTICS")
    print("="*80)
    orig_lengths = df[original_column].str.len()
    clean_lengths = df[cleaned_column].str.len()

    print(f"Average length reduction: {orig_lengths.mean() - clean_lengths.mean():.1f} characters")
    print(f"Reduction percentage: {(1 - clean_lengths.mean()/orig_lengths.mean())*100:.1f}%")

    # Check for over-cleaning (texts that became too short)
    too_short = (clean_lengths < 10).sum()
    print(f"\nTexts that became very short (<10 chars): {too_short} ({too_short/len(df)*100:.1f}%)")

# Usage
validate_cleaning(df, 'text', 'text_clean', n_samples=5)
```

---

## Decision Guide: Which Cleaning Steps?

### Always Do:
- Handle missing data (NaN, empty strings)
- Fix encoding issues
- Remove extra whitespace
- Check text length distribution

### Usually Do:
- Remove or replace URLs
- Remove HTML/Markdown (if present)
- Normalize whitespace
- Convert to lowercase (for traditional NLP)

### Domain-Specific:
- **Social Media**: Handle @mentions, hashtags, user references
- **Product Reviews**: Handle ratings, HTML from web scraping
- **News Articles**: Minimal cleaning, preserve structure
- **Academic Text**: Very minimal cleaning

### Depends on Your Task:
- **Emojis**: Remove for traditional NLP, convert to text for sentiment analysis
- **Punctuation**: Remove for bag-of-words, keep for BERT/transformers
- **Case**: Lowercase for traditional NLP, keep for modern transformers
- **Stop words**: Remove for topic modeling, keep for classification
- **Repeated characters**: Normalize for formal analysis, keep for sentiment (intensity marker)

---

## Common Mistakes to Avoid

**Over-cleaning**: Removing so much that you lose meaningful information
- Example: Removing all punctuation loses question marks (important for sentiment!)

**Under-cleaning**: Not handling domain-specific issues
- Example: Not removing Reddit's [deleted] leaves noise in your data

**Not validating**: Blindly applying cleaning without checking results
- **Always inspect samples before and after cleaning!**

**One-size-fits-all**: Using the same pipeline for different tasks
- Topic modeling vs. sentiment analysis need different cleaning

**Cleaning after tokenization**: Clean your text BEFORE feeding to NLP models

**Ignoring text length**: Not checking if cleaning makes texts too short/long

---

## Pro Tips

**Save your raw data**: Always keep original text in a separate column

**Document your decisions**: Keep notes on why you chose certain cleaning steps

**Iterate**: Start with basic cleaning, analyze results, then refine

**Use functions**: Write reusable functions instead of one-off code

**Test on samples**: Validate cleaning on sample before applying to full dataset

**Consider your model**: Modern transformers (BERT, GPT) need less aggressive cleaning

💡*Check class balance**: After cleaning, ensure you still have balanced classes (if doing classification)

---

**Remember**: There's no perfect cleaning recipe. The best approach depends on:
1. Your data source (Reddit vs. news vs. reviews)
2. Your research question (classification vs. topic modeling vs. sentiment)
3. Your model choice (traditional NLP vs. transformers)

**When in doubt**: Start conservative (light cleaning) and increase as needed!

---

**Last Updated:** Week 8, 2025
**For Help:** Bring examples to office hours!
