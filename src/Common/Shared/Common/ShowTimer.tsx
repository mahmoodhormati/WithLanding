import React from 'react'
import { useNavigate } from 'react-router-dom';
import FadeLoader from "react-spinners/FadeLoader";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

interface Props {
    timer: any, firstCondition: any, secondCondition: any, loading: any,setshow:any
}


export const ShowTimer: React.FC<Props> = ({ timer, firstCondition, secondCondition, loading,setshow }) => {
    const [minutes, second] = [Math.floor(timer / 60), timer % 60];

    const navigate = useNavigate();
    let formatSecond = 0;
    const handelForm = () => {
        setshow(false)
    }
    // second.length>1?formatSecond:`0${formatSecond}
    if (!timer) {


        return (
            <div>
                <button className='btn btn-primary mt-5 mb-5 float-right' disabled={loading} onClick={firstCondition}>
                    <ClipLoader

                        loading={loading}
                        color="#ffff"
                        size={15}
                    />

                    ارسال مجدد</button>
                <button className='btn btn-primary mt-5 mb-5 float-left' disabled={false} onClick={handelForm}> اصلاح شماره </button>
            </div>
        )
    }
    else {
        return (
            <div>
                <p>تا  {`${minutes}:${second}`} امکان ارسال مجدد کد وجود ندارد</p>
                <button className='btn btn-success mt-5 mb-5 float-right' disabled={loading} onClick={secondCondition}>
                    <ClipLoader

                        loading={loading}
                        color="#ffff"
                        size={15}
                    />

                    تایید و ادامه</button>
                    <button className='btn btn-primary mt-5 mb-5 float-left' disabled={false} onClick={handelForm}> اصلاح شماره </button>
            </div>
        )
    }
}
