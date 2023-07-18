import React from 'react'
import './style.css'

const ContainerTypeG = ({height}) => {
  return (
    <div className='d-flex flex-row justify-content-around ChildContainer' style={{height:`${height}`}}>
    <div className='d-flex col-3 flex-column number2Child'>

        <div className='bg-info'>

        </div>
    </div>

    <div className='d-flex col-7 flex-column number2Child'>

       
        <div className='d-flex flex-row justify-content-around childOfChildFive'>

            <div className='col-3 bg-danger m-1'></div>
            <div className='col-3 bg-danger m-1'></div>
            <div className='col-3 bg-danger m-1'></div>
        </div>
        <div className='bg-primary mt-3'>
            <div className=' '></div>
        </div>
    </div>

</div>
  )
}

export default ContainerTypeG