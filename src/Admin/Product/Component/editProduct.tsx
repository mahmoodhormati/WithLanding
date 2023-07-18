import { NavLink, useParams, useNavigate } from "react-router-dom";
import { getEditProduct, SetProduct } from "../../../services/productService";
import { useEffect, useState } from "react";
import { useRef } from "react";

import { toast } from "react-toastify";
import Select from "react-select";
import { MeasureUnitSample } from "../../../Common/Enums/MeasureUnitSample";
import { GetAllWareHouses } from "../../../services/wareHouseService";
import { GetProductWareHouses } from "../../../services/prodcutWarehouse";
import { GetAttribute, SetAttributeValues } from "../../../services/attributeService";
import { GetAttributeValues } from '../../../services/attributeService';
import ProductWareHouseEdit from "../../../Common/Shared/Common/productWareHouseEdit";
import { GetGroupsForEntity, GetGroupWithCompany } from "../../../services/GroupService";
import { ClipLoader } from "react-spinners";
import { GetCompanyChild } from '../../../services/companiesService';
import { Formik, Form, Field } from 'formik';
import { validatAlpha, validatENAlpha, validatmin10, validatNumber } from "../../../Utils/validitionParams";
import { useSelector } from 'react-redux';
import { RootState } from "../../../store";
import QueryString from "qs";
import ProductAttachments from "./ProductAttachments";
const EditProduct: React.FC = () => {
    const params = useParams()
    const [, forceUpdate] = useState();
    const companies = useSelector((state: RootState) => state.companies)
    const id = params.id
    const [active, setActive] = useState()
    const [warehouse, setwarehouse] = useState([]);
    const [wareHouse, setWareHouse] = useState([]);
    const [group, setGroup] = useState([])
    const [groupId, setGroupId] = useState(0)
    const navigator = useNavigate();
    const [name, setName] = useState('')
    const [englishName, setEnglishName] = useState('')
    const [price, setPrice] = useState('')
    const [minSellableAmount, setMinSellableAmount] = useState('')
    const [maxSellableAmount, setMaxSellableAmount] = useState('')
    const [measureUnitId, setMeasureUnitId] = useState<any>('')
    const [productG, setProductG] = useState([])
    const [attributeValue, setattributeValue] = useState<any>({})
    const [isSubmit, setIsSubmit] = useState(false)
    let attvalue;
    const [loading, setLoading] = useState(false);
    let [companyId, SetcompanyId] = useState<any>()
    let [companyName, SetCompanyName] = useState<any>()
    const [attValues, setattValues] = useState(0)
    const [modalIsOpenUpload, setIsOpenUpload] = useState(false);
    const closeModalForUpload = () => {
        setIsOpenUpload(false);
    };


    const getProducts = async () => {
        const { data, status } = await getEditProduct(params.id);
        setActive(data.result.product.active);
        setName(data.result.product.name);
        setEnglishName(data.result.product.englishName);
        setPrice(data.result.product.price);
        setMinSellableAmount(data.result.product.minSellableAmount);
        setMaxSellableAmount(data.result.product.maxSellableAmount);
        setMeasureUnitId(data.result.product.measureUnitId);
        setGroupId(data.result.product.groupId)
        SetcompanyId(data.result.product.companyId)
        SetCompanyName(data.result.product.companyName)
    }
    // const GetProductGroup = async () => {
    //     const { data, status } = await GetAttribute(1003);
    //     if (status === 200) {

    //         const response = data.result.attribute.controlTypeValues;

    //         const myArray = response.split(",");

    //         const FormateValue = () => {

    //             return (myArray.map(data => ({ id: Number(data.slice(0, 1)), value: data.slice(2, 100) })))
    //         }
    //         setProductG(FormateValue());}
    // }
    const getPoroductWareHouses = async () => {
        const { data, status } = await GetProductWareHouses(params.id)
        setWareHouse(data.result.productWareHouses)
    }
    useEffect(() => {
        getPoroductWareHouses()
        getProducts();

    }, [])

    const UpdateProduct = {
        id,
        active,
        name:name,
        englishName:englishName,
        price,
        maxSellableAmount,
        minSellableAmount,
        measureUnitId,
        measureUnit: measureUnitId,
        groupId,
        companyId, companyName
    }
    const GetGroup = async (companyId:any) => {
         
        if(companyId!==undefined && companyId>0){

            const { data, status } = await GetGroupWithCompany(2, companyId);

      

      
        setGroup(data.result.groups)
    
    }
    }


    useEffect(()=>{

        GetGroup(companyId)

    },[companyId])
  
    const submit = async () => {
        setLoading(true)

        try {

            const { data, status } = await SetProduct(UpdateProduct);

            // await updateAttrte();
            if (status === 200) {
                setIsSubmit(true)

                toast.success('تغییرات با موفیت ثبت شد', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });
                navigator('/admin/productList')

            }

            setLoading(false)

        } catch (error) {
            console.log(error);
            setLoading(false)

        }
        setLoading(false)



    };
    const WareHouses = async () => {

        let config = {

            headers: { 'Content-Type': 'application/json' },

            params: {


                PageNumber: 0,
                PageSize: 100000,
                companyId: companyId === 0 ? companies[0].id : companyId

            },
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }


        };

        try {
            const { data, status } = await GetAllWareHouses(config);
            if (status === 200) {
                setwarehouse(data.result.wareHouses.values)
            }
        } catch (error) {
            console.log(error);
        }
    }
    const GetAttValues = async () => {
        try {
            const { data, status } = await GetAttributeValues(1003, id);
            if (status === 200) {
                attvalue = data.result.attributeValue.value
                setattValues(data.result.attributeValue.value)
                setattributeValue(data.result.attributeValue)

            }

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(
        () => {
            WareHouses();
            GetAttValues();
        }, []);
    const Mesures: any = () => {
        return (MeasureUnitSample.map((data: any) => ({ label: data.name, value: data.id })));
    }
    const inputWarehouses = () => {
        return (warehouse.map((data: any) => ({ label: data.name, value: data.id })));
    }
    let MeasureId = MeasureUnitSample.filter((item: any) => item.id === measureUnitId).map((item: any) => item.name)
    let MEASURE = MeasureId[0]
    let WareHousesItem = wareHouse.filter((item: any) => item.id !== 0).map((item: any) => item.wareHouseName)
    let WAREHOUSESEITEM = WareHousesItem[0]
    let WareHousesId = warehouse.filter((item: any) => item.name === WAREHOUSESEITEM).map((item: any) => item.id)
    let WAREHOUSESEID = WareHousesId[0]

    const inputProductG: any = () => {
        return (group.map((data: any) => ({ label: data.name, value: data.id })))
    }
    const currentProductG = () => {
        if (groupId === null) {
            setGroupId(0)
        }

        return (group.filter((data: any) => data.id === groupId).map((item: any) => ({ label: item.name, id: item.id })))
    }


    const companys = () => {
        return (companies.map((item: any) => ({ label: item.name, value: item.id })))

    }

    let defaultValue: any = companys().filter((item: any) => item.value === companyId)
    return (
        <div className='user-progress' >
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                    <h5 >ویرایش کالا</h5>
                    <p>در این بخش می توانیداطلاعات کالا را ویرایش کنید.</p>
                </div>
            </div>
            <div className='row d-flex justify-content-center '>
                <div className='col-md-8 col-xs-12 m-2 mb-4'>
                    <Formik
                        initialValues={{
                            id,
                            active,
                            name,
                            englishName,
                            price,
                            maxSellableAmount,
                            minSellableAmount,
                            measureUnitId,
                            measureUnit: measureUnitId,
                            groupId,
                            companyId, companyName
                        }}
                        enableReinitialize={true}
                        onSubmit={values => {
                            // same shape as initial values
                 
                        }}>
                        {({ errors, touched, setFieldTouched, validateField, validateForm, setFieldValue, handleChange, values }) => (

                            <Form className="row ">
                                <div className="col-lg-12 col-sm-12 n-chk d-flex  mb-4">

                                    <div>
                                        <label className="mr-2"> فعال </label>

                                        <Field name="active" type="checkbox" checked={active} onChange={(e: any) => {
                                            setActive(e.target.checked)

                                        }}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-12 col-sm-12  form-group mb-4 textOnInput  align-content-between">

                                    <div className='form-row'>
                                      
                                        {companies.length > 1 ? <div className="col-lg-4 col-sm-12 mt-3" >
                                            <label>شرکت</label>
                                            <Select
                                                menuShouldScrollIntoView={false}
                                                defaultValue={defaultValue}
                                                placeholder='نام شرکت'
                                                options={companys()}
                                                key={defaultValue}
                                                isClearable={true}
                                                onChange={(e: any) => {


                                                    SetcompanyId(e.value)
                                                    SetCompanyName(e.label)


                                                }

                                                }

                                            />

                                        </div> : ''}

                                        <div className={companies.length > 1 ? "col-lg-4 col-sm-12  mt-3" : "col-lg-6 col-sm-12  mt-3"}>
                                            <label>نام کالا</label>
                                            <Field name="name" validate={validatAlpha} type="text" className="form-control opacityForInput" placeholder="کنجاله ، ذرت و..."
                                                value={name} onChange={(e: any) => {
                                                    setName(e.target.value)

                                                }} />
                                            {errors.name && touched.name && <div className="text-danger">{errors.name}</div>}
                                        </div>
                                        <div className={companies.length > 1 ? "col-lg-4 col-sm-12  mt-3" : "col-lg-6 col-sm-12  mt-3"}>
                                            <label> نام لاتین</label>
                                            <Field name="englishName" validate={validatENAlpha} type="text" className="form-control opacityForInput" placeholder="... Corn Seed "
                                                value={englishName} onChange={(e: any) => {
                                                    setEnglishName(e.target.value)

                                                }} />
                                            {errors.englishName && touched.englishName && <div className="text-danger">{errors.englishName}</div>}

                                        </div>
                                    </div>
                                </div>

                                <div className=" col-lg-12 col-sm-12  form-group mb-4 textOnInput">
                                    <div className='form-row'>
                                        <div className="col-lg-6 col-sm-12 mt-3">
                                            <label>واحد</label>
                                            <Select
                                                menuShouldScrollIntoView={false}
                                                required={true}
                                                value={{ label: MEASURE, id: measureUnitId }}
                                                options={Mesures()}
                                                onChange={(e: any) => setMeasureUnitId(e.value)}
                                            />
                                            {measureUnitId === 0 ? (<p className="text-danger"> لطفایک واحد  را انتخاب کنید </p>) : (<p></p>)}
                                        </div>

                                        <div className="col-lg-6 col-sm-12 mt-3" >
                                            <label>گروه کالا</label>
                                            <Select
                                                required={true}
                                                menuShouldScrollIntoView={false}
                                                placeholder="گروه کالا ..."
                                                options={inputProductG()}
                                                value={currentProductG()}
                                                onChange={(e: any) => setGroupId(e.value)}
                                            />
                                        </div>

                                        <div className='col-12'>
                                        <ProductAttachments order={null} params={params}
                                    closeModalForUpload={closeModalForUpload}
                                    modalIsOpenUpload={modalIsOpenUpload}
                                    setIsOpenUpload={setIsOpenUpload} />
                                    </div>

                                    </div>
                                </div>

                                <div className='col-6 '>
                                    <button type="button" onClick={submit} disabled={loading && measureUnitId === 0} className="btn btn-success float-right " >تایید  <ClipLoader

                                        loading={loading}
                                        color="#ffff"
                                        size={15}
                                    /></button>
                                </div>
                                <div className='col-6 '>
                                    <NavLink to='/admin/productList' className="btn btn-danger ">بازگشت</NavLink>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>

            </div>

           
            <ProductWareHouseEdit id={params.id} submit={isSubmit} />

        </div>
    )
}
export default EditProduct