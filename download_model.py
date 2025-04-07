from transformers import AutoTokenizer, AutoModelForSequenceClassification

print("Downloading model and tokenizer...")
model_name = "distilbert-base-uncased-finetuned-sst-2-english"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)
print("Model and tokenizer downloaded successfully!") 