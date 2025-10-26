# SpectreScope Feature Documentation

Complete guide to all features and capabilities of the SpectreScope extension.

## Table of Contents
1. [Dashboard & Auto-Discovery](#dashboard--auto-discovery)
2. [Steganography Analysis](#steganography-analysis)
3. [Pattern Recognition](#pattern-recognition)
4. [Cipher Decryption](#cipher-decryption)
5. [Code Investigation](#code-investigation)
6. [OSINT Exploration](#osint-exploration)

---

## Dashboard & Auto-Discovery

### Background Scanning
**Toggle**: Enable/Disable real-time page scanning
- Monitors all network requests
- Analyzes images, scripts, and XHR requests
- Displays findings in real-time
- Badge counter shows new discoveries

### Auto-Detection Capabilities
- **Images**: Large files, data URLs, suspicious sizes
- **Scripts**: eval() usage, obfuscated code, minified files
- **Patterns**: API keys, emails, IPs, hashes in page content
- **OSINT**: External domains, tracking scripts, analytics

### Findings Display
- Type-categorized findings (Steganography, Code, Pattern, OSINT)
- Source URL for each finding
- "Investigate" buttons for quick analysis
- Real-time updates as you browse

---

## Steganography Analysis

### Supported Operations

#### 1. LSB (Least Significant Bit) Analysis
**What it does**: Extracts hidden data from image files
- Analyzes RGB channel LSBs
- Converts binary data to readable text
- Calculates entropy to detect randomness
- Identifies suspicious embedding patterns

**How to use**:
1. Upload an image file or provide URL
2. Click "Analyze LSB"
3. Review extracted text and entropy metrics

**Output**:
```json
{
  "width": 1920,
  "height": 1080,
  "pixelCount": 2073600,
  "lsbEntropy": 0.9876,
  "extractedText": "Hidden message here",
  "suspiciousLSB": true
}
```

#### 2. Metadata Extraction
**What it does**: Analyzes file properties and embedded metadata
- File name, size, type
- Last modified timestamp
- Size ratio analysis (detects abnormally large files)

**How to use**:
1. Upload an image file
2. Click "Extract Metadata"
3. Review file properties

#### 3. EXIF Data Extraction
**What it does**: Extracts camera and location metadata
- Camera make/model
- GPS coordinates
- Date/time taken
- Software used

**Note**: Full EXIF extraction requires external library. Current implementation detects EXIF presence.

#### 4. URL Analysis
**What it does**: Fetches and analyzes remote images
- Downloads image from URL
- Performs LSB analysis
- Checks size anomalies

---

## Pattern Recognition

### Supported Pattern Types

#### 1. Email Addresses
**Regex**: `[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}`
- Finds all email addresses in text
- Deduplicates results
- Works with any email format

#### 2. IP Addresses (IPv4)
**Regex**: `(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)`
- Validates IP address format
- Supports all valid IPv4 addresses

#### 3. URLs
**Regex**: `https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)`
- HTTP and HTTPS URLs
- Includes query parameters and fragments

#### 4. Hashes
**Types detected**:
- **MD5**: 32 hex characters (`[a-fA-F0-9]{32}`)
- **SHA1**: 40 hex characters (`[a-fA-F0-9]{40}`)
- **SHA256**: 64 hex characters (`[a-fA-F0-9]{64}`)

#### 5. API Keys
**Patterns detected**:
- **AWS Access Key**: `AKIA[0-9A-Z]{16}`
- **Google API Key**: `AIza[0-9A-Za-z_-]{35}`
- **Stripe Live Key**: `sk_live_[0-9a-zA-Z]{24}`
- **Stripe Test Key**: `sk_test_[0-9a-zA-Z]{24}`
- **GitHub Token**: `ghp_[0-9a-zA-Z]{36}`
- **GitHub OAuth**: `gho_[0-9a-zA-Z]{36}`

#### 6. Additional Patterns
- Phone numbers (various formats)
- Social Security Numbers (SSN)
- Credit card numbers
- Bitcoin addresses
- JWT tokens

#### 7. Custom Regex
- Enter any regex pattern
- Real-time matching
- Error handling for invalid patterns

### Entropy Calculation
Measures randomness of text:
- **0-1 range**: Higher = more random
- **Use cases**: Detect encoded data, compression, encryption
- **Formula**: Shannon entropy

---

## Cipher Decryption

### Auto-Detection Mode
Tries multiple cipher types automatically:
- Base64
- Hex encoding
- URL encoding
- ROT13
- Caesar cipher (all 25 shifts)
- Atbash

**Intelligence**: Filters results to show only readable text using common word analysis.

### Supported Ciphers

#### 1. Base64
**Description**: Standard Base64 encoding
- Detects valid Base64 patterns
- Handles padding (=)
- Returns decoded text or null

#### 2. Hexadecimal
**Description**: Hex string to ASCII
- Strips non-hex characters
- Converts 2-character hex pairs to ASCII

#### 3. URL Encoding
**Description**: Percent-encoded strings
- Decodes %XX sequences
- Handles special characters

#### 4. ROT13
**Description**: Caesar cipher with shift 13
- Substitution cipher
- Self-inverse (decode = encode)
- Preserves case

#### 5. Caesar Cipher
**Description**: Letter shift cipher
- Configurable shift value (1-25)
- Preserves non-alphabetic characters
- Case-sensitive

#### 6. Atbash Cipher
**Description**: Hebrew cipher (A↔Z, B↔Y, etc.)
- Simple substitution
- Self-inverse
- Case-preserving

#### 7. XOR Cipher
**Description**: Bitwise XOR with key
- Requires key input
- Repeating-key XOR
- Works with any text

---

## Code Investigation

### Features

#### 1. Page Source Inspection
- Fetches current tab's HTML
- Includes inline scripts
- Preserves formatting

#### 2. JavaScript Beautification
**Algorithm**: Simple indentation-based formatter
- Adds proper line breaks
- Indents nested blocks
- Makes minified code readable

**Limitations**: Not as advanced as js-beautify library, but functional for basic needs.

#### 3. Vulnerability Scanning

**Checks performed**:

| Vulnerability | Severity | Description |
|---------------|----------|-------------|
| `eval()` usage | HIGH | Code execution risk |
| `innerHTML` assignment | MEDIUM | XSS vulnerability |
| `document.write()` | MEDIUM | Security/performance issues |
| Hardcoded credentials | CRITICAL | API keys, passwords, tokens |
| String in `setTimeout/setInterval` | HIGH | Similar to eval() |
| SQL query patterns | HIGH | SQL injection risk |
| `Math.random()` | LOW | Weak cryptographic randomness |

**Output format**:
```json
{
  "type": "Dangerous Function",
  "severity": "HIGH",
  "description": "Usage of eval() detected",
  "pattern": "eval("
}
```

#### 4. Obfuscation Detection

**Indicators analyzed**:
- Excessive string concatenation
- Heavy use of escape sequences (\x, \u)
- Unusually long variable names
- Many single-letter variables
- Very long code lines
- Dynamic function construction

**Scoring**:
- **Low**: 0-2 points
- **Medium**: 3-6 points
- **High**: 7+ points

#### 5. Library Identification

**Detected libraries**:
- jQuery
- React
- Angular
- Vue.js
- Lodash
- Moment.js
- Axios
- Bootstrap
- D3.js
- Three.js

#### 6. Complexity Analysis

**Metrics**:
- **Cyclomatic Complexity**: Number of decision points
- **Function Count**: Total functions/methods
- **Line Count**: Lines of code
- **Average Complexity**: Complexity per function

---

## OSINT Exploration

### Query Type Detection
Automatically identifies input type:
- **Email**: Standard email format
- **IP Address**: IPv4 format
- **Domain**: Hostname format
- **Username**: Default for other inputs

### Quick Links

#### 1. Whois
**URL**: `https://www.whois.com/whois/{query}`
**Use for**: Domain registration info, registrar, nameservers

#### 2. VirusTotal
**URL**: `https://www.virustotal.com/gui/search/{query}`
**Use for**: Malware scanning, URL reputation, file hashes

#### 3. Shodan
**URL**: `https://www.shodan.io/search?query={query}`
**Use for**: Internet-connected devices, open ports, vulnerabilities

#### 4. HaveIBeenPwned
**URL**: `https://haveibeenpwned.com/account/{query}`
**Use for**: Email breach checking, password exposure

### Passive Intelligence

**Content Script extracts**:
- External domains referenced
- Number of cookies
- LocalStorage usage
- SessionStorage usage
- Form count

**Background Script monitors**:
- Tracking scripts (Google Analytics, Facebook, etc.)
- Third-party requests
- Ad networks
- Analytics services

---

## Context Menu Integration

Right-click on images, text, or links to:
- Analyze images for steganography
- Scan selected text for patterns
- Perform OSINT lookup on links

---

## Performance Considerations

### Resource Usage
- **Memory**: ~10-20MB for extension
- **CPU**: Minimal impact on browsing
- **Network**: Only for user-initiated OSINT queries

### Optimization Tips
- Disable background scanning when not needed
- Clear findings list regularly
- Use specific pattern types instead of scanning all

---

## Privacy & Security

### Data Handling
- **Local Processing**: All analysis done in-browser
- **No Tracking**: Extension doesn't collect user data
- **No External Servers**: No data sent to third parties (except OSINT quick links)
- **Open Source**: Code available for audit

### Permissions Justification
- `activeTab`: Read page source for code analysis
- `scripting`: Inject content script for DOM scanning
- `storage`: Save user preferences (background scan toggle)
- `webRequest`: Intercept requests for auto-discovery
- `tabs`: Create new tabs for OSINT services
- `host_permissions`: Access all URLs for comprehensive analysis

---

## Advanced Usage

### Custom Pattern Detection
1. Select "Custom Regex" in Patterns tab
2. Enter regex pattern (e.g., `\b[A-Z]{3}-\d{4}\b` for custom IDs)
3. Test on sample text
4. Use for specialized pattern matching

### Bulk Analysis
1. Copy large text blocks into Pattern or Cipher tabs
2. Run analysis
3. Export results (copy JSON output)

### Integration with Other Tools
- Export findings as JSON
- Use with Burp Suite, ZAP, or other security tools
- Complement manual penetration testing

---

## Known Limitations

1. **EXIF Extraction**: Requires external library for full functionality
2. **Image Analysis**: Limited by browser canvas API
3. **WebRequest**: May not catch all requests in some scenarios
4. **Obfuscation**: Advanced techniques may evade detection
5. **Cipher Detection**: Heuristic-based, not 100% accurate

---

## Future Enhancements

- [ ] WebAssembly for performance improvements
- [ ] Full EXIF library integration
- [ ] Advanced steganography (DCT, PVD methods)
- [ ] Machine learning for anomaly detection
- [ ] Report export (PDF, CSV, JSON)
- [ ] API integration for real-time threat intelligence
- [ ] Support for audio steganography
- [ ] Blockchain address analysis
- [ ] Dark web monitoring

---

**Last Updated**: 2025
**Version**: 1.0
