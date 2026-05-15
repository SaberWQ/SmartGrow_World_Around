/**
 * SmartGrow SecureAI - Sidebar Navigation
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
  BarChart3, 
  MessageCircle, 
  ShoppingBag, 
  Shield, 
  Settings,
  ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSmartGrowStore } from '@/lib/store'
import { translations } from '@/lib/i18n'

export function Sidebar() {
  const pathname = usePathname()
  const { plant, user, language } = useSmartGrowStore()
  const t = translations[language]

  const navItems = [
    { href: '/plant', label: t.plant, icon: Leaf },
    { href: '/tasks', label: t.tasks, icon: CheckSquare },
    { href: '/data', label: t.data, icon: BarChart3 },
    { href: '/ai-chat', label: t.aiChat, icon: MessageCircle, badge: 3 },
    { href: '/shop', label: t.shop, icon: ShoppingBag },
    { href: '/security', label: t.security, icon: Shield },
    { href: '/settings', label: t.settings, icon: Settings },
  ]

  return (
    <aside className="hidden md:flex flex-col w-[220px] lg:w-[240px] h-screen bg-[#070f1a] border-r border-[#1a3a5c] fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-4 border-b border-[#1a3a5c]">
        <Link href="/plant" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#00ff88] flex items-center justify-center">
            <Leaf className="w-6 h-6 text-[#04080f]" />
          </div>
          <div>
            <h1 className="font-[var(--font-orbitron)] text-lg font-bold text-gradient-cyan tracking-wider">
              SmartGrow
            </h1>
            <p className="text-xs text-[#4a7090]">AI</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  isActive 
                    ? 'bg-[rgba(37,99,235,0.3)] text-[#00d4ff]' 
                    : 'text-[#c8e0f0] hover:bg-[#0a1525]'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#00d4ff] rounded-r"
                  />
                )}
                <Icon className={cn('w-5 h-5', isActive ? 'text-[#00d4ff]' : 'text-[#4a7090]')} />
                <span className="text-sm font-medium">
                  {item.label}
                </span>
                {item.badge && (
                  <span className="ml-auto bg-[#00d4ff] text-[#04080f] text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* System Status */}
      <div className="px-4 py-3 border-t border-[#1a3a5c]">
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-2 h-2 rounded-full',
            plant.isQuarantined ? 'bg-[#ff3b5c] animate-pulse' : 'bg-[#00ff88]'
          )} />
          <span className="text-xs text-[#4a7090]">
            {t.systemStatus}
          </span>
        </div>
        <p className={cn(
          'text-sm mt-1',
          plant.isQuarantined ? 'text-[#ff3b5c]' : 'text-[#00d4ff]'
        )}>
          {plant.isQuarantined 
            ? (language === 'uk' ? 'КАРАНТИН' : language === 'ro' ? 'CARANTINA' : language === 'es' ? 'CUARENTENA' : 'QUARANTINE')
            : t.allSystemsOnline
          }
        </p>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-[#1a3a5c]">
        <button className="w-full flex items-center gap-3 hover:bg-[#0a1525] rounded-lg p-2 transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#b44fff] flex items-center justify-center text-[#04080f] font-bold text-sm">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-[#c8e0f0]">{user.name}</p>
            <p className="text-xs text-[#4a7090]">
              {t.level} {user.level}
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-[#4a7090]" />
        </button>
      </div>
    </aside>
  )
}
