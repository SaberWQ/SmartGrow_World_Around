/**
 * SmartGrow SecureAI - Bottom Navigation (Mobile)
 * (c) 2026 SmartGrow AI Team. All rights reserved.
 * Protected under Ukrainian Law No. 2811-IX
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Leaf, 
  CheckSquare, 
  MessageCircle, 
  Shield, 
  MoreHorizontal
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSmartGrowStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { useState } from 'react'

export function BottomNav() {
  const pathname = usePathname()
  const { language } = useSmartGrowStore()
  const t = translations[language]
  const [showMore, setShowMore] = useState(false)

  const mainNavItems = [
    { href: '/plant', label: t.plant, icon: Leaf },
    { href: '/tasks', label: t.tasks, icon: CheckSquare },
    { href: '/ai-chat', label: t.aiChat, icon: MessageCircle },
    { href: '/security', label: t.security, icon: Shield },
  ]

  const moreNavItems = [
    { href: '/data', label: t.data },
    { href: '/shop', label: t.shop },
    { href: '/settings', label: t.settings },
  ]

  const moreLabel = language === 'uk' ? 'Більше' : language === 'ro' ? 'Mai mult' : 'More'

  return (
    <>
      {/* More Menu Overlay */}
      {showMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowMore(false)}
        />
      )}

      {/* More Menu */}
      {showMore && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-16 left-4 right-4 bg-[#0d1e30] border border-[#1a3a5c] rounded-2xl p-2 z-50 md:hidden"
        >
          {moreNavItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => setShowMore(false)}
            >
              <div className={cn(
                'px-4 py-3 rounded-xl transition-colors',
                pathname === item.href 
                  ? 'bg-[rgba(37,99,235,0.3)] text-[#00d4ff]'
                  : 'text-[#c8e0f0] hover:bg-[#0a1525]'
              )}>
                {item.label}
              </div>
            </Link>
          ))}
        </motion.div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[rgba(13,30,48,0.95)] backdrop-blur-xl border-t border-[#1a3a5c] z-40 md:hidden">
        <div className="flex items-center justify-around h-full px-2">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center justify-center py-2"
                >
                  <Icon 
                    className={cn(
                      'w-5 h-5 mb-1 transition-colors',
                      isActive ? 'text-[#00d4ff]' : 'text-[#4a7090]'
                    )} 
                  />
                  {isActive && (
                    <span className="text-[10px] font-medium text-[#00d4ff]">
                      {item.label}
                    </span>
                  )}
                </motion.div>
              </Link>
            )
          })}
          
          {/* More Button */}
          <button 
            onClick={() => setShowMore(!showMore)}
            className="flex-1"
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center justify-center py-2"
            >
              <MoreHorizontal 
                className={cn(
                  'w-5 h-5 mb-1 transition-colors',
                  showMore ? 'text-[#00d4ff]' : 'text-[#4a7090]'
                )} 
              />
              {showMore && (
                <span className="text-[10px] font-medium text-[#00d4ff]">
                  {moreLabel}
                </span>
              )}
            </motion.div>
          </button>
        </div>
      </nav>
    </>
  )
}
