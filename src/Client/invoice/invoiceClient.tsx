import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  GetInvoicesWithSearch,
  GetPaymentMethods,
} from "../../services/invoiceService";
import Pagination from "../../Utils/pagination";
import QueryString from "qs";
import { AiFillCaretDown, AiFillDownCircle, AiOutlineArrowDown, AiOutlineDown, AiOutlineWarning } from "react-icons/ai";
import { InvoceTypes } from "../../Common/Enums/InvoiceTypeIdEnums";
import { PriceUnitEnums } from "../../Common/Enums/PriceUnit";
import { PaymentStatusEnums } from "../../Common/Enums/PaymentStatus";
import { PaymentStructureEnums } from "../../Common/Enums/PaymentStructureEnums";
import { PaymentMethod } from "../../store/Slice/PaymentMethods/PaymentMethods";
import { useDispatch } from "react-redux";
import { BsTrash } from "react-icons/bs";
import PageSizeTable from "../../Utils/PageSize";
import { RxDoubleArrowDown } from "react-icons/rx";

import './style.css'



const InvoiceClient: React.FC = () => {
  const location = useLocation();

  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [invoices, SetInvoice] = useState([]);
  const [invoicesWithouG, SetInvoiceWithouG] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [paymentStatusId, SetPaymentStatusId] = useState<any>('unpaid')
  const [PageNumber, setPageNumber] = useState(getPage().PageNumber ? getPage().PageNumber : 0);
  const [PageSize, setPageSize] = useState(getPage().PageSize ? getPage().PageSize : 50);
  const [newInvoices, setNewInvoices] = useState<any>([]);
  const [Filterinvoices, SetFilterInvoice] = useState([]);

  const [GroupedInvoice, SetGroupInvoice] = useState([])
  const [groupKey, setGroupKey] = useState<any>([])
  const [show, SetShow] = useState(false)

  const [check, setCheck] = useState(false)
  let invoiceOrder = location.state === "fromOrderClient" ? JSON.parse(String(sessionStorage.getItem(`param/client/invoice`))) : null
  let invoicePaymentId = location.state === "fromPaymentClient" ? JSON.parse(String(sessionStorage.getItem(`param/client/invoice/paymentId`))) : null;
  const observer: any = useRef()

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

      if (enteris[0].isIntersecting && hasMore() ) {

        console.log();
        


        setPageSize((prev:any)=>prev+5)

        console.log(PageSize);

      }
    })
    if (node) {
      observer.current.observe(node)
    }

  }, [hasMore()])


  const checkValueee = (id: any) => {
    const clonedData = [...newInvoices];
    setNewInvoices(
      clonedData.map((i: any) => (i.id === id ? { ...i, active: !i.active } : i))
    )

  };
  const AllSelect = (id: any) => {

    console.log(id);

    const clonedData = [...newInvoices];



    let ids = clonedData.filter((item: any) => item.paymentStatusId === 5 || item.paymentStatusId === 4 || item.paymentStatusId === 2 || item.paymentStatusId === 1).filter((i: any) => i.parentEntityId === id).map((i: any) => ({ ...i, active: !i.active })).map((i: any) => i.id)


    setNewInvoices(
      [...clonedData.filter((i: any) => ids.includes(i.id)).map((i: any) => ({ ...i, active: !i.active })), ...clonedData.filter((i: any) => !ids.includes(i.id))]

    )



  };

  function groupBy(xs: any, f: any) {
    if (xs) {
      return xs.reduce((r: any, v: any, i: any, a: any, k: any = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});

    }
    else {
      return []
    }
  }


  const handelShowDetails = (id: any) => {

    const clone = [...groupKey]

    setGroupKey(clone.map((i: any) => (i.id === id ? { ...i, show: !i.show } : i)))
  }


  useEffect(() => {

    getDataByPage(paymentStatusId)


  }, [PageSize, paymentStatusId])



  const handelShowMore = () => {

    setPageSize(PageSize + 5)



  }
  const filterInvoice = newInvoices
    .filter((item: any) => item.active === true)
    .map((item: any) => item);
  const finallInvoice = filterInvoice.map((item: any) => item.id);



  const param = { PageSize, PageNumber };
  function getPage() {
    let items = JSON.parse(
      String(sessionStorage.getItem(`param${window.location.pathname}`))
    );
    return items ? items : "";
  }




  const getDataByPage = async (value: any) => {
    if (paymentStatusId == 'unpaid' || value === 'unpaid') {



      let config = {
        headers: { "Content-Type": "application/json" },
        params: {

          paymentStatusIds: [5, 4, 2, 1],
          PageNumber,
          PageSize: 100,
        },
        paramsSerializer: (params: any) => {
          return QueryString.stringify(params);
        },
      };



      try {
        const { data, status } = await GetInvoicesWithSearch(config);
        if (status === 200) {
          SetInvoice(data.result.invoices.values);

          setTotalCount(data.result.invoices.totalCount);


          setNewInvoices(data.result.invoices.values.map((item: any) => ({
            ...item, active: false
          })));

        }
      } catch (err) {
        console.log(err);
      }
    }
    else if (paymentStatusId == 'paid' || value === 'paid') {



      let config = {
        headers: { "Content-Type": "application/json" },
        params: {
          paymentStatusIds: [3, 6, 7],
          PageNumber,
          PageSize,
        },
        paramsSerializer: (params: any) => {
          return QueryString.stringify(params);
        },
      };



      try {
        const { data, status } = await GetInvoicesWithSearch(config);
        if (status === 200) {
          SetInvoice(data.result.invoices.values);
          setTotalCount(data.result.invoices.totalCount);



          setNewInvoices(data.result.invoices.values.map((item: any) => ({
            ...item, active: false
          })));

        }
      } catch (err) {
        console.log(err);
      }



    }
    else {

      console.log('hiiii');


      let config = {
        headers: { "Content-Type": "application/json" },
        params: {
          paymentStatusIds: [],
          PageNumber,
          PageSize,
        },
        paramsSerializer: (params: any) => {
          return QueryString.stringify(params);
        },
      };



      try {
        const { data, status } = await GetInvoicesWithSearch(config);
        if (status === 200) {
          SetInvoice(data.result.invoices.values);

          setTotalCount(data.result.invoices.totalCount);


          setNewInvoices(data.result.invoices.values.map((item: any) => ({
            ...item, active: false
          })));

        }
      }
      catch (err) {
        console.log(err);
      }

    }
  }

  const paymentMethodsGroup = async () => {
    sessionStorage.setItem(
      `param/client/PaymentMethod`,'')
    
    let config = {
      headers: { "Content-Type": "application/json" },
      params: {
        InvoiceIds: finallInvoice,
      },
      paramsSerializer: (params: any) => {
        return QueryString.stringify(params);
      },
    };

    try {
      const { data, status } = await GetPaymentMethods(config);
      if (status === 200) {
        dispatch(PaymentMethod(finallInvoice));
        sessionStorage.setItem(
          `param/client/PaymentMethod`,
          JSON.stringify(finallInvoice)
        );

        navigate("/client/PaymentMethod");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const paymentMethodSingel = async (id: any) => {
    let config = {
      headers: { "Content-Type": "application/json" },
      params: {
        InvoiceIds: id,
      },
      paramsSerializer: (params: any) => {
        return QueryString.stringify(params);
      },
    };

    try {
      const { data, status } = await GetPaymentMethods(config);
      if (status === 200) {
        dispatch(PaymentMethod([id]));
        sessionStorage.setItem(
          `param/client/PaymentMethod`,
          JSON.stringify([id])
        );

        navigate("/client/PaymentMethod");
      }
    } catch (err) {
      console.log(err);
    }
  };
  let formatterForMoney = new Intl.NumberFormat("fa-IR", {
    currency: "IRR",
  });



  const handelChangePaymnetStatus = async (e: any) => {



    SetPaymentStatusId(e.target.value)
    SetShow(false)

  }



  const InvoicesWithGroups = () => {

    if (invoices) {
      let Groups: any = groupBy(invoices, (item: any) => item.parentEntityId)
      console.log(Groups);

      if (Groups) {
        setGroupKey(Object.keys(Groups).map((i: any) => ({ id: i, show: false })))
        SetGroupInvoice(invoices.filter((item: any) => Object.keys(Groups).map((i: any) => Number(i)).includes(item.parentEntityId)))
        SetInvoiceWithouG(invoices.filter((item: any) => !Object.keys(Groups).map((i: any) => Number(i)).includes(item.parentEntityId)))

      }
      else {
        SetGroupInvoice([])
        setGroupKey([])
      }
    }
    else {
      return []
    }
  }



  useEffect(() => {
    InvoicesWithGroups()
  }, [invoices])



  const totalPrice = (parentId: any) => {
    let total = 0
    if (GroupedInvoice) {

      GroupedInvoice.filter((i: any) => i.parentEntityId === parentId).map((i: any) => total += i.price)


    }

    return total

  }

  console.log(groupKey);


  if (invoices) {




    return (

      <>

        <div>


          {/* <div className="text-left pb-3">

            {location.state === "fromOrderClient" ? <span className="bg-light rounded p-2  ">
              {" "}
              صورت حساب های سفارش {invoiceOrder && invoiceOrder[0]}{" "}

            </span> : null}
            {location.state === "fromPaymentClient" ? <span className="bg-light rounded p-2  ">
              {" "}
              صورت حساب های پرداخت {invoicePaymentId && invoicePaymentId[0]}{" "}

            </span> : null}
          </div> */}

          <div className="d-flex justify-content-start col-12 ml-4 ">
            {/* <label className="bg-transparent rounded m-1 mr-4 ml-4 text-white"><input type="checkbox" className=" mb-2  " onClick={AllSelect} />  </label> */}
            <div className="btn-group btn-group-toggle" >
              <label className={paymentStatusId === 'unpaid' ? "btn activelink" : 'btn'}>
                <input type="radio" id="1" value='unpaid' onChange={handelChangePaymnetStatus} checked={paymentStatusId === 'unpaid'} /> پرداخت نشده
              </label>
              <label className={paymentStatusId === 'paid' ? "btn activelink" : 'btn'}>
                <input type="radio" id="2" value='paid' onChange={handelChangePaymnetStatus} checked={paymentStatusId === 'paid'} /> پرداخت شده
              </label>
              <label className={paymentStatusId === 'all' ? "btn activelink  " : 'btn'}>
                <input type="radio" id="3" value='all' onChange={handelChangePaymnetStatus} checked={paymentStatusId === 'all'} /> همه
              </label>
            </div>

          </div>
          <div className=" text-right ">

            <div>


              {groupKey.map((i: any, index: any) => {
                
                if(groupKey.length===index+1){
                return (
                <div ref={lastDataRef}  key={index} className="col-sm-10 col-md-12 m-1">

                  {i.id === 'null' ?
                    invoicesWithouG.map((item: any, Index: any) => (
                      <div key={item.id} className="col-sm-10 col-md-12 m-1">
                        <div className="  auction-item-2 text-center  ">
                          <div className="auction-content">
                            <div className=" row bid-area ">
                              <div className="col-lg-9">
                                <div className="row">
                                  <span className="col-lg-4 m-auto p-2">
                                    <b>نوع صورتحساب </b>:{" "}
                                    {InvoceTypes.filter(
                                      (i: any) => i.id === item.invoiceTypeId
                                    ).map((item: any) => item.name)}
                                  </span>
                                  <span className=" col-lg-4 m-auto p-2 ">
                                    {" "}
                                    <b>شناسه</b>: {`سفارش #${item.entityId}`}
                                  </span>
                                  <span className="col-lg-4 m-auto p-2">
                                    {" "}
                                    <b>قیمت </b>: {`${formatterForMoney.format(item.price)} ${PriceUnitEnums.filter(
                                      (i: any) => i.id === item.priceUnitId
                                    ).map((i: any) => i.name)[0]}`}
                                  </span>

                                  <span className="col-lg-4 m-auto p-2">
                                    <b>تاریخ ثبت</b> :{" "}
                                    {new Date(item.createDate).toLocaleDateString(
                                      "fa-IR"
                                    )}
                                  </span>
                                  <span className= "col-lg-4 m-auto p-2  " >
                                  <b> وضعیت پرداخت</b> :{" "}<strong className='text-dark btn btn-sm  ' style={{backgroundColor:`${PaymentStatusEnums.filter((i: any) => i.id === item.paymentStatusId).map((i: any) => i.color)}`,pointerEvents:'none'}} > {PaymentStatusEnums.filter((i: any) => i.id === item.paymentStatusId).map((i: any) => i.name)}</strong>
                              </span>

                                  <span className="col-lg-4 m-auto p-2">
                                    <b>نحوه پرداخت</b> : {item.paymentMethodId && item.paymentMethodId !== 4 ? PaymentStructureEnums.filter(
                                      (i: any) => i.id === item.paymentMethodId
                                    ).map((i: any) => i.name)[0] : item.installmentPeriod && item.installmentOccureCount ? `${PaymentStructureEnums.filter(
                                      (i: any) => i.id === item.paymentMethodId
                                    ).map((i: any) => i.name)[0]}, ${item.installmentOccureCount} قسط ${item.installmentOccureCount} روزه` : ''}
                                  </span>

                                  <span className="col-lg-4 m-auto p-2">
                                    <b>تاریخ سررسید</b> :{" "}
                                    {item.installmentStartDate !== null ? new Date(
                                      item.installmentStartDate
                                    ).toLocaleDateString("fa-IR") : ""}
                                  </span>


                                  <span className="col-lg-8 m-auto p-2">
                                    <b>توضیحات </b> : {item.comment}
                                  </span>
                                  <span className="col-lg-3 m-auto p-2">
                                    <b></b>
                                  </span>
                                </div>
                              </div>
                              <span className="col-lg-2 text-center  m-auto button-auction">
                                {item.paymentStatusId === 5 || item.paymentStatusId === 4 || item.paymentStatusId === 2 || item.paymentStatusId === 1 ? (

                                  <button
                                    className="border-0 btn-success btn non-hover "
                                    onClick={() => {
                                      paymentMethodSingel(item.id);
                                    }}
                                    hidden={finallInvoice.length === 0 ? false : true}
                                  >
                                    پرداخت
                                  </button>
                                ) : (<Link
                                  className="border-0 bg-transparent non-hover edit-btn"
                                  to={`/client/payment`}
                                  state="fromInvoiceClient"
                                >
                                  <button className="border-0 bg-transparent  non-hover btn-Payment " onClick={() => sessionStorage.setItem(`param/client/payment/invoice`, JSON.stringify([item.id]))}>
                                    {" "}
                                    مشاهده پرداخت ها
                                  </button></Link>
                                )}
                              </span>
                            </div> </div> </div> </div>)) :
                    <div key={index + 1} className="col-sm-10 col-md-12 m-1">
                      <div className="  auction-item-2 text-center  ">
                        <div className="auction-content">
                          <div className=" row bid-area">
                            <div className="col-lg-9">
                              <div className="row">
                                <span className="col-lg-4 m-auto p-2">
                                  <b>نوع صورتحساب </b>:{" "}
                                  {InvoceTypes.filter((b: any) => b.id === (GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((i: any) => i.invoiceTypeId)[0])).map((b: any) => b.name)}
                                </span>
                                <span className="col-lg-4 m-auto p-2">
                                  <b>شناسه</b>:{" "}
                                  {`سفارش #${i.id}`}
                                </span>
                                <span className="col-lg-4 m-auto p-2">
                                  <b>مبلغ</b>:{" "}
                                  {formatterForMoney.format(totalPrice(Number(i.id)))}
                                </span>
                                <span className="col-lg-4 m-auto p-2">
                                  <b>تاریخ ایجاد</b>:{" "}
                                  {new Date(GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((x: any) => x.createDate)[0]).toLocaleDateString('fa-IR')}
                                </span>
                               
                                 
                                  <span className= "col-lg-4 m-auto p-2  " >
                                  <b> وضعیت پرداخت</b> :
                                <strong className='text-dark btn btn-sm 
                'style={{ backgroundColor: `${PaymentStatusEnums.filter((b: any) => b.id === (GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((i: any) => i.paymentStatusId)[0])).map((b: any) => b.color)}`,pointerEvents:'none'} }>
                                 {PaymentStatusEnums.filter((b: any) => b.id === (GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((i: any) => i.paymentStatusId)[0])).map((b: any) => b.name)}
                                </strong>
                              </span>

                              

                                <span className="col-lg-4   m-auto button-auction">

                                  <b style={{cursor:'pointer'}}  onClick={() => handelShowDetails(i.id)}>
                                    مشاهده جزییات
                                  <AiFillCaretDown/>


                                  </b>

                                </span>


                              </div>
                            </div>

                            {GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((i: any) => i.paymentStatusId).includes(5) || GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((i: any) => i.paymentStatusId).includes(4) || GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((i: any) => i.paymentStatusId).includes(2) || GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((i: any) => i.paymentStatusId).includes(1) ?
                              <span className="col-lg-2 text-center  m-auto ">
                                <button
                                  className="border-0 btn-success btn non-hover mb-2"
                                  onClick={paymentMethodsGroup}
                                  disabled={finallInvoice.length === 0 ? true : false}
                                >
                                  پرداخت همه
                                </button>
                              </span>:''}




                          </div>


                          {i.show && GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).length > 0 ?
                            <>
                              <br />
                              <table className="table containerTC mt-2 mb-2 table-striped">
                                <thead>
                                  <tr>
                                    <th>{GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((i: any) => i.paymentStatusId).includes(5) || GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((i: any) => i.paymentStatusId).includes(4) || GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((i: any) => i.paymentStatusId).includes(2) || GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((i: any) => i.paymentStatusId).includes(1) ? <label className="bg-transparent rounded m-1 mr-4 ml-4 text-white"><input type="checkbox" className=" mb-2  " onClick={() => AllSelect(Number(i.id))} /> </label> : ''}</th>
                                    <th>شناسه</th>
                                    <th>قیمت</th>
                                    <th>تاریخ ثبت</th>
                                    <th>تاریخ سررسید</th>
                                    <th>وضعیت پرداخت</th>
                                    <th>نحوه پرداخت</th>
                                    <th>توضیحات </th>
                                    <th>عملیات </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((item: any, Index: any) => (<tr key={Index}>

                                    <td>{item.paymentStatusId === 3 || item.paymentStatusId === 6 ? null : (
                                      <input
                                        id={`custom-checkbox-${index}`}
                                        checked={newInvoices.filter((i: any) => i.id === item.id).map((i: any) => i.active)[0]}
                                        type="checkbox"
                                        required
                                        value={item.active}
                                        name={item}
                                        onClick={(event) => checkValueee(item.id)}
                                        onChange={(e) => setCheck(e.target.checked)}
                                      />
                                    )}</td>
                                    <td>{`جزییات سفارش#${item.entityId}`}</td>
                                    <td>{`${formatterForMoney.format(item.price)} ${PriceUnitEnums.filter(
                                      (i: any) => i.id === item.priceUnitId
                                    ).map((i: any) => i.name)[0]}`}</td>

                                    <td>{new Date(item.createDate).toLocaleDateString(
                                      "fa-IR"
                                    )}</td>
                                    <td>{item.installmentStartDate !== null ? new Date(
                                      item.installmentStartDate
                                    ).toLocaleDateString("fa-IR") : ""}</td>

                                    <td>{PaymentStatusEnums.filter(
                                      (i: any) => i.id === item.paymentStatusId
                                    ).map((i: any) => i.name)}</td>
                                    <td> {item.paymentMethodId && item.paymentMethodId !== 4 ? PaymentStructureEnums.filter(
                                      (i: any) => i.id === item.paymentMethodId
                                    ).map((i: any) => i.name)[0] : item.installmentPeriod && item.installmentOccureCount ? `${PaymentStructureEnums.filter(
                                      (i: any) => i.id === item.paymentMethodId
                                    ).map((i: any) => i.name)[0]}, ${item.installmentOccureCount} قسط ${item.installmentPeriod} روزه` : ''}</td>
                                    <td title={item.comment}>{item.comment ? item.comment.substring(0, 30) : ''}</td>
                                    <td>
                                      {item.paymentStatusId === 5 || item.paymentStatusId === 4 || item.paymentStatusId === 2 || item.paymentStatusId === 1 ? (

                                        <button
                                          className="border-0 btn-success btn non-hover "
                                          onClick={() => {
                                            paymentMethodSingel(item.id);
                                          }}
                                          hidden={finallInvoice.length === 0 ? false : true}
                                        >
                                          پرداخت
                                        </button>
                                      ) : (<Link
                                        className="border-0 bg-transparent non-hover edit-btn"
                                        to={`/client/payment`}
                                        state="fromInvoiceClient"
                                      >
                                        <button className="border-0 bg-transparent  non-hover btn-Payment " onClick={() => sessionStorage.setItem(`param/client/payment/invoice`, JSON.stringify([item.id]))}>
                                          {" "}
                                          مشاهده پرداخت ها
                                        </button></Link>
                                      )}
                                    </td>


                                  </tr>))}


                                </tbody>
                              </table>
                              <br />

                            </> : ''}
                        </div>
                      </div>
                    </div>



                  }


                </div>
              )}
              else{
                return (
                  <div key={index} className="col-sm-10 col-md-12 m-1">
  
                    {i.id === 'null' ?
                      invoicesWithouG.map((item: any, Index: any) => (
                        <div key={item.id} className="col-sm-10 col-md-12 m-1">
                          <div className="  auction-item-2 text-center  ">
                            <div className="auction-content">
                              <div className=" row bid-area ">
                                <div className="col-lg-9">
                                  <div className="row">
                                    <span className="col-lg-4 m-auto p-2">
                                      <b>نوع صورتحساب </b>:{" "}
                                      {InvoceTypes.filter(
                                        (i: any) => i.id === item.invoiceTypeId
                                      ).map((item: any) => item.name)}
                                    </span>
                                    <span className=" col-lg-4 m-auto p-2 ">
                                      {" "}
                                      <b>شناسه</b>: {`سفارش #${item.entityId}`}
                                    </span>
                                    <span className="col-lg-4 m-auto p-2">
                                      {" "}
                                      <b>قیمت </b>: {`${formatterForMoney.format(item.price)} ${PriceUnitEnums.filter(
                                        (i: any) => i.id === item.priceUnitId
                                      ).map((i: any) => i.name)[0]}`}
                                    </span>
  
                                    <span className="col-lg-4 m-auto p-2">
                                      <b>تاریخ ثبت</b> :{" "}
                                      {new Date(item.createDate).toLocaleDateString(
                                        "fa-IR"
                                      )}
                                    </span>
                                    <span className= "col-lg-4 m-auto p-2  " >
                                    <b> وضعیت پرداخت</b> :{" "}<strong className='text-dark btn btn-sm  ' style={{backgroundColor:`${PaymentStatusEnums.filter((i: any) => i.id === item.paymentStatusId).map((i: any) => i.color)}`,pointerEvents:'none'}} > {PaymentStatusEnums.filter((i: any) => i.id === item.paymentStatusId).map((i: any) => i.name)}</strong>
                                </span>
  
                                    <span className="col-lg-4 m-auto p-2">
                                      <b>نحوه پرداخت</b> : {item.paymentMethodId && item.paymentMethodId !== 4 ? PaymentStructureEnums.filter(
                                        (i: any) => i.id === item.paymentMethodId
                                      ).map((i: any) => i.name)[0] : item.installmentPeriod && item.installmentOccureCount ? `${PaymentStructureEnums.filter(
                                        (i: any) => i.id === item.paymentMethodId
                                      ).map((i: any) => i.name)[0]}, ${item.installmentOccureCount} قسط ${item.installmentOccureCount} روزه` : ''}
                                    </span>
  
                                    <span className="col-lg-4 m-auto p-2">
                                      <b>تاریخ سررسید</b> :{" "}
                                      {item.installmentStartDate !== null ? new Date(
                                        item.installmentStartDate
                                      ).toLocaleDateString("fa-IR") : ""}
                                    </span>
  
  
                                    <span className="col-lg-8 m-auto p-2">
                                      <b>توضیحات </b> : {item.comment}
                                    </span>
                                    <span className="col-lg-3 m-auto p-2">
                                      <b></b>
                                    </span>
                                  </div>
                                </div>
                                <span className="col-lg-2 text-center  m-auto button-auction">
                                  {item.paymentStatusId === 5 || item.paymentStatusId === 4 || item.paymentStatusId === 2 || item.paymentStatusId === 1 ? (
  
                                    <button
                                      className="border-0 btn-success btn non-hover "
                                      onClick={() => {
                                        paymentMethodSingel(item.id);
                                      }}
                                      hidden={finallInvoice.length === 0 ? false : true}
                                    >
                                      پرداخت
                                    </button>
                                  ) : (<Link
                                    className="border-0 bg-transparent non-hover edit-btn"
                                    to={`/client/payment`}
                                    state="fromInvoiceClient"
                                  >
                                    <button className="border-0 bg-transparent  non-hover btn-Payment " onClick={() => sessionStorage.setItem(`param/client/payment/invoice`, JSON.stringify([item.id]))}>
                                      {" "}
                                      مشاهده پرداخت ها
                                    </button></Link>
                                  )}
                                </span>
                              </div> </div> </div> </div>)) :
                      <div key={index + 1} className="col-sm-10 col-md-12 m-1">
                        <div className="  auction-item-2 text-center  ">
                          <div className="auction-content">
                            <div className=" row bid-area">
                              <div className="col-lg-9">
                                <div className="row">
                                  <span className="col-lg-4 m-auto p-2">
                                    <b>نوع صورتحساب </b>:{" "}
                                    {InvoceTypes.filter((b: any) => b.id === (GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((i: any) => i.invoiceTypeId)[0])).map((b: any) => b.name)}
                                  </span>
                                  <span className="col-lg-4 m-auto p-2">
                                    <b>شناسه</b>:{" "}
                                    {`سفارش #${i.id}`}
                                  </span>
                                  <span className="col-lg-4 m-auto p-2">
                                    <b>مبلغ</b>:{" "}
                                    {formatterForMoney.format(totalPrice(Number(i.id)))}
                                  </span>
                                  <span className="col-lg-4 m-auto p-2">
                                    <b>تاریخ ایجاد</b>:{" "}
                                    {new Date(GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((x: any) => x.createDate)[0]).toLocaleDateString('fa-IR')}
                                  </span>
                                 
                                   
                                    <span className= "col-lg-4 m-auto p-2  " >
                                    <b> وضعیت پرداخت</b> :
                                  <strong className='text-dark btn btn-sm 
                  'style={{ backgroundColor: `${PaymentStatusEnums.filter((b: any) => b.id === (GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((i: any) => i.paymentStatusId)[0])).map((b: any) => b.color)}`,pointerEvents:'none'} }>
                                   {PaymentStatusEnums.filter((b: any) => b.id === (GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((i: any) => i.paymentStatusId)[0])).map((b: any) => b.name)}
                                  </strong>
                                </span>
  
                                
  
                                  <span className="col-lg-4   m-auto button-auction">
  
                                    <b style={{cursor:'pointer'}}  onClick={() => handelShowDetails(i.id)}>
                                      مشاهده جزییات
                                    <AiFillCaretDown/>
  
  
                                    </b>
  
                                  </span>
  
  
                                </div>
                              </div>
  
                              {GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((i: any) => i.paymentStatusId).includes(5) || GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((i: any) => i.paymentStatusId).includes(4) || GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((i: any) => i.paymentStatusId).includes(2) || GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((i: any) => i.paymentStatusId).includes(1) ?
                                <span className="col-lg-2 text-center  m-auto ">
                                  <button
                                    className="border-0 btn-success btn non-hover mb-2"
                                    onClick={paymentMethodsGroup}
                                    disabled={finallInvoice.length === 0 ? true : false}
                                  >
                                    پرداخت همه
                                  </button>
                                </span>:''}
  
  
  
  
                            </div>
  
  
                            {i.show && GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).length > 0 ?
                              <>
                                <br />
                                <table className="table containerTC mt-2 mb-2 table-striped">
                                  <thead>
                                    <tr>
                                      <th>{GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((i: any) => i.paymentStatusId).includes(5) || GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((i: any) => i.paymentStatusId).includes(4) || GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((i: any) => i.paymentStatusId).includes(2) || GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((i: any) => i.paymentStatusId).includes(1) ? <label className="bg-transparent rounded m-1 mr-4 ml-4 text-white"><input type="checkbox" className=" mb-2  " onClick={() => AllSelect(Number(i.id))} /> </label> : ''}</th>
                                      <th>شناسه</th>
                                      <th>قیمت</th>
                                      <th>تاریخ ثبت</th>
                                      <th>تاریخ سررسید</th>
                                      <th>وضعیت پرداخت</th>
                                      <th>نحوه پرداخت</th>
                                      <th>توضیحات </th>
                                      <th>عملیات </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {GroupedInvoice.filter((a: any) => a.parentEntityId === Number(i.id)).map((item: any, Index: any) => (<tr key={Index}>
  
                                      <td>{item.paymentStatusId === 3 || item.paymentStatusId === 6 ? null : (
                                        <input
                                          id={`custom-checkbox-${index}`}
                                          checked={newInvoices.filter((i: any) => i.id === item.id).map((i: any) => i.active)[0]}
                                          type="checkbox"
                                          required
                                          value={item.active}
                                          name={item}
                                          onClick={(event) => checkValueee(item.id)}
                                          onChange={(e) => setCheck(e.target.checked)}
                                        />
                                      )}</td>
                                      <td>{`جزییات سفارش#${item.entityId}`}</td>
                                      <td>{`${formatterForMoney.format(item.price)} ${PriceUnitEnums.filter(
                                        (i: any) => i.id === item.priceUnitId
                                      ).map((i: any) => i.name)[0]}`}</td>
  
                                      <td>{new Date(item.createDate).toLocaleDateString(
                                        "fa-IR"
                                      )}</td>
                                      <td>{item.installmentStartDate !== null ? new Date(
                                        item.installmentStartDate
                                      ).toLocaleDateString("fa-IR") : ""}</td>
  
                                      <td>{PaymentStatusEnums.filter(
                                        (i: any) => i.id === item.paymentStatusId
                                      ).map((i: any) => i.name)}</td>
                                      <td> {item.paymentMethodId && item.paymentMethodId !== 4 ? PaymentStructureEnums.filter(
                                        (i: any) => i.id === item.paymentMethodId
                                      ).map((i: any) => i.name)[0] : item.installmentPeriod && item.installmentOccureCount ? `${PaymentStructureEnums.filter(
                                        (i: any) => i.id === item.paymentMethodId
                                      ).map((i: any) => i.name)[0]}, ${item.installmentOccureCount} قسط ${item.installmentPeriod} روزه` : ''}</td>
                                      <td title={item.comment}>{item.comment ? item.comment.substring(0, 30) : ''}</td>
                                      <td>
                                        {item.paymentStatusId === 5 || item.paymentStatusId === 4 || item.paymentStatusId === 2 || item.paymentStatusId === 1 ? (
  
                                          <button
                                            className="border-0 btn-success btn non-hover "
                                            onClick={() => {
                                              paymentMethodSingel(item.id);
                                            }}
                                            hidden={finallInvoice.length === 0 ? false : true}
                                          >
                                            پرداخت
                                          </button>
                                        ) : (<Link
                                          className="border-0 bg-transparent non-hover edit-btn"
                                          to={`/client/payment`}
                                          state="fromInvoiceClient"
                                        >
                                          <button className="border-0 bg-transparent  non-hover btn-Payment " onClick={() => sessionStorage.setItem(`param/client/payment/invoice`, JSON.stringify([item.id]))}>
                                            {" "}
                                            مشاهده پرداخت ها
                                          </button></Link>
                                        )}
                                      </td>
  
  
                                    </tr>))}
  
  
                                  </tbody>
                                </table>
                                <br />
  
                              </> : ''}
                          </div>
                        </div>
                      </div>
  
  
  
                    }
  
  
                  </div>
                )
              }
              
              })}
              <br />
              <br />


          

            </div>
          </div>

        </div>



      </>

    );

  }

  else {
    return (
      <div>
        <div className="text-left pb-3">
          {location.state === "fromOrderClient" ? <span className="bg-light rounded p-2  ">
            {" "}
            صورت حساب های سفارش {invoiceOrder && invoiceOrder[0]}{" "}

          </span> : null}
          {location.state === "fromPaymentClient" ? <span className="bg-light rounded p-2  ">
            {" "}
            صورت حساب های پرداخت {invoicePaymentId && invoicePaymentId[0]}{" "}

          </span> : null}
        </div>
        <div className="d-flex justify-content-start col-12 ml-4 ">

          <div className="btn-group btn-group-toggle" >
            <label className={paymentStatusId === 'unpaid' ? "btn activelink" : 'btn'}>
              <input type="radio" id="1" value='unpaid' onChange={handelChangePaymnetStatus} checked={paymentStatusId === 'unpaid'} /> پرداخت نشده
            </label>
            <label className={paymentStatusId === 'paid' ? "btn activelink" : 'btn'}>
              <input type="radio" id="2" value='paid' onChange={handelChangePaymnetStatus} checked={paymentStatusId === 'paid'} /> پرداخت شده
            </label>
            <label className={paymentStatusId === 'all' ? "btn activelink  " : 'btn'}>
              <input type="radio" id="3" value='all' onChange={handelChangePaymnetStatus} checked={paymentStatusId === 'all'} /> همه
            </label>
          </div>

        </div>
        <div className="text-center dashboard-widget">

          <AiOutlineWarning size="5rem " color="gold" />
          <div>اطلاعاتی برای نمایش وجود ندارد</div>
        </div>
      </div>
    );
  }
};


export default InvoiceClient