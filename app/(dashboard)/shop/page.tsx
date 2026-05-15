"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, 
  Coins, 
  Star, 
  Crown, 
  Zap, 
  MessageCircle, 
  BarChart3, 
  Bell, 
  Palette, 
  Ban,
  Gift,
  Check,
  Sparkles
} from 'lucide-react'
import { useSmartGrowStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { useSound } from '@/lib/sounds'

const shopItems = [
  { id: 1, name: 'Leaf Crown', nameUk: 'Листкова корона', nameRo: 'Coroana de frunze', nameEs: 'Corona de hojas', price: 500, category: 'accessories', rarity: 'rare' },
  { id: 2, name: 'Magic Glasses', nameUk: 'Чарівні окуляри', nameRo: 'Ochelari magici', nameEs: 'Gafas magicas', price: 750, category: 'accessories', rarity: 'epic' },
  { id: 3, name: 'Butterfly Wings', nameUk: 'Крила метелика', nameRo: 'Aripi de fluture', nameEs: 'Alas de mariposa', price: 1000, category: 'accessories', rarity: 'legendary' },
  { id: 4, name: 'Rainbow Scarf', nameUk: 'Веселковий шарф', nameRo: 'Esarfa curcubeu', nameEs: 'Bufanda arcoiris', price: 600, category: 'clothing', rarity: 'rare' },
  { id: 5, name: 'Star Hat', nameUk: 'Зоряний капелюх', nameRo: 'Palarie stea', nameEs: 'Sombrero estrella', price: 800, category: 'clothing', rarity: 'epic' },
  { id: 6, name: 'Moon Pendant', nameUk: 'Місячний кулон', nameRo: 'Pandantiv luna', nameEs: 'Colgante luna', price: 900, category: 'accessories', rarity: 'legendary' },
  { id: 7, name: 'Sunflower Pin', nameUk: 'Значок соняшника', nameRo: 'Insigna floarea soarelui', nameEs: 'Pin girasol', price: 300, category: 'accessories', rarity: 'common' },
  { id: 8, name: 'Garden Boots', nameUk: 'Садові чоботи', nameRo: 'Cizme de gradina', nameEs: 'Botas de jardin', price: 450, category: 'clothing', rarity: 'common' },
]

const tokenPackages = [
  { id: 1, tokens: 100, price: 0.99, bonus: 0 },
  { id: 2, tokens: 500, price: 3.99, bonus: 50 },
  { id: 3, tokens: 1000, price: 6.99, bonus: 150 },
  { id: 4, tokens: 2500, price: 14.99, bonus: 500 },
]

const rarityColors = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-amber-400 to-orange-500',
}

const rarityGlow = {
  common: '',
  rare: 'shadow-blue-500/20',
  epic: 'shadow-purple-500/30',
  legendary: 'shadow-amber-500/40',
}

