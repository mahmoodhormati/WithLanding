export interface Address {


    id?: number
    provinceId?: number
    fullAddress?: string
    postalCode?: string
    receiverTel?: string
    receiverMobile?: string
    receiverName?: string


}
export interface AddressMapping {
    Address?: Address,
    entityTypeId?: number,
    entityId?: number


}

export interface Addresses extends Array<Address>{

}

export interface province {

    id?: number,
     name?: string, 
     parentId?: number


}
export interface Provinces extends Array<province>{

}