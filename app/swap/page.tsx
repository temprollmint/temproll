import type { Metadata } from 'next'
import { SwapClient } from './SwapClient'

export const metadata: Metadata = {
  title: 'Swap $TEMPROLL',
  description: 'Swap $TEMPROLL ↔ pathUSD on Tempo.',
}

export default function SwapPage() {
  return <SwapClient />
}
