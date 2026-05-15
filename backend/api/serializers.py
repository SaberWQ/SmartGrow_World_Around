"""
============================================
SmartGrow SecureAI - API Serializers
============================================
Серіалізатори для перетворення моделей в JSON
та валідації вхідних даних.

Автор: SmartGrow Team
============================================
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Plant, SensorData, SecurityEvent, UserProfile, Quest, QuestProgress


# ============================================
# СЕРІАЛІЗАТОР КОРИСТУВАЧА
# ============================================

class UserSerializer(serializers.ModelSerializer):
    """
    Серіалізатор для моделі User.
    
    Поля:
    - id: унікальний ідентифікатор
    - username: ім'я користувача
    - email: електронна пошта
    """
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Серіалізатор для реєстрації нового користувача.
    
    Включає валідацію пароля та створення профілю.
    """
    
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm']
    
    def validate(self, attrs):
        """Перевірка що паролі співпадають."""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Паролі не співпадають'
            })
        return attrs
    
    def create(self, validated_data):
        """Створення користувача з хешованим паролем."""
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        
        # Автоматично створюємо профіль
        UserProfile.objects.create(user=user)
        
        return user


# ============================================
# СЕРІАЛІЗАТОР ПРОФІЛЮ КОРИСТУВАЧА
# ============================================

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Серіалізатор профілю користувача.
    
    Включає:
    - Базову інформацію користувача
    - Ігрові дані (монети, токени, рівень)
    - Налаштування
    - Статус підписки
    """
    
    user = UserSerializer(read_only=True)
    is_pro = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'coins', 'tokens', 'level',
            'subscription', 'subscription_expires', 'is_pro',
            'language', 'settings', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# ============================================
# СЕРІАЛІЗАТОР РОСЛИНИ
# ============================================

class PlantSerializer(serializers.ModelSerializer):
    """
    Серіалізатор моделі рослини.
    
    Включає всі дані про стан рослини:
    - Здоров'я та настрій
    - Рівень та XP
    - Trust Score та статус карантину
    """
    
    owner = UserSerializer(read_only=True)
    mood_display = serializers.CharField(
        source='get_mood_display',
        read_only=True
    )
    
    class Meta:
        model = Plant
        fields = [
            'id', 'owner', 'name', 'species',
            'health', 'mood', 'mood_display',
            'level', 'xp', 'xp_to_next_level',
            'trust_score', 'is_quarantined',
            'last_watered', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'owner', 'level', 'xp', 
            'trust_score', 'is_quarantined',
            'created_at', 'updated_at'
        ]


class PlantCreateSerializer(serializers.ModelSerializer):
    """Серіалізатор для створення нової рослини."""
    
    class Meta:
        model = Plant
        fields = ['name', 'species']
    
    def create(self, validated_data):
        """Створення рослини з прив'язкою до поточного користувача."""
        user = self.context['request'].user
        return Plant.objects.create(owner=user, **validated_data)


# ============================================
# СЕРІАЛІЗАТОР ДАНИХ СЕНСОРІВ
# ============================================

class SensorDataSerializer(serializers.ModelSerializer):
    """
    Серіалізатор даних сенсорів.
    
    Поля:
    - temperature: температура (°C)
    - humidity: вологість повітря (%)
    - soil_moisture: вологість ґрунту (%)
    - ph_level: рівень pH
    - ec_level: електропровідність
    - npk: NPK показники
    - is_anomaly: чи є дані аномальними
    """
    
    class Meta:
        model = SensorData
        fields = [
            'id', 'plant', 'temperature', 'humidity',
            'soil_moisture', 'ph_level', 'ec_level', 'npk',
            'is_anomaly', 'timestamp'
        ]
        read_only_fields = ['id', 'timestamp']


class SensorDataCreateSerializer(serializers.ModelSerializer):
    """
    Серіалізатор для запису нових даних сенсорів.
    
    Автоматично перевіряє дані на аномалії.
    """
    
    class Meta:
        model = SensorData
        fields = [
            'temperature', 'humidity', 'soil_moisture',
            'ph_level', 'ec_level', 'npk'
        ]
    
    def validate(self, attrs):
        """
        Валідація та виявлення аномалій.
        
        Перевіряє чи значення в допустимих межах.
        """
        anomalies = []
        
        # Перевірка температури (нормальний діапазон: 15-30°C)
        temp = attrs.get('temperature', 22)
        if temp < 10 or temp > 40:
            anomalies.append('temperature')
        
        # Перевірка pH (нормальний діапазон: 5.5-7.5)
        ph = attrs.get('ph_level', 6.5)
        if ph < 4.0 or ph > 9.0:
            anomalies.append('ph_level')
        
        # Перевірка вологості ґрунту
        moisture = attrs.get('soil_moisture', 50)
        if moisture < 10 or moisture > 95:
            anomalies.append('soil_moisture')
        
        # Якщо є аномалії - позначаємо запис
        attrs['is_anomaly'] = len(anomalies) > 0
        
        return attrs


# ============================================
# СЕРІАЛІЗАТОР ПОДІЙ БЕЗПЕКИ
# ============================================

class SecurityEventSerializer(serializers.ModelSerializer):
    """
    Серіалізатор подій безпеки.
    
    Включає:
    - Тип та серйозність події
    - Опис та деталі
    - Статус обробки
    """
    
    event_type_display = serializers.CharField(
        source='get_event_type_display',
        read_only=True
    )
    severity_display = serializers.CharField(
        source='get_severity_display',
        read_only=True
    )
    
    class Meta:
        model = SecurityEvent
        fields = [
            'id', 'plant', 'event_type', 'event_type_display',
            'severity', 'severity_display', 'description',
            'details', 'source_ip', 'is_resolved', 'timestamp'
        ]
        read_only_fields = ['id', 'timestamp']


# ============================================
# СЕРІАЛІЗАТОР КВЕСТІВ
# ============================================

class QuestSerializer(serializers.ModelSerializer):
    """Серіалізатор квестів."""
    
    quest_type_display = serializers.CharField(
        source='get_quest_type_display',
        read_only=True
    )
    
    class Meta:
        model = Quest
        fields = [
            'id', 'title', 'description', 'quest_type',
            'quest_type_display', 'xp_reward', 'coin_reward',
            'target', 'is_active'
        ]


class QuestProgressSerializer(serializers.ModelSerializer):
    """Серіалізатор прогресу квесту."""
    
    quest = QuestSerializer(read_only=True)
    
    class Meta:
        model = QuestProgress
        fields = [
            'id', 'quest', 'progress', 'is_completed', 'completed_at'
        ]
        read_only_fields = ['id', 'completed_at']
