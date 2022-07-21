import React from 'react'

function InvestmentCard({amount, category}) {
  return (
    <div>
        <h2 className="card-title">{category} Investments</h2>  
        <p>Investment: MPG {amount}</p>
    </div>
  )
}

export default InvestmentCard