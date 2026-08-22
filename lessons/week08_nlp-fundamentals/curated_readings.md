# Week 8 readings and references

## Before class

1. **Dan Jurafsky and James H. Martin, _Speech and Language Processing_, "Text Processing."** Read the short sections on words, corpora, tokenization, and normalization. Focus on the choices a tokenizer makes rather than implementation details.  
   https://web.stanford.edu/~jurafsky/slp3/

2. **Scikit-learn, "Extracting features from text."** Read the introductory bag-of-words and TF-IDF sections. You do not need to reproduce all of the code.  
   https://scikit-learn.org/stable/modules/feature_extraction.html#text-feature-extraction

## Keep open during class and homework

- **Scikit-learn `CountVectorizer` reference:** parameters including `lowercase`, `token_pattern`, `stop_words`, `ngram_range`, and `min_df`.  
  https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.CountVectorizer.html

- **Scikit-learn `TfidfVectorizer` reference:** the fitted vocabulary, IDF weighting, and transformation of new documents.  
  https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html

## Optional historical context

- **Hutto and Gilbert (2014), "VADER: A Parsimonious Rule-based Model for Sentiment Analysis of Social Media Text."** Use this as an example of a carefully designed lexicon-and-rules approach, not as evidence that sentiment or sarcasm is solved.  
  https://ojs.aaai.org/index.php/ICWSM/article/view/14550

The lecture's main question is not "Which cleaning recipe is standard?" It is "Which evidence does this decision preserve, change, or erase for this research question?"
