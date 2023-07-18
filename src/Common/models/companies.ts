export interface Company {

    id?: number
    name?: string
    parentId?: number

}



export interface Companies extends Array<Company> {

    id?: number
    name?: string
    parentId?: number

}