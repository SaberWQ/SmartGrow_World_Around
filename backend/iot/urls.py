"""
============================================
SmartGrow SecureAI - IoT URL Routes
============================================
URL маршрути для IoT API endpoints.

Доступні endpoints:
- GET  /api/v1/iot/status/          - Статус всіх пристроїв
- POST /api/v1/iot/uv/on/           - Увімкнути UV (пін 27)
- POST /api/v1/iot/uv/off/          - Вимкнути UV (пін 27)
- POST /api/v1/iot/water/on/        - Увімкнути полив (пін 24)
- POST /api/v1/iot/water/off/       - Вимкнути полив (пін 24)
- POST /api/v1/iot/emergency-stop/  - Аварійне вимкнення
- POST /api/v1/iot/control/         - Універсальне керування

Автор: SmartGrow Team
============================================
"""

from django.urls import path
from . import views

# Простір імен для IoT API
app_name = 'iot'

urlpatterns = [
    # ============================================
    # СТАТУС
    # ============================================
    # GET /api/v1/iot/status/
    path('status/', views.device_status, name='status'),
    
    # ============================================
    # UV ЛАМПА (Пін 27 - Ультрафіолет)
    # ============================================
    # POST /api/v1/iot/uv/on/
    path('uv/on/', views.uv_light_on, name='uv_on'),
    
    # POST /api/v1/iot/uv/off/
    path('uv/off/', views.uv_light_off, name='uv_off'),
    
    # ============================================
    # МОТОР ПОЛИВУ (Пін 24 - Водяний насос)
    # ============================================
    # POST /api/v1/iot/water/on/
    path('water/on/', views.water_motor_on, name='water_on'),
    
    # POST /api/v1/iot/water/off/
    path('water/off/', views.water_motor_off, name='water_off'),
    
    # ============================================
    # АВАРІЙНЕ КЕРУВАННЯ
    # ============================================
    # POST /api/v1/iot/emergency-stop/
    path('emergency-stop/', views.emergency_stop, name='emergency_stop'),
    
    # ============================================
    # УНІВЕРСАЛЬНЕ КЕРУВАННЯ
    # ============================================
    # POST /api/v1/iot/control/
    path('control/', views.control_device, name='control'),
]
