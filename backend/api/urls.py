"""
============================================
SmartGrow SecureAI - API URL Routes
============================================
URL маршрути для головного API.

Автор: SmartGrow Team
============================================
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Простір імен
app_name = 'api'

# Створюємо роутер для ViewSets
router = DefaultRouter()

# Реєструємо ViewSets
router.register(r'plants', views.PlantViewSet, basename='plant')
router.register(r'sensors', views.SensorDataViewSet, basename='sensor')
router.register(r'security', views.SecurityEventViewSet, basename='security-event')
router.register(r'quests', views.QuestViewSet, basename='quest')

urlpatterns = [
    # ============================================
    # АУТЕНТИФІКАЦІЯ
    # ============================================
    # POST /api/v1/auth/register/
    path('auth/register/', views.register, name='register'),
    
    # ============================================
    # ПРОФІЛЬ КОРИСТУВАЧА
    # ============================================
    # GET/PATCH /api/v1/profile/
    path('profile/', views.user_profile, name='profile'),
    
    # ============================================
    # БЕЗПЕКА
    # ============================================
    # POST /api/v1/security/simulate-attack/
    path('security/simulate-attack/', views.simulate_attack, name='simulate_attack'),
    
    # POST /api/v1/security/reset/
    path('security/reset/', views.reset_security, name='reset_security'),
    
    # ============================================
    # КВЕСТИ
    # ============================================
    # POST /api/v1/quests/{id}/complete/
    path('quests/<int:quest_id>/complete/', views.complete_quest, name='complete_quest'),
    
    # ============================================
    # VIEWSET ROUTES
    # ============================================
    path('', include(router.urls)),
]
