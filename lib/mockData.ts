/**
 * SmartGrow SecureAI - Mock Data
 * (c) 2026 SmartGrow AI Team. All rights reserved.
 * Protected under Ukrainian Law No. 2811-IX
 */

import type { 
  PlantState, 
  SensorData, 
  SecurityEvent, 
  Quest, 
  ShopItem, 
  UserProfile,
  UserSettings,
  SensorReading
} from './types'

export const initialPlantState: PlantState = {
  id: 'leafy-001',
  name: 'Leafy',
  mood: 'happy',
  level: 12,
  xp: 1250,
  maxXp: 2000,
  health: 92,
  trustScore: 94,
  isQuarantined: false,
}

export const initialSensors: SensorData[] = [
  {
    id: 'temp-01',
    name: 'Temperature',
    type: 'temperature',
    value: 22.4,
    unit: '°C',
    status: 'optimal',
    isOnline: true,
    lastUpdated: new Date(),
  },
  {
    id: 'hum-01',
    name: 'Humidity',
    type: 'humidity',
    value: 65,
    unit: '%',
    status: 'optimal',
    isOnline: true,
    lastUpdated: new Date(),
  },
  {
    id: 'soil-01',
    name: 'Soil Moisture',
    type: 'soil_moisture',
    value: 48,
    unit: '%',
    status: 'good',
    isOnline: true,
    lastUpdated: new Date(),
  },
  {
    id: 'ph-01',
    name: 'pH Level',
    type: 'ph',
    value: 6.2,
    unit: '',
    status: 'good',
    isOnline: true,
    lastUpdated: new Date(),
  },
  {
    id: 'ec-01',
    name: 'EC Level',
    type: 'ec',
    value: 1.8,
    unit: 'mS/cm',
    status: 'good',
    isOnline: true,
    lastUpdated: new Date(),
  },
  {
    id: 'npk-01',
    name: 'NPK Level',
    type: 'npk',
    value: 120,
    unit: '120-45-60',
    status: 'good',
    isOnline: true,
    lastUpdated: new Date(),
  },
]

export const initialSecurityEvents: SecurityEvent[] = [
  {
    id: 'evt-001',
    type: 'ANOMALY',
    severity: 'high',
    title: 'Sensor Data Anomaly',
    description: 'Moisture sensor R3',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    source: 'Moisture sensor R3',
  },
  {
    id: 'evt-002',
    type: 'API_ACCESS',
    severity: 'medium',
    title: 'Unauthorized API Access',
    description: '192.168.1.48',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    source: '192.168.1.48',
  },
  {
    id: 'evt-003',
    type: 'ANOMALY',
    severity: 'low',
    title: 'Abnormal Request Pattern',
    description: 'API Endpoint /data',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    source: 'API Endpoint /data',
  },
]

export const initialQuests: Quest[] = [
  {
    id: 'quest-active',
    title: 'Leafy is thirsty!',
    description: 'Water your plant within 15 minutes to keep it happy.',
    xpReward: 50,
    coinReward: 25,
    progress: 0,
    maxProgress: 1,
    isCompleted: false,
    isActive: true,
    timeLimit: 15 * 60 * 1000,
    icon: 'droplet',
  },
  {
    id: 'quest-001',
    title: 'Water your plant',
    description: 'Give Leafy some water',
    xpReward: 25,
    coinReward: 15,
    progress: 0,
    maxProgress: 1,
    isCompleted: false,
    isActive: false,
    icon: 'droplet',
  },
  {
    id: 'quest-002',
    title: 'Check all sensors',
    description: 'Review all sensor readings',
    xpReward: 20,
    coinReward: 10,
    progress: 5,
    maxProgress: 7,
    isCompleted: false,
    isActive: false,
    icon: 'activity',
  },
  {
    id: 'quest-003',
    title: 'Chat with Leafy',
    description: 'Have a conversation with your plant companion',
    xpReward: 16,
    coinReward: 10,
    progress: 1,
    maxProgress: 1,
    isCompleted: true,
    isActive: false,
    icon: 'message-circle',
  },
  {
    id: 'quest-004',
    title: 'Keep pH optimal',
    description: 'Maintain pH levels in the optimal range',
    xpReward: 30,
    coinReward: 20,
    progress: 0,
    maxProgress: 1,
    isCompleted: false,
    isActive: false,
    icon: 'flask-conical',
  },
]

