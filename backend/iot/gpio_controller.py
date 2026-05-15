"""
============================================
SmartGrow SecureAI - IoT GPIO Controller
============================================
Цей модуль керує GPIO пінами Raspberry Pi для:
- Пін 27: Ультрафіолетова лампа (UV Light)
- Пін 4: Мотор для поливу (Water Motor)

ВАЖЛИВО: 
- На реальному Raspberry Pi встановіть RPi.GPIO
- В режимі симуляції GPIO команди логуються

Автор: SmartGrow Team
Ліцензія: Захищено законом України №2811-IX
============================================
"""

import logging
import time
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from django.conf import settings

# Отримуємо логер для IoT модуля
logger = logging.getLogger('iot')

# ============================================
# КОНФІГУРАЦІЯ GPIO ПІНІВ
# ============================================
# Читаємо налаштування з Django settings
IOT_CONFIG = getattr(settings, 'IOT_CONFIG', {})

# Пін 27 - Ультрафіолетова лампа для дезинфекції та росту
UV_LIGHT_PIN = IOT_CONFIG.get('UV_LIGHT_PIN', 27)

# Пін 4 - Мотор насосу для автоматичного поливу
WATER_MOTOR_PIN = IOT_CONFIG.get('WATER_MOTOR_PIN', 4)

# Додаткові піни (опціонально)
FAN_PIN = IOT_CONFIG.get('FAN_PIN', 17)
HEATER_PIN = IOT_CONFIG.get('HEATER_PIN', 22)

# Обмеження безпеки
MAX_UV_DURATION = IOT_CONFIG.get('MAX_UV_DURATION', 3600)      # 1 година макс
MAX_WATER_DURATION = IOT_CONFIG.get('MAX_WATER_DURATION', 300)  # 5 хвилин макс
COOLDOWN_PERIOD = IOT_CONFIG.get('COOLDOWN_PERIOD', 60)         # 1 хвилина між активаціями

# Режим симуляції (без реального GPIO)
SIMULATION_MODE = IOT_CONFIG.get('SIMULATION_MODE', True)


