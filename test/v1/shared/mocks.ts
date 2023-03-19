import { MockContract, deployMockContract } from '@ethereum-waffle/mock-contract';
import { Signer } from "ethers";

export async function deployMockVRF (deployer: Signer): Promise<MockContract> {
    const vrf: MockContract = await deployMockContract(
        deployer,
        "" //should be the abi of vrf consumer base 
    );

    return vrf;
}