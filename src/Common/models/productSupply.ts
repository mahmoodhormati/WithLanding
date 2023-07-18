import { NewProduct } from "./product";
import { ProductSupplyConidtions } from "./productSupplyCondition";
import { WareHouse } from "./wareHouse";

export interface ProductSupply{

    id?: number,
    productId?: number,
    productWareHouseId?: number,
    createDate?:string,
    endDate?: string,
    measureUnitId?: number,
    quantity?: number,
    active?: true,
    comment?: string,
    price?: number,
    cottageCode?: string,
    name?: string,
    orderedQuantity?: number,
    remainedQuantity?: number,
    product?:NewProduct,
    wareHouse?:WareHouse,
    productSupplyConditions?:ProductSupplyConidtions
}

export interface ProductSupplys extends Array<ProductSupply>{

}