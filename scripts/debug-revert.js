const { createPublicClient, http, encodeFunctionData, parseAbi, decodeErrorResult } = require('viem');

const client = createPublicClient({ 
  chain: { id: 4217, name: 'Tempo', nativeCurrency: { name: 'USD', symbol: 'USD', decimals: 18 }, rpcUrls: { default: { http: ['https://rpc.tempo.xyz'] } } },
  transport: http('https://rpc.tempo.xyz') 
});

const FACTORY = '0x20Fc000000000000000000000000000000000000';
const PATH_USD = '0x20c0000000000000000000000000000000000000';
const WALLET = '0x99145cbEfBf8c9D62A06200D046B2F3a996194A4';

const ABI = parseAbi([
  'function createToken(string name, string symbol, string currency, address quoteToken, address admin, bytes32 salt) returns (address)',
  'error AddressReserved()',
  'error InvalidQuoteToken()',
  'error InvalidCurrency()',
]);

async function test() {
  const salt = '0x000000000000000000000000000000000000000000000000000000000000beef';
  
  const data = encodeFunctionData({
    abi: ABI,
    functionName: 'createToken',
    args: ['Temproll', 'TEMPROLL', '', PATH_USD, WALLET, salt],
  });

  try {
    const result = await client.call({
      to: FACTORY,
      from: WALLET, 
      data: data,
      gas: 2000000n,
    });
    console.log('SUCCESS! Result:', result);
  } catch (e) {
    console.log('REVERTED!');
    console.log('Full error:', JSON.stringify(e, null, 2).substring(0, 2000));
    
    // Try to decode revert reason
    if (e.cause?.data) {
      console.log('\nRevert data:', e.cause.data);
      try {
        const decoded = decodeErrorResult({ abi: ABI, data: e.cause.data });
        console.log('Decoded:', decoded);
      } catch (e2) {
        console.log('Could not decode with known errors');
      }
    }
    
    // Check if it's a raw revert
    const match = e.message?.match(/0x[0-9a-f]+/i);
    if (match) console.log('\nHex in message:', match[0]);
  }
}

test();
