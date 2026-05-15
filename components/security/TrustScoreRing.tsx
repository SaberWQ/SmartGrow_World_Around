/**
 * SmartGrow SecureAI - Trust Score Ring Component
 * (c) 2026 SmartGrow AI Team. All rights reserved.
 * Protected under Ukrainian Law No. 2811-IX
 */

'use client'

import { motion } from 'framer-motion'
import { useSmartGrowStore } from '@/lib/store'
import { cn } from '@/lib/utils'

interface TrustScoreRingProps {
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function TrustScoreRing({ size = 'lg', showLabel = true }: TrustScoreRingProps) {
  const { plant, settings } = useSmartGrowStore()
  const isUk = settings.language === 'uk'
  const score = plant.trustScore

  const sizes = {
    sm: { width: 80, stroke: 6, fontSize: 18 },
    md: { width: 120, stroke: 8, fontSize: 24 },
    lg: { width: 160, stroke: 10, fontSize: 32 },
  }

  const { width, stroke, fontSize } = sizes[size]
  const radius = (width - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)

  const getColor = () => {
    if (score >= 70) return { from: '#00d4ff', to: '#00ff88' }
    if (score >= 40) return { from: '#ffaa00', to: '#ff8800' }
    return { from: '#ff3b5c', to: '#ff0044' }
  }

  const colors = getColor()

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width, height: width }}>
        <svg
          width={width}
          height={width}
          viewBox={`0 0 ${width} ${width}`}
          className="transform -rotate-90"
        >
          {/* Track */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke="#0a1525"
            strokeWidth={stroke}
          />
          
          {/* Progress */}
          <defs>
            <linearGradient id="trustGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.from} />
              <stop offset="100%" stopColor={colors.to} />
            </linearGradient>
          </defs>
          
          <motion.circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke="url(#trustGradient)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
            className={cn(score < 40 && 'animate-pulse-glow')}
            style={{ filter: `drop-shadow(0 0 8px ${colors.from})` }}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={score}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-[var(--font-orbitron)] font-bold text-gradient-cyan"
            style={{ fontSize }}
          >
            {score}%
          </motion.span>
          {showLabel && (
            <span className="text-[8px] text-[#4a7090] tracking-widest uppercase mt-1">
              Trust Score
            </span>
          )}
        </div>
      </div>

      {/* Status Chip */}
      {showLabel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={cn(
            'mt-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1',
            score >= 70 
              ? 'bg-[#00ff88]/20 text-[#00ff88]' 
              : score >= 40
                ? 'bg-[#ffaa00]/20 text-[#ffaa00]'
                : 'bg-[#ff3b5c]/20 text-[#ff3b5c] animate-pulse'
          )}
        >
          {score >= 70 ? '✓' : '⚠'}
          <span>
            {score >= 70 
              ? (isUk ? 'ЗАХИЩЕНО' : 'SECURE')
              : score >= 40
                ? (isUk ? 'УВАГА' : 'WARNING')
                : (isUk ? 'КАРАНТИН' : 'QUARANTINE')
            }
          </span>
        </motion.div>
      )}
    </div>
  )
}
