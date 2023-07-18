import {NavLink} from "react-router-dom";
import {Table} from "react-bootstrap";
import News from '../../../Common/Shared/News/news';
import SalesBoard from "../../../Common/Shared/Common/salesBoard";
import { Fragment, useState } from 'react';
import { GridLoader } from "react-spinners";

const DashbordGuess:React.FC = () => {
    const [loading , setLoading]= useState(false)
    if(loading){
     return(
            <div style={{position:'fixed',top:'40%',left:'40%'}}>
                <p>دریافت اطلاعات ...</p>
                <GridLoader loading={loading} color="#4236d6" />
        </div>
        )
    }else{ 
        return (
    <Fragment><div>
        <div className=" statbox widget-content widget-content-area">
            <div className="card component-card_2 m-2">
                <div className="card-body">
                    <p className="card-text d-inline m-auto">برای ثبت سفارش جدید لازم است که حتما احزار هویت انجام دهید</p>
                    <NavLink to="/admin/identitypannel" className="btn btn-primary float-right ">احراز هویت</NavLink>
                </div>
            </div>
        
        </div>
     
               
    </div>
    <hr/>
    <SalesBoard setloading={setLoading} update={null}/>
    <hr/>
    <News setloading={setLoading} />
    </Fragment>)}
}
export default DashbordGuess