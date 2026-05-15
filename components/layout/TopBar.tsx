/**
 * SmartGrow SecureAI - Top Bar
 * (c) 2026 SmartGrow AI Team. All rights reserved.
 * Protected under Ukrainian Law No. 2811-IX
 */

'use client'

import { motion } from 'framer-motion'
import { Bell, Crown } from 'lucide-react'
import { useSmartGrowStore } from '@/lib/store'
import { translations } from '@/lib/i18n'

interface TopBarProps {
  title: string
  subtitle?: string
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const { user, language } = useSmartGrowStore()
  const t = translations[language]

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold text-white"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[#4a7090] mt-1"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {/* Pro Plan Badge */}
        {user.isPro && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#ffd700] to-[#ffaa00] text-[#04080f] font-semibold text-sm"
          >
            <Crown className="w-4 h-4" />
            <span>{t.proPlan}</span>
          </motion.button>
        )}
        
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative p-2 rounded-full bg-[#0d1e30] border border-[#1a3a5c] hover:border-[#00d4ff] transition-colors"
        >
          <Bell className="w-5 h-5 text-[#c8e0f0]" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff3b5c] rounded-full text-[10px] font-bold text-white flex items-center justify-center">
            2
          </span>
        </motion.button>
      </div>
    </header>
  )
}

export function QuarantineBanner() {
  const { plant, language } = useSmartGrowStore()

  if (!plant.isQuarantined) return null

  const quarantineMessage = {
    uk: 'КАРАНТИН АКТИВОВАНО - Систему під атакою!',
    ro: 'CARANTINĂ ACTIVATĂ - Sistem sub atac!',
    en: 'QUARANTINE ACTIVE - System Under Attack!'
  }

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3 text-center font-bold text-white quarantine-banner"
    >
      <span className="animate-pulse">
        {quarantineMessage[language]}
      </span>
    </motion.div>
  )
}
