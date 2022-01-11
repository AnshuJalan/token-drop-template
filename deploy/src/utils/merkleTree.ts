import fse from "fs-extra";
import path from "path";
import CryptoJS from "crypto-js";
import { MerkleTree } from "merkletreejs";
import { TezosToolkit } from "@taquito/taquito";

// Drop data
import Drop from "../drop.json";

export const buildMerkle = async (tezos: TezosToolkit) => {
  const packedList: string[] = [];
  for (const item of Drop) {
    const pack = await tezos.rpc.packData({
      data: {
        prim: "Pair",
        args: [{ string: item.address }, { int: item.value }],
      },
      type: {
        prim: "pair",
        args: [{ prim: "address" }, { prim: "nat" }],
      },
    });
    packedList.push(pack.packed);
  }

  const leaves = packedList.map((x) => CryptoJS.SHA256(CryptoJS.enc.Hex.parse(x)));
  const tree = new MerkleTree(leaves, CryptoJS.SHA256, { sort: true });

  const serializedTree = JSON.stringify(tree);
  fse.outputJSON(path.join(__dirname, "../merkle_build/mrk.json"), serializedTree, (err) => {
    if (err) console.log(err);
  });

  return tree.getHexRoot();
};
