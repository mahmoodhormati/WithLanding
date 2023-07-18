import { GetOrder } from '../../../services/orderService';
import Order from '../../../Common/models/order';

export async function getOrder(id:number){
    let order:Order;
    try {
        const { data, status } = await GetOrder(id)
        if(status===200){
            order=data.result.order
            return order
        }
    }
    catch(e){

        return 
    }

}