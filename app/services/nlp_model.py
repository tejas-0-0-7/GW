from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import logging
from app.services.explainability import explain_prediction
import re

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

model_name = "distilbert-base-uncased-finetuned-sst-2-english"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

def detect_linguistic_tone(text: str) -> list:
    """Detect various linguistic features in the text."""
    features = []
    
    # Emotional language patterns
    emotional_patterns = [
        (r'\b(amazing|incredible|wonderful|terrible|horrible|awful)\b', "Emotionally charged language"),
        (r'\b(always|never|everyone|nobody)\b', "Absolute statements"),
        (r'\b(must|should|have to|need to)\b', "Prescriptive language"),
        (r'\b(proven|scientific|fact|truth)\b', "Authority claims"),
        (r'!{2,}', "Multiple exclamation marks"),
        (r'\b(urgent|breaking|shocking|exclusive)\b', "Sensational language")
    ]
    
    for pattern, description in emotional_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            features.append(description)
    
    return features

def analyze_sentiment(text: str) -> dict:
    try:
        logger.info(f"Analyzing sentiment for text: {text[:100]}...")
        
        # Tokenize and get model predictions
        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        outputs = model(**inputs)
        
        # Get prediction probabilities
        probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
        
        # Get the predicted class and its probability
        predicted_class = torch.argmax(probs).item()
        confidence = probs[0][predicted_class].item()
        
        # Map class index to label
        sentiment = "POSITIVE" if predicted_class == 1 else "NEGATIVE"
        
        # Normalize score to range [-1, 1]
        norm_score = confidence if sentiment == "POSITIVE" else -confidence
        
        # Get LIME explanation
        lime_explanation, lime_html = explain_prediction(text)
        
        # Detect linguistic features
        linguistic_features = detect_linguistic_tone(text)
        
        # Calculate credibility score based on various factors
        credibility_score = calculate_credibility_score(text, confidence, linguistic_features)
        
        # Determine verdict based on credibility score
        verdict = determine_verdict(credibility_score)
        
        logger.info(f"Analysis complete. Sentiment: {sentiment}, Score: {confidence}")
        return {
            "sentiment": sentiment,
            "confidence": confidence,
            "normalized_score": norm_score,
            "credibility_score": credibility_score,
            "verdict": verdict,
            "linguistic_features": linguistic_features,
            "explanation": lime_explanation,
            "explanation_html": lime_html
        }
    except Exception as e:
        logger.error(f"Error in sentiment analysis: {str(e)}")
        raise

def calculate_credibility_score(text: str, confidence: float, features: list) -> float:
    """Calculate a credibility score based on various factors."""
    base_score = confidence
    
    # Adjust score based on linguistic features
    feature_weights = {
        "Emotionally charged language": -0.1,
        "Absolute statements": -0.15,
        "Prescriptive language": -0.1,
        "Authority claims": -0.1,
        "Multiple exclamation marks": -0.05,
        "Sensational language": -0.15
    }
    
    for feature in features:
        if feature in feature_weights:
            base_score += feature_weights[feature]
    
    # Ensure score is between 0 and 1
    return max(0.0, min(1.0, base_score))

def determine_verdict(credibility_score: float) -> str:
    """Determine the verdict based on credibility score."""
    if credibility_score >= 0.8:
        return "Highly Credible"
    elif credibility_score >= 0.6:
        return "Credible"
    elif credibility_score >= 0.4:
        return "Neutral"
    elif credibility_score >= 0.2:
        return "Suspicious"
    else:
        return "Highly Suspicious"
