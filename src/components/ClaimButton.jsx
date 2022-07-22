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
    let todaysDate = new Date(curYear+"-"+curMonth+"-"+curDay).getTime()
    console.log(todaysDate)
    let m = month.indexOf(period)
    let comparedDate = new Date('2022-'+m+'-20').getTime() //24th of this period month 
    
    if (!status) {
        //get date 
        console.log(comparedDate +"-"+ todaysDate)
        // var r = moment(new Date('2022-'+m+'-24')).isSameOrBefore(new Date(y)); 
         
        if (comparedDate <= todaysDate ) {
            var r = true
        } else{
            var r = false
        } 
        if (r) {
            return (
                <div className="btn btn-sm btn-success" onClick={()=>claim(type, index)} >Claim {comparedDate} - {todaysDate }</div> 
            )
        }
        if (!r) {
            return (
                <div className="btn btn-sm btn-disabled">Pending {comparedDate} - {todaysDate }</div> 
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