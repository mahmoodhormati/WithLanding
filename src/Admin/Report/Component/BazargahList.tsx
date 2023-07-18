import React, { useState, useMemo } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa";
import { NavLink } from 'react-router-dom';

import { GetBazargahKharidList, GetBazargahKharidListWithCompany } from '../../../services/outScopeService';
import MyTable from '../../../Common/Shared/Form/MyTable';

import FadeLoader from 'react-spinners/FadeLoader'
import MyTableBazargah from "../../../Common/Shared/Form/MyTableBazargah";
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Select from 'react-select';


const BazargahList: React.FC = () => {
    const [StartDate, setStartDate] = useState('');
    const companies = useSelector((state: RootState) => state.companies)
    const [EndDate, setEndDate] = useState('');
    const [Response, SetResponse] = useState([]);
    const [clicked, SetClicked] = useState(false)
    const [selectedRows, setSelectedRows] = useState([])
    const [stateSuccess, SetStateSuccess] = useState(0)
    const [stateError, SetStateError] = useState(0)
    const [show, SetShow] = useState(false);
    const [disable, setDisable] = useState(false);

    const [open, SetOpen] = useState(false);
    let [loading, setLoading] = useState(false);
    const [companyId, SetCompnayId] = useState(0)
    let [color, setColor] = useState("#0c4088");
    const close = () => {
        SetOpen(false);
    }
    let arrayOfSelectedData = [];
    const getSelectedData = (data: any) => {

        arrayOfSelectedData = data.map((item: any) => item.original);


        return (arrayOfSelectedData)

    }

    const CompaniesIDs = () => {
        let all =companies.map((data:any) => ({ label: data.name, value: data.id }))
        return ([{label :"همه", value : null} , ...all ])
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


    }
    const enableSelectedItem = async () => {

    }
    const disableSelectedItem = async () => {

    }

    const handleStartDate = (value: any) => {

        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value === null) {
            setStartDate('')
        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            setStartDate(new Date(value.toDate().setHours(3, 30, 0, 0)).toJSON())
        }

    }
    const handleEndDate = (value: any) => {

        //تغییرات روی تاریخ رو اینجا اعمال کنید

        if (value === null) {
            setEndDate('')
        }
        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            setEndDate(new Date(value.toDate().setHours(3, 30, 0, 0)).toJSON())
        }

    }
    const handelSubmit = async (event: any) => {
        setLoading(true)
        event.preventDefault();
        if (companies.length === 1) {
            try {
                let CompanyId = companies[0].id
                const { data, status } = await GetBazargahKharidListWithCompany(StartDate, EndDate, CompanyId);
                if (status === 200) {

                    SetResponse(data.result.bazarGahKharidList);
                    SetClicked(true);
                    setLoading(false)
                }
            } catch (error) {
                console.log(error);
            }
        }
        else {

            try {
                const { data, status } = await GetBazargahKharidListWithCompany(StartDate, EndDate, companyId);
                if (status === 200) {

                    SetResponse(data.result.bazarGahKharidList);
                    SetClicked(true);
                    setLoading(false)
                }
            } catch (error) {
                console.log(error);
            }


        }
    }
    const handelFrom = () => {
        SetClicked(false)
    }
    let formatter = new Intl.NumberFormat('fa-IR', {
        style: 'currency',
        currency: 'IRR',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,


    });
    let formater = new Intl.NumberFormat('fa-IR', {


    });

    const columns = useMemo(() => [
        { Header: '#', accessor: 'id' },
        { Header: 'تاریخ', accessor: 'date' },
        { Header: 'کوتاژ', accessor: 'goodTag' },
        { Header: 'کالا', accessor: 'productName' },
        { Header: 'وزن', accessor: 'qty', Cell: (row: any) => (formater.format(row.row.original.qty)) },
        { Header: 'تحویلی', accessor: 'wBarnameShode', Cell: (row: any) => (formater.format(row.row.original.wBarnameShode)) },
        { Header: 'پیگری', accessor: 'traceCode' },
        { Header: 'خریدار', accessor: 'buyerName' },
        { Header: 'شماره همراه', accessor: 'buyerPhone' },
        { Header: 'شناسه ملی', accessor: 'buyerId' },
        { Header: 'شناسه یکتا', accessor: 'buyerUniqueId' },
        { Header: 'مبلغ-ریال', accessor: 'totalValue', Cell: (row: any) => (formater.format(row.row.original.totalValue)) },
        { Header: 'پرداخت', accessor: 'paymentTerm' },
        { Header: 'شناسه واریز', accessor: 'buyerpaymentId' },
        { Header: 'قیمت-ریال', accessor: 'fee', Cell: (row: any) => (formater.format(row.row.original.fee)) },
        { Header: 'تخصیص', accessor: 'allocationState', Cell: (row: any) => ((row.row.original.allocationState) ? 'تخصیص یافته' : 'تخصیص نیافته') },
        {
            Header: 'ثبت', accessor: (d: any) => {

                let condition = (d.storedInDb ? 'ثبت شده' : 'ثبت نشده')
                return (`${condition}`)

            }, Cell: (row: any) => ((row.row.original.storedInDb) ? 'ثبت شده' : 'ثبت نشده')
        },
        {
            Header: 'قفل', accessor: (d: any) => {

                let condition = (d.lockedData ? 'قفل شده' : 'قفل نشده')
                return (`${condition}`)

            }, Cell: (row: any) => ((row.row.original.lockedData) ? 'قفل شده' : 'قفل نشده')
        },
        {
            Header: 'نام شرکت', accessor:'companyName'
        }




    ], []);
    let defaultValue: any = CompaniesIDs()[0]
    const data = useMemo(() => Response, [Response]);;
    if (!clicked) {
        if (!loading) {
            return (
                <div className='user-progress' >
                    <div className='row'>
                        <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                            <h5 >درخواست اطلاعات </h5>
                            <p>در این بخش می توانید اطلاعات سفارش ها را از بازارگاه دریافت کنید.</p>
                        </div>
                    </div>
                    <div className='row d-flex justify-content-center '>
                        <div className='col-lg-4 col-md-6 col-sm-11 m-2'>


                            <form >
                                {companies.length > 1 ?
                                    <div className="col mb-4  form-group textOnInput">

                                        <label> شرکت</label>
                                        <Select
                                            menuShouldScrollIntoView ={false}
                                            defaultValue={defaultValue}
                                            
                                            placeholder='نام شرکت'
                                            options={CompaniesIDs()}
                                            key={defaultValue}
                                            isClearable={true}
                                            onChange={e => {


                                                SetCompnayId(e.value)


                                            }

                                            }

                                        />


                                    </div> : ''}
                                <div className='row'>
                                    <div className=" col ">
                                        <div className=" mb-4 " style={{ position: 'relative' }}>
                                            <label style={{ position: 'absolute', zIndex: '1', top: '-15px', right: '10px', background: 'white', padding: '0 8px' }}>از تاریخ </label>
                                            <div className='form-group '>
                                                <DatePicker
                                                    calendar={persian}

                                                    locale={persian_fa}
                                                    style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                                    value={StartDate}
                                                    onChange={handleStartDate}
                                                />

                                            </div>
                                        </div>
                                        {show ? <p style={{ color: 'red' }}> شروع تاریخ از 1401/4/1 است</p> : null}
                                    </div>
                                    <div className=" col ">
                                        <div className=" mb-4 " style={{ position: 'relative' }}>
                                            <label style={{ position: 'absolute', zIndex: '1', top: '-15px', right: '10px', background: 'white', padding: '0 8px' }}>تا تاریخ </label>
                                            <div className='form-group '>
                                                <DatePicker

                                                    calendar={persian}

                                                    locale={persian_fa}
                                                    style={{ height: '45.39px', width: '100%', textAlign: 'center' }}
                                                    value={EndDate}
                                                    onChange={handleEndDate}
                                                />

                                            </div></div>

                                    </div>



                                </div>

                                <div className='row justify-content-between'>
                                    <div className='col-6 '>
                                        <button type="submit" disabled={disable} className="btn btn-success float-right " onClick={handelSubmit} >تایید</button>
                                    </div>
                                    <div className='col-6 '>
                                        <NavLink to='/admin' className="btn btn-danger ">بازگشت</NavLink>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>

            )
        }
        else {
            return (
                <div style={{ position: 'fixed', top: '40%', left: '40%' }}>
                    <p>دریافت اطلاعات ...</p>
                    <FadeLoader loading={loading} color={color} />
                </div>
            )

        }
    }

    else {

        return (
            <div className=" statbox widget-content widget-content-area ">
                <div>
                    <button className="btn btn-primary m-3" onClick={handelFrom} >تغییر تاریخ</button>
                    {Response.length > 0 ?
                    <MyTableBazargah columns={columns} data={data} getData={(rows: any) => setSelectedRows(rows)} rowProps={(row: any) => ({


                        style: {
                            backgroundColor: (row.values.ثبت === 'ثبت شده' && row.values.قفل === 'قفل نشده') ? 'lightgreen' : (row.values.قفل === 'قفل شده' && row.values.ثبت === 'ثبت شده') ? 'yellow' : '#ff00003b',

                            cursor: "pointer"
                        }
                    })} bulkJob={getBulkJob}
                    />
                        : <div className=" statbox widget-content widget-content-area">
                            <div>
                                <div className='text-center mt-5'>
                                    <h5>اطلاعاتی جهت نمایش موجود نیست</h5>
                                </div>
                            </div>
                        </div> }
                    {/*<ModalGroupWork open={open} close={close} success={stateSuccess} error={stateError} />*/}
                </div>
            </div>

        )

    }
}




// ) نمیشه این رو استفاده کنیم باید یه فکر دیگ بکنیم}
export default BazargahList