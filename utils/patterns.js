// Pattern recognition utility functions

const PatternUtils = {
    patterns: {
        email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        ip: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
        url: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g,
        hash: {
            md5: /\b[a-fA-F0-9]{32}\b/g,
            sha1: /\b[a-fA-F0-9]{40}\b/g,
            sha256: /\b[a-fA-F0-9]{64}\b/g
        },
        api_key: /\b[A-Za-z0-9_\-]{32,}\b/g,
        phone: /\b(\+\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})\b/g,
        ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
        credit_card: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
        bitcoin: /\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b/g,
        jwt: /eyJ[A-Za-z0-9_-]*\.eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*/g
    },

    scan: function(text, patternType) {
        let matches = [];

        if (patternType === 'email') {
            matches = [...new Set(text.match(this.patterns.email) || [])];
        } else if (patternType === 'ip') {
            matches = [...new Set(text.match(this.patterns.ip) || [])];
        } else if (patternType === 'url') {
            matches = [...new Set(text.match(this.patterns.url) || [])];
        } else if (patternType === 'hash') {
            const md5Matches = text.match(this.patterns.hash.md5) || [];
            const sha1Matches = text.match(this.patterns.hash.sha1) || [];
            const sha256Matches = text.match(this.patterns.hash.sha256) || [];
            matches = [
                ...md5Matches.map(m => ({ type: 'MD5', value: m })),
                ...sha1Matches.map(m => ({ type: 'SHA1', value: m })),
                ...sha256Matches.map(m => ({ type: 'SHA256', value: m }))
            ];
        } else if (patternType === 'api_key') {
            // Look for common API key patterns
            const apiKeyPatterns = [
                /AKIA[0-9A-Z]{16}/g, // AWS Access Key
                /AIza[0-9A-Za-z_-]{35}/g, // Google API Key
                /sk_live_[0-9a-zA-Z]{24}/g, // Stripe Live Key
                /sk_test_[0-9a-zA-Z]{24}/g, // Stripe Test Key
                /ghp_[0-9a-zA-Z]{36}/g, // GitHub Personal Access Token
                /gho_[0-9a-zA-Z]{36}/g // GitHub OAuth Token
            ];
            apiKeyPatterns.forEach(pattern => {
                const found = text.match(pattern) || [];
                matches.push(...found);
            });
            matches = [...new Set(matches)];
        }

        return matches;
    },

    scanCustom: function(text, regexPattern) {
        try {
            const regex = new RegExp(regexPattern, 'g');
            return [...new Set(text.match(regex) || [])];
        } catch (e) {
            return { error: 'Invalid regex pattern: ' + e.message };
        }
    },

    scanAll: function(text) {
        return {
            emails: this.scan(text, 'email'),
            ips: this.scan(text, 'ip'),
            urls: this.scan(text, 'url'),
            hashes: this.scan(text, 'hash'),
            apiKeys: this.scan(text, 'api_key'),
            phones: [...new Set(text.match(this.patterns.phone) || [])],
            bitcoinAddresses: [...new Set(text.match(this.patterns.bitcoin) || [])],
            jwts: [...new Set(text.match(this.patterns.jwt) || [])]
        };
    },

    calculateEntropy: function(text) {
        const freq = {};
        for (let char of text) {
            freq[char] = (freq[char] || 0) + 1;
        }

        let entropy = 0;
        const len = text.length;
        for (let char in freq) {
            const p = freq[char] / len;
            entropy -= p * Math.log2(p);
        }

        return entropy.toFixed(4);
    }
};
