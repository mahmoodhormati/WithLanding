import { GetSimplifiedReports } from "../../../services/reportService";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { BsFillArrowLeftCircleFill } from "react-icons/bs"
import { ReportEntityStyle } from "../../Enums/ReportEntityStyle";

const ReportBlock = () => {
    const [report, setReport] = useState(getDataReportBlock().report?getDataReportBlock().report:[])
    let d = new Date();
    d.setTime(d.getTime() +  (60 * 1000));
    let expires =  d.toUTCString();

    const dataReportBlock = {
        expiresAt: expires,
        report
    }
    function getDataReportBlock() {
        let items = JSON.parse(sessionStorage.getItem('dataReportBlock'));
        return items ? items : ''


    }
    const getReport = async () => {
        try {
            const { data, status } = await GetSimplifiedReports()
            setReport(data.result.simplifiedReports)
            dataReportBlock.report=data.result.simplifiedReports
            sessionStorage.setItem('dataReportBlock', JSON.stringify(dataReportBlock));

        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {

        if (getDataReportBlock().expiresAt < new Date().toUTCString()){

            sessionStorage.removeItem("dataReportBlock")


        }
        if (!getDataReportBlock().expiresAt){

            getReport()


        }

    }, [])
    if (report){
        return (<div className="widget  shadow  sliderReport" >
        <div className="row  justify-content-lg-center" style={{ zIndex: "2", backgroundColor: 'white' }}>


            {report.map((item , index) =>

                ReportEntityStyle.map(i => i.id === item.entityTypeId ?

                    <div className="col-lg-2 col-md-3 col-sm-4 mb-3 mr-lg-2 " key={i.id}>

                        <div   className="" style={{ zIndex: '1', position: 'relative', animation:  "changeRight 1s "  }} >
                            <NavLink to={i.path}>
                                <div className="rounded p-2 mb-1 mt-2" style={{
                                    backgroundColor: `${i.color}`,
                                    backgroundImage: `${i.icon}`, backgroundRepeat: 'no-repeat'
                                }}>
                                    <h1 style={{ color: 'white' }}>{item.count}</h1>
                                    <p style={{ color: 'white' }}>{i.name}</p>

                                </div>
                                <div className="text-center text-light rounded p-2 " style={{ backgroundColor: `${i.colorLink}`, marginTop: '-10px' }}>
                                    اطلاعات بیشتر
                                    {""}
                                    <BsFillArrowLeftCircleFill />

                                </div>
                            </NavLink>

                        </div>


                    </div>
                    :null) )}

        </div>


    </div >)
    }else {
        return (<div className="widget  shadow sliderReport" >
            <div className="row justify-content-center " style={{ zIndex: "2", backgroundColor: 'white' }}>


               <div>
                   <span className="taxt-center">اطلاعاتی برای نمایش یافت نشد</span>
               </div>

            </div>


        </div >)

    }
}
export default ReportBlock