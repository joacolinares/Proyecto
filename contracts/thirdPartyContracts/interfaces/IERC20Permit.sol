// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

interface IERC20Permit {
	function permit(
		address owner,
		address spender,
		uint256 amount,
		uint256 deadline,
		uint8 v,
		bytes32 r,
		bytes32 s
	) external;
}
