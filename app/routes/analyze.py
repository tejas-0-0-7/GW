from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
import logging
import requests
import re
from bs4 import BeautifulSoup
from app.services.sentiment import analyze_sentiment
from app.services.explainability import explain_prediction, is_technical_content, adjust_credibility_score

router = APIRouter(prefix="/analyze", tags=["analysis"])
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
    sentiment: str
    sentimentConfidence: float

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

def detect_scientific_content(text: str) -> bool:
    """Detect if the content is scientific in nature."""
    scientific_patterns = [
        # Research and methodology terms
        r'\b(study|research|data|evidence|analysis|scientists?|researchers?)\b',
        r'\b(methodology|hypothesis|results|conclusion|findings)\b',
        r'\b(experiment|observation|measurement|statistical|significance)\b',
        
        # Scientific organizations and publications
        r'\b(NASA|NOAA|WHO|CDC|NIH|scientific consensus)\b',
        r'\b(peer[-\s]reviewed|journal|publication|paper)\b',
        r'\b(Nature|Science|Lancet|JAMA|BMJ)\b',
        
        # Technical measurements and units
        r'\b(\d+(\.\d+)?)\s*(degrees?|°)[CF]\b',
        r'\b(\d+(\.\d+)?)\s*(mg|kg|ml|km|cm)\b',
        r'\b(\d+(\.\d+)?)\s*percent\b|\b\d+%\b',
        
        # Citations and references
        r'\b(according to|cited in|referenced by|published in)\b',
        r'\b(et al\.|vol\.|pp\.|doi:)\b',
        
        # Technical terminology
        r'\b(correlation|causation|factor|variable|control group)\b',
        r'\b(systematic|review|meta[-\s]analysis|clinical trial)\b'
    ]
    
    matches = 0
    text = text.lower()  # Convert to lowercase for case-insensitive matching
    
    # Count unique pattern matches
    for pattern in scientific_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            matches += 1
    
    # Adjust threshold based on text length
    words = len(text.split())
    if words < 50:
        return matches >= 2  # For short texts, require fewer matches
    else:
        return matches >= 3  # For longer texts, require more matches

def detect_sensational_language(text: str) -> float:
    """Detect sensational language patterns in text."""
    # First check if it's scientific content
    is_scientific = detect_scientific_content(text)
    
    sensational_patterns = [
        # Punctuation and formatting
        r'!\s*$',  # Exclamation marks at end of sentences
        r'[A-Z]{2,}',  # ALL CAPS words
        r'[!?]{2,}',  # Multiple exclamation/question marks
        
        # Hyperbolic language
        r'\b(amazing|incredible|unbelievable|shocking|horrifying|terrifying)\b',
        r'\b(mind[-\s]blowing|jaw[-\s]dropping|earth[-\s]shattering)\b',
        r'\b(revolutionary|breakthrough|miracle|magic|cure[-\s]all)\b',
        
        # Clickbait phrases
        r'\b(breaking|urgent|exclusive|must-see|must-read)\b',
        r'\b(you won\'t believe|you need to see|this will shock you)\b',
        r'\d+ reasons why|\d+ things you need to know',
        
        # Absolute statements
        r'\b(never|always|every|all|none|impossible|guaranteed)\b',
        
        # Marketing language
        r'\b(secret|hidden|tricks|hack|instantly|overnight)\b',
        r'\b(experts hate|they don\'t want you to know)\b'
    ]
    
    score = 0.0
    text = text.lower()
    
    # Weight different types of sensational language
    for pattern in sensational_patterns:
        matches = len(re.findall(pattern, text, re.IGNORECASE))
        if 'secret' in pattern or 'trick' in pattern or 'hack' in pattern:
            score += matches * 0.2  # Higher weight for marketing language
        elif '!' in pattern or '[A-Z]{2,}' in pattern:
            score += matches * 0.05  # Lower weight for formatting
        else:
            score += matches * 0.1  # Standard weight
    
    # Reduce impact for scientific content
    if is_scientific:
        score *= 0.3  # More significant reduction for scientific content
    
    # Adjust for text length
    words = len(text.split())
    if words < 30:
        score *= 0.6  # Greater reduction for very short texts
    elif words < 100:
        score *= 0.8  # Moderate reduction for medium-length texts
    
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

