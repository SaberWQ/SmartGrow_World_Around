/**
 * SmartGrow SecureAI - Redirect to Plant Page
 * (c) 2026 SmartGrow AI Team. All rights reserved.
 * Protected under Ukrainian Law No. 2811-IX
 */

import { redirect } from 'next/navigation'

export default function HomePage() {
  redirect('/plant')
}
