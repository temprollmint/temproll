import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Docs — TEMPROLL',
  description: 'Official documentation for the TEMPROLL spin-to-mint protocol on Tempo.',
}

export default function DocsPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-title">
        <span className="gold">TEMPROLL</span> Documentation
      </h1>
      <p className="docs-subtitle">Official guide to the $TEMPROLL spin-to-mint protocol.</p>

      <div className="docs-grid">
        <section className="docs-section">
          <h2>Overview</h2>
          <p>
            TEMPROLL is a community-driven, gamified token launch on the Tempo network.
            Instead of a standard mint interface, users engage with an interactive roulette
            mechanic, spinning for a chance at bonus multipliers on every purchase.
          </p>
          <p>
            $TEMPROLL is built on the TIP-20 token standard with a strict fair launch model:
            zero team allocation, zero presale, and zero insider access. 100% of tokens are
            allocated to the public mint and initial LP.
          </p>
        </section>

        <section className="docs-section">
          <h2>How It Works</h2>
          <div className="docs-list">
            <div className="docs-list-item">
              <span className="docs-list-num">1</span>
              <div>
                <strong>Pay $0.50 pathUSD</strong>
                <p>Each spin costs exactly $0.50 pathUSD. You get a minimum of 10,000 $TEMPROLL, with a chance for up to 5x more.</p>
              </div>
            </div>
            <div className="docs-list-item">
              <span className="docs-list-num">2</span>
              <div>
                <strong>Approve &amp; Spin</strong>
                <p>Approve pathUSD spending via your wallet, then spin the roulette wheel. The wheel determines your multiplier bonus.</p>
              </div>
            </div>
            <div className="docs-list-item">
              <span className="docs-list-num">3</span>
              <div>
                <strong>Receive Tokens</strong>
                <p>$TEMPROLL is minted directly to your connected wallet. No claiming, no vesting, instant delivery.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="docs-section">
          <h2>Mint Rarity Tiers</h2>
          <p>Every spin reveals a rarity tier that determines your token multiplier. Rarer tiers earn you more $TEMPROLL per spin!</p>
          <table className="docs-table">
            <thead>
              <tr><th>Rarity</th><th>Multiplier</th><th>Tokens</th></tr>
            </thead>
            <tbody>
              <tr><td>Bronze</td><td>1x</td><td>10,000</td></tr>
              <tr><td>Silver</td><td>1.25x</td><td>12,500</td></tr>
              <tr><td>Platinum</td><td>1.5x</td><td>15,000</td></tr>
              <tr><td>Diamond</td><td>2.5x</td><td>25,000</td></tr>
              <tr className="docs-table-highlight"><td>Golden</td><td>5x</td><td>50,000</td></tr>
            </tbody>
          </table>
          <p style={{ marginTop: 12, fontSize: 12, color: 'var(--text-tertiary)' }}>
            Base rate: $0.50 = 10,000 $TEMPROLL. Higher rarities multiply your reward!
          </p>
        </section>

        <section className="docs-section">
          <h2>Tokenomics</h2>
          <table className="docs-table">
            <thead>
              <tr><th>Allocation</th><th>Amount</th><th>Share</th></tr>
            </thead>
            <tbody>
              <tr><td>Public Mint (Spin &amp; Mint)</td><td>80,000,000</td><td>80%</td></tr>
              <tr><td>Liquidity Pool Reserve</td><td>20,000,000</td><td>20%</td></tr>
              <tr><td>Team / Advisors / VCs</td><td>0</td><td>0%</td></tr>
            </tbody>
          </table>
          <p style={{ marginTop: 12, fontSize: 13 }}>
            After the public mint concludes, the 20% LP reserve is paired with raised pathUSD
            and deployed as permanent liquidity on a DEX. No tokens are held back.
          </p>
        </section>

        <section className="docs-section">
          <h2>Contract Information</h2>
          <table className="docs-table">
            <thead>
              <tr><th>Parameter</th><th>Value</th></tr>
            </thead>
            <tbody>
              <tr><td>Token Name</td><td>Temproll</td></tr>
              <tr><td>Ticker</td><td>$TEMPROLL</td></tr>
              <tr><td>Standard</td><td>TIP-20</td></tr>
              <tr><td>Network</td><td>Tempo Mainnet</td></tr>
              <tr><td>Chain ID</td><td>4217</td></tr>
              <tr><td>Decimals</td><td>6</td></tr>
              <tr><td>Total Supply</td><td>100,000,000</td></tr>
              <tr><td>Mint Price</td><td>$0.50 per spin (10K-50K tokens)</td></tr>
              <tr><td>Payment Token</td><td>pathUSD</td></tr>
              <tr><td>Token Contract</td><td style={{ fontSize: 11, wordBreak: 'break-all' as const }}>0x20C000000000000000000000a943E88Ee77D9F7a</td></tr>
              <tr><td>MintSale Contract</td><td style={{ fontSize: 11, wordBreak: 'break-all' as const }}>0x96D0B039748B30F9907DEA0118a43627026FE936</td></tr>

            </tbody>
          </table>
        </section>

        <section className="docs-section">
          <h2>Frequently Asked Questions</h2>
          <div className="docs-faq">
            <details className="docs-faq-item">
              <summary>What wallet do I need?</summary>
              <p>MetaMask or any EVM-compatible wallet. When you connect, the site will prompt you to add the Tempo network automatically.</p>
            </details>
            <details className="docs-faq-item">
              <summary>What is pathUSD?</summary>
              <p>pathUSD is the native stablecoin of the Tempo network, pegged 1:1 to USD. It is used as the payment token for all $TEMPROLL mints.</p>
            </details>
            <details className="docs-faq-item">
              <summary>How does the spin rarity work?</summary>
              <p>Each spin randomly reveals a rarity tier (Bronze through Golden). The rarity determines your token multiplier. Bronze gives 1x (10,000 tokens), while the ultra-rare Golden gives 5x (50,000 tokens). Rarity is determined by the MintSale smart contract and recorded on-chain — it cannot be manipulated by anyone.</p>
            </details>
            <details className="docs-faq-item">
              <summary>Is there a maximum per wallet?</summary>
              <p>There is no per-wallet limit. You can mint as many times as you want until the public supply is fully distributed.</p>
            </details>
            <details className="docs-faq-item">
              <summary>When does trading begin?</summary>
              <p>Trading begins after the public mint concludes. The 20% LP reserve will be paired with raised pathUSD and deployed as permanent on-chain liquidity.</p>
            </details>
            <details className="docs-faq-item">
              <summary>Is there a team allocation?</summary>
              <p>No. Zero tokens are allocated to the team, advisors, or investors. All admin roles have been permanently renounced on-chain — no one can mint new tokens or modify the supply. This is a 100% community-driven fair launch, verifiable by anyone.</p>
            </details>
          </div>
        </section>

        <section className="docs-section">
          <h2>Links</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="https://x.com/temporoll" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: 13 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              @temporoll
            </a>
            <a href="/mint" className="btn btn-primary" style={{ fontSize: 13 }}>
              Launch App →
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
