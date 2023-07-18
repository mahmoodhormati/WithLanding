import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { CreatePayment } from "../services/paymentsService";
import { attachmentUpload } from "../services/attachmentService";
import { Field, Form, Formik } from "formik";
import { validateRequired, validatNumber } from "./validitionParams";
import { formatter } from "./Formatter";
import { GetInvoicesWithSearch } from "../services/invoiceService";
import  QueryString  from 'qs';
const ImagePriviewerForPayment = ({
  images,
  submited,
  file,
  payments,
  Index,
  Ids,
  currentPay
}) => {
  const [invoiceIds, SetinvoiceIds] = useState([]);
  const [dueDate, SetdueDate] = useState();
  const [price, setPrice] = useState(0);
  const [trackingCode, SettrackingCode] = useState("");
  const [serverPayments, setServerPayments] = useState([]);
  let [cashMustPay,setCashmustPay]=useState(0)
  let Payments = [];
  Payments = payments;
  let ids = [];
  
 let idiesforivoice=Ids
  let currentPayment = Payments.filter((i) => i.tabIndex === Index);
  ids = Ids.length>1 ?(currentPayment.map(i=>i.invoiceIds)[0]):Ids;

  const handelduoDate = (value) => {
    if (value === null) {
      SetdueDate("");
    }
    //تغییرات روی تاریخ رو اینجا اعمال کنید
    if (value instanceof DateObject) {
      SetdueDate(new Date(value.toDate()).toJSON());
    }
  };

  console.log(Ids);

  const getvalues=async(invoice)=>{
let cash=0

if(invoiceIds.length>0){

  cash=0
  let config = {
    headers: { "Content-Type": "application/json" },
    params: {
      Ids: invoiceIds
    },
    paramsSerializer: (params) => {
      return QueryString.stringify(params);
    },
  };
  try {
    const { data, status } = await GetInvoicesWithSearch(config);
    if (status === 200) {
    
      data.result.invoices.values.map(i=>cash+=i.price)
    }
  } catch (err) {
    console.log(err);
  }

setCashmustPay(cash)

}



else{
setCashmustPay(0)
  cash=0
    
    if(ids.length===1){

      let config = {
        headers: { "Content-Type": "application/json" },
        params: {
          Ids: ids
        },
        paramsSerializer: (params) => {
          return QueryString.stringify(params);
        },
      };
      try {
        const { data, status } = await GetInvoicesWithSearch(config);
        if (status === 200) {
        
          data.result.invoices.values.map(i=>cash+=i.price)
        }
      } catch (err) {
        console.log(err);
      }


      setCashmustPay(cash)}

}}


useEffect(()=>{

  getvalues(invoiceIds)


},[invoiceIds])

  if (images.length > 0) {
    submited(true);
    const handelSubmit = async (e) => {
      try {
        const body = {
          invoiceIds: currentPayment[0].shouldPickFromInvoices
            ? invoiceIds
            : ids,
          paymentMethodId: currentPayment[0].paymentMethodId,
          price: Number(price),
          dueDate: dueDate ? dueDate : null,
          hasAttachment: true,
          trackingCode: trackingCode,
          comment: null,
        };
        const { data, status } = await CreatePayment(body);
        if (status === 200) {
          setServerPayments([...serverPayments, data.result.payment]);

          try {
            const formData = new FormData();
            formData.append("Files", images[0]);
            formData.append("EntityTypeId", 20);
            formData.append("EntityId", data.result.payment.id);
            formData.append("AttchmentTypeId",2)
            const response = await attachmentUpload(formData);
          } catch (error) {

          }

          currentPay()
        }
      } catch (error) {
        console.log(error);
      }

      submited(false);
   
      file([]);
      SettrackingCode('')
      setPrice(0)
    };
   

    const Invoices = () => {
      return idiesforivoice.map((item) => ({ label: item, value: item }));
    };

    

    return (
      <div  >
        {images.map((item) => (
          <Formik
            initialValues={{
              price:Number(price),
              trackingCode,
            }}
            enableReinitialize={true}
            onSubmit={(values) => {
              // same shape as initial values
              handelSubmit();
            }}
          >
            {({
              errors,
              touched,
              validateField,
              validateForm,
              setFieldValue,
              handleChange,
              values,
            }) => (
              <Form className="form-group mb-4 textOnInput ">
                <div className="row border  rounded mt-2 py-4 priviewImg ">
                  <div className="col-md-4 ">
                    <img
                      src={URL.createObjectURL(item)}
                      className="img-fluid  rounded "
                      style={{width:'15vw',height:'60%'}}
                    />
                  </div>

                  <div className="col-md-7 row mb-4 textOnInput mt-2 ">
                  {currentPayment[0].shouldPickFromInvoices ? (  <div className="col-6 mt-4 mb-4  textOnInput">
                        <label> انتخاب صورتحسابها</label>
                        <Select
                            options={Invoices()}
                            placeholder=' صورتحساب های خود را انتخاب کنید'
                            isMulti
                            isClearable={true}
                            onChange={(e) => {
                              SetinvoiceIds(e.map((i) => i.value));
                             console.log(e);
                            }}
                          />
                       
                        </div> ) : (
                        ""
                      )}
                    <div className="col-md-6 mt-4 mb-4">
                      <label>مبلغ</label>
                      <Field
                        validate={validatNumber}
                      
                        name="price"
                        type="text"  
                        
                        className="form-control"
                        value={formatter.format(price)}
                        onChange={(e) =>
                          setPrice(e.target.value.replaceAll(",", ""))
                        }
                      />
                      {errors.price && touched.price && (
                        <div className="text-danger">{errors.price}</div>
                      )}
                      {cashMustPay!==0?<p className="text-center">{`جمع مبلغ پرداختی  ${formatter.format(cashMustPay)} است.`}</p>:''}
                    </div>
                    <div className="col-md-6 mt-4 mb-4">
                      <label>شماره پیگیری</label>

                      <Field
                        validate={validateRequired}
                        name="trackingCode"
                        type="text"
                        className="form-control opacityForInput"
                        value={trackingCode}
                        placeholder='شماره چک/فیش نقدی'
                        onChange={(e) => SettrackingCode(e.target.value)}
                      />
                      {errors.trackingCode && touched.trackingCode && (
                        <div className="text-danger">{errors.trackingCode}</div>
                      )}
                    </div>
                    
                    
                    <div className="col-md-6 mt-4 mb-4 ">
                      {currentPayment[0].shouldAnnounceDueDate ? (
                        <>
                          <label className="date-piker-form">سررسید</label>
                          <div className="  ">
                            <DatePicker
                              calendar={persian}
                              locale={persian_fa}
                              style={{
                                height: "45.39px",
                                width: "100%",
                                textAlign: "center",
                              }}
                              value={dueDate}
                              onChange={handelduoDate}
                            />
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="col-md-1 m-auto">
                    <button
                      className="btn btn-sm btn-success  btn-imgPrivi "
                      type="submit"
                    >
                      ثبت
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        ))}

        {/* {serverPayments.length > 0 ? (
          <div>
            <table className="table text-center table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>کدرهگیری</th>
                  <th>مبلغ</th>
                </tr>
              </thead>

              <tbody>
                {serverPayments.map((item) => (
                  <tr>
                    <td>{item.id}</td>
                    <td>{item.trackingCode}</td>
                    <td>{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          ""
        )} */}
      </div>
    );
  } else if (serverPayments.length > 0) {
    return (
      // <div>
      //   <table className="table text-center table-striped">
      //     <thead>
      //       <tr>
      //         <th>#</th>
      //         <th>کدرهگیری</th>
      //         <th>مبلغ</th>
      //       </tr>
      //     </thead>
null
      //     <tbody>
      //       {serverPayments.map((item) => (
      //         <tr>
      //           <td>{item.id}</td>
      //           <td>{item.trackingCode}</td>
      //           <td>{item.price}</td>
      //         </tr>
      //       ))}
      //     </tbody>
      //   </table>
      // </div>
    );
  }
};

export default ImagePriviewerForPayment;
