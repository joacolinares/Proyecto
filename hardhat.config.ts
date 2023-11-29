import * as dotenv from 'dotenv';
dotenv.config();

import { HardhatUserConfig } from 'hardhat/types';

// Plugins
import 'hardhat-deploy';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'hardhat-deploy-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomicfoundation/hardhat-ethers';
import '@nomicfoundation/hardhat-chai-matchers';

import {
	REPORT_GAS,
	TYPECHAIN_ON,
	INFURA_API_KEY,
	WALLET_PRIVKEY,
	ETHERSCAN_API_KEY,
	COINMARKETCAP_API,
} from './constants';

// Tasks
if (!TYPECHAIN_ON) {
	require('./tasks/helpers');
}

function getProviderInfuraURL(network: string) {
	return `https://${network}.infura.io/v3/${INFURA_API_KEY}`;
}

// Config
const config: HardhatUserConfig = {
	paths: {
		tests: 'tests',
		deploy: 'deploy',
		sources: 'contracts',
		deployments: 'deployments',
		artifacts: 'build/contracts',
	},
	solidity: {
		compilers: [
			{
				version: '0.8.20',
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
		],
	},
	defaultNetwork: 'hardhat',
	networks: {
		hardhat: {
			tags: ['local'],
			loggingEnabled: false,
			accounts: [{ balance: '10000000000000000000000', privateKey: WALLET_PRIVKEY }],
			forking: {
				// blockNumber: 18628439,
				url: getProviderInfuraURL('mainnet'),
			},
		},
		goerli: {
			tags: ['local'],
			loggingEnabled: false,
			accounts: [WALLET_PRIVKEY],
			url: getProviderInfuraURL('goerli'),
		},
	},
	typechain: {
		target: 'ethers-v6',
		outDir: 'build/types',
	},
	etherscan: {
		apiKey: ETHERSCAN_API_KEY,
	},
	gasReporter: {
		currency: 'USD',
		showTimeSpent: true,
		coinmarketcap: COINMARKETCAP_API,
		// outputFile: 'reports/gas-report.log',
		enabled: REPORT_GAS ? true : false,
	},
	namedAccounts: {
		deployer: 0,
		user1: 1,
		user2: 2,
		user3: 3,
		user4: 4,
	},
	mocha: {
		timeout: 1000 * 60, // 1 min in milliseconds
	},
};

export default config;
