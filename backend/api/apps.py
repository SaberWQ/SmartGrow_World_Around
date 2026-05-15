"""
============================================
SmartGrow SecureAI - API App Configuration
============================================
"""

from django.apps import AppConfig


class ApiConfig(AppConfig):
    """
    Конфігурація головного API застосунку.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
    verbose_name = 'SmartGrow API'