export default function ShopPage() {
  const { user, language, addCoins } = useSmartGrowStore()
  const t = translations[language]
  const { playClick, playPurchase, playSuccess } = useSound()
  
  const [activeCategory, setActiveCategory] = useState('all')
  const [showProModal, setShowProModal] = useState(false)
  const [ownedItems, setOwnedItems] = useState<number[]>([])
  const [equippedItem, setEquippedItem] = useState<number | null>(null)

  const categories = [
    { id: 'all', label: t.allItems },
    { id: 'clothing', label: t.clothing },
    { id: 'accessories', label: t.accessories },
    { id: 'treats', label: t.treats },
    { id: 'decorations', label: t.decorations },
  ]

  const getItemName = (item: typeof shopItems[0]) => {
    if (language === 'uk') return item.nameUk
    if (language === 'ro') return item.nameRo
    if (language === 'es') return item.nameEs
    return item.name
  }

  const filteredItems = activeCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === activeCategory)

  const handleBuyItem = (item: typeof shopItems[0]) => {
    if (user.coins >= item.price && !ownedItems.includes(item.id)) {
      playPurchase()
      addCoins(-item.price)
      setOwnedItems([...ownedItems, item.id])
    }
  }

  const handleEquipItem = (itemId: number) => {
    playClick()
    setEquippedItem(equippedItem === itemId ? null : itemId)
  }

  const proFeatures = [
    { icon: MessageCircle, label: t.unlimitedMessages },
    { icon: BarChart3, label: t.advancedAnalytics },
    { icon: Bell, label: t.priorityAlerts },
    { icon: Palette, label: t.customThemes },
    { icon: Ban, label: t.noAds },
    { icon: Gift, label: t.exclusiveItems },
  ]

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-primary" />
            {t.shopTitle}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{t.buyItemsForPlant}</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.div 
            className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2"
            whileHover={{ scale: 1.02 }}
          >
            <Coins className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-foreground">{user.coins.toLocaleString()}</span>
          </motion.div>
          <motion.button
            onClick={() => { playClick(); setShowProModal(true); }}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl px-4 py-2 font-medium shadow-lg shadow-amber-500/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Crown className="w-5 h-5" />
            <span className="hidden sm:inline">{t.proPlan}</span>
          </motion.button>
        </div>
      </div>

      {/* Pro Plan Banner */}
      <motion.div 
        className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border border-primary/30 rounded-2xl p-4 sm:p-6 cursor-pointer"
        whileHover={{ scale: 1.01 }}
        onClick={() => { playClick(); setShowProModal(true); }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        <div className="relative flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-foreground flex items-center justify-center sm:justify-start gap-2">
              {t.upgradeToPremium}
              <Sparkles className="w-5 h-5 text-amber-400" />
            </h3>
            <p className="text-muted-foreground text-sm mt-1">{t.getUnlimitedMessages}</p>
          </div>
          <motion.button
            className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.upgradeNow}
          </motion.button>
        </div>
      </motion.div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            onClick={() => { playClick(); setActiveCategory(cat.id); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              cat.id === activeCategory 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>

      {/* Shop Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => {
            const isOwned = ownedItems.includes(item.id)
            const isEquipped = equippedItem === item.id
            const canAfford = user.coins >= item.price
            
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-card border border-border rounded-2xl overflow-hidden group cursor-pointer shadow-lg ${rarityGlow[item.rarity as keyof typeof rarityGlow]}`}
                whileHover={{ y: -4 }}
              >
                <div className={`relative aspect-square bg-gradient-to-br ${rarityColors[item.rarity as keyof typeof rarityColors]} p-4`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="relative w-full h-full flex items-center justify-center">
                    <motion.div
                      className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"
                      animate={{ 
                        y: [0, -5, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Star className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 bg-black/40 backdrop-blur-sm rounded-full text-[10px] text-white uppercase font-bold">
                      {item.rarity}
                    </span>
                  </div>
                  {isOwned && (
                    <div className="absolute top-2 left-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-foreground text-sm truncate">{getItemName(item)}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-amber-400" />
                      <span className={`font-bold ${canAfford || isOwned ? 'text-foreground' : 'text-destructive'}`}>
                        {item.price}
                      </span>
                    </div>
                    {isOwned ? (
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); handleEquipItem(item.id); }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          isEquipped 
                            ? 'bg-green-500 text-white' 
                            : 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isEquipped ? t.equipped : t.equip}
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); handleBuyItem(item); }}
                        disabled={!canAfford}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          canAfford
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                        whileTap={canAfford ? { scale: 0.95 } : {}}
                      >
                        {t.buy}
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Premium Tokens Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-foreground mb-4">{t.premiumTokens}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {tokenPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="relative bg-card border border-border rounded-2xl p-4 overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => { playClick(); addCoins(pkg.tokens + pkg.bonus); playSuccess(); }}
            >
              {pkg.bonus > 0 && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                  +{pkg.bonus} BONUS
                </div>
              )}
              <div className="flex flex-col items-center py-4">
                <motion.div
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/30"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Coins className="w-8 h-8 text-white" />
                </motion.div>
                <span className="text-2xl font-bold text-foreground">{pkg.tokens}</span>
                <span className="text-muted-foreground text-sm">Tokens</span>
              </div>
              <motion.button
                className="w-full py-2 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ${pkg.price}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pro Plan Modal */}
      <AnimatePresence>
        {showProModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowProModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="text-center mb-6">
                <motion.div 
                  className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Crown className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground">{t.proPlan}</h2>
                <p className="text-muted-foreground mt-2">{t.getUnlimitedMessages}</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {proFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl"
                  >
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{feature.label}</span>
                    <Check className="w-5 h-5 text-green-500 ml-auto" />
                  </motion.div>
                ))}
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <motion.button
                  className="relative p-4 bg-muted rounded-2xl text-center border-2 border-transparent hover:border-primary/50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { playSuccess(); setShowProModal(false); }}
                >
                  <p className="text-2xl font-bold text-foreground">$4.99</p>
                  <p className="text-sm text-muted-foreground">{t.monthlyPrice}</p>
                </motion.button>
                <motion.button
                  className="relative p-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl text-center border-2 border-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { playSuccess(); setShowProModal(false); }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    {t.bestValue}
                  </div>
                  <p className="text-2xl font-bold text-foreground">$39.99</p>
                  <p className="text-sm text-muted-foreground">{t.yearlyPrice}</p>
                </motion.button>
              </div>

              {/* Subscribe Button */}
              <motion.button
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-amber-500/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { playSuccess(); setShowProModal(false); }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  {t.subscribe}
                </span>
              </motion.button>

              {/* Current Plan Info */}
              <p className="text-center text-sm text-muted-foreground mt-4">
                {t.currentPlan}: <span className="text-foreground font-medium">{t.freePlan}</span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
