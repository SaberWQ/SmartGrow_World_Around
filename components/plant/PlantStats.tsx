/**
 * SmartGrow SecureAI - Plant Stats Component
 * (c) 2026 SmartGrow AI Team. All rights reserved.
 * Protected under Ukrainian Law No. 2811-IX
 */

'use client'

import { motion } from 'framer-motion'
import { Heart, Smile, Shield, Pencil } from 'lucide-react'
import { useSmartGrowStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const moodLabels = {
  dying: { en: 'Critical', uk: 'Критичний', ro: 'Critic' },
  suffering: { en: 'Suffering', uk: 'Страждає', ro: 'Suferă' },
  stressed: { en: 'Stressed', uk: 'Стрес', ro: 'Stresat' },
  okay: { en: 'Okay', uk: 'Нормально', ro: 'Bine' },
  happy: { en: 'Happy', uk: 'Щасливий', ro: 'Fericit' },
  thriving: { en: 'Thriving', uk: 'Процвітає', ro: 'Înfloritor' },
}

export function PlantStats() {
  const { plant, language } = useSmartGrowStore()
  const t = translations[language]

  const xpPercentage = (plant.xp / plant.maxXp) * 100
  const moodLabel = moodLabels[plant.mood]

  return (
    <div className="space-y-4">
      {/* Name and Level */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-white font-[var(--font-orbitron)]">
            {plant.name}
          </h2>
          <button className="p-1 rounded hover:bg-[#0a1525] transition-colors">
            <Pencil className="w-4 h-4 text-[#4a7090]" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-[#4a7090]">
          <span className="text-lg">&#9792;</span>
          <span className="text-lg">&#128293;</span>
        </div>
      </div>

      {/* Level and XP */}
      <div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-[#4a7090]">
            {t.level} {plant.level}
          </span>
          <span className="text-[#4a7090]">
            {plant.xp.toLocaleString()} / {plant.maxXp.toLocaleString()} XP
          </span>
        </div>
        <div className="h-3 bg-[#0a1525] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpPercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88] rounded-full"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="space-y-3">
        {/* Health */}
        <div className="glass-panel p-3 flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            plant.health >= 70 ? 'bg-[#00ff88]/20' : plant.health >= 40 ? 'bg-[#ffaa00]/20' : 'bg-[#ff3b5c]/20'
          )}>
            <Heart className={cn(
              'w-5 h-5',
              plant.health >= 70 ? 'text-[#00ff88]' : plant.health >= 40 ? 'text-[#ffaa00]' : 'text-[#ff3b5c]'
            )} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-[#4a7090]">{t.health}</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">{plant.health}%</span>
              <div className="flex-1 h-2 bg-[#0a1525] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${plant.health}%` }}
                  className={cn(
                    'h-full rounded-full',
                    plant.health >= 70 ? 'bg-[#00ff88]' : plant.health >= 40 ? 'bg-[#ffaa00]' : 'bg-[#ff3b5c]'
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mood */}
        <div className="glass-panel p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#ff4da6]/20 flex items-center justify-center">
            <Smile className="w-5 h-5 text-[#ff4da6]" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-[#4a7090]">{t.mood}</p>
            <p className="text-xl font-bold text-white">
              {moodLabel[language]}
            </p>
          </div>
        </div>

        {/* Trust Score */}
        <div className="glass-panel p-3 flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            plant.trustScore >= 70 ? 'bg-[#00d4ff]/20' : plant.trustScore >= 40 ? 'bg-[#ffaa00]/20' : 'bg-[#ff3b5c]/20'
          )}>
            <Shield className={cn(
              'w-5 h-5',
              plant.trustScore >= 70 ? 'text-[#00d4ff]' : plant.trustScore >= 40 ? 'text-[#ffaa00]' : 'text-[#ff3b5c]'
            )} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-[#4a7090]">{t.trustScore}</p>
            <p className={cn(
              'text-xl font-bold',
              plant.trustScore >= 70 ? 'text-[#00d4ff]' : plant.trustScore >= 40 ? 'text-[#ffaa00]' : 'text-[#ff3b5c]'
            )}>
              {plant.trustScore}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
