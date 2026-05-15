# =============================================================================
# SmartGrow SecureAI - Intrusion Detection System (IDS)
# =============================================================================
# Інспіровано: FSociety reconnaissance, Kraken threat detection
# 
# Система виявлення вторгнень аналізує:
# - Мережевий трафік на аномалії
# - Поведінкові патерни користувачів
# - Цілісність даних сенсорів
# - Спроби несанкціонованого доступу
# =============================================================================

import hashlib
import hmac
import json
import re
import time
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
from collections import defaultdict
from dataclasses import dataclass, field
from enum import Enum
import ipaddress
import statistics

logger = logging.getLogger('smartgrow.security.ids')


# =============================================================================
# КЛАСИФІКАЦІЯ ЗАГРОЗ (Threat Classification)
# =============================================================================

class ThreatLevel(Enum):
    """
    Рівні загроз за стандартом CVSS (Common Vulnerability Scoring System)
    
    NONE: Немає загрози (0.0)
    LOW: Низький ризик (0.1-3.9) - інформаційні події
    MEDIUM: Середній ризик (4.0-6.9) - потребує уваги
    HIGH: Високий ризик (7.0-8.9) - негайна реакція
    CRITICAL: Критичний (9.0-10.0) - автоматичний карантин
    """
    NONE = 0
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    CRITICAL = 4


class AttackType(Enum):
    """
    Типи атак, які система здатна виявляти
    
    Категорії:
    1. Мережеві атаки (Network-based)
    2. Атаки на застосунок (Application-based)
    3. IoT-специфічні атаки
    4. Соціальна інженерія
    """
    # === Мережеві атаки ===
    DDOS = "ddos"                          # Distributed Denial of Service
    BRUTE_FORCE = "brute_force"            # Перебір паролів
    PORT_SCAN = "port_scan"                # Сканування портів (nmap-style)
    MITM = "mitm"                          # Man-in-the-Middle
    ARP_SPOOFING = "arp_spoofing"          # Підміна ARP таблиць
    DNS_SPOOFING = "dns_spoofing"          # Підміна DNS записів
    
    # === Атаки на застосунок ===
    SQL_INJECTION = "sql_injection"        # SQL ін'єкції
    XSS = "xss"                            # Cross-Site Scripting
    CSRF = "csrf"                          # Cross-Site Request Forgery
    COMMAND_INJECTION = "command_injection" # Ін'єкція команд ОС
    PATH_TRAVERSAL = "path_traversal"      # Обхід директорій (../)
    
    # === IoT-специфічні атаки ===
    SENSOR_SPOOFING = "sensor_spoofing"    # Підміна даних сенсорів
    DATA_POISONING = "data_poisoning"      # Отруєння даних ML моделей
    REPLAY_ATTACK = "replay_attack"        # Повторне відтворення команд
    FIRMWARE_ATTACK = "firmware_attack"    # Атака на прошивку
    GPIO_MANIPULATION = "gpio_manipulation" # Маніпуляція GPIO пінами
    GRADUAL_DRIFT = "gradual_drift"        # Поступова зміна параметрів
    
    # === Інші ===
    ANOMALY = "anomaly"                    # Невідома аномалія
    SUSPICIOUS_ACTIVITY = "suspicious"     # Підозріла активність


@dataclass
class ThreatSignature:
    """
    Сигнатура загрози для Pattern Matching
    
    Attributes:
        id: Унікальний ідентифікатор сигнатури
        name: Назва загрози
        attack_type: Тип атаки
        patterns: Список regex патернів для виявлення
        threat_level: Рівень загрози
        description: Опис загрози
        mitigation: Рекомендації щодо усунення
    """
    id: str
    name: str
    attack_type: AttackType
    patterns: List[str]
    threat_level: ThreatLevel
    description: str
    mitigation: str


@dataclass
class SecurityEvent:
    """
    Подія безпеки, зафіксована IDS
    
    Attributes:
        timestamp: Час виявлення
        attack_type: Тип атаки
        threat_level: Рівень загрози
        source_ip: IP-адреса джерела
        target: Ціль атаки
        payload: Перехоплені дані
        signature_id: ID сигнатури, яка спрацювала
        blocked: Чи була атака заблокована
        details: Додаткові деталі
    """
    timestamp: datetime
    attack_type: AttackType
    threat_level: ThreatLevel
    source_ip: str
    target: str
    payload: str = ""
    signature_id: Optional[str] = None
    blocked: bool = False
    details: Dict[str, Any] = field(default_factory=dict)


