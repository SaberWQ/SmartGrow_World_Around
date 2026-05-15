/**
 * SmartGrow SecureAI - Tasks & Quests Page
 * (c) 2026 SmartGrow AI Team. All rights reserved.
 * Protected under Ukrainian Law No. 2811-IX
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, Droplets, BarChart3, MessageCircle, FlaskConical, Clock, Coins, Sparkles, Check } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { LeafyCharacter } from '@/components/plant/LeafyCharacter'
import { useSmartGrowStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { useSound } from '@/lib/sounds'
import { cn } from '@/lib/utils'

const questIcons = {
  droplet: Droplets,
  activity: BarChart3,
  'message-circle': MessageCircle,
  'flask-conical': FlaskConical,
}

export default function TasksPage() {
  const { quests, completeQuest, addXp, addCoins, language } = useSmartGrowStore()
  const t = translations[language]
  const { playQuestComplete } = useSound()
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes

  const activeQuest = quests.find(q => q.isActive)
  const dailyQuests = quests.filter(q => !q.isActive)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleCompleteQuest = (questId: string, xp: number, coins: number) => {
    playQuestComplete()
    completeQuest(questId)
    addXp(xp)
    addCoins(coins)
  }

  const leafyThirstyTitle = {
    uk: 'Leafy хоче пити!',
    ro: 'Leafy e insetat!',
    en: 'Leafy is thirsty!',
    es: 'Leafy tiene sed!'
  }

  const leafyThirstyDesc = {
    uk: 'Полийте рослину протягом 15 хвилин, щоб вона залишалася щасливою.',
    ro: 'Udati planta in 15 minute pentru a o mentine fericita.',
    en: 'Water your plant within 15 minutes to keep it happy.',
    es: 'Riega tu planta en 15 minutos para mantenerla feliz.'
  }

  const claimLabel = { uk: 'Зібрати', ro: 'Colecteaza', en: 'Claim', es: 'Reclamar' }
  const completedTodayLabel = { uk: 'Виконано сьогодні', ro: 'Completate astazi', en: 'Completed Today', es: 'Completadas hoy' }
  const xpEarnedLabel = { uk: 'Зароблено XP', ro: 'XP castigat', en: 'XP Earned', es: 'XP ganado' }
  const coinsEarnedLabel = { uk: 'Зароблено монет', ro: 'Monede castigate', en: 'Coins Earned', es: 'Monedas ganadas' }
  const statisticsLabel = { uk: 'Статистика', ro: 'Statistici', en: 'Statistics', es: 'Estadisticas' }

  return (
    <div>
      <TopBar 
        title={t.tasksAndQuests}
        subtitle={t.completeTasksToHelp}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Quest */}
          {activeQuest && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative glass-panel p-6 border-2 border-[#b44fff] overflow-hidden"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#b44fff]/10 to-transparent pointer-events-none" />
              
              <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#b44fff]" />
                    <span className="text-sm font-medium text-[#b44fff]">
                      {t.activeQuest}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#ff3b5c]/20 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4 text-[#ff3b5c]" />
                    <span className="font-mono font-bold text-[#ff3b5c]">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>

                {/* Quest Content */}
                <div className="flex gap-4">
                  <div className="w-20 h-20 flex-shrink-0">
                    <LeafyCharacter size="sm" mood="stressed" showParticles={false} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {leafyThirstyTitle[language]}
                    </h3>
                    <p className="text-[#4a7090] mb-4">
                      {leafyThirstyDesc[language]}
                    </p>

                    {/* Rewards */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1 bg-[#b44fff]/20 px-3 py-1 rounded-full">
                        <Sparkles className="w-4 h-4 text-[#b44fff]" />
                        <span className="text-sm font-bold text-[#b44fff]">+{activeQuest.xpReward} XP</span>
                      </div>
                      <div className="flex items-center gap-1 bg-[#ffd700]/20 px-3 py-1 rounded-full">
                        <Coins className="w-4 h-4 text-[#ffd700]" />
                        <span className="text-sm font-bold text-[#ffd700]">+{activeQuest.coinReward}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-3 bg-[#0a1525] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(1 - timeLeft / (15 * 60)) * 100}%` }}
                        className="h-full bg-gradient-to-r from-[#b44fff] to-[#ff4da6] rounded-full"
                      />
                    </div>
                    <p className="text-xs text-[#4a7090] mt-1">
                      {t.timeRemaining}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Daily Quests */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {t.dailyQuests}
            </h3>

            <div className="space-y-3">
              {dailyQuests.map((quest, index) => {
                const Icon = questIcons[quest.icon as keyof typeof questIcons] || Droplets
                const progress = (quest.progress / quest.maxProgress) * 100

                return (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl bg-[#0a1525] border transition-colors',
                      quest.isCompleted 
                        ? 'border-[#00ff88]/30 bg-[#00ff88]/5' 
                        : 'border-[#1a3a5c] hover:border-[#00d4ff]/50'
                    )}
                  >
                    {/* Icon */}
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      quest.isCompleted ? 'bg-[#00ff88]/20' : 'bg-[#00d4ff]/20'
                    )}>
                      {quest.isCompleted ? (
                        <Check className="w-5 h-5 text-[#00ff88]" />
                      ) : (
                        <Icon className="w-5 h-5 text-[#00d4ff]" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'font-medium mb-1',
                        quest.isCompleted ? 'text-[#00ff88] line-through' : 'text-white'
                      )}>
                        {quest.title}
                      </p>
                      
                      {/* Progress */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[#1a3a5c] rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              'h-full rounded-full transition-all',
                              quest.isCompleted ? 'bg-[#00ff88]' : 'bg-[#00d4ff]'
                            )}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-[#4a7090]">
                          {quest.progress}/{quest.maxProgress}
                        </span>
                      </div>
                    </div>

                    {/* Rewards */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-[#b44fff]">
                        <Sparkles className="w-3 h-3" />
                        <span className="text-xs font-bold">+{quest.xpReward}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#ffd700]">
                        <Coins className="w-3 h-3" />
                        <span className="text-xs font-bold">+{quest.coinReward}</span>
                      </div>
                    </div>

                    {/* Complete Button */}
                    {!quest.isCompleted && quest.progress >= quest.maxProgress && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCompleteQuest(quest.id, quest.xpReward, quest.coinReward)}
                        className="px-3 py-1 rounded-lg bg-[#00ff88] text-[#04080f] text-sm font-bold"
                      >
                        {claimLabel[language]}
                      </motion.button>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Leafy */}
          <div className="glass-panel p-4 flex justify-center">
            <LeafyCharacter size="md" />
          </div>

          {/* Quest Stats */}
          <div className="glass-panel p-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              {statisticsLabel[language]}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#4a7090]">
                  {completedTodayLabel[language]}
                </span>
                <span className="font-bold text-[#00ff88]">
                  {dailyQuests.filter(q => q.isCompleted).length}/{dailyQuests.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#4a7090]">
                  {xpEarnedLabel[language]}
                </span>
                <span className="font-bold text-[#b44fff]">+125</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#4a7090]">
                  {coinsEarnedLabel[language]}
                </span>
                <span className="font-bold text-[#ffd700]">+65</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
