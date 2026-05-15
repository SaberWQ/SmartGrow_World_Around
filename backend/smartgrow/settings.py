"""
============================================
SmartGrow SecureAI - Django Settings
============================================
Основні налаштування Django проекту для 
керування розумною теплицею з Zero-Trust захистом.

Автор: SmartGrow Team
Версія: 1.0.0
Ліцензія: Захищено законом України №2811-IX
============================================
"""

import os
from pathlib import Path
from datetime import timedelta

# Базова директорія проекту
BASE_DIR = Path(__file__).resolve().parent.parent

# ============================================
# БЕЗПЕКА (Security Settings)
# ============================================
# УВАГА: В продакшні використовуйте змінні середовища!
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'your-secret-key-change-in-production')
DEBUG = os.environ.get('DJANGO_DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# ============================================
# ЗАСТОСУНКИ (Installed Apps)
# ============================================
INSTALLED_APPS = [
    # Django вбудовані
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Сторонні бібліотеки
    'rest_framework',           # Django REST Framework для API
    'rest_framework_simplejwt', # JWT аутентифікація
    'corsheaders',              # CORS для Next.js фронтенду
    
    # Наші застосунки
    'api',                      # Головний API застосунок
    'iot',                      # Керування IoT пристроями (GPIO)
    'security',                 # Модуль кібербезпеки (IDS, криптографія)
]

# ============================================
# MIDDLEWARE (Проміжне ПЗ)
# ============================================
MIDDLEWARE = [
    # CORS повинен бути першим для обробки preflight запитів
    'corsheaders.middleware.CorsMiddleware',
    
    # Security middleware (IDS, rate limiting, input sanitization)
    'security.middleware.SecurityMiddleware',
    'security.middleware.InputSanitizationMiddleware',
    'security.middleware.AuditLogMiddleware',
    
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Статичні файли в продакшні
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'smartgrow.urls'

# ============================================
# ШАБЛОНИ (Templates) - не використовуємо, бо Next.js
# ============================================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'smartgrow.wsgi.application'

# ============================================
# БАЗА ДАНИХ (Database)
# ============================================
# Для розробки використовуємо SQLite, для продакшну - PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Альтернатива для PostgreSQL (розкоментуйте для продакшну):
# import dj_database_url
# DATABASES = {
#     'default': dj_database_url.config(
#         default=os.environ.get('DATABASE_URL'),
#         conn_max_age=600
#     )
# }

# ============================================
# ВАЛІДАЦІЯ ПАРОЛІВ
# ============================================
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ============================================
# ІНТЕРНАЦІОНАЛІЗАЦІЯ (i18n)
# ============================================
LANGUAGE_CODE = 'uk'  # Українська за замовчуванням
TIME_ZONE = 'Europe/Kyiv'
USE_I18N = True
USE_TZ = True

# Підтримувані мови
LANGUAGES = [
    ('uk', 'Українська'),
    ('ro', 'Română'),
    ('en', 'English'),
    ('es', 'Español'),
]

# ============================================
# СТАТИЧНІ ФАЙЛИ
# ============================================
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ============================================
# CORS НАЛАШТУВАННЯ (для Next.js фронтенду)
# ============================================
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",      # Next.js dev server
    "http://127.0.0.1:3000",
    "https://smartgrow.vercel.app",  # Продакшн
]
CORS_ALLOW_CREDENTIALS = True

# ============================================
# REST FRAMEWORK НАЛАШТУВАННЯ
# ============================================
REST_FRAMEWORK = {
    # Аутентифікація через JWT токени
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    
    # Дозволи за замовчуванням
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    
    # Пагінація
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50,
    
    # Throttling (обмеження запитів) для захисту від DDoS
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',    # Анонімні користувачі
        'user': '1000/hour',   # Авторизовані користувачі
    }
}

# ============================================
# JWT НАЛАШТУВАННЯ
# ============================================
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
}

# ============================================
# IoT НАЛАШТУВАННЯ (Raspberry Pi GPIO)
# ============================================
IOT_CONFIG = {
    # GPIO піни для реле
    'UV_LIGHT_PIN': 27,      # Пін 27 - ультрафіолетова лампа
    'WATER_MOTOR_PIN': 4,    # Пін 4 - мотор для поливу
    
    # Додаткові піни (за потреби)
    'FAN_PIN': 17,           # Пін 17 - вентилятор (опціонально)
    'HEATER_PIN': 22,        # Пін 22 - обігрівач (опціонально)
    
    # Налаштування безпеки
    'MAX_UV_DURATION': 3600,       # Макс. час UV (1 година в секундах)
    'MAX_WATER_DURATION': 300,     # Макс. час поливу (5 хвилин)
    'COOLDOWN_PERIOD': 60,         # Період охолодження між активаціями
    
    # Режим симуляції (True - без реального GPIO)
    'SIMULATION_MODE': os.environ.get('IOT_SIMULATION', 'True') == 'True',
}

# ============================================
# ЛОГУВАННЯ
# ============================================
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '[{asctime}] {levelname} {name} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'logs' / 'smartgrow.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
        },
        'iot': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'api': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'security': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'smartgrow.security': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'smartgrow.audit': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# Створюємо директорію для логів
(BASE_DIR / 'logs').mkdir(exist_ok=True)
