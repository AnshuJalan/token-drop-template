import { useEffect } from "react";

// Hooks
import { useActions, useTypedSelector } from "./hooks";

// Data
import MrklData from "./mrklData";

// Token decimals (default as 0)
const DECIMALS = 10 ** 0;

const App = () => {
  const { connectWallet } = useActions();

  // Redux store
  const { isConnected, accountPkh } = useTypedSelector((state) => state.wallet);

  useEffect(() => {
    connectWallet(false);
  }, [connectWallet]);

  // Check if address is eligible to claim
  const searchClaim = (): string => {
    if (MrklData[accountPkh]) {
      return MrklData[accountPkh].tokens;
    } else {
      return "";
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center h-100">
      {isConnected && (
        <div className="mb-2">
          {searchClaim() ? (
            <div className="text-center">
              <div>You are eligible for {parseInt(searchClaim()) / DECIMALS} tokens</div>
              <div className="mt-2 btn btn-lg btn-success">Claim</div>
            </div>
          ) : (
            <div className="text-danger">You are not eligible fror the drop</div>
          )}
        </div>
      )}
      <div onClick={() => connectWallet(true)} className={`btn ${isConnected ? "btn-outline-primary" : "btn-primary"}`}>
        {isConnected ? accountPkh : "Connect Wallet"}
      </div>
    </div>
  );
};

export default App;
