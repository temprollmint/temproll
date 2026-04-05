/**
 * TEMPROLL — Full Deployment Script (Tempo Mainnet/Testnet)
 * 
 * This script does everything in one go:
 * 1. Create $TEMPROLL token via TIP-20 Factory
 * 2. Compile & Deploy MintSale contract
 * 3. Grant MintSale the minter role on $TEMPROLL
 * 4. Update contracts.ts config with deployed addresses
 * 
 * Usage:
 *   set PRIVATE_KEY=your_private_key_here
 *   node scripts/deploy.js
 * 
 * ⚠️  NEVER share your PRIVATE_KEY with anyone!
 */

const { createWalletClient, createPublicClient, http, encodeFunctionData, parseAbi } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const solc = require('solc');
const fs = require('fs');
const path = require('path');

// =========================================================================
// Config — Edit these if needed
// =========================================================================
const RPC_URL = 'https://rpc.tempo.xyz';        // Tempo Mainnet RPC
const CHAIN_ID = 4217;                            // Tempo Mainnet Chain ID
const PATH_USD = '0x20c0000000000000000000000000000000000000';
const TIP20_FACTORY = '0x20Fc000000000000000000000000000000000000';

// Token config
const TOKEN_NAME = 'Temproll';
const TOKEN_SYMBOL = 'TEMPROLL';
const TOKEN_DECIMALS = 6;
const TOKEN_TOTAL_SUPPLY = 100_000_000n * 1_000_000n; // 100M with 6 decimals

// =========================================================================
// Setup
// =========================================================================
const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  console.error('❌ Error: Set PRIVATE_KEY environment variable first!');
  console.error('   Windows:  set PRIVATE_KEY=0xYourPrivateKeyHere');
  console.error('   Linux:    export PRIVATE_KEY=0xYourPrivateKeyHere');
  process.exit(1);
}

const account = privateKeyToAccount(PRIVATE_KEY.startsWith('0x') ? PRIVATE_KEY : `0x${PRIVATE_KEY}`);
console.log(`\n🔑 Deploying from wallet: ${account.address}\n`);

const tempoChain = {
  id: CHAIN_ID,
  name: 'Tempo',
  nativeCurrency: { name: 'USD', symbol: 'USD', decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } },
};

const publicClient = createPublicClient({ chain: tempoChain, transport: http(RPC_URL) });
const walletClient = createWalletClient({ account, chain: tempoChain, transport: http(RPC_URL) });

// =========================================================================
// Step 1: Create TEMPROLL Token via TIP-20 Factory
// =========================================================================
async function createToken() {
  console.log('📝 Step 1: Creating $TEMPROLL token via TIP-20 Factory...');

  const TIP20_FACTORY_ABI = parseAbi([
    'function createToken(string name, string symbol, string currency, address quoteToken, address admin, bytes32 salt) returns (address)',
  ]);

  // Salt for deterministic address (use a unique value)
  const salt = '0x0000000000000000000000000000000000000000000000000000000000000001';

  const hash = await walletClient.writeContract({
    address: TIP20_FACTORY,
    abi: TIP20_FACTORY_ABI,
    functionName: 'createToken',
    args: [
      TOKEN_NAME,
      TOKEN_SYMBOL,
      '',                                                         // currency: empty (not a stablecoin)
      '0x0000000000000000000000000000000000000000',               // quoteToken: none
      account.address,                                            // admin: deployer wallet
      salt,
    ],
    gas: 500_000n,
  });

  console.log(`   Tx hash: ${hash}`);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  // The new token address is in the logs
  // TIP-20 Factory typically emits the token address in the first log
  let tokenAddress = null;
  for (const log of receipt.logs) {
    if (log.topics.length > 0) {
      // The created token address is usually in topic[1] or in the log address
      const possibleAddr = log.address;
      if (possibleAddr.toLowerCase() !== TIP20_FACTORY.toLowerCase() &&
        possibleAddr.toLowerCase() !== PATH_USD.toLowerCase()) {
        tokenAddress = possibleAddr;
        break;
      }
    }
  }

  // Fallback: try to get from the last log's address
  if (!tokenAddress && receipt.logs.length > 0) {
    tokenAddress = receipt.logs[receipt.logs.length - 1].address;
  }

  if (!tokenAddress) {
    console.error('❌ Could not find token address in tx receipt. Check explorer manually.');
    console.error('   Receipt:', JSON.stringify(receipt, null, 2));
    process.exit(1);
  }

  console.log(`   ✅ $TEMPROLL token created at: ${tokenAddress}\n`);
  return tokenAddress;
}

