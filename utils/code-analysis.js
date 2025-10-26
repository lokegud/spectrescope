// Code analysis utility functions

const CodeAnalysisUtils = {
    // Beautify JavaScript code
    beautify: function(code) {
        // Simple beautification (for full implementation, use a library like js-beautify)
        let beautified = code;
        let indent = 0;
        const indentStr = '  ';

        beautified = beautified.replace(/\s+/g, ' ').trim();
        beautified = beautified.replace(/([{;])\s*/g, '$1\n');
        beautified = beautified.replace(/\s*([}])/g, '\n$1');

        const lines = beautified.split('\n');
        beautified = lines.map(line => {
            line = line.trim();
            if (line.endsWith('{')) {
                const result = indentStr.repeat(indent) + line;
                indent++;
                return result;
            } else if (line.startsWith('}')) {
                indent = Math.max(0, indent - 1);
                return indentStr.repeat(indent) + line;
            } else {
                return indentStr.repeat(indent) + line;
            }
        }).join('\n');

        return beautified;
    },

    // Scan for common vulnerabilities
    scanVulnerabilities: function(code) {
        const vulnerabilities = [];

        // Check for eval usage
        if (/\beval\s*\(/g.test(code)) {
            vulnerabilities.push({
                type: 'Dangerous Function',
                severity: 'HIGH',
                description: 'Usage of eval() detected - can execute arbitrary code',
                pattern: 'eval('
            });
        }

        // Check for innerHTML usage
        if (/\.innerHTML\s*=/g.test(code)) {
            vulnerabilities.push({
                type: 'XSS Risk',
                severity: 'MEDIUM',
                description: 'innerHTML assignment detected - potential XSS vulnerability',
                pattern: '.innerHTML ='
            });
        }

        // Check for document.write
        if (/document\.write\s*\(/g.test(code)) {
            vulnerabilities.push({
                type: 'Bad Practice',
                severity: 'MEDIUM',
                description: 'document.write() detected - can cause security and performance issues',
                pattern: 'document.write('
            });
        }

        // Check for exposed API keys
        const apiKeyPatterns = [
            { pattern: /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi, name: 'API Key' },
            { pattern: /secret[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi, name: 'Secret Key' },
            { pattern: /password\s*[:=]\s*['"][^'"]+['"]/gi, name: 'Hardcoded Password' },
            { pattern: /token\s*[:=]\s*['"][^'"]+['"]/gi, name: 'Auth Token' }
        ];

        apiKeyPatterns.forEach(({ pattern, name }) => {
            const matches = code.match(pattern);
            if (matches) {
                vulnerabilities.push({
                    type: 'Exposed Credentials',
                    severity: 'CRITICAL',
                    description: `${name} exposed in code`,
                    pattern: matches[0].substring(0, 50) + '...'
                });
            }
        });

        // Check for setTimeout/setInterval with string argument
        if (/set(?:Timeout|Interval)\s*\(\s*['"`]/g.test(code)) {
            vulnerabilities.push({
                type: 'Code Injection Risk',
                severity: 'HIGH',
                description: 'setTimeout/setInterval with string argument - similar risks to eval()',
                pattern: 'setTimeout/setInterval with string'
            });
        }

        // Check for SQL-like patterns (if backend code)
        if (/(?:SELECT|INSERT|UPDATE|DELETE)\s+.+\s+FROM/gi.test(code)) {
            vulnerabilities.push({
                type: 'SQL Injection Risk',
                severity: 'HIGH',
                description: 'SQL query detected - ensure proper parameterization',
                pattern: 'SQL query'
            });
        }

        // Check for insecure random number generation
        if (/Math\.random\s*\(\)/g.test(code)) {
            vulnerabilities.push({
                type: 'Weak Randomness',
                severity: 'LOW',
                description: 'Math.random() is not cryptographically secure - use crypto.getRandomValues()',
                pattern: 'Math.random()'
            });
        }

        return vulnerabilities;
    },

    // Detect obfuscation
    detectObfuscation: function(code) {
        const indicators = [];
        let obfuscationScore = 0;

        // Check for excessive string concatenation
        const stringConcatCount = (code.match(/['"][\s\S]*?['"]\s*\+\s*['"][\s\S]*?['"]/g) || []).length;
        if (stringConcatCount > 10) {
            indicators.push('Excessive string concatenation');
            obfuscationScore += 2;
        }

        // Check for hex/unicode escape sequences
        const escapeCount = (code.match(/\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}/g) || []).length;
        if (escapeCount > 20) {
            indicators.push('Heavy use of escape sequences');
            obfuscationScore += 3;
        }

        // Check for very long variable names (often seen in obfuscated code)
        const longVarNames = (code.match(/\b[a-zA-Z_$][a-zA-Z0-9_$]{50,}\b/g) || []).length;
        if (longVarNames > 5) {
            indicators.push('Unusually long variable names');
            obfuscationScore += 2;
        }

        // Check for single-letter variable proliferation
        const singleLetterVars = new Set(code.match(/\b[a-zA-Z]\b/g) || []).size;
        if (singleLetterVars > 15) {
            indicators.push('Many single-letter variables');
            obfuscationScore += 1;
        }

        // Check average line length
        const lines = code.split('\n');
        const avgLineLength = code.length / lines.length;
        if (avgLineLength > 200) {
            indicators.push('Very long lines of code');
            obfuscationScore += 2;
        }

        // Check for Function constructor usage
        if (/new\s+Function\s*\(/g.test(code)) {
            indicators.push('Dynamic function construction');
            obfuscationScore += 3;
        }

        return {
            isObfuscated: obfuscationScore > 5,
            score: obfuscationScore,
            indicators: indicators,
            level: obfuscationScore < 3 ? 'Low' : obfuscationScore < 7 ? 'Medium' : 'High'
        };
    },

    // Identify external libraries
    identifyLibraries: function(code) {
        const libraries = [];
        const libraryPatterns = {
            'jQuery': /\$\s*\(|jQuery/,
            'React': /React\.|import\s+React/,
            'Angular': /angular\.|ng-/,
            'Vue': /new\s+Vue|Vue\./,
            'Lodash': /_\.|import\s+_\s+from\s+['"]lodash['"]/,
            'Moment.js': /moment\(/,
            'Axios': /axios\./,
            'Bootstrap': /bootstrap/i,
            'D3.js': /d3\./,
            'Three.js': /THREE\./
        };

        for (let [lib, pattern] of Object.entries(libraryPatterns)) {
            if (pattern.test(code)) {
                libraries.push(lib);
            }
        }

        return libraries;
    },

    // Calculate code complexity
    calculateComplexity: function(code) {
        const cyclomaticComplexity = (code.match(/\b(if|while|for|case|catch|\?)\b/g) || []).length + 1;
        const functionCount = (code.match(/function\s+\w+\s*\(|=>\s*{/g) || []).length;
        const lineCount = code.split('\n').length;

        return {
            cyclomaticComplexity,
            functionCount,
            lineCount,
            averageComplexity: functionCount > 0 ? (cyclomaticComplexity / functionCount).toFixed(2) : 0
        };
    }
};
