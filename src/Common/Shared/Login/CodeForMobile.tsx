import React, { useState, useEffect, useCallback } from 'react';
import OtpInput from 'react-otp-input';
import { toast } from 'react-toastify';
import { GetUsersRoles, SetUserRole, verifyUser } from '../../../services/userService';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../services/userService';
import { decodeToken } from '../../../Utils/decodeToken';
import './customCss.css';
import Countdown from 'react-countdown';
import { ShowTimer } from '../Common/ShowTimer';
import axios from 'axios';
import { encryptMessage } from '../../../Utils/DecryptionUtill';
const afra = require('./afra.jpg');


interface props{
    SetShowOtp:any
}


const CodeForMobile: React.FC<props> = ({SetShowOtp}) => {
    const navigate = useNavigate();
    const location=useLocation()
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const [Code, setCode] = useState('');
    const [isSubmit, setIssubmit] = useState(false);
    const [timer, setTimer] = useState(120);
    const timeOutCallback = useCallback(() => setTimer(currTimer => currTimer - 1), []);
    const otpCodeResender = async (event: any) => {
        event.preventDefault();

        const mobile = localStorage.getItem('mobile');
        const user = {
            phoneNumber: mobile
        }
        setLoading(true)
        const { data, status } = await loginUser(user);
        window.location.reload();
        resetTimer();
        setLoading(false)
    }
    useEffect(() => {
        timer > 0 && setTimeout(timeOutCallback, 1000);
    }, [timer, timeOutCallback]);

    const resetTimer = function () {
        if (!timer) {
            setTimer(120);
        }
    };





    const handelSubmit = async () => {


        const user = {
            verificationCode: Code,
            phoneNumber: localStorage.getItem('mobile')
        }

        setIssubmit(false);
        try {



            const { status, data } = await verifyUser(user);
            setLoading(true)

            if (data.success === true) {


                toast.success("ورود موفقیت آمیز بود", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });
                setLoading(false)
                localStorage.setItem('token', data.result.token);
                localStorage.setItem('refresh', data.result.refresh);
                axios.defaults.headers.common["Authorization"] = `Bearer ${data.result.token}`;
                const response = await GetUsersRoles()
                localStorage.setItem("rd", encryptMessage(response.data.result.userRoleIds));



                if (location.state?.from) {
                    navigate(location.state.from)
               

                }
                else{
                navigate('/client')
                }

            }





        }

        catch (error) {
            setLoading(true)


            setIssubmit(false)
            setLoading(false)
        }
    }
    const handleChang = (num: any) => {

        setCode(num);
        num.length === 5 ? setIssubmit(true) : setIssubmit(false)

    }

    if (Code.length > 4 && isSubmit) {

        handelSubmit();
    }

    return (

        <div className='auth'  >
            <div className='card'>
                <div className='row no-gutters'>
                    <div className='col-md-6'>
                        <div className='card-body'>

                            <h4 className='card-title'>
                                ورود
                            </h4>
                            <p className='mt-5'>لطفا کد ارسال شده به تلفن همراه خود را وارد کیند.</p>



                            <form style={{ direction: 'ltr' }} >


                                <OtpInput

                                    containerStyle={{ display: 'flex' }}
                                    inputStyle={{ width: "" }}
                                    value={Code}
                                    numInputs={5}
                                    shouldAutoFocus={true}
                                    separator={<span> </span>}
                                    onChange={handleChang}
                                    className="otpInput"
                                    isInputNum={true}
                                />
                                <hr />

                                <ShowTimer loading={loading} timer={timer} firstCondition={otpCodeResender} secondCondition={handelSubmit}  setshow={SetShowOtp}/>

                            </form>
                        </div>

                    </div>
                    <div className='col-md-6'>
                        <img className='card-img h-100' src={afra} alt="" />
                    </div>

                </div>
            </div>
        </div>);
}

export default CodeForMobile;