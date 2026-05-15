/**
 * SmartGrow SecureAI - AI Chat Page
 * (c) 2026 SmartGrow AI Team. All rights reserved.
 * Protected under Ukrainian Law No. 2811-IX
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Star, Sparkles, MessageCircle, Zap, Crown } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { LeafyCharacter } from '@/components/plant/LeafyCharacter'
import { useSmartGrowStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { useSound } from '@/lib/sounds'
import { cn } from '@/lib/utils'

const aiResponses = {
  uk: [
    'Жовте листя може бути викликане кількома факторами:\n1. Надмірний або недостатній полив\n2. Дефіцит поживних речовин (особливо азоту)\n3. Занадто багато прямого сонячного світла\n4. Неправильний рівень pH\n\nНа основі ваших поточних даних, рекомендую перевірити рівень поживних речовин та полив.',
    'Виходячи з ваших даних, все виглядає чудово! Температура і вологість в оптимальному діапазоні. Продовжуйте підтримувати поточний режим догляду.',
    'Я бачу, що рівень pH трохи нижчий за оптимальний (6.2). Рекомендую додати вапно або доломітову муку для підвищення pH до 6.5-7.0.',
    'Ваша рослина росте чудово! Продовжуйте в тому ж дусі! За останній тиждень вона виросла на 15%.',
    'Аналізую дані сенсорів... Вологість ґрунту 48% - це в межах норми. Наступний полив рекомендую через 4-6 годин.',
    'Помітив аномалію в даних температурного сенсора о 03:24. Система безпеки автоматично проаналізувала загрозу - це було коливання через відкриття вентиляції.',
    'Для покращення росту рекомендую:\n- Збільшити тривалість UV освітлення до 14 годин\n- Підтримувати температуру 22-24°C\n- Додати калійні добрива\n\nЦе допоможе вашій рослині досягти оптимального стану.',
    'Виявлено дефіцит азоту за кольором листя. Рекомендую внести азотні добрива (NPK 20-10-10) в кількості 5г на літр води.',
    'Система Zero-Trust виявила підозрілу активність о 14:32. Атаку типу "sensor spoofing" було заблоковано. Ваша теплиця в безпеці!',
    'На основі Machine Learning аналізу, оптимальний час для збору врожаю - через 12-14 днів. Рослина знаходиться на 85% стадії зрілості.',
    'Рівень EC (електропровідність) 1.8 mS/cm - ідеально для вашого типу рослини. Концентрація поживних речовин збалансована.',
    'Помітив, що ви не відвідували теплицю 3 дні. Все працює в автоматичному режимі, але рекомендую візуальний огляд для виявлення можливих проблем.',
  ],
  ro: [
    'Frunzele galbene pot fi cauzate de mai mulți factori:\n1. Udare excesivă sau insuficientă\n2. Deficit de nutrienți (în special azot)\n3. Prea multă lumină directă\n4. Niveluri incorecte de pH\n\nPe baza datelor actuale, recomand verificarea nivelurilor de nutrienți și udare.',
    'Pe baza datelor tale, totul arată excelent! Temperatura și umiditatea sunt în intervalul optim. Continuă regimul actual de îngrijire.',
    'Văd că nivelul pH-ului este ușor sub optim (6.2). Recomand adăugarea de var sau făină de dolomită pentru a crește pH-ul la 6.5-7.0.',
    'Planta ta crește minunat! Continuă tot așa! În ultima săptămână a crescut cu 15%.',
    'Analizez datele senzorilor... Umiditatea solului 48% - este în limite normale. Recomand următoarea udare în 4-6 ore.',
    'Am observat o anomalie în datele senzorului de temperatură la 03:24. Sistemul de securitate a analizat automat amenințarea - a fost o fluctuație cauzată de deschiderea ventilației.',
    'Pentru îmbunătățirea creșterii recomand:\n- Mărirea duratei iluminării UV la 14 ore\n- Menținerea temperaturii la 22-24°C\n- Adăugarea îngrășămintelor cu potasiu\n\nAceasta va ajuta planta să atingă starea optimă.',
    'S-a detectat deficit de azot după culoarea frunzelor. Recomand aplicarea îngrășămintelor cu azot (NPK 20-10-10) în cantitate de 5g pe litru de apă.',
    'Sistemul Zero-Trust a detectat activitate suspectă la 14:32. Atacul de tip "sensor spoofing" a fost blocat. Sera ta este în siguranță!',
    'Pe baza analizei Machine Learning, timpul optim pentru recoltare este în 12-14 zile. Planta se află la 85% din stadiul de maturitate.',
    'Nivelul EC (conductivitate electrică) 1.8 mS/cm - ideal pentru tipul tău de plantă. Concentrația nutrienților este echilibrată.',
    'Am observat că nu ai vizitat sera de 3 zile. Totul funcționează în mod automat, dar recomand o inspecție vizuală pentru detectarea posibilelor probleme.',
  ],
  en: [
    'Yellow leaves can be caused by several factors:\n1. Overwatering or underwatering\n2. Nutrient deficiency (especially nitrogen)\n3. Too much direct sunlight\n4. Incorrect pH levels\n\nBased on your current data, I recommend checking nutrient levels and watering.',
    'Based on your data, everything looks great! Temperature and humidity are in the optimal range. Keep maintaining the current care routine.',
    'I see that the pH level is slightly below optimal (6.2). I recommend adding lime or dite flour to increase pH to 6.5-7.0.',
    'Your plant is growing wonderfully! Keep up the good work! It has grown 15% in the last week.',
    'Analyzing sensor data... Soil moisture 48% - this is within normal range. I recommend the next watering in 4-6 hours.',
    'Noticed an anomaly in temperature sensor data at 03:24. The security system automatically analyzed the threat - it was a fluctuation due to ventilation opening.',
    'To improve growth, I recommend:\n- Increase UV lighting duration to 14 hours\n- Maintain temperature at 22-24°C\n- Add potassium fertilizers\n\nThis will help your plant reach optimal condition.',
    'Nitrogen deficiency detected by leaf color. I recommend applying nitrogen fertilizers (NPK 20-10-10) at 5g per liter of water.',
    'Zero-Trust system detected suspicious activity at 14:32. The "sensor spoofing" attack was blocked. Your greenhouse is safe!',
    'Based on Machine Learning analysis, optimal harvest time is in 12-14 days. The plant is at 85% maturity stage.',
    'EC level (electrical conductivity) 1.8 mS/cm - ideal for your plant type. Nutrient concentration is balanced.',
    'I noticed you haven\'t visited the greenhouse for 3 days. Everything is running in automatic mode, but I recommend a visual inspection to detect potential issues.',
  ],
  es: [
    'Las hojas amarillas pueden ser causadas por varios factores:\n1. Riego excesivo o insuficiente\n2. Deficiencia de nutrientes (especialmente nitrógeno)\n3. Demasiada luz solar directa\n4. Niveles de pH incorrectos\n\nBasándome en tus datos actuales, recomiendo verificar los niveles de nutrientes y el riego.',
    '¡Según tus datos, todo se ve genial! La temperatura y la humedad están en el rango óptimo. Sigue manteniendo la rutina de cuidado actual.',
    'Veo que el nivel de pH está ligeramente por debajo del óptimo (6.2). Recomiendo agregar cal o harina de dolomita para aumentar el pH a 6.5-7.0.',
    '¡Tu planta está creciendo maravillosamente! ¡Sigue así! Ha crecido un 15% en la última semana.',
    'Analizando datos de sensores... Humedad del suelo 48% - está dentro del rango normal. Recomiendo el próximo riego en 4-6 horas.',
    'Detecté una anomalía en los datos del sensor de temperatura a las 03:24. El sistema de seguridad analizó automáticamente la amenaza - fue una fluctuación debido a la apertura de ventilación.',
    'Para mejorar el crecimiento, recomiendo:\n- Aumentar la duración de la iluminación UV a 14 horas\n- Mantener la temperatura a 22-24°C\n- Agregar fertilizantes de potasio\n\nEsto ayudará a tu planta a alcanzar su condición óptima.',
    'Se detectó deficiencia de nitrógeno por el color de las hojas. Recomiendo aplicar fertilizantes nitrogenados (NPK 20-10-10) a 5g por litro de agua.',
    '¡El sistema Zero-Trust detectó actividad sospechosa a las 14:32. El ataque de "sensor spoofing" fue bloqueado. ¡Tu invernadero está seguro!',
    'Basado en el análisis de Machine Learning, el tiempo óptimo de cosecha es en 12-14 días. La planta está al 85% de su etapa de madurez.',
    'Nivel de EC (conductividad eléctrica) 1.8 mS/cm - ideal para tu tipo de planta. La concentración de nutrientes está equilibrada.',
    'Noté que no has visitado el invernadero en 3 días. Todo funciona en modo automático, pero recomiendo una inspección visual para detectar posibles problemas.',
  ],
}

export default function AiChatPage() {
  const { chatMessages, addChatMessage, dailyMessagesLeft, decrementDailyMessages, language, user } = useSmartGrowStore()
  const t = translations[language]
  const { playMessageSent, playMessageReceived, playClick } = useSound()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const handleSend = async () => {
    if (!input.trim() || dailyMessagesLeft <= 0) return

    // Add user message
    playMessageSent()
    addChatMessage({ role: 'user', content: input })
    setInput('')
    decrementDailyMessages()
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = aiResponses[language]
      const response = responses[Math.floor(Math.random() * responses.length)]
      addChatMessage({ role: 'assistant', content: response })
      playMessageReceived()
      setIsTyping(false)
    }, 1500)
  }

  const premiumFeatures = [
    { icon: MessageCircle, text: t.unlimitedAiChat },
    { icon: Zap, text: t.advancedPlantAnalysis },
    { icon: Star, text: t.prioritySupport },
    { icon: Sparkles, text: t.customPlantAvatars },
  ]

  return (
    <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] flex flex-col">
      <TopBar 
        title={t.aiChat}
        subtitle={t.chatWithPlant}
      />

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col glass-panel p-4">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            <AnimatePresence>
              {chatMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  )}
                >
                  {/* Avatar */}
                  <div className={cn(
                    'w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center',
                    message.role === 'user' 
                      ? 'bg-gradient-to-br from-[#00d4ff] to-[#b44fff]' 
                      : 'bg-gradient-to-br from-[#00ff88] to-[#00d4ff]'
                  )}>
                    {message.role === 'user' ? (
                      <span className="text-xs font-bold text-[#04080f]">
                        {user.name.charAt(0)}
                      </span>
                    ) : (
                      <span className="text-xs">🌱</span>
                    )}
                  </div>

                  {/* Message */}
                  <div className={cn(
                    'max-w-[70%] rounded-2xl px-4 py-3',
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-[#00d4ff]/20 to-[#b44fff]/20 border border-[#00d4ff]/30'
                      : 'bg-[#0a1525]'
                  )}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-[#c8e0f0]">
                        {message.role === 'user' ? user.name : 'Leafy'}
                      </span>
                      <span className="text-[10px] text-[#4a7090]">
                        {new Date(message.timestamp).toLocaleTimeString(
                          language === 'uk' ? 'uk-UA' : 
                          language === 'ro' ? 'ro-RO' : 
                          language === 'es' ? 'es-ES' : 'en-US', 
                          { hour: '2-digit', minute: '2-digit' }
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-[#c8e0f0] whitespace-pre-line">
                      {message.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00d4ff] flex items-center justify-center">
                  <span className="text-xs">🌱</span>
                </div>
                <div className="bg-[#0a1525] rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#4a7090] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-[#4a7090] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-[#4a7090] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.typeYourMessage}
              disabled={dailyMessagesLeft <= 0}
              className="flex-1 bg-[#0a1525] border border-[#1a3a5c] rounded-xl px-4 py-3 text-[#c8e0f0] placeholder-[#4a7090] focus:outline-none focus:border-[#00d4ff] disabled:opacity-50"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!input.trim() || dailyMessagesLeft <= 0}
              className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#00d4ff] to-[#00ff88] flex items-center justify-center disabled:opacity-50"
            >
              <Send className="w-5 h-5 text-[#04080f]" />
            </motion.button>
          </div>
        </div>

        {/* Sidebar - Desktop Only */}
        <div className="hidden lg:flex flex-col w-72 gap-4">
          {/* Mini Leafy */}
          <div className="glass-panel p-4 flex justify-center">
            <LeafyCharacter size="sm" showParticles={false} />
          </div>

          {/* Daily Messages */}
          <div className="glass-panel p-4">
            <h3 className="text-lg font-semibold text-white mb-3">
              {t.dailyMessages}
            </h3>
            <p className="text-3xl font-bold font-[var(--font-orbitron)] text-gradient-cyan text-center mb-2">
              {dailyMessagesLeft} / 3
            </p>
            <p className="text-xs text-[#4a7090] text-center mb-3">
              {t.freeMessagesLeft}
            </p>
            <div className="h-2 bg-[#0a1525] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88] rounded-full transition-all"
                style={{ width: `${(dailyMessagesLeft / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Upgrade Card */}
          {!user.isPro && (
            <div className="glass-panel p-4 border border-[#ffd700]/30">
              <h3 className="text-lg font-semibold text-white mb-3">
                {t.upgradeToPremium}
              </h3>
              <div className="space-y-2 mb-4">
                {premiumFeatures.map((feature, i) => {
                  const Icon = feature.icon
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-[#ffd700]" />
                      <span className="text-sm text-[#c8e0f0]">{feature.text}</span>
                    </div>
                  )
                })}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ffd700] to-[#ffaa00] text-[#04080f] font-bold flex items-center justify-center gap-2"
              >
                <Crown className="w-5 h-5" />
                {t.upgradeNow}
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
