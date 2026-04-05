'use client'

export function SwapClient() {
  return (
    <>
      <section className="hero fade-in" id="swap-hero">
        <h1>
          Swap <span className="gold">$TEMPROLL</span>
        </h1>
        <p className="hero-subtitle">
          Trade $TEMPROLL ↔ pathUSD on Tempo.
          Low slippage, instant settlement.
        </p>
      </section>

      <div style={{
        maxWidth: 480, margin: '0 auto', padding: '60px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          padding: '40px 24px',
          background: 'rgba(201,164,76,0.06)',
          border: '1px solid rgba(201,164,76,0.2)',
          borderRadius: 16, fontSize: 15, fontWeight: 600,
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
          <div style={{ color: 'var(--accent-gold)', fontSize: 20, marginBottom: 8 }}>
            Coming Soon
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>
            Liquidity pool will be created after the public mint completes.
            The 20M $TEMPROLL LP reserve will be paired with raised pathUSD on Uniswap V2.
          </p>
        </div>
      </div>
    </>
  )
}
