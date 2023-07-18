import React, { useState, useEffect, useReducer } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { GetProducts, getEditProduct } from '../../../services/productService';
import { GetProductWareHouses } from '../../../services/prodcutWarehouse';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { GetAllProductSupply, SetProductSupply } from '../../../services/productSupplyService';
import { toast } from 'react-toastify';

import ProductSupplyCondition from "../Child/Conditions/Component/ProductSupplyCondition";
import { ClipLoader } from "react-spinners";
import { Field, Form, Formik } from "formik";
import { validatAlpha, validatNumber, validatWithoutFillNumber } from "../../../Utils/validitionParams";
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { GetProductsWithCompanyForCombos } from '../../../services/productService';
import ContractProductSupply from '../Child/Contracts/Component/ContractProductSupply';
import QueryString from 'qs';
import { GetShoppingContracts } from '../../../services/ShippingService';


const ProductSupplyEdit: React.FC = () => {
    const params = useParams()
    const [, forceUpdate] = useState();

    const navigate = useNavigate();
    const [Productwarehouse, setProductwarehouse] = useState([]);
    const [products, setProducts] = useState([]);
    const [quantity, setQuantity] = useState<any>('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState<any>('');
    const [comment, setComment] = useState('');
    const [productId, setProductId] = useState<any>('');
    const [productIdItem, setProductIdItem] = useState(0);
    const [measureUnitId, setmeasureUnitId] = useState(0);
    const [productWareHouseId, setproductWareHouseId] = useState(0);
    const [endDate, setendDate] = useState(new Date())
    const [warHouseName, setWarHouseName] = useState<any>('');
    const [warHouseId, setWarHouseId] = useState<any>();
    const [createDate, setCreateDate] = useState(new Date());
    const [active, setActive] = useState(true);
    const [cottageCode, setcottageCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [allowedContractIds, SetallowedContractIds] = useState<any>([])
    const companies = useSelector((state: RootState) => state.companies)
    let [shippingcontract, Setshippingcontract] = useState([])
    let [companyId, SetcompanyId] = useState<any>()
    let [companyName, SetCompanyName] = useState<any>()
    const [privateComment, SetprivateComment] = useState('');
    const[updateValue,ForceUpdate]=useReducer(x=>x+1,0)






    console.log(shippingcontract);


    const getProductSupply = async () => {
        try {
            const { data, status } = await GetAllProductSupply(params.id)
            setPrice(data.result.productSupply.price)
            setName(data.result.productSupply.name)
            setcottageCode(data.result.productSupply.cottageCode)
            setQuantity(data.result.productSupply.quantity)
            setComment(data.result.productSupply.comment)
            setActive(data.result.productSupply.active)
            setendDate(new Date(data.result.productSupply.endDate))
            setProductId(data.result.productSupply.productId)
            setProductIdItem(data.result.productSupply.productId)
            setComment(data.result.productSupply.comment)
            setCreateDate(data.result.productSupply.createDate)
            setWarHouseName(data.result.productSupply.wareHouse.wareHouseName)
            setWarHouseId(data.result.productSupply.wareHouse.wareHouseId)
            setproductWareHouseId(data.result.productSupply.productWareHouseId)
            SetcompanyId(data.result.productSupply.companyId)
            SetCompanyName(data.result.productSupply.companyName)
            SetprivateComment(data.result.productSupply.privateComment)
            SetallowedContractIds(data.result.productSupply.allowedContracstIds ? data.result.productSupply.allowedContracstIds : [])
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {

        getProductSupply()
    }, [params.id,updateValue])




    useEffect(() => {

        getContracts()
    }, [allowedContractIds,updateValue])




    const getContracts = async () => {





        if (allowedContractIds.length > 0) {



            try {
                let config = {

                    headers: { 'Content-Type': 'application/json' },

                    params: {
                        Ids: allowedContractIds,

                        PageNumber: 0,
                        PageSize: 1000,


                    },
                    paramsSerializer: (params: any) => {

                        return QueryString.stringify(params)
                    }


                };


                const { data, status } = await GetShoppingContracts(config)
                if (status === 200) {

                    Setshippingcontract(data.result.shippingContracts.values)
                }
            }

            catch (error) {
                console.log(error);

            }








        }
    }


    const getProdcutForCombo = async () => {

        if (companyId) {
            try {
                const { data, status } = await GetProductsWithCompanyForCombos(companyId);
                if (status === 200) {
                    setProducts(data.result.products.values)


                }
            } catch (error) {
                console.log(error)

            }
        }
        else {
            try {
                const { data, status } = await GetProductsWithCompanyForCombos(companies[0].id);
                if (status === 200) {
                    setProducts(data.result.products.values)


                }
            } catch (error) {
                console.log(error)

            }
        }

    }
    const Prodcutware = async (id: any) => {

        if(id){
        try {
            const { data, status } = await GetProductWareHouses(id);
            if (status === 200) {

                setProductwarehouse(data.result.productWareHouses);


            }
        } catch (error) {
            console.log(error);
        }
    }
    }

    useEffect(() => {
        getProdcutForCombo();


    }, [updateValue])
    useEffect(() => {
        getProdcutForCombo();


    }, [companyId,updateValue])
    useEffect(() => {
        Prodcutware(productId)
        ProductMeasure()


    }, [productId,updateValue])

    const productCombo: any = () => {
        if (products) {
            return (products.map((data: any) => ({ label: data.name, value: data.id })))
        }
        else {
            return (null)
        }
    }
    const product = () => {
        if (products) {
            return (products.filter((item: any) => item.id === productId).map((data: any) => ({ label: data.name, id: data.id })))
        }
        else {
            return (null)
        }
    }
    let productValue: any = product()

   
    
    const ProductMeasure = async () => {

        if(productValue){
        const { data, status } = await getEditProduct(productValue[0].id);
        if (status === 200) {

            setmeasureUnitId(data.result.product.measureUnitId)
        }
    }
    }

    const wareCombo: any = () => {

        if (Productwarehouse) {
            return (Productwarehouse.filter((data: any) => data.id !== 0).map((data: any) => ({
                label: data.wareHouseName,
                value: data.id
            })))
        }
        else {
            return (null)
        }
    }
    const WareHouse = () => {
        return (Productwarehouse.filter((data: any) => data.id === productWareHouseId).map((data: any) => ({
            label: data.wareHouseName,
            id: data.wareHouseId
        })))

    }

    const CompaniesIDs = () => {
        return (companies.map((item: any) => ({ label: item.name, value: item.id })))

    }

    const handleChangeExpire = (value: any) => {

        //تغییرات روی تاریخ رو اینجا اعمال کنید
        if (value instanceof DateObject) {
            setendDate(value.add(270, 'minute').toDate())

        }
    }





    const handelSubmit = async () => {
        setLoading(true)

        const body = {
            "productSupply": {
                id: params.id,
                productId,
                productWareHouseId,
                createDate,
                cottageCode:cottageCode,
                endDate,
                measureUnitId,
                quantity,
                active,
                comment:comment,
                name:name,
                price,
                companyId, companyName,
                allowedContracstIds: allowedContractIds,privateComment:privateComment


            },
            "product": null
            ,
            "wareHouse": null
        }

        try {

            const { data, status } = await SetProductSupply(body)
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

                navigate(-1)

            }

            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)

        }
        setLoading(false)

    }
    const handelNavigate = (e: any) => {
        e.preventDefault()
        navigate(-1)
    }
    var formatter = new Intl.NumberFormat('en-US', {


        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    });

    return (
        <div className='user-progress'>
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                    <h5>ویرایش عرضه شماره {params.id}</h5>
                    <p>در این بخش می توانید عرضه را ویرایش کنید</p>

                </div>
            </div>
            <div className='row d-flex justify-content-center '>
                <div className='col-lg-8 col-xs-12 m-2'>
                    <Formik
                        initialValues={{

                            id: params.id,
                            productId,
                            productWareHouseId,
                            createDate,
                            
                            endDate,
                            measureUnitId,
                            quantity,
                            active,
                            comment,
                            name,
                            price,
                            companyId, companyName,privateComment,allowedContracstIds:allowedContractIds

                        }}
                        enableReinitialize={true}
                        onSubmit={values => {
                            // same shape as initial values

                        }}>
                        {({ errors, touched, validateField, validateForm, setFieldValue, handleChange, values }) => (



                            <Form >
                                <div className="form-group mt-1 mb-3 textOnInput ">
                                    <div className='form-row'>

                                        <div className="col-md-6 col-xs-12 mb-4">
                                            <label> نام کالا</label>

                                            {productId === 0 ? (
                                                <>
                                                    <Select
                                                        menuShouldScrollIntoView={false}
                                                        isDisabled={true}
                                                        value={product()}
                                                        // placeholder='کالا'
                                                        className='opacityForInput border-danger'
                                                        options={productCombo()}
                                                        onChange={(e: any) => {
                                                            setProductId(e.value)
                                                            Prodcutware(e.value)
                                                        }}
                                                    />
                                                    <p style={{ color: 'red' }}>لطفا این فیلد را پر کنید</p>

                                                </>
                                            ) : (<Select
                                                menuShouldScrollIntoView={false}
                                                value={product()}
                                                isDisabled={true}

                                                className='opacityForInput '
                                                options={productCombo()}
                                                onChange={(e: any) => {
                                                    setProductId(e.value)
                                                    Prodcutware(e.value)

                                                }}
                                            />)}


                                        </div>

                                        <div className="col-md-6 col-xs-12  mb-4">
                                            <label>انبار</label>
                                            {productWareHouseId !== null ? (
                                                <>
                                                    <Select
                                                        menuShouldScrollIntoView={false}
                                                        value={wareCombo().filter((i: any) => i.value === productWareHouseId).map((i: any) => i)}
                                                        // placeholder='کالا'
                                                        isDisabled={true}

                                                        options={wareCombo()}
                                                        onChange={(e: any) => {
                                                            setproductWareHouseId(e.value)

                                                        }}
                                                    />


                                                </>
                                            ) : (<>
                                                <Select
                                                    menuShouldScrollIntoView={false}
                                                    value={wareCombo()}

                                                    options={wareCombo()}
                                                    onChange={(e: any) => {
                                                        setproductWareHouseId(e.value)

                                                    }}
                                                />
                                                <p style={{ color: 'red' }}>لطفا این فیلد را پر کنید</p>

                                            </>
                                            )

                                            }


                                        </div>



                                    </div>

                                </div>

                                <div className="form-group mb-4 textOnInput">
                                    <div className='form-row'>
                                        <div className={companies.length > 1 ? 'col-lg-6 col-md-6 col-sm-11 mb-4 ' : 'col-lg-12 col-md-12 col-sm-11 mb-4 '}>
                                            <label > شناسه عرضه</label>
                                            <Field validate={validatAlpha} name="name" type="text" className="form-control opacityForInput" value={name} onChange={(e: any) => {
                                                setName(e.target.value)

                                            }} />
                                            {errors.name && touched.name && <div className="text-danger">{errors.name}</div>}

                                        </div>
                                        {companies.length > 1 ? <div className="col-lg-6 col-md-6 col-sm-11 mb-4   textOnInput form-group "
                                            style={{ marginBottom: "3rem" }}>
                                            <div className=" form-control-sm">
                                                <label> نام شرکت </label>

                                                {companyId && companyId === null ?
                                                    <Select
                                                        isDisabled={true}
                                                        menuShouldScrollIntoView={false}
                                                        options={CompaniesIDs()}
                                                        onChange={(e: any) => {
                                                            SetcompanyId(e.value)
                                                        }}
                                                    /> : <Select
                                                        value={CompaniesIDs().filter((i: any) => i.value === companyId).map((i: any) => i)}
                                                        isDisabled={true}
                                                        menuShouldScrollIntoView={false}
                                                        placeholder='نام شرکت'
                                                        options={CompaniesIDs()}
                                                        onChange={(e: any) => {
                                                            SetcompanyId(e.value)
                                                            SetCompanyName(e.lable)
                                                            console.log(e);

                                                        }}
                                                    />}
                                                {companyId === 0 ? <span className="text-danger">یک شرکت را انتخاب کنید</span> : ''}

                                            </div>
                                        </div> : ''}
                                        <div className="col-6">
                                            <label >شماره کوتاژ</label>
                                            <Field  name="cottageCode" type="number" className="form-control opacityForInput" value={cottageCode} onChange={(e: any) => {
                                                setcottageCode(e.target.value)

                                            }} />
                                            

                                        </div>
                                        <div className="col-6">
                                            <label >مقدار عرضه</label>
                                            <Field validate={validatNumber} name="quantity" type="text" className="form-control opacityForInput" value={formatter.format(quantity)}
                                                onChange={(e: any) => {
                                                    setQuantity(Number(e.target.value.replaceAll(",", "")))

                                                }} />
                                            {errors.quantity && touched.quantity && <div className="text-danger">{String(errors.quantity)}</div>}
                                        </div>

                                    </div></div>
                                <div className="form-group mb-4 textOnInput  ">
                                    <div className='form-row'>

                                        <div className="col-6">
                                            <label >قیمت</label>
                                            <Field validate={validatNumber} name="price" type="text" className="form-control opacityForInput" value={formatter.format(price)}
                                                onChange={(e: any) => {
                                                    setPrice(Number(e.target.value.replaceAll(",", "")))

                                                }} />
                                            {errors.price && touched.price && <div className="text-danger">{String(errors.price)}</div>}

                                        </div>

                                        <div className="col-6">
                                            <label style={{ position: 'absolute', zIndex: '1', top: '-15px', right: '10px', background: 'white', padding: '0 8px' }}>تاریخ اعتبار</label>

                                            <DatePicker
                                                calendar={persian}

                                                locale={persian_fa}
                                                style={{ height: '45.39px', width: '100%', textAlign: 'center', }}
                                                value={endDate}
                                                onChange={
                                                    handleChangeExpire
                                                } />


                                        </div>
                                    </div></div>
                                <div className="form-group mb-4 textOnInput" style={{ position: 'relative' }}>


                                </div>
                                <div className="form-group mb-4 textOnInput">
                                    <label >توضیحات خصوصی</label>

                                    <Field name="privateComment" as="textarea" className="form-control opacityForInput " rows='4' placeholder='توضیحات خصوصی' value={privateComment} onChange={(e: any) => {
                                        SetprivateComment(e.target.value)

                                    }} />
                                    {errors.comment && touched.comment && <div className="text-danger">{errors.comment}</div>}

                                </div>
                                <div className="form-group mb-4 textOnInput">
                                    <label >توضیحات</label>

                                    <Field  name="comment" as="textarea" className="form-control opacityForInput " rows='4' placeholder='توضیحات تکمیلی' value={comment} onChange={(e: any) => {
                                        setComment(e.target.value)

                                    }} />
                                    {errors.comment && touched.comment && <div className="text-danger">{errors.comment}</div>}

                                </div>



                                <div className="form-group mb-4 mt-3 label textOnInput col-lg-12 rounded border  border-dark ">
                                    <label>شرایط پرداخت</label>
                                    <ProductSupplyCondition quantity={quantity} companyId={companyId} update={forceUpdate} />
                                </div>
                                <div className="form-group mb-4 mt-3 label textOnInput col-lg-12 rounded border  border-dark ">
                                    <label> قرارداد های مجاز</label>
                                    <ContractProductSupply contractIds={allowedContractIds} addContract={SetallowedContractIds} Allcontract={shippingcontract} getshippingsContract={getContracts} />
                                </div>

                                <div className='row '>



                                    <div className='col-6  '>
                                        <button type="submit" disabled={loading} className="btn btn-success float-right" onClick={handelSubmit} >ثبت<ClipLoader

                                            loading={loading}
                                            color="#ffff"
                                            size={15}
                                        /></button>
                                    </div>
                                    <div className='col-6 '>
                                        <button onClick={handelNavigate}
                                            className="btn btn-danger ">بازگشت</button>
                                    </div>
                                </div>

                            </Form>
                        )}
                    </Formik>
                </div>
            </div>

        </div>
    )
}
export default ProductSupplyEdit

