import { useState, useEffect } from "react";

// Hooks
import { useActions, useTypedSelector } from "./hooks";

// Operations
import { claim } from "./operations";

// Data
import MrklData from "./mrklData";

// Token decimals (default as 0)
const DECIMALS = 10 ** 0;

const App = () => {
  const [statusText, setStatusText] = useState("");

  const { connectWallet } = useActions();

  // Redux store
  const { tezos, isConnected, accountPkh } = useTypedSelector((state) => state.wallet);

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

  // Claim operation sender
  const claimTokens = async () => {
    if (!tezos || statusText) return;
    try {
      setStatusText("Claiming Tokens...");
      const op = await claim({
        tezos,
        proof: MrklData[accountPkh].proof,
        leafDataPacked: MrklData[accountPkh].leafDataPacked,
      });
      await (await op.send()).confirmation(1);
      setStatusText("Tokens Claimed!");
    } catch (err: any) {
      setStatusText(err.message);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center h-100">
      {statusText && <div className="mb-3 text-primary">{statusText}</div>}
      {isConnected && (
        <div className="mb-2">
          {searchClaim() ? (
            <div className="text-center">
              <div>You are eligible for {parseInt(searchClaim()) / DECIMALS} tokens</div>
              <div onClick={claimTokens} className="mt-2 btn btn-lg btn-success">
                Claim
              </div>
            </div>
          ) : (
            <div className="text-danger">You are not eligible for the drop</div>
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
