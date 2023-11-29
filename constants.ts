import * as dotenv from 'dotenv';
dotenv.config();

export const {
	REPORT_GAS,
	TYPECHAIN_ON,
	INFURA_API_KEY,
	WALLET_PRIVKEY,
	ETHERSCAN_API_KEY,
	COINMARKETCAP_API,
} = process.env;

// constracs tags
export const USDC_MOCK_NAME = 'USDCMock';
export const OLPX_MOCK_NAME = 'OLPXMock';
export const ERC20_MOCK_NAME = 'ERC20Mock';
export const ERC721_MOCK_NAME = 'ERC721Mock';
export const ERC1155_MOCK_NAME = 'ERC1155Mock';
export const OPENOCEAN_CALLER_NAME = 'OpenOceanCaller';
export const OPENOCEAN_EXCHANGE_NAME = 'OpenOceanExchange';

// Mainnet contrat adressess
export const WETH_ADDRESS_MAINNET = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
export const CYBER_ADDRESS_MAINNET = '0x14778860e937f509e651192a90589de711fb88a9';
