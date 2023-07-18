import { ExtraData } from "./extraData";
import { NewUser } from "./user";

export default interface Order {
    id?: number,
    customerId?: number,
    orderStatusId?: number,
    paymentStatusId?: number,
    paymentMethodId?: number,
    shippingStatusId?: number,
    orderTotal?: number,
    orderTax?: number,
    orderDiscount?: number,
    orderFinalizedPrice?: number,
    createDate?: string,
    extId?: number,
    comment?: string,
    locked?: boolean,
    conditionalPaymentTypeId?: number,
    customer?:NewUser,
    extraData?:ExtraData

}

export  interface Orders extends Array<Order>{
    
}