import { GetCustomerBrief } from "../../../services/reportService";

export const GetCustomerBeriefService = async(id:any)=>{
    try{
const { data , status} = await GetCustomerBrief(id)
    }catch(err){
        console.log(err);
        
    }
}