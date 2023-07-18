export interface SupportRequestMessage    {
    id?: number,
    supportRequestId?: number,
    creatorId?: number,
    creatorName?: string,
    createDate?: string,
    message?: string
  }


  export interface SupportRequestMessages extends Array<SupportRequestMessage>    {
   
  }