import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { constants } from "ethers";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { CoinTossV2 } from "../../typechain-types";


describe("CoinToss", () => {
  let contract: CoinTossV2;
  let owner: SignerWithAddress;
  let users: SignerWithAddress[];
  const MOCK_SUBSCRIPTION_ID = 0;
  const MOCK_LINK = constants.AddressZero;

  async function deployContract(
    vrfCoordinatorContract:
      | "MockVRFCoordinator"
      | "MockVRFCoordinatorUnfulfillable" = "MockVRFCoordinator"
  ) {
    const contractFactory = await ethers.getContractFactory("CoinTossV2");

    const vrfCoordFactory = await ethers.getContractFactory(
      vrfCoordinatorContract
    );
    const mockVrfCoordinator = await vrfCoordFactory.connect(owner).deploy();

    return await contractFactory
      .connect(owner)
      .deploy(mockVrfCoordinator.address, MOCK_LINK, MOCK_SUBSCRIPTION_ID);
  }

  async function play(
    caller: string | SignerWithAddress,
  ) {
    const tx = await contract.connect(caller).play();
    await tx.wait();
  }

  beforeEach(async () => {
    users = await ethers.getSigners();
    [owner] = users;
    contract = await deployContract();
  });

  describe("play", () => {
    it("should revert if the  amount is greater than contract balance", async () => {
    
      await expect(contract.connect(owner).play({value  : ethers.utils.parseEther("2")}))
        .to.be.revertedWith(`YOUR DEPOSITE VALUE IS MORE THAN OUR CURRENT TREASURY BALANCE!`);
    });
    it ("should play", async () => {
      const transactionHash = await owner.sendTransaction({
        to: contract.address,
        value: ethers.utils.parseEther("10"), // Sends exactly 10 ether
      });
      expect(contract.connect(owner).play({value  : ethers.utils.parseEther("20")}));
    })
  })
     
});