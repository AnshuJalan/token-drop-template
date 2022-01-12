import { TezosToolkit, ContractMethod, Wallet } from "@taquito/taquito";

// Globals
import { dropContractAddress } from "../utils/global";

interface ClaimParams {
  tezos: TezosToolkit;
  proof: string[];
  leafDataPacked: string;
}

export const claim = async (params: ClaimParams): Promise<ContractMethod<Wallet>> => {
  try {
    const contractInstance = await params.tezos.wallet.at(dropContractAddress);
    return contractInstance.methods.claim(params.proof, params.leafDataPacked);
  } catch (err) {
    throw err;
  }
};
