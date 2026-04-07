// =========================================================================
// Contract Addresses (Tempo Mainnet)
// =========================================================================
// =========================================================================

export const CONTRACTS = {
  // pathUSD - Native stablecoin on Tempo (TIP-20)
  PATH_USD: '0x20c0000000000000000000000000000000000000' as const,

  // TIP-20 Factory Precompile
  TIP20_FACTORY: '0x20Fc000000000000000000000000000000000000' as const,

  // $TEMPROLL Token (TIP-20) — DEPLOYED on Tempo Mainnet
  TEMPROLL_TOKEN: '0x20C000000000000000000000a943E88Ee77D9F7a' as const,

  // MintSale Contract — DEPLOYED on Tempo Mainnet
  MINT_SALE: '0x96D0B039748B30F9907DEA0118a43627026FE936' as const,

  // Owner Wallet — receives $0.50 from every spin
  OWNER_WALLET: '0x222855Bac9D71C423858F0FC3B18b0018E445c80' as const,

  // DEX Router on Tempo Mainnet
  UNISWAP_V2_FACTORY: '0xf9ec577a4e45b5278bb7cf60fcbc20c3acaef68f' as const,
  UNISWAP_V2_ROUTER: '0x0fbac3c46f6f83b44c7fb4ea986d7309c701d73e' as const,
} as const

// =========================================================================
// Token Constants
// =========================================================================

export const TOKEN = {
  name: 'Temproll',
  symbol: 'TEMPROLL',
  decimals: 6,
  totalSupply: 100_000_000,
  publicMint: 80_000_000,
  lpReserve: 20_000_000,
  pricePerToken: 0.0001, // $0.0001
  fdvMcap: 10_000, // $10K
} as const

// Single mint tier: $0.50 per spin
export const MINT_TIERS = [
  {
    label: '$0.50',
    price: 0.5,
    priceRaw: 500_000n,        // 0.5 pathUSD (6 decimals)
    tokens: 10_000,
    tokensRaw: 10_000_000_000n,  // 10,000 TEMPROLL base (6 decimals)
  },
] as const

// Total tokens sold if all sold out = 80,000,000
// Expected revenue if sold out = ~$3,368 pathUSD (avg 11,875 tokens/spin due to 75% bronze chance)

// =========================================================================
// ABIs
// =========================================================================

// TIP-20 / ERC-20 compatible ABI (subset for our needs)
export const TIP20_ABI = [
  {
    type: 'function',
    name: 'name',
    inputs: [],
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [{ type: 'uint8' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'totalSupply',
    inputs: [],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transfer',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferFrom',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'Approval',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
] as const

// MintSale contract ABI (Gacha version — no args for mint)
export const MINT_SALE_ABI = [
  {
    type: 'function',
    name: 'mint',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'totalTokensSold',
    inputs: [],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'remainingTokens',
    inputs: [],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalRaised',
    inputs: [],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'PUBLIC_SUPPLY',
    inputs: [],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'MINT_PRICE',
    inputs: [],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalSpins',
    inputs: [],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'userSpins',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'userTokens',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'mintClosed',
    inputs: [],
    outputs: [{ type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'Minted',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'amountPaid', type: 'uint256', indexed: false },
      { name: 'tokensReceived', type: 'uint256', indexed: false },
      { name: 'rarity', type: 'uint8', indexed: false },
    ],
  },
] as const

// Uniswap V2 Router02 ABI (subset)
export const UNISWAP_V2_ROUTER_ABI = [
  {
    type: 'function',
    name: 'getAmountsOut',
    inputs: [
      { name: 'amountIn', type: 'uint256' },
      { name: 'path', type: 'address[]' },
    ],
    outputs: [{ name: 'amounts', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAmountsIn',
    inputs: [
      { name: 'amountOut', type: 'uint256' },
      { name: 'path', type: 'address[]' },
    ],
    outputs: [{ name: 'amounts', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'swapExactTokensForTokens',
    inputs: [
      { name: 'amountIn', type: 'uint256' },
      { name: 'amountOutMin', type: 'uint256' },
      { name: 'path', type: 'address[]' },
      { name: 'to', type: 'address' },
      { name: 'deadline', type: 'uint256' },
    ],
    outputs: [{ name: 'amounts', type: 'uint256[]' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'WETH',
    inputs: [],
    outputs: [{ type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'factory',
    inputs: [],
    outputs: [{ type: 'address' }],
    stateMutability: 'view',
  },
] as const

// Uniswap V2 Factory ABI (subset)
export const UNISWAP_V2_FACTORY_ABI = [
  {
    type: 'function',
    name: 'getPair',
    inputs: [
      { name: 'tokenA', type: 'address' },
      { name: 'tokenB', type: 'address' },
    ],
    outputs: [{ name: 'pair', type: 'address' }],
    stateMutability: 'view',
  },
] as const

// Uniswap V2 Pair ABI (subset)
export const UNISWAP_V2_PAIR_ABI = [
  {
    type: 'function',
    name: 'getReserves',
    inputs: [],
    outputs: [
      { name: 'reserve0', type: 'uint112' },
      { name: 'reserve1', type: 'uint112' },
      { name: 'blockTimestampLast', type: 'uint32' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'token0',
    inputs: [],
    outputs: [{ type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'token1',
    inputs: [],
    outputs: [{ type: 'address' }],
    stateMutability: 'view',
  },
] as const
