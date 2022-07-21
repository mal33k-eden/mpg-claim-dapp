import React,{useState,useContext} from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'  
import InvestorContext from '../../context/user';
function Navbar({title}) { 
  const {isAuthenticated,connect,disconnect}= useContext(InvestorContext)
 
  return (
 
  <div className="navbar bg-base-100 shadow-lg">
    <div className="container mx-auto">
    <div className="navbar-start">
       
      <Link to={'/'} className="btn btn-ghost normal-case text-xl">{title}</Link>
    </div>
    <div className="navbar-center hidden lg:flex">
      <ul className="menu menu-horizontal p-0">
         
         
      </ul>
    </div>
      <div className="navbar-end">
       {
        (!isAuthenticated)?
        (<button className="btn" onClick={connect}>Connect Wallet</button>):
        (<div className="dropdown dropdown-end float-right">
              <label tabIndex="0" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src="https://placeimg.com/80/80/people" alt='test'/>
                </div>
              </label>
              <ul tabIndex="0" className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <button onClick={disconnect} className="justify-between">
                   Disconnect Wallet
                  </button>
                </li> 
              </ul>
            </div>)
        }
          
         
      </div>
    </div>  
  </div>

  )
}

Navbar.defaultProps = {
  title:'MPG'
}
Navbar.prototype ={
  title: PropTypes.string,
}
export default Navbar