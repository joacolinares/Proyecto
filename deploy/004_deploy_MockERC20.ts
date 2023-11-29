import { Accounts } from 'typescript/hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { ERC20_MOCK_NAME } from '../constants';

const func: DeployFunction = async function(hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts() as Accounts;

  // Contract used for testing purposes only
  await deploy(ERC20_MOCK_NAME, {
    log: true,
    from: deployer,
    args: [
      'Token ERC20Mock', // string memory name_
      'ERCM20', // string memory symbol_
    ],
  })
}

func.tags = [ ERC20_MOCK_NAME ];

export default func;