import { getExtraData } from "../../../services/extraService";
import Modal from 'react-modal';
import { useEffect, useState } from "react";
import { ExportToExcel } from "../Common/ExportToExcel";
import { GetShippingReports, SetShippingReport } from '../../../services/ShippingService';
import { MeasureUnitSample } from '../../Enums/MeasureUnitSample';
import { LoadingBar } from "react-redux-loading-bar";
import FadeLoader from 'react-spinners/FadeLoader';
import { validatAlpha, validatmin10, validatMobail, validatNumber } from "../../../Utils/validitionParams";
import { Field, Form, Formik } from "formik";
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { ClipLoader } from 'react-spinners';
import QueryString from "qs";
import Select from "react-select";
import { ShippingCompanySource } from "../../Enums/ShippingCompanySourceId";
import { TbNotes, TbNotesOff } from "react-icons/tb";
import { formatter } from "../../../Utils/Formatter";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { toast } from "react-toastify";

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
        maxHeight: '80vh'

    }

}

interface Props {
    id: number,
    modalIsOpen: any,
    closeModal: any
}
const ExtraShippingAdmin: React.FC<Props> = ({ id, modalIsOpen, closeModal }) => {
    const [extra, setExtra] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [check, setChek] = useState(false);
    const [voided, setvoided] = useState(false);
    const [createDate, SetCreateDate] = useState<any>();
    const [quantity, SetQuantity] = useState(0)
    const [shippingNumber, setshippingNumber] = useState('')
    const [shippingSerial, setshippingSerial] = useState('')
    const [delivererName, setdelivererName] = useState('')
    const [delivererNumber, setdelivererNumber] = useState('')
    const [delivererPlaque, setdelivererPlaque] = useState('')
    let [loadingForsubmit, setLoadingForSubmit] = useState(false);
    const [shippingCost, SetshippingCost] = useState(0)
    const [shippingCompanySourceId, SetshippingCompanySourceId] = useState<any>(null)
    const [newQuantity, SetNewQuantity] = useState<any>('')
    const [inEditMode, setInEditMode] = useState({

        status: false,

        rowKey: null,


    });
    const onEdit = (Id: any) => {


        setInEditMode({

            status: true,

            rowKey: Id,




        })



    }


    const getExter = async () => {

        try {
            if (id === null) {
                setExtra(null)
            }
            setLoading(true)

            let configs = {

                headers: { 'Content-Type': 'application/json' },
                params: {
                    ShippingIds: [id],
                    IsAdmin: true,
                    PageNumber:0,
                    PageSize:1000000
                }
                ,
                paramsSerializer: (params: any) => {

                    return QueryString.stringify(params)
                }
            };

            const { data, status } = await GetShippingReports(configs)
            if (status === 200) {

                setLoading(false)
                if (data.result.shippingReports.values) {
                    setExtra(data.result.shippingReports.values)
                }
                else {
                    setExtra(null)
                }


            }
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id !== null && id > 0) {
            getExter()
        }
    }, [id])

    const handelCreateDate = (value: any) => {

        //تغییرات روی تاریخ رو اینجا اعمال کنید

        if (value === null) {
            SetCreateDate('')
        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            SetCreateDate(new Date(value.toDate().setHours(3, 30, 0, 0)).toJSON())
        }

    }

    const editReport = async (item: any) => {


        const body = {

            "report": {
                id: item.id,
                shippingId: item.shippingId,
                createDate: item.createDate,
                quantity: Number(newQuantity),
                measureUnitId: 5,
                shippingNumber: item.shippingNumber,
                shippingSerial: item.shippingSerial,
                delivererName: item.delivererName,
                delivererNumber: item.delivererNumber,
                delivererPlaque: item.delivererPlaque,
                extId: item.extId,
                voided: item.voided,
                shippingCompanySourceId: item.shippingCompanySourceId
            }
        }

        try {
            const { data, status } = await SetShippingReport(body)

            if (status === 200) {

                setInEditMode({ status: false, rowKey: null })
                toast.success('تغییرات ثبت شد', {
                    position: "top-right",
                    closeOnClick: true,
                })
                handelDeleteState()
                getExter()

            }
        } catch (error) {


        }


    }

    const handelSubmit = async () => {
        setLoading(true)
        const body = {

            "report": {
                id: 0,
                shippingId: id,
                createDate,
                quantity: Number(quantity),
                measureUnitId: 5,
                shippingNumber,
                shippingSerial,
                delivererName,
                delivererNumber,
                delivererPlaque,
                extId: null,
                voided, shippingCompanySourceId,
                shippingCost
            }
        }

        try {
            const { data, status } = await SetShippingReport(body)

            if (status === 200) {
                toast.success('بارنامه ثبت شد', {
                    position: "top-right",
                    closeOnClick: true,
                })
                setLoading(false)
                setChek(false)
                handelDeleteState()
                getExter()

            }
        } catch (error) {
            setLoading(false)

        }


    }

    const handelDeleteState = () => {
        SetCreateDate('')
        setdelivererName('')
        SetQuantity(0)
        setdelivererNumber('')
        setdelivererPlaque('')
        setshippingNumber('')
        setshippingSerial('')
    }
    const ChangeVoided = async (item: any) => {

        const body = { "report": { ...item, voided: true } }

        try {
            setLoading(true)
            const { data, status } = await SetShippingReport(body)
            if (status === 200) {
                setLoading(true)
                getExter()
            }


        } catch (error) {
            console.log(error);

        }
    }
    const ChangeToUnVoided = async (item: any) => {

        const body = { "report": { ...item, voided: false } }

        try {
            setLoading(true)
            const { data, status } = await SetShippingReport(body)
            if (status === 200) {
                setLoading(true)
                getExter()
            }


        } catch (error) {
            console.log(error);

        }
    }

    const SourceIds = () => {
        let all = ShippingCompanySource.map((data: any) => ({ label: data.name, value: data.id }))
        return ([{ label: "همه", value: null }, ...all])
    }

    if (!loading) {
        if (extra && extra !== null) {
            const dataForExcel = extra.map((item: any) => ({

                "#": item.id,
                "شناسه حواله": item.shippingId,
                "تاریخ بارنامه": (new Date(item.createDate).toLocaleDateString('fa-IR')),
                "واحد": (MeasureUnitSample.filter((q: any) => q.id === item.measureUnitId).map((x: any) => x.name)[0]),
                "وزن": item.quantity,
                "شماره بارنامه": item.shippingNumber,
                "سریال بارنامه": item.shippingSerial,
                'هزینه باربری':item.shippingCost,
                "نام راننده": item.delivererName,
                "شماره راننده": item.delivererNumber,
                'پلاک': item.delivererPlaque,
                "سامانه باربری": (item.shippingCompanySourceId ? ShippingCompanySource.filter((i: any) => i.id === item.shippingCompanySourceId).map((i: any) => i.name)[0] : 'همه')

            }))
            return (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Selected Option"
                    ariaHideApp={false}

                >


                    <div className=" rounded  " style={{ border: " 1px solid #bfc9d4" }} >

                        <div className=" p-2 containerT " >
                            <div className="col-lg-4 col-md-6 col-sm-12 ">


                                <label className="text-sm col-sm-11 text-black ">

                                    <input type="checkbox" checked={check} className="form-check-input col-sm-1" onChange={e => setChek(e.target.checked)} />
                                    ثبت بارنامه دستی
                                </label>
                            </div>
                            <table
                                className="table responsive table-bordered    mt-2  mb-4"  >
                                <thead >
                                    <tr style={{ fontSize: '10px' }}>
                                        <th style={{ fontSize: '10px' }} className="text-center">ردیف</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">#</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">شناسه حواله</th>
                                        <th style={{ fontSize: '10px' }} className="text-center"> تاریخ بارنامه</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">واحد</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">وزن</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">شماره بارنامه</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">سریال بارنامه</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">هزینه ارسال</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">نام راننده</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">شماره راننده</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">پلاک </th>
                                        <th style={{ fontSize: '10px' }} className="text-center">سامانه باربری </th>
                                        <th style={{ fontSize: '10px' }} className="text-center">عملیات </th>

                                    </tr>
                                </thead>
                                <tbody >
                                    {extra.map((item: any, index: number) => (
                                        <tr className={item.voided === true ? 'text-center bg-danger' : 'text-center '} key={item.id}>

                                            <td aria-label="ردیف">{index + 1}</td>
                                            <td aria-label="#">{item.id}</td>
                                            <td aria-label="شناسه حواله">{item.shippingId}</td>
                                            <td aria-label="تاریخ بارنامه">{new Date(item.createDate).toLocaleDateString('fa-IR')}</td>
                                            <td aria-label="واحد">{MeasureUnitSample.filter((q: any) => q.id === item.measureUnitId).map((x: any) => x.name)}</td>
                                            <td aria-label="وزن"
                                                onClick={() => {
                                                    onEdit(item.id)
                                                    SetNewQuantity(item.quantity)

                                                }}>{
                                                    inEditMode.status && inEditMode.rowKey === item.id ? (
                                                        <input type='text' className="mt-2" style={{ maxWidth: '5rem' }} value={formatter.format(newQuantity)} onChange={(e: any) => SetNewQuantity(Number(e.target.value.replaceAll(",", "")))} />
                                                    ) :

                                                        (formatter.format(item.quantity))
                                                }</td>
                                            <td aria-label="شماره بارنامه">{item.shippingNumber}</td>
                                            <td aria-label="سریال بارنامه">{item.shippingSerial}</td>
                                            <td>{formatter.format(item.shippingCost)}</td>
                                            <td aria-label="نام راننده">{item.delivererName}</td>
                                            <td aria-label="شماره راننده">{item.delivererNumber}</td>
                                            <td aria-label="پلاک">{item.delivererPlaque}</td>
                                            <td aria-label="سامانه باربری">{item.shippingCompanySourceId ? ShippingCompanySource.filter((i: any) => i.id === item.shippingCompanySourceId).map((i: any) => i.name)[0] : 'همه'}</td>
                                            <td aria-label="عملیات">{inEditMode.status === false ? <div><button hidden={item.voided === false || item.voided === null ? false : true} disabled={loading} className="bg-transparent border-0" title="باطل کردن " onClick={() => ChangeVoided(item)}><TbNotesOff size={'1.5rem'} style={{ color: '#d9534f' }} /><ClipLoader

                                                loading={loading}
                                                color="#ffff"
                                                size={15}
                                            /></button>

                                                <button hidden={item.voided === true ? false : true} disabled={loading} title='بازگشت از ابطال' className="btn-sm btn-warning p-2" onClick={() => ChangeToUnVoided(item)}>یازگشت از ابطال<ClipLoader

                                                    loading={loading}
                                                    color="#ffff"
                                                    size={15}
                                                /></button>


                                            </div> : <div className='d-flex justify-content-center'>

                                                <button className='bg-transparent border-0 m-1' title='ذخیره تغییرات' onClick={() => editReport(item)}><AiOutlineCheckCircle size={'1.30rem'} style={{ color: 'green' }} /></button>
                                                <button className='bg-transparent border-0 m-1' title='انصراف' onClick={() => setInEditMode({ status: false, rowKey: null })} ><AiOutlineCloseCircle size={'1.30rem'} style={{ color: 'red' }} /></button>


                                            </div>}</td>




                                        </tr>

                                    ))}

                                </tbody>
                            </table>



                        </div>

                    </div>
                    {
                        check ? <div className="mt-4"><Formik initialValues={{
                            id: 0,
                            shippingId: id,
                            createDate,
                            quantity,
                            measureUnitId: 5,
                            shippingNumber, shippingSerial, delivererName, delivererNumber,
                            delivererPlaque, extId: null,

                        }}
                            enableReinitialize={true}
                            onSubmit={values => {
                                // same shape as initial values

                            }}>
                            {({ errors, touched, validateField, validateForm, setFieldValue, handleChange, values }) => (


                                <Form >


                                    <div className="n-chk d-flex mb-4">

                                        <div>

                                        </div>
                                    </div>

                                    <div className='form-row mt-2'>

                                        <div className="form-group  textOnInput col-md-3 col-sm-12 col-12">

                                            <label >مفدار</label>
                                            <Field validate={validatNumber} name="quantity" type="number" className="form-control" id="inputZip" value={quantity}
                                                onChange={(e: any) => {
                                                    SetQuantity(e.target.value)

                                                }} />
                                            {errors.quantity && touched.quantity && <div className="text-danger">{errors.quantity}</div>}

                                        </div>
                                        <div className="form-group  textOnInput col-md-3 col-sm-12 col-12">
                                            <div className="  " style={{ position: 'relative' }}>
                                                <label style={{ position: 'absolute', zIndex: '1', top: '-15px', right: '10px', background: 'white', padding: '0 8px' }}>تاریخ بارنامه</label>
                                                <div className='form-group '>
                                                    <DatePicker

                                                        calendar={persian}

                                                        locale={persian_fa}
                                                        style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                                        value={createDate}
                                                        onChange={handelCreateDate}
                                                    />

                                                </div>

                                            </div>

                                        </div><div className="form-group  textOnInput col-md-3 col-sm-12 col-12">

                                            <label >شماره بارنامه</label>
                                            <Field validate={validatAlpha} name="shippingNumber" type="text" className="form-control" id="inputZip" value={shippingNumber}
                                                onChange={(e: any) => {
                                                    setshippingNumber(e.target.value)

                                                }} />
                                            {errors.shippingNumber && touched.shippingNumber && <div className="text-danger">{errors.shippingNumber}</div>}

                                        </div>
                                        <div className="form-group  textOnInput col-md-3 col-sm-12 col-12">

                                            <label >سریال بارنامه</label>
                                            <Field validate={validatAlpha} name="shippingSerial" type="text" className="form-control" id="inputZip" value={shippingSerial}
                                                onChange={(e: any) => {
                                                    setshippingSerial(e.target.value)

                                                }} />
                                            {errors.shippingSerial && touched.shippingSerial && <div className="text-danger">{errors.shippingSerial}</div>}

                                        </div>

                                    </div>
                                    <div className='form-row'>
                                        <div className="form-group  textOnInput col-md-3 col-sm-12 col-12">

                                            <label >نام راننده</label>
                                            <Field validate={validatAlpha} name="shippingSerial" type="text" className="form-control" id="inputZip" value={delivererName}
                                                onChange={(e: any) => {
                                                    setdelivererName(e.target.value)

                                                }} />
                                            {errors.delivererName && touched.delivererName && <div className="text-danger">{errors.delivererName}</div>}

                                        </div>

                                        <div className="form-group  textOnInput col-md-3 col-sm-12 col-12">

                                            <label >شماره راننده</label>
                                            <Field validate={validatMobail} name="shippingSerial" type="text" className="form-control" id="inputZip" value={delivererNumber}
                                                onChange={(e: any) => {
                                                    setdelivererNumber(e.target.value)

                                                }} />
                                            {errors.delivererNumber && touched.delivererNumber && <div className="text-danger">{errors.delivererNumber}</div>}

                                        </div>
                                        <div className="form-group  textOnInput col-md-2 col-sm-12 col-12">

                                            <label >هزینه ارسال</label>
                                            <input type="number" className="form-control" value={shippingCost}
                                                onChange={(e: any) => {
                                                    SetshippingCost(e.target.value)

                                                }} />

                                        </div>
                                        <div className="form-group  textOnInput col-md-2 col-sm-12 col-12">

                                            <label >شماره پلاک</label>
                                            <Field validate={validatAlpha} name="shippingSerial" type="text" className="form-control" id="inputZip" value={delivererPlaque}
                                                onChange={(e: any) => {
                                                    setdelivererPlaque(e.target.value)

                                                }} />
                                            {errors.delivererPlaque && touched.delivererPlaque && <div className="text-danger">{errors.delivererPlaque}</div>}

                                        </div>
                                        <div className="form-group  textOnInput col-md-2 col-sm-12 col-12">
                                            <label>سامانه های باربری</label>

                                            <Select
                                                value={SourceIds().filter((i: any) => i.value === shippingCompanySourceId).map((i: any) => i)}
                                                menuShouldScrollIntoView={false}
                                                placeholder='سامانه های باربری'
                                                options={SourceIds()}
                                                // value={wareCombo()}
                                                onChange={(e: any) => {
                                                    SetshippingCompanySourceId(e.value)

                                                }}
                                            />

                                        </div>

                                    </div>


                                    <div className='row justify-content-center mt-3 '>

                                        <div className='col-2 col-sm-12 col-12'>
                                            <button type="button" className="btn btn-success" onClick={handelSubmit} >تایید<ClipLoader

                                                loading={loading}
                                                color="#ffff"
                                                size={15}
                                            /></button>
                                        </div>


                                    </div>
                                </Form>

                            )}



                        </Formik></div> : ''
                    }
                    <div className="d-flex justify-content-end m-2">
                        {/* <ExportToExcel apiData={dataForExcel} fileName='لیست گزارش' /> */}
                    </div>
                </Modal >
            )
        } else {

            return (<Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Selected Option"
                ariaHideApp={false}

            >
                <div className=" statbox widget-content widget-content-area">




                    <div className=" rounded  " style={{ border: " 1px solid #bfc9d4" }} >

                        <div className=" p-2 containerT " >
                            <div className="col-lg-4 col-md-6 col-sm-11 ">


                                <label className="text-sm text-black ">

                                    <input type="checkbox" checked={check} className="form-check-input" onChange={e => setChek(e.target.checked)} />
                                    ثبت بارنامه دستی
                                </label>
                            </div>
                            <table
                                className="table responsive table-bordered table-hover table-striped fixed_header mt-2  mb-4"  >
                                <thead >
                                    <tr style={{ fontSize: '10px' }}>
                                        <th style={{ fontSize: '10px' }} className="text-center">ردیف</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">#</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">شناسه حواله</th>
                                        <th style={{ fontSize: '10px' }} className="text-center"> تاریخ بارنامه</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">واحد</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">وزن</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">شماره بارنامه</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">سریال بارنامه</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">هزینه ارسال</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">نام راننده</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">شماره راننده</th>
                                        <th style={{ fontSize: '10px' }} className="text-center">پلاک </th>

                                    </tr>
                                </thead>
                            </table>


                        </div>

                    </div>
                    {check ? <div className="mt-4"> <Formik initialValues={{
                        id: 0,
                        shippingId: id,
                        createDate,
                        quantity,
                        measureUnitId: 5,
                        shippingNumber, shippingSerial, delivererName, delivererNumber,
                        delivererPlaque, extId: null

                    }}
                        enableReinitialize={true}
                        onSubmit={values => {
                            // same shape as initial values
                            handelSubmit()
                        }}>
                        {({ errors, touched, validateField, validateForm, setFieldValue, handleChange, values }) => (


                            <Form >


                                <div className="n-chk d-flex  ">

                                    <div>

                                    </div>
                                </div>

                                <div className='form-row '>

                                    <div className="form-group  textOnInput col-md-3">

                                        <label >مفدار</label>
                                        <Field validate={validatNumber} name="quantity" type="number" className="form-control" id="inputZip" value={quantity}
                                            onChange={(e: any) => {
                                                SetQuantity(e.target.value)

                                            }} />
                                        {errors.quantity && touched.quantity && <div className="text-danger">{errors.quantity}</div>}

                                    </div>
                                    <div className="form-group  textOnInput col-md-3">
                                        <div className=" mb-4 " style={{ position: 'relative' }}>
                                            <label style={{ position: 'absolute', zIndex: '1', top: '-15px', right: '10px', background: 'white', padding: '0 8px' }}>تاریخ بارنامه</label>
                                            <div className='form-group '>
                                                <DatePicker

                                                    calendar={persian}

                                                    locale={persian_fa}
                                                    style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                                    value={createDate}
                                                    onChange={handelCreateDate}
                                                />

                                            </div>

                                        </div>

                                    </div><div className="form-group  textOnInput col-md-3">

                                        <label >شماره بارنامه</label>
                                        <Field validate={validatAlpha} name="shippingNumber" type="text" className="form-control" id="inputZip" value={shippingNumber}
                                            onChange={(e: any) => {
                                                setshippingNumber(e.target.value)

                                            }} />
                                        {errors.shippingNumber && touched.shippingNumber && <div className="text-danger">{errors.shippingNumber}</div>}

                                    </div>
                                    <div className="form-group  textOnInput col-md-3">

                                        <label >سریال بارنامه</label>
                                        <Field validate={validatAlpha} name="shippingSerial" type="text" className="form-control" id="inputZip" value={shippingSerial}
                                            onChange={(e: any) => {
                                                setshippingSerial(e.target.value)

                                            }} />
                                        {errors.shippingSerial && touched.shippingSerial && <div className="text-danger">{errors.shippingSerial}</div>}

                                    </div>

                                </div>
                                <div className='form-row'>
                                    <div className="form-group  textOnInput col-md-4">

                                        <label >نام راننده</label>
                                        <Field validate={validatAlpha} name="shippingSerial" type="text" className="form-control" id="inputZip" value={delivererName}
                                            onChange={(e: any) => {
                                                setdelivererName(e.target.value)

                                            }} />
                                        {errors.delivererName && touched.delivererName && <div className="text-danger">{errors.delivererName}</div>}

                                    </div>

                                    <div className="form-group  textOnInput col-md-4">

                                        <label >شماره راننده</label>
                                        <Field validate={validatMobail} name="shippingSerial" type="text" className="form-control" id="inputZip" value={delivererNumber}
                                            onChange={(e: any) => {
                                                setdelivererNumber(e.target.value)

                                            }} />
                                        {errors.delivererNumber && touched.delivererNumber && <div className="text-danger">{errors.delivererNumber}</div>}

                                    </div>
                                    <div className="form-group  textOnInput col-md-2">

                                        <label >هزینه ارسال</label>
                                        <input type="number" className="form-control" value={shippingCost}
                                            onChange={(e: any) => {
                                                SetshippingCost(e.target.value)

                                            }} />

                                    </div>
                                    <div className="form-group  textOnInput col-md-2">

                                        <label >شماره پلاک</label>
                                        <Field validate={validatAlpha} name="shippingSerial" type="text" className="form-control" id="inputZip" value={delivererPlaque}
                                            onChange={(e: any) => {
                                                setdelivererPlaque(e.target.value)

                                            }} />
                                        {errors.delivererPlaque && touched.delivererPlaque && <div className="text-danger">{errors.delivererPlaque}</div>}

                                    </div>
                                    <div className="form-group  textOnInput col-md-2">
                                        <label>سامانه های باربری</label>

                                        <Select
                                            value={SourceIds().filter((i: any) => i.value === shippingCompanySourceId).map((i: any) => i)}
                                            menuShouldScrollIntoView={false}
                                            placeholder='سامانه های باربری'
                                            options={SourceIds()}
                                            // value={wareCombo()}
                                            onChange={(e: any) => {
                                                SetshippingCompanySourceId(e.value)

                                            }}
                                        />

                                    </div>

                                </div>


                                <div className='row justify-content-center mt-3'>

                                    <div className='col-2 '>
                                        <button type="submit" className="btn btn-success" >تایید<ClipLoader

                                            loading={loading}
                                            color="#ffff"
                                            size={15}
                                        /></button>
                                    </div>


                                </div>
                            </Form>

                        )}



                    </Formik></div> : ''}
                </div>
            </Modal>)
        }
    }

    else {
        return (
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Selected Option"
                ariaHideApp={false}

            >
                <div className="loadingAddress" >
                    <div className="boxloadingAddress">
                        <p>دریافت اطلاعات ...</p>
                        <FadeLoader loading={loading} color={"#ccc"} />
                    </div>
                </div>
            </Modal>)
    }

}
export default ExtraShippingAdmin