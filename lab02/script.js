// Класичні алгоритми шифрування
class CipherAlgorithms {
    
    // Генерація ключа для шифру Цезаря на основі дати народження
    static generateCaesarKey(birthDate) {
        if (!birthDate) return 7; // Значення за замовчуванням
        
        const date = new Date(birthDate);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        
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
        if (key.length < 3) {
            key = key.repeat(Math.ceil(3 / key.length));
        }
        
        return key;
    }
    
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
                            <div class="info-value">${result.key.toString().length} символів</div>
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
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
        
        // Додаємо графік
        html += `
            <div style="margin-top: 30px;">
                <canvas id="entropyChart" width="400" height="200"></canvas>
            </div>
        `;
        
        container.innerHTML = html;
        
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
