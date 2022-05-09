import fse from "fs-extra";
import path from "path";
import CryptoJS from "crypto-js";
import { MerkleTree } from "merkletreejs";
import { packDataBytes } from "@taquito/michel-codec";

// Drop data
import Drop from "../drop";

export const buildMerkle = async () => {
  const packedList: string[] = [];
  const dropAddresses: any[] = Object.keys(Drop);
  for (const address of dropAddresses) {
    const pack = packDataBytes(
      {
        prim: "Pair",
        args: [{ string: address }, { int: Drop[address] }],
      },
      {
        prim: "pair",
        args: [{ prim: "address" }, { prim: "nat" }],
      }
    );
    packedList.push(pack.bytes);
  }

  const leaves = packedList.map((x) => CryptoJS.SHA256(CryptoJS.enc.Hex.parse(x)));
  const tree = new MerkleTree(leaves, CryptoJS.SHA256, { sort: true });

  // Data specification
  //  Tezos address => Merkle proof & assocaited leaf data (Michelson packed)
  const mrklData: {
    [key: string]: {
      tokens: string;
      proof: string[];
      leafDataPacked: string;
    };
  } = {};

  // Loop through addresses and store proofs and leaves in mrklData
  for (let i = 0; i < dropAddresses.length; i++) {
    mrklData[dropAddresses[i]] = {
      tokens: Drop[dropAddresses[i]],
      proof: tree.getHexProof(leaves[i].toString()).map((proof) => proof.slice(2)),
      leafDataPacked: packedList[i],
    };
  }

  fse.outputFile(
    path.join(__dirname, "../merkle_build/mrklData.json"),
    JSON.stringify(mrklData),
    (err) => {
      if (err) console.log(err);
    }
  );

  return tree.getHexRoot();
};
