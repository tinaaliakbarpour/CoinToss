import { ethers } from "hardhat";
import config from "../config/mumbai.json"


async function main() {
  const CoinTossV2 = await ethers.getContractFactory("CoinTossV2");
  const coinTossv2 = await CoinTossV2.deploy(config.vrfCoordinatorV2, //vrfCoordinator
            config.linkV2,//link token address
            config.subscriptionId)
  await coinTossv2.deployed();

  console.log(`coinToss deployed to ${coinTossv2.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
