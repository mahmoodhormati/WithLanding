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
import { PriceUnitEnums } from './../../../Common/Enums/PriceUnit';
import { PaymentStatusEnums } from './../../../Common/Enums/PaymentStatus';
import MyTable from '../../../Common/Shared/Form/MyTable';
import ModalGroupWork from '../../../Common/Shared/Common/ModalGroupWork';
import { InvoceTypes } from './../../../Common/Enums/InvoiceTypeIdEnums';
import { PaymentStructureEnums } from './../../../Common/Enums/PaymentStructureEnums';
import PaymentModalForInvoices from '../../Payment/Component/PaymentModalForInvoices';
import { AiOutlineDollar } from 'react-icons/ai';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { GetOrderByDetailId } from '../../../services/orderService';
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

const InvoiceList: React.FC = () => {
    const [PageNumber, setPageNumber] = useState(getPage().PageNumber ? getPage().PageNumber : 0)
    const [PageSize, setPageSize] = useState(getPage().PageSize ? getPage().PageSize : 10)
    const [totalCount, setTotalCount] = useState(0);
    const [selectedRows, setSelectedRows] = useState([])
    const [getData, setGeData] = useState(false)
    const [modalIsOpen, setIsOpen] = useState(false);
    const [stateSuccess, SetStateSuccess] = useState(0)
    const [open, SetOpen] = useState(false);

    const [stateError, SetStateError] = useState(0)
    const [invoices, SetInvoice] = useState([])
    const [Ids, setIds] = useState<any>([])
    const [EntityTypeId, SetEntityTypeId] = useState(getDefault().EntityTypeId)
    const [EntityId, SetEntityId] = useState(getDefault().EntityId)
    const [PriceUnitId, SetPriceUnitId] = useState(getDefault().PriceUnitId)
    const [MinPrice, SetMinPrice] = useState(getDefault().MinPrice)
    const [MaxPrice, SetMaxPrice] = useState(getDefault().MaxPrice)
    const [PaymentStatusIds, SetPaymentStatusIds] = useState(getDefault().PaymentStatusIds ? getDefault().PaymentStatusIds : [])
    const [StartDate, SetStartDate] = useState(getDefault().StartDate)
    const [EndDate, SetEndDate] = useState(getDefault().EndDate)
    const [CompanyId, SetCompanyId] = useState(getDefault().CompanyId)
    const [CustomerUserName, SetCustomerUserName] = useState(getDefault().CustomerUserName)
    const [CustomerFirstName, SetCustomerFirstName] = useState(getDefault().CustomerFirstName)
    const [CustomerLastName, SetCustomerLastName] = useState(getDefault().CustomerLastName)
    const [CustomerNationalCode, SetCustomerNationalCode] = useState(getDefault().CustomerNationalCode)
    const [OrganizationName, SetOrganizationName] = useState(getDefault().OrganizationName)
    const [OrganizationNationalId, SetOrganizationNationalId] = useState(getDefault().OrganizationNationalId)
    const [modalOpenPayment, SetModalOpenPayment] = useState<boolean>(false)
    const [id, SetId] = useState(0)

    const companies = useSelector((state: RootState) => state.companies)

    const navigate = useNavigate()
    const param = { PageSize, PageNumber }

    function getPage() {
        let items = JSON.parse(String(sessionStorage.getItem(`param${window.location.pathname}`)));
        return items ? items : ''


    }
    const params = { EntityTypeId, EntityId, PriceUnitId, MinPrice, MaxPrice, PaymentStatusIds, StartDate, EndDate, CompanyId, CustomerUserName, CustomerFirstName, CustomerLastName, CustomerNationalCode, OrganizationName, OrganizationNationalId }
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
    const DeleteSelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < arrayOfData.length; i++) {




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




        }


    }
    const handelStartDate = (value: any) => {
        if (value === null) {
            SetStartDate('')
        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            SetStartDate(new Date(value.toDate().setHours(3, 30, 0, 0)))



        }
    }
    const OpenPaymentModal = (id: any) => {
        SetId(id)
        SetModalOpenPayment(true)
    }
    const closePaymnetModal = () => {
        SetModalOpenPayment(false)
    }
    const handelEndDate = (value: any) => {
        if (value === null) {
            SetEndDate('')
        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            SetEndDate(new Date(value.toDate().setHours(3, 30, 0, 0)))
        }
    }
    const urlForExcel = () => {

        let parameter = {
            Ids,
            EntityTypeId,
            EntityId,
            PriceUnitId,
            MinPrice,
            MaxPrice,
            PaymentStatusIds:PaymentStatusIds.length>0?PaymentStatusIds.map((i:any)=>i.value):[],
            StartDate,
            EndDate,
            CompanyId,
            CustomerUserName,
            CustomerFirstName,
            CustomerLastName, CustomerNationalCode,
            OrganizationName,
            OrganizationNationalId,
            IsAdmin: true,
            PageNumber,
            PageSize: 1000000


        }



        let url = QueryString.stringify(parameter)


        return (`?${url}`)



    }

    const getDataBySearch = async () => {
        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {
                Ids,
                EntityTypeId,
                EntityId,
                PriceUnitId,
                MinPrice,
                MaxPrice,
                PaymentStatusIds:PaymentStatusIds.length>0?PaymentStatusIds.map((i:any)=>i.value):[],
                StartDate,
                EndDate,
                CompanyId,
                CustomerUserName,
                CustomerFirstName,
                CustomerLastName, CustomerNationalCode,
                OrganizationName,
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
            const { data, status } = await GetInvoicesWithSearch(config);
            if (status === 200) {
                SetInvoice(data.result.invoices.values)
                setTotalCount(data.result.invoices.totalCount)

                sessionStorage.setItem(`params${window.location.pathname}`, JSON.stringify(params));
                sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));


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
                EntityTypeId,
                EntityId,
                PriceUnitId,
                MinPrice,
                MaxPrice,
                PaymentStatusIds:PaymentStatusIds.length>0?PaymentStatusIds.map((i:any)=>i.value):[],
                StartDate,
                EndDate,
                CompanyId,
                CustomerUserName,
                CustomerFirstName,
                CustomerLastName, CustomerNationalCode,
                OrganizationName,
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
            const { data, status } = await GetInvoicesWithSearch(config);
            if (status === 200) {
                SetInvoice(data.result.invoices.values)
                setTotalCount(data.result.invoices.totalCount)

                sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));

            }

        } catch (err) {
            console.log(err)
        }

    }
    const GetIvoices = async () => {


        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {
                Ids: [],
                EntityTypeId: null,
                EntityId: null,
                PriceUnitId: null,
                MinPrice: null,
                MaxPrice: null,
                PaymentStatusIds: [],
                StartDate: null,
                EndDate: null,
                CompanyId,
                CustomerUserName: null,
                CustomerFirstName: null,
                CustomerLastName: null, CustomerNationalCode: null,
                OrganizationName: null,
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
            const { data, status } = await GetInvoicesWithSearch(config);
            if (status === 200) {
                setGeData(false)
                SetInvoice(data.result.invoices.values)
                setTotalCount(data.result.invoices.totalCount)

            }
        } catch (err) {
            console.log(err)
        }

    }
    useEffect(() => {
        // GetIvoices()

    }, [getData])
    let formatterForMoney = new Intl.NumberFormat('fa-IR', {

        currency: 'IRR'


    });


    const handelNavigateWithId = (id: number) => {

       return(
        <Link to={`${window.location.origin}/admin/orderDetail/${id}`}></Link>
       )
    }

    const handelNavigateWithDetails = async (id: number) => {

      

        return(
            <Link to={`${window.location.origin}/admin/orderDetail/${id}`}/>
           )
    

    }



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
    const PaymentStatusIdForCombo = () => {
        let all = PaymentStatusEnums.map((data: any) => ({ label: data.name, value: data.id }))
        return ([{ label: "همه", value: null }, ...all])
    }
    const columns = useMemo(() => [
        { Header: '#', accessor: 'id' },
        { Header: 'نام و نام خانوادگی', accessor: 'customerName' },
        { Header: 'نام سازمان', accessor: 'organizationName' },
        {
            Header: 'نوع صورتحساب', accessor: 'invoiceTypeId', Cell: (rows: any) => {

                return (InvoceTypes.filter((item: any) => (item.id === rows.row.original.invoiceTypeId)).map((item: any) => (item.name)))

            }
        },
        {
            Header: 'شناسه ', accessor: 'entityId', Cell: (row: any) => {

                if (row.row.original.entityTypeId === 10) {

                    return (

                        <Link className='text-primary' to={`/admin/orderDetail/${row.row.original.entityId}`} target='_blank' >{`سفارش #${row.row.original.entityId}`} </Link>

                    )
                }
                else {

                    return (


                        <Link className='text-primary' to={`/admin/orderDetail/${row.row.original.parentEntityId}`} target='_blank' >{`جزییات سفارش # ${row.row.original.entityId}`} </Link>
                    )
                }


            }
        },
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
            Header: 'وضعیت پرداخت', accessor: 'paymentStatusId', Cell: (rows: any) => {

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

                if (rows.row.original.createDate !== null) {
                    return (new Date(rows.row.original.createDate).toLocaleDateString('fa-IR'))
                }
                else {
                    return (null)
                }
            }
        },
        {
            Header: 'تاریخ سررسید ', accessor: 'installmentStartDate', Cell: (rows: any) => {

                if (rows.row.original.installmentStartDate !== null) {
                    return (new Date(rows.row.original.installmentStartDate).toLocaleDateString('fa-IR'))
                }
                else {
                    return (null)
                }
            }
        },
        { Header: 'دوره اقساط ', accessor: 'installmentPeriod' },
        { Header: 'تعداد اقساط ', accessor: 'installmentOccureCount' },
        { Header: 'توضیحات', accessor: 'comment' },
        {
            Header: ' پرداخت ها', accessor: 'getPayment', Cell: (row: any) => {


                return (
                    <button className='border-0 bg-transparent ' onClick={() => OpenPaymentModal(row.row.original.id)} ><AiOutlineDollar size={"1.5rem"} /></button>
                )

            }
        }



    ], [])

    const data = useMemo(() => invoices, [invoices])


    const handelSearchFieldClear = () => {
        setGeData(true)
        GetIvoices()
        setIds([])
        SetOrganizationName('')
        SetOrganizationNationalId('')
        SetCustomerFirstName('')
        SetCustomerLastName('')
        SetCustomerNationalCode('')
        SetCustomerUserName('')
        SetEndDate('')
        SetStartDate('')
        SetMaxPrice('')
        SetEntityId(null)
        SetEntityTypeId([])
        SetMinPrice('')
        SetPriceUnitId('')
        SetPaymentStatusIds([])

        setPageSize(10)
        SetCompanyId(null)
        sessionStorage.clear()

        setPageNumber(0)
    }
    if (invoices) {
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
                <PaymentModalForInvoices modalOpen={modalOpenPayment} closeModal={closePaymnetModal} InvoiceIds={[id]} />
                <div className=" statbox widget-content widget-content-area mb-1 mt-1 p-2  rounded">
                    <AdvancedSearch>

                        <form className='form-row textOnInput'>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">

                                <label className="date-piker-form" >از تاریخ </label>
                                <div className='form-group  '>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                        value={StartDate}
                                        onChange={handelStartDate}
                                    />

                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label className="date-piker-form"  >تا تاریخ </label>
                                <div className='form-group  '>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                        value={EndDate}
                                        onChange={handelEndDate}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label>شماره موبایل</label>
                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="شماره موبایل"
                                    value={CustomerUserName} onChange={(e: any) => SetCustomerUserName(e.target.value)} /></div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label>شناسه فاکتور </label>
                                <input className="form-control opacityForInput  mb-4" type="number" placeholder="شناسه فاکتور "
                                    value={Ids} onChange={(e: any) => setIds(e.target.value)} /></div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label> کد ملی</label>
                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="کد ملی"
                                    maxLength={11} value={CustomerNationalCode}
                                    onChange={(e: any) => SetCustomerNationalCode(e.target.value)} /></div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label> شناسه ملی</label>
                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="شناسه ملی"
                                    maxLength={11} value={OrganizationNationalId}
                                    onChange={(e: any) => SetOrganizationNationalId(e.target.value)} /></div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label> نام مشتری</label>

                                <input className="form-control opacityForInput  mb-4" type="text"
                                    placeholder="نام مشتری"
                                    value={CustomerFirstName} onChange={(e: any) => SetCustomerFirstName(e.target.value)} />
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label> نام خانوادگی مشتری</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="نام خانوادگی مشتری"
                                    value={CustomerLastName} onChange={(e: any) => SetCustomerLastName(e.target.value)} />
                            </div>
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
                                <label> شناسه</label>

                                <input className="form-control opacityForInput  mb-4" type="number" placeholder=" شناسه "
                                    value={EntityId} onChange={(e: any) => SetEntityId(e.target.value)} />
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>صادر شده از</label>
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

                                    {PaymentStatusIds && PaymentStatusIds === null ?
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder='وضعیت پرداخت'
                                            options={PaymentStatusIdForCombo()}
                                            isMulti
                                            isClearable={true}

                                            onChange={(e: any) => {
                                                SetPaymentStatusIds(e)
                                            }}
                                        /> : <Select
                                            menuShouldScrollIntoView={false}
                                            value={PaymentStatusIds}
                                            placeholder='وضعیت پرداخت'
                                            options={PaymentStatusIdForCombo()}
                                            isMulti
                                            isClearable={true}

                                            onChange={(e: any) => {
                                                SetPaymentStatusIds(e)
                                            }}
                                        />}
                                </div>
                            </div>


                            {companies.length > 1 ? <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label> نام شرکت </label>

                                    {CompanyId && CompanyId === null ?
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            options={CompaniesIDs()}
                                            onChange={(e: any) => {
                                                SetCompanyId(e.value)
                                            }}
                                        /> : <Select
                                            menuShouldScrollIntoView={false}
                                            value={CompaniesIDs().filter((i: any) => i.value === CompanyId).map((i: any) => i)}

                                            placeholder='نام شرکت'
                                            options={CompaniesIDs()}
                                            onChange={(e: any) => {
                                                SetCompanyId(e.value)


                                            }}
                                        />}
                                </div>
                            </div> : ''}

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

                        <MyTable columns={columns} data={data} getData={(rows: any) => setSelectedRows(rows)} bulkJob={getBulkJob}
                            total={totalCount}
                            setPageSize={setPageSize}
                            PageSize={PageSize}
                            getDataBySearch={getDataByPage}
                            setPageNumber={setPageNumber}
                            PageNumber={PageNumber}
                        />

                        <ModalGroupWork open={open} close={close} success={stateSuccess} error={stateError} />

                    </div>
                    <div className="d-flex justify-content-end">
                        <ExportToExcelProVersion url={`Invoice/GetInvoices/${urlForExcel()}`} fileName='لیست صورتحسابها' />
                    </div>
                </div>

            </div>


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
                <div className=" statbox widget-content widget-content-area mb-1 mt-1 p-2  rounded">
                    <AdvancedSearch>

                        <form className='form-row textOnInput'>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">

                                <label className="date-piker-form" >از تاریخ </label>
                                <div className='form-group  '>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                        value={StartDate}
                                        onChange={handelStartDate}
                                    />

                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label className="date-piker-form"  >تا تاریخ </label>
                                <div className='form-group  '>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                        value={EndDate}
                                        onChange={handelEndDate}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label>شماره موبایل</label>
                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="شماره موبایل"
                                    value={CustomerUserName} onChange={(e: any) => SetCustomerUserName(e.target.value)} /></div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label>شناسه فاکتور </label>
                                <input className="form-control opacityForInput  mb-4" type="number" placeholder="شناسه فاکتور "
                                    value={Ids} onChange={(e: any) => setIds(e.target.value)} /></div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label> کد ملی</label>
                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="کد ملی"
                                    maxLength={11} value={CustomerNationalCode}
                                    onChange={(e: any) => SetCustomerNationalCode(e.target.value)} /></div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label> شناسه ملی</label>
                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="شناسه ملی"
                                    maxLength={11} value={OrganizationNationalId}
                                    onChange={(e: any) => SetOrganizationNationalId(e.target.value)} /></div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label> نام مشتری</label>

                                <input className="form-control opacityForInput  mb-4" type="text"
                                    placeholder="نام مشتری"
                                    value={CustomerFirstName} onChange={(e: any) => SetCustomerFirstName(e.target.value)} />
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label> نام خانوادگی مشتری</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="نام خانوادگی مشتری"
                                    value={CustomerLastName} onChange={(e: any) => SetCustomerLastName(e.target.value)} />
                            </div>
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
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label> شناسه</label>

                                <input className="form-control opacityForInput  mb-4" type="number" placeholder="حداکثر قیمت"
                                    value={EntityId} onChange={(e: any) => SetEntityId(e.target.value)} />
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>صادر شده برای</label>
                                    {EntityTypeId && EntityTypeId === null ?
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder="نوع فاکتور"
                                            options={EntityTypesIDs()}

                                            isClearable={true}
                                            onChange={(e: any) => {
                                                SetEntityTypeId(e.value)
                                            }}
                                        /> : <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder="نوع فاکتور"
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

                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>وضعیت پرداخت </label>

                                    {PaymentStatusIds && PaymentStatusIds === null ?
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder='وضعیت پرداخت'
                                            options={PaymentStatusIdForCombo()}
                                            isMulti
                                            isClearable={true}

                                            onChange={(e: any) => {
                                                SetPaymentStatusIds(e)
                                            }}
                                        /> : <Select
                                            menuShouldScrollIntoView={false}
                                            value={PaymentStatusIds}
                                            placeholder='وضعیت پرداخت'
                                            options={PaymentStatusIdForCombo()}
                                            isMulti
                                            isClearable={true}

                                            onChange={(e: any) => {
                                                SetPaymentStatusIds(e)
                                            }}
                                        />}
                                </div>
                            </div>


                            {companies.length > 1 ? <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label> نام شرکت </label>

                                    {CompanyId && CompanyId === null ?
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            options={CompaniesIDs()}
                                            onChange={(e: any) => {
                                                SetCompanyId(e.value)
                                            }}
                                        /> : <Select
                                            value={CompaniesIDs().filter((i: any) => i.value === CompanyId).map((i: any) => i)}
                                            menuShouldScrollIntoView={false}
                                            placeholder='نام شرکت'
                                            options={CompaniesIDs()}
                                            onChange={(e: any) => {
                                                SetCompanyId(e.value)


                                            }}
                                        />}
                                </div>
                            </div> : ''}

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

export default InvoiceList