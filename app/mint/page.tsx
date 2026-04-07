import type { Metadata } from 'next'
import { MintClient } from './MintClient'

export const metadata: Metadata = {
  title: 'Spin & Mint $TEMPROLL | Roulette Fair Launch',
  description: 'Spin the roulette wheel and mint $TEMPROLL tokens. Fair launch, zero team allocation.',
}

export default function MintPage() {
  return <MintClient />
}
