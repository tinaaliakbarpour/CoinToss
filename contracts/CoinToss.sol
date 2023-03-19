// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.11;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract CoinToss is VRFConsumerBase {
    bytes32 internal keyHash;
    uint256 internal fee;
    mapping(bytes32 => uint256) internal playersValue;
    mapping(bytes32 => address) internal playersAddress;
    uint256 public randomResult;

    event Status(
		string _msg, 
		address user, 
		uint amount,
		bool winner
	);

   constructor(
    address _vrfCoordinator,
    address _link,
    bytes32 _keyHash,
    uint256 _fee
    ) VRFConsumerBase(_vrfCoordinator, _link) {
        keyHash = _keyHash;
        fee = _fee;
    }
    
    function getRandomNumber() public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK in contract");
        return requestRandomness(keyHash, fee);
    }
    // Callback function used by VRF Coordinator
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        randomResult = randomness ;
		if ((randomResult % 1000) > 501) {
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
		require (msg.value < address(this).balance, "YOUR DEPOSITE VALUE IS MORE THAN OUR CURRENT TREASURY BALANCE!");
        bytes32 requestID;
        requestID = getRandomNumber();
        playersAddress[requestID] = msg.sender;
        playersValue[requestID] = msg.value;
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

	
}
