import React from 'react'
import { useState } from 'react';
import AddMemberToCredit from './addMemberToCredit';
import EditMemberOfCredit from './EditMemberOfCredit';


interface Props {
  data: any,getData:any,creditId:any,value:any
}
const CustomersCredit: React.FC<Props> = ({ data ,getData,creditId,value}) => {
  
  const[IsOpen,SetIsOpen]=useState(false)
  const[IsOpenEdit,SetIsOpenEdit]=useState(false)
  const[currentItem,setcurrentItem]=useState<any>()

  const OpenAddModal=()=>{

    SetIsOpen(true)


  }
  const CloseAddModal=()=>{

    SetIsOpen(false)
    

  }

  const OpenEditModal=(item:any)=>{

    setcurrentItem(item)
    SetIsOpenEdit(true)


  }
  const CloseEditModal=()=>{

    SetIsOpenEdit(false)
    

  }

  let formatterForMoney = new Intl.NumberFormat('fa-IR', {

    currency: 'IRR'


});
  return (
    <div>

      <div className="form-group mb-4 textOnInput mainMenu  col-lg-12 rounded border  border-dark  mt-4 p-2">
        <label> مشتری های منتخب </label>
        <div className="text-center">
          <div className=" table text-center">

            {data.length>0 ?
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>نام مشتری</th>
                    <th>نام کاربری</th>
                    <th>کد ملی</th>
                    <th>نام سازمان</th>
                    <th>حداکثر اعتبار</th>
                    <th> اعتبار درجریان</th>
                    <th>  توضیحات</th>
                    <th>  عملیات</th>
                  </tr>
                </thead>
                <tbody>
                {data.map((item: any) => (
                  <tr key={item.id}>

                    <td>{item.id}</td>
                    <td>{item.fullName}</td>
                    <td>{item.userName}</td>
                    <td>{item.nationalCode}</td>
                    <td>{item.organizationName}</td>
                    <td>{formatterForMoney.format(item.maxValue)}</td>
                    <td>{formatterForMoney.format(item.currentUsed)}</td>
                    <td>{item.comment}</td>
                    <td> <button className="m-1 p-0 border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip" data-placement="top"
                        title="ویرایش" 
                        onClick={()=>OpenEditModal(item)}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20"
                            viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-edit-2">
                            <path
                                d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                    </button></td>
                  </tr>


                ))}
                </tbody>
              </table> :


              <div>
                <span className="text-center">
                  اطلاعاتی برای نمایش موجود نیست
                </span>
              </div>
            }
          </div>

        </div>
        <div className='  '>

          <button style={{ marginTop: '-.8rem', marginLeft: '.6rem', background: 'white' }} className=" border-0 Attachment   float-right " title="افزودن مشتری" onClick={OpenAddModal} >
            <svg style={{ width: '24px', height: '38px' }} xmlns="http://www.w3.org/2000/svg" fill="currentColor"
              className="bi bi-plus-circle" viewBox="0 0 17 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path
                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>

          </button>
         <AddMemberToCredit modalIsOpen={IsOpen} closeModal={CloseAddModal} EntityType={1} Credit={getData} creditId={creditId} value={value}/>
         <EditMemberOfCredit modalIsOpen={IsOpenEdit} closeModal={CloseEditModal} EntityType={1} Credit={getData} creditId={creditId} currentItem={currentItem} value={value}/>

        </div>
      </div>

    </div>
  )
}

export default CustomersCredit