import { createContext, useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import client from "../sanity";
import UTILS from "../abi";
import { toast } from "react-toastify";

const InvestorContext = createContext();

export const InvestorProvider = ({ children }) => {
  const { authenticate, isAuthenticated, logout, user, Moralis } = useMoralis();
  const [investments, setInvestments] = useState(null);
  const [hasRecord, setHasRecord] = useState(false);
  const { runContractFunction, error } = useWeb3Contract();
  const [totalClaimed, setTotalClaimed] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      getInvestments(user.get("ethAddress"));
      getSanityClaimRecords(user.get("ethAddress"));
    }
  }, [user, isAuthenticated, totalClaimed]);
  const connect = async () => {
    try {
      await authenticate();
      if (isAuthenticated) {
        await getInvestments(user.get("ethAddress"));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const disconnect = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };
  const getInvestments = async (address) => {
    var record = await isInvestorRecorded();
    if (record) {
      //has an investment record on blockchain
      setHasRecord(true);
    } else {
      //has no record on the blockchain
      setHasRecord(false);
      const query = `*[_type == "investors" && lower(address) == '${address}'] {address,amount,category}`;
      const params = { address: address };
      client
        .fetch(query, params)
        .then(function (data) {
          setInvestments(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const isInvestorRecorded = async () => {
    await Moralis.enableWeb3();
    var add = user.get("ethAddress");

    var options = {
      abi: UTILS.claim_abi,
      contractAddress: UTILS.claim_contract,
      functionName: "isRecorded",
      params: { _investor: add },
    };
    var record = await runContractFunction({ params: options });
    return record;
  };
  const recordInvestor = async () => {
    await Moralis.enableWeb3();
    var ido = 0;
    var seed = 0;
    investments.forEach((element) => {
      if (element["category"] === "IDO") {
        ido += parseFloat(element["amount"]);
      }
      if (element["category"] === "SEED") {
        seed += parseFloat(element["amount"]);
      }
    });

    ido = ido * 0.7; // get the 70 percent
    seed = seed * 0.8; // get the 80 percent
    var options = {
      abi: UTILS.claim_abi,
      contractAddress: UTILS.claim_contract,
      functionName: "recordAddress",
      params: { _ido70Investment: Moralis.Units.ETH(ido), _seed80Investments: Moralis.Units.ETH(seed) },
    };
    try {
      var r = await runContractFunction({ params: options });
      if (r !== undefined) {
        r.wait(2);
        var record = isInvestorRecorded();
        setHasRecord(record);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSanityRecords = async (address) => {
    let blkChainRec = await isInvestorRecorded();
    const query = `*[_type == "investors" && lower(address) == '${address}'] {claimed,address,amount,category}`;
    const params = { address: address };
    try {
      let results = await client.fetch(query, params);

      return [results, blkChainRec];
    } catch (error) {
      console.log(error);
      toast.error("Connectivity Error. If error persist speak to admin for assistance.");
    }
  };
  const getSanityClaimRecords = async (address) => {
    if (isAuthenticated) {
      var _claimed = null;
      const query = `*[_type == "claimFile" && lower(address) == '${address}'] {claimed,address}`;
      const params = { address: address };
      try {
        let results = await client.fetch(query, params);
        console.log(results[0]["claimed"]);
        if (results.length > 0) {
          _claimed = results[0]["claimed"];
        }
      } catch (error) {
        console.log(error);
        toast.error("Connectivity Error. If error persist speak to admin for assistance.");
      }
      console.log(_claimed);
      setTotalClaimed(_claimed);
    }
  };

  return (
    <InvestorContext.Provider
      value={{
        totalClaimed,
        isInvestorRecorded,
        getSanityRecords,
        user,
        isAuthenticated,
        investments,
        hasRecord,
        fetch,
        disconnect,
        connect,
        recordInvestor,
      }}
    >
      {children}
    </InvestorContext.Provider>
  );
};
export default InvestorContext;
