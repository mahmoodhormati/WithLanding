import { useEffect, useRef, useState, useCallback } from "react";
import { GetPayments } from "../../services/paymentsService";
import Pagination from "../../Utils/pagination";
import QueryString from 'qs';
import { Link, useLocation } from "react-router-dom";
import { PaymentStructureEnums } from "../../Common/Enums/PaymentStructureEnums";
import { AiOutlineWarning } from "react-icons/ai";
import { PaymentStatusEnums } from "../../Common/Enums/PaymentStatus";
import { PriceUnitEnums } from "../../Common/Enums/PriceUnit";
import ClientPreviewerForPaymentList from '../../Utils/ClientPreviewerForPaymentList';

const PaymentList: React.FC = () => {
  const location = useLocation();
  const observer: any = useRef()

  const [PageNumber, setPageNumber] = useState(
    getPage().PageNumber ? getPage().PageNumber : 0
  );
  const [Id, setId] = useState(0)
  let [PageSize, setPageSize] = useState(
    getPage().PageSize ? Number(getPage().PageSize) : 5
  );
  const [IsOpenEdit, setIsOpenEdit] = useState(false)

  const [payments, setPayments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, sethasNext] = useState(false);
  let invoicePaymentId = location.state === "fromInvoiceClient" ? JSON.parse(String(sessionStorage.getItem(`param/client/payment/invoice`))) : null;


  const param = { PageSize, PageNumber };
  function getPage() {
    let items = JSON.parse(
      String(sessionStorage.getItem(`param${window.location.pathname}`))
    );
    return items ? items : "";
  }

  useEffect(() => {
    GetPayment();
  }, [PageSize]);

  const hasMore = () => {



    if (PageSize < totalCount) {
      return true
    }
    else {
      return false
    }

  }

  const lastDataRef = useCallback((node: any) => {



    if (observer.current) {
      observer.current.disconnect()
    }
    observer.current = new IntersectionObserver((enteris: any) => {

      if (enteris[0].isIntersecting && hasMore()) {

        console.log();



        setPageSize((prev: any) => prev + 5)

        console.log(PageSize);

      }
    })
    if (node) {
      observer.current.observe(node)
    }

  }, [hasMore()])




  const getDataByPage = async () => {
    let config = {
      headers: { 'Content-Type': 'application/json' },
      params: {


        PageNumber,
        PageSize
      }
      ,
      paramsSerializer: (params: any) => {
        return QueryString.stringify(params)
      }
    };

    try {
      const { data, status } = await GetPayments(config);
      if (status === 200) {
        setPayments(data.result.payments.values);
        setTotalCount(data.result.payments.totalCount)
        sethasNext(data.result.payments.hasNext)
        sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));
        setTotalCount(data.result.payments.totalCount)

      }

    } catch (err) {
      console.log(err)
    }

  }

  const GetPayment = async () => {
    let config = {
      headers: { 'Content-Type': 'application/json' },
      params: {

        InvoiceIds: location.state ? invoicePaymentId : [],
        PageNumber,
        PageSize
      }
      ,
      paramsSerializer: (params: any) => {
        return QueryString.stringify(params)
      }
    };
    try {
      const { data, status } = await GetPayments(config);
      setPayments(data.result.payments.values);
      setTotalCount(data.result.payments.totalCount)
    } catch (err) {
      console.log(err);
    }
  };

  var formatter = new Intl.NumberFormat('fa-IR', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });


  const openModalEdit = (id: number) => {

    setId(id)

    setIsOpenEdit(true);
  }
  const closeModalEdit = () => {
    setIsOpenEdit(false);
  }
  console.log(PageSize, totalCount);

  if (payments) {
    return (
      <div>
        <div className="text-left pb-3">

          {location.state === "fromInvoiceClient" ? <span className="bg-light rounded p-2  ">
            {" "}
            پرداخت های صورتحساب {invoicePaymentId}{" "}

          </span> : null}
        </div>
        <div className="  ">
          <div>
            {payments.map((item: any, index) => {
              if (payments.length === index + 1) {
                return (
                  <div ref={lastDataRef} key={index} className="col-sm-10 col-md-12 m-1">
                    <div className="  auction-item-2 text-center  ">
                      <div className="auction-content">
                        <div className=" row bid-area">
                          <div className="col-lg-10">
                            <div className="row">


                              <span className=" col-lg-3 m-auto p-2 ">
                                {" "}
                                <b>تاریخ</b>:{" "}
                                {new Date(item.createDate).toLocaleDateString(
                                  "fa-IR",
                                  {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  }
                                )}
                              </span>
                              <span className=" col-lg-5 m-auto p-2 ">
                                {" "}
                                <b>موعد سند</b>:{" "}
                                {item.paymentDueDate !== null ? new Date(item.paymentDueDate).toLocaleDateString(
                                  "fa-IR",
                                  {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  }
                                ) : ""}
                              </span>
                              <span className="col-lg-4 m-auto p-2">
                                {" "}
                                <b>مبلغ </b>:{" "}
                                {formatter.format(item.price)}
                              </span> <span className="col-lg-3 m-auto p-2">
                                {" "}
                                <b> واحد مبلغ</b>:{" "}
                                {PriceUnitEnums.filter(
                                  (i: any) => i.id === item.priceUnitId
                                ).map((item: any) => item.name)}
                              </span>
                              <span className= "col-lg-5 m-auto p-2  " >
                                  <b> وضعیت پرداخت</b> :{" "}<strong className='text-dark btn btn-sm  ' style={{backgroundColor:`${PaymentStatusEnums.filter((i: any) => i.id === item.paymentStatusId).map((i: any) => i.color)}`,pointerEvents:'none'}} > {PaymentStatusEnums.filter((i: any) => i.id === item.paymentStatusId).map((i: any) => i.name)}</strong>
                              </span>
                              <span className="col-lg-4 m-auto p-2">
                                {" "}
                                <b>نوع پرداخت</b> :{" "}
                                {PaymentStructureEnums.filter(
                                  (i: any) => i.id === item.paymentMethodId
                                ).map((item: any) => item.name)}
                              </span>
                              <span className="col-lg-3 m-auto p-2">
                                <b>وضعیت </b> :{" "}
                                {item.confirmed ? "تایید شده" : "تایید نشده"}/{item.paid ? "پرداخت شده" : "پرداخت نشده"}
                              </span>
                              <span className=" col-lg-5 m-auto p-2 ">
                                <b>شناسه پیگیری</b> :{" "}
                                {item.trackingCode}
                              </span>
                              <span className=" col-lg-4 m-auto p-2 ">
                                <b>توضیحات</b> :{" "}
                                {item.comment}
                              </span>
                            </div>
                          </div>
                          <span className="col-lg-2 text-center  m-auto button-auction">

                            {item.hasAttachment && item.paymentStatusId !== 5 ?
                              (<div className=" btn-group">

                                <button className="border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip"
                                  data-placement="top" data-title="مشاهده سند"
                                  onClick={function () {
                                    openModalEdit(item.id)

                                  }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width='25' height='25' viewBox="0 0 256 256"><rect
                                    width="256" height="256" stroke="none" fill="none" /><line x1="201.1" y1="127.3" x2="224" y2="166.8"
                                      fill="none" stroke="currentColor" strokeLinecap="round"
                                      strokeLinejoin="round" strokeWidth="12" /><line
                                      x1="154.2" y1="149.3" x2="161.3" y2="189.6" fill="none" stroke="currentColor" strokeLinecap="round"
                                      strokeLinejoin="round" strokeWidth="12" /><line x1="101.7" y1="149.2" x2="94.6" y2="189.6"
                                        fill="none" stroke="currentColor" strokeLinecap="round"
                                        strokeLinejoin="round" strokeWidth="12" /><line
                                      x1="54.8" y1="127.3" x2="31.9" y2="167" fill="none" stroke="currentColor" strokeLinecap="round"
                                      strokeLinejoin="round" strokeWidth="12" /><path
                                      d="M32,104.9C48.8,125.7,79.6,152,128,152s79.2-26.3,96-47.1" fill="none" stroke="currentColor"
                                      strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" /></svg>
                                </button>


                              </div>) : ''





                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
              else {
                return (
                  <div key={index} className="col-sm-10 col-md-12 m-1">
                    <div className="  auction-item-2 text-center  ">
                      <div className="auction-content">
                        <div className=" row bid-area">
                          <div className="col-lg-10">
                            <div className="row">


                              <span className=" col-lg-3 m-auto p-2 ">
                                {" "}
                                <b>تاریخ</b>:{" "}
                                {new Date(item.createDate).toLocaleDateString(
                                  "fa-IR",
                                  {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  }
                                )}
                              </span>
                              <span className=" col-lg-5 m-auto p-2 ">
                                {" "}
                                <b>موعد سند</b>:{" "}
                                {item.paymentDueDate !== null ? new Date(item.paymentDueDate).toLocaleDateString(
                                  "fa-IR",
                                  {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  }
                                ) : ""}
                              </span>
                              <span className="col-lg-4 m-auto p-2">
                                {" "}
                                <b>مبلغ </b>:{" "}
                                {formatter.format(item.price)}
                              </span> <span className="col-lg-3 m-auto p-2">
                                {" "}
                                <b> واحد مبلغ</b>:{" "}
                                {PriceUnitEnums.filter(
                                  (i: any) => i.id === item.priceUnitId
                                ).map((item: any) => item.name)}
                              </span>
                              <span className= "col-lg-5 m-auto p-2  " >
                                  <b> وضعیت پرداخت</b> :{" "}<strong className='text-dark btn btn-sm  ' style={{backgroundColor:`${PaymentStatusEnums.filter((i: any) => i.id === item.paymentStatusId).map((i: any) => i.color)}`,pointerEvents:'none'}} > {PaymentStatusEnums.filter((i: any) => i.id === item.paymentStatusId).map((i: any) => i.name)}</strong>
                              </span>
                              <span className="col-lg-4 m-auto p-2">
                                {" "}
                                <b>نوع پرداخت</b> :{" "}
                                {PaymentStructureEnums.filter(
                                  (i: any) => i.id === item.paymentMethodId
                                ).map((item: any) => item.name)}
                              </span>
                              <span className="col-lg-3 m-auto p-2">
                                <b>وضعیت </b> :{" "}
                                {item.confirmed ? "تایید شده" : "تایید نشده"}/{item.paid ? "پرداخت شده" : "پرداخت نشده"}
                              </span>
                              <span className=" col-lg-5 m-auto p-2 ">
                                <b>شناسه پیگیری</b> :{" "}
                                {item.trackingCode}
                              </span>
                              <span className=" col-lg-4 m-auto p-2 ">
                                <b>توضیحات</b> :{" "}
                                {item.comment}
                              </span>
                            </div>
                          </div>
                          <span className="col-lg-2 text-center  m-auto button-auction">

                            {item.hasAttachment && item.paymentStatusId !== 5 ?
                              (<div className=" btn-group">

                                <button className="border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip"
                                  data-placement="top" data-title="مشاهده سند"
                                  onClick={function () {
                                    openModalEdit(item.id)

                                  }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width='25' height='25' viewBox="0 0 256 256"><rect
                                    width="256" height="256" stroke="none" fill="none" /><line x1="201.1" y1="127.3" x2="224" y2="166.8"
                                      fill="none" stroke="currentColor" strokeLinecap="round"
                                      strokeLinejoin="round" strokeWidth="12" /><line
                                      x1="154.2" y1="149.3" x2="161.3" y2="189.6" fill="none" stroke="currentColor" strokeLinecap="round"
                                      strokeLinejoin="round" strokeWidth="12" /><line x1="101.7" y1="149.2" x2="94.6" y2="189.6"
                                        fill="none" stroke="currentColor" strokeLinecap="round"
                                        strokeLinejoin="round" strokeWidth="12" /><line
                                      x1="54.8" y1="127.3" x2="31.9" y2="167" fill="none" stroke="currentColor" strokeLinecap="round"
                                      strokeLinejoin="round" strokeWidth="12" /><path
                                      d="M32,104.9C48.8,125.7,79.6,152,128,152s79.2-26.3,96-47.1" fill="none" stroke="currentColor"
                                      strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" /></svg>
                                </button>


                              </div>) : ''





                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
            })}
            <br />
            <br />

            <ClientPreviewerForPaymentList id={Id} closeModal={closeModalEdit} modalIsOpen={IsOpenEdit} />

          </div>
        </div>
      </div>
    );
  }

  else {
    return (
      <div>
        <div className="text-left pb-3">

          {location.state === "fromInvoiceClient" ? <span className="bg-light rounded p-2  ">
            {" "}
            پرداخت های صورتحساب {invoicePaymentId && invoicePaymentId[0]}{" "}

          </span> : null}
        </div>

        <div className="text-center dashboard-widget">
          <AiOutlineWarning size="5rem " color="gold" />
          <div>اطلاعاتی برای نمایش وجود ندارد</div>
        </div>
      </div>
    )
  }
};
export default PaymentList;
