import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ChangeProductSupplyAction,
    DeleteProductSupply,
    GetAllProductSupplyForAdmin,
    GetAllProductWithSearch,
    SetProductSupply
} from '../../../services/productSupplyService';
import MyTable from '../../../Common/Shared/Form/MyTable';
import { MeasureUnitSample } from "../../../Common/Enums/MeasureUnitSample";
import { ExportToExcel } from "../../../Common/Shared/Common/ExportToExcel";
import Modal from "react-modal";
import { toast } from "react-toastify";
import ModalGroupWork from "../../../Common/Shared/Common/ModalGroupWork";
import React from "react";
import AdvancedSearch from '../../../Common/Shared/Common/AdvancedSearch';
import { PaymentStructureEnums } from "../../../Common/Enums/PaymentStructureEnums";
import Select from 'react-select';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { GetProducts } from '../../../services/productService';
import { GetCompanyChild } from '../../../services/companiesService';
import { FiFileText } from 'react-icons/fi';
import QueryString from "qs";
import { ExportToExcelProVersion } from "../../../Utils/ExportToExcelProVersion";

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
};

const ProductSupply:React.FC = () => {
    const [PageNumber, setPageNumber] = useState(getPage().PageNumber ? getPage().PageNumber : 0)
    const [PageSize, setPageSize] = useState(getPage().PageSize ? getPage().PageSize : 10)
    const [companies, setCompanies] = useState([])
    const [companyId, setCompanyId] = useState(getDefault().companyId ? getDefault().companyId : null)
    const [totalCount, setTotalCount] = useState(0);
    const [productSupply, setProductSupply] = useState([]);
    const [ProductId, setProducId] = useState(getDefault().ProductId);
    const [products, setProduct] = useState([])
    const [modalIsOpen, setIsOpen] = useState(false);
    const [bulkStatusModal, SetBulkStatusModal] = useState(false)
    const [id, setId] = useState(0)
    const [stateSuccess, SetStateSuccess] = useState<any>('')
    const [stateError, SetStateError] = useState<any>('')
    const [open, SetOpen] = useState(false);
    const [CreateDate, setCreateDate] = useState(getDefault().CreateDate)
    const [CottageCode, setCottageCode] = useState(getDefault().CottageCode);
    const [getData, setGeData] = useState(false)
    const param = { PageSize, PageNumber }

    function getPage() {
        let items = JSON.parse(String(sessionStorage.getItem(`param${window.location.pathname}`)));
        return items ? items : ''


    }
    const params = { CreateDate, CottageCode, ProductId }
    function getDefault() {
        let items = JSON.parse(String(sessionStorage.getItem(`params${window.location.pathname}`)));
        return items ? items : ''


    }
    const getCompanies = async () => {
        try {
            const { data, status } = await GetCompanyChild()
            setCompanies(data.result.companies)



        } catch (error) {

        }

    }
    const urlForExcel = () => {

        let parameter = {
            CreateDate,
            CottageCode,
            ProductId,
            PageNumber: 0,
            PageSize:1000000,
            companyId,
            IsAdmin: true,
            Active: false



        }



        let url = QueryString.stringify(parameter)


        return (`?${url}`)



    }

    const getDataBySearch = async () => {
        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {
                CreateDate,
                CottageCode,
                ProductId,
                PageNumber: 0,
                PageSize,
                companyId,
                IsAdmin: true,
                Active: false


            }
        };
        const { data, status } = await GetAllProductWithSearch(config);
        setProductSupply(data.result.productSupplies.values)
        setTotalCount(data.result.productSupplies.totalCount)
        setPageNumber(0)
        sessionStorage.setItem(`params${window.location.pathname}`, JSON.stringify(params));
        sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));

    }
    const getDataByPage = async () => {
        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {
                CreateDate,
                CottageCode,
                ProductId,
                PageNumber,
                PageSize,
                companyId,
                IsAdmin: true,
                Active: false


            }
        };
        const { data, status } = await GetAllProductWithSearch(config);
        setProductSupply(data.result.productSupplies.values)
        setTotalCount(data.result.productSupplies.totalCount)
        sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));

    }
    const getProduct = async () => {

        try {
            const { data, status } = await GetProducts();
            if (status === 200) {
                setProduct(data.result.products.values)
            }
        } catch (error) {
            console.log(error);
        }

    }
    const productForSelect:any = () => {
        if (products) {
            let all =products.map((data:any) => ({ label: data.name, value: data.id }))
            return ([{label :"همه", value : null} , ...all ])
          
        }
        else {
            return null
        }
    }
    const paymentMethod = () => {
        let all =PaymentStructureEnums.map((data:any) => ({ label: data.name, value: data.id }))
            return ([{label :"همه", value : null} , ...all ])
    }

    const close = () => {
        SetOpen(false);
    }
    const [selectedRows, setSelectedRows] = useState([])
    let arrayOfSelectedData = [];

    const getBulkJob = (selected:any) => {
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
        const arrayOfData = getSelectedData(selectedRows);
        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < arrayOfData.length; i++) {

            try {
                const { data, status } = await DeleteProductSupply(arrayOfData[i].id)
                if (data.result.success === true) {
                    SetOpen(true)

                    SetStateSuccess(successCount += 1)
                } if (data.result.success === false) {
                    SetOpen(true)

                    SetStateError(errorCount += 1)
                }



            } catch (error) {
                SetOpen(true)

                SetStateError(errorCount += 1)

            }


        }

    }
    const copySelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        const copyData = arrayOfData.map((item:any) => { return { ...item, id: 0, active: true, createDate: new Date() } })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            try {

                let payload = {
                    'productSupply': copyData[i],
                    "product": null
                    ,
                    "wareHouse": null
                }
                const { data, status } = await SetProductSupply(payload)
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
        const copyData = arrayOfData.map((item:any) => { return { ...item, active: true } })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            try {
                let payload = {
                    'productSupply': copyData[i],
                    "product": null
                    ,
                    "wareHouse": null
                }
                const { data, status } = await SetProductSupply(payload)
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
        const copyData = arrayOfData.map((item:any) => { return { ...item, active: false } })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            try {

                let payload = {
                    'productSupply': copyData[i],
                    "product": null
                    ,
                    "wareHouse": null
                }
                const { data, status } = await SetProductSupply(payload)
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

    const getSelectedData = (data:any) => {

        arrayOfSelectedData = data.map((item:any) => item.original);


        return (arrayOfSelectedData)

    }


    const deletHandler = async () => {
        try {
            const { data, status } = await DeleteProductSupply(id)
            if (status === 200) {
                toast.success("عرضه با موفقیت حذف شد", {
                    position: "top-right",
                    closeOnClick: true
                });
                setIsOpen(false)
                getProductSupply()
            } if (status === 500) {

                toast.error("این عرضه به یک یا چند سفارش اختصاص داده شده است", {
                    position: "top-right",
                    closeOnClick: true
                });
            }
        } catch (err) {
            console.log(err)
        }
    }

    const getProductSupply = async () => {
    
        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {
                CreateDate:null,
                CottageCode:null,
                ProductId:null,
                PageNumber:0,
                PageSize:10,
                IsAdmin: true,
                Active: false


            }
        };
        try {
            const { data, status } = await GetAllProductWithSearch(config);
            setGeData(false)
            setProductSupply(data.result.productSupplies.values)
            setTotalCount(data.result.productSupplies.totalCount)

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {

        //getProductSupply();
        getCompanies()
        getProduct();
    }, [getData])

    const editHandler = (id:number) => {
        navigate(`/admin/editproductsupply/${id}`)
    }
    const navigate = useNavigate()
    const formHandler = () => {
        navigate("/admin/newProductsupply")
    }
    const BreifHandler=(id:any)=>{
        navigate(`/admin/CoutaggeBerief/${id}`)
    }
    const openModal = (id:number) => {
        setIsOpen(true);
        setId(id)

    }
    const closeModal = () => {
        setIsOpen(false);
    }

    let formatterForMoney = new Intl.NumberFormat('fa-IR', {
        style: 'currency',
        currency: 'IRR'


    });
    let formater = new Intl.NumberFormat('fa-IR', {


    });

    const handleChangeExpire = (value:any) => {
        if (value === null) {
            setCreateDate('')

        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            setCreateDate(new Date(value.toDate().setHours(3, 30, 0, 0)))


        }
    }
    const columns = useMemo(() => [
        { Header: '#', accessor: 'id' },
        { Header: ' شناسه عرضه', accessor: 'name' },
        { Header: 'محصول', accessor: 'product.name' },
        { Header: 'انبار', accessor: 'wareHouse.wareHouseName' },
        , { Header: 'قیمت', accessor: (d:any) => `${d.price}`, Cell: (row:any) => (formater.format(row.row.original.price)) }
        , {
            Header: 'واحد ', accessor: (d:any) => {
                let MeasureUnit = MeasureUnitSample.filter(item => item.id === d.product.measureUnitId).map(item => item.name)
                return (`${MeasureUnit}`)
            }, Cell: (row:any) => {

                return (MeasureUnitSample.filter(item => item.id === row.row.original.product.measureUnitId).map(item => item.name))
            }
        },
        { Header: 'مقدار عرضه', accessor: '', Cell: (row:any) => (formater.format(row.row.original.quantity)) },
        { Header: 'مقدار خریداری شده', accessor: 'orderedQuantity', Cell: (row:any) => (formater.format(row.row.original.orderedQuantity)) },
        { Header: 'مقدار مانده', accessor: 'remainedQuantity', Cell: (row:any) => (formater.format(row.row.original.remainedQuantity)) },
        { Header: 'شماره کوتاژ', accessor: 'cottageCode',Cell:row=>{

            if(row.row.original.cottageCode==='0'||row.row.original.cottageCode==='' ){

                return('فاقد کوتاژ')
            }
            else{
                return(row.row.original.cottageCode)
            }
        }
     },
        {
            Header: 'تاریخ اعتبار', accessor: 'date', Cell: (row:any) => {
                return (new Date(row.row.original.endDate).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }))
            }
        },{Header:'شرکت',accessor:'companyName'},
        {
            Header: 'توضیحات', accessor: 'comment', Cell: (row:any) => {
                if(row.row.original.comment!==null){
                return (row.row.original.comment.substring(0, 20))
                }
                else{
                return('')
            }}
        },
        {
            Header: 'فعال', accessor: '', isVisible: true,
            disableFilters: true, Cell: (row:any) => {
                const [active, setActive] = useState(row.row.original.active)
                const id = row.row.original.id

                const activeChang = {
                    "productSupplyId": row.row.original.id,
                    "active": !active
                  }

                const activeHandler = async () => {
                    setActive(!active)

                    try {
                        const { data, status } = await ChangeProductSupplyAction(activeChang)

                        // if (status === 200){
                        //
                        //     setActive(!active)
                        // }
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
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="feather feather-x  danger " onClick={activeHandler} style={{ color: 'red' }}>
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>)
                }




            }
        }, {
            Header: 'کارنامه کوتاژ', accessor: '', Cell: (row:any) => (
                <ul className="table-controls">
    <button className="m-1 p-0 border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip" data-placement="top"
                        title="کارنامه کوتاژ"
                        onClick={e => BreifHandler(row.row.original.cottageCode)}>
                        <FiFileText size="1.5rem"/>
                    </button>
                </ul>
            )
        },
        {
            Header: 'عملیات', accessor: 'عملیات', Cell: row => (
                <ul className="table-controls">

                    <button className="p-0 border-0  non-hover  bg-transparent edit-btn" data-toggle="tooltip" data-placement="top" title="ویرایش"
                        onClick={e => editHandler(row.row.original.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-edit-2">
                            <path
                                d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                    </button>


                    <button className="p-0 border-0  non-hover  bg-transparent edit-btn" onClick={() => openModal(row.row.original.id)}  data-toggle="tooltip" data-placement="top" title="حذف">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-trash-2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path
                                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>

                        </svg>
                    </button>


               

                </ul>
            )
        }],[productSupply])
    const CompaniesIDs = () => {
        let all =companies.map((data:any) => ({ label: data.name, value: data.id }))
        return ([{label :"همه", value : null} , ...all ])
 
    }

    const data = useMemo(() => productSupply,[productSupply]);
    const handelSearchFieldClear = async () => {
        setGeData(true)
        getProductSupply()
        setCreateDate('')
        setCottageCode('')
        setProducId('')
        setGeData(true)
        setCompanyId(null)
        setPageNumber(0)
        setPageSize(10)
        sessionStorage.clear()

    }
    if (productSupply) {
        const dataForExcel = data.map((item:any) => ({
            'شناسه': item.id,
            'محصول': item.product.name,

            'قیمت': item.price,
            'تعداد': item.quantity,
            'توضیحات': item.comment,
            'تاریخ': new Date(item.endDate).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' })
        }))

        return (
            <div className=''>
                
                <div className=" statbox widget-content widget-content-area mb-1 mt-1 p-2 my-1 ">
                    <AdvancedSearch>

                        <form className='form-row  form-group textOnInput'>



                            <div className={companies.length === 1 ? "col-lg-2 col-md-4  col-sm-12  mb-1" : "col-lg-3 col-md-3  col-sm-12  mb-1"}>

                                <label style={{ position: 'absolute', zIndex: '1', top: '-15px', right: '10px', background: 'white', padding: '0 8px' }}>تاریخ ایجاد</label>
                                <div className='form-group  '>
                                    <DatePicker
                                        calendar={persian}

                                        locale={persian_fa}
                                        style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                        value={CreateDate}
                                        onChange={handleChangeExpire}
                                    />

                                </div>
                            </div>
                            <div className={companies.length === 1 ? "col-lg-2 col-md-4  col-sm-12  mb-1" : "col-lg-3 col-md-3  col-sm-12  mb-1"}>
                                <label> کد کوتاژ</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="کد کوتاژ" value={CottageCode} onChange={(e:any) => setCottageCode(e.target.value)} />
                            </div>



                            <div className={companies.length === 1 ? "col-lg-2 col-md-4  col-sm-12  mb-1  textOnInput form-group" : "col-lg-3 col-md-3  col-sm-12  mb-1  textOnInput form-group"}
                            >
                                <div className=" form-control-sm">
                                    <label> کالا </label>
                                    <Select
                                        menuShouldScrollIntoView ={false}
                                        placeholder='کالا'
                                        options={productForSelect()}
                                        onChange={(e:any) => {
                                            setProducId(e.value)


                                        }}
                                    />
                                </div>
                            </div>

                            {companies.length > 1 ? <div className="col-lg-3 col-md-3  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label> نام شرکت </label>

                                    {companyId && companyId === null ?
                                        <Select
                                            menuShouldScrollIntoView ={false}
                                            options={CompaniesIDs()}
                                            onChange={(e:any) => {
                                                setCompanyId(e.value)
                                            }}
                                        /> : <Select
                                            value={CompaniesIDs().filter(i => i.value === companyId).map(i => i)}
                                            menuShouldScrollIntoView ={false}
                                            placeholder='نام شرکت'
                                            options={CompaniesIDs()}
                                            onChange={(e:any) => {
                                                setCompanyId(e.value)
                                                console.log(e);

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
                            </div> </div>
                        <br />

                    </AdvancedSearch>
                </div>
                {getDefault().ProductId || getDefault().CreateDate || getDefault().CottageCode ? <span className="d-block p-3 text-center w-100 bg-light-primary  " style={{ fontSize: "15px" }}>نمایش اطلاعات بر اساس فیلتر  </span> : null}

                <div className=" statbox widget-content widget-content-area">
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Selected Option"
                        ariaHideApp={false}

                    >
                        <div style={{ width: '20rem' }}>

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


                            <p> آیا مطمئنید  عرضه محصول {productSupply && productSupply.filter((item:any) => item.id === id).map((item:any) => item.product.name)}   </p>
                            <p>حذف شود ؟ </p>




                            <button className="btn btn-danger float-left" onClick={deletHandler}>حذف
                            </button>

                            {/*<button className="btn btn-success float-right" onClick={closeModal}>خیر</button>*/}
                        </div>
                    </Modal>
                    <div>
                        <button className="btn btn-primary m-3" onClick={formHandler}>تعریف عرضه جدید</button>

                        <MyTable PageNumber={PageNumber} PageSize={PageSize} getDataBySearch={getDataByPage} setPageSize={setPageSize} total={totalCount} setPageNumber={setPageNumber} columns={columns} data={data} getData={(rows:any) => setSelectedRows(rows)} bulkJob={getBulkJob} />
                        <ModalGroupWork open={open} close={close} success={stateSuccess} error={stateError} />

                    </div>
                    <div className="d-flex justify-content-end">
                    <ExportToExcelProVersion url={`Product/GetProductSupplies/${urlForExcel()}`} fileName='لیست عرضه' />
                    </div>
                </div>
            </div>


        )
    }
    else {
        return (
            <div className=''>
              
                <div className=" statbox widget-content widget-content-area mb-1 mt-1 p-2 my-1 ">
                    <AdvancedSearch>

                        <form className='form-row  form-group textOnInput'>




                            <div className={companies.length === 1 ? "col-lg-4 col-md-4  col-sm-12  mb-1" : "col-lg-3 col-md-3  col-sm-12  mb-1"}>

                                <label style={{ position: 'absolute', zIndex: '1', top: '-15px', right: '10px', background: 'white', padding: '0 8px' }}>تاریخ ایجاد</label>
                                <div className='form-group  '>
                                    <DatePicker
                                        calendar={persian}

                                        locale={persian_fa}
                                        style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                        value={CreateDate}
                                        onChange={handleChangeExpire}
                                    />

                                </div>
                            </div>
                            <div className={companies.length === 1 ? "col-lg-4 col-md-4  col-sm-12  mb-1" : "col-lg-3 col-md-3  col-sm-12  mb-1"}>
                                <label> کد کوتاژ</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="کد کوتاژ" value={CottageCode} onChange={e => setCottageCode(e.target.value)} />
                            </div>



                            <div className={companies.length === 1 ? "col-lg-4 col-md-4  col-sm-12  mb-1  textOnInput form-group" : "col-lg-3 col-md-3  col-sm-12  mb-1  textOnInput form-group"}
                            >
                                <div className=" form-control-sm">
                                    <label> کالا </label>
                                    <Select
                                        menuShouldScrollIntoView ={false}
                                        placeholder='کالا'
                                        options={productForSelect()}
                                        onChange={(e:any) => {
                                            setProducId(e.value)


                                        }}
                                    />
                                </div>
                            </div>

                            {companies.length > 1 ? <div className="col-lg-3 col-md-3  col-sm-12    textOnInput form-group "
                                style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label> نام شرکت </label>

                                    {companyId && companyId === null ?
                                        <Select
                                            menuShouldScrollIntoView ={false}
                                            options={CompaniesIDs()}
                                            onChange={(e:any) => {
                                                setCompanyId(e.value)
                                            }}
                                        /> : <Select
                                            value={CompaniesIDs().filter(i => i.value === companyId).map(i => i)}
                                            menuShouldScrollIntoView ={false}
                                            placeholder='نام شرکت'
                                            options={CompaniesIDs()}
                                            onChange={(e:any) => {
                                                setCompanyId(e.value)
                                                console.log(e);

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
                            </div> </div>
                        <br />

                    </AdvancedSearch>
                </div>
                {getDefault().ProductId || getDefault().CreateDate || getDefault().CottageCode ? <span className="d-block p-3 text-center w-100 bg-light-primary  " style={{ fontSize: "15px" }}>نمایش اطلاعات بر اساس فیلتر  </span> : null}

                <div className=" statbox widget-content widget-content-area">
                    <div>
                        <button className="btn btn-primary m-3" onClick={formHandler}>تعریف عرضه جدید</button>


                        <div className='text-center mt-5'>
                            <h5>اطلاعاتی جهت نمایش موجود نیست</h5>
                        </div>

                    </div>
                </div>


            </div>
        )
    }
}
export default ProductSupply