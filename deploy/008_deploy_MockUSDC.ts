import { Accounts } from 'typescript/hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { ERC20_MOCK_NAME, USDC_MOCK_NAME } from '../constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployments, getNamedAccounts } = hre;
	const { deploy } = deployments;
	const { deployer } = (await getNamedAccounts()) as Accounts;

	// Contract used for testing purposes only
	await deploy(USDC_MOCK_NAME, {
		log: true,
		from: deployer,
		contract: ERC20_MOCK_NAME,
		args: [
			USDC_MOCK_NAME, // string memory name_
			'USDC', // string memory symbol_
		],
	});
};

func.tags = [USDC_MOCK_NAME];

export default func;
