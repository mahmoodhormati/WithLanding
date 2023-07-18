import {useEffect,useState,useRef} from "react";
import { useDispatch } from 'react-redux';

const PageSizeTable = ({setPageSize , pageSize , getDataBySearch,total }) => {
const dispatch=useDispatch()
const dataLoaded = useRef(false)
    const[changedPage,setchangedPage]=useState(pageSize)
const handelchange=async(e)=>{

setPageSize(e.target.value)
setchangedPage(e.target.value)
dataLoaded.current = true

}

useEffect(()=>{
    
    
  if(changedPage && dataLoaded.current===true){
    getDataBySearch()
  }


},[changedPage])

  return( <div className='d-block clearfix mt-3 float-right'>
      <span className=" py-3" style={{fontSize: 'smaller'}}> تعداد نمایش در صفحه : </span>
      <select
          // style={{height:'20px'}}
          id='pageSize'
          className='btn m-1  non-hover  bg-transparent shadow-none  p-0 '
          value={pageSize}
          onChange={handelchange}
          
      >
          {[10, 25, 50, 100].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                  {pageSize}
              </option>

          ))}
      </select>
  </div>)
}
export default PageSizeTable