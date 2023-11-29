import { assert } from "chai";
import { setupMockERC20Test } from "./utils/setupMockERC20Test";

describe('ERC20Mock contract', () => {
  it('ERC20Mock contract must be deployed', async () => {
    const { contracts: { ERC20Mock } } = await setupMockERC20Test();
    assert.ok(await ERC20Mock.getAddress());
  });
})