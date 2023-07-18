import react, { Fragment, useEffect, useState, useRef } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";

import { toast } from 'react-toastify';


import { GetAllShippingCompanies, GetShoppingContract, SetShippingCompany, SetShoppingContract } from "../../../../../services/ShippingService";
import { MeasureUnitSample } from "../../../../../Common/Enums/MeasureUnitSample";
import Select from "react-select";
import { GetProductsWithSearch, getEditProduct } from "../../../../../services/productService";
import { ClipLoader } from "react-spinners";
import { Field, Form, Formik } from "formik";
import { validatNumber } from "../../../../../Utils/validitionParams";
import { formatter } from "../../../../../Utils/Formatter";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import QueryString from "qs";
import { GetAllWareHouses } from "../../../../../services/wareHouseService";
import ShippingContractAttachmnet from "./ShippingContractAttachmnet";


const EditShippingContract: React.FC = () => {
    const params = useParams()
    const [loading, setLoading] = useState(false);
    const companies = useSelector((state: RootState) => state.companies)
    const [modalIsOpenUpload, setIsOpenUpload] = useState(false);
    const navigate = useNavigate();
    const [contractNumber, setContractNumber] = useState('')
    const [shippingCompany, SetShippingCompany] = useState([]);
    const [products, setproducts] = useState([]);
    const [warehouse, setwarehouse] = useState([]);
    const [shippingCompanyId, setshippingCompanyId] = useState<any>(0)
    const [measureUnitId, setMeasureUnitId] = useState(0)
    const [contract, setContract] = useState([])
    const [quantity, setQuantity] = useState(0)
    const [createDate, setCreateDate] = useState('')
    const [companyId, setCompanyId] = useState<any>(0)
    const [companyName, setCompanyName] = useState('')
    const [productId, setproductId] = useState<any>()
    const [wareHouseId, setwareHouseId] = useState<any>()
    const [comment, setcomment] = useState('')

    const closeModalForUpload = () => {
        setIsOpenUpload(false);
    };
    const ShippingContract = async () => {
        try {
            const { data, status } = await GetShoppingContract(params.id);
            setContract(data.result.shippingContract);
            setContractNumber(data.result.shippingContract.contractNumber)
            setMeasureUnitId(data.result.shippingContract.measureUnitId);
            setshippingCompanyId(data.result.shippingContract.shippingCompanyId)
            setQuantity(data.result.shippingContract.quantity);
            setCreateDate(data.result.shippingContract.createDate)
            setCompanyId(data.result.shippingContract.companyId)
            setCompanyName(data.result.shippingContract.companyName)
            setproductId(data.result.shippingContract.productId)
            setwareHouseId(data.result.shippingContract.wareHouseId)
            setcomment(data.result.shippingContract.comment)

        } catch (error) {
            console.log(error);
        }


    }

    const getBarbaris = async () => {
        try {
            const { data, status } = await GetAllShippingCompanies();
            if (status === 200) {
                SetShippingCompany(data.result.shippingCompanies.values)
            }
        } catch (error) {
            console.log(error);
        }
    }
    const getProducts = async () => {
        if (companyId !== 0) {
            let config = {

                headers: { 'Content-Type': 'application/json' },

                params: {
                    isAdmin: true,
                    PageNumber: 0,
                    PageSize: 100000,
                    companyId
                },
                paramsSerializer: (params: any) => {

                    return QueryString.stringify(params)
                }


            };

            try {
                const { data, status } = await GetProductsWithSearch(config)
                if (status === 200) {

                    setproducts(data.result.products.values)


                }
            } catch (error) {
                console.log(error);
            }

        }
    }

    const getWareHouses = async () => {
        if (companyId !== 0) {
            let config = {

                headers: { 'Content-Type': 'application/json' },

                params: {
                    companyId,
                    PageNumber: 0,
                    PageSize: 1000000,


                },
                paramsSerializer: (params: any) => {

                    return QueryString.stringify(params)
                }


            };
            try {
                const { data, status } = await GetAllWareHouses(config);

                setwarehouse(data.result.wareHouses.values)



            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        ShippingContract()
        getBarbaris()
    }, [])
    useEffect(() => {
        getProducts();
        getWareHouses()
    }, [companyId])
 

    const Mesures: any = () => {
        return (MeasureUnitSample.map((data: any) => ({ label: data.name, value: data.id })));
    }
    const barbari: any = () => {
        return (shippingCompany.map((data: any) => ({ label: data.name, value: data.id }))
        );
    }
    const submit = async () => {
        setLoading(true)
        try {
            const ShippingContract =
            {
                shippingContract: {
                    id:params.id,
                    companyId,
                    companyName,
                    contractNumber,
                    shippingCompanyId,
                    measureUnitId,
                    quantity:Number(quantity),
                    createDate: new Date(),productId,comment,wareHouseId
        
        
                }
            };
            const { data, status } = await SetShoppingContract(ShippingContract);
            if (status === 200) {
                toast.success("اطلاعات با موفقیت ثبت شد", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });
                navigate('/admin/ShippingContract')

            }


        } catch (error) {
            console.log(error);
        }
        setLoading(false)

    };
    
    const CompaniesIDs = () => {
        return (companies.map((item: any) => ({ label: item.name, value: item.id })))

    }
    const ProductCombo = () => {
        if (products) {
            let data = products.map((data: any) => ({ label: data.name, value: data.id }))
            return ([{ label: "بدون کالا", value: null }, ...data])
        }
        else {
            return ([])
        }
    }
    const WareCombo = () => {
        if (warehouse) {
            let data = warehouse.map((data: any) => ({ label: data.name, value: data.id }))
            return ([{ label: "بدون انبار", value: null }, ...data])
        }
        else {
            return ([])
        }
    }



    return (

        <div className='user-progress'>
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                    <h5>تعریف قرارداد باربری</h5>
                    <p>در این بخش می توانید قرارداد باربری جدید تعریف کنید.</p>
                </div>
            </div>
            <div className='row d-flex justify-content-center '>
                <div className='   col-md-8 col-lg-8 col-sm-12 m-2'>

                    
                <Formik
                        initialValues={{
                            contractNumber,
                            shippingCompanyId,
                            measureUnitId,
                            quantity,
                            createDate: new Date(),comment
                        }}
                        enableReinitialize={true}
                        onSubmit={values => {
                            // same shape as initial values

                        }}>
                        {({ errors, touched, validateField, validateForm, setFieldValue, handleChange, values }) => (


                            <Form className="row">

                                {companies.length > 1 ? <div className="col-lg-4  col-sm-12    textOnInput form-group "
                                    style={{ marginBottom: "3rem" }}>
                                    <div className=" form-control-sm">
                                        <label> نام شرکت </label>

                                        <Select
                                            value={CompaniesIDs().filter((i: any) => i.value === companyId).map((i: any) => i)}
                                            menuShouldScrollIntoView={false}
                                            placeholder='نام شرکت'
                                            options={CompaniesIDs()}
                                            onChange={e => {
                                                setCompanyId(e.value)
                                                setCompanyName(e.label)
                                                console.log(e);

                                            }}
                                        />
                                    </div>
                                </div> : ''}

                                <div className={companies.length > 1 ? " col-lg-4 col-sm-12 form-group mb-4 textOnInput  align-content-between" : " col-lg-6 col-sm-12 form-group mb-4 textOnInput  align-content-between"}>

                                <label>کالا</label>
                                    <Select
                                        menuShouldScrollIntoView={false}
                                        placeholder="کالا"
                                        value={ProductCombo().filter((item:any)=>item.value===productId).map((i:any)=>i)}
                                        options={ProductCombo()}
                                        onChange={(e: any) => {
                                            setproductId(e.value)

                                        }}
                                    />

                                </div>

                                <div className={companies.length > 1 ? "col-lg-4 col-sm-12 form-group mb-4 textOnInput" : "col-lg-6 col-sm-12 form-group mb-4 textOnInput"}>
                                <label>انبار</label>
                                    <Select
                                        menuShouldScrollIntoView={false}
                                        placeholder="انبار"
                                        value={WareCombo().filter((item:any)=>item.value===wareHouseId).map((i:any)=>i)}
                                        options={WareCombo()}
                                        onChange={(e: any) => {
                                            setwareHouseId(Number(e.value))

                                        }}
                                    />

                                </div>
                                <div className=" col-lg-3 col-sm-12 form-group mb-4 textOnInput">


                                <label>شماره قرارداد</label>
                                    <Field validate={validatNumber} name="contractNumber" type="text"
                                        className="form-control opacityForInput" placeholder="شماره قرارداد"
                                        value={contractNumber} onChange={(e: any) => {
                                            setContractNumber(e.target.value)

                                        }} />
                                    {errors.contractNumber && touched.contractNumber &&
                                        <div className="text-danger">{errors.contractNumber}</div>}


                                </div>
                                <div className='col-lg-3 col-sm-12 form-group mb-4 textOnInput'>

                                <label>مقدار</label>
                                    <Field validate={validatNumber} name="quantity" type="text"
                                        className="form-control opacityForInput" value={formatter.format(quantity)}
                                        onChange={(e: any) => {
                                            setQuantity(e.target.value.replaceAll(",", ""))

                                        }} />
                                    {errors.quantity && touched.quantity &&
                                        <div className="text-danger">{errors.quantity}</div>}


                                </div>
                                <div className=" col-lg-3 col-sm-12 form-group mb-4 textOnInput">


                                    <label>واحد</label>
                                    <Select
                                        menuShouldScrollIntoView={false}
                                        placeholder="واحد"
                                        value={Mesures().filter((item:any)=>item.value===measureUnitId).map((i:any)=>i)}
                                        options={Mesures()}
                                        onChange={(e: any) => {
                                            setMeasureUnitId(e.value)

                                        }}
                                    />


                                </div>
                                <div className='col-lg-3 col-sm-12 form-group mb-4 textOnInput'>

                                    <label>باربری</label>
                                    <Select
                                        menuShouldScrollIntoView={false}
                                        placeholder="باربری"
                                        value={barbari().filter((item:any)=>item.value===shippingCompanyId).map((i:any)=>i)}
                                        options={barbari()}
                                        onChange={(e: any) => {
                                            setshippingCompanyId(Number(e.value))

                                        }}
                                    />


                                </div>
                                <div className="form-group col-12 mb-4 textOnInput">
                                    <label >توضیحات</label>

                                    <Field name="comment" as="textarea" className="form-control opacityForInput " rows='4' placeholder='توضیحات تکمیلی' value={comment} onChange={(e: any) => {
                                        setcomment(e.target.value)

                                    }} />
                                    {errors.comment && touched.comment && <div className="text-danger">{errors.comment}</div>}

                                </div>
                                <div className="col-12">
                                        <ShippingContractAttachmnet order={null} params={params}
                                    closeModalForUpload={closeModalForUpload}
                                    modalIsOpenUpload={modalIsOpenUpload}
                                    setIsOpenUpload={setIsOpenUpload} />
                                    </div>
                             
                                <div className='col-6 mt-4 '>
                                    <button disabled={loading} type="button" onClick={submit}
                                        className="btn btn-success float-right ">تایید <ClipLoader

                                            loading={loading}
                                            color="#ffff"
                                            size={15}
                                        /></button>
                                </div>
                                <div className='col-6 mt-4 '>
                                    <NavLink to='/admin/ShippingContract'
                                        className="btn btn-danger ">بازگشت</NavLink>
                                </div>


                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>

    );
}
export default EditShippingContract