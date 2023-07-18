import React from 'react'
import { useState } from 'react';
import { Fragment } from 'react';
import ImagePriviewerForPayment from './ImagePriviewerForPayment';
import {BiAddToQueue} from "react-icons/bi"
const ImageUploaderForPayment = ({data,index,Ids,currentPay}) => {

    const [files, SetFiles] = useState([])
    const[child,Setchild] =useState(false)
    const onchange = (e) => {

        SetFiles([...files,... e.target.files])

    }

    

    return (
        <Fragment>
            <ImagePriviewerForPayment images={files} submited={Setchild} file={SetFiles} payments={data} Index={index} Ids={Ids} currentPay={currentPay} />
            {!child?
        <div className='d-flex justify-content-end'>  
            <input disabled={false}  type="file" className="custom-file-input" id="PaymentFile" accept='image/*' onChange={onchange}  />
            <label for="PaymentFile">
                <BiAddToQueue size="2rem"/>
                </label>
        </div>:<div className='row' >  
        <div className='col-lg-4  labelPayment'>
        <p className='   text-danger TextPayment text-nowrap' >لطفا پیش از بارگزاری اطلاعات پرداخت جدید ، اطلاعات بارگزاری شده را ثبت  فرمایید</p>
          </div>
      <input disabled={true}  type="file" className="col-lg-4 custom-file-input" id="PaymentFile" accept='image/*' onChange={onchange}  />
      <div className='col-lg-4  labelPayment'>
            <label  for="PaymentFile" className='float-right' >
                
            <BiAddToQueue size="2rem" />
           
                </label>
                </div>
        </div>}




        </Fragment>
    )
}

export default ImageUploaderForPayment