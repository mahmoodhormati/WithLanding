import { MeasureUnitSample } from "../../../Common/Enums/MeasureUnitSample";
import { DeliveryMethods } from "../../../Common/Enums/DeliveryMethodsEnums";
import FadeLoader from "react-spinners/FadeLoader";
import { ExportToExcel } from "../../../Common/Shared/Common/ExportToExcel";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  GetShoppingContracts,
  GetShoppingsAdmin,
} from "../../../services/ShippingService";
import { IoIosArrowUp } from "react-icons/io";
import { GridLoader } from "react-spinners";
import { GetShoppingsClient } from "../../../services/ShippingService";
import { GiSpanner } from "react-icons/gi";
import ExtraShippingClient from "../../../Common/Shared/order/ExtraShippingClient";
import { ExportToExcelProVersion } from "../../../Utils/ExportToExcelProVersion";
import QueryString from "qs";

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
    maxHeight:'80vh'

  },
};

interface Props {
  loading: any;
  idOrder: any;
}
const OrderWayBillForClients: React.FC<Props> = ({ loading, idOrder }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [id, setId] = useState<any>(0);
  const [Shipping, SetShipping] = useState([]);
  const [ShippingContracts, SetShippingContracts] = useState([]);
  const [show, setShow] = useState(false);
  const [Loading, setLoading] = useState(true);

  const openModal = (id: any) => {
    setId(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setId(null);
    setIsOpen(false);
  };
  const GetShipping = async () => {
    try {
      setLoading(true);
      const { data, status } = await GetShoppingsClient(idOrder);
      SetShipping(data.result.shippings.values);

      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
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

      ShippingIds: (Shipping ? Shipping.map((item: any) => item.id) : null),
      PageNumber:0,
      IncludeBaseExtraId:true,
      PageSize:1000000,





    }



    let url = QueryString.stringify(parameter)


    return (`?${url}`)



  }
  if (Shipping && show) {
   
    return (
      <section className=" mt-2">
        <div className="    rounded">
          <div className="row itemA p-3">
            <div className=" col-6  ">
              <span className="float-left">حواله</span>
            </div>
            <div className="  col-6   ">
              {show === true ? (
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
                  <div className="containerT p-2 ">
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
                          <th>مشاهده جزییات</th>
                        </tr>
                      </thead>
                      <tbody className="" id="havaleTable">
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
                                  : "--"}
                              </td>
                              <td aria-label="نام باربری">
                                {item.shippingCompanyName
                                  ? item.shippingCompanyName
                                  : "--"}
                              </td>
                              <td aria-label="مشاهده جزییات">
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
                            </tr>



                          )

                        

                          )
                       

                        ) 
                        
                        : (
                          <tr className="text-center"></tr>
                        )
                        
                        
                        }

                        <tr>
                          
                        </tr>
                      </tbody>
                    </table>
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
                <ExtraShippingClient
                  id={id}
                  modalIsOpen={modalIsOpen}
                  closeModal={closeModal}
                />
                 <div className="text-right mt-3">
                      <ExportToExcelProVersion fileName={'بارنامه ها'} url={`Shipping/GetShippingReports/${urlForExcel()}`} />

                    </div>
              </div>
            </div>
          )}
        </div>
      </section >
    );
  } else {
    return (
      <section className="mb-2 mt-2">
        <div className="     rounded  ">
          <div className="row itemA p-3">
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
export default OrderWayBillForClients;
