# =============================================================================
# SmartGrow SecureAI - Security URL Configuration
# =============================================================================

from django.urls import path
from .views import (
    SecurityStatusView,
    SecurityEventsView,
    BlockedIPsView,
    QuarantineView,
    AttackSimulatorView,
    ThreatIntelligenceView,
)

# URL патерни для Security API
# Всі шляхи починаються з /api/security/

urlpatterns = [
    # === Статус системи безпеки ===
    # GET /api/security/status - загальний статус
    path('status/', SecurityStatusView.as_view(), name='security-status'),
    
    # === Події безпеки ===
    # GET /api/security/events - список подій з фільтрацією
    path('events/', SecurityEventsView.as_view(), name='security-events'),
    
    # === Керування заблокованими IP ===
    # GET /api/security/blocked-ips - список заблокованих
    # POST /api/security/blocked-ips - заблокувати IP
    # DELETE /api/security/blocked-ips - розблокувати IP
    path('blocked-ips/', BlockedIPsView.as_view(), name='blocked-ips'),
    
    # === Режим карантину ===
    # GET /api/security/quarantine - статус карантину
    # POST /api/security/quarantine - активувати/деактивувати
    path('quarantine/', QuarantineView.as_view(), name='quarantine'),
    
    # === Симулятор атак (тільки для тестування!) ===
    # POST /api/security/simulate-attack
    path('simulate-attack/', AttackSimulatorView.as_view(), name='simulate-attack'),
    
    # === Threat Intelligence ===
    # GET /api/security/threat-intelligence - аналітика загроз
    path('threat-intelligence/', ThreatIntelligenceView.as_view(), name='threat-intelligence'),
]
