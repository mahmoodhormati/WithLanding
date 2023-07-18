import React, {useEffect , Suspense , lazy} from 'react';
import ChartMain from "./chartMain";
import News from '../../Common/Shared/News/news';
import SalesBoardForAdmin from '../../Common/Shared/Common/salesBoardForAdmin';
import ReportBlock from "../../Common/Shared/Chart/reportBlock";
import OverDuePaymentsByAttachments from "../../Common/Shared/Common/OverDuePaymentsByAttachments";
import ScheduleJob from "../Report/Component/ScheduleJob";
import { useState } from 'react';
import GetUndesidedPayments from './../Payment/Component/GetUndesidedPayments';
import LazyLoad from 'react-lazy-load';
import NewSunburstChart from '../../Common/Shared/Chart/NewSunburstChart';

const DashbordAdmin:React.FC = () => {
  const [loading, setLoading] = useState(true);

    useEffect(()=>{
        function reveal() {
            var reveals = document.querySelectorAll(".reveal");

            for (var i = 0; i < reveals.length; i++) {
                var windowHeight = window.innerHeight;
                var elementTop = reveals[i].getBoundingClientRect().top;
                var elementVisible = 150;

                if (elementTop < windowHeight - elementVisible) {
                    reveals[i].classList.add("active");
                }
                    // else {
                //     reveals[i].classList.remove("active");
                // }
            }
        }
        window.scrollTo(0, 0);
        document.getElementsByClassName("main-Layout")[0].addEventListener("scroll", reveal);
    },[window])
  return(
      <div >
          <div className="mb-3">
          <GetUndesidedPayments/>
      </div>
          <div className=" ">
              <ReportBlock/>
          </div>
          <div className="active fade-right">
              <LazyLoad threshold={1}  offset={1000}>
              <ChartMain />
              </LazyLoad>
             
          </div>
          <div className="fade-bottom">
            
          </div>

          <LazyLoad  threshold={1} offset={1200}>
<div className="row mt-3 reveal fade-left">
    
    <div className="col-lg-6 col-sm-12">


   <ScheduleJob/>


</div>
<div className="col-lg-6 col-sm-12 Expanded">



        <News setloading={setLoading} />


    </div>
</div>

          </LazyLoad>




      </div>
  )
}
export default DashbordAdmin