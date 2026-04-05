'use client'

import { TOKEN } from '../config/contracts'

interface ProgressBarProps {
  totalMinted: number // tokens sold (not raw, already divided by 1e6)
}

export function ProgressBar({ totalMinted }: ProgressBarProps) {
  const percentage = Math.min((totalMinted / TOKEN.publicMint) * 100, 100)
  const remaining = TOKEN.publicMint - totalMinted
  const raisedUSD = totalMinted * TOKEN.pricePerToken

  const formatNum = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
    return n.toLocaleString()
  }

  return (
    <div className="progress-section" id="mint-progress">
      <div className="progress-header">
        <span className="progress-label">Mint Progress</span>
        <span className="progress-value">
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="progress-stats">
        <span>
          {formatNum(totalMinted)} / {formatNum(TOKEN.publicMint)} tokens
        </span>
      </div>
    </div>
  )
}
