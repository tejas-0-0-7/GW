from .model import get_model_and_tokenizer
import torch
import logging

logger = logging.getLogger(__name__)

def analyze_sentiment(text: str) -> dict:
    """Analyze sentiment of the given text."""
    try:
        # Get model and tokenizer
        model, tokenizer = get_model_and_tokenizer()
        
        # Tokenize input
        inputs = tokenizer(text, return_tensors='pt', padding=True, truncation=True, max_length=512)
        
        # Get model predictions
        with torch.no_grad():
            outputs = model(**inputs)
            probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
        
        # Get predicted class and confidence
        predicted_class = torch.argmax(probs, dim=-1).item()
        confidence = probs[0][predicted_class].item()
        
        # Map class to sentiment
        sentiment = "POSITIVE" if predicted_class == 1 else "NEGATIVE"
        
        return {
            "sentiment": sentiment,
            "confidence": confidence
        }
    except Exception as e:
        logger.error(f"Error in sentiment analysis: {str(e)}")
        raise 