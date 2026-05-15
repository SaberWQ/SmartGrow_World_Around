"""
============================================
SmartGrow SecureAI - IoT API Views
============================================
API endpoints для керування IoT пристроями:
- UV лампа (пін 27)
- Мотор поливу (пін 24)

Всі endpoints захищені JWT аутентифікацією.

Автор: SmartGrow Team
============================================
"""

import logging
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .gpio_controller import gpio_controller

# Логер для IoT
logger = logging.getLogger('iot')


# ============================================
# СТАТУС ПРИСТРОЇВ
# ============================================

@api_view(['GET'])
@permission_classes([AllowAny])  # Дозволяємо перегляд статусу без авторизації
def device_status(request):
    """
    GET /api/v1/iot/status/
    
    Отримати поточний статус всіх IoT пристроїв.
    
    Response:
        {
            "simulation_mode": true,
            "gpio_initialized": true,
            "timestamp": "2024-01-15T14:30:00",
            "devices": {
                "uv_light": {"pin": 27, "state": "off", "auto_off_at": null},
                "water_motor": {"pin": 4, "state": "on", "auto_off_at": "2024-01-15T14:35:00"}
            }
        }
    """
    logger.info(f"📊 Запит статусу від {request.META.get('REMOTE_ADDR')}")
    
    status_data = gpio_controller.get_status()
    return Response(status_data)


# ============================================
# КЕРУВАННЯ UV ЛАМПОЮ (Пін 27)
# ============================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def uv_light_on(request):
    """
    POST /api/v1/iot/uv/on/
    
    Увімкнути UV лампу на вказаний час.
    
    Request Body:
        {
            "duration": 1800  // Тривалість в секундах (опціонально, за замовч. 1800)
        }
    
    Response:
        {
            "success": true,
            "device": "uv_light",
            "pin": 27,
            "state": "on",
            "duration": 1800,
            "auto_off_at": "2024-01-15T15:00:00",
            "message": "UV лампу увімкнено"
        }
    
    Errors:
        - 400: Cooldown period (занадто часті запити)
        - 500: GPIO error
    """
    # Отримуємо тривалість з запиту або використовуємо значення за замовчуванням
    duration = request.data.get('duration', 1800)
    
    # Логуємо дію користувача
    logger.info(
        f"💡 Користувач {request.user.username} вмикає UV лампу "
        f"на {duration} сек"
    )
    
    # Викликаємо GPIO контролер
    result = gpio_controller.turn_on_uv(duration=int(duration))
    
    if result['success']:
        return Response(result, status=status.HTTP_200_OK)
    else:
        return Response(result, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def uv_light_off(request):
    """
    POST /api/v1/iot/uv/off/
    
    Вимкнути UV лампу.
    
    Response:
        {
            "success": true,
            "device": "uv_light",
            "pin": 27,
            "state": "off",
            "message": "UV лампу вимкнено"
        }
    """
    logger.info(f"💡 Користувач {request.user.username} вимикає UV лампу")
    
    result = gpio_controller.turn_off_uv()
    
    if result['success']:
        return Response(result, status=status.HTTP_200_OK)
    else:
        return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ============================================
# КЕРУВАННЯ МОТОРОМ ПОЛИВУ (Пін 24)
# ============================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def water_motor_on(request):
    """
    POST /api/v1/iot/water/on/
    
    Увімкнути мотор поливу на вказаний час.
    
    УВАГА: Максимальна тривалість обмежена 5 хвилинами
    для запобігання затоплення!
    
    Request Body:
        {
            "duration": 120  // Тривалість в секундах (опціонально, за замовч. 120)
        }
    
    Response:
        {
            "success": true,
            "device": "water_motor",
            "pin": 4,
            "state": "on",
            "duration": 120,
            "auto_off_at": "2024-01-15T14:32:00",
            "message": "Полив розпочато"
        }
    """
    duration = request.data.get('duration', 120)
    
    logger.info(
        f"💧 Користувач {request.user.username} вмикає мотор поливу "
        f"на {duration} сек"
    )
    
    result = gpio_controller.turn_on_water(duration=int(duration))
    
    if result['success']:
        return Response(result, status=status.HTTP_200_OK)
    else:
        return Response(result, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def water_motor_off(request):
    """
    POST /api/v1/iot/water/off/
    
    Вимкнути мотор поливу.
    
    Response:
        {
            "success": true,
            "device": "water_motor",
            "pin": 4,
            "state": "off",
            "message": "Полив зупинено"
        }
    """
    logger.info(f"💧 Користувач {request.user.username} вимикає мотор поливу")
    
    result = gpio_controller.turn_off_water()
    
    if result['success']:
        return Response(result, status=status.HTTP_200_OK)
    else:
        return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ============================================
# АВАРІЙНЕ ВИМКНЕННЯ
# ============================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def emergency_stop(request):
    """
    POST /api/v1/iot/emergency-stop/
    
    Аварійне вимкнення ВСІХ пристроїв.
    
    Використовуйте при:
    - Виявленні загрози безпеці
    - Підозрі на кібератаку
    - Несправності обладнання
    
    Response:
        {
            "success": true,
            "action": "emergency_stop",
            "devices": {
                "uv_light": "off",
                "water_motor": "off",
                "fan": "off",
                "heater": "off"
            },
            "message": "Аварійне вимкнення виконано"
        }
    """
    logger.warning(
        f"🚨 АВАРІЙНЕ ВИМКНЕННЯ ініційовано користувачем {request.user.username}"
    )
    
    result = gpio_controller.emergency_stop()
    
    return Response(result, status=status.HTTP_200_OK)


# ============================================
# УНІВЕРСАЛЬНЕ КЕРУВАННЯ ПРИСТРОЄМ
# ============================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def control_device(request):
    """
    POST /api/v1/iot/control/
    
    Універсальний endpoint для керування будь-яким пристроєм.
    
    Request Body:
        {
            "device": "uv_light",  // або "water_motor"
            "action": "on",        // "on" або "off"
            "duration": 1800       // тривалість в секундах (для "on")
        }
    
    Response:
        {
            "success": true,
            "device": "uv_light",
            "pin": 27,
            "state": "on",
            ...
        }
    """
    device = request.data.get('device')
    action = request.data.get('action')
    duration = request.data.get('duration', 120)
    
    # Валідація
    valid_devices = ['uv_light', 'water_motor']
    valid_actions = ['on', 'off']
    
    if device not in valid_devices:
        return Response({
            'success': False,
            'error': 'invalid_device',
            'message': f'Невідомий пристрій: {device}. Доступні: {valid_devices}'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if action not in valid_actions:
        return Response({
            'success': False,
            'error': 'invalid_action',
            'message': f'Невідома дія: {action}. Доступні: {valid_actions}'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    logger.info(
        f"🎮 Користувач {request.user.username} керує пристроєм: "
        f"{device} -> {action}"
    )
    
    # Виконуємо дію
    if device == 'uv_light':
        if action == 'on':
            result = gpio_controller.turn_on_uv(duration=int(duration))
        else:
            result = gpio_controller.turn_off_uv()
    else:  # water_motor
        if action == 'on':
            result = gpio_controller.turn_on_water(duration=int(duration))
        else:
            result = gpio_controller.turn_off_water()
    
    if result['success']:
        return Response(result, status=status.HTTP_200_OK)
    else:
        return Response(result, status=status.HTTP_400_BAD_REQUEST)
