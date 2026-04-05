import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './components/Providers'
import { Navbar } from './components/Navbar'

export const metadata: Metadata = {
  title: 'TEMPROLL — Spin & Mint on Tempo',
  description: 'Spin the roulette and mint $TEMPROLL tokens on Tempo. Fair launch, 0% team allocation, gamified minting.',
  keywords: ['TEMPROLL', 'Tempo', 'TIP-20', 'mint', 'DeFi', 'spin', 'roulette'],
  icons: {
    icon: '/temproll-logo.svg',
    apple: '/temproll-logo.svg',
  },
  openGraph: {
    title: 'TEMPROLL — Spin & Mint on Tempo',
    description: 'The first spin-to-mint fair launch. Spin the wheel, test your luck, claim $TEMPROLL.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="page-container">
            <Navbar />
            <main className="main-content">
              {children}
            </main>
            <footer className="footer">
              <p className="footer-text">
                <span className="footer-brand">$TEMPROLL</span> · Built on Tempo
              </p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
