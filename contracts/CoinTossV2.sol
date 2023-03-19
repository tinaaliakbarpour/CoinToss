// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.11;

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "hardhat/console.sol";

contract CoinTossV2 is VRFConsumerBaseV2 {

    uint16 internal requestConfirmations = 3;
    bytes32 internal keyHash =
        0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
    uint32 internal callbackGasLimit = 1000000;
    uint64 internal chainlinkSubscriptionId;

    VRFCoordinatorV2Interface internal COORDINATOR;
    LinkTokenInterface internal LINKTOKEN; 

    mapping(uint256 => uint256) internal playersValue;
    mapping(uint256 => address) internal playersAddress; 

    event Status(
		string _msg, 
		address user, 
		uint amount,
		bool winner
	);

    constructor(
        address vrfCoordinator,
        address link,
        uint64 _chainlinkSubscriptionId
    ) VRFConsumerBaseV2(vrfCoordinator) {
        chainlinkSubscriptionId = _chainlinkSubscriptionId;
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        LINKTOKEN = LinkTokenInterface(link);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
		if ((randomWords[0] % 1000) > 501) {
			if (address(this).balance < (playersValue[requestId] * 2)) {
				// don't have sufficient amount so we will return every thing that we have
				payable(playersAddress[requestId]).transfer(address(this).balance);
				emit Status('Congratulations, you win! Sorry, we did not have enought money, we will deposit everything we have!',
                    playersAddress[requestId], playersValue[requestId], true);
					
			} else {
				uint _prize = playersValue[requestId] * 2;
				emit Status('Congratulations, you win!', playersAddress[requestId], _prize, true);
				payable(playersAddress[requestId]).transfer(_prize);
            }

        } else {
			emit Status('Sorry, you loose!', playersAddress[requestId], playersValue[requestId], false);
        }
    }

    function play() payable external {
        //check if user balance is not more than contract balance
        console.log(msg.value);
        console.log(address(this).balance);
		require (msg.value < address(this).balance, "YOUR DEPOSITE VALUE IS MORE THAN OUR CURRENT TREASURY BALANCE!");
        uint256 requestId = COORDINATOR.requestRandomWords(
            keyHash,
            chainlinkSubscriptionId,
            requestConfirmations,
            callbackGasLimit,
            1
        );
        playersAddress[requestId] = msg.sender;
        playersValue[requestId] = msg.value;
    }

     // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}




}