# =============================================================================
# БАЗА СИГНАТУР ЗАГРОЗ (Threat Signature Database)
# =============================================================================

class ThreatSignatureDB:
    """
    База даних сигнатур загроз
    
    Містить патерни для виявлення відомих атак.
    Натхненний базами Snort, Suricata та YARA rules.
    """
    
    def __init__(self):
        self.signatures: Dict[str, ThreatSignature] = {}
        self._load_default_signatures()
    
    def _load_default_signatures(self):
        """Завантаження стандартних сигнатур загроз"""
        
        # === SQL Injection сигнатури ===
        # Захист від атак типу: ' OR '1'='1, UNION SELECT, etc.
        self.add_signature(ThreatSignature(
            id="SQLI-001",
            name="SQL Injection - Basic",
            attack_type=AttackType.SQL_INJECTION,
            patterns=[
                r"(\%27)|(\')|(\-\-)|(\%23)|(#)",  # Коментарі SQL
                r"((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))",  # = з спецсимволами
                r"\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))",  # 'or
                r"((\%27)|(\'))union",  # 'union
            ],
            threat_level=ThreatLevel.HIGH,
            description="Виявлено спробу SQL ін'єкції. Атакуючий намагається маніпулювати базою даних.",
            mitigation="Використовуйте параметризовані запити. Перевірте логи бази даних."
        ))
        
        self.add_signature(ThreatSignature(
            id="SQLI-002",
            name="SQL Injection - Advanced",
            attack_type=AttackType.SQL_INJECTION,
            patterns=[
                r"union.*select.*from",  # UNION SELECT
                r"select.*from.*information_schema",  # Перелік таблиць
                r"insert.*into.*values",  # INSERT атака
                r"delete.*from",  # DELETE атака
                r"drop.*table",  # DROP TABLE
                r"exec(\s|\+)+(x|s)p",  # Виконання stored procedures
                r"benchmark\s*\(",  # Timing атака
                r"sleep\s*\(",  # Time-based blind SQLi
            ],
            threat_level=ThreatLevel.CRITICAL,
            description="Виявлено складну SQL ін'єкцію. Можлива компрометація бази даних.",
            mitigation="ТЕРМІНОВО: Ізолюйте базу даних. Перевірте цілісність даних."
        ))
        
        # === XSS сигнатури ===
        # Захист від: <script>alert('xss')</script>, javascript:, onerror=, etc.
        self.add_signature(ThreatSignature(
            id="XSS-001",
            name="Cross-Site Scripting",
            attack_type=AttackType.XSS,
            patterns=[
                r"<script[^>]*>.*?</script>",  # Script теги
                r"javascript\s*:",  # javascript: протокол
                r"on(load|error|click|mouse|focus)\s*=",  # Event handlers
                r"<img[^>]+onerror\s*=",  # IMG onerror
                r"<svg[^>]+onload\s*=",  # SVG onload
                r"expression\s*\(",  # CSS expression
                r"url\s*\(\s*['\"]?javascript:",  # CSS javascript
            ],
            threat_level=ThreatLevel.HIGH,
            description="Виявлено спробу XSS атаки. Атакуючий намагається впровадити шкідливий код.",
            mitigation="Екрануйте весь вивід. Використовуйте Content Security Policy."
        ))
        
        # === Command Injection ===
        # Захист від: ; rm -rf /, | cat /etc/passwd, $(whoami), etc.
        self.add_signature(ThreatSignature(
            id="CMDI-001",
            name="Command Injection",
            attack_type=AttackType.COMMAND_INJECTION,
            patterns=[
                r";\s*(ls|cat|rm|wget|curl|nc|bash|sh|python|perl)",  # Конкатенація команд
                r"\|\s*(cat|grep|awk|sed|cut)",  # Pipe команди
                r"\$\((.*)\)",  # Command substitution
                r"`.*`",  # Backtick execution
                r"/etc/(passwd|shadow|hosts)",  # Читання системних файлів
                r"&&\s*(rm|wget|curl)",  # AND execution
            ],
            threat_level=ThreatLevel.CRITICAL,
            description="Виявлено спробу виконання команд ОС. Критична загроза!",
            mitigation="ТЕРМІНОВО: Ізолюйте систему. Перевірте процеси та файли."
        ))
        
        # === Path Traversal ===
        # Захист від: ../../etc/passwd, ..\..\windows\system32, etc.
        self.add_signature(ThreatSignature(
            id="PATH-001",
            name="Path Traversal",
            attack_type=AttackType.PATH_TRAVERSAL,
            patterns=[
                r"\.\./",  # Unix path traversal
                r"\.\.\\",  # Windows path traversal
                r"%2e%2e%2f",  # URL encoded ../
                r"%252e%252e%252f",  # Double URL encoded
                r"\.\.%c0%af",  # Overlong UTF-8
                r"\.\.%c1%9c",  # Overlong UTF-8 variant
            ],
            threat_level=ThreatLevel.HIGH,
            description="Виявлено спробу обходу директорій. Атакуючий намагається отримати доступ до файлів.",
            mitigation="Валідуйте шляхи до файлів. Обмежте доступ до файлової системи."
        ))
        
        # === IoT Sensor Spoofing ===
        # Захист від підміни даних сенсорів
        self.add_signature(ThreatSignature(
            id="IOT-001",
            name="Sensor Data Spoofing",
            attack_type=AttackType.SENSOR_SPOOFING,
            patterns=[
                r"temperature[\"']?\s*:\s*(-?\d{3,}|[5-9]\d)",  # Нереальна температура
                r"humidity[\"']?\s*:\s*(1[1-9]\d|[2-9]\d{2}|\d{4,})",  # Вологість > 110%
                r"ph[\"']?\s*:\s*(1[5-9]|[2-9]\d|\d{3,})",  # pH > 14
                r"moisture[\"']?\s*:\s*(1[1-9]\d|[2-9]\d{2})",  # Вологість грунту > 110%
            ],
            threat_level=ThreatLevel.HIGH,
            description="Виявлено фізично неможливі дані сенсорів. Ймовірна підміна даних.",
            mitigation="Перевірте фізичне підключення сенсорів. Калібруйте обладнання."
        ))
        
        # === Replay Attack ===
        self.add_signature(ThreatSignature(
            id="REPLAY-001",
            name="Replay Attack Detection",
            attack_type=AttackType.REPLAY_ATTACK,
            patterns=[],  # Виявляється через аналіз timestamp та nonce
            threat_level=ThreatLevel.HIGH,
            description="Виявлено повторне відтворення команди. Можлива replay атака.",
            mitigation="Оновіть токени аутентифікації. Перевірте логи команд."
        ))
        
        # === DDoS патерни ===
        self.add_signature(ThreatSignature(
            id="DDOS-001",
            name="DDoS Attack Pattern",
            attack_type=AttackType.DDOS,
            patterns=[],  # Виявляється через аналіз трафіку
            threat_level=ThreatLevel.CRITICAL,
            description="Виявлено DDoS атаку. Система під навантаженням.",
            mitigation="Увімкніть rate limiting. Зверніться до ISP для фільтрації."
        ))
        
        # === Brute Force ===
        self.add_signature(ThreatSignature(
            id="BRUTE-001",
            name="Brute Force Attack",
            attack_type=AttackType.BRUTE_FORCE,
            patterns=[],  # Виявляється через підрахунок невдалих спроб
            threat_level=ThreatLevel.HIGH,
            description="Виявлено атаку перебором паролів.",
            mitigation="Заблокуйте IP. Увімкніть 2FA. Перевірте витоки паролів."
        ))
    
    def add_signature(self, signature: ThreatSignature):
        """Додає нову сигнатуру до бази"""
        self.signatures[signature.id] = signature
        logger.info(f"Додано сигнатуру: {signature.id} - {signature.name}")
    
    def match(self, data: str) -> List[ThreatSignature]:
        """
        Перевіряє дані на відповідність сигнатурам
        
        Args:
            data: Вхідні дані для перевірки
            
        Returns:
            Список сигнатур, що спрацювали
        """
        matched = []
        data_lower = data.lower()
        
        for sig in self.signatures.values():
            for pattern in sig.patterns:
                try:
                    if re.search(pattern, data_lower, re.IGNORECASE):
                        matched.append(sig)
                        logger.warning(f"Сигнатура {sig.id} спрацювала: {pattern}")
                        break  # Одна сигнатура - один матч
                except re.error as e:
                    logger.error(f"Помилка regex в сигнатурі {sig.id}: {e}")
        
        return matched


