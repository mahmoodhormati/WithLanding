import { NewProduct } from './product';
import { ProductSupply } from './productSupply';
import { ProductSupplyConidtion } from './productSupplyCondition';



export interface shoppingCartItem {

    id?: number,
    productId?: number,
    customerId?: number,
    measureUnitId?: number,
    quantity?: number,
    createDate?: string,
    updateDate?: string,
    productSupplyId?: number,
    price?: number,
    product?: NewProduct ,
    productSupply?:ProductSupply,
    productSupplyCondition?:ProductSupplyConidtion


}
export interface shoppingCartItems extends Array<shoppingCartItem>{}