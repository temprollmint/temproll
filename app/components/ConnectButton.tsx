'use client'

import { useAccount, useConnect, useDisconnect, useReconnect, useSwitchChain } from 'wagmi'
import { tempoMainnet } from '../config/chains'
import { useState, useEffect } from 'react'

export function ConnectButton() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { reconnect } = useReconnect()
  const { switchChain } = useSwitchChain()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    reconnect()
  }, [reconnect])

  const handleConnect = async () => {
    // Try to add Tempo network to MetaMask first
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${tempoMainnet.id.toString(16)}`,
            chainName: tempoMainnet.name,
            nativeCurrency: tempoMainnet.nativeCurrency,
            rpcUrls: [tempoMainnet.rpcUrls.default.http[0]],
            blockExplorerUrls: [tempoMainnet.blockExplorers.default.url],
          }],
        })
      } catch {
        // ignore
      }
    }

    const connector = connectors[0]
    if (connector) {
      connect({ connector, chainId: tempoMainnet.id })
    }
  }

  const handleSwitchNetwork = () => {
    switchChain({ chainId: tempoMainnet.id })
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button className="btn btn-connect" disabled id="connect-wallet-btn">
        Connect Wallet
      </button>
    )
  }

  if (isConnected && address) {
    const wrongNetwork = chain?.id !== tempoMainnet.id

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {wrongNetwork && (
          <button
            className="btn btn-sm btn-outline"
            onClick={handleSwitchNetwork}
            style={{ fontSize: '12px', borderColor: '#c94c4c', color: '#c94c4c' }}
          >
            Switch Network
          </button>
        )}
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => disconnect()}
          id="disconnect-btn"
        >
          {address.slice(0, 6)}...{address.slice(-4)}
        </button>
      </div>
    )
  }

  return (
    <button
      className="btn btn-connect"
      onClick={handleConnect}
      disabled={isPending}
      id="connect-wallet-btn"
    >
      {isPending ? (
        <>
          <span className="spinner" />
          Connecting...
        </>
      ) : (
        'Connect Wallet'
      )}
    </button>
  )
}
