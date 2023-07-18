import React, { Fragment, useEffect, useState, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { SetProduct } from "../../../services/productService";

import { toast } from 'react-toastify';
import Select from 'react-select';
import { SetProductWareHouses } from "../../../services/prodcutWarehouse";
import { MeasureUnitSample } from "../../../Common/Enums/MeasureUnitSample";
import { GetAllWareHouses } from "../../../services/wareHouseService";
import { GetAttribute, SetAttributeValues } from "../../../services/attributeService";
import { GetGroupsForEntity } from "../../../services/GroupService";
import { ClipLoader } from "react-spinners";
import { GetCompanyChild } from '../../../services/companiesService';
import { GetGroupWithCompany } from '../../../services/GroupService';
import { Formik, Form, Field } from 'formik';
import { validatAlpha, validatENAlpha, validatmin10, validatNumber } from "../../../Utils/validitionParams";


const NewProduct: React.FC = () => {
    const navigate = useNavigate();
    const [warehouse, setwarehouse] = useState([]);
    const [active, setActive] = useState(true)
    const [name, setName] = useState('')
    const [englishName, setEnglishName] = useState('')
    const [price, setPrice] = useState(0)
    const [minSellableAmount, setMinSellableAmount] = useState(0)
    const [maxSellableAmount, setMaxSellableAmount] = useState(0)
    const [measureUnitId, setMeasureUnitId] = useState(0)
    const [measureUnit, setMeasureUnit] = useState(0);
    let productId = 0;
    const [group, setGroup] = useState([])
    const [groupId, setGroupId] = useState(0)
    const [wareHouseId, setwareHouseId] = useState(0);
    const [productG, setProductG] = useState([])
    const [attValue, setAttValue] = useState('')
    const [loading, setLoading] = useState(false);
    let [companyId, SetcompanyId] = useState()
    let [companyName, SetCompanyName] = useState()
    const [userCompanies, setUserCompanies] = useState<any>([])
    const[imageList,SetimageList]=useState({})



    const getCompanies = async () => {
        try {
            const { data, status } = await GetCompanyChild()
            setUserCompanies(data.result.companies)
            SetcompanyId(data.result.companies[0].id)
            SetCompanyName(data.result.companies[0].name)


        } catch (error) {

        }

    }
    const GetProductGroup = async (companyId: any) => {
        if (userCompanies.length === 1) {
            try {

                const { data, status } = await GetGroupWithCompany(2, userCompanies[0].id);
                setProductG(data.result.groups)

            } catch (error) {

            }

        }
        else {

            if(companyId!==undefined && companyId>0)
            try {
                const { data, status } = await GetGroupWithCompany(2, companyId);
                setProductG(data.result.groups)

            } catch (error) {

            }

        }


    }

    // const GetProductGroup = async () => {
    //     const { data, status } = await GetAttribute(1003);
    //     if (status === 200) {

    //         const response = data.result.attribute.controlTypeValues;

    //         const myArray = response.split(",");
    //         const FormateValue = () => {

    //             return (myArray.map(data => ({ id: Number(data.slice(0, 1)), value: data.slice(2, 100) })))
    //         }

    //         setProductG(FormateValue());
    //     }

    // }

    const product = {
        name:name,
        englishName:englishName,
        price,
        active,
        minSellableAmount,
        maxSellableAmount,
        measureUnitId,
        measureUnit: measureUnitId,
        groupId,
        companyId, companyName

    };

    const setAttributevalue = async () => {

        const attribute = {
            "attributeValues": [
                {

                    attributeTypeId: 1003,
                    entityId: productId,
                    value: `${attValue}`
                }
            ]
        }

        try {
            const { data, status } = await SetAttributeValues(attribute)
        } catch (error) {
            console.log(error);
        }
    }
    const setproductware = async () => {
        const wareProduct = {
            productWareHouses: [{
                productId,
                wareHouseId,
                wareHouseName: "",
                quantity: 0,
                consumableQuantity: 0,
                reservedQuantity: 0

            }]
        }
        try {
            const { data, status } = await SetProductWareHouses(wareProduct)
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
                navigate('/admin/productList')

            }

        } catch (error) {
            console.log(error)
        }



    }

    useEffect(() => {



        getCompanies()


    }, []);


    useEffect(() => {
        GetProductGroup(companyId);
    }, [companyId])

    const submit = async () => {
        setLoading(true)
        try {
            const { data, status } = await SetProduct(product);
            if (status === 200) {
                setLoading(false)
                productId = (data.result.product.id);
                toast.success("اطلاعات با موفقیت ثبت شد", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                });
                navigate('/admin/productList')

            }

            // await setAttributevalue();
            setLoading(false)

        }



        catch (error) {
            console.log(error);
            setLoading(false)


        }

        setLoading(false)


    };

    const Mesures = () => {
        return (MeasureUnitSample.map((data: any) => ({ label: data.name, value: data.id })));
    }
    const inputWarehouses = () => {
        return (warehouse.map((data: any) => ({ label: data.name, value: data.id })));
    }
    const inputProductG = () => {
        return (productG.map((data: any) => ({ label: data.name, value: data.id })))
    }
    const companys = () => {
        return (userCompanies.map((item: any) => ({ label: item.name, value: item.id })))

    }
    let defaultValue = companys()[0]


    return (

        <div className='user-progress' >
            <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 p-3 m-2'>
                    <h5 >تعریف کالا</h5>
                    <p>در این بخش می توانید کالای جدید تعریف  کنید.</p>
                </div>
            </div>
            <div className='row d-flex justify-content-center '>
                <div className='   col-md-6 col-xs-12 m-2'>

                    <Formik
                        initialValues={{
                            name,
                            englishName,
                            price,
                            active,
                            minSellableAmount,
                            maxSellableAmount,
                            measureUnitId,
                            measureUnit: measureUnitId,
                            groupId,
                            companyId, companyName
                        }}
                        enableReinitialize={true}
                        onSubmit={values => {
                            // same shape as initial values
                            submit()
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
                                {userCompanies.lenght !== 1 ?
                                            <div className="col-lg-4  textOnInput">

                                                <label> شرکت</label>
                                                <Select
                                                    menuShouldScrollIntoView ={false}
                                                    defaultValue={defaultValue}
                                                    placeholder='نام شرکت'
                                                    options={companys()}
                                                    key={defaultValue}
                                                    isClearable={true}
                                                    onChange={e => {


                                                        SetcompanyId(e.value)
                                                        SetCompanyName(e.label)


                                                    }

                                                    }

                                                />


                                            </div> : ''}
                                <div className={userCompanies.length>1?"col-lg-4 col-sm-12 form-group mb-4 textOnInput  align-content-between":"col-lg-6 col-sm-12 form-group mb-4 textOnInput  align-content-between"}>

                                    <label>نام کالا</label>
                                    <Field name="name" validate={validatAlpha} type="text" className="form-control opacityForInput" placeholder="کنجاله ، ذرت و..."
                                        value={name} onChange={(e: any) => {
                                            setName(e.target.value)

                                        }} />
                                    {errors.name && touched.name && <div className="text-danger">{errors.name}</div>}

                                </div>
                                <div className={userCompanies.length>1?"col-lg-4 col-sm-12 form-group mb-4 textOnInput":"col-lg-6 col-sm-12 form-group mb-4 textOnInput"}>
                                    <label>نام لاتین </label>
                                    <Field name="englishName" validate={validatENAlpha} type="text" className="form-control opacityForInput" placeholder="... Corn Seed "
                                        value={englishName} onChange={(e: any) => {
                                            setEnglishName(e.target.value)

                                        }} />
                                    {errors.englishName && touched.englishName && <div className="text-danger">{errors.englishName}</div>}

                                </div>

                                <div className=" col-lg-12 col-sm-12  form-group mb-4 textOnInput">
                                    <div className='form-row'>
                                        <div className= 'col-lg-6' >

                                            <label>واحد</label>

                                            <Select
                                                menuShouldScrollIntoView ={false}
                                                name="measureUnitId"
                                                onBlur={() => setFieldTouched('measureUnitId', true)}
                                                onChange={( e: any) => {
                                                    setMeasureUnitId(e.value)
                                                }}
                                                placeholder="واحد"
                                                options={Mesures()}

                                            />
                                            {measureUnitId === 0 ? <div className="text-danger">پر کردن فیلد الزامیست</div> : null}

                                        </div>

                                        <div className= 'col-lg-6' >
                                            <label>گروه کالا</label>

                                            <Select
                                                menuShouldScrollIntoView ={false}
                                                placeholder="گروه کالا"
                                                options={inputProductG()}
                                                onBlur={() => setFieldTouched('groupId', true)}
                                                onChange={(e: any) => {

                                                    setGroupId(e.value)

                                                }}
                                                name="groupId"
                                            />

                                            {groupId === 0 ? <div className="text-danger">پر کردن فیلد الزامیست</div> : null}

                                        </div>
                                        



                                        
                                    </div>
                                </div>


                               
                              
                                    <div className='col-6 '>
                                        <button type="submit" disabled={loading && measureUnitId === 0} className="btn btn-success float-right " >تایید  <ClipLoader

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
                </div >
            </div >
        </div>

    );
}
export default NewProduct