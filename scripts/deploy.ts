import { ethers } from "hardhat";
import config from "../config/mumbai.json"


async function main() {
  const CoinToss = await ethers.getContractFactory("CoinToss");
  const coinToss = await CoinToss.deploy(config.vrfCoordinator, //vrfCoordinator
            config.link,//link token address
            config.keyHash, //key hash
            ethers.utils.parseEther("0.0001")); //fee 0.0001

  await coinToss.deployed();

  console.log(`coinToss deployed to ${coinToss.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
