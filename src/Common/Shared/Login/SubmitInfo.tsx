import React,{useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';




const afra =require('./afra.jpg')


const SubmitInfo:React.FC=()=>

{
    const customer=useSelector((state:RootState)=>state.user);
    const dispatch=useDispatch();
    const[firstName,setfirstName]=useState('');
    const[lastName,setlastName]=useState('');
    const[email,setEmail]=useState('');
    
    const Customer={
        userName:localStorage.getItem('mobile'),
        firstName,
        lastName,
        email,
        requireInfo:false

    }
const handelSubmit=()=>{




    
}

    return (  
   
        <div className='auth' >
            <div className='card'>
                <div className='row no-gutters'>
                    <div className='col-md-6'>
                        <div className='card-body'>

                            <h4 className='card-title'>
                                ورود
                            </h4>
                            <p className='mt-5'></p>
                            

                          
                            <form >
                                <div className='row'>
                                <div className='input-group mt-5 col-md-6'>
                                <input type='text' className='form-control ' placeholder='نام' value={firstName} onChange={e=>{
                                    setfirstName(e.target.value)
                                }}></input>
                                </div>
                                <div className='input-group mt-5 col-md-6'>
                                <input type='text' className='form-control ' placeholder='نام خانوادگی' value={lastName} onChange={e=>{
                                    setlastName(e.target.value)
                                }}></input>
                                </div>
                                </div>
                                <div className='input-group mt-5'>
                                <input type='text' className='form-control ' placeholder='ایمیل' value={email} onChange={e=>{
                                    setEmail(e.target.value)
                                }}></input>
                                </div>
                                <button className='btn btn-success mt-5 mb-5 float-right' onClick={handelSubmit}>تایید و ادامه</button>
                            </form>
                        </div>
                       
                    </div>
                    <div className='col-md-6'>
                            <img className='card-img h-100'  src={afra} alt="" />
                        </div>
  
                </div>
            </div>
        </div>
    );
}

export default SubmitInfo;