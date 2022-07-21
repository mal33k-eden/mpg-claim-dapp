import React,{useContext,useEffect,useState} from 'react' 
import InvestmentContext from '../context/investments';  
import moment from 'moment';
moment().format();

function ClaimButton({period,index,type,receiverForm}) {  
    const {getInvestmentStatus,claimInvestments} = useContext(InvestmentContext)
    const [status, setStatus]= useState() 
    const [curMonth, setCurMonth]= useState() 
    const [curDay, setCurDay]= useState() 
    const [curYear, setCurYear]= useState() 
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

     

    useEffect(function () {
        const d = new Date();
        let m = d.getMonth();
        let dy = d.getDate()
        let y = d.getFullYear()
        getInvestmentStatus(type,index).then((result) => { 
            setStatus(result)
            
            setCurMonth(m)
            setCurDay(dy)
            setCurYear(y)
        }).catch((err) => {
            
        });
         
    
    },[status])
    
    const claim = async (type, period)=>  {
        const form = receiverForm.current 
        const receiver = form['address'].value 
        claimInvestments(type, period, receiver).then(function (data) {
            console.log(data)
        }).catch(console.error)
    }

    if (!status) {
        //get date 
        let y = curYear+"-"+curMonth+"-"+curDay
        let m = month.indexOf(period) 
        var r = moment('2022-'+m+'-24').isSameOrBefore(y);  
        if (r) {
            return (
                <div className="btn btn-sm btn-success" onClick={()=>claim(type, index, 'kkk')} >Claim</div> 
            )
        }
        if (!r) {
            return (
                <div className="btn btn-sm btn-disabled">Pending</div> 
            )
        }
        
    }
    if (status) {
        return (
            <div className="btn btn-sm btn-primary">Claimed</div> 
        )
    }
   
}

export default ClaimButton