import { ethers } from 'hardhat';
import { parseEther } from 'ethers';
import { assert, expect } from 'chai';

import { WETH_ABI } from '../abis/WETH_ABI';
import { WETH_ADDRESS_MAINNET, CYBER_ADDRESS_MAINNET } from '../constants';
import { setupOpenOceanExchangeTest } from './utils/setupOpenOceanExchangeTest';

/* types */
import { WETH as IWETH } from 'build/types';

describe('OpenOceanExchange contract', () => {
	it('OpenOceanExchange contract must be deployed', async () => {
		const {
			contracts: { OpenOceanExchange },
		} = await setupOpenOceanExchangeTest();
		assert.ok(await OpenOceanExchange.getAddress());
	});

	describe('Failure cases', () => {
		it('Swap should fail if the minimum return is 0.', async () => {
			const {
				accounts: { deployer },
				contracts: { OpenOceanExchange, OpenOceanCaller },
			} = await setupOpenOceanExchangeTest();

			const callerAddress = await OpenOceanCaller.getAddress();

			await expect(
				OpenOceanExchange.swap(
					callerAddress,
					{
						srcToken: ethers.ZeroAddress, // IERC20 srcToken;
						dstToken: ethers.ZeroAddress, // IERC20 dstToken;
						srcReceiver: ethers.ZeroAddress, // address srcReceiver;
						dstReceiver: deployer, // address dstReceiver;
						amount: 0n, // uint256 amount;
						minReturnAmount: 0n, // uint256 minReturnAmount;
						guaranteedAmount: 0n, // uint256 guaranteedAmount;
						flags: 0n, // uint256 flags;
						referrer: ethers.ZeroAddress, // address referrer;
						permit: '0x', // bytes permit;
					},
					[]
				)
			).to.be.rejectedWith('Min return should not be 0');
		});

		it('Swap should fail if call data does not exist', async () => {
			const {
				accounts: { deployer },
				contracts: { OpenOceanExchange, OpenOceanCaller },
			} = await setupOpenOceanExchangeTest();

			const callerAddress = await OpenOceanCaller.getAddress();

			await expect(
				OpenOceanExchange.swap(
					callerAddress,
					{
						srcToken: ethers.ZeroAddress, // IERC20 srcToken;
						dstToken: ethers.ZeroAddress, // IERC20 dstToken;
						srcReceiver: ethers.ZeroAddress, // address srcReceiver;
						dstReceiver: deployer, // address dstReceiver;
						amount: 0n, // uint256 amount;
						minReturnAmount: 1n, // uint256 minReturnAmount;
						guaranteedAmount: 0n, // uint256 guaranteedAmount;
						flags: 0n, // uint256 flags;
						referrer: ethers.ZeroAddress, // address referrer;
						permit: '0x', // bytes permit;
					},
					[]
				)
			).to.be.rejectedWith('Call data should exist');
		});

		it('Swap should fail if the msg.value does not match the amount', async () => {
			const {
				accounts: { deployer },
				contracts: { OpenOceanExchange, OpenOceanCaller, OLPX },
			} = await setupOpenOceanExchangeTest();

			const amountToSwap = parseEther('0.005');
			const callerAddress = await OpenOceanCaller.getAddress();

			await expect(
				OpenOceanExchange.swap(
					callerAddress,
					{
						srcToken: ethers.ZeroAddress, // IERC20 srcToken;
						dstToken: ethers.ZeroAddress, // IERC20 dstToken;
						srcReceiver: ethers.ZeroAddress, // address srcReceiver;
						dstReceiver: deployer, // address dstReceiver;
						amount: amountToSwap, // uint256 amount;
						minReturnAmount: 1n, // uint256 minReturnAmount;
						guaranteedAmount: 0n, // uint256 guaranteedAmount;
						flags: 0n, // uint256 flags;
						referrer: ethers.ZeroAddress, // address referrer;
						permit: '0x', // bytes permit;
					},
					[
						{
							target: 0n, // uint256 target;
							gasLimit: 0n, // uint256 gasLimit;
							value: 0n, // uint256 value;
							data: '0x', // bytes data;
						},
					]
				)
			).to.be.rejectedWith('Invalid msg.value');

			const srcToken = await OLPX.getAddress();

			await expect(
				OpenOceanExchange.swap(
					callerAddress,
					{
						srcToken, // IERC20 srcToken;
						dstToken: ethers.ZeroAddress, // IERC20 dstToken;
						srcReceiver: ethers.ZeroAddress, // address srcReceiver;
						dstReceiver: deployer, // address dstReceiver;
						amount: amountToSwap, // uint256 amount;
						minReturnAmount: 1n, // uint256 minReturnAmount;
						guaranteedAmount: 0n, // uint256 guaranteedAmount;
						flags: 0n, // uint256 flags;
						referrer: ethers.ZeroAddress, // address referrer;
						permit: '0x', // bytes permit;
					},
					[
						{
							target: 0n, // uint256 target;
							gasLimit: 0n, // uint256 gasLimit;
							value: 0n, // uint256 value;
							data: '0x', // bytes data;
						},
					],
					{ value: amountToSwap }
				)
			).to.be.rejectedWith('Invalid msg.value');
		});

		it('Swap should fail if claim token is ETH when flag is active', async () => {
			const {
				accounts: { deployer },
				contracts: { OpenOceanExchange, OpenOceanCaller },
			} = await setupOpenOceanExchangeTest();

			const callerAddress = await OpenOceanCaller.getAddress();

			await expect(
				OpenOceanExchange.swap(
					callerAddress,
					{
						srcToken: ethers.ZeroAddress, // IERC20 srcToken;
						dstToken: ethers.ZeroAddress, // IERC20 dstToken;
						srcReceiver: ethers.ZeroAddress, // address srcReceiver;
						dstReceiver: deployer, // address dstReceiver;
						amount: 0n, // uint256 amount;
						minReturnAmount: 1n, // uint256 minReturnAmount;
						guaranteedAmount: 0n, // uint256 guaranteedAmount;
						flags: 2n, // uint256 flags;
						referrer: ethers.ZeroAddress, // address referrer;
						permit: '0x', // bytes permit;
					},
					[
						{
							target: 0n, // uint256 target;
							gasLimit: 0n, // uint256 gasLimit;
							value: 0n, // uint256 value;
							data: '0x', // bytes data;
						},
					]
				)
			).to.be.rejectedWith('Claim token is ETH');
		});

		it('debugging...', async () => {
			const {
				accounts: { deployer },
				signers: { deployer: signerDeployer },
				contracts: { OpenOceanExchange, OpenOceanCaller },
			} = await setupOpenOceanExchangeTest();

			const amountToSwap = parseEther('0.1');
			const callerAddress = await OpenOceanCaller.getAddress();

			await signerDeployer.sendTransaction({
				to: WETH_ADDRESS_MAINNET,
				value: amountToSwap,
			});

			const WETH = new ethers.Contract(
				WETH_ADDRESS_MAINNET,
				WETH_ABI.abi,
				signerDeployer.provider
			) as unknown as IWETH;

			await WETH.connect(signerDeployer).approve(
				await OpenOceanExchange.getAddress(),
				amountToSwap
			);

			const balance = await WETH.connect(signerDeployer).balanceOf(
				deployer
			);
			console.log("Balance en WETH antes del deploy (Es el deployer)",ethers.formatEther(balance))
			
			const balanceInWei = await signerDeployer.provider.getBalance(callerAddress);
			console.log("Balance en ETH antes del deploy (Es el caller)",ethers.formatEther(balanceInWei))
			
			const balanceInWei3 = await signerDeployer.provider.getBalance("0x2f9ec37d6ccfff1cab21733bdadede11c823ccb0");
			console.log("Balance en ETH de Bacor",ethers.formatEther(balanceInWei3))


			await OpenOceanExchange.swap(
				callerAddress,
				{
					srcToken: WETH_ADDRESS_MAINNET, // IERC20 srcToken;
					dstToken: CYBER_ADDRESS_MAINNET, // IERC20 dstToken;
					srcReceiver: callerAddress, // address srcReceiver;
					dstReceiver: deployer, // address dstReceiver;
					amount: amountToSwap, // uint256 amount;
					minReturnAmount: 1n, // uint256 minReturnAmount;
					guaranteedAmount: 0n, // uint256 guaranteedAmount;
					flags: 2n, // uint256 flags;
					referrer: ethers.ZeroAddress, // address referrer;
					permit: '0x', // bytes permit;
				},
				[


					{			//0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2  --> https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2	
						target: 0n, // uint256 target; 
						gasLimit: 0n, // uint256 gasLimit;
						value: 0n, // uint256 value;
						//La data lo que hace es un withdraw 
						data: '0xe5b07cdb0000000000000000000000003fc47be8264e473dd2b3e80d144f9efffc18f4380000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000a9c0cded336699547aac4f9de5a11ada979bc59a00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000002ec02aaa39b223fe8d0a0e5c4f27ead9083c756cc20009c414778860e937f509e651192a90589de711fb88a9000003000000000000000000000000000000000000', // bytes data;
						// esto de abajo es el dato real obtenido por decoder data pero me daba error, tube que codificar la data yo mismo con lo siguiente `WETH.withdraw.populateTransaction(amountToSwap);` con esto obtube el valor que paso en data y anda bien.
						// data: '0x2e1a7d4d000000000000000000000000000000000000000000000000016345785d8a0000', // bytes data;
					},
					//{			//0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2  --> https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2	
					//	target: '1097077688018008265106216665536940668749033598146', // uint256 target; 
					//	gasLimit: 0n, // uint256 gasLimit;
					//	value: 0n, // uint256 value;
					//	//La data lo que hace es un withdraw 
					//	data: '0x2e1a7d4d000000000000000000000000000000000000000000000000016345785d8a0000', // bytes data;
					//	// esto de abajo es el dato real obtenido por decoder data pero me daba error, tube que codificar la data yo mismo con lo siguiente `WETH.withdraw.populateTransaction(amountToSwap);` con esto obtube el valor que paso en data y anda bien.
					//	// data: '0x2e1a7d4d000000000000000000000000000000000000000000000000016345785d8a0000', // bytes data;
					//	},
					// TODO: Todo el resto de objetos que faltan por completar se puede sacar la información de https://tools.deth.net/calldata-decoder pasando la calldata recibida por el enpoint de openocean. Revisé el fichero docs/reverse_engineering_swap_data.jsonc para obtener el calldata que se está usando como ejemplo
					//	{
					//		target: 0n, // uint256 target;
					//		gasLimit: 0n, // uint256 gasLimit;
					//		value: 0n, // uint256 value;
					//		data: '0x9f865422000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000100000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000010000000000000000000000002f9ec37d6ccfff1cab21733bdadede11c823ccb00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000184b77d239b00000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000a9c0cded336699547aac4f9de5a11ada979bc59a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000b1cd6e4153b2a390cf00a6556b0fc1458c4a55330000000000000000000000001f573d6fb3f13d689ff844b4ce37794d79a7ff1c000000000000000000000000fee7eeaa0c2f3f7c7e6301751a8de55ce4d059ec0000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c59900000000000000000000000000000000000000000000000000000000', // bytes data;
					//	},
					// {
					// 	target: 0n, // uint256 target;
					// 	gasLimit: 0n, // uint256 gasLimit;
					// 	value: 0n, // uint256 value;
					// 	data: '0x', // bytes data;
					// },
					// {
					// 	target: 0n, // uint256 target;
					// 	gasLimit: 0n, // uint256 gasLimit;
					// 	value: 0n, // uint256 value;
					// 	data: '0x', // bytes data;
					// },
					// {
					// 	target: 0n, // uint256 target;
					// 	gasLimit: 0n, // uint256 gasLimit;
					// 	value: 0n, // uint256 value;
					// 	data: '0x', // bytes data;
					// },
					// {
					// 	target: 0n, // uint256 target;
					// 	gasLimit: 0n, // uint256 gasLimit;
					// 	value: 0n, // uint256 value;
					// 	data: '0x', // bytes data;
					// },
				]
			);
			
			const balance2 = await WETH.connect(signerDeployer).balanceOf(
				deployer
			);
			console.log("Balance en WETH despues del deploy (Es el deployer)",ethers.formatEther(balance2))
			
			const balanceInWei2 = await signerDeployer.provider.getBalance(callerAddress);
			console.log("Balance en ETH despues del deploy (Es el caller)",ethers.formatEther(balanceInWei2))

			//Priemra llamada
			//En la primera llamada llama al contrato "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2#code y en el mismo llama a withdraw entonces el caller recibe ethers

			//Segunda llamada
			//En esta llamada al ser 0 el targer el targer seria callDescription.sol y luego llama en calldescription a singleDistributionCall 
			//Despues el target es 0x2f9ec37d6ccfff1cab21733bdadede11c823ccb0


		});
	});
});
