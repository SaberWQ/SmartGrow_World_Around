"""
============================================
SmartGrow SecureAI - IoT App Configuration
============================================
"""

from django.apps import AppConfig


class IotConfig(AppConfig):
    """
    Конфігурація IoT застосунку.
    
    Цей застосунок керує:
    - GPIO пінами Raspberry Pi
    - Реле для UV лампи (пін 27)
    - Реле для мотора поливу (пін 24)
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'iot'
    verbose_name = 'IoT Керування'
    
    def ready(self):
        """
        Викликається при завантаженні застосунку.
        Ініціалізує GPIO контролер.
        """
        # Імпортуємо сигнали якщо потрібно
        pass