# =============================================================================
# АНАЛІЗАТОР АНОМАЛІЙ (Anomaly Detector)
# =============================================================================

class AnomalyDetector:
    """
    Детектор аномалій на основі статистичного аналізу
    
    Використовує:
    - Z-score для виявлення викидів
    - Ковзне середнє для трендів
    - Entropy аналіз для виявлення хаотичних даних
    
    Натхненний: Isolation Forest, LSTM anomaly detection
    """
    
    def __init__(self, window_size: int = 100):
        """
        Args:
            window_size: Розмір вікна для статистичного аналізу
        """
        self.window_size = window_size
        
        # Історія даних сенсорів для кожного типу
        self.sensor_history: Dict[str, List[float]] = defaultdict(list)
        
        # Нормальні діапазони для IoT теплиці
        self.normal_ranges = {
            'temperature': (15.0, 35.0),      # Температура в °C
            'humidity': (30.0, 90.0),         # Вологість повітря в %
            'soil_moisture': (20.0, 80.0),    # Вологість грунту в %
            'ph': (5.5, 7.5),                 # pH рівень
            'ec': (0.5, 3.0),                 # Електропровідність
            'light': (0, 100000),             # Освітленість в lux
            'co2': (300, 2000),               # CO2 в ppm
        }
        
        # Максимальні швидкості зміни (за хвилину)
        self.max_change_rates = {
            'temperature': 2.0,    # Макс 2°C/хв
            'humidity': 10.0,      # Макс 10%/хв
            'soil_moisture': 5.0,  # Макс 5%/хв
            'ph': 0.5,             # Макс 0.5/хв
        }
    
    def add_reading(self, sensor_type: str, value: float) -> Optional[SecurityEvent]:
        """
        Додає нове показання сенсора та перевіряє на аномалії
        
        Args:
            sensor_type: Тип сенсора (temperature, humidity, etc.)
            value: Значення показання
            
        Returns:
            SecurityEvent якщо виявлено аномалію, інакше None
        """
        history = self.sensor_history[sensor_type]
        
        # === Перевірка діапазону ===
        if sensor_type in self.normal_ranges:
            min_val, max_val = self.normal_ranges[sensor_type]
            if value < min_val or value > max_val:
                logger.warning(f"Сенсор {sensor_type}: значення {value} поза діапазоном [{min_val}, {max_val}]")
                return SecurityEvent(
                    timestamp=datetime.now(),
                    attack_type=AttackType.SENSOR_SPOOFING,
                    threat_level=ThreatLevel.HIGH,
                    source_ip="internal",
                    target=f"sensor/{sensor_type}",
                    payload=str(value),
                    details={
                        'sensor_type': sensor_type,
                        'value': value,
                        'expected_range': (min_val, max_val),
                        'reason': 'out_of_range'
                    }
                )
        
        # === Перевірка швидкості зміни ===
        if history and sensor_type in self.max_change_rates:
            last_value = history[-1]
            change = abs(value - last_value)
            max_change = self.max_change_rates[sensor_type]
            
            if change > max_change:
                logger.warning(f"Сенсор {sensor_type}: різка зміна {change} > {max_change}")
                return SecurityEvent(
                    timestamp=datetime.now(),
                    attack_type=AttackType.DATA_POISONING,
                    threat_level=ThreatLevel.MEDIUM,
                    source_ip="internal",
                    target=f"sensor/{sensor_type}",
                    payload=str(value),
                    details={
                        'sensor_type': sensor_type,
                        'value': value,
                        'previous_value': last_value,
                        'change': change,
                        'max_allowed_change': max_change,
                        'reason': 'rapid_change'
                    }
                )
        
        # === Z-score аналіз для виявлення викидів ===
        if len(history) >= 10:
            mean = statistics.mean(history[-self.window_size:])
            stdev = statistics.stdev(history[-self.window_size:])
            
            if stdev > 0:
                z_score = abs((value - mean) / stdev)
                
                # Z-score > 3 вважається аномалією (99.7% впевненість)
                if z_score > 3:
                    logger.warning(f"Сенсор {sensor_type}: Z-score {z_score:.2f} > 3")
                    return SecurityEvent(
                        timestamp=datetime.now(),
                        attack_type=AttackType.ANOMALY,
                        threat_level=ThreatLevel.MEDIUM,
                        source_ip="internal",
                        target=f"sensor/{sensor_type}",
                        payload=str(value),
                        details={
                            'sensor_type': sensor_type,
                            'value': value,
                            'mean': mean,
                            'stdev': stdev,
                            'z_score': z_score,
                            'reason': 'statistical_outlier'
                        }
                    )
        
        # === Додаємо до історії ===
        history.append(value)
        
        # Обмежуємо розмір історії
        if len(history) > self.window_size * 2:
            self.sensor_history[sensor_type] = history[-self.window_size:]
        
        return None
    
    def detect_gradual_drift(self, sensor_type: str, window: int = 60) -> Optional[SecurityEvent]:
        """
        Виявляє поступовий дрейф даних (Gradual Drift Attack)
        
        Атакуючий може повільно змінювати дані, щоб уникнути виявлення.
        Цей метод аналізує тренд за останні `window` показань.
        
        Args:
            sensor_type: Тип сенсора
            window: Вікно аналізу
            
        Returns:
            SecurityEvent якщо виявлено дрейф
        """
        history = self.sensor_history.get(sensor_type, [])
        
        if len(history) < window:
            return None
        
        recent = history[-window:]
        
        # Обчислюємо лінійний тренд (спрощена версія)
        n = len(recent)
        sum_x = sum(range(n))
        sum_y = sum(recent)
        sum_xy = sum(i * y for i, y in enumerate(recent))
        sum_x2 = sum(i * i for i in range(n))
        
        # Нахил лінії тренду
        denominator = n * sum_x2 - sum_x * sum_x
        if denominator == 0:
            return None
        
        slope = (n * sum_xy - sum_x * sum_y) / denominator
        
        # Якщо нахил занадто великий, це може бути drift attack
        # Порогові значення залежать від типу сенсора
        drift_thresholds = {
            'temperature': 0.05,   # 0.05°C/показання
            'humidity': 0.1,       # 0.1%/показання
            'ph': 0.01,           # 0.01/показання
        }
        
        threshold = drift_thresholds.get(sensor_type, 0.1)
        
        if abs(slope) > threshold:
            logger.warning(f"Сенсор {sensor_type}: виявлено drift, slope={slope:.4f}")
            return SecurityEvent(
                timestamp=datetime.now(),
                attack_type=AttackType.GRADUAL_DRIFT,
                threat_level=ThreatLevel.MEDIUM,
                source_ip="internal",
                target=f"sensor/{sensor_type}",
                details={
                    'sensor_type': sensor_type,
                    'slope': slope,
                    'threshold': threshold,
                    'window_size': window,
                    'reason': 'gradual_drift_detected'
                }
            )
        
        return None


