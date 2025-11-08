<<<<<<< HEAD
// Класичні алгоритми шифрування
class CipherAlgorithms {
    
    // Генерація ключа для шифру Цезаря на основі дати народження
    static generateCaesarKey(birthDate) {
        if (!birthDate) return 7; // Значення за замовчуванням
=======
class Alphabet {
    static UKRAINIAN_UPPER = "АБВГҐДЄЖЗИЙІЇКЛМНОПРСТУФХЦЧШЩЬЮЯ";
    static UKRAINIAN_LOWER = "абвгґдєжзийіїклмнопрстуфхцчшщьюя";
    static UKRAINIAN_COUNT = 33;
    static ENGLISH_COUNT = 26;
}

class CipherAlgorithms {
    static generateCaesarKey(birthDate) {
        if (!birthDate) {
            throw new Error(
                "Дата народження обов'язкова для генерації ключа Цезаря"
            );
        }
>>>>>>> 7bb6a037622aaf5f3b58404ca232173012e5be10
        
        const date = new Date(birthDate);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
<<<<<<< HEAD
        
        // Сума всіх цифр дати
        const sum = day.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0) +
                   month.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0) +
                   year.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
        
        return sum % 26 || 7; // Якщо сума 0, використовуємо 7
    }
    
    // Генерація ключа для шифру Віженера на основі прізвища
    static generateVigenereKey(lastName) {
        if (!lastName) return "KEY"; // Значення за замовчуванням
        
        // Видаляємо пробіли та перетворюємо на верхній регістр
        let key = lastName.replace(/\s+/g, '').toUpperCase();
        
        // Якщо ключ занадто короткий, повторюємо його
=======
        const sum =
            day
                .toString()
                .split("")
                .reduce((a, b) => parseInt(a) + parseInt(b), 0) +
            month
                .toString()
                .split("")
                .reduce((a, b) => parseInt(a) + parseInt(b), 0) +
            year
                .toString()
                .split("")
                .reduce((a, b) => parseInt(a) + parseInt(b), 0);

        return sum % Alphabet.UKRAINIAN_COUNT || 7;
    }

    static generateVigenereKey(lastName) {
        if (!lastName || lastName.trim() === "") {
            throw new Error(
                "Прізвище обов'язкове для генерації ключа Віженера"
            );
        }

        let key = lastName.replace(/\s+/g, "").toUpperCase();

>>>>>>> 7bb6a037622aaf5f3b58404ca232173012e5be10
        if (key.length < 3) {
            key = key.repeat(Math.ceil(3 / key.length));
        }
        
        return key;
    }
    
<<<<<<< HEAD
    // Шифр Цезаря
    static caesarCipher(text, shift) {
        if (!text) return '';
        
        return text.split('').map(char => {
            const code = char.charCodeAt(0);
            
            // Українські літери
            if (char >= 'А' && char <= 'Я') {
                return String.fromCharCode(((code - 1040 + shift) % 32) + 1040);
            }
            if (char >= 'а' && char <= 'я') {
                return String.fromCharCode(((code - 1072 + shift) % 32) + 1072);
            }
            if (char === 'І' || char === 'Ї') {
                return char === 'І' ? 'Ї' : 'І';
            }
            if (char === 'і' || char === 'ї') {
                return char === 'і' ? 'ї' : 'і';
            }
            
            // Англійські літери
            if (char >= 'A' && char <= 'Z') {
                return String.fromCharCode(((code - 65 + shift) % 26) + 65);
            }
            if (char >= 'a' && char <= 'z') {
                return String.fromCharCode(((code - 97 + shift) % 26) + 97);
            }
            
            // Інші символи залишаються без змін
            return char;
        }).join('');
    }
    
    // Розшифрування Цезаря
    static caesarDecrypt(text, shift) {
        return this.caesarCipher(text, -shift);
    }
    
    // Шифр Віженера
    static vigenereCipher(text, key) {
        if (!text || !key) return '';
        
        const keyUpper = key.toUpperCase();
        let keyIndex = 0;
        
        return text.split('').map(char => {
            const code = char.charCodeAt(0);
            let shift = 0;
            
            // Визначаємо зсув на основі ключа
            if (keyUpper[keyIndex % keyUpper.length] >= 'A' && keyUpper[keyIndex % keyUpper.length] <= 'Z') {
                shift = keyUpper[keyIndex % keyUpper.length].charCodeAt(0) - 65;
            }
            
            // Українські літери
            if (char >= 'А' && char <= 'Я') {
                keyIndex++;
                return String.fromCharCode(((code - 1040 + shift) % 32) + 1040);
            }
            if (char >= 'а' && char <= 'я') {
                keyIndex++;
                return String.fromCharCode(((code - 1072 + shift) % 32) + 1072);
            }
            
            // Англійські літери
            if (char >= 'A' && char <= 'Z') {
                keyIndex++;
                return String.fromCharCode(((code - 65 + shift) % 26) + 65);
            }
            if (char >= 'a' && char <= 'z') {
                keyIndex++;
                return String.fromCharCode(((code - 97 + shift) % 26) + 97);
            }
            
            // Інші символи залишаються без змін
            return char;
        }).join('');
    }
    
