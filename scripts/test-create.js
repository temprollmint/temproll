/**
 * Test createToken with detailed error catching
 */
const { createWalletClient, createPublicClient, http, parseAbi, decodeErrorResult } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');

const RPC_URL = 'https://rpc.tempo.xyz';
const CHAIN_ID = 4217;
const TIP20_FACTORY = '0x20Fc000000000000000000000000000000000000';
const PATH_USD = '0x20c0000000000000000000000000000000000000';

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const account = privateKeyToAccount(PRIVATE_KEY.startsWith('0x') ? PRIVATE_KEY : `0x${PRIVATE_KEY}`);

const tempoChain = {
  id: CHAIN_ID, name: 'Tempo',
  nativeCurrency: { name: 'USD', symbol: 'USD', decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } },
};

const publicClient = createPublicClient({ chain: tempoChain, transport: http(RPC_URL) });
const walletClient = createWalletClient({ account, chain: tempoChain, transport: http(RPC_URL) });

const FACTORY_ABI = parseAbi([
  'function createToken(string name, string symbol, string currency, address quoteToken, address admin, bytes32 salt) returns (address)',
  'function getTokenAddress(address sender, bytes32 salt) view returns (address)',
  'function isTIP20(address token) view returns (bool)',
  'error AddressReserved()',
  'error InvalidQuoteToken()',
]);

async function main() {
  const salt = '0x0000000000000000000000000000000000000000000000000000000000001234';
  
  console.log('Wallet:', account.address);
  
  // Check if pathUSD is valid TIP-20
  const isPathUsdTip20 = await publicClient.readContract({
    address: TIP20_FACTORY, abi: FACTORY_ABI,
    functionName: 'isTIP20', args: [PATH_USD],
  });
  console.log('pathUSD is TIP-20:', isPathUsdTip20);

  // Get predicted address
  const predicted = await publicClient.readContract({
    address: TIP20_FACTORY, abi: FACTORY_ABI,
    functionName: 'getTokenAddress', args: [account.address, salt],
  });
  console.log('Predicted address:', predicted);

  // Check if already exists
  const alreadyExists = await publicClient.readContract({
    address: TIP20_FACTORY, abi: FACTORY_ABI,
    functionName: 'isTIP20', args: [predicted],
  });
  console.log('Already exists:', alreadyExists);

  if (alreadyExists) {
    console.log('Token already exists at this address! Use a different salt.');
    return;
  }

  // Try simulate first before sending real tx
  console.log('\n--- Simulating with quoteToken=pathUSD, currency="" ---');
  try {
    const result = await publicClient.simulateContract({
      account: account,
      address: TIP20_FACTORY, abi: FACTORY_ABI,
      functionName: 'createToken',
      args: ['Temproll', 'TEMPROLL', '', PATH_USD, account.address, salt],
      gas: 2_000_000n,
    });
    console.log('SIMULATION SUCCESS! Result:', result.result);
  } catch (e) {
    console.log('Simulation FAILED:', e.message?.substring(0, 500));
    if (e.cause?.data) {
      try {
        const decoded = decodeErrorResult({ abi: FACTORY_ABI, data: e.cause.data });
        console.log('Decoded error:', decoded);
      } catch(_) {}
    }
  }

  // Try with address(0)
  console.log('\n--- Simulating with quoteToken=address(0), currency="" ---');
  try {
    const result = await publicClient.simulateContract({
      account: account,
      address: TIP20_FACTORY, abi: FACTORY_ABI,
      functionName: 'createToken',
      args: ['Temproll', 'TEMPROLL', '', '0x0000000000000000000000000000000000000000', account.address, salt],
      gas: 2_000_000n,
    });
    console.log('SIMULATION SUCCESS! Result:', result.result);
  } catch (e) {
    console.log('Simulation FAILED:', e.message?.substring(0, 500));
  }

  // Try with currency="USD"  
  console.log('\n--- Simulating with quoteToken=pathUSD, currency="USD" ---');
  try {
    const result = await publicClient.simulateContract({
      account: account,
      address: TIP20_FACTORY, abi: FACTORY_ABI,
      functionName: 'createToken',
      args: ['Temproll', 'TEMPROLL', 'USD', PATH_USD, account.address, salt],
      gas: 2_000_000n,
    });
    console.log('SIMULATION SUCCESS! Result:', result.result);
  } catch (e) {
    console.log('Simulation FAILED:', e.message?.substring(0, 500));
  }
}

main().catch(e => console.error('Fatal:', e.message));
