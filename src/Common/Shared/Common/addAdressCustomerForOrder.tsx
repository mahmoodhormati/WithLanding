import React, { useEffect, useState, useRef } from "react";
import { GetAllProvince, SetAddress } from "../../../services/addressService";
import { toast } from "react-toastify";
import Select from "react-select";
import Modal from "react-modal";
import { SplitSetAddressOrderDetail} from "../../../services/orderService";

import { ClipLoader } from "react-spinners";
import { validatAlpha, validatmin10, validatMobail, validatNumber } from "../../../Utils/validitionParams";
import { Field, Form, Formik } from "formik";
import { MeasureUnitSample } from "../../Enums/MeasureUnitSample";
import { RadioButton } from '../../../Utils/RadioButton';
import { GetAddressWithPostalCode } from "../../../services/outScopeService";

const customStyles = {
    content: {

        inset: '50% auto auto 50%',
        top: '53.1%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        
        transform: 'translate(-50%, -50%)',
        padding: 0,
        backgroundColor: "transparent",

        border: 'none',
        maxHeight:'80vh'

    }

}
interface Props {
    closeModal: any, isOpenAddress: any, orderDetailId: any, customer: any,UpdateParent:any
}
const AddAdressCustomerForOrder: React.FC<Props> = ({ closeModal, isOpenAddress, orderDetailId, customer,UpdateParent }) => {
    let [loading, setLoading] = useState(false);
    const [province, setProvince] = useState([]);
    const [provinceName, setProvinceName] = useState('');
    const [provinceId, setProvinceId] = useState(0);
    const [ostanId, setostanId] = useState(0);
    const [product, SetProduct] = useState<any>()
    const [orderDetail, SetOrderDetail] = useState<any>()
    const [disable, setDisable] = useState(true)
    const [AddressMethod, SetAddressMethod] = useState('AllOrder')
    const [ReciverMethod, SetReciverMethod] = useState('Me')
    const [quantity, setquantity] = useState<any>('')
    const [heavyWeightTruck, SetheavyWeightTruck] = useState<any>(false)
    const [name, SetName] = useState('')
    const [nationalCode, SetnationalCode] = useState('')
    const [mobile, SetMobile] = useState('')
    const [ifEstelam, SetIfStelam] = useState(false)

    const [idKharId, SetidKharId] = useState<any>(0)
    const [receiverName, setReceiverName] = useState('')
    const [allocationId, setAllocationId] = useState<any>(0)
    const [receiverUniqueId, SetReceiverUniqueId] = useState('')
    const [traceCode, SetTraceCode] = useState('')
    const [receiverId, SetreceiverId] = useState('')
    const [fullAddress, setFulAddress] = useState('');
    const [postalCode, setpostalCode] = useState('');
    const [receiverTel, setreceiverTel] = useState('');
    const [receiverMobile, setreceiverMobile] = useState('');
    var sum;

    const getProvince = async () => {

        if(isOpenAddress===true){
        const { data, status } = await GetAllProvince();
        setProvince(data.result.provinces);
    }}



    useEffect(() => {
        getProvince();
        setDefault()
    }, [orderDetailId]);
    const RadioChanger = (e: any) => {

        SetAddressMethod(e.target.value)

    }
    const RadioChangerReciver = (e: any) => {

        SetReciverMethod(e.target.value)
        setDisable(false)
        SetName('')
        SetnationalCode('')
        SetMobile('')
        if (e.target.value === 'Me') {
            setDefault()
        }


    }
    const Allcities = province.filter((data: any) => data.parentId !== null);
    const cities = Allcities.filter((data: any) => data.parentId === ostanId)
    const ostan = province.filter((data: any) => data.parentId === null);
    const ProvincerenderList = () => {
        return (ostan.map((data: any) => ({ label: data.name, value: data.id })))
    }
    const CitiesrenderList = () => {
        return (cities.map((data: any) => ({ label: data.name, value: data.id })))
    }

    const setDefault = () => {
        if (orderDetailId) {

            const { product } = orderDetailId
            SetProduct(product)
            SetOrderDetail(orderDetailId)
            setquantity(orderDetailId.quantity)
        }

        if (customer) {

            SetName(`${customer.firstName} ${customer.lastName}`)
            SetnationalCode(customer.nationalCode)
            SetMobile(customer.userName)

        }

    }


    

    const handelSubmit = async () => {
        setLoading(true)

        let body;
        if (AddressMethod === 'AllOrder') {

            body = {
                "orderDetailId": orderDetail.id,
                "model": {
                    "bazargah": {
                        "measureUnitId": product.measureUnitId,
                        "quantity": orderDetail.quantity,
                        "idKharId": idKharId === 0 ? null : Number(idKharId),
                        "allocationId": allocationId === 0 ? null : Number(allocationId),
                        "receiverUniqueId": receiverUniqueId,
                        "traceCode": traceCode,
                        "heavyWeightTruck": heavyWeightTruck,
                        "receiverId": nationalCode,
                        "provinceName": provinceName,
                        "fullAddress": fullAddress,
                        "postalCode": postalCode,
                        "receiverTel": receiverTel,
                        "receiverMobile": mobile,
                        "receiverName": name
                    }
                }
            }

            try {

                const { data, status } = await SplitSetAddressOrderDetail(body)
                if (status === 200) {



                    toast.success('آدرس با موفقیت ثبت شد', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined
                    });
                    closeModal();
                    UpdateParent()

                }

            } catch (error) {
                console.log(error);

            }


            setLoading(false)
        }
        else {
            body = {
                "orderDetailId": orderDetail.id,
                "model": {
                    "bazargah": {
                        "measureUnitId": product.measureUnitId,
                        "quantity": quantity,
                        "idKharId": idKharId === 0 ? null : Number(idKharId),
                        "allocationId": allocationId === 0 ? null : Number(allocationId),
                        "receiverUniqueId": receiverUniqueId,
                        "traceCode": traceCode,
                        "heavyWeightTruck": heavyWeightTruck,
                        "receiverId": nationalCode,
                        "provinceName": provinceName,
                        "fullAddress": fullAddress,
                        "postalCode": postalCode,
                        "receiverTel": receiverTel,
                        "receiverMobile": mobile,
                        "receiverName": name
                    }
                }
            }

            try {

                const { data, status } = await SplitSetAddressOrderDetail(body)
                if (status === 200) {



                    toast.success('آدرس با موفقیت ثبت شد', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined
                    });
                    closeModal();
                   UpdateParent()

                }

            } catch (error) {
                console.log(error);

            }

            setLoading(false)

        }


  

    }




    const GetFinotechReport = async () => {

        setLoading(true)
        try {

            const { data, status } = await GetAddressWithPostalCode(postalCode)

            if (status === 200) {

                setFulAddress(data.result.address.fullAddress)
                setProvinceId(data.result.address.provinceId)
                setostanId(province.filter((i: any) => i.id === data.result.address.provinceId).map((i: any) => i.parentId)[0])
                setProvinceName(province.filter((i: any) => i.id === data.result.address.provinceId).map((i: any) => i.name)[0])
                SetIfStelam(true)
                setLoading(false)

            }

            

        } catch (error) {

            console.log(error);

            SetIfStelam(false)
        }

        setLoading(false)



    }



    return (
        <Modal
            isOpen={isOpenAddress}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Selected Option"
            ariaHideApp={false}


        >


            <div className='widget box shadow' style={{ width: '65rem'  }}>

                <Formik
                    initialValues={{
                        idKharId: Number(idKharId),
                        quantity: Number(quantity),
                        allocationId: Number(allocationId),
                        receiverUniqueId,
                        traceCode,
                        heavyWeightTruck,
                        provinceName,
                        fullAddress,
                        postalCode,
                        receiverTel,
                        mobile,
                        name, nationalCode


                    }}
                    enableReinitialize={true}
                    onSubmit={values => {
                        // same shape as initial values
                        handelSubmit()
                    }}>
                    {({ errors, touched, validateField, validateForm, setFieldValue, handleChange, values }) => (



                        <Form className="container-fluid" >
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
                                        x1="6" y1="6" x2="18" y2="18"></line></svg></div>


                            <div className="col-12 ">


                                <div className="col-12 row mt-2">
                                    <div className="col-4">


                                        <label className="">نام کالا : </label>
                                        <span className="text-primary ml-3">{product ? product.name : ''}</span>
                                    </div>
                                    <div className="col-4">



                                    </div>
                                    <div className="col-4">


                                        <label className="">واحد  : </label>
                                        <span className="text-primary ml-3"> {MeasureUnitSample.filter((i: any) => i.id === orderDetailId.measureUnitId).map((i: any) => i.name)}</span>
                                    </div>
                                </div>
                                <div className="col-12 row mt-3">

                                    <label  >مقدار :</label>
                                    <div className="col-3">
                                        <RadioButton
                                            changed={RadioChanger}
                                            id='1'
                                            isSelected={AddressMethod === 'AllOrder'}
                                            label=' مقدار کل سفارش'
                                            value='AllOrder'
                                        />
                                    </div>
                                    <div className="col-3">
                                        <RadioButton
                                            changed={RadioChanger}
                                            id='2'
                                            isSelected={AddressMethod === 'SomeQuantity'}
                                            label='  بخشی از سفارش'
                                            value='SomeQuantity'
                                        />
                                    </div>




                                    <div className="col-2 ">
                                        {AddressMethod === 'SomeQuantity' ?
                                            <p className="quantity-field" >

                                                <button disabled={quantity >= orderDetail.quantity ? true : false} type="button" className="value-button increase-button" onClick={(e: any) => setquantity(Number(quantity) + 1000)}>+
                                                </button>
                                                <input className="number" min={0} max={orderDetail.quantity} placeholder="وزن سفارش" step={100}
                                                    type="text" value={quantity} onChange={(e: any) => setquantity(Number(e.target.value))} />
                                                <button disabled={quantity <= 0 ? true : false} type="button" className="value-button decrease-button " onClick={(e: any) => quantity >= 1000 ? setquantity(Number(quantity) - 1000) : ""}>--
                                                </button>
                                            </p> : ''
                                        }
                                    </div>



                                </div>
                                <div className="col-12 row textOnInput mt-4">
                                    <div className="form-group col-md-6">
                                        <label>استان</label>

                                        {ostanId !== 0 ? <Select
                                            value={ProvincerenderList().filter((i: any) => i.value === ostanId).map((i: any) => i)}
                                            menuShouldScrollIntoView={false}
                                            placeholder='استان'
                                            isDisabled={ifEstelam}
                                            options={ProvincerenderList()}
                                            onChange={(e: any) => {
                                                setostanId(e.value)

                                            }}
                                        /> :
                                            <Select
                                                menuShouldScrollIntoView={false}
                                                placeholder='استان'

                                                options={ProvincerenderList()}
                                                onChange={(e: any) => {
                                                    setostanId(e.value)

                                                }}
                                            />}
                                        {ostanId === 0 ? <span className=" text-danger">استان خود را انتخاب کنید</span> : ''}
                                    </div>
                                    <div className="form-group col-md-6">

                                        <label >شهر</label>
                                        {provinceId !== 0 ? <Select
                                            value={CitiesrenderList().filter((i: any) => i.value === provinceId).map((i: any) => i)}
                                            menuShouldScrollIntoView={false}
                                            placeholder='شهر'
                                            isDisabled={ifEstelam}
                                            options={CitiesrenderList()}
                                            className='form-group'
                                            onChange={(e: any) => {
                                                setProvinceName(e.label)
                                                setProvinceId(e.value)
                                            }
                                            }
                                        /> : <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder='شهر'
                                            options={CitiesrenderList()}
                                            className='form-group'
                                            onChange={(e: any) => {
                                                setProvinceName(e.label)
                                                setProvinceId(e.value)
                                            }
                                            }
                                        />}
                                        {provinceName === null ? <span className=" text-danger">شهر خود را انتخاب کنید</span> : ''}

                                    </div>


                                </div>

                                <div className="col-12 row ">


                                    <div className="col-5 form-group textOnInput">
                                        <label>کدپستی</label>
                                        <Field validate={validatmin10} name="postalCode" className="form-control" maxLength='10' minLength='10' type='number' value={postalCode} onChange={(e: any) => setpostalCode(e.target.value)} />
                                        {errors.postalCode && touched.postalCode && <div className="text-danger">{errors.postalCode}</div>}
                                    </div>
                                    <div className="col-2  textOnInput">
                                        <button onClick={GetFinotechReport} disabled={loading} hidden={postalCode.length > 9 ? false : true} className="btn-sm btn-info text-nowrap  p-1"> استعلام کد پستی<ClipLoader

                                            loading={loading}
                                            color="#ffff"
                                            size={15}
                                        /></button>
                                    </div>
                                    <div className="col-5 form-group textOnInput">
                                        <label>تلفن</label>
                                        <Field validate={validatNumber} type='text' name="receiverTel" className="form-control" value={receiverTel} onChange={(e: any) => setreceiverTel(e.target.value)} />
                                        {errors.receiverTel && touched.receiverTel && <div className="text-danger">{errors.receiverTel}</div>}
                                    </div>

                                </div>


                                <div className="col-12 row  t">

                                    <div className="col-12 form-group textOnInput">
                                        <label>آدرس</label>
                                        <Field validate={validatAlpha} name="fullAddress" type='text' className="form-control" value={fullAddress} onChange={(e: any) => setFulAddress(e.target.value)} />
                                        {errors.fullAddress && touched.fullAddress && <div className="text-danger">{errors.fullAddress}</div>}
                                    </div>
                                </div>


                                <div className="col-12 row mt-2">

                                    <label className="col-4" >تحویل گیرنده :</label>
                                    <div className="col-4">
                                        <RadioButton
                                            changed={RadioChangerReciver}
                                            id='1'
                                            isSelected={ReciverMethod === 'Me'}
                                            label='خودم هستم'
                                            value='Me'
                                        />
                                    </div>
                                    <div className="col-4">
                                        <RadioButton
                                            changed={RadioChangerReciver}
                                            id='2'
                                            isSelected={ReciverMethod === 'Other'}
                                            label='شخصی دیگر'
                                            value='Other'
                                        />
                                    </div>
                                </div>
                                <div className="col-12 row mt-2  " >

                                    <div className="col-4 form-group textOnInput">
                                        <label>نام</label>
                                        <Field validate={validatAlpha} name="name" type="text" className="form-control" value={name} onChange={(e: any) => SetName(e.target.value)} />
                                        {errors.name && touched.name && <div className="text-danger">{errors.name}</div>}
                                    </div><div className="col-4 form-group textOnInput">
                                        <label> کد ملی/شناسه ملی</label>
                                        <Field validate={validatmin10} name="nationalCode" type="text" className="form-control" value={nationalCode} onChange={(e: any) => SetnationalCode(e.target.value)} />
                                        {errors.nationalCode && touched.nationalCode && <div className="text-danger">{errors.nationalCode}</div>}
                                    </div><div className="col-4 form-group textOnInput">
                                        <label>موبایل </label>
                                        <Field validate={validatMobail} name="receiverMobile" type="text" className="form-control" value={mobile} onChange={(e: any) => SetMobile(e.target.value)} />
                                        {errors.mobile && touched.mobile && <div className="text-danger">{errors.mobile}</div>}
                                    </div>


                                </div>

                                <div className="col-12 row mt-2">

                                    <div className="col-4 form-group textOnInput">
                                        <label>شناسه خرید</label>
                                        <input type='number' placeholder="فقط سفارشات بازارگاه " className="form-control RedOpacityForInput" value={idKharId} onChange={(e: any) => SetidKharId(e.target.value)} />
                                    </div><div className="col-4 form-group textOnInput">
                                        <label>شناسه تخصیص</label>
                                        <input className="form-control RedOpacityForInput" placeholder="فقط سفارشات بازارگاه " type='number' value={allocationId} onChange={(e: any) => setAllocationId(e.target.value)} />
                                    </div><div className="col-4 form-group textOnInput">
                                        <label>شناسه یکتا </label>
                                        <input className="form-control" value={receiverUniqueId} onChange={(e: any) => SetReceiverUniqueId(e.target.value)} />
                                    </div>


                                </div>

                                <div className="col-12 row mt-2">
                                    <div className="col-6 textOnInput">

                                        <label>کد رهگیری</label>
                                        <Field validate={validatNumber} name="traceCode" type="text" className="form-control" value={traceCode} onChange={(e: any) => SetTraceCode(e.target.value)} />
                                        {errors.traceCode && touched.traceCode && <div className="text-danger">{errors.traceCode}</div>}
                                    </div>
                                    <div className="col-5 mb-4 ml-4">

                                        <input type="checkbox" checked={heavyWeightTruck} onChange={(e: any) => {
                                            SetheavyWeightTruck(e.target.checked)
                                        }} />
                                        <label className="ml-1 text-danger"> امکان حمل با تریلی </label>

                                    </div>
                                </div>



                                <div className="d-flex justify-content-center mt-3">
                                    <button type="button" onClick={handelSubmit} className="btn btn-success" > ثبت<ClipLoader

                                        loading={loading}
                                        color="#ffff"
                                        size={15}
                                    /></button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>


            </div >

        </Modal>
    )
}
export default AddAdressCustomerForOrder