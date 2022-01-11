import fs from "fs";
import { TezosToolkit } from "@taquito/taquito";

import { buildMerkle } from "./utils/merkleTree";

export enum Token {
  FA12 = "FA12",
  FA2 = "FA2",
}

export type DeployParams = {
  // Admin address
  admin: string;

  // Address of token contract
  tokenAddress: string;

  // Type of token
  tokenType: Token;

  // Tezos instance
  tezos: TezosToolkit;
};

export const deploy = async (deployParams: DeployParams) => {
  try {
    console.log("------------------------------------------");
    console.log(` Deploying Token Drop ${deployParams.tokenType} Contract`);
    console.log("------------------------------------------");

    // Build merkle tree and get root
    console.log(">> Building Merkle Tree");
    const merkleRoot = await buildMerkle(deployParams.tezos);
    console.log(">> Built Merkle Tree!");
    console.log(">>> Merkle Root: ", merkleRoot);

    // Prepare contract storage and code based on token type
    const contractStorage = `(Pair (Pair "${deployParams.admin}" {}) (Pair ${merkleRoot} "${deployParams.tokenAddress}"))`;
    let contractCode: string;
    contractCode = loadFile(
      `${__dirname}/../../contracts/michelson/token_drop_${deployParams.tokenType.toLowerCase()}.tz`
    );

    // Deploy the contract
    console.log(">> Deploying Drop Contract");
    const address = await deployContract(contractCode, contractStorage, deployParams.tezos);
    console.log(">> Contract Deployed!");
    console.log(">>> Drop Contract Address: ", address);

    console.log("\n------------------------------------------");
    console.log(` Deployment Complete`);
    console.log("------------------------------------------");
  } catch (err) {
    console.log(err);
  }
};

const loadFile = (filename: string): string => {
  const file = fs.readFileSync(filename).toString();
  return file;
};

const deployContract = async (code: string, storage: string, tezos: TezosToolkit): Promise<string> => {
  try {
    const originOp = await tezos.contract.originate({
      code: code,
      init: storage,
    });

    await originOp.confirmation(1);
    return originOp.contractAddress as string;
  } catch (err) {
    throw err;
  }
};
