/**
 * ============================================
 * SmartGrow SecureAI - Quick Actions Component
 * ============================================
 * 
 * Компонент швидких дій для керування IoT пристроями:
 * - Пін 27: UV лампа (ультрафіолет)
 * - Пін 4: Мотор поливу (водяний насос)
 * 
 * (c) 2026 SmartGrow AI Team. Всі права захищено.
 * Захищено законом України №2811-IX
 * ============================================
 */

'use client'

import { motion } from 'framer-motion'
import { Droplets, StopCircle, Sun, Moon, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useSmartGrowStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { useSound } from '@/lib/sounds'

export function QuickActions() {
  const { language, addXp } = useSmartGrowStore()
  const t = translations[language]
  const { playWater, playClick, playSuccess } = useSound()
  
  // Стани пристроїв
  const [isWatering, setIsWatering] = useState(false)
  const [uvOn, setUvOn] = useState(false)
  const [isLoading, setIsLoading] = useState<string | null>(null)

  // ============================================
  // ПОЛИВ (Пін 4 - Water Motor)
  // ============================================
  const handleWaterOn = async () => {
    setIsLoading('water_on')
    playWater()
    
    try {
      // Викликаємо API для увімкнення мотора поливу
      const response = await fetch('/api/smartgrow?action=iot/water/on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration: 120 }), // 2 хвилини
      })
      
      const data = await response.json()
      
      if (data.success) {
        setIsWatering(true)
        addXp(10)
        playSuccess()
        
        // Автоматично вимикаємо через 2 хвилини
        setTimeout(() => {
          setIsWatering(false)
        }, 120000)
      }
    } catch (error) {
      console.error('[v0] Помилка увімкнення поливу:', error)
    } finally {
      setIsLoading(null)
    }
  }

  const handleWaterOff = async () => {
    setIsLoading('water_off')
    playClick()
    
    try {
      // Викликаємо API для вимкнення мотора поливу
      const response = await fetch('/api/smartgrow?action=iot/water/off', {
        method: 'POST',
      })
      
      const data = await response.json()
      
      if (data.success) {
        setIsWatering(false)
      }
    } catch (error) {
      console.error('[v0] Помилка вимкнення поливу:', error)
    } finally {
      setIsLoading(null)
    }
  }

  // ============================================
  // UV ЛАМПА (Пін 27 - UV Light)
  // ============================================
  const handleUvOn = async () => {
    setIsLoading('uv_on')
    playClick()
    
    try {
      // Викликаємо API для увімкнення UV лампи
      const response = await fetch('/api/smartgrow?action=iot/uv/on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration: 1800 }), // 30 хвилин
      })
      
      const data = await response.json()
      
      if (data.success) {
        setUvOn(true)
        playSuccess()
      }
    } catch (error) {
      console.error('[v0] Помилка увімкнення UV:', error)
    } finally {
      setIsLoading(null)
    }
  }

  const handleUvOff = async () => {
    setIsLoading('uv_off')
    playClick()
    
    try {
      // Викликаємо API для вимкнення UV лампи
      const response = await fetch('/api/smartgrow?action=iot/uv/off', {
        method: 'POST',
      })
      
      const data = await response.json()
      
      if (data.success) {
        setUvOn(false)
      }
    } catch (error) {
      console.error('[v0] Помилка вимкнення UV:', error)
    } finally {
      setIsLoading(null)
    }
  }

  // Мітки для різних мов
  const wateringLabel = {
    uk: 'Полив...',
    ro: 'Se uda...',
    en: 'Watering...',
    es: 'Regando...'
  }

  return (
    <div className="glass-panel p-4">
      <h3 className="text-lg font-semibold text-white mb-4">
        {t.quickActions}
      </h3>
      
      {/* Інформація про GPIO піни */}
      <div className="text-xs text-[#4a7090] mb-3 space-y-1">
        <p>GPIO 27: UV ({uvOn ? 'ON' : 'OFF'})</p>
        <p>GPIO 24: Water ({isWatering ? 'ON' : 'OFF'})</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {/* ============================================ */}
        {/* КНОПКА ПОЛИВУ (Пін 24) */}
        {/* ============================================ */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleWaterOn}
          disabled={isWatering || isLoading === 'water_on'}
          className={cn(
            'flex items-center justify-center gap-2 p-4 rounded-xl border transition-all',
            isWatering 
              ? 'bg-[#00d4ff]/20 border-[#00d4ff] text-[#00d4ff]'
              : 'bg-[#0a1525] border-[#1a3a5c] text-[#c8e0f0] hover:border-[#00d4ff]',
            (isWatering || isLoading === 'water_on') && 'opacity-70 cursor-not-allowed'
          )}
        >
          {isLoading === 'water_on' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Droplets className={cn('w-5 h-5', isWatering && 'animate-bounce')} />
          )}
          <span className="font-medium">
            {isWatering ? wateringLabel[language] : t.water}
          </span>
        </motion.button>

        {/* ============================================ */}
        {/* КНОПКА ЗУПИНКИ ПОЛИВУ (Пін 24) */}
        {/* ============================================ */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleWaterOff}
          disabled={!isWatering || isLoading === 'water_off'}
          className={cn(
            'flex items-center justify-center gap-2 p-4 rounded-xl border transition-all',
            'bg-[#0a1525] border-[#1a3a5c] text-[#c8e0f0] hover:border-[#ff3b5c]',
            (!isWatering || isLoading === 'water_off') && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isLoading === 'water_off' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <StopCircle className="w-5 h-5 text-[#ff3b5c]" />
          )}
          <span className="font-medium">{t.stopWater}</span>
        </motion.button>

        {/* ============================================ */}
        {/* КНОПКА UV ON (Пін 27) */}
        {/* ============================================ */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUvOn}
          disabled={uvOn || isLoading === 'uv_on'}
          className={cn(
            'flex items-center justify-center gap-2 p-4 rounded-xl border transition-all',
            uvOn
              ? 'bg-[#ffaa00]/20 border-[#ffaa00] text-[#ffaa00]'
              : 'bg-[#0a1525] border-[#1a3a5c] text-[#c8e0f0] hover:border-[#ffaa00]',
            (uvOn || isLoading === 'uv_on') && 'opacity-70 cursor-not-allowed'
          )}
        >
          {isLoading === 'uv_on' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sun className={cn('w-5 h-5', uvOn && 'animate-pulse')} />
          )}
          <span className="font-medium">{t.uvLightOn}</span>
        </motion.button>

        {/* ============================================ */}
        {/* КНОПКА UV OFF (Пін 27) */}
        {/* ============================================ */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUvOff}
          disabled={!uvOn || isLoading === 'uv_off'}
          className={cn(
            'flex items-center justify-center gap-2 p-4 rounded-xl border transition-all',
            !uvOn
              ? 'bg-[#4a7090]/20 border-[#4a7090] text-[#4a7090]'
              : 'bg-[#0a1525] border-[#1a3a5c] text-[#c8e0f0] hover:border-[#4a7090]',
            (!uvOn || isLoading === 'uv_off') && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isLoading === 'uv_off' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
          <span className="font-medium">{t.uvLightOff}</span>
        </motion.button>
      </div>
    </div>
  )
}
