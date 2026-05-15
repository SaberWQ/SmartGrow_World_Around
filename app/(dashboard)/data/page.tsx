/**
 * SmartGrow SecureAI - Environmental Data Page
 * (c) 2026 SmartGrow AI Team. All rights reserved.
 * Protected under Ukrainian Law No. 2811-IX
 */

'use client'

import { motion } from 'framer-motion'
import { Thermometer, Droplets, Sprout, FlaskConical, Zap, Leaf, Circle, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { useSmartGrowStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { generateSensorHistory } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const sensorIcons = {
  temperature: Thermometer,
  humidity: Droplets,
  soil_moisture: Sprout,
  ph: FlaskConical,
  ec: Zap,
  npk: Leaf,
}

const sensorColors = {
  temperature: '#00d4ff',
  humidity: '#00a3cc',
  soil_moisture: '#00ff88',
  ph: '#ffaa00',
  ec: '#b44fff',
  npk: '#ff4da6',
}

export default function DataPage() {
  const { sensors, language } = useSmartGrowStore()
  const t = translations[language]
  const [timeRange, setTimeRange] = useState('24')

  const chartData = generateSensorHistory().map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString(
      language === 'uk' ? 'uk-UA' : language === 'ro' ? 'ro-RO' : 'en-US', 
      { hour: '2-digit', minute: '2-digit' }
    ),
    temperature: d.temperature.toFixed(1),
    humidity: d.humidity.toFixed(0),
    soilMoisture: d.soilMoisture.toFixed(0),
    ph: d.ph.toFixed(1),
  }))

  const statusLabels = {
    optimal: { uk: 'Оптимально', ro: 'Optim', en: 'Optimal' },
    good: { uk: 'Добре', ro: 'Bun', en: 'Good' },
    warning: { uk: 'Увага', ro: 'Atenție', en: 'Warning' },
    critical: { uk: 'Критично', ro: 'Critic', en: 'Critical' },
  }

  const statusColors = {
    optimal: { bg: 'bg-[#00ff88]/20', text: 'text-[#00ff88]' },
    good: { bg: 'bg-[#00d4ff]/20', text: 'text-[#00d4ff]' },
    warning: { bg: 'bg-[#ffaa00]/20', text: 'text-[#ffaa00]' },
    critical: { bg: 'bg-[#ff3b5c]/20', text: 'text-[#ff3b5c]' },
  }

  const timeRangeOptions = {
    '24': { uk: '24 Години', ro: '24 Ore', en: '24 Hours' },
    '7': { uk: '7 Днів', ro: '7 Zile', en: '7 Days' },
    '30': { uk: '30 Днів', ro: '30 Zile', en: '30 Days' },
  }

  const anomalyLabel = { uk: 'АНОМАЛІЯ', ro: 'ANOMALIE', en: 'ANOMALY' }

  return (
    <div>
      <TopBar 
        title={t.environmentalData}
        subtitle={t.realTimeSensorData}
      />

      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Circle className="w-2 h-2 fill-[#00ff88] text-[#00ff88] animate-pulse" />
          <span className="text-sm text-[#00ff88] font-medium">{t.liveView}</span>
        </div>
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none bg-[#0d1e30] border border-[#1a3a5c] rounded-lg px-4 py-2 pr-10 text-sm text-[#c8e0f0] focus:outline-none focus:border-[#00d4ff]"
          >
            {Object.entries(timeRangeOptions).map(([value, labels]) => (
              <option key={value} value={value}>{labels[language]}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a7090] pointer-events-none" />
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {sensors.map((sensor, index) => {
          const Icon = sensorIcons[sensor.type as keyof typeof sensorIcons] || Thermometer
          const color = sensorColors[sensor.type as keyof typeof sensorColors] || '#00d4ff'
          const statusColor = statusColors[sensor.status]
          const statusLabel = statusLabels[sensor.status]
          const isAnomalous = sensor.value > 1000 || sensor.value < -50

          return (
            <motion.div
              key={sensor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'glass-panel p-4 text-center',
                isAnomalous && 'border-2 border-[#ff3b5c] animate-pulse'
              )}
            >
              <div 
                className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <p className={cn(
                'text-2xl font-bold font-mono mb-1',
                isAnomalous ? 'text-[#ff3b5c]' : 'text-white'
              )}>
                {sensor.type === 'npk' ? '120-45-60' : `${sensor.value}${sensor.unit}`}
              </p>
              <p className="text-xs text-[#4a7090] mb-2">{sensor.name}</p>
              <span className={cn(
                'text-[10px] px-2 py-1 rounded-full font-medium',
                isAnomalous ? 'bg-[#ff3b5c]/20 text-[#ff3b5c]' : statusColor.bg,
                isAnomalous ? '' : statusColor.text
              )}>
                {isAnomalous ? anomalyLabel[language] : statusLabel[language]}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-4 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            {t.sensorTrends}
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="time" 
                  stroke="#4a7090" 
                  fontSize={10}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#4a7090" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d1e30',
                    border: '1px solid #1a3a5c',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#c8e0f0' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#00d4ff" 
                  strokeWidth={2}
                  dot={false}
                  name={t.temperature}
                />
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#00a3cc" 
                  strokeWidth={2}
                  dot={false}
                  name={t.humidity}
                />
                <Line 
                  type="monotone" 
                  dataKey="soilMoisture" 
                  stroke="#00ff88" 
                  strokeWidth={2}
                  dot={false}
                  name={t.soilMoisture}
                />
                <Line 
                  type="monotone" 
                  dataKey="ph" 
                  stroke="#ffaa00" 
                  strokeWidth={2}
                  dot={false}
                  name="pH"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Sensor Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-4"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            {t.sensorStatus}
          </h3>
          <div className="space-y-3">
            {sensors.map((sensor) => (
              <div key={sensor.id} className="flex items-center justify-between p-2 rounded-lg bg-[#0a1525]">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    sensor.isOnline ? 'bg-[#00ff88]' : 'bg-[#ff3b5c]'
                  )} />
                  <span className="text-sm text-[#c8e0f0]">{sensor.name}</span>
                </div>
                <span className={cn(
                  'text-xs',
                  sensor.isOnline ? 'text-[#00ff88]' : 'text-[#ff3b5c]'
                )}>
                  {sensor.isOnline ? t.online : t.offline}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#0a1525] mt-4 border-t border-[#1a3a5c] pt-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00ff88] rotate-45" />
                <span className="text-sm text-[#c8e0f0]">
                  {language === 'uk' ? "Здоров'я системи" : language === 'ro' ? 'Sănătatea sistemului' : 'System Health'}
                </span>
              </div>
              <span className="text-xs text-[#00ff88] font-medium">
                {t.excellent}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
