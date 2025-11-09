from flask import Flask, render_template, request, jsonify, send_file
import os
import time
import json
from datetime import datetime
from protection_system import ProtectionSystem
from analytics import Analytics

app = Flask(__name__)

protection_system = ProtectionSystem()
analytics = Analytics()

UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/protect', methods=['POST'])
def protect_file():
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'error': 'Файл не завантажено'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'success': False, 'error': 'Файл не вибрано'}), 400
        
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'Зображення-контейнер не завантажено'}), 400
        
        image = request.files['image']
        if image.filename == '':
            return jsonify({'success': False, 'error': 'Зображення не вибрано'}), 400
        
        name = request.form.get('name', 'User')
        year = request.form.get('year', '2005')
        
        timestamp = int(time.time() * 1000)
        file_ext = os.path.splitext(file.filename)[1] or ''
        image_ext = os.path.splitext(image.filename)[1] or '.png'
        
        safe_file_name = ''.join(c for c in os.path.basename(file.filename) if c.isalnum() or c in '.-_')[:50] or 'file'
        safe_image_name = ''.join(c for c in os.path.basename(image.filename) if c.isalnum() or c in '.-_')[:50] or 'image'
        
        file_path = os.path.join(UPLOAD_FOLDER, f"upload_{timestamp}_{safe_file_name}")
        image_path = os.path.join(UPLOAD_FOLDER, f"image_{timestamp}_{safe_image_name}")
        
        file.save(file_path)
        image.save(image_path)
        
        original_size = os.path.getsize(file_path)
        image_size = os.path.getsize(image_path)
        
        start_time = time.time()
        
        result = protection_system.protect_file(
            file_path=file_path,
            image_path=image_path,
            name=name,
            year=year,
            output_dir=PROCESSED_FOLDER
        )
        
        end_time = time.time()
        processing_time = end_time - start_time
        
        protected_image_size = os.path.getsize(result['protected_image'])
        encrypted_file_size = os.path.getsize(result['encrypted_file'])
        
        metrics = {
            'original_file_size': original_size,
            'encrypted_file_size': encrypted_file_size,
            'original_image_size': image_size,
            'protected_image_size': protected_image_size,
            'encryption_time': result['encryption_time'],
            'steganography_time': result['steganography_time'],
            'total_time': processing_time,
            'timestamp': datetime.now().isoformat()
        }
        
        analytics.add_operation('protect', metrics)
        
        protected_image_name = os.path.basename(result['protected_image'])
        encrypted_file_name = os.path.basename(result['encrypted_file'])
        
        return jsonify({
            'success': True,
            'protected_image': protected_image_name,
            'encrypted_file': encrypted_file_name,
            'metrics': metrics
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/recover', methods=['POST'])
def recover_file():
    try:
        if 'protected_image' not in request.files:
            return jsonify({'success': False, 'error': 'Захищене зображення не завантажено'}), 400
        
        protected_image = request.files['protected_image']
        if protected_image.filename == '':
            return jsonify({'success': False, 'error': 'Зображення не вибрано'}), 400
        
        original_filename = protected_image.filename or 'protected_image'
        
        if '.bin' in original_filename.lower() or 'encrypted' in original_filename.lower():
            return jsonify({
                'success': False, 
                'error': 'Помилка: Ви завантажили зашифрований файл (.bin). Для відновлення потрібно завантажити ЗАХИЩЕНЕ ЗОБРАЖЕННЯ (protected_*.png), яке було створено на етапі захисту.'
            }), 400
        
        name = request.form.get('name', 'User')
        year = request.form.get('year', '2005')
        
        timestamp = int(time.time() * 1000)
        image_ext = os.path.splitext(original_filename)[1].lower()
        
        valid_extensions = ['.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.tif']
        if not image_ext or image_ext not in valid_extensions:
            image_ext = '.png'
        
        safe_image_name = ''.join(c for c in os.path.basename(original_filename) if c.isalnum() or c in '.-_')[:50] or 'image'
        if not safe_image_name:
            safe_image_name = 'protected_image'
        
        image_path = os.path.join(UPLOAD_FOLDER, f"protected_{timestamp}_{safe_image_name}{image_ext}")
        protected_image.save(image_path)
        
        from PIL import Image
        try:
            test_img = Image.open(image_path)
            test_img.verify()
        except Exception as e:
            return jsonify({
                'success': False, 
                'error': f'Файл не є валідним зображенням: {str(e)}. Переконайтеся, що ви завантажуєте захищене зображення (protected_*.png), а не зашифрований файл (*_encrypted.bin).'
            }), 400
        
        start_time = time.time()
        
        result = protection_system.recover_file(
            protected_image_path=image_path,
            name=name,
            year=year,
            output_dir=PROCESSED_FOLDER
        )
        
        end_time = time.time()
        processing_time = end_time - start_time
        
        recovered_file_size = os.path.getsize(result['recovered_file'])
        
        metrics = {
            'protected_image_size': os.path.getsize(image_path),
            'recovered_file_size': recovered_file_size,
            'steganography_time': result['steganography_time'],
            'decryption_time': result['decryption_time'],
            'total_time': processing_time,
            'timestamp': datetime.now().isoformat()
        }
        
        analytics.add_operation('recover', metrics)
        
        recovered_file_name = os.path.basename(result['recovered_file'])
        
        return jsonify({
            'success': True,
            'recovered_file': recovered_file_name,
            'metrics': metrics
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/download/<path:filename>')
def download_file(filename):
    file_path = os.path.join(PROCESSED_FOLDER, filename)
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    return jsonify({'error': 'Файл не знайдено'}), 404

@app.route('/analytics', methods=['GET'])
def get_analytics():
    try:
        stats = analytics.get_statistics()
        return jsonify({'success': True, 'statistics': stats})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/test', methods=['POST'])
def test_integrity():
    try:
        if 'file' not in request.files or 'image' not in request.files:
            return jsonify({'success': False, 'error': 'Файли не завантажено'}), 400
        
        file = request.files['file']
        image = request.files['image']
        name = request.form.get('name', 'User')
        year = request.form.get('year', '2005')
        
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        image_path = os.path.join(UPLOAD_FOLDER, image.filename)
        
        file.save(file_path)
        image.save(image_path)
        
        original_hash = protection_system.calculate_file_hash(file_path)
        
        protect_result = protection_system.protect_file(
            file_path=file_path,
            image_path=image_path,
            name=name,
            year=year,
            output_dir=PROCESSED_FOLDER
        )
        
        recover_result = protection_system.recover_file(
            protected_image_path=protect_result['protected_image'],
            name=name,
            year=year,
            output_dir=PROCESSED_FOLDER
        )
        
        recovered_hash = protection_system.calculate_file_hash(recover_result['recovered_file'])
        
        integrity_check = original_hash == recovered_hash
        
        return jsonify({
            'success': True,
            'integrity_check': integrity_check,
            'original_hash': original_hash,
            'recovered_hash': recovered_hash,
            'protect_metrics': protect_result.get('metrics', {}),
            'recover_metrics': recover_result.get('metrics', {})
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)

