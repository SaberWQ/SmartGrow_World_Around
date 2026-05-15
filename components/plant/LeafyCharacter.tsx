/**
 * SmartGrow SecureAI - Leafy Character Component
 * (c) 2026 SmartGrow AI Team. All rights reserved.
 * Protected under Ukrainian Law No. 2811-IX
 * 
 * Anime plant character component with 6 mood states:
 * - dying: X_X eyes, red glow, shake animation
 * - suffering: droopy eyelids, tears, orange glow
 * - stressed: worry eyebrows, sweat, amber glow
 * - okay: normal eyes, neutral, teal glow
 * - happy: big smile, sparkles, green glow, bounce
 * - thriving: star eyes, rainbow particles, purple glow
 */

'use client'

import { motion, type Variants } from 'framer-motion'
import type { PlantMood } from '@/lib/types'
import { useSmartGrowStore } from '@/lib/store'

interface LeafyCharacterProps {
  mood?: PlantMood
  size?: 'sm' | 'md' | 'lg'
  showParticles?: boolean
}

const moodAnimations: Record<PlantMood, Variants> = {
  dying: {
    animate: {
      x: [-4, 4, -4, 4, 0],
      transition: { repeat: Infinity, duration: 0.6 }
    }
  },
  suffering: {
    animate: {
      y: [0, 5, 0],
      transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' }
    }
  },
  stressed: {
    animate: {
      rotate: [-2, 2, -2],
      transition: { repeat: Infinity, duration: 1 }
    }
  },
  okay: {
    animate: {
      y: [0, -8, 0],
      transition: { repeat: Infinity, duration: 4, ease: 'easeInOut' }
    }
  },
  happy: {
    animate: {
      y: [0, -14, 0],
      scale: [1, 1.04, 1],
      transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }
    }
  },
  thriving: {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 2, -2, 0],
      transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' }
    }
  }
}

const moodGlows: Record<PlantMood, string> = {
  dying: 'drop-shadow(0 0 20px rgba(255,59,92,0.6))',
  suffering: 'drop-shadow(0 0 15px rgba(255,102,68,0.5))',
  stressed: 'drop-shadow(0 0 12px rgba(255,170,0,0.4))',
  okay: 'drop-shadow(0 0 15px rgba(0,212,255,0.4))',
  happy: 'drop-shadow(0 0 25px rgba(0,255,136,0.6))',
  thriving: 'drop-shadow(0 0 30px rgba(180,79,255,0.7))'
}

const moodColors: Record<PlantMood, { iris: string; cheeks: string }> = {
  dying: { iris: '#ff3b5c', cheeks: '#ff6666' },
  suffering: { iris: '#ff9944', cheeks: '#ffaa88' },
  stressed: { iris: '#ffaa00', cheeks: '#ffcc88' },
  okay: { iris: '#00d4ff', cheeks: '#ffb3b3' },
  happy: { iris: '#00ff88', cheeks: '#ffb3b3' },
  thriving: { iris: '#b44fff', cheeks: '#ffccff' }
}

const sizeClasses = {
  sm: 'w-32 h-40',
  md: 'w-48 h-60',
  lg: 'w-64 h-80'
}

