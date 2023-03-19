import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";


dotenv.config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const rpc = "https://matic-mumbai.chainstacklabs.com";
const PRIVATE_KEY = "de53125b2fb8159dea21eaa4fcb18b8222abef67b05d5fa23e0a1d32bb116057"

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      hardfork: "merge",
      // If you want to do some forking set `enabled` to true. 
      // It is higly recommended to set forking block number, otherwise the latest one will be used each time
      // which can lead into inconsistency of tests
      forking: {
        url: process.env.MAINNET_RPC_URL || "",
        // blockNumber:
        enabled: false,
      },
      chainId: 31337,
    },
    mumbai: {
      url: rpc,
      accounts: [`0x${PRIVATE_KEY}`]
    },
  },
  etherscan: {
    // npx hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_KEY || "",
    },
  },
};

export default config;