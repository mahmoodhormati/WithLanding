export interface Supply{
    id?: number,
    supplyTypeId?: number,
    shippingStatusId?: number,
    supplierId?: number,
    supplierName?: string,
    productId?: number,
    productName?: string,
    measureUnitId?: number,
    quantity?: number,
    wareHouseId?: number,
    contractNumber?: string,
    comment?: string,
    cottageCode?: string
}
export interface Supplies extends Array<Supply>{
    
}