# =============================================================================
# RATE LIMITER (Захист від DDoS та Brute Force)
# =============================================================================

class RateLimiter:
    """
    Обмежувач частоти запитів
    
    Реалізує алгоритм Token Bucket для ефективного rate limiting.
    Захищає від:
    - DDoS атак
    - Brute Force атак
    - API abuse
    
    Натхненний: Cloudflare, AWS WAF
    """
    
    def __init__(
        self,
        requests_per_minute: int = 60,
        burst_size: int = 10,
        block_duration_seconds: int = 300
    ):
        """
        Args:
            requests_per_minute: Максимум запитів на хвилину
            burst_size: Розмір burst (короткочасне перевищення)
            block_duration_seconds: Час блокування в секундах
        """
        self.requests_per_minute = requests_per_minute
        self.burst_size = burst_size
        self.block_duration = block_duration_seconds
        
        # Відстеження запитів по IP
        self.request_counts: Dict[str, List[float]] = defaultdict(list)
        
        # Заблоковані IP
        self.blocked_ips: Dict[str, datetime] = {}
        
        # Підозрілі IP (потребують капчу або додаткової верифікації)
        self.suspicious_ips: Dict[str, int] = defaultdict(int)
        
        # Whitelist (довірені IP)
        self.whitelist: set = set()
    
    def is_allowed(self, ip: str) -> Tuple[bool, Optional[str]]:
        """
        Перевіряє чи дозволений запит з даного IP
        
        Args:
            ip: IP-адреса клієнта
            
        Returns:
            Tuple[дозволено, причина_блокування]
        """
        # Whitelist завжди дозволений
        if ip in self.whitelist:
            return True, None
        
        # Перевірка блокування
        if ip in self.blocked_ips:
            block_time = self.blocked_ips[ip]
            if datetime.now() < block_time + timedelta(seconds=self.block_duration):
                remaining = (block_time + timedelta(seconds=self.block_duration) - datetime.now()).seconds
                return False, f"IP заблоковано. Спробуйте через {remaining} секунд."
            else:
                # Розблоковуємо
                del self.blocked_ips[ip]
        
        # Очищуємо старі запити (старші 1 хвилини)
        now = time.time()
        self.request_counts[ip] = [
            t for t in self.request_counts[ip] 
            if now - t < 60
        ]
        
        # Перевіряємо ліміт
        request_count = len(self.request_counts[ip])
        
        if request_count >= self.requests_per_minute + self.burst_size:
            # Блокуємо IP
            self.blocked_ips[ip] = datetime.now()
            logger.warning(f"IP {ip} заблоковано: {request_count} запитів/хв")
            return False, "Перевищено ліміт запитів. IP тимчасово заблоковано."
        
        if request_count >= self.requests_per_minute:
            # Підвищуємо рівень підозрілості
            self.suspicious_ips[ip] += 1
            logger.info(f"IP {ip} наближається до ліміту: {request_count} запитів/хв")
        
        # Записуємо запит
        self.request_counts[ip].append(now)
        
        return True, None
    
    def record_failed_attempt(self, ip: str, attempt_type: str = "login"):
        """
        Записує невдалу спробу (для виявлення brute force)
        
        Args:
            ip: IP-адреса
            attempt_type: Тип спроби (login, api_key, etc.)
        """
        self.suspicious_ips[ip] += 5  # Невдалі спроби важать більше
        
        if self.suspicious_ips[ip] >= 20:
            self.blocked_ips[ip] = datetime.now()
            logger.warning(f"IP {ip} заблоковано через підозрілу активність ({attempt_type})")
    
    def add_to_whitelist(self, ip: str):
        """Додає IP до whitelist"""
        self.whitelist.add(ip)
        logger.info(f"IP {ip} додано до whitelist")
    
    def get_blocked_ips(self) -> List[Dict]:
        """Повертає список заблокованих IP"""
        now = datetime.now()
        return [
            {
                'ip': ip,
                'blocked_at': block_time.isoformat(),
                'remaining_seconds': max(0, (block_time + timedelta(seconds=self.block_duration) - now).seconds)
            }
            for ip, block_time in self.blocked_ips.items()
            if now < block_time + timedelta(seconds=self.block_duration)
        ]


