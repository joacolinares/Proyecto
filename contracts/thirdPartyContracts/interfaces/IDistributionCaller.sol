// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

import './IOpenOceanCaller.sol';

interface IDistributionCaller {
	function singleDistributionCall(
		IERC20 token,
		uint256 distribution,
		IOpenOceanCaller.CallDescription memory desc,
		uint256 amountBias
	) external;

	function multiDistributionCall(
		IERC20 token,
		uint256 distribution,
		IOpenOceanCaller.CallDescription[] memory descs,
		uint256[] memory amountBiases
	) external;
}
