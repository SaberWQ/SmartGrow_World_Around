"use client"

import { useCallback, useRef, useEffect } from 'react'
import { useSmartGrowStore } from './store'

// Sound URLs - using Web Audio API for generation
const SOUNDS = {
  // UI Sounds
  click: { frequency: 800, duration: 0.05, type: 'sine' as OscillatorType },
  success: { frequency: 523.25, duration: 0.15, type: 'sine' as OscillatorType, melody: [523.25, 659.25, 783.99] },
  error: { frequency: 200, duration: 0.2, type: 'square' as OscillatorType },
  notification: { frequency: 880, duration: 0.1, type: 'sine' as OscillatorType, melody: [880, 1108.73] },
  
  // Action Sounds
  water: { frequency: 300, duration: 0.3, type: 'sine' as OscillatorType, filter: true },
  levelUp: { frequency: 440, duration: 0.5, type: 'sine' as OscillatorType, melody: [440, 554.37, 659.25, 880] },
  purchase: { frequency: 600, duration: 0.2, type: 'sine' as OscillatorType, melody: [600, 800, 1000] },
  questComplete: { frequency: 523.25, duration: 0.4, type: 'sine' as OscillatorType, melody: [523.25, 659.25, 783.99, 1046.5] },
  
  // Alert Sounds
  alert: { frequency: 440, duration: 0.3, type: 'square' as OscillatorType, melody: [440, 440, 440] },
  warning: { frequency: 300, duration: 0.4, type: 'sawtooth' as OscillatorType },
  attack: { frequency: 150, duration: 0.6, type: 'sawtooth' as OscillatorType, filter: true },
  
  // Ambient
  ambient: { frequency: 220, duration: 2, type: 'sine' as OscillatorType, volume: 0.1 },
  
  // Message
  messageSent: { frequency: 600, duration: 0.08, type: 'sine' as OscillatorType },
  messageReceived: { frequency: 800, duration: 0.1, type: 'sine' as OscillatorType, melody: [800, 1000] },
}

type SoundName = keyof typeof SOUNDS

class SoundManager {
  private audioContext: AudioContext | null = null
  private isEnabled: boolean = true
  private masterVolume: number = 0.3
  
  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }
  
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled
  }
  
  setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume))
  }
  
  async play(soundName: SoundName) {
    if (!this.isEnabled) return
    
    try {
      const ctx = this.getAudioContext()
      
      if (ctx.state === 'suspended') {
        await ctx.resume()
      }
      
      const sound = SOUNDS[soundName]
      const now = ctx.currentTime
      
      if ('melody' in sound && sound.melody) {
        // Play melody
        sound.melody.forEach((freq, index) => {
          this.playTone(ctx, freq, now + index * 0.1, sound.duration / sound.melody!.length, sound.type, sound.volume)
        })
      } else {
        // Play single tone
        this.playTone(ctx, sound.frequency, now, sound.duration, sound.type, sound.volume, 'filter' in sound && sound.filter)
      }
    } catch (error) {
      console.error('Sound playback error:', error)
    }
  }
  
  private playTone(
    ctx: AudioContext,
    frequency: number,
    startTime: number,
    duration: number,
    type: OscillatorType,
    customVolume?: number,
    useFilter?: boolean
  ) {
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, startTime)
    
    const volume = (customVolume ?? 1) * this.masterVolume
    gainNode.gain.setValueAtTime(volume, startTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
    
    if (useFilter) {
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(1000, startTime)
      filter.frequency.exponentialRampToValueAtTime(200, startTime + duration)
      
      oscillator.connect(filter)
      filter.connect(gainNode)
    } else {
      oscillator.connect(gainNode)
    }
    
    gainNode.connect(ctx.destination)
    
    oscillator.start(startTime)
    oscillator.stop(startTime + duration + 0.1)
  }
  
  // Ambient sound loop
  private ambientOscillators: OscillatorNode[] = []
  private ambientGain: GainNode | null = null
  
  startAmbient() {
    if (!this.isEnabled) return
    
    try {
      const ctx = this.getAudioContext()
      
      this.ambientGain = ctx.createGain()
      this.ambientGain.gain.setValueAtTime(0.05 * this.masterVolume, ctx.currentTime)
      this.ambientGain.connect(ctx.destination)
      
      // Create layered ambient sound
      const frequencies = [110, 165, 220, 330]
      
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime)
        
        const oscGain = ctx.createGain()
        oscGain.gain.setValueAtTime(0.1 / (i + 1), ctx.currentTime)
        
        osc.connect(oscGain)
        oscGain.connect(this.ambientGain!)
        
        osc.start()
        this.ambientOscillators.push(osc)
      })
    } catch (error) {
      console.error('Ambient sound error:', error)
    }
  }
  
  stopAmbient() {
    this.ambientOscillators.forEach(osc => {
      try {
        osc.stop()
      } catch (e) {}
    })
    this.ambientOscillators = []
    this.ambientGain = null
  }
}

// Singleton instance
const soundManager = typeof window !== 'undefined' ? new SoundManager() : null

export function useSound() {
  const { settings } = useSmartGrowStore()
  
  useEffect(() => {
    if (soundManager) {
      soundManager.setEnabled(settings.soundEnabled)
    }
  }, [settings.soundEnabled])
  
  const playSound = useCallback((soundName: SoundName) => {
    soundManager?.play(soundName)
  }, [])
  
  const playClick = useCallback(() => playSound('click'), [playSound])
  const playSuccess = useCallback(() => playSound('success'), [playSound])
  const playError = useCallback(() => playSound('error'), [playSound])
  const playNotification = useCallback(() => playSound('notification'), [playSound])
  const playWater = useCallback(() => playSound('water'), [playSound])
  const playLevelUp = useCallback(() => playSound('levelUp'), [playSound])
  const playPurchase = useCallback(() => playSound('purchase'), [playSound])
  const playQuestComplete = useCallback(() => playSound('questComplete'), [playSound])
  const playAlert = useCallback(() => playSound('alert'), [playSound])
  const playWarning = useCallback(() => playSound('warning'), [playSound])
  const playAttack = useCallback(() => playSound('attack'), [playSound])
  const playMessageSent = useCallback(() => playSound('messageSent'), [playSound])
  const playMessageReceived = useCallback(() => playSound('messageReceived'), [playSound])
  
  const startAmbient = useCallback(() => {
    soundManager?.startAmbient()
  }, [])
  
  const stopAmbient = useCallback(() => {
    soundManager?.stopAmbient()
  }, [])
  
  return {
    playSound,
    playClick,
    playSuccess,
    playError,
    playNotification,
    playWater,
    playLevelUp,
    playPurchase,
    playQuestComplete,
    playAlert,
    playWarning,
    playAttack,
    playMessageSent,
    playMessageReceived,
    startAmbient,
    stopAmbient,
  }
}
