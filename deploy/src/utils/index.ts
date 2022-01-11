import { buildMerkle } from "./merkleTree";
import { TezosToolkit } from "@taquito/taquito";

const tezos = new TezosToolkit("https://hangzhounet.api.tez.ie");

(async () => {
  const root = await buildMerkle(tezos);
  console.log("Merkle Root: ", root);
})();
