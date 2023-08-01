import React, { useState } from 'react'
import './style.css'

const ContainerTypeG = ({ height,data }) => {
    const [loading, setLoading] = useState(true)

    return (
        <div id={`CMP${data.id}`}  className='  rounded mt-4 mb-4' style={{ height: `${height}vh` ,minHeight:'45vh'}}>
        <div className='row col-12 '>
            <h3 className='col-12'>{data.name}</h3>
            <p className='col-12'>{data.description}</p>
  
        </div>
        <div className=' row p-2 ' style={{ height: `70%` }}>
            <div></div>
            <div className=' col-4  defaultHeight1Col '>
                <div  id={`CMPD${data.componentDetails && data.componentDetails[0]?data.componentDetails[0].id:''}`}  className=' col-12 defaultBakground defaultHeight1Col shadow'>


                </div>

            </div>

            <div className='col-8  ml-1  row   '>



                <div className='col-4    defaultHeight2Col mb-1'>
                    <div  id={`${data.componentDetails && data.componentDetails[1]?`CMPD${data.componentDetails[1].id}`:''}`}   className='col-12  defaultBakground defaultHeight1Col shadow'>

                    </div>
                </div>

                <div className='col-4   defaultHeight2Col mb-1'>
                    <div  id={`${data.componentDetails && data.componentDetails[2]?`CMPD${data.componentDetails[2].id}`:''}`}   className='col-12 defaultBakground  defaultHeight1Col shadow'>

                    </div>
                </div>
                <div className='col-4   defaultHeight2Col mb-1 '>
                    <div  id={`${data.componentDetails && data.componentDetails[3]?`CMPD${data.componentDetails[3].id}`:''}`}   className='col-12 defaultBakground  defaultHeight1Col shadow'>

                    </div>
                </div>

                <div  id={`${data.componentDetails && data.componentDetails[4]?`CMPD${data.componentDetails[4].id}`:''}`}  className='col-12 defaultBakground  defaultHeight2Col shadow'>


                </div>

            </div>

        </div>
        </div>
    )
}

export default ContainerTypeG