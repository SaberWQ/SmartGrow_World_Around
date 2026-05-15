/**
 * SmartGrow SecureAI - Plant Dashboard Page
 * (c) 2026 SmartGrow AI Team. All rights reserved.
 * Protected under Ukrainian Law No. 2811-IX
 */

'use client'

import { TopBar } from '@/components/layout/TopBar'
import { LeafyCharacter } from '@/components/plant/LeafyCharacter'
import { PlantStats } from '@/components/plant/PlantStats'
import { SpeechBubble } from '@/components/plant/SpeechBubble'
import { QuickActions } from '@/components/plant/QuickActions'
import { EnvironmentCard } from '@/components/plant/EnvironmentCard'
import { useSmartGrowStore } from '@/lib/store'
import { translations } from '@/lib/i18n'

export default function PlantPage() {
  const { language } = useSmartGrowStore()
  const t = translations[language]

  return (
    <div>
      <TopBar 
        title={t.welcomeBack}
        subtitle={t.plantHappyHealthy}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Plant Character & Stats */}
        <div className="space-y-6">
          {/* Plant Stats */}
          <div className="glass-panel p-6">
            <PlantStats />
          </div>

          {/* Character */}
          <div className="flex justify-center py-4">
            <LeafyCharacter size="lg" />
          </div>

          {/* Speech Bubble */}
          <SpeechBubble />
        </div>

        {/* Right Column - Actions & Environment */}
        <div className="space-y-6">
          <QuickActions />
          <EnvironmentCard />
        </div>
      </div>
    </div>
  )
}
