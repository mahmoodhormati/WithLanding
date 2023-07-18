export interface Group{

    id?: number,
    CompanyId?:number
    entityTypeId?: number,
    name?: string
    companyId?:number
    companyName?:string

}
export interface GroupList extends Array<Group>{

}

