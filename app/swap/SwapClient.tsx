'use client'

import { SwapInterface } from '../components/SwapInterface'

export function SwapClient() {
  return (
    <>
      {/* Hero */}
      <section className="hero fade-in" id="swap-hero">
        <h1>
          Swap <span className="gold">$TEMPROLL</span>
        </h1>
        <p className="hero-subtitle">
          Trade $TEMPROLL ↔ pathUSD on Tempo.
          Low slippage, instant settlement.
        </p>
        <div style={{
          marginTop: 12, padding: '10px 20px',
          background: 'rgba(201,164,76,0.08)', border: '1px solid rgba(201,164,76,0.2)',
          borderRadius: 12, fontSize: 13, color: 'var(--accent-gold)',
          textAlign: 'center', fontWeight: 600,
        }}>
          ⏳ Liquidity pool will be added after mint completes
        </div>
      </section>

      {/* Swap Interface */}
      <SwapInterface />
    </>
  )
}
