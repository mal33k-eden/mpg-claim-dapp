import React from 'react'

function Notice({type, message}) {
   
 
  return (
    <div className='my-3'>
        <div className={`alert alert-${type}   shadow-lg`}>
            <div>
                <span>{message}</span>
            </div>
        </div>
    </div>
  )
}

export default Notice