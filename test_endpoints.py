import requests
import json
from requests.exceptions import RequestException
import time

BASE_URL = "http://127.0.0.1:8001/analyze"

# Test URLs for different content types
test_urls = {
    "truth": "https://www.nasa.gov/news-release/nasa-confirms-dart-mission-impact-changed-asteroids-motion-in-space/",
    "fake": "https://www.theonion.com/",
    "scientific": "https://www.nature.com/articles/s41586-023-05775-5",
    "gossip": "https://www.tmz.com/",
    "weather": "https://www.weather.com/",
    "sentimental": "https://www.goodnewsnetwork.org/"
}

def test_url_endpoint(url, category):
    try:
        # Add headers to mimic a browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # First try to fetch the URL to check if it's accessible
        try:
            requests.get(url, headers=headers, timeout=10)
        except RequestException as e:
            print(f"\nWarning: Could not access {category} URL: {url}")
            print(f"Error: {str(e)}")
            return

        # Now test the endpoint
        response = requests.post(
            f"{BASE_URL}/sentiment/url",
            json={"url": url},
            headers=headers,
            timeout=30
        )
        
        if response.status_code != 200:
            print(f"\nError testing {category} URL: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            return
            
        result = response.json()
        print(f"\nTesting {category} URL: {url}")
        print(f"Credibility Score: {result.get('credibilityScore', 'N/A')}")
        print(f"Verdict: {result.get('verdict', 'N/A')}")
        print(f"Content Type: {result.get('contentType', 'N/A')}")
        print(f"Sentiment: {result.get('sentiment', 'N/A')}")
        print("-" * 50)
        
    except Exception as e:
        print(f"Error testing {category} URL: {str(e)}")

def main():
    print("Testing different types of URLs...")
    for category, url in test_urls.items():
        test_url_endpoint(url, category)
        time.sleep(2)  # Add delay between requests

if __name__ == "__main__":
    main() 