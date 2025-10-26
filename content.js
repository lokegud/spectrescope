console.log("SpectreScope content script loaded on:", window.location.href);

// Send page loaded message to background
chrome.runtime.sendMessage({
    action: "pageLoaded",
    url: window.location.href,
    title: document.title
});

// Configuration for what to scan
const scanConfig = {
    patterns: true,
    images: true,
    scripts: true,
    osint: true
};

// Pattern scanning on page load
function scanPageForPatterns() {
    const bodyText = document.body.innerText;

    // Email patterns
    const emails = bodyText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g);
    if (emails && emails.length > 0) {
        console.log('Emails found:', emails);
        chrome.runtime.sendMessage({
            action: "patternFound",
            patternType: "Email",
            value: `${emails.length} email(s)`,
            url: window.location.href
        });
    }

    // IP address patterns
    const ips = bodyText.match(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g);
    if (ips && ips.length > 0) {
        console.log('IPs found:', ips);
        chrome.runtime.sendMessage({
            action: "patternFound",
            patternType: "IP Address",
            value: `${ips.length} IP(s)`,
            url: window.location.href
        });
    }

    // Hash patterns (MD5, SHA1, SHA256)
    const hashes = bodyText.match(/\b[a-fA-F0-9]{32,64}\b/g);
    if (hashes && hashes.length > 0) {
        console.log('Hashes found:', hashes);
        chrome.runtime.sendMessage({
            action: "patternFound",
            patternType: "Hash",
            value: `${hashes.length} hash(es)`,
            url: window.location.href
        });
    }

    // API key patterns
    const apiKeys = bodyText.match(/AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|sk_live_[0-9a-zA-Z]{24}/g);
    if (apiKeys && apiKeys.length > 0) {
        console.log('API keys found (potential security issue!):', apiKeys);
        chrome.runtime.sendMessage({
            action: "patternFound",
            patternType: "API Key (Critical)",
            value: `${apiKeys.length} exposed key(s)`,
            url: window.location.href
        });
    }
}

// Image analysis
function scanPageForImages() {
    const images = document.querySelectorAll('img');
    let suspiciousImages = 0;

    images.forEach(img => {
        // Check for data URLs (could hide encoded data)
        if (img.src.startsWith('data:')) {
            suspiciousImages++;
            console.log('Data URL image found:', img.src.substring(0, 50));
        }

        // Check for very large images (potential steganography)
        if (img.naturalWidth * img.naturalHeight > 4000000) { // > 4 megapixels
            suspiciousImages++;
            console.log('Large image found:', img.src);
        }
    });

    if (suspiciousImages > 0) {
        chrome.runtime.sendMessage({
            action: "patternFound",
            patternType: "Suspicious Images",
            value: `${suspiciousImages} image(s) for analysis`,
            url: window.location.href
        });
    }
}

// Script analysis
function scanPageForScripts() {
    const scripts = document.querySelectorAll('script');
    let suspiciousScripts = 0;

    scripts.forEach(script => {
        if (script.src) {
            // Check for suspicious script URLs
            const suspiciousKeywords = ['eval', 'obfuscate', 'crypto', 'miner'];
            if (suspiciousKeywords.some(keyword => script.src.toLowerCase().includes(keyword))) {
                suspiciousScripts++;
                chrome.runtime.sendMessage({
                    action: "suspiciousScript",
                    scriptUrl: script.src,
                    url: window.location.href
                });
            }
        } else if (script.textContent) {
            // Check inline scripts for eval or other dangerous functions
            if (/\beval\s*\(/g.test(script.textContent)) {
                suspiciousScripts++;
                console.log('Inline script with eval() found');
            }
        }
    });
}

// OSINT data extraction
function extractOSINTData() {
    const data = {
        domain: window.location.hostname,
        cookies: document.cookie ? document.cookie.split(';').length : 0,
        localStorage: localStorage.length,
        sessionStorage: sessionStorage.length,
        externalLinks: [],
        forms: document.querySelectorAll('form').length
    };

    // Extract external links
    const links = document.querySelectorAll('a[href^="http"]');
    const externalDomains = new Set();
    links.forEach(link => {
        try {
            const url = new URL(link.href);
            if (url.hostname !== window.location.hostname) {
                externalDomains.add(url.hostname);
            }
        } catch (e) {
            // Invalid URL
        }
    });
    data.externalLinks = Array.from(externalDomains);

    console.log('OSINT data extracted:', data);
    return data;
}

// Run scans based on configuration
if (scanConfig.patterns) {
    setTimeout(scanPageForPatterns, 1000);
}

if (scanConfig.images) {
    setTimeout(scanPageForImages, 2000);
}

if (scanConfig.scripts) {
    setTimeout(scanPageForScripts, 1500);
}

if (scanConfig.osint) {
    setTimeout(() => {
        const osintData = extractOSINTData();
        if (osintData.externalLinks.length > 20) {
            chrome.runtime.sendMessage({
                action: "patternFound",
                patternType: "OSINT",
                value: `${osintData.externalLinks.length} external domains detected`,
                url: window.location.href
            });
        }
    }, 2500);
}

// Observe DOM changes for dynamic content
const observer = new MutationObserver((mutations) => {
    // Debounce to avoid too many scans
    clearTimeout(window.spectreScopeObserverTimeout);
    window.spectreScopeObserverTimeout = setTimeout(() => {
        console.log('DOM changed, rescanning...');
        if (scanConfig.patterns) scanPageForPatterns();
    }, 3000);
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log('SpectreScope content script initialization complete');
