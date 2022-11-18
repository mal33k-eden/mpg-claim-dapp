import React, { useContext, useState, useEffect } from "react";
import InvestmentContext from "../context/investments";
import InvestorContext from "../context/user";
import Notice from "../components/Notice";
import ClaimTotalButton from "../components/ClaimTotalButton";
import { useMoralis } from "react-moralis";
import ClaimFile from "./ClaimFile";
const Claim = () => {
  const { isAuthenticated, user, Moralis } = useMoralis();
  const { fetchTokenBalances } = useContext(InvestmentContext);
  const { totalClaimed } = useContext(InvestorContext);
  const [mpgBalance, setMpgBalance] = useState(0);

  useEffect(() => {
    loadState();
  }, [mpgBalance, isAuthenticated, totalClaimed]);
  const loadState = async () => {
    if (!Moralis.isWeb3Enabled) {
      await Moralis.enableWeb3();
    }

    if (isAuthenticated) {
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
            <div className="stat-value">{totalClaimed == "null" ? "0" : totalClaimed} MPG</div>
          </div>
          <div className="stat ">
            <div className="stat-title">Current Balance</div>
            <div className="stat-value">{parseFloat(mpgBalance).toFixed(2)} MPG</div>
          </div>
        </div>

        <div className="card w-auto bg-base-100 shadow-xl">
          <div className="card-body">
            {totalClaimed == null ? (
              <ClaimFile investorAddress={user.get("ethAddress")} investorBalance={mpgBalance} />
            ) : (
              <div className="stats bg-primary text-primary-content">
                <div className="stat">
                  <div className="stat-title">Calculated Balance</div>
                  <div className="stat-value">{parseFloat(mpgBalance - totalClaimed).toFixed(2)} MPG</div>
                  <div className="stat-actions">{mpgBalance - totalClaimed > 0 && <ClaimTotalButton calcAmount={mpgBalance - totalClaimed} />}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return <Notice type={"warning"} message={"Kindly connect your wallet to see your investments."} />;
  }
};

export default Claim;
