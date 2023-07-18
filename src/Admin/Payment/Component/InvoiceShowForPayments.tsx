import React, { useEffect, useState } from 'react'
import Modal from 'react-modal';
import QueryString from 'qs';
import { GetInvoicesWithSearch } from '../../../services/invoiceService';
import { formatter } from '../../../Utils/Formatter';
import { PriceUnitEnums } from '../../../Common/Enums/PriceUnit';
import { PaymentStatusEnums } from '../../../Common/Enums/PaymentStatus';
import { PaymentStructureEnums } from '../../../Common/Enums/PaymentStructureEnums';
import { GetOrderByDetailId } from '../../../services/orderService';

const customStyles = {
    content: {

        inset: '50% auto auto 50%',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '30px',
        border: '2px ridge black',
        maxHeight:'80vh'
    }

}
interface Props {
    modalOpen: any, closeModal: any, PaymentId: any
}
const InvoiceShowForPayments: React.FC<Props> = ({ modalOpen, closeModal, PaymentId }) => {

    const [Invoice, SetInvoice] = useState([])

    const getInvoiceWithPaymentId = async () => {

        if (PaymentId !== 0) {
            let config = {

                headers: { 'Content-Type': 'application/json' },
                params: {
                    PaymentId: PaymentId,
                    IsAdmin: true,
                    PageNumber: 0,
                    PageSize: 100000


                }
                ,
                paramsSerializer: (params: any) => {

                    return QueryString.stringify(params)
                }

            };

            try {
                const { data, status } = await GetInvoicesWithSearch(config);
                if (status === 200) {
                    if (data.result.invoices.values !== null) {

                        SetInvoice(data.result.invoices.values)
                    }
                    else {
                        SetInvoice([])
                    }

                }
            } catch (err) {
                console.log(err)
            }


        }
    }



    useEffect(() => {
        getInvoiceWithPaymentId()

    }, [PaymentId])


 
    const handelNavigateWithId=(id:number)=>{

        window.open(`${window.location.origin}/admin/orderDetail/${id}`)
    }
    
    const handelNavigateWithDetails=async(id:number)=>{
    
        try {
                const{data,status}=await GetOrderByDetailId(id)
    
                if(status===200){
    
                    window.open(`${window.location.origin}/admin/orderDetail/${data.result.order.id}`)
                }
        } catch (error) {
            
        }
    
    
    }

    const TotalPrice = () => {

        let total = 0

        if (Invoice.length > 0) {


            Invoice.map((i: any) => (total += i.price))

        }


        return total


    }
  


    return (
        <Modal

            isOpen={modalOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Selected Option"
            ariaHideApp={false}

        >
            <div className="d-block clearfix mb-2" onClick={closeModal}><svg
                xmlns="http://www.w3.org/2000/svg"
                width="24" height="24"
                viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-x close"
                data-dismiss="alert"><line x1="18" y1="6"
                    x2="6"
                    y2="18"></line><line
                        x1="6" y1="6" x2="18" y2="18"></line></svg>

            </div>




            
              <div className='text-center' >
                <h6>{`صورتحسابهای مربوط به پرداخت شماره ${PaymentId}`}</h6>
              </div>
                    <table className='table table-responsive-lg table-striped ' style={{width:'50rem' }}>
                        
                        <thead>
                            <tr >
                                <th >#</th>
                                <th>شناسه</th>
                                <th>قیمت</th>
                                <th>واحد</th>
                                <th>وضعیت پرداخت</th>
                                <th>نوع پرداخت</th>
                                <th> تاریخ ثبت</th>
                                <th> تاریخ سررسید</th>
                                <th> دوره اقساط</th>
                                <th>تعداد اقساط</th>
                            </tr>

                        </thead>
                        <tbody>

                            {Invoice.map((item: any, index: number) => (

                                <tr key={index}>

                                    <td>{item.id}</td>
                                    <td>{(item.entityTypeId === 10)
                                        ?(<button className='border-0 bg-transparent text-primary' onClick={()=>handelNavigateWithId(item.entityId)}>{`سفارش #${item.entityId}`} </button>)
                                        :(<button className='border-0 bg-transparent text-primary '  onClick={()=>handelNavigateWithDetails(item.entityId)}>{`جزییات سفارش # ${item.entityId}`} </button>)}</td>
                                    <td>{formatter.format(item.price)}</td>
                                    <td>{PriceUnitEnums.filter((i: any) => i.id === item.priceUnitId).map((i: any) => i.name)}</td>
                                    <td>{PaymentStatusEnums.filter((i: any) => i.id === item.paymentStatusId).map((i: any) => i.name)}</td>
                                    <td>{PaymentStructureEnums.filter((i: any) => i.id === item.paymentMethodId).map((i: any) => i.name)}</td>
                                    <td>{item.createDate?(new Date(item.createDate).toLocaleDateString('fa-IR')):null}</td>
                                    <td>{item.installmentStartDate?(new Date(item.installmentStartDate).toLocaleDateString('fa-IR')):null}</td>
                                    <td>{item.installmentPeriod}</td>
                                    <td>{item.installmentOccureCount}</td>


                                </tr>




                            ))


                            }

                            <tr >
                                <td colSpan={6}><h6> جمع :</h6></td>
                                <td colSpan={4}><h6>{formatter.format(TotalPrice())}</h6></td>
                            </tr>
                        </tbody>



                    </table>



               






        </Modal>




    )
}

export default InvoiceShowForPayments