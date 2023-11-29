import { deployments, ethers, getNamedAccounts } from 'hardhat';

import {
	OLPX_MOCK_NAME,
	USDC_MOCK_NAME,
	OPENOCEAN_CALLER_NAME,
	OPENOCEAN_EXCHANGE_NAME,
} from '../../constants';

/* types */
import type { Accounts, NamedSigners } from '../../typescript/hardhat';
import type {
	ERC20Mock as IERC20Mock,
	OpenOceanCaller as IOpenOceanCaller,
	OpenOceanExchange as IOpenOceanExchange,
} from 'build/types';

export async function setupOpenOceanExchangeTest() {
	await deployments.fixture([
		OPENOCEAN_EXCHANGE_NAME,
		OPENOCEAN_CALLER_NAME,
		USDC_MOCK_NAME,
		OLPX_MOCK_NAME,
	]);

	const accounts = (await getNamedAccounts()) as Accounts;
	const signers = (await ethers.getNamedSigners()) as NamedSigners;

	const [USDC, OLPX, OpenOceanCaller, OpenOceanExchange] = await Promise.all([
		ethers.getContract<IERC20Mock>(USDC_MOCK_NAME),
		ethers.getContract<IERC20Mock>(OLPX_MOCK_NAME),
		ethers.getContract<IOpenOceanCaller>(OPENOCEAN_CALLER_NAME),
		ethers.getContract<IOpenOceanExchange>(OPENOCEAN_EXCHANGE_NAME),
	]);

	const contracts = { OpenOceanExchange, OpenOceanCaller, USDC, OLPX };

	return {
		signers,
		accounts,
		contracts,
	};
}
