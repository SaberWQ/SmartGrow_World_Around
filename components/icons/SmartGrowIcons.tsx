"use client"

// ============================================
// SmartGrow SecureAI - Кастомні SVG іконки
// ============================================
// Замість lucide-react використовуємо власні іконки
// з пакету smartgrow_v0_assets
// ============================================

import Image from 'next/image'

interface IconProps {
  className?: string
  size?: number
  color?: string
}

// ============================================
// ОСНОВНІ ІКОНКИ
// ============================================

/** Логотип SmartGrow */
export function LogoIcon({ className, size = 24 }: IconProps) {
  return (
    <Image
      src="/icons/logo.svg"
      alt="SmartGrow Logo"
      width={size}
      height={size}
      className={className}
    />
  )
}

/** Іконка щита довіри (Trust Shield) */
export function ShieldIcon({ className, size = 24 }: IconProps) {
  return (
    <Image
      src="/icons/shield.svg"
      alt="Shield"
      width={size}
      height={size}
      className={className}
    />
  )
}

/** Іконка краплі води (Water Drop) */
export function WaterDropIcon({ className, size = 24 }: IconProps) {
  return (
    <Image
      src="/icons/water_drop.svg"
      alt="Water"
      width={size}
      height={size}
      className={className}
    />
  )
}

/** Іконка термометра */
export function ThermometerIcon({ className, size = 24 }: IconProps) {
  return (
    <Image
      src="/icons/thermometer.svg"
      alt="Temperature"
      width={size}
      height={size}
      className={className}
    />
  )
}

/** Іконка pH */
export function PhIcon({ className, size = 24 }: IconProps) {
  return (
    <Image
      src="/icons/ph.svg"
      alt="pH"
      width={size}
      height={size}
      className={className}
    />
  )
}

/** Іконка NPK */
export function NpkIcon({ className, size = 24 }: IconProps) {
  return (
    <Image
      src="/icons/npk.svg"
      alt="NPK"
      width={size}
      height={size}
      className={className}
    />
  )
}

/** Іконка Trust Ring */
export function TrustRingIcon({ className, size = 24 }: IconProps) {
  return (
    <Image
      src="/icons/trust_ring.svg"
      alt="Trust Ring"
      width={size}
      height={size}
      className={className}
    />
  )
}

// ============================================
// ІКОНКИ ДІЙ
// ============================================

/** Іконка серця (здоров'я) */
export function HeartHealthIcon({ className, size = 24 }: IconProps) {
  return (
    <Image
      src="/icons/icon_heart_health.svg"
      alt="Health"
      width={size}
      height={size}
      className={className}
    />
  )
}

/** Іконка квесту (меч) */
export function QuestSwordIcon({ className, size = 24 }: IconProps) {
  return (
    <Image
      src="/icons/icon_quest_sword.svg"
      alt="Quest"
      width={size}
      height={size}
      className={className}
    />
  )
}

/** Іконка UV світла */
export function UvLightIcon({ className, size = 24 }: IconProps) {
  return (
    <Image
      src="/icons/icon_uv_light.svg"
      alt="UV Light"
      width={size}
      height={size}
      className={className}
    />
  )
}

/** Іконка попередження про загрозу */
export function WarningThreatIcon({ className, size = 24 }: IconProps) {
  return (
    <Image
      src="/icons/icon_warning_threat.svg"
      alt="Warning"
      width={size}
      height={size}
      className={className}
    />
  )
}

/** Іконка щита довіри */
export function ShieldTrustIcon({ className, size = 24 }: IconProps) {
  return (
    <Image
      src="/icons/icon_shield_trust.svg"
      alt="Trust Shield"
      width={size}
      height={size}
      className={className}
    />
  )
}

/** Іконка води */
export function WaterIcon({ className, size = 24 }: IconProps) {
  return (
    <Image
      src="/icons/icon_water_drop.svg"
      alt="Water"
      width={size}
      height={size}
      className={className}
    />
  )
}

// ============================================
// LEAFY ПЕРСОНАЖ (6 настроїв)
// ============================================

export type LeafyMood = 'happy' | 'okay' | 'stressed' | 'suffering' | 'dying' | 'thriving'

interface LeafyProps {
  mood: LeafyMood
  className?: string
  size?: number
}

/** Leafy персонаж з різними настроями */
export function LeafyCharacterSvg({ mood, className, size = 200 }: LeafyProps) {
  const moodToFile: Record<LeafyMood, string> = {
    happy: '/leafy/leafy_happy.svg',
    okay: '/leafy/leafy_okay.svg',
    stressed: '/leafy/leafy_stressed.svg',
    suffering: '/leafy/leafy_suffering.svg',
    dying: '/leafy/leafy_dying.svg',
    thriving: '/leafy/leafy_thriving.svg',
  }

  return (
    <Image
      src={moodToFile[mood]}
      alt={`Leafy ${mood}`}
      width={size}
      height={size}
      className={className}
      priority
    />
  )
}

// ============================================
// МАГАЗИН ІКОНКИ
// ============================================

/** Корона з листя */
export function ShopLeafCrownIcon({ className, size = 64 }: IconProps) {
  return (
    <Image
      src="/shop/shop_leaf_crown.svg"
      alt="Leaf Crown"
      width={size}
      height={size}
      className={className}
    />
  )
}

/** Магічні окуляри */
export function ShopMagicGlassesIcon({ className, size = 64 }: IconProps) {
  return (
    <Image
      src="/shop/shop_magic_glasses.svg"
      alt="Magic Glasses"
      width={size}
      height={size}
      className={className}
    />
  )
}

/** Крила метелика */
export function ShopButterflyWingsIcon({ className, size = 64 }: IconProps) {
  return (
    <Image
      src="/shop/shop_butterfly_wings.svg"
      alt="Butterfly Wings"
      width={size}
      height={size}
      className={className}
    />
  )
}

// ============================================
// ФОН
// ============================================

/** Кібер фон */
export function CyberBackground({ className }: { className?: string }) {
  return (
    <Image
      src="/backgrounds/cyber_bg.svg"
      alt="Background"
      fill
      className={className}
      priority
    />
  )
}

/** Фон картки квесту */
export function QuestCardBackground({ className }: { className?: string }) {
  return (
    <Image
      src="/backgrounds/quest_card_bg.svg"
      alt="Quest Background"
      fill
      className={className}
    />
  )
}
