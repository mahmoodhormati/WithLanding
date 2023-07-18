import React, { useState, useEffect } from 'react'
import { GetAttribute } from '../../../services/attributeService';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import MyTable from '../../../Common/Shared/Form/MyTable';
import { DeleteGroup, GetGroupsForEntity, GetGroupWithCompany, SetGroup } from '../../../services/GroupService';
import Modal from 'react-modal';
import ModalGroupWork from "../../../Common/Shared/Common/ModalGroupWork";
import { setCustomerInfo } from "../../../services/customerService";
import MyTableBazargah from "../../../Common/Shared/Form/MyTableBazargah";
import { toast } from 'react-toastify';
import { GetCompanyChild } from '../../../services/companiesService';
import AdvancedSearch from '../../../Common/Shared/Common/AdvancedSearch';
import Select from 'react-select';
import MySimpleTable from '../../../Common/Shared/Form/MySimpleTable';


export const CustomersGroup: React.FC = () => {
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
    const navigate = useNavigate();
    const [customerg, setCustomerg] = useState<any>([])
    const [userCompanies, setUserCompanies] = useState<any>([])
    const [modalIsOpen, setIsOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState([])
    const [stateSuccess, SetStateSuccess] = useState(0)
    const [stateError, SetStateError] = useState(0)
    const [open, SetOpen] = useState(false);
    let [companyId, SetcompanyId] = useState<any>()
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
                const { data, status } = await DeleteGroup(arrayOfData[i].id)
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
        const copyData = arrayOfData.map((item: any) => { return { ...item, id: 0, active: true, createDate: new Date() } })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {


            try {
                let payload = {
                    'group': copyData[i]
                }
                const { data, status } = await SetGroup(payload)
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
                let payload = {
                    'group': copyData[i]
                }

                const { data, status } = await SetGroup(payload)
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
                    'group': copyData[i]
                }
                const { data, status } = await SetGroup(payload)
                SetOpen(true)
                if (status === 200) {

                    SetStateSuccess(successCount += 1)

                }


            } catch (error) {
                SetOpen(true)

                SetStateError(errorCount += 1)

            } finally {

            }


        }


    }
    const [id, setId] = useState(0)
    const openModal = (id: number) => {
        setIsOpen(true);
        setId(id)

    }
    const closeModal = () => {
        setIsOpen(false);
    }
    const GetCurrentUserCompany = async () => {

        try {
            const { data, status } = await GetCompanyChild()
            if (status === 200) {
                setUserCompanies(data.result.companies)
                SetcompanyId(data.result.companies[0].id)
            }
        } catch (error) {
            console.log();
        }

    }
    // const GetCustomerGroup = async () => {
    //     const response = await GetCompanyChild();
    //     let companies = response.data.result.companies
    //     let arr = []
    //     let finalArr=[]
    //     for (let i = 0; i < companies.length; i++) {

    //         const { data, status } = await GetGroupWithCompany(1, companies[i].id);

    //         if(data.result.groups.length>0)
    //         {
    //            arr.push(data.result.groups)
    //         }


    //     }

    //     finalArr=Array.prototype.concat.apply([], arr);

    //     setCustomerg(finalArr);

    // }

    const GetCustomerGroup = async (companyId: number) => {
        if (userCompanies.length === 1) {
            try {

                const { data, status } = await GetGroupWithCompany(1, userCompanies[0].id);
                setCustomerg(data.result.groups)

            } catch (error) {

            }

        }
        else {
            if (companyId !== undefined && companyId > 0)
                try {
                    const { data, status } = await GetGroupWithCompany(1, companyId);
                    setCustomerg(data.result.groups)

                } catch (error) {

                }

        }


    }

    useEffect(() => {
        GetCurrentUserCompany()


    }, [])

    useEffect(() => {
        GetCustomerGroup(companyId)


    }, [companyId])





    const editHandler = (id: number) => {
        navigate(`/admin/editcustomergroupName/${id}`)
    }
    const deletHandler = async () => {
        try {
            const { data, status } = await DeleteGroup(id)
            if (data.success == true) {
                setIsOpen(false)
                GetCustomerGroup(companyId);


                toast.success('گروه حذف شد', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });

            }
        } catch (err) {
            console.log(err)
            setIsOpen(false)

        }
    }
    const columns = useMemo(() => [
        { Header: '#', accessor: 'id' },
        { Header: 'نام', accessor: 'name' }, {
            Header: 'عملیات', accessor: '11', Cell: (row: any) => {

                return (
                    <ul className="table-controls">

                        <button className="border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip" data-placement="top" title="ویرایش"
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


                        <button onClick={() => openModal(row.row.original.id)} className="border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip" data-placement="top" title="حذف">
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
    ], [])
    const companys = () => {
        return (userCompanies.map((item: any) => ({ label: item.name, value: item.id })))

    }
    let defaultValue = companys()[0]

    const data = useMemo(() => customerg, [customerg]);
    const handelForm = () => {
        navigate('/admin/newcustomergroup')
    }
    if (customerg && customerg.length > 0) {

        return (
            <div className=''>
                <div className=''>
                    <div className='statbox widget-content widget-content-area mb-2'>

                        {userCompanies.length > 1 ?

                            <form className='col-lg-4 col-md-4  col-sm-12  mb-1  textOnInput form-group'>

                                <div className="form-control-sm">
                                    <label> شرکت</label>
                                    <Select
                                        defaultValue={defaultValue}
                                        placeholder='نام شرکت'
                                        options={companys()}
                                        key={defaultValue}
                                        isClearable={true}
                                        onChange={e =>
                                            SetcompanyId(e.value)
                                        }

                                    />
                                </div>


                            </form>

                            : ''}


                    </div>
                </div>

                <div className=" statbox widget-content widget-content-area">
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Selected Option"
                        ariaHideApp={false}

                    >
                        <>



                            <p> آیا مطمئنید  گروه {customerg.filter((item: any) => item.id === id).map((item: any) => item.name)}   </p>
                            <p>حذف شود ؟ </p>




                            <button className="btn btn-danger float-left" onClick={deletHandler}>حذف
                            </button>

                            <button className="btn btn-success float-right" onClick={closeModal}>خیر</button>
                        </>
                    </Modal>
                    <div>
                        <button className="btn btn-primary m-3" onClick={handelForm}>تعریف گروه</button>
                        <MySimpleTable columns={columns} data={data} getData={(rows: any) => setSelectedRows(rows)} bulkJob={getBulkJob} />
                        <ModalGroupWork open={open} close={close} success={stateSuccess} error={stateError} />

                    </div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className=''>
                <div className=''>
                    <div className='statbox widget-content widget-content-area mb-2'>

                        {userCompanies.length > 1 ?


                            <form className='col-lg-4 col-md-4  col-sm-12  mb-1  textOnInput form-group'>

                                <div className="form-control-sm">
                                    <label> شرکت</label>
                                    <Select
                                        menuShouldScrollIntoView={false}
                                        defaultValue={defaultValue}
                                        placeholder='نام شرکت'
                                        options={companys()}
                                        key={defaultValue}
                                        isClearable={true}
                                        onChange={e => {


                                            SetcompanyId(e.value)


                                        }

                                        }

                                    />
                                </div>


                            </form>

                            : ''}

                    </div>
                </div>
                <div className=" statbox widget-content widget-content-area">
                    <div>

                        <button className="btn btn-primary m-3" onClick={handelForm}> تعریف گروه جدید</button>

                        <div className='text-center mt-5 '>
                            <h5>اطلاعاتی جهت نمایش موجود نیست</h5>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}
