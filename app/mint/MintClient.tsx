'use client'

import { MintCard } from '../components/MintCard'
import { useReadContract } from 'wagmi'
import { CONTRACTS, MINT_SALE_ABI } from '../config/contracts'

export function MintClient() {
  return (
    <>
      <section className="spin-section" id="mint-section" style={{ paddingTop: 24 }}>
        <MintCard />
      </section>

      <section className="how-it-works" id="how-it-works">
        <h2 className="how-it-works-title">
          How It <span style={{ color: 'var(--accent-gold)' }}>Works</span>
        </h2>
        <p className="how-it-works-desc">
          Spin the wheel to mint $TEMPROLL. Every spin costs exactly $0.50 and guarantees you a minimum of 10,000 tokens.
          The rarer your spin, the bigger your multiplier. Up to a 50,000 token jackpot!
        </p>
        <div className="steps-grid">
          <div className="step-card fade-in-delay-1">
            <div className="step-number">1</div>
            <h3 className="step-title">Approve wallet</h3>
            <p className="step-desc">Connect and approve pathUSD to interact with the mint contract.</p>
          </div>
          <div className="step-card fade-in-delay-2">
            <div className="step-number">2</div>
            <h3 className="step-title">Spin ($0.50)</h3>
            <p className="step-desc">Hit SPIN & MINT. The wheel stops on a rarity: Bronze (1x), Silver (1.25x), Platinum (1.5x), Diamond (2.5x) or Golden (5x).</p>
          </div>
          <div className="step-card fade-in-delay-3">
            <div className="step-number">3</div>
            <h3 className="step-title">Claim tokens</h3>
            <p className="step-desc">$TEMPROLL is minted instantly to your wallet. You get exactly what your multiplier landed on!</p>
          </div>
        </div>
      </section>
    </>
  )
}
