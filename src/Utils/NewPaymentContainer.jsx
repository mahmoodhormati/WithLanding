import React, { useState } from 'react'
import NewPaymentChild from './NewPaymentChild'
import { BiAddToQueue } from 'react-icons/bi'
import { CreatePayment } from '../services/paymentsService'
import { attachmentUpload } from '../services/attachmentService'
import { toast } from 'react-toastify'
import { ClipLoader, GridLoader } from 'react-spinners'
import { useLocation, useNavigate } from 'react-router-dom'
import ErrorModalSample from './ErrorModalSample'




const NewPaymentContainer = ({ data, Index, Ids, currentPay }) => {

    const [ComponentList, setComponentList] = useState([])
    const [payments, setPayments] = useState([])
    const [stateSuccess, SetStateSuccess] = useState(0)
    const [stateError, SetStateError] = useState(0)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);


    }
    const closeModalConfirm = () => {
        setIsOpen(false);
    }


    const addComponent = () => {


        setComponentList([...ComponentList, { status: false, id: ComponentList.length }])




    }

    let currentPayment = data.filter((i) => i.tabIndex === Index);
    const RemoveComponent = (id) => {

        setPayments([...payments.filter(i => i.id !== id)])

        ComponentList.filter((i, index) => i.id === id).map(i => (i, i.status = true))


        setComponentList([...ComponentList])

        if (ComponentList.every(i => i.status === true)) {

            setComponentList([])
        }



    }


    let location = useLocation()

    const totalPay = () => {

        let pay = 0

        if (payments.length > 0) {

            payments.map(i => pay += i.price)

        }
        else {
            pay = 0
        }
        return pay

    }

   

    const handelSubmit = async () => {



        setLoading(true)


        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < payments.length; i++) {
            let body = {}
            for (let j = 0; j < payments[i].child.length; j++) {

                try {


                    body = {

                        invoiceIds: payments[i].invoice,
                        paymentMethodId: currentPayment[0].paymentMethodId,
                        price: payments[i].child[j].price,
                        dueDate: payments[i].child[j].date,
                        hasAttachment: true,
                        trackingCode: payments[i].child[j].trackingCode,
                        comment: null,

                    }

                    const { data, status } = await CreatePayment(body)

                    if (status === 200) {
                        try {
                            const formData = new FormData();
                            formData.append("Files", payments[i].child[j].file[0][0]);
                            formData.append("EntityTypeId", 20);
                            formData.append("EntityId", data.result.payment.id);
                            formData.append("AttchmentTypeId", 2)
                            const response = await attachmentUpload(formData);

                            if (response.status === 200) {

                                successCount = successCount + 1



                            }


                        } catch (error) {

                            console.log(error);
                        }

                    }
                }


                catch (error) {
                    console.log(error);

                }






            }


        }




        if (successCount >= payments.length) {
            toast.success('پرداخت با موفقیت انجام شد', {
                position: "top-right",
                closeOnClick: true
            });
            setPayments([])
            setComponentList([])

            setLoading(false)


            currentPay()

            if(location.pathname && location.pathname.split('/')[1]==='client'){
            navigate('/client/payment')
            }

            else{
            navigate('/admin/PaymentLists')

            }
            window.scrollTo(0, 0)


        }

        else {

            toast.warning('روند پرداخت ها با مشکل مواجه شد لطفا با ادمین تماس بگیرید', {
                position: "top-right",
                closeOnClick: true
            });

            setLoading(false)

        }

    }




    return (

        <>

            {loading ? <div className="loadingAddress">
                <div className="boxloadingAddress">
                    <GridLoader loading={loading} color="#4236d6" />
                </div>
            </div> : null}
            <div>


                <div className='d-flex flex-column' id='childPayment'>
                    {ComponentList.map((item, index) => item.status === false ? (
                        <div key={index}>
                            <NewPaymentChild id={item.id} Setpayments={setPayments} payment={payments} remove={RemoveComponent} data={data} currentPay={currentPay} ids={Ids} indexes={Index} />

                        </div>) : ''

                    )}
                </div>



                <div className='d-flex justify-content-end' title='پرداخت '>

                    <label onClick={addComponent}>
                        <BiAddToQueue size="2rem" style={{ color: "#3B71CA" }} />
                    </label>
                </div>






                <div className='d-flex justify-content-around'>

                    {payments.length > 0 ?

                        <button type='button' className='btn btn-success' onClick={openModal} disabled={loading}>ثبت  نهایی <ClipLoader loading={loading} color="#ffff" size={15} /></button> : ''


                    }


                </div>

                <ErrorModalSample modalIsOpen={modalIsOpen} closeModal={closeModalConfirm} submit={() => handelSubmit()} message={`  آیا از ثبت نهایی اطمینان دارید ؟`} />

            </div>
        </>
    )
}

export default NewPaymentContainer