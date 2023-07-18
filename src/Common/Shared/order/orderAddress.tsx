import './tooltip.css'
import { useSelector } from "react-redux";
import { getExtraData } from "../../../services/extraService";
import { useEffect, useState, useMemo, EffectCallback, useReducer } from "react";
import ShippingSelected from "../Common/shippingSelected";
import { GetAllProductSupply, GetAllProductWithSearch, GetProductSupply } from "../../../services/productSupplyService";
import { ClipLoader } from "react-spinners";
import { GetAddress, GetAddressByIds } from "../../../services/addressService";
import { DeleteOrderDetail, GetOrderDetails, editOrder, editOrderDetail } from "../../../services/orderService";
import { toast } from "react-toastify";
import FinancialConfirmation from "./FinancialConfirmation";
import { GetProductSupplyConditions } from "../../../services/ProductSupplyConditionService";
import AddAdressCustomerForOrder from "../Common/addAdressCustomerForOrder";
import ExcelFileUploader from "../../../Utils/ExcelFileUploader";
import { PaymentStructureEnums } from "../../Enums/PaymentStructureEnums";
import TakhsisTable from "../Form/TakhsisTable";
import SelectColumnFilter from "../Form/ColumnFilter";
import FadeLoader from "react-spinners/FadeLoader";
import ModalGroupWork from "../Common/ModalGroupWork";
import Modal from "react-modal";
import { RootState } from "../../../store";
import { SyncShippingsWithBazargah } from "../../../services/outScopeService";
import InvoiceSetForOrder from "./InvoiceSetForOrder";
import CraeteInvoceOrderDetail from "../Common/CreateInvoceOrdeDetail";
import { IoIosArrowUp, IoMdSwitch } from "react-icons/io";
import { GridLoader } from "react-spinners";
import ReserveOrder from './ReserveOrder';
import { HiOutlineTruck } from 'react-icons/hi';
import { RiUserReceivedFill } from 'react-icons/ri';
import { GrLocation } from 'react-icons/gr';
import { VscTasklist } from 'react-icons/vsc';
import { CiLocationOn } from 'react-icons/ci';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { formatter } from '../../../Utils/Formatter';


import { TbArrowsCross } from 'react-icons/tb';
import MergeExternalOrderWithInteralOrder from './MergeExternalOrderWithInteralOrder';
import { DeliveryMethods } from '../../Enums/DeliveryMethodsEnums';
import EditOrderDetail from './EditOrderDetail';
import QueryString from 'qs';
import SplitOrderDetails from './SplitOrderDetails';
import { MdOutlinePublishedWithChanges } from 'react-icons/md';
import SwitchOrderDetailParent from './SwitchOrderDetailParent';


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
  paymentStatus: number;
  orderDetailsFunc: any,
  update: any
}

