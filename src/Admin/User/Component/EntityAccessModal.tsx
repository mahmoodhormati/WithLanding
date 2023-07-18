import React, { useState,useEffect } from 'react'
import Modal from 'react-modal'
import { ClipLoader } from 'react-spinners'
import Select from 'react-select';
import { SetCompanyEntityAccess } from '../../../services/companiesService';
import { toast } from 'react-toastify';
import { GetGroupWithCompany } from '../../../services/GroupService';

const customStyles = {
    content: {

        inset: '50% auto auto 50%',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '30px',
        border: '2px ridge black',
        maxHeight:'80vh'

    }

}


interface Props {
    entityId: any, modalIsOpen: any, closeModal: any, entityTypeId: any, groups: any, companies: any, currentItem: any
}


const EntityAccessModal: React.FC<Props> = ({ groups, companies, entityId, entityTypeId, modalIsOpen, closeModal, currentItem }) => {



    const [loading, setLoading] = useState(false)
    const [companyId, setcompanyId] = useState(currentItem?currentItem.companyId: 0)
    const [groupId, setgroupId] = useState( currentItem?currentItem.groupId:0)
    const [Groups, setGroups] = useState([])


  

 




    const setDefault = () => {
        setcompanyId(0)
        setgroupId(0)
      

        if (currentItem) {
            const { companyId, groupId } = currentItem

            setcompanyId(companyId)
            setgroupId(groupId)
          

          
        }
    }
   

    useEffect(()=>{

setDefault()

    },[currentItem])
    

    const getGroupsByCompanyId=async(companyId:any)=>{
        

            try {
                const { data, status } = await GetGroupWithCompany(1, companyId);
                setGroups(data.result.groups)

            } catch (error) {

            }

        
    }
 
    


    const setAccess = async () => {

        try {

            const body = {
                "entityTypeId": entityTypeId,
                "entityId": entityId,
                "companyId": companyId,
                "groupId": groupId
            }


          
            
            const { data, status } = await SetCompanyEntityAccess(body)


            if (status === 200) {
                toast.success('دسترسی بروز شد', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });


                closeModal()
            }



        } catch (error) {

            console.log(error);
            closeModal()

        }


    }


    const comboCompanies = () => {

        if (companies) {
            return (companies.map((i: any) => ({ label: i.name, value: i.id })))
        }
    }

    const groupCombo = () => {
        if (currentItem && groups) {

            return (groups.filter((i: any) => i.companyId === companyId).map((i: any) => ({ label: `${i.label} (${i.companyName})`, value: i.value })))
        }
        else{
            return (Groups.map((i: any) => ({ label: `${i.name} (${i.companyName})`, value: i.id })))

        }
    }
    return (


        <Modal

            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Selected Option"
            ariaHideApp={false}

        >
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
            <div >
                <div className="card-body p-0  overflow-hidden" style={{ height: '17rem', width: '30rem', overflow: 'auto' }}>
                    <div className="mb-4 text-left">




                    </div>


                    <div className='row '>



                        <div className="col-lg-12 col-md-12  col-sm-12 textOnInput  mt-4">

                            <label >نام شرکت</label>
                            {companyId !== 0 ? <Select
                            value={comboCompanies().filter((i:any)=>i.value===companyId).map((item:any)=>item)}
                                placeholder='نام شرکت'
                                maxMenuHeight={150}
                                options={comboCompanies()}

                                isDisabled={currentItem!==null?true:false}
                                menuShouldScrollIntoView={false}
                                onChange={(e: any) => { setcompanyId(e.value)
                                    getGroupsByCompanyId(e.value)
                                }}


                            /> : <Select
                                placeholder='نام شرکت'
                                maxMenuHeight={150}
                                options={comboCompanies()}
                               
                                menuShouldScrollIntoView={false}
                                onChange={(e: any) =>{ setcompanyId(e.value)
                                    getGroupsByCompanyId(e.value)
                                }}
                            />}

                        </div>
                        <div className="col-lg-12 col-md-12  col-sm-12 textOnInput  mt-4">
                            <label >نام گروه</label>
                            {groupId!==0?<Select
                            value={groupCombo().filter((i:any)=>i.value===groupId).map((item:any)=>item)}
                                placeholder='نام گروه'
                                maxMenuHeight={150}
                                options={groupCombo()}
                                
                                menuShouldScrollIntoView={false}
                                onChange={(e: any) => setgroupId(e.value)}
                            />:
                            <Select
                                placeholder='نام گروه'
                                maxMenuHeight={150}
                                options={groupCombo()}
                                isClearable={true}
                                menuShouldScrollIntoView={false}
                                onChange={(e: any) => setgroupId(e.value)}
                            />}

                        </div>






                    </div>
                </div>




                <div className='row '>

                    <div className='col-6 '>
                        <button className="btn btn-success float-left "
                            onClick={setAccess} >تایید
                            <ClipLoader

                                loading={loading}
                                color="#ffff"
                                size={15}
                            /></button>
                    </div>
                    <div className='col-6 '>
                        <button className="btn btn-danger float-right "
                            onClick={function () {
                                closeModal()
                            }}>انصراف
                        </button>
                    </div>
                </div>
            </div >


        </Modal >)
}

export default EntityAccessModal