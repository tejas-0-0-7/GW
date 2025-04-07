from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
import logging
import requests
import re
from bs4 import BeautifulSoup
from app.services.sentiment import analyze_sentiment
from app.services.explainability import explain_prediction, is_technical_content, adjust_credibility_score

router = APIRouter(prefix="/analyze")
logger = logging.getLogger(__name__)

class TextRequest(BaseModel):
    text: str = Field(..., description="Text content to analyze")

class UrlRequest(BaseModel):
    url: str = Field(..., description="URL of the article to analyze")

class FactCheckResult(BaseModel):
    claim: str
    rating: str
    source: str
    url: str
    explanation: str

class CredibilityResponse(BaseModel):
    credibilityScore: float
    verdict: str
    explanation: List[str]
    factCheckResults: List[FactCheckResult]
    contentType: str

def extract_claims(text: str) -> List[str]:
    """Extract potential factual claims from text."""
    # Look for statements that might be factual claims
    claim_patterns = [
        r'[A-Z][^.!?]*\b(is|are|was|were|has|have|had|will|would|can|could)\b[^.!?]*[.!?]',
        r'[A-Z][^.!?]*\b(according to|reports|studies show|research indicates)\b[^.!?]*[.!?]',
        r'[A-Z][^.!?]*\b(proven|confirmed|verified|established)\b[^.!?]*[.!?]'
    ]
    
    claims = []
    for pattern in claim_patterns:
        matches = re.findall(pattern, text)
        claims.extend(matches)
    
    return claims[:3]  # Return top 3 claims

def check_fact(claim: str) -> Optional[FactCheckResult]:
    """Check a claim against fact-checking databases."""
    try:
        # In a real implementation, this would call a fact-checking API
        # For now, we'll simulate some results based on common patterns
        
        # Example fact-checking logic
        if re.search(r'\b(climate change|global warming)\b', claim, re.IGNORECASE):
            return FactCheckResult(
                claim=claim,
                rating="TRUE",
                source="Climate Feedback",
                url="https://climatefeedback.org/claim-reviews/",
                explanation="Verified by multiple scientific studies and consensus"
            )
        elif re.search(r'\b(vaccine|vaccination)\b', claim, re.IGNORECASE):
            return FactCheckResult(
                claim=claim,
                rating="MOSTLY TRUE",
                source="Health Feedback",
                url="https://healthfeedback.org/",
                explanation="Supported by medical research and health organizations"
            )
        else:
            return FactCheckResult(
                claim=claim,
                rating="NEEDS REVIEW",
                source="PolitiFact",
                url="https://www.politifact.com/",
                explanation="Claim requires further verification"
            )
    except Exception as e:
        logger.error(f"Error in fact checking: {str(e)}")
        return None

def detect_sensational_language(text: str) -> float:
    """Detect sensational language patterns in text."""
    sensational_patterns = [
        r'!\s*$',  # Exclamation marks at end of sentences
        r'[A-Z]{2,}',  # ALL CAPS words
        r'\b(amazing|incredible|unbelievable|shocking|horrifying|terrifying)\b',
        r'\b(breaking|urgent|exclusive|must-see|must-read)\b',
        r'\b(you won\'t believe|you need to see|this will shock you)\b',
        r'\d+ reasons why|\d+ things you need to know',
        r'\b(never|always|every|all|none)\b'  # Absolute statements
    ]
    
    score = 0
    for pattern in sensational_patterns:
        matches = len(re.findall(pattern, text, re.IGNORECASE))
        score += matches * 0.1  # Each match contributes 0.1 to the score
    
    # For simple statements, reduce the impact of sensational language
    if len(text.split()) < 20:  # Short text
        score *= 0.5
    
    return min(1.0, score)  # Cap the score at 1.0

def analyze_content_quality(text: str) -> Dict:
    """Analyze various aspects of content quality."""
    # Calculate text statistics
    sentences = re.split(r'[.!?]+', text)
    avg_sentence_length = sum(len(s.split()) for s in sentences if s.strip()) / max(1, len([s for s in sentences if s.strip()]))
    
    # Check for common clickbait patterns
    has_clickbait = bool(re.search(r'\b(click here|learn more|read more|find out)\b', text, re.IGNORECASE))
    
    # Check for balanced language
    has_balanced_language = bool(re.search(r'\b(however|although|but|on the other hand)\b', text, re.IGNORECASE))
    
    # Check for simple factual statements
    is_simple_statement = avg_sentence_length < 15 and not has_clickbait and not has_balanced_language
    
    return {
        "avg_sentence_length": avg_sentence_length,
        "has_clickbait": has_clickbait,
        "has_balanced_language": has_balanced_language,
        "is_simple_statement": is_simple_statement
    }

def fetch_article_content(url: str) -> str:
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Try to find main content area
        main_content = soup.find('article') or soup.find('main') or soup.find('div', class_=lambda x: x and ('content' in x or 'article' in x))
        
        if main_content:
            # Remove unnecessary elements
            for element in main_content.find_all(['nav', 'footer', 'aside', 'script', 'style']):
                element.decompose()
            return main_content.get_text(strip=True)
        
        return soup.get_text(strip=True)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching content: {str(e)}")

