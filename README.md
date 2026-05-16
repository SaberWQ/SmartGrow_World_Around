# SmartGrow SecureAI

<div align="center">

<!-- LOGO -->
<img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-emRxDnYXuGUWkL1kSMBqbU20bocsj3.png" alt="SmartGrow SecureAI Dashboard" width="100%" />

**Zero-Trust IoT Behavioral Profiler for Smart Greenhouses**

*Protecting Ukrainian smart greenhouses from cyberattacks*

*Захист українських розумних теплиць від кібератак*

[![License](https://img.shields.io/badge/License-Ukraine%20Law%20%E2%84%962811--IX-blue.svg)](https://zakon.rada.gov.ua/laws/show/2811-20)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![Django](https://img.shields.io/badge/Django-5.0-green.svg)](https://djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-yellow.svg)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://typescriptlang.org/)
[![Raspberry Pi](https://img.shields.io/badge/Raspberry%20Pi-4B-red.svg)](https://raspberrypi.org/)
[![Security](https://img.shields.io/badge/Security-Zero%20Trust-purple.svg)](#security-system)

[English](#table-of-contents) | [Українська](#українська) | [Romana](#romana) | [Espanol](#espanol)

</div>

---

## Demo Video / Демо-відео

<div align="center">

[![SmartGrow Demo](https://img.shields.io/badge/Watch-Demo%20Video-red?style=for-the-badge&logo=youtube)](https://github.com/user-attachments/assets/smartgrow-demo)

*SmartGrow SecureAI in Action / SmartGrow SecureAI в дії*

</div>

---

## Screenshots / Скріншоти

<div align="center">

### Main Dashboard / Головна панель

<img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-emRxDnYXuGUWkL1kSMBqbU20bocsj3.png" alt="SmartGrow Dashboard" width="100%" />

*Plant monitoring, Security Center, AI Chat, Tasks & Quests, Shop, Data Analytics*

*Моніторинг рослин, Центр безпеки, AI Чат, Завдання та квести, Магазин, Аналітика даних*

</div>

---

## Table of Contents

## Зміст

1. [About Project / Про проект](#about-project)
2. [The Problem / Проблема](#the-problem-we-solve)
3. [Our Solution / Наше рішення](#our-solution)
4. [System Architecture / Архітектура](#system-architecture)
5. [Git Workflow / Git стратегія](#git-workflow)
6. [Main Features / Функціонал](#main-features-7-pages)
7. [Security System / Безпека](#security-system)
8. [Triple Encryption / Потрійна шифрація](#triple-encryption)
9. [GPIO Control / Керування GPIO](#gpio-control)
10. [Installation / Встановлення](#installation)
    - [Windows](#windows)
    - [macOS](#macos)
    - [Linux](#linux-ubuntudebian)
    - [Raspberry Pi](#raspberry-pi)
11. [Build & Compilation / Компіляція](#build--compilation)
12. [Docker](#docker-deployment)
13. [API Documentation / API документація](#api-documentation)
14. [Project Structure / Структура проекту](#project-structure)
15. [Technologies / Технології](#technologies)
16. [Team / Команда](#team)
17. [License / Ліцензія](#license)
18. [Українська](#українська)
19. [Romana](#romana)
20. [Espanol](#espanol)

---

## About Project

## Про проект

**SmartGrow SecureAI** is an innovative platform for protecting smart underground greenhouses from cyberattacks. The system uses Zero-Trust architecture and behavioral analysis to detect and prevent threats in real-time.

**SmartGrow SecureAI** - це інноваційна платформа для захисту розумних підземних теплиць від кібератак. Система використовує Zero-Trust архітектуру та поведінковий аналіз для виявлення та запобігання загрозам у реальному часі.

Project developed for **Infomatrix 2026** hackathon (Task #9: Cybersecurity for Critical Infrastructure).

Проект розроблено для хакатону **Infomatrix 2026** (Завдання #9: Кібербезпека критичної інфраструктури).

### Key Features / Ключові особливості

| Feature | Description | Опис |
|---------|-------------|------|
| **Leafy AI** | AI plant character with 6 moods | AI персонаж рослини з 6 настроями |
| **Zero-Trust** | "Never trust, always verify" | "Ніколи не довіряй, завжди перевіряй" |
| **Triple Encryption** | AES-256 + ChaCha20 + RSA-4096 | Банківський рівень шифрації |
| **IDS** | Real-time intrusion detection | Виявлення вторгнень в реальному часі |
| **GPIO** | Raspberry Pi control (Pin 27 UV, Pin 4 Water) | Керування пінами 27 та 4 |
| **4 Languages** | UK, EN, RO, ES | Українська, англійська, румунська, іспанська |

---

## The Problem We Solve

## Проблема яку ми вирішуємо

In Ukraine, smart underground greenhouses face significant cyberattacks, resulting in crop losses of up to 40%.

В Україні розумні підземні теплиці піддаються значним кібератакам, що призводить до втрати до 40% врожаю.

### Attack Types / Типи атак

| Attack | Description | Impact | Опис |
|--------|-------------|--------|------|
| **Data Poisoning** | Falsifying sensor data | 35% crop loss | Фальсифікація даних сенсорів |
| **Sensor Spoofing** | Replacing real values | Equipment damage | Підміна реальних значень |
| **Gradual Drift** | Slow parameter changes | Undetected damage | Повільні зміни параметрів |
| **Command Injection** | Unauthorized GPIO commands | Physical damage | Несанкціоновані команди |
| **Replay Attack** | Replaying valid commands | Resource waste | Повтор валідних команд |
| **DoS Attack** | Service overload | System failure | Перевантаження сервісу |
| **Man-in-the-Middle** | Data interception | Data theft | Перехоплення даних |

### Statistics / Статистика

```
Cyberattacks on Ukrainian agriculture (2023-2025):
Кібератаки на українське сільське господарство (2023-2025):

+150% - Increase in IoT attacks / Зростання IoT атак
40%   - Crop losses from attacks / Втрати врожаю від атак
$2.5M - Average damage per farm / Середні збитки на ферму
73%   - Farms without protection / Ферми без захисту
```

---

## Our Solution

## Наше рішення

SmartGrow SecureAI offers comprehensive protection with a friendly interface featuring **Leafy** - an anime-style AI plant character.

SmartGrow SecureAI пропонує комплексний захист з дружнім інтерфейсом з **Leafy** - аніме AI персонажем рослини.

### Leafy - AI Plant Character / Leafy - AI персонаж рослини

```
    Leafy Moods / Настрої Leafy:
    ============================
    
       ╭─────╮         ╭─────╮         ╭─────╮
      │ ^_^ │  HAPPY  │ -_- │  TIRED  │ >_< │  SICK
       ╰──┬──╯         ╰──┬──╯         ╰──┬──╯
         \|/             \|/             \|/
          │               │               │
         /|\             /|\             /|\
        / | \           / | \           / | \
    
       ╭─────╮         ╭─────╮         ╭─────╮
      │ o_o │  THIRSTY│ !_! │ ALERT  │ $_$ │ EXCITED
       ╰──┬──╯         ╰──┬──╯         ╰──┬──╯
         \|/             \|/             \|/
          │               │               │
         /|\             /|\             /|\
        / | \           / | \           / | \
    
    Mood depends on: / Настрій залежить від:
    - Health (0-100%) / Здоров'я
    - Hydration level / Рівень зволоження
    - Security status / Статус безпеки
    - Environmental conditions / Умови середовища
```

---

## System Architecture

## Архітектура системи

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SmartGrow SecureAI Architecture                      │
│                         Архітектура SmartGrow SecureAI                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                        FRONTEND (Next.js 16)                         │   │
│   │                                                                      │   │
│   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│   │  │   Plant  │ │ Security │ │   Data   │ │ AI Chat  │ │   Shop   │  │   │
│   │  │  Рослина │ │  Безпека │ │   Дані   │ │  AI Чат  │ │  Магазин │  │   │
│   │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │   │
│   │       │            │            │            │            │         │   │
│   │       └────────────┴─────┬──────┴────────────┴────────────┘         │   │
│   │                          │                                          │   │
│   │                    ┌─────┴─────┐                                    │   │
│   │                    │  Zustand  │  (State Management)                │   │
│   │                    │   Store   │  (Керування станом)                │   │
│   │                    └─────┬─────┘                                    │   │
│   └──────────────────────────┼──────────────────────────────────────────┘   │
│                              │                                              │
│                              │ API Routes                                   │
│                              ▼                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      BACKEND (Django 5.0)                            │   │
│   │                                                                      │   │
│   │  ┌──────────────────────────────────────────────────────────────┐   │   │
│   │  │                    SECURITY MODULE                            │   │   │
│   │  │                    МОДУЛЬ БЕЗПЕКИ                             │   │   │
│   │  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌───────────┐  │   │   │
│   │  │  │    IDS     │ │   Crypto   │ │ Middleware │ │  Audit    │  │   │   │
│   │  │  │  (fsocity) │ │  (Triple)  │ │(Zero-Trust)│ │   Log     │  │   │   │
│   │  │  └────────────┘ └────────────┘ └────────────┘ └───────────┘  │   │   │
│   │  └──────────────────────────────────────────────────────────────┘   │   │
│   │                                                                      │   │
│   │  ┌──────────────────────────────────────────────────────────────┐   │   │
│   │  │                     IoT MODULE                                │   │   │
│   │  │                    МОДУЛЬ IoT                                 │   │   │
│   │  │  ┌────────────┐ ┌────────────┐ ┌────────────┐                │   │   │
│   │  │  │    GPIO    │ │  Sensors   │ │  Scheduler │                │   │   │
│   │  │  │  Controller│ │   Reader   │ │  Планувач  │                │   │   │
│   │  │  │ Pin 27, 4  │ │   Сенсори  │ │            │                │   │   │
│   │  │  └────────────┘ └────────────┘ └────────────┘                │   │   │
│   │  └──────────────────────────────────────────────────────────────┘   │   │
│   │                                                                      │   │
│   │  ┌──────────────────────────────────────────────────────────────┐   │   │
│   │  │                    API MODULE                                 │   │   │
│   │  │                   МОДУЛЬ API                                  │   │   │
│   │  │  ┌────────────┐ ┌────────────┐ ┌────────────┐                │   │   │
│   │  │  │   REST     │ │Serializers │ │   Views    │                │   │   │
│   │  │  │   API      │ │            │ │            │                │   │   │
│   │  │  └────────────┘ └────────────┘ └────────────┘                │   │   │
│   │  └──────────────────────────────────────────────────────────────┘   │   │
│   └──────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     RASPBERRY PI 4B                                  │   │
│   │                                                                      │   │
│   │   GPIO Pin 27 ──────► UV LAMP (Ultraviolet)                         │   │
│   │                       УФ ЛАМПА (Ультрафіолет)                        │   │
│   │                                                                      │   │
│   │   GPIO Pin 4  ──────► WATER MOTOR (Irrigation Pump)                 │   │
│   │                       МОТОР ПОЛИВУ (Насос)                          │   │
│   │                                                                      │   │
│   │   I2C/SPI ──────────► SENSORS (Temperature, Humidity, pH, EC)       │   │
│   │                       СЕНСОРИ (Температура, вологість, pH, EC)      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram / Діаграма потоків даних

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   SENSORS   │────►│  VALIDATOR  │────►│     IDS     │────►│   STORAGE   │
│   СЕНСОРИ   │     │  ВАЛІДАТОР  │     │  ДЕТЕКТОР   │     │  СХОВИЩЕ    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │                   │
       │            ┌──────┴──────┐     ┌──────┴──────┐           │
       │            │  INVALID?   │     │  THREAT?    │           │
       │            │  НЕВАЛІДНО? │     │  ЗАГРОЗА?   │           │
       │            └──────┬──────┘     └──────┬──────┘           │
       │                   │                   │                   │
       │            ┌──────▼──────┐     ┌──────▼──────┐           │
       │            │   REJECT    │     │ QUARANTINE  │           │
       │            │  ВІДХИЛИТИ  │     │  КАРАНТИН   │           │
       │            └─────────────┘     └─────────────┘           │
       │                                                          │
       │                                                          ▼
       │                                               ┌─────────────────┐
       └──────────────────────────────────────────────►│   DASHBOARD     │
                                                       │   ПАНЕЛЬ        │
                                                       └─────────────────┘
```

---

## Git Workflow

## Git стратегія

```
                    Git Branch Strategy / Git стратегія гілок
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   main (production) ─────●─────────●─────────────────●─────────────► v1.0   │
│                          │         │                 │                      │
│                          │         │                 │                      │
│   staging ──────●────────┼─────────┼─────●───────────┼──────────────►       │
│                 │        │         │     │           │                      │
│                 │        │         │     │           │                      │
│   develop ──●───┼────────┼───●─────┼─────┼───●───────┼───●───────────►       │
│             │   │        │   │     │     │   │       │   │                  │
│             │   │        │   │     │     │   │       │   │                  │
│   feature/  │   │        │   │     │     │   │       │   │                  │
│   security ─┴───┘        │   │     │     │   │       │   │                  │
│                          │   │     │     │   │       │   │                  │
│   feature/               │   │     │     │   │       │   │                  │
│   leafy-ai ──────────────┴───┘     │     │   │       │   │                  │
│                                    │     │   │       │   │                  │
│   feature/                         │     │   │       │   │                  │
│   gpio-control ────────────────────┴─────┘   │       │   │                  │
│                                              │       │   │                  │
│   hotfix/                                    │       │   │                  │
│   security-patch ────────────────────────────┴───────┘   │                  │
│                                                          │                  │
│   release/                                               │                  │
│   v1.0.0 ────────────────────────────────────────────────┘                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

Branch naming convention / Конвенція іменування гілок:
- feature/*  - New features / Нові функції
- bugfix/*   - Bug fixes / Виправлення помилок
- hotfix/*   - Urgent fixes / Термінові виправлення
- release/*  - Release preparation / Підготовка релізу
```

---

## Main Features (7 Pages)

## Основний функціонал (7 сторінок)

### 1. Plant Dashboard / Панель рослини

```
┌────────────────────────────────────────────────────────────┐
│  Welcome back, Grower! / Вітаємо, Садівник!                │
├────────────────────────────────────────────────────────────┤
│                                                            │
│     ┌─────────────┐     ┌───────────────────────────────┐  │
│     │   LEAFY     │     │  Quick Actions / Швидкі дії   │  │
│     │    ^_^      │     │  ┌────────┐  ┌────────┐       │  │
│     │   \|/       │     │  │ WATER  │  │  STOP  │       │  │
│     │    |        │     │  │ ПОЛИВ  │  │  СТОП  │       │  │
│     │   /|\       │     │  └────────┘  └────────┘       │  │
│     │  Level 12   │     │  ┌────────┐  ┌────────┐       │  │
│     │  Рівень 12  │     │  │ UV ON  │  │ UV OFF │       │  │
│     └─────────────┘     │  │УФ УВІМ │  │УФ ВИМК │       │  │
│                         │  └────────┘  └────────┘       │  │
│     Health: 92%         └───────────────────────────────┘  │
│     Здоров'я: 92%                                          │
│                         ┌───────────────────────────────┐  │
│     Mood: Happy         │ Environment / Середовище      │  │
│     Настрій: Щасливий   │ Temp: 22.4°C | Humidity: 65%  │  │
│                         │ Темп: 22.4°C | Вологість: 65% │  │
│     Trust: 94%          │ Soil: 48%    | pH: 6.2        │  │
│     Довіра: 94%         │ Грунт: 48%   | pH: 6.2        │  │
│                         └───────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### 2. Security Center / Центр безпеки

- Trust Score Ring / Кільце довіри
- Threat Activity Graph / Графік загроз
- Recent Threats Log / Журнал загроз
- Attack Simulator / Симулятор атак
- Triple Encryption Display / Потрійна шифрація
- Security Actions / Дії безпеки

### 3. Data Analytics / Аналітика даних

- Real-time sensor charts / Графіки сенсорів в реальному часі
- Historical data / Історичні дані
- Anomaly detection / Виявлення аномалій
- Sensor status indicators / Індикатори статусу сенсорів

### 4. AI Chat / AI Чат

- Chat with Leafy AI / Чат з Leafy AI
- 12 response templates per language / 12 шаблонів відповідей на мову
- Daily message limits (Free/Pro) / Денні ліміти повідомлень
- Plant health analysis / Аналіз здоров'я рослин

### 5. Tasks & Quests / Завдання та квести

- Daily quests with rewards / Щоденні квести з нагородами
- XP and coin system / Система XP та монет
- Active quest timer / Таймер активного квесту
- Achievement tracking / Відстеження досягнень

### 6. Shop / Магазин

- Plant accessories / Аксесуари для рослин
- Pro Plan subscription / Підписка Pro Plan
- Token packages / Пакети токенів
- Leafy customization / Кастомізація Leafy

### 7. Settings / Налаштування

- Language selection (UK/EN/RO/ES) / Вибір мови
- Theme (Dark/Light) / Тема
- Sound settings / Налаштування звуку
- Privacy & Security / Приватність та безпека

---

## Security System

## Система безпеки

### Zero-Trust Architecture / Архітектура Zero-Trust

```
                    Zero-Trust Verification Steps
                    Кроки верифікації Zero-Trust
                    
    ┌─────────────────────────────────────────────────────────────┐
    │                                                             │
    │   Step 1: Identity Verification / Верифікація ідентичності  │
    │   ├── JWT Token validation / Перевірка JWT токена           │
    │   ├── Device fingerprint / Відбиток пристрою                │
    │   └── Session verification / Перевірка сесії                │
    │                                                             │
    │   Step 2: Request Validation / Валідація запиту             │
    │   ├── Input sanitization / Очищення вхідних даних           │
    │   ├── SQL injection check / Перевірка SQL ін'єкцій          │
    │   └── XSS prevention / Запобігання XSS                      │
    │                                                             │
    │   Step 3: Rate Limiting / Обмеження швидкості               │
    │   ├── Per-IP limits / Ліміти на IP                          │
    │   ├── Per-user limits / Ліміти на користувача               │
    │   └── Endpoint-specific limits / Ліміти ендпоінтів          │
    │                                                             │
    │   Step 4: Behavioral Analysis / Поведінковий аналіз         │
    │   ├── Command sequence check / Перевірка послідовності      │
    │   ├── Time-based analysis / Часовий аналіз                  │
    │   └── Pattern matching / Зіставлення патернів               │
    │                                                             │
    │   Step 5: Data Integrity / Цілісність даних                 │
    │   ├── Checksum verification / Перевірка контрольної суми    │
    │   ├── Range validation / Валідація діапазону                │
    │   └── Anomaly detection / Виявлення аномалій                │
    │                                                             │
    │   Step 6: Encryption Check / Перевірка шифрування           │
    │   ├── TLS 1.3 verification / Перевірка TLS 1.3              │
    │   ├── Certificate validation / Валідація сертифіката        │
    │   └── Key rotation check / Перевірка ротації клю��ів         │
    │                                                             │
    │   Step 7: Audit Logging / Журналювання аудиту               │
    │   ├── Request logging / Логування запитів                   │
    │   ├── Response logging / Логування відповідей               │
    │   └── Event correlation / Кореляція подій                   │
    │                                                             │
    └─────────────────────────────────────────────────────────────┘
```

### IDS (Intrusion Detection System / Система виявлення вторгнень)

Based on **fsocity** and **kraken** security frameworks.

Базується на фреймворках безпеки **fsocity** та **kraken**.

Features / Можливості:
- Real-time anomaly detection / Виявлення аномалій в реальному часі
- ML-based threat prediction / ML прогнозування загроз
- Automatic quarantine / Автоматичний карантин
- False positive filtering / Фільтрація хибних спрацювань

---

## Triple Encryption

## Потрійна шифрація

Bank-grade encryption protocol / Банківський рівень шифрації:

```
┌─────────────────────────────────────────────────────────────────┐
│              TRIPLE ENCRYPTION PROTOCOL                          │
│              ПРОТОКОЛ ПОТРІЙНОЇ ШИФРАЦІЇ                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   LAYER 1: AES-256-GCM (Symmetric / Симетричне)                │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Key Size: 256 bits / Розмір ключа: 256 біт             │   │
│   │  Mode: GCM (Galois/Counter Mode)                        │   │
│   │  IV: 96 bits, randomly generated / випадковий           │   │
│   │  Auth Tag: 128 bits                                     │   │
│   │  Purpose: Data encryption / Шифрування даних            │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│                           ▼                                     │
│   LAYER 2: ChaCha20-Poly1305 (Stream / Потоковий)              │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Key Size: 256 bits / Розмір ключа: 256 біт             │   │
│   │  Nonce: 96 bits                                         │   │
│   │  Auth: Poly1305 MAC                                     │   │
│   │  Purpose: Additional encryption / Додаткове шифрування  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│                           ▼                                     │
│   LAYER 3: RSA-4096 + ECDSA P-384 (Asymmetric / Асиметричне)   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  RSA Key: 4096 bits / Ключ RSA: 4096 біт                │   │
│   │  ECDSA Curve: P-384 (secp384r1)                         │   │
│   │  Signature: SHA-384                                      │   │
│   │  Purpose: Key exchange & signing / Обмін ключами        │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   Key Rotation: Every 24 hours / Ротація ключів: кожні 24 год  │
│   TLS Version: 1.3                                              │
│   Perfect Forward Secrecy: Enabled / Увімкнено                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## GPIO Control

## Керування GPIO

### Raspberry Pi Pinout / Розпіновка Raspberry Pi

```
                    Raspberry Pi GPIO Pinout
                    Розпіновка GPIO Raspberry Pi
                    
        3V3  (1)  (2)  5V
      GPIO2  (3)  (4)  5V
      GPIO3  (5)  (6)  GND
  ►══ GPIO4  (7)  (8)  GPIO14  ◄── WATER MOTOR / МОТОР ПОЛИВУ
        GND  (9)  (10) GPIO15      (Pin 4)
     GPIO17 (11)  (12) GPIO18
  ►══GPIO27 (13)  (14) GND     ◄── UV LAMP / УФ ЛАМПА
     GPIO22 (15)  (16) GPIO23      (Pin 27)
        3V3 (17)  (18) GPIO24
     GPIO10 (19)  (20) GND
      GPIO9 (21)  (22) GPIO25
     GPIO11 (23)  (24) GPIO8
        GND (25)  (26) GPIO7
      GPIO0 (27)  (28) GPIO1
      GPIO5 (29)  (30) GND
      GPIO6 (31)  (32) GPIO12
     GPIO13 (33)  (34) GND
     GPIO19 (35)  (36) GPIO16
     GPIO26 (37)  (38) GPIO20
        GND (39)  (40) GPIO21

    Active Pins / Активні піни:
    ═══════════════════════════
    Pin 4  (GPIO4)  - Water Motor (3.3V relay) / Мотор поливу
    Pin 27 (GPIO27) - UV Lamp (3.3V relay) / УФ лампа
```

### Relay Wiring Diagram / Схема підключення реле

```
    Raspberry Pi             Relay Module              Device
    ════════════            ═════════════            ════════
    
    GPIO27 ─────────────────► IN1 ──────────────────► UV LAMP
    (UV Control)              (NO/NC/COM)              220V AC
    (Керування УФ)                                     (УФ лампа)
    
    GPIO4  ─────────────────► IN2 ──────────────────► WATER PUMP
    (Water Control)           (NO/NC/COM)              12V DC
    (Керування поливом)                                (Насос)
    
    5V     ─────────────────► VCC
    GND    ─────────────────► GND
    
    
    SAFETY NOTES / ПРИМІТКИ БЕЗПЕКИ:
    ���═══════════════════════════════
    ! Always use optocoupled relays / Використовуйте оптореле
    ! UV lamp requires proper shielding / УФ лампа потребує екранування
    ! Water pump needs check valve / Насос потребує зворотний клапан
    ! Use fuses on all circuits / Використовуйте запобіжники
```

---

## Installation

## Встановлення

### Prerequisites / Передумови

- Node.js 18+ / Python 3.11+ / Git
- Raspberry Pi 4B (for GPIO control / для керування GPIO)
- PostgreSQL 14+ (optional / опціонально)

### Windows

```powershell
# Install Chocolatey (if not installed) / Встановлення Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install dependencies / Встановлення залежностей
choco install nodejs python git -y

# Refresh environment / Оновлення середовища
refreshenv

# Clone repository / Клонування репозиторію
git clone https://github.com/smartgrow/smartgrow-secureai.git
cd smartgrow-secureai

# === FRONTEND (Next.js) ===
# Install dependencies / Встановлення залежностей
npm install

# Create .env.local / Створення .env.local
Copy-Item .env.example .env.local

# Start development server / Запуск dev сервера
npm run dev

# === BACKEND (Django) ===
# Open new terminal / Відкрийте новий термінал
cd backend

# Create virtual environment / Створення віртуального середовища
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install Python dependencies / Встановлення Python залежностей
pip install -r requirements.txt

# Create .env / Створення .env
Copy-Item .env.example .env

# Run migrations / Запуск міграцій
python manage.py migrate

# Create superuser / Створення суперюзера
python manage.py createsuperuser

# Start Django server / Запуск Django сервера
python manage.py runserver 8000
```

### macOS

```bash
# Install Homebrew (if not installed) / Встановлення Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies / Встановлення залежностей
brew install node python@3.11 git

# Clone repository / Клонування репозиторію
git clone https://github.com/smartgrow/smartgrow-secureai.git
cd smartgrow-secureai

# === FRONTEND (Next.js) ===
npm install
cp .env.example .env.local
npm run dev

# === BACKEND (Django) ===
# Open new terminal / Відкрийте новий термінал
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8000
```

### Linux (Ubuntu/Debian)

```bash
# Update system / Оновлення системи
sudo apt update && sudo apt upgrade -y

# Install dependencies / Встановлення залежностей
sudo apt install -y nodejs npm python3 python3-pip python3-venv git

# Install Node.js 18+ via NodeSource / Встановлення Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Clone repository / Клонування репозиторію
git clone https://github.com/smartgrow/smartgrow-secureai.git
cd smartgrow-secureai

# === FRONTEND (Next.js) ===
npm install
cp .env.example .env.local
npm run dev

# === BACKEND (Django) ===
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8000
```

### Raspberry Pi (Automatic Deployment)

The easiest way to deploy on Raspberry Pi is using our automated script:

```bash
# Download and run the deployment script
curl -fsSL https://raw.githubusercontent.com/smartgrow/smartgrow-secureai/main/scripts/raspberry-pi-deploy.sh | bash

# Or clone first and run locally
git clone https://github.com/smartgrow/smartgrow-secureai.git
cd smartgrow-secureai
chmod +x scripts/raspberry-pi-deploy.sh
./scripts/raspberry-pi-deploy.sh
```

**What the script does:**
1. Updates Raspberry Pi OS
2. Installs Node.js 20 LTS, Python 3, Nginx
3. Configures Django backend with Gunicorn
4. Builds Next.js frontend for production
5. Sets up Nginx reverse proxy (single domain for both)
6. Creates systemd services for auto-start
7. Configures GPIO permissions

### Raspberry Pi (Manual Installation)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y python3 python3-pip python3-venv nginx git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pnpm

# Enable GPIO
sudo raspi-config
# Navigate to: Interface Options -> I2C -> Enable
# Navigate to: Interface Options -> SPI -> Enable

# Install GPIO library
sudo apt install -y pigpio python3-pigpio
sudo systemctl enable pigpiod
sudo systemctl start pigpiod

# Clone repository
git clone https://github.com/smartgrow/smartgrow-secureai.git
cd smartgrow-secureai

# === FRONTEND ===
pnpm install
pnpm build

# === BACKEND ===
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install RPi.GPIO gpiozero pigpio
python manage.py migrate
python manage.py collectstatic --noinput

# Configure GPIO mode
# Edit .env: IOT_SIMULATION=False
# Редагувати .env: IOT_SIMULATION=False

python manage.py migrate
python manage.py runserver 0.0.0.0:8000

# === AUTOSTART (Optional) / АВТОЗАПУСК (Опціонально) ===
# Create systemd service / Створення systemd сервісу
sudo nano /etc/systemd/system/smartgrow.service
```

**Systemd service file / Файл сервісу systemd:**

```ini
[Unit]
Description=SmartGrow SecureAI Backend
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/smartgrow-secureai/backend
Environment=PATH=/home/pi/smartgrow-secureai/backend/venv/bin
ExecStart=/home/pi/smartgrow-secureai/backend/venv/bin/python manage.py runserver 0.0.0.0:8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service / Увімкнення та запуск сервісу
sudo systemctl enable smartgrow
sudo systemctl start smartgrow
sudo systemctl status smartgrow
```

---

## Build & Compilation

## Збірка та компіляція

### Development Build / Збірка для розробки

```bash
# Frontend / Фронтенд
npm run dev           # Development server / Сервер розробки
npm run lint          # Lint code / Перевірка коду
npm run type-check    # TypeScript check / Перевірка TypeScript

# Backend / Бекенд
python manage.py check          # Check configuration / Перевірка конфігурації
python manage.py test           # Run tests / Запуск тестів
python manage.py collectstatic  # Collect static files / Збір статичних файлів
```

### Production Build / Продакшн збірка

```bash
# === FRONTEND PRODUCTION BUILD ===
# Продакшн збірка фронтенду

# Build Next.js / Збірка Next.js
npm run build

# Output will be in .next/ directory / Результат буде в .next/
# Size: ~2-5MB compressed / Розмір: ~2-5MB стиснено

# Start production server / Запуск продакшн сервера
npm start

# Or export static files / Або експорт статичних файлів
npm run export  # Output in out/ directory / Результат в out/


# === BACKEND PRODUCTION BUILD ===
# Продакшн збірка бекенду

cd backend

# Collect static files / Збір статичних файлів
python manage.py collectstatic --noinput

# Run with Gunicorn / Запуск з Gunicorn
pip install gunicorn
gunicorn smartgrow.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 4 \
    --threads 2 \
    --timeout 120 \
    --access-logfile /var/log/smartgrow/access.log \
    --error-logfile /var/log/smartgrow/error.log
```

### Nginx Configuration / Конфігурація Nginx

```nginx
# /etc/nginx/sites-available/smartgrow
# Конфігурація Nginx для SmartGrow

upstream django {
    server 127.0.0.1:8000;
}

upstream nextjs {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    listen [::]:80;
    server_name smartgrow.local;

    # Redirect to HTTPS / Перенаправлення на HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name smartgrow.local;

    # SSL Configuration / Конфігурація SSL
    ssl_certificate /etc/ssl/certs/smartgrow.crt;
    ssl_certificate_key /etc/ssl/private/smartgrow.key;
    ssl_protocols TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers on;

    # Security Headers / Заголовки безпеки
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # API Routes / API маршрути
    location /api/ {
        proxy_pass http://django;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django Admin / Адмінка Django
    location /admin/ {
        proxy_pass http://django;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Django Static Files / Статичні файли Django
    location /static/ {
        alias /home/pi/smartgrow-secureai/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Next.js Frontend / Next.js фронтенд
    location / {
        proxy_pass http://nextjs;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## Local Domain Setup (Raspberry Pi)

To access your SmartGrow system via `smartgrow.local` instead of IP address:

### Option 1: Automatic (mDNS/Avahi)

```bash
# Run the domain setup script
chmod +x scripts/setup-local-domain.sh
./scripts/setup-local-domain.sh
```

After running, access via: `http://raspberrypi.local` or `http://smartgrow.local`

### Option 2: Manual hosts file (on client devices)

**Windows** (Run Notepad as Administrator):
```
C:\Windows\System32\drivers\etc\hosts
```
Add line:
```
192.168.X.X    smartgrow.local
```

**macOS / Linux**:
```bash
sudo nano /etc/hosts
# Add line:
192.168.X.X    smartgrow.local
```

**Replace `192.168.X.X` with your Raspberry Pi IP address** (find with `hostname -I`)

### Option 3: Router DNS (for entire network)

1. Login to your router admin panel
2. Find DNS or DHCP settings
3. Add static DNS entry: `smartgrow.local` -> `[Pi IP Address]`

### SSL Certificate (Optional)

For public domains with HTTPS:
```bash
sudo certbot --nginx -d yourdomain.com -m your@email.com --agree-tos
```

---

## Docker Deployment

## Docker розгортання

### docker-compose.yml

```yaml
version: '3.9'

services:
  # PostgreSQL Database / База даних PostgreSQL
  db:
    image: postgres:15-alpine
    container_name: smartgrow-db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: smartgrow
      POSTGRES_USER: smartgrow
      POSTGRES_PASSWORD: ${DB_PASSWORD:-securepassword123}
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U smartgrow"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache / Redis кеш
  redis:
    image: redis:7-alpine
    container_name: smartgrow-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

  # Django Backend / Django бекенд
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: smartgrow-backend
    volumes:
      - ./backend:/app
      - static_volume:/app/staticfiles
    environment:
      - DEBUG=False
      - DATABASE_URL=postgres://smartgrow:${DB_PASSWORD:-securepassword123}@db:5432/smartgrow
      - REDIS_URL=redis://redis:6379/0
      - SECRET_KEY=${SECRET_KEY:-your-secret-key-here}
      - IOT_SIMULATION=True
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    ports:
      - "8000:8000"
    command: >
      sh -c "python manage.py migrate &&
             python manage.py collectstatic --noinput &&
             gunicorn smartgrow.wsgi:application --bind 0.0.0.0:8000 --workers 4"

  # Next.js Frontend / Next.js фронтенд
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: smartgrow-frontend
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
      - NODE_ENV=production
    depends_on:
      - backend
    ports:
      - "3000:3000"

  # Nginx Reverse Proxy / Nginx проксі
  nginx:
    image: nginx:alpine
    container_name: smartgrow-nginx
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - static_volume:/var/www/static
      - ./ssl:/etc/ssl/certs
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
  redis_data:
  static_volume:
```

### Docker Commands / Docker команди

```bash
# Build and start / Збірка та запуск
docker-compose up -d --build

# View logs / Перегляд логів
docker-compose logs -f

# Stop containers / Зупинка контейнерів
docker-compose down

# Clean up / Очищення
docker-compose down -v --rmi all

# Enter container / Вхід в контейнер
docker exec -it smartgrow-backend bash
docker exec -it smartgrow-frontend sh

# Database backup / Резервна копія БД
docker exec smartgrow-db pg_dump -U smartgrow smartgrow > backup.sql

# Restore database / Відновлення БД
docker exec -i smartgrow-db psql -U smartgrow smartgrow < backup.sql
```

---

## API Documentation

## API документація

### Base URL

```
Development: http://localhost:8000/api/v1/
Production: https://your-domain.com/api/v1/
```

### Authentication / Аутентифікація

```bash
# Get JWT Token / Отримання JWT токена
POST /api/v1/auth/token/
Content-Type: application/json

{
    "username": "grower",
    "password": "securepassword"
}

# Response / Відповідь
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}

# Use token in requests / Використання токена в запитах
Authorization: Bearer <access_token>
```

### Endpoints

#### Plant / Рослина

```bash
# Get plant status / Отримати статус рослини
GET /api/v1/plant/
Authorization: Bearer <token>

# Response / Відповідь
{
    "id": 1,
    "name": "Leafy",
    "level": 12,
    "xp": 1250,
    "health": 92,
    "mood": "happy",
    "trust_score": 94,
    "is_quarantined": false
}

# Update plant / Оновити рослину
PATCH /api/v1/plant/
{
    "name": "My Leafy"
}
```

#### Sensors / Сенсори

```bash
# Get current sensor data / Отримати поточні дані сенсорів
GET /api/v1/sensors/
Authorization: Bearer <token>

# Response / Відповідь
{
    "temperature": 22.4,
    "humidity": 65,
    "soil_moisture": 48,
    "ph_level": 6.2,
    "ec_level": 1.8,
    "npk": "120-45-60",
    "timestamp": "2026-01-15T10:30:00Z"
}

# Get sensor history / Отримати історію сенсорів
GET /api/v1/sensors/history/?hours=24
```

#### IoT Control / IoT керування

```bash
# Control UV lamp / Керування УФ лампою
POST /api/v1/iot/uv/
Authorization: Bearer <token>
{
    "action": "on",  # or "off" / або "off"
    "duration": 3600  # seconds (optional) / секунди (опціонально)
}

# Response / Відповідь
{
    "success": true,
    "pin": 27,
    "state": "on",
    "message": "UV lamp activated / УФ лампу активовано"
}

# Control water motor / Керування мотором поливу
POST /api/v1/iot/water/
Authorization: Bearer <token>
{
    "action": "on",
    "duration": 60
}

# Response / Відповідь
{
    "success": true,
    "pin": 4,
    "state": "on",
    "message": "Water motor started / Мотор поливу запущено"
}

# Get GPIO status / Отримати статус GPIO
GET /api/v1/iot/status/
```

#### Security / Безпека

```bash
# Get security status / Отримати статус безпеки
GET /api/v1/security/status/
Authorization: Bearer <token>

# Response / Відповідь
{
    "trust_score": 94,
    "threat_level": "low",
    "devices_online": 5,
    "devices_total": 5,
    "last_scan": "2026-01-15T10:28:00Z",
    "is_quarantined": false
}

# Get threat log / Отримати журнал загроз
GET /api/v1/security/threats/?limit=10

# Trigger security scan / Запустити сканування безпеки
POST /api/v1/security/scan/
```

---

## Project Structure

## Структура проекту

```
smartgrow-secureai/
│
├── app/                          # Next.js App Router
│   ├── (dashboard)/              # Dashboard routes / Маршрути панелі
│   │   ├── plant/page.tsx        # Plant page / Сторінка рослини
│   │   ├── security/page.tsx     # Security page / Сторінка безпеки
│   │   ├── data/page.tsx         # Data page / Сторінка даних
│   │   ├── ai-chat/page.tsx      # AI Chat page / Сторінка AI чату
│   │   ├── tasks/page.tsx        # Tasks page / Сторінка завдань
│   │   ├── shop/page.tsx         # Shop page / Сторінка магазину
│   │   ├── settings/page.tsx     # Settings page / Сторінка налаштувань
│   │   └── layout.tsx            # Dashboard layout / Макет панелі
│   ├── api/                      # API Routes / API маршрути
│   │   └── smartgrow/route.ts    # Main API route / Головний API маршрут
│   ├── layout.tsx                # Root layout / Кореневий макет
│   ├── page.tsx                  # Home redirect / Перенаправлення
│   └── globals.css               # Global styles / Глобальні стилі
│
├── components/                   # React components / React компоненти
│   ├── icons/                    # Custom SVG icons / Кастомні SVG іконки
│   │   └── SmartGrowIcons.tsx    # Icon components / Компоненти іконок
│   ├── layout/                   # Layout components / Компоненти макету
│   │   ├── Sidebar.tsx           # Sidebar navigation / Бічна навігація
│   │   ├── BottomNav.tsx         # Mobile navigation / Мобільна навігація
│   │   ├── TopBar.tsx            # Top bar / Верхня панель
│   │   └── ParticleCanvas.tsx    # Background particles / Фонові частинки
│   ├── plant/                    # Plant components / Компоненти рослини
│   │   ├── LeafyCharacter.tsx    # Leafy AI character / Leafy AI персонаж
│   │   ├── PlantStats.tsx        # Plant statistics / Статистика рослини
│   │   ├── QuickActions.tsx      # Quick action buttons / Кнопки швидких дій
│   │   ├── EnvironmentCard.tsx   # Environment data / Дані середовища
│   │   └── SpeechBubble.tsx      # Leafy speech / Мовлення Leafy
│   ├── security/                 # Security components / Компоненти безпеки
│   │   ├── TrustScoreRing.tsx    # Trust score ring / Кільце довіри
│   │   ├── SecurityEventLog.tsx  # Event log / Журнал подій
│   │   ├── AttackSimulator.tsx   # Attack simulator / Симулятор атак
│   │   └── TripleEncryption.tsx  # Encryption display / Відображення шифрації
│   └── ui/                       # UI primitives / UI примітиви
│       └── ...                   # shadcn/ui components / shadcn/ui компоненти
│
├── lib/                          # Utilities / Утиліти
│   ├── i18n.ts                   # Translations (4 langs) / Переклади (4 мови)
│   ├── store.ts                  # Zustand store / Zustand сховище
│   ├── types.ts                  # TypeScript types / TypeScript типи
│   ├── mockData.ts               # Mock data / Тестові дані
│   ├── sounds.ts                 # Sound system / Система звуків
│   └── utils.ts                  # Utilities / Утиліти
│
├── public/                       # Static files / Статичні файли
│   ├── icons/                    # App icons / Іконки додатку
│   ├── leafy/                    # Leafy character SVGs / SVG персонажа Leafy
│   ├── shop/                     # Shop item images / Зображення товарів
│   └── backgrounds/              # Background images / Фонові зображення
│
├── backend/                      # Django Backend / Django бекенд
│   ├── smartgrow/                # Project config / Конфігурація проекту
│   │   ├── settings.py           # Django settings / Налаштування Django
│   │   ├── urls.py               # Main URLs / Головні URL
│   │   └── wsgi.py               # WSGI config / WSGI конфігурація
│   ├── api/                      # API app / API застосунок
│   │   ├── models.py             # Database models / Моделі бази даних
│   │   ├── serializers.py        # DRF serializers / DRF серіалізатори
│   │   ├── views.py              # API views / API в'юхи
│   │   └── urls.py               # API URLs / API URL
│   ├── iot/                      # IoT app / IoT застосунок
│   │   ├── gpio_controller.py    # GPIO controller / GPIO контролер
│   │   ├── views.py              # IoT views / IoT в'юхи
│   │   └── urls.py               # IoT URLs / IoT URL
│   ├── security/                 # Security app / Застосунок безпеки
│   │   ├── ids.py                # IDS system / Система IDS
│   │   ├── crypto.py             # Triple encryption / Потрійна шифрація
│   │   ├── middleware.py         # Security middleware / Middleware безпеки
│   │   ├── views.py              # Security views / В'юхи безпеки
│   │   └── urls.py               # Security URLs / URL безпеки
│   ├── requirements.txt          # Python dependencies / Python залежності
│   └── manage.py                 # Django CLI / Django CLI
│
├── docker-compose.yml            # Docker Compose / Docker Compose
├── Dockerfile                    # Frontend Dockerfile / Dockerfile фронтенду
├── nginx.conf                    # Nginx config / Конфігурація Nginx
├── package.json                  # Node dependencies / Node залежності
├── tsconfig.json                 # TypeScript config / Конфігурація TypeScript
├── tailwind.config.ts            # Tailwind config / Конфігурація Tailwind
└── README.md                     # Documentation / Документація
```

---

## Technologies

## Технології

### Frontend / Фронтенд

| Technology | Version | Purpose | Призначення |
|------------|---------|---------|-------------|
| Next.js | 16 | React Framework | React фреймворк |
| React | 19 | UI Library | UI бібліотека |
| TypeScript | 5.0 | Type Safety | Типізація |
| Tailwind CSS | 4.0 | Styling | Стилізація |
| Framer Motion | 11 | Animations | Анімації |
| Zustand | 5 | State Management | Керування станом |
| Recharts | 2.12 | Charts | Графіки |
| SWR | 2.2 | Data Fetching | Отримання даних |

### Backend / Бекенд

| Technology | Version | Purpose | Призначення |
|------------|---------|---------|-------------|
| Django | 5.0 | Web Framework | Веб фреймворк |
| Django REST | 3.15 | REST API | REST API |
| PostgreSQL | 15 | Database | База даних |
| Redis | 7 | Cache | Кеш |
| Celery | 5.3 | Task Queue | Черга задач |
| RPi.GPIO | 0.7.1 | GPIO Control | Керування GPIO |

### Security / Безпека

| Technology | Purpose | Призначення |
|------------|---------|-------------|
| JWT | Authentication | Аутентифікація |
| AES-256-GCM | Layer 1 Encryption | Шифрування рівень 1 |
| ChaCha20-Poly1305 | Layer 2 Encryption | Шифрування рівень 2 |
| RSA-4096 | Layer 3 Key Exchange | Обмін ключами рівень 3 |
| ECDSA P-384 | Digital Signatures | Цифрові підписи |
| TLS 1.3 | Transport Security | Безпека транспорту |

---

## Team

## Команда

**SmartGrow AI Team**

Project developed for Infomatrix 2026 Hackathon.

Проект розроблено для хакатону Infomatrix 2026.

---

## License

## Ліцензія

This project is protected under **Ukrainian Law No. 2811-IX** "On Copyright and Related Rights".

Цей проект захищено **Законом України №2811-IX** "Про авторське право і суміжні права".

```
Copyright (c) 2026 SmartGrow AI Team
Авторське право (c) 2026 SmartGrow AI Team

All rights reserved. Unauthorized copying, modification, distribution,
or use of this software is strictly prohibited.

Всі права захищено. Несанкціоноване копіювання, модифікація, розповсюдження
або використання цього програмного забезпечення суворо заборонено.

For licensing inquiries: legal@smartgrow.ai
Щодо ліцензування: legal@smartgrow.ai
```

---

---

# УКРАЇНСЬКА

## Короткий опис

**SmartGrow SecureAI** - інноваційна платформа для захисту розумних підземних теплиць від кібератак.

> **Примітка:** Основна документація написана англійською мовою згідно з правилами конкурсу Infomatrix 2026. Нижче наведено короткий опис українською.

### Ключові особливості

| Функція | Опис |
|---------|------|
| **Leafy AI** | Аніме-персонаж рослини з 6 настроями та анімаціями |
| **Zero-Trust** | Архітектура "Ніколи не довіряй, завжди перевіряй" |
| **Потрійна шифрація** | Банківський рівень: AES-256 + ChaCha20 + RSA-4096 |
| **IDS** | Система виявлення вторгнень у реальному часі |
| **GPIO** | Пряме керування Raspberry Pi (UV лампа пін 27, полив пін 4) |
| **4 мови** | Українська, Англійська, Румунська, Іспанська |

### Проблема

В Україні розумні підземні теплиці зазнають значних кібератак, що призводить до втрати врожаю до 40%.

### Типи атак

| Атака | Опис | Вплив |
|-------|------|-------|
| **Data Poisoning** | Фальсифікація даних сенсорів | 35% втрата врожаю |
| **Sensor Spoofing** | Підміна реальних значень | Пошкодження обладнання |
| **Gradual Drift** | Повільна зміна параметрів | Непомітні пошкодження |
| **Command Injection** | Несанкціоновані GPIO команди | Фізичні пошкодження |

### Рішення

SmartGrow SecureAI пропонує комплексний захист з дружнім інтерфейсом та персонажем **Leafy** - AI-рослиною в аніме стилі.

### 7 сторінок функціоналу

1. **Plant Dashboard** - Моніторинг рослини, швидкі дії
2. **Security Center** - Trust Score, журнал загроз, симулятор атак
3. **Data Analytics** - Графіки сенсорів у реальному часі
4. **AI Chat** - Чат з Leafy AI
5. **Tasks & Quests** - Щоденні завдання з нагородами
6. **Shop** - Аксесуари для рослин та Pro підписка
7. **Settings** - Мова, тема, звук, конфіденційність

### Система безпеки Zero-Trust

7 кроків перевірки для кожного запиту:
1. Верифікація ідентичності
2. Валідація запиту
3. Rate Limiting
4. Поведінковий аналіз
5. Цілісність даних
6. Перевірка шифрування
7. Аудит логування

### Потрійна шифрація (банківський рівень)

- **Рівень 1**: AES-256-GCM (симетричне)
- **Рівень 2**: ChaCha20-Poly1305 (потокове)
- **Рівень 3**: RSA-4096 + ECDSA P-384 (асиметричне)

### GPIO керування

```
Raspberry Pi GPIO Pinout:
┌─────────────────────────────────────┐
│  3.3V [1]  [2] 5V                   │
│  GPIO2[3]  [4] 5V     ← МОТОР ПОЛИВУ│
│  GPIO3[5]  [6] GND                  │
│  GPIO4[7]  [8] GPIO14               │
│   GND [9]  [10] GPIO15              │
│ GPIO17[11] [12] GPIO18              │
│ GPIO27[13] [14] GND    ← UV ЛАМПА   │
└─────────────────────────────────────┘

Пін 27 - Ультрафіолетова лампа (реле)
Пін 4  - Мотор/насос ��ля поливу (реле)
```

### Швидкий старт

```bash
# Клонування
git clone https://github.com/smartgrow/smartgrow-secureai.git
cd smartgrow-secureai

# Frontend (Next.js)
pnpm install && pnpm dev

# Backend (Django)
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

### Ліцензія

Захищено Законом України №2811-IX "Про авторське право та суміжні права".

> **Детальна документація:** Див. англійську версію вище для повної технічної документації, включаючи архітектуру, API, структуру проекту та інструкції для різних ОС.

---

---

# ROMANA

## Cuprins

1. [Despre Proiect](#despre-proiect)
2. [Problema](#problema-pe-care-o-rezolvam)
3. [Solutia](#solutia-noastra)
4. [Arhitectura](#arhitectura-sistemului)
5. [Caracteristici](#caracteristici-principale-7-pagini)
6. [Securitate](#sistemul-de-securitate)
7. [Instalare](#instalare-ro)
8. [Tehnologii](#tehnologii-ro)
9. [Licenta](#licenta-ro)

---

## Despre Proiect

**SmartGrow SecureAI** este o platforma inovatoare pentru protejarea serelor inteligente subterane impotriva atacurilor cibernetice. Sistemul utilizeaza arhitectura Zero-Trust si analiza comportamentala pentru detectarea si prevenirea amenintarilor in timp real.

### Caracteristici Cheie

| Caracteristica | Descriere |
|---------------|-----------|
| **Leafy AI** | Personaj AI de planta cu 6 stari de dispozitie si animatii |
| **Zero-Trust** | Arhitectura "Nu incredeti niciodata, verificati intotdeauna" |
| **Criptare Tripla** | Nivel bancar: AES-256 + ChaCha20 + RSA-4096 |
| **IDS** | Sistem de detectare a intruziunilor in timp real |
| **GPIO** | Control direct Raspberry Pi (lampa UV, irigare) |
| **4 Limbi** | Ucraineana, Engleza, Romana, Spaniola |

---

## Problema pe care o Rezolvam

In Ucraina, serele inteligente subterane se confrunta cu atacuri cibernetice semnificative, rezultand in pierderi de recolte de pana la 40%.

### Tipuri de Atacuri

| Atac | Descriere | Impact |
|------|-----------|--------|
| **Data Poisoning** | Falsificarea datelor senzorilor | 35% pierdere recolte |
| **Sensor Spoofing** | Inlocuirea valorilor reale | Daune echipamente |
| **Gradual Drift** | Modificari lente ale parametrilor | Daune nedetectate |
| **Command Injection** | Comenzi GPIO neautorizate | Daune fizice |

---

## Solutia Noastra

SmartGrow SecureAI ofera protectie completa cu o interfata prietenoasa, avand **Leafy** - un personaj AI de planta in stil anime.

---

## Arhitectura Sistemului

Vezi diagrama detaliata in sectiunea engleza de mai sus.

---

## Caracteristici Principale (7 Pagini)

1. **Plant Dashboard** - Monitorizare planta si actiuni rapide
2. **Security Center** - Scor de incredere, jurnal amenintari, simulator atacuri
3. **Data Analytics** - Grafice senzori in timp real
4. **AI Chat** - Chat cu Leafy AI
5. **Tasks & Quests** - Misiuni zilnice cu recompense
6. **Shop** - Accesorii plante si abonament Pro
7. **Settings** - Limba, tema, sunet, confidentialitate

---

## Sistemul de Securitate

### Arhitectura Zero-Trust

7 pasi de verificare pentru fiecare cerere:
1. Verificarea identitatii
2. Validarea cererii
3. Limitarea ratei
4. Analiza comportamentala
5. Integritatea datelor
6. Verificarea criptarii
7. Jurnalizarea auditului

### Criptare Tripla

- **Nivel 1**: AES-256-GCM (simetric)
- **Nivel 2**: ChaCha20-Poly1305 (flux)
- **Nivel 3**: RSA-4096 + ECDSA P-384 (asimetric)

---

## Instalare (RO)

```bash
# Clonare repository
git clone https://github.com/smartgrow/smartgrow-secureai.git
cd smartgrow-secureai

# Frontend
npm install
npm run dev

# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

---

## Tehnologii (RO)

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Django 5.0, PostgreSQL, Redis
- **Securitate**: JWT, AES-256, ChaCha20, RSA-4096, TLS 1.3
- **IoT**: Raspberry Pi 4B, GPIO

---

## Licenta (RO)

Acest proiect este protejat de **Legea Ucrainei nr. 2811-IX** privind drepturile de autor.

---

---

# ESPANOL

## Tabla de Contenidos

1. [Sobre el Proyecto](#sobre-el-proyecto)
2. [El Problema](#el-problema-que-resolvemos)
3. [La Solucion](#nuestra-solucion)
4. [Arquitectura](#arquitectura-del-sistema)
5. [Caracteristicas](#caracteristicas-principales-7-paginas)
6. [Seguridad](#sistema-de-seguridad)
7. [Instalacion](#instalacion-es)
8. [Tecnologias](#tecnologias-es)
9. [Licencia](#licencia-es)

---

## Sobre el Proyecto

**SmartGrow SecureAI** es una plataforma innovadora para proteger invernaderos inteligentes subterraneos de ciberataques. El sistema utiliza arquitectura Zero-Trust y analisis comportamental para detectar y prevenir amenazas en tiempo real.

### Caracteristicas Clave

| Caracteristica | Descripcion |
|---------------|-------------|
| **Leafy AI** | Personaje AI de planta con 6 estados de animo y animaciones |
| **Zero-Trust** | Arquitectura "Nunca confies, siempre verifica" |
| **Cifrado Triple** | Nivel bancario: AES-256 + ChaCha20 + RSA-4096 |
| **IDS** | Sistema de deteccion de intrusiones en tiempo real |
| **GPIO** | Control directo de Raspberry Pi (lampara UV, riego) |
| **4 Idiomas** | Ucraniano, Ingles, Rumano, Espanol |

---

## El Problema que Resolvemos

En Ucrania, los invernaderos inteligentes subterraneos enfrentan ciberataques significativos, resultando en perdidas de cosechas de hasta el 40%.

### Tipos de Ataques

| Ataque | Descripcion | Impacto |
|--------|-------------|---------|
| **Data Poisoning** | Falsificacion de datos de sensores | 35% perdida de cosecha |
| **Sensor Spoofing** | Reemplazo de valores reales | Danos al equipo |
| **Gradual Drift** | Cambios lentos de parametros | Danos no detectados |
| **Command Injection** | Comandos GPIO no autorizados | Danos fisicos |

---

## Nuestra Solucion

SmartGrow SecureAI ofrece proteccion integral con una interfaz amigable con **Leafy** - un personaje AI de planta estilo anime.

---

## Arquitectura del Sistema

Ver diagrama detallado en la seccion de ingles arriba.

---

## Caracteristicas Principales (7 Paginas)

1. **Panel de Planta** - Monitoreo de planta y acciones rapidas
2. **Centro de Seguridad** - Puntuacion de confianza, registro de amenazas, simulador de ataques
3. **Analiticas de Datos** - Graficos de sensores en tiempo real
4. **Chat AI** - Chat con Leafy AI
5. **Tareas y Misiones** - Misiones diarias con recompensas
6. **Tienda** - Accesorios de plantas y suscripcion Pro
7. **Configuracion** - Idioma, tema, sonido, privacidad

---

## Sistema de Seguridad

### Arquitectura Zero-Trust

7 pasos de verificacion para cada solicitud:
1. Verificacion de identidad
2. Validacion de solicitud
3. Limitacion de tasa
4. Analisis comportamental
5. Integridad de datos
6. Verificacion de cifrado
7. Registro de auditoria

### Cifrado Triple

- **Capa 1**: AES-256-GCM (simetrico)
- **Capa 2**: ChaCha20-Poly1305 (flujo)
- **Capa 3**: RSA-4096 + ECDSA P-384 (asimetrico)

---

## Instalacion (ES)

```bash
# Clonar repositorio
git clone https://github.com/smartgrow/smartgrow-secureai.git
cd smartgrow-secureai

# Frontend
npm install
npm run dev

# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

---

## Tecnologias (ES)

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Django 5.0, PostgreSQL, Redis
- **Seguridad**: JWT, AES-256, ChaCha20, RSA-4096, TLS 1.3
- **IoT**: Raspberry Pi 4B, GPIO

---

## Licencia (ES)

Este proyecto esta protegido bajo la **Ley de Ucrania No. 2811-IX** sobre derechos de autor.

---

<div align="center">

**SmartGrow SecureAI** - Protecting Smart Greenhouses from Cyberattacks

*Made with love for Infomatrix 2026*

</div>
