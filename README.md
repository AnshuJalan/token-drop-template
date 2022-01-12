# 🛬 Token Drop Template

This is a template to perform token drops efficiently on [Tezos](https://tezos.com) blockchain. The drop is handled using [Merkle Tree Distribution](https://medium.com/crypto-0-nite/merkle-proofs-explained-6dd429623dc5) mechanism that highly reduces the cost for the drop admin, and the claimers just have to pay the minimal gas and storage fee.

## What's there in the Repository?

- `contracts`: Smart Contracts written in [SmartPy](https://smartpy.io) to handle the drop. Separate contracts are provided for FA1.2 and FA2 standard of tokens on Tezos.
- `deploy`: Utility scripts to automatically prepare the merkle tree data structure and deploy the drop contract.
- `frontend`: A basic React dapp to portray a possible way to integrate the drop contract with the frontend.

## Deploying and Running

### Prerequisites

- Globally installed [SmartPy Cli](https://smartpy.io/docs/cli/) [0.8.7]
- Node [14.17.1]
- Yarn [1.22.11]

### Steps

Once you have cloned the repository, the following steps and sub-steps written in the respective folders are to be followed sequentially-

- **Create Merkle Tree and deploy Drop Contract:** This step requires that you already have a deployed token contract (FA1.2 / FA2). Follow the steps specified in the [deploy](https://github.com/AnshuJalan/token-drop-template/tree/master/deploy) folder to continue.
- **Prepare and run dapp:** Once you have generated the merkle tree and deployed the drop contract, follow the steps specified in the [frontend](https://github.com/AnshuJalan/token-drop-template/tree/master/frontend) folder to run the dapp.

## Resources

Although the deployment can be done without the knowledge of Merkle Tree Distribution technique, it is recommended that you go through the following resources to get an idea of the mechanism.

- https://github.com/miguelmota/merkletreejs
- https://medium.com/crypto-0-nite/merkle-proofs-explained-6dd429623dc5
- https://medium.com/hackernoon/evolution-of-airdrop-from-common-spam-to-the-merkle-tree-30caa2344170

## Improvement Scope

There are aspects of this template primarily on the frontend side that can be improved during production level implementation. It is recommended that you take into consideration the following bare minimum changes in order to provide a seamless experience to the end user.

- The merkle tree proof data generated in [/deploy/src/merkle_build](https://github.com/AnshuJalan/token-drop-template/tree/master/deploy/src/merkle_build) folder and used at [/frontend/src/mrklData.ts](https://github.com/AnshuJalan/token-drop-template/blob/master/frontend/src/mrklData.ts) should ideally be served from an http backend on a per-address basis. For a large drop of say ~100,000 users, the proof file could be as large as ~100mb, which would be too much data to push into the source of a web app.
- A check for users who have already claimed the tokens and showing an appropriate message for them instead of the claim button.

## Disclaimer

_The code is provided as is. The smart contracts are not formally auditted by a third party. Users are advised to do their own research before using the template . The author is not liable for any failure or loss of funds._
