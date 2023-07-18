
import { toast } from "react-toastify";
import { PriceUnitEnums } from "../../../Common/Enums/PriceUnit";
import { CreateCredit, GetCreditById } from "../../../services/creditService";
import { setCredit } from "../../../store/Slice/credit/CreditSlice";

interface Props {
  values: any;
  navigate: any;
  dispatch: any;
    setLoading:any
}

export const submitCreateCredit = async (props: Props ) => {
    props.setLoading(true)
try {
    const { data, status } = await CreateCredit(props.values);
    props.dispatch(setCredit(props.values));
    if (status === 200) {
      toast.success("اطلاعات با موفقیت ثبت شد", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      props.navigate("/admin/Credits");
    }
  } catch (error) {
    console.log(error);
  }
    props.setLoading(false)

};

export const units = () => {
  return PriceUnitEnums.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
};
interface PropsId {
  id:any,
  dispatch:any
}
export const getCredit = async (props:PropsId ) => {

  try {
      const { data, status } = await GetCreditById(props.id)
      if (status === 200) {
        props.dispatch(setCredit(data.result.credit));

      }

  } catch (error) {
      console.log(error);

  }


}

