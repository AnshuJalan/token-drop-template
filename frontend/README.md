# Frontend

The frontend is a simple React app provided as a reference implementation to assist the user. Other frameworks like Vue or Angular can also be used to achieve the functionalities.

It is recommended that the user follows the [improvement suggestions](https://github.com/AnshuJalan/token-drop-template#improvement-scope) specified in the root README for large scale drops involving over a 1,000 addresses.

## Steps

### Install Dependencies

Install the node dependencies using yarn:

```
$ yarn install
```

### Set Merkle Proof Data

The merkle proof data generated at [/deploy/src/merkle_build/mrklData.json](https://github.com/AnshuJalan/token-drop-template/blob/master/deploy/src/merkle_build/mrklData.json) needs to be copied over to the [/frontend/src/mrklData.ts](https://github.com/AnshuJalan/token-drop-template/blob/master/frontend/src/mrklData.ts) file's `data` field.

This step is not required if the proofs are served from a backend server. In that case the frontend needs to be modified to retrieve the proof associated to a specific address from the backend database.

### Run on Localhost

To run the frontend locally on `localhost:3000`, use the command:

```
$ yarn start
```
