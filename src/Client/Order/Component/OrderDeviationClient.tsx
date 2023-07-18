import React from 'react'
import { useState } from 'react';
import Modal from 'react-modal';
import { useEffect } from 'react';
import QueryString from 'qs';
import { GetOrderDeviation } from '../../../services/orderService';
import { FadeLoader } from 'react-spinners';
import { PriceUnitEnums } from '../../../Common/Enums/PriceUnit';
import { formatter } from '../../../Utils/Formatter';


const customStyles = {
    content: {

        inset: '50% auto auto 50%',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '5%',
        border: '2px ridge black',
        maxHeight:'80vh'

    }

}

interface Props {
    id: number,
    modalIsOpen: any,
    closeModal: any
}
const OrderDeviationClient: React.FC<Props> = ({ id, modalIsOpen, closeModal }) => {
    const [deviations, Setdeviations] = useState<any>([])
    const [total, SetTotal] = useState<any>(0)
    const [loading, setLoading] = useState(false)





    useEffect(() => {

        getDeviation()

    }, [modalIsOpen, id])

    const getDeviation = async () => {

        

        if (id > 0 && modalIsOpen === true) {
            setLoading(true)
            let config = {

                headers: { 'Content-Type': 'application/json' },
                params: {



                    orderId: id



                }
                ,
                paramsSerializer: (params: any) => {

                    return QueryString.stringify(params)
                }

            };
            try {

                const { data, status } = await GetOrderDeviation(config)

                if (status === 200) {

                    Setdeviations(data.result.deviations)
                    SetTotal(data.result.total)
                    setLoading(false)

                }

            } catch (error) {
                console.log(error);
                setLoading(false)

            }




        }
        else {
            Setdeviations([])
            SetTotal(0)
            setLoading(false)

        }



    }

    if (!loading) {
        return (
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Selected Option"
                ariaHideApp={false}

            >

                {deviations.length > 0 ?

                    <div className='text-center'>
                        <h6 className='text-center'>مشاهده جزییات کسری و سرک</h6>
                        <div className=" rounded  " style={{ border: " 1px solid #bfc9d4" }} >


                            <div className=" p-2 containerT " >
                                <div className="col-lg-4 col-md-6 col-sm-11 ">


                                </div>
                                <table
                                    className="table responsive table-borderedDARK   fixed-header  mt-2  mb-4"  >
                                    <thead >
                                        <tr style={{ fontSize: '10px' }} className='border'>
                                            <th style={{ fontSize: '10px' }} className="text-center">ردیف</th>
                                            <th style={{ fontSize: '10px' }} className="text-center">شناسه جزییات سفارش</th>
                                            <th style={{ fontSize: '10px' }} className="text-center">نام محصول </th>
                                            <th style={{ fontSize: '10px' }} className="text-center">مبلغ</th>
                                            <th style={{ fontSize: '10px' }} className="text-center">واحد</th>


                                        </tr>
                                    </thead>
                                    <tbody >
                                        {deviations.map((item: any, index: number) => (
                                            <tr className='text-center' key={item.id}>

                                                <td aria-label="ردیف">{index + 1}</td>
                                                <td aria-label="شناسه جزییات سفارش">{item.orderDetailId}</td>
                                                <td aria-label='نام محصول'>{item.productName}</td>
                                                <td aria-label='مبلغ'>{formatter.format(item.price)}</td>
                                                <td aria-label='واحد'> {PriceUnitEnums.filter((i: any) => i.id === item.priceUnitId).map((i: any) => i.name)}</td>



                                            </tr>

                                        ))}
                                        <tr className='border'>
                                            <td colSpan={3}> جمع</td>
                                            <td colSpan={2}> {formatter.format(total)}</td>



                                        </tr>

                                    </tbody>
                                </table>



                            </div>

                        </div>




                    </div>





                    : <div className='text-center'>


                        <p>
                            اطلاعاتی جهت نمایش وجود ندارد
                        </p>
                    </div>




                }




            </Modal>
        )
    }
    else {
        return (
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Selected Option"
                ariaHideApp={false}

            >
                <div className="loadingAddress" >
                    <div className="boxloadingAddress">
                        <p>دریافت اطلاعات ...</p>
                        <FadeLoader loading={loading} color={"#ccc"} />
                    </div>
                </div>
            </Modal>)
    }

}

export default OrderDeviationClient