import React from 'react'

const ContainerTypeH = ({height,data}) => {
  return (
    <div id={`CMP${data.id}`}  className='  rounded mt-4 mb-4' style={{ height: `${height}vh` ,minHeight:'45vh'}}>
    <div className='row col-12 '>
        <h3 className='col-12'>{data.name}</h3>
        <p className='col-12'>{data.description}</p>

    </div>
    <div className=' row p-2 ' style={{height:`70%`}}>
    <div className='  col-4 defaultHeight1Col'>

    <div  id={`${data.componentDetails && data.componentDetails[0]?`CMPD${data.componentDetails[0].id}`:''}`}   className=' defaultBakground col-12 defaultHeight1Col shadow'>

       
</div>
    </div>

    <div className=' col-8  defaultHeight1Col'>

        <div  id={`${data.componentDetails && data.componentDetails[1]?`CMPD${data.componentDetails[1].id}`:''}`}   className='col-12 defaultBakground defaultHeight2Col shadow'>
           
        </div>
        <div  id={`${data.componentDetails && data.componentDetails[2]?`CMPD${data.componentDetails[2].id}`:''}`}   className='col-12 defaultBakground defaultHeight2Col mt-1 shadow'>
           
        </div>
    </div>

</div>
</div>
  )
}

export default ContainerTypeH