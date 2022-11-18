import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import InvestmentContext from "../context/investments";
import client from "../sanity";

const ClaimFile = ({ investorAddress, investorBalance }) => {
  const [loading, updateLoading] = useState(false);
  const [claimedList, updateClaimedList] = useState([0, 0]);
  const { getTotalClaimedTokens, recordTotalInvestment, getSanityClaimRecords } = useContext(InvestmentContext);
  useEffect(() => {
    getTotalClaimedTokens().then((data) => {
      updateClaimedList(data);
    });
  }, [claimedList]);

  const record = async () => {
    let claimable = investorBalance - parseFloat(claimedList[0]) + parseFloat(claimedList[1]);
    updateLoading(true);
    let completed = await recordTotalInvestment(claimable);
    if (completed) {
      //record on claim
      const doc = {
        _type: "claimFile",
        address: investorAddress,
        claimed: (parseFloat(claimedList[0]) + parseFloat(claimedList[1])).toString(),
      };
      toast.success("Database updated");
      await client.create(doc);
      await getSanityClaimRecords(investorAddress);
    }
    updateLoading(false);
  };
  return (
    <div className="">
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
            Attention: By clicking the confirm button you agree that the statistics of your token claims stated below are correct and you have
            confirmed same!
          </span>
        </div>
      </div>
      <div className="stats flex flex-wrap shadow bg-primary text-primary-content">
        <div className="stat">
          <div className="stat-title">Total IDO Claimed</div>
          <div className="stat-value font-medium text-xl">{claimedList[0]} MPG</div>
        </div>
        <div className="stat ">
          <div className="stat-title">Total SEED Claimed</div>
          <div className="stat-value font-medium text-xl">{claimedList[1]} MPG</div>
        </div>
      </div>

      <div className=" my-5">
        {loading == false ? (
          <button className="btn btn-success" onClick={record}>
            Confirm
          </button>
        ) : (
          "Loading...."
        )}
      </div>
    </div>
  );
};

export default ClaimFile;