export function LeafyCharacter({ mood: propMood, size = 'lg', showParticles = true }: LeafyCharacterProps) {
  const { plant } = useSmartGrowStore()
  const mood = propMood || plant.mood
  const colors = moodColors[mood]
  
  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      {/* Glow Effect */}
      <div 
        className="absolute inset-0 rounded-full opacity-30 blur-3xl"
        style={{ backgroundColor: colors.iris }}
      />
      
      {/* Floating Particles */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: i % 2 === 0 ? '#00d4ff' : '#00ff88',
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Main Character */}
      <motion.div
        variants={moodAnimations[mood]}
        animate="animate"
        style={{ filter: moodGlows[mood] }}
        className="relative"
      >
        <svg 
          viewBox="0 0 200 280" 
          className={sizeClasses[size]}
          style={{ filter: moodGlows[mood] }}
        >
          {/* Earth Platform */}
          <ellipse cx="100" cy="265" rx="50" ry="12" fill="#3d2817" />
          <ellipse cx="100" cy="262" rx="45" ry="10" fill="#5c3d2e" />
          <ellipse cx="100" cy="259" rx="40" ry="8" fill="#7a5640" />
          
          {/* Legs */}
          <ellipse cx="80" cy="235" rx="12" ry="20" fill="#1a6030" />
          <ellipse cx="120" cy="235" rx="12" ry="20" fill="#1a6030" />
          
          {/* Leaf Shoes */}
          <ellipse cx="80" cy="252" rx="15" ry="8" fill="#2d8f4e" />
          <ellipse cx="120" cy="252" rx="15" ry="8" fill="#2d8f4e" />
          
          {/* Body/Dress */}
          <path 
            d="M60 180 Q50 220 70 240 L130 240 Q150 220 140 180 Q130 150 100 145 Q70 150 60 180" 
            fill="#2d8f4e" 
          />
          <path 
            d="M65 200 Q55 220 75 235 L90 235 Q85 220 70 200" 
            fill="#1a6030" 
          />
          <path 
            d="M135 200 Q145 220 125 235 L110 235 Q115 220 130 200" 
            fill="#1a6030" 
          />
          
          {/* Arms */}
          <ellipse cx="50" cy="175" rx="10" ry="20" fill="#ffd4a0" transform="rotate(-20 50 175)" />
          <ellipse cx="150" cy="175" rx="10" ry="20" fill="#ffd4a0" transform="rotate(20 150 175)" />
          
          {/* Hands */}
          <circle cx="45" cy="190" r="8" fill="#ffd4a0" />
          <circle cx="155" cy="190" r="8" fill="#ffd4a0" />
          
          {/* Face */}
          <circle cx="100" cy="100" r="55" fill="#ffd4a0" />
          
          {/* Hair */}
          <path d="M50 90 Q40 50 70 40 Q100 30 130 40 Q160 50 150 90 Q140 70 100 65 Q60 70 50 90" fill="#1a6030" />
          <path d="M45 85 Q30 60 50 35" stroke="#1a6030" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M155 85 Q170 60 150 35" stroke="#1a6030" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M100 45 Q100 20 85 10" stroke="#1a6030" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M80 50 Q70 25 55 20" stroke="#1a6030" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M120 50 Q130 25 145 20" stroke="#1a6030" strokeWidth="8" fill="none" strokeLinecap="round" />
          
          {/* Leaf Sprout */}
          <path d="M100 25 Q95 5 85 0 Q100 10 100 25" fill="#2d8f4e" />
          <path d="M100 25 Q105 5 115 0 Q100 10 100 25" fill="#2d8f4e" />
          <line x1="100" y1="45" x2="100" y2="25" stroke="#1a6030" strokeWidth="3" />
          
          {/* Eyes based on mood */}
          {mood === 'dying' ? (
            // X_X Eyes
            <>
              <g transform="translate(75, 95)">
                <line x1="-8" y1="-8" x2="8" y2="8" stroke="#ff3b5c" strokeWidth="4" strokeLinecap="round" />
                <line x1="8" y1="-8" x2="-8" y2="8" stroke="#ff3b5c" strokeWidth="4" strokeLinecap="round" />
              </g>
              <g transform="translate(125, 95)">
                <line x1="-8" y1="-8" x2="8" y2="8" stroke="#ff3b5c" strokeWidth="4" strokeLinecap="round" />
                <line x1="8" y1="-8" x2="-8" y2="8" stroke="#ff3b5c" strokeWidth="4" strokeLinecap="round" />
              </g>
            </>
          ) : mood === 'thriving' ? (
            // Star Eyes
            <>
              <polygon points="75,85 77,93 85,95 77,97 75,105 73,97 65,95 73,93" fill={colors.iris} />
              <polygon points="125,85 127,93 135,95 127,97 125,105 123,97 115,95 123,93" fill={colors.iris} />
            </>
          ) : (
            // Normal Eyes
            <>
              {/* Left Eye */}
              <ellipse cx="75" cy="95" rx="14" ry="16" fill="white" />
              <circle cx="75" cy="97" r="10" fill={colors.iris} />
              <circle cx="75" cy="97" r="5" fill="#04080f" />
              <circle cx="78" cy="93" r="3" fill="white" />
              
              {/* Right Eye */}
              <ellipse cx="125" cy="95" rx="14" ry="16" fill="white" />
              <circle cx="125" cy="97" r="10" fill={colors.iris} />
              <circle cx="125" cy="97" r="5" fill="#04080f" />
              <circle cx="128" cy="93" r="3" fill="white" />
              
              {/* Eyelids for suffering/stressed */}
              {mood === 'suffering' && (
                <>
                  <path d="M61 85 Q75 92 89 85" fill="#ffd4a0" />
                  <path d="M111 85 Q125 92 139 85" fill="#ffd4a0" />
                </>
              )}
              {mood === 'stressed' && (
                <>
                  <line x1="65" y1="80" x2="85" y2="85" stroke="#1a6030" strokeWidth="3" strokeLinecap="round" />
                  <line x1="135" y1="80" x2="115" y2="85" stroke="#1a6030" strokeWidth="3" strokeLinecap="round" />
                </>
              )}
            </>
          )}
          
          {/* Blush */}
          <ellipse cx="55" cy="115" rx="10" ry="6" fill={colors.cheeks} opacity="0.5" />
          <ellipse cx="145" cy="115" rx="10" ry="6" fill={colors.cheeks} opacity="0.5" />
          
          {/* Nose */}
          <circle cx="100" cy="110" r="3" fill="#e8c090" />
          
          {/* Mouth based on mood */}
          {mood === 'dying' && (
            <path d="M85 130 Q100 120 115 130" stroke="#ff3b5c" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}
          {mood === 'suffering' && (
            <path d="M85 130 Q100 125 115 130" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}
          {mood === 'stressed' && (
            <path d="M90 128 L110 128" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          )}
          {mood === 'okay' && (
            <path d="M90 128 Q100 132 110 128" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}
          {(mood === 'happy' || mood === 'thriving') && (
            <path d="M80 125 Q100 145 120 125" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}
          
          {/* Tears for suffering */}
          {mood === 'suffering' && (
            <>
              <motion.ellipse
                cx="60"
                cy="120"
                rx="3"
                ry="6"
                fill="#88ccff"
                animate={{ y: [0, 20], opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
              />
              <motion.ellipse
                cx="140"
                cy="120"
                rx="3"
                ry="6"
                fill="#88ccff"
                animate={{ y: [0, 20], opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
              />
            </>
          )}
          
          {/* Sweat for stressed */}
          {mood === 'stressed' && (
            <motion.ellipse
              cx="145"
              cy="70"
              rx="4"
              ry="8"
              fill="#88ccff"
              animate={{ y: [0, 10], opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
          
          {/* Sparkles for happy/thriving */}
          {(mood === 'happy' || mood === 'thriving') && (
            <>
              <motion.text
                x="45"
                y="70"
                fontSize="16"
                fill="#ffd700"
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                ✦
              </motion.text>
              <motion.text
                x="150"
                y="55"
                fontSize="14"
                fill="#ffd700"
                animate={{ scale: [1, 0.8, 1], opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: 0.3 }}
              >
                ✦
              </motion.text>
            </>
          )}
        </svg>
      </motion.div>
      
      {/* Butterflies */}
      {(mood === 'happy' || mood === 'thriving' || mood === 'okay') && (
        <>
          <motion.div
            className="absolute top-10 right-0"
            animate={{
              x: [0, 20, 0, -10, 0],
              y: [0, -10, -5, 0, 0],
            }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M12 12 Q8 6 4 8 Q2 12 6 14 Q10 14 12 12" fill="#00d4ff" opacity="0.8" />
              <path d="M12 12 Q16 6 20 8 Q22 12 18 14 Q14 14 12 12" fill="#00d4ff" opacity="0.8" />
              <circle cx="12" cy="14" r="1" fill="#04080f" />
            </svg>
          </motion.div>
          <motion.div
            className="absolute bottom-20 left-0"
            animate={{
              x: [0, -15, 0, 10, 0],
              y: [0, 5, 10, 5, 0],
            }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M12 12 Q8 6 4 8 Q2 12 6 14 Q10 14 12 12" fill="#b44fff" opacity="0.7" />
              <path d="M12 12 Q16 6 20 8 Q22 12 18 14 Q14 14 12 12" fill="#b44fff" opacity="0.7" />
              <circle cx="12" cy="14" r="1" fill="#04080f" />
            </svg>
          </motion.div>
        </>
      )}
    </div>
  )
}
