import { createContext, useEffect, useState,  } from "react";
import { useMoralis,useWeb3Contract } from 'react-moralis'
import client from "../sanity";
import UTILS from "../abi" 

const InvestorContext = createContext()

export const  InvestorProvider = ({children})=>{
    const { authenticate, isAuthenticated, logout,user,Moralis,} = useMoralis();
    const [investments, setInvestments]=useState(null);
    const [hasRecord, setHasRecord] = useState(false);
    const { runContractFunction, error } =useWeb3Contract();

    useEffect( ()=>{ 
        if (isAuthenticated) {
            getInvestments(user.get('ethAddress'))
             

        }
    },[ user, isAuthenticated])
    const connect = async ()=>{  
        try{
            await authenticate()
            if(isAuthenticated){
                await getInvestments(user.get('ethAddress'));
            }
        }catch(error){
            console.log(error)
        }
    }
    const disconnect = async ()=>{ 
        try {
            await logout()
        } catch (error) {
            console.log(error)
        }
    }
    const getInvestments = async (address)=>{ 
        var record = await isInvestorRecorded() 
        if (record) {//has an investment record on blockchain
            setHasRecord(true) 
        }else{//has no record on the blockchain
            setHasRecord(false)
            const query  = `*[_type == "investors" && lower(address) == '${address}'] {address,amount,category}`   
            const params = {address: address}
            client.fetch(query,params)
            .then(function (data) {
                setInvestments(data);
            })
                .catch((error)=>{console.log(error)})
        }
        
    }
    const isInvestorRecorded= async ()=>{
        await Moralis.enableWeb3();
        var add=user.get('ethAddress')
        
        var options = {
            abi: UTILS.claim_abi,
            contractAddress: UTILS.claim_contract,
            functionName: "isRecorded",
            params: {_investor:add},
        } 
        var record = await runContractFunction({params: options})
        return record

    }
    const recordInvestor= async ()=>{
        await Moralis.enableWeb3(); 
        var ido = 0;
        var seed = 0; 
        investments.forEach((element)=>{
            if(element['category'] ==='IDO'){
                ido += parseFloat(element['amount'])
            }
            if(element['category'] ==='SEED'){
                seed += parseFloat(element['amount'])
            }
        });

        ido = ido *0.7; // get the 70 percent 
        seed = seed * 0.8 // get the 80 percent 
        var options = {
            abi: UTILS.claim_abi,
            contractAddress: UTILS.claim_contract,
            functionName: "recordAddress",
            params: {_ido70Investment:Moralis.Units.ETH(ido),_seed80Investments:Moralis.Units.ETH(seed)},
         } 
       try {
        var r = await runContractFunction({params: options})
            if (r !== undefined) {
                r.wait(2)
                var record = isInvestorRecorded()
                setHasRecord(record)
            }
        } catch (error) {
        console.log(error)
       }
   }
 
    

    return (
    <InvestorContext.Provider
     value={{user,isAuthenticated,investments,hasRecord,fetch,disconnect,connect,recordInvestor}}>
        {children}
    </InvestorContext.Provider>)
}
export default InvestorContext;