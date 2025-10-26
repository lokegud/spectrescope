// Steganography utility functions

const SteganographyUtils = {
    // Analyze LSB (Least Significant Bit) in an image
    analyzeLSB: async function(imageFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;

                    // Extract LSBs
                    let lsbData = '';
                    for (let i = 0; i < data.length; i += 4) {
                        lsbData += (data[i] & 1).toString(); // Red channel LSB
                        lsbData += (data[i + 1] & 1).toString(); // Green channel LSB
                        lsbData += (data[i + 2] & 1).toString(); // Blue channel LSB
                    }

                    // Convert binary to text
                    let extractedText = '';
                    for (let i = 0; i < lsbData.length; i += 8) {
                        const byte = lsbData.substr(i, 8);
                        const charCode = parseInt(byte, 2);
                        if (charCode === 0) break; // Null terminator
                        if (charCode >= 32 && charCode <= 126) {
                            extractedText += String.fromCharCode(charCode);
                        }
                    }

                    // Calculate entropy of LSBs
                    const entropy = SteganographyUtils.calculateEntropy(lsbData.substr(0, 10000));

                    resolve({
                        width: img.width,
                        height: img.height,
                        pixelCount: data.length / 4,
                        lsbEntropy: entropy,
                        extractedText: extractedText.length > 0 ? extractedText : 'No hidden text found',
                        suspiciousLSB: entropy > 0.9 // High entropy suggests random data (potential hidden message)
                    });
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
        });
    },

    // Extract metadata from image file
    extractMetadata: async function(imageFile) {
        return {
            name: imageFile.name,
            size: imageFile.size,
            type: imageFile.type,
            lastModified: new Date(imageFile.lastModified).toLocaleString(),
            sizeRatio: this.analyzeSizeRatio(imageFile)
        };
    },

    // Analyze size ratio (suspicious if file is much larger than expected)
    analyzeSizeRatio: function(imageFile) {
        // Rough estimate: typical image should be width * height * 3 bytes (RGB)
        // If actual size is significantly larger, could indicate hidden data
        const reader = new FileReader();
        return new Promise((resolve) => {
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    const expectedSize = img.width * img.height * 3;
                    const actualSize = imageFile.size;
                    const ratio = (actualSize / expectedSize).toFixed(2);
                    resolve({
                        expectedSize,
                        actualSize,
                        ratio,
                        suspicious: ratio > 2 // More than 2x expected size
                    });
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(imageFile);
        });
    },

    // Extract EXIF data (simplified - would need exif-js library for full implementation)
    extractEXIF: async function(imageFile) {
        // This is a placeholder - real EXIF extraction requires a library like exif-js
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const view = new DataView(e.target.result);

                // Check for JPEG marker
                if (view.getUint16(0, false) !== 0xFFD8) {
                    resolve({ error: 'Not a valid JPEG file' });
                    return;
                }

                // Look for EXIF marker (0xFFE1)
                let offset = 2;
                let hasEXIF = false;
                while (offset < view.byteLength) {
                    const marker = view.getUint16(offset, false);
                    if (marker === 0xFFE1) {
                        hasEXIF = true;
                        break;
                    }
                    offset += 2 + view.getUint16(offset + 2, false);
                }

                resolve({
                    hasEXIF,
                    message: hasEXIF ? 'EXIF data found (use specialized tool for full extraction)' : 'No EXIF data found'
                });
            };
            reader.readAsArrayBuffer(imageFile);
        });
    },

    // Calculate entropy (measure of randomness)
    calculateEntropy: function(data) {
        const freq = {};
        for (let bit of data) {
            freq[bit] = (freq[bit] || 0) + 1;
        }

        let entropy = 0;
        const len = data.length;
        for (let bit in freq) {
            const p = freq[bit] / len;
            entropy -= p * Math.log2(p);
        }

        return entropy.toFixed(4);
    },

    // Analyze image from URL
    analyzeImageURL: async function(url) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const file = new File([blob], url.split('/').pop(), { type: blob.type });
            return await this.analyzeLSB(file);
        } catch (error) {
            return { error: 'Failed to fetch image: ' + error.message };
        }
    }
};
