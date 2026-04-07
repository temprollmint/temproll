const { createPublicClient, http, parseAbi } = require('viem');
const client = createPublicClient({ 
  chain: { id: 4217, name: 'Tempo', nativeCurrency: { name: 'USD', symbol: 'USD', decimals: 18 }, rpcUrls: { default: { http: ['https://rpc.tempo.xyz'] } } },
  transport: http('https://rpc.tempo.xyz') 
});

const TOKEN = '0x20C000000000000000000000bDf493011FAe2C52';
const ABI = parseAbi([
  'function quoteToken() view returns (address)',
  'function currency() view returns (string)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
]);

async function check() {
  const qt = await client.readContract({ address: TOKEN, abi: ABI, functionName: 'quoteToken' });
  const cur = await client.readContract({ address: TOKEN, abi: ABI, functionName: 'currency' });
  const name = await client.readContract({ address: TOKEN, abi: ABI, functionName: 'name' });
  const sym = await client.readContract({ address: TOKEN, abi: ABI, functionName: 'symbol' });
  console.log('Old token params:');
  console.log('  name:', name);
  console.log('  symbol:', sym);
  console.log('  currency:', JSON.stringify(cur));
  console.log('  quoteToken:', qt);
}
check();
