# SpectreScope - Quick Start Guide

## Installation Steps

### 1. Remove Old Version (If Installed)
```
1. Go to chrome://extensions/
2. Find "SpectreScope"
3. Click "Remove"
4. Confirm removal
```

### 2. Load Fresh Extension
```
1. Go to chrome://extensions/
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked" (top-left button)
4. Navigate to: C:\Users\lokeg\Documents\hextension
5. Click "Select Folder"
```

### 3. Verify Installation
After loading, you should see:
- ✅ **Name**: SpectreScope
- ✅ **Status**: No errors
- ✅ **Service Worker**: Active (blue link)
- ✅ **Icon**: Visible in browser toolbar

### 4. If You See Errors

**Error: "Service worker registration failed"**
- Remove the extension
- Close ALL Chrome windows
- Reopen Chrome
- Try loading again

**Error: "Context menus undefined"**
- Already fixed! Just reload the extension
- Click the reload icon (🔄) next to SpectreScope

**Error: "Failed to load extension"**
- Check file permissions:
  ```bash
  cd /mnt/c/Users/lokeg/Documents/hextension
  ls -la
  ```
- All files should be readable

## First Test

### Test the Popup
1. Click the SpectreScope icon in toolbar
2. Should see a popup with 6 tabs
3. Navigate between tabs (they should switch)

### Test Cipher Decryption
1. Open popup → Go to "Ciphers" tab
2. Paste: `SGVsbG8gV29ybGQ=`
3. Select: "Base64"
4. Click "Decode"
5. Should show: `Hello World`

### Test Pattern Recognition
1. Go to "Patterns" tab
2. Paste: `Contact me at test@example.com or visit 192.168.1.1`
3. Select: "Email Addresses"
4. Click "Scan"
5. Should find: `test@example.com`

## Common Issues

| Issue | Solution |
|-------|----------|
| No icon in toolbar | Check icons folder has .png files |
| Popup won't open | Right-click icon → Inspect Popup → Check console |
| Features don't work | Open DevTools (F12) and check for errors |
| Service Worker error | Remove extension, close Chrome, reload |

## File Checklist

Make sure these exist:
```
✓ manifest.json
✓ background.js
✓ popup.html
✓ popup.css
✓ popup.js
✓ content.js
✓ icons/icon16.png
✓ icons/icon48.png
✓ icons/icon128.png
✓ utils/ciphers.js
✓ utils/patterns.js
✓ utils/steganography.js
✓ utils/code-analysis.js
```

Verify with:
```bash
cd /mnt/c/Users/lokeg/Documents/hextension
ls -R
```

## Debug Mode

To see what's happening:

**1. Service Worker Console**
```
chrome://extensions/ → Click "Service Worker" → See background logs
```

**2. Popup Console**
```
Click extension icon → Right-click popup → Inspect → Console tab
```

**3. Content Script Console**
```
Open any webpage → F12 → Console → Look for "SpectreScope" messages
```

## Success Indicators

When working correctly:
- ✅ No red errors in chrome://extensions/
- ✅ Service Worker shows "active" (blue text)
- ✅ Clicking icon opens popup
- ✅ All 6 tabs are clickable
- ✅ Cipher decode test works
- ✅ No console errors in popup

## Need Help?

Read:
- `TROUBLESHOOTING.md` - Detailed problem solving
- `README.md` - Full documentation
- `FEATURES.md` - Feature details

---

**Extension Version**: 1.0
**Last Updated**: 2025
