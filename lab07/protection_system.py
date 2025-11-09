import os
import hashlib
import time
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
from PIL import Image
import secrets
import re

class ProtectionSystem:
    def __init__(self):
        self.backend = default_backend()
    
    def generate_key(self, name, year):
        key_string = f"{name}{year}"
        key_hash = hashlib.sha256(key_string.encode()).digest()
        return key_hash
    
    def encrypt_file(self, file_path, key, output_path):
        start_time = time.time()
        
        try:
            with open(file_path, 'rb') as f:
                plaintext = f.read()
        except Exception as e:
            raise ValueError(f"Не вдалося прочитати файл: {str(e)}")
        
        if len(plaintext) == 0:
            raise ValueError("Файл порожній")
        
        try:
            iv = secrets.token_bytes(16)
            cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=self.backend)
            encryptor = cipher.encryptor()
            
            padder = padding.PKCS7(128).padder()
            padded_data = padder.update(plaintext) + padder.finalize()
            
            ciphertext = encryptor.update(padded_data) + encryptor.finalize()
            
            with open(output_path, 'wb') as f:
                f.write(iv + ciphertext)
        except Exception as e:
            raise ValueError(f"Помилка шифрування: {str(e)}")
        
        encryption_time = time.time() - start_time
        
        return {
            'encrypted_file': output_path,
            'encryption_time': encryption_time
        }
    
    def decrypt_file(self, encrypted_file_path, key, output_path):
        start_time = time.time()
        
        try:
            with open(encrypted_file_path, 'rb') as f:
                data = f.read()
        except Exception as e:
            raise ValueError(f"Не вдалося прочитати зашифрований файл: {str(e)}")
        
        if len(data) < 16:
            raise ValueError("Зашифрований файл занадто короткий (відсутній IV)")
        
        iv = data[:16]
        ciphertext = data[16:]
        
        if len(ciphertext) == 0:
            raise ValueError("Зашифрований файл порожній")
        
        try:
            cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=self.backend)
            decryptor = cipher.decryptor()
            
            padded_plaintext = decryptor.update(ciphertext) + decryptor.finalize()
            
            unpadder = padding.PKCS7(128).unpadder()
            plaintext = unpadder.update(padded_plaintext) + unpadder.finalize()
            
            with open(output_path, 'wb') as f:
                f.write(plaintext)
        except Exception as e:
            raise ValueError(f"Помилка розшифрування: {str(e)}. Можливо, невірний ключ або файл пошкоджений.")
        
        decryption_time = time.time() - start_time
        
        return {
            'recovered_file': output_path,
            'decryption_time': decryption_time
        }
    
    def hide_file_in_image(self, file_path, image_path, output_path):
        start_time = time.time()
        
        with open(file_path, 'rb') as f:
            file_data = f.read()
        
        file_bits = ''.join(format(byte, '08b') for byte in file_data)
        file_size = len(file_bits)
        
        img = Image.open(image_path)
        img = img.convert('RGB')
        pixels = img.load()
        width, height = img.size
        
        max_capacity = width * height * 3
        
        if file_size > max_capacity:
            raise ValueError(f"Файл занадто великий. Максимальна місткість: {max_capacity} біт")
        
        file_size_bits = format(file_size, '032b')
        all_bits = file_size_bits + file_bits
        
        bit_index = 0
        for y in range(height):
            for x in range(width):
                r, g, b = pixels[x, y]
                
                if bit_index < len(all_bits):
                    r = (r & ~1) | int(all_bits[bit_index])
                    bit_index += 1
                
                if bit_index < len(all_bits):
                    g = (g & ~1) | int(all_bits[bit_index])
                    bit_index += 1
                
                if bit_index < len(all_bits):
                    b = (b & ~1) | int(all_bits[bit_index])
                    bit_index += 1
                
                pixels[x, y] = (r, g, b)
                
                if bit_index >= len(all_bits):
                    break
            if bit_index >= len(all_bits):
                break
        
        output_format = os.path.splitext(output_path)[1][1:].upper() or 'PNG'
        if output_format not in ['PNG', 'BMP', 'TIFF']:
            output_format = 'PNG'
        img.save(output_path, format=output_format)
        
        steganography_time = time.time() - start_time
        
        return {
            'protected_image': output_path,
            'steganography_time': steganography_time
        }
    
    def extract_file_from_image(self, image_path, output_path):
        start_time = time.time()
        
        try:
            img = Image.open(image_path)
            img = img.convert('RGB')
        except Exception as e:
            raise ValueError(f"Не вдалося відкрити зображення: {str(e)}. Переконайтеся, що файл є валідним зображенням.")
        
        pixels = img.load()
        width, height = img.size
        
        bits = []
        for y in range(height):
            for x in range(width):
                r, g, b = pixels[x, y]
                bits.append(str(r & 1))
                bits.append(str(g & 1))
                bits.append(str(b & 1))
        
        file_size_bits = ''.join(bits[:32])
        file_size = int(file_size_bits, 2)
        
        file_bits = bits[32:32+file_size]
        
        file_bytes = bytearray()
        for i in range(0, len(file_bits), 8):
            if i + 8 <= len(file_bits):
                byte = int(''.join(file_bits[i:i+8]), 2)
                file_bytes.append(byte)
        
        with open(output_path, 'wb') as f:
            f.write(file_bytes)
        
        steganography_time = time.time() - start_time
        
        return {
            'extracted_file': output_path,
            'steganography_time': steganography_time
        }
    
    def protect_file(self, file_path, image_path, name, year, output_dir):
        if not os.path.exists(file_path):
            raise ValueError(f"Файл не знайдено: {file_path}")
        if not os.path.exists(image_path):
            raise ValueError(f"Зображення не знайдено: {image_path}")
        
        key = self.generate_key(name, year)
        
        timestamp = int(time.time() * 1000)
        base_name = os.path.splitext(os.path.basename(file_path))[0]
        image_ext = os.path.splitext(image_path)[1] or '.png'
        
        encrypted_file_path = os.path.join(output_dir, f"{base_name}_encrypted_{timestamp}.bin")
        protected_image_path = os.path.join(output_dir, f"protected_{timestamp}{image_ext}")
        
        os.makedirs(output_dir, exist_ok=True)
        
        encrypt_result = self.encrypt_file(file_path, key, encrypted_file_path)
        
        if not os.path.exists(encrypted_file_path) or os.path.getsize(encrypted_file_path) == 0:
            raise ValueError("Помилка: зашифрований файл не був створений або порожній")
        
        stego_result = self.hide_file_in_image(
            encrypted_file_path,
            image_path,
            protected_image_path
        )
        
        if not os.path.exists(protected_image_path):
            raise ValueError("Помилка: захищене зображення не було створено")
        
        return {
            'encrypted_file': encrypted_file_path,
            'protected_image': protected_image_path,
            'encryption_time': encrypt_result['encryption_time'],
            'steganography_time': stego_result['steganography_time']
        }
    
    def recover_file(self, protected_image_path, name, year, output_dir):
        key = self.generate_key(name, year)
        
        import time
        timestamp = int(time.time() * 1000)
        base_name = os.path.splitext(os.path.basename(protected_image_path))[0]
        extracted_file_path = os.path.join(output_dir, f"{base_name}_extracted_{timestamp}.bin")
        recovered_file_path = os.path.join(output_dir, f"recovered_{timestamp}.txt")
        
        extract_result = self.extract_file_from_image(
            protected_image_path,
            extracted_file_path
        )
        
        decrypt_result = self.decrypt_file(
            extracted_file_path,
            key,
            recovered_file_path
        )
        
        return {
            'extracted_file': extracted_file_path,
            'recovered_file': recovered_file_path,
            'steganography_time': extract_result['steganography_time'],
            'decryption_time': decrypt_result['decryption_time']
        }
    
    def calculate_file_hash(self, file_path):
        sha256_hash = hashlib.sha256()
        with open(file_path, 'rb') as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()

