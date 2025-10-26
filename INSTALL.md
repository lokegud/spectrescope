# SpectreScope Installation Guide

## Quick Start

Follow these simple steps to install SpectreScope in your Chrome browser:

### 1. Prepare the Extension

The extension is now ready to use! All files are in place:
- ✅ manifest.json (extension configuration)
- ✅ popup.html/css/js (user interface)
- ✅ background.js (service worker)
- ✅ content.js (page scanner)
- ✅ utils/ folder (all analysis tools)
- ✅ icons/ folder (extension icons)

### 2. Load in Chrome

1. **Open Chrome** and navigate to: `chrome://extensions/`

2. **Enable Developer Mode**
   - Look for the toggle switch in the **top-right corner**
   - Click to enable it

3. **Load the Extension**
   - Click the **"Load unpacked"** button (top-left)
   - Navigate to the `hextension` folder
   - Select the folder and click **"Select Folder"** or **"Open"**

4. **Verify Installation**
   - SpectreScope should now appear in your extensions list
   - You should see the SpectreScope icon in your browser toolbar
   - Click the icon to open the extension popup

### 3. First Use

1. **Open the Extension**
   - Click the SpectreScope icon in your browser toolbar
   - The popup interface will open with 6 tabs

2. **Enable Background Scanning** (Optional)
   - Go to the **Dashboard** tab
   - Toggle **"Enable Background Scan"** ON
   - This will automatically scan pages for security findings

3. **Test Features**
   - **Dashboard**: View auto-discovered findings
   - **Steganography**: Upload an image and click "Analyze LSB"
   - **OSINT**: Enter a domain and click quick links
   - **Code**: Click "Inspect Current Page Source"
   - **Ciphers**: Paste encoded text and click "Decode"
   - **Patterns**: Paste text and click "Scan"

## Troubleshooting

### Extension won't load
- **Check manifest.json**: Make sure it's valid JSON
- **Check file paths**: All files should be in the correct folders
- **Check permissions**: Ensure you have read access to all files

### Features not working
- **Check console**: Right-click the extension icon → "Inspect popup" → Check console for errors
- **Reload extension**: Go to chrome://extensions/ and click the reload icon
- **Check permissions**: Make sure all requested permissions are granted

### Background scanning not working
- **Enable the toggle**: Go to Dashboard tab and turn on "Enable Background Scan"
- **Check storage**: Ensure chrome.storage permission is granted
- **Reload the page**: After enabling, reload the page you want to scan

## Security Notes

- All analysis is performed **locally** in your browser
- No data is sent to external servers (except OSINT quick links)
- You can disable background scanning at any time
- Review the code in the GitHub repository for transparency

## Uninstalling

1. Go to `chrome://extensions/`
2. Find **SpectreScope** in the list
3. Click **"Remove"**
4. Confirm removal

All extension data will be removed from your browser.

## Next Steps

- Read the **README.md** for detailed feature documentation
- Explore the **utils/** folder to understand the analysis algorithms
- Customize patterns in **utils/patterns.js** for your needs
- Add more vulnerability checks in **utils/code-analysis.js**

## Support

For issues, questions, or contributions:
- Check the README.md for detailed documentation
- Review the source code for implementation details
- Test features on different websites to understand capabilities

---

**Version**: 1.0
**Last Updated**: 2025
**Compatible with**: Chrome, Edge, Brave, and other Chromium-based browsers
