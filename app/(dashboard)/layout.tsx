/**
 * SmartGrow SecureAI - Dashboard Layout
 * (c) 2026 SmartGrow AI Team. All rights reserved.
 * Protected under Ukrainian Law No. 2811-IX
 */

'use client'

import { ParticleCanvas } from '@/components/layout/ParticleCanvas'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { QuarantineBanner } from '@/components/layout/TopBar'
import { useSmartGrowStore } from '@/lib/store'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { plant } = useSmartGrowStore()

  return (
    <div className="min-h-screen bg-[#04080f] relative">
      {/* Particle Background */}
      <ParticleCanvas />
      
      {/* Quarantine Banner */}
      <QuarantineBanner />
      
      {/* Sidebar (Desktop) */}
      <Sidebar />
      
      {/* Main Content */}
      <main className={`
        relative z-10 
        md:ml-[220px] lg:ml-[240px] 
        min-h-screen 
        pb-20 md:pb-6
        ${plant.isQuarantined ? 'pt-14' : ''}
      `}>
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
      
      {/* Bottom Navigation (Mobile) */}
      <BottomNav />
    </div>
  )
}
