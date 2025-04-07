import lime
import lime.lime_text
from .model import model, tokenizer, class_names
import torch
import numpy as np
import re

def predict_proba(texts):
    """Predict probabilities for LIME explanation."""
    if isinstance(texts, str):
        texts = [texts]
    
    inputs = tokenizer(texts, return_tensors='pt', padding=True, truncation=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
    return probs.numpy()

def is_technical_content(text: str) -> bool:
    """Check if content is technical/educational in nature."""
    technical_indicators = [
        r'code|programming|tutorial|guide|how to|step by step|example|implementation',
        r'api|framework|library|dependency|configuration|architecture|design pattern',
        r'best practices|performance|optimization|scalability|security|testing',
        r'medium\.com|dev\.to|github\.com|stackoverflow\.com'
    ]
    text_lower = text.lower()
    return any(re.search(pattern, text_lower) for pattern in technical_indicators)

def adjust_credibility_score(score: float, text: str) -> float:
    """Adjust credibility score based on content type."""
    if is_technical_content(text):
        # Boost score for technical content
        return min(1.0, score + 0.3)
    return score

def explain_prediction(text: str):
    """Generate LIME explanation for the text."""
    explainer = lime.lime_text.LimeTextExplainer(class_names=class_names)
    explanation = explainer.explain_instance(
        text, 
        predict_proba, 
        num_features=10,
        num_samples=1000
    )
    
    # Convert explanation list to dictionary format
    explanation_list = [{"word": word, "weight": float(weight)} for word, weight in explanation.as_list()]
    
    # Generate HTML explanation
    explanation_html = explanation.as_html()
    
    # Adjust credibility score based on content type
    base_score = explanation.score
    adjusted_score = adjust_credibility_score(base_score, text)
    
    return explanation_list, explanation_html, adjusted_score
