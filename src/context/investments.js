import { createContext } from "react";
import { useMoralis, useWeb3Contract, useMoralisWeb3Api } from "react-moralis";
import { toast } from "react-toastify";
import UTILS from "../abi";
const InvestmentContext = createContext();
export const InvestmentsProvider = ({ children }) => {
  const { user, Moralis } = useMoralis();
  const { runContractFunction, error } = useWeb3Contract();
  const Web3Api = useMoralisWeb3Api();
  const idoPeriods = ["June", "July", "August", "September"];
  const seedPeriods = ["June", "July", "August", "September", "October", "November"];

  const getInvestments = async () => {
    var res = [];
    var options = {
      abi: UTILS.claim_abi,
      contractAddress: UTILS.claim_contract,
      functionName: "getInvestmentsProfile",
    };
    var record = await runContractFunction({ params: options });
    if (record !== undefined) {
      var ido = record["ido"];
      var seed = record["seed"];
      res = [Moralis.Units.FromWei(ido), Moralis.Units.FromWei(seed)];
    }

    return res;
  };
  const getInvestmentStatus = async (type, period) => {
    var res;
    var options = {
      abi: UTILS.claim_abi,
      contractAddress: UTILS.claim_contract,
      functionName: type === "IDO" ? "idoPeriodStatus" : "seedPeriodStatus",
      params: {
        period: period,
      },
    };
    var record = await runContractFunction({ params: options });
    if (record !== undefined) {
      return record;
    }

    return res;
  };
  const claimInvestments = async (type, period, receiver) => {
    var options = {
      abi: UTILS.claim_abi,
      contractAddress: UTILS.claim_contract,
      functionName: type === "IDO" ? "withdrawIdo" : "withdrawSeed",
      params: {
        period: period,
        receiver: receiver,
      },
    };
    try {
      var record = await runContractFunction({ params: options });
      if (record !== undefined) {
        return true;
      }
    } catch (error) {
      console.log(error);
    }

    return false;
  };

  const getTotalClaimedTokens = async () => {
    let claimedIdo = 0;
    let claimedSeed = 0;
    let investments = await getInvestments();
    let ido = parseInt(investments[0]);
    let seed = parseInt(investments[1]);
    if (ido > 0) {
      idoPeriods.map(async (element, index) => {
        let checks = await getInvestmentStatus("IDO", index);
        if (checks) {
          claimedIdo += ido / idoPeriods.length;
        }
      });
    }
    if (seed > 0) {
      seedPeriods.map(async (element, index) => {
        let checks = await getInvestmentStatus("SEED", index);
        if (checks) {
          claimedSeed += seed / seedPeriods.length;
        }
      });
    }

    return [claimedIdo, claimedSeed];
  };
  const fetchTokenBalances = async () => {
    await Moralis.enableWeb3();
    var add = user.get("ethAddress");
    let mpgBal = 0;
    const options = {
      chain: "bsc",
      address: add,
    };
    const balances = await Web3Api.account.getTokenBalances(options);

    balances.map((element, index) => {
      console.log(element);
      if (element["symbol"] == "MPG") {
        mpgBal = Moralis.Units.FromWei(element["balance"]);
      }
    });
    return mpgBal;
  };

  const getRecorded = async () => {
    if (!Moralis.isWeb3Enabled) {
      await Moralis.enableWeb3();
    }
    var add = user.get("ethAddress");
    var options = {
      abi: UTILS.new_claim_abi,
      contractAddress: UTILS.new_claim_contract,
      functionName: "isRecorded",
      params: { _investor: add },
    };
    var record = await runContractFunction({ params: options });

    return record;
  };
  const getCanClaim = async () => {
    if (!Moralis.isWeb3Enabled) {
      await Moralis.enableWeb3();
    }
    var add = user.get("ethAddress");
    var options = {
      abi: UTILS.new_claim_abi,
      contractAddress: UTILS.new_claim_contract,
      functionName: "getCanClaim",
      params: { _investor: add },
    };
    var record = await runContractFunction({ params: options });

    return record;
  };
  const recordTotalInvestment = async (calculatedAmount) => {
    if (!Moralis.isWeb3Enabled) {
      await Moralis.enableWeb3();
    }
    var options = {
      abi: UTILS.new_claim_abi,
      contractAddress: UTILS.new_claim_contract,
      functionName: "recordAddress",
      params: { claimAmount: Moralis.Units.ETH(calculatedAmount) },
    };
    try {
      var r = await runContractFunction({ params: options });
      if (r !== undefined) {
        r.wait(2);
        toast.success("Execution completed!");
      } else {
        toast.error("execution reverted: Connected address is not marked as an investor.");
      }
      console.log(error);
    } catch (err) {
      toast.error("execution reverted: Connected address is not marked as an investor.");
    }
    return false;
  };

  const withdrawTotalInvestment = async (receiver) => {
    if (!Moralis.isWeb3Enabled) {
      await Moralis.enableWeb3();
    }
    var options = {
      abi: UTILS.new_claim_abi,
      contractAddress: UTILS.new_claim_contract,
      functionName: "withdraw",
      params: { receiver: receiver },
    };
    try {
      var r = await runContractFunction({ params: options });
      if (r !== undefined) {
        r.wait(2);
        toast.success("Claimed successfully!");
      } else {
        toast.error("execution reverted: Connected address is not marked as an investor.");
      }
      console.log(error);
    } catch (err) {
      toast.error("execution reverted: Connected address is not marked as an investor.");
    }
    return false;
  };

  return (
    <InvestmentContext.Provider
      value={{
        getCanClaim,
        getRecorded,
        withdrawTotalInvestment,
        recordTotalInvestment,
        fetchTokenBalances,
        getTotalClaimedTokens,
        getInvestments,
        getInvestmentStatus,
        claimInvestments,
      }}
    >
      {children}
    </InvestmentContext.Provider>
  );
};
export default InvestmentContext;
