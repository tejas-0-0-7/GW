// Create context menu item
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "analyzeText",
        title: "Analyze selected text",
        contexts: ["selection"]
    });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "analyzeText" && info.selectionText) {
        // Store the selected text
        chrome.storage.local.set({ selectedText: info.selectionText }, () => {
            // Open the popup
            chrome.windows.create({
                url: chrome.runtime.getURL("popup.html"),
                type: "popup",
                width: 450,
                height: 600
            });
        });
    }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateContextMenu") {
        // No need to manually update context menu visibility
        // Chrome handles this automatically for selection contexts
    }
});
