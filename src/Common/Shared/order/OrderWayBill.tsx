import { MeasureUnitSample } from "../../Enums/MeasureUnitSample";
import { DeliveryMethods } from "../../Enums/DeliveryMethodsEnums";
import FadeLoader from "react-spinners/FadeLoader";
import { ExportToExcel } from "../Common/ExportToExcel";
import { useState, useEffect, useReducer } from "react";

import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  DeleteShipping,
  GetShoppingContracts,
  GetShoppingsAdmin,
} from "../../../services/ShippingService";
import { IoIosArrowUp } from "react-icons/io";
import { ClipLoader, GridLoader } from "react-spinners";
import ExtraShippingAdmin from "./ExtraShippingAdmin";
import { ShippingCompanySource } from "../../Enums/ShippingCompanySourceId";
import { ExportToExcelProVersion } from '../../../Utils/ExportToExcelProVersion';
import QueryString from "qs";
import  Modal  from "react-modal";
import { toast } from "react-toastify";
import { NotifyShippingCompany } from "../../../services/outScopeService";

const customStyles = {
  content: {
    inset: "50% auto auto 50%",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "5%",
    border: "2px ridge black",
    maxHeight: '80vh'

  },
};

interface Props {
  loading: any;
  idOrder: any;
  update:any
}
const OrderWayBill: React.FC<Props> = ({ loading, idOrder,update }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [id, setId] = useState<any>(0);
  const [Shipping, SetShipping] = useState([]);
  const [ShippingContracts, SetShippingContracts] = useState([]);
  const [show, setShow] = useState(false);
  const [Loading, setLoading] = useState(true);
  const [IdDelete, setIdDelete] = useState(0);
  const [modalOpen, setIsModalOpen] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const[updateValue,ForceUpdate]=useReducer(x=>x+1,0)


  const openModal = (id: any) => {
    setId(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setId(null);
    setIsOpen(false);
  };

  const openModalDelet = (id: any) => {
    setIsModalOpen(true);
    setIdDelete(id);
  };
  const closeModalDelet = () => {
    setIsModalOpen(false);
  };
  const GetShipping = async () => {
    if (idOrder > 0) {
      try {
        setLoading(true);
        const { data, status } = await GetShoppingsAdmin(idOrder);
        SetShipping(data.result.shippings.values);

        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    }
  };
  const ShippingContract = async () => {
    try {
      setLoading(true);

      const { data, status } = await GetShoppingContracts();
      SetShippingContracts(data.result.shippings.values);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };


  const showOrderWayBill = () => {
    setShow(!show);
  };
  const CollapsOrderWayBill = () => {
    setShow(!show);
    GetShipping();
    // ShippingContract()
  };
  const findeTakhsis = (id: any) => {
    const row: any = document.getElementById(`${id}`);
    const ClassNames: any = document.getElementsByClassName(`findeTakhsis`);

    if (ClassNames.length !== 0) {
      ClassNames.item(".findeTakhsis").classList.remove(`findeTakhsis`);
    }
    row.classList.remove("findeTakhsis");

    row.scrollIntoView({ behavior: "smooth", block: "nearest" });

    row.classList.add("findeTakhsis");
  };

  let color = "#0c4088";
  const urlForExcel = () => {

    let parameter = {

      ShippingIds: (Shipping ? Shipping.map((item: any) => item.id) : []),
      PageNumber:0,
      IncludeBaseExtraId:true,
      PageSize:1000000,



    }



    let url = QueryString.stringify(parameter)


    return (`?${url}`)



  }

const handelCallNotifyShipping=async(id:any)=>{
  setIsLoading(true)
let body={
  "shippingId": id
}
try {
  const {data,status}=await NotifyShippingCompany(body)

  if(status===200){
    toast.success("حواله با موفقیت برای باربری ارسال شد", {
      position: "top-right",
      closeOnClick: true,
    });
    setIsLoading(false)
    GetShipping()
    update()

  }
  
} catch (error) {
  console.log(error);
  setIsLoading(false)
}
}

  const deleteShipping=async()=>{
    setIsLoading(true)
   try {
    const {data,status}=await DeleteShipping(IdDelete)
    
    if(status===200){
      toast.success("حواله با موفقیت حذف شد", {
        position: "top-right",
        closeOnClick: true,
      });
      closeModalDelet();
      setIsLoading(false)
      GetShipping()
      update()

    }
    
   } catch (error) {
    console.log(error);
    closeModalDelet();
    setIsLoading(false)
    
   } 
  }
  if (Shipping && show) {

    return (
      <section className=" mt-2 ">
        <div className=" mb-1    rounded ">
          <div className="row p-3 itemA">
            <div className=" col-6  ">
              <span className="float-left">حواله</span>
            </div>
            <div className="  col-6   ">
              {show === true ? (
                <IoIosArrowUp
                  size="1.5rem"
                  className="float-right up-svg "
                  onClick={showOrderWayBill}
                />
              ) : (
                <svg
                  onClick={CollapsOrderWayBill}
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
          {show === true && Loading ? (
            <div className="w-100">
              {/* <div className=" m-auto"> */}
              <GridLoader
                loading={Loading}
                color="#4236d6"
                className="m-auto GridLoader position-relative  "
              />
              {/* </div> */}
            </div>
          ) : (
            <div className="info-Item">
              <div className="form-group mb-4 textOnInput col-lg-12 rounded border  border-dark  mt-4 p-2 ">
                <label>اطلاعات حواله </label>
                {loading === false ? (
                  <div className="containerTFull  ">
                    <table className="table responsive m-1 table-striped  fixed_header  ">
                      <thead className="text-center">
                        <tr>
                          <th>#</th>
                          <th>شناسه</th>
                          <th> واحد</th>
                          <th> مقدار حواله</th>
                          <th> مقدار حمل شده</th>
                          <th>تاریخ حواله</th>
                          <th>نحوه ارسال</th>
                          <th>شماره قرارداد</th>
                          <th>نام باربری</th>
                          <th> گزارش بار</th>
                          <th> عملیات</th>
                        </tr>
                      </thead>
                      <tbody className="text-center" id="havaleTable">
                        {Shipping ? (
                          Shipping.map((item: any) => (
                            <tr
                              key={item.id}
                              id={item.entityId}
                              onClick={() => findeTakhsis(item.entityId)}
                            >
                              <td aria-label="  #">{item.id}</td>
                              <td aria-label="  شناسه">
                                {(item.entityTypeId === 10
                                  ? "سفارش"
                                  : "تخصیص") + ` ${item.entityId}#`}
                              </td>
                              <td aria-label="واحد">
                                {MeasureUnitSample.filter(
                                  (i) => i.id === item.measureUnitId
                                ).map((item) => item.name)}
                              </td>
                              <td aria-label="مقدار حواله">
                                {item.plannedQuantity}
                              </td>
                              <td aria-label="مقدار حمل شده">
                                {item.shippedQuantity}
                              </td>
                              <td aria-label="تاریخ حواله">
                                {new Date(item.createDate).toLocaleDateString(
                                  "fa-IR"
                                )}
                              </td>
                              <td aria-label="نحوه ارسال">
                                {DeliveryMethods.filter(
                                  (i) => i.id === item.deliveryMethodId
                                ).map((i) => i.name)}
                              </td>
                              <td aria-label="شماره قراداد">
                                {item.shippingContractCode
                                  ? item.shippingContractCode
                                  : ""}
                              </td>
                              <td aria-label="نام باربری">
                                {item.shippingCompanyName
                                  ? item.shippingCompanyName
                                  : ""}
                              </td>
                              <td aria-label=" گزارش بار">
                                {" "}
                                <svg
                                  onClick={() => openModal(item.id)}
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="25"
                                  height="25"
                                  viewBox="0 0 256 256"
                                >
                                  <rect width="256" height="256" fill="none" />
                                  <line
                                    x1="201.1"
                                    y1="127.3"
                                    x2="224"
                                    y2="166.8"
                                    fill="none"
                                    stroke="#000"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="12"
                                  />
                                  <line
                                    x1="154.2"
                                    y1="149.3"
                                    x2="161.3"
                                    y2="189.6"
                                    fill="none"
                                    stroke="#000"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="12"
                                  />
                                  <line
                                    x1="101.7"
                                    y1="149.2"
                                    x2="94.6"
                                    y2="189.6"
                                    fill="none"
                                    stroke="#000"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="12"
                                  />
                                  <line
                                    x1="54.8"
                                    y1="127.3"
                                    x2="31.9"
                                    y2="167"
                                    fill="none"
                                    stroke="#000"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="12"
                                  />
                                  <path
                                    d="M32,104.9C48.8,125.7,79.6,152,128,152s79.2-26.3,96-47.1"
                                    fill="none"
                                    stroke="#000"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="12"
                                  />
                                </svg>
                              </td>

                              <td aria-label="عملیات">
                        <div>
                                 {item.notifyProvider===true?  <button className="btn btn-sm btn-warning mr-1"  onClick={()=>handelCallNotifyShipping(item.id)}>اطلاع به باربری  <ClipLoader
                    loading={isloading}
                    color="#fff"
                    size={15}
                  /></button>:''}
                  {item.notifyProvider===true ||item.notifyProvider===null ? <button
                 
                  onClick={() => openModalDelet(item.id)}
                  className="border-0 bg-transparent non-hover edit-btn m-1"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="حذف"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-trash-2"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>:''}
                <Modal
                      isOpen={modalOpen}
                      onRequestClose={closeModalDelet}
                      style={customStyles}
                      contentLabel="Selected Option"
                      ariaHideApp={false}
                    >
                      <div className="text-center">
                        <div
                          className="d-block clearfix mb-2 "
                          onClick={closeModalDelet}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-x close"
                            data-dismiss="alert"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </div>

                        <p>
                          {" "}
                          آیا مطمئنید حواله{" "}
                          {Shipping
                            .filter((item: any) => item.id === IdDelete)
                            .map((item: any) => item.id)}{" "}
                        </p>
                        <p>حذف شود ؟ </p>

                        <button
                          className="btn btn-danger "
                          onClick={deleteShipping}
                        >
                          حذف
                        </button>
                      </div>
                    </Modal>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="text-center"></tr>
                        )}
                      </tbody>
                    </table>
                    <div className="text-right mt-3">
                      <ExportToExcelProVersion fileName={'بارنامه ها'} url={`Shipping/GetShippingReports/${urlForExcel()}`} />

                    </div>
                  </div>
                ) : (
                  <div className="text-center m-auto">
                    <p>دریافت اطلاعات ...</p>
                    <FadeLoader
                      style={{ position: "absolute", top: "50%", left: "50%" }}
                      loading={loading}
                      color={color}
                    />
                  </div>
                )}
                <ExtraShippingAdmin
                  id={id}
                  modalIsOpen={modalIsOpen}
                  closeModal={closeModal}
                />
                <div className=" text-end  p-2" style={{ textAlign: "left" }}>

                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  } else {
    return (
      <section className="mb-2 mt-2">
        <div className=" mb-1    rounded ">
          <div className="row p-3 itemA">
            <div className=" col-6  ">
              <span className="float-left">حواله</span>
            </div>
            <div className="  col-6   ">
              {show ? (
                <IoIosArrowUp
                  size="1.5rem"
                  className="float-right up-svg"
                  onClick={showOrderWayBill}
                />
              ) : (
                <svg
                  onClick={CollapsOrderWayBill}
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
            <div className="info-Item">
              <div className="form-group mb-4 textOnInput col-lg-12 rounded border text-center border-dark  mt-4 p-2 ">
                <label>اطلاعات حواله </label>
                <span className="text-center">حواله ای موجود نیست</span>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    );
  }
};
export default OrderWayBill;
