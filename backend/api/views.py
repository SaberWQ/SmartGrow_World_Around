"""
============================================
SmartGrow SecureAI - API Views
============================================
API endpoints для SmartGrow системи:
- Управління рослинами
- Дані сенсорів
- Безпека та Trust Score
- Профіль користувача

Автор: SmartGrow Team
============================================
"""

import logging
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Plant, SensorData, SecurityEvent, UserProfile, Quest, QuestProgress
from .serializers import (
    PlantSerializer, PlantCreateSerializer,
    SensorDataSerializer, SensorDataCreateSerializer,
    SecurityEventSerializer,
    UserProfileSerializer, UserRegistrationSerializer,
    QuestSerializer, QuestProgressSerializer
)

# Логер
logger = logging.getLogger('api')


# ============================================
# РЕЄСТРАЦІЯ КОРИСТУВАЧА
# ============================================

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    POST /api/v1/auth/register/
    
    Реєстрація нового користувача.
    
    Request Body:
        {
            "username": "newuser",
            "email": "user@example.com",
            "password": "securePassword123",
            "password_confirm": "securePassword123"
        }
    
    Response:
        {
            "success": true,
            "message": "Користувача створено успішно",
            "user": {"id": 1, "username": "newuser", ...}
        }
    """
    serializer = UserRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        logger.info(f"👤 Новий користувач зареєстрований: {user.username}")
        
        return Response({
            'success': True,
            'message': 'Користувача створено успішно',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


# ============================================
# ПРОФІЛЬ КОРИСТУВАЧА
# ============================================

@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """
    GET /api/v1/profile/
    Отримати профіль поточного користувача.
    
    PATCH /api/v1/profile/
    Оновити налаштування профілю.
    """
    # Отримуємо або створюємо профіль
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    
    if request.method == 'GET':
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
    
    elif request.method == 'PATCH':
        serializer = UserProfileSerializer(
            profile, 
            data=request.data, 
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================
# VIEWSET ДЛЯ РОСЛИН
# ============================================

class PlantViewSet(viewsets.ModelViewSet):
    """
    ViewSet для CRUD операцій з рослинами.
    
    Endpoints:
    - GET    /api/v1/plants/          - Список рослин користувача
    - POST   /api/v1/plants/          - Створити рослину
    - GET    /api/v1/plants/{id}/     - Деталі рослини
    - PATCH  /api/v1/plants/{id}/     - Оновити рослину
    - DELETE /api/v1/plants/{id}/     - Видалити рослину
    - POST   /api/v1/plants/{id}/water/ - Полити рослину
    """
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Повертає тільки рослини поточного користувача."""
        return Plant.objects.filter(owner=self.request.user)
    
    def get_serializer_class(self):
        """Вибір серіалізатора в залежності від дії."""
        if self.action == 'create':
            return PlantCreateSerializer
        return PlantSerializer
    
    def perform_create(self, serializer):
        """Автоматично прив'язує рослину до користувача."""
        serializer.save(owner=self.request.user)
        logger.info(f"🌱 Користувач {self.request.user.username} створив рослину")
    
    @action(detail=True, methods=['post'])
    def water(self, request, pk=None):
        """
        POST /api/v1/plants/{id}/water/
        
        Полити рослину (додає XP та оновлює час поливу).
        """
        plant = self.get_object()
        plant.water()
        
        logger.info(f"💧 Рослину {plant.name} полито користувачем {request.user.username}")
        
        return Response({
            'success': True,
            'message': f'{plant.name} полито!',
            'xp_gained': 10,
            'plant': PlantSerializer(plant).data
        })
    
    @action(detail=True, methods=['post'])
    def add_xp(self, request, pk=None):
        """
        POST /api/v1/plants/{id}/add_xp/
        
        Додати XP рослині.
        
        Request Body:
            {"amount": 50}
        """
        plant = self.get_object()
        amount = request.data.get('amount', 10)
        
        leveled_up = plant.add_xp(amount)
        
        return Response({
            'success': True,
            'xp_gained': amount,
            'leveled_up': leveled_up,
            'plant': PlantSerializer(plant).data
        })


# ============================================
# VIEWSET ДЛЯ ДАНИХ СЕНСОРІВ
# ============================================

