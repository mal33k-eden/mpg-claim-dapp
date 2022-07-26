import React,{useContext,useEffect,useState, useRef} from 'react' 
import InvestmentContext from '../context/investments'; 
import Notice from './Notice';
import ClaimButton from './ClaimButton';
function InvestmentView() { 
    const [userInvestments, setUserInvestments]=useState([0,0]);
    const [ido,setIdo]=useState(0)
    const [seed,setSeed]= useState(0)
    const receiverRef = useRef(null)
    const {getInvestments} = useContext(InvestmentContext) 
    
    const idoPeriods = ['June','July','August','September']
    const seedPeriods = ['June','July','August','September','October','November']

    useEffect(function () {
        getInvestments().then((result) => {
            setUserInvestments(result) 
            setIdo(parseInt(userInvestments[0]))
            setSeed(parseInt(userInvestments[1]))
        }).catch((err) => {
            
        });
    
    },[userInvestments])
  return (
         
            <div className='my-5'>
                 <div className="p-5">
                    <Notice type={'info'} message={'Investment Data Found'}/>
                    <Notice type={'warning'} message={'Collection wallet must be different from IDO/SEED investment wallet'}/>
                    <form ref={receiverRef}>
                        <input  name={'address'} type="text" placeholder="Paste the address you want to receive with" className="input input-bordered input-accent w-full max-w" />
                    </form>
                    
                 </div>
                    
                {
                    ido > 0 ?
                    <>
                        
                            <div className="card w-96 bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title">Your IDO Investments</h2> 
                                    
                                        {
                                            idoPeriods.map((element,index)=>{ 
                                                return (
                                                <div key={element} className="flex justify-between align-middle justify-items-center">
                                                    <div>
                                                        <h5>{element}</h5>
                                                        <p>MPG {ido/10}</p>
                                                    </div>
                                                    <ClaimButton type={'IDO'} index={index} period={element} receiverForm={receiverRef}/>
                                                </div>   )
                                            })
                                        }
                                    
                                    
                               
                            </div>
                        </div>
                    </>:<p></p>
                    }
                    {
                    seed > 0 ?
                    <> 
                            <div className="card w-96 bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title">Your SEED Investments</h2> 
                                    {
                                        seedPeriods.map((element,index)=>{
                                            return (
                                            <div key={element} className="flex justify-between align-middle justify-items-center">
                                                <div>
                                                    <h5>{element}</h5>
                                                    <p>MPG {seed/10}</p>
                                                </div>
                                                <ClaimButton type={'SEED'} index={index} period={element} receiverForm={receiverRef}/>
                                            </div>   )
                                        })
                                    }  
                            </div>
                        </div>
                    </>:<p></p>
                    }
                
            </div>     
        
  )
}

export default InvestmentView