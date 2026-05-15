/**
 * SmartGrow SecureAI - Attack Simulator Component
 * (c) 2026 SmartGrow AI Team. All rights reserved.
 * Protected under Ukrainian Law No. 2811-IX
 */

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Syringe, Ghost, TrendingDown, RefreshCw, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { useSmartGrowStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { useSound } from '@/lib/sounds'
import { cn } from '@/lib/utils'

export function AttackSimulator() {
  const { simulateAttack, resetSystem, isUnderAttack, language } = useSmartGrowStore()
  const t = translations[language]
  const { playAttack, playSuccess, playClick } = useSound()
  const [flashColor, setFlashColor] = useState<string | null>(null)

  const handleAttack = (type: 'data_poison' | 'sensor_spoof' | 'gradual_drift') => {
    // Red flash effect
    setFlashColor('rgba(255,59,92,0.3)')
    setTimeout(() => setFlashColor(null), 400)
    
    playAttack()
    simulateAttack(type)
  }

  const handleReset = () => {
    // Green flash effect
    setFlashColor('rgba(0,255,136,0.3)')
    setTimeout(() => setFlashColor(null), 400)
    
    playSuccess()
    resetSystem()
  }

  const dataPoisonLabel = { uk: 'Отруєння даних', ro: 'Otravire date', en: 'Data Poison', es: 'Envenenamiento de datos' }
  const sensorSpoofLabel = { uk: 'Підміна сенсорів', ro: 'Falsificare senzori', en: 'Sensor Spoof', es: 'Suplantacion de sensores' }
  const gradualDriftLabel = { uk: 'Поступовий зсув', ro: 'Derivare graduala', en: 'Gradual Drift', es: 'Deriva gradual' }
  const resetQuarantineLabel = { uk: 'Скинути карантин', ro: 'Resetare carantina', en: 'Reset Quarantine', es: 'Restablecer cuarentena' }
  const normalDataLabel = { uk: 'Нормальні дані', ro: 'Date normale', en: 'Normal Data', es: 'Datos normales' }

  return (
    <>
      {/* Flash Overlay */}
      <AnimatePresence>
        {flashColor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none"
            style={{ backgroundColor: flashColor }}
          />
        )}
      </AnimatePresence>

      <div className="glass-panel p-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          {t.attackSimulator}
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* Data Poison Attack */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAttack('data_poison')}
            disabled={isUnderAttack}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
              isUnderAttack
                ? 'opacity-50 cursor-not-allowed bg-[#0a1525] border-[#1a3a5c]'
                : 'bg-[#0a1525] border-[#ff3b5c] hover:bg-[#ff3b5c]/10'
            )}
          >
            <div className="w-10 h-10 rounded-lg bg-[#ff3b5c]/20 flex items-center justify-center">
              <Syringe className="w-5 h-5 text-[#ff3b5c]" />
            </div>
            <span className="text-sm font-medium text-[#c8e0f0]">
              {dataPoisonLabel[language]}
            </span>
          </motion.button>

          {/* Sensor Spoof */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAttack('sensor_spoof')}
            disabled={isUnderAttack}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
              isUnderAttack
                ? 'opacity-50 cursor-not-allowed bg-[#0a1525] border-[#1a3a5c]'
                : 'bg-[#0a1525] border-[#ffaa00] hover:bg-[#ffaa00]/10'
            )}
          >
            <div className="w-10 h-10 rounded-lg bg-[#ffaa00]/20 flex items-center justify-center">
              <Ghost className="w-5 h-5 text-[#ffaa00]" />
            </div>
            <span className="text-sm font-medium text-[#c8e0f0]">
              {sensorSpoofLabel[language]}
            </span>
          </motion.button>

          {/* Gradual Drift */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAttack('gradual_drift')}
            disabled={isUnderAttack}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
              isUnderAttack
                ? 'opacity-50 cursor-not-allowed bg-[#0a1525] border-[#1a3a5c]'
                : 'bg-[#0a1525] border-[#b44fff] hover:bg-[#b44fff]/10'
            )}
          >
            <div className="w-10 h-10 rounded-lg bg-[#b44fff]/20 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-[#b44fff]" />
            </div>
            <span className="text-sm font-medium text-[#c8e0f0]">
              {gradualDriftLabel[language]}
            </span>
          </motion.button>

          {/* Reset System */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReset}
            disabled={!isUnderAttack}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
              !isUnderAttack
                ? 'opacity-50 cursor-not-allowed bg-[#0a1525] border-[#1a3a5c]'
                : 'bg-[#0a1525] border-[#00ff88] hover:bg-[#00ff88]/10 animate-pulse'
            )}
          >
            <div className="w-10 h-10 rounded-lg bg-[#00ff88]/20 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-[#00ff88]" />
            </div>
            <span className="text-sm font-medium text-[#c8e0f0]">
              {resetQuarantineLabel[language]}
            </span>
          </motion.button>
        </div>

        {/* Normal Data Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleReset}
          className="w-full mt-3 flex items-center justify-center gap-2 p-3 rounded-xl border bg-[#0a1525] border-[#00d4ff] hover:bg-[#00d4ff]/10 transition-all"
        >
          <CheckCircle className="w-5 h-5 text-[#00d4ff]" />
          <span className="text-sm font-medium text-[#c8e0f0]">
            {normalDataLabel[language]}
          </span>
        </motion.button>
      </div>
    </>
  )
}
