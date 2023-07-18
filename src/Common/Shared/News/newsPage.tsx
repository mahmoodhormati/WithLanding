import React, {useEffect, useState} from "react";
import {GetAllNewsForUsers} from "../../../services/newsService";
import {useParams} from "react-router-dom";

const NewsPage:React.FC = () => {
    const params=useParams()
    const [guessNews , setGuessNews]= useState([])
    const getNews =async () => {
        try {
            const {data , status}=await GetAllNewsForUsers();
            setGuessNews(data.result.news.values)
        }catch (err){
            console.log(err)
        }

    }
    useEffect(()=>{
        getNews()
    },[])

    return(
        <div className='user-progress'>
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>

                </div>
            </div>
<div className="p-5">
                {guessNews.filter((item:any) => item.id === Number(params.id)).map((item:any) =>
                    <div key={item.id}>
                    <span style={{fontSize:"large"}}>عنوان :{item.title}</span>
                    <span className="float-right pb-2">{new  Date(item.createDate).toLocaleString('fa-IR')}</span>
                        <hr style={{height:'1px ', background:"black"}}/>
                        <p>{item.message}</p>
                    </div>
                )}
</div>
      </div>
    )
}
export default NewsPage