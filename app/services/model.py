from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import logging

logger = logging.getLogger(__name__)

# Initialize variables
model = None
tokenizer = None

def load_model():
    global model, tokenizer
    try:
        # Load model and tokenizer
        model_name = "distilbert-base-uncased-finetuned-sst-2-english"
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForSequenceClassification.from_pretrained(model_name)
        model.eval()
        logger.info("Model loaded successfully")
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        raise

def get_model_and_tokenizer():
    if model is None or tokenizer is None:
        load_model()
    return model, tokenizer

# Define class names based on model's output
class_names = ['NEGATIVE', 'POSITIVE'] 