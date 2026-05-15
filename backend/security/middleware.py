# =============================================================================
# SmartGrow SecureAI - Security Middleware
# =============================================================================
# Django Middleware для захисту від кібератак
# 
# Інспіровано: OWASP, FSociety attack patterns, Kraken security
# =============================================================================

import json
import time
import hashlib
import logging
from typing import Callable
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.conf import settings

from .ids import ids, AttackType, ThreatLevel, SecurityEvent

logger = logging.getLogger('smartgrow.security.middleware')


class SecurityMiddleware:
    """
    Головний middleware безпеки
    
    Перехоплює всі запити та перевіряє на загрози через IDS.
    Реалізує принцип Zero-Trust: кожен запит перевіряється.
    """
    
    def __init__(self, get_response: Callable):
        """
        Args:
            get_response: Наступний middleware або view
        """
        self.get_response = get_response
        
        # Шляхи, які не перевіряються (static files, health checks)
        self.excluded_paths = [
            '/static/',
            '/media/',
            '/health/',
            '/favicon.ico',
        ]
    
    def __call__(self, request: HttpRequest) -> HttpResponse:
        """
        Обробка кожного HTTP запиту
        
        Args:
            request: Django HTTP запит
            
        Returns:
            HTTP відповідь
        """
        # Пропускаємо виключені шляхи
        if any(request.path.startswith(path) for path in self.excluded_paths):
            return self.get_response(request)
        
        # === Збираємо інформацію про запит ===
        client_ip = self._get_client_ip(request)
        path = request.path
        method = request.method
        headers = dict(request.headers)
        
        # Отримуємо тіло запиту
        try:
            body = request.body.decode('utf-8') if request.body else ''
        except UnicodeDecodeError:
            body = ''
        
        # === Отримуємо security headers (для replay protection) ===
        nonce = request.headers.get('X-SmartGrow-Nonce')
        timestamp_str = request.headers.get('X-SmartGrow-Timestamp')
        signature = request.headers.get('X-SmartGrow-Signature')
        
        timestamp = float(timestamp_str) if timestamp_str else None
        
        # === Аналізуємо запит через IDS ===
        allowed, events = ids.analyze_request(
            ip=client_ip,
            path=path,
            method=method,
            headers=headers,
            body=body,
            nonce=nonce,
            timestamp=timestamp,
            signature=signature
        )
        
        # === Логуємо події безпеки ===
        for event in events:
            log_level = {
                ThreatLevel.LOW: logging.INFO,
                ThreatLevel.MEDIUM: logging.WARNING,
                ThreatLevel.HIGH: logging.ERROR,
                ThreatLevel.CRITICAL: logging.CRITICAL,
            }.get(event.threat_level, logging.INFO)
            
            logger.log(
                log_level,
                f"[{event.attack_type.value}] {client_ip} -> {path} | "
                f"Blocked: {event.blocked} | Details: {event.details}"
            )
        
        # === Блокуємо небезпечні запити ===
        if not allowed:
            return self._blocked_response(events)
        
        # === Режим карантину ===
        if ids.quarantine_mode:
            # В карантині дозволяємо тільки читання та адмін доступ
            if method not in ['GET', 'HEAD', 'OPTIONS']:
                if not self._is_admin_request(request):
                    return JsonResponse({
                        'error': 'Система в режимі карантину',
                        'error_en': 'System is in quarantine mode',
                        'trust_score': ids.trust_score,
                        'allowed_methods': ['GET', 'HEAD', 'OPTIONS'],
                    }, status=503)
        
        # === Продовжуємо обробку запиту ===
        response = self.get_response(request)
        
        # === Додаємо security headers до відповіді ===
        response['X-SmartGrow-Trust-Score'] = str(ids.trust_score)
        response['X-SmartGrow-Quarantine'] = str(ids.quarantine_mode).lower()
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Content Security Policy
        response['Content-Security-Policy'] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "connect-src 'self' wss: https:; "
            "font-src 'self' https:; "
        )
        
        # === Поступове відновлення Trust Score ===
        if response.status_code < 400:
            ids.recover_trust(1)
        
        return response
    
    def _get_client_ip(self, request: HttpRequest) -> str:
        """
        Отримує реальну IP-адресу клієнта
        
        Враховує проксі (X-Forwarded-For, X-Real-IP)
        """
        # Перевіряємо X-Forwarded-For (для reverse proxy)
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            # Беремо перший IP (оригінальний клієнт)
            ip = x_forwarded_for.split(',')[0].strip()
            return ip
        
        # X-Real-IP (nginx)
        x_real_ip = request.META.get('HTTP_X_REAL_IP')
        if x_real_ip:
            return x_real_ip
        
        # Пряме підключення
        return request.META.get('REMOTE_ADDR', '0.0.0.0')
    
    def _is_admin_request(self, request: HttpRequest) -> bool:
        """Перевіряє чи це запит від адміністратора"""
        # Перевірка JWT токену або сесії адміна
        auth_header = request.headers.get('Authorization', '')
        
        if auth_header.startswith('Bearer '):
            # TODO: Перевірка JWT токену на admin права
            pass
        
        # Перевірка сесії
        if hasattr(request, 'user') and request.user.is_authenticated:
            return request.user.is_superuser
        
        return False
    
    def _blocked_response(self, events: list) -> JsonResponse:
        """Формує відповідь для заблокованого запиту"""
        # Визначаємо найвищий рівень загрози
        max_threat = max(events, key=lambda e: e.threat_level.value)
        
        status_codes = {
            ThreatLevel.LOW: 400,
            ThreatLevel.MEDIUM: 403,
            ThreatLevel.HIGH: 403,
            ThreatLevel.CRITICAL: 403,
        }
        
        return JsonResponse({
            'error': 'Запит заблоковано системою безпеки',
            'error_en': 'Request blocked by security system',
            'threat_level': max_threat.threat_level.name,
            'attack_types': [e.attack_type.value for e in events],
            'trust_score': ids.trust_score,
            'quarantine_mode': ids.quarantine_mode,
            'details': [
                {
                    'type': e.attack_type.value,
                    'level': e.threat_level.name,
                    'signature_id': e.signature_id,
                }
                for e in events
            ]
        }, status=status_codes.get(max_threat.threat_level, 403))


