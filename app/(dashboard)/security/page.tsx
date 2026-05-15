/**
 * SmartGrow SecureAI - Security Center Page
 * (c) 2026 SmartGrow AI Team. All rights reserved.
 * Protected under Ukrainian Law No. 2811-IX
 * 
 * Cybersecurity Features (inspired by FSociety & Kraken):
 * - Intrusion Detection System (IDS)
 * - Anomaly Detection
 * - Rate Limiting / DDoS Protection
 * - SQL Injection Prevention
 * - XSS Protection
 * - Replay Attack Prevention
 * - Sensor Spoofing Detection
 * - Data Poisoning Detection
 * - Zero-Trust Architecture
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, AlertTriangle, Wifi, Clock, Search, Lock, FileText, Settings,
  Zap, Eye, Bug, Database, Server, Radio, Activity, ShieldAlert,
  ShieldCheck, ShieldOff, Skull, Terminal, Code, Binary
} from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { TrustScoreRing } from '@/components/security/TrustScoreRing'
import { SecurityEventLog } from '@/components/security/SecurityEventLog'
import { AttackSimulator } from '@/components/security/AttackSimulator'
import { TripleEncryptionPanel } from '@/components/security/TripleEncryption'
import { useSmartGrowStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { useSound } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area, PieChart, Pie, Cell } from 'recharts'

// ============================================
// ТИПИ АТАК (Attack Types)
// ============================================

type AttackType = 
  | 'sql_injection' 
  | 'xss' 
  | 'ddos' 
  | 'sensor_spoofing' 
  | 'data_poisoning' 
  | 'brute_force' 
  | 'replay_attack'
  | 'mitm'
  | 'command_injection'
  | 'path_traversal'

interface ThreatInfo {
  id: string
  type: AttackType
  name: { uk: string; ro: string; en: string; es: string }
  description: { uk: string; ro: string; en: string; es: string }
  severity: 'low' | 'medium' | 'high' | 'critical'
  icon: typeof Shield
  color: string
  blocked: boolean
  timestamp: Date
  sourceIP: string
}

// ============================================
// ГЕНЕРАЦІЯ ДАНИХ ЗАГРОЗ
// ============================================

// Generate threat activity data for the last 24 hours
const generateThreatData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    suspicious: Math.floor(Math.random() * 30) + 5,
    blocked: Math.floor(Math.random() * 20) + 2,
    anomalies: Math.floor(Math.random() * 15) + 1,
  }))
}

// Pie chart data for attack distribution
const attackDistribution = [
  { name: 'SQL Injection', value: 35, color: '#ff3b5c' },
  { name: 'XSS', value: 25, color: '#ffaa00' },
  { name: 'DDoS', value: 20, color: '#b44fff' },
  { name: 'Sensor Spoofing', value: 12, color: '#00d4ff' },
  { name: 'Other', value: 8, color: '#4a7090' },
]

// ============================================
// КОМПОНЕНТ СТОРІНКИ
// ============================================

export default function SecurityPage() {
  const { plant, language, simulateAttack, resetSystem } = useSmartGrowStore()
  const t = translations[language]
  const { playAttack, playSuccess, playAlert } = useSound()
  
  const [threatData, setThreatData] = useState(generateThreatData())
  const [selectedAttackType, setSelectedAttackType] = useState<AttackType | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [recentThreats, setRecentThreats] = useState<ThreatInfo[]>([])
  const [showThreatModal, setShowThreatModal] = useState(false)
  const [livePackets, setLivePackets] = useState<string[]>([])

  // Локалізовані рядки
  const threatLevelValues = {
    low: { uk: 'Низький', ro: 'Scazut', en: 'Low', es: 'Bajo' },
    medium: { uk: 'Середній', ro: 'Mediu', en: 'Medium', es: 'Medio' },
    high: { uk: 'Високий', ro: 'Ridicat', en: 'High', es: 'Alto' },
    critical: { uk: 'Критичний', ro: 'Critic', en: 'Critical', es: 'Critico' }
  }

  const labels = {
    noThreats: { uk: 'Активних загроз немає', ro: 'Fara amenintari active', en: 'No active threats', es: 'Sin amenazas activas' },
    threatsDetected: { uk: 'Виявлено загрози!', ro: 'Amenintari detectate!', en: 'Threats detected!', es: 'Amenazas detectadas!' },
    allDevicesSecured: { uk: 'Всі пристрої захищені', ro: 'Toate dispozitivele securizate', en: 'All devices secured', es: 'Todos los dispositivos seguros' },
    nextScan: { uk: 'Наступне через 58с', ro: 'Urmatoarea in 58s', en: 'Next scan in 58s', es: 'Siguiente escaneo en 58s' },
    secure: { uk: 'Захищено', ro: 'Securizat', en: 'Secure', es: 'Seguro' },
    quarantine: { uk: 'Карантин', ro: 'Carantina', en: 'Quarantine', es: 'Cuarentena' },
    suspiciousActivity: { uk: 'Підозріла активність', ro: 'Activitate suspecta', en: 'Suspicious Activity', es: 'Actividad sospechosa' },
    blocked: { uk: 'Заблоковано', ro: 'Blocat', en: 'Blocked', es: 'Bloqueado' },
    anomalies: { uk: 'Аномалії', ro: 'Anomalii', en: 'Anomalies', es: 'Anomalias' },
    scanning: { uk: 'Сканування...', ro: 'Scanare...', en: 'Scanning...', es: 'Escaneando...' },
    attackTypes: { uk: 'Типи атак', ro: 'Tipuri de atacuri', en: 'Attack Types', es: 'Tipos de ataques' },
    liveMonitor: { uk: 'Монітор у реальному часі', ro: 'Monitor in timp real', en: 'Live Monitor', es: 'Monitor en vivo' },
    zeroTrust: { uk: 'Zero-Trust захист', ro: 'Protectie Zero-Trust', en: 'Zero-Trust Protection', es: 'Proteccion Zero-Trust' },
    idsActive: { uk: 'IDS активна', ro: 'IDS activ', en: 'IDS Active', es: 'IDS activo' },
    packetsAnalyzed: { uk: 'Пакетів проаналізовано', ro: 'Pachete analizate', en: 'Packets Analyzed', es: 'Paquetes analizados' },
  }

  // Симуляція live пакетів (як у Wireshark)
  useEffect(() => {
    const interval = setInterval(() => {
      const protocols = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'MQTT', 'CoAP']
      const ips = ['192.168.1.', '10.0.0.', '172.16.0.']
      const ports = [80, 443, 1883, 5683, 8080, 3000]
      
      const newPacket = `${protocols[Math.floor(Math.random() * protocols.length)]} ${ips[Math.floor(Math.random() * ips.length)]}${Math.floor(Math.random() * 254) + 1}:${ports[Math.floor(Math.random() * ports.length)]} → ${ips[Math.floor(Math.random() * ips.length)]}${Math.floor(Math.random() * 254) + 1}:${ports[Math.floor(Math.random() * ports.length)]}`
      
      setLivePackets(prev => [...prev.slice(-9), newPacket])
    }, 500)
    
    return () => clearInterval(interval)
  }, [])

  // Оновлення даних загроз кожні 30 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      setThreatData(generateThreatData())
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  // Функція сканування
  const handleScan = async () => {
    setIsScanning(true)
    setScanProgress(0)
    
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setScanProgress(i)
    }
    
    playSuccess()
    setIsScanning(false)
    setScanProgress(0)
  }

  // Статистика безпеки
  const stats = [
    {
      label: t.threatLevel,
      value: plant.trustScore >= 70 ? threatLevelValues.low[language] : plant.trustScore >= 40 ? threatLevelValues.medium[language] : threatLevelValues.critical[language],
      subtext: plant.trustScore >= 70 ? labels.noThreats[language] : labels.threatsDetected[language],
      color: plant.trustScore >= 70 ? 'text-[#00ff88]' : plant.trustScore >= 40 ? 'text-[#ffaa00]' : 'text-[#ff3b5c]',
      icon: AlertTriangle,
    },
    {
      label: t.devicesOnline,
      value: '5 / 5',
      subtext: labels.allDevicesSecured[language],
      color: 'text-[#00d4ff]',
      icon: Wifi,
    },
    {
      label: t.lastScan,
      value: `2 ${t.minAgo}`,
      subtext: labels.nextScan[language],
      color: 'text-[#4a7090]',
      icon: Clock,
    },
  ]

  // Дії безпеки
  const securityActions = [
    { icon: Search, label: t.scanNow, desc: t.runSecurityScan, color: '#00d4ff', action: handleScan },
    { icon: Lock, label: t.quarantineDevice, desc: t.isolateSuspicious, color: '#ff3b5c', action: () => simulateAttack('sensor_spoof') },
    { icon: FileText, label: t.viewLogs, desc: t.securityEventLogs, color: '#00d4ff', action: () => {} },
    { icon: Settings, label: t.firewallRules, desc: t.manageAccessRules, color: '#b44fff', action: () => {} },
  ]

  // Типи атак з описами (FSociety/Kraken style)
  const attackTypes: { type: AttackType; icon: typeof Shield; name: { uk: string; ro: string; en: string; es: string }; color: string }[] = [
    { type: 'sql_injection', icon: Database, name: { uk: 'SQL Injection', ro: 'Injectie SQL', en: 'SQL Injection', es: 'Inyeccion SQL' }, color: '#ff3b5c' },
    { type: 'xss', icon: Code, name: { uk: 'XSS Атака', ro: 'Atac XSS', en: 'XSS Attack', es: 'Ataque XSS' }, color: '#ffaa00' },
    { type: 'ddos', icon: Server, name: { uk: 'DDoS', ro: 'DDoS', en: 'DDoS', es: 'DDoS' }, color: '#b44fff' },
    { type: 'sensor_spoofing', icon: Radio, name: { uk: 'Sensor Spoofing', ro: 'Falsificare senzori', en: 'Sensor Spoofing', es: 'Falsificacion de sensores' }, color: '#00d4ff' },
    { type: 'data_poisoning', icon: Bug, name: { uk: 'Data Poisoning', ro: 'Otravire date', en: 'Data Poisoning', es: 'Envenenamiento de datos' }, color: '#ff6b6b' },
    { type: 'brute_force', icon: Zap, name: { uk: 'Brute Force', ro: 'Forta bruta', en: 'Brute Force', es: 'Fuerza bruta' }, color: '#ffd93d' },
    { type: 'replay_attack', icon: Activity, name: { uk: 'Replay Attack', ro: 'Atac replay', en: 'Replay Attack', es: 'Ataque de repeticion' }, color: '#6bcb77' },
    { type: 'mitm', icon: Eye, name: { uk: 'MITM', ro: 'MITM', en: 'Man-in-the-Middle', es: 'Man-in-the-Middle' }, color: '#9d4edd' },
  ]

  return (
    <div>
      <TopBar 
        title={t.securityCenter}
        subtitle={t.aiPoweredProtection}
      />

      {/* Zero-Trust Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'mb-6 p-4 rounded-xl border flex items-center justify-between',
          plant.isQuarantined
            ? 'bg-[#ff3b5c]/10 border-[#ff3b5c]'
            : 'bg-[#00ff88]/10 border-[#00ff88]'
        )}
      >
        <div className="flex items-center gap-3">
          {plant.isQuarantined ? (
            <ShieldOff className="w-6 h-6 text-[#ff3b5c]" />
          ) : (
            <ShieldCheck className="w-6 h-6 text-[#00ff88]" />
          )}
          <div>
            <p className={cn(
              'font-semibold',
              plant.isQuarantined ? 'text-[#ff3b5c]' : 'text-[#00ff88]'
            )}>
              {labels.zeroTrust[language]}
            </p>
            <p className="text-xs text-[#4a7090]">
              {labels.idsActive[language]} • {labels.packetsAnalyzed[language]}: {Math.floor(Math.random() * 10000) + 50000}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            'w-2 h-2 rounded-full animate-pulse',
            plant.isQuarantined ? 'bg-[#ff3b5c]' : 'bg-[#00ff88]'
          )} />
          <span className="text-sm text-[#4a7090]">
            {plant.isQuarantined ? labels.quarantine[language] : labels.secure[language]}
          </span>
        </div>
      </motion.div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Trust Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-4 flex items-center gap-4 col-span-1"
        >
          <TrustScoreRing size="sm" showLabel={false} />
          <div>
            <p className="text-sm text-[#4a7090]">{t.trustScore}</p>
            <p className="text-2xl font-bold font-[var(--font-orbitron)] text-gradient-cyan">
              {plant.trustScore}%
            </p>
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full',
              plant.trustScore >= 70 ? 'bg-[#00ff88]/20 text-[#00ff88]' : 'bg-[#ff3b5c]/20 text-[#ff3b5c]'
            )}>
              {plant.trustScore >= 70 ? labels.secure[language] : labels.quarantine[language]}
            </span>
          </div>
        </motion.div>

        {/* Other Stats */}
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index + 1) * 0.1 }}
              className="glass-panel p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  stat.color === 'text-[#00ff88]' ? 'bg-[#00ff88]/20' :
                  stat.color === 'text-[#ffaa00]' ? 'bg-[#ffaa00]/20' :
                  stat.color === 'text-[#ff3b5c]' ? 'bg-[#ff3b5c]/20' :
                  stat.color === 'text-[#00d4ff]' ? 'bg-[#00d4ff]/20' :
                  'bg-[#4a7090]/20'
                )}>
                  <Icon className={cn('w-4 h-4', stat.color)} />
                </div>
                <span className="text-sm text-[#4a7090]">{stat.label}</span>
              </div>
              <p className={cn('text-xl font-bold', stat.color)}>{stat.value}</p>
              <p className="text-xs text-[#4a7090] mt-1">{stat.subtext}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Attack Types Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-4 mb-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Skull className="w-5 h-5 text-[#ff3b5c]" />
          {labels.attackTypes[language]}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {attackTypes.map((attack) => {
            const Icon = attack.icon
            return (
              <motion.button
                key={attack.type}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedAttackType(attack.type)}
                className={cn(
                  'p-3 rounded-xl border transition-all text-center',
                  selectedAttackType === attack.type
                    ? 'border-[var(--color)] bg-[var(--color)]/10'
                    : 'border-[#1a3a5c] bg-[#0a1525] hover:border-[var(--color)]'
                )}
                style={{ '--color': attack.color } as React.CSSProperties}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2"
                  style={{ backgroundColor: `${attack.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: attack.color }} />
                </div>
                <p className="text-xs text-[#c8e0f0] font-medium truncate">
                  {attack.name[language]}
                </p>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Threat Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-4 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            {t.threatActivity}
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={threatData}>
                <defs>
                  <linearGradient id="colorSuspicious" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b44fff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#b44fff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  stroke="#4a7090" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
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
                <Area 
                  type="monotone" 
                  dataKey="suspicious" 
                  stroke="#b44fff" 
                  strokeWidth={2}
                  fill="url(#colorSuspicious)"
                  name={labels.suspiciousActivity[language]}
                />
                <Area 
                  type="monotone" 
                  dataKey="blocked" 
                  stroke="#00d4ff" 
                  strokeWidth={2}
                  fill="url(#colorBlocked)"
                  name={labels.blocked[language]}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Attack Distribution Pie */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-panel p-4"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            {labels.attackTypes[language]}
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attackDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {attackDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d1e30',
                    border: '1px solid #1a3a5c',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {attackDistribution.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-[#4a7090]">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Live Monitor & Recent Threats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Live Packet Monitor (Wireshark style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-4"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#00ff88]" />
            {labels.liveMonitor[language]}
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse ml-2" />
          </h3>
          <div className="bg-[#050a12] rounded-lg p-3 font-mono text-xs h-[200px] overflow-hidden">
            <AnimatePresence mode="popLayout">
              {livePackets.map((packet, index) => (
                <motion.div
                  key={`${packet}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    'py-1 border-b border-[#1a3a5c]/30',
                    packet.includes('HTTP') ? 'text-[#00d4ff]' :
                    packet.includes('MQTT') ? 'text-[#00ff88]' :
                    packet.includes('TCP') ? 'text-[#b44fff]' :
                    'text-[#4a7090]'
                  )}
                >
                  <span className="text-[#4a7090]">[{new Date().toLocaleTimeString()}]</span> {packet}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Recent Threats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <SecurityEventLog />
        </motion.div>
      </div>

      {/* Security Actions & Attack Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-4"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            {t.securityActions}
          </h3>
          
          {/* Scanning Progress */}
          {isScanning && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#00d4ff]">{labels.scanning[language]}</span>
                <span className="text-[#4a7090]">{scanProgress}%</span>
              </div>
              <div className="h-2 bg-[#0a1525] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88]"
                  initial={{ width: 0 }}
                  animate={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            {securityActions.map((action) => {
              const Icon = action.icon
              return (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.action}
                  disabled={isScanning}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-xl bg-[#0a1525] border border-[#1a3a5c] hover:border-[var(--color)] transition-all text-left',
                    isScanning && 'opacity-50 cursor-not-allowed'
                  )}
                  style={{ '--color': action.color } as React.CSSProperties}
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${action.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: action.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#c8e0f0]">{action.label}</p>
                    <p className="text-xs text-[#4a7090]">{action.desc}</p>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Attack Simulator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <AttackSimulator />
        </motion.div>
      </div>

      {/* Triple Encryption Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-6"
      >
        <TripleEncryptionPanel />
      </motion.div>
    </div>
  )
}