    // Розшифрування Віженера
    static vigenereDecrypt(text, key) {
        if (!text || !key) return '';
        
        const keyUpper = key.toUpperCase();
        let keyIndex = 0;
        
        return text.split('').map(char => {
            const code = char.charCodeAt(0);
            let shift = 0;
            
            // Визначаємо зсув на основі ключа
            if (keyUpper[keyIndex % keyUpper.length] >= 'A' && keyUpper[keyIndex % keyUpper.length] <= 'Z') {
                shift = keyUpper[keyIndex % keyUpper.length].charCodeAt(0) - 65;
            }
            
            // Українські літери
            if (char >= 'А' && char <= 'Я') {
                keyIndex++;
                return String.fromCharCode(((code - 1040 - shift + 32) % 32) + 1040);
            }
            if (char >= 'а' && char <= 'я') {
                keyIndex++;
                return String.fromCharCode(((code - 1072 - shift + 32) % 32) + 1072);
            }
            
            // Англійські літери
            if (char >= 'A' && char <= 'Z') {
                keyIndex++;
                return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
            }
            if (char >= 'a' && char <= 'z') {
                keyIndex++;
                return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
            }
            
            // Інші символи залишаються без змін
            return char;
        }).join('');
    }
    
    // ROT13 шифр
    static rot13Cipher(text) {
        if (!text) return '';
        
        return text.split('').map(char => {
            const code = char.charCodeAt(0);
            
            // Українські літери
            if (char >= 'А' && char <= 'Я') {
                return String.fromCharCode(((code - 1040 + 13) % 32) + 1040);
            }
            if (char >= 'а' && char <= 'я') {
                return String.fromCharCode(((code - 1072 + 13) % 32) + 1072);
            }
            
            // Англійські літери
            if (char >= 'A' && char <= 'Z') {
                return String.fromCharCode(((code - 65 + 13) % 26) + 65);
            }
            if (char >= 'a' && char <= 'z') {
                return String.fromCharCode(((code - 97 + 13) % 26) + 97);
            }
            
            // Інші символи залишаються без змін
            return char;
        }).join('');
    }
    
    // Brute Force атака на шифр Цезаря
    static bruteForceCaesar(encryptedText) {
        const results = [];
        
        for (let shift = 1; shift <= 25; shift++) {
            const decrypted = this.caesarDecrypt(encryptedText, shift);
            results.push({
                shift: shift,
                text: decrypted,
                readability: this.calculateReadability(decrypted)
            });
        }
        
        // Сортуємо за читабельністю
        return results.sort((a, b) => b.readability - a.readability);
    }
    
    // Розрахунок читабельності тексту
    static calculateReadability(text) {
        let score = 0;
        
        // Перевіряємо наявність українських слів
        const ukrainianWords = ['та', 'і', 'в', 'на', 'з', 'для', 'що', 'як', 'але', 'або', 'так', 'не', 'було', 'буде', 'може', 'треба', 'потрібно'];
        const words = text.toLowerCase().split(/\s+/);
        
        ukrainianWords.forEach(word => {
            if (words.includes(word)) {
                score += 2;
            }
        });
        
        // Перевіряємо наявність англійських слів
        const englishWords = ['the', 'and', 'or', 'but', 'for', 'with', 'this', 'that', 'will', 'can', 'should', 'would', 'could'];
        englishWords.forEach(word => {
            if (words.includes(word)) {
                score += 1;
            }
        });
        
        // Перевіряємо наявність пробілів (показує структуру тексту)
        const spaceCount = (text.match(/\s/g) || []).length;
        score += spaceCount * 0.5;
        
        // Штраф за спеціальні символи
        const specialChars = (text.match(/[^а-яА-Яa-zA-Z\s]/g) || []).length;
        score -= specialChars * 0.3;
        
        return Math.max(0, score);
    }
}

// Клас для порівняльного аналізу
class CipherAnalysis {
    
    static analyzeCipher(cipherName, originalText, encryptedText, key) {
        const analysis = {
            name: cipherName,
            originalLength: originalText.length,
            encryptedLength: encryptedText.length,
            key: key,
            keyLength: key.toString().length,
            readability: CipherAlgorithms.calculateReadability(encryptedText),
            entropy: this.calculateEntropy(encryptedText),
            patternAnalysis: this.analyzePatterns(encryptedText)
        };
        
        return analysis;
    }
    
    static calculateEntropy(text) {
        const frequencies = {};
        const length = text.length;
        
        for (let char of text) {
            frequencies[char] = (frequencies[char] || 0) + 1;
        }
        
        let entropy = 0;
        for (let freq of Object.values(frequencies)) {
            const probability = freq / length;
            entropy -= probability * Math.log2(probability);
        }
        
        return entropy;
    }
    
    static analyzePatterns(text) {
        const patterns = {
            repeatedChars: (text.match(/(.)\1{2,}/g) || []).length,
            repeatedWords: (text.match(/\b(\w+)\s+\1\b/g) || []).length,
            sequentialChars: (text.match(/[a-zA-Z]{3,}/g) || []).filter(seq => 
                seq.split('').every((char, i) => 
                    i === 0 || char.charCodeAt(0) === seq[i-1].charCodeAt(0) + 1
                )
            ).length
        };
        
        return patterns;
    }
    
