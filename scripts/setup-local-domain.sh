#!/bin/bash
# ============================================
# SmartGrow SecureAI - Local Domain Setup
# ============================================
# Налаштування локального домену для Raspberry Pi
# щоб клієнти в локальній мережі могли підключатися
# за адресою smartgrow.local замість IP
# ============================================

set -e

DOMAIN="smartgrow.local"
PI_IP=$(hostname -I | awk '{print $1}')

echo "============================================"
echo "  SmartGrow - Налаштування локального домену"
echo "============================================"
echo ""
echo "IP адреса Raspberry Pi: $PI_IP"
echo "Домен: $DOMAIN"
echo ""

# ============================================
# ВАРІАНТ 1: mDNS (Avahi) - Рекомендований
# ============================================
# Автоматично працює для пристроїв що підтримують mDNS
# (macOS, Linux, Windows 10+)

echo "[1/3] Встановлення Avahi (mDNS)..."
sudo apt install -y avahi-daemon

# Налаштування Avahi
sudo tee /etc/avahi/services/smartgrow.service << EOF
<?xml version="1.0" standalone='no'?>
<!DOCTYPE service-group SYSTEM "avahi-service.dtd">
<service-group>
  <name>SmartGrow SecureAI</name>
  <service>
    <type>_http._tcp</type>
    <port>80</port>
    <txt-record>path=/</txt-record>
    <txt-record>desc=Smart Greenhouse IoT Platform</txt-record>
  </service>
</service-group>
EOF

sudo systemctl restart avahi-daemon
echo "Avahi налаштовано. Домен: $(hostname).local"

# ============================================
# ВАРІАНТ 2: dnsmasq - Локальний DNS сервер
# ============================================
# Для пристроїв що не підтримують mDNS

echo "[2/3] Встановлення dnsmasq (локальний DNS)..."
sudo apt install -y dnsmasq

# Backup оригінальної конфігурації
sudo cp /etc/dnsmasq.conf /etc/dnsmasq.conf.backup 2>/dev/null || true

# Налаштування dnsmasq
sudo tee /etc/dnsmasq.d/smartgrow.conf << EOF
# SmartGrow SecureAI - Local DNS
# Перенаправляє smartgrow.local на IP Raspberry Pi

# Не використовувати /etc/resolv.conf
no-resolv

# Upstream DNS сервери
server=8.8.8.8
server=8.8.4.4

# Локальний домен
local=/local/
domain=local

# A-записи для SmartGrow
address=/smartgrow.local/$PI_IP
address=/api.smartgrow.local/$PI_IP
address=/ws.smartgrow.local/$PI_IP

# CNAME записи
cname=www.smartgrow.local,smartgrow.local

# Кеш DNS
cache-size=1000

# Логування (для дебагу)
# log-queries
# log-facility=/var/log/dnsmasq.log
EOF

# Перезапуск dnsmasq
sudo systemctl restart dnsmasq
sudo systemctl enable dnsmasq

# ============================================
# ВАРІАНТ 3: Hosts файл на клієнтах
# ============================================
# Якщо mDNS і dnsmasq не підходять

echo "[3/3] Інструкція для hosts файлу на клієнтах..."

cat << EOF

============================================
НАЛАШТУВАННЯ КЛІЄНТІВ
============================================

Raspberry Pi IP: $PI_IP

ВАРІАНТ A - Автоматичний (mDNS):
  Домен $(hostname).local повинен автоматично працювати
  на macOS, Linux та Windows 10/11.

ВАРІАНТ B - Використовуйте Pi як DNS сервер:
  Налаштуйте DNS сервер вашого роутера на $PI_IP
  або вручну на кожному пристрої.

ВАРІАНТ C - Додайте запис в hosts файл:

  Windows (запустіть Notepad як Адміністратор):
    C:\\Windows\\System32\\drivers\\etc\\hosts
    Додайте рядок:
    $PI_IP    smartgrow.local

  macOS / Linux:
    sudo nano /etc/hosts
    Додайте рядок:
    $PI_IP    smartgrow.local

  Android:
    Потрібен root або DNS-змінювач додаток

  iOS:
    Використовуйте mDNS ($(hostname).local) або IP

============================================
ПЕРЕВІРКА ПІДКЛЮЧЕННЯ
============================================

З будь-якого пристрою в мережі:

  ping smartgrow.local
  # або
  ping $(hostname).local
  # або
  ping $PI_IP

Відкрийте в браузері:
  http://smartgrow.local
  http://$(hostname).local
  http://$PI_IP

============================================
EOF

# Вивід статусу
echo ""
echo "============================================"
echo "  Налаштування завершено!"
echo "============================================"
echo ""
echo "Доступні адреси:"
echo "  - http://smartgrow.local"
echo "  - http://$(hostname).local"
echo "  - http://$PI_IP"
echo ""
echo "Статус сервісів:"
echo "  avahi-daemon: $(systemctl is-active avahi-daemon)"
echo "  dnsmasq: $(systemctl is-active dnsmasq)"
echo ""
