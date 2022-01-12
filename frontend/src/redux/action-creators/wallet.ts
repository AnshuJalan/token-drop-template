import { Dispatch } from "redux";
import { NetworkType } from "@airgap/beacon-sdk";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";

// Actions and types
import { WalletAction } from "../actions";
import * as t from "../types";

// Globals
import { network, rpcNode } from "../../utils/global";

export const connectWallet =
  (requestPermission: boolean) =>
  async (dispatch: Dispatch<WalletAction>): Promise<void> => {
    const wallet = new BeaconWallet({
      name: "Tezos Token Drop",
      preferredNetwork: network as NetworkType,
    });

    const tezos = new TezosToolkit(rpcNode);
    tezos.setWalletProvider(wallet);

    if (!requestPermission) {
      const activeAccount = await wallet.client.getActiveAccount();
      if (activeAccount) {
        const accountPkh = await wallet.getPKH();

        dispatch({
          type: t.WalletActionTypes.CONNECT_WALLET,
          payload: {
            tezos,
            isConnected: true,
            walletInstance: wallet,
            accountPkh,
          },
        });
      }
    } else {
      await wallet.requestPermissions({ network: { type: network as NetworkType } });

      const accountPkh = await wallet.getPKH();

      dispatch({
        type: t.WalletActionTypes.CONNECT_WALLET,
        payload: {
          tezos,
          isConnected: true,
          walletInstance: wallet,
          accountPkh,
        },
      });
    }
  };
