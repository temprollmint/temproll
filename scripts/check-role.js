const { createPublicClient, http, parseAbi } = require('viem');
const RPC_URL = 'https://rpc.tempo.xyz';
const CHAIN_ID = 4217;

const client = createPublicClient({ 
  chain: { id: CHAIN_ID, name: 'Tempo', network: 'tempo' },
  transport: http(RPC_URL) 
});

const TOKEN_ADDRESS = '0x20C000000000000000000000bDf493011FAe2C52';
const ADMIN_WALLET = '0x99145cbEfBf8c9D62A06200D046B2F3a996194A4'; // The new dev wallet used by user

const ABI = parseAbi([
  'function hasRole(bytes32 role, address account) view returns (bool)',
  'function DEFAULT_ADMIN_ROLE() view returns (bytes32)',
  'function ISSUER_ROLE() view returns (bytes32)'
]);

async function check() {
  try {
    const adminRole = await client.readContract({
      address: TOKEN_ADDRESS, abi: ABI, functionName: 'DEFAULT_ADMIN_ROLE'
    });
    const issuerRole = await client.readContract({
      address: TOKEN_ADDRESS, abi: ABI, functionName: 'ISSUER_ROLE'
    });

    const hasAdmin = await client.readContract({
      address: TOKEN_ADDRESS, abi: ABI, functionName: 'hasRole', args: [adminRole, ADMIN_WALLET]
    });
    
    // Also check the old owner wallet if new one doesn't have it
    const oldOwner = '0x165C8df6fCEe211491267E6eB5B11E6Fc5f22b91';
    const oldHasAdmin = await client.readContract({
      address: TOKEN_ADDRESS, abi: ABI, functionName: 'hasRole', args: [adminRole, oldOwner]
    });

    console.log('--- TOKEN STATUS ---');
    console.log(`New Wallet (${ADMIN_WALLET}) HAS ADMIN:`, hasAdmin);
    console.log(`Old Wallet (${oldOwner}) HAS ADMIN:`, oldHasAdmin);
  } catch (e) {
    console.error('Error:', e);
  }
}

check();
