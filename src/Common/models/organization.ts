export default interface newOrganizaton{
    id?:number,
    name?:string,
  
    nationalId?:string,
    registrationNumber?:string,
    
    parentId?:number,
    groupId	?:number



}
export  interface AllOrganization extends Array<newOrganizaton>{
    
}