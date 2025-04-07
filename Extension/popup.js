document.addEventListener("DOMContentLoaded", () => {
    const checkBtn = document.getElementById("check-btn");
    const textInput = document.getElementById("text-input");
    const loadingDiv = document.getElementById("loading");
    const errorDiv = document.getElementById("error");
    const analysisResult = document.getElementById("analysis-result");
    
    const BASE_URL = "http://localhost:8000";
    const API_URL = `${BASE_URL}/analyze/sentiment/text`;
    
    // Check for stored selected text first
    chrome.storage.local.get(['selectedText'], function(result) {
        if (result.selectedText) {
            textInput.value = result.selectedText;
            // Clear the storage after retrieving
            chrome.storage.local.remove('selectedText');
        } else {
            // If no stored text, try getting selected text from the active tab
            getCurrentTabSelectedText();
        }
    });
    
    function getCurrentTabSelectedText() {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            if (tabs[0]?.id) {
                try {
                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        { action: "getSelectedText" },
                        (response) => {
                            if (chrome.runtime.lastError) {
                                console.log("Could not establish connection with content script");
                                return;
                            }
                            if (response?.text) {
                                textInput.value = response.text;
                            }
                        }
                    );
                } catch (error) {
                    console.log("Error getting selected text:", error);
                }
            }
        });
    }
    
    function showLoading(show) {
        loadingDiv.style.display = show ? "block" : "none";
        checkBtn.disabled = show;
        if (show) {
            errorDiv.style.display = "none";
            analysisResult.style.display = "none";
        }
    }
    
    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = "block";
        analysisResult.style.display = "none";
    }
    
    function getScoreClass(score) {
        if (score >= 0.7) return "score-high";
        if (score >= 0.4) return "score-medium";
        return "score-low";
    }
    
    function displayResults(data) {
        analysisResult.style.display = "block";
        
        // Display Credibility Score
        const scoreElement = document.getElementById("credibility-score");
        const score = data.credibilityScore;
        scoreElement.innerHTML = `
            <strong>Credibility Score:</strong>
            <span class="score-badge ${getScoreClass(score)}">${(score * 100).toFixed(0)}%</span>
        `;
        
        // Display Verdict
        document.getElementById("verdict").innerHTML = `
            <strong>Verdict:</strong> ${data.verdict}
        `;
        
        // Display Content Type
        document.getElementById("content-type").innerHTML = `
            <strong>Content Type:</strong> ${data.contentType}
        `;
        
        // Display Sentiment
        const sentimentConf = (data.sentimentConfidence * 100).toFixed(0);
        document.getElementById("sentiment").innerHTML = `
            <strong>Sentiment:</strong> ${data.sentiment} (${sentimentConf}% confidence)
        `;
        
        // Display Explanations
        const explanationList = document.getElementById("explanation-list");
        explanationList.innerHTML = data.explanation
            .map(exp => `<li class="explanation-item">${exp}</li>`)
            .join("");
        
        // Display Fact Check Results
        const factChecksDiv = document.getElementById("fact-checks");
        if (data.factCheckResults && data.factCheckResults.length > 0) {
            const factChecksHtml = data.factCheckResults
                .map(fact => `
                    <div class="fact-check">
                        <strong>Claim:</strong> ${fact.claim}<br>
                        <strong>Rating:</strong> ${fact.rating}<br>
                        <strong>Source:</strong> <a href="${fact.url}" target="_blank">${fact.source}</a><br>
                        <em>${fact.explanation}</em>
                    </div>
                `)
                .join("<hr>");
            factChecksDiv.innerHTML = `<h3>Fact Checks:</h3>${factChecksHtml}`;
        } else {
            factChecksDiv.innerHTML = "";
        }

        // Update the website link with the analysis ID if available
        const footerLink = document.querySelector('.website-link');
        if (data.id) {
            footerLink.href = `${BASE_URL}/analysis/${data.id}`;
            footerLink.textContent = "View Detailed Analysis on Website →";
        } else {
            footerLink.href = `${BASE_URL}`;
            footerLink.textContent = "Analyze More Content on Website →";
        }
    }
    
    async function analyzeText(text) {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: text })
            });
            
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }
            
            const data = await response.json();
            displayResults(data);
        } catch (error) {
            showError(`Error: ${error.message}. Make sure the backend server is running.`);
        } finally {
            showLoading(false);
        }
    }
    
    checkBtn.addEventListener("click", async () => {
        const inputText = textInput.value.trim();
        
        if (!inputText) {
            showError("Please enter some text to analyze.");
            return;
        }
        
        showLoading(true);
        await analyzeText(inputText);
    });
});
  