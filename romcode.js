const QWE = "QWERTYUIOPASDFGHJKLZXCVBNM";
const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function getCurrentAlignment(shiftPosition) {
    let mapping = {};
    for (let i = 0; i < ABC.length; i++) {
        const abcChar = ABC[i];
        const qweIndex = (i + shiftPosition) % QWE.length;
        const qweChar = QWE[qweIndex];
        mapping[abcChar] = qweChar;
        mapping[abcChar.toLowerCase()] = qweChar.toLowerCase();
    }
    return mapping;
}

function getCurrentDecodeMapping(shiftPosition) {
    let mapping = {};
    for (let i = 0; i < ABC.length; i++) {
        const abcChar = ABC[i];
        const qweIndex = (i + shiftPosition) % QWE.length;
        const qweChar = QWE[qweIndex];
        mapping[qweChar] = abcChar;
        mapping[qweChar.toLowerCase()] = abcChar.toLowerCase();
    }
    return mapping;
}

function processText() {
    const message = document.getElementById('message').value.toUpperCase();
    const direction = document.getElementById('direction').value;
    const mode = document.getElementById('mode').value;
    const alignmentWord = document.getElementById('alignmentWord').value.toUpperCase();
    
    if (!message) {
        alert('Masukkan pesan terlebih dahulu!');
        return;
    }

    if (!alignmentWord || alignmentWord.length < 2) {
        alert('Alignment word harus minimal 2 huruf!');
        return;
    }

    // Validate alignment word contains only A-Z
    if (!/^[A-Z]+$/.test(alignmentWord)) {
        alert('Alignment word hanya boleh mengandung huruf A-Z!');
        return;
    }

    const SHIFT_COUNT = alignmentWord.length;
    const firstChar = alignmentWord[0]; // First letter for ABC paper
    const secondChar = alignmentWord[1]; // Second letter for QWE paper

    let result = '';
    
    // Initial alignment: firstChar (ABC) ↔ secondChar (QWE)
    const firstCharIndexABC = ABC.indexOf(firstChar);
    const secondCharIndexQWE = QWE.indexOf(secondChar);
    
    if (firstCharIndexABC === -1 || secondCharIndexQWE === -1) {
        alert('Huruf alignment tidak valid!');
        return;
    }

    let currentShift = (secondCharIndexQWE - firstCharIndexABC + QWE.length) % QWE.length;

    for (let i = 0; i < message.length; i++) {
        const char = message[i];
        
        if (char === ' ') {
            result += ' ';
        } else {
            if (mode === 'DE') { // Encode plain text
                if (ABC.includes(char)) {
                    const mapping = getCurrentAlignment(currentShift);
                    const encodedChar = mapping[char];
                    result += encodedChar;
                } else {
                    result += char;
                }
            } else { // EN mode - Decode encoded text
                if (QWE.includes(char)) {
                    const mapping = getCurrentDecodeMapping(currentShift);
                    const decodedChar = mapping[char];
                    result += decodedChar;
                } else {
                    result += char;
                }
            }
            
            // Apply shift for next character
            if (direction === '>') {
                currentShift = (currentShift + SHIFT_COUNT) % QWE.length;
            } else { // <
                currentShift = (currentShift - SHIFT_COUNT + QWE.length) % QWE.length;
            }
        }
    }

    // Output in same ROMCODE format with the processed message
    const romcodeOutput = `ROMCODE = {ABC-QWE;${direction};${mode};${alignmentWord};${result.replace(/ /g, '')}}`;
    document.getElementById('output').textContent = romcodeOutput;
}

function clearAll() {
    document.getElementById('message').value = '';
    document.getElementById('alignmentWord').value = '';
    document.getElementById('output').textContent = '';
}

// Auto uppercase for alignment word input
document.getElementById('alignmentWord').addEventListener('input', function() {
    this.value = this.value.toUpperCase().replace(/[^A-Z]/g, '');
});

// Auto uppercase for message input
document.getElementById('message').addEventListener('input', function() {
    this.value = this.value.toUpperCase();
});

// Auto process when page loads
window.onload = processText;