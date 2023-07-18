export interface Shipping   {
    id?: number,
    orderId?: number,
    orderDetailId?: number,
    measureUnitId?: number,
    plannedQuantity?: number,
    shippedQuantity?: number,
    createDate?: string,
    shipped?: true,
    shippingDate?: string,
    deliveryMethodId?: number,
    cottageCode?: string,
    shippingContractId?: number,
    extId?: string,
    locked?: true,
    companyName?: string,
    contractCode?: string
  }
  export interface Shippings extends Array<Shipping>{
    
  }