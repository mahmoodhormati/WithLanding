export  interface NewProduct {
    id?:number
    name?: string
    englishName?: string
    price?: number
    active?: boolean
    minSellableAmount?: number
    maxSellableAmount?: number
    measureUnitId?: number
    groupId?: number
    measureUnit?: number
}

export  interface ProductList extends Array<NewProduct> {

}