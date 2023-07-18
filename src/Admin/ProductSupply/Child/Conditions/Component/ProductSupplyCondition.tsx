import Select from "react-select";
import React, {useRef, useState, useEffect} from "react";
import {PaymentStructureEnums} from "../../../../../Common/Enums/PaymentStructureEnums";
import {AdditionalTypeId} from "../../../../../Common/Enums/AdditionalTypeIdEnums";
import {
    DeleteProductSupplyCondition,
    GetProductSupplyConditions,
    SetProductSupplyConditions
} from "../../../../../services/ProductSupplyConditionService";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import ProductSupplyConditionReadOnly from "./ProductSupplyConditionRead";
import ProductSupplyConditionEdit from "./ProductSupplyConditionEdit";
import Modal from 'react-modal';
import {ClipLoader} from "react-spinners";
import {Link} from "react-router-dom";
import {GetGroupWithCompany} from '../../../../../services/GroupService';
import {formatter} from "../../../../../Utils/Formatter";

const customStyles: any = {
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
};

interface Props {
    quantity: any,
    companyId: any,
    update:any
}

const ProductSupplyCondition: React.FC<Props> = ({quantity, companyId,update}) => {
    const params = useParams()

    const [paymentMethodId, setpaymentMethodId] = useState<any>(0)
    const [additionalTypeId, setadditionalTypeId] = useState<any>(0)
    const [minSellableAmount, setMinSellableAmount] = useState<any>(0)
    const [maxSellableAmount, setMaxSellableAmount] = useState<any>(quantity)
    const [installmentPeriod, setInstallmentPeriod] = useState<any>(0)
    const [installmentOccureCount, setInstallmentOccureCount] = useState<any>(0)
    const [comment, setComment] = useState<any>('')
    const [additionalAmount, setAdditionalAmount] = useState<any>(0)
    const [customerGroupId, setcustomerGroupId] = useState<any>(0)
    const [active, setActive] = useState(true)
    const [special, setSpecial] = useState(false)
    const [modalIsOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [show, setShow] = useState(false)
    const [condition, setCondition] = useState<any>([])

    const [editFormData, setEditFormData] = useState({

        minSellableAmount,
        maxSellableAmount,
        paymentMethodId,
        installmentPeriod,
        installmentOccureCount,
        comment,
        active,
        special,
        additionalAmount,
        additionalTypeId,
        customerGroupId,
    });
    const openModal = async () => {
        setMaxSellableAmount(quantity)
        setpaymentMethodId(0)
        setcustomerGroupId(0)
        setadditionalTypeId(0)
        setIsOpen(true);
    }
    const closeModal = () => {
        setIsOpen(false);
    }

    console.log(companyId);
    
    const [editContactId, setEditContactId] = useState(null);
    const [Id, setId] = useState(null);
    const [customerg, setCustomerg] = useState([])

    const GetCustomerGroup = async () => {

if(companyId!==undefined && companyId){
        const {data, status} = await GetGroupWithCompany(1, companyId);


        setCustomerg(data.result.groups);
}
    }
    useEffect(() => {
        GetCustomerGroup();
        GetProductSupplyC()

    }, [companyId])


    const GetProductSupplyC = async () => {
        try {
            const {data, status} = await GetProductSupplyConditions(params.id);
            if (status === 200) {
                setCondition(data.result.productSupplyConditions.values)
            }
        } catch (err) {
            console.log(err)
        }
    }
    const handelDeletData = () => {

        setMinSellableAmount(0)

        setInstallmentPeriod(0)
        setInstallmentOccureCount(0)
        setComment("")

        setAdditionalAmount(0)


    }
    const body = {
        productSupplyCondition: {

            minSellableAmount: Number(minSellableAmount),
            maxSellableAmount,
            paymentMethodId,
            productSupplyId: Number(params.id),
            installmentPeriod,
            installmentOccureCount,
            installmentStartDate: new Date(),
            comment:comment,
            active: true,
            special,
            additionalAmount,
            additionalTypeId,
            customerGroupId,

        }
    }
    const handleAddFormSubmit = async (event: any) => {
        setLoading(true)
        event.preventDefault();


        try {

            const {data, status} = await SetProductSupplyConditions(body)
            if (status === 200) {
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
    }
    const editedContact = {
        productSupplyCondition: {
            id: editContactId,

            minSellableAmount,
            maxSellableAmount,
            paymentMethodId,
            productSupplyId: Number(params.id),
            installmentPeriod,
            installmentOccureCount,
            installmentStartDate: new Date(),
            comment,
            active: true,
            special,
            additionalAmount,
            additionalTypeId,
            orderDetails: null,
            shoppingCartItems: null,
            productSupply: null,
            customerGroupId,
        }
    };

    const handleEditFormSubmit = async () => {

        setLoading(true)
        try {
            const {data, status} = await SetProductSupplyConditions(editedContact)
            if (status === 200) {
                toast.success("شرط با موفقیت ویرایش شد", {
                    position: "top-right",
                    closeOnClick: true
                });
                GetProductSupplyC()
                setLoading(false)
                update()
            }

        } catch (err) {
            console.log(err)
        }
        const newContacts: any = [...condition];

        const index = condition.findIndex((contact: any) => contact.id === editContactId);

        newContacts[index] = editedContact;

        setCondition(newContacts);

        setEditContactId(null);
    };
    const setActiveHandler = async (editedContact: any) => {
        try {

            const {data, status} = await SetProductSupplyConditions(editedContact)
            if (status === 200) {
                GetProductSupplyC()

            }

        } catch (err) {
            console.log(err)
        }
    }

    const activeHandler = (event: any, condition: any) => {
        event.preventDefault();
        let ids = condition.id
        setId(ids);
        const formValues = {
            id: condition.id,
            minSellableAmount: condition.minSellableAmount,
            maxSellableAmount: condition.maxSellableAmount,
            paymentMethodId: condition.paymentMethodId,
            installmentPeriod: condition.installmentPeriod,
            installmentOccureCount: condition.installmentOccureCount,
            comment: condition.comment,
            active: condition.active,
            special: condition.special,
            additionalAmount: condition.additionalAmount,
            additionalTypeId: condition.additionalTypeId,
            customerGroupId: condition.customerGroupId,
        };
        setEditFormData(formValues);

        if (Id !== null) {
            setActive(!active)
            const editedContact = {
                productSupplyCondition: {
                    id: condition.id,

                    minSellableAmount: editFormData.minSellableAmount,
                    maxSellableAmount: editFormData.maxSellableAmount,
                    paymentMethodId: editFormData.paymentMethodId,
                    productSupplyId: Number(params.id),
                    installmentPeriod: editFormData.installmentPeriod,
                    installmentOccureCount: editFormData.installmentOccureCount,
                    installmentStartDate: new Date(),
                    comment: editFormData.comment,
                    active,
                    special: editFormData.special,
                    additionalAmount: editFormData.additionalAmount,
                    additionalTypeId: editFormData.additionalTypeId,
                    orderDetails: null,
                    shoppingCartItems: null,
                    productSupply: null,
                    customerGroupId: editFormData.customerGroupId,
                }
            };

            setActiveHandler(editedContact)
            setId(null);

        }


    };

    const handleEditClick = (event: any, condition: any) => {
        event.preventDefault();
        setEditContactId(condition.id);
        setMinSellableAmount(condition.minSellableAmount)
        setMaxSellableAmount(condition.maxSellableAmount)
        setInstallmentPeriod(condition.installmentPeriod)
        setInstallmentOccureCount(condition.installmentOccureCount)
        setComment(condition.comment)
        setAdditionalAmount(condition.additionalAmount)
        setpaymentMethodId(condition.paymentMethodId)
        setadditionalTypeId(condition.additionalTypeId)
    };
    const handleCancelClick = () => {
        setEditContactId(null);

    };
    const handleDeleteClick = async (id: any) => {
        try {
            const {data, status} = await DeleteProductSupplyCondition(id)
            if (data.success === true) {
                toast.success("شرط با موفقیت حذف شد", {
                    position: "top-right",
                    closeOnClick: true
                });
                GetProductSupplyC()
            }
            if (data.success === false) {

                toast.error("این شرط به یک یا چند سفارش اختصاص داده شده است", {
                    position: "top-right",
                    closeOnClick: true
                });
            }
        } catch (err) {
            console.log(err)
            toast.error("این شرط به یک یا چند سفارش اختصاص داده شده است", {
                position: "top-right",
                closeOnClick: true
            });
        }
    }
    const CustomerG = () => {
        let customer = [...customerg, {id: null, name: 'همه'}]
        return (customer.map(data => ({
            label: data.name,
            value: data.id
        })))

    }

    const paymentMethod = () => {
        return (PaymentStructureEnums.map(data => ({label: data.name, value: data.id})))
    }

    const additionalTypeIdS = () => {
        return (AdditionalTypeId.map(data => ({
            label: data.name,
            value: data.id
        })))

    }

    return (
        <div className=" rounded ProductSupplyCondition " >
            {condition === null ? (<span className="d-block text-center p-5 m-4">هیچ شرطی یافت نشد</span>) : (
                <div className=" ProductSupplyCondition-table table table-hover table-striped  p-2">
                    <table
                        className="  mt-2  mb-4">
                        <thead>
                        <tr style={{fontSize: '10px'}}>

                            <th style={{fontSize: '10px'}} className="text-center">ردیف</th>
                            <th style={{fontSize: '10px'}} className="text-center">نوع پرداخت</th>
                            <th style={{fontSize: '10px'}} className="text-center">تعداد اقساط</th>
                            <th style={{fontSize: '10px'}} className="text-center">بازه</th>
                            <th style={{fontSize: '10px'}} className="text-center">فی</th>

                            <th style={{fontSize: '10px'}} className="text-center">گروه مشتریان</th>
                            <th style={{fontSize: '10px'}} className="text-center"> توضیحات</th>
                            <th style={{fontSize: '10px'}} className="text-center">فعال</th>
                            <th style={{fontSize: '10px'}} className="text-center">عملیات</th>
                        </tr>
                        </thead>
                        <tbody>
                        {condition.map((contact: any, index: any) => (


                            editContactId === contact.id ? (

                                <ProductSupplyConditionEdit
                                    setMinSellableAmount={setMinSellableAmount}
                                    setMaxSellableAmount={setMaxSellableAmount}
                                    setInstallmentPeriod={setInstallmentPeriod}
                                    setInstallmentOccureCount={setInstallmentOccureCount}
                                    setComment={setComment}
                                    setAdditionalAmount={setAdditionalAmount}

                                    minSellableAmount={minSellableAmount}
                                    maxSellableAmount={maxSellableAmount}
                                    installmentPeriod={installmentPeriod}
                                    installmentOccureCount={installmentOccureCount}
                                    comment={comment}
                                    active={active}
                                    special={special}
                                    additionalAmount={additionalAmount}
                                    additionalTypeId={additionalTypeId}
                                    customerGroupId={customerGroupId}
                                    customStyles={customStyles}
                                    handleEditFormSubmit={handleEditFormSubmit}
                                    setcustomerGroupId={setcustomerGroupId}
                                    setpaymentMethodId={setpaymentMethodId}
                                    setadditionalTypeId={setadditionalTypeId}
                                    paymentMethodId={paymentMethodId}
                                    editFormData={contact}
                                    index={index}
                                    loading={loading}
                                    handleCancelClick={handleCancelClick}
                                    setSpecial={special}
                                    companyId={companyId}
                                    handelDeletData={handelDeletData}
                                />
                            ) : (


                                <ProductSupplyConditionReadOnly
                                    activeHandler={activeHandler}
                                    index={index}
                                    contact={contact}
                                    handleEditClick={handleEditClick}
                                    handleDeleteClick={handleDeleteClick}
                                    companyId={companyId}
                                />


                            )

                        ))}
                        </tbody>
                    </table>
                </div>)}
            <div className='d-block  '>


                <Link to='#' style={{marginTop: '-1.2rem', marginLeft: '.6rem', background: 'white'}}
                      className=" ProductSupplyCondition-add border-0      float-right " data-title="افزودن شرط"
                      onClick={() => openModal()}>
                    <svg style={{width: '24px', height: '38px'}} xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                         className="bi bi-plus-circle" viewBox="0 0 17 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path
                            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </svg>
                </Link>
            </div>
            <Modal isOpen={modalIsOpen}
                   onRequestClose={closeModal}
                   style={customStyles}
                   contentLabel="Selected Option"
                   ariaHideApp={false}>
                <div>


                    <div>


                        <div>
                            <div className="card-body p-0 "style={{height:'50vh'}}>

                                <div className="form-row">
                                    <div className="n-chk d-flex  ">

                                        <div>
                                            <label className="mr-2 mb-4 text-danger"> شرایط خاص </label>

                                            <input type="checkbox" checked={special}

                                                   onChange={e => setSpecial(e.target.checked)}/>

                                        </div>


                                    </div>

                                </div>

                                <div className="form-row">
                                    <div className="  form-group col-md-6 col-xs-12 textOnInput  ">

                                        <label>نوع پرداخت</label>


                                        <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder="نوع پرداخت"
                                            options={paymentMethod()}
                                            onChange={(e: any) => setpaymentMethodId(e.value)}
                                        />
                                        {paymentMethodId === 0 ? (
                                            <span className="text-danger">نوع پرداخت را وارد کنید</span>) : null}

                                    </div>

                                    <div className="  form-group col-md-6 col-xs-12 textOnInput  seectIndex"
                                         style={{zIndex: '4'}}>

                                        <label>نوع افزایش</label>


                                        <>
                                            <Select
                                                menuShouldScrollIntoView={false}
                                                name="additionalTypeId"
                                                placeholder="نوع افزایش"
                                                options={additionalTypeIdS()}
                                                onChange={(e: any) => setadditionalTypeId(e.value)}
                                            />

                                            {additionalTypeId === 0 ? (
                                                <span className="text-danger">نوع افزایش را وارد کنید</span>) : null}

                                        </>

                                    </div>

                                </div>

                                {paymentMethodId === 4 ?
                                    <div className='form-row'>
                                        <div className=" form-group col-md-6 col-xs-12 textOnInput">
                                            <label>تعداد اقساط</label>
                                            <input type="number" value={installmentOccureCount}
                                                   className="form-control opacityForInput"
                                                   name="installmentOccureCount"
                                                   onChange={(e) => setInstallmentOccureCount(e.target.value)}/>
                                        </div>

                                        <div className=" form-group col-md-6 col-xs-12 textOnInput">
                                            <label> چند روزه</label>
                                            <input type="number" value={installmentPeriod}
                                                   className="form-control opacityForInput"
                                                   name="installmentPeriod"
                                                   onChange={(e) => setInstallmentPeriod(e.target.value)}/>

                                        </div>


                                    </div>
                                    :
                                    ''
                                }
                                <div className='form-row'>
                                    <div className=" form-group col-md-6 col-xs-12 textOnInput">
                                        <label>مقدار افزایش</label>
                                        <input type="number" value={additionalAmount}
                                               className="form-control opacityForInput"
                                               name="additionalAmount"
                                               onChange={(e) => setAdditionalAmount(e.target.value)}/>
                                    </div>


                                    <div className="form-group col-md-6 col-xs-12 textOnInput   "
                                         style={{zIndex: '3'}}>
                                        <label>گروه مشتریان</label>
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder="گروه مشتریان"
                                            options={CustomerG()}
                                            onChange={(e: any) => setcustomerGroupId(e.value)}
                                        />
                                        {customerGroupId === 0 ? (
                                            <span className="text-danger">گروه مشتریان را وارد کنید</span>) : null}

                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className=" form-group col-md-6 col-xs-12 textOnInput">
                                        <label>حداقل سفارش</label>
                                        <input type="text" value={formatter.format(minSellableAmount)}
                                               className="form-control opacityForInput"
                                               name="minSellableAmount"
                                               onChange={(e) => setMinSellableAmount(e.target.value.replaceAll(",", ''))}/>
                                    </div>
                                    <div className=" form-group col-md-6 col-xs-12 textOnInput">
                                        <label>حداکثر سفارش</label>
                                        <input type="text" className="form-control opacityForInput"
                                               name="maxSellableAmount"
                                               value={formatter.format(maxSellableAmount)}
                                               onChange={(e) => setMaxSellableAmount(e.target.value.replaceAll(",", ''))}/>
                                    </div>

                                </div>

                                <div className="form-group  textOnInput ">
                                    <label>توضیحات</label>

                                    <textarea value={comment} className="form-control opacityForInput " rows={4}
                                              placeholder='توضیحات تکمیلی' name="comment"
                                              onChange={(e) => setComment(e.target.value)}/>

                                </div>
                                <div className='row '>

                                    <div className='col-6 '>
                                        <button className="btn btn-success float-left "
                                                disabled={loading ? true : false || paymentMethodId === 0 ? true : false && additionalTypeId === 0 ? true : false && customerGroupId === 0 ? true : false}
                                                onClick={handleAddFormSubmit}>تایید
                                            <ClipLoader

                                                loading={loading}
                                                color="#ffff"
                                                size={15}
                                            /></button>
                                    </div>
                                    <div className='col-6 '>
                                        <button className="btn btn-danger float-right "
                                                onClick={closeModal}>بازگشت
                                        </button>
                                    </div>
                                </div>


                            </div>

                        </div>

                    </div>

                </div>
            </Modal>
        </div>
    )
}
export default ProductSupplyCondition