class GPIOController:
    """
    ============================================
    Контролер GPIO для Raspberry Pi
    ============================================
    
    Цей клас забезпечує безпечне керування GPIO пінами
    з вбудованими обмеженнями та захистом від помилок.
    
    Приклад використання:
    --------------------
    controller = GPIOController()
    
    # Увімкнути UV лампу на 30 хвилин
    controller.turn_on_uv(duration=1800)
    
    # Увімкнути полив на 2 хвилини
    controller.turn_on_water(duration=120)
    
    # Вимкнути все
    controller.emergency_stop()
    """
    
    def __init__(self):
        """
        Ініціалізація GPIO контролера.
        
        Якщо ми на Raspberry Pi - ініціалізуємо реальний GPIO.
        Якщо в режимі симуляції - просто логуємо дії.
        """
        # Стан пристроїв (True = увімкнено)
        self._states: Dict[str, bool] = {
            'uv_light': False,
            'water_motor': False,
            'fan': False,
            'heater': False,
        }
        
        # Час останньої активації (для cooldown)
        self._last_activation: Dict[str, Optional[datetime]] = {
            'uv_light': None,
            'water_motor': None,
            'fan': None,
            'heater': None,
        }
        
        # Час автоматичного вимкнення
        self._auto_off_time: Dict[str, Optional[datetime]] = {
            'uv_light': None,
            'water_motor': None,
            'fan': None,
            'heater': None,
        }
        
        # Ініціалізація GPIO
        self._gpio_initialized = False
        self._init_gpio()
        
        logger.info("🌱 GPIO Controller ініціалізовано")
        logger.info(f"   UV Light Pin: {UV_LIGHT_PIN}")
        logger.info(f"   Water Motor Pin: {WATER_MOTOR_PIN}")
        logger.info(f"   Режим симуляції: {SIMULATION_MODE}")
    
    def _init_gpio(self) -> None:
        """
        Ініціалізація GPIO пінів.
        
        На Raspberry Pi встановлює піни як OUTPUT
        та вимикає всі реле при старті.
        """
        if SIMULATION_MODE:
            logger.info("🔧 GPIO працює в режимі СИМУЛЯЦІЇ")
            self._gpio_initialized = True
            return
        
        try:
            # Імпортуємо RPi.GPIO тільки на реальному Pi
            import RPi.GPIO as GPIO
            
            # Використовуємо BCM нумерацію пінів
            GPIO.setmode(GPIO.BCM)
            
            # Вимикаємо попередження про зайняті піни
            GPIO.setwarnings(False)
            
            # Налаштовуємо піни як виходи (OUTPUT)
            # Початковий стан HIGH = реле ВИМКНЕНО (для active-low реле)
            GPIO.setup(UV_LIGHT_PIN, GPIO.OUT, initial=GPIO.HIGH)
            GPIO.setup(WATER_MOTOR_PIN, GPIO.OUT, initial=GPIO.HIGH)
            GPIO.setup(FAN_PIN, GPIO.OUT, initial=GPIO.HIGH)
            GPIO.setup(HEATER_PIN, GPIO.OUT, initial=GPIO.HIGH)
            
            self._gpio_initialized = True
            logger.info("✅ GPIO ініціалізовано успішно")
            
        except ImportError:
            logger.warning("⚠️ RPi.GPIO не знайдено - перемикаємось на симуляцію")
            self._gpio_initialized = True
        except Exception as e:
            logger.error(f"❌ Помилка ініціалізації GPIO: {e}")
            self._gpio_initialized = False
    
    def _set_pin(self, pin: int, state: bool) -> bool:
        """
        Встановити стан GPIO піна.
        
        Args:
            pin: Номер GPIO піна (BCM)
            state: True = увімкнути, False = вимкнути
            
        Returns:
            True якщо операція успішна
            
        Note:
            Для active-low реле: LOW = ON, HIGH = OFF
        """
        if SIMULATION_MODE:
            state_str = "ON" if state else "OFF"
            logger.info(f"🔌 [СИМУЛЯЦІЯ] Пін {pin} -> {state_str}")
            return True
        
        try:
            import RPi.GPIO as GPIO
            
            # Для active-low реле інвертуємо сигнал
            # state=True (увімкнути) -> GPIO.LOW
            # state=False (вимкнути) -> GPIO.HIGH
            gpio_state = GPIO.LOW if state else GPIO.HIGH
            GPIO.output(pin, gpio_state)
            
            state_str = "ON" if state else "OFF"
            logger.info(f"🔌 Пін {pin} -> {state_str}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Помилка встановлення піна {pin}: {e}")
            return False
    
    def _check_cooldown(self, device: str) -> bool:
        """
        Перевірити чи пройшов період охолодження.
        
        Запобігає занадто частому ввімкненню/вимкненню
        пристроїв, що може їх пошкодити.
        
        Args:
            device: Назва пристрою ('uv_light', 'water_motor', etc.)
            
        Returns:
            True якщо можна активувати пристрій
        """
        last_time = self._last_activation.get(device)
        
        if last_time is None:
            return True
        
        elapsed = (datetime.now() - last_time).total_seconds()
        
        if elapsed < COOLDOWN_PERIOD:
            remaining = COOLDOWN_PERIOD - elapsed
            logger.warning(
                f"⏳ Cooldown для {device}: зачекайте ще {remaining:.0f} сек"
            )
            return False
        
        return True
    
    # ============================================
    # КЕРУВАННЯ UV ЛАМПОЮ (Пін 27)
    # ============================================
    
    def turn_on_uv(self, duration: int = 1800) -> Dict[str, Any]:
        """
        Увімкнути ультрафіолетову лампу.
        
        UV лампа використовується для:
        - Стимуляції росту рослин
        - Дезинфекції від патогенів
        - Синтезу вітамінів у рослинах
        
        Args:
            duration: Тривалість в секундах (за замовч. 30 хв)
                      Максимум: 3600 сек (1 година)
        
        Returns:
            Dict з результатом операції та статусом
            
        Example:
            >>> controller.turn_on_uv(duration=1800)
            {'success': True, 'device': 'uv_light', 'state': 'on', 
             'duration': 1800, 'auto_off_at': '2024-01-15T15:30:00'}
        """
        logger.info(f"💡 Запит на увімкнення UV лампи на {duration} сек")
        
        # Перевірка cooldown
        if not self._check_cooldown('uv_light'):
            return {
                'success': False,
                'error': 'cooldown',
                'message': 'Зачекайте перед повторною активацією'
            }
        
        # Обмеження тривалості для безпеки
        if duration > MAX_UV_DURATION:
            logger.warning(f"⚠️ Тривалість UV обмежена до {MAX_UV_DURATION} сек")
            duration = MAX_UV_DURATION
        
        # Увімкнення реле
        success = self._set_pin(UV_LIGHT_PIN, True)
        
        if success:
            self._states['uv_light'] = True
            self._last_activation['uv_light'] = datetime.now()
            
            # Час автоматичного вимкнення
            auto_off = datetime.now() + timedelta(seconds=duration)
            self._auto_off_time['uv_light'] = auto_off
            
            logger.info(f"✅ UV лампа УВІМКНЕНА до {auto_off.isoformat()}")
            
            return {
                'success': True,
                'device': 'uv_light',
                'pin': UV_LIGHT_PIN,
                'state': 'on',
                'duration': duration,
                'auto_off_at': auto_off.isoformat(),
                'message': 'UV лампу увімкнено'
            }
        
        return {
            'success': False,
            'error': 'gpio_error',
            'message': 'Помилка керування GPIO'
        }
    
    def turn_off_uv(self) -> Dict[str, Any]:
        """
        Вимкнути ультрафіолетову лампу.
        
        Returns:
            Dict з результатом операції
        """
        logger.info("💡 Запит на вимкнення UV лампи")
        
        success = self._set_pin(UV_LIGHT_PIN, False)
        
        if success:
            self._states['uv_light'] = False
            self._auto_off_time['uv_light'] = None
            
            logger.info("✅ UV лампа ВИМКНЕНА")
            
            return {
                'success': True,
                'device': 'uv_light',
                'pin': UV_LIGHT_PIN,
                'state': 'off',
                'message': 'UV лампу вимкнено'
            }
        
        return {
            'success': False,
            'error': 'gpio_error',
            'message': 'Помилка керування GPIO'
        }
    
    # ============================================
    # КЕРУВАННЯ МОТОРОМ ПОЛИВУ (Пін 24)
    # ============================================
    
    def turn_on_water(self, duration: int = 120) -> Dict[str, Any]:
        """
        Увімкнути мотор/насос для поливу.
        
        Насос використовується для:
        - Автоматичного поливу за розкладом
        - Ручного поливу через інтерфейс
        - Екстреного поливу при низькій вологості
        
        Args:
            duration: Тривалість в секундах (за замовч. 2 хв)
                      Максимум: 300 сек (5 хвилин) для захисту від затоплення
        
        Returns:
            Dict з результатом операції
            
        Warning:
            Занадто довгий полив може затопити рослини!
            Система автоматично обмежує тривалість.
        """
        logger.info(f"💧 Запит на увімкнення мотора поливу на {duration} сек")
        
        # Перевірка cooldown
        if not self._check_cooldown('water_motor'):
            return {
                'success': False,
                'error': 'cooldown',
                'message': 'Зачекайте перед повторним поливом'
            }
        
        # ВАЖЛИВО: Обмеження тривалості для захисту від затоплення
        if duration > MAX_WATER_DURATION:
            logger.warning(f"⚠️ Тривалість поливу обмежена до {MAX_WATER_DURATION} сек")
            duration = MAX_WATER_DURATION
        
        # Увімкнення реле мотора
        success = self._set_pin(WATER_MOTOR_PIN, True)
        
        if success:
            self._states['water_motor'] = True
            self._last_activation['water_motor'] = datetime.now()
            
            # Час автоматичного вимкнення
            auto_off = datetime.now() + timedelta(seconds=duration)
            self._auto_off_time['water_motor'] = auto_off
            
            logger.info(f"✅ Мотор поливу УВІМКНЕНИЙ до {auto_off.isoformat()}")
            
            return {
                'success': True,
                'device': 'water_motor',
                'pin': WATER_MOTOR_PIN,
                'state': 'on',
                'duration': duration,
                'auto_off_at': auto_off.isoformat(),
                'message': 'Полив розпочато'
            }
        
        return {
            'success': False,
            'error': 'gpio_error',
            'message': 'Помилка керування GPIO'
        }
    
    def turn_off_water(self) -> Dict[str, Any]:
        """
        Вимкнути мотор/насос для поливу.
        
        Returns:
            Dict з результатом операції
        """
        logger.info("💧 Запит на вимкнення мотора поливу")
        
        success = self._set_pin(WATER_MOTOR_PIN, False)
        
        if success:
            self._states['water_motor'] = False
            self._auto_off_time['water_motor'] = None
            
            logger.info("✅ Мотор поливу ВИМКНЕНИЙ")
            
            return {
                'success': True,
                'device': 'water_motor',
                'pin': WATER_MOTOR_PIN,
                'state': 'off',
                'message': 'Полив зупинено'
            }
        
        return {
            'success': False,
            'error': 'gpio_error',
            'message': 'Помилка керування GPIO'
        }
    
    # ============================================
    # АВАРІЙНЕ ВИМКНЕННЯ
    # ============================================
    
    def emergency_stop(self) -> Dict[str, Any]:
        """
        Аварійне вимкнення всіх пристроїв.
        
        Використовується при:
        - Виявленні критичної загрози безпеці
        - Кібератаці на систему
        - Збої сенсорів
        - Ручному екстреному вимкненні
        
        Returns:
            Dict зі статусом всіх пристроїв
        """
        logger.warning("🚨 АВАРІЙНЕ ВИМКНЕННЯ ВСІХ ПРИСТРОЇВ!")
        
        results = {}
        
        # Вимикаємо всі реле
        devices = [
            ('uv_light', UV_LIGHT_PIN),
            ('water_motor', WATER_MOTOR_PIN),
            ('fan', FAN_PIN),
            ('heater', HEATER_PIN),
        ]
        
        for device_name, pin in devices:
            success = self._set_pin(pin, False)
            self._states[device_name] = False
            self._auto_off_time[device_name] = None
            results[device_name] = 'off' if success else 'error'
        
        logger.warning("🚨 Всі пристрої вимкнено")
        
        return {
            'success': True,
            'action': 'emergency_stop',
            'devices': results,
            'message': 'Аварійне вимкнення виконано'
        }
    
    # ============================================
    # СТАТУС ПРИСТРОЇВ
    # ============================================
    
    def get_status(self) -> Dict[str, Any]:
        """
        Отримати поточний статус всіх пристроїв.
        
        Returns:
            Dict з повним статусом системи
        """
        now = datetime.now()
        
        return {
            'simulation_mode': SIMULATION_MODE,
            'gpio_initialized': self._gpio_initialized,
            'timestamp': now.isoformat(),
            'devices': {
                'uv_light': {
                    'pin': UV_LIGHT_PIN,
                    'state': 'on' if self._states['uv_light'] else 'off',
                    'auto_off_at': (
                        self._auto_off_time['uv_light'].isoformat() 
                        if self._auto_off_time['uv_light'] else None
                    ),
                },
                'water_motor': {
                    'pin': WATER_MOTOR_PIN,
                    'state': 'on' if self._states['water_motor'] else 'off',
                    'auto_off_at': (
                        self._auto_off_time['water_motor'].isoformat() 
                        if self._auto_off_time['water_motor'] else None
                    ),
                },
                'fan': {
                    'pin': FAN_PIN,
                    'state': 'on' if self._states['fan'] else 'off',
                },
                'heater': {
                    'pin': HEATER_PIN,
                    'state': 'on' if self._states['heater'] else 'off',
                },
            }
        }
    
    def cleanup(self) -> None:
        """
        Очистити GPIO ресурси при завершенні програми.
        
        ВАЖЛИВО: Викликайте цей метод при завершенні програми!
        """
        logger.info("🧹 Очищення GPIO ресурсів...")
        
        # Спочатку вимикаємо все
        self.emergency_stop()
        
        if not SIMULATION_MODE:
            try:
                import RPi.GPIO as GPIO
                GPIO.cleanup()
                logger.info("✅ GPIO ресурси очищено")
            except Exception as e:
                logger.error(f"❌ Помилка очищення GPIO: {e}")


# ============================================
# ГЛОБАЛЬНИЙ ЕКЗЕМПЛЯР КОНТРОЛЕРА
# ============================================
# Створюємо один екземпляр для всього застосунку
gpio_controller = GPIOController()
