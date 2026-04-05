'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { CONTRACTS, TIP20_ABI, UNISWAP_V2_ROUTER_ABI } from '../config/contracts'

type SwapDirection = 'temprollToPathusd' | 'pathusdToTemproll'

export function SwapInterface() {
  const { address, isConnected } = useAccount()
  const [direction, setDirection] = useState<SwapDirection>('pathusdToTemproll')
  const [inputAmount, setInputAmount] = useState('')
  const [outputAmount, setOutputAmount] = useState('')
  const [slippage, setSlippage] = useState(0.5)
  const [showSettings, setShowSettings] = useState(false)

  const isContractDeployed = true

  const tokenIn = direction === 'pathusdToTemproll' ? CONTRACTS.PATH_USD : CONTRACTS.TEMPROLL_TOKEN
  const tokenOut = direction === 'pathusdToTemproll' ? CONTRACTS.TEMPROLL_TOKEN : CONTRACTS.PATH_USD

  // Read input token balance
  const { data: inputBalance } = useReadContract({
    address: tokenIn,
    abi: TIP20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && isContractDeployed },
  })

  // Read output token balance
  const { data: outputBalance } = useReadContract({
    address: tokenOut,
    abi: TIP20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && isContractDeployed },
  })

  // Get quote from Router
  const inputParsed = inputAmount && !isNaN(Number(inputAmount)) && Number(inputAmount) > 0
    ? parseUnits(inputAmount, 6)
    : 0n

  const { data: amountsOut } = useReadContract({
    address: CONTRACTS.UNISWAP_V2_ROUTER,
    abi: UNISWAP_V2_ROUTER_ABI,
    functionName: 'getAmountsOut',
    args: inputParsed > 0n && isContractDeployed
      ? [inputParsed, [tokenIn, tokenOut]]
      : undefined,
    query: { enabled: inputParsed > 0n && isContractDeployed },
  })

  useEffect(() => {
    if (amountsOut && Array.isArray(amountsOut) && amountsOut.length > 1) {
      setOutputAmount(formatUnits(amountsOut[1], 6))
    } else if (!inputAmount || inputAmount === '0') {
      setOutputAmount('')
    }
  }, [amountsOut, inputAmount])

  // Read allowance
  const { data: allowanceData } = useReadContract({
    address: tokenIn,
    abi: TIP20_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.UNISWAP_V2_ROUTER] : undefined,
    query: { enabled: !!address && isContractDeployed },
  })

  const needsApproval = allowanceData !== undefined && inputParsed > 0n
    ? BigInt(allowanceData.toString()) < inputParsed
    : true

  // Approve
  const { writeContract: approveWrite, data: approveTx, isPending: isApprovePending } = useWriteContract()
  const { isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveTx })

  // Swap
  const { writeContract: swapWrite, data: swapTx, isPending: isSwapPending } = useWriteContract()
  const { isSuccess: swapSuccess } = useWaitForTransactionReceipt({ hash: swapTx })

  const handleApprove = () => {
    if (!isContractDeployed) return
    approveWrite({
      address: tokenIn,
      abi: TIP20_ABI,
      functionName: 'approve',
      args: [CONTRACTS.UNISWAP_V2_ROUTER, inputParsed],
    })
  }

  const handleSwap = () => {
    if (!isContractDeployed || !address || !amountsOut) return
    const minOut = BigInt(amountsOut[1]) * BigInt(Math.floor((100 - slippage) * 100)) / 10000n
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200) // 20 minutes

    swapWrite({
      address: CONTRACTS.UNISWAP_V2_ROUTER,
      abi: UNISWAP_V2_ROUTER_ABI,
      functionName: 'swapExactTokensForTokens',
      args: [inputParsed, minOut, [tokenIn, tokenOut], address, deadline],
    })
  }

  const toggleDirection = () => {
    setDirection(d => d === 'pathusdToTemproll' ? 'temprollToPathusd' : 'pathusdToTemproll')
    setInputAmount('')
    setOutputAmount('')
  }

  const handleMaxInput = () => {
    if (inputBalance) {
      setInputAmount(formatUnits(inputBalance as bigint, 6))
    }
  }

  const inputTokenName = direction === 'pathusdToTemproll' ? 'pathUSD' : 'TEMPROLL'
  const outputTokenName = direction === 'pathusdToTemproll' ? 'TEMPROLL' : 'pathUSD'

  const formattedInputBalance = inputBalance
    ? Number(formatUnits(inputBalance as bigint, 6)).toFixed(2)
    : '0.00'

  const formattedOutputBalance = outputBalance
    ? Number(formatUnits(outputBalance as bigint, 6)).toFixed(2)
    : '0.00'

  useEffect(() => {
    if (swapSuccess) {
      setInputAmount('')
      setOutputAmount('')
    }
  }, [swapSuccess])

  return (
    <div className="swap-container" id="swap-interface">
      <div className="swap-card">
        <div className="swap-card-header">
          <div className="swap-card-title">Swap</div>
          <button
            className="swap-settings-btn"
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            ⚙
          </button>
        </div>

        {/* Slippage settings */}
        {showSettings && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 16,
            border: '1px solid var(--border-default)',
          }}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Slippage Tolerance
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[0.1, 0.5, 1.0].map((s) => (
                <button
                  key={s}
                  className={`btn btn-sm ${slippage === s ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSlippage(s)}
                  style={{ fontSize: 12, padding: '4px 12px' }}
                >
                  {s}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input token */}
        <div className="swap-input-group">
          <div className="swap-input-header">
            <span className="swap-input-label">You Pay</span>
            <span className="swap-input-balance">
              Balance: {formattedInputBalance}
              {isConnected && (
                <button onClick={handleMaxInput}>MAX</button>
              )}
            </span>
          </div>
          <div className="swap-input-row">
            <input
              type="number"
              className="swap-input"
              placeholder="0.00"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              id="swap-input-amount"
            />
            <div className="swap-token-select">
              <div className="swap-token-icon" style={
                direction === 'pathusdToTemproll'
                  ? { background: 'linear-gradient(135deg, #4c9ec9, #6bb5e0)' }
                  : {}
              }>
                {direction === 'pathusdToTemproll' ? '$' : 'T'}
              </div>
              {inputTokenName}
            </div>
          </div>
        </div>

        {/* Swap direction button */}
        <div className="swap-direction-wrapper">
          <button className="swap-direction-btn" onClick={toggleDirection} id="swap-direction-btn">
            ↕
          </button>
        </div>

        {/* Output token */}
        <div className="swap-input-group">
          <div className="swap-input-header">
            <span className="swap-input-label">You Receive</span>
            <span className="swap-input-balance">
              Balance: {formattedOutputBalance}
            </span>
          </div>
          <div className="swap-input-row">
            <input
              type="number"
              className="swap-input"
              placeholder="0.00"
              value={outputAmount}
              readOnly
              id="swap-output-amount"
            />
            <div className="swap-token-select">
              <div className="swap-token-icon" style={
                direction === 'temprollToPathusd'
                  ? { background: 'linear-gradient(135deg, #4c9ec9, #6bb5e0)' }
                  : {}
              }>
                {direction === 'temprollToPathusd' ? '$' : 'T'}
              </div>
              {outputTokenName}
            </div>
          </div>
        </div>

        {/* Swap details */}
        {outputAmount && inputAmount && (
          <div style={{ marginTop: 16 }}>
            <div className="swap-detail">
              <span className="swap-detail-label">Rate</span>
              <span className="swap-detail-value">
                1 {inputTokenName} = {(Number(outputAmount) / Number(inputAmount)).toFixed(4)} {outputTokenName}
              </span>
            </div>
            <div className="swap-detail">
              <span className="swap-detail-label">Slippage</span>
              <span className="swap-detail-value">{slippage}%</span>
            </div>
            <div className="swap-detail">
              <span className="swap-detail-label">Min Received</span>
              <span className="swap-detail-value">
                {(Number(outputAmount) * (1 - slippage / 100)).toFixed(4)} {outputTokenName}
              </span>
            </div>
          </div>
        )}

        {/* Swap button */}
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-primary btn-lg btn-full" disabled style={{ opacity: 0.6 }}>
              ⏳ Coming Soon
            </button>
        </div>
      </div>
    </div>
  )
}
