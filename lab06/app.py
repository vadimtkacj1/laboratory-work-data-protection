from flask import Flask, render_template, request, jsonify
import logging
from database import (
    init_database,
    search_students_vulnerable,
    search_students_secure,
    get_all_students,
    format_students,
    get_database_info
)

app = Flask(__name__)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/vulnerable', methods=['POST'])
def vulnerable_search():
    search_query = request.form.get('query', '')
    
    logger.warning(f"VULNERABLE QUERY: {search_query}")
    
    try:
        results, query = search_students_vulnerable(search_query)
        students = format_students(results)
        
        return jsonify({
            'success': True,
            'students': students,
            'query': query,
            'count': len(students)
        })
    except Exception as e:
        logger.error(f"Error in vulnerable search: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'query': query if 'query' in locals() else 'N/A'
        }), 500

@app.route('/secure', methods=['POST'])
def secure_search():
    search_query = request.form.get('query', '')
    
    logger.info(f"SECURE QUERY: {search_query}")
    
    try:
        results, query, params = search_students_secure(search_query)
        students = format_students(results)
        
        return jsonify({
            'success': True,
            'students': students,
            'query': query,
            'params': params,
            'count': len(students)
        })
    except Exception as e:
        logger.error(f"Error in secure search: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/all', methods=['GET'])
def get_all_students_route():
    try:
        results = get_all_students()
        students = format_students(results)
        return jsonify({'success': True, 'students': students})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/db-info', methods=['GET'])
def get_database_info_route():
    try:
        db_info = get_database_info()
        return jsonify({'success': True, 'database': db_info})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    init_database()
    app.run(debug=True, port=5000)

