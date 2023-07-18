import React from 'react'

const ContainerTypeF = ({height}) => {
    return (
        <div className='d-flex flex-row justify-content-around ChildContainer' style={{height:`${height}`}}>
            <div className='d-flex col-3 flex-column number2Child'>

                <div className='bg-info'>

                </div>
            </div>

            <div className='d-flex col-7 flex-column number2Child'>

                <div className='bg-primary mb-1'>
                    <div className=' '></div>
                </div>
                <div className='d-flex flex-row justify-content-around childOfChildFive'>

                    <div className='col-3 bg-danger m-1'></div>
                    <div className='col-3 bg-danger m-1'></div>
                    <div className='col-3 bg-danger m-1'></div>
                </div>
            </div>

        </div>
    )
}

export default ContainerTypeF