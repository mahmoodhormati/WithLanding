import React, { Fragment, useEffect, useState } from "react";
import { GetGroupsForEntity, GetGroupWithCompany } from "../../../services/GroupService";
import { PaymentStructureEnums } from "../../Enums/PaymentStructureEnums";
import { Link } from 'react-router-dom';
import { GetCompanyChild } from '../../../services/companiesService';
interface Props {
    productSupplyConditions: any,
    handelClick: any
}


const ConditionSalesBordAdmin: React.FC<Props> = ({ productSupplyConditions, handelClick }) => {

    const [customerg, setCustomerg] = useState([])
    const GetCustomerGroup = async () => {
        const response = await GetCompanyChild();
        let companies = response.data.result.companies
        let arr: any = []
        let finalArr: any = []
        for (let i = 0; i < companies.length; i++) {

            const { data, status } = await GetGroupWithCompany(1, companies[i].id);

            if (data.result.groups.length > 0) {
                arr.push(data.result.groups)
            }


        }

        finalArr = Array.prototype.concat.apply([], arr);

        setCustomerg(finalArr);

    }

    useEffect(() => {
        GetCustomerGroup();
    }, [])
    const CustomerG = () => {
        let customer = [...customerg, { id: null, name: 'عمومی' }]
        return (customer.map(data => ({
            label: data.name,
            value: data.id
        })))
    }
    const PaymentId = (id: number) => {
        return (PaymentStructureEnums.filter(item => item.id === id).map(data => data.name))

    }



    return (
        <Fragment >
            <div className="  ">
                <h5 className="text-center">لطفا یکی از شرایط ذیل را برای ثبت سفارش انتخاب کنید :</h5>

                <div className="containerT   p-2">
                    {/*<div className="d-block clearfix mb-2" onClick={closeModal}><svg*/}
                    {/*    xmlns="http://www.w3.org/2000/svg"*/}
                    {/*    width="24" height="24"*/}
                    {/*    viewBox="0 0 24 24" fill="none"*/}
                    {/*    stroke="currentColor" strokeWidth="2"*/}
                    {/*    strokeLinecap="round"*/}
                    {/*    strokeLinejoin="round"*/}
                    {/*    className="feather feather-x close"*/}
                    {/*    data-dismiss="alert"><line x1="18" y1="6"*/}
                    {/*        x2="6"*/}
                    {/*        y2="18"></line><line*/}
                    {/*            x1="6" y1="6" x2="18" y2="18"></line></svg></div>*/}
                    <table
                        className="table table-bordered bg-light-warning mb-4">
                        <thead>
                            <tr style={{ fontSize: '10px' }}>

                                <th style={{ fontSize: '10px' }} className="text-center">ردیف</th>
                                <th style={{ fontSize: '10px' }} className="text-center">نوع پرداخت</th>
                                <th style={{ fontSize: '10px' }} className="text-center">تعداد اقساط</th>
                                <th style={{ fontSize: '10px' }} className="text-center">بازه</th>
                                <th style={{ fontSize: '10px' }} className="text-center">فی</th>

                                <th style={{ fontSize: '10px' }} className="text-center">گروه مشتریان</th>
                                <th style={{ fontSize: '10px' }} className="text-center">توضیحات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productSupplyConditions.productSupplyConditions.map((contact: any, index: number) =>

                                <tr className='text-center'>
                                    <td data-th="ردیف">{index + 1}</td>

                                    <td data-th="نوع پرداخت">
                                        <p className="mb-0">{PaymentId(contact.paymentMethodId)}</p>
                                    </td>

                                    <td data-th="تعداد اقساط">{contact.paymentMethodId === 4 ? contact.installmentOccureCount : "-"}</td>
                                    <td data-th="بازه">{contact.paymentMethodId === 4 ? contact.installmentPeriod : "-"}</td>


                                    <td data-th="فی">{contact.price}</td>
                                    <td data-th="گروه مشتریان">{CustomerG().filter(i => i.value === contact.customerGroupId).map(contacts => contacts.label)}</td>

                                    <td data-th="توضیحات"title={contact.comment}>{contact.comment ? contact.comment.substring(0, 10) + "..." : "--"}</td>
                                    {/* <td data-th="عملیات"className="text-center">
                                        <ul className="table-controls">

                                            <li><Link to='#' className="btn btn-success" data-toggle="tooltip" data-placement="top"
                                                 >
                                                ثبت درخواست                           </Link></li>

                                        </ul>
                                    </td> */}
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>
            </div>
        </Fragment>
    )
}
export default ConditionSalesBordAdmin