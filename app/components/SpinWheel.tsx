'use client'

import { useRef, useEffect, useCallback, useState } from 'react'

// Rarity tiers with actual multipliers for token logic
export type Rarity = 'bronze' | 'silver' | 'platinum' | 'diamond' | 'golden'

export const RARITY_INFO: Record<Rarity, { label: string; color: string; glow: string; chance: string; mult: number }> = {
  bronze:   { label: 'Bronze',   color: '#cd7f32', glow: 'rgba(205,127,50,0.4)',  chance: '45%', mult: 1 },
  silver:   { label: 'Silver',   color: '#c0c0c0', glow: 'rgba(192,192,192,0.4)', chance: '30%', mult: 1.25 },
  platinum: { label: 'Platinum', color: '#a855f7', glow: 'rgba(168,85,247,0.4)',  chance: '18%', mult: 1.5 },
  diamond:  { label: 'Diamond',  color: '#38bdf8', glow: 'rgba(56,189,248,0.4)',  chance: '6%',  mult: 2.5 },
  golden:   { label: 'Golden',   color: '#ffd700', glow: 'rgba(255,215,0,0.5)',   chance: '1%',  mult: 5 },
}

const SEGMENTS = [
  { label: 'Bronze',   rarity: 'bronze' as Rarity, bg: '#1a1410', bg2: '#2a2018', tx: '#cd7f32' },
  { label: 'Platinum', rarity: 'platinum' as Rarity, bg: '#1a1028', bg2: '#241540', tx: '#a855f7' },
  { label: 'Bronze',   rarity: 'bronze' as Rarity, bg: '#181410', bg2: '#281e16', tx: '#cd7f32' },
  { label: 'Silver',   rarity: 'silver' as Rarity, bg: '#141418', bg2: '#1e1e28', tx: '#c0c0c0' },
  { label: 'Golden',   rarity: 'golden' as Rarity, bg: '#2e2800', bg2: '#4a4000', tx: '#ffd700' },
  { label: 'Bronze',   rarity: 'bronze' as Rarity, bg: '#1a1410', bg2: '#2a2018', tx: '#cd7f32' },
  { label: 'Diamond',  rarity: 'diamond' as Rarity, bg: '#0a1a28', bg2: '#102838', tx: '#38bdf8' },
  { label: 'Bronze',   rarity: 'bronze' as Rarity, bg: '#181410', bg2: '#281e16', tx: '#cd7f32' },
  { label: 'Silver',   rarity: 'silver' as Rarity, bg: '#141418', bg2: '#1e1e28', tx: '#c0c0c0' },
  { label: 'Platinum', rarity: 'platinum' as Rarity, bg: '#1a1028', bg2: '#241540', tx: '#a855f7' },
]

const SEG_DEG = 360 / SEGMENTS.length

interface Props {
  spinTrigger: number
  onComplete: (rarity: Rarity) => void
  targetRarity?: Rarity | null  // NEW: blockchain result to land on
}

