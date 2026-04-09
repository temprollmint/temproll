'use client'

export function StakeClient() {
  return (
    <>
      {/* Hero */}
      <section className="hero fade-in" id="stake-hero">
        <h1>
          Stake <span className="gold">$TEMPROLL</span>
        </h1>
        <p className="hero-subtitle">
          Stake your $TEMPROLL and earn rewards from LP trading fees.
          No inflation. No extra minting. Pure revenue sharing.
        </p>
        <div style={{
          marginTop: 12, padding: '10px 20px',
          background: 'rgba(201,164,76,0.08)', border: '1px solid rgba(201,164,76,0.2)',
          borderRadius: 12, fontSize: 13, color: 'var(--accent-gold)',
          textAlign: 'center', fontWeight: 600,
        }}>
          ⏳ Staking will be available after LP is live
        </div>
      </section>

      {/* How Staking Works */}
      <section className="home-steps fade-in-delay-1" style={{ marginTop: 32 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 20, fontSize: 22 }}>
          How It <span className="gold">Works</span>
        </h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3 className="step-title">Stake $TEMPROLL</h3>
            <p className="step-desc">Deposit your $TEMPROLL tokens into the staking contract. No lock-up period, withdraw anytime.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3 className="step-title">Earn Fees</h3>
            <p className="step-desc">Every trade on the $TEMPROLL/pathUSD LP generates fees. Your share is proportional to your stake.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3 className="step-title">Claim Rewards</h3>
            <p className="step-desc">Claim your accumulated pathUSD rewards at any time. No vesting, no delays.</p>
          </div>
        </div>
      </section>

      {/* Stats Preview */}
      <section className="home-stats fade-in-delay-2" style={{ marginTop: 32 }}>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Reward Token</div>
            <div className="stat-value gold">pathUSD</div>
            <div className="stat-label" style={{ marginTop: 2, fontSize: 11 }}>from LP fees</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Lock-up</div>
            <div className="stat-value">None</div>
            <div className="stat-label" style={{ marginTop: 2, fontSize: 11 }}>withdraw anytime</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Supply Impact</div>
            <div className="stat-value gold">0%</div>
            <div className="stat-label" style={{ marginTop: 2, fontSize: 11 }}>no new tokens minted</div>
          </div>
        </div>
      </section>
    </>
  )
}
