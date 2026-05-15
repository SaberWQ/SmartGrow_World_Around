/**
 * SmartGrow SecureAI - Security Event Log Component
 * (c) 2026 SmartGrow AI Team. All rights reserved.
 * Protected under Ukrainian Law No. 2811-IX
 */

'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react'
import { useSmartGrowStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { SecurityEvent } from '@/lib/types'

const severityConfig = {
  critical: { icon: AlertTriangle, color: 'text-[#ff3b5c]', bg: 'bg-[#ff3b5c]/20', badge: 'High' },
  high: { icon: AlertTriangle, color: 'text-[#ff3b5c]', bg: 'bg-[#ff3b5c]/20', badge: 'High' },
  medium: { icon: AlertCircle, color: 'text-[#ffaa00]', bg: 'bg-[#ffaa00]/20', badge: 'Medium' },
  low: { icon: Info, color: 'text-[#00ff88]', bg: 'bg-[#00ff88]/20', badge: 'Low' },
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function SecurityEventLog() {
  const { securityEvents, settings } = useSmartGrowStore()
  const isUk = settings.language === 'uk'

  return (
    <div className="glass-panel p-4">
      <h3 className="text-lg font-semibold text-white mb-4">
        {isUk ? 'Останні загрози' : 'Recent Threats'}
      </h3>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {securityEvents.length === 0 ? (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0a1525]">
            <CheckCircle className="w-5 h-5 text-[#00ff88]" />
            <span className="text-[#4a7090]">
              {isUk ? 'Загроз не виявлено' : 'No threats detected'}
            </span>
          </div>
        ) : (
          securityEvents.map((event, index) => {
            const config = severityConfig[event.severity]
            const Icon = config.icon

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg bg-[#0a1525] border-l-4',
                  event.severity === 'critical' || event.severity === 'high' 
                    ? 'border-l-[#ff3b5c]' 
                    : event.severity === 'medium'
                      ? 'border-l-[#ffaa00]'
                      : 'border-l-[#00ff88]'
                )}
              >
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', config.bg)}>
                  <Icon className={cn('w-4 h-4', config.color)} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white truncate">{event.title}</span>
                    <span className={cn(
                      'text-[10px] px-2 py-0.5 rounded-full font-bold',
                      config.bg, config.color
                    )}>
                      {config.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#4a7090] truncate">{event.description}</p>
                </div>
                
                <span className="text-xs text-[#4a7090] whitespace-nowrap">
                  {formatTimeAgo(event.timestamp)}
                </span>
              </motion.div>
            )
          })
        )}
      </div>

      {securityEvents.length > 0 && (
        <button className="mt-4 text-[#00d4ff] text-sm font-medium hover:underline flex items-center gap-1">
          {isUk ? 'Переглянути всі загрози' : 'View All Threats'}
          <span>→</span>
        </button>
      )}
    </div>
  )
}
