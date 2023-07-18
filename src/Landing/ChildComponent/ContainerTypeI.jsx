import React from 'react'

import './style.css'

const ContainerTypeI = ({height}) => {
    return (

        <div className='d-flex flex-row justify-content-around ChildContainer' style={{height:`${height}`}}>
         <div className='d-flex col-3 flex-column number2Child'>
               <div className='m-2 bg-danger'></div>
               <div className='m-2 bg-danger'></div>
           </div>
       
           <div className='d-flex col-3 flex-column number2Child'>
               <div className='m-2 bg-danger'></div>
               <div className='m-2 bg-danger'></div>
           </div>
       
           <div className='d-flex col-3 flex-column number2Child'>
               <div className='m-2 bg-danger'></div>
               <div className='m-2 bg-danger'></div>
           </div>
          
       </div>
        
    )
}

export default ContainerTypeI