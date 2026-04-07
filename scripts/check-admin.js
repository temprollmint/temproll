const { createPublicClient, http, parseAbi } = require('viem');

const client = createPublicClient({ 
  chain: { id: 4217, name: 'Tempo', nativeCurrency: { name: 'USD', symbol: 'USD', decimals: 18 }, rpcUrls: { default: { http: ['https://rpc.tempo.xyz'] } } },
  transport: http('https://rpc.tempo.xyz') 
});

const TOKEN = '0x20C000000000000000000000bDf493011FAe2C52';
const OLD_WALLET = '0x165C8df6fCEe211491267E6eB5B11E6Fc5f22b91';
const NEW_WALLET = '0x99145cbEfBf8c9D62A06200D046B2F3a996194A4';

const ABI = parseAbi([
  'function hasRole(address account, bytes32 role) view returns (bool)',
  'function ISSUER_ROLE() view returns (bytes32)',
]);

async function check() {
  // Get ISSUER_ROLE hash
  const issuerRole = await client.readContract({ address: TOKEN, abi: ABI, functionName: 'ISSUER_ROLE' });
  console.log('ISSUER_ROLE:', issuerRole);

  // DEFAULT_ADMIN_ROLE = 0x00...00
  const adminRole = '0x0000000000000000000000000000000000000000000000000000000000000000';

  // Check old wallet
  const oldHasAdmin = await client.readContract({ address: TOKEN, abi: ABI, functionName: 'hasRole', args: [OLD_WALLET, adminRole] });
  const oldHasIssuer = await client.readContract({ address: TOKEN, abi: ABI, functionName: 'hasRole', args: [OLD_WALLET, issuerRole] });
  console.log(`\nOLD WALLET (${OLD_WALLET}):`);
  console.log('  Has ADMIN:', oldHasAdmin);
  console.log('  Has ISSUER:', oldHasIssuer);

  // Check new wallet
  const newHasAdmin = await client.readContract({ address: TOKEN, abi: ABI, functionName: 'hasRole', args: [NEW_WALLET, adminRole] });
  const newHasIssuer = await client.readContract({ address: TOKEN, abi: ABI, functionName: 'hasRole', args: [NEW_WALLET, issuerRole] });
  console.log(`\nNEW WALLET (${NEW_WALLET}):`);
  console.log('  Has ADMIN:', newHasAdmin);
  console.log('  Has ISSUER:', newHasIssuer);

  // Check old MintSale
  const oldMintSale = '0x27111897A943a766a375932101BDcF5Aba4632a5';
  const msHasIssuer = await client.readContract({ address: TOKEN, abi: ABI, functionName: 'hasRole', args: [oldMintSale, issuerRole] });
  console.log(`\nOLD MINTSALE (${oldMintSale}):`);
  console.log('  Has ISSUER:', msHasIssuer);
}

check().catch(e => console.error('Error:', e.message));
