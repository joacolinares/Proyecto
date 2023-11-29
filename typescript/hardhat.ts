import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

export type Accounts =  {
  deployer: string;
  user1: string;
  user2: string;
  user3: string;
  user4: string;
}

export type NamedSigners = {
  deployer: HardhatEthersSigner;
  user1: HardhatEthersSigner;
  user2: HardhatEthersSigner;
  user3: HardhatEthersSigner;
  user4: HardhatEthersSigner;
}