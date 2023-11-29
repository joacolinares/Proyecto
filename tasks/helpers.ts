import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment, TaskArguments } from 'hardhat/types';

task('signers').setAction(
	async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
		const { ethers } = hre;
		const signers = await ethers.getSigners();
		console.log('signers', signers);
	}
);