export function SpinWheel({ spinTrigger, onComplete, targetRarity }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const prevTrigger = useRef(0)
  const pendingLand = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const size = 340
    canvas.width = size * dpr; canvas.height = size * dpr
    canvas.style.width = `${size}px`; canvas.style.height = `${size}px`
    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)
    const cx = size / 2, cy = size / 2, rad = 138

    // Outer glow ring
    const outerGlow = ctx.createRadialGradient(cx, cy, rad + 5, cx, cy, rad + 30)
    outerGlow.addColorStop(0, 'rgba(201,164,76,0.12)')
    outerGlow.addColorStop(1, 'transparent')
    ctx.beginPath(); ctx.arc(cx, cy, rad + 30, 0, Math.PI * 2)
    ctx.fillStyle = outerGlow; ctx.fill()

    // Outer decorative ring
    ctx.beginPath(); ctx.arc(cx, cy, rad + 8, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(201,164,76,0.2)'; ctx.lineWidth = 3; ctx.stroke()

    // LED dots around perimeter
    for (let i = 0; i < 40; i++) {
      const a = (i * 9 - 90) * Math.PI / 180
      const dotR = rad + 14
      const isBonus = i % 4 === 0
      ctx.beginPath()
      ctx.arc(cx + Math.cos(a) * dotR, cy + Math.sin(a) * dotR, isBonus ? 2.5 : 1.5, 0, Math.PI * 2)
      ctx.fillStyle = isBonus ? 'rgba(201,164,76,0.6)' : 'rgba(201,164,76,0.2)'
      ctx.fill()
    }

    // Tick marks at segment boundaries
    for (let i = 0; i < SEGMENTS.length; i++) {
      const a = (i * SEG_DEG - 90) * Math.PI / 180
      ctx.beginPath()
      ctx.moveTo(cx + Math.cos(a) * (rad - 3), cy + Math.sin(a) * (rad - 3))
      ctx.lineTo(cx + Math.cos(a) * (rad + 9), cy + Math.sin(a) * (rad + 9))
      ctx.strokeStyle = 'rgba(201,164,76,0.35)'; ctx.lineWidth = 1.5; ctx.stroke()
    }

    // Draw segments
    SEGMENTS.forEach((seg, i) => {
      const a1 = ((i * SEG_DEG) - 90) * Math.PI / 180
      const a2 = (((i + 1) * SEG_DEG) - 90) * Math.PI / 180

      // Gradient fill
      const grad = ctx.createRadialGradient(cx, cy, 35, cx, cy, rad)
      grad.addColorStop(0, seg.bg2); grad.addColorStop(1, seg.bg)
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, rad, a1, a2)
      ctx.closePath(); ctx.fillStyle = grad; ctx.fill()

      // Segment border
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1; ctx.stroke()

      // Label — strictly radial orientation (reads from center outward)
      const mid = (a1 + a2) / 2
      const labelR = rad * 0.62
      ctx.save()
      ctx.translate(cx + Math.cos(mid) * labelR, cy + Math.sin(mid) * labelR)
      
      const angleDeg = mid * 180 / Math.PI
      
      if (angleDeg > 90 || angleDeg < -90) {
        ctx.rotate(mid + Math.PI)
      } else {
        ctx.rotate(mid)
      }
      
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      const fs = seg.rarity === 'golden' ? 14 : seg.rarity === 'diamond' ? 13 : 12
      ctx.font = `800 ${fs}px 'Inter', sans-serif`

      if (seg.rarity === 'golden' || seg.rarity === 'diamond') {
        ctx.shadowColor = seg.tx
        ctx.shadowBlur = seg.rarity === 'golden' ? 15 : 10
      }
      ctx.fillStyle = seg.tx; ctx.fillText(seg.label, 0, 0)
      ctx.shadowBlur = 0; ctx.restore()
    })

    // Inner ring
    ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(201,164,76,0.15)'; ctx.lineWidth = 2; ctx.stroke()

    // Center hub
    const hubGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 36)
    hubGrad.addColorStop(0, '#181830'); hubGrad.addColorStop(0.7, '#0c0c1a')
    hubGrad.addColorStop(1, '#0a0a14')
    ctx.beginPath(); ctx.arc(cx, cy, 36, 0, Math.PI * 2)
    ctx.fillStyle = hubGrad; ctx.fill()

    // Hub ring
    ctx.strokeStyle = 'rgba(201,164,76,0.4)'; ctx.lineWidth = 2.5; ctx.stroke()

    // Hub inner ring
    ctx.beginPath(); ctx.arc(cx, cy, 28, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(201,164,76,0.15)'; ctx.lineWidth = 1; ctx.stroke()

    // Center label — T logo
    ctx.font = "900 22px 'JetBrains Mono', monospace"
    ctx.fillStyle = '#c9a44c'
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.shadowColor = '#c9a44c'; ctx.shadowBlur = 10
    ctx.fillText('T', cx, cy)
    ctx.shadowBlur = 0
  }, [])

  // Start continuous spin when triggered (no landing yet)
  const startSpin = useCallback(() => {
    if (isSpinning) return
    setIsSpinning(true)
    pendingLand.current = true
    // Just keep spinning — add a lot of rotation (will be replaced when result arrives)
    setRotation(prev => prev + 360 * 20)
  }, [isSpinning])

  // Land on the correct rarity when blockchain result comes in
  useEffect(() => {
    if (!targetRarity || !isSpinning || !pendingLand.current) return
    pendingLand.current = false

    // Find the segment matching the target rarity
    const matchingIndices = SEGMENTS.map((s, i) => s.rarity === targetRarity ? i : -1).filter(i => i >= 0)
    const segIdx = matchingIndices[Math.floor(Math.random() * matchingIndices.length)]
    const jitter = (Math.random() - 0.5) * SEG_DEG * 0.5
    const segCenter = segIdx * SEG_DEG + SEG_DEG / 2 + jitter

    // Calculate final landing position
    const targetMod = (360 - segCenter + 360) % 360
    const currentMod = rotation % 360
    const extra = (targetMod - currentMod + 360) % 360
    const fullSpins = (3 + Math.floor(Math.random() * 2)) * 360

    setRotation(prev => prev + fullSpins + extra)
    setTimeout(() => { setIsSpinning(false); onComplete(targetRarity) }, 4500)
  }, [targetRarity, isSpinning, rotation, onComplete])

  useEffect(() => {
    if (spinTrigger > prevTrigger.current) { prevTrigger.current = spinTrigger; startSpin() }
  }, [spinTrigger, startSpin])

  return (
    <div className="sw-root">
      <div className="sw-bg-glow" />
      <div className="sw-pointer">
        <svg width="28" height="22" viewBox="0 0 28 22">
          <defs>
            <linearGradient id="ptr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8d48b" />
              <stop offset="100%" stopColor="#c9a44c" />
            </linearGradient>
            <filter id="ptrglow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#c9a44c" floodOpacity="0.6" />
            </filter>
          </defs>
          <polygon points="14,22 0,0 28,0" fill="url(#ptr)" filter="url(#ptrglow)" />
        </svg>
      </div>
      <div
        className={`sw-wheel ${isSpinning ? 'sw-spinning' : ''}`}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? 'transform 4.5s cubic-bezier(0.12, 0.7, 0.12, 1)' : 'none',
        }}
      >
        <canvas ref={canvasRef} />
      </div>
      <div className={`sw-ring ${isSpinning ? 'sw-ring-active' : ''}`} />
    </div>
  )
}
