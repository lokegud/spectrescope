document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const enableBackgroundScanToggle = document.getElementById('enableBackgroundScan');
    const findingsList = document.getElementById('findingsList');
    const customRegexInput = document.getElementById('customRegexInput');
    const patternTypeSelect = document.getElementById('patternType');

    // --- Tab Switching Logic ---
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            tabPanes.forEach(pane => pane.classList.remove('active'));
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });

    // --- Background Scan Toggle Logic ---
    chrome.storage.sync.get('backgroundScanEnabled', (data) => {
        enableBackgroundScanToggle.checked = data.backgroundScanEnabled !== false;
        chrome.runtime.sendMessage({
            action: "toggleBackgroundScan",
            enabled: enableBackgroundScanToggle.checked
        });
    });

    enableBackgroundScanToggle.addEventListener('change', () => {
        const isEnabled = enableBackgroundScanToggle.checked;
        chrome.storage.sync.set({ backgroundScanEnabled: isEnabled }, () => {
            console.log('Background scan enabled:', isEnabled);
            chrome.runtime.sendMessage({
                action: "toggleBackgroundScan",
                enabled: isEnabled
            });
        });
    });

    // --- Custom Regex Input Visibility ---
    patternTypeSelect.addEventListener('change', () => {
        customRegexInput.style.display = patternTypeSelect.value === 'custom' ? 'block' : 'none';
    });

    // --- Display findings ---
    function displayFinding(finding) {
        const findingElement = document.createElement('div');
        findingElement.classList.add('finding-item');
        findingElement.innerHTML = `
            <p><strong>${finding.type}:</strong> ${finding.message}</p>
            <small>${finding.source}</small>
            ${finding.action ? `<button data-action="${finding.action}" data-payload="${encodeURIComponent(finding.payload || '')}">Investigate</button>` : ''}
        `;

        if (findingsList.querySelector('.no-findings')) {
            findingsList.innerHTML = '';
        }
        findingsList.prepend(findingElement);
    }

    // --- Steganography Features ---
    document.getElementById('stegoFileInput').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            document.getElementById('stegoResults').textContent = 'File loaded: ' + file.name;
            chrome.storage.local.set({ currentStegoFile: await fileToBase64(file) });
        }
    });

    document.getElementById('stegoAnalyzeUrlBtn').addEventListener('click', async () => {
        const url = document.getElementById('stegoUrlInput').value;
        if (url) {
            document.getElementById('stegoResults').textContent = 'Analyzing URL...';
            const result = await SteganographyUtils.analyzeImageURL(url);
            document.getElementById('stegoResults').textContent = JSON.stringify(result, null, 2);
        }
    });

    document.getElementById('analyzeLSB').addEventListener('click', async () => {
        const fileInput = document.getElementById('stegoFileInput');
        if (fileInput.files[0]) {
            document.getElementById('stegoResults').textContent = 'Analyzing LSB...';
            const result = await SteganographyUtils.analyzeLSB(fileInput.files[0]);
            document.getElementById('stegoResults').textContent = JSON.stringify(result, null, 2);
        } else {
            document.getElementById('stegoResults').textContent = 'Please select a file first';
        }
    });

    document.getElementById('extractMetadata').addEventListener('click', async () => {
        const fileInput = document.getElementById('stegoFileInput');
        if (fileInput.files[0]) {
            document.getElementById('stegoResults').textContent = 'Extracting metadata...';
            const metadata = await SteganographyUtils.extractMetadata(fileInput.files[0]);
            const sizeRatio = await metadata.sizeRatio;
            document.getElementById('stegoResults').textContent = JSON.stringify({ ...metadata, sizeRatio }, null, 2);
        } else {
            document.getElementById('stegoResults').textContent = 'Please select a file first';
        }
    });

    document.getElementById('viewExifData').addEventListener('click', async () => {
        const fileInput = document.getElementById('stegoFileInput');
        if (fileInput.files[0]) {
            document.getElementById('stegoResults').textContent = 'Extracting EXIF data...';
            const exifData = await SteganographyUtils.extractEXIF(fileInput.files[0]);
            document.getElementById('stegoResults').textContent = JSON.stringify(exifData, null, 2);
        } else {
            document.getElementById('stegoResults').textContent = 'Please select a file first';
        }
    });

    // --- OSINT Features ---
    document.getElementById('osintSearchBtn').addEventListener('click', () => {
        const query = document.getElementById('osintQuery').value;
        if (query) {
            const results = {
                query: query,
                type: detectQueryType(query),
                timestamp: new Date().toLocaleString()
            };
            document.getElementById('osintResults').textContent = JSON.stringify(results, null, 2);
        }
    });

    document.querySelectorAll('.osint-quick-links button').forEach(button => {
        button.addEventListener('click', (e) => {
            const service = e.target.dataset.service;
            const query = document.getElementById('osintQuery').value;
            if (query) {
                const urls = {
                    whois: `https://www.whois.com/whois/${query}`,
                    virustotal: `https://www.virustotal.com/gui/search/${query}`,
                    shodan: `https://www.shodan.io/search?query=${query}`,
                    hibp: `https://haveibeenpwned.com/account/${query}`
                };
                chrome.tabs.create({ url: urls[service] });
                document.getElementById('osintResults').textContent = `Opened ${service} for: ${query}`;
            } else {
                document.getElementById('osintResults').textContent = 'Please enter a query first';
            }
        });
    });

    // --- Code Analysis Features ---
    document.getElementById('inspectPageSource').addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => document.documentElement.outerHTML
        }, (results) => {
            if (results && results[0]) {
                document.getElementById('codeEditor').value = results[0].result;
                document.getElementById('codeResults').textContent = 'Page source loaded successfully';
            }
        });
    });

    document.getElementById('beautifyCode').addEventListener('click', () => {
        const code = document.getElementById('codeEditor').value;
        if (code) {
            const beautified = CodeAnalysisUtils.beautify(code);
            document.getElementById('codeEditor').value = beautified;
            document.getElementById('codeResults').textContent = 'Code beautified successfully';
        }
    });

    document.getElementById('scanCode').addEventListener('click', () => {
        const code = document.getElementById('codeEditor').value;
        if (code) {
            const vulnerabilities = CodeAnalysisUtils.scanVulnerabilities(code);
            const obfuscation = CodeAnalysisUtils.detectObfuscation(code);
            const libraries = CodeAnalysisUtils.identifyLibraries(code);
            const complexity = CodeAnalysisUtils.calculateComplexity(code);

            const results = {
                vulnerabilities: vulnerabilities,
                obfuscation: obfuscation,
                libraries: libraries,
                complexity: complexity
            };

            document.getElementById('codeResults').textContent = JSON.stringify(results, null, 2);
        }
    });

    // --- Cipher Decryption Features ---
    document.getElementById('decodeBtn').addEventListener('click', () => {
        const inputText = document.getElementById('cipherInput').value;
        const cipherType = document.getElementById('cipherType').value;
        const cipherKey = document.getElementById('cipherKey').value;

        if (inputText) {
            let result;

            if (cipherType === 'auto') {
                const detected = CipherUtils.autoDetect(inputText);
                result = detected.length > 0 ? detected : [{ type: 'Unknown', decoded: 'Could not detect cipher type' }];
            } else {
                const decoders = {
                    'base64': () => CipherUtils.decodeBase64(inputText),
                    'hex': () => CipherUtils.decodeHex(inputText),
                    'url': () => CipherUtils.decodeURL(inputText),
                    'rot13': () => CipherUtils.decodeROT13(inputText),
                    'caesar': () => CipherUtils.decodeCaesar(inputText, cipherKey || 3),
                    'atbash': () => CipherUtils.decodeAtbash(inputText),
                    'xor': () => CipherUtils.decodeXOR(inputText, cipherKey)
                };

                const decoded = decoders[cipherType] ? decoders[cipherType]() : 'Unknown cipher type';
                result = [{ type: cipherType, decoded: decoded || 'Decoding failed' }];
            }

            document.getElementById('cipherOutput').textContent = JSON.stringify(result, null, 2);
        }
    });

    // --- Pattern Recognition Features ---
    document.getElementById('scanPatternsBtn').addEventListener('click', () => {
        const inputText = document.getElementById('patternInput').value;
        const patternType = document.getElementById('patternType').value;

        if (inputText) {
            let results;

            if (patternType === 'custom') {
                const customRegex = document.getElementById('customRegexInput').value;
                results = PatternUtils.scanCustom(inputText, customRegex);
            } else {
                results = PatternUtils.scan(inputText, patternType);
            }

            const entropy = PatternUtils.calculateEntropy(inputText);
            const output = {
                patternType: patternType,
                matches: results,
                matchCount: Array.isArray(results) ? results.length : 0,
                textEntropy: entropy
            };

            document.getElementById('patternResults').textContent = JSON.stringify(output, null, 2);
        }
    });

    // --- Message Listener from Background Script ---
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "newFinding") {
            displayFinding(request.finding);
            chrome.action.getBadgeText({}, (text) => {
                const currentCount = parseInt(text || '0', 10);
                chrome.action.setBadgeText({ text: (currentCount + 1).toString() });
            });
        }
        sendResponse({ status: "received" });
    });

    // --- Helper Functions ---
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function detectQueryType(query) {
        if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(query)) {
            return 'email';
        } else if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(query)) {
            return 'IP address';
        } else if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(query)) {
            return 'domain';
        } else {
            return 'username';
        }
    }
});
