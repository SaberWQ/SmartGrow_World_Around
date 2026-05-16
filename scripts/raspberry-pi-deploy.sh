#!/bin/bash
# ============================================
# SmartGrow SecureAI - Raspberry Pi Deployment Script
# ============================================
# Цей скрипт автоматично налаштовує:
# - Next.js Frontend (порт 3000)
# - Django Backend (порт 8000)
# - Nginx Reverse Proxy (порт 80/443)
# - SSL сертифікат (Let's Encrypt)
# - Systemd сервіси для автозапуску
#
# Автор: SmartGrow Team
# Ліцензія: Захищено законом України №2811-IX
# ============================================

set -e  # Зупинка при помилці

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================
# КОНФІГУРАЦІЯ - ЗМІНІТЬ ПІД СВОЇ ПОТРЕБИ
# ============================================
DOMAIN="smartgrow.local"           # Ваш домен (або IP)
EMAIL="admin@smartgrow.local"      # Email для SSL
PROJECT_DIR="/home/pi/smartgrow"   # Директорія проекту
BACKEND_PORT=8000                  # Порт Django
FRONTEND_PORT=3000                 # Порт Next.js

# GPIO піни
UV_LIGHT_PIN=27                    # Пін для UV лампи
WATER_MOTOR_PIN=4                  # Пін для мотору поливу

echo -e "${BLUE}"
echo "============================================"
echo "  SmartGrow SecureAI - Raspberry Pi Setup"
echo "============================================"
echo -e "${NC}"

# ============================================
# КРОК 1: Оновлення системи
# ============================================
echo -e "${YELLOW}[1/10] Оновлення системи...${NC}"
sudo apt update && sudo apt upgrade -y

# ============================================
# КРОК 2: Встановлення залежностей
# ============================================
echo -e "${YELLOW}[2/10] Встановлення залежностей...${NC}"
sudo apt install -y \
    python3 python3-pip python3-venv \
    nodejs npm \
    nginx \
    certbot python3-certbot-nginx \
    git curl wget \
    build-essential \
    libffi-dev libssl-dev \
    pigpio python3-pigpio

# Встановлення pnpm
sudo npm install -g pnpm

# Встановлення Node.js 20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# ============================================
# КРОК 3: Клонування проекту
# ============================================
echo -e "${YELLOW}[3/10] Клонування проекту...${NC}"
if [ -d "$PROJECT_DIR" ]; then
    echo "Директорія існує, оновлюємо..."
    cd $PROJECT_DIR
    git pull
else
    git clone https://github.com/smartgrow/smartgrow-secureai.git $PROJECT_DIR
    cd $PROJECT_DIR
fi

# ============================================
# КРОК 4: Налаштування Backend (Django)
# ============================================
echo -e "${YELLOW}[4/10] Налаштування Django Backend...${NC}"
cd $PROJECT_DIR/backend

# Створення віртуального середовища
python3 -m venv venv
source venv/bin/activate

# Встановлення залежностей
pip install --upgrade pip
pip install -r requirements.txt

# Створення .env файлу
cat > .env << EOF
# Django Settings
DEBUG=False
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(50))")
ALLOWED_HOSTS=$DOMAIN,localhost,127.0.0.1,$(hostname -I | awk '{print $1}')

# Database
DATABASE_URL=sqlite:///db.sqlite3

# IoT GPIO Settings
IOT_SIMULATION=False
UV_LIGHT_PIN=$UV_LIGHT_PIN
WATER_MOTOR_PIN=$WATER_MOTOR_PIN

# Security
CORS_ALLOWED_ORIGINS=http://$DOMAIN,https://$DOMAIN,http://localhost:3000

# Frontend URL
FRONTEND_URL=http://$DOMAIN
EOF

# Міграції бази даних
python manage.py migrate
python manage.py collectstatic --noinput

# Створення superuser (опціонально)
# python manage.py createsuperuser --noinput --username admin --email admin@smartgrow.local

deactivate

# ============================================
# КРОК 5: Налаштування Frontend (Next.js)
# ============================================
echo -e "${YELLOW}[5/10] Налаштування Next.js Frontend...${NC}"
cd $PROJECT_DIR

# Створення .env.local
cat > .env.local << EOF
# API Configuration
NEXT_PUBLIC_API_URL=http://$DOMAIN/api
NEXT_PUBLIC_WS_URL=ws://$DOMAIN/ws

# Django Backend
DJANGO_API_URL=http://127.0.0.1:$BACKEND_PORT

# IoT Mode (true = real GPIO, false = simulation)
NEXT_PUBLIC_IOT_MODE=true
EOF

# Встановлення залежностей та збірка
pnpm install
pnpm build

# ============================================
# КРОК 6: Налаштування Systemd для Django
# ============================================
echo -e "${YELLOW}[6/10] Налаштування Systemd сервісу для Django...${NC}"
sudo tee /etc/systemd/system/smartgrow-backend.service << EOF
[Unit]
Description=SmartGrow Django Backend
After=network.target

[Service]
User=pi
Group=pi
WorkingDirectory=$PROJECT_DIR/backend
Environment="PATH=$PROJECT_DIR/backend/venv/bin"
ExecStart=$PROJECT_DIR/backend/venv/bin/gunicorn \\
    --workers 2 \\
    --bind 127.0.0.1:$BACKEND_PORT \\
    --timeout 120 \\
    --access-logfile /var/log/smartgrow/backend-access.log \\
    --error-logfile /var/log/smartgrow/backend-error.log \\
    smartgrow.wsgi:application
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# ============================================
# КРОК 7: Налаштування Systemd для Next.js
# ============================================
echo -e "${YELLOW}[7/10] Налаштування Systemd сервісу для Next.js...${NC}"
sudo tee /etc/systemd/system/smartgrow-frontend.service << EOF
[Unit]
Description=SmartGrow Next.js Frontend
After=network.target smartgrow-backend.service

