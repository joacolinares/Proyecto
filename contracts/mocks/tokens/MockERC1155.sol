// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';

contract ERC1155Mock is ERC1155, Ownable {
	uint256 nextTokenId = 1;
	mapping(uint256 => string) uris;

	constructor() ERC1155('mock-uri.com') Ownable(msg.sender) {}

	function mint(address recipient, uint256 amount, string calldata uri_) external {
		_mint(recipient, nextTokenId, amount, '0x');
		uris[nextTokenId] = uri_;
		nextTokenId += 1;
	}

	function getNextTokenId() external view returns (uint256) {
		return nextTokenId;
	}

	function uri(uint256 tokenId) public view override returns (string memory) {
		return uris[tokenId];
	}
}
