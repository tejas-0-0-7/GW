import requests
import json
from typing import List, Dict

BASE_URL = "http://127.0.0.1:8001/analyze"

# Test texts for different content types
test_texts = {
    "scientific_high": """
    According to a peer-reviewed study published in Nature, researchers at NASA have confirmed that 
    global temperatures have risen by 1.1°C since pre-industrial times. The study, which analyzed 
    data from multiple climate monitoring stations, found that this increase is primarily due to 
    human activities, particularly CO2 emissions. The findings are consistent with previous research 
    and have been verified by multiple independent teams.
    """,
    
    "scientific_moderate": """
    A new study suggests that regular exercise may help reduce the risk of heart disease. 
    The research, conducted over a 5-year period with 1,000 participants, found that those who 
    exercised at least 30 minutes daily had a 20% lower risk of cardiovascular problems. 
    However, the study authors note that more research is needed to confirm these findings.
    """,
    
    "weather_high": """
    The National Weather Service has issued a severe thunderstorm warning for the following counties: 
    Montgomery, Howard, and Anne Arundel. Radar indicates a line of strong thunderstorms moving 
    east at 35 mph. These storms may produce damaging winds up to 60 mph and quarter-sized hail. 
    Residents should seek shelter immediately.
    """,
    
    "weather_moderate": """
    Today's forecast calls for partly cloudy skies with a high of 75°F and a low of 60°F. 
    There's a 30% chance of scattered showers in the afternoon. Winds will be light, coming 
    from the southwest at 5-10 mph. The UV index is moderate, so sunscreen is recommended.
    """,
    
    "gossip_low": """
    BREAKING: You won't believe what happened at the celebrity party last night! 
    Sources say that two A-list stars were caught in a SHOCKING scandal that will 
    change everything! The details are absolutely mind-blowing! Stay tuned for more 
    exclusive details that will leave you speechless!
    """,
    
    "sensational_low": """
    AMAZING breakthrough! Scientists have discovered a revolutionary new diet that will 
    make you lose 20 pounds in just 3 days! This miracle cure has been kept secret by 
    the medical industry for decades. Just drink this special tea and watch the fat 
    melt away instantly! Experts hate this simple trick!
    """
}

# Test URLs for different content types
test_urls = {
    "scientific_high": "https://www.nature.com/articles/s41586-023-05775-5",
    "scientific_moderate": "https://www.sciencedaily.com/releases/2023/03/230315143827.htm",
    "weather_high": "https://www.weather.gov/",
    "weather_moderate": "https://www.weather.com/",
    "gossip_low": "https://www.tmz.com/",
    "sensational_low": "https://www.theonion.com/"
}

def test_text_endpoint(text: str, category: str):
    try:
        response = requests.post(
            f"{BASE_URL}/sentiment/text",
            json={"text": text}
        )
        result = response.json()
        print(f"\nTesting {category} text:")
        print(f"Credibility Score: {result.get('credibilityScore', 'N/A')}")
        print(f"Verdict: {result.get('verdict', 'N/A')}")
        print(f"Content Type: {result.get('contentType', 'N/A')}")
        print(f"Sentiment: {result.get('sentiment', 'N/A')}")
        print("Explanation:")
        for exp in result.get('explanation', []):
            print(f"- {exp}")
        print("-" * 50)
    except Exception as e:
        print(f"Error testing {category} text: {str(e)}")

def test_url_endpoint(url: str, category: str):
    try:
        # Add headers to mimic a browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.post(
            f"{BASE_URL}/sentiment/url",
            json={"url": url},
            headers=headers,
            timeout=30
        )
        
        result = response.json()
        print(f"\nTesting {category} URL: {url}")
        print(f"Credibility Score: {result.get('credibilityScore', 'N/A')}")
        print(f"Verdict: {result.get('verdict', 'N/A')}")
        print(f"Content Type: {result.get('contentType', 'N/A')}")
        print(f"Sentiment: {result.get('sentiment', 'N/A')}")
        print("Explanation:")
        for exp in result.get('explanation', []):
            print(f"- {exp}")
        print("-" * 50)
    except Exception as e:
        print(f"Error testing {category} URL: {str(e)}")

def main():
    print("Testing different types of texts...")
    for category, text in test_texts.items():
        test_text_endpoint(text, category)
        print("\n" + "="*80 + "\n")
    
    print("\nTesting different types of URLs...")
    for category, url in test_urls.items():
        test_url_endpoint(url, category)
        print("\n" + "="*80 + "\n")

if __name__ == "__main__":
    main() 