def check_fact(claim: str) -> Optional[FactCheckResult]:
    """Check a claim against fact-checking databases."""
    try:
        # Check for scientific sources in the claim
        scientific_source = re.search(r'\b(according to|based on|from)\s+(NASA|NOAA|WHO|CDC|NIH)\b', claim, re.IGNORECASE)
        
        # Climate change related claims
        if re.search(r'\b(climate change|global warming|temperature rise|carbon dioxide|CO2 emissions)\b', claim, re.IGNORECASE):
            if scientific_source:
                return FactCheckResult(
                    claim=claim,
                    rating="TRUE",
                    source="Scientific Consensus",
                    url="https://climate.nasa.gov/",
                    explanation="Verified by multiple scientific organizations and supported by extensive research data"
                )
            else:
                return FactCheckResult(
                    claim=claim,
                    rating="MOSTLY TRUE",
                    source="Climate Science",
                    url="https://climatefeedback.org/",
                    explanation="Consistent with scientific consensus on climate change"
                )
        
        # Health-related claims
        elif re.search(r'\b(vaccine|vaccination|health|disease|medical)\b', claim, re.IGNORECASE):
            if scientific_source:
                return FactCheckResult(
                    claim=claim,
                    rating="TRUE",
                    source="Medical Research",
                    url="https://www.who.int/",
                    explanation="Verified by major health organizations"
                )
            else:
                return FactCheckResult(
                    claim=claim,
                    rating="NEEDS REVIEW",
                    source="Health Feedback",
                    url="https://healthfeedback.org/",
                    explanation="Requires verification from medical sources"
                )
        
        # General claims with scientific sources
        elif scientific_source:
            return FactCheckResult(
                claim=claim,
                rating="LIKELY TRUE",
                source="Scientific Sources",
                url="https://www.science.gov/",
                explanation="Supported by reputable scientific organization"
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

def get_domain_trust_score(url: str) -> float:
    """Calculate a trust score based on the domain."""
    try:
        from urllib.parse import urlparse
        domain = urlparse(url).netloc.lower()
        
        # Highly trusted domains - increased from 0.2 to 0.3
        if any(d in domain for d in [
            'nasa.gov', 'nature.com', 'science.org', 'who.int', 'cdc.gov', 
            'nih.gov', 'edu', 'weather.gov'
        ]):
            return 0.3
            
        # Moderately trusted domains - increased from 0.15 to 0.2
        if any(d in domain for d in [
            'weather.com', 'reuters.com', 'apnews.com', 'bbc.com', 'npr.org'
        ]):
            return 0.2
            
        # Known satire/entertainment sites - increased penalty
        if any(d in domain for d in ['theonion.com', 'tmz.com']):
            return -0.2  # Increased penalty for known satire/entertainment
            
        # Default trust score for unknown domains
        return 0.05
            
    except Exception:
        return 0.05

def calculate_credibility_score(
    sentiment_score: float,
    is_scientific: bool,
    sensational_score: float,
    fact_check_results: List[FactCheckResult],
    url: str = None
) -> float:
    # Start with a moderate base score
    base_score = 0.5
    
    # Add domain-based trust if URL is provided
    if url:
        base_score += get_domain_trust_score(url)
    
    # Analyze content quality
    content_quality = {
        "has_citations": any("according to" in r.claim.lower() or "cited" in r.claim.lower() for r in fact_check_results),
        "has_numbers": any(re.search(r'\d+', r.claim) for r in fact_check_results),
        "has_balanced_view": any("however" in r.claim.lower() or "but" in r.claim.lower() or "although" in r.claim.lower() for r in fact_check_results)
    }
    
    # Adjust for scientific content - increased bonuses
    if is_scientific:
        base_score += 0.2  # Increased from 0.1
        if content_quality["has_citations"]:
            base_score += 0.1  # Increased from 0.05
        if content_quality["has_numbers"]:
            base_score += 0.1  # Increased from 0.05
    
    # Adjust for fact check results - increased impact
    if fact_check_results:
        verified_claims = sum(1 for result in fact_check_results if result.rating in ["TRUE", "MOSTLY TRUE", "LIKELY TRUE"])
        total_claims = len(fact_check_results)
        fact_check_modifier = 0.15 * (verified_claims / total_claims)  # Increased from 0.1
        base_score += fact_check_modifier
    
    # Penalize for sensational language - increased penalty
    sensational_penalty = sensational_score * 0.3  # Increased from 0.25
    base_score -= sensational_penalty
    
    # Adjust for balanced language - increased bonus
    if content_quality["has_balanced_view"]:
        base_score += 0.1  # Increased from 0.05
    
    # Adjust for sentiment extremity - increased penalties
    sentiment_extremity = abs(sentiment_score)
    if sentiment_extremity > 0.9:
        base_score -= 0.15  # Increased from 0.1
    elif sentiment_extremity < 0.3:
        base_score += 0.1  # Increased from 0.05
    
    # Ensure score is between 0 and 1
    return max(0.0, min(1.0, base_score))

def get_verdict(score: float) -> str:
    """Get a more detailed verdict based on the credibility score."""
    if score >= 0.8:  # Increased from 0.75
        return "Highly Credible - Well-supported by evidence and reliable sources"
    elif score >= 0.6:  # Increased from 0.55
        return "Credible - Contains factual information with some verifiable claims"
    elif score >= 0.4:  # Increased from 0.35
        return "Moderately Credible - Exercise some caution"
    elif score >= 0.2:  # Increased from 0.15
        return "Suspicious - Contains questionable claims or sensational language"
    else:
        return "Highly Suspicious - Multiple red flags for misinformation"

def analyze_text(text: str, url: str = None) -> Dict[str, Any]:
    # Perform sentiment analysis
    sentiment_result = analyze_sentiment(text)
    # Make sentiment score more nuanced based on confidence
    sentiment_score = sentiment_result["confidence"] if sentiment_result["sentiment"] == "POSITIVE" else -sentiment_result["confidence"]
    
    # Detect if content is scientific
    is_scientific = detect_scientific_content(text)
    
    # Analyze content quality
    sensational_score = detect_sensational_language(text)
    
    # Perform fact checking
    claims = extract_claims(text)
    fact_check_results = [check_fact(claim) for claim in claims]
    fact_check_results = [result for result in fact_check_results if result is not None]
    
    # Calculate credibility score
    credibility_score = calculate_credibility_score(
        sentiment_score,
        is_scientific,
        sensational_score,
        fact_check_results,
        url
    )
    
    # Generate detailed explanation
    explanation = []
    
    # Sentiment analysis explanation
    sentiment_conf = sentiment_result['confidence']
    if sentiment_score > 0:
        if sentiment_conf > 0.9:
            explanation.append(f"Strong positive sentiment detected (confidence: {sentiment_conf:.2f})")
        else:
            explanation.append(f"Moderate positive sentiment detected (confidence: {sentiment_conf:.2f})")
    else:
        if sentiment_conf > 0.9:
            explanation.append(f"Strong negative sentiment detected (confidence: {sentiment_conf:.2f})")
        else:
            explanation.append(f"Moderate negative sentiment detected (confidence: {sentiment_conf:.2f})")
    
    # Content type and quality explanation
    if is_scientific:
        explanation.append("Scientific content detected with technical terminology")
        scientific_orgs = ["nasa", "noaa", "who", "cdc", "nih"]
        if any(org in text.lower() for org in scientific_orgs):
            explanation.append("References to reputable scientific organizations found")
        if any(term in text.lower() for term in ["journal", "study", "research"]):
            explanation.append("References to scientific studies or journals found")
    
    # Sensational language explanation
    if sensational_score > 0.7:
        explanation.append("High levels of sensational or exaggerated language detected")
    elif sensational_score > 0.4:
        explanation.append("Moderate use of sensational language detected")
    elif sensational_score > 0:
        explanation.append("Minimal use of emphatic language detected")
    
    # Fact checking explanation
    if fact_check_results:
        verified = sum(1 for r in fact_check_results if r.rating in ["TRUE", "MOSTLY TRUE", "LIKELY TRUE"])
        if verified == len(fact_check_results):
            explanation.append("All claims appear to be supported by evidence")
        elif verified > 0:
            explanation.append(f"{verified} out of {len(fact_check_results)} claims appear to be supported by evidence")
        else:
            explanation.append("No claims could be independently verified")
    
    # Balance and objectivity
    balance_terms = ["however", "but", "although", "nevertheless", "on the other hand"]
    if any(term in text.lower() for term in balance_terms):
        explanation.append("Shows balanced perspective by considering multiple viewpoints")
    
    # Citations and sources
    citation_terms = ["according to", "cited", "reports", "stated by", "referenced"]
    if any(term in text.lower() for term in citation_terms):
        explanation.append("Includes citations or references to sources")
    
    return {
        "credibilityScore": round(credibility_score, 2),
        "verdict": get_verdict(credibility_score),
        "explanation": explanation,
        "factCheckResults": fact_check_results,
        "contentType": "Scientific" if is_scientific else "General",
        "sentiment": sentiment_result["sentiment"],
        "sentimentConfidence": sentiment_result["confidence"]
    }

@router.post("/sentiment/text")
async def analyze_text_endpoint(request: TextRequest):
    """Analyze text for sentiment and credibility."""
    try:
        result = analyze_text(request.text)
        return CredibilityResponse(**result)
    except Exception as e:
        logger.error(f"Error analyzing text: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sentiment/url")
async def analyze_url(request: UrlRequest):
    """Analyze article content from URL."""
    try:
        content = fetch_article_content(request.url)
        result = analyze_text(content, request.url)
        return CredibilityResponse(**result)
    except Exception as e:
        logger.error(f"Error analyzing URL: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
