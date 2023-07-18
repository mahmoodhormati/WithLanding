import { useEffect, useState } from "react";
import { DeleteShipping, GetShipping, GetShippingCompanies, SetShippingCompany } from "../../../services/ShippingService";
import Modal from "react-modal";

import { useMemo } from "react";
import AdvancedSearch from "../../../Common/Shared/Common/AdvancedSearch";
import MyTable from "../../../Common/Shared/Form/MyTable";
import ModalGroupWork from "../../../Common/Shared/Common/ModalGroupWork";
import { ExportToExcel } from "../../../Common/Shared/Common/ExportToExcel";
import QueryString from "qs";

import { DeliveryMethods } from "../../../Common/Enums/DeliveryMethodsEnums";
import { MeasureUnitSample } from "../../../Common/Enums/MeasureUnitSample";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useNavigate } from "react-router";
import { GetOrderByDetailId } from "../../../services/orderService";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { EntityTypes } from "../../../Common/Enums/EntityTypesEnums";
import Select from "react-select";
import ExtraShippingAdmin from "../../../Common/Shared/order/ExtraShippingAdmin";
import { toast } from "react-toastify";
import { NotifyShippingCompany } from "../../../services/outScopeService";
import { ClipLoader } from "react-spinners";
import { ExportToExcelProVersion } from "../../../Utils/ExportToExcelProVersion";
const customStyles = {
    content: {
      inset: "50% auto auto 50%",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "5%",
      border: "2px ridge black",
      maxHeight: '80vh'
  
    },
  };
