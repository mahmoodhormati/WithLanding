
import React, { useState, useMemo, useEffect } from 'react'
import QueryString from 'qs';
import { GetInvoicesWithSearch } from '../../../services/invoiceService';
import { accessor } from 'react-widgets/esm/PropTypes';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import AdvancedSearch from '../../../Common/Shared/Common/AdvancedSearch';
import Modal from 'react-modal';
import Select from 'react-select';
import { DateObject } from 'react-multi-date-picker';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { EntityTypes } from '../../../Common/Enums/EntityTypesEnums';
import { PriceUnitEnums } from '../../../Common/Enums/PriceUnit';
import { PaymentStatusEnums } from '../../../Common/Enums/PaymentStatus';
import PaymentTable from '../../../Common/Shared/Form/PaymentTable';
import ModalGroupWork from '../../../Common/Shared/Common/ModalGroupWork';
import { InvoceTypes } from '../../../Common/Enums/InvoiceTypeIdEnums';
import { PaymentStructureEnums } from '../../../Common/Enums/PaymentStructureEnums';
import { ChangePaymentStatus, GetPayments } from '../../../services/paymentsService';

import { PaidEnum } from './../../../Common/Enums/PaidEnum';
import { ConfirmedEnum } from './../../../Common/Enums/ConfirmedEnum';
import { HasAttchmentEnum } from './../../../Common/Enums/HasAttchmentEnum';
import ImagePriviewerForPayment from '../../../Utils/ImagePriviewerForPayment';
import AdminImagePreviwerForPaymentList from '../../../Utils/AdminImagePreviwerForPaymentList';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import EditPayment from './EditPayment';
import { TbFileInvoice, TbNotes, TbNotesOff } from 'react-icons/tb';
import InvoiceShowForPayments from './InvoiceShowForPayments';
import { ExportToExcelProVersion } from '../../../Utils/ExportToExcelProVersion';





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

