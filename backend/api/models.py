"""
============================================
SmartGrow SecureAI - Database Models
============================================
Моделі бази даних для SmartGrow системи:
- Рослини та їх стан
- Дані сенсорів (температура, вологість, pH)
- Події безпеки
- Профілі користувачів

Автор: SmartGrow Team
Ліцензія: Захищено законом України №2811-IX
============================================
"""

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone


# ============================================
# МОДЕЛЬ РОСЛИНИ
# ============================================

class Plant(models.Model):
    """
    Модель рослини в теплиці.
    
    Зберігає:
    - Основну інформацію про рослину
    - Поточний стан здоров'я
    - Рівень та XP (гейміфікація)
    - Trust Score для безпеки
    """
    
    # Можливі настрої рослини (впливають на аватар)
    MOOD_CHOICES = [
        ('happy', 'Щаслива'),
        ('neutral', 'Нейтральна'),
        ('thirsty', 'Спрагла'),
        ('sick', 'Хвора'),
        ('sleeping', 'Спить'),
        ('excited', 'Збуджена'),
    ]
    
    # Зв'язок з користувачем (власником)
    owner = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='plants',
        verbose_name='Власник'
    )
    
    # Основна інформація
    name = models.CharField(
        max_length=100, 
        default='Leafy',
        verbose_name='Ім\'я рослини'
    )
    species = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='Вид рослини'
    )
    
    # Стан здоров'я (0-100%)
    health = models.IntegerField(
        default=92,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name='Здоров\'я'
    )
    
    # Настрій рослини
    mood = models.CharField(
        max_length=20,
        choices=MOOD_CHOICES,
        default='happy',
        verbose_name='Настрій'
    )
    
    # Гейміфікація
    level = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        verbose_name='Рівень'
    )
    xp = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        verbose_name='Досвід (XP)'
    )
    xp_to_next_level = models.IntegerField(
        default=2000,
        verbose_name='XP до наступного рівня'
    )
    
    # Безпека (Zero-Trust)
    trust_score = models.IntegerField(
        default=94,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name='Trust Score'
    )
    is_quarantined = models.BooleanField(
        default=False,
        verbose_name='В карантині'
    )
    
    # Часові мітки
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_watered = models.DateTimeField(
        null=True, 
        blank=True,
        verbose_name='Останній полив'
    )
    
    class Meta:
        verbose_name = 'Рослина'
        verbose_name_plural = 'Рослини'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.owner.username})"
    
    def add_xp(self, amount: int) -> bool:
        """
        Додати XP до рослини.
        
        Args:
            amount: Кількість XP для додавання
            
        Returns:
            True якщо відбулось підвищення рівня
        """
        self.xp += amount
        leveled_up = False
        
        # Перевіряємо чи потрібно підвищити рівень
        while self.xp >= self.xp_to_next_level:
            self.xp -= self.xp_to_next_level
            self.level += 1
            self.xp_to_next_level = int(self.xp_to_next_level * 1.2)
            leveled_up = True
        
        self.save()
        return leveled_up
    
    def water(self) -> None:
        """Записати полив рослини."""
        self.last_watered = timezone.now()
        self.add_xp(10)
        self.save()


# ============================================
# МОДЕЛЬ ДАНИХ СЕНСОРІВ
# ============================================

class SensorData(models.Model):
    """
    Модель для зберігання даних з сенсорів.
    
    Записує показники:
    - Температура (°C)
    - Вологість повітря (%)
    - Вологість ґрунту (%)
    - Рівень pH
    - EC (електропровідність)
    - NPK (азот-фосфор-калій)
    """
    
    # Зв'язок з рослиною
    plant = models.ForeignKey(
        Plant,
        on_delete=models.CASCADE,
        related_name='sensor_data',
        verbose_name='Рослина'
    )
    
    # Температура (в градусах Цельсія)
    temperature = models.FloatField(
        validators=[MinValueValidator(-40), MaxValueValidator(60)],
        verbose_name='Температура (°C)'
    )
    
    # Вологість повітря (у відсотках)
    humidity = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name='Вологість повітря (%)'
    )
    
    # Вологість ґрунту (у відсотках)
    soil_moisture = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name='Вологість ґрунту (%)'
    )
    
    # Рівень pH (кислотність)
    ph_level = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(14)],
        verbose_name='pH рівень'
    )
    
    # EC - електропровідність (mS/cm)
    ec_level = models.FloatField(
        default=1.8,
        validators=[MinValueValidator(0), MaxValueValidator(10)],
        verbose_name='EC (mS/cm)'
    )
    
    # NPK - комплексний показник добрив
    npk = models.CharField(
        max_length=20,
        default='120-45-60',
        verbose_name='NPK'
    )
    
    # Чи є дані аномальними (виявлено атаку)
    is_anomaly = models.BooleanField(
        default=False,
        verbose_name='Аномалія'
    )
    
    # Часова мітка
    timestamp = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Час запису'
    )
    
    class Meta:
        verbose_name = 'Дані сенсорів'
        verbose_name_plural = 'Дані сенсорів'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['plant', '-timestamp']),
        ]
    
    def __str__(self):
        return f"Sensors {self.plant.name} @ {self.timestamp}"


# ============================================
# МОДЕЛЬ ПОДІЙ БЕЗПЕКИ
# ============================================

