import React, { useState, useContext, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import InvestmentContext from "../context/investments";
import Notice from "./Notice";

const ClaimTotalButton = ({ calcAmount }) => {
  const { getCanClaim, getRecorded, recordTotalInvestment, withdrawTotalInvestment } = useContext(InvestmentContext);
  const [isRecorded, setIsRecorded] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  const [recording, setRecording] = useState(true);
  const receiverRef = useRef(null);

  useEffect(() => {
    fetchStatus();
  }, [isRecorded, canClaim, recording]);

  const fetchStatus = async () => {
    getRecorded().then((data) => {
      setIsRecorded(data);
    });
    getCanClaim().then((data) => {
      setCanClaim(data);
    });
  };

  const claimTokens = async () => {
    const form = receiverRef.current;
    const receiver = form["address"].value;

    if (receiver == "") {
      toast.error("Kindly add address you will like to claim your tokens.");
    } else {
      setRecording(true);
      try {
        var r = await withdrawTotalInvestment(receiver);
      } catch (error) {}
      fetchStatus();
      setRecording(false);
    }
  };

  if (isRecorded && canClaim) {
    return (
      <div className="flex flex-col ">
        <form className="mb-5" ref={receiverRef}>
          <input
            name={"address"}
            type="text"
            placeholder="Paste the address you want to receive with"
            className="input input-bordered input-accent w-full max-w"
          />
        </form>
        <button className="btn btn-sm btn-success" onClick={() => claimTokens()} disabled={recording}>
          Claim MPG
        </button>
      </div>
    );
  }
  return <Notice type={"success"} message={"Congratulations! You have claimed your MPG Tokens!"} />;
};

export default ClaimTotalButton;
