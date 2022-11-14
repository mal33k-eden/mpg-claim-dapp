import React, { useContext } from "react";
import InvestmentCard from "../components/InvestmentCard";
import InvestmentView from "../components/InvestmentView";
import Notice from "../components/Notice";

import InvestorContext from "../context/user";

function Home() {
  const { isAuthenticated, investments, hasRecord, recordInvestor } = useContext(InvestorContext);

  if (isAuthenticated) {
    console.log(hasRecord);

    if (!hasRecord && investments != null) {
      //has investment but not yet recorded
      //show data from sanity
      var opt1;
      investments.length > 0
        ? (opt1 = (
            <div className="my-5">
              <Notice type={"info"} message={'If the data below matches your investments kindly click th "CONFIRM" button below to begin.'} />
              <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Your Investments</h2>
                  {investments.map((data) => (
                    <InvestmentCard key={data["address"]} amount={data["amount"]} category={data["category"]} />
                  ))}

                  <div className="card-actions justify-end">
                    <button className="btn" onClick={recordInvestor}>
                      {" "}
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        : (opt1 = (
            <div className="my-5">
              <Notice type={"warning"} message={"You do not have any record as an investor. Kindly reach out to the team for any clarifications"} />
            </div>
          ));

      return opt1;
    }

    if (!hasRecord && investments == null) {
      // not an investor at all
      //show data
      return (
        <div>
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Investments</h2>
              <p>Connect your wallet to confirm your investments.</p>
            </div>
          </div>
        </div>
      );
    }

    if (hasRecord) {
      // has records already

      return <InvestmentView />;
    }
  } else {
    return <Notice type={"info"} message={"Kindly connect your wallet to see your investments."} />;
  }
}

export default Home;
