/**
 * SmartGrow SecureAI - Speech Bubble Component
 * (c) 2026 SmartGrow AI Team. All rights reserved.
 * Protected under Ukrainian Law No. 2811-IX
 */

'use client'

import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import { useSmartGrowStore } from '@/lib/store'

interface SpeechBubbleProps {
  text?: string
  showSpeaker?: boolean
}

export function SpeechBubble({ text, showSpeaker = true }: SpeechBubbleProps) {
  const { currentSpeech } = useSmartGrowStore()
  const displayText = text || currentSpeech

  const speak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(displayText)
      utterance.lang = 'uk-UA'
      utterance.rate = 0.9
      utterance.pitch = 1.2
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative glass-panel p-4 max-w-sm"
    >
      {/* Speech pointer */}
      <div className="absolute -top-2 left-6 w-4 h-4 bg-[#0d1e30] border-l border-t border-[#1a3a5c] transform rotate-45" />
      
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-[#4a7090] mb-1">Leafy says:</p>
          <p className="text-[#c8e0f0] leading-relaxed">{displayText}</p>
        </div>
        
        {showSpeaker && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={speak}
            className="p-2 rounded-lg bg-[#0a1525] hover:bg-[#1a3a5c] transition-colors"
          >
            <Volume2 className="w-5 h-5 text-[#00d4ff]" />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
