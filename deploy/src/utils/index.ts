import { buildMerkle } from "./merkleTree";

(async () => {
  const root = await buildMerkle();
  console.log("Merkle Root: ", root);
})();
