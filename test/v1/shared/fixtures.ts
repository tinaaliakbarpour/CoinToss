import { MockContract } from '@ethereum-waffle/mock-contract';
import { BigNumber, ContractFactory, Wallet } from "ethers";
import { ethers } from "hardhat";
import { CoinToss , LinkTokenInterface} from "../../../typechain-types";
import { deployMockVRF } from "./mocks";
import { Signers } from './types';
import config from "../../../config/mumbai.json";

type UnitCoinTossFixtureType = {
    coinToss: CoinToss;
};

export async function getSigners(): Promise<Signers> {
    const [deployer, alice, bob] = await ethers.getSigners();

    return { deployer, alice, bob };
}

export async function unitCoinTossFixture(): Promise<UnitCoinTossFixtureType> {
    const { deployer } = await getSigners();

    const coinTossFactory: ContractFactory = await ethers.getContractFactory(
        `CoinToss`
    );

    const coinToss: CoinToss = (await coinTossFactory
        .connect(deployer)
        .deploy(config.vrfCoordinator,
        config.link,
        config.keyHash,
        ethers.utils.parseEther("0.0001"))) as CoinToss;

    await coinToss.deployed();
    

    // const vrf = await deployMockVRF(deployer);

    return {coinToss};
};