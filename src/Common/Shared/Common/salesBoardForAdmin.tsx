import { useEffect, useState, Fragment } from "react";

import {
  GetAllProductSupply,
  GetAllProductSupplyBord,
} from "../../../services/productSupplyService";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import { AddTOCart } from "../../../services/cartShoppingService";
import { MeasureUnitSample } from "../../Enums/MeasureUnitSample";
import { GetAllProductSupplyBordAdmin } from "../../../services/productSupplyService";

import ModalSubmit from "./modalSubmit";
import {
  GetGroupsForEntity,
  GetGroupWithCompany,
} from "../../../services/GroupService";
import ConditionSalesBordAdmin from "./conditionSalesBordAdmin";
import { Link } from "react-router-dom";
import { GetCompanyChild } from "../../../services/companiesService";
import ConditionSalesBordCustomer from "./conditionSalesBordCustomer";
import { RootState } from "../../../store";
import { RxDoubleArrowDown } from "react-icons/rx";
import { RxDoubleArrowUp } from "react-icons/rx";

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
  },
};

const SalesBoardForAdmin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const userRole = useSelector((state: RootState) => state.roles);
  const [Customerg, setCustomerg] = useState<any>([]);
  const [modalIsOpen, setIsOpen] = useState<any>(false);
  const [modalIsOpenCondition, setIsOpenCondition] = useState<boolean>(false);
  const [showMore, setShowMore] = useState(false);
  const [productSupply, setProductSupply] = useState<any>([]);
  const [productSupplyCondition, setProductSupplyCondition] = useState<any>([]);
  const [modalInfo, setModalInfo] = useState<any>([]);
  const [quantity, setquantity] = useState(0);
  const [name, setName] = useState<any>([]);
  const [productSupplyConditionId, setProductSupplyConditionId] =
    useState<any>(0);

  const GetGroupsOfCustomers = async () => {
    const response = await GetCompanyChild();
    let companies = response.data.result.companies;
    let arr: any = [];
    let finalArr: any = [];
    for (let i = 0; i < companies.length; i++) {
      const { data, status } = await GetGroupWithCompany(1, companies[i].id);

      if (data.result.groups.length > 0) {
        arr.push(data.result.groups);
      }
    }

    finalArr = Array.prototype.concat.apply([], arr);

    setCustomerg(finalArr);
  };
  const getProductSupply = async () => {
    try {
      const { data, status } = await GetAllProductSupplyBordAdmin();

      setProductSupply(data.result.productSupplies.values);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // GetGroupsOfCustomers()
    getProductSupply();
  }, []);

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
  const getModalInfo = async (id: number) => {
    const { data, status } = await GetAllProductSupply(id);
    setModalInfo(data.result.productSupply);
    setName(data.result.productSupply.product);
  };
  const handelClick = (id: number, productSupplyConditionId: any) => {
    setProductSupplyConditionId(productSupplyConditionId);
    openModal(id);
  };

  const openModal = (item: any) => {
    setProductSupplyCondition(item);

    setIsOpen(true);
  };
  const openModalCondition = (item: any, id: number) => {
    let idCondition = id;
    setProductSupplyConditionId(idCondition);

    setProductSupplyCondition(item);
    if (id === productSupplyConditionId) {
      setIsOpenCondition(!modalIsOpenCondition);
    }
  };
  const closeModal = () => {
    setIsOpen(false);
    setProductSupplyConditionId(null);
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

  // const submitHandler = async (e: any) => {
  //   setLoading(true);
  //   e.preventDefault();
  //   try {
  //     const { data, status } = await AddTOCart(addToCart);
  //     window.location.reload();
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   setLoading(false);
  // };

  let productCondistion: any;

  if (productSupply !== null) {
    productCondistion = productSupply.map(
      (item: any) => item.productSupplyConditions
    );
  }
  const groupReturn: any = (array: any) => {
    let newArray: any = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i].length > 0) {
        for (let j = 0; j < array[i].length; j++) {
          newArray.push(array[i][j]);
        }
        for (let c = 0; c < newArray.length; c++) {
          [...newArray][c].gpName = Customerg.filter(
            (item: any) => item.id === newArray[c].customerGroupId
          ).map((item: any) => {
            return `${item.name}`;
          });
        }
      }
    }
    return newArray;
  };

  if (productSupply !== null) {
    return (
      <div className="">
        <div className=" statbox widget-content widget-content-area">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2">
              <h4 className="text-center" style={{ color: "#027f00" }}>
                تابلوی عرضه
              </h4>
            </div>
          </div>
          <div className="   ">
            <div className=" w-100 " style={{ overflowX: "auto" }}>
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Selected Option"
                ariaHideApp={false}
              ></Modal>

              <table className="table mb-4 ">
                <thead>
                  <tr>
                    <th className="text-center">شناسه</th>
                    <th className="text-center">شماره کوتاژ</th>
                    <th className="text-center">محصول</th>
                    <th className="text-center">قیمت</th>
                    <th className="text-center">واحد</th>
                    <th className="text-center">مقدار عرضه</th>
                    <th className="text-center">توضیحات</th>
                    <th className="text-center">نام شرکت</th>
                    <th className="text-center">تاریخ شروع</th>
                    <th className="text-center">تاریخ پایان</th>

                    <th className="text-center"> درخواستی</th>
                    <th className="text-center"> مانده</th>
                    <th className="text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {productSupply &&
                    productSupply
                      .slice(0, showMore ? productSupply.length : 6)
                      .map((item: any, index: number) => (
                        <Fragment key={index + "_frag"}>
                          <tr key={item.id} className="SalesBoard">
                            <td data-th="#" className="text-center">
                              {item.id}
                            </td>
                            <td data-th="شماره کوتاژ" className="text-center">
                              {item.cottageCode}
                            </td>
                            <td data-th="محصول" className="text-center">
                              {item.product.name}
                            </td>
                            <td data-th="قیمت" className="text-center">
                              {formatter.format(item.price)}
                            </td>
                            <td data-th="واحد" className="text-center">
                              {MeasureUnitSample.filter(
                                (e) => e.id === item.product.measureUnit
                              ).map((e) => e.name)}
                            </td>
                            <td data-th="مقدار عرضه" className="text-center">
                              {formatter2.format(item.quantity)}
                            </td>
                            <td data-th="توضیحات" className="text-center">
                              {item.comment.substring(0, 40)}{" "}
                              {item.comment ? "..." : "--"}{" "}
                            </td>
                            <td data-th="نام شرکت" className="text-center">
                              {item.companyName}
                            </td>
                            <td data-th="تاریخ شروع" className="text-center">
                              {new Date(item.createDate).toLocaleDateString(
                                "fa-IR",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                }
                              )}
                            </td>
                            <td data-th="تاریخ پایان" className="text-center">
                              {new Date(item.endDate).toLocaleDateString(
                                "fa-IR",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                }
                              )}
                            </td>
                            <td data-th="درخواستی" className="text-center">
                              {formatter2.format(item.orderedQuantity)}
                            </td>
                            <td data-th="مانده " className="text-center">
                              {formatter2.format(item.remainedQuantity)}
                            </td>
                            <td data-th=" عملیات" className="text-center">
                              {item.productSupplyConditions.length === 0 ? (
                                <div></div>
                              ) : (
                                <button
                                  className="btn btn-success"
                                  disabled={userRole.includes(1) ? true : false}
                                  onClick={() =>
                                    openModalCondition(item, item.id)
                                  }
                                >
                                  شرایط پرداخت
                                </button>
                              )}
                            </td>
                          </tr>

                          {modalIsOpenCondition === true &&
                          productSupplyConditionId === item.id ? (
                            <tr>
                              <td colSpan={17} className="fadeInt   m-3    ">
                                <ConditionSalesBordAdmin
                                  productSupplyConditions={
                                    productSupplyCondition
                                  }
                                  handelClick={handelClick}
                                />
                              </td>
                            </tr>
                          ) : null}
                        </Fragment>
                      ))}
                </tbody>
              </table>

              {productSupply.length <= 5 ? null : (
                <div className={!showMore ? "blurShowMore" : ""}>
                  <div className={!showMore ? "showMore" : ""}> </div>
                  <Link
                    to="#"
                    className=" bold d-block text-buttonColor   cursor-pointer m-auto text-center  text-m"
                    onClick={() => setShowMore(!showMore)}
                    style={{ fontSize: "medium", fontWeight: "bold" }}
                  >
                    {showMore ? (
                      <RxDoubleArrowUp size="2rem" />
                    ) : (
                      <RxDoubleArrowDown size="2rem" />
                    )}
                  </Link>{" "}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="m-5 d-flex justify-content-center">
        <table className="table">
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
export default SalesBoardForAdmin;
