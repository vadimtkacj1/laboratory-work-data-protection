import json
import os
from datetime import datetime
from collections import defaultdict

class Analytics:
    def __init__(self):
        self.operations_file = 'analytics.json'
        self.operations = self.load_operations()
    
    def load_operations(self):
        if os.path.exists(self.operations_file):
            try:
                with open(self.operations_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                return []
        return []
    
    def save_operations(self):
        with open(self.operations_file, 'w', encoding='utf-8') as f:
            json.dump(self.operations, f, indent=2, ensure_ascii=False)
    
    def add_operation(self, operation_type, metrics):
        operation = {
            'type': operation_type,
            'timestamp': datetime.now().isoformat(),
            'metrics': metrics
        }
        self.operations.append(operation)
        self.save_operations()
    
    def get_statistics(self):
        if not self.operations:
            return {
                'total_operations': 0,
                'protect_operations': 0,
                'recover_operations': 0,
                'average_times': {},
                'size_statistics': {}
            }
        
        protect_ops = [op for op in self.operations if op['type'] == 'protect']
        recover_ops = [op for op in self.operations if op['type'] == 'recover']
        
        avg_encryption_time = sum(op['metrics'].get('encryption_time', 0) for op in protect_ops) / len(protect_ops) if protect_ops else 0
        avg_stego_time = sum(op['metrics'].get('steganography_time', 0) for op in protect_ops) / len(protect_ops) if protect_ops else 0
        avg_total_time = sum(op['metrics'].get('total_time', 0) for op in protect_ops) / len(protect_ops) if protect_ops else 0
        
        avg_decryption_time = sum(op['metrics'].get('decryption_time', 0) for op in recover_ops) / len(recover_ops) if recover_ops else 0
        avg_recover_stego_time = sum(op['metrics'].get('steganography_time', 0) for op in recover_ops) / len(recover_ops) if recover_ops else 0
        avg_recover_total_time = sum(op['metrics'].get('total_time', 0) for op in recover_ops) / len(recover_ops) if recover_ops else 0
        
        size_stats = {}
        if protect_ops:
            size_stats['avg_original_size'] = sum(op['metrics'].get('original_file_size', 0) for op in protect_ops) / len(protect_ops)
            size_stats['avg_encrypted_size'] = sum(op['metrics'].get('encrypted_file_size', 0) for op in protect_ops) / len(protect_ops)
            size_stats['avg_image_size'] = sum(op['metrics'].get('original_image_size', 0) for op in protect_ops) / len(protect_ops)
            size_stats['avg_protected_image_size'] = sum(op['metrics'].get('protected_image_size', 0) for op in protect_ops) / len(protect_ops)
        
        return {
            'total_operations': len(self.operations),
            'protect_operations': len(protect_ops),
            'recover_operations': len(recover_ops),
            'average_times': {
                'encryption': round(avg_encryption_time, 4),
                'steganography': round(avg_stego_time, 4),
                'total_protect': round(avg_total_time, 4),
                'decryption': round(avg_decryption_time, 4),
                'extraction': round(avg_recover_stego_time, 4),
                'total_recover': round(avg_recover_total_time, 4)
            },
            'size_statistics': {k: round(v, 2) for k, v in size_stats.items()},
            'recent_operations': self.operations[-10:]
        }

