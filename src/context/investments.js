import { createContext } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import UTILS from "../abi";
const InvestmentContext = createContext();

export const  InvestmentsProvider = ({children})=>{
    const {  Moralis} = useMoralis();
    const {  runContractFunction } = useWeb3Contract()
    
   

    const getInvestments= async ()=>{  
        var res =[]
        var options = {
            abi: UTILS.claim_abi,
            contractAddress: UTILS.claim_contract,
            functionName: "getInvestmentsProfile", 
        } 
        var record = await runContractFunction({params: options})
        if (record !== undefined) {
            
            var ido = record['ido'] 
            var seed = record['seed']
            res = [Moralis.Units.FromWei(ido),Moralis.Units.FromWei(seed)] 
        }
        
        return res
    }
    const getInvestmentStatus= async (type, period)=>{  
        var res;
        var options = {
            abi: UTILS.claim_abi,
            contractAddress: UTILS.claim_contract,
            functionName: (type ==='IDO')?"idoPeriodStatus" : "seedPeriodStatus", 
            params:{
                period:period
            }
        } 
        var record = await runContractFunction({params: options}) 
        if (record !== undefined) {
          return record
        }
        
        return res
    }

    const claimInvestments =async (type, period , receiver)=>{ 
        var options = {
            abi: UTILS.claim_abi,
            contractAddress: UTILS.claim_contract,
            functionName: (type ==='IDO')?"withdrawIdo" : "withdrawSeed", 
            params:{
                period:period,
                receiver:receiver
            }
        }  
       try {
            var record = await runContractFunction({params: options})  
            if (record !== undefined) {
            return true
            }
       } catch (error) {
        console.log(error)
       }
        
        return false
    }

    return (
        <InvestmentContext.Provider
         value={{getInvestments,getInvestmentStatus,claimInvestments}}>
            {children}
        </InvestmentContext.Provider>)
}
export default InvestmentContext