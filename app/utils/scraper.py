# app/utils/scraper.py

from newspaper import Article
import validators

def is_valid_url(input_str: str) -> bool:
    return validators.url(input_str)

def scrape_article(url: str) -> dict:
    try:
        article = Article(url)
        article.download()
        article.parse()
        return {
            "title": article.title,
            "text": article.text
        }
    except Exception as e:
        return {
            "error": f"Failed to scrape article: {str(e)}"
        }

def process_input(input_str: str) -> dict:
    """
    Main entry function. If input is a URL, scrape it.
    If it's plain text, return it.
    """
    if is_valid_url(input_str):
        return scrape_article(input_str)
    return {"title": "User Input", "text": input_str}
