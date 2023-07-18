import React, { useState, useEffect, useMemo } from 'react'
import {
    DeleteSupply, GetAllSuppliers,
    GetAllSupplies,
    GetDataWithSearchSupply,
    GetSupplier,
    SetSupply
} from '../../../services/supplyService';
import { useNavigate } from 'react-router-dom';
import { SupplyTypesEnums } from '../../../Common/Enums/SupplyTypesEnums';
import Modal from 'react-modal';
import MyTable from '../../../Common/Shared/Form/MyTable';


import { DeleteProduct, GetAllProducts, getEditProduct, SetProduct } from "../../../services/productService";
import { toast } from "react-toastify";
import { GetAllWareHouses } from "../../../services/wareHouseService";
import { MeasureUnitSample } from "../../../Common/Enums/MeasureUnitSample";
import ModalGroupWork from "../../../Common/Shared/Common/ModalGroupWork";
import AdvancedSearch from "../../../Common/Shared/Common/AdvancedSearch";
import Select from "react-select";
import { GetDataWithSearchOrder } from "../../../services/orderService";
import { ShippingStatusEnums } from "../../../Common/Enums/ShippingStatusEnums";
import QueryString from 'qs';
import { GetCompanyChild } from '../../../services/companiesService';
import { ExportToExcelProVersion } from '../../../Utils/ExportToExcelProVersion';


