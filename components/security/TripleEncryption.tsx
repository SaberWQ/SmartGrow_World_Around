"use client"

// ============================================
// SmartGrow SecureAI - Triple Encryption Component
// ============================================
// Візуалізація потрійної шифрації банківського рівня
// AES-256-GCM + ChaCha20-Poly1305 + RSA-4096/ECDSA
// ============================================

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Key, Shield, CheckCircle, RefreshCw, Eye, EyeOff } from 'lucide-react'
import { useSmartGrowStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { cn } from '@/lib/utils'

// Типи для шифрації
interface EncryptionLayer {
  id: number
  name: string
  algorithm: string
  keySize: string
  status: 'active' | 'rotating' | 'standby'
  color: string
}

interface EncryptionKey {
  id: string
  type: 'session' | 'public' | 'private'
  fingerprint: string
  createdAt: Date
  expiresAt: Date
  algorithm: string
}

// Генерація випадкового hex рядка (імітація ключа)
function generateRandomHex(length: number): string {
  const chars = '0123456789ABCDEF'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

// Форматування ключа для відображення
function formatKey(key: string, visible: boolean): string {
  if (!visible) {
    return key.slice(0, 8) + '••••••••••••••••' + key.slice(-8)
  }
  return key.match(/.{1,4}/g)?.join(' ') || key
}

export function TripleEncryptionPanel() {
  const { language } = useSmartGrowStore()
  const t = translations[language]
  
  // Стан компонента
  const [isExpanded, setIsExpanded] = useState(false)
  const [showKeys, setShowKeys] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [lastRotation, setLastRotation] = useState(new Date(Date.now() - 3600000))
  const [nextRotation, setNextRotation] = useState(new Date(Date.now() + 82800000)) // 23 години
  
  // Шари шифрації
  const encryptionLayers: EncryptionLayer[] = [
    {
      id: 1,
      name: t.encryptionLayer1 || 'Layer 1: AES-256-GCM',
      algorithm: 'AES-256-GCM',
      keySize: '256 bits',
      status: 'active',
      color: '#00d4ff', // Cyan
    },
    {
      id: 2,
      name: t.encryptionLayer2 || 'Layer 2: ChaCha20-Poly1305',
      algorithm: 'ChaCha20-Poly1305',
      keySize: '256 bits',
      status: 'active',
      color: '#00ff88', // Green
    },
    {
      id: 3,
      name: t.encryptionLayer3 || 'Layer 3: RSA-4096 + ECDSA',
      algorithm: 'RSA-4096 + ECDSA P-384',
      keySize: '4096 bits + 384 bits',
      status: 'active',
      color: '#a855f7', // Purple
    },
  ]
  
  // Згенеровані ключі
  const [encryptionKeys, setEncryptionKeys] = useState<EncryptionKey[]>([
    {
      id: 'session-key-1',
      type: 'session',
      fingerprint: generateRandomHex(64),
      createdAt: new Date(Date.now() - 3600000),
      expiresAt: new Date(Date.now() + 82800000),
      algorithm: 'AES-256-GCM',
    },
    {
      id: 'public-key-1',
      type: 'public',
      fingerprint: generateRandomHex(128),
      createdAt: new Date(Date.now() - 86400000 * 30),
      expiresAt: new Date(Date.now() + 86400000 * 335),
      algorithm: 'RSA-4096',
    },
  ])
  
  // Анімація ротації ключів
  const handleKeyRotation = () => {
    setIsRotating(true)
    
    // Імітація ротації ключів
    setTimeout(() => {
      setEncryptionKeys(prev => prev.map(key => ({
        ...key,
        fingerprint: generateRandomHex(key.type === 'session' ? 64 : 128),
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + (key.type === 'session' ? 86400000 : 86400000 * 365)),
      })))
      setLastRotation(new Date())
      setNextRotation(new Date(Date.now() + 86400000))
      setIsRotating(false)
    }, 2000)
  }
  
  // Форматування часу
  const formatTime = (date: Date): string => {
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    
    if (diff < 0) {
      const hours = Math.floor(Math.abs(diff) / 3600000)
      return `${hours}${language === 'uk' ? ' год тому' : language === 'ro' ? ' ore în urmă' : language === 'es' ? ' horas atrás' : ' hours ago'}`
    }
    
    const hours = Math.floor(diff / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    return `${hours}h ${minutes}m`
  }
  
  // TLS та протокол інформація
  const tlsInfo = {
    version: 'TLS 1.3',
    cipherSuite: 'TLS_AES_256_GCM_SHA384',
    certificateValid: true,
    certificateExpires: new Date(Date.now() + 86400000 * 90),
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#0d1a2d] to-[#0a1525] rounded-2xl border border-[#1a3a5c] overflow-hidden"
    >
      {/* Заголовок */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#1a3a5c]/20 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div
              animate={{ rotate: isRotating ? 360 : 0 }}
              transition={{ duration: 2, ease: "linear", repeat: isRotating ? Infinity : 0 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00d4ff]/20 to-[#a855f7]/20 flex items-center justify-center"
            >
              <Lock className="w-6 h-6 text-[#00d4ff]" />
            </motion.div>
            
            {/* Індикатор активності */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-[#00ff88] rounded-full border-2 border-[#0d1a2d]"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-[#e8f4fc]">
              {t.tripleEncryption || 'Triple Encryption'}
            </h3>
            <p className="text-sm text-[#4a7090]">
              {t.bankGradeProtection || 'Bank-Grade Protection'}
            </p>
          </div>
        </div>
        
        {/* Статус */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#00ff88]/10 rounded-full border border-[#00ff88]/30">
            <CheckCircle className="w-4 h-4 text-[#00ff88]" />
            <span className="text-sm font-medium text-[#00ff88]">
              {t.encryptionActive || 'Active'}
            </span>
          </div>
          
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="w-8 h-8 rounded-lg bg-[#1a3a5c]/50 flex items-center justify-center"
          >
            <svg className="w-4 h-4 text-[#4a7090]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </div>
      
      {/* Розгорнутий контент */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-4">
              
              {/* Шари шифрації */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-[#4a7090] uppercase tracking-wider">
                  {t.encryptionProtocol || 'Encryption Protocol'}
                </h4>
                
                {encryptionLayers.map((layer, index) => (
                  <motion.div
                    key={layer.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <div 
                      className="p-3 rounded-xl border transition-all"
                      style={{ 
                        backgroundColor: `${layer.color}10`,
                        borderColor: `${layer.color}30`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${layer.color}20` }}
                          >
                            <Shield className="w-4 h-4" style={{ color: layer.color }} />
                          </div>
                          
                          <div>
                            <p className="font-medium text-[#e8f4fc]">{layer.name}</p>
                            <p className="text-xs text-[#4a7090]">
                              {layer.algorithm} • {layer.keySize}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: layer.color }}
                          />
                          <span className="text-xs font-medium" style={{ color: layer.color }}>
                            {layer.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* З'єднувальна лінія */}
                    {index < encryptionLayers.length - 1 && (
                      <div className="absolute left-6 -bottom-3 w-0.5 h-6 bg-gradient-to-b from-[#1a3a5c] to-transparent" />
                    )}
                  </motion.div>
                ))}
              </div>
              
              {/* Ключі шифрації */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-[#4a7090] uppercase tracking-wider">
                    {t.sessionKey || 'Session Keys'}
                  </h4>
                  
                  <button
                    onClick={() => setShowKeys(!showKeys)}
                    className="flex items-center gap-2 text-xs text-[#4a7090] hover:text-[#00d4ff] transition-colors"
                  >
                    {showKeys ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showKeys ? 'Hide' : 'Show'}
                  </button>
                </div>
                
                {encryptionKeys.map((key) => (
                  <div 
                    key={key.id}
                    className="p-3 rounded-xl bg-[#0a1525] border border-[#1a3a5c]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-[#ffaa00]" />
                        <span className="text-sm font-medium text-[#e8f4fc] capitalize">
                          {key.type === 'session' 
                            ? (t.sessionKey || 'Session Key')
                            : (t.publicKey || 'Public Key')}
                        </span>
                      </div>
                      <span className="text-xs text-[#4a7090]">{key.algorithm}</span>
                    </div>
                    
                    <div className="font-mono text-xs text-[#4a7090] bg-[#0d1a2d] rounded-lg p-2 break-all">
                      {formatKey(key.fingerprint, showKeys)}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Ротація ключів */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0a1525] border border-[#1a3a5c]">
                <div>
                  <p className="text-sm font-medium text-[#e8f4fc]">
                    {t.keyRotation || 'Key Rotation'}
                  </p>
                  <p className="text-xs text-[#4a7090]">
                    {t.lastKeyRotation || 'Last'}: {formatTime(lastRotation)} • 
                    {t.nextKeyRotation || 'Next'}: {formatTime(nextRotation)}
                  </p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleKeyRotation}
                  disabled={isRotating}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all",
                    isRotating
                      ? "bg-[#1a3a5c] text-[#4a7090] cursor-not-allowed"
                      : "bg-[#00d4ff]/20 text-[#00d4ff] hover:bg-[#00d4ff]/30"
                  )}
                >
                  <RefreshCw className={cn("w-4 h-4", isRotating && "animate-spin")} />
                  {isRotating ? 'Rotating...' : 'Rotate Now'}
                </motion.button>
              </div>
              
              {/* TLS інформація */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#0a1525] border border-[#1a3a5c]">
                  <p className="text-xs text-[#4a7090] mb-1">{t.tlsVersion || 'TLS Version'}</p>
                  <p className="text-sm font-bold text-[#00ff88]">{tlsInfo.version}</p>
                </div>
                
                <div className="p-3 rounded-xl bg-[#0a1525] border border-[#1a3a5c]">
                  <p className="text-xs text-[#4a7090] mb-1">{t.cipherSuite || 'Cipher Suite'}</p>
                  <p className="text-sm font-bold text-[#00d4ff] truncate">{tlsInfo.cipherSuite}</p>
                </div>
                
                <div className="col-span-2 p-3 rounded-xl bg-[#0a1525] border border-[#1a3a5c]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#4a7090] mb-1">{t.certificateValid || 'Certificate Valid'}</p>
                      <p className="text-sm font-bold text-[#00ff88]">
                        SSL/TLS Certificate • 
                        Expires: {tlsInfo.certificateExpires.toLocaleDateString()}
                      </p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-[#00ff88]" />
                  </div>
                </div>
              </div>
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
