import { useState, useRef, useEffect, Fragment } from "react";
import { addOrder } from "../../../services/orderService";
import Select from "react-select";
import { NavLink, useNavigate } from "react-router-dom";
import { MeasureUnitSample } from "../../../Common/Enums/MeasureUnitSample";
import { GetAllProducts, GetProducts, GetProductsWithCompanyForCombos } from "../../../services/productService";
import { PaymentStatusEnums } from "../../../Common/Enums/PaymentStatus";
import { GetAllUsers, GetDataWithSearch } from "../../../services/userService";
import { PaymentStructureEnums } from "../../../Common/Enums/PaymentStructureEnums";
import { GetAllOrganisation } from "../../../services/organisationService";
import QueryString from "qs";
import { toast } from "react-toastify";
import { OrderStatus } from "../../../Common/Enums/OrderStatusEnums";
import { ClipLoader, FadeLoader } from "react-spinners";
import { Field, Form, Formik } from "formik";
import {
  validateRequired, 
  validatNumber,
} from "../../../Utils/validitionParams";
import { GetCompanyChild } from "../../../services/companiesService";
import { GetDataWithSearchSupply } from "../../../services/supplyService";
import { GetAllProductWithSearch } from "../../../services/productSupplyService";
import Modal from "react-modal";
import { GetGroupWithCompany } from "../../../services/GroupService";
import { useSelector } from 'react-redux';
import { RootState } from "../../../store";
import ConditionForOrder from "../../ProductSupply/Child/ConditionForOrder/Component/ConditionForOrder";

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
const AddOrder: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState(0);
  const [orderStatusId, setOrderStatusId] = useState(0);
  const [comment, setComment] = useState("");
  const [paymentStatusId, setPaymentStatusId] = useState(0);
  const [paymentMethodId, setPaymentMethodId] = useState(0);
  const [productId, setProductId] = useState(0);
  const [measureUnitId, setMeasureUnitId] = useState<any>(0);
  const [quantity, setQuantity] = useState(0);
  const [quantityCondition, setQuantityConditio] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setIsmodalIsOpen] = useState(false);
  const [withSupply, setWithSupply] = useState(false);

  const [productSupply, setProductSupply] = useState<any>([]);
  const [productSupplyId, setProductSupplyId] = useState(0);
  const [statusCondition, setStatusCondition] = useState(true);
  const [addCondition, setAddCondition] = useState(false);

  const [productBasePrice, setProductBasePrice] = useState(0);
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  let [companyId, SetcompanyId] = useState();
  let [companyName, SetCompanyName] = useState();
  const [userCompanies, setUserCompanies] = useState<any>([]);
  const Navigate = useNavigate();
  const [checked, setChecked] = useState({ selectedValue: 0 });
  const [condition, setCondition] = useState<any>([]);
  const [customerg, setCustomerg] = useState([]);
  let color = "#0c4088";
  const companies = useSelector((state: RootState) => state.companies)
  const getCompanies = async () => {
    try {
      const { data, status } = await GetCompanyChild();
      setUserCompanies(data.result.companies);
      SetcompanyId(data.result.companies[0].id);
      SetCompanyName(data.result.companies[0].name);
    } catch (error) { }
  };

  useEffect(() => {
    getCompanies();
    getUser();
    getOrganizations();


  }, []);

  useEffect(() => {
    getProductSupply();
    getProdcutForCombo()

  }, [companyId]);

  const getProductSupply = async () => {
    let config = {
      headers: { "Content-Type": "application/json" },
      params: {
        PageNumber: 0,
        PageSize: 100000000,
        IsAdmin: true,
        CompanyId: companyId ? companyId : companies[0].id
      },
    };
    try {
      const { data, status } = await GetAllProductWithSearch(config);
      setProductSupply(data.result.productSupplies.values);
      if (productSupplyId !== 0) {
        setCondition(data.result.productSupplies.values.find((i: any) => i.id === productSupplyId).productSupplyConditions)

      }
    } catch (error) {
      console.log(error);
    }
  };
  const getUser = async () => {
    let configs = {
      headers: { "Content-Type": "application/json" },
      params: {
        RoleIds: 2,
        PageNumber: 0,
        PageSize: 100000000,
      },
      paramsSerializer: (params: any) => {
        return QueryString.stringify(params);
      },
    };
    try {
      const { data, status } = await GetDataWithSearch(configs);

      if (status === 200) {
        setUsers(data.result.users.values);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getOrganizations = async () => {
    try {
      const { data, status } = await GetAllOrganisation();
      if (status === 200) {
        setOrganizations(data.result.organizationLists.values);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const mergeNames = () => {
    let newUsers = users.map((o: any) => ({ ...o, Oname: null }));

    for (let i = 0; i < newUsers.length; i++) {
      if (newUsers[i].organizationId > 0) {
        newUsers[i].Oname = organizations
          .filter((item: any) => item.id === newUsers[i].organizationId)
          .map((item: any) => item.name)[0];
      }
    }
    return newUsers;
  };
  let data = mergeNames();

  const customerComb = () => {
    return data.map((item) => ({
      value: item.id,
      label:
        (item.firstName ? item.firstName : "") +
        ` ` +
        (item.lastName ? item.lastName : "") +
        ` ` +
        (item.Oname ? item.Oname : ""),
    }));
  };



  
  

  const navigate = useNavigate();
  const SubmitOrder = async () => {

    let order = {
      customerId,
      orderStatusId: 1,
      paymentStatusId:1,
      paymentMethodId,
      comment:comment,
      createDate: new Date(),
      productId,
      measureUnitId: measureUnitId ,
      quantity: Number(quantity),
      productSupplyId: productSupplyId !== 0 ? productSupplyId : null,
      productSupplyConditionId: checked.selectedValue
        ? checked.selectedValue
        : null,
      productBasePrice: Number(productBasePrice),
      companyId,
      companyName,
    };

    
    setLoading(true);
    try {
      const { data, status } = await addOrder(order);
      if (data.success === true) {
        toast.success(" سفارش با موفقیت ثب شد", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
        navigate(`/admin/orderDetail/${data.result.orderId}`);
      }

      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false)

    }
    setLoading(false)

  };
  const Mesures: any = () => {
    if (measureUnitId && measureUnitId > 0) {
      return MeasureUnitSample.filter((i) => i.id === measureUnitId).map(
        (data) => data.name
      );
    } else {
      return null;
    }
  };

  const paymentM = () => {
    return PaymentStructureEnums.map((data) => ({
      label: data.name,
      value: data.id,
    }));
  };

  const paymentSupplay = () => {
    let productS: any = [];
    if (productSupplyId !== 0) {
      let supplyP = productSupply
        .filter((i: any) => i.id === productSupplyId)
        .map((item: any) => item.productSupplyConditions);

      productS = supplyP[0]
        .filter((i: any) => i.id === checked.selectedValue)
        .map((i: any) => i);

      if (productS.length !== 0) {
        const { price } = productS[0]
        setProductBasePrice(price)
        let paymentMethod = PaymentStructureEnums.filter(
          (i: any) => i.id === productS[0].paymentMethodId
        ).map((data) => ({ label: data.name, value: data.id }));
        setPaymentMethodId(paymentMethod[0].value);
        return PaymentStructureEnums.filter(
          (i: any) => i.id === productS[0].paymentMethodId
        ).map((data) => ({ label: data.name, value: data.id }));
      }
    } else {
      return null;
    }
  };
  const getProdcutForCombo = async () => {
    if (companyId) {
      try {
        const { data, status } = await GetProductsWithCompanyForCombos(companyId);
        if (status === 200) {
          setProducts(data.result.products.values);
        }
      } catch (error) {
        console.log(error);
      }
    }
    else {
      try {
        const { data, status } = await GetProductsWithCompanyForCombos(userCompanies[0].id);
        if (status === 200) {
          setProducts(data.result.products.values);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const GetCustomerGroup = async () => {
    const response = await GetCompanyChild();
    let companies = response.data.result.companies;
    let arr = [];
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

  useEffect(() => {
    GetCustomerGroup();
    getProdcutForCombo();
  }, []);

  const productCombo: any = () => {
    if (products) {
      return products.map((data: any) => ({
        label: data.name,
        value: data.id,
      }));
    } else {
      return [];
    }


  };
  const productComboSupply: any = () => {
    if (productSupplyId !== 0) {

      let supplyP = productSupply.filter((i: any) => i.id === productSupplyId).map((item: any) => item);
      const { measureUnitId, price, product } = supplyP[0]
      let productP = {
        label: product.name,
        value: product.id,
      }
      setProductId(productP ? productP.value : 0);
      setMeasureUnitId(measureUnitId)
      setProductBasePrice(price)
      return products.filter((i: any) => i.id === supplyP[0].productId).map((data: any) => ({
        label: data.name,
        value: data.id,
      }));
    } else {
      return null;
    }


  };

  const prodcutSupplyCombo: any = () => {
    if (productSupply) {
      return productSupply.map((data: any) => ({
        label: data.name + "#" + data.id,
        value: data.id,
      }));
    } else {
      return null;
    }
  };
  const PaymentStatus = () => {
    return PaymentStatusEnums.map((data: any) => ({
      label: data.name,
      value: data.id,
    }));
  };
  const statusOrder = () => {
    return OrderStatus.filter((i:any)=>i.id===1).map((data: any) => ({
      label: data.name,
      value: data.id,
    }));
  };
  const companys = () => {
    return userCompanies.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
  };
  const CustomerG = () => {
    return customerg.map((data: any) => ({
      label: data.name,
      value: data.id,
    }));
  };
  const PaymentId = (id: any) => {
    return PaymentStructureEnums.filter((item: any) => item.id === id).map(
      (data: any) => data.name
    );
  };
  let defaultValue: any = companys()[0];
  var formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  const disabledBtn = (productSupplyId: any) => {
    let s: boolean = true;
    let supply = productSupply.find((i: any) => i.id === productSupplyId);

    if (supply === undefined) {
      setStatusCondition(true);
    } else {
      productSupply.find((i: any) => i.id === productSupplyId)
        .productSupplyConditions.length === 0
        ? (s = true)
        : (s = false);
      setStatusCondition(s);

      productSupply.find((i: any) => i.id === productSupplyId)
        .productSupplyConditions.length !== 0
        ? setCondition(
          productSupply.find((i: any) => i.id === productSupplyId)
            .productSupplyConditions
        )
        : setCondition(null);
    }
    setStatusCondition(s);
  };
  const openModal = () => {
    setIsmodalIsOpen(true)
    if (productSupplyId !== 0) {
      let supply = productSupply.find((i: any) => i.id === productSupplyId);
      const { quantity } = supply

      setQuantityConditio(quantity)
    }
  }
  const closeModal = () => {
    setIsmodalIsOpen(false);
  };
  const CheckedHadnler = (conditionId: any) => {
    setChecked({ selectedValue: conditionId });
  };
  const backTooTable = () => {
    setAddCondition(false)
    getProductSupply()
  }

  return (
    <div className="user-progress">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Selected Option"
        ariaHideApp={false}
      >
        {loading === true ? (
          <div>
            <p>ثبت تغییرات ...</p>
            <FadeLoader loading={loading} color={color} />
          </div>
        ) : (
          addCondition === true ? <ConditionForOrder getSupply={getProductSupply} setConditionS={backTooTable} id={productSupplyId} quantity={quantityCondition} />
            :
            condition && condition === null ? (<div>
              <div className='text-center mt-5'>
                <h6>اطلاعاتی جهت نمایش موجود نیست</h6>
                <button
                  className="col-6 btn-sm btn-primary"
                  onClick={() => {
                    setAddCondition(true);
                  }}>
                  افزودن شرط{" "}
                </button>
              </div>

            </div>) :
              (<div className=" rounded  " style={{ border: " 1px solid #bfc9d4" }}>

                <div className="table-responsive p-2">
                  <table className=" table-bordered table-hover table-striped  mt-2  mb-4">
                    <thead>
                      <tr style={{ fontSize: "10px" }}>
                        <th style={{ fontSize: "10px" }} className="text-center">
                          ردیف
                        </th>
                        <th style={{ fontSize: "10px" }} className="text-center">
                          نوع پرداخت
                        </th>
                        <th style={{ fontSize: "10px" }} className="text-center">
                          تعداد اقساط
                        </th>
                        <th style={{ fontSize: "10px" }} className="text-center">
                          بازه
                        </th>
                        <th style={{ fontSize: "10px" }} className="text-center">
                          فی
                        </th>

                        <th style={{ fontSize: "10px" }} className="text-center">
                          گروه مشتریان
                        </th>
                        <th style={{ fontSize: "10px" }} className="text-center">
                          فعال
                        </th>
                        <th style={{ fontSize: "10px" }} className="text-center">
                          انتخاب
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {condition &&
                        condition.map((contact: any, index: number) => (
                          <tr className="text-center">
                            <td
                              style={{
                                backgroundColor:
                                  contact.special === true
                                    ? "lightgreen"
                                    : "transparent",
                              }}
                            >
                              {index + 1}
                            </td>

                            <td
                              style={{
                                backgroundColor:
                                  contact.special === true
                                    ? "lightgreen"
                                    : "transparent",
                              }}
                            >
                              <p className="mb-0">
                                {PaymentId(contact.paymentMethodId)}
                              </p>
                            </td>
                            <td
                              style={{
                                backgroundColor:
                                  contact.special === true
                                    ? "lightgreen"
                                    : "transparent",
                              }}
                            >
                              {contact.paymentMethodId === 4
                                ? contact.installmentOccureCount
                                : "-"}
                            </td>
                            <td
                              style={{
                                backgroundColor:
                                  contact.special === true
                                    ? "lightgreen"
                                    : "transparent",
                              }}
                            >
                              {contact.paymentMethodId === 4
                                ? contact.installmentPeriod
                                : "-"}
                            </td>
                            <td
                              style={{
                                backgroundColor:
                                  contact.special === true
                                    ? "lightgreen"
                                    : "transparent",
                              }}
                            >
                              {contact.price}
                            </td>
                            <td
                              style={{
                                backgroundColor:
                                  contact.special === true
                                    ? "lightgreen"
                                    : "transparent",
                              }}
                            >
                              {contact.customerGroupId
                                ? CustomerG()
                                  .filter(
                                    (i) => i.value === contact.customerGroupId
                                  )
                                  .map((contacts) => contacts.label)
                                : "عمومی"}
                            </td>
                            <td
                              style={{
                                backgroundColor:
                                  contact.special === true
                                    ? "lightgreen"
                                    : "transparent",
                              }}
                            >
                              {contact.active === true ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="21"
                                  height="21"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="feather feather-check  "
                                  style={{ color: "green" }}
                                >
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  data-dismiss="alert"
                                  width="21"
                                  height="21"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="feather feather-x  danger "
                                  style={{ color: "red" }}
                                >
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              )}
                            </td>
                            <td
                              style={{
                                backgroundColor:
                                  contact.special === true
                                    ? "lightgreen"
                                    : "transparent",
                              }}
                            >
                              <input
                                type="radio"
                                name={contact.id}
                                checked={
                                  checked.selectedValue === contact.id
                                    ? true
                                    : false
                                }
                                value={contact.id}
                                id={contact.id}
                                onChange={(e) => CheckedHadnler(contact.id)}
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>

                  <div className="row  m-auto ">
                    <button
                      className="col-6 btn-sm btn-success"
                      onClick={() => {
                        setIsmodalIsOpen(false);
                      }}
                    >
                      ثبت{" "}
                    </button>
                    <button
                      className="col-6 btn-sm btn-primary"
                      onClick={() => {
                        setAddCondition(true);
                      }}
                    >
                      افزودن شرط{" "}
                    </button>
                  </div>

                </div>


              </div>)
        )}
      </Modal>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2">
          <h5>تعریف سفارش </h5>
          <p>در این بخش می توانید سفارش جدید تعریف کنید</p>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2">
          <input
            type="checkbox"
            checked={withSupply}
            onClick={(e: any) => {
              setWithSupply(!withSupply);
            }}
          />{" "}
          <label>ثبت سفارش از عرضه</label>
        </div>
      </div>
      <div className="row d-flex justify-content-center ">
        <div className="col-lg-8 col-xs-12 m-2">
          <Formik
            initialValues={{
              customerId,
              orderStatusId: Number(orderStatusId),
              paymentStatusId,
              paymentMethodId,
              comment,
              createDate: new Date(),
              productId,
              measureUnitId: measureUnitId ,
              quantity: Number(quantity),
              productSupplyId,
              productSupplyConditionId: null,
              productBasePrice: Number(productBasePrice),
              companyId,
              companyName,
            }}
            enableReinitialize={true}
            onSubmit={(values) => {
              // same shape as initial values
              
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
              <Form className="">
                <div className="n-chk d-flex  mb-4"></div>

                <div className="form-group mb-4 textOnInput ">
                  <div className="form-row">
                    {userCompanies.length > 1 ? (
                      <div className="col-12 mb-4  textOnInput">
                        <label> شرکت</label>
                        <Select
                          menuShouldScrollIntoView={false}
                          defaultValue={defaultValue}
                          placeholder="نام شرکت"
                          options={companys()}
                          key={defaultValue}
                          isClearable={true}
                          onChange={(e) => {
                            SetcompanyId(e.value);
                            SetCompanyName(e.label);
                            setPaymentMethodId(0)
                            
                            setProductBasePrice(0)
                            setProductSupplyId(0)
                            setStatusCondition(false)
                          }}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    <div
                      className={
                        withSupply
                          ? "col-lg-4 col-md-6 col-sm-11  mb-4  "
                          : "col-lg-6 col-md-6 col-sm-11  mb-4 "
                      }

                    >
                      <label>مشتری</label>

                      <Select
                        menuShouldScrollIntoView={false}
                        placeholder="مشتری"
                        options={customerComb()}
                        onChange={(e: any) => {
                          setCustomerId(e.value);
                        }}
                      />
                      {customerId === 0 ? (
                        <p style={{ color: "red" }}>لطفا این فیلد را پر کنید</p>
                      ) : null}
                    </div>

                    <div
                      className={
                        withSupply
                          ? "col-lg-4 col-md-6 col-sm-11  mb-4 "
                          : "col-lg-6 col-md-6 col-sm-11  mb-4 "
                      }

                    >
                      <label>نام کالا</label>
                      {productSupplyId !== 0 ?
                        <>
                          <Select
                            menuShouldScrollIntoView={false}
                            placeholder="کالا"
                            className="opacityForInput border-danger"
                            value={productComboSupply()}
                            isDisabled

                          />

                        </>
                        :
                        productId === 0 ? (
                          <>
                            <Select
                              menuShouldScrollIntoView={false}
                              placeholder="کالا"
                              className="opacityForInput border-danger"
                              options={productCombo()}
                              onChange={(e: any) => {
                                setProductId(e.value);
                                setMeasureUnitId(
                                  products
                                    .filter((i: any) => i.id === e.value)
                                    .map((i: any) => i.measureUnitId)[0]
                                );
                              }}
                            />
                            <p style={{ color: "red" }}>
                              لطفا این فیلد را پر کنید
                            </p>
                          </>
                        ) : (
                          <Select
                            menuShouldScrollIntoView={false}
                            placeholder="کالا"
                            className=" "
                            options={productCombo()}
                            onChange={(e: any) => {
                              setProductId(e.value);
                              setMeasureUnitId(
                                products.filter((i: any) => i.id === e.value).map((i: any) => i.measureUnitId)[0]
                              );
                            }}
                          />
                        )}
                    </div>
                    {withSupply ? (
                      <div
                        className="col-lg-4 col-md-6 col-sm-11  mb-4 "
                        style={{ zIndex: "3" }}
                      >
                        <label>عرضه </label>

                        {productSupplyId === 0 ? (
                          <div className="row">
                            <Select
                              menuShouldScrollIntoView={false}
                              placeholder="عرضه"
                              className=" col-9 opacityForInput border-danger pr-2"
                              options={prodcutSupplyCombo()}
                              isClearable={true}
                              onChange={(e: any) => {
                                setProductSupplyId(e.value);

                                disabledBtn(e.value);
                              }}
                            />
                            <button
                              className="btn-sm col-3 btn-success  "
                              disabled={true}
                              style={{ width: "19%" }}
                            >
                              {" "}
                              افزودن شرط
                            </button>
                            <p style={{ color: "red" }}>
                              لطفا این فیلد را پر کنید
                            </p>
                          </div>
                        ) : (
                          <div className="row">
                            <Select
                              menuShouldScrollIntoView={false}
                              placeholder="عرضه"
                              className="col-9 opacityForInput pr-2 "
                              options={prodcutSupplyCombo()}
                              isClearable={true}
                              onChange={(e: any) => {

                                setProductSupplyId(e.value);

                                disabledBtn(e.value);
                              }}
                            />
                            <button
                              onClick={openModal}
                              className=" col-3 btn btn-sm btn-success "
                              style={{ width: "19%" }}
                            >
                              {" "}
                              افزودن شرط
                            </button>
                          </div>
                        )}
                      </div>
                    ) : null}

                    {withSupply ? (
                      <div
                        className="col-lg-6 col-md-6 col-sm-11 mb-4"

                      >
                        <label>نحوه پرداخت</label>
                        <Select
                          menuShouldScrollIntoView={false}
                          value={paymentSupplay()}
                          isDisabled
                          placeholder="نحوه پرداخت"
                           options={paymentM()}
                          onChange={(e: any) => {
                            setPaymentMethodId(e.value);
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        className="col-lg-6 col-md-6 col-sm-11 mb-4"

                      >
                        <label>نحوه پرداخت</label>
                        <Select
                          menuShouldScrollIntoView={false}
                          placeholder="نحوه پرداخت"
                          options={paymentM()}
                          onChange={(e: any) => {
                            setPaymentMethodId(e.value);
                          }}
                        />
                        {paymentMethodId===0?<p className="text-danger">لطفا نحوه پرداخت را انتخاب کنید</p>:''}
                      </div>
                      
                    )}
                    {productSupplyId === 0 ?
                      <div className="col-lg-6 col-md-6 col-sm-11 mb-4 textOnInput ">
                        <div className="input-group ">
                          <label>فی</label>

                          <Field
                            validate={validatNumber}
                            name="productBasePrice"
                            type="text"
                            className="  form-control opacityForInput rounded  "
                            value={formatter.format(productBasePrice)}
                            onChange={(e: any) => {
                              setProductBasePrice(
                                e.target.value.replaceAll(",", "")
                              );
                            }}
                          />
                          <div className="input-group-append ">
                            <span className="input-group-text"> ریال </span>
                          </div>
                        </div>

                        {errors.productBasePrice && touched.productBasePrice && (
                          <div className="text-danger">
                            {errors.productBasePrice}
                          </div>
                        )}
                      </div> :
                      <div className="col-lg-6 col-md-6 col-sm-11 mb-4  textOnInput ">
                        <div className="input-group rounded textOnInput">
                          <label>فی</label>
                          <Field
                            validate={validatNumber}
                            name="productBasePrice"
                            type="text"
                            disabled={true}
                            className="  form-control   "
                            value={formatter.format(productBasePrice)}
                            onChange={(e: any) => {
                              setProductBasePrice(
                                e.target.value.replaceAll(",", "")
                              );
                            }}
                          />
                          <div className="input-group-append ">
                            <span className="input-group-text"> ریال </span>
                          </div>
                        </div>

                        {errors.productBasePrice && touched.productBasePrice && (
                          <div className="text-danger">
                            {errors.productBasePrice}
                          </div>
                        )}
                      </div>
                    }
                    

                    <div className="col-lg-6 col-md-6 col-sm-11 ">
                      <label>واحد</label>
                      <input
                        className="form-control opacityForInput  mb-4"
                        disabled={true}
                        value={Mesures()}
                      />
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-11 mb-4 textOnInput ">
                      <div className="input-group rounded">
                        <label>مقدار</label>


                        <Field
                          validate={validatNumber}
                          name="quantity"
                          type="text"
                          className="  form-control opacityForInput rounded "
                          value={formatter.format(quantity)}
                          onChange={(e: any) => {
                            setQuantity(e.target.value.replaceAll(",", ""));
                          }}
                        />
                        <div className="input-group-append ">
                          <span className="input-group-text"> کیلوگرم </span>
                        </div>
                      </div>
                      {errors.quantity && touched.quantity && (
                        <div className="text-danger">{errors.quantity}</div>
                      )}
                    </div>
                   
                    


                    <div className="col-12">
                      <label>توضیحات</label>
                      <Field
                        validate={validateRequired}
                        name="comment"
                        as="textarea"
                        className="form-control opacityForInput  mb-4"
                        value={comment}
                        onChange={(e: any) => {
                          setComment(e.target.value);
                        }}
                      />
                      {errors.comment && touched.comment && (
                        <div className="text-danger">{errors.comment}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row justify-content-between">
                  <div className="col-6   ">
                    <button
                    onClick={SubmitOrder}
                      disabled={loading || (withSupply===false && paymentMethodId===0)}
                      className="btn btn-success float-right " 
                    >
                      تایید
                      <ClipLoader loading={loading} color="#ffff" size={15} />
                    </button>
                  </div>
                  <div className="col-6   ">
                    <NavLink to="/admin/orderList" className="btn btn-danger ">
                      بازگشت
                    </NavLink>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
export default AddOrder;
