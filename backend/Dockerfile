# ============================================
# SmartGrow SecureAI - Backend Dockerfile
# ============================================
# Django + Gunicorn для продакшн середовища
# ============================================

FROM python:3.11-slim

# Змінні середовища
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1

# Робоча директорія
WORKDIR /app

# Системні залежності
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Копіювання та встановлення Python залежностей
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Копіювання коду додатку
COPY . .

# Створення непривілейованого користувача
RUN useradd --create-home --shell /bin/bash appuser && \
    chown -R appuser:appuser /app
USER appuser

# Порт
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/health/ || exit 1

# Запуск
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "120", "smartgrow.wsgi:application"]
