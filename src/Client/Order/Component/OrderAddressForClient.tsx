import { useSelector } from "react-redux";
import { getExtraData } from "../../../services/extraService";
import { useEffect, useState, useMemo, EffectCallback, useReducer } from "react";
import ShippingSelected from "../../../Common/Shared/Common/shippingSelected";
import { GetAllProductSupply, GetAllProductWithSearch, GetProductSupply } from "../../../services/productSupplyService";
import { GetAddress, GetAddressByIds } from "../../../services/addressService";
import { DeleteOrderDetail, editOrder } from "../../../services/orderService";
import { toast } from "react-toastify";

import { GetProductSupplyConditions, GetProductSupplyConditionsCustomer } from "../../../services/ProductSupplyConditionService";
import AddAdressCustomerForOrder from "../../../Common/Shared/Common/addAdressCustomerForOrder";
import ExcelFileUploader from "../../../Utils/ExcelFileUploader";
import { PaymentStructureEnums } from "../../../Common/Enums/PaymentStructureEnums";
import TakhsisTableForClients from "../../../Common/Shared/Form/TakhsisTableForClients";
import SelectColumnFilter from "../../../Common/Shared/Form/ColumnFilter";
import FadeLoader from "react-spinners/FadeLoader";
import ModalGroupWork from "../../../Common/Shared/Common/ModalGroupWork";
import Modal from "react-modal";
import { RootState } from "../../../store";
import { SyncShippingsWithBazargah } from "../../../services/outScopeService";

import { IoIosArrowUp } from "react-icons/io";
import { GridLoader } from "react-spinners";
import { formatter } from "../../../Utils/Formatter";
import { DeliveryMethods } from "../../../Common/Enums/DeliveryMethodsEnums";
import QueryString from "qs";
import { MdOutlinePublishedWithChanges } from "react-icons/md";
import SwitchOrderDetailParent from "../../../Common/Shared/order/SwitchOrderDetailParent";

const file = require("../../../Admin/Order/Component/addressFile.xlsx");

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
  details: any;
  orderWeight: number;
  TakhsisWeight: number;
  getOrder: any;
  order: any;
  paymentStatus: number,
  update:any
}

