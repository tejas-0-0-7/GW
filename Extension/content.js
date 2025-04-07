console.log("[Content Script] Loaded");

// Keep track of the last selection
let lastSelection = '';

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("[Content Script] Received message:", request);

  if (request.action === "getSelectedText") {
    // Get selected text from the page
    const selectedText = window.getSelection().toString().trim();
    // If no current selection, return the last selection
    sendResponse({ text: selectedText || lastSelection });
  }
  return true;  // Required for async response
});

// Track text selection
document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    lastSelection = selectedText;
  }
});

// Track selection changes
document.addEventListener('selectionchange', () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    lastSelection = selectedText;
  }
});

// Add right-click context menu functionality
document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    chrome.runtime.sendMessage({
      action: "updateContextMenu",
      hasSelection: true
    });
  }
});
