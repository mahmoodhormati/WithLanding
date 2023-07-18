import { useState ,useEffect} from 'react';
import { GetAllProducts } from '../../../services/prodcutWarehouse';


export const useProducts=()=>{

    const[products,SetProducts]=useState([])

    useEffect(()=>{

        (async()=>{

            const{data,status}=await GetAllProducts()

            SetProducts(data.result.products.values)
        })();

    },[])
    return products

}