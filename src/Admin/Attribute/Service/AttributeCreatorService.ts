import { toast } from "react-toastify";
import { AttributeControlTypes } from "../../../Common/Enums/AttributeControlTypesEnums";
import { EntityTypes } from "../../../Common/Enums/EntityTypesEnums";
import { SetAttribute } from "../../../services/attributeService";
export const entityTypes = () => {
    return (EntityTypes.map(data => ({ label: data.name, value: data.id })));
}
export const Attributes = () => {
    return (AttributeControlTypes.map(data => ({ label: data.name, value: data.id })))
}
export const submitAttribute = async (event:any , setLoading:any) => {
    setLoading(true)
    const formData = new FormData(event.target)
    const controlTypeValue = formData.get( "controlTypeValue" )
    const controlTypeId = formData.get( "controlTypeId" ) 
    const name = formData.get("name")
    const entityTypeId =formData.get("entityTypeId")
       const body = {
        attribute: {
            name,
            entityTypeId,
            controlTypeId,
            controlTypeValue
        }
    }
    
    event.preventDefault();
    try {

        const { data, status } = await SetAttribute(body);
        if (status === 200) {
            toast.success('ویژگی جدید ایجاد شد',
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined
                })
        }
        setLoading(false)


    } catch (error) {
        setLoading(false)

    }
    setLoading(false)


}