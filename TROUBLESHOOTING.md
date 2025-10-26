# SpectreScope Troubleshooting Guide

## Service Worker Registration Failed (Status Code 15)

This is a common issue with Manifest V3 extensions. Here are the solutions:

### Solution 1: Reload the Extension (Most Common Fix)

1. Go to `chrome://extensions/`
2. Find **SpectreScope**
3. Click the **Reload** icon (circular arrow)
4. Check if the error is gone

### Solution 2: Clear Extension Data

1. Go to `chrome://extensions/`
2. Click **Remove** on SpectreScope
3. Close and reopen Chrome
4. Go back to `chrome://extensions/`
5. Enable **Developer mode**
6. Click **Load unpacked**
7. Select the `hextension` folder again

### Solution 3: Check File Permissions

On Windows with WSL, file permissions can cause issues:

```bash
# Make sure all files are readable
cd /mnt/c/Users/lokeg/Documents/hextension
chmod -R 755 .
```

### Solution 4: Verify File Paths

Make sure all files exist:

```bash
cd /mnt/c/Users/lokeg/Documents/hextension
ls -la background.js
ls -la popup.js
ls -la content.js
ls -la manifest.json
```

All should show file sizes > 0 bytes.

### Solution 5: Check Console for Errors

1. Go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Service Worker** link under SpectreScope
4. Check the console for specific errors
5. Look for syntax errors or missing files

### Solution 6: Validate manifest.json

```bash
# Check if manifest.json is valid JSON
cd /mnt/c/Users/lokeg/Documents/hextension
python3 -m json.tool manifest.json
```

If you see errors, the JSON is malformed.

## Other Common Issues

### Extension Icon Not Showing

**Problem**: Extension loads but no icon in toolbar

**Solution**:
1. Check that icon files exist in `icons/` folder
2. Verify icon file sizes (should be > 0 bytes)
3. Recreate icons:
   ```bash
   cd /mnt/c/Users/lokeg/Documents/hextension
   python3 create_icons.py
   ```

### Popup Won't Open

**Problem**: Clicking extension icon does nothing

**Solution**:
1. Right-click the extension icon
2. Select "Inspect popup"
3. Check console for JavaScript errors
4. Look for missing utility files in Network tab

### Background Scanning Not Working

**Problem**: No findings appear on Dashboard

**Solutions**:
1. **Enable the toggle**: Go to Dashboard and turn ON "Enable Background Scan"
2. **Reload the page**: After enabling, refresh the page you want to scan
3. **Check permissions**: Ensure all permissions are granted in `chrome://extensions/`
4. **Service Worker active**: Go to `chrome://extensions/` and verify Service Worker shows "active"

### Features Not Working

**Problem**: Clicking buttons does nothing

**Debug Steps**:
1. Open extension popup
2. Press `F12` or right-click → "Inspect"
3. Go to Console tab
4. Click the feature button again
5. Look for JavaScript errors

**Common fixes**:
- Missing utility files (check `utils/` folder)
- JavaScript syntax errors (check console)
- Permission denied (check manifest.json permissions)

### Context Menu Not Appearing

**Problem**: Right-click doesn't show "Analyze with SpectreScope"

**Solutions**:
1. Reload the extension
2. Check Service Worker is running
3. Verify `contextMenus` permission in manifest.json

## Debugging Tips

### Enable Verbose Logging

1. Open Service Worker console:
   - Go to `chrome://extensions/`
   - Click **Service Worker** under SpectreScope
2. All background operations log here

### Check Popup Console

1. Click extension icon to open popup
2. Right-click inside popup → **Inspect**
3. Go to **Console** tab
4. See all popup errors and logs

### Test Individual Features

Test each feature separately:

#### Test Cipher Decryption
1. Open popup → Ciphers tab
2. Enter: `SGVsbG8gV29ybGQ=`
3. Select: Base64
4. Click: Decode
5. Should see: "Hello World"

#### Test Pattern Recognition
1. Open popup → Patterns tab
2. Enter: `Contact: test@example.com or call 192.168.1.1`
3. Select: Email Addresses
4. Click: Scan
5. Should find: `test@example.com`

#### Test Code Analysis
1. Open popup → Code tab
2. Click: "Inspect Current Page Source"
3. Should load the current page's HTML
4. Click: Beautify
5. Code should be formatted

## Performance Issues

### Extension Slowing Down Browser

**Solutions**:
1. **Disable background scanning**: Go to Dashboard, toggle OFF
2. **Reduce scan frequency**: Only enable when needed
3. **Clear findings**: Remove old findings from Dashboard

### High Memory Usage

**Solutions**:
1. Close extension popup when not in use
2. Disable background scanning
3. Restart browser periodically

## Security Warnings

### "This extension may soon no longer be supported"

**Reason**: Manifest V2 deprecation warning

**Solution**: SpectreScope uses Manifest V3, so this shouldn't appear. If it does:
1. Check `manifest.json` has `"manifest_version": 3`
2. Reload the extension

### Permission Warnings

**Why SpectreScope needs permissions**:
- `activeTab`: Read current page source
- `scripting`: Inject pattern scanning
- `storage`: Save preferences
- `webRequest`: Auto-discover suspicious files
- `tabs`: Open OSINT links
- `<all_urls>`: Scan any website

All processing is **local** - no data sent externally.

## Getting Help

### Check Logs

1. **Service Worker logs**: `chrome://extensions/` → Service Worker
2. **Popup logs**: Right-click popup → Inspect
3. **Content Script logs**: Open DevTools on any page → Console

### Verify Installation

```bash
cd /mnt/c/Users/lokeg/Documents/hextension
find . -type f -name "*.js" -o -name "*.json" -o -name "*.html"
```

Should show all core files.

### Reinstall from Scratch

1. **Remove extension**: `chrome://extensions/` → Remove
2. **Delete and re-clone**:
   ```bash
   cd /mnt/c/Users/lokeg/Documents
   rm -rf hextension
   # Re-extract or re-download the extension
   ```
3. **Recreate icons**: `python3 create_icons.py`
4. **Load again**: `chrome://extensions/` → Load unpacked

## Known Limitations

1. **EXIF extraction**: Simplified implementation (full EXIF needs library)
2. **Image analysis**: Limited by Canvas API
3. **WebRequest timing**: May miss some rapid requests
4. **Obfuscation detection**: Advanced techniques may evade
5. **WSL file permissions**: Windows filesystem through WSL can be finicky

## Still Having Issues?

1. Check browser console for errors
2. Verify all files are present and readable
3. Try loading in Chrome Canary or Edge
4. Check Windows antivirus isn't blocking files
5. Review the complete error message in Service Worker console

---

**Last Updated**: 2025
**Extension Version**: 1.0
