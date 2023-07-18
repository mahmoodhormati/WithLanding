import React, { useEffect, useState } from 'react'
import Select from "react-select";
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { AdditionalTypeId } from '../../../../../Common/Enums/AdditionalTypeIdEnums'
import { PaymentStructureEnums } from '../../../../../Common/Enums/PaymentStructureEnums'
import { GetCompanyChild } from '../../../../../services/companiesService'
import { GetGroupWithCompany } from '../../../../../services/GroupService';
import { GetProductSupplyConditions, SetProductSupplyConditions } from '../../../../../services/ProductSupplyConditionService'
interface Props {
    id: any,
    quantity:any,
    setConditionS:any,
    getSupply:any
}
const ConditionForOrder:React.FC<Props>= ({id , quantity , setConditionS , getSupply}) => {
    const [paymentMethodId, setpaymentMethodId] = useState<any>(0)
    const [additionalTypeId, setadditionalTypeId] = useState<any>(0)
    const [customerGroupId, setcustomerGroupId] = useState<any>(0)
    const [active, setActive] = useState(true)
    const [special, setSpecial] = useState(false)
    const [modalIsOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [show, setShow] = useState(false)
    const [condition, setCondition] = useState<any>([])
    const [addFormData, setAddFormData] = useState<any>({

        minSellableAmount: 0,
        maxSellableAmount: quantity,
        paymentMethodId,
        installmentPeriod: 0,
        installmentOccureCount: 0,
        comment: "",
        active,
        special,
        additionalAmount: 0,
        additionalTypeId,
        customerGroupId,
    });

    const [editFormData, setEditFormData] = useState({

        minSellableAmount: 0,
        maxSellableAmount: 0,
        paymentMethodId,
        installmentPeriod: 0,
        installmentOccureCount: 0,
        comment: "",
        active,
        special,
        additionalAmount: 0,
        additionalTypeId,
        customerGroupId,
    });
    
    const closeModal = () => {
        setIsOpen(false);
    }
    const [editContactId, setEditContactId] = useState(null);
    const [Id, setId] = useState(null);
    const [customerg, setCustomerg] = useState([])

    const GetCustomerGroup = async () => {

        const response = await GetCompanyChild();
        let companies = response.data.result.companies
        let arr = []
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
        GetProductSupplyC()

    }, [])


    const GetProductSupplyC = async () => {
        try {
            const { data, status } = await GetProductSupplyConditions(id);
            if (status === 200) {
                setCondition(data.result.productSupplyConditions.values)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleAddFormChange = (event: any) => {
        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value.replaceAll(",", '');
        const newFormData: any = { ...addFormData };
        newFormData[fieldName] = fieldValue;
        setAddFormData(newFormData);
    };
   
    const body = {
        productSupplyCondition: {
            minSellableAmount: Number(addFormData.minSellableAmount),
            maxSellableAmount: quantity,
            paymentMethodId,
            productSupplyId: Number(id),
            installmentPeriod: addFormData.installmentPeriod,
            installmentOccureCount: addFormData.installmentOccureCount,
            installmentStartDate: new Date(),
            comment: addFormData.comment,
            active: true,
            special,
            additionalAmount: addFormData.additionalAmount,
            additionalTypeId,
            customerGroupId,

        }
    }
    const handleAddFormSubmit = async (event: any) => {
        setLoading(true)
        event.preventDefault();


        try {

            const { data, status } = await SetProductSupplyConditions(body)
            if (status === 200) {
                getSupply()

                closeModal()
                toast.success("شرایط جدید عرضه افزوده شد", {
                    position: "top-right",
                    closeOnClick: true
                });
                GetProductSupplyC()
            }
            if (status === 200) {
                GetProductSupplyC()

            }
            setLoading(false)
        } catch (err) {
            console.log(err)
        }
        setShow(!show)
        setConditionS()

    }
    const editedContact = {
        productSupplyCondition: {
            id: editContactId,

            minSellableAmount: editFormData.minSellableAmount,
            maxSellableAmount: editFormData.maxSellableAmount,
            paymentMethodId,
            productSupplyId: Number(id),
            installmentPeriod: editFormData.installmentPeriod,
            installmentOccureCount: editFormData.installmentOccureCount,
            installmentStartDate: new Date(),
            comment: editFormData.comment,
            active: true,
            special,
            additionalAmount: editFormData.additionalAmount,
            additionalTypeId,
            orderDetails: null,
            shoppingCartItems: null,
            productSupply: null,
            customerGroupId,
        }
    };

 const CustomerG = () => {
        let customer = [...customerg, { id: null, name: 'همه' }]
        return (customer.map(data => ({
            label: data.name,
            value: data.id
        })))

    }

    const paymentMethod = () => {
        return (PaymentStructureEnums.map(data => ({ label: data.name, value: data.id })))
    }

    const additionalTypeIdS = () => {
        return (AdditionalTypeId.map(data => ({
            label: data.name,
            value: data.id
        })))

    }
  return (
    <div >


                    <div>


                        <div  >
                            <div className="card-body p-0 ">

                                <div className="form-row">
                                    <div className="n-chk d-flex mt-1 ">

                                        <div>
                                            <label className="mr-2 mb-4 text-danger"> شرایط خاص </label>

                                            <input type="checkbox" checked={special}

                                                onChange={e => setSpecial(e.target.checked)} />

                                        </div>


                                    </div>

                                </div>

                                <div className="form-row mt-1">
                                    <div className="  form-group col-md-6 col-xs-12 textOnInput  " >

                                        <label>نوع پرداخت</label>


                                        <Select
                                            menuShouldScrollIntoView ={false}
                                            placeholder="نوع پرداخت"
                                            options={paymentMethod()}
                                            onChange={(e:any) => setpaymentMethodId(e.value)}
                                        />
                                        {paymentMethodId === 0 ? (<span className="text-danger">نوع پرداخت را وارد کنید</span>) : null}

                                    </div>

                                    <div className="  form-group col-md-6 col-xs-12 textOnInput  seectIndex"
                                        style={{ zIndex: '4' }}>

                                        <label>نوع افزایش</label>


                                        <>
                                            <Select
                                                menuShouldScrollIntoView ={false}
                                                name="additionalTypeId"
                                                placeholder="نوع افزایش"
                                                options={additionalTypeIdS()}
                                                onChange={(e:any) => setadditionalTypeId(e.value)}
                                            />

                                            {additionalTypeId === 0 ? (<span className="text-danger">نوع افزایش را وارد کنید</span>) : null}

                                        </>

                                    </div>

                                </div>

                                {paymentMethodId === 4 ?
                                    <div className='form-row mt-1'>
                                        <div className=" form-group col-md-6 col-xs-12 textOnInput">
                                            <label>تعداد اقساط</label>
                                            <input type="number" className="form-control opacityForInput"
                                                name="installmentOccureCount" onChange={handleAddFormChange} />
                                        </div>

                                        <div className=" form-group col-md-6 col-xs-12 textOnInput">
                                            <label> چند روزه</label>
                                            <input type="number" className="form-control opacityForInput"
                                                name="installmentPeriod" onChange={handleAddFormChange} />

                                        </div>


                                    </div>
                                    :
                                    ''
                                }
                                <div className='form-row mt-1'>
                                    <div className=" form-group col-md-6 col-xs-12 textOnInput">
                                        <label>مقدار افزایش</label>
                                        <input type="number" className="form-control opacityForInput"
                                            name="additionalAmount"
                                            onChange={handleAddFormChange} />
                                    </div>


                                    <div className="form-group col-md-6 col-xs-12 textOnInput   "
                                        style={{ zIndex: '3' }}>
                                        <label>گروه مشتریان</label>
                                        <Select
                                            menuShouldScrollIntoView ={false}
                                            placeholder="گروه مشتریان"
                                            options={CustomerG()}
                                            onChange={(e:any) => setcustomerGroupId(e.value)}
                                        />
                                        {customerGroupId === 0 ? (<span className="text-danger">گروه مشتریان را وارد کنید</span>) : null}

                                    </div>
                                </div>
                                <div className="form-row mt-1">
                                    <div className=" form-group col-md-6 col-xs-12 textOnInput">
                                        <label>حداقل سفارش</label>
                                        <input type="number" className="form-control opacityForInput"
                                            name="minSellableAmount"
                                            onChange={handleAddFormChange} />
                                    </div>
                                    <div className=" form-group col-md-6 col-xs-12 textOnInput">
                                        <label>حداکثر سفارش</label>
                                        <input type="text" className="form-control opacityForInput"
                                            name="maxSellableAmount"
                                            value={quantity}
                                            onChange={handleAddFormChange} />
                                    </div>

                                </div>

                                <div className="form-group  textOnInput mt-1 ">
                                    <label>توضیحات</label>

                                    <textarea  className="form-control opacityForInput " rows={4}
                                        placeholder='توضیحات تکمیلی' name="comment" onChange={handleAddFormChange} />

                                </div>
                                <div className='row '>

                                    <div className='col-6 '>
                                        <button className="btn btn-success float-left "
                                            disabled={loading ? true : false || paymentMethodId === 0 ? true : false && additionalTypeId === 0 ? true : false && customerGroupId === 0 ? true : false} onClick={handleAddFormSubmit}>تایید
                                            <ClipLoader

                                                loading={loading}
                                                color="#ffff"
                                                size={15}
                                            /></button>
                                    </div>
                                    <div className='col-6 '>
                                        <button className="btn btn-primary float-right " onClick={()=>setConditionS()}> بازگشت</button>
                                    </div>
                                </div>


                            </div>

                        </div>

                    </div>

                </div>
  )
}

export default ConditionForOrder