    static generateComparisonReport(analyses) {
        const report = {
            summary: {
                totalCiphers: analyses.length,
                averageEntropy: analyses.reduce((sum, a) => sum + a.entropy, 0) / analyses.length,
                mostSecure: analyses.reduce((max, a) => a.entropy > max.entropy ? a : max),
                leastReadable: analyses.reduce((min, a) => a.readability < min.readability ? a : min)
            },
            details: analyses
        };
        
        return report;
    }
}

// UI управління
class CipherUI {
    
    static init() {
        document.getElementById('encryptBtn').addEventListener('click', this.handleEncrypt);
        document.getElementById('bruteForceBtn').addEventListener('click', this.handleBruteForce);
        document.getElementById('analyzeBtn').addEventListener('click', this.handleAnalyze);
    }
    
    static handleEncrypt() {
        const text = document.getElementById('textToEncrypt').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const birthDate = document.getElementById('birthDate').value;
        
        if (!text || text.length < 20) {
            alert('Будь ласка, введіть текст мінімум 20 символів!');
            return;
        }
        
        // Генерація ключів
        const caesarKey = CipherAlgorithms.generateCaesarKey(birthDate);
        const vigenereKey = CipherAlgorithms.generateVigenereKey(lastName);
        
        // Шифрування
        const caesarEncrypted = CipherAlgorithms.caesarCipher(text, caesarKey);
        const vigenereEncrypted = CipherAlgorithms.vigenereCipher(text, vigenereKey);
        const rot13Encrypted = CipherAlgorithms.rot13Cipher(text);
        
        // Відображення результатів
        this.displayCipherResults([
            {
                name: 'Шифр Цезаря',
                className: 'caesar',
                original: text,
                encrypted: caesarEncrypted,
                key: caesarKey,
                decrypted: CipherAlgorithms.caesarDecrypt(caesarEncrypted, caesarKey)
            },
            {
                name: 'Шифр Віженера',
                className: 'vigenere',
                original: text,
                encrypted: vigenereEncrypted,
                key: vigenereKey,
                decrypted: CipherAlgorithms.vigenereDecrypt(vigenereEncrypted, vigenereKey)
            },
            {
                name: 'ROT13',
                className: 'rot13',
                original: text,
                encrypted: rot13Encrypted,
                key: '13',
                decrypted: CipherAlgorithms.rot13Cipher(rot13Encrypted)
            }
        ]);
        
        this.showResultsSection();
    }
    
    static handleBruteForce() {
        const text = document.getElementById('textToEncrypt').value;
        
        if (!text || text.length < 10) {
            alert('Будь ласка, введіть текст для brute force аналізу!');
            return;
        }
        
        // Використовуємо перший шифр Цезаря для демонстрації
        const birthDate = document.getElementById('birthDate').value;
        const caesarKey = CipherAlgorithms.generateCaesarKey(birthDate);
        const encrypted = CipherAlgorithms.caesarCipher(text, caesarKey);
        
        const bruteForceResults = CipherAlgorithms.bruteForceCaesar(encrypted);
        
        this.displayBruteForceResults(bruteForceResults, caesarKey);
        this.showResultsSection();
    }
    
    static handleAnalyze() {
        const text = document.getElementById('textToEncrypt').value;
        const lastName = document.getElementById('lastName').value;
        const birthDate = document.getElementById('birthDate').value;
        
        if (!text || text.length < 20) {
            alert('Будь ласка, введіть текст мінімум 20 символів!');
            return;
        }
        
        // Генерація ключів та шифрування
        const caesarKey = CipherAlgorithms.generateCaesarKey(birthDate);
        const vigenereKey = CipherAlgorithms.generateVigenereKey(lastName);
        
        const caesarEncrypted = CipherAlgorithms.caesarCipher(text, caesarKey);
        const vigenereEncrypted = CipherAlgorithms.vigenereCipher(text, vigenereKey);
        const rot13Encrypted = CipherAlgorithms.rot13Cipher(text);
        
        // Аналіз
        const analyses = [
            CipherAnalysis.analyzeCipher('Шифр Цезаря', text, caesarEncrypted, caesarKey),
            CipherAnalysis.analyzeCipher('Шифр Віженера', text, vigenereEncrypted, vigenereKey),
            CipherAnalysis.analyzeCipher('ROT13', text, rot13Encrypted, '13')
        ];
        
        const report = CipherAnalysis.generateComparisonReport(analyses);
        
        this.displayComparisonChart(report);
        this.showResultsSection();
    }
    
