'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectButton } from './ConnectButton'

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="navbar" id="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          <img src="/temproll-logo.svg" alt="TEMPROLL" style={{ width: 32, height: 32, borderRadius: '50%' }} />
          <span>TEMPROLL</span>
        </Link>

        <div className="navbar-links">
          <Link href="/" className={`navbar-link ${pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <Link href="/mint" className={`navbar-link ${pathname === '/mint' ? 'active' : ''}`}>
            Mint
          </Link>
          <Link href="/swap" className={`navbar-link ${pathname === '/swap' ? 'active' : ''}`}>
            Swap
          </Link>
          <Link href="/stake" className={`navbar-link ${pathname === '/stake' ? 'active' : ''}`}>
            Stake
          </Link>
          <Link href="/docs" className={`navbar-link ${pathname === '/docs' ? 'active' : ''}`}>
            Docs
          </Link>
        </div>

        <div className="navbar-right">
          <div className="navbar-network">
            <div className="navbar-network-dot" />
            Tempo
          </div>
          <ConnectButton />
        </div>
      </div>
    </nav>
  )
}
