"use client"

import { motion } from 'framer-motion'
import { 
  Settings, 
  Globe, 
  Palette, 
  Volume2, 
  Bell, 
  Droplets, 
  Lock, 
  User, 
  Mail, 
  Calendar, 
  LogOut, 
  Check, 
  ChevronDown,
  Music,
  VolumeX
} from 'lucide-react'
import { useSmartGrowStore } from '@/lib/store'
import { translations, languages, type Language } from '@/lib/i18n'
import { useSound } from '@/lib/sounds'
import { useState } from 'react'

export default function SettingsPage() {
  const { settings, updateSettings, user, language, setLanguage } = useSmartGrowStore()
  const t = translations[language]
  const { playClick, playSuccess } = useSound()
  const [isLangOpen, setIsLangOpen] = useState(false)

  const toggleSetting = (key: keyof typeof settings) => {
    playClick()
    if (typeof settings[key] === 'boolean') {
      updateSettings({ [key]: !settings[key] })
    }
  }

  const handleLanguageChange = (lang: Language) => {
    playSuccess()
    setLanguage(lang)
    setIsLangOpen(false)
  }

  const getLanguageDescription = () => {
    switch (language) {
      case 'uk': return 'Оберіть мову інтерфейсу'
      case 'ro': return 'Alegeți limba interfeței'
      case 'es': return 'Elige el idioma de la interfaz'
      default: return 'Choose interface language'
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 md:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-7 h-7 text-primary" />
          {t.settingsTitle}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{t.managePreferences}</p>
      </div>

      {/* Language Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{t.language}</h3>
            <p className="text-sm text-muted-foreground">{getLanguageDescription()}</p>
          </div>
        </div>

        <div className="relative">
          <motion.button
            onClick={() => { playClick(); setIsLangOpen(!isLangOpen); }}
            className="w-full flex items-center justify-between p-4 bg-background rounded-xl border border-border hover:border-primary/50 transition-colors"
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{languages[language].flag}</span>
              <span className="font-medium text-foreground">{languages[language].name}</span>
            </div>
            <motion.div
              animate={{ rotate: isLangOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </motion.button>

          {isLangOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl overflow-hidden shadow-xl"
            >
              {(Object.keys(languages) as Language[]).map((lang) => (
                <motion.button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${
                    language === lang ? 'bg-primary/10' : ''
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{languages[lang].flag}</span>
                    <span className="font-medium text-foreground">{languages[lang].name}</span>
                  </div>
                  {language === lang && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Theme Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Palette className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{t.theme}</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <motion.button
            className={`p-4 rounded-xl border-2 transition-colors ${
              settings.theme === 'light' 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => { playClick(); updateSettings({ theme: 'light' }); }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-full aspect-video bg-white rounded-lg mb-2 border" />
            <span className="text-sm font-medium text-foreground">{t.light}</span>
          </motion.button>
          <motion.button
            className={`p-4 rounded-xl border-2 transition-colors ${
              settings.theme === 'dark' 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => { playClick(); updateSettings({ theme: 'dark' }); }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-full aspect-video bg-slate-900 rounded-lg mb-2 border border-slate-700" />
            <span className="text-sm font-medium text-foreground">{t.dark}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Sound Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-2xl p-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <Music className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{t.soundEffects}</h3>
            <p className="text-sm text-muted-foreground">
              {settings.soundEnabled ? t.enabled : t.disabled}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Master Sound Toggle */}
          <div className="flex items-center justify-between p-3 bg-background rounded-xl">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-cyan-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              )}
              <span className="font-medium text-foreground">{t.sound}</span>
            </div>
            <motion.button
              onClick={() => toggleSetting('soundEnabled')}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${
                settings.soundEnabled ? 'bg-primary' : 'bg-muted'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: settings.soundEnabled ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>

          {/* Notification Sound */}
          <div className="flex items-center justify-between p-3 bg-background rounded-xl">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-amber-400" />
              <span className="text-muted-foreground">{t.notificationSound}</span>
            </div>
            <motion.button
              onClick={() => { playClick(); updateSettings({ notificationSoundEnabled: !settings.notificationSoundEnabled }); }}
              disabled={!settings.soundEnabled}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${
                settings.notificationSoundEnabled && settings.soundEnabled ? 'bg-amber-500' : 'bg-muted'
              } ${!settings.soundEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileTap={settings.soundEnabled ? { scale: 0.95 } : {}}
            >
              <motion.div
                className="w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: settings.notificationSoundEnabled && settings.soundEnabled ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>

          {/* Action Sound */}
          <div className="flex items-center justify-between p-3 bg-background rounded-xl">
            <div className="flex items-center gap-3">
              <Droplets className="w-5 h-5 text-blue-400" />
              <span className="text-muted-foreground">{t.actionSound}</span>
            </div>
            <motion.button
              onClick={() => { playClick(); updateSettings({ actionSoundEnabled: !settings.actionSoundEnabled }); }}
              disabled={!settings.soundEnabled}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${
                settings.actionSoundEnabled && settings.soundEnabled ? 'bg-blue-500' : 'bg-muted'
              } ${!settings.soundEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileTap={settings.soundEnabled ? { scale: 0.95 } : {}}
            >
              <motion.div
                className="w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: settings.actionSoundEnabled && settings.soundEnabled ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Toggle Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl divide-y divide-border"
      >
        {/* Notifications */}
        <SettingToggle
          icon={<Bell className="w-5 h-5 text-amber-400" />}
          iconBg="bg-amber-500/20"
          title={t.notifications}
          description={settings.notificationsEnabled ? t.enabled : t.disabled}
          isEnabled={settings.notificationsEnabled}
          onToggle={() => toggleSetting('notificationsEnabled')}
        />

        {/* Auto Watering */}
        <SettingToggle
          icon={<Droplets className="w-5 h-5 text-cyan-400" />}
          iconBg="bg-cyan-500/20"
          title={t.autoWatering}
          description={settings.autoWatering ? t.enabled : t.disabled}
          isEnabled={settings.autoWatering}
          onToggle={() => toggleSetting('autoWatering')}
        />

        {/* Privacy Mode */}
        <SettingToggle
          icon={<Lock className="w-5 h-5 text-green-400" />}
          iconBg="bg-green-500/20"
          title={t.privacyMode}
          description={t.keepDataLocal}
          isEnabled={settings.privacyMode}
          onToggle={() => toggleSetting('privacyMode')}
        />
      </motion.div>

      {/* Account Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-2xl p-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-500/20 flex items-center justify-center">
            <User className="w-5 h-5 text-slate-400" />
          </div>
          <h3 className="font-semibold text-foreground">{t.account}</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-background rounded-xl">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">{t.email}</span>
            </div>
            <span className="text-foreground font-medium">{user.email}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded-xl">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">{t.memberSince}</span>
            </div>
            <span className="text-foreground font-medium">
              {new Date(user.memberSince).toLocaleDateString(
                language === 'uk' ? 'uk-UA' : 
                language === 'ro' ? 'ro-RO' : 
                language === 'es' ? 'es-ES' : 'en-US',
                { month: 'short', year: 'numeric' }
              )}
            </span>
          </div>
        </div>

        <motion.button
          className="w-full mt-4 flex items-center justify-center gap-2 p-3 bg-red-500/10 text-red-500 rounded-xl font-medium hover:bg-red-500/20 transition-colors"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => playClick()}
        >
          <LogOut className="w-5 h-5" />
          {t.logout}
        </motion.button>
      </motion.div>

      {/* Copyright Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center text-xs text-muted-foreground py-4"
      >
        <p>© 2026 SmartGrow AI Team. All rights reserved.</p>
        <p className="mt-1">Protected under Ukrainian Law No. 2811-IX</p>
      </motion.div>
    </div>
  )
}

function SettingToggle({
  icon,
  iconBg,
  title,
  description,
  isEnabled,
  onToggle,
}: {
  icon: React.ReactNode
  iconBg: string
  title: string
  description: string
  isEnabled: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <h4 className="font-medium text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <motion.button
        onClick={onToggle}
        className={`w-14 h-8 rounded-full p-1 transition-colors ${
          isEnabled ? 'bg-primary' : 'bg-muted'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="w-6 h-6 bg-white rounded-full shadow-md"
          animate={{ x: isEnabled ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  )
}
