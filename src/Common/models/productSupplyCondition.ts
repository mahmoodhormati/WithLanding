export interface ProductSupplyConidtion{
    id?: number,
    productSupplyId?: number,
    customerGroupId?: number,
    minSellableAmount?: number,
    maxSellableAmount?: number,
    paymentMethodId?: number,
    installmentOccureCount?: number,
    installmentPeriod?: number,
    installmentStartDate?: string,
    comment?: string,
    active?: true,
    additionalTypeId?: number,
    additionalAmount?: number,
    special?: true,
    price?: number
  }
  export interface ProductSupplyConidtions extends Array<ProductSupplyConidtion>{
    
  }




