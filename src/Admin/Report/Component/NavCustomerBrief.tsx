import React, { useState, useEffect, useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import {
    GetAllUsers,
    GetDataWithSearch,
    GetForKarbars,
    GetUsersRoles,
    SetUserRole
} from '../../../services/userService';
import { useMemo } from "react";
import MyTable from "../../../Common/Shared/Form/MyTable";
import { setCustomerInfo } from "../../../services/customerService";
import Select from "react-select";
import { ExportToExcel } from '../../../Common/Shared/Common/ExportToExcel';
import { GetAllOrganisation, GetAllOrganisationCode, GetOrganisationById, GetOrganisationCode } from '../../../services/organisationService';
import ModalGroupWork from "../../../Common/Shared/Common/ModalGroupWork";
import AdvancedSearch from "../../../Common/Shared/Common/AdvancedSearch";
import { optionsRole } from "../../../Common/Enums/RolesEnums";
import QueryString from 'qs';
import { GetGroupByIds, GetGroupsForEntity } from '../../../services/GroupService';
import EditCustomerGroup from '../../Customer/Component/EditCustomerGroup';

import { GetCompanyChild } from '../../../services/companiesService';
import { GetGroupWithCompany } from '../../../services/GroupService';
import { GetUsersRolesById } from '../../../services/userService';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { FiFileText } from 'react-icons/fi';
import MyTableBazargah from '../../../Common/Shared/Form/MyTableBazargah';
import { FadeLoader } from 'react-spinners';

const NavCustomerBrief: React.FC = () => {

   
   
    const [UserName, setUserName] = useState('')
    const [FirstName, setFirstName] = useState('')
    const [LastName, setLastName] = useState('')
    const [NationalCode, setNationalCode] = useState('')
    const [clicked, SetClicked] = useState(false)
    const [disable, setDisable] = useState(false);
    const [selectedRows, setSelectedRows] = useState([])


    let [color, setColor] = useState("#0c4088");


    let [loading, setLoading] = useState(false);


    const [users, setUsers] = useState([]);




    const CustomerBriefHandler = (id: any) => {
        navigate(`/admin/customerBrief/${id}`)
    }




    let config = {

        headers: { 'Content-Type': 'application/json' },
        params: {

            UserName: UserName,
            FirstName: FirstName,
            LastName: LastName,
            NationalCode: NationalCode,
            PageNumber: 0,
            PageSize: 100000


        }
        ,
        paramsSerializer: (params: any) => {

            return QueryString.stringify(params)
        }

    };

    const getDataBySearch = async () => {
        setLoading(true)
        const { data, status } = await GetDataWithSearch(config);
        if (status === 200) {
            setUsers(data.result.users.values);

            SetClicked(true);
            setLoading(false)

        }
    }



    const [open, SetOpen] = useState(false);
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
        if (selected === 5) {
            disableSelectedItem()
        }
    }
    const disableSelectedItem = async () => {
    }
    const copySelectedItem = async () => {


    }
    const enableSelectedItem = async () => {


    }
    const handelSubmit = (e:any) => {
        
        getDataBySearch()
    }



    // const getCustomerGroups = async () => {
    //     const response = await GetCompanyChild();
    //     let companies = response.data.result.companies
    //     let arr = []
    //     let finalArr = []
    //     for (let i = 0; i < companies.length; i++) {

    //         const { data, status } = await GetGroupWithCompany(1, companies[i].id);

    //         if (data.result.groups.length > 0) {
    //             arr.push(data.result.groups)
    //         }


    //     }

    //     finalArr = Array.prototype.concat.apply([], arr);

    //     setCustomerG(finalArr);
    // }



    const handelFrom = () => {
        SetClicked(false)
    }




    const addNewUserHandler = () => {
        navigate('/admin/adduser')
    }
    const navigate = useNavigate()



    const columns = useMemo(() => [
        { Header: '#', accessor: 'id' },
        { Header: 'نام کاربری', accessor: 'userName' }
        ,
        {
            Header: 'نام و نام خانوادگی', accessor: (d: any) => {
                let fName = d.firstName;
                let lName = d.lastName;
                let fullname = `${fName ? fName : ''} ${lName ? lName : ''} `;
                return (fullname)
            }, Cell: (row: any) => {
                if (row.row.original.firstName) {
                    let fName = row.row.original.firstName;
                    let lName = row.row.original.lastName;

                    let fullname = `${fName ? fName : ''} ${lName ? lName : ''} `;

                    return (fullname)
                } else {

                    return ('--')
                }


            }
        },

        {
            Header: 'کارنامه مشتری', accessor: '', Cell: (row: any) => (
                <ul className="table-controls">
                    <button className="m-1 p-0 border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip" data-placement="top"
                        title="کارنامه مشتری"
                        onClick={e => CustomerBriefHandler(row.row.original.id)}>
                        <FiFileText size="1.5rem" />
                    </button>
                </ul>
            )
        },

    ], [users])


    const data = useMemo(() => users, [users]);;

    if (!clicked) {
        if (!loading) {
            return (
                <div className='user-progress' >
                    <div className='row'>
                        <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                            <h5 >درخواست اطلاعات </h5>
                            <p>در این بخش می توانید گزارش خلاصه فعالیت مشتری را دریافت کنید.</p>
                        </div>
                    </div>
                    <div className='row d-flex justify-content-center '>
                        <div className=' col-lg-6 col-sm-12 m-2'>


                            <form >
                                <div className='row textOnInput form-group'>
                                    <div className=" col-6 ">
                                        <label>نام</label>

                                        <input className="form-control opacityForInput  mb-4" type="text" placeholder="نام " value={FirstName} onChange={e => setFirstName(e.target.value)} />
                                    </div>



                                    <div className=" col-6 ">
                                        <label>نام خانوادگی</label>

                                        <input className="form-control opacityForInput  mb-4" type="text" placeholder="نام خانوادگی " value={LastName} onChange={e => setLastName(e.target.value)} />
                                    </div>
                                    <div className=" col-6 ">
                                        <label>نام کاربری</label>

                                        <input className="form-control opacityForInput  mb-4" type="text" placeholder="نام کاربری " value={UserName} onChange={e => setUserName(e.target.value)} />
                                    </div>
                                    <div className=" col-6 ">
                                        <label>کد ملی</label>

                                        <input className="form-control opacityForInput  mb-4" type="text" placeholder="کد ملی " value={NationalCode} onChange={e => setNationalCode(e.target.value)} />
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
                        </div >
                    </div >

                </div >

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

        if (users && users.length > 0) {

            return (
                <div className=" statbox widget-content widget-content-area ">
                    <div>
                        <button className="btn btn-primary m-3" onClick={handelFrom} >تغییر فیلتر</button>

                        <MyTableBazargah columns={columns} data={data} getData={(rows: any) => setSelectedRows(rows)} bulkJob={getBulkJob} />
                        {/*<ModalGroupWork open={open} close={close} success={stateSuccess} error={stateError} />*/}
                    </div>

                </div>

            )
        } else {
            return (
                <div className=" statbox widget-content widget-content-area rounded">
                    <button className="btn btn-primary m-3" onClick={handelFrom} >تغییر فیلتر</button>

                    <div className='text-center mt-5'>
                        <h5>اطلاعاتی جهت نمایش موجود نیست</h5>
                    </div>
                </div>
            )
        }


    }
}

export default NavCustomerBrief