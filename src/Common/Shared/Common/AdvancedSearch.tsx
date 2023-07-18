import { useState } from "react"
import { isNullOrUndefined } from "util"
import {IoIosArrowUp} from "react-icons/io"

interface Props{

    children:any
}
const AdvancedSearch:React.FC<Props> = ({children}) => {
const [show , setShow] = useState(false)    

    return(
         <div >
                                    <section className="mb-2 mt-2">
                                    <div className=" mb-5  pt-3  " >
    
                                    
                                    {children && children[0].props.children.length >= 7 ? <div className='form-row textOnInput mt-5'>
{ children && children[0].props.children.slice(0,show?children[0].props.children.length:6).map((i:any)=> i)}</div> : children}
 

                                    
                                    <div className="pb-3">

                                    { children && children[0].props.children.length >= 7 ?  children[1] : null}

                                    </div>

                                    {children && children[0].props.children.length >= 7 ?   <div onClick={()=>setShow(!show)}  className="icons text-advance d-inline float-right pt-2 text-primary m-2">
                                            { show ? <IoIosArrowUp size="1.5rem"/> :<svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                                 strokeLinecap="round" strokeLinejoin="round"
                                                 className="feather feather-chevron-down">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg> }
                                          
                                            </div>:null}
                                   
                                            </div>  
                                           
                                    </section>
                                    
                                
                                    
                                </div>
  
  
    )
  }
  export default AdvancedSearch