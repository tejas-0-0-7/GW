import os
import requests
from dotenv import load_dotenv

load_dotenv()

FACT_CHECK_API_URL = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
API_KEY = os.getenv("FACT_CHECK_API_KEY")


def query_fact_check(text: str, language_code: str = "en") -> dict:
    if not API_KEY:
        raise ValueError("Google Fact Check API key not set in .env file")

    params = {
        "query": text,
        "languageCode": language_code,
        "key": API_KEY
    }

    try:
        response = requests.get(FACT_CHECK_API_URL, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()
        return data
    except requests.RequestException as e:
        print(f"[FactCheckAPI Error] {e}")
        return {"claims": []}