const SupplyList:React.FC = () => {
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
    const navigate = useNavigate()
    const [PageNumber, setPageNumber] = useState(getPage().PageNumber ? getPage().PageNumber : 0)
    const [PageSize, setPageSize] = useState(getPage().PageSize ? getPage().PageSize : 10)

    const [totalCount, setTotalCount] = useState(0);
    const [supplies, setSupplies] = useState([]);
    const [wareHouses, SetWareHouse] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [id, setId] = useState(0);
    const [selectedRows, setSelectedRows] = useState([])
    const [stateSuccess, SetStateSuccess] = useState(0)
    const [stateError, SetStateError] = useState(0)
    const [supplyTypeIds, SetSupplyTypeIds] = useState(getDefault().supplyTypeIds);
    const [supplierId, SetSupplierId] = useState(getDefault().supplierId);
    const [shippingStatusIds, SetShippingStatusIds] = useState(getDefault().shippingStatusIds);
    const [productId, SetProductId] = useState(getDefault().productId);
    const [wareHouseId, SetWareHouseId] = useState(getDefault().wareHouseId);
    const [contractNumber, SetContractNumber] = useState(getDefault().contractNumber);
    const [products, SetProducts] = useState([]);
    const [getData, setGeData] = useState(false)
    const [companies, setCompanies] = useState([])
    const [companyId, setCompanyId] = useState(getDefault().companyId ? getDefault().companyId : null)

    const [suppliers, setSuppliers] = useState([])

    const [open, SetOpen] = useState(false);
    const param = { PageSize, PageNumber }

    function getPage() {
        let items = JSON.parse(String(sessionStorage.getItem(`param${window.location.pathname}`)));
        return items ? items : ''


    }
    const params = { supplierId, supplyTypeIds, shippingStatusIds, productId, wareHouseId, contractNumber }
    function getDefault() {
        let items = JSON.parse(String(sessionStorage.getItem(`params${window.location.pathname}`)));
        return items ? items : ''


    }
    var formatter = new Intl.NumberFormat('fa-IR', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    });
    const close = () => {
        SetOpen(false);
    }
    const getProducts = async () => {
        try {
            const { data, status } = await GetAllProducts();

            SetProducts(data.result.products.values)

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getProducts();
    }, [])
    let arrayOfSelectedData = [];
    const getSelectedData = (data:any) => {

        arrayOfSelectedData = data.map((item:any) => item.original);


        return (arrayOfSelectedData)

    }
    const getBulkJob = (selected:any) => {
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
    const DeleteSelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < arrayOfData.length; i++) {

            try {
                const { data, status } = await DeleteSupply(arrayOfData[i].id)
                if (status=== 200) {
                    SetOpen(false)
                    SetStateSuccess(successCount += 1)
              
                   
                }


            } catch (error) {
                SetOpen(true)

                SetStateError(errorCount += 1)
            }


        }

    }
    const copySelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        const copyData = arrayOfData.map((item:any) => {
            return { ...item, id: 0, active: true, createDate: new Date() }
        })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            try {
                let payload = {
                    'supply': copyData[i]
                }
                const { data, status } = await SetSupply(payload)
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
        const copyData = arrayOfData.map((item:any) => {
            return { ...item, active: true }
        })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            try {
                let payload = {
                    'supply': copyData[i]
                }

                const { data, status } = await SetSupply(payload)
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
        const copyData = arrayOfData.map((item:any) => {
            return { ...item, active: false }
        })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            try {

                let payload = {
                    'supply': copyData[i]
                }

                const { data, status } = await SetSupply(payload)
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
    const shippingId = () => {
        let Shipping =ShippingStatusEnums.map((data:any) => ({ label: data.name, value: data.id }))
        return ([{label :"همه", value : null} , ...Shipping ])
    }
    const SupplyTypes = () => {
        let Shipping =SupplyTypesEnums.map((data:any) => ({ label: data.name, value: data.id }))
        return ([{label :"همه", value : null} , ...Shipping ])
    }
    const inputProductG:any = () => {
        if (products) {
            let allProduct =products.map((data:any) => ({ label: data.name, value: data.id }))
            return ([{label :"همه", value : null} , ...allProduct ])
        }
        else {
            return null
        }
    }
    const WareHouseG = () => {
        let allWareHouse =wareHouses.map((data:any) => ({ label: data.name, value: data.id }))
        return ([{label :"همه", value : null} , ...allWareHouse ])
       
    }

    const deletHandler = async () => {
        try {
            const { data, status } = await DeleteSupply(id)
            if (status=== 200) {
                toast.success("تامین با موفقیت حذف شد", {
                    position: "top-right",
                    closeOnClick: true
                });
                setIsOpen(false)
                getSupplies()
            }
            else{

                toast.error("این تامین کننده به یک یا چند تامین اختصاص داده شده است", {
                    position: "top-right",
                    closeOnClick: true
                });
                setIsOpen(false)

            }
        } catch (err) {
            console.log(err)
        }
    }

    const formHandler = () => {
        navigate("/admin/newsupply")
    }


    const openModal = (id:any) => {
        setIsOpen(true);
        setId(id)

    }
    const closeModal = () => {
        setIsOpen(false);
    }
    const getSupplies = async () => {
       
        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {
                SupplierId: null,
                SupplyTypeIds:  [],
                ShippingStatusIds:  [],
                ProductId: null,
                WareHouseId: null,
                ContractNumber: null,
                PageNumber:0,
                PageSize:10


            }
            ,
            paramsSerializer: (params:any) => {

                return QueryString.stringify(params)
            }

        };

        try {
            const { data, status } = await GetDataWithSearchSupply(config);
            if (status === 200) {
                setGeData(false)
                setSupplies(data.result.supplies.values);
                setTotalCount(data.result.supplies.totalCount)
            }

        } catch (err) {
            console.log(err)
        }

    }
    const urlForExcel = () => {

        let parameter = {
            SupplierId: supplierId,
                SupplyTypeIds: supplyTypeIds ? supplyTypeIds.map((item:any) => item.value) : [],
                ShippingStatusIds: shippingStatusIds ? shippingStatusIds.map((item:any) => item.value) : [],
                ProductId: params.productId,
                WareHouseId: params.wareHouseId,
                ContractNumber: params.contractNumber,
                PageNumber: 0,
                PageSize:1000000,companyId



        }



        let url = QueryString.stringify(parameter)


        return (`?${url}`)



    }

    const getDataBySearch = async () => {
        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {
                SupplierId: supplierId,
                SupplyTypeIds: supplyTypeIds ? supplyTypeIds.map((item:any) => item.value) : [],
                ShippingStatusIds: shippingStatusIds ? shippingStatusIds.map((item:any) => item.value) : [],
                ProductId: params.productId,
                WareHouseId: params.wareHouseId,
                ContractNumber: params.contractNumber,
                PageNumber: 0,
                PageSize,companyId


            }
            ,
            paramsSerializer: (params:any) => {

                return QueryString.stringify(params)
            }

        };

        try {
            const { data, status } = await GetDataWithSearchSupply(config);
            if (status === 200) {

                setSupplies(data.result.supplies.values);
                setTotalCount(data.result.supplies.totalCount)
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
                SupplierId: params.supplierId,
                SupplyTypeIds: params.supplyTypeIds ? params.supplyTypeIds.map((item:any) => item.value) : [],
                ShippingStatusIds: params.shippingStatusIds ? params.shippingStatusIds.map((item:any) => item.value) : [],
                ProductId: params.productId,
                WareHouseId: params.wareHouseId,
                ContractNumber: params.contractNumber,
                companyId,
                PageNumber,
                PageSize


            }
            ,
            paramsSerializer: (params:any) => {

                return QueryString.stringify(params)
            }

        };

        try {
            const { data, status } = await GetDataWithSearchSupply(config);
            if (status === 200) {
                setSupplies(data.result.supplies.values);
                setTotalCount(data.result.supplies.totalCount)

                sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));

            }

        } catch (err) {
            console.log(err)
        }

    }
    const getCompanies = async () => {
        try {
            const { data, status } = await GetCompanyChild()
            setCompanies(data.result.companies)



        } catch (error) {

        }

    }
    const getSupplier = async () => {
        try {
            
            const { data, status } = await GetAllSuppliers();
            if (status === 200) {
                setSuppliers(data.result.suppliers.values)

            }
        } catch (error) {
            console.log(error);
        }
    }
    const getWareHouse = async () => {
        try {

            const { data, status } = await GetAllWareHouses();
            if (status === 200) {
                if(data.result.wareHouses.values!==null){
                SetWareHouse(data.result.wareHouses.values)}
                else{
                    SetWareHouse([])
                }
            }

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {


       //getSupplies();
        getWareHouse();
        getCompanies()
        getSupplier()
    }, [getData])
    const SupplierG:any = () => {
        if (suppliers) {
            let all =suppliers.map((data:any) => ({ label: data.name, value: data.id }))
            return ([{label :"همه", value : null} , ...all ])
        }
        else {
            return null
        }
    }

    const editHandler = (id:number) => {
        navigate(`/admin/editsupply/${id}`)
    }

    const columns = useMemo(() => [

        { Header: '#', accessor: 'id' },
        { Header: 'قراداد', accessor: 'contractNumber' },
        {
            Header: 'نام کالا', accessor: 'productName'
              
        },

        {
            Header: 'مقدار', accessor: 'quantity', Cell: (row:any) => formatter.format(row.row.original.quantity)
        }, {
            Header: 'واحد', accessor: 'Mesures', Cell: (row:any) => {

                return (MeasureUnitSample.filter((item:any) => item.id === row.row.original.measureUnitId).map((item:any) => item.name))
            }
        }
        ,

        {
            Header: 'انبار', accessor: 'wareHouse', Cell: (row:any) => {
                return (wareHouses.filter((item:any) => item.id === row.row.original.wareHouseId).map((item:any) => item.name))
            }
        }, {
            Header: 'تامین کننده', accessor: 'supplierName'},
        {
            Header: 'نوع تامین', accessor: 'taminType', Cell: (row:any) => {

                return (SupplyTypesEnums.filter((item:any) => item.id === row.row.original.supplyTypeId).map((item:any) => item.name))

            }
        },
        {
            Header: 'کد  کوتاژ', accessor: 'cottageCode'
        },{Header:'نام شرکت', accessor:'companyName'},
        {
            Header: 'توضیحات', accessor: 'comment', Cell: (row:any) => {

                return (<span title={row.row.original.comment}>{row.row.original.comment.substring(0, 50) + '...'}</span>)
            }
        },
        {
            Header: 'عملیات', accessor: '11', Cell: (row:any) => {

                return (
                    <ul className="table-controls">

                        <button className="border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip"
                            data-placement="top" title="ویرایش"
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


                        <button onClick={() => openModal(row.row.original.id)}
                            className="border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip"
                            data-placement="top" title="حذف">
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
            }
        }
    ],[wareHouses])
    const CompaniesIDs = () => {
        let all =companies.map((data:any) => ({ label: data.name, value: data.id }))
        return ([{label :"همه", value : null} , ...all ])
    }

    const data = useMemo(() => supplies,[supplies])
    const handelSearchFieldClear = async () => {
        setGeData(true)
        getSupplies()
        SetContractNumber('')
        SetProductId(0)
        SetSupplierId(null)
        SetSupplyTypeIds([])
        SetShippingStatusIds([])
        SetWareHouseId(0)
        setPageNumber(0)
        setPageSize(10)
        setCompanyId(0)

        getSupplies()
        sessionStorage.clear()

    }
    if (supplies) {
        const dataForExcel = data.map((item:any) => ({
            'شناسه': item.id,
            'نام تامین کننده': item.name
        }))
        return (
            <div >
                
                <div className=" statbox widget-content widget-content-area mb-1 mt-1 p-2 my-1 ">
                    <AdvancedSearch>

                        <form className='form-row textOnInput'>


                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
                                <label> شماره قرارداد</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="شماره قرارداد"
                                    value={contractNumber} onChange={e => SetContractNumber(e.target.value)} />
                            </div>

                            <div className="col-lg-2 col-md-4  col-sm-12      textOnInput form-group " style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>محصول</label>

                                    <Select
                                        defaultValue={products.filter((i:any) => i.id === productId).map((data:any) => ({ label: data.name, value: data.id }))[0]}
                                        menuShouldScrollIntoView ={false}
                                        placeholder='محصول'
                                        options={inputProductG()}

                                        onChange={(e:any) => {
                                            SetProductId(e.value)
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12      textOnInput form-group " style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>تامین کننده</label>

                                    <Select
                                        defaultValue={params.supplierId}
                                        menuShouldScrollIntoView ={false}
                                        placeholder='تامین کننده'
                                        options={SupplierG()}

                                        onChange={e => {
                                            SetSupplierId(e.value)
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12      textOnInput form-group " style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>نوع تامین</label>

                                    <Select
                                        defaultValue={params.supplyTypeIds}
                                        menuShouldScrollIntoView ={false}
                                        placeholder='نوع تامین '
                                        options={SupplyTypes()}
                                        isMulti

                                        isClearable={true}
                                        onChange={e => {

                                            SetSupplyTypeIds(e)

                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12      textOnInput form-group " style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>وضعیت ارسال </label>

                                    <Select
                                        defaultValue={params.shippingStatusIds}
                                        menuShouldScrollIntoView ={false}
                                        placeholder='وضعیت ارسال'
                                        options={shippingId()}
                                        isMulti

                                        isClearable={true}
                                        onChange={e => {

                                            SetShippingStatusIds(e)

                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12      textOnInput form-group " style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>انبار </label>

                                    <Select
                                        defaultValue={params.wareHouseId}
                                        isClearable={true}
                                        placeholder='انبار'
                                        options={WareHouseG()}
                                        menuShouldScrollIntoView ={false}
                                        onChange={e => {

                                            SetWareHouseId(e.value)

                                        }}
                                    />
                                </div>
                            </div>

                            {companies.length > 1 ? <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
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
                            </div></div>
                    </AdvancedSearch>
                </div>
                {getDefault().shippingStatusIds || getDefault().wareHouseId || getDefault().contractNumber || getDefault().productId || getDefault().supplierId || getDefault().supplyTypeIds ? <span className="d-block p-3 text-center w-100 bg-light-primary  " style={{ fontSize: "15px" }}>نمایش اطلاعات بر اساس فیلتر  </span> : null}

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
                            <p> آیا مطمئنید تامین {supplies.filter((item:any) => item.id === id).map((item:any) => item.name)}   </p>
                            <p>حذف شود ؟ </p>


                            <button className="btn btn-danger float-left" onClick={deletHandler}>حذف
                            </button>

                            {/*<button className="btn btn-success float-right" onClick={closeModal}>خیر</button>*/}
                        </div>
                    </Modal>
                    <div>
                        <button className="btn btn-primary m-3" onClick={formHandler}>تعریف تامین جدید</button>
                        <MyTable columns={columns} data={data} getData={(rows:any) => setSelectedRows(rows)} bulkJob={getBulkJob}
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
                    <ExportToExcelProVersion url={`Supply/GetSupplys/${urlForExcel()}`} fileName='لیست تامین' />
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

                        <form className='form-row textOnInput'>


                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
                                <label> شماره قرارداد</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="شماره قرارداد"
                                    value={contractNumber} onChange={(e:any) => SetContractNumber(e.target.value)} />
                            </div>

                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1  textOnInput form-group " style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>محصول</label>

                                    <Select
                                        menuShouldScrollIntoView ={false}
                                        defaultValue={products ? products.filter((i:any) => i.id === productId).map((data:any) => ({ label: data.name, value: data.id }))[0] : ""}
                                        placeholder='محصول'
                                        options={inputProductG()}

                                        onChange={(e:any) => {
                                            SetProductId(e.value)
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1  textOnInput form-group  " style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>تامین کننده</label>

                                    <Select
                                        menuShouldScrollIntoView ={false}
                                        defaultValue={params.supplierId}
                                        placeholder='تامین کننده'
                                        options={SupplierG()}

                                        onChange={e => {
                                            SetSupplierId(e.value)
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1  textOnInput form-group " style={{ marginBottom: "3rem" }} >
                                <div className=" form-control-sm">
                                    <label>نوع تامین</label>

                                    <Select
                                        defaultValue={params.supplyTypeIds}
                                        menuShouldScrollIntoView ={false}
                                        placeholder='نوع تامین '
                                        options={SupplyTypes()}
                                        isMulti

                                        isClearable={true}
                                        onChange={e => {

                                            SetSupplyTypeIds(e)

                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1  textOnInput form-group " style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>وضعیت ارسال </label>

                                    <Select
                                        defaultValue={params.shippingStatusIds}
                                        menuShouldScrollIntoView ={false}
                                        placeholder='وضعیت ارسال'
                                        options={shippingId()}
                                        isMulti

                                        isClearable={true}
                                        onChange={e => {

                                            SetShippingStatusIds(e)

                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1  textOnInput form-group " style={{ marginBottom: "3rem" }}>
                                <div className=" form-control-sm">
                                    <label>انبار </label>

                                    <Select
                                        defaultValue={params.wareHouseId}
                                        isClearable={true}
                                        placeholder='انبار'
                                        options={WareHouseG()}
                                        menuShouldScrollIntoView ={false}
                                        onChange={e => {

                                            SetWareHouseId(e.value)

                                        }}
                                    />
                                </div>
                            </div>

                            {companies.length > 1 ? <div className="col-lg-2 col-md-4  col-sm-12    textOnInput form-group "
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
                                            value={CompaniesIDs().filter((i:any) => i.value === companyId).map((i:any) => i)}
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
                                </div> </div>
                        </div>
                    </AdvancedSearch>
                </div>
                {getDefault().shippingStatusIds || getDefault().wareHouseId || getDefault().contractNumber || getDefault().productId || getDefault().supplierId || getDefault().supplyTypeIds ? <span className="d-block p-3 text-center w-100 bg-light-primary  " style={{ fontSize: "15px" }}>نمایش اطلاعات بر اساس فیلتر  </span> : null}

                <div className=" statbox widget-content widget-content-area">
                    <div>
                        <button className="btn btn-primary m-3" onClick={formHandler}>تعریف تامین جدید</button>



                        <div className='text-center mt-5'>
                            <h5>اطلاعاتی جهت نمایش موجود نیست</h5>
                        </div>




                    </div>
                </div>


            </div>
        )
    }


}

export default SupplyList