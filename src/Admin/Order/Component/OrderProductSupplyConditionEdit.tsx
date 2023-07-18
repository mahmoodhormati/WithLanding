import Modal from 'react-modal';
import { GetProductSupplyConditions } from "../../../services/ProductSupplyConditionService";
import { useState, useEffect } from "react";
import { GetGroupsForEntity } from "../../../services/GroupService";
import { PaymentStructureEnums } from "../../../Common/Enums/PaymentStructureEnums";
import { useNavigate } from "react-router-dom";
import { editOrderDetail } from "../../../services/orderService";
import FadeLoader from "react-spinners/FadeLoader";
import { toast } from 'react-toastify';
import { GetGroupWithCompany } from '../../../services/GroupService';
import { GetCompanyChild } from '../../../services/companiesService';



const customStyles = {
    content: {

        inset: '50% auto auto 50%',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '5%',
        border: '2px ridge black',
        maxHeight:'80vh'

    }

}

interface Props{
    modalIsOpen:any, closeModal:any, id:any, Detail:any,order:any
}
const OrderProductSupplyConditionEdit:React.FC<Props> = ({ modalIsOpen, closeModal, id, Detail,order }) => {
    const Navigate = useNavigate()
    const [checked, setChecked] = useState({ selectedValue: 0 })
    const [condition, setCondition] = useState([])
    const [customerg, setCustomerg] = useState([])
    let color = "#0c4088";
    let [loading, setLoading] = useState(false);

    const submit = async () => {
        let body={};
        if(checked.selectedValue===0){
            body = {
                "orderDetail":{...Detail}
            }
        }
        else{
        body = {
            "orderDetail":{...Detail,productSupplyConditionId:checked.selectedValue}
        }
    }
        setLoading(true)

        try {
            const { data, status } = await editOrderDetail(body)


            setTimeout(() => {
                if (data.success === true) {
                    toast.success('تغییرات با موفقیت ثبت شد', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined
                    });
                    closeModal()

                    setLoading(false)
                }
            }, 4000)


        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }
    const CheckedHadnler = (conditionId:any) => {


        setChecked({ selectedValue: conditionId })


    }
    const getProductSupplyCondition = async () => {

        if(modalIsOpen===true && id!==undefined){
        try {
            const { data, status } = await GetProductSupplyConditions(id)
            setCondition(data.result.productSupplyConditions.values)
        } catch (e) {

        }
    }
    }
    const GetCustomerGroup = async () => {
        const response = await GetCompanyChild(); let companies = response.data.result.companies
         let arr = [] 
         let finalArr:any = [] 

         
             const { data, status } = await GetGroupWithCompany(1, order.companyId)
            
              setCustomerg(finalArr);
    }
    useEffect(() => {
        getProductSupplyCondition()
       

    }, [id])
    const CustomerG = () => {
        return (customerg.map((data:any) => ({
            label: data.name,
            value: data.id
        })))

    }
    const PaymentId = (id:any) => {
        return (PaymentStructureEnums.filter((item:any) => item.id === id).map((data:any) => data.name))

    }
    const editHandler = (id:number) => {
        Navigate(`/admin/editproductsupply/${id}`)
    }

    return (

        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Selected Option"
            ariaHideApp={false}


        >
            {loading === true ? <div >
                <p>ثبت تغییرات ...</p>
                <FadeLoader loading={loading} color={color} />
            </div> :

                <div className=" rounded  " style={{ border: " 1px solid #bfc9d4" }} >
                    {condition === null ? (
                        <div className="text-center">
                            <span className="d-block  p-3">هیچ شرطی یافت نشد</span>
                            <span className="d-block  p-3 ">برای افزودن شرط  کلیک کنید  </span>
                            <button className="btn btn-primary m-3" onClick={() => editHandler(id)}> افزودن شرط </button>
                            <button className="btn btn-danger m-3" onClick={closeModal}> بازگشت </button>

                        </div>
                    ) : (
                        <div className="table-responsive p-2">
                            <table
                                className="table table-bordered table-hover table-striped  mt-2  mb-4">
                                <thead>
                                    <tr style={{ fontSize: '10px' }}>

                                        <th style={{ fontSize: '10px' }} className="text-center">ردیف</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">نوع پرداخت</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">تعداد اقساط</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">بازه</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">فی</th>

                                        <th style={{ fontSize: '10px' }} className="text-center">گروه مشتریان</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">فعال</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">انتخاب</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {condition.map((contact:any, index:number) => (
                                        <tr className='text-center'>

                                            <td style={{ backgroundColor: contact.special === true ? 'lightgreen' : 'transparent' }}>{index + 1}</td>

                                            <td style={{ backgroundColor: contact.special === true ? 'lightgreen' : 'transparent' }}><p className="mb-0">{PaymentId(contact.paymentMethodId)}</p></td>
                                            <td style={{ backgroundColor: contact.special === true ? 'lightgreen' : 'transparent' }}>{contact.paymentMethodId === 4 ? contact.installmentOccureCount : "-"}</td>
                                            <td style={{ backgroundColor: contact.special === true ? 'lightgreen' : 'transparent' }}>{contact.paymentMethodId === 4 ? contact.installmentPeriod : "-"}</td>
                                            <td style={{ backgroundColor: contact.special === true ? 'lightgreen' : 'transparent' }}>{contact.price}</td>
                                            <td style={{ backgroundColor: contact.special === true ? 'lightgreen' : 'transparent' }}>{contact.customerGroupId ? CustomerG().filter(i => i.value === contact.customerGroupId).map(contacts => contacts.label) : "عمومی"}</td>
                                            <td style={{ backgroundColor: contact.special === true ? 'lightgreen' : 'transparent' }}>{contact.active === true ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                    className="feather feather-check  "
                                                    style={{ color: 'green' }}>
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" data-dismiss="alert" width="21" height="21"
                                                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                    className="feather feather-x  danger "
                                                    style={{ color: 'red' }}>
                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>)
                                            }</td>
                                            <td style={{ backgroundColor: contact.special === true ? 'lightgreen' : 'transparent' }}><input type="radio" name={Detail.productSupplyConditionId} checked={Detail.productSupplyConditionId === contact.id ? contact.id : checked.selectedValue === contact.id} value={contact.id} id={contact.id} onChange={(e) => CheckedHadnler(contact.id)} /></td>

                                        </tr>

                                    ))}

                                </tbody>
                            </table>
                            <div className="row  m-auto ">
                                <button className="col-4 btn-sm btn-success" disabled={loading} onClick={submit}>ثبت </button>
                                <button className="col-4 btn-sm btn-danger " disabled={loading} onClick={() => closeModal()}>لغو </button>
                                <button className=" col-4 btn-sm btn-info  " disabled={loading} onClick={() => editHandler(id)}> افزودن شرط جدید</button>

                            </div>

                        </div>)}
                </div>}

        </Modal>
    )
}
export default OrderProductSupplyConditionEdit