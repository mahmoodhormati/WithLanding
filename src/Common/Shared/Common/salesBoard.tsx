import { useEffect, useState, Fragment, useRef, useCallback } from "react";
import { Button } from "react-bootstrap";
import {
  GetAllProductSupply,
  GetAllProductSupplyBord,
  GetProductSupply,
} from "../../../services/productSupplyService";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import { AddTOCart } from "../../../services/cartShoppingService";
import { MeasureUnitSample } from "../../Enums/MeasureUnitSample";

import ModalSubmit from "./modalSubmit";
import { GetGroupById } from "../../../services/GroupService";
import ConditionSalesBordCustomer from "./conditionSalesBordCustomer";
import { Link } from "react-router-dom";
import { RootState } from "../../../store";
import { RxDoubleArrowDown } from "react-icons/rx";
import { RxDoubleArrowUp } from "react-icons/rx";
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
  setloading: any,update:any
}

const SalesBoardForCustomer: React.FC<Props> = ({ setloading,update }) => {
  const user = useSelector((state: RootState) => state.user);
  const userRole = useSelector((state: RootState) => state.roles);
  const observer: any = useRef()
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpenCondition, setIsOpenCondition] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [productSupplyCondition, setProductSupplyCondition] = useState<any>([]);
  const [productSupply, setProductSupply] = useState([]);
  const [modalInfo, setModalInfo] = useState([]);
  const [quantity, setquantity] = useState(0);
  const [name, setName] = useState([]);
  const [groupInfo, setGroupInfo] = useState([]);
  const [productSupplyConditionId, setProductSupplyConditionId] = useState(0);
  const [PageNumber, setPageNumber] = useState(0)
  const [PageSize, setPageSize] = useState(5)
  const [totalCount, setTotalCount] = useState(0);


  useEffect(() => {
   
    getProductSupply();
  
}, [PageSize,user]);


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

  const getProductSupply = async () => {


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
      const { data, status } = await GetProductSupply(config);
      setProductSupply(data.result.productSupplies.values);
      setTotalCount(data.result.productSupplies.totalCount)

      setloading(false);
    } catch (error) {
      console.log(error);
    }
  };

  

  let formatter = new Intl.NumberFormat("fa-IR", {
    style: "currency",
    currency: "IRR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  let formatter2 = new Intl.NumberFormat("fa-IR", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  const openModal = (id: any) => {
    setProductSupplyCondition(id);

    setIsOpen(true);
  };
  const openModalCondition = (item: any, id: number) => {
    setProductSupplyCondition(item);
    setProductSupplyConditionId(id);
    if (id === productSupplyConditionId) {
      setIsOpenCondition(!modalIsOpenCondition);
    }
  };
  const closeModal = () => {
    setIsOpen(false);
    // setProductSupplyConditionId(null)
  };
  const closeModalCobdition = () => {
    setIsOpenCondition(false);
  };
  const handelClick = (id: any, productSupplyConditionId: number) => {
    setProductSupplyConditionId(productSupplyConditionId);
    openModal(id);
  };

  const addToCart = {
    customerId: user.id,
    productId:
      productSupplyCondition.length !== 0
        ? productSupplyCondition.product.id
        : 0,
    measureUnitId: productSupplyCondition.measureUnitId,
    quantity,
    productSupplyId: productSupplyCondition.id,
    productSupplyConditionId:
      productSupplyConditionId === 0 ? null : productSupplyConditionId,
  };

  const submitHandler = async (e: any) => {
    setLoading(true);
    e.preventDefault();
    try {
      const { data, status } = await AddTOCart(addToCart);
      closeModal()
      update()
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  if (productSupply) {
    return (
      <div className="">
        <div className=" ">
        
          <div className=" tab-content  ">
            <div className="tab-pane fade show active">
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Selected Option"
                ariaHideApp={false}
              >
                <ModalSubmit
                  loading={loading}
                  productSupplyConditionId={productSupplyConditionId}
                  formatter={formatter}
                  modalInfo={productSupplyCondition}
                  closeModal={closeModal}
                  quantity={quantity}
                  submitHandler={submitHandler}
                  setquantity={setquantity}
                />
              </Modal>
              <div className="row mb-30-none justify-content-center">
                {productSupply &&
                  productSupply.map((item: any, index: number) => {
                    if(productSupply.length===index+1){
                    
                    return(
                      <div ref={lastDataRef} key={index} className="col-sm-10  col-md-10 m-1">
                        <div className="  auction-item-2  m-auto  ">
                          <div className="auction-content">
                            <div className=" row bid-area ">
                            <div
                                  className={
                                    modalIsOpenCondition === true &&
                                    productSupplyConditionId === item.id
                                      ? "col-md-10"
                                      : "col-lg-10"
                                  }
                                >
                                  <div className="row ">
                                  <div className="col-lg-4  p-2" title={item.companyName}>
                                      
                                      <b> عرضه کننده :</b>  {item.companyName && item.companyName.length>23 ?item.companyName.substring(0, 20):item.companyName}{" "}
                                        {item.companyName && item.companyName.length>23 ? "..." : ""}
                                      </div>
                                   
                                    <div
                                      
                                      className="col-lg-5 col-md-4  p-2"
                                    >
                                      
                                      <b>شناسه عرضه : </b>{" "}
                                      {item.name}
                                    </div>
                                    <div className="col-lg-3  p-2" > 
                                      {" "}
                                      <b>شماره عرضه  :</b> {" "}
                                      {item.id}
                                     
                                    </div>
                                    <div className="col-lg-4  p-2">
                                     
                                      <b>محصول : </b>{" "}
                                       {item.productSupplyConditions.length === 0 ?`${item.product.name} فروش نقدی`:item.product.name}
                                      
                                    </div>
                                    <div className=" col-lg-5  p-2 ">
                                     
                                      <b>مقدار عرضه :</b> {" "}
                                      {formatter2.format(item.quantity) } {MeasureUnitSample.filter(
                                        (e) => e.id === item.product.measureUnitId
                                      ).map((e) => e.name)}
                                      {/* {" ("}
                                      باقی مانده :{formatter2.format(item.remainedQuantity)}
                                      {" )"} */}
                                    </div>
                                    <div className="col-lg-3  p-2">
                                      
                                      <b>قیمت :</b> {`${formatter.format(item.price) } `}
                                    </div>
                                    
                                    <div className="col-lg-4  p-2">
                                      
                                      <b>شماره کوتاژ :</b> {item.cottageCode}
                                    </div>
                                    <div className="col-lg-5 p-2">
                                    
                                      <b>تاریخ شروع :</b> {" "}
                                      {new Date(
                                        item.createDate
                                      ).toLocaleDateString("fa-IR", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                      })}
                                    </div>
                                    <div className="col-lg-3  p-2">
                                     
                                      <b>تاریخ پایان :</b> 
                                      {` ${new Date(item.endDate).toLocaleDateString(
                                        "fa-IR",
                                        {
                                          year: "numeric",
                                          month: "2-digit",
                                          day: "2-digit",
                                        }
                                        
                                      )}`}
                                    </div>
  
                                    <div className="col-lg-12  p-2"  title={item.comment}>
                                      {" "}
                                      <b>توضیحات :</b> {" "}
                                      {item.comment?item.comment.substring(0, 110):''}{" "}
                                      {item.comment && item.comment.length>110 ? "..." : ""}
                                     
                                    </div>
                                  </div>
                                </div>
                                <div className=" text-center col-lg-2 col-md-12 col-sm-12  m-auto button-auction">
                                {" "}
                                {item.productSupplyConditions.length === 0 ? (
                                  <button
                                    className="btn btn-success p-1 m-1"
                                    disabled={userRole[0] === 1 ? true : false}
                                    onClick={() => openModal(item)}
                                  >
                                     افزودن به سبد 
                                  </button>
                                ) : (
                                  <button
                                  className="btn btn-success border-0 p-1 m-1"
                                    disabled={userRole[0] === 1 ? true : false}
                                    onClick={() =>
                                      openModalCondition(item, item.id)
                                    }
                                  > شرایط پرداخت
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        {modalIsOpenCondition === true &&
                        productSupplyConditionId === item.id ? (
                          <div className="client-table-condition">
                            <ConditionSalesBordCustomer
                              closeModal={closeModalCobdition}
                              productSupplyConditions={productSupplyCondition}
                              handelClick={handelClick}
                            />
                          </div>
                        ) : null}
                      </div>
                    )
                  }

                    else{
                      return(
                        <div  key={index} className="col-sm-10  col-md-10 m-1">
                          <div className="  auction-item-2  m-auto  ">
                            <div className="auction-content">
                              <div className=" row bid-area ">
                                <div
                                  className={
                                    modalIsOpenCondition === true &&
                                    productSupplyConditionId === item.id
                                      ? "col-md-10"
                                      : "col-lg-10"
                                  }
                                >
                                  <div className="row ">
                                  <div className="col-lg-4  p-2" title={item.companyName}>
                                      
                                      <b> عرضه کننده :</b>  {item.companyName && item.companyName.length>23 ?item.companyName.substring(0, 20):item.companyName}{" "}
                                        {item.companyName && item.companyName.length>23 ? "..." : ""}
                                      </div>
                                   
                                    <div
                                      
                                      className="col-lg-5 col-md-4  p-2"
                                    >
                                      
                                      <b>شناسه عرضه : </b>{" "}
                                      {item.name}
                                    </div>
                                    <div className="col-lg-3  p-2" >
                                      {" "}
                                      <b>شماره عرضه  :</b> {" "}
                                      {item.id}
                                     
                                    </div>
                                    <div className="col-lg-4  p-2">
                                     
                                      <b>محصول : </b>{" "}
                                       {item.productSupplyConditions.length === 0 ?`${item.product.name} فروش نقدی`:item.product.name}
                                      
                                    </div>
                                    <div className=" col-lg-5  p-2 ">
                                     
                                      <b>مقدار عرضه :</b> {" "}
                                      {formatter2.format(item.quantity) } {MeasureUnitSample.filter(
                                        (e) => e.id === item.product.measureUnitId
                                      ).map((e) => e.name)}
                                      {/* {" ("}
                                      باقی مانده :{formatter2.format(item.remainedQuantity)}
                                      {" )"} */}
                                    </div>
                                    <div className="col-lg-3  p-2">
                                      
                                      <b>قیمت :</b> {`${formatter.format(item.price) } `}
                                    </div>
                                    
                                    <div className="col-lg-4  p-2">
                                      
                                      <b>شماره کوتاژ :</b> {item.cottageCode}
                                    </div>
                                    <div className="col-lg-5 p-2">
                                    
                                      <b>تاریخ شروع :</b> {" "}
                                      {new Date(
                                        item.createDate
                                      ).toLocaleDateString("fa-IR", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                      })}
                                    </div>
                                    <div className="col-lg-3  p-2">
                                     
                                      <b>تاریخ پایان :</b> 
                                      {` ${new Date(item.endDate).toLocaleDateString(
                                        "fa-IR",
                                        {
                                          year: "numeric",
                                          month: "2-digit",
                                          day: "2-digit",
                                        }
                                        
                                      )}`}
                                    </div>
  
                                    <div className="col-lg-12  p-2"  title={item.comment}>
                                      {" "}
                                      <b>توضیحات :</b> {" "}
                                      {item.comment?item.comment.substring(0, 110):''}{" "}
                                      {item.comment && item.comment.length>110 ? "..." : ""}
                                     
                                    </div>
                                  </div>
                                </div>
                                <div className=" text-center col-lg-2 col-md-12 col-sm-12  m-auto button-auction">
                                  {" "}
                                  {item.productSupplyConditions.length === 0 ? (
                                    <button
                                      className="btn btn-success p-1 m-1"
                                      disabled={userRole[0] === 1 ? true : false}
                                      onClick={() => openModal(item)}
                                    >
                                       افزودن به سبد 
                                    </button>
                                  ) : (
                                    <button
                                    className="btn btn-success border-0 p-1 m-1"
                                      disabled={userRole[0] === 1 ? true : false}
                                      onClick={() =>
                                        openModalCondition(item, item.id)
                                      }
                                    > شرایط پرداخت
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          {modalIsOpenCondition === true &&
                          productSupplyConditionId === item.id ? (
                            <div className="client-table-condition">
                              <ConditionSalesBordCustomer
                                closeModal={closeModalCobdition}
                                productSupplyConditions={productSupplyCondition}
                                handelClick={handelClick}
                              />
                            </div>
                          ) : null}
                        </div>
                      )
                    }
                    
                    
                    })}
              </div>

           
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="m-5 d-flex justify-content-center ">
        <table className="table bg-light">
          <thead>
            <tr>
              <th className="text-center">تابلوی عرضه</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-center">
                <h5>در حال حاضر هیچ عرضه فعالی جهت نمایش وجود ندارد</h5>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
};
export default SalesBoardForCustomer;
