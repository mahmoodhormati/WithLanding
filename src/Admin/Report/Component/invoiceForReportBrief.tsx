import React, { useState } from 'react'
import QueryString from 'qs';
import { GetInvoicesWithSearch } from '../../../services/invoiceService';
import { useEffect } from 'react';


import { GridLoader } from 'react-spinners';
import { IoIosArrowUp } from "react-icons/io";
import PaymentModalForInvoices from '../../Payment/Component/PaymentModalForInvoices';
import { PriceUnitEnums } from '../../../Common/Enums/PriceUnit';
import { PaymentStatusEnums } from '../../../Common/Enums/PaymentStatus';
import { PaymentStructureEnums } from '../../../Common/Enums/PaymentStructureEnums';
import { AiOutlineDollar } from 'react-icons/ai';


interface Props {
    CustomerUserName: any
}
const InvoicesForReportBrief: React.FC<Props> = ({ CustomerUserName }) => {

   
    const [Invoices, SetInvoice] = useState<any>([])
    const[modalOpenPayment,SetModalOpenPayment]=useState<boolean>(false)
    const[RowId,SetId]=useState(0)
    const [show, setShow] = useState(false);
    let [loading, setLoading] = useState(true);

    const getInvoice = async () => {
setLoading(true)
        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {
                CustomerUserName,

                IsAdmin: true,
                PageNumber: 0,
                PageSize: 5

            }
            ,
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }

        };

        try {
            const { data, status } = await GetInvoicesWithSearch(config);
            if (status === 200) {

                SetInvoice(data.result.invoices.values)
setLoading(false)

            }
        } catch (err) {
            setLoading(false)

            console.log(err)
        }

    }

  

    let formatterForMoney = new Intl.NumberFormat('fa-IR', {

        currency: 'IRR'


    });
    const OpenPaymentModal=(id:any)=>{
        SetId(id)
        SetModalOpenPayment(true)
    }
    const closePaymnetModal=()=>{
SetModalOpenPayment(false)
    }
    const showInvoice = () => {
        setShow(!show);
      };
      const CollapsInvoice = () => {
        setShow(!show);
        if(CustomerUserName){
            getInvoice()

        }

      };
    if (Invoices && show) {
        return (

            <section className="mb-2 mt-2">
                <div className="   mb-1 rounded" >
                    <div className="row p-3 itemA">
                        <div className=" col-6  ">
              <h4 className="float-left">صورتحسابهای اخیر </h4>
            </div>
            <div className="  col-6   ">
              {show === true ? (
                <IoIosArrowUp
                  size="1.5rem"
                  className="float-right up-svg"
                  onClick={showInvoice}
                />
              ) : (
                <svg
                  onClick={CollapsInvoice}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="float-right feather feather-chevron-down"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              )}
            </div>
          </div>
          { loading  ? (
            <div className="w-100">
              {/* <div className=" m-auto"> */}
              <GridLoader
                loading={loading}
                color="#4236d6"
                className="m-auto GridLoader position-relative  "
              />
              {/* </div> */}
            </div>
          ) : (
            <div>

                <div className="form-group mb-4 textOnInput col-lg-12 rounded border  border-dark  mt-4 p-2 "  >
                    <label> صورتحسابها </label>
                <PaymentModalForInvoices modalOpen={modalOpenPayment} closeModal={closePaymnetModal} InvoiceIds={[RowId]} />
                    
                    <div className="p-2 ">
                        <table className="table m-1 table-striped  fixed_header  ">
                            <thead>
                                <tr>
                                    <th >#</th>
                                    <th >قیمت</th>
                                    <th >واحد</th>
                                    <th >وضعیت پرداخت</th>
                                    <th >نوع پرداخت</th>
                                    <th >تاریخ ثبت صورتحساب</th>
                                    <th >تاریخ سررسید </th>
                                    <th > توضیحات </th>
                                    <th >  پرداخت ها  </th>
                                </tr>
                            </thead>
                            <tbody className="text-center" id="InvoiceTable">
                                {Invoices && Invoices.map((item: any) => (

                                    <tr key={item.id}>
                                        <td data-th="#"  >{item.id}</td>
                                        <td data-th="قیمت"  >{formatterForMoney.format(item.price)}</td>
                                        <td data-th="واحد"  >{PriceUnitEnums.filter((i: any) => i.id === item.priceUnitId).map((i: any) => i.name)}</td>
                                        <td data-th="وضعیت پرداخت"  >{PaymentStatusEnums.filter((i: any) => i.id === item.paymentStatusId).map((i: any) => i.name)}</td>
                                        <td data-th="نوع پرداخت"  >{PaymentStructureEnums.filter((i: any) => i.id === item.paymentMethodId).map((i: any) => i.name)}</td>
                                        <td data-th="تاریخ ثبت صورتحساب"  >{item.createDate!==null? new Date(item.createDate).toLocaleDateString('fa-IR'):null }</td>
                                        <td data-th="تاریخ سررسید"  >{item.installmentStartDate!==null?new Date(item.installmentStartDate).toLocaleDateString('fa-IR'):null}</td>
                                        <td data-th="توضیحات"  >{item.comment}</td>
                                        <td data-th="پرداخت ها"  ><button className='border-0 bg-transparent ' onClick={()=>OpenPaymentModal(item.id)} ><AiOutlineDollar size={"1.5rem"}/></button></td>
                                       
                                        {/* new Date(rows.row.original.createDate).toLocaleDateString('fa-IR') */}

                                    </tr>


                                ))

                                }


                            </tbody>
                        </table>
                    </div>
                </div>
            </div>)}
            </div></section>

        )
    }
    else {
        return ( 
        <section className="mb-2 mt-2">
            <div className="   mb-1 rounded" >
                <div className="row p-3 itemA">
                    <div className=" col-6  ">
              <span className="float-left">صورتحسابهای اخیر</span>
            </div>
            <div className="  col-6   ">
              {show ? (
                <IoIosArrowUp
                  size="1.5rem"
                  className="float-right up-svg"
                  onClick={showInvoice}
                />
              ) : (
                <svg
                  onClick={CollapsInvoice}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="float-right feather feather-chevron-down"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              )}
            </div>
          </div>
          {show ? (
            <div>
              <div className="form-group mb-4 textOnInput col-lg-12 rounded border text-center border-dark  mt-4 p-2 ">
                <span className="text-center">
                  اطلاعاتی برای نمایش موجود نیست
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </section>
        )
    }
}

export default InvoicesForReportBrief