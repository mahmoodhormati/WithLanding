export interface ShippingCompany{
    id?: number|null,
    code?: string,
    name?: string,
    createDate?: string,
    active?: boolean
}
export interface ShippingCompanies extends Array<ShippingCompany>{

}