import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { getSigners, unitCoinTossFixture } from "../shared/fixtures";
import { Mocks, Signers } from "../shared/types";
import { shouldPlay } from './coinToss/shouldPlay.spec';

describe(`Unit tests`, async () => {
    before(async function () {
        const { deployer, alice, bob } = await loadFixture(getSigners);

        this.signers = {} as Signers;
        this.signers.deployer = deployer;
        this.signers.alice = alice;
        this.signers.bob = bob;
    });

    describe(`CoinToss`, async () => {
        beforeEach(async function () {
            const { coinToss } = await loadFixture(unitCoinTossFixture);

            this.coinToss = coinToss;

            this.mocks = {} as Mocks;
            // this.mocks.mockVRF = vrf;
        });

        shouldPlay();
    });
});