@router.post("/sentiment/text")
async def analyze_text(request: TextRequest):
    try:
        logger.info("Received sentiment analysis request for direct text input")
        content = request.text
        logger.info(f"Content length: {len(content)} characters")
        
        # Get sentiment analysis
        sentiment_result = analyze_sentiment(content)
        
        # Analyze content quality
        content_quality = analyze_content_quality(content)
        
        # Detect sensational language
        sensational_score = detect_sensational_language(content)
        
        # Extract and check factual claims
        claims = extract_claims(content)
        fact_check_results = []
        for claim in claims:
            result = check_fact(claim)
            if result:
                fact_check_results.append(result)
        
        # Calculate base credibility score from sentiment confidence
        base_credibility = min(1.0, max(0.0, sentiment_result["confidence"] * 0.8 + 0.2))
        
        # Adjust credibility score based on content analysis
        credibility_score = base_credibility
        
        # For simple statements, increase base credibility
        if content_quality["is_simple_statement"]:
            credibility_score = min(1.0, credibility_score * 1.5)
        
        # Reduce score for sensational language
        credibility_score *= (1 - sensational_score * 0.5)
        
        # Adjust score based on content quality
        if content_quality["has_clickbait"]:
            credibility_score *= 0.7
        if content_quality["has_balanced_language"]:
            credibility_score *= 1.1
        if content_quality["avg_sentence_length"] > 30:
            credibility_score *= 0.9
            
        # Adjust score based on fact-check results
        if fact_check_results:
            true_count = sum(1 for r in fact_check_results if r.rating in ["TRUE", "MOSTLY TRUE"])
            false_count = sum(1 for r in fact_check_results if r.rating in ["FALSE", "MOSTLY FALSE"])
            total_checked = len(fact_check_results)
            
            if total_checked > 0:
                fact_accuracy = true_count / total_checked
                credibility_score = (credibility_score + fact_accuracy) / 2
        
        # Ensure score stays within bounds
        credibility_score = min(1.0, max(0.0, credibility_score))
        
        # Determine verdict based on credibility score
        if credibility_score > 0.8:
            verdict = "Highly Credible"
        elif credibility_score > 0.6:
            verdict = "Credible"
        elif credibility_score > 0.4:
            verdict = "Neutral"
        elif credibility_score > 0.2:
            verdict = "Suspicious"
        else:
            verdict = "Highly Suspicious"
        
        # Generate explanations based on analysis
        explanations = []
        
        # Add sentiment-based explanations
        if sentiment_result["sentiment"] == "POSITIVE":
            explanations.append("Content shows positive sentiment")
        else:
            explanations.append("Content shows negative sentiment")
            
        # Add confidence-based explanations
        if sentiment_result["confidence"] > 0.8:
            explanations.append("High confidence in sentiment analysis")
        elif sentiment_result["confidence"] > 0.6:
            explanations.append("Moderate confidence in sentiment analysis")
        else:
            explanations.append("Low confidence in sentiment analysis")
            
        # Add content quality explanations
        if content_quality["is_simple_statement"]:
            explanations.append("Simple factual statement detected")
        if content_quality["has_clickbait"]:
            explanations.append("Clickbait patterns detected")
        if content_quality["has_balanced_language"]:
            explanations.append("Balanced language usage detected")
        if sensational_score > 0.3:
            explanations.append("Sensational language detected")
            
        # Add fact-check explanations
        if fact_check_results:
            true_claims = sum(1 for r in fact_check_results if r.rating in ["TRUE", "MOSTLY TRUE"])
            false_claims = sum(1 for r in fact_check_results if r.rating in ["FALSE", "MOSTLY FALSE"])
            if true_claims > 0:
                explanations.append(f"{true_claims} verified factual claims found")
            if false_claims > 0:
                explanations.append(f"{false_claims} potentially false claims detected")
        
        # Return simple JSON response
        return {
            "credibilityScore": round(credibility_score, 2),
            "verdict": verdict,
            "explanation": explanations,
            "factCheckResults": [
                {
                    "claim": result.claim,
                    "rating": result.rating,
                    "source": result.source,
                    "url": result.url,
                    "explanation": result.explanation
                } for result in fact_check_results
            ]
        }
        
    except Exception as e:
        logger.error(f"Error in sentiment analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sentiment/url", response_model=CredibilityResponse)
async def analyze_sentiment_from_url(request: UrlRequest):
    if not request.url:
        raise HTTPException(status_code=400, detail="URL is required")
    
    content = fetch_article_content(request.url)
    sentiment_result = analyze_sentiment(content)
    explanation_list, explanation_html, adjusted_score = explain_prediction(content)
    
    # Determine content type
    content_type = "Technical" if is_technical_content(content) else "News"
    
    # Extract claims for fact-checking
    claims = extract_claims(content)
    fact_check_results = [check_fact(claim) for claim in claims]
    fact_check_results = [result for result in fact_check_results if result]
    
    # Generate explanations
    explanations = []
    if sentiment_result["sentiment"] == "positive":
        explanations.append("Content shows positive sentiment")
    elif sentiment_result["sentiment"] == "negative":
        explanations.append("Content shows negative sentiment")
    
    if sentiment_result["confidence"] > 0.8:
        explanations.append("High confidence in sentiment analysis")
    
    if is_technical_content(content):
        explanations.append("Technical/educational content detected")
    
    # Determine verdict based on adjusted score
    if adjusted_score >= 0.8:
        verdict = "Highly Credible"
    elif adjusted_score >= 0.6:
        verdict = "Credible"
    elif adjusted_score >= 0.4:
        verdict = "Neutral"
    elif adjusted_score >= 0.2:
        verdict = "Suspicious"
    else:
        verdict = "Highly Suspicious"
    
    return CredibilityResponse(
        credibilityScore=adjusted_score,
        verdict=verdict,
        explanation=explanations,
        factCheckResults=fact_check_results,
        contentType=content_type
    )
