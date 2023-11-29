// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import '@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';

import './libraries/UniversalERC20.sol';
import './interfaces/IOpenOceanCaller.sol';
import './libraries/RevertReasonParser.sol';

import 'hardhat/console.sol';

contract OpenOceanExchange is OwnableUpgradeable, PausableUpgradeable, UUPSUpgradeable {
	using SafeERC20 for IERC20;
	using UniversalERC20 for IERC20;

	uint256 private constant _PARTIAL_FILL = 0x01;
	uint256 private constant _SHOULD_CLAIM = 0x02;

	struct SwapDescription {
		IERC20 srcToken;
		IERC20 dstToken;
		address srcReceiver;
		address dstReceiver;
		uint256 amount;
		uint256 minReturnAmount;
		uint256 guaranteedAmount;
		uint256 flags;
		address referrer;
		bytes permit;
	}

	event Swapped(
		address indexed sender,
		IERC20 indexed srcToken,
		IERC20 indexed dstToken,
		address dstReceiver,
		uint256 amount,
		uint256 spentAmount,
		uint256 returnAmount,
		uint256 minReturnAmount,
		uint256 guaranteedAmount,
		address referrer
	);

	function initialize() public initializer {
		__Ownable_init(msg.sender);
		__Pausable_init();
		__UUPSUpgradeable_init();
	}

	function swap(
		IOpenOceanCaller caller,
		SwapDescription calldata desc,
		IOpenOceanCaller.CallDescription[] calldata calls
	) external payable whenNotPaused returns (uint256 returnAmount) {
		require(desc.minReturnAmount > 0, 'Min return should not be 0');
		require(calls.length > 0, 'Call data should exist');

		uint256 flags = desc.flags;
		IERC20 srcToken = desc.srcToken;
		IERC20 dstToken = desc.dstToken;

		require(msg.value == (srcToken.isETH() ? desc.amount : 0), 'Invalid msg.value');

		if (flags & _SHOULD_CLAIM != 0) {
			require(!srcToken.isETH(), 'Claim token is ETH');
			_claim(srcToken, desc.srcReceiver, desc.amount, desc.permit);
		}

		address dstReceiver = (desc.dstReceiver == address(0))
			? msg.sender
			: desc.dstReceiver;

		uint256 initialSrcBalance = (flags & _PARTIAL_FILL != 0)
			? srcToken.universalBalanceOf(msg.sender)
			: 0;

		uint256 initialDstBalance = dstToken.universalBalanceOf(dstReceiver);

		caller.makeCalls{ value: msg.value }(calls);
		/*
		TODO: hace falta pasar el resto de parámetros de forma correcta en los test para que 
		podamos descomentar esta parte del código y seguir con la ingeniería inversa

		uint256 spentAmount = desc.amount;
		returnAmount = dstToken.universalBalanceOf(dstReceiver) - initialDstBalance;

		if (flags & _PARTIAL_FILL != 0) {
			spentAmount =
				initialSrcBalance +
				desc.amount -
				srcToken.universalBalanceOf(msg.sender);
			require(
				returnAmount * desc.amount >= desc.minReturnAmount * spentAmount,
				'Return amount is not enough'
			);
		} else {
			require(returnAmount >= desc.minReturnAmount, 'Return amount is not enough');
		}

		_emitSwapped(desc, srcToken, dstToken, dstReceiver, spentAmount, returnAmount); */
	}

	function _emitSwapped(
		SwapDescription calldata desc,
		IERC20 srcToken,
		IERC20 dstToken,
		address dstReceiver,
		uint256 spentAmount,
		uint256 returnAmount
	) private {
		emit Swapped(
			msg.sender,
			srcToken,
			dstToken,
			dstReceiver,
			desc.amount,
			spentAmount,
			returnAmount,
			desc.minReturnAmount,
			desc.guaranteedAmount,
			desc.referrer
		);
	}

	function _claim(
		IERC20 token,
		address dst,
		uint256 amount,
		bytes calldata permit
	) private {
		// TODO: Is it safe to call permit on tokens without implemented permit? Fallback will be called. Is it bad for proxies?

		if (permit.length == 32 * 7) {
			// solhint-disable-next-line avoid-low-level-calls
			(bool success, bytes memory result) = address(token).call(
				abi.encodeWithSelector(IERC20Permit.permit.selector, permit)
			);
			if (!success) {
				revert(RevertReasonParser.parse(result, 'Permit call failed: '));
			}
		}

		token.safeTransferFrom(msg.sender, dst, amount);
	}

	function rescueFunds(IERC20 token, uint256 amount) external onlyOwner {
		token.universalTransfer(payable(msg.sender), amount);
	}

	function pause() external onlyOwner {
		_pause();
	}

	function _authorizeUpgrade(address) internal override onlyOwner {}
}
