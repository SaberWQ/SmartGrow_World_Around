#!/usr/bin/env python
"""
============================================
SmartGrow SecureAI - Django Management Script
============================================
Django's command-line utility for administrative tasks.

Використання:
  python manage.py runserver        - Запуск dev сервера
  python manage.py migrate          - Застосувати міграції
  python manage.py createsuperuser  - Створити адміністратора
  python manage.py shell            - Інтерактивна консоль
============================================
"""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartgrow.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
