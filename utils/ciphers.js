// Cipher utility functions

const CipherUtils = {
    // Base64 decode
    decodeBase64: function(str) {
        try {
            return atob(str);
        } catch (e) {
            return null;
        }
    },

    // Hex decode
    decodeHex: function(str) {
        try {
            const hex = str.replace(/[^0-9A-Fa-f]/g, '');
            let result = '';
            for (let i = 0; i < hex.length; i += 2) {
                result += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            }
            return result;
        } catch (e) {
            return null;
        }
    },

    // URL decode
    decodeURL: function(str) {
        try {
            return decodeURIComponent(str);
        } catch (e) {
            return null;
        }
    },

    // ROT13
    decodeROT13: function(str) {
        return str.replace(/[a-zA-Z]/g, function(c) {
            return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
        });
    },

    // Caesar cipher
    decodeCaesar: function(str, shift = 3) {
        shift = parseInt(shift) || 3;
        return str.replace(/[a-zA-Z]/g, function(c) {
            const base = c <= 'Z' ? 65 : 97;
            return String.fromCharCode(((c.charCodeAt(0) - base - shift + 26) % 26) + base);
        });
    },

    // Atbash cipher
    decodeAtbash: function(str) {
        return str.replace(/[a-zA-Z]/g, function(c) {
            const base = c <= 'Z' ? 65 : 97;
            return String.fromCharCode(base + (25 - (c.charCodeAt(0) - base)));
        });
    },

    // XOR cipher
    decodeXOR: function(str, key) {
        if (!key) return null;
        let result = '';
        for (let i = 0; i < str.length; i++) {
            result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return result;
    },

    // Auto-detect cipher type
    autoDetect: function(str) {
        const results = [];

        // Try Base64
        if (/^[A-Za-z0-9+/=]+$/.test(str.trim())) {
            const decoded = this.decodeBase64(str);
            if (decoded && /^[\x20-\x7E\s]*$/.test(decoded)) {
                results.push({ type: 'Base64', decoded: decoded });
            }
        }

        // Try Hex
        if (/^[0-9A-Fa-f\s]+$/.test(str.trim())) {
            const decoded = this.decodeHex(str);
            if (decoded && /^[\x20-\x7E\s]*$/.test(decoded)) {
                results.push({ type: 'Hex', decoded: decoded });
            }
        }

        // Try URL encoding
        if (/%[0-9A-Fa-f]{2}/.test(str)) {
            const decoded = this.decodeURL(str);
            if (decoded && decoded !== str) {
                results.push({ type: 'URL Encoding', decoded: decoded });
            }
        }

        // Try ROT13
        const rot13 = this.decodeROT13(str);
        if (rot13 !== str) {
            results.push({ type: 'ROT13', decoded: rot13 });
        }

        // Try Caesar with different shifts
        for (let shift = 1; shift <= 25; shift++) {
            const caesar = this.decodeCaesar(str, shift);
            if (caesar !== str && this.isProbablyText(caesar)) {
                results.push({ type: `Caesar (shift ${shift})`, decoded: caesar });
            }
        }

        // Try Atbash
        const atbash = this.decodeAtbash(str);
        if (atbash !== str) {
            results.push({ type: 'Atbash', decoded: atbash });
        }

        return results;
    },

    // Helper to check if decoded text is probably readable
    isProbablyText: function(str) {
        const words = str.toLowerCase().split(/\s+/);
        const commonWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at'];
        let matches = 0;
        words.forEach(word => {
            if (commonWords.includes(word)) matches++;
        });
        return matches >= words.length * 0.1; // At least 10% common words
    }
};
