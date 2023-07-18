import { toast } from "react-toastify";
import { EntityTypes } from "../../../Common/Enums/EntityTypesEnums";
import { SetGroup } from "../../../services/GroupService";

export const entityTypes = () => {
    return (EntityTypes.map(data => ({ label: data.name, value: data.id })));
}


export const submitGroupCreator = async (event:any) => {
    const formData = new FormData(event.target)
   
    const name = formData.get("name")
    const entityTypeId =formData.get("entityTypeId")
    const body={
        group:{
            id:0,
            entityTypeId,
            name
        }
    }
    event.preventDefault();
    try {

        const { data, status } = await SetGroup(body);
        if (status === 200) {
            toast.success('گروه جدید ایجاد شد',
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

    } catch (error) {
       
    }


}