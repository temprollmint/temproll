import type { Metadata } from 'next'
import { StakeClient } from './StakeClient'

export const metadata: Metadata = {
  title: 'Stake $TEMPROLL',
  description: 'Stake your $TEMPROLL tokens and earn rewards from LP trading fees.',
}

export default function StakePage() {
  return <StakeClient />
}
