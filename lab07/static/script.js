let timeChart = null;
let sizeChart = null;

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatTime(seconds) {
    if (seconds < 0.001) return (seconds * 1000000).toFixed(2) + ' μs';
    if (seconds < 1) return (seconds * 1000).toFixed(2) + ' ms';
    return seconds.toFixed(4) + ' s';
}

async function protectFile() {
    const fileInput = document.getElementById('fileInput');
    const imageInput = document.getElementById('imageInput');
    const name = document.getElementById('name').value.trim();
    const year = document.getElementById('year').value.trim();
    
    if (!fileInput.files[0] || !imageInput.files[0]) {
        alert('Виберіть файл та зображення!');
        return;
    }
    
    if (!name || !year) {
        alert('Заповніть персональні дані!');
        return;
    }
    
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('image', imageInput.files[0]);
    formData.append('name', name);
    formData.append('year', year);
    
    try {
        showLoading('protectResult', 'Обробка файлу...');
        
        const response = await fetch('/protect', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        const resultBox = document.getElementById('protectResult');
        const metricsDiv = document.getElementById('protectMetrics');
        const filesDiv = document.getElementById('protectFiles');
        
        const loadingMsg = resultBox.querySelector('#loadingMessage');
        if (loadingMsg) {
            loadingMsg.remove();
        }
        
        if (data.success) {
            let metricsHtml = '<h3>Метрики обробки:</h3>';
            metricsHtml += '<div class="metrics-grid">';
            metricsHtml += `<div class="metric-box"><strong>Час шифрування</strong><div class="value">${formatTime(data.metrics.encryption_time)}</div></div>`;
            metricsHtml += `<div class="metric-box"><strong>Час стеганографії</strong><div class="value">${formatTime(data.metrics.steganography_time)}</div></div>`;
            metricsHtml += `<div class="metric-box"><strong>Загальний час</strong><div class="value">${formatTime(data.metrics.total_time)}</div></div>`;
            metricsHtml += `<div class="metric-box"><strong>Розмір оригіналу</strong><div class="value">${formatBytes(data.metrics.original_file_size)}</div></div>`;
            metricsHtml += `<div class="metric-box"><strong>Розмір зашифрованого</strong><div class="value">${formatBytes(data.metrics.encrypted_file_size)}</div></div>`;
            metricsHtml += `<div class="metric-box"><strong>Розмір зображення</strong><div class="value">${formatBytes(data.metrics.original_image_size)}</div></div>`;
            metricsHtml += `<div class="metric-box"><strong>Розмір захищеного</strong><div class="value">${formatBytes(data.metrics.protected_image_size)}</div></div>`;
            metricsHtml += '</div>';
            
            let filesHtml = '<h3 style="margin-top: 20px;">Створені файли:</h3>';
            const protectedImageName = data.protected_image.split('/').pop();
            const encryptedFileName = data.encrypted_file.split('/').pop();
            filesHtml += `<a href="/download/${protectedImageName}" class="file-link" download>Завантажити захищене зображення</a>`;
            filesHtml += `<a href="/download/${encryptedFileName}" class="file-link" download>Завантажити зашифрований файл</a>`;
            
            if (metricsDiv) {
                metricsDiv.innerHTML = metricsHtml;
            }
            if (filesDiv) {
                filesDiv.innerHTML = filesHtml;
            }
            resultBox.style.display = 'block';
            
            showNotification('Файл успішно захищено!', 'success');
            loadAnalytics();
        } else {
            const loadingMsg = resultBox.querySelector('#loadingMessage');
            if (loadingMsg) {
                loadingMsg.remove();
            }
            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = `<p style="color: #dc3545;"><strong>Помилка:</strong> ${escapeHtml(data.error)}</p>`;
            resultBox.appendChild(errorDiv);
            resultBox.style.display = 'block';
            showNotification('Помилка при захисті файлу!', 'error');
        }
    } catch (error) {
        alert('Помилка: ' + error.message);
    }
}

async function recoverFile() {
    const protectedImageInput = document.getElementById('protectedImageInput');
    const name = document.getElementById('name').value.trim();
    const year = document.getElementById('year').value.trim();
    
    if (!protectedImageInput.files[0]) {
        alert('Виберіть захищене зображення!');
        return;
    }
    
    const filename = protectedImageInput.files[0].name.toLowerCase();
    if (filename.includes('.bin') || filename.includes('encrypted')) {
        alert('Помилка: Ви вибрали зашифрований файл (.bin).\n\nДля відновлення потрібно завантажити ЗАХИЩЕНЕ ЗОБРАЖЕННЯ (protected_*.png), яке було створено на етапі захисту файлу.\n\nЗашифрований файл (*_encrypted.bin) використовується тільки для зберігання, а не для відновлення.');
        return;
    }
    
    if (!name || !year) {
        alert('Заповніть персональні дані!');
        return;
    }
    
    const formData = new FormData();
    formData.append('protected_image', protectedImageInput.files[0]);
    formData.append('name', name);
    formData.append('year', year);
    
    try {
        showLoading('recoverResult', 'Відновлення файлу...');
        
        const response = await fetch('/recover', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        const resultBox = document.getElementById('recoverResult');
        const metricsDiv = document.getElementById('recoverMetrics');
        const filesDiv = document.getElementById('recoverFiles');
        
        const loadingMsg = resultBox.querySelector('#loadingMessage');
        if (loadingMsg) {
            loadingMsg.remove();
        }
        
        if (data.success) {
            let metricsHtml = '<h3>Метрики відновлення:</h3>';
            metricsHtml += '<div class="metrics-grid">';
            metricsHtml += `<div class="metric-box"><strong>Час витягування</strong><div class="value">${formatTime(data.metrics.steganography_time)}</div></div>`;
            metricsHtml += `<div class="metric-box"><strong>Час розшифрування</strong><div class="value">${formatTime(data.metrics.decryption_time)}</div></div>`;
            metricsHtml += `<div class="metric-box"><strong>Загальний час</strong><div class="value">${formatTime(data.metrics.total_time)}</div></div>`;
            metricsHtml += `<div class="metric-box"><strong>Розмір відновленого</strong><div class="value">${formatBytes(data.metrics.recovered_file_size)}</div></div>`;
            metricsHtml += '</div>';
            
            let filesHtml = '<h3 style="margin-top: 20px;">Відновлений файл:</h3>';
            const recoveredFileName = data.recovered_file.split('/').pop();
            filesHtml += `<a href="/download/${recoveredFileName}" class="file-link" download>Завантажити відновлений файл</a>`;
            
            if (metricsDiv) {
                metricsDiv.innerHTML = metricsHtml;
            }
            if (filesDiv) {
                filesDiv.innerHTML = filesHtml;
            }
            resultBox.style.display = 'block';
            
            showNotification('Файл успішно відновлено!', 'success');
            loadAnalytics();
        } else {
            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = `<p style="color: #dc3545;"><strong>Помилка:</strong> ${escapeHtml(data.error)}</p>`;
            resultBox.appendChild(errorDiv);
            resultBox.style.display = 'block';
            showNotification('Помилка при відновленні файлу!', 'error');
        }
    } catch (error) {
        alert('Помилка: ' + error.message);
    }
}

async function testIntegrity() {
    const testFileInput = document.getElementById('testFileInput');
    const testImageInput = document.getElementById('testImageInput');
    const name = document.getElementById('name').value.trim();
    const year = document.getElementById('year').value.trim();
    
    if (!testFileInput.files[0] || !testImageInput.files[0]) {
        alert('Виберіть файл та зображення для тестування!');
        return;
    }
    
    if (!name || !year) {
        alert('Заповніть персональні дані!');
        return;
    }
    
    const formData = new FormData();
    formData.append('file', testFileInput.files[0]);
    formData.append('image', testImageInput.files[0]);
    formData.append('name', name);
    formData.append('year', year);
    
    try {
        showLoading('testResult', 'Тестування цілісності...');
        
        const response = await fetch('/test', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        const resultBox = document.getElementById('testResult');
        
        const loadingMsg = resultBox.querySelector('#loadingMessage');
        if (loadingMsg) {
            loadingMsg.remove();
        }
        
        if (data.success) {
            let html = '<h3>Результати тестування:</h3>';
            
            if (data.integrity_check) {
                html += '<div style="padding: 20px; background: #d4edda; border: 2px solid #28a745; border-radius: 8px; color: #155724; margin-bottom: 20px;">';
                html += '<strong>✓ Цілісність підтверджена!</strong><br>';
                html += 'Оригінальний та відновлений файли ідентичні.';
                html += '</div>';
            } else {
                html += '<div style="padding: 20px; background: #f8d7da; border: 2px solid #dc3545; border-radius: 8px; color: #721c24; margin-bottom: 20px;">';
                html += '<strong>✗ Помилка цілісності!</strong><br>';
                html += 'Файли не співпадають.';
                html += '</div>';
            }
            
            html += '<div class="metrics-grid" style="margin-top: 20px;">';
            html += `<div class="metric-box"><strong>Оригінальний хеш</strong><div class="value" style="font-size: 12px; word-break: break-all;">${data.original_hash}</div></div>`;
            html += `<div class="metric-box"><strong>Відновлений хеш</strong><div class="value" style="font-size: 12px; word-break: break-all;">${data.recovered_hash}</div></div>`;
            html += '</div>';
            
            resultBox.innerHTML = html;
            resultBox.style.display = 'block';
            
            if (data.integrity_check) {
                showNotification('Тестування пройдено успішно!', 'success');
            } else {
                showNotification('Помилка цілісності!', 'error');
            }
        } else {
            resultBox.innerHTML = `<p style="color: #dc3545;"><strong>Помилка:</strong> ${escapeHtml(data.error)}</p>`;
            resultBox.style.display = 'block';
            showNotification('Помилка при тестуванні!', 'error');
        }
    } catch (error) {
        alert('Помилка: ' + error.message);
    }
}

async function loadAnalytics() {
    try {
        const response = await fetch('/analytics');
        const data = await response.json();
        const resultBox = document.getElementById('analyticsResult');
        const contentDiv = document.getElementById('analyticsContent');
        const chartsDiv = document.getElementById('chartsContainer');
        
        if (data.success) {
            const stats = data.statistics;
            
            let html = '<h3>Статистика операцій:</h3>';
            html += '<div class="metrics-grid">';
            html += `<div class="metric-box"><strong>Всього операцій</strong><div class="value">${stats.total_operations}</div></div>`;
            html += `<div class="metric-box"><strong>Операцій захисту</strong><div class="value">${stats.protect_operations}</div></div>`;
            html += `<div class="metric-box"><strong>Операцій відновлення</strong><div class="value">${stats.recover_operations}</div></div>`;
            html += '</div>';
            
            if (stats.average_times && Object.keys(stats.average_times).length > 0) {
                html += '<h3 style="margin-top: 20px;">Середній час виконання:</h3>';
                html += '<div class="metrics-grid">';
                for (const [key, value] of Object.entries(stats.average_times)) {
                    if (value > 0) {
                        html += `<div class="metric-box"><strong>${key}</strong><div class="value">${formatTime(value)}</div></div>`;
                    }
                }
                html += '</div>';
            }
            
            if (stats.size_statistics && Object.keys(stats.size_statistics).length > 0) {
                html += '<h3 style="margin-top: 20px;">Статистика розмірів:</h3>';
                html += '<div class="metrics-grid">';
                for (const [key, value] of Object.entries(stats.size_statistics)) {
                    html += `<div class="metric-box"><strong>${key}</strong><div class="value">${formatBytes(value)}</div></div>`;
                }
                html += '</div>';
            }
            
            contentDiv.innerHTML = html;
            
            if (stats.protect_operations > 0 || stats.recover_operations > 0) {
                createCharts(stats);
            }
            
            resultBox.style.display = 'block';
        }
    } catch (error) {
        console.error('Помилка завантаження аналітики:', error);
    }
}

function createCharts(stats) {
    const chartsDiv = document.getElementById('chartsContainer');
    
    if (timeChart) {
        timeChart.destroy();
    }
    if (sizeChart) {
        sizeChart.destroy();
    }
    
    const times = stats.average_times || {};
    const sizes = stats.size_statistics || {};
    
    if (Object.keys(times).length > 0) {
        const timeCanvas = document.createElement('canvas');
        timeCanvas.id = 'timeChart';
        timeCanvas.style.maxHeight = '400px';
        chartsDiv.innerHTML = '<h3 style="margin-top: 20px;">Графіки продуктивності:</h3>';
        chartsDiv.appendChild(timeCanvas);
        
        const ctx = timeCanvas.getContext('2d');
        timeChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(times).map(k => k.replace('_', ' ')),
                datasets: [{
                    label: 'Час (секунди)',
                    data: Object.values(times),
                    backgroundColor: 'rgba(102, 126, 234, 0.6)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    if (Object.keys(sizes).length > 0) {
        const sizeCanvas = document.createElement('canvas');
        sizeCanvas.id = 'sizeChart';
        sizeCanvas.style.maxHeight = '400px';
        sizeCanvas.style.marginTop = '20px';
        chartsDiv.appendChild(sizeCanvas);
        
        const ctx = sizeCanvas.getContext('2d');
        sizeChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(sizes).map(k => k.replace('_', ' ')),
                datasets: [{
                    label: 'Розмір (байти)',
                    data: Object.values(sizes),
                    backgroundColor: 'rgba(40, 167, 69, 0.6)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function showLoading(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loadingMessage';
        loadingDiv.innerHTML = `<p>${message}</p>`;
        const existingLoading = element.querySelector('#loadingMessage');
        if (existingLoading) {
            existingLoading.remove();
        }
        element.insertBefore(loadingDiv, element.firstChild);
        element.style.display = 'block';
    }
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

