import { GetProductWareHouses, SetProductWareHouses } from "../../../services/prodcutWarehouse";
import { useEffect } from "react";
import { useMemo, useState } from "react";
import MyTable from "../Form/MyTable";
import { useRef } from "react";
import { WareHouse } from '../../models/wareHouse';
import { BsChevronBarContract } from "react-icons/bs";
import { formatter } from '../../../Utils/Formatter';

interface Props {
    id: any,
    submit: boolean
}
const ProductWareHouse: React.FC<Props> = ({ id, submit }) => {
    let inp: any = useRef();

    const [wareHouse, setWarehouse] = useState<any>([])
    const [NewwareHouse, setNewWarehouse] = useState<any>([])
    const [active, setActive] = useState<any>([])
    const [Quantity, SetQuantity] = useState<any>('')
    const [inEditMode, setInEditMode] = useState({

        status: false,

        rowKey: null

    });



    const getProductWareHouse = async () => {
        try {
            const { data, status } = await GetProductWareHouses(id)
            setWarehouse(data.result.productWareHouses)

        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        getProductWareHouse()

    }, [])

    

    const onEdit = ( Id:any, currentQuantity : any) => {


        setInEditMode({

            status: true,

            rowKey: Id

        })

        
      
        
        let wareHouseProduct: any = [...wareHouse]
    
      let arr:any=wareHouseProduct.filter((item:any)=>item.wareHouseId===Id).map((item:any)=>({...item,quantity:currentQuantity}))


        let Arr1=wareHouseProduct.filter((item:any)=>item.wareHouseId!==Id)
         let finnalArr=[...Arr1,...arr]

        
         setNewWarehouse(finnalArr)



    }

    const SetProductWare=async(id:any)=>{

     
     
        let wareHouseProduct: any = [...wareHouse]
    
      let arr:any=wareHouseProduct.filter((item:any)=>item.wareHouseId===id).map((item:any)=>({...item,quantity:Quantity}))


        let Arr1=wareHouseProduct.filter((item:any)=>item.wareHouseId!==id)
         let finnalArr=[...Arr1,...arr]

        
      





        try {
            const body={"productWareHouses":finnalArr}
            const {data,status}=await SetProductWareHouses(body)
            if(status===200){
                setInEditMode({

                    status: false,
            
                    rowKey: null
            
                })
            }
           
        } catch (error) {
            
        }
        getProductWareHouse()

    }

    return (
        <div className='row d-flex justify-content-center '>
            <div className="form-group mb-4 mt-3 label textOnInput col-lg-8 rounded border  border-dark ">
                <label>انبارها</label>
                <div className="table-responsive" style={{ overflowX: 'auto', transform: 'rotateX(180deg)' }}>
                    <table className='table mb-4 text-center' style={{ transform: 'rotateX(180deg)' }}>
                        <thead>
                            <tr>
                               
                                <th>شناسه</th>
                                <th>نام</th>
                                <th>مقدار</th>
                                <th>مقدار فروش</th>
                                <th>مقدار رزرو شده</th>
                                <th>عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wareHouse.map((contact: any, index: number) => (

                                <tr style={{ backgroundColor: contact.id !== 0 ? 'lightgray' : 'transparent' }} key={contact.wareHouseId}>
                                  
                                    <td data-th="شناسه">
                                        {contact.wareHouseId}
                                    </td>
                                    <td data-th="نام">
                                        {contact.wareHouseName}
                                    </td>
                                    <td data-th="مقدار" onClick={()=>{onEdit( contact.wareHouseId, Quantity )
                                    SetQuantity(contact.quantity)}}>
                                        {
                                            inEditMode.status && inEditMode.rowKey === contact.wareHouseId ? (
                                                <input type='text' value={formatter.format(Quantity)} onChange={(e: any) => SetQuantity(Number(e.target.value.replaceAll(",", "")))} />
                                            ) :

                                                (formatter.format(contact.quantity))
                                        }

                                    </td>




                                    <td data-th="مقدار فروش">{contact.consumableQuantity}</td>
                                    <td data-th="مقدار رزرو شده">{contact.reservedQuantity}</td>
                                    <td data-th="عملیات">

                                        <button onClick={()=>SetProductWare(contact.wareHouseId)}  className=" bg-transparent non-hover edit-btn">  ثبت
                                        </button></td>

                                </tr>
                            )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
}

export default ProductWareHouse