// =========================================================================
// Step 2: Compile & Deploy MintSale Contract
// =========================================================================
async function deployMintSale(tokenAddress) {
  console.log('📝 Step 2: Compiling & deploying MintSale contract...');

  // Compile
  const contractPath = path.resolve(__dirname, '../contracts/MintSale.sol');
  const source = fs.readFileSync(contractPath, 'utf8');
  const input = {
    language: 'Solidity',
    sources: { 'MintSale.sol': { content: source } },
    settings: {
      optimizer: { enabled: true, runs: 200 },
      outputSelection: { '*': { '*': ['abi', 'evm.bytecode.object'] } },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  if (output.errors) {
    const errors = output.errors.filter(e => e.severity === 'error');
    if (errors.length > 0) {
      console.error('❌ Compilation errors:');
      errors.forEach(e => console.error(e.formattedMessage));
      process.exit(1);
    }
  }

  const contract = output.contracts['MintSale.sol']['MintSale'];
  const bytecode = '0x' + contract.evm.bytecode.object;
  const abi = contract.abi;

  console.log(`   ✅ Compiled successfully (${bytecode.length} chars bytecode)`);

  // Save compiled output
  const compiledPath = path.resolve(__dirname, '../app/config/MintSaleCompiled.json');
  fs.writeFileSync(compiledPath, JSON.stringify({ abi, bytecode }, null, 2));

  // Deploy
  const hash = await walletClient.deployContract({
    abi,
    bytecode,
    args: [PATH_USD, tokenAddress, account.address],
    gas: 5_000_000n,
  });

  console.log(`   Tx hash: ${hash}`);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  const mintSaleAddress = receipt.contractAddress;

  console.log(`   ✅ MintSale deployed at: ${mintSaleAddress}\n`);
  return mintSaleAddress;
}

// =========================================================================
// Step 3: Grant Minter Role (so MintSale can mint TEMPROLL)
// =========================================================================
async function grantMinterRole(tokenAddress, mintSaleAddress) {
  console.log('📝 Step 3: Granting ISSUER_ROLE to MintSale...');

  // TIP-20 uses RBAC: we need to grant ISSUER_ROLE to MintSale so it can mint tokens
  // ISSUER_ROLE = keccak256("ISSUER_ROLE")
  const ROLE_ABI = parseAbi([
    'function grantRole(bytes32 role, address account)',
    'function ISSUER_ROLE() view returns (bytes32)',
  ]);

  try {
    // First get the ISSUER_ROLE hash
    const issuerRole = await publicClient.readContract({
      address: tokenAddress,
      abi: ROLE_ABI,
      functionName: 'ISSUER_ROLE',
    });
    console.log(`   ISSUER_ROLE hash: ${issuerRole}`);

    // Grant ISSUER_ROLE to MintSale contract
    const hash = await walletClient.writeContract({
      address: tokenAddress,
      abi: ROLE_ABI,
      functionName: 'grantRole',
      args: [issuerRole, mintSaleAddress],
      gas: 500_000n,
    });
    console.log(`   Tx hash: ${hash}`);
    await publicClient.waitForTransactionReceipt({ hash });
    console.log(`   ✅ ISSUER_ROLE granted to MintSale!\n`);
  } catch (e) {
    console.log(`   ⚠️  Could not auto-grant ISSUER_ROLE: ${e.message}`);
    console.log(`   You need to manually grant ISSUER_ROLE to MintSale (${mintSaleAddress})`);
    console.log(`   via Remix or the Tempo explorer.\n`);
  }
}

// =========================================================================
// Step 4: Update contracts.ts config
// =========================================================================
function updateConfig(tokenAddress, mintSaleAddress) {
  console.log('📝 Step 4: Updating contracts.ts config...');

  const configPath = path.resolve(__dirname, '../app/config/contracts.ts');
  let config = fs.readFileSync(configPath, 'utf8');

  // Replace placeholder addresses
  config = config.replace(
    /TEMPROLL_TOKEN: '0x0+' as const/,
    `TEMPROLL_TOKEN: '${tokenAddress}' as const`
  );
  config = config.replace(
    /MINT_SALE: '0x0+' as const/,
    `MINT_SALE: '${mintSaleAddress}' as const`
  );
  config = config.replace(
    /OWNER_WALLET: '0x0+' as const/,
    `OWNER_WALLET: '${account.address}' as const`
  );

  fs.writeFileSync(configPath, config);
  console.log(`   ✅ contracts.ts updated!\n`);
}

// =========================================================================
// Run Everything
// =========================================================================
async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  🎰 TEMPROLL — Full Deployment Script');
  console.log('═══════════════════════════════════════════════════\n');

  try {
    const balance = await publicClient.getBalance({ address: account.address });
    console.log(`💰 Wallet balance: ${Number(balance) / 1e18} TEMPO\n`);

    const tokenAddress = await createToken();
    const mintSaleAddress = await deployMintSale(tokenAddress);
    await grantMinterRole(tokenAddress, mintSaleAddress);
    updateConfig(tokenAddress, mintSaleAddress);

    console.log('═══════════════════════════════════════════════════');
    console.log('  ✅ DEPLOYMENT COMPLETE!');
    console.log('═══════════════════════════════════════════════════');
    console.log(`  Token:    ${tokenAddress}`);
    console.log(`  MintSale: ${mintSaleAddress}`);
    console.log(`  Owner:    ${account.address}`);
    console.log('═══════════════════════════════════════════════════\n');
    console.log('Now run: npm run dev');
    console.log('Your mint page is LIVE! 🚀\n');
  } catch (err) {
    console.error('\n❌ Deployment failed:', err.message || err);
    process.exit(1);
  }
}

main();
