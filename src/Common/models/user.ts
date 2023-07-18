export  interface NewUser {
    companyId?: number
    companyName?:string
    id?: number,
    userName?: string,
    email?: string,
    firstName?: string,
    lastName?: string,
    requireInfo?: boolean,
    createDate?: string,
    nationalCode?: string,
    organizationId?: number,
    password?: string,
    salt?: string,
    sugar?: string,
    islegal?: true,
    groupId?: number | undefined,
    active?: boolean,
    actionBlock?: boolean,
    maxValidityUnitId?: number,
    maxValidity?: number

}
export  interface UserList {

    users:NewUser
}

export interface UserRoles{
    userRoleIds?:number[]
}

export interface UserRolesMapping{
    userRoleIds?:number[],
    userId?:number,
}

