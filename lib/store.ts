/**
 * SmartGrow SecureAI - Zustand Store
 * (c) 2026 SmartGrow AI Team. All rights reserved.
 * Protected under Ukrainian Law No. 2811-IX
 */

import { create } from 'zustand'
import type { 
  PlantState, 
  SensorData, 
  SecurityEvent, 
  Quest, 
  UserProfile, 
  UserSettings,
  PlantMood,
  ChatMessage
} from './types'
import type { Language } from './i18n'
import { 
  initialPlantState, 
  initialSensors, 
  initialSecurityEvents, 
  initialQuests,
  initialUserProfile,
  initialUserSettings,
  leafySpeechUk
} from './mockData'

interface SmartGrowStore {
  // Plant State
  plant: PlantState
  setPlantMood: (mood: PlantMood) => void
  setPlantHealth: (health: number) => void
  setTrustScore: (score: number) => void
  setQuarantine: (isQuarantined: boolean) => void
  addXp: (amount: number) => void

  // Sensors
  sensors: SensorData[]
  updateSensor: (id: string, data: Partial<SensorData>) => void
  poisonSensors: () => void
  resetSensors: () => void

  // Security
  securityEvents: SecurityEvent[]
  addSecurityEvent: (event: Omit<SecurityEvent, 'id' | 'timestamp'>) => void
  clearSecurityEvents: () => void

  // Quests
  quests: Quest[]
  completeQuest: (id: string) => void
  updateQuestProgress: (id: string, progress: number) => void

  // User
  user: UserProfile
  settings: UserSettings
  updateSettings: (settings: Partial<UserSettings>) => void
  addCoins: (amount: number) => void
  
  // Language
  language: Language
  setLanguage: (lang: Language) => void

  // Chat
  chatMessages: ChatMessage[]
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  dailyMessagesLeft: number
  decrementDailyMessages: () => void

  // Attack Simulation
  isUnderAttack: boolean
  attackType: string | null
  simulateAttack: (type: 'data_poison' | 'sensor_spoof' | 'gradual_drift') => void
  resetSystem: () => void

  // Speech
  currentSpeech: string
  setSpeech: (speech: string) => void
}

export const useSmartGrowStore = create<SmartGrowStore>((set, get) => ({
  // Plant State
  plant: initialPlantState,
  setPlantMood: (mood) => set((state) => ({ plant: { ...state.plant, mood } })),
  setPlantHealth: (health) => set((state) => ({ plant: { ...state.plant, health } })),
  setTrustScore: (trustScore) => set((state) => ({ plant: { ...state.plant, trustScore } })),
  setQuarantine: (isQuarantined) => set((state) => ({ plant: { ...state.plant, isQuarantined } })),
  addXp: (amount) => set((state) => {
    const newXp = state.plant.xp + amount
    const newLevel = newXp >= state.plant.maxXp ? state.plant.level + 1 : state.plant.level
    return { 
      plant: { 
        ...state.plant, 
        xp: newXp >= state.plant.maxXp ? newXp - state.plant.maxXp : newXp,
        level: newLevel
      } 
    }
  }),

  // Sensors
  sensors: initialSensors,
  updateSensor: (id, data) => set((state) => ({
    sensors: state.sensors.map((s) => s.id === id ? { ...s, ...data } : s)
  })),
  poisonSensors: () => set((state) => ({
    sensors: state.sensors.map((s) => {
      if (s.type === 'soil_moisture') return { ...s, value: 9999, status: 'critical' as const }
      if (s.type === 'ph') return { ...s, value: 14.5, status: 'critical' as const }
      if (s.type === 'temperature') return { ...s, value: -100, status: 'critical' as const }
      return s
    })
  })),
  resetSensors: () => set({ sensors: initialSensors }),

  // Security
  securityEvents: initialSecurityEvents,
  addSecurityEvent: (event) => set((state) => ({
    securityEvents: [
      {
        ...event,
        id: `evt-${Date.now()}`,
        timestamp: new Date(),
      },
      ...state.securityEvents,
    ].slice(0, 50)
  })),
  clearSecurityEvents: () => set({ securityEvents: [] }),

  // Quests
  quests: initialQuests,
  completeQuest: (id) => set((state) => ({
    quests: state.quests.map((q) => 
      q.id === id ? { ...q, isCompleted: true, progress: q.maxProgress } : q
    )
  })),
  updateQuestProgress: (id, progress) => set((state) => ({
    quests: state.quests.map((q) => 
      q.id === id ? { ...q, progress } : q
    )
  })),

  // User
  user: initialUserProfile,
  settings: initialUserSettings,
  updateSettings: (settings) => set((state) => ({
    settings: { ...state.settings, ...settings }
  })),
  addCoins: (amount) => set((state) => ({
    user: { ...state.user, coins: state.user.coins + amount }
  })),
  
  // Language
  language: 'uk' as Language,
  setLanguage: (lang) => set({ language: lang }),

  // Chat
  chatMessages: [
    {
      id: 'msg-001',
      role: 'assistant',
      content: 'Привіт! Як я можу допомогти тобі сьогодні?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    }
  ],
  addChatMessage: (message) => set((state) => ({
    chatMessages: [
      ...state.chatMessages,
      {
        ...message,
        id: `msg-${Date.now()}`,
        timestamp: new Date(),
      }
    ]
  })),
  dailyMessagesLeft: 3,
  decrementDailyMessages: () => set((state) => ({
    dailyMessagesLeft: Math.max(0, state.dailyMessagesLeft - 1)
  })),

  // Attack Simulation
  isUnderAttack: false,
  attackType: null,
  simulateAttack: (type) => {
    const store = get()
    
    // Start attack
    set({ isUnderAttack: true, attackType: type })
    
    // Poison sensors
    store.poisonSensors()
    
    // Lower trust score
    store.setTrustScore(23)
    
    // Set quarantine
    store.setQuarantine(true)
    
    // Change plant mood
    store.setPlantMood('suffering')
    
    // Set speech
    const speeches = leafySpeechUk.suffering
    store.setSpeech(speeches[Math.floor(Math.random() * speeches.length)])
    
    // Add security event
    store.addSecurityEvent({
      type: 'DATA_POISON',
      severity: 'critical',
      title: type === 'data_poison' ? 'Атака отруєнням даних!' : 
             type === 'sensor_spoof' ? 'Підміна сенсорів!' : 'Поступовий зсув!',
      description: 'Виявлено ін\'єкцію шкідливих даних у систему сенсорів.',
      source: 'Security Module',
    })
  },
  resetSystem: () => {
    const store = get()
    
    set({ isUnderAttack: false, attackType: null })
    
    // Reset sensors
    store.resetSensors()
    
    // Restore trust score
    store.setTrustScore(100)
    
    // Remove quarantine
    store.setQuarantine(false)
    
    // Happy plant
    store.setPlantMood('thriving')
    
    // Set speech
    const speeches = leafySpeechUk.thriving
    store.setSpeech(speeches[Math.floor(Math.random() * speeches.length)])
    
    // Add recovery event
    store.addSecurityEvent({
      type: 'QUARANTINE_LIFTED',
      severity: 'low',
      title: 'Систему відновлено',
      description: 'Оператор успішно відновив систему.',
      source: 'Security Module',
    })
  },

  // Speech
  currentSpeech: leafySpeechUk.happy[0],
  setSpeech: (speech) => set({ currentSpeech: speech }),
}))