const OrderAddress: React.FC<Props> = ({
  details,
  orderWeight,
  TakhsisWeight,
  getOrder,
  order,
  paymentStatus,
  orderDetailsFunc, update
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
  const [contractIds, SetContractIds] = useState<any>()
  const [IdDelete, setIdDelete] = useState(0);
  const [measureUnitId, setmeasureUnitId] = useState(0);
  const [orderDetailId, setorderDetailId] = useState([]);
  const [OrderId, setOrderId] = useState(0);
  const [completeDdata, SetCompletedData] = useState([]);
  const [productSupplyId, setProductSupplyId] = useState(0);
  const [stateSuccess, SetStateSuccess] = useState(0);
  const [stateError, SetStateError] = useState(0);
  const [show, setShow] = useState(true);

  const [isOpenAddress, setIsOpenAddress] = useState(false);
  const [isReserveModal, setisReserveModal] = useState(false);
  const [modalIsOpenUploadExcel, setIsOpenUploadExcel] = useState(false);
  const [IsOpenSplit, setIsOpenSplit] = useState(false);
  let [loading, setLoading] = useState(true);
  let [loadingButton, setLoadingButton] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [cottageCode, setcottageCode] = useState<any>([]);
  const [mergeModalOpen, SetmergeModalOpen] = useState(false);


  const [newQuantity, SetNewQuantity] = useState<any>('')
  const [newbasePrice, SetnewbasePrice] = useState<any>('')
  const [item, SetItem] = useState<any>()
  const [inEditMode, setInEditMode] = useState(false)
  const [inSwitchMode, setInSwitchMode] = useState(false)


  const [maxQuantity, SetmaxQuantity] = useState(0)



  const openSwitchMode = (id: any) => {

    setIdDelete(id)
    setInSwitchMode(true)
  }
  const CloseSwitchMode = (id: any) => {

    setIdDelete(0)
    setInSwitchMode(false)
  }



  const openModalEdit = (item: any) => {

    SetItem(item)
    setInEditMode(true)
  }
  const CloseModalEdit = (item: any) => {

    SetItem(null)
    setInEditMode(false)
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

      openModal(arrayOfData, cottageCode.map((i: any) => i.allowedContracstIds)[0]);
    }
    if (selected === 3) {
      openInvoceModal(arrayOfData);
    }
    if (selected === 4) {
      openModalEdit(arrayOfData)
    }
  };
  const openInvoceModal = (id: any) => {
    setIsModalOpenInvoice(true);
    setorderDetailId(id);
  };
  const ColseInvoceModal = () => {
    setIsModalOpenInvoice(false);
    getOrder()
  };

  const OpenMergModal = (id: any) => {

    SetmergeModalOpen(true);
  }
  const CloseMergModal = (id: any) => {

    SetmergeModalOpen(false);
    getOrder()
  }





  const OpenModalReserve = () => {

    setisReserveModal(true);
  }
  const closeModalinvoice = () => {
    setisReserveModal(false);
    getOrder()
  }
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
        update()
      }
    } catch (err) {
      console.log(err);
      closeModalDelet();
    }

  };
  const selectedFunc = () => {
    const arrayOfData = getSelectedData(selectedRows);
    setorderDetailId(arrayOfData);

    openModal(arrayOfData, cottageCode.map((i: any) => i.allowedContracstIds)[0]);
  };

  const getSupplyCode = async () => {

    let productSupplyids: any = [...new Set(details.filter((item: any) => item.productSupplyId !== null).map((item: any) => item.productSupplyId))]



    if (productSupplyids.length > 0) {
      try {



        let configs = {
          headers: { "Content-Type": "application/json" },
          params: {

            IsAdmin: true,
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
















  const openModal = (id: any, productSupplyId: any) => {

    if (!Array.isArray(productSupplyId)) {


      SetContractIds(cottageCode.filter((i: any) => i.id === productSupplyId).map((i: any) => i.allowedContracstIds) ? cottageCode.filter((i: any) => i.id === productSupplyId).map((i: any) => i.allowedContracstIds)[0] : [])
    }
    else {

      SetContractIds(productSupplyId)
    }
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
  const openModalSplitSupply = (id: any, maxQuantiy: any) => {
    setorderDetailId(id);
    SetmaxQuantity(maxQuantiy)
    setIsOpenSplit(true);
  };
  const CloseModalSplitSupply = (id: any) => {
    setorderDetailId(id);
    setIsOpenSplit(false);
  };
  const closeModalIsOpenUploadExcel = () => {
    setIsOpenUploadExcel(false);
  };
  const syncButton = async (orderId: number, orderDetailId?: number) => {
    setLoadingButton(true)
    const body = {
      orderId,
      orderDetailId,
    };
    try {
      const { data, status } = await SyncShippingsWithBazargah(body);
      if (status === 200) {

        data.result.syncResult.map((i: any) => (
          toast.success(i.message, {
            position: "top-right",
            closeOnClick: true,
          })
        ))

        setLoadingButton(false)
      }
    } catch (error) { }
    setLoadingButton(false)
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

          addresses = Newrename
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







  const data = useMemo(() => FilterData, [FilterData]);

  const TotalPrice = () => {

    let total = 0
    if (data) {
      data.map((i: any) => total += i.price)
    }
    return total

  }
  useEffect((): ReturnType<EffectCallback> => {


    const script = document.createElement("script");
    const scriptText = document.createTextNode(`

    
    
    $('#beforeTakhsisItem th').each(function(idx, el) {
        var check = !!$('#beforeTakhsisItem tbody tr').find('td:eq(' + idx + ')').filter(function() {
          return $.trim($(this).html()).length;
        }).length;
       
          
          $('#beforeTakhsisItem tr').find('td:eq(' + idx + '), th:eq(' + idx + ')').show();
          if (!check) {
              $('#beforeTakhsisItem tr').find('td:eq(' + idx + '), th:eq(' + idx + ')').hide();
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
      {
        Header: "#", accessor: "id", disableFilters: true

        , Footer: ''


      },
      { Header: ' نام کالا', accessor: 'product.name', disableFilters: true, Footer: '' },
      // {
      //   Header: 'کد کوتاژ', accessor: '  ', disableFilters: true, Cell: (rows: any) => {

      //     if (cottageCode && rows.row.original.productSupplyId !== null) {
      //       return (cottageCode.filter((i: any) => i.id === rows.row.original.productSupplyId).map((i: any) => i.cottageCode)[0])
      //     }
      //   }
      // },

      {
        Header: 'نوع پرداخت', accessor: 'payment', Footer: '', disableFilters: true, Cell: (rows: any) => {

          return (order.paymentMethodId ? PaymentStructureEnums.filter(
            (x) => x.id === order.paymentMethodId
          ).map((q) => q.name)
            : "نقدی")

        }
      },
      {
        Header: "قیمت پایه",
        accessor: "basePrice",
        Filter: FilterData.length > 3 ? SelectColumnFilter : "",
        filter: "multiple",
        Cell:(row:any)=>{
          return(formatter.format(row.row.original.basePrice))
        },
        Footer: ''
      },
      { Header: "وزن", accessor: "quantity", disableFilters: true,Cell: (rows: any) => {
        return formatter.format(rows.row.original.quantity);
      }, Footer: '' },
      {
        Header: "قیمت تمام شده",
        accessor: "priceIncludingTax",
        Cell: (rows: any) => {
          return formatter.format(rows.row.original.priceIncludingTax);
        },

        Footer: ''
        ,
        disableFilters: true,



      },
      {
        Header: "بازه پرداخت",
        accessor: "",
        Cell: (rows: any) => {

          if (rows.row.original.productSupplyConditionId) {
            return (condition.filter((x: any) => x.id === rows.row.original.id) ? condition.filter((x: any) => x.id === rows.row.original.id).map((y: any) => (y.paymentMethodId === 4 ? `${y.installmentOccureCount} قسط ${y.installmentPeriod} روزه` : ''))[0] : "")
          }
          else {
            return ('')
          }
        },
        disableFilters: true, Footer: ''
      },
      { Header: 'توضیحات', accessor: "comment", disableFilters: true, Footer: '' },
      // {
      //   Header: "شناسه یکتا",
      //   accessor: "receiverUniqueId",
      //   disableFilters: true,
      //   Footer: ''
      // },

      {
        Header: 'توضیحات', accessor: 'shippingDetail', disableFilters: true, Footer: '', Cell: (rows: any) => {

          return (


            <div className='d-flex justify-content-around '>
               {rows.row.original.addressId!==null && rows.row.original.addressId>0? 
               <div className="con-tooltip right" title='' >


              
                
                <p><CiLocationOn size={'1.5rem'} /></p>


                <div className='tooltipTakhsis'>

                  <p></p>
                  <p>{`نام تحویل گیرنده: ${rows.row.original.receiverName}`}</p>
                  <p>{` کدملی: ${rows.row.original.receiverNationalCode ? rows.row.original.receiverNationalCode : ''} `}</p>
                  <p>{` شماره هماهنگی: ${rows.row.original.receiverTel ? rows.row.original.receiverTel : ''} ${rows.row.original.receiverMobile ? rows.row.original.receiverMobile : ''} `}</p>
                  <p>{` کد پستی: ${rows.row.original.postalCode} `}</p>
                  <p>{`  محدودیت ارسال: ${rows.row.original.acceptableDeliveryMethodId ? DeliveryMethods.filter((i: any) => i.id === rows.row.original.acceptableDeliveryMethodId).map((i: any) => i.name)[0] : ''} `}</p>
                  <p>{`شناسه یکتا تحویل گیرنده : ${rows.row.original.receiverUniqueId ? rows.row.original.receiverUniqueId : ''} `}</p>
                  <p>{` آدرس: ${rows.row.original.fullAddress}`}</p>

                </div>


              </div>:''}
              <div className="con-tooltip right" title='' >


                <p><VscTasklist size={'1.5rem'} /></p>

                <div className='tooltipTakhsis'>
                  <p></p>
                  <p>{`  کد کوتاژ: ${cottageCode && rows.row.original.productSupplyId !== null ? cottageCode.filter((i: any) => i.id === rows.row.original.productSupplyId).map((i: any) => i.cottageCode)[0] : ''}`}</p>
                  <p>{`  شناسه عرضه: ${rows.row.original.productSupplyId}  `}</p>
                  <p>{`  نام عرضه: ${cottageCode && rows.row.original.productSupplyId !== null ? cottageCode.filter((i: any) => i.id === rows.row.original.productSupplyId).map((i: any) => i.name)[0] : ''}  `}</p>
                  <p>{` نام انبار: ${cottageCode && rows.row.original.productSupplyId !== null ? cottageCode.filter((i: any) => i.id === rows.row.original.productSupplyId).map((i: any) => i.wareHouse.wareHouseName)[0] : ''} `}</p>
                  {/* <p>{`   توضیحات: ${cottageCode && rows.row.original.productSupplyId !== null ? cottageCode.filter((i: any) => i.id === rows.row.original.productSupplyId).map((i: any) => i.comment)[0] : ''} `}</p> */}
                  <p></p>

                </div>

              </div>
            </div>)
        }
      },
      // {
      //   Header: 'اطلاعات عرضه', accessor: 'PSDetail', disableFilters: true, Cell: (rows: any) => {

      //     return (<div className="title-tip title-tip-right" aria-details={`
      //   نام تحویل گیرنده:${rows.row.original.receiverName}
      //   کدملی:${rows.row.original.receiverName} 
      //   شماره هماهنگی:${rows.row.original.receiverTel ? rows.row.original.receiverTel : ''} ${rows.row.original.receiverMobile ? rows.row.original.receiverMobile : ''} 
      //   کد پستی : ${rows.row.original.postalCode} 
      //   آدرس :${rows.row.original.fullAddress} 
      //   `} title='' >

      //       {rows.row.original.id}

      //     </div>)
      //   }
      // },
      {
        Header: "عملیات",
        accessor: "button",
        Footer: '',
        Cell: (rows: any) => {
          if (roles.includes(7) || roles.includes(5) || roles.includes(8)) {
            return (
              <div className="col-sm-12 col text-nowrap">
                <button
                  onClick={() => openModal(rows.row.original.id, rows.row.original.productSupplyId)}
                  className="btn btn-sm  btn-primary "
                  disabled={rows.row.original.shippingId !== null ? true : false}
                  hidden={rows.row.original.shippingId !== null && order.extId !== null ? true : false}
                >
                  صدور حواله
                </button>
                <button
                  className="btn btn-sm btn-info m-1  "
                  onClick={() => openInvoceModal([rows.row.original])}
                  hidden={order.reserved ? false : true}
                  disabled={rows.row.original.hasOrderDetailBasedInvoice ? true : false}
                >
                  {" "}
                  صدور صورتحساب
                </button>
                <button
                  className="btn btn-sm btn-warning m-1  "

                  onClick={() =>
                    syncButton(rows.row.original.orderId, rows.row.original.id)
                  }
                  hidden={rows.row.original.shippingId !== null && order.extId !== null ? false : true}
                  disabled={order.orderStatusId === 12 || loadingButton === true ? true : false}
                >

                  تطابق با بازارگاه
                  <ClipLoader
                    loading={loadingButton}
                    color="#fff"
                    size={15}
                  />
                </button>
                <button
                  disabled={
                    rows.row.original.shippingId !== null ? true : false
                  }
                  onClick={() => openModalDelet(rows.row.original.id)}
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
                </button>
                {rows.row.original.canSwitchParent === true ?

                  <button className="border-0 bg-transparent non-hover edit-btn m-1" title='تغییر پایه سفارش' onClick={() => openSwitchMode(rows.row.original.id)}><MdOutlinePublishedWithChanges size={20} /></button>
                  : ''}

              </div>
            );
          } else {
            return "";
          }
        },

        disableFilters: true,
      },
    ],
    [FilterData, paymentStatus, syncButton]
  );





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




  console.log(condition);


  const getPayments = () => {

    if (condition && condition.filter((item: any) => item.productSupplyConditionId !== null).length > 0) {
      return (condition.map((i: any) => ({ payments: i.paymentMethodId, installmentPeriod: i.installmentPeriod, installmentOccureCount: i.installmentOccureCount, installmentStartDate: i.installmentStartDate })))
    }
    else {




      return ([{ payments: order.paymentMethodId }])
    }
  }



  if (show && typeof details !== undefined) {
    return (
      <section className="mb-2 mt-2">
        <div className=" mb-1    rounded ">
          <div className="row p-3 itemA">
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
              <ShippingSelected
                modalIsOpen={modalIsOpen}
                closeModal={closeModal}
                orderDetailId={orderDetailId}
                contractIds={contractIds}
                Order={order}
                update={update}
              />
              <FinancialConfirmation
                id={order.id}
                modalIsOpen={IsOpen}
                closeModal={closeModalFinancialConfirmation}
              />
              {order.reserved ?
                <CraeteInvoceOrderDetail
                  modalIsOpen={modalOpenInvoice}
                  closeModal={ColseInvoceModal}
                  orderDetailId={orderDetailId}
                  Order={order}
                  defaultPaymentId={getPayments}
                  updateDetails={update}
                /> : ''}
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
                      <table id='beforeTakhsisItem' className="table responsive   table-striped  mt-2  mb-4">
                        <thead className="">
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
                            <th>توضیحات</th>
                            <th>عملیات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {condition
                            .filter((x: any) => x.addressId === null)
                            .map((item: any) => (
                              <tr key={item.id}>
                                <td aria-label="  #" >
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


                                  {formatter.format(item.basePrice)}

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
                                      (x) => x.id === item.paymentMethodId
                                    ).map((q) => q.name)
                                    : order.paymentMethodId ? PaymentStructureEnums.filter(
                                      (x) => x.id === order.paymentMethodId
                                    ).map((q) => q.name) : 'نقدی'}
                                </td>
                                <td
                                  aria-label="  بازه پرداخت"
                                  className=""
                                >
                                  {item.paymentMethodId && item.paymentMethodId === 4
                                    ? `${item.installmentOccureCount} قسط ${item.installmentPeriod} روزه`
                                    : ""}
                                </td>
                                <td aria-label="کوتاژ  " className="">
                                  {cottageCode.filter((i: any) => i.id === item.productSupplyId).map((i: any) => i.cottageCode)[0]}
                                </td>
                                <td aria-label=" تاریخ" className="">
                                  {new Date(item.createDate).toLocaleDateString(
                                    "fa-IR"
                                  )}
                                </td>
                                <td>{item.comment}</td>
                                <td
                                  aria-label="عملیات"
                                  className=" m-1"
                                >
                                  {!order.addressId ? (


                                    <div>
                                      <button className="border-0 bg-transparent non-hover edit-btn" data-toggle="tooltip"
                                        data-placement="top" data-title="ویرایش"
                                        onClick={() => openModalEdit(item)}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                          viewBox="0 0 24 24" fill="none"
                                          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="feather feather-edit-2">
                                          <path
                                            d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                        </svg>
                                      </button>
                                      <button
                                        hidden={order.addressId ? true : false}
                                        onClick={() =>
                                          openModalAddress(
                                            item
                                          )
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
                                        hidden={order.addressId ? true : false}
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
                                      </button>{" "}


                                      <button
                                        className='bg-info border-0'
                                        title='تفکیک تخصیص'
                                        onClick={() => openModalSplitSupply(item.id, item.quantity)}


                                      >
                                        <TbArrowsCross />


                                      </button>


                                    </div>
                                  ) : ''
                                  }
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

                    <TakhsisTable
                      columns={columns}
                      data={data}
                      getData={(rows: any) => setSelectedRows(rows)}
                      bulkJob={getBulkJob}
                    />

                    <SwitchOrderDetailParent order={order} currentDetailId={IdDelete} closeModal={CloseSwitchMode} modalIsOpen={inSwitchMode} update={update}  isUser={false}/>
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

                <div className=" text-end  p-2" style={{ textAlign: "left" }}>

                  {order.extId !== null && (order.shippingStatusId === 1 || order.shippingStatusId === 2) ? <button className="btn btn-info m-1" onClick={OpenMergModal}>ادغام سفارش</button> : ''}
                  {roles.includes(7) ||
                    roles.includes(5) ||
                    roles.includes(8) ? (
                    <button
                      className="btn-success m-1 btn "
                      hidden={order.conditionalPaymentTypeId || order.orderStatusId >= 8 ? false : true}
                      onClick={openModalFinancialConfirmation}
                    >
                      تایید مشروط
                    </button>
                  ) : null}
                  {roles.includes(7) ||
                    roles.includes(5) ||
                    roles.includes(8) ? (
                    <button
                      className="btn btn-info"
                      hidden={getOrder && order.reserved ? true : false}
                      onClick={() => openModelInvoice(order.id)}
                      disabled={order.hasOrderBaseInvoice ? true : false}
                    >
                      صدور صورتحساب سفارش
                    </button>
                  ) : (
                    ""
                  )}
                  {roles.includes(7) ||
                    roles.includes(5) ||
                    roles.includes(8) ? (
                    <button
                      className="btn btn-warning"
                      hidden={getOrder && order.reserved ? false : true}
                      onClick={() => OpenModalReserve()}
                    >
                      تغییر تاریخ سررسید رزرو
                    </button>
                  ) : (
                    ""
                  )}

                </div>
              </div>
              <EditOrderDetail modalIsOpen={inEditMode} closeModal={CloseModalEdit} companyId={order.companyId} item={item} update={update} />

              <InvoiceSetForOrder
                defaultPaymentId={getPayments}
                closeModal={CloseModalInvoice}
                isOpenInvoice={IsOpenInvoce}
                orderId={OrderId}
                update={update}
              />
              <MergeExternalOrderWithInteralOrder baseId={order.id} modalIsOpen={mergeModalOpen} closeModal={CloseMergModal} />

              <AddAdressCustomerForOrder
                isOpenAddress={isOpenAddress}
                closeModal={closeModalAddress}
                orderDetailId={orderDetailId}
                customer={order.customer}
                UpdateParent={update}
              />
              <ReserveOrder id={order.id} closeModal={closeModalinvoice} modalIsOpen={isReserveModal} expireDate={order.reservationExpireDate} />
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

              <SplitOrderDetails id={orderDetailId} modalIsOpen={IsOpenSplit} closeModal={CloseModalSplitSupply} companyId={order.companyId} maxQuantity={maxQuantity} update={update} />
            </div>
          )}
        </div>
      </section>
    );
  } else {
    return (
      <section className="mb-2 mt-2">
        <div className="     rounded ">
          <div className="row p-3 itemA">
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
export default OrderAddress;
