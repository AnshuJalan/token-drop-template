import { TezosToolkit } from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";

// Types and utlities
import { deploy, DeployParams, Token } from "./deploy";

const tezos = new TezosToolkit(`https://${process.argv[2]}.api.tez.ie`);

tezos.setProvider({
  signer: new InMemorySigner(process.env.PRIVATE_KEY as string),
});

// Admin address of the contract
const ADMIN = "tz1ZczbHu1iLWRa88n9CUiCKDGex5ticp19S";

const TOKEN_ADDRESS = "tz1ZczbHu1iLWRa88n9CUiCKDGex5ticp19S";

const TOKEN_TYPE = Token.FA12;

const deployParams: DeployParams = {
  admin: ADMIN,
  tokenAddress: TOKEN_ADDRESS,
  tokenType: TOKEN_TYPE,
  tezos,
};

void deploy(deployParams);
