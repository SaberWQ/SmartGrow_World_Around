/**
 * SmartGrow SecureAI - TypeScript Types
 * (c) 2026 SmartGrow AI Team. All rights reserved.
 * Protected under Ukrainian Law No. 2811-IX
 */

export type PlantMood = 'dying' | 'suffering' | 'stressed' | 'okay' | 'happy' | 'thriving'

export interface PlantState {
  id: string
  name: string
  mood: PlantMood
  level: number
  xp: number
  maxXp: number
  health: number
  trustScore: number
  isQuarantined: boolean
}

export interface SensorData {
  id: string
  name: string
  type: 'temperature' | 'humidity' | 'soil_moisture' | 'ph' | 'ec' | 'npk'
  value: number
  unit: string
  status: 'optimal' | 'good' | 'warning' | 'critical'
  isOnline: boolean
  lastUpdated: Date
}

export interface SecurityEvent {
  id: string
  type: 'DATA_POISON' | 'SENSOR_SPOOF' | 'GRADUAL_DRIFT' | 'API_ACCESS' | 'ANOMALY' | 'QUARANTINE_LIFTED' | 'NORMAL'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  timestamp: Date
  source?: string
}

export interface ThreatLevel {
  level: 'low' | 'medium' | 'high' | 'critical'
  activeThreats: number
  lastScan: Date
  nextScan: Date
}

export interface Quest {
  id: string
  title: string
  description: string
  xpReward: number
  coinReward: number
  progress: number
  maxProgress: number
  isCompleted: boolean
  isActive: boolean
  timeLimit?: number
  icon: string
}

export interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  currency: 'coins' | 'tokens'
  category: 'clothing' | 'accessories' | 'treats' | 'decorations'
  image: string
  isOwned: boolean
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface UserSettings {
  language: 'uk' | 'en' | 'ro' | 'es'
  theme: 'dark' | 'light'
  soundEnabled: boolean
  notificationSoundEnabled: boolean
  actionSoundEnabled: boolean
  notificationsEnabled: boolean
  autoWatering: boolean
  privacyMode: boolean
}

export interface UserProfile {
  id: string
  email: string
  name: string
  level: number
  coins: number
  tokens: number
  memberSince: Date
  isPro: boolean
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: Date
}

export interface SensorReading {
  timestamp: Date
  temperature: number
  humidity: number
  soilMoisture: number
  ph: number
  ec: number
  npk: string
}

// Attack Simulation Types
export interface AttackSimulation {
  type: 'data_poison' | 'sensor_spoof' | 'gradual_drift'
  isActive: boolean
  startTime?: Date
  affectedSensors: string[]
}
