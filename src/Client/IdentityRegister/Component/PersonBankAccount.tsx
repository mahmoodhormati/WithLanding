import React from 'react'
import { RatioProps } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';



const PersonBankAccount :React.FC= () => {
    const handelSubmit=(event:any)=>{
event.preventDefault();
    }
    return (
        <div className='user-progress' >
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                    <h5 >تکمیل اطلاعات کاربری</h5>
                    <p>در این بخش می توانید وضعیت حساب کاربری خود را مشاهده کنید.</p>
                </div>
            </div>
            <div className='row d-flex justify-content-center '>
                <div className='widget box shadow col-4'>


                    <form>
                        <div className='form-group'>
                          
                            <div className="input-group mb-3">
                                <input type="text" className="form-control" placeholder="شماره شبا" aria-describedby="basic-addon1" />

                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">IR</span>
                                </div>
                            </div>
                           
                        </div>
                        <div className='form-group'>
                        <span >برای دریافت شماره شبا <Link to="#">اینجا</Link> کلیک کنید.</span>
                        </div>
                        <div className='form-group'>
                        <div className='row justify-content-between'>
                                <div className='col '>
                                    <button type="submit" className="btn btn-success " onClick={handelSubmit}>تایید</button>
                                </div>
                                <div className='col-3 '>
                                    <NavLink to='/admin/identitypannel' className="btn btn-danger">بازگشت</NavLink>
                                </div>
                            </div>
                            </div>
                    </form>

                </div>
            </div >
        </div >
    )
}

export default PersonBankAccount