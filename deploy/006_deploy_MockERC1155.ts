import { Accounts } from 'typescript/hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { ERC1155_MOCK_NAME } from '../constants';

const func: DeployFunction = async function(hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts() as Accounts;

  // Contract used for testing purposes only
  await deploy(ERC1155_MOCK_NAME, {
    log: true,
    from: deployer,
    args: [],
  })
}

func.tags = [ ERC1155_MOCK_NAME ];

export default func;