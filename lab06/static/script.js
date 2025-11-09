async function vulnerableSearch() {
    const query = document.getElementById('vulnerableQuery').value.trim();
    
    if (!query) {
        alert('Введіть запит для пошуку!');
        return;
    }
    
    try {
        const formData = new FormData();
        formData.append('query', query);
        
        const response = await fetch('/vulnerable', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        const resultBox = document.getElementById('vulnerableResult');
        const sqlDisplay = document.getElementById('vulnerableSQL');
        const studentsDiv = document.getElementById('vulnerableStudents');
        
        if (data.success) {
            sqlDisplay.textContent = data.query;
            resultBox.style.display = 'block';
            
            if (data.students.length === 0) {
                studentsDiv.innerHTML = '<p>Студентів не знайдено.</p>';
            } else {
                let html = `<p><strong>Знайдено студентів: ${data.count}</strong></p>`;
                html += '<table class="students-table">';
                html += '<thead><tr><th>ID</th><th>Ім\'я</th><th>Email</th><th>Група</th><th>Дата народження</th><th>Телефон</th><th>Адреса</th></tr></thead>';
                html += '<tbody>';
                
                data.students.forEach(student => {
                    html += `<tr>
                        <td>${student.id}</td>
                        <td>${escapeHtml(student.name)}</td>
                        <td>${escapeHtml(student.email)}</td>
                        <td>${escapeHtml(student.group_name)}</td>
                        <td>${escapeHtml(student.birth_date)}</td>
                        <td>${escapeHtml(student.phone || 'N/A')}</td>
                        <td>${escapeHtml(student.address || 'N/A')}</td>
                    </tr>`;
                });
                
                html += '</tbody></table>';
                studentsDiv.innerHTML = html;
            }
        } else {
            sqlDisplay.textContent = data.query || 'Помилка виконання запиту';
            studentsDiv.innerHTML = `<p style="color: #dc3545;"><strong>Помилка:</strong> ${escapeHtml(data.error)}</p>`;
            resultBox.style.display = 'block';
        }
    } catch (error) {
        alert('Помилка: ' + error.message);
    }
}

async function secureSearch() {
    const query = document.getElementById('secureQuery').value.trim();
    
    if (!query) {
        alert('Введіть запит для пошуку!');
        return;
    }
    
    try {
        const formData = new FormData();
        formData.append('query', query);
        
        const response = await fetch('/secure', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        const resultBox = document.getElementById('secureResult');
        const sqlDisplay = document.getElementById('secureSQL');
        const paramsDisplay = document.getElementById('secureParams');
        const studentsDiv = document.getElementById('secureStudents');
        
        if (data.success) {
            sqlDisplay.textContent = data.query;
            paramsDisplay.textContent = JSON.stringify(data.params);
            resultBox.style.display = 'block';
            
            if (data.students.length === 0) {
                studentsDiv.innerHTML = '<p>Студентів не знайдено.</p>';
            } else {
                let html = `<p><strong>Знайдено студентів: ${data.count}</strong></p>`;
                html += '<table class="students-table">';
                html += '<thead><tr><th>ID</th><th>Ім\'я</th><th>Email</th><th>Група</th><th>Дата народження</th><th>Телефон</th><th>Адреса</th></tr></thead>';
                html += '<tbody>';
                
                data.students.forEach(student => {
                    html += `<tr>
                        <td>${student.id}</td>
                        <td>${escapeHtml(student.name)}</td>
                        <td>${escapeHtml(student.email)}</td>
                        <td>${escapeHtml(student.group_name)}</td>
                        <td>${escapeHtml(student.birth_date)}</td>
                        <td>${escapeHtml(student.phone || 'N/A')}</td>
                        <td>${escapeHtml(student.address || 'N/A')}</td>
                    </tr>`;
                });
                
                html += '</tbody></table>';
                studentsDiv.innerHTML = html;
            }
        } else {
            sqlDisplay.textContent = data.query || 'Помилка виконання запиту';
            studentsDiv.innerHTML = `<p style="color: #dc3545;"><strong>Помилка:</strong> ${escapeHtml(data.error)}</p>`;
            resultBox.style.display = 'block';
        }
    } catch (error) {
        alert('Помилка: ' + error.message);
    }
}

async function showDatabaseInfo() {
    try {
        const response = await fetch('/db-info');
        const data = await response.json();
        const resultBox = document.getElementById('dbInfo');
        const allStudentsBox = document.getElementById('allStudents');
        
        allStudentsBox.style.display = 'none';
        
        if (data.success) {
            let html = '<h3>Структура бази даних:</h3>';
            html += `<p><strong>Всього записів:</strong> ${data.database.total_records}</p>`;
            
            data.database.tables.forEach(table => {
                html += `<div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">`;
                html += `<h4>Таблиця: <code>${escapeHtml(table.name)}</code> (${table.record_count} записів)</h4>`;
                html += '<table class="students-table" style="margin-top: 10px;">';
                html += '<thead><tr><th>Назва поля</th><th>Тип</th><th>NOT NULL</th><th>Primary Key</th><th>Default</th></tr></thead>';
                html += '<tbody>';
                
                table.columns.forEach(column => {
                    html += `<tr>
                        <td><strong>${escapeHtml(column.name)}</strong></td>
                        <td><code>${escapeHtml(column.type)}</code></td>
                        <td>${column.not_null ? '✓' : ''}</td>
                        <td>${column.primary_key ? '✓' : ''}</td>
                        <td>${column.default ? escapeHtml(String(column.default)) : 'NULL'}</td>
                    </tr>`;
                });
                
                html += '</tbody></table>';
                html += '</div>';
            });
            
            resultBox.innerHTML = html;
            resultBox.style.display = 'block';
        }
    } catch (error) {
        alert('Помилка: ' + error.message);
    }
}

async function showAllStudents() {
    try {
        const response = await fetch('/all');
        const data = await response.json();
        const resultBox = document.getElementById('allStudents');
        const dbInfoBox = document.getElementById('dbInfo');
        
        dbInfoBox.style.display = 'none';
        
        if (data.success) {
            let html = '<h3>Всі студенти в базі даних:</h3>';
            html += '<table class="students-table">';
            html += '<thead><tr><th>ID</th><th>Ім\'я</th><th>Email</th><th>Група</th><th>Дата народження</th><th>Телефон</th><th>Адреса</th></tr></thead>';
            html += '<tbody>';
            
            data.students.forEach(student => {
                html += `<tr>
                    <td>${student.id}</td>
                    <td>${escapeHtml(student.name)}</td>
                    <td>${escapeHtml(student.email)}</td>
                    <td>${escapeHtml(student.group_name)}</td>
                    <td>${escapeHtml(student.birth_date)}</td>
                    <td>${escapeHtml(student.phone || 'N/A')}</td>
                    <td>${escapeHtml(student.address || 'N/A')}</td>
                </tr>`;
            });
            
            html += '</tbody></table>';
            resultBox.innerHTML = html;
            resultBox.style.display = 'block';
        }
    } catch (error) {
        alert('Помилка: ' + error.message);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.getElementById('vulnerableQuery').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        vulnerableSearch();
    }
});

document.getElementById('secureQuery').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        secureSearch();
    }
});

