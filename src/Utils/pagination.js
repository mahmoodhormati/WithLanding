import {useEffect, useState} from "react";
import './style.css'
const Pagination = ({PageNumber , setPageNumber , getDataBySearch  , PageSize, total}) => {

    const nextPageHandler = () => {
        setPageNumber(Number(PageNumber) + 1)

    }
    const endPageHandler = () => {
        if(total%PageSize===0){
            setPageNumber(Math.floor(total/PageSize) )
        }
        else{
            setPageNumber(Math.floor(total/PageSize))

        }
    }
    const backPageHandler = () => {
        if (PageNumber > 0){
            setPageNumber(Number(PageNumber) - 1)
        }



    }
    const firstPageHandler = () => {

        setPageNumber(0)




    }
    useEffect(()=>{
        getDataBySearch()

    },[PageNumber])
    return(
        <div className='d-flex justify-content-center'>


            <button className='  Pagination  btn   m-1' title='صفحه اول'   onClick={firstPageHandler}
                    disabled={PageNumber === 0 ? true : false }      >      صفحه اول
            </button>
            <button className='    Pagination btn   m-1' title='صفحه قبلی'   onClick={backPageHandler}
                    disabled={PageNumber === 0 ? true : false }   >      صفحه قبلی
            </button>
            <span className="mt-3"> {  PageNumber + 1  } از { total%PageSize ===0 ?  Math.floor(total/PageSize) : Math.floor(total/PageSize) +1 }</span>            <button className=' Pagination  btn   m-1' title='صفحه بعدی' onClick={nextPageHandler}
                    disabled={ PageNumber === ((total%PageSize) === 0 ?(Math.floor(total/PageSize) - 1):(Math.floor(total/PageSize))) ? true : false  }   > صفحه بعدی
            </button>
            <button className='  Pagination  btn   m-1' title='صفحه آخر' onClick={endPageHandler}
                    disabled={ PageNumber === ((total%PageSize) === 0?(Math.floor(total/PageSize) - 1):(Math.floor(total/PageSize))) ? true : false  }   > صفحه آخر
            </button>


        </div>
    )
}
export default Pagination