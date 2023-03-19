import { expect, assert } from "chai";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";


export const shouldPlay = (): void => {
    //   // to silent warning for duplicate definition of Transfer event
    //   ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.OFF);

    describe(`play`, async function () {
    
        it(`should revert if the  amount is greater than contract balance`, async function () {
            await expect(
                this.coinToss
                    .connect(this.signers.alice)
                    .play()
            ).to.be.revertedWith(`YOUR DEPOSITE VALUE IS MORE THAN OUR CURRENT TREASURY BALANCE!`);
        });
        it ("should play", async function ()  {
            const transactionHash = await this.signers.alice.sendTransaction({
              to: this.coinToss.address,
              value: ethers.utils.parseEther("10"), // Sends exactly 10 ether
            });
            expect(this.coinToss.connect(this.signers.alice).play({value  : ethers.utils.parseEther("20")}));
          })

    });
};