    static displayCipherResults(results) {
        const container = document.getElementById('cipherResults');
        
        let html = '';
        results.forEach(result => {
=======
    static caesarCipher(text, shift) {
        if (!text) return "";
        
        const ukrainianUpper = Alphabet.UKRAINIAN_UPPER;
        const ukrainianLower = Alphabet.UKRAINIAN_LOWER;
        
        return text
            .split("")
            .map((char) => {
                const upperIndex = ukrainianUpper.indexOf(char);
                if (upperIndex !== -1) {
                    const newIndex = (upperIndex + shift) % ukrainianUpper.length;
                        return ukrainianUpper[newIndex];
                }
                
                const lowerIndex = ukrainianLower.indexOf(char);
                if (lowerIndex !== -1) {
                    const newIndex = (lowerIndex + shift) % ukrainianLower.length;
                        return ukrainianLower[newIndex];
                }
                
                if (char >= "A" && char <= "Z") {
                    return String.fromCharCode(
                        ((char.charCodeAt(0) - 65 + shift) % 26) + 65
                    );
                }
                if (char >= "a" && char <= "z") {
                    return String.fromCharCode(
                        ((char.charCodeAt(0) - 97 + shift) % 26) + 97
                    );
                }
                
                return char;
            })
            .join("");
    }
    
    static caesarDecrypt(text, shift) {
        if (!text) return "";
        
        const ukrainianUpper = Alphabet.UKRAINIAN_UPPER;
        const ukrainianLower = Alphabet.UKRAINIAN_LOWER;

        return text
            .split("")
            .map((char) => {
                const upperIndex = ukrainianUpper.indexOf(char);
                if (upperIndex !== -1) {
                    const newIndex = (upperIndex - shift + ukrainianUpper.length) % ukrainianUpper.length;
                        return ukrainianUpper[newIndex];
                }
                
                const lowerIndex = ukrainianLower.indexOf(char);
                if (lowerIndex !== -1) {
                    const newIndex = (lowerIndex - shift + ukrainianLower.length) % ukrainianLower.length;
                        return ukrainianLower[newIndex];
                }
                
                if (char >= "A" && char <= "Z") {
                    return String.fromCharCode(
                        ((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65
                    );
                }
                if (char >= "a" && char <= "z") {
                    return String.fromCharCode(
                        ((char.charCodeAt(0) - 97 - shift + 26) % 26) + 97
                    );
                }
                
                return char;
            })
            .join("");
    }
    
    static vigenereCipher(text, key) {
        if (!text || !key) return "";
        
        const ukrainianUpper = "АБВГҐДЄЖЗИЙІЇКЛМНОПРСТУФХЦЧШЩЬЮЯ";
        const ukrainianLower = "абвгґдєжзийіїклмнопрстуфхцчшщьюя";
        const keyUpper = key.toUpperCase();
        let keyIndex = 0;
        
        return text
            .split("")
            .map((char) => {
                let shift = 0;
                const keyChar = keyUpper[keyIndex % keyUpper.length];
                
                const keyCharIndex = ukrainianUpper.indexOf(keyChar);
                if (keyCharIndex !== -1) {
                    shift = keyCharIndex;
                } else if (keyChar >= "A" && keyChar <= "Z") {
                    shift = keyChar.charCodeAt(0) - 65;
                }
                
                const upperIndex = ukrainianUpper.indexOf(char);
                if (upperIndex !== -1) {
                    const newIndex = (upperIndex + shift) % ukrainianUpper.length;
                    keyIndex++;
                        return ukrainianUpper[newIndex];
                    }
                
                const lowerIndex = ukrainianLower.indexOf(char);
                if (lowerIndex !== -1) {
                    const newIndex = (lowerIndex + shift) % ukrainianLower.length;
                    keyIndex++;
                        return ukrainianLower[newIndex];
                }
                
                if (char >= "A" && char <= "Z") {
                    const result = String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
                    keyIndex++;
                    return result;
                }
                if (char >= "a" && char <= "z") {
                    const result = String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
                    keyIndex++;
                    return result;
                }
                
                return char;
            })
            .join("");
    }
    
    static vigenereDecrypt(text, key) {
        if (!text || !key) return "";
        
        const ukrainianUpper = "АБВГҐДЄЖЗИЙІЇКЛМНОПРСТУФХЦЧШЩЬЮЯ";
        const ukrainianLower = "абвгґдєжзийіїклмнопрстуфхцчшщьюя";
        const keyUpper = key.toUpperCase();
        let keyIndex = 0;
        
        return text
            .split("")
            .map((char) => {
                let shift = 0;
                const keyChar = keyUpper[keyIndex % keyUpper.length];
                
                const keyCharIndex = ukrainianUpper.indexOf(keyChar);
                if (keyCharIndex !== -1) {
                    shift = keyCharIndex;
                } else if (keyChar >= "A" && keyChar <= "Z") {
                    shift = keyChar.charCodeAt(0) - 65;
                }
                
                const upperIndex = ukrainianUpper.indexOf(char);
                if (upperIndex !== -1) {
                    const newIndex = (upperIndex - shift + ukrainianUpper.length) % ukrainianUpper.length;
                    keyIndex++;
                        return ukrainianUpper[newIndex];
                    }
                
                const lowerIndex = ukrainianLower.indexOf(char);
                if (lowerIndex !== -1) {
                    const newIndex = (lowerIndex - shift + ukrainianLower.length) % ukrainianLower.length;
                    keyIndex++;
                        return ukrainianLower[newIndex];
                }
                
                if (char >= "A" && char <= "Z") {
                    const result = String.fromCharCode(
                        ((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65
                    );
                    keyIndex++;
                    return result;
                }
                if (char >= "a" && char <= "z") {
                    const result = String.fromCharCode(
                        ((char.charCodeAt(0) - 97 - shift + 26) % 26) + 97
                    );
                    keyIndex++;
                    return result;
                }
                
                return char;
            })
            .join("");
    }
}

class CryptoAnalysis {
    static bruteForceCaesar(encryptedText) {
        const results = [];
        for (let shift = 1; shift <= Alphabet.UKRAINIAN_COUNT; shift++) {
            const decrypted = CipherAlgorithms.caesarDecrypt(encryptedText, shift);
            const normalizedDecrypted = decrypted.toLowerCase();
            const chiSquare = CryptoAnalysis.calculateChiSquare(normalizedDecrypted);
            const score = CryptoAnalysis.calculateReadabilityScore(normalizedDecrypted);
            
            results.push({
                shift: shift,
                text: decrypted, 
                textNormalized: normalizedDecrypted,
                score: score,
                chiSquare: chiSquare
            });
        }

        return results.sort((a, b) => {
            if (Math.abs(b.score - a.score) > 0.0001) {
                return b.score - a.score;
            }
            return a.shift - b.shift;
        });
    }
    
    static frequencyAnalysis(text) {
        const normalizedText = text.toLowerCase();
        const frequencies = {};
        const totalLetters = normalizedText.replace(/[^а-яa-z]/g, '').length;
        
        for (let char of normalizedText) {
            if (/[а-яa-z]/.test(char)) {
                frequencies[char] = (frequencies[char] || 0) + 1;
            }
        }
        
        for (let char in frequencies) {
            frequencies[char] = totalLetters > 0 ? (frequencies[char] / totalLetters) * 100 : 0;
        }
        
        return frequencies;
    }
    
    static calculateReadabilityScore(text) {
        const normalizedText = text.toLowerCase();
        const chiSquare = this.calculateChiSquare(normalizedText);
        
        let score = 0;
        if (chiSquare < 100) {
            score = 50 - chiSquare * 0.3;
        } else if (chiSquare < 300) {
            score = 20 - (chiSquare - 100) * 0.1;
        } else {
            score = Math.max(0, 10 - (chiSquare - 300) * 0.02);
        }
        
        const ukrainianWords = [
            "та", "і", "в", "на", "з", "для", "що", "як", "але", "або", 
            "так", "не", "було", "буде", "може", "треба", "потрібно",
            "це", "той", "яка", "який", "які", "якій", "якої", "якого",
            "захист", "інформації", "важлива", "дисципліна", "текст",
            "система", "безпека", "дані", "ключ", "шифр", "розшифрування",
            "інформація", "важливий", "важливе", "важливі", "важливій",
            "дисципліни", "дисципліною", "дисципліні", "дисципліну"
        ];
        const words = normalizedText.split(/\s+/);
        const lowerText = normalizedText;
        
        let wordBonus = 0;
        ukrainianWords.forEach(word => {
            words.forEach(txtWord => {
                if (txtWord.includes(word) || word.includes(txtWord)) {
                    wordBonus += 5;
                }
            });
        });
        
        let exactWordBonus = 0;
        ukrainianWords.forEach(word => {
            if (words.includes(word)) {
                exactWordBonus += 10;
            }
        });
        
        const ukrainianBigrams = ["ст", "ін", "ці", "ль", "ня", "ва", "ви", "за", "ди"];
        let bigramBonus = 0;
        ukrainianBigrams.forEach(bigram => {
            const count = (lowerText.match(new RegExp(bigram, 'g')) || []).length;
            bigramBonus += count * 0.3;
        });
        
        const englishWords = [
            "the", "and", "or", "but", "for", "with", "this", "that", 
            "will", "can", "should", "would", "could", "have", "has", "had"
        ];
        let englishWordCount = 0;
        englishWords.forEach(word => {
            if (words.includes(word)) {
                englishWordCount++;
            }
        });
        let englishPenalty = 0;
        if (englishWordCount > 2) {
            englishPenalty = -15;
        }
        
        const ukrainianSpecific = ["і", "ї", "є", "ґ"];
        let specificBonus = 0;
        ukrainianSpecific.forEach(letter => {
            const count = (lowerText.match(new RegExp(letter, 'g')) || []).length;
            specificBonus += count * 2;
        });
        
        if (lowerText.includes("захист") || lowerText.includes("інформації") || 
            lowerText.includes("важлива") || lowerText.includes("дисципліна")) {
            exactWordBonus += 50;
        }
        
        const specialChars = (normalizedText.match(/[^а-яa-z\s]/g) || []).length;
        const specialCharRatio = normalizedText.length > 0 ? specialChars / normalizedText.length : 0;
        let specialPenalty = 0;
        if (specialCharRatio > 0.3) {
            specialPenalty = -10;
        }
        
        const spaceCount = (normalizedText.match(/\s/g) || []).length;
        let structureBonus = 0;
        if (spaceCount > 0) {
            structureBonus = Math.min(spaceCount * 0.2, 5);
        }
        
        let wordLengthBonus = 0;
        if (words.length > 0) {
            const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
            if (avgWordLength >= 4 && avgWordLength <= 8) {
                wordLengthBonus = 3;
            }
        }
        
        const bonus = wordBonus + exactWordBonus + bigramBonus + specificBonus + structureBonus + wordLengthBonus + englishPenalty + specialPenalty;
        const finalScore = score + bonus;
        
        return Math.max(0, finalScore);
    }
    
    
    static calculateChiSquare(text) {
        const expectedFrequencies = {
            'а': 8.1, 'б': 1.8, 'в': 4.5, 'г': 1.1, 'ґ': 0.1, 'д': 2.9, 'е': 5.4,
            'є': 0.4, 'ж': 0.8, 'з': 2.1, 'и': 6.4, 'і': 4.0, 'ї': 0.6, 'й': 1.1,
            'к': 3.4, 'л': 3.2, 'м': 3.1, 'н': 6.1, 'о': 9.0, 'п': 2.8, 'р': 4.1,
            'с': 4.9, 'т': 5.6, 'у': 2.8, 'ф': 0.2, 'х': 1.0, 'ц': 0.9, 'ч': 1.2,
            'ш': 0.6, 'щ': 0.4, 'ь': 1.8, 'ю': 0.6, 'я': 2.0
        };
        
        const normalizedText = text.toLowerCase();
        const actualFrequencies = this.frequencyAnalysis(normalizedText);
        const totalLetters = normalizedText.replace(/[^а-яa-z]/g, '').length;
        
        let chiSquare = 0;
        
        for (let char in expectedFrequencies) {
            const expected = expectedFrequencies[char];
            const actual = actualFrequencies[char] || 0;
            
            if (expected > 0.01) {
            chiSquare += Math.pow(actual - expected, 2) / expected;
            } else if (actual > 0) {
                chiSquare += actual * 10;
            }
        }
        
        if (totalLetters < 20) {
            chiSquare = chiSquare * (20 / Math.max(totalLetters, 1));
        }
        
        return chiSquare;
    }
}

class CipherUI {
    static init() {
        document
            .getElementById("encryptBtn")
            .addEventListener("click", this.handleEncrypt);
        document
            .getElementById("bruteForceBtn")
            .addEventListener("click", this.handleBruteForce);
    }
    
    static handleEncrypt() {
        const text = document.getElementById("textToEncrypt").value;
        const lastName = document.getElementById("lastName").value;
        const birthDate = document.getElementById("birthDate").value;
        
        if (!text || text.length < 20) {
            alert("Будь ласка, введіть текст мінімум 20 символів!");
            return;
        }

        if (!birthDate) {
            alert(
                "Будь ласка, введіть дату народження для генерації ключа Цезаря!"
            );
            return;
        }

        if (!lastName || lastName.trim() === "") {
            alert("Будь ласка, введіть прізвище для генерації ключа Віженера!");
            return;
        }
        
        const caesarKey = CipherAlgorithms.generateCaesarKey(birthDate);
        const vigenereKey = CipherAlgorithms.generateVigenereKey(lastName);
        
        const caesarEncrypted = CipherAlgorithms.caesarCipher(text, caesarKey);
        const vigenereEncrypted = CipherAlgorithms.vigenereCipher(
            text,
            vigenereKey
        );

        CipherUI.displayCipherResults([
            {
                name: "Шифр Цезаря",
                className: "caesar",
                original: text,
                encrypted: caesarEncrypted,
                key: caesarKey,
                decrypted: CipherAlgorithms.caesarDecrypt(
                    caesarEncrypted,
                    caesarKey
                ),
            },
            {
                name: "Шифр Віженера",
                className: "vigenere",
                original: text,
                encrypted: vigenereEncrypted,
                key: vigenereKey,
                decrypted: CipherAlgorithms.vigenereDecrypt(
                    vigenereEncrypted,
                    vigenereKey
                ),
            },
        ]);
        
        const header = document.querySelector('.analysis-header h2');
        if (header) {
            header.textContent = 'Результати шифрування';
        }
        
        CipherUI.showResultsSection();
    }
    
    static displayCipherResults(results) {
        const container = document.getElementById("analysisContent");
        
        let html = "";
        results.forEach((result) => {
>>>>>>> 7bb6a037622aaf5f3b58404ca232173012e5be10
            html += `
                <div class="cipher-card ${result.className}">
                    <div class="cipher-title">${result.name}</div>
                    <div class="cipher-info">
                        <div class="info-item">
                            <div class="info-label">Ключ:</div>
                            <div class="info-value">${result.key}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Довжина ключа:</div>
<<<<<<< HEAD
                            <div class="info-value">${result.key.toString().length} символів</div>
=======
                            <div class="info-value">${
                                result.key.toString().length
                            } символів</div>
>>>>>>> 7bb6a037622aaf5f3b58404ca232173012e5be10
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Оригінальний текст:</div>
                        <div class="text-display">${result.original}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Зашифрований текст:</div>
                        <div class="text-display">${result.encrypted}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Розшифрований текст:</div>
                        <div class="text-display">${result.decrypted}</div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
<<<<<<< HEAD
    }
    
    static displayBruteForceResults(results, originalKey) {
        const container = document.getElementById('bruteForceResults');
        
        let html = `
            <div class="brute-force-title">🔍 Brute Force аналіз шифру Цезаря</div>
            <p>Спроба розшифрувати текст всіма можливими зсувами (1-25). Результати відсортовані за читабельністю:</p>
        `;
        
        results.slice(0, 10).forEach((result, index) => {
            const isCorrect = result.shift === originalKey;
            html += `
                <div class="brute-force-item ${isCorrect ? 'correct' : ''}">
                    <div class="brute-force-key">
                        Зсув ${result.shift} ${isCorrect ? '(ПРАВИЛЬНИЙ КЛЮЧ!)' : ''} 
                        - Читабельність: ${result.readability.toFixed(2)}
                    </div>
                    <div class="brute-force-text">${result.text}</div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    static displayComparisonChart(report) {
        const container = document.getElementById('comparisonChart');
        
        let html = `
            <div class="chart-title">📊 Порівняльний аналіз алгоритмів шифрування</div>
            
            <div class="analysis-summary">
                <h4>Загальна статистика:</h4>
                <ul>
                    <li>Найбезпечніший алгоритм: <strong>${report.summary.mostSecure.name}</strong> (ентропія: ${report.summary.mostSecure.entropy.toFixed(2)})</li>
                    <li>Найменш читабельний: <strong>${report.summary.leastReadable.name}</strong></li>
                    <li>Середня ентропія: <strong>${report.summary.averageEntropy.toFixed(2)}</strong></li>
                </ul>
            </div>
            
            <table class="analysis-table">
                <thead>
                    <tr>
                        <th>Алгоритм</th>
                        <th>Ключ</th>
                        <th>Ентропія</th>
                        <th>Читабельність</th>
                        <th>Повторення символів</th>
                        <th>Рівень безпеки</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        report.details.forEach(analysis => {
            const securityLevel = analysis.entropy > 4 ? 'high' : analysis.entropy > 3 ? 'medium' : 'low';
            const securityText = securityLevel === 'high' ? 'Високий' : securityLevel === 'medium' ? 'Середній' : 'Низький';
            
            html += `
                <tr>
                    <td><strong>${analysis.name}</strong></td>
                    <td>${analysis.key}</td>
                    <td>${analysis.entropy.toFixed(2)}</td>
                    <td>${analysis.readability.toFixed(2)}</td>
                    <td>${analysis.patternAnalysis.repeatedChars}</td>
                    <td><span class="strength-indicator strength-${securityLevel}">${securityText}</span></td>
=======
        
        this.displayComparisonAnalysis(results);
    }
    
    static displayComparisonAnalysis(results) {
        const container = document.getElementById("cipherResults");
        
        let analysisHtml = `
            <div class="comparison-analysis">
                <h3>Порівняльний аналіз алгоритмів</h3>
                <div class="analysis-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Алгоритм</th>
                                <th>Ключ</th>
                                <th>Довжина ключа</th>
                                <th>Довжина результату</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        results.forEach((result) => {
            analysisHtml += `
                <tr>
                    <td><strong>${result.name}</strong></td>
                    <td>${result.key}</td>
                    <td>${result.key.toString().length} символів</td>
                    <td>${result.encrypted.length} символів</td>
>>>>>>> 7bb6a037622aaf5f3b58404ca232173012e5be10
                </tr>
            `;
        });
        
<<<<<<< HEAD
        html += `
                </tbody>
            </table>
        `;
        
        // Додаємо графік
        html += `
            <div style="margin-top: 30px;">
                <canvas id="entropyChart" width="400" height="200"></canvas>
=======
        analysisHtml += `
                        </tbody>
                    </table>
                </div>
                
                <div class="analysis-summary">
                    <h4>Висновки про стійкість:</h4>
                    <ul>
                        <li><strong>Шифр Цезаря</strong> - найпростіший у використанні, але найменш безпечний. Використовує фіксований зсув, що робить його вразливим до частотного аналізу та brute force атак. Легко зламати перебором всіх можливих зсувів (1-32 для українського алфавіту).</li>
                        <li><strong>Шифр Віженера</strong> - середня складність, краща безпека завдяки поліалфавітному принципу. Використовує ключове слово для створення різних зсувів, що ускладнює частотний аналіз. Стійкість залежить від довжини та складності ключа.</li>
                    </ul>
                </div>
            </div>
        `;
        
        container.innerHTML += analysisHtml;
    }
    
    
    
    static showResultsSection() {
        document.getElementById("analysisSection").classList.add("show");
        document
            .getElementById("analysisSection")
            .scrollIntoView({ behavior: "smooth" });
    }
    
    static handleBruteForce() {
        const text = document.getElementById("textToEncrypt").value;
        
        if (!text || text.length < 20) {
            alert("Будь ласка, введіть текст мінімум 20 символів!");
            return;
        }
        
        try {
            const normalizedText = text.toLowerCase();
            const readability = CryptoAnalysis.calculateReadabilityScore(normalizedText);
            
            let encryptedText = text;
            let correctShift = null;
            
            if (readability > 50) {
                const fixedShift = 13;
                encryptedText = CipherAlgorithms.caesarCipher(text, fixedShift);
                correctShift = fixedShift;
            }

            const results = CryptoAnalysis.bruteForceCaesar(encryptedText);
                        
            CipherUI.displayBruteForceResults(encryptedText, results, correctShift);
            CipherUI.showAnalysisSection();
        } catch (error) {
            alert("Помилка при виконанні brute force аналізу: " + error.message);
        }
    }
    
    
    static displayBruteForceResults(encryptedText, results, correctShift) {
        const container = document.getElementById("analysisContent");
        
        const header = document.querySelector('.analysis-header h2');
        if (header) {
            header.textContent = 'Brute Force аналіз';
        }
        
        const correctShiftNum = correctShift !== null ? Number(correctShift) : null;
        const bestResult = results[0];

        const isFound = bestResult.score > 30;

        const correctResult = correctShiftNum !== null ? 
            results.find(result => {
                const shiftNum = Number(result.shift);
                const matches = shiftNum === correctShiftNum;
  
                return matches;
            }) : null;
        const foundCorrect = correctResult !== null;
        
        let html = `
            <div class="brute-force-results">
                <h3>Brute Force атака на шифр Цезаря</h3>
                <p><strong>Зашифрований текст:</strong> ${encryptedText}</p>
                ${correctShiftNum !== null ? `<p><strong>Правильний зсув:</strong> ${correctShiftNum}</p>` : ''}
                <div class="brute-force-status ${isFound ? 'success' : 'warning'}">
                    ${isFound ? 
                        `✅ Знайдено! Найкращий варіант: зсув ${bestResult.shift} (оцінка: ${bestResult.score.toFixed(1)})` : 
                        `⚠️ Не вдалося точно визначити. Найкращий варіант: зсув ${bestResult.shift} (оцінка: ${bestResult.score.toFixed(1)})`
                    }
                    ${foundCorrect ? 
                        ` <span style="color: green;">✓ Правильний зсув ${correctShiftNum} знайдено! (оцінка: ${correctResult.score.toFixed(1)})</span>` : 
                        correctShiftNum !== null ? ` <span style="color: red;">✗ Правильний зсув ${correctShiftNum} не знайдено</span>` : ''
                    }
                </div>
                <div class="brute-force-list">
        `;
        
        let displayResults = results
        displayResults.forEach((result, index) => {
            const resultShiftNum = Number(result.shift);
            const isCorrect = correctShiftNum !== null && resultShiftNum === correctShiftNum;
            const isBest = index === 0;
            const scoreClass = result.score > 30 ? 'score-high' : result.score > 20 ? 'score-medium' : 'score-low';
            
            html += `
                <div class="brute-force-item ${isCorrect ? 'correct' : ''} ${isBest ? 'best' : ''}">
                    <div class="brute-force-shift">
                        ${isCorrect ? '<span style="color: green; font-weight: bold;">✓ </span>' : ''}
                        Зсув ${result.shift}
                        ${isCorrect ? ' <span style="color: green; font-weight: bold;">(ПРАВИЛЬНИЙ)</span>' : ''}
                    </div>
                    <div class="brute-force-text">${result.text}</div>
                    <div class="brute-force-score ${scoreClass}">
                        ${result.score.toFixed(1)}
                        ${result.chiSquare !== undefined ? `<br><small style="opacity: 0.7;">χ²: ${result.chiSquare.toFixed(1)}</small>` : ''}
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
                <div class="brute-force-summary">
                    <h4>Аналіз результатів:</h4>
                    <ul>
                        <li>Перевірено ${Alphabet.UKRAINIAN_COUNT} варіантів зсуву (1-${Alphabet.UKRAINIAN_COUNT})</li>
                        <li>Найвища оцінка читабельності: ${bestResult.score.toFixed(1)}</li>
                        <li>Рекомендований зсув: ${bestResult.shift}</li>
                        <li>Розшифрований текст: "${bestResult.text}"</li>
                        ${correctShiftNum !== null ? `<li>${foundCorrect ? '✓' : '✗'} Правильний зсув ${correctShiftNum}: ${foundCorrect ? `знайдено (оцінка: ${correctResult.score.toFixed(1)})` : 'не знайдено'}</li>` : ''}
                    </ul>
                </div>
>>>>>>> 7bb6a037622aaf5f3b58404ca232173012e5be10
            </div>
        `;
        
        container.innerHTML = html;
<<<<<<< HEAD
        
        // Створюємо графік
        this.createEntropyChart(report.details);
    }
    
    static createEntropyChart(analyses) {
        const ctx = document.getElementById('entropyChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: analyses.map(a => a.name),
                datasets: [{
                    label: 'Ентропія',
                    data: analyses.map(a => a.entropy),
                    backgroundColor: ['#667eea', '#f093fb', '#4facfe'],
                    borderColor: ['#5568d3', '#e879f9', '#3b82f6'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Порівняння ентропії алгоритмів шифрування'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Ентропія (біти)'
                        }
                    }
                }
            }
        });
    }
    
    static showResultsSection() {
        document.getElementById('resultsSection').classList.add('show');
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    }
}

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    CipherUI.init();
    
    // Встановлюємо дату за замовчуванням
    const today = new Date();
    const defaultDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
    document.getElementById('birthDate').value = defaultDate.toISOString().split('T')[0];
    
    // Додаємо приклад тексту
    document.getElementById('textToEncrypt').value = 'Захист інформації – важлива дисципліна в сучасному світі кібербезпеки та криптографії.';
});
=======
    }
    
    
    
    
    
    static showAnalysisSection() {
        document.getElementById("analysisSection").classList.add("show");
        document
            .getElementById("analysisSection")
            .scrollIntoView({ behavior: "smooth" });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    CipherUI.init();

    const today = new Date();
    const defaultDate = new Date(
        today.getFullYear() - 20,
        today.getMonth(),
        today.getDate()
    );
    document.getElementById("birthDate").value = defaultDate
        .toISOString()
        .split("T")[0];

    document.getElementById("textToEncrypt").value =
        "Захист інформації – важлива дисципліна";

    updateCharCounter();
});

function updateCharCounter() {
    const textarea = document.getElementById("textToEncrypt");
    const counter = document.getElementById("charCount");
    
    if (textarea && counter) {
        textarea.addEventListener("input", () => {
            counter.textContent = textarea.value.length;
        });
        
        counter.textContent = textarea.value.length;
    }
}
>>>>>>> 7bb6a037622aaf5f3b58404ca232173012e5be10
