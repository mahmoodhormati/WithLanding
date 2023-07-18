import React, { useState, useEffect, useRef } from 'react'
import { GetAllProducts, GetProducts, GetProductsWithSearch } from '../../../services/productService';
import { GetAllWareHouses } from '../../../services/wareHouseService';
import { MeasureUnitSample } from '../../../Common/Enums/MeasureUnitSample';
import { GetAllSuppliers, GetSupply, SetSupply } from '../../../services/supplyService';
import { SupplyTypesEnums } from '../../../Common/Enums/SupplyTypesEnums';
import { toast } from 'react-toastify';
import { useNavigate, NavLink, useParams } from 'react-router-dom';
import Select from 'react-select';
import { ShippingStatusEnums } from "../../../Common/Enums/ShippingStatusEnums";
import { ClipLoader } from "react-spinners";
import { Field, Form, Formik } from "formik";
import { validatAlpha, validatNumber } from "../../../Utils/validitionParams";
import { RootState } from '../../../store';
import { useSelector } from 'react-redux';
import QueryString from 'qs';
import SupplyAttachment from './SupplyAttachment';

const EditeSupply: React.FC = () => {
    const [productId, setProductId] = useState(0);
    const [measureUnitId, setMeasureUnitId] = useState<any>(0);
    const [cottageCode, setCottageCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalIsOpenUpload, setIsOpenUpload] = useState(false);

    const [wareHouseId, setWareHouseId] = useState<any>(0);
    const [supplyTypeId, setSupplyTypeId] = useState(0);
    const [supplierId, setSupplierId] = useState<any>(0);
    const [products, SetProducts] = useState([]);
    const [wareHouses, SetWareHouses] = useState([]);
    const [suppliers, SetSuppliers] = useState([]);
    const [quantity, setQuantity] = useState<any>('');
    const [contractNumber, setContractNumber] = useState<any>('');
    const [shippingStatusId, setShippingStatusId] = useState<any>('');
    const [comment, setComment] = useState('');
    const navigate = useNavigate();
    const params = useParams();
    const companies = useSelector((state: RootState) => state.companies)
    const [companyId, setCompanyId] = useState<any>(0)
    const [companyName, setCompanyName] = useState('')

    const closeModalForUpload = () => {
        setIsOpenUpload(false);
    };
    const getSupply = async () => {
        try {
            const { data, status } = await GetSupply(params.id)
            setQuantity(data.result.supply.quantity)
            setContractNumber(data.result.supply.contractNumber)
            setComment(data.result.supply.comment)
            setProductId(data.result.supply.productId)
            setMeasureUnitId(data.result.supply.measureUnitId)
            setWareHouseId(data.result.supply.wareHouseId)
            setSupplierId(data.result.supply.supplierId)
            setSupplyTypeId(data.result.supply.supplyTypeId)
            setShippingStatusId(data.result.supply.shippingStatusId)
            setCottageCode(data.result.supply.cottageCode)
            setCompanyId(data.result.supply.companyId)
            setCompanyName(data.result.supply.companyName)
        } catch (err) {
            console.log(err)
        }
    }
    const getProducts = async () => {
        try {

            let config = {

                headers: { 'Content-Type': 'application/json' },

                params: {

                    isAdmin: true,
                    PageNumber: 0,
                    PageSize: 100000,
                    companyId: companyId

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
    const getWareHouses = async () => {
        try {
            let config = {

                headers: { 'Content-Type': 'application/json' },

                params: {


                    PageNumber: 0,
                    PageSize: 100000,
                    companyId: companyId

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
                    PageSize: 100000,
                    companyId: companyId

                },
                paramsSerializer: (params: any) => {

                    return QueryString.stringify(params)
                }


            };
            const { data, status } = await GetAllSuppliers(config);
            if (status === 200) {
                if (data.result.suppliers.values === null) {
                    SetSuppliers([])
                }
                else {
                    SetSuppliers(data.result.suppliers.values)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getProducts();
        getWareHouses();
        getSupplier();
        getSupply()
    }, [])
    useEffect(() => {
        getProducts();
        getWareHouses();
        getSupplier();

    }, [companyId])

    const Mesures = () => {
        return (MeasureUnitSample.map((data: any) => ({ label: data.name, value: data.id })));
    }
    const MesuresD = () => {
        return (MeasureUnitSample.filter((item: any) => item.id === measureUnitId).map((data: any) => ({ label: data.name, value: data.id })));
    }
    const SupplyTypes = () => {
        return (SupplyTypesEnums.map((data: any) => ({ label: data.name, value: data.id })));
    }
    const SupplyTypesD = () => {
        return (SupplyTypesEnums.filter((item: any) => item.id === supplyTypeId).map((data: any) => ({ label: data.name, value: data.id })));
    }
    const inputWarehouses = () => {

        if (wareHouses) {
            return (wareHouses.map((data: any) => ({ label: data.name, value: data.id })));
        }
        else {
            return []
        }
    }
    const inputWarehousesD = () => {
        if (wareHouses) {

            return (wareHouses.filter((item: any) => item.id === wareHouseId).map((data: any) => ({ label: data.name, value: data.id })));
        }
        else {
            return []
        }
    }
    const inputProductG = () => {
        if (products) { return (products.map((data: any) => ({ label: data.name, value: data.id }))) }
        else {
            return []
        }

    }
    const inputProductGD = () => {
        if (products) { return (products.filter((item: any) => item.id === productId).map((data: any) => ({ label: data.name, value: data.id }))) }
        else {
            return []
        }
    }
    const inputSuppliers = () => {
        return (suppliers.map((data: any) => ({ label: data.name, value: data.id })))
    }
    const inputSuppliersD = () => {
        return (suppliers.filter((item: any) => item.id === supplierId).map((data: any) => ({ label: data.name, value: data.id })))
    }
    const shippingIdD = () => {
        return (ShippingStatusEnums.filter((item: any) => item.id === shippingStatusId).map((data: any) => ({ label: data.name, value: data.id })))
    }
    const shippingId = () => {
        return (ShippingStatusEnums.map((data: any) => ({ label: data.name, value: data.id })))
    }
    const CompaniesIDs = () => {
        return (companies.map((item: any) => ({ label: item.name, value: item.id })))

    }

    const submit = async () => {
     
        setLoading(true)
        try {
            const supply = {
                "supply": {
                    id: params.id,
                    supplyTypeId,
                    shippingStatusId,
                    supplierId,
                    productId,
                    measureUnitId,
                    quantity,
                    wareHouseId,
                    contractNumber,
                    comment:comment,
                    cottageCode:cottageCode, companyId, companyName
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
    var formatter = new Intl.NumberFormat('en-US', {


        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    });
    return (
        <div className='user-progress ' >
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                    <h5 >ویرایش تامین </h5>
                    <p>در این بخش می توانید تامین را ویرایش کنید.</p>
                </div>
            </div>
            <div className='row d-flex justify-content-center '>
                <div className=' col-lg-8 col-xs-12 m-2'>
                    <Formik
                        initialValues={{
                            id: params.id,
                            supplyTypeId,
                            shippingStatusId,
                            supplierId,
                            productId,
                            measureUnitId,
                            quantity,
                            wareHouseId,
                            contractNumber,
                            cottageCode,
                            comment, companyId, companyName
                        }}
                        enableReinitialize={true}
                        onSubmit={values => {
                            // same shape as initial values
                            
                        }}>
                        {({ errors, touched, validateField, validateForm, setFieldValue, handleChange, values }) => (


                            <Form className='row'>
                                <div className="col-12 n-chk d-flex  mb-4">

                                    {/* <div>
                                <label className="mr-2"> فعال  </label>

                                <input type="checkbox" defaultChecked={active} onChange={e => setActive(e.checked)} />

                            </div> */}


                                </div>
                                <div className=" col-lg-12 col-md-12 col-sm-11 form-group  textOnInput ">
                                    <div className='form-row mb-4'>

                                        <div className="col-lg-4 col-md-6 col-sm-11 mb-3">
                                            <label>نام کالا</label>

                                            <Select
                                                menuShouldScrollIntoView={false}
                                                styles={{
                                                    // Fixes the overlapping problem of the component
                                                    menu: provided => ({ ...provided, zIndex: 9999 })
                                                }}
                                                value={inputProductGD()} className='opacityForInput border-danger'
                                                options={inputProductG()}
                                                onChange={(e: any) => {
                                                    setProductId(e.value)


                                                }}
                                            />
                                            {productId === 0 ? <span className="text-danger">یک محصول انتخاب کنید</span> : ''}

                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-11 mb-3">
                                            <label>واحد</label>

                                            <Select
                                                menuShouldScrollIntoView={false}
                                                styles={{
                                                    // Fixes the overlapping problem of the component
                                                    menu: provided => ({ ...provided, zIndex: 9999 })
                                                }}
                                                value={MesuresD()} className='opacityForInput border-danger'
                                                options={Mesures()}
                                                onChange={(e: any) => {
                                                    setMeasureUnitId(e.value)


                                                }}
                                            />
                                            {measureUnitId === 0 ? <span className="text-danger">یک واحد انتخاب کنید</span> : ''}

                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-11 mb-3">
                                            <label>انبار</label>

                                            <Select
                                                menuShouldScrollIntoView={false}
                                                styles={{
                                                    // Fixes the overlapping problem of the component
                                                    menu: provided => ({ ...provided, zIndex: 9999 })
                                                }}
                                                value={inputWarehousesD()}
                                                className='opacityForInput border-danger'
                                                options={inputWarehouses()}
                                                onChange={(e: any) => {
                                                    setWareHouseId(e.value)


                                                }}
                                            />
                                            {wareHouseId === 0 ? <span className="text-danger">یک انبار انتخاب کنید</span> : ''}

                                        </div>
                                    </div>
                                    <div className="form-group mb-4 textOnInput ">
                                        <div className='form-row '>
                                            <div className="col-lg-4 col-md-6 col-sm-11 mb-3">
                                                <label>تامین کننده</label>

                                                <Select
                                                    menuShouldScrollIntoView={false}
                                                    styles={{
                                                        // Fixes the overlapping problem of the component
                                                        menu: provided => ({ ...provided, zIndex: 9999 })
                                                    }}
                                                    value={inputSuppliersD()} className='opacityForInput border-danger'
                                                    options={inputSuppliers()}
                                                    onChange={(e: any) => {
                                                        setSupplierId(e.value)


                                                    }}
                                                />
                                                {supplierId === 0 ? <span className="text-danger">یک تامین کننده را انتخاب کنید</span> : ''}

                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-11 mb-3">
                                                <label>وضعیت</label>

                                                <Select
                                                    styles={{
                                                        // Fixes the overlapping problem of the component
                                                        menu: provided => ({ ...provided, zIndex: 9999 })
                                                    }}
                                                    value={shippingIdD()} className='opacityForInput border-danger'
                                                    options={shippingId()}
                                                    onChange={(e: any) => {
                                                        setShippingStatusId(e.value)


                                                    }}
                                                    menuShouldScrollIntoView={false}
                                                />
                                                {supplyTypeId === 0 ? <span className="text-danger">یک نوع تامین را انتخاب کنید</span> : ''}

                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-11 mb-3">
                                                <label>نوع تامین</label>

                                                <Select
                                                    menuShouldScrollIntoView={false}
                                                    styles={{
                                                        // Fixes the overlapping problem of the component
                                                        menu: provided => ({ ...provided, zIndex: 9999 })
                                                    }}
                                                    value={SupplyTypesD()} className='opacityForInput border-danger'
                                                    options={SupplyTypes()}
                                                    onChange={(e: any) => {
                                                        setSupplyTypeId(e.value)


                                                    }}
                                                />
                                                {supplyTypeId === 0 ? <span className="text-danger">یک نوع تامین را انتخاب کنید</span> : ''}

                                            </div>

                                        </div>

                                    </div>
                                    <div className="form-group mb-4 textOnInput  ">
                                        <div className='form-row'>
                                            <div className={companies.length > 1 ? "col-lg-3 col-md-3 col-sm-11 mb-3" : "col-lg-4 col-md-4 col-sm-11 mb-3"}>
                                                <label >مقدار</label>
                                                <Field validate={validatNumber} name="quantity" type="text" className=" value form-control opacityForInput" value={formatter.format(quantity)}
                                                    onChange={(e: any) => {
                                                        setQuantity(e.target.value.replaceAll(",", ''))

                                                    }} />
                                                {errors.quantity && touched.quantity && <div className="text-danger">{String(errors.quantity)}</div>}

                                            </div>
                                            <div className={companies.length > 1 ? "col-lg-3 col-md-3 col-sm-11 mb-3" : "col-lg-4 col-md-4 col-sm-11 mb-3"}>
                                                <label >کد کوتاژ</label>
                                                <Field validate={validatNumber} name="cottageCode" className="form-control opacityForInput" value={cottageCode}
                                                    onChange={(e: any) => {
                                                        setCottageCode(e.target.value)

                                                    }} />
                                                {errors.cottageCode && touched.cottageCode && <div className="text-danger">{errors.cottageCode}</div>}

                                            </div>
                                            <div className={companies.length > 1 ? "col-lg-3 col-md-3 col-sm-11 mb-3" : "col-lg-4 col-md-4 col-sm-11 mb-3"}>
                                                <label >شماره قرارداد</label>
                                                <Field validate={validatNumber} name="contractNumber" type="text" className="form-control opacityForInput" value={contractNumber}
                                                    onChange={(e: any) => {
                                                        setContractNumber(e.target.value)

                                                    }} />
                                            </div>
                                            {errors.contractNumber && touched.contractNumber && <div className="text-danger">{String(errors.contractNumber)}</div>}


                                            {companies.length > 1 ? <div className="col-lg-3 col-md-3 col-sm-11 mb-3   textOnInput form-group "
                                                style={{ marginBottom: "3rem" }}>
                                                <div className=" form-control-sm">
                                                    <label> نام شرکت </label>

                                                    {companyId && companyId === null ?
                                                        <Select
                                                            menuShouldScrollIntoView={false}
                                                            options={CompaniesIDs()}
                                                            onChange={(e: any) => {
                                                                setCompanyId(e.value)
                                                            }}
                                                        /> : <Select
                                                            value={CompaniesIDs().filter((i: any) => i.value === companyId).map((i: any) => i)}
                                                            menuShouldScrollIntoView={false}
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
                                        </div></div>
                                    <div className="form-group mb-4 textOnInput">
                                        <label >توضیحات</label>

                                        <Field validate={validatAlpha} name="comment" as="textarea" className="form-control opacityForInput " rows='4' placeholder='توضیحات تکمیلی' value={comment} onChange={(e: any) => {
                                            setComment(e.target.value)
                                        }} />
                                        {errors.comment && touched.comment && <div className="text-danger">{errors.comment}</div>}

                                    </div>
                                    <div>
                                        <SupplyAttachment order={null} params={params}
                                    closeModalForUpload={closeModalForUpload}
                                    modalIsOpenUpload={modalIsOpenUpload}
                                    setIsOpenUpload={setIsOpenUpload} />
                                    </div>
                                </div>
                                
                                <div className='col-lg-12 col-md-12 col-sm-12  '>
                                    <div className='row justify-content-between'>
                                        <div className='col-6   '>

                                            <button type='button' disabled={productId === 0 || wareHouseId === 0 || supplierId === 0 || measureUnitId === 0 || supplyTypeId === 0 ? true : false} onClick={submit} className="btn btn-success float-right " >تایید<ClipLoader

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

export default EditeSupply