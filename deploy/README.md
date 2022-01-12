# Deploy

The scripts provided in this folder can be used to generate a merkle tree and associated proofs for the token drop data and deploy a drop contract that would allow the claimers to retrieve the tokens.

It is assumed that you already have the token contract deployed. If you want to deploy a token contract, refer to SmartPy's [FA1.2](https://smartpy.io/ide?template=FA1.2.py) or [FA2](https://smartpy.io/ide?template=FA2.py) template for tokens.

## Steps

### Install Dependencies

Install the node dependencies using yarn:

```
$ yarn install
```

### Prepare Drop Data

Insert the drop data in the [drop.ts](https://github.com/AnshuJalan/token-drop-template/blob/master/deploy/src/drop.ts) file. The drop data represents how many tokens is supposed to be received by an address. It is a simple mapping from Tezos Address => Number of tokens (resolved to decimals).

If a token has **6** as its decimals and the user is supposed to receive **100** tokens, then the right hand side of the mapping would be `100 * (10 ** 6)` i.e `100_000_000`.

### Generate Merkle Tree and Proofs:

This step is automatically performed as a part of the last step, but incase you want to generate the merkle tree proofs as a standlone after preparing the drop data, you can run:

```
$ yarn build-merkle
```

This command generates a merkle tree and writes out the proofs in [/src/merkle_build/mrklData.json](https://github.com/AnshuJalan/token-drop-template/blob/master/deploy/src/merkle_build/mrklData.json).

**This file is later used on the frontend side to send the proofs over to the `claim` entrypoint when claiming the tokens.**

### Deploy the Contracts

First, set the values of the configuration fields in the `index.ts` file in `src` folder. The fields to be set are

- `ADMIN` : Admin address for the drop contract.
- `TOKEN_ADDRESS` : Address of the token being dropped.
- `TOKEN_TYPE` : Type of the token i.e FA1.2 or FA2.

Once the configuration fields are prepared, the deployment can be done by providing a private key as an environment variable and running `deploy:testnet` script:

```
$ PRIVATE_KEY=<Your private key> yarn deploy:testnet
```
