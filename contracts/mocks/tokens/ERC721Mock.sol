// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract ERC721Mock is ERC721, Ownable {
	uint256 nextTokenId = 0;
	mapping(uint256 => string) uris;

	constructor(
		string memory name_,
		string memory symbol_
	) ERC721(name_, symbol_) Ownable(msg.sender) {}

	function mint(address recipient, string calldata uri) external {
		_safeMint(recipient, nextTokenId);
		uris[nextTokenId] = uri;
		nextTokenId += 1;
	}

	function getNextTokenId() external view returns (uint256) {
		return nextTokenId;
	}

	function tokenURI(uint256 tokenId) public view override returns (string memory) {
		return uris[tokenId];
	}
}
