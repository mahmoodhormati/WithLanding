export interface SupportRequest      {
    id?: number,
    title?: string,
    creatorId?: number,
    creatorName?: string,
    answererId?: number,
    answererName?: string,
    onlineChat?: true,
    createDate?: string
  }



  export interface SupportRequests extends Array<SupportRequest>      {
   
  }