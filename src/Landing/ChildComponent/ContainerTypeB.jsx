import React, { Fragment, useState } from 'react'


const ContainerTypeB = ({ height, data }) => {
  const [loading, setLoading] = useState(true)
  if (loading) {
    return (
      <div id={`CMP${data.id}`} className='  rounded mt-4 mb-4' style={{ height: `${height}vh` ,minHeight:'45vh'}}>
      <div className='row col-12 '>
          <h3 className='col-12'>{data.name}</h3>
          <p className='col-12'>{data.description}</p>

      </div>
      <div className=' row p-2  '  style={{ height: `70%` }}>
       
        <div className='   col-4 defaultHeight1Col  '>
          <div id={`${data.componentDetails && data.componentDetails[0]?`CMPD${data.componentDetails[0].id}`:''}`}  className=' col-12  defaultBakground defaultHeight2Col mb-2 shadow'></div>
          <div id={`${data.componentDetails && data.componentDetails[1]?`CMPD${data.componentDetails[1].id}`:''}`}  className=' col-12  defaultBakground defaultHeight2Col shadow'></div>
        </div>
        <div className='  col-4 defaultHeight1Col'>

          <div id={`${data.componentDetails && data.componentDetails[2]?`CMPD${data.componentDetails[2].id}`:''}`}  className='  col-12  defaultBakground  defaultHeight1Col shadow'>

          </div>
        </div>
        <div className='  col-4  defaultHeight1Col'>
          <div id={`${data.componentDetails && data.componentDetails[3]?`CMPD${data.componentDetails[3].id}`:''}`}  className=' defaultBakground col-12  defaultHeight2Col mb-2 shadow'></div>
          <div id={`${data.componentDetails && data.componentDetails[4]?`CMPD${data.componentDetails[4].id}`:''}`}  className=' defaultBakground col-12  defaultHeight2Col shadow'></div>
        </div>

      </div>
      </div>
    )
  }
  else {
    return (
      <div className='col-12 row p-2 m-1 mt-4 mb-4' style={{ height: `${height}` }}>

        <div className='   col-4  '>
          <div id='CTB1' className=' col-12  radiusss defaultHeight2Col mb-2'></div>
          <div id='CTB2' className=' col-12  radiusss defaultHeight2Col '></div>
        </div>
        <div className='  col-4 '>

          <div id='CTB3' className='  col-12  radiusss  defaultHeight1Col'>

          </div>
        </div>
        <div className='  col-4  '>
          <div id='CTB4' className=' radiusss col-12  defaultHeight2Col mb-2'></div>
          <div id='CTB5' className=' radiusss col-12  defaultHeight2Col '></div>
        </div>

      </div>
    )
  }
}

export default ContainerTypeB