class SensorDataViewSet(viewsets.ModelViewSet):
    """
    ViewSet для даних сенсорів.
    
    Endpoints:
    - GET  /api/v1/sensors/              - Список записів
    - POST /api/v1/sensors/              - Додати новий запис
    - GET  /api/v1/sensors/{id}/         - Деталі запису
    - GET  /api/v1/sensors/latest/       - Останні дані
    - GET  /api/v1/sensors/history/      - Історія за період
    """
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Повертає дані сенсорів для рослин користувача."""
        user_plants = Plant.objects.filter(owner=self.request.user)
        return SensorData.objects.filter(plant__in=user_plants)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return SensorDataCreateSerializer
        return SensorDataSerializer
    
    def perform_create(self, serializer):
        """Зберігає дані та перевіряє на аномалії."""
        plant_id = self.request.data.get('plant')
        plant = get_object_or_404(Plant, id=plant_id, owner=self.request.user)
        
        instance = serializer.save(plant=plant)
        
        # Якщо виявлено аномалію - створюємо подію безпеки
        if instance.is_anomaly:
            SecurityEvent.objects.create(
                plant=plant,
                event_type='data_anomaly',
                severity='medium',
                description='Виявлено аномальні показники сенсорів',
                details={
                    'temperature': instance.temperature,
                    'humidity': instance.humidity,
                    'soil_moisture': instance.soil_moisture,
                    'ph_level': instance.ph_level
                },
                source_ip=self.request.META.get('REMOTE_ADDR')
            )
            
            logger.warning(f"⚠️ Аномалія в даних сенсорів для рослини {plant.name}")
    
    @action(detail=False, methods=['get'])
    def latest(self, request):
        """
        GET /api/v1/sensors/latest/
        
        Отримати останні дані сенсорів для всіх рослин.
        """
        plant_id = request.query_params.get('plant')
        
        if plant_id:
            plant = get_object_or_404(Plant, id=plant_id, owner=request.user)
            data = SensorData.objects.filter(plant=plant).first()
        else:
            # Останні дані для кожної рослини
            data = []
            for plant in Plant.objects.filter(owner=request.user):
                latest = SensorData.objects.filter(plant=plant).first()
                if latest:
                    data.append(latest)
        
        if isinstance(data, list):
            serializer = SensorDataSerializer(data, many=True)
        else:
            serializer = SensorDataSerializer(data)
        
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def history(self, request):
        """
        GET /api/v1/sensors/history/?plant=1&hours=24
        
        Отримати історію даних за період.
        """
        plant_id = request.query_params.get('plant')
        hours = int(request.query_params.get('hours', 24))
        
        if not plant_id:
            return Response({
                'error': 'Параметр plant обов\'язковий'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        plant = get_object_or_404(Plant, id=plant_id, owner=request.user)
        
        # Фільтруємо за часом
        since = timezone.now() - timezone.timedelta(hours=hours)
        data = SensorData.objects.filter(
            plant=plant,
            timestamp__gte=since
        ).order_by('timestamp')
        
        serializer = SensorDataSerializer(data, many=True)
        return Response(serializer.data)


# ============================================
# VIEWSET ДЛЯ ПОДІЙ БЕЗПЕКИ
# ============================================

class SecurityEventViewSet(viewsets.ModelViewSet):
    """
    ViewSet для подій безпеки.
    
    Endpoints:
    - GET  /api/v1/security/              - Список подій
    - GET  /api/v1/security/{id}/         - Деталі події
    - POST /api/v1/security/{id}/resolve/ - Позначити як оброблену
    """
    
    permission_classes = [IsAuthenticated]
    serializer_class = SecurityEventSerializer
    
    def get_queryset(self):
        """Повертає події для рослин користувача."""
        user_plants = Plant.objects.filter(owner=self.request.user)
        return SecurityEvent.objects.filter(plant__in=user_plants)
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """
        POST /api/v1/security/{id}/resolve/
        
        Позначити подію як оброблену.
        """
        event = self.get_object()
        event.is_resolved = True
        event.save()
        
        logger.info(f"✅ Подія безпеки #{event.id} позначена як оброблена")
        
        return Response({
            'success': True,
            'message': 'Подію оброблено',
            'event': SecurityEventSerializer(event).data
        })


# ============================================
# СИМУЛЯЦІЯ АТАКИ (для демонстрації)
# ============================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def simulate_attack(request):
    """
    POST /api/v1/security/simulate-attack/
    
    Симуляція кібератаки для демонстрації системи захисту.
    
    Request Body:
        {
            "attack_type": "data_poison",  // або "sensor_spoof", "gradual_drift"
            "plant_id": 1
        }
    """
    attack_type = request.data.get('attack_type', 'data_poison')
    plant_id = request.data.get('plant_id')
    
    # Отримуємо рослину
    if plant_id:
        plant = get_object_or_404(Plant, id=plant_id, owner=request.user)
    else:
        plant = Plant.objects.filter(owner=request.user).first()
    
    if not plant:
        return Response({
            'error': 'Рослину не знайдено'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Визначаємо параметри атаки
    attack_params = {
        'data_poison': {
            'severity': 'high',
            'description': 'Виявлено спробу отруєння даних сенсорів',
            'trust_impact': -25
        },
        'sensor_spoof': {
            'severity': 'medium',
            'description': 'Виявлено підміну показників сенсорів',
            'trust_impact': -15
        },
        'gradual_drift': {
            'severity': 'low',
            'description': 'Виявлено поступовий зсув в показниках',
            'trust_impact': -10
        }
    }
    
    params = attack_params.get(attack_type, attack_params['data_poison'])
    
    # Створюємо подію безпеки
    event = SecurityEvent.objects.create(
        plant=plant,
        event_type=attack_type,
        severity=params['severity'],
        description=params['description'],
        source_ip=request.META.get('REMOTE_ADDR'),
        details={
            'simulated': True,
            'attack_type': attack_type
        }
    )
    
    # Оновлюємо Trust Score рослини
    plant.trust_score = max(0, plant.trust_score + params['trust_impact'])
    
    # Якщо Trust Score < 50 - карантин
    if plant.trust_score < 50:
        plant.is_quarantined = True
        plant.mood = 'sick'
    
    plant.save()
    
    logger.warning(
        f"🚨 Симуляція атаки {attack_type} на рослину {plant.name}. "
        f"Trust Score: {plant.trust_score}"
    )
    
    return Response({
        'success': True,
        'attack_type': attack_type,
        'event': SecurityEventSerializer(event).data,
        'plant': PlantSerializer(plant).data,
        'message': f'Атака "{attack_type}" симульована'
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reset_security(request):
    """
    POST /api/v1/security/reset/
    
    Скинути статус безпеки рослини (вийти з карантину).
    
    Request Body:
        {"plant_id": 1}
    """
    plant_id = request.data.get('plant_id')
    
    if plant_id:
        plant = get_object_or_404(Plant, id=plant_id, owner=request.user)
    else:
        plant = Plant.objects.filter(owner=request.user).first()
    
    if not plant:
        return Response({
            'error': 'Рослину не знайдено'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Відновлюємо статус
    plant.trust_score = 94
    plant.is_quarantined = False
    plant.mood = 'happy'
    plant.save()
    
    logger.info(f"✅ Статус безпеки рослини {plant.name} скинуто")
    
    return Response({
        'success': True,
        'message': 'Статус безпеки відновлено',
        'plant': PlantSerializer(plant).data
    })


# ============================================
# КВЕСТИ
# ============================================

class QuestViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для квестів (тільки читання).
    """
    
    permission_classes = [IsAuthenticated]
    serializer_class = QuestSerializer
    queryset = Quest.objects.filter(is_active=True)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_quest(request, quest_id):
    """
    POST /api/v1/quests/{quest_id}/complete/
    
    Завершити квест та отримати нагороду.
    """
    quest = get_object_or_404(Quest, id=quest_id, is_active=True)
    
    # Отримуємо або створюємо прогрес
    progress, created = QuestProgress.objects.get_or_create(
        user=request.user,
        quest=quest
    )
    
    if progress.is_completed:
        return Response({
            'success': False,
            'message': 'Квест вже виконано'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Позначаємо як виконаний
    progress.is_completed = True
    progress.completed_at = timezone.now()
    progress.save()
    
    # Нараховуємо нагороду
    profile = UserProfile.objects.get(user=request.user)
    profile.coins += quest.coin_reward
    profile.save()
    
    # Додаємо XP першій рослині
    plant = Plant.objects.filter(owner=request.user).first()
    if plant:
        plant.add_xp(quest.xp_reward)
    
    logger.info(
        f"🏆 Користувач {request.user.username} виконав квест: {quest.title}"
    )
    
    return Response({
        'success': True,
        'message': f'Квест "{quest.title}" виконано!',
        'rewards': {
            'xp': quest.xp_reward,
            'coins': quest.coin_reward
        },
        'profile': UserProfileSerializer(profile).data
    })
