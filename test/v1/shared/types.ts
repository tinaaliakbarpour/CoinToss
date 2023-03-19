

import { MockContract } from '@ethereum-waffle/mock-contract';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { CoinToss } from "../../../typechain-types";

declare module "mocha" {
    export interface Context {
        signers: Signers;
        mocks: Mocks;
        coinToss: CoinToss;
    }
}

export interface Signers {
    deployer: SignerWithAddress;
    alice: SignerWithAddress;
    bob: SignerWithAddress;
}

export interface Mocks {
    mockVRF: MockContract;
}