const OrderAddressForClient: React.FC<Props> = ({
  details,
  orderWeight,
  TakhsisWeight,
  getOrder,
  order,
  paymentStatus,
  update
}) => {
  const roles = useSelector((state: RootState) => state.roles);
  const [orderCondition, setOrderCondition] = useState<any>([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [FilterData, setFilterData] = useState<any>([]);
  const [IsOpen, SetIsOpen] = useState(false);
  const [IsOpenInvoce, SetIsOpenInvoice] = useState(false);
  const [open, SetOpen] = useState(false);
  const [modalOpen, setIsModalOpen] = useState(false);
  const [modalOpenInvoice, setIsModalOpenInvoice] = useState(false);

  const [IdDelete, setIdDelete] = useState(0);
  const [measureUnitId, setmeasureUnitId] = useState(0);
  const [orderDetailId, setorderDetailId] = useState([]);
  const [OrderId, setOrderId] = useState(0);
  const [completeDdata, SetCompletedData] = useState([]);
  const [productSupplyId, setProductSupplyId] = useState(0);
  const [stateSuccess, SetStateSuccess] = useState(0);
  const [stateError, SetStateError] = useState(0);
  const [show, setShow] = useState(true);
  const [inSwitchMode, setInSwitchMode] = useState(false)

  const [isOpenAddress, setIsOpenAddress] = useState(false);
  const [modalIsOpenUploadExcel, setIsOpenUploadExcel] = useState(false);
  let [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
 



  const openSwitchMode = (id: any) => {

    setIdDelete(id)
    setInSwitchMode(true)
  }
  const CloseSwitchMode = (id: any) => {

    setIdDelete(0)
    setInSwitchMode(false)
  }

  const getSelectedData = (data: any) => {
    let arrayOfSelectedData = [];

    arrayOfSelectedData = data.map((item: any) => item.original);
    return arrayOfSelectedData;
  };

  const getBulkJob = (selected: any) => {
    const arrayOfData = getSelectedData(selectedRows);

    if (selected === 2) {
      setorderDetailId(arrayOfData);

      openModal(arrayOfData);
    }
    if (selected === 3) {
      openInvoceModal(arrayOfData);
    }
  };
  const openInvoceModal = (id: any) => {
    setIsModalOpenInvoice(true);
    setorderDetailId(id);
  };
  const ColseInvoceModal = () => {
    setIsModalOpenInvoice(false);
  };
  const openModalDelet = (id: any) => {
    setIsModalOpen(true);
    setIdDelete(id);
  };
  const closeModalDelet = () => {
    setIsModalOpen(false);
  };
  const deletHandler = async () => {
    // const body={
    //     "orderDetailId":IdDelete
    // }
    try {
      const { data, status } = await DeleteOrderDetail(IdDelete);
      if (status === 200) {
        toast.success("جزییات با موفقیت حذف شد", {
          position: "top-right",
          closeOnClick: true,
        });
        closeModalDelet();
      }
    } catch (err) {
      console.log(err);
      closeModalDelet();
    }
  };
  const selectedFunc = () => {
    const arrayOfData = getSelectedData(selectedRows);
    setorderDetailId(arrayOfData);

    openModal(arrayOfData);
  };
  const [cottageCode, setcottageCode] = useState([]);

  const getSupplyCode = async () => {

    let productSupplyids: any = [...new Set(details.filter((item: any) => item.productSupplyId !== null).map((item: any) => item.productSupplyId))]



    if (productSupplyids.length > 0) {
      try {



        let configs = {
          headers: { "Content-Type": "application/json" },
          params: {

            
            Ids: productSupplyids,
            PageNumber: 0,
            PageSize: 100000


          },
          paramsSerializer: (params: any) => {
            return QueryString.stringify(params);
          },
        };

        const { data, status } = await GetAllProductWithSearch(configs)





        setcottageCode(data.result.productSupplies.values)

        getOrderDetailCondition(data.result.productSupplies.values)
      } catch (e) {
        console.log(e);
      }
    }
    else {
      setcottageCode([])

      getOrderDetailCondition([])
    }

  }




  const getOrderDetailCondition = (cottageCode: any) => {

    setLoading(true);
    if (details.filter((item: any) => item.productSupplyConditionId !== null).length > 0) {





      let condition = cottageCode.filter((item: any) => item.productSupplyConditions.length > 0).map((item: any) => item.productSupplyConditions)[0]

      if (condition) {
        const Newrename = condition.map(({ id: conditionId, ...condition }: any) => ({
          conditionId,
          ...condition,
        }));

        condition = Newrename
      }





      let mergeById = (a1: any, a2: any) =>

        a1.map((itm: any) => ({
          ...a2.find((item: any) => (item.conditionId === itm.productSupplyConditionId) && item),
          ...itm
        }));





      let arr: any = mergeById(details, condition)






      setOrderCondition(arr)

      setLoading(false);


      setLoading(false);


    }
    else {
      setOrderCondition(details)

      setLoading(false);


      setLoading(false);
    }
  }
  let condition: any = [...orderCondition];



  const openModal = (id: any) => {
    setorderDetailId(id);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const openModalFinancialConfirmation = () => {
    SetIsOpen(true);
  };
  const openModelInvoice = (id: any) => {
    setOrderId(id);
    SetIsOpenInvoice(true);
  };
  const closeModalFinancialConfirmation = () => {
    getOrder();
    SetIsOpen(false);
  };
  const closeModalAddress = () => {
    setIsOpenAddress(false);
  };
  const CloseModalInvoice = () => {
    SetIsOpenInvoice(false);
  };
  const openModalAddress = (item: any) => {
    setorderDetailId(item);

    setIsOpenAddress(true);
  };
  const openModalExcelAddress = (id: any) => {
    setorderDetailId(id);
    setIsOpenUploadExcel(true);
  };
  const closeModalIsOpenUploadExcel = () => {
    setIsOpenUploadExcel(false);
  };

  const getDetails = async () => {
    let finalArr: any = [];
    if (details.length > 0) {
      try {

        let addressIds = details.filter((item: any) => item.addressId !== null).map((item: any) => item.addressId)
        setLoading(true);

        let configs = {
          headers: { "Content-Type": "application/json" },
          params: {

            Ids: [...new Set(addressIds)]


          },
          paramsSerializer: (params: any) => {
            return QueryString.stringify(params);
          },
        };

        const response = await GetAddressByIds(configs)


        let addresses = response.data.result.addresses;
        if (addresses) {
          const Newrename = addresses.map(({ id: MyAddressId, ...addresses }: any) => ({
            MyAddressId,
            ...addresses,
          }));

          addresses=Newrename
        }

        let mergeById = (a1: any, a2: any) =>
        a1.map((itm: any) => ({
          ...a2.find((item: any) => (item.MyAddressId === itm.addressId) && item),
          ...itm
        }));
      let newArr = mergeById(details, addresses)
       




        SetCompletedData(newArr);
        setFilterData(newArr.filter((item: any) => item.addressId !== null));
        setLoading(false);

      } catch (error) {
        setLoading(false);
      }
    }


  };

  const close = () => {
    SetOpen(false);
  };


  useEffect((): ReturnType<EffectCallback> => {
    const script = document.createElement("script");
    const scriptText = document.createTextNode(`

    
    
    $('#beforeTakhsisclient th').each(function(idx, el) {
        var check = !!$('#beforeTakhsisclient tbody tr').find('td:eq(' + idx + ')').filter(function() {
          return $.trim($(this).html()).length;
        }).length;
       
          
          $('#beforeTakhsisclient tr').find('td:eq(' + idx + '), th:eq(' + idx + ')').show();
          if (!check) {
              $('#beforeTakhsisclient tr').find('td:eq(' + idx + '), th:eq(' + idx + ')').hide();
          }
        
      
      })`)

    script.appendChild(scriptText);
    document.head.appendChild(script);



    return (): void => {
      document.head.removeChild(script);
    }
  }, [orderCondition])


  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id", disableFilters: true },
      {
        Header: "نام تحویل گیرنده",
        accessor: "receiverName",
        disableFilters: true,
      },
      { Header: "کد ملی", accessor: "receiverNationalCode", disableFilters: true },
      {
        Header: "آدرس",
        accessor: "fullAddress",
        disableFilters: true,
      },
      {
        Header: "شماره هماهنگی",
        accessor: "receiverTel",
        disableFilters: true,
        Cell:(rows: any)=>{

          return(
          rows.row.original.receiverTel ? rows.row.original.receiverTel:`  ${rows.row.original.receiverMobile}`
          )
        }
      },
      { Header: "کد پستی", accessor: "postalCode", disableFilters: true },
      {
        Header: "قیمت پایه",
        accessor: "basePrice",
        disableFilters: true,
        Cell: (rows: any) => {
          return (formatter.format(rows.row.original.basePrice))
        }
      },
      {
        Header: "وزن", accessor: "quantity", disableFilters: true, Cell: (rows: any) => {
          return (formatter.format(rows.row.original.quantity))
        },
      },
      {
        Header: "قیمت تمام شده",
        accessor: "priceIncludingTax",
        Cell: (rows: any) => {
          return (formatter.format(rows.row.original.priceIncludingTax))
        },
        disableFilters: true,
      },
      {
        Header: "بازه پرداخت",
        accessor: "  ",
        Cell: (rows: any) => {


          if (condition.filter((x: any) => x.id === rows.row.original.id)
            .paymentMethodId === 4
          ) {
            return (condition
              .filter((x: any) => x.id === rows.row.original.id)
              .map(
                (y: any) =>
                  `${y.installmentOccureCount} قسط ${y.installmentPeriod} روزه`
              ))
          }
          else {
            return ('')
          }
        },
        disableFilters: true,
      },
      { Header: "شناسه تخصیص", accessor: "AllocationId", disableFilters: true },
      {
        Header: "شناسه یکتا",
        accessor: "receiverUniqueId",
        disableFilters: true,
      },
      {
        Header: "محدودیت ارسال",
        accessor: "acceptableDeliveryMethodId",
        Cell: (rows: any) => {
          if (rows.row.original.acceptableDeliveryMethodId) {
            return (DeliveryMethods.filter((i: any) => i.id === rows.row.original.acceptableDeliveryMethodId).map((i: any) => i.name)[0])
          } else {
            return ("");
          }
        },
        disableFilters: true,

      },
      {
        Header: "عملیات",
        accessor: "button",
        Footer: '',
        Cell: (rows: any) => {
         
            return (
              <div className="col-sm-12 col text-nowrap">
               
                {rows.row.original.canSwitchParent === true ?

                  <button className="border-0 bg-transparent non-hover edit-btn m-1" title='تغییر پایه سفارش' onClick={() => openSwitchMode(rows.row.original.id)}><MdOutlinePublishedWithChanges size={20} /></button>
                  : ''}

              </div>
            )
        
        },

        disableFilters: true,
      },

    ],
    [FilterData]

  );

  const data = useMemo(() => FilterData, [FilterData]);



  const showAddressOrder = () => {
    setShow(!show);
  };
  const CollapsAddressOrder = () => {
    setShow(!show);

  };

  useEffect(() => {
    getDetails();

    getSupplyCode()
  }, [details, show]);


  const checkComment=(comment:any)=>{

    if(comment===null){
      return true
    }
    else{
      if(comment.includes('ش.م.ب')){
        return false
      }
      else{
        return true
      }
    }
  }

  if (show && typeof details !== undefined) {
    return (
      <section className="mb-2 mt-2">
        <div className=" mb-1   rounded">
          <div className="row itemA   p-3">
            <div className=" col-6  ">
              <span className="float-left">جزییات سفارش</span>
            </div>
            <div className="  col-6   ">
              {show === true ? (
                <IoIosArrowUp
                  size="1.5rem"
                  className="float-right up-svg"
                  onClick={showAddressOrder}
                />
              ) : (
                <svg
                  onClick={CollapsAddressOrder}
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
          {loading ? (
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
            <div className="info-Item">

              <div className="form-group mb-4 textOnInput col-lg-12     mt-4   ">
                {condition &&
                  condition.filter((x: any) => x.addressId === null).length > 0 ? (
                  <div
                    className="form-group   textOnInput col-lg-12 rounded border  border-dark   "
                    style={{ marginTop: "4rem" }}
                  >
                    <label> فاقد تخصیص </label>

                    <div
                      className=" p-2 table-responsive"
                      style={{ overflowX: "auto" }}
                    >
                      <table id="beforeTakhsisclient" className="table  responsive  table-striped  mt-2  mb-4">
                        <thead className="text-center">
                          <tr className="">
                            <th> #</th>
                            <th> کالا</th>
                            <th>قیمت پایه</th>
                            <th>وزن مانده </th>
                            <th> ارزش کالا</th>
                            <th> عرضه</th>
                            <th>نحوه پرداخت</th>
                            <th>بازه پرداخت</th>
                            <th>کوتاژ</th>
                            <th> تاریخ</th>
                            <th>عملیات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {condition
                            .filter((x: any) => x.addressId === null)
                            .map((item: any) => (
                              <tr key={item.id}>
                                <td aria-label="  #" className="">
                                  {item.id}
                                </td>
                                <td
                                  aria-label="  نام کالا"
                                  className=""
                                >
                                  {item.product.name}
                                </td>
                                <td
                                  aria-label="  قیمت پایه"
                                  className=""
                                >
                                  {item.basePrice}
                                </td>
                                <td
                                  aria-label="  وزن مانده"
                                  className=""
                                >
                                  {formatter.format(item.quantity)}
                                </td>
                                <td
                                  aria-label="ارزش کالا "
                                  className=""
                                >
                                  {formatter.format(item.priceIncludingTax)}
                                </td>
                                <td aria-label="عرضه  " className="">
                                  {item.productSupplyId
                                    ? item.productSupplyId
                                    : ""}
                                </td>
                                <td
                                  aria-label="نحوه  پرداخت "
                                  className=""
                                >
                                  {item.paymentMethodId
                                    ? PaymentStructureEnums.filter(
                                      (x: any) => x.id === item.paymentMethodId
                                    ).map((q: any) => q.name)
                                    :order.paymentMethodId?PaymentStructureEnums.filter(
                                      (x: any) => x.id === order.paymentMethodId
                                    ).map((q: any) => q.name):'نقدی'}
                                </td>
                                <td
                                  aria-label="  بازه پرداخت"
                                  className=""
                                >
                                  {item.paymentMethodId === 4
                                    ? `${item.installmentOccureCount} قسط ${item.installmentPeriod} روزه`
                                    : ''}
                                </td>
                                <td aria-label="کوتاژ  " className="">
                                  {cottageCode?cottageCode.filter((i: any) => i.id === item.productSupplyId).map((i: any) => i.cottageCode)[0]:''}
                                </td>
                                <td aria-label=" تاریخ" className="">
                                  {new Date(item.createDate).toLocaleDateString(
                                    "fa-IR"
                                  )}
                                </td>

                                <td
                                  aria-label="عملیات"
                                  className="t m-1"
                                >
                                  {!order.extId ? (
                                    <>
                                      { checkComment(item.comment)?<>
                                      <button
                                        hidden={order.extId ? true : false}
                                        onClick={() =>
                                          openModalAddress(
                                            item)
                                        }
                                        className=" border-0 bg-success "
                                        title="افزودن آدرس"
                                      >
                                        <svg
                                          style={{ color: "white" }}
                                          width="20"
                                          height="20"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="currentColor"
                                          className="bi bi-plus-circle"
                                          viewBox="0 0 17 16"
                                        >
                                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                        </svg>
                                      </button>
                                      <button
                                        className={
                                          order.orderStatusId === 8
                                            ? "bg-primary m-1 border-0 "
                                            : "bg-success m-1 border-0 "
                                        }
                                        hidden={order.extId ? true : false}
                                        onClick={() =>
                                          openModalExcelAddress(item.id)
                                        }
                                        title="افزودن آدرس با اکسل"
                                      >
                                        <svg
                                          style={{ color: "white" }}
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="20"
                                          height="20"
                                          fill="currentColor"
                                          className="bi bi-explicit"
                                          viewBox="0 0 16 16"
                                        >
                                          {" "}
                                          <path d="M6.826 10.88H10.5V12h-5V4.002h5v1.12H6.826V7.4h3.457v1.073H6.826v2.408Z" />{" "}
                                          <path d="M2.5 0A2.5 2.5 0 0 0 0 2.5v11A2.5 2.5 0 0 0 2.5 16h11a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 13.5 0h-11ZM1 2.5A1.5 1.5 0 0 1 2.5 1h11A1.5 1.5 0 0 1 15 2.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5v-11Z" />{" "}
                                        </svg>
                                      </button>{" "}</>:''}
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {completeDdata &&
                  completeDdata.filter((x: any) => x.addressId !== null).length >
                  0 ? (
                  <div
                    className="form-group mb-4  textOnInput col-lg-12 rounded border  border-dark    "
                    style={{ marginTop: "3rem" }}
                  >
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
                          آیا مطمئنید جزییات{" "}
                          {data
                            .filter((item: any) => item.id === IdDelete)
                            .map((item: any) => item.id)}{" "}
                        </p>
                        <p>حذف شود ؟ </p>

                        <button
                          className="btn btn-danger "
                          onClick={deletHandler}
                        >
                          حذف
                        </button>
                      </div>
                    </Modal>
                    <label> تخصیص یافته </label>

                    <TakhsisTableForClients
                      columns={columns}
                      data={data}
                      getData={(rows: any) => setSelectedRows(rows)}
                      bulkJob={getBulkJob}
                    />
                    <ModalGroupWork
                      open={open}
                      close={close}
                      success={stateSuccess}
                      error={stateError}
                    />
                  </div>
                ) : (
                  ""
                )}

              </div>
              <SwitchOrderDetailParent order={order} currentDetailId={IdDelete} closeModal={CloseSwitchMode} modalIsOpen={inSwitchMode} update={update}  isUser={true}/>

              <AddAdressCustomerForOrder
                isOpenAddress={isOpenAddress}
                closeModal={closeModalAddress}
                orderDetailId={orderDetailId}
                customer={order.customer}
                UpdateParent={update}
              />
              <ExcelFileUploader
                modalIsOpen={modalIsOpenUploadExcel}
                closeModal={closeModalIsOpenUploadExcel}
                EntityId={orderDetailId}
                EntityTypesId={11}
                comment={
                  "لطفا فایل اکسل مطابق نمونه اطلاعات ارسال را بارگزاری کنید"
                }
                update={update}
              />
            </div>
          )}
        </div>
      </section>
    );
  } else {
    return (
      <section className="mb-2 mt-2">
        <div className="   rounded  ">
          <div className="row itemA   p-3">
            <div className=" col-6  ">
              <span className="float-left">جزییات سفارش</span>
            </div>
            <div className="  col-6   ">
              {show ? (
                <IoIosArrowUp
                  size="1.5rem"
                  className="float-right up-svg"
                  onClick={showAddressOrder}
                />
              ) : (
                <svg
                  onClick={CollapsAddressOrder}
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
                <span className="text-center">
                  اطلاعاتی برای نمایش موجود نیست
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    );
  }
};
export default OrderAddressForClient;
