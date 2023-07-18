import Select from "react-select";
import React, {useEffect, useState} from "react";
import {GetGroupsForEntity} from "../../../../../services/GroupService";
import {PaymentStructureEnums} from "../../../../../Common/Enums/PaymentStructureEnums";
import {AdditionalTypeId} from "../../../../../Common/Enums/AdditionalTypeIdEnums";
import Modal from 'react-modal';
import { Link } from "react-router-dom";
import { GetCompanyChild } from '../../../../../services/companiesService';
import { GetGroupWithCompany } from '../../../../../services/GroupService';

interface Props{
    activeHandler:any, contact:any, handleEditClick:any, handleDeleteClick:any, index:any,companyId:any
}
const ProductSupplyConditionReadOnly:React.FC<Props> = ({activeHandler, contact, handleEditClick, handleDeleteClick, index,companyId}) => {
    const [customerg, setCustomerg] = useState([])
    const [modalIsOpen, setIsOpen] = useState(false);
    const openModal = async () => {
        setIsOpen(true);
    }
    const closeModal = () => {
        setIsOpen(false);
    }
    const GetCustomerGroup = async () => {
        if(companyId!==undefined && companyId){
        
            const { data, status } = await GetGroupWithCompany(1, companyId);

           

      

        setCustomerg(data.result.groups)
    }
    }
    useEffect(() => {
        GetCustomerGroup();

    }, [companyId])
    const CustomerG = () => {
        let customer=[...customerg , {id:null ,name: 'عمومی'}]
        return (customer.map(data => ({
            label: data.name,
            id: data.id
        })))

    }

    const paymentMethod = () => {
        return (PaymentStructureEnums.map(data => ({label: data.name, value: data.id})))
    }
    const PaymentId = (id:any) => {
        return (PaymentStructureEnums.filter(item => item.id === id).map(data => data.name))

    }
    const additionalTypeIdS = () => {
        return (AdditionalTypeId.map(data => ({
            label: data.name,
            value: data.id
        })))

    }
    const additionalType = (id:any) => {
        return (AdditionalTypeId.filter(item => item.id === id).map(data => ({
            label: data.name,
            value: data.id
        })))

    }
    return (
        <tr className='text-center'>

            <td  data-th="ردیف" style={{backgroundColor: contact.special === true ? 'lightgreen' : 'transparent'}}>{index + 1}</td>

            <td data-th="نوع پرداخت" style={{backgroundColor: contact.special === true ? 'lightgreen' : ''}}><p className="mb-0">{PaymentId(contact.paymentMethodId)}</p></td>
            <td data-th="تعداد اقساط" style={{backgroundColor: contact.special === true ? 'lightgreen' : 'transparent'}}>{contact.paymentMethodId === 4 ? contact.installmentOccureCount : "-"}</td>
            <td data-th="بازه"style={{backgroundColor: contact.special === true ? 'lightgreen' : 'transparent'}}>{contact.paymentMethodId === 4 ? contact.installmentPeriod : "-"}</td>
            <td data-th="فی " style={{backgroundColor: contact.special === true ? 'lightgreen' : 'transparent'}}>{contact.price}</td>
            <td data-th="گروه مشتریان"style={{backgroundColor: contact.special === true ? 'lightgreen' : 'transparent'}}>{ CustomerG().filter(i => i.id === contact.customerGroupId).map(contacts => contacts.label)[0]}</td>
            <td data-th="گروه مشتریان"style={{backgroundColor: contact.special === true ? 'lightgreen' : 'transparent'}} title={contact.comment}>{ contact.comment?contact.comment.substring(0,20):''}</td>
            <td data-th="فعال" style={{backgroundColor: contact.special === true ? 'lightgreen' : 'transparent'}}>{contact.active === true ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     className="feather feather-check  " onClick={(event) => activeHandler(event, contact)}
                     style={{color: 'green'}}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" data-dismiss="alert" width="21" height="21"
                     fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     className="feather feather-x  danger " onClick={(event) => activeHandler(event, contact)}
                     style={{color: 'red'}}>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>)
            }</td>

            <td data-th="عملیات" style={{backgroundColor: contact.special === true ? 'lightgreen' : 'transparent'}}
                className="text-center ">
                <div className=" text-center text-nowrap " style={{listStyle: "none"}}>

                   <Link to='#' onClick={(event) => handleEditClick(event, contact)} data-toggle="tooltip"
                           data-placement="top"
                           data-title="ویرایش">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                             strokeLinejoin="round" className="feather feather-edit-2">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                    </Link>
                    <Link to='#' onClick={() => handleDeleteClick(contact.id)} data-toggle="tooltip" data-placement="top"
                           data-title="حذف">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                             strokeLinejoin="round" className="feather feather-trash-2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path
                                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </Link>
                </div>
            </td>

        </tr>


    );
};

export default ProductSupplyConditionReadOnly;