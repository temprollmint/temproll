'use client'

import Link from 'next/link'

function IconWheel() {
  return <span style={{ fontSize: 36, lineHeight: 1, filter: 'drop-shadow(0 0 8px rgba(201,164,76,0.4))' }}>🎰</span>
}

function IconShield() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 6v5c0 5.5 3.4 10.2 8 12 4.6-1.8 8-6.5 8-12V6l-8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

function IconZap() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4 14h8l-1 8 9-12h-8l1-8z" />
    </svg>
  )
}

function IconArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

function IconBook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

export default function HomePage() {
  return (
    <>
      <section className="home-hero fade-in" id="home-hero">
        <div className="hero-badge">
          <div className="hero-badge-dot" />
          Live on Tempo
        </div>
        <h1 className="home-hero-title gold">
          TEMPROLL
        </h1>
        <p className="home-hero-tagline">
          Your luck. Your tokens. On-chain.
        </p>
        <p className="hero-subtitle">
          The first gamified fair launch on Tempo.
          Spin the wheel, stack $TEMPROLL. Starting at just $1 per spin.
        </p>
        <div className="home-hero-actions">
          <Link href="/mint" className="btn btn-primary btn-lg">
            Launch App <IconArrowRight />
          </Link>
          <Link href="/docs" className="btn btn-outline btn-lg">
            <IconBook /> Read Docs
          </Link>
          <a href="https://x.com/temporoll" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            @temporoll
          </a>
        </div>
      </section>

      <section className="home-features" id="features">
        <div className="steps-grid">
          <div className="step-card fade-in-delay-1">
            <div className="step-icon"><IconWheel /></div>
            <h3 className="step-title">Spin to Mint</h3>
            <p className="step-desc">
              Not just another mint button. Spin the roulette wheel
              to reveal your mint rarity, from Bronze to Golden.
            </p>
          </div>
          <div className="step-card fade-in-delay-2">
            <div className="step-icon"><IconShield /></div>
            <h3 className="step-title">Fair Launch</h3>
            <p className="step-desc">
              80% public mint, 20% LP reserve, 0% team. No presale,
              no insiders, no VCs. First come, first served.
            </p>
          </div>
          <div className="step-card fade-in-delay-3">
            <div className="step-icon"><IconZap /></div>
            <h3 className="step-title">Instant Liquidity</h3>
            <p className="step-desc">
              After mint sells out, 20% reserve goes to Uniswap V2
              LP pool. Trade $TEMPROLL instantly.
            </p>
          </div>
        </div>
      </section>

      <section className="home-stats fade-in-delay-2">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Price</div>
            <div className="stat-value gold">$0.0001</div>
            <div className="stat-label" style={{ marginTop: 2, fontSize: 11 }}>per token</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Supply</div>
            <div className="stat-value">100M</div>
            <div className="stat-label" style={{ marginTop: 2, fontSize: 11 }}>$TEMPROLL</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">FDV</div>
            <div className="stat-value gold">$10K</div>
            <div className="stat-label" style={{ marginTop: 2, fontSize: 11 }}>market cap</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Network</div>
            <div className="stat-value">Tempo</div>
            <div className="stat-label" style={{ marginTop: 2, fontSize: 11 }}>TIP-20</div>
          </div>
        </div>
      </section>

      <section className="home-cta fade-in-delay-3">
        <div className="home-cta-card">
          <h2>Ready to Roll?</h2>
          <p>Connect your wallet and spin for $TEMPROLL.</p>
          <Link href="/mint" className="btn btn-primary btn-lg">
            Start Minting <IconArrowRight />
          </Link>
        </div>
      </section>
    </>
  )
}
