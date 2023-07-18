import { useSelector } from "react-redux";
import {
    GetDataWithSearchOrder,
    GetOrder,
    GetOrderDetails, HasOverDuePaymentsByAttachments
} from "../../../services/orderService";
import { useEffect, useState, useRef, useReducer } from "react";
import { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { OrderStatus } from "../../../Common/Enums/OrderStatusEnums";
import { PaymentStructureEnums } from "../../../Common/Enums/PaymentStructureEnums";
import { ShippingStatusEnums } from "../../../Common/Enums/ShippingStatusEnums";
import { GetAllOrganisationCode, GetAllOrganisation } from "../../../services/organisationService";
import ModalGroupWork from "../../../Common/Shared/Common/ModalGroupWork";
import { ExportToExcel } from '../../../Common/Shared/Common/ExportToExcel';
import MyTableClick from "../../../Common/Shared/Form/MyTableClickable";
import AdvancedSearch from "../../../Common/Shared/Common/AdvancedSearch";
import Select from "react-select";
import QueryString from 'qs';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import Modal from 'react-modal';

import { GetAddress, GetAddressByIds } from "../../../services/addressService";
import OrderEditList from "./orderEditList";
import { PaymentStatusEnums } from "../../../Common/Enums/PaymentStatus";
import { toast } from "react-toastify";
import { OverDueEnum } from "../../../Common/Enums/overDueEnum";
import { GetCompanyChild } from '../../../services/companiesService';
import { GetOrderDetailsAdmin } from '../../../services/orderService';
import { RootState } from "../../../store";
import { ExportToExcelProVersion } from "../../../Utils/ExportToExcelProVersion";
import { TbReportMoney } from "react-icons/tb";
import { GetFinancialCardex } from "../../../services/reportService";
import './orderlistTooltip.css'

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



const OrderList: React.FC = () => {
    const location = useLocation();

    const [PageNumber, setPageNumber] = useState(getPage().PageNumber ? getPage().PageNumber : 0)
    const [PageSize, setPageSize] = useState(getPage().PageSize ? getPage().PageSize : 10)

    const [orderId, setOrderId] = useState(0)
    let FilnalArr: any = [];
    const roles = useSelector((state: RootState) => state.roles)
    const Navigate = useNavigate()
    const [selectedRows, setSelectedRows] = useState([])
    const [modalIsOpen, setIsOpen] = useState(false);
    const [getOrders, SetGetOrders] = useState(false);
    const [modalIsOpenEdit, setIsOpenEdit] = useState(false);
    const [idEdit, setIdEdit] = useState(0);
    const [stateSuccess, SetStateSuccess] = useState(0)
    const [stateError, SetStateError] = useState(0)
    const [open, SetOpen] = useState(false);
    const [show, SetShow] = useState(false);
    const [HasAddressWithoutShipping, SetHasAddressWithoutShipping] = useState(getDefault().HasAddressWithoutShipping ? getDefault().HasAddressWithoutShipping : false);
    const [HasAddressWithoutInvoice, SetHasAddressWithoutInvoice] = useState(getDefault().HasAddressWithoutInvoice ? getDefault().HasAddressWithoutInvoice : false);
    const [overDue, SetoverDue] = useState(location.state ? true : getDefault().overDue);
    const [address, SetAddress] = useState<any>(0);

    let Detail: any = [];
    const [totalCount, setTotalCount] = useState(0);
    const [extDataIds, SetExtDataIds] = useState<any>([]);
    const [organizations, SetOrganisations] = useState([]);
    const [ShoppingCartInformation, SetShoppingCartInformation] = useState([]);
    const [userName, setUserName] = useState(getDefault().userName)
    const [StartDate, setStartDate] = useState(getDefault().StartDate)
    const [EndDate, setEndDate] = useState(getDefault().EndDate)
    const [ExtId, setExtId] = useState(getDefault().ExtId ? getDefault().ExtId : null)
    const [nationalCode, setNationalCode] = useState(getDefault().nationalCode)
    const [organizationNationalId, setOrganizationNationalId] = useState(getDefault().organizationNationalId)
    const [orderStatusIds, setOrderStatusIds] = useState(getDefault().orderStatusIds)
    const [paymentMethodIds, setPaymentMethodIds] = useState(getDefault().paymentMethodIds)
    const [paymentStatusIds, setPaymentStatusId] = useState(getDefault().paymentStatusIds)
    const [shippingStatusIds, setShippingStatusIds] = useState(getDefault().shippingStatusIds)
    const [order, setOrder] = useState([])
    const [companyId, setCompanyId] = useState(getDefault().companyId ? getDefault().companyId : null)
    const [DetailAddress, setDetailAddress] = useState([]);
    const [companies, setCompanies] = useState([])
    const [OrderDetailExtId, setOrderDetailExtId] = useState(getDefault().OrderDetailExtId)
    const [ExternalOrders, SetExternalOrders] = useState(getDefault().ExternalOrders)
    const [CustomerName, SetCustomerName] = useState(getDefault().CustomerName)
    const [OrganizationName, SetOrganizationName] = useState(getDefault().OrganizationName)
    const [updateValue, ForceUpdate] = useReducer(x => x + 1, 0)


    const [Id, setId] = useState(getDefault().Id ? getDefault().Id : null)
    let SortColumn: any = null
    let SortingDirectionId: any = null

    const param = { PageSize, PageNumber }

    function getPage() {
        let items = JSON.parse(String(sessionStorage.getItem(`param${window.location.pathname}`)));
        return items ? items : ''


    }
    const bindAdress = async (arr: any) => {


        if (Detail.length > 1) {

            try {

                let addressIds = Detail.filter((item: any) => item.addressId !== null).map((item: any) => item.addressId)
                let configs = {
                    headers: { "Content-Type": "application/json" },
                    params: {

                        Ids: [...new Set(addressIds)]


                    },
                    paramsSerializer: (params: any) => {
                        return QueryString.stringify(params);
                    },
                };

                const { data, status } = await GetAddressByIds(configs)
                let detail = Detail
                let address = data.result.addresses;

                let mergeById = (a1: any, a2: any) =>
                    a1.map((itm: any) => ({
                        ...a2.find((item: any) => (item.id === itm.addressId) && item),
                        ...itm
                    }));
                let FilnalArr = mergeById(detail, address)
                setDetailAddress(FilnalArr)
            } catch (e) {
                console.log(e)
            }


        } else {
            for (let i = 0; i < Detail.length; i++) {
                try {

                    let addressIds = Detail.filter((item: any) => item.addressId !== null).map((item: any) => item.addressId)
                    let configs = {
                        headers: { "Content-Type": "application/json" },
                        params: {

                            Ids: [...new Set(addressIds)]


                        },
                        paramsSerializer: (params: any) => {
                            return QueryString.stringify(params);
                        },
                    };

                    const { data, status } = await GetAddressByIds(configs)
                    let detail = Detail
                    let address = data.result.addresses;

                    let mergeById = (a1: any, a2: any) =>
                        a1.map((itm: any) => ({
                            ...a2.find((item: any) => (item.id === itm.addressId) && item),
                            ...itm
                        }));
                    let FilnalArr = mergeById(detail, address)
                    setDetailAddress(FilnalArr)
                } catch (e) {
                    console.log(e)
                }

            }
        }

    }
    const closeModal = () => {
        setIsOpen(false);
    }
    const openModalEdit = (id: number) => {
        setIdEdit(id)
        setIsOpenEdit(true);
    }
    const closeModalEdit = () => {
        setIsOpenEdit(false);
    }
    const handelStartDate = (value: any) => {
        if (value === null) {
            setStartDate('')
        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            setStartDate(new Date(value.toDate().setHours(3, 30, 0, 0)))



        }
    }

    const handelEndDate = (value: any) => {
        if (value === null) {
            setEndDate('')
        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            setEndDate(new Date(value.toDate().setHours(23, 59, 0, 0)))
        }
    }
    const close = () => {
        SetOpen(false);
    }
    const shippingId = () => {
        let all = ShippingStatusEnums.map(data => ({ label: data.name, value: data.id }))
        return ([{ label: "همه", value: null }, ...all])

    }
    const PaymentStatus = () => {
        let all = PaymentStatusEnums.map(data => ({ label: data.name, value: data.id }))
        return ([{ label: "همه", value: null }, ...all])


    }
    const OrderStatusID = () => {
        let all = OrderStatus.map(data => ({ label: data.name, value: data.id }))
        return ([{ label: "همه", value: null }, ...all])


    }
    const ExternalOrdersID = () => {

        return ([{ label: "همه", value: null }, { label: "سفارشات سیستمی", value: false }, { label: "سفارشات متفرقه ", value: true }])


    }
    const paymentMethodIDs = () => {
        let all = PaymentStructureEnums.map(data => ({ label: data.name, value: data.id }))
        return ([{ label: "همه", value: null }, ...all])


    }
    const OverDue = () => {
        let all = OverDueEnum.map(data => ({ label: data.name, value: data.value }))
        return ([{ label: "همه", value: null }, ...all])

    }
    let arrayOfSelectedData = [];
    const getSelectedData = (data: any) => {
        arrayOfSelectedData = data.map((item: any) => item.original);
        return (arrayOfSelectedData)
    }
    const CompaniesIDs = () => {
        let all = companies.map((data: any) => ({ label: data.name, value: data.id }))
        return ([{ label: "همه", value: null }, ...all])
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
    const DeleteSelectedItem = async () => { }
    const copySelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        const copyData = arrayOfData.map((item: any) => {
            return { ...item, id: 0, active: true, createDate: new Date() }
        })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            try {

                let payload = {
                    'organization': copyData[i]
                }
                setOrder(copyData[i])

                SetOpen(true)

                SetStateSuccess(successCount += 1)



            } catch (error) {
                SetOpen(true)

                SetStateError(errorCount += 1)
            }


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


            try {

                let payload = {
                    'order': copyData[i]
                }
                setOrder(copyData[i])

                SetOpen(true)

                SetStateSuccess(successCount += 1)



            } catch (error) {
                SetOpen(true)

                SetStateError(errorCount += 1)
            }


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


            try {

                let payload = {
                    'order': copyData[i]
                }
                setOrder(copyData[i])

                SetOpen(true)

                SetStateSuccess(successCount += 1)



            } catch (error) {
                SetOpen(true)

                SetStateError(errorCount += 1)
            }


        }


    }
    const params = {
        organizationNationalId,
        overDue,
        paymentStatusIds,
        Id,
        ExtId,
        paymentMethodIds,
        shippingStatusIds,
        nationalCode,
        userName,
        orderStatusIds,
        StartDate,
        EndDate,
        OrderDetailExtId, IsAdmin: true,
        companyId,
        ExternalOrders,
        HasAddressWithoutInvoice, HasAddressWithoutShipping, OrganizationName, CustomerName
    }
    function getDefault() {
        let items = JSON.parse(String(sessionStorage.getItem(`params${window.location.pathname}`)));
        return items ? items : ''
    }
    const urlForExcel = () => {

        let parameter = {
            Id: Number(Id), IsAdmin: true,
            UserName: userName,
            OrderStatusIds: orderStatusIds ? orderStatusIds.map((item: any) => item.value) : [],
            StartDate
            , EndDate
            , ExtId: Number(ExtId),
            OrganizationName, CustomerName,
            AttachmentsOverDue: overDue,
            paymentStatusIds: paymentStatusIds ? paymentStatusIds.map((item: any) => item.value) : [],
            PaymentMethodIds: paymentMethodIds ? paymentMethodIds.map((item: any) => item.value) : [],
            ShippingStatusIds: shippingStatusIds ? shippingStatusIds.map((item: any) => item.value) : [],
            NationalCode: nationalCode,
            OrganizationNationalId: organizationNationalId,
            OrderDetailExtId,
            PageNumber: 0,
            PageSize: 100000,
            companyId,
            SortColumn,
            SortingDirectionId, ExternalOrders, HasAddressWithoutInvoice, HasAddressWithoutShipping


        }



        let url = QueryString.stringify(parameter)


        return (`?${url}`)



    }



    const getDataBySearch = async () => {
        let config = {
            headers: { 'Content-Type': 'application/json' },
            params: {
                Id: Number(Id), IsAdmin: true,
                UserName: userName,
                OrderStatusIds: orderStatusIds ? orderStatusIds.map((item: any) => item.value) : [],
                StartDate
                , EndDate
                , ExtId: Number(ExtId),
                AttachmentsOverDue: overDue,
                paymentStatusIds: paymentStatusIds ? paymentStatusIds.map((item: any) => item.value) : [],
                PaymentMethodIds: paymentMethodIds ? paymentMethodIds.map((item: any) => item.value) : [],
                ShippingStatusIds: shippingStatusIds ? shippingStatusIds.map((item: any) => item.value) : [],
                NationalCode: nationalCode,
                OrganizationNationalId: organizationNationalId,
                OrderDetailExtId,
                PageNumber: 0,
                PageSize,
                companyId,
                SortColumn,
                SortingDirectionId, ExternalOrders, HasAddressWithoutInvoice, HasAddressWithoutShipping, OrganizationName, CustomerName,

            }
            ,
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }
        };

        try {
            const { data, status } = await GetDataWithSearchOrder(config);
            if (status === 200) {
                SetAddress({ id: 0 })
                setOrder(data.result.orderList.values);
                setTotalCount(data.result.orderList.totalCount)
                SetExtDataIds(data.result.orderList.values.map((item: any) => item.extId))
                setPageNumber(0)
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
                Id: Number(Id),
                UserName: userName,
                OrderStatusIds: orderStatusIds ? orderStatusIds.map((item: any) => item.value) : [],
                StartDate
                , EndDate
                , ExtId: Number(ExtId),
                AttachmentsOverDue: overDue,
                paymentStatusIds: paymentStatusIds ? paymentStatusIds.map((item: any) => item.value) : [],
                PaymentMethodIds: paymentMethodIds ? paymentMethodIds.map((item: any) => item.value) : [],
                ShippingStatusIds: shippingStatusIds ? shippingStatusIds.map((item: any) => item.value) : [],
                NationalCode: nationalCode,
                OrganizationNationalId: organizationNationalId,
                companyId,
                OrderDetailExtId,
                PageNumber,
                PageSize, SortColumn,
                OrganizationName, CustomerName,
                SortingDirectionId, IsAdmin: true, ExternalOrders, HasAddressWithoutInvoice, HasAddressWithoutShipping

            }
            ,
            paramsSerializer: (params: any) => {
                return QueryString.stringify(params)
            }
        };

        try {
            const { data, status } = await GetDataWithSearchOrder(config);
            if (status === 200) {
                SetAddress({ id: 0 })
                setOrder(data.result.orderList.values);
                setTotalCount(data.result.orderList.totalCount)
                SetExtDataIds(data.result.orderList.values.map((item: any) => item.extId))

                sessionStorage.setItem(`params${window.location.pathname}`, JSON.stringify(params));

                sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));

            }

        } catch (err) {
            console.log(err)
        }

    }
    const onHeaderClick = () => {
        return {

            onClick: (e: any) => {
                var siblings = [];




                // siblings = e.target.parentNode.getElementsByTagName('th');
                // for(let i = 0;i<siblings.length;i++){
                //     siblings[i].innerText = siblings[i].innerText.replace('🔼', '').replace('🔽', '');
                // }

                switch (e.target.innerText.replace('🔼', '').replace('🔽', '')) {

                    case 'شماره سفارش':

                        if (e.target.children[0].innerText === '') {
                            SortColumn = 'id'
                            SortingDirectionId = 1
                            e.target.children[0].innerText = '🔼'
                            getDataBySearch()
                        }

                        else if (e.target.children[0].innerText === '🔼') {
                            SortColumn = 'id'
                            SortingDirectionId = 2
                            e.target.children[0].innerText = '🔽'
                            getDataBySearch()

                        }
                        else if (e.target.children[0].innerText === '🔽') {

                            SortColumn = null
                            SortingDirectionId = null
                            e.target.children[0].innerText = ''
                            getDataBySearch()

                        }
                        break;
                    case 'تاریخ':

                        if (e.target.children[0].innerText === '') {
                            SortColumn = 'CreateDate'
                            SortingDirectionId = 1
                            e.target.children[0].innerText = '🔼'
                            getDataBySearch()

                        }
                        else if (e.target.children[0].innerText === '🔼') {

                            SortColumn = 'CreateDate'
                            SortingDirectionId = 2
                            e.target.children[0].innerText = '🔽'
                            getDataBySearch()

                        }
                        else if (e.target.children[0].innerText === '🔽') {
                            SortColumn = null
                            SortingDirectionId = null
                            e.target.children[0].innerText = ''
                            getDataBySearch()

                        }
                        break;

                    case 'مبلغ-ریال':

                        if (e.target.children[0].innerText === '') {
                            SortColumn = 'OrderFinalizedPrice'
                            SortingDirectionId = 1
                            e.target.children[0].innerText = '🔼'
                            getDataBySearch()

                        }
                        else if (e.target.children[0].innerText === '🔼') {

                            SortColumn = 'OrderFinalizedPrice'
                            SortingDirectionId = 2
                            e.target.children[0].innerText = '🔽'
                            getDataBySearch()

                        }
                        else if (e.target.children[0].innerText === '🔽') {

                            SortColumn = null
                            SortingDirectionId = null
                            e.target.children[0].innerText = ''
                            getDataBySearch()

                        }
                        break;
                    case 'وضعیت سفارش':


                        if (e.target.children[0].innerText === '') {
                            SortColumn = 'OrderStatusId'
                            SortingDirectionId = 1
                            e.target.children[0].innerText = '🔼'
                            getDataBySearch()
                        }
                        else if (e.target.children[0].innerText === '🔼') {

                            SortColumn = 'OrderStatusId'
                            SortingDirectionId = 2
                            e.target.children[0].innerText = '🔽'
                            getDataBySearch()

                        }
                        else if (e.target.children[0].innerText === '🔽') {

                            SortColumn = null
                            SortingDirectionId = null
                            e.target.children[0].innerText = ''
                            getDataBySearch()

                        }
                        break;
                    case 'وضعیت پرداخت':


                        if (e.target.children[0].innerText === '') {
                            SortColumn = 'PaymentStatusId'
                            SortingDirectionId = 1
                            e.target.children[0].innerText = '🔼'
                            getDataBySearch()

                        }
                        else if (e.target.children[0].innerText === '🔼') {

                            SortColumn = 'PaymentStatusId'
                            SortingDirectionId = 2
                            e.target.children[0].innerText = '🔽'
                            getDataBySearch()

                        }
                        else if (e.target.children[0].innerText === '🔽') {

                            SortColumn = null
                            SortingDirectionId = null
                            e.target.children[0].innerText = ''
                            getDataBySearch()

                        }

                        break;
                    case 'وضعیت ارسال':

                        if (e.target.children[0].innerText === '') {
                            SortColumn = 'ShippingStatusId'
                            SortingDirectionId = 1
                            e.target.children[0].innerText = '🔼'
                            getDataBySearch()

                        }
                        else if (e.target.children[0].innerText === '🔼') {

                            SortColumn = 'ShippingStatusId'
                            SortingDirectionId = 2
                            e.target.children[0].innerText = '🔽'
                            getDataBySearch()

                        }
                        else if (e.target.children[0].innerText === '🔽') {

                            SortColumn = null
                            SortingDirectionId = null
                            e.target.children[0].innerText = ''
                            getDataBySearch()

                        }
                        break;


                }


            }
        }

    }
    const GetOrders = async () => {

        let config = {
            headers: { 'Content-Type': 'application/json' },
            params: {
                Id: null,
                UserName: null,
                OrderStatusIds: [],
                StartDate: null
                , EndDate: null
                , ExtId: null,
                paymentStatusIds: [],
                AttachmentsOverDue: overDue,
                PaymentMethodIds: [],
                ShippingStatusIds: [],
                NationalCode: null,
                OrganizationNationalId: null,
                IsAdmin: true,
                OrderDetailExtId: null,
                ExternalOrders: null,
                PageNumber: 0,
                PageSize: 10
            }
            ,
            paramsSerializer: (params: any) => { return QueryString.stringify(params) }


        };
        try {
            const { data, status } = await GetDataWithSearchOrder(config);
            if (status === 200) {
                SetGetOrders(false)
                setOrder(data.result.orderList.values);
                setTotalCount(data.result.orderList.totalCount)

            }
        } catch (err) {
            console.log(err)
        }
    }
    const getOrganization = async () => {
        try {
            const { data, status } = await GetAllOrganisation();
            if (status === 200) { SetOrganisations(data.result.organizationLists.values) }
        } catch (error) {
            console.log(error);
        }
    }
    const getCompany = async () => {
        try {
            const { data, status } = await GetCompanyChild()
            if (status === 200) {
                setCompanies(data.result.companies)
            }

        } catch (error) {
            console.log(error);
        }

    }
    var formatter = new Intl.NumberFormat('fa-IR', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    });
    useEffect(() => {
        // GetOrders()
        getOrganization()
        getCompany()
        getDataByPage()
    }, [updateValue])

    const OrderKardex = async (id: any) => {

        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {
                OrderId: id

            }
            ,
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }

        };

        try {
            const { data, status } = await GetFinancialCardex(config)
            if (status === 200 && data.result.cardices.length > 0) {

                Navigate(`/admin/kartex/${id}`, { state: { 'Order': data.result.cardices } })



            }
            else if (status === 200 && data.result.cardices.length === 0) {
                toast.warning('اطلاعاتی جهت نمایش یافت نشد', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });
            }

        } catch (error) {

        }







    }

    const columns = useMemo(() => [

        {
            Header: 'شماره سفارش', accessor: 'id',
        },

        {
            Header: 'تاریخ', accessor: 'CreateDate'
            , Cell: (row: any) => {

                return (new Date(row.row.original.createDate).toLocaleDateString('fa-IR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }))
            }

        },
        {
            Header: 'خریدار ', accessor: 'CutomerName'
            , Cell: (row: any) => {
                let fName = row.row.original.customer.firstName;
                let lName = row.row.original.customer.lastName;
                let OName;
                if (row.row.original.customer.organizationId > 0) {

                    OName = organizations.filter((item: any) => item.id === row.row.original.customer.organizationId).map((item: any) => item.name)[0]
                }
                let fullname = `${fName ? fName : ''} ${lName ? lName : ''} ${OName ? (fName && lName) ? `( ${OName} ) ` : OName : ''} `;


                return (
                    <div className="con-tooltipList left" title='' >


                        {fullname}

                        <div className='tooltipList'>
                            <p></p>
                            <p>{`شماره همراه : ${row.row.original.customer.userName}`}</p>
                            {row.row.original.customer.nationalCode ? <p>{` کد ملی: ${row.row.original.customer.nationalCode ? row.row.original.customer.nationalCode : ''} `}</p> : ''}
                            {row.row.original.customer.organizationId > 0 ? <p>{`شناسه ملی سازمان: ${row.row.original.customer.organizationId > 0 ? organizations.filter((item: any) => item.id === row.row.original.customer.organizationId).map((item: any) => item.nationalId)[0] : ''} `}</p> : ''}
                            <p></p>

                        </div>

                    </div>

                )
            }
        },
        //{
        //     Header: ' کد ملی (شناسه ملی)', accessor: 'nationalCode', Cell: row => {
        //         let Ncode = row.row.original.customer.nationalCode;
        //         let OName;
        //         if (row.row.original.customer.organizationId > 0) {

        //             OName = organizations.filter((item: any) => item.id === row.row.original.customer.organizationId).map((item: any) => item.nationalId)
        //         }

        //         return (`${Ncode ? Ncode : ''} ${OName ? Ncode? `( ${OName} ) ` : OName : ''}`)
        //     }
        // },
        // }, {
        //     Header: 'سازمان', accessor: d => {
        //         let OName = organizations.filter((item: any) => item.id === d.customer.organizationId).map((item: any) => item.name)

        //         return (` ${d.OName} `)
        //     }
        //     , Cell: row => {

        //         let OName;
        //         if (row.row.original.customer.organizationId > 0) {

        //             OName = organizations.filter((item: any) => item.id === row.row.original.customer.organizationId).map((item: any) => item.name)
        //         }
        //         let fullname = `${OName ? OName : ''}`;
        //         if (fullname.length > 20) {

        //             return (<div title={fullname}> {fullname.substring(0, 20)}</div>)
        //         }
        //         else {
        //             return (fullname)
        //         }
        //     }
        // }, {
        //     Header: 'شناسه ملی', accessor: d => {
        //         let Ncode = d.customer.nationalCode;
        //         let OName = organizations.filter((item: any) => item.id === d.customer.organizationId).map((item: any) => item.nationalId)
        //         return (`${OName}`)

        //     }, Cell: row => {
        //         let Ncode = row.row.original.customer.nationalCode;
        //         let OName;
        //         if (row.row.original.customer.organizationId > 0) {

        //             OName = organizations.filter((item: any) => item.id === row.row.original.customer.organizationId).map((item: any) => item.nationalId)
        //         }
        //         let code = ` ${OName ? OName : ''}`
        //         return (code)
        //     }
        // },
        { Header: 'نام شرکت ', accessor: 'companyName' }, {
            Header: 'نحوه پرداخت', accessor: 'paymentMethodId', Cell: row => {
                return (PaymentStructureEnums.filter((item: any) => item.id === row.row.original.paymentMethodId).map((item: any) => item.name))
            }
        },
        // { Header: 'شماره همراه', accessor: 'customer.userName' },
        ,
        {
            Header: 'وضعیت ارسال', accessor: 'shippingStatusId', Cell: row => {

                return (

                    <div className=' rounded btn-sm darktext m-1
                'style={{ backgroundColor: `${ShippingStatusEnums.filter((i: any) => i.id === row.row.original.shippingStatusId).map((i: any) => i.color)}` }}>
                        {ShippingStatusEnums.filter((item: any) => item.id === row.row.original.shippingStatusId).map((item: any) => item.name)}
                    </div>
                )
            }
        },
        {
            Header: 'وضعیت سفارش', accessor: 'orderStatusId', Cell: row => {


                return (

                    <div className=' rounded btn-sm darktext m-1
                'style={{ backgroundColor: `${OrderStatus.filter((i: any) => i.id === row.row.original.orderStatusId).map((i: any) => i.color)}` }}>
                        {OrderStatus.filter((i: any) => i.id === row.row.original.orderStatusId).map((i: any) => i.name)}
                    </div>
                )

            }
        }
        ,

        {
            Header: 'وضعیت پرداخت', accessor: 'paymentStatusId', Cell: row => {
                return (

                    <div className='rounded btn-sm darktext m-1
                'style={{ backgroundColor: `${PaymentStatusEnums.filter((i: any) => i.id === row.row.original.paymentStatusId).map((i: any) => i.color)}` }}>
                        {PaymentStatusEnums.filter((i: any) => i.id === row.row.original.paymentStatusId).map((i: any) => i.name)}
                    </div>
                )
            }
        },
        {
            Header: 'مبلغ-ریال',
            accessor: 'orderFinalizedPrice',
            Cell: (row: any) => (formatter.format(row.row.original.orderFinalizedPrice))
        },
        {
            Header: 'مشاهده جزییات ', accessor: '', Cell: row => (<div>
                <Link className="border-0 bg-transparent non-hover edit-btn" to={`/admin/orderDetail/${row.row.original.id}`}>
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
                </Link>
            </div>
            )
        },

        {
            Header: 'عملیات', accessor: '', Cell: row => (

                roles.includes(2) ? '' : <div className=" btn-group">

                    <button className="m-1 p-0 border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip" data-placement="top"
                        title=' کارتکس سفارش '
                        onClick={e => OrderKardex(row.row.original.id)}>
                        <TbReportMoney size="1.5rem" />
                    </button>
                    <button className="border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip"
                        data-placement="top" title="ویرایش"
                        onClick={function () {
                            openModalEdit(row.row.original.id)
                            SetAddress({ id: 0 })
                        }}
                        disabled={roles.includes(8) ? false : true}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-edit-2">
                            <path
                                d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                    </button>


                </div>

            )
        }], [organizations])

    const data = useMemo(() => order, [order]);
    const formatTrProps = (state: any = {}) => {
        const orderDetail = async () => {
            setDetailAddress([])
            setOrderId(state.original.id)



            try {
                const { data, status } = await GetOrderDetailsAdmin(state.original.id)

                SetAddress(state)
                if (status === 200) {

                    Detail = data.result.orderDetails
                    await bindAdress(data.result.orderDetails)

                }
            } catch (err) {
                console.log(err)
            }

            // document.getElementsByClassName('expanded')[0].scrollIntoView({ behavior: "smooth", block: "center" })

        }
        {
            return {
                onClick: async () => {

                    SetShow(!show)

                    await orderDetail()
                },
            }
        }

    }
    const formHandler = () => {
        Navigate("/admin/addOrder")
    }

    const handelSearchFieldClear = () => {
        SetGetOrders(true)
        GetOrders()

        setOrderStatusIds([])
        setUserName('')
        setId('')
        setNationalCode('')
        setStartDate('')
        setEndDate('')
        setExtId('')
        SetOrganizationName('')
        SetCustomerName('')
        setOrderDetailExtId('')
        setPaymentStatusId([])
        setPaymentMethodIds([])
        setShippingStatusIds([])
        setOrganizationNationalId('')
        SetHasAddressWithoutShipping(false)
        SetHasAddressWithoutInvoice(false)
        SetoverDue(null)
        setCompanyId(null)
        SetExternalOrders(null)
        sessionStorage.clear()

        setPageNumber(0)
        setPageSize(10)
    }
    if (order) {
        const dataForExcel = data.map((item: any) => ({
            'شماره فاکتور': item.id,
            'خریدار': item.customer.firstName,
            'شماره همراه': item.customer.userName,
            'شماره ملی': item.customer.nationalCode,
            'نوع پرداخت': item.paymentMethodId === 2 ? 'نقدی' : 'نسیه',
            'وضعیت تخصیص': (ShippingStatusEnums.filter(data => data.id === item.shippingStatusId).map(data => data.name)[0]),
            'وضعیت سفارش': (OrderStatus.filter(data => data.id === item.orderStatusId).map(item => item.name)[0]),
            'تاریخ': (new Date(item.createDate).toLocaleDateString('fa-IR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })),
            'مبلغ': item.orderTotal
        }))
        return (<div className="rounded">
            <OrderEditList id={idEdit} closeModal={closeModalEdit} modalIsOpen={modalIsOpenEdit} updateParent={ForceUpdate} />
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
                        <div className="col-lg-2 col-md-4  col-sm-12  mb-4">
                            <label>شماره سفارش</label>
                            <input className="form-control opacityForInput  mb-4" type="text" placeholder="سفارش"
                                value={Id} onChange={(e: any) => setId(e.target.value)} /></div>

                        <div className="col-lg-2 col-md-4  col-sm-12  mb-4">
                            <label>نام مشتری </label>
                            <input className="form-control opacityForInput  mb-4" type="text" placeholder=" نام و نام خانوادگی"
                                value={CustomerName}
                                onChange={(e: any) => SetCustomerName(e.target.value)} /></div>

                        <div className="col-lg-2 col-md-4  col-sm-12  mb-4">
                            <label> کد ملی</label>
                            <input className="form-control opacityForInput  mb-4" type="text" placeholder="کد ملی"
                                maxLength={11} value={nationalCode}
                                onChange={(e: any) => setNationalCode(e.target.value)} /></div>
                        <div className="col-lg-2 col-md-4  col-sm-12  mb-4">
                            <label> نام سازمان</label>
                            <input className="form-control opacityForInput  mb-4" type="text" placeholder="نام سازمان "
                                value={OrganizationName}
                                onChange={(e: any) => SetOrganizationName(e.target.value)} /></div>
                        <div className="col-lg-2 col-md-4  col-sm-12  mb-4">
                            <label> شناسه ملی</label>
                            <input className="form-control opacityForInput  mb-4" type="text" placeholder="شناسه ملی"
                                maxLength={11} value={organizationNationalId}
                                onChange={(e: any) => setOrganizationNationalId(e.target.value)} /></div>
                        <div className="col-lg-2 col-md-4  col-sm-12  mb-4">
                            <label> شناسه خرید بازارگاه</label>


                            <input className="form-control opacityForInput  mb-4" type="text"
                                placeholder="شناسه خرید"
                                value={ExtId} onChange={(e: any) => setExtId(e.target.value)} />
                        </div>
                        <div className="col-lg-2 col-md-4  col-sm-12  mb-4">
                            <label> کد تخصیص</label>

                            <input className="form-control opacityForInput  mb-4" type="text" placeholder="کد تصیص"
                                value={OrderDetailExtId} onChange={(e: any) => setOrderDetailExtId(e.target.value)} />
                        </div>
                        <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                            style={{ marginBottom: "3rem" }}>
                            <div className=" form-control-sm">
                                <label>وضعیت ارسال </label>

                                <Select
                                    menuShouldScrollIntoView={false}
                                    value={shippingStatusIds}
                                    placeholder='وضعیت تخصیص'
                                    options={shippingId()}
                                    isMulti
                                    isClearable={true}
                                    onChange={e => {
                                        setShippingStatusIds(e)
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group selectIndex"
                            style={{ marginBottom: "3rem" }}>
                            <div className=" form-control-sm">
                                <label> وضعیت سررسید </label>
                                {overDue && overDue === null ?
                                    <Select
                                        menuShouldScrollIntoView={false}
                                        options={OverDue()}
                                        onChange={(e: any) => {
                                            SetoverDue(e.value)
                                        }}
                                    /> : <Select
                                        menuShouldScrollIntoView={false}
                                        value={OverDue().filter(i => i.value === overDue).map(i => i)}

                                        placeholder=' وضعیت سررسید '
                                        options={OverDue()}
                                        onChange={(e: any) => {
                                            SetoverDue(e.value)
                                        }}
                                    />}

                            </div>
                        </div>

                        <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                            style={{ marginBottom: "3rem" }}>
                            <div className=" form-control-sm">
                                <label>وضعیت پرداخت </label>

                                <Select
                                    menuShouldScrollIntoView={false}
                                    value={paymentStatusIds}
                                    placeholder='وضعیت پرداخت'
                                    options={PaymentStatus()}
                                    isMulti
                                    isClearable={true}
                                    onChange={e => {
                                        setPaymentStatusId(e)
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                            style={{ marginBottom: "3rem" }}>
                            <div className=" form-control-sm">
                                <label>وضعیت سفارش</label>

                                <Select
                                    menuShouldScrollIntoView={false}
                                    value={orderStatusIds}
                                    placeholder='وضعیت سفارش'
                                    options={OrderStatusID()}
                                    isMulti
                                    isClearable={true}
                                    onChange={e => {
                                        setOrderStatusIds(e)
                                    }} />
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                            style={{ marginBottom: "3rem" }}>
                            <div className=" form-control-sm">
                                <label> نحوه پرداخت </label>

                                <Select
                                    menuShouldScrollIntoView={false}
                                    value={paymentMethodIds}
                                    placeholder=' پرداخت '
                                    options={paymentMethodIDs()}
                                    isMulti
                                    isClearable={true}
                                    onChange={(e: any) => {
                                        setPaymentMethodIds(e)
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                            style={{ marginBottom: "3rem" }}>
                            <div className=" form-control-sm">
                                <label>  مبدا سفارش </label>


                                {ExternalOrders && ExternalOrders === null ? <Select
                                    menuShouldScrollIntoView={false}

                                    placeholder=' مبدا سفارش  '
                                    options={ExternalOrdersID()}


                                    onChange={(e: any) => {
                                        console.log(e);

                                        SetExternalOrders(e.value)
                                    }}
                                /> : <Select
                                    menuShouldScrollIntoView={false}
                                    value={ExternalOrdersID().filter((i: any) => i.value === ExternalOrders).map((i: any) => i)}
                                    placeholder=' مبدا سفارش  '
                                    options={ExternalOrdersID()}


                                    onChange={(e: any) => {
                                        console.log(e);

                                        SetExternalOrders(e.value)
                                    }}
                                />}
                            </div>
                        </div>
                        {companies.length > 1 ? <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                            style={{ marginBottom: "3rem" }}>
                            <div className=" form-control-sm">
                                <label> نام شرکت </label>

                                {companyId && companyId === null ?
                                    <Select
                                        menuShouldScrollIntoView={false}
                                        options={CompaniesIDs()}
                                        onChange={(e: any) => {
                                            setCompanyId(e.value)
                                        }}
                                    /> : <Select
                                        value={CompaniesIDs().filter(i => i.value === companyId).map(i => i)}
                                        menuShouldScrollIntoView={false}
                                        placeholder='نام شرکت'
                                        options={CompaniesIDs()}
                                        onChange={(e: any) => {
                                            setCompanyId(e.value)

                                        }}
                                    />}
                            </div>
                        </div> : ''}
                        <div className="col-lg-4 col-md-4  col-sm-12 d-flex flex-column " style={{ zIndex: 0 }}>
                            <div className="col-lg-6 col-md-4  col-sm-12 ">

                                <input type="checkbox" checked={HasAddressWithoutShipping} onClick={(e: any) => SetHasAddressWithoutShipping(e.target.checked)} />
                                <label className="ml-3">دارای آدرس و فاقد حواله</label>

                            </div>
                            <div className="col-lg-6 col-md-4  col-sm-12 ">

                                <input type="checkbox" checked={HasAddressWithoutInvoice} onClick={(e: any) => SetHasAddressWithoutInvoice(e.target.checked)} />
                                <label className="ml-3">دارای آدرس و فاقد صورتحساب</label>

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
            </div>
            {getDefault().organizationNationalId || getDefault().overDue || getDefault().EndDate || getDefault().ExtId || getDefault().Id || getDefault().OrderDetailExtId || getDefault().StartDate || getDefault().orderStatusIds || getDefault().paymentMethodIds || getDefault().shippingStatusIds || getDefault().userName || getDefault().paymentStatusIds ?
                <span className="d-block p-3 text-center w-100 bg-light-primary  " style={{ fontSize: "15px" }}>نمایش اطلاعات بر اساس فیلتر  </span> : null}
            <div className=" statbox widget-content widget-content-area rounded">
                <div>
                    <button className="btn btn-primary m-3" onClick={formHandler}>ثبت سفارش  جدید</button>
                    <MyTableClick columns={columns} data={data} getData={(rows: any) => setSelectedRows(rows)}
                        bulkJob={getBulkJob} formatRowProps={(state: any) => formatTrProps(state)}
                        show={address}
                        address={extDataIds}
                        setPageSize={setPageSize}
                        PageSize={PageSize}
                        total={totalCount}
                        getDataBySearch={getDataByPage}
                        setPageNumber={setPageNumber}
                        PageNumber={PageNumber}
                        Detail={DetailAddress}
                        clickableHeader={onHeaderClick}
                        showAddress={show}

                    />
                    <ModalGroupWork open={open} close={close} success={stateSuccess} error={stateError} />
                </div>
                <div className="d-flex justify-content-end">
                    <ExportToExcelProVersion url={`Order/GetOrders${urlForExcel()}`} fileName='لیست سفارشات' />
                </div>
            </div>
        </div>
        )
    } else {
        return (
            <div className='user-progress'>
                <div className='row'>
                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                    </div>
                </div>
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
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-4">
                                <label>شماره سفارش</label>
                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="سفارش"
                                    value={Id} onChange={(e: any) => setId(e.target.value)} /></div>

                            <div className="col-lg-2 col-md-4  col-sm-12  mb-4">
                                <label>نام مشتری </label>
                                <input className="form-control opacityForInput  mb-4" type="text" placeholder=" نام و نام خانوادگی"
                                    value={CustomerName}
                                    onChange={(e: any) => SetCustomerName(e.target.value)} /></div>

                            <div className="col-lg-2 col-md-4  col-sm-12  mb-4">
                                <label> کد ملی</label>
                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="کد ملی"
                                    maxLength={11} value={nationalCode}
                                    onChange={(e: any) => setNationalCode(e.target.value)} /></div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-4">
                                <label> نام سازمان</label>
                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="نام سازمان "
                                    value={OrganizationName}
                                    onChange={(e: any) => SetOrganizationName(e.target.value)} /></div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-4">
                                <label> شناسه ملی</label>
                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="شناسه ملی"
                                    maxLength={11} value={organizationNationalId}
                                    onChange={(e: any) => setOrganizationNationalId(e.target.value)} /></div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-4">
                                <label> شناسه خرید بازارگاه</label>


                                <input className="form-control opacityForInput  mb-4" type="text"
                                    placeholder="شناسه خرید"
                                    value={ExtId} onChange={(e: any) => setExtId(e.target.value)} />
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-4">
                                <label> کد تخصیص</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="کد تصیص"
                                    value={OrderDetailExtId} onChange={(e: any) => setOrderDetailExtId(e.target.value)} />
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>وضعیت ارسال </label>

                                    <Select
                                        menuShouldScrollIntoView={false}
                                        value={shippingStatusIds}
                                        placeholder='وضعیت تخصیص'
                                        options={shippingId()}
                                        isMulti
                                        isClearable={true}
                                        onChange={e => {
                                            setShippingStatusIds(e)
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group selectIndex"
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label> وضعیت سررسید </label>
                                    {overDue && overDue === null ?
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            options={OverDue()}
                                            onChange={(e: any) => {
                                                SetoverDue(e.value)
                                            }}
                                        /> : <Select
                                            menuShouldScrollIntoView={false}
                                            value={OverDue().filter(i => i.value === overDue).map(i => i)}

                                            placeholder=' وضعیت سررسید '
                                            options={OverDue()}
                                            onChange={(e: any) => {
                                                SetoverDue(e.value)
                                            }}
                                        />}

                                </div>
                            </div>

                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>وضعیت پرداخت </label>

                                    <Select
                                        menuShouldScrollIntoView={false}
                                        value={paymentStatusIds}
                                        placeholder='وضعیت پرداخت'
                                        options={PaymentStatus()}
                                        isMulti
                                        isClearable={true}
                                        onChange={e => {
                                            setPaymentStatusId(e)
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>وضعیت سفارش</label>

                                    <Select
                                        menuShouldScrollIntoView={false}
                                        value={orderStatusIds}
                                        placeholder='وضعیت سفارش'
                                        options={OrderStatusID()}
                                        isMulti
                                        isClearable={true}
                                        onChange={e => {
                                            setOrderStatusIds(e)
                                        }} />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label> نحوه پرداخت </label>

                                    <Select
                                        menuShouldScrollIntoView={false}
                                        value={paymentMethodIds}
                                        placeholder=' پرداخت '
                                        options={paymentMethodIDs()}
                                        isMulti
                                        isClearable={true}
                                        onChange={(e: any) => {
                                            setPaymentMethodIds(e)
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>  مبدا سفارش </label>


                                    {ExternalOrders && ExternalOrders === null ? <Select
                                        menuShouldScrollIntoView={false}

                                        placeholder=' مبدا سفارش  '
                                        options={ExternalOrdersID()}


                                        onChange={(e: any) => {
                                            console.log(e);

                                            SetExternalOrders(e.value)
                                        }}
                                    /> : <Select
                                        menuShouldScrollIntoView={false}
                                        value={ExternalOrdersID().filter((i: any) => i.value === ExternalOrders).map((i: any) => i)}
                                        placeholder=' مبدا سفارش  '
                                        options={ExternalOrdersID()}


                                        onChange={(e: any) => {
                                            console.log(e);

                                            SetExternalOrders(e.value)
                                        }}
                                    />}
                                </div>
                            </div>
                            {companies.length > 1 ? <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label> نام شرکت </label>

                                    {companyId && companyId === null ?
                                        <Select
                                            menuShouldScrollIntoView={false}
                                            options={CompaniesIDs()}
                                            onChange={(e: any) => {
                                                setCompanyId(e.value)
                                            }}
                                        /> : <Select
                                            value={CompaniesIDs().filter(i => i.value === companyId).map(i => i)}
                                            menuShouldScrollIntoView={false}
                                            placeholder='نام شرکت'
                                            options={CompaniesIDs()}
                                            onChange={(e: any) => {
                                                setCompanyId(e.value)

                                            }}
                                        />}
                                </div>
                            </div> : ''}
                            <div className="col-lg-4 col-md-4  col-sm-12 d-flex flex-column " style={{ zIndex: 0 }}>
                                <div className="col-lg-6 col-md-4  col-sm-12 ">

                                    <input type="checkbox" checked={HasAddressWithoutShipping} onClick={(e: any) => SetHasAddressWithoutShipping(e.target.checked)} />
                                    <label className="ml-3">دارای آدرس و فاقد حواله</label>

                                </div>
                                <div className="col-lg-6 col-md-4  col-sm-12 ">

                                    <input type="checkbox" checked={HasAddressWithoutInvoice} onClick={(e: any) => SetHasAddressWithoutInvoice(e.target.checked)} />
                                    <label className="ml-3">دارای آدرس و فاقد صورتحساب</label>

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
                </div>
                {
                    getDefault().organizationNationalId || getDefault().overDue || getDefault().EndDate || getDefault().ExtId || getDefault().Id || getDefault().OrderDetailExtId || getDefault().StartDate || getDefault().orderStatusIds || getDefault().paymentMethodIds || getDefault().shippingStatusIds || getDefault().userName || getDefault().paymentStatusIds ?
                        <span className="d-block p-3 text-center w-100 bg-light-primary  " style={{ fontSize: "15px" }}>نمایش اطلاعات بر اساس فیلتر  </span> : null
                }

                <div className=" statbox widget-content widget-content-area">
                    <div>
                        <div className='text-center mt-5'>
                            <h5>اطلاعاتی جهت نمایش موجود نیست</h5>
                        </div>
                    </div>
                </div>


            </div >
        )
    }
}
export default OrderList