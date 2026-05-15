/**
 * SmartGrow SecureAI - Root Layout
 * (c) 2026 SmartGrow AI Team. All rights reserved.
 * Protected under Ukrainian Law No. 2811-IX
 */

import type { Metadata, Viewport } from 'next'
import { Inter, Orbitron, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SmartGrow SecureAI | Zero-Trust IoT Protection for Smart Greenhouses',
  description: 'AI-powered Zero-Trust cybersecurity dashboard for smart agricultural IoT greenhouses in Ukraine. Protect your crops from cyberattacks with real-time anomaly detection and gamified plant companion.',
  keywords: ['cybersecurity', 'IoT', 'smart greenhouse', 'Ukraine', 'AI', 'zero-trust', 'agriculture'],
  authors: [{ name: 'SmartGrow AI Team' }],
  creator: 'SmartGrow AI Team',
  publisher: 'SmartGrow AI',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: 'https://smartgrow.ai',
    title: 'SmartGrow SecureAI',
    description: 'Zero-Trust IoT Protection for Smart Greenhouses',
    siteName: 'SmartGrow SecureAI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartGrow SecureAI',
    description: 'Zero-Trust IoT Protection for Smart Greenhouses',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#04080f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uk" className={`${inter.variable} ${orbitron.variable} ${geistMono.variable} bg-[#04080f]`}>
      <body className="font-sans antialiased min-h-screen bg-[#04080f] text-[#c8e0f0]">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
