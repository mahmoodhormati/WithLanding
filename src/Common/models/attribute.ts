export interface Attribute {

    id?: number,
    name?: string,
    entityTypeId?: number,
    controlTypeId?: number,
    controlTypeValue?: string,
   

}
export interface Attributes extends Array<Attribute>{
    
}