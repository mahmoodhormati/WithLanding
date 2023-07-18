import { MeasureUnitSample } from "../../../Common/Enums/MeasureUnitSample";
import { DeliveryMethods } from "../../../Common/Enums/DeliveryMethodsEnums";
import { useState } from "react";
import ExtraShipping from "../../../Common/Shared/order/ExtraShippingAdmin";
import { IoIosArrowUp } from "react-icons/io";
import { GridLoader } from "react-spinners";
import QueryString from "qs";
import{GetDataWithSearchOrder} from "../../../services/orderService"
import { PaymentStructureEnums } from "../../../Common/Enums/PaymentStructureEnums";
import { PaymentStatusEnums } from "../../../Common/Enums/PaymentStatus";
import { ShippingStatusEnums } from "../../../Common/Enums/ShippingStatusEnums";
import { OrderStatus } from "../../../Common/Enums/OrderStatusEnums";


interface Props {
    UserName:any
}
const OrderReportBrief:React.FC<Props> = ({ UserName}) => {
    const [show , setShow] = useState(false)    
    let [loading, setLoading] = useState(true);
    const [order, setOrder] = useState([])

    const GetOrder = async () => {
        setLoading(true)
        let config = {
            headers: { 'Content-Type': 'application/json' },
            params: {
               IsAdmin: true,
                UserName,
                
                PageNumber: 0,
                PageSize:5,
               

            }
            ,
            paramsSerializer: (params:any) => {

                return QueryString.stringify(params)
            }
        };

        try {
            const { data, status } = await GetDataWithSearchOrder(config);
            if (status === 200) {
           
                setOrder(data.result.orderList.values);
              
                setLoading(false)


            }


        } catch (err) {
            console.log(err)
            setLoading(false)

        }

    }
    const showOrder = () => {
        setShow(!show);
      };
      const CollapsOrder =()=>{
        setShow(!show)
        GetOrder()
      }
      let formatterForMoney = new Intl.NumberFormat('fa-IR', {

        currency: 'IRR'


    });
 if ( order && show ) {
        
    return (

        <section className="mb-2 mt-2">
            <div className="   mb-1 rounded" >
                <div className="row p-3 itemA">
                    <div className=" col-6  ">
          <h4 className="float-left">سفارشات اخیر</h4>
        </div>
        <div className="  col-6   ">
          {show === true ? (
            <IoIosArrowUp
              size="1.5rem"
              className="float-right up-svg"
              onClick={showOrder}
            />
          ) : (
            <svg
              onClick={CollapsOrder}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="float-right feather feather-chevron-down"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          )}
        </div>
      </div>
      { loading  ? (
        <div className="w-100">
          {/* <div className=" m-auto"> */}
          <GridLoader
            loading={loading}
            color="#4236d6"
            className="m-auto GridLoader position-relative  "
          />
          {/* </div> */}
        </div>
      ) : (
        <div>

            <div className="form-group mb-4 textOnInput col-lg-12 rounded border  border-dark  mt-4 p-2 "  >
                <label> صورتحسابها </label>
                
                <div className="p-2 ">
                    <table className="table m-1 table-striped  fixed_header  ">
                        <thead>
                            <tr>
                                <th >#</th>
                                <th >تاریخ</th>
                                <th >نوع پرداخت</th>
                                <th >  وضعیت ارسال</th>
                                <th > وضعیت سفارش</th>
                                <th > وضعیت پرداخت </th>
                                <th > مبلغ-ریال </th>
                                
                            </tr>
                        </thead>
                        <tbody className="text-center" id="InvoiceTable">
                            {order && order.map((item: any) => (

                                <tr key={item.id}>
                                    <td data-th="#"  >{item.id}</td>
                                    <td data-th="تاریخ"  >{item.createDate!==null? new Date(item.createDate).toLocaleDateString('fa-IR'):null }</td>
                                    <td data-th="نوع پرداخت"  >{PaymentStructureEnums.filter((i: any) => i.id === item.paymentMethodId).map((i: any) => i.name)}</td>
                                    <td data-th="وضعیت ارسال"  >{ShippingStatusEnums.filter((i: any) => i.id === item.shippingStatusId).map((i: any) => i.name)}</td>
                                    <td data-th="وضعیت سفارش"  >{OrderStatus.filter((i: any) => i.id === item.orderStatusId).map((i: any) => i.name)}</td>
                                    <td data-th="وضعیت پرداخت"  >{PaymentStatusEnums.filter((i: any) => i.id === item.paymentStatusId).map((i: any) => i.name)}</td>

                                    <td data-th="  مبلغ-ریال"  >{formatterForMoney.format(item.orderFinalizedPrice) }</td>
                                    
                                   

                                </tr>


                            ))

                            }


                        </tbody>
                    </table>
                </div>
            </div>
        </div>)}
        </div></section>

    )
}
else {
    return ( 
    <section className="mb-2 mt-2">
        <div className="   mb-1 rounded" >
            <div className="row p-3 itemA">
                <div className=" col-6  ">
          <span className="float-left">سفارشات اخیر</span>
        </div>
        <div className="  col-6   ">
          {show ? (
            <IoIosArrowUp
              size="1.5rem"
              className="float-right up-svg"
              onClick={showOrder}
            />
          ) : (
            <svg
              onClick={CollapsOrder}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="float-right feather feather-chevron-down"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          )}
        </div>
      </div>
      {show ? (
        <div>
          <div className="form-group mb-4 textOnInput col-lg-12 rounded border text-center border-dark  mt-4 p-2 ">
            <span className="text-center">
              اطلاعاتی برای نمایش موجود نیست
            </span>
          </div>
        </div>
      ) : null}
    </div>
  </section>
    )
}

}
export default OrderReportBrief