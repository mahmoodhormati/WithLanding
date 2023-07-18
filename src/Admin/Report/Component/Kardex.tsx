import React, { useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router'
import { formatter } from '../../../Utils/Formatter'
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import { ExportToExcel } from '../../../Common/Shared/Common/ExportToExcel';

const Kardex = () => {


    const location = useLocation()
    const navigate = useNavigate()
    const [cardices, setCardices] = useState<any>(location.state ? location.state : null)

    const params = useParams()
    const downloadFile = (rootElementId: any, FileName: any) => {
        const input: any = document.getElementById(rootElementId)
        html2canvas(input).then((canvas) => {

            const imgData = canvas.toDataURL('image/png', 1.0)
            const pdf = new jsPDF('landscape', 'px')


            pdf.addImage(imgData, 'PNG', 5, 10, 625, 0)
            pdf.save(`${FileName}`)
        })

    }


    const handelNavigate = () => {
        navigate(-1)
    }
    if (cardices) {
        const { User, Order, Organization } = cardices


        if (User) {
            const dataForExel = cardices.User.map((item: any) => ({
                'نام ': item.customerName,
                'تاریخ ایجاد': (item.createDate ? new Date(item.createDate).toLocaleDateString('fa-IR') : ''),
                'توضیحات ': item.comment,
                'بدهکار': item.debit,
                'بستانکار': item.credit,
                'مانده': item.remained

            }))

            const sumDebit = () => {
                let total = 0
                if (cardices.User) {
                    cardices.User.map((item: any) => total += item.debit)
                }

                return total
            }
            const sumCredit = () => {
                let total = 0
                if (cardices.User) {
                    cardices.User.map((item: any) => total += item.credit)
                }

                return total
            }

            const sumRemined = () => {
                let total = 0
                if (cardices.User) {
                    cardices.User.map((item: any) => total += item.remained)
                }

                return total
            }

            return (<div className='user-progress' >
                <div >

                    <div className="  text-dark " id='page'>
                        <div className=' row col-lg-12 col-md-12 col-sm-12 col-xs-12  text-dark rounded border' style={{ margin: "0" }}>


                            < div className=" OrderCustomerInfo col-lg-12   border-dark p-2 "  >
                                <div className='  d-flex justify-content-around text-center '>




                                    <h4 >{` کارتکس  ${cardices.User[0].customerName}`}</h4>



                                    <h4 >{`تاریخ : ${new Date().toLocaleDateString('fa-IR')}`}</h4>






                                </div>

                                <div className='  col-lg-12 col-md-4 col-sm-12 col-xs-12  '>



                                </div>
                            </div>



                        </div>
                        <div className='col-12 mt-4' >
                            <table className='table-striped text-center    '>
                                <thead>
                                    <tr>
                                        <th>نام</th>
                                        <th>تاریخ ایجاد</th>
                                        <th>توضیحات</th>
                                        <th>بدهکار</th>
                                        <th>بستانکار</th>
                                        <th>مانده</th>
                                    </tr>
                                </thead>

                                <tbody >
                                    {cardices.User.map((item: any) => (

                                        <tr >
                                            <td >{item.customerName}</td>
                                            <td >{item.createDate ? new Date(item.createDate).toLocaleDateString('fa-IR') : ''}</td>
                                            <td >{item.comment}</td>
                                            <td>{formatter.format(item.debit)}</td>
                                            <td >{formatter.format(item.credit)}</td>
                                            <td >{formatter.format(item.remained)}</td>
                                        </tr>
                                    ))}
                                    <tr className='border-top ' >
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className='font-weight-bold' style={{ fontSize: 'small' }}>{formatter.format(sumDebit())}</td>
                                        <td className='font-weight-bold' style={{ fontSize: 'small' }}>{formatter.format(sumCredit())}</td>
                                        <td className='font-weight-bold' style={{ fontSize: 'small' }}>{formatter.format(sumDebit() - sumCredit())}</td>
                                    </tr>
                                </tbody>

                            </table>

                        </div>
                    </div>

                </div>
                <div className='d-flex justify-content-center mt-4'>
                    <ExportToExcel fileName='کارتکس مشتری' apiData={dataForExel} />
                    <button className='btn btn-info m-1' onClick={() => downloadFile('page', 'kartex')}>دانلود فایل </button>
                    <button className='btn btn-danger m-1' onClick={handelNavigate}>بازگشت</button>
                </div>
            </div>
            )
        }
        else if (Order) {

            const dataForExel = cardices.Order.map((item: any) => ({
                'نام ': item.customerName,
                'تاریخ ایجاد': (item.createDate ? new Date(item.createDate).toLocaleDateString('fa-IR') : ''),
                'توضیحات ': item.comment,
                'بدهکار': item.debit,
                'بستانکار': item.credit,
                'مانده': item.remained

            }))
            const sumDebit = () => {
                let total = 0
                if (cardices.Order) {
                    cardices.Order.map((item: any) => total += item.debit)
                }

                return total
            }
            const sumCredit = () => {
                let total = 0
                if (cardices.Order) {
                    cardices.Order.map((item: any) => total += item.credit)
                }

                return total
            }

            const sumRemined = () => {
                let total = 0
                if (cardices.Order) {
                    cardices.Order.map((item: any) => total += item.remained)
                }

                return total
            }
            return (<div className='user-progress' >
                <div >

                    <div className=" text-dark " id='page'>
                        <div className=' row col-lg-12 col-md-12 col-sm-12 col-xs-12 p-4 text-dark rounded border' style={{ margin: "0" }}>


                            < div className=" OrderCustomerInfo col-lg-12   border-dark p-2 "  >
                                <div className='  d-flex justify-content-around text-center '>




                                    <h4 >{` کارتکس سفارش شماره ${params.id}`}</h4>



                                    <h4 >{`تاریخ : ${new Date().toLocaleDateString('fa-IR')}`}</h4>






                                </div>

                                <div className='  col-lg-12 col-md-4 col-sm-12 col-xs-12  '>



                                </div>
                            </div>



                        </div>
                        <div className='col-12 mt-4'>
                            <table className='table-striped text-center font-weight-bold  '>
                                <thead>
                                    <tr>
                                        <th>نام</th>
                                        <th>تاریخ ایجاد</th>
                                        <th>توضیحات</th>

                                        <th>بدهکار</th>
                                        <th>بستانکار</th>
                                        <th>مانده</th>

                                    </tr>
                                </thead>

                                <tbody >
                                    {cardices.Order.map((item: any) => (

                                        <tr >
                                            <td >{item.customerName}</td>
                                            <td >{item.createDate ? new Date(item.createDate).toLocaleDateString('fa-IR') : ''}</td>
                                            <td >{item.comment}</td>
                                            <td >{formatter.format(item.debit)}</td>
                                            <td >{formatter.format(item.credit)}</td>
                                            <td >{formatter.format(item.remained)}</td>
                                        </tr>))}
                                    <tr className='border-top  ' style={{ fontSize: 'small' }}>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className='font-weight-bold' style={{ fontSize: 'small' }}>{formatter.format(sumDebit())}</td>
                                        <td className='font-weight-bold' style={{ fontSize: 'small' }}>{formatter.format(sumCredit())}</td>
                                        <td className='font-weight-bold' style={{ fontSize: 'small' }}>{formatter.format(sumDebit() - sumCredit())}</td>

                                    </tr>
                                </tbody>

                            </table>

                        </div>
                    </div>

                </div>
                <div className='d-flex justify-content-center mt-4'>
                    <ExportToExcel fileName='کارتکس سفارش' apiData={dataForExel} />
                    <button className='btn btn-info m-1' onClick={() => downloadFile('page', 'kartex')}>دانلود فایل </button>
                    <button className='btn btn-danger m-1' onClick={handelNavigate}>بازگشت</button>
                </div>
            </div>
            )
        }
        else if (Organization) {

            const dataForExel = cardices.Organization.map((item: any) => ({
                'نام ': item.customerName,
                'تاریخ ایجاد': (item.createDate ? new Date(item.createDate).toLocaleDateString('fa-IR') : ''),
                'توضیحات ': item.comment,
                'بدهکار': item.debit,
                'بستانکار': item.credit,
                'مانده': item.remained

            }))
            const sumDebit = () => {
                let total = 0
                if (cardices.Organization) {
                    cardices.Organization.map((item: any) => total += item.debit)
                }

                return total
            }
            const sumCredit = () => {
                let total = 0
                if (cardices.Organization) {
                    cardices.Organization.map((item: any) => total += item.credit)
                }

                return total
            }

            const sumRemined = () => {
                let total = 0
                if (cardices.Organization) {
                    cardices.Organization.map((item: any) => total += item.remained)
                }

                return total
            }
            return (<div className='user-progress'>
                <div  >

                    <div className="  text-dark " id='page'>
                        <div className=' row col-lg-12 col-md-12 col-sm-12 col-xs-12 p-4 text-dark rounded border' style={{ margin: "0" }}>


                            < div className=" OrderCustomerInfo col-lg-12   border-dark p-2 "  >
                                <div className='  d-flex justify-content-around text-center '>




                                    <h4 >{` کارتکس  ${cardices.Organization[0].customerName}`}</h4>



                                    <h4 >{`تاریخ : ${new Date().toLocaleDateString('fa-IR')}`}</h4>






                                </div>

                                <div className='  col-lg-12 col-md-4 col-sm-12 col-xs-12  '>



                                </div>
                            </div>



                        </div>
                        <div className='col-12 mt-4'>
                            <table className='table-striped text-center font-weight-bold  '>
                                <thead>
                                    <tr>
                                        <th>نام</th>
                                        <th>تاریخ ایجاد</th>
                                        <th>توضیحات</th>

                                        <th>بدهکار</th>
                                        <th>بستانکار</th>
                                        <th>مانده</th>

                                    </tr>
                                </thead>

                                <tbody >
                                    {cardices.Organization.map((item: any) => (

                                        <tr >
                                            <td >{item.customerName}</td>
                                            <td >{item.createDate ? new Date(item.createDate).toLocaleDateString('fa-IR') : ''}</td>

                                            <td >{item.comment}</td>
                                            <td >{formatter.format(item.debit)}</td>
                                            <td >{formatter.format(item.credit)}</td>
                                            <td >{formatter.format(item.remained)}</td>


                                        </tr>




                                    ))



                                    }
                                    <tr className='border-top  ' style={{ fontSize: 'small' }}>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className='font-weight-bold' style={{ fontSize: 'small' }}>{formatter.format(sumDebit())}</td>
                                        <td className='font-weight-bold' style={{ fontSize: 'small' }}>{formatter.format(sumCredit())}</td>
                                        <td className='font-weight-bold' style={{ fontSize: 'small' }}>{formatter.format(sumDebit() - sumCredit())}</td>

                                    </tr>
                                </tbody>

                            </table>

                        </div>
                    </div>

                </div>
                <div className='d-flex justify-content-center mt-4'>
                    <ExportToExcel fileName='کارتکس سازمان' apiData={dataForExel} />
                    <button className='btn btn-info m-1' onClick={() => downloadFile('page', 'kartex')}>دانلود فایل </button>
                    <button className='btn btn-danger m-1' onClick={handelNavigate}>بازگشت</button>
                </div>
            </div>
            )
        }

        else {
            return (null)
        }
    }



    else {

        return (

            <div className=" statbox widget-content widget-content-area text-dark ">
                <div className=' row col-lg-12 col-md-12 col-sm-12 col-xs-12 p-4 text-dark rounded border' style={{ margin: "0" }}>


                    < div className=" OrderCustomerInfo col-lg-12    p-2 "  >
                        <div className='  d-flex justify-content-around text-center '>
                            اطلاعات مورد نظر یافت نشد


                        </div>
                    </div>
                </div>
            </div>

        )
    }



}

export default Kardex