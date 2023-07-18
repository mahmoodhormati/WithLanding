import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMemo } from "react";
import MyTable from "../../../../../Common/Shared/Form/MyTable";
import Modal from "react-modal";
import { ExportToExcel } from "../../../../../Common/Shared/Common/ExportToExcel";
import ModalGroupWork from "../../../../../Common/Shared/Common/ModalGroupWork";
import AdvancedSearch from '../../../../../Common/Shared/Common/AdvancedSearch';
import QueryString from "qs";
import { GetAllShippingCompanies, SetShippingCompany, SetShoppingContract } from "../../../../../services/ShippingService";
import { MeasureUnitSample } from "../../../../../Common/Enums/MeasureUnitSample";
import { GetShoppingContracts } from '../../../../../services/ShippingService';
import { formatter } from "../../../../../Utils/Formatter";
import { ExportToExcelProVersion } from "../../../../../Utils/ExportToExcelProVersion";


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
};
const ShoppingContractList: React.FC = () => {
    const [PageNumber, setPageNumber] = useState(getPage().PageNumber ? getPage().PageNumber : 0)
    const [PageSize, setPageSize] = useState(getPage().PageSize ? getPage().PageSize : 10)

    const [totalCount, setTotalCount] = useState(0);
    const [ShippingContract, setShippingContract] = useState([]);
    const [ShippingCompanies, setShippingCompanies] = useState([]);

    const [modalIsOpen, setIsOpen] = useState(false);
    const [id, setId] = useState(0)
    const [selectedRows, setSelectedRows] = useState([])
    const [stateSuccess, SetStateSuccess] = useState(0)
    const [stateError, SetStateError] = useState(0)
    const [getData, setGeData] = useState(false)

    const [CompanyName, setCompanyName] = useState(getDefault().CompanyName)
    const [CompanyCode, setCompanyCode] = useState(getDefault().CompanyCode)
    const [ContractNumber, setContractNumber] = useState(getDefault().ContractNumber)

    const [ProductIds, SetProductIds] = useState([])
    const [WareIds, SetWareIds] = useState([])
    const [open, SetOpen] = useState(false);
    const param = { PageSize, PageNumber }

    function getPage() {
        let items = JSON.parse(String(sessionStorage.getItem(`param${window.location.pathname}`)));
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
    const DeleteSelectedItem = async () => {


    }
    const copySelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        const copyData = arrayOfData.map((item: any) => {
            return { ...item, id: 0, active: true, createDate: new Date() }
        })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            try {


                setShippingContract(copyData[i])

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


                setShippingContract(copyData[i])

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
                    'shippingCompany': copyData[i]
                }

                setShippingContract(copyData[i])

                SetOpen(true)

                SetStateSuccess(successCount += 1)



            } catch (error) {
                SetOpen(true)

                SetStateError(errorCount += 1)
            }


        }


    }
    const params = { CompanyName, ContractNumber, CompanyCode }
    function getDefault() {
        let items = JSON.parse(String(sessionStorage.getItem(`params${window.location.pathname}`)));
        return items ? items : ''


    }

    const urlForExcel = () => {

        let parameter = {
            CompanyName,
            ContractNumber,
            CompanyCode,

            PageNumber: 0,
            PageSize: 1000000,


        }



        let url = QueryString.stringify(parameter)


        return (`?${url}`)



    }
    const getDataBySearch = async () => {

        let config = {

            headers: { 'Content-Type': 'application/json' },

            params: {
                CompanyName,
                ContractNumber,
                CompanyCode,

                PageNumber: 0,
                PageSize,


            },
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }


        };

        try {
            const { data, status } = await GetShoppingContracts(config)
            if (status === 200) {
                setPageNumber(0)
                setShippingContract(data.result.shippingContracts.values)
                setTotalCount(data.result.shippingContracts.totalCount)
                sessionStorage.setItem(`params${window.location.pathname}`, JSON.stringify(params));
                sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));

            }
        } catch (error) {
            console.log(error);
        }
    }
    const getDataByPage = async () => {

        let config = {

            headers: { 'Content-Type': 'application/json' },

            params: {
                CompanyName,
                ContractNumber,
                CompanyCode,

                PageNumber,
                PageSize


            },
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }


        };

        try {
            const { data, status } = await GetShoppingContracts(config)
            if (status === 200) {

                setShippingContract(data.result.shippingContracts.values)
             
                sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));
                setTotalCount(data.result.shippingContracts.totalCount)

            }
        } catch (error) {
            console.log(error);
        }
    }
    const openModal = (id: any) => {
        setIsOpen(true);
        setId(id)

    }
    const closeModal = () => {
        setIsOpen(false);
    }
    const getShippingContartcs = async () => {
        let config = {

            headers: { 'Content-Type': 'application/json' },

            params: {
                CompanyName: null,
                ContractNumber: null,
                CompanyCode: null,

                PageNumber: 0,
                PageSize: 10,


            },
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }


        };

        try {
            const { data, status } = await GetShoppingContracts(config)
            setGeData(false)
            setShippingContract(data.result.shippingContracts.values)
            setTotalCount(data.result.shippingContracts.totalCount)
        } catch (error) {
            console.log(error);
        }
    }
    const getShippingCompanies = async () => {
        try {
            const { data, status } = await GetAllShippingCompanies();

            setShippingCompanies(data.result.shippingCompanies.values)

        } catch (error) {
            console.log(error);
        }
    }


    const editHandler = (id: number) => {
        navigate(`/admin/editShippingContract/${id}`)
    }


    const navigate = useNavigate()
    const formHandler = () => {
        navigate("/admin/newShippingContract")
    }


    const columns = useMemo(() => [
        { Header: '#', accessor: 'id' },
        { Header: 'شماره قرارداد', accessor: 'contractNumber' },
        {
            Header: 'نام باربری', accessor: 'shippingCompanyName'
        }
        ,{
            Header: 'کالا', accessor: 'productName',Cell:(row:any)=>{

                if(row.row.original.productId===null){
                    return(' عمومی')
                }
                else{
                    return(row.row.original.productName)
                }
            }
        }
        ,{
            Header: 'انبار', accessor: 'wareHouseName',Cell:(row:any)=>{

                if(row.row.original.wareHouseId===null){
                    return('نا مشخص')
                }
                else{
                    return(row.row.original.wareHouseName)
                }
            }
        }
        ,
        { Header: ' مقدار ', accessor: 'quantity', Cell: (row: any) => { return (formatter.format(row.row.original.quantity)) } },
        {
            Header: 'واحد', accessor: 'measureUnitId', Cell: (row: any) => {

                return (MeasureUnitSample.filter((item: any) => item.id === row.row.original.measureUnitId).map((item: any) => item.name))
            }
        }
        , {
            Header: ' تاریخ  ', accessor: 'createDate', Cell: (rows: any) => {

                return (new Date(rows.row.original.createDate).toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }))
            }
        }, {
            Header: ' نام شرکت  ', accessor: 'companyName'
        }, {
            Header: 'عملیات', accessor: '11', Cell: (row: any) => {

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

                    </ul>
                )
            }
        }
    ], [ShippingCompanies])
    const data = useMemo(() => ShippingContract, [ShippingContract]);
    const handelSearchFieldClear = async () => {
        setPageNumber(0)
        setCompanyName('')
        setCompanyCode('')
        setContractNumber('')
        setPageSize(10)
        sessionStorage.clear()
        setGeData(true)
        getShippingContartcs()
    }
    if (ShippingContract) {
        const dataForExcel = data.map((item: any) => ({
            'شناسه': item.id,
            'نام شرکت': item.name,
            'کد': item.code,
            'تاریخ ایجاد': new Date(item.createDate).toLocaleTimeString('fa-IR')
        }))

        return (
            <div>
                <div className='row'>
                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>


                    </div>
                </div>
                <div className=" statbox widget-content widget-content-area mb-1 mt-1 p-2 my-1  ">
                    <AdvancedSearch>

                        <form className='form-row  form-group textOnInput'>


                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1">

                                <label> نام شرکت</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="نام شرکت"
                                    value={CompanyName} onChange={e => setCompanyName(e.target.value)} />
                            </div>

                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
                                <label> کد باربری </label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="کد "
                                    value={CompanyCode} onChange={e => setCompanyCode(e.target.value)} />
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
                                <label> کد قرارداد </label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="کد "
                                    value={ContractNumber} onChange={e => setContractNumber(e.target.value)} />
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
                        <br />
                    </AdvancedSearch>
                </div>
                {getDefault().ContractNumber || getDefault().CompanyName || getDefault().CompanyCode ? <span className="d-block p-3 text-center w-100 bg-light-primary  " style={{ fontSize: "15px" }}>نمایش اطلاعات بر اساس فیلتر  </span> : null}

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

                            <p> آیا مطمئنید
                                کالا {ShippingContract.filter((item: any) => item.id === id).map((item: any) => item.name)}   </p>
                            <p>حذف شود ؟ </p>


                            <button className="btn btn-danger float-left">حذف
                            </button>

                            {/*<button className="btn btn-success float-right" onClick={closeModal}>خیر</button>*/}
                        </div>
                    </Modal>
                    <div>
                        <button className="btn btn-primary m-3" onClick={formHandler}>تعریف قرارداد باربری جدید</button>
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
                        <ExportToExcelProVersion url={`Shipping/GetShippingContracts/${urlForExcel()}`} fileName='لیست قراردادها' />
                    </div>
                </div>
            </div>


        )
    }
    else {
        return (
            <div className='user-progress'>
                <div className='row'>
                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>


                    </div>
                </div>
                <div className=" statbox widget-content widget-content-area mb-1 mt-1 p-2 my-1  ">
                    <AdvancedSearch>

                        <form className='form-row  form-group textOnInput'>


                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1">

                                <label> نام شرکت</label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="نام شرکت"
                                    value={CompanyName} onChange={e => setCompanyName(e.target.value)} />
                            </div>

                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
                                <label> کد باربری </label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="کد "
                                    value={CompanyCode} onChange={e => setCompanyCode(e.target.value)} />
                            </div>
                            <div className="col-lg-2 col-md-4  col-sm-12    mb-1">
                                <label> کد قرارداد </label>

                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="کد "
                                    value={ContractNumber} onChange={e => setContractNumber(e.target.value)} />
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
                            </div> </div>

                        <br />
                    </AdvancedSearch>
                </div>
                {getDefault().ContractNumber || getDefault().CompanyName || getDefault().CompanyCode ? <span className="d-block p-3 text-center w-100 bg-light-primary  " style={{ fontSize: "15px" }}>نمایش اطلاعات بر اساس فیلتر  </span> : null}

                <div className=" statbox widget-content widget-content-area">
                    <div>
                        <button className="btn btn-primary m-3" onClick={formHandler}>تعریف قرارداد باربری جدید</button>



                        <div className='text-center mt-5'>
                            <h5>اطلاعاتی جهت نمایش موجود نیست</h5>
                        </div>


                    </div>
                </div>


            </div>
        )
    }

}
export default ShoppingContractList