# =============================================================================
# REPLAY ATTACK DETECTOR
# =============================================================================

class ReplayAttackDetector:
    """
    Детектор Replay атак
    
    Replay атака - повторне відтворення перехопленого запиту.
    Захист через:
    - Унікальні nonce (number used once)
    - Timestamp validation
    - Request signature verification
    
    Натхненний: OAuth 2.0 nonce, Kerberos timestamps
    """
    
    def __init__(self, max_age_seconds: int = 300, nonce_storage_size: int = 10000):
        """
        Args:
            max_age_seconds: Максимальний вік запиту
            nonce_storage_size: Розмір сховища nonce
        """
        self.max_age = max_age_seconds
        self.storage_size = nonce_storage_size
        
        # Сховище використаних nonce
        self.used_nonces: Dict[str, float] = {}
    
    def validate_request(
        self,
        nonce: str,
        timestamp: float,
        signature: str,
        payload: str,
        secret_key: str
    ) -> Tuple[bool, Optional[str]]:
        """
        Валідує запит на replay атаку
        
        Args:
            nonce: Унікальний ідентифікатор запиту
            timestamp: Unix timestamp запиту
            signature: HMAC підпис запиту
            payload: Тіло запиту
            secret_key: Секретний ключ для перевірки підпису
            
        Returns:
            Tuple[валідний, причина_відхилення]
        """
        now = time.time()
        
        # === Перевірка timestamp ===
        if abs(now - timestamp) > self.max_age:
            return False, f"Запит застарілий (вік: {abs(now - timestamp):.0f}с, макс: {self.max_age}с)"
        
        # === Перевірка nonce ===
        if nonce in self.used_nonces:
            logger.warning(f"Виявлено replay атаку: nonce {nonce} вже використано")
            return False, "Nonce вже використано. Можлива replay атака."
        
        # === Перевірка підпису ===
        expected_signature = self._generate_signature(nonce, timestamp, payload, secret_key)
        
        if not hmac.compare_digest(signature, expected_signature):
            logger.warning(f"Невірний підпис запиту")
            return False, "Невірний підпис запиту."
        
        # === Зберігаємо nonce ===
        self.used_nonces[nonce] = now
        
        # Очищаємо старі nonce
        self._cleanup_nonces()
        
        return True, None
    
    def _generate_signature(
        self,
        nonce: str,
        timestamp: float,
        payload: str,
        secret_key: str
    ) -> str:
        """Генерує HMAC-SHA256 підпис"""
        message = f"{nonce}:{timestamp}:{payload}"
        return hmac.new(
            secret_key.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
    
    def _cleanup_nonces(self):
        """Очищує застарілі nonce"""
        now = time.time()
        expired = [
            nonce for nonce, ts in self.used_nonces.items()
            if now - ts > self.max_age
        ]
        for nonce in expired:
            del self.used_nonces[nonce]
        
        # Якщо сховище переповнене, видаляємо найстаріші
        if len(self.used_nonces) > self.storage_size:
            sorted_nonces = sorted(self.used_nonces.items(), key=lambda x: x[1])
            for nonce, _ in sorted_nonces[:len(sorted_nonces) - self.storage_size]:
                del self.used_nonces[nonce]


# =============================================================================
# ГОЛОВНА СИСТЕМА IDS (Intrusion Detection System)
# =============================================================================

class IntrusionDetectionSystem:
    """
    Головна система виявлення вторгнень
    
    Об'єднує всі компоненти безпеки:
    - Signature-based detection (сигнатури)
    - Anomaly-based detection (аномалії)
    - Rate limiting (обмеження частоти)
    - Replay attack prevention
    
    Архітектура Zero-Trust: "Ніколи не довіряй, завжди перевіряй"
    """
    
    def __init__(self, secret_key: str = "smartgrow-secret-key-change-in-production"):
        """
        Args:
            secret_key: Секретний ключ для криптографічних операцій
        """
        self.secret_key = secret_key
        
        # Ініціалізація компонентів
        self.signature_db = ThreatSignatureDB()
        self.anomaly_detector = AnomalyDetector()
        self.rate_limiter = RateLimiter()
        self.replay_detector = ReplayAttackDetector()
        
        # Журнал подій безпеки
        self.security_events: List[SecurityEvent] = []
        
        # Загальний Trust Score (0-100)
        self.trust_score = 100
        
        # Режим карантину
        self.quarantine_mode = False
        
        logger.info("IDS ініціалізовано успішно")
    
    def analyze_request(
        self,
        ip: str,
        path: str,
        method: str,
        headers: Dict[str, str],
        body: str,
        nonce: Optional[str] = None,
        timestamp: Optional[float] = None,
        signature: Optional[str] = None
    ) -> Tuple[bool, List[SecurityEvent]]:
        """
        Аналізує вхідний HTTP запит на загрози
        
        Args:
            ip: IP-адреса клієнта
            path: URL шлях
            method: HTTP метод
            headers: Заголовки запиту
            body: Тіло запиту
            nonce: Nonce для replay protection
            timestamp: Timestamp запиту
            signature: Підпис запиту
            
        Returns:
            Tuple[дозволено, список_подій_безпеки]
        """
        events = []
        
        # === 1. Rate Limiting ===
        allowed, reason = self.rate_limiter.is_allowed(ip)
        if not allowed:
            events.append(SecurityEvent(
                timestamp=datetime.now(),
                attack_type=AttackType.DDOS,
                threat_level=ThreatLevel.HIGH,
                source_ip=ip,
                target=path,
                blocked=True,
                details={'reason': reason}
            ))
            self._update_trust_score(-5)
            return False, events
        
        # === 2. Replay Attack Detection ===
        if nonce and timestamp and signature:
            valid, reason = self.replay_detector.validate_request(
                nonce, timestamp, signature, body, self.secret_key
            )
            if not valid:
                events.append(SecurityEvent(
                    timestamp=datetime.now(),
                    attack_type=AttackType.REPLAY_ATTACK,
                    threat_level=ThreatLevel.HIGH,
                    source_ip=ip,
                    target=path,
                    blocked=True,
                    details={'reason': reason}
                ))
                self._update_trust_score(-10)
                return False, events
        
        # === 3. Signature-based Detection ===
        # Перевіряємо URL, тіло та заголовки
        data_to_check = f"{path} {body} {json.dumps(headers)}"
        matched_signatures = self.signature_db.match(data_to_check)
        
        for sig in matched_signatures:
            event = SecurityEvent(
                timestamp=datetime.now(),
                attack_type=sig.attack_type,
                threat_level=sig.threat_level,
                source_ip=ip,
                target=path,
                payload=body[:500],  # Обмежуємо розмір
                signature_id=sig.id,
                blocked=sig.threat_level.value >= ThreatLevel.HIGH.value,
                details={
                    'signature_name': sig.name,
                    'description': sig.description,
                    'mitigation': sig.mitigation
                }
            )
            events.append(event)
            
            # Оновлюємо Trust Score залежно від рівня загрози
            penalty = {
                ThreatLevel.LOW: -1,
                ThreatLevel.MEDIUM: -3,
                ThreatLevel.HIGH: -7,
                ThreatLevel.CRITICAL: -15
            }.get(sig.threat_level, -1)
            self._update_trust_score(penalty)
        
        # === 4. Блокуємо критичні загрози ===
        critical_events = [e for e in events if e.threat_level == ThreatLevel.CRITICAL]
        if critical_events:
            self.rate_limiter.blocked_ips[ip] = datetime.now()
            logger.critical(f"КРИТИЧНА ЗАГРОЗА від {ip}: {[e.attack_type.value for e in critical_events]}")
            
            # Автоматичний карантин при критичній загрозі
            if self.trust_score < 50:
                self.quarantine_mode = True
                logger.critical("УВІМКНЕНО РЕЖИМ КАРАНТИНУ")
        
        # Зберігаємо події
        self.security_events.extend(events)
        
        # Обмежуємо розмір журналу
        if len(self.security_events) > 1000:
            self.security_events = self.security_events[-500:]
        
        # Дозволяємо якщо немає HIGH/CRITICAL загроз
        blocked = any(e.blocked for e in events)
        return not blocked, events
    
    def analyze_sensor_data(
        self,
        sensor_type: str,
        value: float,
        device_id: str
    ) -> Tuple[bool, List[SecurityEvent]]:
        """
        Аналізує дані сенсора на аномалії та підміну
        
        Args:
            sensor_type: Тип сенсора
            value: Значення
            device_id: ID пристрою
            
        Returns:
            Tuple[валідні_дані, список_подій]
        """
        events = []
        
        # Перевірка на аномалії
        anomaly_event = self.anomaly_detector.add_reading(sensor_type, value)
        if anomaly_event:
            anomaly_event.details['device_id'] = device_id
            events.append(anomaly_event)
            self._update_trust_score(-3)
        
        # Перевірка на gradual drift
        drift_event = self.anomaly_detector.detect_gradual_drift(sensor_type)
        if drift_event:
            drift_event.details['device_id'] = device_id
            events.append(drift_event)
            self._update_trust_score(-5)
        
        self.security_events.extend(events)
        
        return len(events) == 0, events
    
    def _update_trust_score(self, delta: int):
        """Оновлює Trust Score"""
        self.trust_score = max(0, min(100, self.trust_score + delta))
        
        if self.trust_score < 30 and not self.quarantine_mode:
            self.quarantine_mode = True
            logger.critical(f"Trust Score критично низький ({self.trust_score}). Карантин увімкнено.")
    
    def recover_trust(self, amount: int = 1):
        """Поступове відновлення Trust Score"""
        if not self.quarantine_mode:
            self.trust_score = min(100, self.trust_score + amount)
    
    def exit_quarantine(self, admin_override: bool = False):
        """Вихід з режиму карантину"""
        if admin_override or self.trust_score >= 70:
            self.quarantine_mode = False
            logger.info("Режим карантину вимкнено")
            return True
        return False
    
    def get_status(self) -> Dict:
        """Повертає поточний статус системи безпеки"""
        recent_events = self.security_events[-50:]
        
        threat_counts = defaultdict(int)
        for event in recent_events:
            threat_counts[event.attack_type.value] += 1
        
        return {
            'trust_score': self.trust_score,
            'quarantine_mode': self.quarantine_mode,
            'blocked_ips': self.rate_limiter.get_blocked_ips(),
            'recent_events_count': len(recent_events),
            'threat_counts': dict(threat_counts),
            'threat_level': self._calculate_threat_level(),
        }
    
    def _calculate_threat_level(self) -> str:
        """Розраховує загальний рівень загрози"""
        if self.quarantine_mode:
            return 'CRITICAL'
        if self.trust_score < 50:
            return 'HIGH'
        if self.trust_score < 70:
            return 'MEDIUM'
        if self.trust_score < 90:
            return 'LOW'
        return 'NONE'


# =============================================================================
# Глобальна інстанція IDS
# =============================================================================

ids = IntrusionDetectionSystem()
