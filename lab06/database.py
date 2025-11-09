import sqlite3
import os
import logging

logger = logging.getLogger(__name__)

DB_NAME = 'students.db'

def get_connection():
    return sqlite3.connect(DB_NAME)

def init_database():
    if os.path.exists(DB_NAME):
        os.remove(DB_NAME)
    
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            group_name TEXT NOT NULL,
            birth_date TEXT NOT NULL,
            phone TEXT,
            address TEXT
        )
    ''')
    
    students = [
        ('Vadim Tkachenko', 'vadym.tkachenko@hneu.net', '6.04.122.010.22.2', '2005-09-21', '+380501234567', 'Kyiv, Ukraine'),
        ('Ivan Petrenko', 'ivan.petrenko@hneu.net', '6.04.122.010.22.2', '2005-03-15', '+380509876543', 'Lviv, Ukraine'),
        ('Maria Kovalenko', 'maria.kovalenko@hneu.net', '6.04.122.010.22.1', '2005-07-10', '+380501112233', 'Kharkiv, Ukraine'),
        ('Oleksandr Shevchenko', 'oleksandr.shevchenko@hneu.net', '6.04.122.010.22.1', '2005-11-25', '+380504445566', 'Odesa, Ukraine'),
        ('Anna Melnyk', 'anna.melnyk@hneu.net', '6.04.122.010.22.2', '2005-05-08', '+380507778899', 'Dnipro, Ukraine'),
        ('Admin User', 'admin@hneu.net', 'ADMIN', '1990-01-01', '+380500000000', 'System'),
    ]
    
    cursor.executemany('''
        INSERT INTO students (name, email, group_name, birth_date, phone, address)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', students)
    
    conn.commit()
    conn.close()
    logger.info("Database initialized with test data")

def search_students_vulnerable(search_query):
    conn = get_connection()
    cursor = conn.cursor()
    
    query = f"SELECT * FROM students WHERE name LIKE '%{search_query}%' OR email LIKE '%{search_query}%'"
    
    logger.warning(f"EXECUTING VULNERABLE SQL: {query}")
    
    cursor.execute(query)
    results = cursor.fetchall()
    conn.close()
    
    return results, query

def search_students_secure(search_query):
    conn = get_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM students WHERE name LIKE ? OR email LIKE ?"
    params = (f'%{search_query}%', f'%{search_query}%')
    
    logger.info(f"EXECUTING SECURE SQL: {query} with params: {params}")
    
    cursor.execute(query, params)
    results = cursor.fetchall()
    conn.close()
    
    return results, query, params

def get_all_students():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM students")
    results = cursor.fetchall()
    conn.close()
    
    return results

def format_student(row):
    return {
        'id': row[0],
        'name': row[1],
        'email': row[2],
        'group_name': row[3],
        'birth_date': row[4],
        'phone': row[5],
        'address': row[6]
    }

def format_students(rows):
    return [format_student(row) for row in rows]

def get_database_info():
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    
    db_info = {
        'tables': [],
        'total_records': 0
    }
    
    for table in tables:
        table_name = table[0]
        cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
        count = cursor.fetchone()[0]
        
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()
        
        db_info['tables'].append({
            'name': table_name,
            'columns': [{'name': col[1], 'type': col[2], 'not_null': col[3], 'default': col[4], 'primary_key': col[5]} for col in columns],
            'record_count': count
        })
        db_info['total_records'] += count
    
    conn.close()
    return db_info

