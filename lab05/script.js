let encryptionKey = null;
let encryptionKeyBytes = null;

async function generateKeyFromData(email, name, year) {
    const keyString = `${email}${name}${year}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(keyString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return new Uint8Array(hashBuffer);
}

async function generateKey() {
    const email = document.getElementById('email').value.trim();
    const name = document.getElementById('name').value.trim();
    const year = document.getElementById('year').value.trim();
    
    if (!email || !name || !year) {
        alert('Будь ласка, заповніть всі поля персональних даних!');
        return;
    }
    
    try {
        encryptionKeyBytes = await generateKeyFromData(email, name, year);
        encryptionKey = Array.from(encryptionKeyBytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        
        document.getElementById('encryptionKey').textContent = encryptionKey;
        document.getElementById('keyResult').style.display = 'block';
        document.getElementById('encryptBtn').disabled = false;
        document.getElementById('decryptKey').value = encryptionKey;
        
        showNotification('Ключ успішно згенеровано!', 'success');
    } catch (error) {
        showNotification('Помилка при генерації ключа: ' + error.message, 'error');
    }
}

async function encryptMessage() {
    if (!encryptionKeyBytes) {
        alert('Спочатку згенеруйте ключ!');
        return;
    }
    
    const message = document.getElementById('messageToEncrypt').value.trim();
    
    if (!message) {
        alert('Будь ласка, введіть текст повідомлення!');
        return;
    }
    
    try {
        const encoder = new TextEncoder();
        const messageData = encoder.encode(message);
        
        const key = await crypto.subtle.importKey(
            'raw',
            encryptionKeyBytes,
            { name: 'AES-CBC' },
            false,
            ['encrypt']
        );
        
        const iv = crypto.getRandomValues(new Uint8Array(16));
        
        const encryptedData = await crypto.subtle.encrypt(
            {
                name: 'AES-CBC',
                iv: iv
            },
            key,
            messageData
        );
        
        const encryptedArray = new Uint8Array(encryptedData);
        const combined = new Uint8Array(iv.length + encryptedArray.length);
        combined.set(iv, 0);
        combined.set(encryptedArray, iv.length);
        
        const base64 = btoa(String.fromCharCode(...combined));
        const formattedBase64 = base64.match(/.{1,64}/g).join('\n');
        
        document.getElementById('encryptedMessage').textContent = formattedBase64;
        document.getElementById('encryptResult').style.display = 'block';
        document.getElementById('encryptedInput').value = base64;
        
        showNotification('Повідомлення успішно зашифровано!', 'success');
    } catch (error) {
        showNotification('Помилка при шифруванні: ' + error.message, 'error');
    }
}

async function decryptMessage() {
    const encryptedBase64 = document.getElementById('encryptedInput').value.trim();
    const keyString = document.getElementById('decryptKey').value.trim();
    
    if (!encryptedBase64 || !keyString) {
        alert('Будь ласка, заповніть всі поля!');
        return;
    }
    
    try {
        const keyBytes = new Uint8Array(
            keyString.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
        );
        
        if (keyBytes.length !== 32) {
            alert('Ключ має бути 64 hex-символи (32 байти)!');
            return;
        }
        
        const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
        const iv = combined.slice(0, 16);
        const encryptedData = combined.slice(16);
        
        const key = await crypto.subtle.importKey(
            'raw',
            keyBytes,
            { name: 'AES-CBC' },
            false,
            ['decrypt']
        );
        
        const decryptedData = await crypto.subtle.decrypt(
            {
                name: 'AES-CBC',
                iv: iv
            },
            key,
            encryptedData
        );
        
        const decoder = new TextDecoder();
        const decryptedMessage = decoder.decode(decryptedData);
        
        document.getElementById('decryptedMessage').textContent = decryptedMessage;
        document.getElementById('decryptResult').style.display = 'block';
        
        showNotification('Повідомлення успішно розшифровано!', 'success');
    } catch (error) {
        showNotification('Помилка при розшифруванні: ' + error.message, 'error');
        document.getElementById('decryptResult').style.display = 'block';
        document.getElementById('decryptedMessage').textContent = 'Помилка: невірний ключ або пошкоджені дані';
        document.getElementById('decryptedMessage').style.background = '#f8d7da';
        document.getElementById('decryptedMessage').style.borderColor = '#f5c6cb';
        document.getElementById('decryptedMessage').style.color = '#721c24';
    }
}

async function demoEncrypt(userNum) {
    const name = document.getElementById(`user${userNum}Name`).value.trim();
    const year = document.getElementById(`user${userNum}Year`).value.trim();
    const message = document.getElementById(`user${userNum}Message`).value.trim();
    
    if (!name || !year || !message) {
        alert('Заповніть всі поля!');
        return;
    }
    
    try {
        const email = `${name.toLowerCase()}@example.com`;
        const keyBytes = await generateKeyFromData(email, name, year);
        
        const encoder = new TextEncoder();
        const messageData = encoder.encode(message);
        
        const key = await crypto.subtle.importKey(
            'raw',
            keyBytes,
            { name: 'AES-CBC' },
            false,
            ['encrypt']
        );
        
        const iv = crypto.getRandomValues(new Uint8Array(16));
        const encryptedData = await crypto.subtle.encrypt(
            { name: 'AES-CBC', iv: iv },
            key,
            messageData
        );
        
        const encryptedArray = new Uint8Array(encryptedData);
        const combined = new Uint8Array(iv.length + encryptedArray.length);
        combined.set(iv, 0);
        combined.set(encryptedArray, iv.length);
        
        const base64 = btoa(String.fromCharCode(...combined));
        
        if (userNum === 1) {
            document.getElementById('user2Encrypted').value = base64;
            document.getElementById('user1Result').innerHTML = 
                `<strong>Зашифровано:</strong><br><code style="font-size: 10px;">${base64.substring(0, 100)}...</code>`;
        }
        
        showNotification(`Повідомлення користувача ${userNum} зашифровано!`, 'success');
    } catch (error) {
        showNotification('Помилка: ' + error.message, 'error');
    }
}

async function demoDecrypt(userNum) {
    const encryptedBase64 = document.getElementById(`user${userNum}Encrypted`).value.trim();
    
    if (!encryptedBase64) {
        alert('Введіть зашифроване повідомлення!');
        return;
    }
    
    const senderName = document.getElementById('user1Name').value.trim();
    const senderYear = document.getElementById('user1Year').value.trim();
    
    if (!senderName || !senderYear) {
        alert('Користувач 1 має заповнити свої дані для шифрування!');
        return;
    }
    
    try {
        const email = `${senderName.toLowerCase()}@example.com`;
        const keyBytes = await generateKeyFromData(email, senderName, senderYear);
        
        const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
        const iv = combined.slice(0, 16);
        const encryptedData = combined.slice(16);
        
        const key = await crypto.subtle.importKey(
            'raw',
            keyBytes,
            { name: 'AES-CBC' },
            false,
            ['decrypt']
        );
        
        const decryptedData = await crypto.subtle.decrypt(
            { name: 'AES-CBC', iv: iv },
            key,
            encryptedData
        );
        
        const decoder = new TextDecoder();
        const decryptedMessage = decoder.decode(decryptedData);
        
        document.getElementById('user2Result').innerHTML = 
            `<strong>Розшифровано:</strong><br><div style="color: #155724; font-weight: 500;">${decryptedMessage}</div>`;
        
        showNotification('Повідомлення успішно розшифровано!', 'success');
    } catch (error) {
        document.getElementById('user2Result').innerHTML = 
            `<strong>Помилка:</strong> Невірний ключ або пошкоджені дані`;
        showNotification('Помилка при розшифруванні!', 'error');
    }
}

function copyEncrypted() {
    const encrypted = document.getElementById('encryptedMessage').textContent.replace(/\n/g, '');
    navigator.clipboard.writeText(encrypted).then(() => {
        showNotification('Зашифроване повідомлення скопійовано!', 'success');
    });
}

function downloadEncrypted() {
    const encrypted = document.getElementById('encryptedMessage').textContent.replace(/\n/g, '');
    const blob = new Blob([encrypted], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'encrypted_message.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Файл завантажено!', 'success');
}

function downloadKey() {
    if (!encryptionKey) {
        alert('Спочатку згенеруйте ключ!');
        return;
    }
    
    const email = document.getElementById('email').value || 'user';
    const keyContent = `Ключ шифрування для: ${email}\n\nКлюч:\n${encryptionKey}\n\nУВАГА: Не діліться цим ключем!`;
    
    const blob = new Blob([keyContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'encryption_key.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Ключ завантажено!', 'success');
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