const PaymentsList: React.FC = () => {
    const location = useLocation()

    const [PageNumber, setPageNumber] = useState(getPage().PageNumber ? getPage().PageNumber : 0)
    const [PageSize, setPageSize] = useState(getPage().PageSize ? getPage().PageSize : 10)
    const [totalCount, setTotalCount] = useState(0);
    const [selectedRows, setSelectedRows] = useState([])
    const [getData, setGeData] = useState(false)
    const [modalIsOpen, setIsOpen] = useState(false);
    const [stateSuccess, SetStateSuccess] = useState(0)
    const [open, SetOpen] = useState(false);
    const [Ids, setIds] = useState<any>(location.state && JSON.parse(String(sessionStorage.getItem('undeciededPayments'))) ? JSON.parse(String(sessionStorage.getItem('undeciededPayments'))).Ids : [])
    const [stateError, SetStateError] = useState(0)
    const [payments, SetPayments] = useState([])
    const [InvoiceId, setInvoiceId] = useState<any>(getDefault().InvoiceId)
    const [EntityTypeId, SetEntityTypeId] = useState(getDefault().EntityTypeId)
    const [EntityId, SetEntityId] = useState<any>(getDefault().EntityId?getDefault().EntityId:'')
    const [PriceUnitId, SetPriceUnitId] = useState(getDefault().PriceUnitId)
    const [MinPrice, SetMinPrice] = useState(getDefault().MinPrice)
    const [MaxPrice, SetMaxPrice] = useState(getDefault().MaxPrice)
    const [PaymentStatusId, SetPaymentStatusId] = useState(getDefault().PaymentStatusId)
    const [PaymentMethodId, SetPaymentMethodId] = useState(getDefault().PaymentMethodId)
    const [MinCreateDate, SetMinCreateDate] = useState(getDefault().MinCreateDate)
    const [MaxCreateDate, SetMaxCreateDate] = useState(getDefault().MaxCreateDate)
    const [MinPaymentDueDate, SetMinPaymentDueDate] = useState(getDefault().MinPaymentDueDate)
    const [MaxPaymentDueDate, SetMaxPaymentDueDate] = useState(getDefault().MaxPaymentDueDate)
    const [TrackingCode, SetTrackingCode] = useState(getDefault().TrackingCode)
    const [CustomerName, SetCustomerName] = useState(getDefault().CustomerName)
    const [HasAttachment, setHasAttachment] = useState(getDefault().HasAttachment)
    const [Paid, setPaid] = useState(getDefault().Paid)
    const [Confirmed, setConfirmed] = useState(getDefault().Confirmed)
    const [OrganizationName, SetOrganizationName] = useState(getDefault().OrganizationName)
    const [OrganizationNationalId, SetOrganizationNationalId] = useState(getDefault().OrganizationNationalId)
    const [IsOpenEdit, setIsOpenEdit] = useState(false)
    const [IsOpenInvoiceView, setIsOpenInvoiceView] = useState(false)
    const [Payment, setEditPayment] = useState()
    const [EditmodalPay, setEditmodalPay] = useState(false)
    const [Id, setId] = useState(0)
    const [paymentId, setpaymentId] = useState(0)
    const companies = useSelector((state: RootState) => state.companies)


    const param = { PageSize, PageNumber }

    function getPage() {
        let items = JSON.parse(String(sessionStorage.getItem(`param${window.location.pathname}`)));
        return items ? items : ''


    }
    const params = { InvoiceId, Ids, EntityTypeId, EntityId, PaymentMethodId, PaymentStatusId, PriceUnitId, MinPrice, MaxPrice, MinCreateDate, MaxCreateDate, MinPaymentDueDate, MaxPaymentDueDate, TrackingCode, HasAttachment, Paid, Confirmed }
    function getDefault() {
        let items = JSON.parse(String(sessionStorage.getItem(`params${window.location.pathname}`)));
        return items ? items : ''

    }
    const close = () => {
        SetOpen(false);
    }
    let arrayOfSelectedData = [];
    const getSelectedData = (data: any) => {

        arrayOfSelectedData = data.map((item: any) => item.original);


        return (arrayOfSelectedData)

    }
    const getBulkJob = (selected: any) => {
        if (selected === 2) {
            enableSelectedItem()
        }
        if (selected === 3) {
            copySelectedItem()
        }
        if (selected === 4) {
            DeleteSelectedItem()
        }
        if (selected === 5) {
            disableSelectedItem()
        }
    }
    const closeModal = () => {
        setIsOpen(false);
    }

    const editHandler = (item: any) => {
        setEditPayment(item)

        setEditmodalPay(true)

    }
    const closeEditHandler = () => {

        setEditmodalPay(false)

    }
    const openModalEdit = (id: number) => {

        
        setId(id)

        setIsOpenEdit(true);
    } 
    const openModalInvoiceView = (id: number) => {

        setpaymentId(id)

        setIsOpenInvoiceView(true);
    }
    const closeModalInvoiceView = (id: number) => {


        setIsOpenInvoiceView(false);
    }
    const closeModalEdit = () => {
        setIsOpenEdit(false);

    }


    const bgColor=(item:any)=>{
        if (item.values.paymentStatusId === 5) {


            return( '#ff00003b')
          }
         
          else if (item.original.confirmed === true && item.original.paid === true){
            return('#D8E4BC')
          }
         
    }
    const DeleteSelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < arrayOfData.length; i++) {

            // try {
            //     const { data, status } = await DeleteSupply(arrayOfData[i].id)
            //     if (data.result.success === true) {
            //         SetOpen(true)
            //         SetStateSuccess(successCount += 1)
            //     }
            //     if (data.result.success === false) {
            //         SetOpen(true)

            //         SetStateError(errorCount += 1)
            //     }


            // } catch (error) {
            //     SetOpen(true)

            //     SetStateError(errorCount += 1)
            // }


        }

    }
    const copySelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        const copyData = arrayOfData.map((item: any) => {
            return { ...item, id: 0, active: true, createDate: new Date() }
        })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            // try {
            //     let payload = {
            //         'supply': copyData[i]
            //     }
            //     const { data, status } = await SetSupply(payload)
            //     if (status === 200) {
            //         SetOpen(true)
            //         SetStateSuccess(successCount += 1)
            //     }


            // } catch (error) {
            //     SetOpen(true)

            //     SetStateError(errorCount += 1)
            // }


        }


    }
    const enableSelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        const copyData = arrayOfData.map((item: any) => {
            return { ...item, active: true }
        })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            // try {
            //     let payload = {
            //         'supply': copyData[i]
            //     }

            //     const { data, status } = await SetSupply(payload)
            //     if (status === 200) {
            //         SetOpen(true)
            //         SetStateSuccess(successCount += 1)
            //     }


            // } catch (error) {
            //     SetOpen(true)

            //     SetStateError(errorCount += 1)
            // }


        }


    }
    const disableSelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        const copyData = arrayOfData.map((item: any) => {
            return { ...item, active: false }
        })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            // try {

            //     let payload = {
            //         'supply': copyData[i]
            //     }

            //     const { data, status } = await SetSupply(payload)
            //     if (status === 200) {
            //         SetOpen(true)
            //         SetStateSuccess(successCount += 1)
            //     }


            // } catch (error) {
            //     SetOpen(true)

            //     SetStateError(errorCount += 1)
            // }


        }


    }
    const handelMinCreateDate = (value: any) => {
        if (value === null) {
            SetMinCreateDate('')
        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            SetMinCreateDate(new Date(value.toDate().setHours(3, 30, 0, 0)))



        }
    }
    const handelMaxCreateDate = (value: any) => {
        if (value === null) {
            SetMaxCreateDate('')
        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            SetMaxCreateDate(new Date(value.toDate().setHours(3, 30, 0, 0)))
        }
    }
    const handelMinPaymentDueDate = (value: any) => {
        if (value === null) {
            SetMinPaymentDueDate('')
        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            SetMinPaymentDueDate(new Date(value.toDate().setHours(3, 30, 0, 0)))



        }
    }
    const handelMaxPaymentDueDate = (value: any) => {
        if (value === null) {
            SetMaxPaymentDueDate('')
        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            SetMaxPaymentDueDate(new Date(value.toDate().setHours(3, 30, 0, 0)))
        }
    }
    const SetPaymnetChange = async (id: any, state: number) => {

        const body = {

            "paymentId": id,
            "paymentStatusId": state,
            "confirmed": null,
            "paid": null
        }

        try {

            const { data, status } = await ChangePaymentStatus(body)
            if (status === 200) {
                if(state===5){
                toast.success('پرداختی مربوطه با موفقیت باطل شد',
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined
                    })
                }
                else{
                    toast.success('پرداختی مربوطه به وضعیت در انتظار پرداخت بازگشت',
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined
                    })
                }

                getDataBySearch()
            }


        } catch (error) {
            console.log(error);

        }
    }

    const urlForExcel = () => {

        let parameter = {
            Ids,
            InvoiceIds:InvoiceId,
            EntityTypeId,
            EntityId,
            PriceUnitId,
            MinPrice,
            MaxPrice,
            PaymentStatusId,
            PaymentMethodId,
            MinCreateDate,
            MaxCreateDate,
            MinPaymentDueDate,
            MaxPaymentDueDate,
            CustomerName,
            OrganizationName,
            TrackingCode,
            HasAttachment,
            Paid,
            Confirmed,
            OrganizationNationalId,
            IsAdmin: true,
            PageNumber,
            PageSize:1000000


        }



        let url = QueryString.stringify(parameter)


        return (`?${url}`)



    }

    const getDataBySearch = async () => {
        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {
                Ids,
                InvoiceIds:InvoiceId,
                EntityTypeId,
                EntityId,
                PriceUnitId,
                MinPrice,
                MaxPrice,
                PaymentStatusId,
                PaymentMethodId,
                MinCreateDate,
                MaxCreateDate,
                MinPaymentDueDate,
                MaxPaymentDueDate,
                CustomerName,
                OrganizationName,
                TrackingCode,
                HasAttachment,
                Paid,
                Confirmed,
                OrganizationNationalId,
                IsAdmin: true,
                PageNumber:0,
                PageSize


            }
            ,
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }

        };

        try {
            const { data, status } = await GetPayments(config);
            if (status === 200) {
                SetPayments(data.result.payments.values)
                setTotalCount(data.result.payments.totalCount)

                sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));
                sessionStorage.setItem(`params${window.location.pathname}`, JSON.stringify(params));

            }

        } catch (err) {
            console.log(err)
        }
    }
    const getDataByPage = async () => {
        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {
                Ids,
                InvoiceIds:InvoiceId,
                EntityTypeId,
                EntityId,
                PriceUnitId,
                MinPrice,
                MaxPrice,
                PaymentStatusId,
                PaymentMethodId,
                MinCreateDate,
                MaxCreateDate,
                MinPaymentDueDate,
                MaxPaymentDueDate,
                CustomerName,
                OrganizationName,
                TrackingCode,
                HasAttachment,
                Paid,
                Confirmed,
                OrganizationNationalId,
                IsAdmin: true,
                PageNumber,
                PageSize


            }
            ,
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }

        };

        try {
            const { data, status } = await GetPayments(config);
            if (status === 200) {
                SetPayments(data.result.payments.values)
                setTotalCount(data.result.payments.totalCount)

                sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));
                sessionStorage.setItem(`params${window.location.pathname}`, JSON.stringify(params));

            }

        } catch (err) {
            console.log(err)
        }

    }
    const getPayments = async () => {


        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {
                Ids: [],
                InvoiceIds: [],
                EntityTypeId: null,
                EntityId: null,
                PriceUnitId: null,
                MinPrice: null,
                MaxPrice: null,
                PaymentStatusId: null,
                PaymentMethodId: null,
                MinCreateDate: null,
                MaxCreateDate: null,
                MinPaymentDueDate: null,
                MaxPaymentDueDate: null,
                CustomerName: null,
                OrganizationName: null,
                TrackingCode: null,
                HasAttachment: null,
                Paid: null,
                Confirmed: null,
                OrganizationNationalId: null,
                IsAdmin: true,
                PageNumber: 0,
                PageSize: 10

            }
            ,
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }

        };

        try {
            const { data, status } = await GetPayments(config);
            if (status === 200) {
                setGeData(false)
                SetPayments(data.result.payments.values)
                setTotalCount(data.result.payments.totalCount)

                sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));
                sessionStorage.setItem(`params${window.location.pathname}`, JSON.stringify(params));

            }
        } catch (err) {
            console.log(err)
        }

    }
    useEffect(() => {
        //getPayments()

    }, [getData])
    let formatterForMoney = new Intl.NumberFormat('fa-IR', {

        currency: 'IRR'


    });
    const CompaniesIDs = () => {
        let all = companies.map((data: any) => ({ label: data.name, value: data.id }))
        return ([{ label: "همه", value: null }, ...all])
    }
    const EntityTypesIDs = () => {
        let all = EntityTypes.filter((item: any) => item.id === 10 || item.id === 11).map((data: any) => ({ label: data.name, value: data.id }))
        return ([{ label: "همه", value: null }, ...all])

    }
    const PriceUnitIDS = () => {
        let all = PriceUnitEnums.map((data: any) => ({ label: data.name, value: data.id }))
        return ([{ label: "همه", value: null }, ...all])
    }
    const PaymentStatusIds = () => {
        let all = PaymentStatusEnums.map((data: any) => ({ label: data.name, value: data.id }))
        return ([{ label: "همه", value: null }, ...all])
    }
    const PaumentMrthodIds = () => {
        let all = PaymentStructureEnums.map((data: any) => ({ label: data.name, value: data.id }))
        return ([{ label: "همه", value: null }, ...all])
    }
    const Paids = () => {
        let all = PaidEnum.map((data: any) => ({ label: data.name, value: data.value }))
        return ([{ label: "همه", value: null }, ...all])
    }
    const Confirms = () => {
        let all = ConfirmedEnum.map((data: any) => ({ label: data.name, value: data.value }))
        return ([{ label: "همه", value: null }, ...all])

    }
    const HasAttach = () => {
        let all = HasAttchmentEnum.map((data: any) => ({ label: data.name, value: data.value }))
        return ([{ label: "همه", value: null }, ...all])

    }
    const columns = useMemo(() => [
        { Header: '#', accessor: 'id' },
        { Header: 'شناسه مشتری', accessor: 'customerId' },
        { Header: 'نام مشتری', accessor: 'customerName' },
        { Header: 'نام سازمان', accessor: 'organizationName' },
        { Header: 'نام شرکت', accessor: 'companyName' },
        { Header: 'کد پیگیری', accessor: 'trackingCode' },
        {
            Header: 'قیمت', accessor: 'price', Cell: (rows: any) => {

                return (formatterForMoney.format(rows.row.original.price))

            }
        },
        {
            Header: 'واحد', accessor: 'priceUnitId', Cell: (rows: any) => {

                return (PriceUnitEnums.filter((i: any) => i.id === rows.row.original.priceUnitId).map((i: any) => i.name))
            }
        },
        {
            Header: 'پرداخت', accessor: 'paymentStatusId', Cell: (rows: any) => {

                return (

                    <div  className='text-nowrap rounded btn-sm darktext
                    'style={{backgroundColor:`${PaymentStatusEnums.filter((i: any) => i.id === rows.row.original.paymentStatusId).map((i: any) => i.color)}`}}>
                        {PaymentStatusEnums.filter((i: any) => i.id === rows.row.original.paymentStatusId).map((i: any) => i.name)}
                    </div>
                )
            }
        },
        {
            Header: 'نوع پرداخت', accessor: 'paymentMethodId', Cell: (rows: any) => {


                return (PaymentStructureEnums.filter((i: any) => i.id === rows.row.original.paymentMethodId).map((i: any) => i.name))
            }
        },
        {
            Header: 'تاریخ ثبت ', accessor: 'createDate', Cell: (rows: any) => {

                return (new Date(rows.row.original.createDate).toLocaleDateString('fa-IR'))
            }
        },
        {
            Header: 'تاریخ سررسید ', accessor: 'paymentDueDate', Cell: (rows: any) => {



                if (rows.row.original.paymentDueDate !== null) {
                    return (new Date(rows.row.original.paymentDueDate).toLocaleDateString('fa-IR'))
                }
                else {
                    return ('')
                }
            }
        },


        { Header: 'توضیحات', accessor: 'comment' },
        {
            Header: '  پرداخت شده', accessor: '', Cell: (row: any) => {
                const [active, setActive] = useState(row.row.original.paid)
                const id = row.row.original.id

                const activeChang = {

                    "paymentId": id,
                    "paymentStatusId": null,
                    "confirmed": null,
                    "paid": !active

                }

                const activeHandler = async () => {
                    setActive(!active);
                    try {
                        const { data, status } = await ChangePaymentStatus(activeChang)
                        if (status === 200) {
                            toast.success('وضعیت پرداخت با موفقیت تغییر کرد',
                                {
                                    position: "top-right",
                                    autoClose: 5000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: false,
                                    draggable: true,
                                    progress: undefined

                                })

                            getDataBySearch()

                        }
                    } catch (err) {
                        console.log(err)
                    }


                }
                if (active === true) {
                    return (
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            className="feather feather-check  " onClick={activeHandler} style={{ color: 'green' }}>
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>)
                } else {
                    return (<svg xmlns="http://www.w3.org/2000/svg" data-dismiss="alert" width="21" height="21"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-x  danger " onClick={activeHandler} style={{ color: 'red' }}>
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>)
                }


            }
        }, {
            Header: '  تایید شده', accessor: '', Cell: (row: any) => {
                const [active, setActive] = useState(row.row.original.confirmed)
                const id = row.row.original.id

                const activeChang = {

                    "paymentId": id,
                    "paymentStatusId": null,
                    "confirmed": !active,
                    "paid": null

                }

                const activeHandler = async () => {
                    setActive(!active);



                    try {
                        const { data, status } = await ChangePaymentStatus(activeChang)
                        if (status === 200) {
                            toast.success('وضعیت تایید با موفقیت تغییر کرد',
                                {
                                    position: "top-right",
                                    autoClose: 5000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: false,
                                    draggable: true,
                                    progress: undefined
                                })

                            getDataBySearch()
                        }
                    } catch (err) {
                        console.log(err)
                    }


                }
                if (active === true) {
                    return (
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            className="feather feather-check  " onClick={activeHandler} style={{ color: 'green' }}>
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>)
                } else {
                    return (<svg xmlns="http://www.w3.org/2000/svg" data-dismiss="alert" width="21" height="21"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-x  danger " onClick={activeHandler} style={{ color: 'red' }}>
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>)
                }


            }
        },
        {
            Header: 'مشاهده صورتحساب', accessor: '', Cell: (row: any) => {

                
                    return (<div className=" btn-group">

                        <button className="border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip"
                            data-placement="top" data-title="صورتحساب"
                            onClick={()=> 
                                openModalInvoiceView(row.row.original.id)

                            }
                        >
                           <TbFileInvoice size={'1.5rem'}/>
                        </button>


                    </div>)
               

            }
        },
        {
            Header: 'مشاهده سند', accessor: '', Cell: (row: any) => {

                if (row.row.original.hasAttachment) {
                    return (<div className=" btn-group">

                        <button className="border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip"
                            data-placement="top" data-title="ویرایش"
                            onClick={function () {
                                openModalEdit(row.row.original.id)

                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width='25' height='25' viewBox="0 0 256 256"><rect
                                width="256" height="256" stroke="none" fill="none" /><line x1="201.1" y1="127.3" x2="224" y2="166.8"
                                    fill="none" stroke="currentColor" strokeLinecap="round"
                                    strokeLinejoin="round" strokeWidth="12" /><line
                                    x1="154.2" y1="149.3" x2="161.3" y2="189.6" fill="none" stroke="currentColor" strokeLinecap="round"
                                    strokeLinejoin="round" strokeWidth="12" /><line x1="101.7" y1="149.2" x2="94.6" y2="189.6"
                                        fill="none" stroke="currentColor" strokeLinecap="round"
                                        strokeLinejoin="round" strokeWidth="12" /><line
                                    x1="54.8" y1="127.3" x2="31.9" y2="167" fill="none" stroke="currentColor" strokeLinecap="round"
                                    strokeLinejoin="round" strokeWidth="12" /><path
                                    d="M32,104.9C48.8,125.7,79.6,152,128,152s79.2-26.3,96-47.1" fill="none" stroke="currentColor"
                                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" /></svg>
                        </button>


                    </div>)
                }
                else {
                    return (null)
                }


            }
        },

        {
            Header: 'عملیات', accessor: '  ', Cell: (rows: any) => {



                return (
                    <div className='text-nowrap'>
                        {(rows.row.original.paymentStatusId === 1  || rows.row.original.paymentStatusId === 2 || rows.row.original.paymentStatusId === 8||rows.row.original.paymentStatusId === 6) ? <button title='باطل کردن اسناد پرداختی' className='border-0 bg-transparent ' onClick={() => SetPaymnetChange(rows.row.original.id, 5)}><TbNotesOff size={'2rem'} style={{color:'#d9534f'}}/></button> : ''}
                        {rows.row.original.paymentStatusId === 5 ? <button title='برگشت از ابطال' className='btn btn-sm btn-warning m-1 p-1 text-nowrap' onClick={() => SetPaymnetChange(rows.row.original.id, 1)}> بازگشت از ابطال</button> : ''}
                        {(rows.row.original.paymentStatusId === 1 || rows.row.original.paymentStatusId === 7 ||rows.row.original.paymentStatusId === 6) ?

                            <button className="border-0 bg-transparent non-hover edit-btn m-1" data-toggle="tooltip" data-placement="top" title="ویرایش"
                                onClick={e => editHandler(rows.row.original)}   >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                    viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-edit-2">
                                    <path
                                        d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                </svg>
                            </button>

                            : ''}

                    </div>
                )



            }




        }], [payments])

    const data = useMemo(() => payments, [payments])


    const handelSearchFieldClear = () => {
        setGeData(true)
        SetEntityId('')
        setInvoiceId([])
        SetOrganizationName('')
        SetOrganizationNationalId('')
        SetCustomerName('')
        setIds([])
        SetMinCreateDate('')
        SetMaxCreateDate('')
        SetMinPaymentDueDate('')
        SetMaxPaymentDueDate('')
        SetMaxPrice('')
        setHasAttachment(null)
        setPaid(null)
        setConfirmed(null)
        SetTrackingCode('')
        SetEntityTypeId(null)
        SetMinPrice('')
        SetPriceUnitId('')
        SetPaymentStatusId(null)
        SetPaymentMethodId(null)
        setPageNumber(0)
        setPageSize(10)
        getPayments()

        sessionStorage.clear()

        
    }
    if (payments) {
        return (
            <div className="rounded">
                <AdminImagePreviwerForPaymentList id={Id} closeModal={closeModalEdit} modalIsOpen={IsOpenEdit} />
                <div className='row'>
                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12  '>

                    </div>
                </div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Selected Option"
                    ariaHideApp={false}>
                </Modal>
                <div className=" statbox widget-content widget-content-area mb-1 mt-1 p-2  ">
                    <AdvancedSearch>
                        <form className='form-row textOnInput'>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">

                                <label className="date-piker-form" >تاریخ ایجاد از</label>
                                <div className='form-group  '>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                        value={MinCreateDate}
                                        onChange={handelMinCreateDate}
                                    />

                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label className="date-piker-form"  >تاریخ ایجاد تا</label>
                                <div className='form-group  '>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                        value={MaxCreateDate}
                                        onChange={handelMaxCreateDate}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">

                                <label className="date-piker-form" >تاریخ سررسید از</label>
                                <div className='form-group  '>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                        value={MinPaymentDueDate}
                                        onChange={handelMinPaymentDueDate}
                                    />

                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label className="date-piker-form"  >تاریخ سررسید تا</label>
                                <div className='form-group  '>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                        value={MaxPaymentDueDate}
                                        onChange={handelMaxPaymentDueDate}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label>شماره پیگیری</label>
                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="شماره پیگیری"
                                    value={TrackingCode} onChange={(e: any) => SetTrackingCode(e.target.value)} /></div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label>شناسه صورتحساب </label>
                                <input className="form-control opacityForInput  mb-4" type="number" placeholder="شناسه فاکتور "
                                    value={InvoiceId} onChange={(e: any) => setInvoiceId(e.target.value)} /></div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label> نام مشتری</label>

                                <input className="form-control opacityForInput  mb-4" type="text"
                                    placeholder="نام مشتری"
                                    value={CustomerName} onChange={(e: any) => SetCustomerName(e.target.value)} />
                            </div>

                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label> شناسه ملی</label>
                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="شناسه ملی"
                                    maxLength={11} value={OrganizationNationalId}
                                    onChange={(e: any) => SetOrganizationNationalId(e.target.value)} /></div>

                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label>نام سازمان</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="نام سازمان"
                                    value={OrganizationName} onChange={(e: any) => SetOrganizationName(e.target.value)} />
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label>حداقل قیمت</label>

                                <input className="form-control opacityForInput  mb-4" type="number" placeholder="حداقل قیمت"
                                    value={MinPrice} onChange={(e: any) => SetMinPrice(e.target.value)} />
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label>حداکثر قیمت</label>

                                <input className="form-control opacityForInput  mb-4" type="number" placeholder="حداکثر قیمت"
                                    value={MaxPrice} onChange={(e: any) => SetMaxPrice(e.target.value)} />
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>واحد پول </label>
                                    {PriceUnitId && PriceUnitId === null ?
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder='واحد پول '
                                            options={PriceUnitIDS()}

                                            isClearable={true}
                                            onChange={(e: any) => {
                                                SetPriceUnitId(e.value)
                                            }} /> :
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder='واحد پول '
                                            options={PriceUnitIDS()}
                                            value={PriceUnitIDS().filter((i: any) => i.value === PriceUnitId).map((i: any) => i)}
                                            isClearable={true}
                                            onChange={(e: any) => {
                                                SetPriceUnitId(e.value)
                                            }} />
                                    }
                                </div>
                            </div>

                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label>شناسه </label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder=" شناسه"
                                    value={EntityId} onChange={(e: any) => SetEntityId(e.target.value)} />
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label> صادر شده از</label>
                                    {EntityTypeId && EntityTypeId === null ?
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder="نوع صورتحساب"
                                            options={EntityTypesIDs()}

                                            isClearable={true}
                                            onChange={(e: any) => {
                                                SetEntityTypeId(e.value)
                                            }}
                                        /> : <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder="نوع صورتحساب"
                                            options={EntityTypesIDs()}
                                            value={EntityTypesIDs().filter((i: any) => i.value === EntityTypeId).map((i: any) => i)}

                                            isClearable={true}
                                            onChange={(e: any) => {
                                                SetEntityTypeId(e.value)
                                            }}
                                        />}
                                </div>
                            </div>
                          
                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>وضعیت پرداخت </label>

                                    {PaymentStatusId && PaymentStatusId === null ?
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder='وضعیت پرداخت'
                                            options={PaymentStatusIds()}


                                            onChange={(e: any) => {
                                                SetPaymentStatusId(e.value)
                                            }}
                                        /> : <Select
                                            menuShouldScrollIntoView={false}
                                            value={PaymentStatusIds().filter((i: any) => i.value === PaymentStatusId).map((i: any) => i)}
                                            placeholder='وضعیت پرداخت'
                                            options={PaymentStatusIds()}


                                            onChange={(e: any) => {
                                                SetPaymentStatusId(e.value)
                                            }}
                                        />}
                                </div>
                            </div>

                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>نوع پرداخت </label>

                                    {PaymentMethodId && PaymentMethodId === null ?
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder='نوع پرداخت'
                                            options={PaumentMrthodIds()}


                                            onChange={(e: any) => {
                                                SetPaymentMethodId(e.value)
                                            }}
                                        /> : <Select
                                            menuShouldScrollIntoView={false}
                                            value={PaumentMrthodIds().filter((i: any) => i.value === PaymentMethodId).map((i: any) => i)}
                                            placeholder='نوع پرداخت'
                                            options={PaumentMrthodIds()}


                                            onChange={(e: any) => {
                                                SetPaymentMethodId(e.value)
                                            }}
                                        />}
                                </div>
                            </div>


                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label> وضعیت سند </label>

                                    {HasAttachment && HasAttachment === null ?
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder=' وضعیت سند '
                                            options={HasAttach()}


                                            onChange={(e: any) => {
                                                setHasAttachment(e.value)
                                            }}
                                        /> : <Select
                                            menuShouldScrollIntoView={false}
                                            value={HasAttach().filter((i: any) => i.value === HasAttachment).map((i: any) => i)}
                                            placeholder=' وضعیت سند '
                                            options={HasAttach()}


                                            onChange={(e: any) => {
                                                setHasAttachment(e.value)
                                            }}
                                        />}
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label> وضعیت مالی </label>

                                    {Paid && Paid === null ?
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder=' وضعیت مالی '
                                            options={Paids()}


                                            onChange={(e: any) => {
                                                setPaid(e.value)
                                            }}
                                        /> : <Select
                                            menuShouldScrollIntoView={false}
                                            value={Paids().filter((i: any) => i.value === Paid).map((i: any) => i)}
                                            placeholder=' وضعیت مالی '
                                            options={Paids()}


                                            onChange={(e: any) => {
                                                setPaid(e.value)
                                            }}
                                        />}
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label> وضعیت تایید </label>

                                    {Confirmed && Confirmed === null ?
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder=' وضعیت تایید '
                                            options={Confirms()}


                                            onChange={(e: any) => {
                                                setConfirmed(e.value)
                                            }}
                                        /> : <Select
                                            menuShouldScrollIntoView={false}
                                            value={Confirms().filter((i: any) => i.value === Confirmed).map((i: any) => i)}
                                            placeholder=' وضعیت تایید '
                                            options={Confirms()}


                                            onChange={(e: any) => {
                                                setConfirmed(e.value)
                                            }}
                                        />}
                                </div>
                            </div>
                        </form>
                        <div className="  filter-btn ">
                            <div className=" row  ">
                                <div className="col-6 ">
                                    <button onClick={handelSearchFieldClear}
                                        className="  btn-sm btn-danger ">حذف فیلتر
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button onClick={getDataBySearch}
                                        className="  btn-sm  btn-primary">جستجو
                                    </button>
                                </div>
                            </div>
                        </div>
                    </AdvancedSearch>
                    {
                        getDefault().EntityId || getDefault().PaymentMethodId || getDefault().PaymentStatusId || getDefault().PriceUnitId!=='' ||
                            getDefault().MinPrice!=='' || getDefault().MaxPrice!=='' || getDefault().MinCreateDate!=='' || getDefault().MaxCreateDate!=='' || getDefault().MinPaymentDueDate!=='' ||
                            getDefault().MaxPaymentDueDate!=='' || getDefault().TrackingCode!=='' || getDefault().HasAttachment || getDefault().Paid || getDefault().Confirmed ? <span className="d-block p-3 text-center w-100 bg-light-primary  " style={{ fontSize: "15px" }}>نمایش اطلاعات بر اساس فیلتر  </span> : null}

                </div>
                <div className=" statbox widget-content widget-content-area">
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Selected Option"
                        ariaHideApp={false}

                    >




                        {/*<button className="btn btn-success float-right" onClick={closeModal}>خیر</button>*/}

                    </Modal>
                    <div>

                        <PaymentTable columns={columns} data={data} getData={(rows: any) => setSelectedRows(rows)} bulkJob={getBulkJob}
                            total={totalCount}
                            setPageSize={setPageSize}
                            PageSize={PageSize}
                            getDataBySearch={getDataByPage}
                            setPageNumber={setPageNumber}
                            PageNumber={PageNumber}


                            rowProps={(row: any) => ({


                                style: {
                                  
                                }
                            })}




                        />

                        <ModalGroupWork open={open} close={close} success={stateSuccess} error={stateError} />
                        <EditPayment closeModal={closeEditHandler} modalIsOpen={EditmodalPay} Item={Payment} reload={getDataBySearch} />
                        <InvoiceShowForPayments closeModal={closeModalInvoiceView} modalOpen={IsOpenInvoiceView} PaymentId={paymentId}/>
                    </div>
                    <div className="d-flex justify-content-end">
                    <ExportToExcelProVersion url={`Payment/GetPayments${urlForExcel()}`} fileName='لیست پرداخت ها' />
                    </div>
                </div>

            </div >


        )
    }
    else {
        return (
            <div className="rounded">

                <div className='row'>
                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12  '>
                    </div>
                </div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Selected Option"
                    ariaHideApp={false}>
                </Modal>
                <div className=" statbox widget-content widget-content-area mb-1 mt-1 p-2  ">
                <AdvancedSearch>
                        <form className='form-row textOnInput'>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">

                                <label className="date-piker-form" >تاریخ ایجاد از</label>
                                <div className='form-group  '>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                        value={MinCreateDate}
                                        onChange={handelMinCreateDate}
                                    />

                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label className="date-piker-form"  >تاریخ ایجاد تا</label>
                                <div className='form-group  '>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                        value={MaxCreateDate}
                                        onChange={handelMaxCreateDate}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">

                                <label className="date-piker-form" >تاریخ سررسید از</label>
                                <div className='form-group  '>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                        value={MinPaymentDueDate}
                                        onChange={handelMinPaymentDueDate}
                                    />

                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label className="date-piker-form"  >تاریخ سررسید تا</label>
                                <div className='form-group  '>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                        value={MaxPaymentDueDate}
                                        onChange={handelMaxPaymentDueDate}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label>شماره پیگیری</label>
                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="شماره پیگیری"
                                    value={TrackingCode} onChange={(e: any) => SetTrackingCode(e.target.value)} /></div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label>شناسه صورتحساب </label>
                                <input className="form-control opacityForInput  mb-4" type="number" placeholder="شناسه فاکتور "
                                    value={InvoiceId} onChange={(e: any) => setInvoiceId(e.target.value)} /></div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label> نام مشتری</label>

                                <input className="form-control opacityForInput  mb-4" type="text"
                                    placeholder="نام مشتری"
                                    value={CustomerName} onChange={(e: any) => SetCustomerName(e.target.value)} />
                            </div>

                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label> شناسه ملی</label>
                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="شناسه ملی"
                                    maxLength={11} value={OrganizationNationalId}
                                    onChange={(e: any) => SetOrganizationNationalId(e.target.value)} /></div>

                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label>نام سازمان</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="نام سازمان"
                                    value={OrganizationName} onChange={(e: any) => SetOrganizationName(e.target.value)} />
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label>حداقل قیمت</label>

                                <input className="form-control opacityForInput  mb-4" type="number" placeholder="حداقل قیمت"
                                    value={MinPrice} onChange={(e: any) => SetMinPrice(e.target.value)} />
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label>حداکثر قیمت</label>

                                <input className="form-control opacityForInput  mb-4" type="number" placeholder="حداکثر قیمت"
                                    value={MaxPrice} onChange={(e: any) => SetMaxPrice(e.target.value)} />
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>واحد پول </label>
                                    {PriceUnitId && PriceUnitId === null ?
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder='واحد پول '
                                            options={PriceUnitIDS()}

                                            isClearable={true}
                                            onChange={(e: any) => {
                                                SetPriceUnitId(e.value)
                                            }} /> :
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder='واحد پول '
                                            options={PriceUnitIDS()}
                                            value={PriceUnitIDS().filter((i: any) => i.value === PriceUnitId).map((i: any) => i)}
                                            isClearable={true}
                                            onChange={(e: any) => {
                                                SetPriceUnitId(e.value)
                                            }} />
                                    }
                                </div>
                            </div>

                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label>شناسه </label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder=" شناسه"
                                    value={EntityId} onChange={(e: any) => SetEntityId(e.target.value)} />
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label> صادر شده از</label>
                                    {EntityTypeId && EntityTypeId === null ?
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder="نوع صورتحساب"
                                            options={EntityTypesIDs()}

                                            isClearable={true}
                                            onChange={(e: any) => {
                                                SetEntityTypeId(e.value)
                                            }}
                                        /> : <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder="نوع صورتحساب"
                                            options={EntityTypesIDs()}
                                            value={EntityTypesIDs().filter((i: any) => i.value === EntityTypeId).map((i: any) => i)}

                                            isClearable={true}
                                            onChange={(e: any) => {
                                                SetEntityTypeId(e.value)
                                            }}
                                        />}
                                </div>
                            </div>
                          
                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>وضعیت پرداخت </label>

                                    {PaymentStatusId && PaymentStatusId === null ?
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder='وضعیت پرداخت'
                                            options={PaymentStatusIds()}


                                            onChange={(e: any) => {
                                                SetPaymentStatusId(e.value)
                                            }}
                                        /> : <Select
                                            menuShouldScrollIntoView={false}
                                            value={PaymentStatusIds().filter((i: any) => i.value === PaymentStatusId).map((i: any) => i)}
                                            placeholder='وضعیت پرداخت'
                                            options={PaymentStatusIds()}


                                            onChange={(e: any) => {
                                                SetPaymentStatusId(e.value)
                                            }}
                                        />}
                                </div>
                            </div>

                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>نوع پرداخت </label>

                                    {PaymentMethodId && PaymentMethodId === null ?
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder='نوع پرداخت'
                                            options={PaumentMrthodIds()}


                                            onChange={(e: any) => {
                                                SetPaymentMethodId(e.value)
                                            }}
                                        /> : <Select
                                            menuShouldScrollIntoView={false}
                                            value={PaumentMrthodIds().filter((i: any) => i.value === PaymentMethodId).map((i: any) => i)}
                                            placeholder='نوع پرداخت'
                                            options={PaumentMrthodIds()}


                                            onChange={(e: any) => {
                                                SetPaymentMethodId(e.value)
                                            }}
                                        />}
                                </div>
                            </div>


                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label> وضعیت سند </label>

                                    {HasAttachment && HasAttachment === null ?
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder=' وضعیت سند '
                                            options={HasAttach()}


                                            onChange={(e: any) => {
                                                setHasAttachment(e.value)
                                            }}
                                        /> : <Select
                                            menuShouldScrollIntoView={false}
                                            value={HasAttach().filter((i: any) => i.value === HasAttachment).map((i: any) => i)}
                                            placeholder=' وضعیت سند '
                                            options={HasAttach()}


                                            onChange={(e: any) => {
                                                setHasAttachment(e.value)
                                            }}
                                        />}
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label> وضعیت مالی </label>

                                    {Paid && Paid === null ?
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder=' وضعیت مالی '
                                            options={Paids()}


                                            onChange={(e: any) => {
                                                setPaid(e.value)
                                            }}
                                        /> : <Select
                                            menuShouldScrollIntoView={false}
                                            value={Paids().filter((i: any) => i.value === Paid).map((i: any) => i)}
                                            placeholder=' وضعیت مالی '
                                            options={Paids()}


                                            onChange={(e: any) => {
                                                setPaid(e.value)
                                            }}
                                        />}
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label> وضعیت تایید </label>

                                    {Confirmed && Confirmed === null ?
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder=' وضعیت تایید '
                                            options={Confirms()}


                                            onChange={(e: any) => {
                                                setConfirmed(e.value)
                                            }}
                                        /> : <Select
                                            menuShouldScrollIntoView={false}
                                            value={Confirms().filter((i: any) => i.value === Confirmed).map((i: any) => i)}
                                            placeholder=' وضعیت تایید '
                                            options={Confirms()}


                                            onChange={(e: any) => {
                                                setConfirmed(e.value)
                                            }}
                                        />}
                                </div>
                            </div>
                        </form>
                        <div className="  filter-btn ">
                            <div className=" row  ">
                                <div className="col-6 ">
                                    <button onClick={handelSearchFieldClear}
                                        className="  btn-sm btn-danger ">حذف فیلتر
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button onClick={getDataBySearch}
                                        className="  btn-sm  btn-primary">جستجو
                                    </button>
                                </div>
                            </div>
                        </div>
                    </AdvancedSearch>
                    {
                        getDefault().EntityId!=='' || getDefault().PaymentMethodId || getDefault().PaymentStatusId || getDefault().PriceUnitId!=='' ||
                            getDefault().MinPrice!=='' || getDefault().MaxPrice!=='' || getDefault().MinCreateDate!=='' || getDefault().MaxCreateDate!=='' || getDefault().MinPaymentDueDate!=='' ||
                            getDefault().MaxPaymentDueDate!=='' || getDefault().TrackingCode!=='' || getDefault().HasAttachment || getDefault().Paid || getDefault().Confirmed ? <span className="d-block p-3 text-center w-100 bg-light-primary  " style={{ fontSize: "15px" }}>نمایش اطلاعات بر اساس فیلتر  </span> : null}
                </div>
                <div className=" statbox widget-content widget-content-area">
                    <div>
                        <div className='text-center mt-5'>
                            <h5>اطلاعاتی جهت نمایش موجود نیست</h5>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default PaymentsList