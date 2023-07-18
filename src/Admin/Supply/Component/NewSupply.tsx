import React, { useState, useEffect, useRef } from 'react'
import { GetAllProducts,GetProducts, GetProductsWithSearch } from '../../../services/productService';
import { GetAllWareHouses } from '../../../services/wareHouseService';
import { MeasureUnitSample } from '../../../Common/Enums/MeasureUnitSample';
import { GetAllSuppliers, SetSupply } from '../../../services/supplyService';
import { SupplyTypesEnums } from '../../../Common/Enums/SupplyTypesEnums';
import { toast } from 'react-toastify';
import { useNavigate, NavLink } from 'react-router-dom';
import Select from 'react-select';

import { ClipLoader } from "react-spinners";
import { Field, Form, Formik } from "formik";
import { validatAlpha, validatNumber } from "../../../Utils/validitionParams";
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import QueryString from 'qs';


const NewSupply: React.FC = () => {
    const [productId, setProductId] = useState(0);
    const [measureUnitId, setMeasureUnitId] = useState<any>(0);
    const [cottageCode, setCottageCode] = useState('');
    const [wareHouseId, setWareHouseId] = useState<any>(0);
    const [supplyTypeId, setSupplyTypeId] = useState<any>(0);
    const [supplierId, setSupplierId] = useState<any>(0);
    const [products, SetProducts] = useState([]);
    const [wareHouses, SetWareHouses] = useState([]);
    const [suppliers, SetSuppliers] = useState([]);
    const [quantity, setQuantity] = useState<any>('');
    const [contractNumber, setContractNumber] = useState<any>('');
    const companies = useSelector((state: RootState) => state.companies)
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [companyId, setCompanyId] = useState<any>(0)
    const [companyName, setCompanyName] = useState('')
    const navigate = useNavigate();

    const getProducts = async () => {
        try {

            let config = {

                headers: { 'Content-Type': 'application/json' },
    
                params: {
                    
                    isAdmin: true,
                    PageNumber: 0,
                    PageSize:100000,
                    companyId:companyId===0?companies[0].id:companyId
    
                },
                paramsSerializer: (params: any) => {
    
                    return QueryString.stringify(params)
                }
    
    
            };


            const { data, status } = await GetProductsWithSearch(config);


            SetProducts(data.result.products.values)

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getProducts();
        getWareHouses();
        getSupplier();
    }, [companyId])


    const getWareHouses = async () => {
        try {
            let config = {

                headers: { 'Content-Type': 'application/json' },
    
                params: {
                    
                    
                    PageNumber: 0,
                    PageSize:100000,
                    companyId:companyId===0?companies[0].id:companyId
    
                },
                paramsSerializer: (params: any) => {
    
                    return QueryString.stringify(params)
                }
    
    
            };

            const { data, status } = await GetAllWareHouses(config);
            if (status === 200) {
                SetWareHouses(data.result.wareHouses.values)
            }

        } catch (error) {

        }
    }
    const getSupplier = async () => {
        try {
            let config = {

                headers: { 'Content-Type': 'application/json' },
    
                params: {
                    
                    
                    PageNumber: 0,
                    PageSize:100000,
                    companyId:companyId===0?companies[0].id:companyId
    
                },
                paramsSerializer: (params: any) => {
    
                    return QueryString.stringify(params)
                }
    
    
            };
            const { data, status } = await GetAllSuppliers(config);
            if (status === 200) {
                if(data.result.suppliers.values===null)
                {
                    SetSuppliers([])
                }
                else{
                SetSuppliers(data.result.suppliers.values)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
  

    const Mesures = () => {
        return (MeasureUnitSample.map((data: any) => ({ label: data.name, value: data.id })));
    }
    const SupplyTypes = () => {
        return (SupplyTypesEnums.map((data: any) => ({ label: data.name, value: data.id })));
    }
    const inputWarehouses = () => {
        if(wareHouses){
        return (wareHouses.map((data: any) => ({ label: `${data.name} (${data.companyName})`, value: data.id })));
        }
        else{return []}
    }
    const inputProductG: any = () => {
        if (products) {
            return (products.map((data: any) => ({ label: `${data.name} (${data.companyName})`, value: data.id })))
        }
        else {
            return null
        }
    }
    const inputSuppliers: any = () => {
        if (suppliers) {
            return (suppliers.map((data: any) => ({ label: data.name, value: data.id })))
        }
        else {
            return null
        }
    }

    const submit = async () => {
        setLoading(true)
        if (companies.length > 1) {

            try {
                const supply = {
                    "supply": {

                        supplyTypeId,
                        shippingStatusId: 2,
                        supplierId,
                        productId,
                        measureUnitId,
                        quantity: Number(quantity && quantity.replaceAll(",", "")),
                        wareHouseId,
                        contractNumber,
                        comment:comment,
                        cottageCode:cottageCode,
                        companyId
                        , companyName

                    }

                }
                const { data, status } = await SetSupply(supply)
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
                    navigate('/admin/supply')
                }
                setLoading(false)

            } catch (error) {
                setLoading(false)

                console.log(error)
            }
            setLoading(false)

        }
        else {
            try {

                const supply = {
                    "supply": {

                        supplyTypeId,
                        shippingStatusId: 2,
                        supplierId,
                        productId,
                        measureUnitId,
                        quantity: Number(quantity && quantity.replaceAll(",", "")),
                        wareHouseId,
                        contractNumber,
                        comment,
                        cottageCode,
                        companyId: companies[0].id
                        , companyName: companies[0].name

                    }

                }
                const { data, status } = await SetSupply(supply)
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
                    navigate('/admin/supply')
                }
                setLoading(false)

            } catch (error) {
                console.log(error);
                setLoading(false)

            }
            setLoading(false)

        }
    }
    var formatter = new Intl.NumberFormat('en-US', {


        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    });

    const CompaniesIDs = () => {
        return (companies.map((item: any) => ({ label: item.name, value: item.id })))

    }


    return (
        <div className='user-progress ' >
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                    <h5 >تعریف تامین </h5>
                    <p>در این بخش می توانید تامین جدید تعریف کنید.</p>
                </div>
            </div>
            <div className='row d-flex justify-content-center '>
                <div className=' col-lg-8 col-md-8 col-xs-12 m-2'>
                    <Formik
                        initialValues={{
                            supplyTypeId,
                            shippingStatusId: 2,
                            supplierId,
                            productId,
                            measureUnitId,
                            quantity: Number(quantity && quantity.replaceAll(",", "")),
                            wareHouseId,
                            contractNumber,
                            comment,
                            cottageCode,
                        }}
                        enableReinitialize={true}
                        onSubmit={values => {
                            // same shape as initial values
                            submit()
                        }}>
                        {({ errors, touched, validateField, validateForm, setFieldValue, handleChange, values }) => (


                            <Form className='row'>
                                <div className="n-chk d-flex  mb-4">
                                </div>
                                <div className=" col-lg-12 col-md-12 col-sm-11  form-group  textOnInput ">
                                    <div className='form-row mb-4'>
                                    {companies.length > 1 ? <div className="col-lg-4 col-md-4 col-sm-11 mb-3   textOnInput form-group "
                                                style={{ marginBottom: "3rem" }}>
                                                <div className=" form-control-sm">
                                                    <label> نام شرکت </label>

                                                    {companyId && companyId === null ?
                                                        <Select
                                                            menuShouldScrollIntoView ={false}
                                                            options={CompaniesIDs()}
                                                            onChange={(e: any) => {
                                                                setCompanyId(e.value)
                                                            }}
                                                        /> : <Select
                                                            value={CompaniesIDs().filter((i: any) => i.value === companyId).map((i: any) => i)}
                                                            menuShouldScrollIntoView ={false}
                                                            placeholder='نام شرکت'
                                                            options={CompaniesIDs()}
                                                            onChange={(e: any) => {
                                                                setCompanyId(e.value)
                                                                setCompanyName(e.lable)
                                                                console.log(e);

                                                            }}
                                                        />}
                                                {companyId === 0 ? <span className="text-danger">یک شرکت را انتخاب کنید</span> : ''}

                                                </div>
                                            </div> : ''}

                                        <div className={companies.length > 1 ?"col-lg-4 col-md-4 col-sm-11 mb-3":"col-lg-6 col-md-6 col-sm-11 mb-3"}>
                                            <label>نام کالا</label>
                                            <Select placeholder='انتخاب'
                                                    menuShouldScrollIntoView ={false}
                                                className='opacityForInput border-danger '
                                                options={inputProductG()}
                                                styles={{
                                                    // Fixes the overlapping problem of the component
                                                    menu: provided => ({ ...provided, zIndex: 9999 })
                                                }}
                                                onChange={(e: any) => {
                                                    setProductId(e.value)
                                                }}
                                            />
                                            {productId === 0 ? <span className="text-danger">یک محصول انتخاب کنید</span> : ''}

                                        </div>
                                        <div className={companies.length > 1 ?"col-lg-4 col-md-4 col-sm-11 mb-3":"col-lg-6 col-md-6 col-sm-11 mb-3"}>
                                            <label>واحد</label>

                                            <Select
                                                menuShouldScrollIntoView ={false}
                                                placeholder='انتخاب '
                                                styles={{
                                                    // Fixes the overlapping problem of the component
                                                    menu: provided => ({ ...provided, zIndex: 9999 })
                                                }}
                                                className='opacityForInput border-danger'
                                                options={Mesures()}
                                                onChange={(e: any) => {
                                                    setMeasureUnitId(e.value)


                                                }}
                                            />
                                            {measureUnitId === 0 ? <span className="text-danger">یک واحد انتخاب کنید</span> : ''}

                                        </div>
                                        
                                    </div>
                                    <div className="form-group mb-4 textOnInput ">
                                        <div className='form-row '>
                                        <div className="col-lg-4 col-md-6 col-sm-11 mb-3">
                                            <label> انبار</label>

                                            <Select placeholder='انتخاب '
                                                styles={{
                                                    // Fixes the overlapping problem of the component
                                                    menu: provided => ({ ...provided, zIndex: 9999 })
                                                }}
                                                className='opacityForInput border-danger'
                                                options={inputWarehouses()}
                                                onChange={(e: any) => {
                                                    setWareHouseId(e.value)


                                                }}
                                                    menuShouldScrollIntoView ={false}
                                            />
                                            {wareHouseId === 0 ? <span className="text-danger">یک انبار انتخاب کنید</span> : ''}

                                        </div>
                                            <div className="col-lg-4 col-md-4 col-sm-11 mb-3">
                                                <label>تامین کننده</label>
                                                <Select placeholder='انتخاب '
                                                    className='opacityForInput border-danger'
                                                    styles={{
                                                        // Fixes the overlapping problem of the component
                                                        menu: provided => ({ ...provided, zIndex: 9999 })
                                                    }}
                                                    options={inputSuppliers()}
                                                    onChange={(e: any) => {
                                                        setSupplierId(e.value)


                                                    }}
                                                        menuShouldScrollIntoView ={false}
                                                />
                                                {supplierId === 0 ? <span className="text-danger">یک تامین کننده را انتخاب کنید</span> : ''}

                                            </div>
                                            <div className="col-lg-4 col-md-4 col-sm-11 mb-3">
                                                <label>نوع تامین</label>

                                                <Select placeholder='انتخاب'
                                                    styles={{
                                                        // Fixes the overlapping problem of the component
                                                        menu: provided => ({ ...provided, zIndex: 9999 })
                                                    }}
                                                    className='opacityForInput border-danger'
                                                    options={SupplyTypes()}
                                                    onChange={(e: any) => {
                                                        setSupplyTypeId(e.value)


                                                    }}
                                                        menuShouldScrollIntoView ={false}
                                                />
                                                {supplyTypeId === 0 ? <span className="text-danger">یک نوع تامین را انتخاب کنید</span> : ''}

                                            </div>
                                           

                                        </div>

                                    </div>
                                    <div className="form-group mb-4 textOnInput  ">
                                        <div className='form-row'>
                                            <div className="col-lg-4 col-md-6 col-sm-11 mb-3">
                                                <label >مقدار</label>
                                                <Field validate={validatNumber} name="quantity" type="text" className=" value form-control opacityForInput" value={formatter.format(quantity)}
                                                    onChange={(e: any) => {
                                                        setQuantity(e.target.value.replaceAll(",", ''))

                                                    }} />
                                                {errors.quantity && touched.quantity && <div className="text-danger">{errors.quantity}</div>}

                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-11 mb-3">
                                                <label >کد کوتاژ</label>
                                                <Field validate={validatNumber} name="cottageCode" className="form-control opacityForInput" value={cottageCode}
                                                    onChange={(e: any) => {
                                                        setCottageCode(e.target.value)

                                                    }} />
                                                {errors.cottageCode && touched.cottageCode && <div className="text-danger">{errors.cottageCode}</div>}

                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-11 mb-3">
                                                <label >شماره قرارداد</label>
                                                <Field validate={validatNumber} name="contractNumber" type="text" className="form-control opacityForInput" value={contractNumber}
                                                    onChange={(e: any) => {
                                                        setContractNumber(e.target.value)

                                                    }} />
                                            </div>
                                            {errors.contractNumber && touched.contractNumber && <div className="text-danger">{(errors.contractNumber) as any}</div>}

                                        </div></div>
                                    <div className="form-group mb-4 textOnInput">
                                        <label >توضیحات</label>

                                        <Field validate={validatAlpha} name="comment" as="textarea" className="form-control opacityForInput " rows={4} placeholder='توضیحات تکمیلی' value={comment} onChange={(e: any) => {
                                            setComment(e.target.value)
                                        }} />
                                        {errors.comment && touched.comment && <div className="text-danger">{errors.comment}</div>}

                                    </div>

                                </div>

                                <div className='col-lg-12 col-md-12 col-sm-12  '>
                                    <div className='row justify-content-between'>
                                        <div className='col-6   '>

                                            <button disabled={productId === 0 || wareHouseId === 0 || supplierId === 0 || measureUnitId === 0 || supplyTypeId === 0 ? true : false} type="submit" className="btn btn-success float-right " >تایید<ClipLoader

                                                loading={loading}
                                                color="#ffff"
                                                size={15}
                                            /></button>


                                        </div>
                                        <div className='col-6   '>
                                            <NavLink to='/admin/supply' className="btn btn-danger ">بازگشت</NavLink>
                                        </div>
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

export default NewSupply