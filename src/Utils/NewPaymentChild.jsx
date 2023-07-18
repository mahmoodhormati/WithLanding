import React, { useEffect, useState } from 'react'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import DatePicker from 'react-multi-date-picker'
import Select from 'react-select'
import { data } from '../Common/Shared/Chart/chartPie'
import { ImCross } from 'react-icons/im'
import { formatter } from './Formatter'
import { GetInvoicesWithSearch } from '../services/invoiceService'
import QueryString from 'qs'

import { AiFillPicture } from 'react-icons/ai'
import DropDown from './DropDown'
import { toast } from 'react-toastify'
import NewChildOfChildPayment from './NewChildOfChildPayment'
import { BiAddToQueue } from 'react-icons/bi'
import { disabled } from 'react-widgets/esm/PropTypes'

const NewPaymentChild = ({ id, Setpayments, payment, remove, data, indexes, ids, currentPay }) => {




    const [invoices, SetinvoiceIds] = useState([]);
    let [cashMustPay, setCashmustPay] = useState(0)
    let [alert, setAlert] = useState('')
    let [InvoicesState, setInvoicesState] = useState({
        invoice: []

    })
    let Payments = [];
    Payments = data;
    let Ids = [];

    let idiesforivoice = ids

    let currentPayment = Payments.filter((i) => i.tabIndex === indexes);
    Ids = ids.length > 1 ? (currentPayment.map(i => i.invoiceIds)[0]) : ids;

    let [childOFchildPayment, setChildOfChildPayment] = useState([])





    let [pays, setPays] = useState([
    ])

    let [Newpayment, SetNewPayment] = useState([{
        id: id,
        invoice: currentPayment[0].shouldPickFromInvoices && ids.length !== 1 ? [] : Ids,
        child: [],
        disable:false

    }])

    const addComponent = () => {


        setChildOfChildPayment([...childOFchildPayment, {
            price: 0, trackingCode: '',
            date: currentPayment[0].shouldAnnounceDueDate ? new Date() : null,
            file: [],
            disable: false,
            show: true
        }])




    }






    const handelChange = value => setInvoicesState({ invoice: value })
    const getvalues = async (invoices) => {

        let cash = 0


        if (invoices.length > 0) {

            cash = 0
            let config = {
                headers: { "Content-Type": "application/json" },
                params: {
                    Ids: invoices,
                    PageSize: 100000
                },
                paramsSerializer: (params) => {
                    return QueryString.stringify(params);
                },
            };
            try {
                const { data, status } = await GetInvoicesWithSearch(config);
                if (status === 200) {

                    data.result.invoices.values.map(i => cash += i.price)
                }
            } catch (err) {
                console.log(err);
            }

            setCashmustPay(cash)

        }



        else {
            setCashmustPay(0)
            cash = 0

            if (Ids.length === 1) {

                let config = {
                    headers: { "Content-Type": "application/json" },
                    params: {
                        Ids: Ids,
                        PageSize: 100000
                    },
                    paramsSerializer: (params) => {
                        return QueryString.stringify(params);
                    },
                };
                try {
                    const { data, status } = await GetInvoicesWithSearch(config);
                    if (status === 200) {

                        data.result.invoices.values.map(i => cash += i.price)
                    }
                } catch (err) {
                    console.log(err);
                }


                setCashmustPay(cash)
            }

        }
    }





    useEffect(() => {

        getvalues(InvoicesState.invoice.map(i => i.value))


    }, [InvoicesState])



   


    const handelFormAdd = () => {


    }




    const invoiceIds = () => {


        return (idiesforivoice.map(i => ({ label: i, value: i })))

    }




  





    const onSubmit = async () => {
        SetNewPayment([...Newpayment])
       
         Setpayments([...new Set([...payment, ...Newpayment])])
    }


        

        
 
    return (
        <>
            <div className="border  rounded   ">
                {Newpayment.map((item, index) => (
                    <form key={index + 1} className=" mb-4  " id={id}>





                        <div className="col-md-12  mb-4  mt-2 ">
                            <div className='row'>
                                <div className='col-3'>
                                    <div className='row'>
                                        <div className='col-12'> انتخاب صورتحساب جهت ثبت سند پرداخت:</div>

                                    </div>



                                </div>
                                {currentPayment[0].shouldPickFromInvoices ? <><div className="col-9  textOnInput">
                                    <label> انتخاب صورتحسابها</label>
                                    <DropDown
                                        value={InvoicesState.invoice}
                                        options={invoiceIds()}
                                        placeholder='صورتحساب ها'
                                        handleChange={(e) => {
                                            handelChange(e)
                                            SetNewPayment([{ ...item, invoice: e.map(i => i.value) }])
                                            console.log(e);
                                        }}


                                        multi={true}
                                    />
                                    {cashMustPay !== 0 ? <p className='text-center'>{`مبلغ پرداختی ${formatter.format(cashMustPay)} می باشد.`}</p> : ''}
                                </div>

                                </>
                                    : <p className='text-center'>{`مبلغ پرداختی ${formatter.format(cashMustPay)} می باشد.`}</p>}




                            </div>

                            <div className='d-flex justify-content-center m-2' title='سند پرداختی جدید '>


                            </div>





                        </div>



                        <div className='col-12 mt-4 mb-4'>


                            {childOFchildPayment.map((childItem, newIndex) => (<>
                                <NewChildOfChildPayment setChildOfChildPayment={setChildOfChildPayment} pay={pays} id={pays.length} setPays={setPays} currentPayment={currentPayment} childOFchildPayment={childOFchildPayment} />


                            </>
                            ))}

                        </div>

                        <div className='  text-right mt-4 mb-4' >


                            {pays.length > 0 ? <button type='button' className='btn btn-success ml-4 mr-4' disabled={item.disable} onClick={()=>{SetNewPayment([{ ...item, child: [...pays],disable:true }])
                        
                        Setpayments([...new Set([...payment, {...item, child: [...pays],disable:true }])])
                     
                                
                        }}>
                                ثبت فرم
                            </button> : ""}
                            <button type='button' className='btn btn-secondary ml-4 mr-4' onClick={addComponent}>
                                اضافه کردن سند
                            </button>
                        </div>

                    </form >
                ))}




            </div>
        </>)
}

export default NewPaymentChild