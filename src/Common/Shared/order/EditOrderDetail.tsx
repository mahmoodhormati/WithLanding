import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { ClipLoader } from 'react-spinners'
import { formatter } from '../../../Utils/Formatter'
import { GetAllProductWithSearch, GetProductSupply } from '../../../services/productSupplyService'
import QueryString from 'qs';
import Select from 'react-select'
import { PaymentStatusEnums } from '../../Enums/PaymentStatus'
import { PaymentStructureEnums } from '../../Enums/PaymentStructureEnums'
import { editOrderDetail } from '../../../services/orderService'
import { toast } from 'react-toastify'
import { GetGroupWithCompany, GetGroupsForEntity } from '../../../services/GroupService'
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
        border: '2px ridge black', maxHeigth: '80vh'
    }

}
interface Props {

    item: any, modalIsOpen: any, closeModal: any, companyId: any,update:any
}

const EditOrderDetail: React.FC<Props> = ({ item, modalIsOpen, closeModal, companyId ,update}) => {

    const [id, setId] = useState(0)
    const [loading, SetLoading] = useState(false)
    const [quntity, SetQuantity] = useState(0)
    const [BasePrice, SetBasePrice] = useState(0)
    const [ProductSupplyId, SetProductSupplyId] = useState<any>(null)
    const [ProductSupply, setProductSupply] = useState<any>([])
    const [supplyConditonId, SetSupplyConditionId] = useState<any>(null)
    const [condtions, SetConditions] = useState<any>([])
    const [groups, SetGroups] = useState<any>([])
    const [Comment,SetComment]=useState('')



    const setDefault = () => {
        GetproductSupplies()
        SetQuantity(0)
        SetBasePrice(0)
        SetProductSupplyId(null)
        SetSupplyConditionId(null)
        setId(0)

        if (item && !Array.isArray(item)) {
            const { id, quantity, basePrice, productSupplyId, productSupplyConditionId,comment } = item
            SetQuantity(quantity)
            SetBasePrice(basePrice)
            SetProductSupplyId(productSupplyId)
            SetSupplyConditionId(productSupplyConditionId)
            setId(id)
            SetComment(comment)
            SetConditions(ProductSupply.filter((i: any) => i.id ===productSupplyId).map((i: any) => i.productSupplyConditions).length>0?ProductSupply.filter((i: any) => i.id ===productSupplyId).map((i: any) => i.productSupplyConditions)[0]:[])

        }
        else{
            SetQuantity(0)
            SetBasePrice(0)
            SetProductSupplyId(0)
            SetSupplyConditionId(0)
           
            setId(0)
            SetComment('')
        }
    }


    const GetproductSupplies = async () => {


        let config = {
            headers: { 'Content-Type': 'application/json' },
            params: {

                CompanyId: companyId,
                PageNumber: 0,
                PageSize: 100000,
                IsAdmin:true
            }
            ,
            paramsSerializer: (params: any) => {
                return QueryString.stringify(params)
            }
        };
        try {
            const { data, status } = await GetAllProductWithSearch(config);
            setProductSupply(data.result.productSupplies.values);
           



        } catch (error) {
            console.log(error);
        }

   
    }
    const GetcustomerGroups = async () => {

        if(modalIsOpen===true){
                let config = {
                    headers: { 'Content-Type': 'application/json' },
                    params: {
        
                        CompanyId: companyId,
                       
                    }
                    ,
                    paramsSerializer: (params: any) => {
                        return QueryString.stringify(params)
                    }
                };
                try {
                    const { data, status } = await GetGroupsForEntity(1,config);
                    SetGroups(data.result.groups);
                   
        
        
        
                } catch (error) {
                    console.log(error);
                }
        
            }
            }
    useEffect(() => {
        
       
        setDefault()
        GetcustomerGroups()
    }, [item])


   


    const handelchange = (e: any) => {

        if (e.value) {
            SetSupplyConditionId(e.value);

            SetBasePrice(condtions.filter((i: any) => i.id === e.value).map((i: any) => i.price)[0])

        }
        


    }
    const productSupplyCombo = () => {

        if (ProductSupply) {
            let array=ProductSupply.map((item: any) => ({ label: `${item.name} #${item.id}`, value: item.id }))
            return ([{ label: "بدون عرضه", value: null }, ...array])
        }
        else {

            return ([])
        }
    }

    

    const ConfitionCombo = () => {



        if (condtions.length > 0) {

            return (condtions.map((i: any) => ({
                label: `شرایط ${i.special === true ? 'خاص' : 'عمومی'} ${i.customerGroupId?groups.filter((item:any)=>item.id===i.customerGroupId).map((item:any)=>item.name)[0]:''}
    ${i.paymentMethodId !== 4 ? (i.paymentMethodId?`${PaymentStructureEnums.filter((b: any) => b.id === i.paymentMethodId).map((b: any) => b.name)[0]} `:'') :

                        `${PaymentStructureEnums.filter((b: any) => b.id === i.paymentMethodId).map((b: any) => b.name)[0]} ${i.installmentOccureCount}
     قسط ${i.installmentPeriod} روزه`}  فی ${formatter.format(i.price)}`, value: i.id
            })))

        }
        else {
            return ([])
        }


    }


    const submitEdit = async () => {


        SetLoading(true)
        if(!Array.isArray(item)){
        try {

            let body = {
                'orderDetail': { ...item, basePrice: BasePrice, quantity: quntity, productSupplyConditionId: supplyConditonId, productSupplyId: ProductSupplyId,comment:Comment }
            }

            const { data, status } = await editOrderDetail(body)
            if (status === 200) {

                toast.success("جزییات با موفقیت ویرایش شد", {
                    position: "top-right",
                    closeOnClick: true,
                });

                SetLoading(false)

                closeModal()
                
                update()

            }

        } catch (error) {

            SetLoading(false)
        }
    }
    else{
        for (let i = 0; i < item.length; i++) {
            try {
                let body = {
                    'orderDetail': { ...item[i], basePrice: BasePrice, quantity: quntity, productSupplyConditionId: supplyConditonId, productSupplyId: ProductSupplyId,comment:Comment }
                }
                const { data, status } = await editOrderDetail(body)
            if (status === 200) {

                toast.success("جزییات با موفقیت ویرایش شد", {
                    position: "top-right",
                    closeOnClick: true,
                });


            }

            } catch (error) {
                
            }
            
        }
        SetLoading(false)

        closeModal()
        
        update()
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
            <div>
                <div className="card-body p-0" style={{ height: '25rem', width: '40rem' }}>


                    <div className="text-center mb-5">
                        <h5 className="text-center">ویرایش جزییات سفارش شماره {id}</h5>
                    </div>
                    <div className="form-row mt-4 textOnInputForGrp ">

                        <div className="  form-group col-md-4 col-xs-4 mb-3 textOnInput">

                            <label>عرضه</label>

                            <Select
                                value={productSupplyCombo().filter((i: any) => i.value === ProductSupplyId).map((i: any) => i)}
                                menuShouldScrollIntoView={false}
                                placeholder="عرضه"
                                options={productSupplyCombo()}

                                isClearable={true}
                                onChange={(e: any) => {
                                    SetProductSupplyId(e.value);
                                    SetSupplyConditionId(null)
                                    
                                    {e.value!==null?SetConditions(ProductSupply.filter((i: any) => i.id === e.value).map((i: any) => i.productSupplyConditions)[0]):SetConditions([])}
                                    
                                }}
                            />



                        </div>
                        <div className="  form-group col-md-8 col-xs-8 mb-3  textOnInput">
                            <label>شرایط عرضه</label>

                            <Select
                                value={ConfitionCombo().filter((i: any) => i.value === supplyConditonId).map((i: any) => i)}
                                menuShouldScrollIntoView={false}
                                placeholder="شرایط عرضه"
                                options={ConfitionCombo()}
                                isDisabled={ProductSupplyId===null}
                                isClearable={true}
                                onChange={(e: any) => {
                                    handelchange(e)


                                }}
                            />

                        </div>
                        <div className="  form-group col-md-6 col-xs-6  textOnInput">

                            <label>وزن</label>

                            <input className='form-control' value={formatter.format(quntity)}
                                onChange={(e: any) => {
                                    SetQuantity(Number(e.target.value.replaceAll(",", "")))

                                }} />



                        </div>
                        <div className="  form-group col-md-6 col-xs-6    ">

                            <label> قیمت پایه </label>
                            <input disabled={ProductSupplyId!==null} className='form-control' value={formatter.format(BasePrice)} onChange={(e: any) => SetBasePrice(Number(e.target.value.replaceAll(",", "")))} />





                        </div>

  <div className="  form-group col-md-12 col-xs-12   ">

                            <label>  توضیحات </label>
                            <textarea  className='form-control' value={Comment} onChange={(e: any) => SetComment(e.target.value)} />





                        </div>

                    </div>

                    <div className='row mt-4 text-center'>

                        <div className='col-12 '>
                            <button className="btn btn-success  "
                                disabled={loading}
                                
                                onClick={submitEdit}>تایید
                                
                                <ClipLoader
                                    
                                    loading={loading}
                                    color="#ffff"
                                    size={15}
                                /></button>

                        </div>

                    </div>
                </div>
            </div>


        </Modal>
    )
}

export default EditOrderDetail