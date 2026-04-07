const { createPublicClient, http, parseAbi } = require('viem');
const RPC_URL = 'https://rpc.tempo.xyz';

const client = createPublicClient({ 
  chain: { id: 4217, name: 'Tempo', nativeCurrency: { name: 'USD', symbol: 'USD', decimals: 18 }, rpcUrls: { default: { http: [RPC_URL] } } },
  transport: http(RPC_URL) 
});

const FACTORY = '0x20Fc000000000000000000000000000000000000';
const PATH_USD = '0x20c0000000000000000000000000000000000000';

async function findToken() {
  // Get recent transactions from the deployer
  const account = '0x99145cbEfBf8c9D62A06200D046B2F3a996194A4';
  
  // Check the latest block for our createToken tx
  const blockNum = await client.getBlockNumber();
  console.log('Current block:', blockNum);
  
  // Search last 100 blocks for token creation
  for (let i = 0; i < 100; i++) {
    try {
      const block = await client.getBlock({ blockNumber: blockNum - BigInt(i), includeTransactions: true });
      for (const tx of block.transactions) {
        if (tx.from && tx.from.toLowerCase() === account.toLowerCase() && tx.to && tx.to.toLowerCase() === FACTORY.toLowerCase()) {
          console.log(`\nFound createToken tx in block ${blockNum - BigInt(i)}:`);
          console.log(`  Hash: ${tx.hash}`);
          const receipt = await client.getTransactionReceipt({ hash: tx.hash });
          console.log(`  Logs count: ${receipt.logs.length}`);
          for (const log of receipt.logs) {
            console.log(`  Log address: ${log.address}`);
            if (log.address.toLowerCase() !== FACTORY.toLowerCase() && 
                log.address.toLowerCase() !== PATH_USD.toLowerCase()) {
              console.log(`  >>> NEW TOKEN ADDRESS: ${log.address}`);
            }
          }
          return;
        }
      }
    } catch(e) { /* skip */ }
  }
  console.log('Not found in last 100 blocks');
}

findToken();
