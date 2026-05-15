"""
============================================
SmartGrow SecureAI - WSGI Configuration
============================================
WSGI конфігурація для продакшн серверів
(Gunicorn, uWSGI, etc.)
============================================
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartgrow.settings')

application = get_wsgi_application()
