let privateKey = null;
let publicKey = null;
let currentSignature = null;
let currentDocumentHash = null;

async function generatePrivateKey(name, birthDate, secretWord) {
    const keyString = `${name}${birthDate}${secretWord}`;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(keyString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    const privateKeyInt = parseInt(hashHex.substring(0, 16), 16) % 1000007;
    
    return privateKeyInt;
}


function generatePublicKey(privKey) {
    return (privKey * 7) % 1000007;
}

async function generateKeys() {
    const name = document.getElementById('name').value.trim();
    const birthDate = document.getElementById('birthDate').value.trim();
    const secretWord = document.getElementById('secretWord').value.trim();
    
    if (!name || !birthDate || !secretWord) {
        alert('Будь ласка, заповніть всі поля персональних даних!');
        return;
    }
    
    try {
        privateKey = await generatePrivateKey(name, birthDate, secretWord);
        publicKey = generatePublicKey(privateKey);
        document.getElementById('privateKey').textContent = privateKey;
        document.getElementById('publicKey').textContent = publicKey;
        document.getElementById('keysResult').style.display = 'block';
        document.getElementById('signBtn').disabled = false;
        document.getElementById('verifyPublicKey').value = publicKey;
        
        showNotification('Пара ключів успішно згенерована!', 'success');
    } catch (error) {
        showNotification('Помилка при генерації ключів: ' + error.message, 'error');
    }
}

async function createDocumentHash(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function signDocument() {
    if (!privateKey) {
        alert('Спочатку згенеруйте пару ключів!');
        return;
    }
    
    const documentText = document.getElementById('documentText').value.trim();
    
    if (!documentText) {
        alert('Будь ласка, введіть текст документа!');
        return;
    }
    
    try {
        const documentHash = await createDocumentHash(documentText);
        currentDocumentHash = documentHash;
        const hashHex16 = documentHash.substring(0, 16);
        const hashBigInt = BigInt('0x' + hashHex16);
        const privateKeyBigInt = BigInt(privateKey);
        const signatureBigInt = hashBigInt ^ privateKeyBigInt;
        const signature = signatureBigInt.toString(16);
        currentSignature = signature;
        document.getElementById('documentHash').textContent = documentHash;
        document.getElementById('signature').textContent = signature;
        document.getElementById('signResult').style.display = 'block';
        document.getElementById('verifyDocumentText').value = documentText;
        document.getElementById('verifySignature').value = signature;
        
        showNotification('Документ успішно підписано!', 'success');
    } catch (error) {
        showNotification('Помилка при підписанні: ' + error.message, 'error');
    }
}

async function verifySignature() {
    const documentText = document.getElementById('verifyDocumentText').value.trim();
    const signatureHex = document.getElementById('verifySignature').value.trim();
    const publicKeyInput = document.getElementById('verifyPublicKey').value.trim();
    
    if (!documentText || !signatureHex || !publicKeyInput) {
        alert('Будь ласка, заповніть всі поля для перевірки!');
        return;
    }
    
    try {
        const publicKeyInt = parseInt(publicKeyInput);
        
        if (isNaN(publicKeyInt)) {
            alert('Публічний ключ має бути числом!');
            return;
        }
        
        const currentHash = await createDocumentHash(documentText);
        const currentHashHex16 = currentHash.substring(0, 16);
        const signatureBigInt = BigInt('0x' + signatureHex);
        
        let decryptedSignatureBigInt;
        let usedPrivateKey;
        if (privateKey && publicKeyInt === publicKey) {
            usedPrivateKey = privateKey;
            const privateKeyBigInt = BigInt(privateKey);
            decryptedSignatureBigInt = signatureBigInt ^ privateKeyBigInt;
        } else {
            let privateKeyFromPublic = null;
            for (let i = 0; i < 1000007; i++) {
                if ((i * 7) % 1000007 === publicKeyInt) {
                    privateKeyFromPublic = i;
                    break;
                }
            }
            if (privateKeyFromPublic === null) {
                alert('Неможливо відновити приватний ключ з публічного!');
                return;
            }
            usedPrivateKey = privateKeyFromPublic;
            const privateKeyBigInt = BigInt(privateKeyFromPublic);
            decryptedSignatureBigInt = signatureBigInt ^ privateKeyBigInt;
        }
        
        const decryptedHex = decryptedSignatureBigInt.toString(16).padStart(16, '0');
        const expectedHex = currentHashHex16;
        
        const isValid = (decryptedHex === expectedHex);
        const resultBox = document.getElementById('verifyResult');
        const statusBox = document.getElementById('verifyStatus');
        
        if (isValid) {
            statusBox.className = 'status-box status-valid';
            statusBox.innerHTML = 'Підпис ДІЙСНИЙ!<br><small>Документ не змінено після підписання</small>';
            showNotification('Підпис дійсний!', 'success');
        } else {
            statusBox.className = 'status-box status-invalid';
            const originalHash = currentDocumentHash ? currentDocumentHash.substring(0, 16) : 'N/A';
            statusBox.innerHTML = 'Підпис ПІДРОБЛЕНИЙ або документ змінено!<br>' +
                '<small><strong>Очікуваний хеш (перші 16 символів):</strong> ' + expectedHex + '<br>' +
                '<strong>Розшифрований підпис:</strong> ' + decryptedHex + '<br>' +
                '<strong>Оригінальний хеш (при підписанні):</strong> ' + originalHash + '<br>' +
                '<strong>Поточний хеш документа:</strong> ' + currentHashHex16 + '</small>';
            showNotification('Підпис недійсний!', 'error');
        }
        
        resultBox.style.display = 'block';
    } catch (error) {
        showNotification('Помилка при перевірці: ' + error.message, 'error');
    }
}

async function demonstrateTampering() {
    const originalText = document.getElementById('documentText').value.trim();
    
    if (!originalText) {
        alert('Спочатку введіть документ для підписання!');
        return;
    }
    
    if (!currentSignature || !publicKey) {
        alert('Спочатку підпишіть документ!');
        return;
    }
    
    try {
        const resultBox = document.getElementById('tamperResult');
        const modifiedText = originalText + '\n\n[МОДИФІКОВАНО] Додано новий текст після підписання.';
        const modifiedHash = await createDocumentHash(modifiedText);
        const modifiedHashHex16 = modifiedHash.substring(0, 16);
        const signatureBigInt = BigInt('0x' + currentSignature);
        const privateKeyBigInt = BigInt(privateKey);
        const decryptedSignatureBigInt = signatureBigInt ^ privateKeyBigInt;
        const decryptedHex = decryptedSignatureBigInt.toString(16).padStart(16, '0');
        
        const isValid = (decryptedHex === modifiedHashHex16);
        
        let html = '<h3>Результати демонстрації:</h3>';
        html += '<div class="info-box">';
        html += '<strong>Оригінальний документ:</strong><br>';
        html += '<pre style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin-top: 10px;">' + 
                escapeHtml(originalText.substring(0, 200)) + '...</pre>';
        html += '</div>';
        
        html += '<div class="info-box">';
        html += '<strong>Модифікований документ:</strong><br>';
        html += '<pre style="background: #fff3cd; padding: 10px; border-radius: 5px; margin-top: 10px;">' + 
                escapeHtml(modifiedText.substring(0, 200)) + '...</pre>';
        html += '</div>';
        
        html += '<div class="info-box">';
        html += '<strong>Оригінальний хеш:</strong><br>';
        html += '<code>' + (currentDocumentHash || 'N/A') + '</code>';
        html += '</div>';
        
        html += '<div class="info-box">';
        html += '<strong>Хеш модифікованого документа:</strong><br>';
        html += '<code>' + modifiedHash + '</code>';
        html += '</div>';
        
        if (!isValid) {
            html += '<div class="status-box status-invalid" style="margin-top: 15px;">';
            html += 'Система успішно виявила зміни в документі!<br>';
            html += '<small>Хеші не співпадають, що означає, що документ було змінено після підписання.</small>';
            html += '</div>';
        }
        
        resultBox.innerHTML = html;
        resultBox.style.display = 'block';
        document.getElementById('verifyDocumentText').value = modifiedText;
        
        showNotification('Демонстрація завершена!', 'success');
    } catch (error) {
        showNotification('Помилка при демонстрації: ' + error.message, 'error');
    }
}

function downloadKeys() {
    if (!privateKey || !publicKey) {
        alert('Спочатку згенеруйте ключі!');
        return;
    }
    
    const name = document.getElementById('name').value || 'User';
    const birthDate = document.getElementById('birthDate').value || '';
    const privateKeyContent = `Приватний ключ для: ${name}
Дата народження: ${birthDate}
Ключ: ${privateKey}

УВАГА: Цей файл містить приватний ключ! Не діліться ним!`;
    const publicKeyContent = `Публічний ключ для: ${name}
Дата народження: ${birthDate}
Ключ: ${publicKey}

Цей ключ можна публікувати для перевірки підписів`;
    downloadFile('private_key.txt', privateKeyContent);
    downloadFile('public_key.txt', publicKeyContent);
    
    showNotification('Ключі завантажено!', 'success');
}

function downloadSignature() {
    if (!currentSignature || !currentDocumentHash) {
        alert('Спочатку підпишіть документ!');
        return;
    }
    
    const name = document.getElementById('name').value || 'User';
    const documentText = document.getElementById('documentText').value;
    
    const signatureContent = `Цифровий підпис
Автор: ${name}
Дата створення: ${new Date().toLocaleString('uk-UA')}

Підпис: ${currentSignature}
Хеш документа (SHA-256): ${currentDocumentHash}

Документ:
${documentText}`;
    
    downloadFile('signature.txt', signatureContent);
    showNotification('Підпис завантажено!', 'success');
}

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    
    if (type === 'success') {
        notification.style.background = '#28a745';
    } else {
        notification.style.background = '#dc3545';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

