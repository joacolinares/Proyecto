import { Accounts } from 'typescript/hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { OPENOCEAN_CALLER_NAME, OPENOCEAN_EXCHANGE_NAME } from '../constants';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployments, getNamedAccounts } = hre;
	const { deploy } = deployments;
	const { deployer } = (await getNamedAccounts()) as Accounts;

	await deploy(OPENOCEAN_EXCHANGE_NAME, {
		log: true,
		from: deployer,
		proxy: {
			proxyContract: 'UUPSProxy',
			execute: {
				init: {
					methodName: 'initialize',
					args: [],
				},
			},
		},
	});
};

func.tags = [OPENOCEAN_EXCHANGE_NAME];
func.dependencies = [OPENOCEAN_CALLER_NAME];

export default func;
