import {GetScheduleJobsReport} from "../../../services/reportService";
import {useEffect, useState} from "react";
import {GrUpdate} from "react-icons/gr"
const ScheduleJob:React.FC = () => {
  const [report , setReport] = useState(getDataScheduleJob().report?getDataScheduleJob().report:[])
    let d = new Date();
    d.setTime(d.getTime() +  (60 * 1000));
    let expires =  d.toUTCString();
    const dataScheduleJob = {
        expiresAt: expires,
        report
    }
    function getDataScheduleJob() {
        let items = JSON.parse(String(sessionStorage.getItem('dataScheduleJob')));
        return items ? items : ''


    }

    useEffect(()=>{
        const GetData =async () => {
            try {
                const {data , status} = await GetScheduleJobsReport()
                setReport(data.result.scheduledJobs)
                dataScheduleJob.report=data.result.scheduledJobs
                sessionStorage.setItem('dataScheduleJob', JSON.stringify(dataScheduleJob));

            }catch (e) {
                console.log(e)
            }

        }
        if (getDataScheduleJob().expiresAt < new Date().toUTCString()){
            sessionStorage.removeItem("dataScheduleJob")


        }if (!getDataScheduleJob().expiresAt){
GetData()

        }
    },[])
    return(
        <div className=" ltr scheduleJob " >
            <div className="widget widget-activity-four">

                <div className="widget-heading">
                    <h5 className="">فعالیت های اخیر</h5>
                </div>

                <div className="widget-content">

                    <div className=" mx-auto">
                        <div className="timeline-line">
    {report.map((item:any , index:number)=>
    // <div key={index} className="   rounded cronJob" style={{direction:"rtl",backgroundColor:"white",padding:"14px 19px",border:" 2px solid #e0e6ed", borderRadius: "8px",marginBottom: "4px"}}>
        <div key={index} className={item.type === "باربری" ? "item-timeline timeline-primary" : item.type === "بازارگاه" ? "item-timeline timeline-danger" : "item-timeline  timeline-warning"}>
            <div className="t-dot" data-original-title="" title="">
            </div>
            <div className="t-text">

                <p><span style={{fontSize:"15px"}}><b>{item.type} :</b></span>{item.message}</p>
        <span  className="">
            {new  Date(item.createDate).toLocaleDateString('fa-IR') === new Date().toLocaleDateString('fa-IR') ?  " امروز" + "  " +  new  Date(item.createDate).toLocaleTimeString('fa-IR') :new  Date(item.createDate).toLocaleString('fa-IR') === new  Date().toLocaleString('fa-IR') ?"همین الان" :new  Date(item.createDate).toLocaleString('fa-IR')   }
        </span>
    </div>
    </div>
    // </div>
    )}
        </div>
        </div>
        </div>
        </div>
        </div>
    )
}
export default  ScheduleJob