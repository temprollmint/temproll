const solc = require('solc');
const fs = require('fs');
const path = require('path');

const contractPath = path.resolve(__dirname, '../contracts/MintSale.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'MintSale.sol': { content: source },
  },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode.object'],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  const errors = output.errors.filter(e => e.severity === 'error');
  if (errors.length > 0) {
    console.error('Compilation errors:');
    errors.forEach(e => console.error(e.formattedMessage));
    process.exit(1);
  }
}

const contract = output.contracts['MintSale.sol']['MintSale'];
const abi = contract.abi;
const bytecode = '0x' + contract.evm.bytecode.object;

// Write the compiled output
const outputData = {
  abi,
  bytecode,
};

const outputPath = path.resolve(__dirname, '../app/config/MintSaleCompiled.json');
fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));

console.log('MintSale compiled successfully!');
console.log('ABI functions:', abi.filter(x => x.type === 'function').map(x => x.name));
console.log('Bytecode length:', bytecode.length, 'chars');