[Service]
User=pi
Group=pi
WorkingDirectory=$PROJECT_DIR
Environment="NODE_ENV=production"
Environment="PORT=$FRONTEND_PORT"
ExecStart=/usr/bin/pnpm start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Створення директорії для логів
sudo mkdir -p /var/log/smartgrow
sudo chown pi:pi /var/log/smartgrow

# ============================================
# КРОК 8: Налаштування Nginx
# ============================================
echo -e "${YELLOW}[8/10] Налаштування Nginx...${NC}"
sudo tee /etc/nginx/sites-available/smartgrow << EOF
# ============================================
# SmartGrow SecureAI - Nginx Configuration
# ============================================
# Один домен для Frontend і Backend
# Frontend: / (Next.js на порту 3000)
# Backend API: /api/ (Django на порту 8000)
# ============================================

# Rate limiting для захисту від DDoS
limit_req_zone \$binary_remote_addr zone=smartgrow_limit:10m rate=10r/s;
limit_conn_zone \$binary_remote_addr zone=smartgrow_conn:10m;

upstream frontend {
    server 127.0.0.1:$FRONTEND_PORT;
    keepalive 64;
}

upstream backend {
    server 127.0.0.1:$BACKEND_PORT;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    # Redirect HTTP to HTTPS (розкоментуйте після отримання SSL)
    # return 301 https://\$server_name\$request_uri;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Rate limiting
    limit_req zone=smartgrow_limit burst=20 nodelay;
    limit_conn smartgrow_conn 20;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml;

    # ============================================
    # BACKEND API (Django) - /api/
    # ============================================
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 120s;
        proxy_connect_timeout 120s;

        # CORS headers для API
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With" always;

        if (\$request_method = OPTIONS) {
            return 204;
        }
    }

    # ============================================
    # DJANGO ADMIN - /admin/
    # ============================================
    location /admin/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # ============================================
    # STATIC FILES (Django) - /static/
    # ============================================
    location /static/ {
        alias $PROJECT_DIR/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # ============================================
    # WEBSOCKET - /ws/
    # ============================================
    location /ws/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_read_timeout 86400;
    }

    # ============================================
    # FRONTEND (Next.js) - / (все інше)
    # ============================================
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # ============================================
    # NEXT.JS STATIC - /_next/
    # ============================================
    location /_next/static/ {
        proxy_pass http://frontend;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "OK";
        add_header Content-Type text/plain;
    }
}

# HTTPS конфігурація (розкоментуйте після certbot)
# server {
#     listen 443 ssl http2;
#     listen [::]:443 ssl http2;
#     server_name $DOMAIN;
#
#     ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
#     ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
#     ssl_session_timeout 1d;
#     ssl_session_cache shared:SSL:50m;
#     ssl_protocols TLSv1.2 TLSv1.3;
#     ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
#     ssl_prefer_server_ciphers off;
#
#     # ... (копіюйте location блоки з HTTP секції)
# }
EOF

# Активація сайту
sudo ln -sf /etc/nginx/sites-available/smartgrow /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Перевірка конфігурації
sudo nginx -t

# ============================================
# КРОК 9: Налаштування GPIO
# ============================================
echo -e "${YELLOW}[9/10] Налаштування GPIO...${NC}"

# Додавання користувача до gpio групи
sudo usermod -aG gpio pi

# Запуск pigpiod для GPIO доступу
sudo systemctl enable pigpiod
sudo systemctl start pigpiod

# ============================================
# КРОК 10: Запуск сервісів
# ============================================
echo -e "${YELLOW}[10/10] Запуск сервісів...${NC}"

# Перезавантаження systemd
sudo systemctl daemon-reload

# Запуск сервісів
sudo systemctl enable smartgrow-backend
sudo systemctl enable smartgrow-frontend
sudo systemctl start smartgrow-backend
sudo systemctl start smartgrow-frontend

# Перезапуск Nginx
sudo systemctl restart nginx

# ============================================
# ГОТОВО!
# ============================================
echo -e "${GREEN}"
echo "============================================"
echo "  SmartGrow SecureAI - Встановлення завершено!"
echo "============================================"
echo -e "${NC}"

# Отримання IP адреси
IP=$(hostname -I | awk '{print $1}')

echo -e "${BLUE}Доступ до системи:${NC}"
echo "  - Frontend: http://$IP або http://$DOMAIN"
echo "  - Backend API: http://$IP/api/"
echo "  - Django Admin: http://$IP/admin/"
echo ""
echo -e "${BLUE}GPIO піни:${NC}"
echo "  - UV лампа: GPIO $UV_LIGHT_PIN"
echo "  - Мотор поливу: GPIO $WATER_MOTOR_PIN"
echo ""
echo -e "${BLUE}Керування сервісами:${NC}"
echo "  sudo systemctl status smartgrow-backend"
echo "  sudo systemctl status smartgrow-frontend"
echo "  sudo systemctl restart smartgrow-backend"
echo "  sudo systemctl restart smartgrow-frontend"
echo ""
echo -e "${BLUE}Логи:${NC}"
echo "  sudo journalctl -u smartgrow-backend -f"
echo "  sudo journalctl -u smartgrow-frontend -f"
echo ""
echo -e "${YELLOW}Для SSL сертифіката (потрібен публічний домен):${NC}"
echo "  sudo certbot --nginx -d $DOMAIN -m $EMAIL --agree-tos"
echo ""
echo -e "${GREEN}Готово! Відкрийте http://$IP у браузері.${NC}"
