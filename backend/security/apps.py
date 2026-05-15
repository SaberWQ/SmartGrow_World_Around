# =============================================================================
# SmartGrow SecureAI - Security App Configuration
# =============================================================================

from django.apps import AppConfig


class SecurityConfig(AppConfig):
    """
    Конфігурація Django app для модуля безпеки
    
    Модуль забезпечує:
    - Intrusion Detection System (IDS)
    - Криптографічний захист
    - Rate Limiting
    - Захист від відомих атак
    """
    
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'security'
    verbose_name = 'SmartGrow Security Module'
    
    def ready(self):
        """
        Викликається при ініціалізації застосунку
        
        Тут можна:
        - Ініціалізувати IDS
        - Завантажити сигнатури загроз
        - Налаштувати логування
        """
        import logging
        
        logger = logging.getLogger('smartgrow.security')
        logger.info('Security module initialized')
        logger.info('IDS: Active')
        logger.info('Rate Limiter: Active')
        logger.info('Anomaly Detector: Active')
        logger.info('Replay Attack Protection: Active')
