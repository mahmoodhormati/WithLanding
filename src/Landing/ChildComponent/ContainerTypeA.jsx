import React from 'react'

import './style.css'


const ContainerTypeA = ({height}) => {
    return (

        
        <div className='d-flex flex-column ChildContainer  ' style={{height:`${height}`}}>
            <div className='bg-danger d-flex   number1Child'>
             
            </div>
            <div className='d-flex  justify-content-around  number1Childdiv'>
                <div className=' bg-info m-2'></div>
                <div className=' bg-info m-2'></div>
                <div className=' bg-info m-2'></div>

            </div>

        </div>
        
    )
}

export default ContainerTypeA