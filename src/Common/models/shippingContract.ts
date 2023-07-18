export interface ShippingContract{
    id?: number,
    contractNumber?: string,
    shippingCompanyId?: number,
    measureUnitId?: number,
    quantity?: number,
    createDate?: string
}
export interface ShippingContracts extends Array<ShippingContract>{

}