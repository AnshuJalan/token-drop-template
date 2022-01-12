import { BeaconWallet } from "@taquito/beacon-wallet";

// Types
import * as t from "../types";

interface ConnectWalletAction {
  type: t.WalletActionTypes.CONNECT_WALLET;
  payload: {
    isConnected: boolean;
    walletInstance: BeaconWallet;
    accountPkh: string;
  };
}

export type WalletAction = ConnectWalletAction;
