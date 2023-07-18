export interface WareHouse{

    id?: number,
      wareHouseId?: number,
      wareHouseName?: string,
      productId?: number,
      quantity?: number,
      consumableQuantity?: number,
      reservedQuantity?: number
}

export interface WareHouses extends Array<WareHouse>{

}