class SecurityEvent(models.Model):
    """
    Модель для зберігання подій безпеки.
    
    Типи подій:
    - Виявлення аномалій в даних
    - Спроби несанкціонованого доступу
    - Підозрілі паттерни
    - Кібератаки
    """
    
    # Типи подій
    EVENT_TYPES = [
        ('data_anomaly', 'Аномалія даних'),
        ('sensor_spoof', 'Підміна сенсорів'),
        ('unauthorized_access', 'Несанкціонований доступ'),
        ('api_abuse', 'Зловживання API'),
        ('gradual_drift', 'Поступовий зсув'),
        ('quarantine', 'Карантин'),
        ('attack_blocked', 'Атака заблокована'),
    ]
    
    # Рівні серйозності
    SEVERITY_LEVELS = [
        ('low', 'Низький'),
        ('medium', 'Середній'),
        ('high', 'Високий'),
        ('critical', 'Критичний'),
    ]
    
    # Зв'язок з рослиною (опціонально)
    plant = models.ForeignKey(
        Plant,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='security_events',
        verbose_name='Рослина'
    )
    
    # Тип події
    event_type = models.CharField(
        max_length=30,
        choices=EVENT_TYPES,
        verbose_name='Тип події'
    )
    
    # Серйозність
    severity = models.CharField(
        max_length=10,
        choices=SEVERITY_LEVELS,
        default='low',
        verbose_name='Серйозність'
    )
    
    # Опис події
    description = models.TextField(
        verbose_name='Опис'
    )
    
    # Деталі (JSON)
    details = models.JSONField(
        null=True,
        blank=True,
        verbose_name='Деталі'
    )
    
    # IP адреса джерела
    source_ip = models.GenericIPAddressField(
        null=True,
        blank=True,
        verbose_name='IP адреса'
    )
    
    # Чи оброблена подія
    is_resolved = models.BooleanField(
        default=False,
        verbose_name='Оброблено'
    )
    
    # Часова мітка
    timestamp = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Час події'
    )
    
    class Meta:
        verbose_name = 'Подія безпеки'
        verbose_name_plural = 'Події безпеки'
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"[{self.severity.upper()}] {self.get_event_type_display()}"


# ============================================
# МОДЕЛЬ ПРОФІЛЮ КОРИСТУВАЧА
# ============================================

class UserProfile(models.Model):
    """
    Розширений профіль користувача.
    
    Зберігає:
    - Ігрові дані (монети, рівень)
    - Налаштування
    - Підписку
    """
    
    # Типи підписок
    SUBSCRIPTION_TYPES = [
        ('free', 'Безкоштовна'),
        ('pro_monthly', 'Pro (місяць)'),
        ('pro_yearly', 'Pro (рік)'),
    ]
    
    # Зв'язок з Django User
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile',
        verbose_name='Користувач'
    )
    
    # Ігрова валюта
    coins = models.IntegerField(
        default=1250,
        validators=[MinValueValidator(0)],
        verbose_name='Монети'
    )
    
    # Токени (преміум валюта)
    tokens = models.IntegerField(
        default=45,
        validators=[MinValueValidator(0)],
        verbose_name='Токени'
    )
    
    # Рівень користувача
    level = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        verbose_name='Рівень'
    )
    
    # Підписка
    subscription = models.CharField(
        max_length=20,
        choices=SUBSCRIPTION_TYPES,
        default='free',
        verbose_name='Підписка'
    )
    subscription_expires = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Закінчення підписки'
    )
    
    # Налаштування (JSON)
    settings = models.JSONField(
        default=dict,
        verbose_name='Налаштування'
    )
    
    # Мова інтерфейсу
    language = models.CharField(
        max_length=5,
        default='uk',
        choices=[
            ('uk', 'Українська'),
            ('ro', 'Română'),
            ('en', 'English'),
            ('es', 'Español'),
        ],
        verbose_name='Мова'
    )
    
    # Часові мітки
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Профіль користувача'
        verbose_name_plural = 'Профілі користувачів'
    
    def __str__(self):
        return f"Profile: {self.user.username}"
    
    @property
    def is_pro(self) -> bool:
        """Перевірити чи активна Pro підписка."""
        if self.subscription == 'free':
            return False
        if self.subscription_expires is None:
            return False
        return self.subscription_expires > timezone.now()


# ============================================
# МОДЕЛЬ КВЕСТІВ/ЗАВДАНЬ
# ============================================

class Quest(models.Model):
    """
    Модель квестів для гейміфікації.
    """
    
    QUEST_TYPES = [
        ('daily', 'Щоденний'),
        ('weekly', 'Щотижневий'),
        ('special', 'Спеціальний'),
    ]
    
    # Назва та опис
    title = models.CharField(max_length=200, verbose_name='Назва')
    description = models.TextField(verbose_name='Опис')
    
    # Тип квесту
    quest_type = models.CharField(
        max_length=20,
        choices=QUEST_TYPES,
        default='daily',
        verbose_name='Тип'
    )
    
    # Нагороди
    xp_reward = models.IntegerField(
        default=50,
        verbose_name='Нагорода XP'
    )
    coin_reward = models.IntegerField(
        default=15,
        verbose_name='Нагорода монет'
    )
    
    # Прогрес
    target = models.IntegerField(
        default=1,
        verbose_name='Ціль'
    )
    
    # Активність
    is_active = models.BooleanField(
        default=True,
        verbose_name='Активний'
    )
    
    class Meta:
        verbose_name = 'Квест'
        verbose_name_plural = 'Квести'
    
    def __str__(self):
        return self.title


# ============================================
# МОДЕЛЬ ПРОГРЕСУ КВЕСТУ
# ============================================

class QuestProgress(models.Model):
    """
    Прогрес виконання квесту користувачем.
    """
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='quest_progress'
    )
    quest = models.ForeignKey(
        Quest,
        on_delete=models.CASCADE,
        related_name='user_progress'
    )
    progress = models.IntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'Прогрес квесту'
        verbose_name_plural = 'Прогрес квестів'
        unique_together = ['user', 'quest']
    
    def __str__(self):
        return f"{self.user.username} - {self.quest.title}"
