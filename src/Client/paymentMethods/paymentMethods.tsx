import { AiOutlineWarning } from "react-icons/ai";
import { useSelector } from "react-redux";
import { GetPaymentMethods } from "../../services/invoiceService";
import { RootState } from "../../store";
import QueryString from "qs";
import { useEffect, useState } from "react";
import { PaymentStructureEnums } from "../../Common/Enums/PaymentStructureEnums";
import ImageUploaderForPayment from "../../Utils/ImageUploaderForPayment";
import { GetInvoicePayments, GetInvoicePaymentsForAdmin, GetPayments } from '../../services/paymentsService';
import { useNavigate } from 'react-router-dom';
import { PaymentStatusEnums } from './../../Common/Enums/PaymentStatus';
import ErrorModalSample from "../../Utils/ErrorModalSample";
import NewPaymentContainer from "../../Utils/NewPaymentContainer";

interface Props {
  invoiceId: any, closeModal: any
}
const PaymentMethodComponent: React.FC<Props> = ({ invoiceId, closeModal }) => {
  const [paymentId, setPaymentId] = useState([]);
  const [currentTab, setCurrentTab] = useState(1);
  const [currentPay, SetCurrentPay] = useState<any>([])
  const [modalIsOpen, setIsOpen] = useState(false);

  const [payments,SetPayments]=useState(JSON.parse(
    String(sessionStorage.getItem(`param/client/PaymentMethod`))
  ))
  

  const openModal = () => {
    setIsOpen(true);
   

}
const closeModalConfirm = () => {
    setIsOpen(false);
}

  const navigate = useNavigate()

  



  console.log(invoiceId);
  
  
  const paymentMethodsGroup = async () => {
    if (invoiceId) {


      let config = {
        headers: { "Content-Type": "application/json" },
        params: {
          InvoiceIds: invoiceId,
        },
        paramsSerializer: (params: any) => {
          return QueryString.stringify(params);
        },
      };

      try {
        const { data, status } = await GetPaymentMethods(config);
        if (status === 200) {
          setPaymentId(data.result.paymentMethods);
        }
      } catch (err) {
        console.log(err);
      }
    }
    else {
      let config = {
        headers: { "Content-Type": "application/json" },
        params: {
          InvoiceIds: payments,
        },
        paramsSerializer: (params: any) => {
          return QueryString.stringify(params);
        },
      };

      try {
        const { data, status } = await GetPaymentMethods(config);
        if (status === 200) {
          setPaymentId(data.result.paymentMethods);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  var formatter = new Intl.NumberFormat('fa-IR', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  const getCurrentPaids = async () => {
    let pays = []
    if (invoiceId) {

      let config = {
        headers: { "Content-Type": "application/json" },
        params: {
          InvoiceIds: invoiceId,
          PageNumber:0,
          PageSize:100000
        },
        paramsSerializer: (params: any) => {
          return QueryString.stringify(params);
        },
      };



        try {
          const { data, status } = await GetPayments(config)

          if (status === 200) {
            if(data.result.payments.values){
            SetCurrentPay(data.result.payments.values)}
            else{
              SetCurrentPay([])
            }

          }
        } catch (error) {

        }


        
        
      
      
     

    }
    else {

  



        let config = {
          headers: { "Content-Type": "application/json" },
          params: {
            InvoiceIds: payments,
            PageNumber:0,
            PageSize:100000
          },
          paramsSerializer: (params: any) => {
            return QueryString.stringify(params);
          },
        };
  
  
  
          try {
            const { data, status } = await GetPayments(config)
  
            if (status === 200) {
  
              if(data.result.payments.values){
                SetCurrentPay(data.result.payments.values)}
                else{
                  SetCurrentPay([])
                }
  
            }
          } catch (error) {
  
          }
        
    
   

    }

  }
  useEffect(() => {
    paymentMethodsGroup();
    getCurrentPaids()
  }, []);
  const handleTabClick = (id: any) => {
    setCurrentTab(id);
  }

  const handelback = () => {
    navigate(-1)
  }

 

const total=()=>{
  let totalCurrentPay=0

  currentPay.filter((i:any)=>i.paymentStatusId!==5).map((i:any)=>totalCurrentPay+=i.price)
  return(totalCurrentPay)
}
const  totalMustPay=()=>{

let totalshouldPay=0
let pay=paymentId.filter((i:any)=>i.tabIndex===currentTab).map((i:any)=>i.totalValue).map((item:any)=>item)[0]
if(pay){
totalshouldPay=Number(pay.replaceAll(',',''))
}
else{
  totalshouldPay=0
}
return totalshouldPay
}



const handelClick = () => {
  console.log(total(),totalMustPay());
  
  if (total()<totalMustPay()) {

    openModal()
   


}

else{
  navigate(-1)
}
}

  if (payments || invoiceId) {
    return (
      <div className="row">

        <div id="tabsIcons" className="col-lg-12 col-12 layout-spacing">
          <div className="dashboard-widget p-4">
            <div className="d-block clearfix mb-2" onClick={closeModal} title="انصراف"><svg
              xmlns="http://www.w3.org/2000/svg"
              width="24" height="24"
              viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-x close"
              data-dismiss="alert"><line x1="18" y1="6"
                x2="6"
                y2="18"></line><line
                  x1="6" y1="6" x2="18" y2="18"></line></svg></div>

            <div className=" icon-tab">
              <ul
                className="nav nav-tabs  mb-3 mt-3"
              // id="iconTab"
              // role="tablist"
              >
                {paymentId.map((item: any, i: any) =>


                  <li className="nav-item">
                    <button
                      onClick={() => handleTabClick(item.tabIndex)}
                      key={i}
                      id={item.tabIndex}

                      className={currentTab === item.tabIndex ? "nav-link active " : " nav-link "}

                    >
                      {item.tabName}
                    </button>
                  </li>
                )}
              </ul>
              <div className="tab-content" >
                {paymentId.map((item: any) =>

                  <div id={item.tabIndex}

                    className={currentTab === item.tabIndex ? "tab-pane fade p-2 show active " : "null"}>
                    {currentTab === item.tabIndex &&
                      <div>
                        <div className="d-flex justify-content-between">
                        <h6 ><b>مجموع اسناد قابل پرداخت:</b> {item.totalValue}</h6>
                        <h6 ><b>    نحوه پرداخت: </b> {PaymentStructureEnums.filter((i: any) => i.id === item.paymentMethodId).map((i: any) => i.name)}</h6>
                        </div>
                        <div  dangerouslySetInnerHTML={{ __html: item.message }} className=" col-12  ">

                        </div>
                        <br></br>

                        {currentPay.length > 0 ?
                          <div><table className='table text-center  test'>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>کدرهگیری</th>
                                <th>مبلغ</th>
                                <th>وضعیت</th>

                              </tr>
                            </thead>

                            <tbody>
                              {currentPay.map((i: any) => (
                                <tr className={i.paymentStatusId === 5 ? 'bg-danger' : ''}>
                                  <td>{i.id}</td>
                                  <td>{i.trackingCode}</td>
                                  <td>{formatter.format(i.price)}</td>
                                  <td>{PaymentStatusEnums.filter((item: any) => item.id === i.paymentStatusId).map((x: any) => x.name)}</td>
                                </tr>

                              ))}
                              {/* <tr>
                                <td colSpan={2}><h5>جمع</h5></td>
                                <td ><h5>{formatter.format(total())}</h5></td>
                                <td></td>
                              </tr> */}

                            </tbody>


                          </table>


                          

                            < NewPaymentContainer data={paymentId} Index={item.tabIndex} Ids={payments ? payments : invoiceId} currentPay={getCurrentPaids} />

                          </div> :< NewPaymentContainer data={paymentId} Index={item.tabIndex} Ids={payments ? payments : invoiceId} currentPay={getCurrentPaids} />




                        }

                      </div>}



                  </div>

                )}


              </div>



            </div>
          </div>
        </div>


        <ErrorModalSample modalIsOpen={modalIsOpen} closeModal={closeModalConfirm} submit={()=>navigate(-1)} message={`مبلغ صورتحساب ${formatter.format(totalMustPay())} اما مبلغ پرداختی شما ${formatter.format(total())} میباشد آیا از ثبت نهایی اطمینان دارید ؟`} />
      </div>
    );
  } else {
    return (
      <div className="text-center dashboard-widget">
        <AiOutlineWarning size="5rem " color="gold" />
        <div>اطلاعاتی برای نمایش وجود ندارد</div>
      </div>
    );
  }
};
export default PaymentMethodComponent;
