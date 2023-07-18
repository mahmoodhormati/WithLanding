import {useSelector} from "react-redux";
import { RootState } from "../../../store";


interface Props{
    orderWeight:any,TakhsisWeight:any,havalehWeight:any,barbariWeight:any
}

const OrderInfo:React.FC<Props> = ({orderWeight,TakhsisWeight,havalehWeight,barbariWeight}) => {
    const roles = useSelector((state:RootState) => state.roles)
    var formatter = new Intl.NumberFormat("en", {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    });
    return(
      <div className=' row col-lg-12 col-md-12 col-sm-12 col-xs-12 p-4  ' style={{margin:"0"}}>


          < div className="form-group mb-4 textOnInput col-lg-2 rounded border  border-dark m-auto p-2 text-center orderCustomerInfo" >

              <label>وزن سفارش </label>

              <span style={{fontWeight:'bold',color:'black',fontSize:'15px'}}>{formatter.format(orderWeight)}</span>
          </div>
           < div className=" form-group mb-4 textOnInput col-lg-2 rounded border  border-dark m-auto p-2  text-center orderCustomerInfo"  >

              <label>وزن تخصیص</label>

              <span style={{fontWeight:'bold',color:'black',fontSize:'15px'}}>{formatter.format(TakhsisWeight)}</span>
          </div>
          {roles.includes(7) || roles.includes(5) ||roles.includes(8) ?  < div className=" form-group mb-4 textOnInput col-lg-2 rounded border  border-dark  m-auto p-2 orderCustomerInfo text-center" >

              <label>وزن حواله</label>

              <span style={{fontWeight:'bold',color:'black',fontSize:'15px'}}>{formatter.format(havalehWeight)}</span>
          </div>:''}
          < div className=" form-group mb-4 textOnInput col-lg-2 rounded border  border-dark  m-auto p-2  text-center orderCustomerInfo " >

              <label>وزن بارنامه</label>

              <span style={{fontWeight:'bold',color:'black',fontSize:'15px'}}>{formatter.format(barbariWeight)}</span>
          </div>
      </div>
  )
}
export default OrderInfo