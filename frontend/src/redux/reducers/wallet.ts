import { Reducer } from "redux";
import { BeaconWallet } from "@taquito/beacon-wallet";

// Action and types
import { WalletAction } from "../actions";
import * as t from "../types";

interface WalletState {
  isConnected: boolean;
  walletInstance: BeaconWallet | null;
  accountPkh: string;
}

const initialState: WalletState = {
  isConnected: false,
  walletInstance: null,
  accountPkh: "",
};

export const walletReducer: Reducer<WalletState, WalletAction> = (state = initialState, action): WalletState => {
  switch (action.type) {
    case t.WalletActionTypes.CONNECT_WALLET: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