const ShippingList = () => {
    const [shipping, setShipping] = useState([])
    const companies = useSelector((state: RootState) => state.companies)
    const [stateSuccess, SetStateSuccess] = useState(0)
    const [stateError, SetStateError] = useState(0)
    const [PageNumber, setPageNumber] = useState(getPage().PageNumber ? getPage().PageNumber : 0)
    const [PageSize, setPageSize] = useState(getPage().PageSize ? getPage().PageSize : 10)
    const [EntityId, setEntityId] = useState(getDefault().EntityId ? getDefault().EntityId : null)
    const [EntityTypeId, setEntityTypeId] = useState(getDefault().EntityTypeId ? getDefault().EntityTypeId : null)
    const [MeasureUnitId, setMeasureUnitId] = useState(getDefault().MeasureUnitId ? getDefault().MeasureUnitId : null)
    const [MinPlannedQuantity, setMinPlannedQuantity] = useState(getDefault().MinPlannedQuantity ? getDefault().MinPlannedQuantity : null)
    const [MaxPlannedQuantity, setMaxPlannedQuantity] = useState(getDefault().MaxPlannedQuantity ? getDefault().MaxPlannedQuantity : null)
    const [MinShippedQuantity, setMinShippedQuantity] = useState(getDefault().MinShippedQuantity ? getDefault().MinShippedQuantity : null)
    const [MaxShippedQuantity, setMaxShippedQuantity] = useState(getDefault().MaxShippedQuantity ? getDefault().MaxShippedQuantity : null)
    const [ShippingContractId, setShippingContractId] = useState(getDefault().ShippingContractId ? getDefault().ShippingContractId : null)
    const [selectedRows, setSelectedRows] = useState([])
    const [totalCount, setTotalCount] = useState(0);
    const [CreateStartDate, setCreateStartDate] = useState(getDefault().CreateStartDate ? getDefault().CreateStartDate : '')
    const [CreateEndtDate, setCreateEndtDate] = useState(getDefault().CreateEndtDate ? getDefault().CreateEndtDate : '')
    const [ShippingStartDate, setShippingStartDate] = useState(getDefault().ShippingStartDate ? getDefault().ShippingStartDate : '')
    const [ShippingEndtDate, setShippingEndtDate] = useState(getDefault().ShippingEndtDate ? getDefault().ShippingEndtDate : '')
    const [CottageCode, setCottageCode] = useState(getDefault().CottageCode ? getDefault().CottageCode : '')
    const [DeliveryMethodIds, setDeliveryMethodIds] = useState(getDefault().DeliveryMethodIds ? getDefault().DeliveryMethodIds : [])
    const [CompanyId, SetCompanyId] = useState(getDefault().CompanyId ? getDefault().CompanyId : null)
    const [ProductId, SetProductId] = useState(getDefault().ProductId ? getDefault().ProductId : null)
    const [modalOpen, setIsModalOpen] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()
    const [OnlyShipped, SetOnlyShipped] = useState(false);
    const [NotYetShipped, SetNotYetShipped] = useState(false);
    const [id, setId] = useState<any>(0);
    const [IdDelete, setIdDelete] = useState(0);
    const [isloading, setIsLoading] = useState(false);
    const[shippingIds,SetShippingIds]=useState<any>()

    const [open, SetOpen] = useState(false);
    const params = {
        EntityId, EntityTypeId,
        CottageCode,
        CreateEndtDate,
        CreateStartDate,
        MeasureUnitId,
        MinPlannedQuantity,
        MaxShippedQuantity,
        MinShippedQuantity,
        ShippingStartDate,
        ShippingEndtDate,
        DeliveryMethodIds,
        ShippingContractId,
        CompanyId, ProductId,OnlyShipped,NotYetShipped,Ids:shippingIds,


    }
    function getDefault() {
        let items = JSON.parse(String(sessionStorage.getItem(`param${window.location.pathname}`)));
        return items ? items : ''

    }
    const close = () => {
        SetOpen(false);
    }
    const handelStartDate = (value: any) => {
        if (value === null) {
            setCreateStartDate('')
        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            setCreateStartDate(new Date(value.toDate()))



        }
    }


    const openModal = (id: any) => {
        setId(id);
        setIsOpen(true);
    };

    const closeModal = () => {
        setId(null);
        setIsOpen(false);
    };

    const openModalDelet = (id: any) => {
        setIsModalOpen(true);
        setIdDelete(id);
    };
    const closeModalDelet = () => {
        setIsModalOpen(false);
    };

    const handelEndDate = (value: any) => {
        if (value === null) {
            setCreateEndtDate('')
        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            setCreateEndtDate(new Date(value.toDate()))
        }
    }
    const handelShippingStartDate = (value: any) => {
        if (value === null) {
            setShippingStartDate('')
        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            setShippingStartDate(new Date(value.toDate()))



        }
    }

    const handelShippingEndDate = (value: any) => {
        if (value === null) {
            setShippingEndtDate('')
        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            setShippingEndtDate(new Date(value.toDate()))
        }
    }

    const handelCallNotifyShipping = async (id: any) => {
        setIsLoading(true)
        let body = {
            "shippingId": id
        }
        try {
            const { data, status } = await NotifyShippingCompany(body)

            if (status === 200) {
                toast.success("حواله با موفقیت برای باربری ارسال شد", {
                    position: "top-right",
                    closeOnClick: true,
                });
                setIsLoading(false)
                getDataByPage()


            }

        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
    }
    const deleteShipping = async () => {
        setIsLoading(true)
        try {
            const { data, status } = await DeleteShipping(IdDelete)

            if (status === 200) {
                toast.success("حواله با موفقیت حذف شد", {
                    position: "top-right",
                    closeOnClick: true,
                });
                closeModalDelet();
                setIsLoading(false)
                getDataByPage()


            }

        } catch (error) {
            console.log(error);
            closeModalDelet();
            setIsLoading(false)

        }
    }
    const urlForExcel = () => {

        let parameter = {
            CottageCode,
                EntityId,
                EntityTypeId,
                CreateStartDate,
                CreateEndtDate,
                PageNumber:0,
                PageSize:100000000,
                SortColumn,
                SortingDirectionId,
                MeasureUnitId,
                MinPlannedQuantity,
                MaxShippedQuantity,
                MinShippedQuantity,
                ShippingStartDate,
                ShippingEndtDate,
                DeliveryMethodIds,
                ShippingContractId,
                CompanyId, ProductId,
                OnlyShipped:OnlyShipped===true?OnlyShipped:null,NotYetShipped:NotYetShipped===true?NotYetShipped:null,
                Ids:shippingIds,
                IsAdmin: true



        }



        let url = QueryString.stringify(parameter)


        return (`?${url}`)



    }

    const getDataBySearch = async () => {
        let config = {
            headers: { 'Content-Type': 'application/json' },
            params: {
                CottageCode,
                EntityId,
                EntityTypeId,
                CreateStartDate,
                CreateEndtDate,
                PageNumber,
                PageSize,
                SortColumn,
                SortingDirectionId,
                MeasureUnitId,
                MinPlannedQuantity,
                MaxShippedQuantity,
                MinShippedQuantity,
                ShippingStartDate,
                ShippingEndtDate,
                DeliveryMethodIds,
                ShippingContractId,
                CompanyId, ProductId,
                OnlyShipped:OnlyShipped===true?OnlyShipped:null,NotYetShipped:NotYetShipped===true?NotYetShipped:null,
                Ids:shippingIds,
                IsAdmin: true


            }
            ,
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }
        };

        try {
            const { data, status } = await GetShipping(config);
            if (status === 200) {
                setShipping(data.result.shippings.values);
                setTotalCount(data.result.shippings.totalCount)
                setPageNumber(0)

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
                CottageCode,
                EntityId,
                EntityTypeId,
                CreateStartDate,
                CreateEndtDate,
                PageNumber,
                PageSize,
                SortColumn,
                SortingDirectionId,
                MeasureUnitId,
                MinPlannedQuantity,
                MaxShippedQuantity,
                MinShippedQuantity,
                ShippingStartDate,
                ShippingEndtDate,
                DeliveryMethodIds,
                ShippingContractId,
                CompanyId, ProductId,
                Ids:shippingIds,
                OnlyShipped:OnlyShipped===true?OnlyShipped:null,NotYetShipped:NotYetShipped===true?NotYetShipped:null,
                IsAdmin: true


            },
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }


        };

        try {
            const { data, status } = await GetShipping(config)
            if (status === 200) {

                setShipping(data.result.shippings.values)
                setTotalCount(data.result.shippings.totalCount)
                sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));

            }
        } catch (error) {
            console.log(error);
        }
    }

    let SortColumn: any = null
    let SortingDirectionId: any = null
    const param = { PageSize, PageNumber }
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
        } if (selected === 4) {
            DeleteSelectedItem()
        }
        if (selected === 5) {
            disableSelectedItem()
        }
    }
    const DeleteSelectedItem = async () => {

    }
    const copySelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        const copyData = arrayOfData.map((item: any) => { return { ...item, id: 0, active: true, createDate: new Date() } })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            try {


                const { data, status } = await SetShippingCompany(copyData[i])
                if (status === 200) {
                    SetOpen(true)

                    SetStateSuccess(successCount += 1)
                }


            } catch (error) {
                SetOpen(true)

                SetStateError(errorCount += 1)
            }


        }


    }
    const enableSelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        const copyData = arrayOfData.map((item: any) => { return { ...item, active: true } })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            try {


                const { data, status } = await SetShippingCompany(copyData[i])
                if (status === 200) {
                    SetOpen(true)

                    SetStateSuccess(successCount += 1)
                }


            } catch (error) {
                SetOpen(true)

                SetStateError(errorCount += 1)
            }


        }


    }
    const disableSelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        const copyData = arrayOfData.map((item: any) => { return { ...item, active: false } })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            try {

                let payload = {
                    'shippingCompany': copyData[i]
                }

                const { data, status } = await SetShippingCompany(copyData[i])
                if (status === 200) {
                    SetOpen(true)

                    SetStateSuccess(successCount += 1)
                }



            } catch (error) {
                SetOpen(true)

                SetStateError(errorCount += 1)
            }


        }


    }
    function getPage() {
        let items = JSON.parse(String(sessionStorage.getItem(`param${window.location.pathname}`)));
        return items ? items : ''


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

                    case 'مقداربرنامه ریزی شده':

                        if (e.target.children[0].innerText === '') {
                            SortColumn = 'plannedQuantity'
                            SortingDirectionId = 1
                            e.target.children[0].innerText = '🔼'
                            getDataBySearch()

                        }
                        else if (e.target.children[0].innerText === '🔼') {

                            SortColumn = 'plannedQuantity'
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
                    case 'مقدار ارسال شده ':


                        if (e.target.children[0].innerText === '') {
                            SortColumn = 'shippedQuantity'
                            SortingDirectionId = 1
                            e.target.children[0].innerText = '🔼'
                            getDataBySearch()
                        }
                        else if (e.target.children[0].innerText === '🔼') {

                            SortColumn = 'shippedQuantity'
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
                    case 'نحوه ارسال':

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
    const getShipping = async () => {

        let config = {

            headers: { 'Content-Type': 'application/json' },

            params: {

                PageNumber: 0,
                PageSize: 10,


                IsAdmin: true


            },
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }


        };

        try {
            const { data, status } = await GetShipping(config)


            setShipping(data.result.shippings.values)
            setTotalCount(data.result.shippings.totalCount)

        } catch (e) {
            console.log(e)
        }
    }
    // useEffect(() => {

    //     //getShipping()
    // }, [getOrders])
    const handelNavigateWithId = (id: number) => {
        window.open(`${window.location.origin}/admin/orderDetail/${id}`)
        // navigate(`/admin/orderDetail/${id}`)
    }

    const handelNavigateWithDetails = async (id: number) => {

        try {
            const { data, status } = await GetOrderByDetailId(id)
            if (status === 200) {

                window.open(`${window.location.origin}/admin/orderDetail/${data.result.order.id}`)
            }
        } catch (error) {

            console.log(error);

        }





    }

    const CompaniesIDs = () => {
        let all = companies.map((data: any) => ({ label: data.name, value: data.id }))
        return ([{ label: "همه", value: null }, ...all])
    }
    const EntityTypesIDs = () => {
        let all = EntityTypes.filter((item: any) => item.id === 10 || item.id === 11).map((data: any) => ({ label: data.name, value: data.id }))
        return ([{ label: "همه", value: null }, ...all])
    }

    const columns = useMemo(() => [
        { Header: '#', accessor: 'id' },
        ,
        {
            Header: 'شناسه ', accessor: 'entityId', Cell: (row: any) => {

                if (row.row.original.entityTypeId === 10) {

                    return (

                        <button className='border-0 bg-transparent text-primary' onClick={() => handelNavigateWithId(row.row.original.entityId)}>{`سفارش #${row.row.original.entityId}`} </button>

                    )
                }
                else {

                    return (


                        <button className='border-0 bg-transparent text-primary ' onClick={() => handelNavigateWithDetails(row.row.original.entityId)}>{`جزییات سفارش # ${row.row.original.entityId}`} </button>
                    )
                }


            }
        },

        , {
            Header: 'واحد', accessor: 'measureUnitId', Cell: (row: any) => {
                return (MeasureUnitSample.filter(item => item.id === row.row.original.measureUnitId).map(item => item.name))
            }
        }
        , { Header: 'مقدار حواله', accessor: 'plannedQuantity' }
        , { Header: 'مقدار حمل شده', accessor: 'shippedQuantity' }
        , {
            Header: 'تاریخ', accessor: 'createDate', Cell: row => {

                return (new Date(row.row.original.createDate).toLocaleDateString('fa-IR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }))
            }
        }




        , {
            Header: 'وضعیت ارسال', accessor: 'shipped', Cell: row => {
                return row.row.original.shipped === true ? "ارسال شده" : "-"
            }
        }
        , {
            Header: 'تاریخ ارسال', accessor: 'shippingDate', Cell: row => {

                if (row.row.original.shippingDate !== null) {
                    return (new Date(row.row.original.shippingDate).toLocaleDateString('fa-IR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    }))
                }
                else {
                    return ('--')

                }
            }
        }
        , {
            Header: 'نحوه ارسال', accessor: 'deliveryMethodId', Cell: row => {
                return (DeliveryMethods.filter(item => item.id === row.row.original.deliveryMethodId).map(item => item.name))
            }
        }

        , { Header: 'شماره قرارداد', accessor: 'shippingContractCode' }
        , { Header: 'نام باربری', accessor: 'shippingCompanyName' }

        , {
            Header: 'گزارش بار', accessor: ' getReoprts', Cell: row => {

                return (
                    <div >
                        {" "}
                        <svg
                            onClick={() => openModal(row.row.original.id)}
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            viewBox="0 0 256 256"
                        ><rect width="256" height="256" fill="none" /> <line
                                x1="201.1"
                                y1="127.3"
                                x2="224"
                                y2="166.8"
                                fill="none"
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="12"
                            /> <line
                                x1="154.2"
                                y1="149.3"
                                x2="161.3"
                                y2="189.6"
                                fill="none"
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="12"
                            /><line
                                x1="101.7"
                                y1="149.2"
                                x2="94.6"
                                y2="189.6"
                                fill="none"
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="12"
                            /> <line
                                x1="54.8"
                                y1="127.3"
                                x2="31.9"
                                y2="167"
                                fill="none"
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="12"
                            /><path
                                d="M32,104.9C48.8,125.7,79.6,152,128,152s79.2-26.3,96-47.1"
                                fill="none"
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="12"
                            />
                        </svg>
                    </div>

                )

            }
        },

        , {
            Header: 'عملیات', accessor: ' Todo', Cell: row => {
                return (<div>
                    {row.row.original.notifyProvider === true ? <button className="btn btn-sm btn-warning mr-1" onClick={() => handelCallNotifyShipping(row.row.original.id)}>اطلاع به باربری
                        <ClipLoader
                            loading={isloading}
                            color="#fff"
                            size={15}
                        /></button> : ''}
                    {row.row.original.notifyProvider === true || row.row.original.notifyProvider === null ? <button

                        onClick={() => openModalDelet(row.row.original.id)}
                        className="border-0 bg-transparent non-hover edit-btn m-1"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="حذف"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-trash-2"
                        >
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button> : ''}
                    
                </div>)
            }
        }

    ], [shipping])
    const data = useMemo(() => shipping, [shipping]);
    const handelSearchFieldClear = () => {
        getShipping()
        SetProductId(null)
        SetCompanyId(null)
        setEntityTypeId(null)
        setShippingContractId(null)
        setDeliveryMethodIds([])
        setCottageCode("")
        setShippingEndtDate('')
        setShippingStartDate('')
        SetOnlyShipped(false)
        SetNotYetShipped(false)
        setMaxPlannedQuantity('')
        setMinPlannedQuantity('')
        setMaxShippedQuantity('')
        setMinShippedQuantity('')
        setEntityId('')
        SetShippingIds([])
        setCreateEndtDate('')
        setCreateStartDate('')
        MeasureUnitId(null)
        setPageNumber(0)
        setPageSize(10)
      
        
        sessionStorage.clear()

    }
    if (shipping) {
        const dataForExcel = data.map((item: any) => ({

            'شناسه ': item.id,
            'شناسه سفارش': item.EntityId,
            'تاریخ': (new Date(item.createDate).toLocaleDateString('fa-IR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })),
            'کد کوتاژ': item.cottageCode,
            'حواله شده': item.plannedQuantity,
            'ارسال شده': item.shippedQuantity,
            'واحد': (MeasureUnitSample.filter(i => i.id === item.measureUnitId).map(item => item.name))[0],
            'وضعیت ارسال': (item.shipped === true ? "ارسال شده" : "-"),
            'تاریخ ارسال': (new Date(item.shippingDate).toLocaleDateString('fa-IR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })),
            'نحوه ارسال': (DeliveryMethods.filter(i => i.id === item.deliveryMethodId).map(item => item.name))[0],
            'شناسه قرارداد باربری': item.shippingContractId,
            'نام برباری': item.companyName,
            'شماه قرارداد': item.contractCode,

        }))
        return (
            <div>
                <div className='row'>
                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 '>


                    </div>
                </div>
                <div className=" statbox widget-content widget-content-area mb-1 mt-1 p-2 my-1   rounded">
                    <AdvancedSearch>

                        <form className='form-row  form-group textOnInput'>


                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">

                                <label style={{
                                    position: 'absolute',
                                    zIndex: '1',
                                    top: '-15px',
                                    right: '10px',
                                    background: 'none',
                                    padding: '0 8px'
                                }}>تاریخ ایجاد از</label>
                                <div className='form-group opacityForInput '>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                        value={CreateStartDate}
                                        onChange={handelStartDate}

                                    />

                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label style={{
                                    position: 'absolute',
                                    zIndex: '1',
                                    top: '-15px',
                                    right: '10px',
                                    background: 'none',
                                    padding: '0 8px'
                                }}>تاریخ ایجاد تا</label>
                                <div className='form-group  '>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                        value={CreateEndtDate}
                                        onChange={handelEndDate}

                                    />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
                                <label>کد کوتاژ</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="  کد کوتاژ " value={CottageCode} onChange={e => setCottageCode(Number(e.target.value))} />
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
                                <label> شماره حواله</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="  شماره حواله " value={shippingIds} onChange={e => {
if(e.target.value.includes(',')){
    SetShippingIds(e.target.value.split(','))
}
else{
    SetShippingIds([e.target.value])
}

                                }} />
                            </div>

                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1">

                                <label> شناسه </label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="شناسه سفارش" value={EntityId} onChange={e => setEntityId(Number(e.target.value))} />
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

                                            
                                            onChange={(e: any) => {
                                                setEntityTypeId(e.value)
                                            }}
                                        /> : <Select
                                            menuShouldScrollIntoView={false}
                                            placeholder="نوع صورتحساب"
                                            options={EntityTypesIDs()}
                                            value={EntityTypesIDs().filter((i: any) => i.value === EntityTypeId).map((i: any) => i)}

                                           
                                            onChange={(e: any) => {
                                                setEntityTypeId(e.value)
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

                            <div className="col-lg-2 col-md-4  col-sm-12  ">

                                <label style={{
                                    position: 'absolute',
                                    zIndex: '1',
                                    top: '-15px',
                                    right: '10px',
                                    background: 'none',
                                    padding: '0 8px'
                                }}>تاریخ حمل از</label>
                                <div className='form-group opacityForInput '>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                        value={ShippingStartDate}
                                        onChange={handelShippingStartDate}

                                    />

                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12  ">
                                <label style={{
                                    position: 'absolute',
                                    zIndex: '1',
                                    top: '-15px',
                                    right: '10px',
                                    background: 'none',
                                    padding: '0 8px'
                                }}>تاریخ  حمل تا</label>
                                <div className='form-group  '>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                        value={ShippingEndtDate}
                                        onChange={handelShippingEndDate}

                                    />
                                </div>
                            </div>

                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
                                <label> مقدار حواله از</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="   حداقل وزن حواله " value={MinPlannedQuantity} onChange={e => setMinPlannedQuantity(Number(e.target.value))} />
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
                                <label> مقدار حواله تا</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="  حداکثر وزن حواله " value={MaxPlannedQuantity} onChange={e => setMaxPlannedQuantity(Number(e.target.value))} />
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
                                <label> مقدار حمل شده از</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="   حداقل وزن حمل شده " value={MinShippedQuantity} onChange={e => setMinShippedQuantity(Number(e.target.value))} />
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
                                <label> مقدار حمل شده تا</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="  حداکثر وزن حمل شده " value={MaxShippedQuantity} onChange={e => setMaxShippedQuantity(Number(e.target.value))} />
                            </div>
                           
                                <div className="col-lg-2 col-md-4  col-sm-12 ">

                                    <input type="checkbox" checked={OnlyShipped} onClick={(e: any) => SetOnlyShipped(e.target.checked)} />
                                    <label className="ml-3">  فقط حمل شده  </label>

                                </div>
                                <div className="col-lg-4 col-md-4  col-sm-12 ">

                                    <input type="checkbox" checked={NotYetShipped} onClick={(e: any) => SetNotYetShipped(e.target.checked)} />
                                    <label className="ml-3">فقط حمل نشده</label>

                                </div>
                           
                        </form>
                        <div className="  filter-btn mt-2 ">
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
                            </div></div>
                        <br />
                    </AdvancedSearch>
                </div>
                {getDefault().EntityTypeId || getDefault().CreateEndtDate || getDefault().CreateStartDate || getDefault().CottageCode ? <span className="d-block p-3 text-center w-100 bg-light-primary  " style={{ fontSize: "15px" }}>نمایش اطلاعات بر اساس فیلتر  </span> : null}

                <div className=" statbox widget-content widget-content-area">

                    <div>
                        <MyTable columns={columns} data={data} getData={(rows: any) => setSelectedRows(rows)} bulkJob={getBulkJob}
                          total={totalCount}
                          setPageSize={setPageSize}
                          PageSize={PageSize}
                          getDataBySearch={getDataByPage}
                          setPageNumber={setPageNumber}
                          PageNumber={PageNumber}
                        />                        <ModalGroupWork open={open} close={close} success={stateSuccess} error={stateError} />
                        <ExtraShippingAdmin
                            id={id}
                            modalIsOpen={modalIsOpen}
                            closeModal={closeModal}
                        />
                        <Modal
                        isOpen={modalOpen}
                        onRequestClose={closeModalDelet}
                        style={customStyles}
                        contentLabel="Selected Option"
                        ariaHideApp={false}
                    >
                        <div className="text-center">
                            <div
                                className="d-block clearfix mb-2 "
                                onClick={closeModalDelet}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-x close"
                                    data-dismiss="alert"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </div>

                            <p>
                                {" "}
                                آیا مطمئنید حواله{" "}
                                {shipping
                                    .filter((item: any) => item.id === IdDelete)
                                    .map((item: any) => item.id)}{" "}
                            </p>
                            <p>حذف شود ؟ </p>

                            <button
                                className="btn btn-danger "
                                onClick={deleteShipping}
                            >
                                حذف
                            </button>
                        </div>
                    </Modal>
                    </div>
                    <div className="d-flex justify-content-end">
                    <ExportToExcelProVersion url={`Shipping/GetShippings/${urlForExcel()}`} fileName='لیست سفارشات' />
                </div>
                </div>
                
            </div>


        )
    }
    else {
        return (
            <div className='user-progress'>
                <div className='row'>
                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>


                    </div>
                </div>
                <div className=" statbox widget-content widget-content-area mb-1 mt-1 p-2 my-1   rounded">
                <AdvancedSearch>

<form className='form-row  form-group textOnInput'>


    <div className="col-lg-2 col-md-4  col-sm-12  mb-1">

        <label style={{
            position: 'absolute',
            zIndex: '1',
            top: '-15px',
            right: '10px',
            background: 'none',
            padding: '0 8px'
        }}>تاریخ ایجاد از</label>
        <div className='form-group opacityForInput '>
            <DatePicker
                calendar={persian}
                locale={persian_fa}
                style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                value={CreateStartDate}
                onChange={handelStartDate}

            />

        </div>
    </div>
    <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
        <label style={{
            position: 'absolute',
            zIndex: '1',
            top: '-15px',
            right: '10px',
            background: 'none',
            padding: '0 8px'
        }}>تاریخ ایجاد تا</label>
        <div className='form-group  '>
            <DatePicker
                calendar={persian}
                locale={persian_fa}
                style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                value={CreateEndtDate}
                onChange={handelEndDate}

            />
        </div>
    </div>
    <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
        <label>کد کوتاژ</label>

        <input className="form-control opacityForInput  mb-4" type="text" placeholder="  کد کوتاژ " value={CottageCode} onChange={e => setCottageCode(Number(e.target.value))} />
    </div>
    <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
                                <label> شماره حواله</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="  شماره حواله " value={shippingIds} onChange={e => {
if(e.target.value.includes(',')){
    SetShippingIds(e.target.value.split(','))
}
else{
    SetShippingIds([e.target.value])
}

                                }} />
                            </div>


    <div className="col-lg-2 col-md-4  col-sm-12    mb-1">

        <label> شناسه </label>

        <input className="form-control opacityForInput  mb-4" type="text" placeholder="شناسه سفارش" value={EntityId} onChange={e => setEntityId(Number(e.target.value))} />
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
                        setEntityTypeId(e.value)
                    }}
                /> : <Select
                    menuShouldScrollIntoView={false}
                    placeholder="نوع صورتحساب"
                    options={EntityTypesIDs()}
                    value={EntityTypesIDs().filter((i: any) => i.value === EntityTypeId).map((i: any) => i)}

                    isClearable={true}
                    onChange={(e: any) => {
                        setEntityTypeId(e.value)
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

    <div className="col-lg-2 col-md-4  col-sm-12  ">

        <label style={{
            position: 'absolute',
            zIndex: '1',
            top: '-15px',
            right: '10px',
            background: 'none',
            padding: '0 8px'
        }}>تاریخ حمل از</label>
        <div className='form-group opacityForInput '>
            <DatePicker
                calendar={persian}
                locale={persian_fa}
                style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                value={ShippingStartDate}
                onChange={handelShippingStartDate}

            />

        </div>
    </div>
    <div className="col-lg-2 col-md-4  col-sm-12  ">
        <label style={{
            position: 'absolute',
            zIndex: '1',
            top: '-15px',
            right: '10px',
            background: 'none',
            padding: '0 8px'
        }}>تاریخ  حمل تا</label>
        <div className='form-group  '>
            <DatePicker
                calendar={persian}
                locale={persian_fa}
                style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                value={ShippingEndtDate}
                onChange={handelShippingEndDate}

            />
        </div>
    </div>

    <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
        <label> مقدار حواله از</label>

        <input className="form-control opacityForInput  mb-4" type="text" placeholder="   حداقل وزن حواله " value={MinPlannedQuantity} onChange={e => setMinPlannedQuantity(Number(e.target.value))} />
    </div>
    <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
        <label> مقدار حواله تا</label>

        <input className="form-control opacityForInput  mb-4" type="text" placeholder="  حداکثر وزن حواله " value={MaxPlannedQuantity} onChange={e => setMaxPlannedQuantity(Number(e.target.value))} />
    </div>
    <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
        <label> مقدار حمل شده از</label>

        <input className="form-control opacityForInput  mb-4" type="text" placeholder="   حداقل وزن حمل شده " value={MinShippedQuantity} onChange={e => setMinShippedQuantity(Number(e.target.value))} />
    </div>
    <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
        <label> مقدار حمل شده تا</label>

        <input className="form-control opacityForInput  mb-4" type="text" placeholder="  حداکثر وزن حمل شده " value={MaxShippedQuantity} onChange={e => setMaxShippedQuantity(Number(e.target.value))} />
    </div>
   
        <div className="col-lg-2 col-md-4  col-sm-12 ">

            <input type="checkbox" checked={OnlyShipped} onClick={(e: any) => SetOnlyShipped(e.target.checked)} />
            <label className="ml-3">  فقط حمل شده  </label>

        </div>
        <div className="col-lg-4 col-md-4  col-sm-12 ">

            <input type="checkbox" checked={NotYetShipped} onClick={(e: any) => SetNotYetShipped(e.target.checked)} />
            <label className="ml-3">فقط حمل نشده</label>

        </div>
   
</form>
<div className="  filter-btn mt-2 ">
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
    </div></div>
<br />
</AdvancedSearch>

                </div>
                {getDefault().OrderId || getDefault().CreateEndtDate || getDefault().CreateStartDate || getDefault().CottageCode ? <span className="d-block p-3 text-center w-100 bg-light-primary  " style={{ fontSize: "15px" }}>نمایش اطلاعات بر اساس فیلتر  </span> : null}

                <div className=" statbox widget-content widget-content-area">
                    <div>
                        {/*<button className="btn btn-primary m-3" >تعریف باربری جدید</button>*/}


                        <div className='text-center mt-5'>
                            <h5>اطلاعاتی جهت نمایش موجود نیست</h5>
                        </div>


                    </div>
                </div>


            </div>
        )
    }
}
export default ShippingList