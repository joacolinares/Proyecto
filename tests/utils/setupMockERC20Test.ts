import { deployments, ethers, getNamedAccounts } from 'hardhat';

import { ERC20_MOCK_NAME } from '../../constants';

/* types */
import type { Accounts } from '../../typescript/hardhat';
import type { ERC20Mock as IERC20Mock } from 'build/types';

export async function setupMockERC20Test() {
  await deployments.fixture([ ERC20_MOCK_NAME ]);

  const accounts = await getNamedAccounts() as Accounts;

  const ERC20Mock = await ethers.getContract<IERC20Mock>(ERC20_MOCK_NAME);

  const contracts = { ERC20Mock };

  return {
    accounts,
    contracts,
  }
}