import React, { useContext, useState, useEffect } from "react";
import InvestmentContext from "../context/investments";
import InvestorContext from "../context/user";
import Notice from "../components/Notice";
import ClaimTotalButton from "../components/ClaimTotalButton";
import { useMoralis } from "react-moralis";
const Claim = () => {
  const { authenticate, isAuthenticated, user, Moralis } = useMoralis();
  const { getTotalClaimedTokens, fetchTokenBalances } = useContext(InvestmentContext);
  const [claimedInvestment, setClaimedInvestment] = useState(0);
  const [mpgBalance, setMpgBalance] = useState(0);

  useEffect(() => {
    loadState();
    //add check to see if investor can claim from the claiming smart contract
  }, [claimedInvestment, mpgBalance, isAuthenticated]);
  const loadState = async () => {
    if (!Moralis.isWeb3Enabled) {
      await Moralis.enableWeb3();
    }
    if (isAuthenticated) {
      getTotalClaimedTokens().then((data) => {
        let sum = data.reduce((sum, a) => sum + a, 0);
        setClaimedInvestment(sum);
      });
      fetchTokenBalances().then((data) => {
        setMpgBalance(data);
      });
    }
  };
  if (isAuthenticated) {
    return (
      <div className="flex flex-col gap-6 items-stretch justify-center justify-items-center">
        <div className="stats flex flex-wrap shadow bg-primary text-primary-content">
          <div className="stat">
            <div className="stat-title">Total Claimed</div>
            <div className="stat-value">{claimedInvestment} MPG</div>
          </div>
          <div className="stat ">
            <div className="stat-title">Current Balance</div>
            <div className="stat-value">{parseFloat(mpgBalance).toFixed(2)} MPG</div>
          </div>
        </div>

        <div className="card w-auto bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Claimable Tokens</h2>
            <div className="alert alert-warning shadow-lg my-6">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>
                  Attention: By clicking the claim button you agree that the statistics of your balance stated above are correct and you have
                  confirmed same!
                </span>
              </div>
            </div>
            <div className="stats bg-primary text-primary-content">
              <div className="stat">
                <div className="stat-title">Calculated Balance</div>
                <div className="stat-value">{parseFloat(mpgBalance - claimedInvestment).toFixed(2)} MPG</div>
                <div className="stat-actions">
                  {mpgBalance - claimedInvestment > 0 && <ClaimTotalButton calcAmount={mpgBalance - claimedInvestment} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <Notice type={"warning"} message={"Kindly connect your wallet to see your investments."} />;
  }
};

export default Claim;
