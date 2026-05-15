/**
 * SmartGrow SecureAI - Environment Card Component
 * (c) 2026 SmartGrow AI Team. All rights reserved.
 * Protected under Ukrainian Law No. 2811-IX
 */

'use client'

import { motion } from 'framer-motion'
import { Thermometer, Droplets, Sprout, FlaskConical, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useSmartGrowStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const sensorIcons = {
  temperature: Thermometer,
  humidity: Droplets,
  soil_moisture: Sprout,
  ph: FlaskConical,
}

export function EnvironmentCard() {
  const { sensors, language } = useSmartGrowStore()
  const t = translations[language]

  const displaySensors = sensors.slice(0, 4)

  return (
    <div className="glass-panel p-4">
      <h3 className="text-lg font-semibold text-white mb-4">
        {t.environment}
      </h3>

      <div className="space-y-3">
        {displaySensors.map((sensor, index) => {
          const Icon = sensorIcons[sensor.type as keyof typeof sensorIcons] || Thermometer
          const isAnomalous = sensor.value > 1000 || sensor.value < -50

          return (
            <motion.div
              key={sensor.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg bg-[#0a1525]',
                isAnomalous && 'border border-[#ff3b5c] animate-pulse'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  isAnomalous ? 'bg-[#ff3b5c]/20' : 'bg-[#00d4ff]/20'
                )}>
                  <Icon className={cn(
                    'w-4 h-4',
                    isAnomalous ? 'text-[#ff3b5c]' : 'text-[#00d4ff]'
                  )} />
                </div>
                <span className="text-[#c8e0f0]">{sensor.name}</span>
              </div>
              <span className={cn(
                'font-mono font-bold',
                isAnomalous ? 'text-[#ff3b5c]' : 'text-white'
              )}>
                {sensor.value}{sensor.unit}
              </span>
            </motion.div>
          )
        })}
      </div>

      <Link href="/data">
        <motion.button
          whileHover={{ x: 5 }}
          className="mt-4 flex items-center gap-1 text-[#00d4ff] text-sm font-medium hover:underline"
        >
          {t.viewAllData}
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </Link>
    </div>
  )
}
