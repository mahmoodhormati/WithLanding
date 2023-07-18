import React,{ useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { UpdateShippingReport } from '../../../services/outScopeService';
import  FadeLoader  from 'react-spinners/FadeLoader';
import { toast } from 'react-toastify';


const UpdateAllShiping:React.FC = () => {
const[loading,setLoading]=useState(false)
const navigate=useNavigate()
    let color = "#0c4088"
useEffect(()=>{
    update()
},[])
    const update = async () => {
        setLoading(true)
        try {
            const { data, status } = await UpdateShippingReport()
            if (status === 200) {
                setLoading(false)
                toast.success("اطلاعات با موفقیت دریافت شد", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });
            }
           
        } catch (e) {
            console.log(e)
            

        }
        navigate(-1)
    }


    if (loading) {
        return (

            <div className="text-center m-auto mt-5" >
                <p className='mb-4'>دریافت اطلاعات ...</p>
                <FadeLoader style={{ position: 'absolute', top: '50%', left: '50%' }} loading={loading} color={color} />
            </div>
        )
    }
    else{
        return(
        <div></div>)
    }
   
}

export default UpdateAllShiping