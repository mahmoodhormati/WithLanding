import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { Link } from 'react-router-dom'
import Select from 'react-select';
import { ClipLoader } from 'react-spinners'
import { GetAllShippingCompanies, GetShoppingContractWithCompany } from '../../../../../services/ShippingService';


const customStyles: any = {
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
interface Props {
    contractIds: any, addContract: any, Allcontract: any, getshippingsContract: any
}

const ContractProductSupply: React.FC<Props> = ({ contractIds, addContract, Allcontract, getshippingsContract }) => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [shippingCompany, setShippingCompanys] = useState([]);
    const [shippingCompanyId, setShippingCompanysId] = useState(0);
    const [shippingContract, setShippingContract] = useState([]);
    const [shippingContractId, setShippingContractId] = useState(0);
    let [arrayIds, setarryIds] = useState<any>([])
    const openModal = () => {
        setIsOpen(true);
    }
    const closeModal = () => {
        setIsOpen(false);
    }

    const getShippingCompany = async () => {
        try {
            const { data, status } = await GetAllShippingCompanies();

            setShippingCompanys(data.result.shippingCompanies.values)

        } catch (error) {
            console.log(error);
        }
    }
    const getShippingContractCompany = async (id: number) => {
        try {
            const { data, status } = await GetShoppingContractWithCompany(id);

            setShippingContract(data.result.shippingContracts.values)

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        getShippingCompany()

    }, [])

    const shippingCompanySelect = () => {
        return (shippingCompany.map((data: any) => ({ label: data.name, value: data.id })))
    }
    const shippingContractSelect = () => {
        if (shippingContract !== null) {
            return (shippingContract.map((data: any) => ({ label: data.contractNumber, value: data.id })))
        }

    }

    const handelAddNewContract = (id: number) => {


        addContract([...new Set([...contractIds, id])])


        closeModal()
    }




    const handelDeleteContract = (id: number) => {


        addContract([...contractIds.filter((i: any) => i !== id)])


    }

    return (
        <div className=" rounded ProductSupplyCondition ">
            {contractIds.length < 1 ? (<span className="d-block text-center p-5 m-4">هیچ قراردادی یافت نشد</span>) : (
                <div className=" ProductSupplyCondition-table table  table-hover table-striped  p-2">
                    <table
                        className="  mt-2  mb-4">
                        <thead>
                            <tr style={{ fontSize: '10px' }}>

                                <th style={{ fontSize: '10px' }} className="text-center">ردیف</th>
                                <th style={{ fontSize: '10px' }} className="text-center">شناسه قرارداد</th>
                                <th style={{ fontSize: '10px' }} className="text-center"> شماره قرارداد</th>
                                <th style={{ fontSize: '10px' }} className="text-center">شرکت باربری</th>

                                <th style={{ fontSize: '10px' }} className="text-center">عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Allcontract.length > 0 ? Allcontract.map((i: any, index: number) => (


                                <tr key={i.id}>

                                    <td style={{ backgroundColor: 'transparent' }}>{index + 1}</td>
                                    <td style={{ backgroundColor: 'transparent' }}>{i.id}</td>
                                    <td style={{ backgroundColor: 'transparent' }}>{i.contractNumber}</td>
                                    <td style={{ backgroundColor: 'transparent' }}>{i.shippingCompanyName}</td>
                                    <td style={{ backgroundColor: 'transparent' }}>
                                        <button className="m-1 p-0 border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip" data-placement="top" title="حذف" onClick={() => handelDeleteContract(i.id)} >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20"
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
                                    </td>

                                </tr>

                            ))

                                : ''}

                        </tbody>
                    </table>
                </div>)}
            <div className='d-block  '>


                <Link to='#' style={{ marginTop: '-1.2rem', marginLeft: '.6rem', background: 'white' }}
                    className=" ProductSupplyCondition-add border-0      float-right " data-title='افزودن قرارداد'
                    onClick={() => openModal()}>
                    <svg style={{ width: '24px', height: '38px' }} xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                        className="bi bi-plus-circle" viewBox="0 0 17 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path
                            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                </Link>

                <Modal isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Selected Option"
                    ariaHideApp={false}>


                    <div style={{ width: '30rem', height: '12rem' }}>

                        <div className="row form-group textOnInput mb-4 mt-4">

                            <div className="col-6 mb-4">

                                <label>شرکت باربری</label>
                                <Select
                                    menuShouldScrollIntoView={false}
                                    placeholder="شرکت باربری"
                                    options={shippingCompanySelect()}
                                    maxMenuHeight={150}
                                    onChange={(e: any) => {
                                        setShippingCompanysId(e.value)
                                        getShippingContractCompany(Number(e.value))
                                    }} />
                            </div>
                            <div className="col-6 mb-4">

                                <label>قراداد باربری</label>
                                <Select
                                    placeholder="قراداد باربری"
                                    options={shippingContractSelect()}
                                    maxMenuHeight={100}
                                    menuShouldScrollIntoView={false}

                                    onChange={(e: any) => {
                                        setShippingContractId(e.value)
                                    }} />
                            </div>

                        </div>




                        <div className='d-flex justify-content-around mt-4 '>


                            <button className="btn btn-success  " onClick={() => handelAddNewContract(shippingContractId)}
                            >افزودن به لیست
                                <ClipLoader

                                    loading={loading}
                                    color="#ffff"
                                    size={15}
                                /></button>


                            <button className="btn btn-danger  "
                                onClick={closeModal}>بازگشت
                            </button>

                        </div>



                    </div>


                </Modal>
            </div>
        </div>

    )
}

export default ContractProductSupply