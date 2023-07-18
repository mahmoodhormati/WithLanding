import { useEffect, useState } from "react";
import { HiOutlineUserCircle } from "react-icons/hi";
import { useParams, useNavigate } from "react-router-dom";
import { GaugeChartCustom } from "../../../Common/Shared/Chart/GaugeChartCustom";
import { GetCoutaggeBrief } from "../../../services/reportService";
import GaugeChart from 'react-gauge-chart'
import { AiOutlineArrowRight } from "react-icons/ai";
import { ChartBar } from "../../../Common/Shared/Chart/ChartBar";

const CoutaggeBrief: React.FC = () => {
    const params = useParams()
    const [Berief, setBrief] = useState<any>([])
    const navigate = useNavigate()


  const GetCoutaggeBerief = async () => {
    try {
      const { data, status } = await GetCoutaggeBrief(params.id);
      setBrief(data.result.result);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    GetCoutaggeBerief()

}, [])

const handelBack = () => {
    navigate(-1)
}

  return (
    <div className=" statbox widget-content widget-content-area">
      <div className="row  ">
        <div className="mb-3 text-center col-12">
          <h4 className="text-center">گزارش بر مبنای کوتاژ</h4>
          <button className="border-0 bg-transparent  edit-btn float-left" onClick={handelBack}><AiOutlineArrowRight size={'2rem'} /></button>

        </div>
        <div className="col-12 m-auto">
        
            <div className="row d-flex justify-content-center  ">
              {Berief.map((item: any, index: number) => (
                <>
                  <div className="col-md-3 text-center rounded shadow m-2  ">
                    <h6 className="mt-4 mb-4">{`${item.company.companyName}`}</h6>
                    <ChartBar    data1={item.supplyAmount.quantity} data2={item.salesAmount.quantity} data3={item.externallSalesAmount.quantity} data4={item.internalSalesAmount.quantity} labels={["مقدار تامین" , "مقدار فروش","فروش متفرقه ","فروش سیستمی"]}/>
                   
                  </div>
                </>
              ))}
            </div>
         
        </div>
      </div>
    </div>
  );
};
export default CoutaggeBrief;

   
   