export const shopItems: ShopItem[] = [
  {
    id: 'item-001',
    name: 'Leaf Crown',
    description: 'A beautiful crown made of leaves',
    price: 900,
    currency: 'coins',
    category: 'accessories',
    image: '/images/icons/shop_leaf_crown.svg',
    isOwned: false,
  },
  {
    id: 'item-002',
    name: 'Magic Glasses',
    description: 'Enchanted glasses that sparkle',
    price: 750,
    currency: 'coins',
    category: 'accessories',
    image: '/images/icons/shop_magic_glasses.svg',
    isOwned: false,
  },
  {
    id: 'item-003',
    name: 'Butterfly Wings',
    description: 'Delicate butterfly wings',
    price: 1000,
    currency: 'coins',
    category: 'clothing',
    image: '/images/icons/shop_butterfly_wings.svg',
    isOwned: false,
  },
  {
    id: 'item-004',
    name: 'Rainbow Scarf',
    description: 'A colorful rainbow scarf',
    price: 600,
    currency: 'coins',
    category: 'clothing',
    image: '/images/icons/shop_leaf_crown.svg',
    isOwned: false,
  },
  {
    id: 'item-005',
    name: 'Star Hat',
    description: 'A hat decorated with stars',
    price: 600,
    currency: 'coins',
    category: 'accessories',
    image: '/images/icons/shop_magic_glasses.svg',
    isOwned: false,
  },
  {
    id: 'item-006',
    name: 'Moon Pendant',
    description: 'A glowing moon pendant',
    price: 900,
    currency: 'coins',
    category: 'accessories',
    image: '/images/icons/shop_butterfly_wings.svg',
    isOwned: false,
  },
]

export const initialUserProfile: UserProfile = {
  id: 'user-001',
  email: 'grower@smartgrow.ai',
  name: 'Grower',
  level: 12,
  coins: 1250,
  tokens: 45,
  memberSince: new Date('2026-05-01'),
  isPro: true,
}

export const initialUserSettings: UserSettings = {
  language: 'uk',
  theme: 'dark',
  soundEnabled: true,
  notificationSoundEnabled: true,
  actionSoundEnabled: true,
  notificationsEnabled: true,
  autoWatering: true,
  privacyMode: true,
}

// Generate 24h sensor data for charts
export function generateSensorHistory(): SensorReading[] {
  const data: SensorReading[] = []
  const now = Date.now()
  
  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(now - i * 60 * 60 * 1000)
    data.push({
      timestamp,
      temperature: 20 + Math.random() * 5,
      humidity: 60 + Math.random() * 15,
      soilMoisture: 40 + Math.random() * 20,
      ph: 5.5 + Math.random() * 1.5,
      ec: 1.5 + Math.random() * 0.8,
      npk: '120-45-60',
    })
  }
  
  return data
}

// Leafy's speech phrases
export const leafySpeech = {
  happy: [
    'Thank you for taking such good care of me! I feel amazing today!',
    'What a beautiful day to grow!',
    'I love being your plant companion!',
  ],
  okay: [
    'Everything seems fine today.',
    'Just another day growing strong!',
    'Could use a little more attention...',
  ],
  stressed: [
    'Something feels off... Can you check my sensors?',
    'I am a bit worried about my environment...',
    'Please help me feel better!',
  ],
  suffering: [
    'DANGER! My sensors are showing impossible readings!',
    'Help! Something is very wrong!',
    'I need your protection right now!',
  ],
  dying: [
    'CRITICAL ALERT! System compromised!',
    'Emergency! All systems failing!',
    'Mayday! Mayday!',
  ],
  thriving: [
    'I have never felt better! You are the best caretaker!',
    'Peak performance achieved! Thank you!',
    'Living my best life!',
  ],
}

// Ukrainian translations for speech
export const leafySpeechUk = {
  happy: [
    'Дякую за таку чудову турботу! Я почуваюся чудово сьогодні!',
    'Який прекрасний день для росту!',
    'Я люблю бути твоїм рослинним компаньйоном!',
  ],
  okay: [
    'Сьогодні все гаразд.',
    'Просто ще один день, щоб рости!',
    'Можна б трохи більше уваги...',
  ],
  stressed: [
    'Щось не так... Чи можеш перевірити мої сенсори?',
    'Я трохи хвилююся за своє середовище...',
    'Будь ласка, допоможи мені почуватися краще!',
  ],
  suffering: [
    'НЕБЕЗПЕКА! Мої сенсори показують неможливі дані!',
    'Допоможіть! Щось дуже не так!',
    'Мені потрібен твій захист зараз!',
  ],
  dying: [
    'КРИТИЧНА ТРИВОГА! Систему скомпрометовано!',
    'Надзвичайна ситуація! Всі системи відмовляють!',
    'На допомогу! На допомогу!',
  ],
  thriving: [
    'Я ніколи не почувалася краще! Ти найкращий доглядач!',
    'Пікова продуктивність досягнута! Дякую!',
    'Живу своє найкраще життя!',
  ],
}

// Attack simulation messages
export const attackMessages = {
  data_poison: {
    title: 'Data Poison Attack Detected!',
    description: 'Malicious data injection attempt detected on soil sensors.',
    titleUk: 'Виявлено атаку отруєнням даних!',
    descriptionUk: 'Виявлено спробу ін\'єкції шкідливих даних на сенсори грунту.',
  },
  sensor_spoof: {
    title: 'Sensor Spoofing Detected!',
    description: 'Fake sensor readings detected on multiple devices.',
    titleUk: 'Виявлено підміну сенсорів!',
    descriptionUk: 'Виявлено фальшиві показники на кількох пристроях.',
  },
  gradual_drift: {
    title: 'Gradual Drift Attack Detected!',
    description: 'Slow manipulation of sensor values detected.',
    titleUk: 'Виявлено атаку поступового зсуву!',
    descriptionUk: 'Виявлено повільну маніпуляцію значеннями сенсорів.',
  },
}
