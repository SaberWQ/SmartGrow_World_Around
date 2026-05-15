"""
============================================
SmartGrow SecureAI - Головні URL маршрути
============================================
Цей файл визначає всі URL маршрути Django проекту.
API endpoints доступні за адресою /api/v1/

Автор: SmartGrow Team
============================================
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    # Django Admin Panel (тільки для адміністраторів)
    path('admin/', admin.site.urls),
    
    # ============================================
    # API v1 маршрути
    # ============================================
    path('api/v1/', include('api.urls')),
    
    # IoT керування (GPIO)
    path('api/v1/iot/', include('iot.urls')),
    
    # Security API (IDS, threat intelligence, карантин)
    path('api/v1/security/', include('security.urls')),
    
    # ============================================
    # JWT Аутентифікація
    # ============================================
    # POST /api/v1/auth/token/ - отримати access та refresh токени
    path('api/v1/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # POST /api/v1/auth/token/refresh/ - оновити access токен
    path('api/v1/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # POST /api/v1/auth/token/verify/ - перевірити валідність токена
    path('api/v1/auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
