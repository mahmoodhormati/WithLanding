import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import QueryString from 'qs';
import { GetAllWallets } from '../../services/walletService';
import { useMemo } from 'react';
import { PriceUnitEnums } from './../../Common/Enums/PriceUnit';
import AdvancedSearch from '../../Common/Shared/Common/AdvancedSearch';
import Modal from 'react-modal';
import Select from 'react-select';
import MyTable from '../../Common/Shared/Form/MyTable';
import ModalGroupWork from '../../Common/Shared/Common/ModalGroupWork';



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
const WalletList: React.FC = () => {
    const [PageNumber, setPageNumber] = useState(getPage().PageNumber ? getPage().PageNumber : 0)
    const [PageSize, setPageSize] = useState(getPage().PageSize ? getPage().PageSize : 10)
    const [totalCount, setTotalCount] = useState(0);
    const [wallets, SetWallets] = useState<any>([])
    const [selectedRows, setSelectedRows] = useState([])
    const [CompanyId, SetCompanyId] = useState(getDefault().CompanyId)
    const [UserName, SetUserName] = useState(getDefault().UserName)
    const [stateSuccess, SetStateSuccess] = useState(0)
    const [stateError, SetStateError] = useState(0)
    const [NationalCode, SetNationalCode] = useState(getDefault().NationalCode)
    const [getData, setGeData] = useState(false)
    const [modalIsOpen, setIsOpen] = useState(false);
    const [open, SetOpen] = useState(false);
    const companies = useSelector((state: RootState) => state.companies)

    const navigate = useNavigate()
    const param = { PageSize, PageNumber }

    function getPage() {
        let items = JSON.parse(String(sessionStorage.getItem(`param${window.location.pathname}`)));
        return items ? items : ''


    }
    const params = { CompanyId, UserName, NationalCode }
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
    const closeModal = () => {
        setIsOpen(false);
    }


    const getDataBySearch = async () => {
        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {

                CompanyId,
                IsAdmin: true,
                UserName,
                NationalCode,
                PageNumber,
                PageSize


            }
            ,
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }

        };

        try {
            const { data, status } = await GetAllWallets(config);
            if (status === 200) {
                SetWallets(data.result.wallets.values)
                setTotalCount(data.result.wallets.totalCount)

                sessionStorage.setItem(`params${window.location.pathname}`, JSON.stringify(params));
                sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));


            }

        } catch (err) {
            console.log(err)
            SetWallets(null)
        }
    }


    const getDataByPage = async () => {
        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {

                CompanyId,
                IsAdmin: true,
                UserName,
                NationalCode,
                PageNumber,
                PageSize


            }
            ,
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }

        };

        try {
            const { data, status } = await GetAllWallets(config);
            if (status === 200) {
                SetWallets(data.result.wallets.values)
                setTotalCount(data.result.wallets.totalCount)

                sessionStorage.setItem(`params${window.location.pathname}`, JSON.stringify(params));
                sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));


            }

        } catch (err) {
            console.log(err)
            SetWallets(null)

        }
    }


    const getWallets = async () => {
        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {

                CompanyId: null,
                IsAdmin: true,
                UserName: null,
                NationalCode: null,
                PageNumber: 0,
                PageSize: 10


            }
            ,
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }

        };

        try {
            const { data, status } = await GetAllWallets(config);
            if (status === 200) {
                SetWallets(data.result.wallets.values)
                setTotalCount(data.result.wallets.totalCount)

                sessionStorage.setItem(`params${window.location.pathname}`, JSON.stringify(params));
                sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));


            }

        } catch (err) {
            console.log(err)
            SetWallets(null)

        }
    }
    let formatterForMoney = new Intl.NumberFormat('fa-IR', {

        currency: 'IRR'


    });

    const columns = useMemo(() => [
        { Header: '#', accessor: 'id' },
        { Header: 'نام و نام خانوادگی', accessor: 'customerName' },
        { Header: 'نام کاربری', accessor: 'customerUserName' },
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
        { Header: 'نام شرکت', accessor: 'companyName' }, {
            Header: 'سوابق', accessor: '  ', Cell: (rows: any) => (



                <div>
                    <Link className="border-0 bg-transparent non-hover edit-btn" to={`/admin/WalletHistory/${rows.row.original.id}`}>
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
        }
    ], [])

    const data = useMemo(() => wallets, [wallets])


    const handelSearchFieldClear = () => {


        SetNationalCode('')
        SetUserName('')


        setPageSize(10)
        SetCompanyId(null)
        sessionStorage.clear()

        setPageNumber(0)
        getWallets()
    }

    const CompaniesIDs = () => {
        let all = companies.map((data: any) => ({ label: data.name, value: data.id }))
        return ([{ label: "همه", value: null }, ...all])
    }
    if (wallets) {

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
                                <label>شماره موبایل</label>
                                <input className="form-control opacityForInput  mb-4" type="text" placeholder='نام کاربری'
                                    value={UserName} onChange={(e: any) => SetUserName(e.target.value)} /></div>

                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label> کد ملی</label>
                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="کد ملی"
                                    maxLength={11} value={NationalCode}
                                    onChange={(e: any) => SetNationalCode(e.target.value)} /></div>
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
                                <label>شماره موبایل</label>
                                <input className="form-control opacityForInput  mb-4" type="text" placeholder='نام کاربری'
                                    value={UserName} onChange={(e: any) => SetUserName(e.target.value)} /></div>

                            <div className="col-lg-2 col-md-4  col-sm-12  mb-1">
                                <label> کد ملی</label>
                                <input className="form-control opacityForInput  mb-4" type="text" placeholder="کد ملی"
                                    maxLength={11} value={NationalCode}
                                    onChange={(e: any) => SetNationalCode(e.target.value)} /></div>
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
export default WalletList