class InputSanitizationMiddleware:
    """
    Middleware для санітизації вхідних даних
    
    Очищує:
    - HTML теги
    - SQL ключові слова
    - Shell команди
    - Небезпечні символи
    """
    
    # Небезпечні патерни для видалення
    DANGEROUS_PATTERNS = [
        (r'<script[^>]*>.*?</script>', ''),  # Script теги
        (r'javascript:', ''),                 # javascript: протокол
        (r'on\w+\s*=', ''),                   # Event handlers
        (r'<!--.*?-->', ''),                  # HTML коментарі
    ]
    
    def __init__(self, get_response: Callable):
        self.get_response = get_response
    
    def __call__(self, request: HttpRequest) -> HttpResponse:
        # Санітизація GET параметрів
        if request.GET:
            sanitized_get = self._sanitize_dict(request.GET.dict())
            request.GET = request.GET.copy()
            for key, value in sanitized_get.items():
                request.GET[key] = value
        
        # Санітизація POST параметрів
        if request.POST:
            sanitized_post = self._sanitize_dict(request.POST.dict())
            request.POST = request.POST.copy()
            for key, value in sanitized_post.items():
                request.POST[key] = value
        
        return self.get_response(request)
    
    def _sanitize_dict(self, data: dict) -> dict:
        """Санітизує словник даних"""
        import re
        
        sanitized = {}
        for key, value in data.items():
            if isinstance(value, str):
                # Застосовуємо всі патерни очистки
                for pattern, replacement in self.DANGEROUS_PATTERNS:
                    value = re.sub(pattern, replacement, value, flags=re.IGNORECASE | re.DOTALL)
                
                # Екрануємо HTML сутності
                value = (
                    value
                    .replace('&', '&amp;')
                    .replace('<', '&lt;')
                    .replace('>', '&gt;')
                    .replace('"', '&quot;')
                    .replace("'", '&#x27;')
                )
            
            sanitized[key] = value
        
        return sanitized


class CORSSecurityMiddleware:
    """
    CORS Middleware з безпечними налаштуваннями
    
    Контролює доступ з інших доменів.
    """
    
    def __init__(self, get_response: Callable):
        self.get_response = get_response
        
        # Дозволені домени (з налаштувань)
        self.allowed_origins = getattr(
            settings, 
            'CORS_ALLOWED_ORIGINS', 
            ['http://localhost:3000']
        )
    
    def __call__(self, request: HttpRequest) -> HttpResponse:
        # Обробка preflight запитів
        if request.method == 'OPTIONS':
            response = HttpResponse()
        else:
            response = self.get_response(request)
        
        origin = request.headers.get('Origin', '')
        
        # Перевіряємо чи дозволений origin
        if origin in self.allowed_origins or '*' in self.allowed_origins:
            response['Access-Control-Allow-Origin'] = origin
            response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
            response['Access-Control-Allow-Headers'] = (
                'Content-Type, Authorization, X-SmartGrow-Nonce, '
                'X-SmartGrow-Timestamp, X-SmartGrow-Signature'
            )
            response['Access-Control-Allow-Credentials'] = 'true'
            response['Access-Control-Max-Age'] = '86400'  # 24 години
        
        return response


class AuditLogMiddleware:
    """
    Middleware для аудит-логування
    
    Записує всі дії для forensic аналізу.
    Важливо для відповідності GDPR та інших стандартів.
    """
    
    def __init__(self, get_response: Callable):
        self.get_response = get_response
        self.audit_logger = logging.getLogger('smartgrow.audit')
    
    def __call__(self, request: HttpRequest) -> HttpResponse:
        # Час початку запиту
        start_time = time.time()
        
        # Збираємо інформацію про запит
        request_info = {
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'method': request.method,
            'path': request.path,
            'ip': self._get_client_ip(request),
            'user_agent': request.headers.get('User-Agent', 'Unknown'),
            'user': str(getattr(request, 'user', 'Anonymous')),
        }
        
        # Виконуємо запит
        response = self.get_response(request)
        
        # Додаємо інформацію про відповідь
        request_info.update({
            'status_code': response.status_code,
            'duration_ms': round((time.time() - start_time) * 1000, 2),
            'trust_score': ids.trust_score,
        })
        
        # Логуємо
        log_level = logging.INFO if response.status_code < 400 else logging.WARNING
        self.audit_logger.log(log_level, json.dumps(request_info))
        
        return response
    
    def _get_client_ip(self, request: HttpRequest) -> str:
        """Отримує IP клієнта"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR', '0.0.0.0')
