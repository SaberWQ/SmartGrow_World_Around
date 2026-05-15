/**
 * ============================================
 * SmartGrow SecureAI - Next.js API Route Handler
 * ============================================
 * 
 * Цей файл служить проксі між Next.js фронтендом та Django бекендом.
 * В режимі розробки використовує mock дані.
 * В продакшні перенаправляє запити до Django API.
 * 
 * (c) 2026 SmartGrow AI Team. Всі права захищено.
 * Захищено законом України №2811-IX
 * 
 * ============================================
 * GPIO ПІНИ:
 * - Пін 27: UV лампа (ультрафіолет)
 * - Пін 24: Мотор поливу (водяний насос)
 * ============================================
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  initialPlantState, 
  initialSensors, 
  initialSecurityEvents,
  generateSensorHistory 
} from '@/lib/mockData'

// ============================================
// КОНФІГУРАЦІЯ
// ============================================

// URL Django бекенду (встановіть в .env.local)
const DJANGO_API_URL = process.env.DJANGO_API_URL || 'http://localhost:8000/api/v1'

// Режим розробки (використовує mock дані)
const USE_MOCK = process.env.USE_MOCK_API === 'true' || !process.env.DJANGO_API_URL

// ============================================
// СИМУЛЬОВАНИЙ СТАН (для режиму розробки)
// ============================================

// Стан рослини
let plantState = { ...initialPlantState }

// Дані сенсорів
let sensors = [...initialSensors]

// Історія подій безпеки
let securityEvents = [...initialSecurityEvents]

// Trust Score (Zero-Trust система)
let trustScore = 94

// Статус карантину
let isQuarantined = false

// Стан GPIO пристроїв
let deviceStates = {
  // Пін 27 - UV лампа
  uv_light: {
    pin: 27,
    state: 'off' as 'on' | 'off',
    autoOffAt: null as string | null,
  },
  // Пін 24 - Мотор поливу
  water_motor: {
    pin: 4,
    state: 'off' as 'on' | 'off',
    autoOffAt: null as string | null,
  },
}

// ============================================
// ЗАГОЛОВКИ БЕЗПЕКИ (Zero-Trust)
// ============================================

const securityHeaders = {
  // Захист від MIME-type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Заборона вбудовування в iframe (захист від clickjacking)
  'X-Frame-Options': 'DENY',
  
  // Захист від XSS атак
  'X-XSS-Protection': '1; mode=block',
  
  // Примусове HTTPS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  
  // Content Security Policy
  'Content-Security-Policy': "default-src 'self'",
}

// ============================================
// GET ЗАПИТИ
// ============================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get('endpoint')

  // Якщо не в режимі mock - проксі до Django
  if (!USE_MOCK) {
    try {
      const response = await fetch(`${DJANGO_API_URL}/${endpoint}/`, {
        headers: {
          'Authorization': request.headers.get('Authorization') || '',
        },
      })
      const data = await response.json()
      return NextResponse.json(data, { headers: securityHeaders })
    } catch (error) {
      console.error('[v0] Django API error:', error)
      // Fallback to mock data
    }
  }

  // Mock режим - повертаємо симульовані дані
  switch (endpoint) {
    // ============================================
    // ДАНІ РОСЛИНИ
    // ============================================
    case 'plant':
      return NextResponse.json({
        success: true,
        data: {
          ...plantState,
          trustScore,
          isQuarantined,
        },
        timestamp: new Date().toISOString(),
      }, { headers: securityHeaders })

    // ============================================
    // ДАНІ СЕНСОРІВ
    // ============================================
    case 'sensors':
      return NextResponse.json({
        success: true,
        data: sensors,
        timestamp: new Date().toISOString(),
      }, { headers: securityHeaders })

    // Історія показників сенсорів (для графіків)
    case 'sensors/history':
      return NextResponse.json({
        success: true,
        data: generateSensorHistory(),
        timestamp: new Date().toISOString(),
      }, { headers: securityHeaders })

    // ============================================
    // ПОДІЇ БЕЗПЕКИ
    // ============================================
    case 'security/events':
      return NextResponse.json({
        success: true,
        data: securityEvents,
        timestamp: new Date().toISOString(),
      }, { headers: securityHeaders })

    // Статус безпеки системи
    case 'security/status':
      return NextResponse.json({
        success: true,
        data: {
          trustScore,
          isQuarantined,
          devicesOnline: 5,
          devicesTotal: 5,
          // Рівень загрози на основі Trust Score
          threatLevel: trustScore >= 70 ? 'low' : trustScore >= 40 ? 'medium' : 'critical',
          lastScan: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          nextScan: new Date(Date.now() + 58 * 1000).toISOString(),
        },
        timestamp: new Date().toISOString(),
      }, { headers: securityHeaders })

    // ============================================
    // СТАТУС IoT ПРИСТРОЇВ (GPIO)
    // ============================================
    case 'iot/status':
      return NextResponse.json({
        success: true,
        simulation_mode: true,
        gpio_initialized: true,
        timestamp: new Date().toISOString(),
        devices: deviceStates,
        // Документація по пінах
        pin_mapping: {
          uv_light: {
            pin: 27,
            description: 'Ультрафіолетова лампа для дезинфекції та стимуляції росту',
            max_duration: 3600, // 1 година
          },
          water_motor: {
            pin: 4,
            description: 'Мотор/насос для автоматичного поливу',
            max_duration: 300, // 5 хвилин
          },
        },
      }, { headers: securityHeaders })

    default:
      return NextResponse.json({
        success: false,
        error: 'Unknown endpoint',
        message: `Endpoint "${endpoint}" не знайдено`,
      }, { status: 404, headers: securityHeaders })
  }
}

// ============================================
// POST ЗАПИТИ
// ============================================

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const body = await request.json().catch(() => ({}))

  // Якщо не в режимі mock - проксі до Django
  if (!USE_MOCK) {
    try {
      const response = await fetch(`${DJANGO_API_URL}/${action}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': request.headers.get('Authorization') || '',
        },
        body: JSON.stringify(body),
      })
      const data = await response.json()
      return NextResponse.json(data, { headers: securityHeaders })
    } catch (error) {
      console.error('[v0] Django API error:', error)
      // Fallback to mock
    }
  }

  // Mock режим
  switch (action) {
    // ============================================
    // ПОЛИВ РОСЛИНИ
    // ============================================
    case 'water':
      // Оновлюємо здоров'я рослини
      plantState.health = Math.min(100, plantState.health + 5)
      
      // Симулюємо увімкнення мотора на 2 хвилини
      const waterAutoOff = new Date(Date.now() + 120 * 1000)
      deviceStates.water_motor = {
        ...deviceStates.water_motor,
        state: 'on',
        autoOffAt: waterAutoOff.toISOString(),
      }
      
      console.log('[v0] 💧 Полив активовано (Пін 24)')
      
      return NextResponse.json({
        success: true,
        message: 'Рослину полито успішно',
        data: {
          plant: plantState,
          device: {
            name: 'water_motor',
            pin: 4,
            state: 'on',
            duration: 120,
            autoOffAt: waterAutoOff.toISOString(),
          },
        },
      }, { headers: securityHeaders })

    // ============================================
    // КЕРУВАННЯ UV ЛАМПОЮ (ПІН 27)
    // ============================================
    case 'iot/uv/on':
      const uvDuration = body.duration || 1800 // 30 хв за замовчуванням
      const uvAutoOff = new Date(Date.now() + uvDuration * 1000)
      
      deviceStates.uv_light = {
        ...deviceStates.uv_light,
        state: 'on',
        autoOffAt: uvAutoOff.toISOString(),
      }
      
      console.log(`[v0] 💡 UV лампа УВІМКНЕНА (Пін 27) на ${uvDuration} сек`)
      
      return NextResponse.json({
        success: true,
        device: 'uv_light',
        pin: 27,
        state: 'on',
        duration: uvDuration,
        autoOffAt: uvAutoOff.toISOString(),
        message: 'UV лампу увімкнено',
      }, { headers: securityHeaders })

    case 'iot/uv/off':
      deviceStates.uv_light = {
        ...deviceStates.uv_light,
        state: 'off',
        autoOffAt: null,
      }
      
      console.log('[v0] 💡 UV лампа ВИМКНЕНА (Пін 27)')
      
      return NextResponse.json({
        success: true,
        device: 'uv_light',
        pin: 27,
        state: 'off',
        message: 'UV лампу вимкнено',
      }, { headers: securityHeaders })

    // ============================================
    // КЕРУВАННЯ МОТОРОМ ПОЛИВУ (ПІН 24)
    // ============================================
    case 'iot/water/on':
      const waterDuration = Math.min(body.duration || 120, 300) // Макс 5 хв
      const waterMotorAutoOff = new Date(Date.now() + waterDuration * 1000)
      
      deviceStates.water_motor = {
        ...deviceStates.water_motor,
        state: 'on',
        autoOffAt: waterMotorAutoOff.toISOString(),
      }
      
      console.log(`[v0] 💧 Мотор поливу УВІМКНЕНИЙ (Пін 24) на ${waterDuration} сек`)
      
      return NextResponse.json({
        success: true,
        device: 'water_motor',
        pin: 4,
        state: 'on',
        duration: waterDuration,
        autoOffAt: waterMotorAutoOff.toISOString(),
        message: 'Полив розпочато',
      }, { headers: securityHeaders })

    case 'iot/water/off':
      deviceStates.water_motor = {
        ...deviceStates.water_motor,
        state: 'off',
        autoOffAt: null,
      }
      
      console.log('[v0] 💧 Мотор поливу ВИМКНЕНИЙ (Пін 24)')
      
      return NextResponse.json({
        success: true,
        device: 'water_motor',
        pin: 4,
        state: 'off',
        message: 'Полив зупинено',
      }, { headers: securityHeaders })

    // ============================================
    // АВАРІЙНЕ ВИМКНЕННЯ ВСІХ ПРИСТРОЇВ
    // ============================================
    case 'iot/emergency-stop':
      // Вимикаємо всі пристрої
      deviceStates.uv_light = { ...deviceStates.uv_light, state: 'off', autoOffAt: null }
      deviceStates.water_motor = { ...deviceStates.water_motor, state: 'off', autoOffAt: null }
      
      console.log('[v0] 🚨 АВАРІЙНЕ ВИМКНЕННЯ ВСІХ ПРИСТРОЇВ!')
      
      // Додаємо подію безпеки
      securityEvents.unshift({
        id: `evt-${Date.now()}`,
        type: 'EMERGENCY_STOP',
        severity: 'high',
        title: 'Аварійне вимкнення',
        description: 'Всі IoT пристрої вимкнено оператором',
        timestamp: new Date(),
        source: 'IoT Controller',
      })
      
      return NextResponse.json({
        success: true,
        action: 'emergency_stop',
        devices: {
          uv_light: 'off',
          water_motor: 'off',
        },
        message: 'Аварійне вимкнення виконано',
      }, { headers: securityHeaders })

    // ============================================
    // СИМУЛЯЦІЯ КІБЕРАТАКИ
    // ============================================
    case 'attack/simulate':
      const attackType = body.type || 'data_poison'
      
      // Імітуємо наслідки атаки
      trustScore = 23
      isQuarantined = true
      
      // Псуємо дані сенсорів (як при реальній атаці)
      sensors = sensors.map(s => {
        if (s.type === 'soil_moisture') {
          return { ...s, value: 9999, status: 'critical' as const }
        }
        if (s.type === 'ph') {
          return { ...s, value: 14.5, status: 'critical' as const }
        }
        return s
      })
      
      // Записуємо подію безпеки
      securityEvents.unshift({
        id: `evt-${Date.now()}`,
        type: 'DATA_POISON',
        severity: 'critical',
        title: 'Атака виявлена!',
        description: `Виявлено атаку типу "${attackType}" на сенсорну мережу`,
        timestamp: new Date(),
        source: 'Security Module',
      })
      
      console.log(`[v0] 🚨 СИМУЛЯЦІЯ АТАКИ: ${attackType}`)
      
      return NextResponse.json({
        success: true,
        message: 'Симуляцію атаки запущено',
        data: { 
          trustScore, 
          isQuarantined, 
          attackType,
          // Рекомендації для захисту
          recommendations: [
            'Перевірте логи системи',
            'Ізолюйте підозрілі пристрої',
            'Зверніться до адміністратора',
          ],
        },
      }, { headers: securityHeaders })

    // ============================================
    // СКИДАННЯ АТАКИ / ВИХІД З КАРАНТИНУ
    // ============================================
    case 'attack/reset':
      // Відновлюємо нормальний стан
      trustScore = 100
      isQuarantined = false
      sensors = [...initialSensors]
      
      // Записуємо подію
      securityEvents.unshift({
        id: `evt-${Date.now()}`,
        type: 'QUARANTINE_LIFTED',
        severity: 'low',
        title: 'Систему відновлено',
        description: 'Карантин знято, система функціонує нормально',
        timestamp: new Date(),
        source: 'Security Module',
      })
      
      console.log('[v0] ✅ Систему відновлено з карантину')
      
      return NextResponse.json({
        success: true,
        message: 'Систему успішно відновлено',
        data: { trustScore, isQuarantined },
      }, { headers: securityHeaders })

    default:
      return NextResponse.json({
        success: false,
        error: 'Unknown action',
        message: `Дія "${action}" не підтримується`,
      }, { status: 400, headers: securityHeaders })
  }
}
