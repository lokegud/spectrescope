// SpectreScope Background Service Worker - Minimal Version
console.log('SpectreScope background starting...');

let backgroundScanEnabled = true;

// Install handler
self.addEventListener('install', (event) => {
    console.log('Service worker installing...');
    self.skipWaiting();
});

// Activate handler
self.addEventListener('activate', (event) => {
    console.log('Service worker activating...');
    event.waitUntil(self.clients.claim());
});

// Extension installed listener
chrome.runtime.onInstalled.addListener((details) => {
    console.log('Extension installed:', details.reason);

    // Create context menu
    if (chrome.contextMenus) {
        try {
            chrome.contextMenus.create({
                id: "spectreScope-analyze",
                title: "Analyze with SpectreScope",
                contexts: ["image", "selection", "link"]
            });
            console.log('Context menu created');
        } catch (e) {
            console.log('Context menu creation failed:', e.message);
        }
    }

    // Initialize storage
    chrome.storage.sync.get('backgroundScanEnabled', (data) => {
        if (data.backgroundScanEnabled === undefined) {
            chrome.storage.sync.set({ backgroundScanEnabled: true });
        }
    });
});

// Load settings
chrome.storage.sync.get('backgroundScanEnabled', (data) => {
    backgroundScanEnabled = data.backgroundScanEnabled !== false;
    console.log('Background scan enabled:', backgroundScanEnabled);
});

// Message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request.action);

    if (request.action === "toggleBackgroundScan") {
        backgroundScanEnabled = request.enabled;
        sendResponse({ status: "ok" });
        return true;
    }

    if (request.action === "pageLoaded") {
        console.log('Page loaded:', request.title);
        sendResponse({ status: "received" });
        return true;
    }

    if (request.action === "patternFound") {
        notifyFinding({
            type: "Pattern",
            message: `${request.patternType}: ${request.value}`,
            source: request.url
        });
        sendResponse({ status: "received" });
        return true;
    }

    if (request.action === "newFinding") {
        // Forward to popup if open
        sendResponse({ status: "received" });
        return true;
    }

    sendResponse({ status: "received" });
    return true;
});

// Context menu handler (only if API is available)
if (chrome.contextMenus) {
    chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "spectreScope-analyze") {
        let message = "";

        if (info.mediaType === "image") {
            message = `Image: ${info.srcUrl}`;
            notifyFinding({
                type: "Steganography",
                message: "Image selected for analysis",
                source: info.srcUrl
            });
        } else if (info.selectionText) {
            message = `Text: ${info.selectionText.substring(0, 50)}...`;
            notifyFinding({
                type: "Pattern",
                message: "Text selected for analysis",
                source: tab.url
            });
        } else if (info.linkUrl) {
            message = `Link: ${info.linkUrl}`;
            notifyFinding({
                type: "OSINT",
                message: "Link selected for analysis",
                source: info.linkUrl
            });
        }

        console.log('Context menu clicked:', message);
    }
    });
} else {
    console.log('Context menus API not available');
}

// Notify function
function notifyFinding(finding) {
    // Try to send to popup
    chrome.runtime.sendMessage({
        action: "newFinding",
        finding: finding
    }).catch(() => {
        console.log('Popup not open');
    });

    // Update badge
    chrome.action.getBadgeText({}).then(text => {
        const count = parseInt(text || '0') + 1;
        chrome.action.setBadgeText({ text: count.toString() });
        chrome.action.setBadgeBackgroundColor({ color: '#e06c75' });
    }).catch(err => console.log('Badge error:', err));
}

console.log('SpectreScope background initialized');
