import Modal from 'react-modal';
import { GetShoppingContarcts, GetShoppingContractWithCompany, SetShipping } from "../../../services/ShippingService";
import { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from 'react-toastify';
import { GetAllShippingCompanies } from '../../../services/ShippingService';
import { editOrder } from '../../../services/orderService';
import { ClipLoader } from "react-spinners";
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import  QueryString  from 'qs';

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
interface Props {
    modalIsOpen: any, closeModal: any, orderDetailId: any, Order: any,contractIds:any,update:any

}
const ShippingSelected: React.FC<Props> = ({ modalIsOpen, closeModal, orderDetailId, Order ,contractIds,update}) => {
    const [shippingCompany, setShippingCompanys] = useState([]);
    const [shippingCompanyId, setShippingCompanysId] = useState(0);
    const [shippingContract, setShippingContract] = useState([]);
    const [shippingContractLimit, setShippingContractLimit] = useState([]);
    const [shippingContractId, setShippingContractId] = useState(0);
    const [byPassContractLimit, SetbyPassContractLimit] = useState(false)
    const [byPassAllowedContracts, SetbyPassAllowedContracts] = useState(false)

    let [loading, setLoading] = useState(false);
    const roles = useSelector((state: RootState) => state.roles)
    const getShippingCompany = async () => {
        if(modalIsOpen===true) {
        
        try {
            const { data, status } = await GetAllShippingCompanies();

            setShippingCompanys(data.result.shippingCompanies.values)

        } catch (error) {
            console.log(error);
        }}
    }
    const getShippingContractCompany = async (id: number) => {

        try {
            const { data, status } = await GetShoppingContractWithCompany(id);

            setShippingContract(data.result.shippingContracts.values)

        } catch (error) {
            console.log(error);
        }
    }

   
    

    const  getShippingContractForIds=async()=>{
        if(contractIds){
            let config = {
                headers: { 'Content-Type': 'application/json' },
                params: {
                 
                    Ids:contractIds,
                    PageSize:100000
                    
                }
                ,
                paramsSerializer: (params: any) => {
    
                    return QueryString.stringify(params)
                }
            };

            try {
                const { data, status } = await GetShoppingContarcts(config);
    
                setShippingContract(data.result.shippingContracts.values)
    
                if(status===200){
                    setShippingContractLimit(data.result.shippingContracts.values)
                }
            } catch (error) {
                console.log(error);
            }



        }

    }


    
    useEffect(() => {

        getShippingCompany()
        
    }, [modalIsOpen===true])
    useEffect(() => {

        getShippingContractForIds()
        
    }, [contractIds])

    const shippingCompanySelect = () => {
        return (shippingCompany.map((data: any) => ({ label: data.name, value: data.id })))
    }
    const shippingContractSelect = () => {
        if (shippingContract !== null) {

            if(byPassAllowedContracts===false && shippingContractLimit){
                return (shippingContractLimit.map((data: any) => ({ label: ` قراداد #${data.contractNumber} ${data.shippingCompanyName}`, value: data.id })))
            }
            else{

            return (shippingContract.map((data: any) => ({ label: data.contractNumber, value: data.id })))
            }
        }

    }
    const handelSubmit = async (e: any) => {
        setLoading(true)
        e.preventDefault();
        let body = {}
        if (!Array.isArray(orderDetailId)) {
            body = {
                orderId:Order.id,
                orderDetailId: orderDetailId,
                shippingContractId,
                byPassContractLimit,
                byPassAllowedContracts
            }
            try {
                const { data, status } = await SetShipping(body)
                if (status === 200) {

                    toast.success('حواله با موفقیت صادر شد', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined
                    });
                    let Orders;
                    if (Order) {
                        Orders = Order
                    }
                    const bodyOrder = {
                        "order": { ...Orders, orderStatusId: 9, customer: null, locked: false }
                    }
                    closeModal()

                    const response = await editOrder(bodyOrder)

                    update()
                }
                setLoading(false)

            }
            catch (error) {
                setLoading(false)

            }
            setLoading(false)
        }
        else {
            let notShipped = orderDetailId.filter(item => item.shippingId === null)
            for (let i = 0; i < notShipped.length; i++) {
                body = {
                    orderId:Order.id,
                    orderDetailId: notShipped[i].id,
                    shippingContractId,
                    byPassContractLimit,
                    byPassAllowedContracts
                }

                const { data, status } = await SetShipping(body)
                try {

                    if (status === 200) {

                        toast.success('حواله با موفقیت صادر شد', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: true,
                            progress: undefined
                        });
                        let Orders;
                        if (Order) {
                            Orders = Order
                        }
                        const bodyOrder = {
                            "order": { ...Orders, orderStatusId: 9, customer: null, locked: false }
                        }
                        closeModal()
                        
                        const response = await editOrder(bodyOrder)


                    }
                    
                    


                    setLoading(false)

                } catch (error) {
                    setLoading(false)

                }
            }
            update()

            setLoading(false)
            
        }
        setLoading(false)
   
    }
    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Selected Option"
            ariaHideApp={false}>
            <div style={{ height: '25rem', width: '22rem' }}>
                <h6>ارسال درخواست</h6>
                <p>در ااین بخش میتونید اطلاعات سفارش را برای باربری ارسال نمایید</p>


                <div className='d-flex flex-column'>

                    <div className="col-xl-12 col-md-6  col-xs-12 ">

                        <input type="checkbox" checked={byPassAllowedContracts} onChange={(e: any) => SetbyPassAllowedContracts(e.target.checked)} />
                        <label className="m-1 ml-2">قراردادهای مجاز عرضه را در نظر نگیر</label>

                    </div>
                    <div className=" col-xl-12 col-md-6  col-xs-12  ">

                        <input type="checkbox" checked={byPassContractLimit} onChange={(e: any) => SetbyPassContractLimit(e.target.checked)} />
                        <label className="m-1 ml-2">محدودیت حجم ارسالی قرارداد را در نظر نگیر</label>

                    </div>

                </div>
                <div className="form-group mt-4 textOnInput ">
                    <div className='form-row mb-4'>
                        <div className="col-12 ">

                            <label>شرکت باربری</label>
                            <Select
                                menuShouldScrollIntoView={false}
                                isDisabled={!byPassAllowedContracts}
                                placeholder="شرکت باربری"
                                options={shippingCompanySelect()}
                                maxMenuHeight={150}
                                onChange={(e: any) => {
                                    setShippingCompanysId(e.value)
                                    getShippingContractCompany(Number(e.value))
                                }} />
                        </div>

                    </div>
                    <div className="form-group mb-3 textOnInput">
                        <div className='form-row mb-3'>
                            <div className="col-12 mb-4">

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
                    </div>
                </div>

                <div className='row '>
                    <div className='col-6'>
                        <button type="submit" disabled={loading} onClick={handelSubmit} className="btn btn-primary float-left" >ارسال<ClipLoader

                            loading={loading}
                            color="#ffff"
                            size={15}
                        /></button></div>
                    <div className='col-6'>
                        <button type="submit" onClick={() => closeModal()} className="btn btn-danger float-right" >بازگشت</button>
                    </div>
                </div>
            </div>

        </Modal>
    )
}

export default ShippingSelected

