import React, { useState, useContext, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import InvestmentContext from "../context/investments";
import Notice from "./Notice";

const ClaimTotalButton = ({ calcAmount }) => {
  const { getCanClaim, getRecorded, recordTotalInvestment, withdrawTotalInvestment } = useContext(InvestmentContext);
  const [isRecorded, setIsRecorded] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  const [recording, setRecording] = useState(false);
  const receiverRef = useRef(null);

  useEffect(() => {
    fetchStatus();
  }, [isRecorded, canClaim]);

  const fetchStatus = async () => {
    getRecorded().then((data) => {
      setIsRecorded(data);
    });
    getCanClaim().then((data) => {
      setCanClaim(data);
    });
  };

  const makeRecord = async () => {
    setRecording(true);
    try {
      var r = await recordTotalInvestment(calcAmount);
      console.log(r);
    } catch (error) {
      console.log(error);
    }
    fetchStatus();
    setRecording(false);
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

  if (calcAmount && isRecorded == false) {
    return (
      <button className="btn btn-sm btn-success" onClick={() => makeRecord()} disabled={recording}>
        Yes, I Acknowledge The Above Amount As My ToTal REMAINING MPG
      </button>
    );
  } else if (canClaim == true) {
    return (
      <div>
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

  return <Notice type={"info"} message={"Congratulations! You have claimed your MPG Tokens!"} />;
};

export default ClaimTotalButton;
