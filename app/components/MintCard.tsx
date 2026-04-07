'use client'

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi'
import { CONTRACTS, TOKEN, MINT_TIERS, TIP20_ABI, MINT_SALE_ABI } from '../config/contracts'
import { ProgressBar } from './ProgressBar'
import { SpinWheel, RARITY_INFO, type Rarity } from './SpinWheel'
import { useState, useEffect, useCallback } from 'react'
import { decodeEventLog } from 'viem'

type Phase = 'idle' | 'approving' | 'ready' | 'spinning' | 'minting' | 'success' | 'error'

// Map contract rarity ID (0-4) to our Rarity type
const RARITY_MAP: Rarity[] = ['bronze', 'silver', 'platinum', 'diamond', 'golden']

function Confetti({ rarity }: { rarity: Rarity }) {
  const colors: Record<Rarity, string[]> = {
    bronze:   ['#cd7f32', '#a0622a', '#e8b87a', '#fff'],
    silver:   ['#c0c0c0', '#e0e0e0', '#909090', '#fff'],
    platinum: ['#a855f7', '#c084fc', '#7c3aed', '#e0c0ff', '#fff'],
    diamond:  ['#38bdf8', '#0ea5e9', '#7dd3fc', '#bae6fd', '#fff'],
    golden:   ['#ffd700', '#ffed4a', '#c9a44c', '#fff', '#ff6b6b', '#6c5ce7'],
  }
  const count = rarity === 'golden' ? 100 : rarity === 'diamond' ? 80 : rarity === 'platinum' ? 60 : 40
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    dur: 1.5 + Math.random() * 2,
    size: 4 + Math.random() * (rarity === 'golden' ? 12 : 8),
    color: colors[rarity][Math.floor(Math.random() * colors[rarity].length)],
    rot: Math.random() * 360,
  }))
  return (
    <div className="confetti-wrap">
      {particles.map(p => (
        <div key={p.id} className="confetti-p" style={{
          left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`,
          width: p.size, height: p.size, background: p.color, transform: `rotate(${p.rot}deg)`,
        }} />
      ))}
    </div>
  )
}

export function MintCard() {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const [phase, setPhase] = useState<Phase>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [spinTrigger, setSpinTrigger] = useState(0)
  const [spinRarity, setSpinRarity] = useState<Rarity>('bronze')
  const [showConfetti, setShowConfetti] = useState(false)
  const [actualTokensWon, setActualTokensWon] = useState(0)
  const [blockchainRarity, setBlockchainRarity] = useState<Rarity | null>(null)

  const tier = MINT_TIERS[0]

  const { data: pathUsdBalance } = useReadContract({
    address: CONTRACTS.PATH_USD, abi: TIP20_ABI, functionName: 'balanceOf',
    args: address ? [address] : undefined, query: { enabled: !!address },
  })
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.PATH_USD, abi: TIP20_ABI, functionName: 'allowance',
    args: address ? [address, CONTRACTS.MINT_SALE] : undefined,
    query: { enabled: !!address },
  })
  const { data: totalSoldRaw, refetch: refetchSold } = useReadContract({
    address: CONTRACTS.MINT_SALE, abi: MINT_SALE_ABI, functionName: 'totalTokensSold',
  })

  const totalTokensSold = totalSoldRaw ? Number(totalSoldRaw) / 1e6 : 0
  const hasEnoughBalance = pathUsdBalance ? BigInt(pathUsdBalance.toString()) >= tier.priceRaw : false
  const hasAllowance = allowance ? BigInt(allowance.toString()) >= tier.priceRaw : false
  const isSoldOut = totalTokensSold >= TOKEN.publicMint
  const isContractDeployed = true
  const formattedBalance = pathUsdBalance ? (Number(pathUsdBalance) / 1e6).toFixed(2) : '0.00'

  const { writeContract: approve, data: approveTxHash, isPending: isApproving } = useWriteContract()
  const { writeContract: mint, data: mintTxHash, isPending: isMinting } = useWriteContract()
  const { isSuccess: approveConfirmed } = useWaitForTransactionReceipt({ hash: approveTxHash })

  useEffect(() => {
    if (approveConfirmed) { setPhase('ready'); refetchAllowance() }
  }, [approveConfirmed, refetchAllowance])

  // When mint tx confirms, parse the Minted event to get the ACTUAL rarity from blockchain
  useEffect(() => {
    if (!mintTxHash || !publicClient) return
    let cancelled = false

    const handleReceipt = async () => {
      try {
        const receipt = await publicClient.waitForTransactionReceipt({ hash: mintTxHash })

        if (cancelled) return

        // Parse Minted event from logs
        for (const log of receipt.logs) {
          try {
            const decoded = decodeEventLog({
              abi: MINT_SALE_ABI,
              data: log.data,
              topics: log.topics,
            })
            if (decoded.eventName === 'Minted') {
              const args = decoded.args as { user: string; amountPaid: bigint; tokensReceived: bigint; rarity: number }
              const rarityId = Number(args.rarity)
              const tokensWon = Number(args.tokensReceived) / 1e6
              const rarity = RARITY_MAP[rarityId] || 'bronze'

              // Set the REAL result from blockchain
              setSpinRarity(rarity)
              setBlockchainRarity(rarity)
              setActualTokensWon(tokensWon)

              // NOW start the wheel spin (after payment confirmed)
              setSpinTrigger(t => t + 1)

              // Show confetti for platinum+
              if (rarity !== 'bronze' && rarity !== 'silver') {
                setShowConfetti(true)
                setTimeout(() => { if (!cancelled) setShowConfetti(false) }, 4000)
              }
              // Extra confetti for golden!
              if (rarity === 'golden') {
                setTimeout(() => { if (!cancelled) setShowConfetti(true) }, 500)
                setTimeout(() => { if (!cancelled) setShowConfetti(false) }, 5000)
              }

              refetchSold()
              refetchAllowance()
              return
            }
          } catch { /* not our event, skip */ }
        }

        // Fallback if event parsing fails
        setPhase('success')
        setActualTokensWon(tier.tokens)
        refetchSold()
        refetchAllowance()
      } catch {
        if (!cancelled) {
          setPhase('error')
          setErrorMsg('Transaction failed')
        }
      }
    }

    handleReceipt()
    return () => { cancelled = true }
  }, [mintTxHash, publicClient, refetchSold, refetchAllowance, tier.tokens])

  const handleApprove = () => {
    if (!isContractDeployed) return
    setPhase('approving'); setErrorMsg('')
    approve({ address: CONTRACTS.PATH_USD, abi: TIP20_ABI, functionName: 'approve',
      args: [CONTRACTS.MINT_SALE, tier.priceRaw],
    }, { onError: (e) => { setPhase('error'); setErrorMsg(e.message.slice(0, 100)) } })
  }

  // SPIN & MINT: Send tx first, wheel spins AFTER blockchain confirms
  const handleSpinAndMint = () => {
    if (!isContractDeployed) return
    setPhase('spinning'); setErrorMsg('')
    // Send mint transaction to blockchain (wheel spins later)
    mint({ address: CONTRACTS.MINT_SALE, abi: MINT_SALE_ABI, functionName: 'mint',
      args: [],
    }, { onError: (e) => { setPhase('error'); setErrorMsg(e.message.slice(0, 100)) } })
  }
  // Wheel animation complete — now show the result
  const handleSpinComplete = useCallback((_rarity: Rarity) => {
    setPhase('success')
  }, [])


  const reset = () => { setPhase('idle'); setErrorMsg(''); setSpinRarity('bronze'); setActualTokensWon(0); setBlockchainRarity(null) }
  const info = RARITY_INFO[spinRarity]

  // Rarity CSS class
  const rarityClass = spinRarity === 'golden' ? 'rarity-golden'
    : spinRarity === 'diamond' ? 'rarity-diamond'
    : spinRarity === 'platinum' ? 'rarity-platinum'
    : spinRarity === 'silver' ? 'rarity-silver'
    : 'rarity-bronze'

  return (
    <>
      {/* Animated gradient border wrapper */}
      <div className="card-glow-wrap fade-in-delay-2" id="mint-card">
        <div className="card-glow-border" />
        <div className="mint-card">
          {/* Header */}
          <div className="mint-card-header">
            <div className="mint-card-title">
              <img src="/temproll-logo.svg" alt="" style={{ width: 28, height: 28 }} /> <span className="gold" style={{ fontWeight: 900, letterSpacing: '-0.5px' }}>Spin & Mint</span>
            </div>
            <div className={`mint-card-status ${isSoldOut ? 'sold-out' : ''}`}>
              {isSoldOut ? 'Sold Out' : '● Live'}
            </div>
          </div>

          <p className="mint-card-subtitle">
            Spin the wheel. Reveal your mint rarity. Claim <span style={{ color: 'var(--accent-gold)' }}>$TEMPROLL</span>.
          </p>

          <div className="fixed-rate-badge fade-in-delay-3">
            <span className="rate-price">$0.5</span> = <span className="rate-tokens">10,000 up to 50,000 $TEMPROLL</span>
          </div>
          {/* Spin Wheel */}
          <div className="wheel-stage">
            <SpinWheel spinTrigger={spinTrigger} onComplete={handleSpinComplete} targetRarity={blockchainRarity} />
          </div>

          {/* Result Display — shows ACTUAL blockchain result */}
          {phase === 'success' && (
            <div className={`spin-result-box ${rarityClass}`}>
              <div className="spin-result-rarity" style={{ color: info.color, textShadow: `0 0 20px ${info.glow}` }}>
                {info.label}
              </div>
              <div className="spin-result-tag" style={{ color: info.color, opacity: 0.8 }}>
                You received {actualTokensWon.toLocaleString()} tokens! ({info.mult}x)
              </div>
            </div>
          )}

          {/* Balance */}
          {isConnected && phase !== 'success' && (
            <div className="mint-balance">
              <span>Balance</span>
              <span className="mint-balance-value">{formattedBalance} pathUSD</span>
            </div>
          )}

          {/* Progress */}
          <ProgressBar totalMinted={totalTokensSold} />

          {/* Action Buttons */}
          <div className="action-area">
            {!isConnected ? (
              <>
                <button className="btn btn-primary btn-lg btn-full spin-action-btn" disabled>
                  🔗 Connect Wallet to Spin
                </button>
              </>
            ) : isSoldOut ? (
              <button className="btn btn-primary btn-lg btn-full" disabled>Sold Out</button>
            ) : phase === 'error' ? (
              <div>
                <button className="btn btn-lg btn-full btn-error" onClick={reset}>Error · Try Again</button>
                {errorMsg && <p className="error-msg">{errorMsg}</p>}
              </div>
            ) : phase === 'success' ? (
              <button className="btn btn-primary btn-lg btn-full spin-action-btn" onClick={reset}>🔄 Spin Again</button>
            ) : !hasAllowance && isContractDeployed ? (
              <div className="action-stack">
                <button className="btn btn-secondary btn-lg btn-full" onClick={handleApprove}
                  disabled={isApproving || !hasEnoughBalance || phase === 'approving'}>
                  {isApproving || phase === 'approving' ? <><span className="spinner spinner-light" /> Approving...</>
                    : !hasEnoughBalance ? 'Insufficient pathUSD' : `Approve ${tier.price} pathUSD`}
                </button>
                <button className="btn btn-primary btn-lg btn-full spin-action-btn" disabled>🎰 SPIN & MINT</button>
              </div>
            ) : (
              <button className="btn btn-primary btn-lg btn-full spin-action-btn" onClick={handleSpinAndMint}
                disabled={phase === 'spinning' || isMinting || !hasEnoughBalance}>
                {phase === 'spinning' || isMinting ? '⏳ Processing...' : '🎰 SPIN & MINT ($0.5)'}
              </button>
            )}
          </div>
        </div>
      </div>

      {showConfetti && <Confetti rarity={spinRarity} />}
    </>
  )
}
