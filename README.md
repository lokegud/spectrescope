# SpectreScope Chrome Extension

A powerful browser extension for security analysis, digital forensics, and OSINT exploration.

## Features

### 1. **Steganography Discovery & Decoding**
- LSB (Least Significant Bit) analysis for images
- EXIF metadata extraction
- File size anomaly detection
- Entropy calculation for hidden data detection
- Automatic background scanning of images

### 2. **Pattern Recognition**
- Email addresses, IP addresses, URLs
- Hash detection (MD5, SHA1, SHA256)
- API key exposure detection (AWS, Google, Stripe, GitHub)
- Phone numbers, Bitcoin addresses, JWT tokens
- Custom regex pattern matching
- Entropy analysis

### 3. **OSINT Exploration**
- Quick links to external OSINT services:
  - Whois lookup
  - VirusTotal
  - Shodan
  - HaveIBeenPwned
- Automatic domain and IP extraction from pages
- External link analysis

### 4. **Source Code Investigation**
- JavaScript beautification
- Vulnerability scanning:
  - Dangerous functions (eval, innerHTML)
  - Exposed credentials
  - SQL injection risks
  - Weak randomness
- Obfuscation detection
- Library identification
- Cyclomatic complexity calculation

### 5. **Cipher Decryption**
- Auto-detection of common encodings
- Supported ciphers:
  - Base64
  - Hex
  - URL encoding
  - ROT13
  - Caesar cipher (all shifts)
  - Atbash cipher
  - XOR cipher

### 6. **Auto-Discovery Dashboard**
- Background scanning with webRequest interception
- Real-time findings notification
- Badge counter for new discoveries
- Context menu integration

## Installation

1. **Clone or download this repository**
2. **Open Chrome and navigate to** `chrome://extensions/`
3. **Enable "Developer mode"** (toggle in top-right corner)
4. **Click "Load unpacked"**
5. **Select the `hextension` directory**

## Icons Setup

Before loading the extension, you need icon files. You can:

1. Create your own icons (16x16, 48x48, 128x128 pixels)
2. Use placeholder icons temporarily
3. Generate icons using online tools

Place the icons in the `icons/` directory:
- `icons/icon16.png` (16x16)
- `icons/icon48.png` (48x48)
- `icons/icon128.png` (128x128)

## Usage

### Dashboard Tab
- Enable/disable background scanning
- View auto-discovered findings
- See real-time security insights

### Steganography Tab
- Upload images or provide URLs
- Run LSB analysis
- Extract metadata and EXIF data
- Detect size anomalies

### OSINT Tab
- Search for domains, IPs, emails, or usernames
- Quick access to external OSINT tools
- Passive intelligence gathering

### Code Tab
- Inspect current page source
- Beautify minified JavaScript
- Scan for vulnerabilities and obfuscation
- Identify third-party libraries

### Ciphers Tab
- Auto-detect and decode multiple cipher types
- Manual cipher selection
- Support for custom keys

### Patterns Tab
- Scan text for common patterns
- Custom regex matching
- Entropy calculation
- Export results

## Permissions Explained

- **activeTab**: Access current tab for source code inspection
- **scripting**: Inject content scripts for DOM analysis
- **storage**: Save user preferences and findings
- **webRequest**: Intercept network requests for auto-discovery
- **tabs**: Create new tabs for OSINT links
- **host_permissions**: Access all URLs for comprehensive scanning

## Security & Privacy

- All analysis is performed **locally** in your browser
- No data is sent to external servers (except when using OSINT quick links)
- Background scanning can be disabled at any time
- Open-source for transparency and security auditing

## Development

### Project Structure
```
hextension/
├── manifest.json          # Extension configuration
├── popup.html            # Main UI
├── popup.css             # Styling
├── popup.js              # UI logic
├── background.js         # Service worker
├── content.js            # Page interaction script
├── utils/
│   ├── ciphers.js       # Cipher algorithms
│   ├── patterns.js      # Pattern matching
│   ├── steganography.js # Image analysis
│   └── code-analysis.js # Code scanning
└── icons/               # Extension icons
```

### Adding New Features

1. **Add utility functions** in `utils/` directory
2. **Update popup.html** with new UI elements
3. **Add event listeners** in `popup.js`
4. **Update background.js** for auto-discovery features
5. **Modify content.js** for page-level scanning

## Known Limitations

- EXIF extraction is simplified (full implementation requires external library)
- Image analysis limited to client-side canvas operations
- WebRequest interception may not catch all network activity
- Some obfuscation techniques may evade detection

## Future Enhancements

- [ ] WebAssembly for performance-critical operations
- [ ] Advanced steganography techniques (DCT, PVD)
- [ ] Machine learning for pattern anomaly detection
- [ ] Export reports in multiple formats
- [ ] Integration with more OSINT APIs
- [ ] Dark web monitoring capabilities
- [ ] Collaborative findings sharing

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request with detailed description

## License

This project is for educational and defensive security purposes only. Use responsibly and ethically.

## Disclaimer

This tool is designed for security research, digital forensics, and OSINT investigations. Users are responsible for ensuring their use complies with applicable laws and regulations.

## Credits

Developed as a comprehensive security analysis toolkit for browser-based investigations.

---

**Version**: 1.0
**Manifest Version**: 3
**Compatible with**: Chrome, Edge, Brave (Chromium-based browsers)
