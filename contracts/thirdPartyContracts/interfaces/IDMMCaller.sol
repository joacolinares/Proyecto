// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

interface IDMMPool {
	function getTradeInfo()
		external
		view
		returns (
			uint112 reserve0,
			uint112 reserve1,
			uint112 _vReserve0,
			uint112 _vReserve1,
			uint256 feeInPrecision
		);

	function swap(
		uint256 amount0Out,
		uint256 amount1Out,
		address to,
		bytes calldata data
	) external;
}

interface IDMMCaller {
	function dmmSwap(address pool, IERC20 from, IERC20 to, address target) external;
}
