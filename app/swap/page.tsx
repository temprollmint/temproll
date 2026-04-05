import type { Metadata } from 'next'
import { SwapClient } from './SwapClient'

export const metadata: Metadata = {
  title: 'Swap $TEMPROLL — Uniswap V2',
  description: 'Swap $TEMPROLL ↔ pathUSD on Uniswap V2, powered by Tempo.',
}

export default function SwapPage() {
  return <SwapClient />
}
