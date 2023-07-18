import React from 'react';
import { ChartLineCount } from "../../Common/Shared/Chart/chartLineCount"
import { ChartLineValue } from "../../Common/Shared/Chart/chartLineValue";
import { useEffect, useState } from "react";
import { GetPeriodicSalesReport } from "../../services/reportService";
import { ChartPayment } from '../../Common/Shared/Chart/ChartPayment';
import { ChartShippingReport } from '../../Common/Shared/Chart/ChartShippingReport';
import LazyLoad from "react-lazy-load";
import { PolarChart } from '../../Common/Shared/Chart/PolarChart';


const ChartMain: React.FC = () => {
    const [datas, setDatas] = useState(getDataReport().datas ? getDataReport().datas : [])
    const [PriceUnitId, setPriceUnitId] = useState(getDataReportValue().PriceUnitId ? getDataReportValue().PriceUnitId : 4)
    const [Length, setLength] = useState(getDataReportValue().Length ? getDataReportValue().Length : 7)
    const [TypeId, setTypeId] = useState(getDataReportValue().TypeId ? getDataReportValue().TypeId : 3)
    let d = new Date();
    d.setTime(d.getTime() + (60 * 1000));
    let expires = d.toUTCString();
    const dataReport = {
        expiresAt: expires,
        datas
    }
    const totalDuration = 1450;
    const delayBetweenPoints = totalDuration / datas.length;
    const previousY = (ctx: any) => ctx.index === 0 ? ctx.chart.scales.yAxes.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
    const animation = {
        x: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: NaN, // the point is initially skipped
            delay(ctx: any) {
                if (ctx.type !== 'data' || ctx.xStarted) {
                    return 0;
                }
                ctx.xStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        },
        y: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: previousY,
            delay(ctx: any) {
                if (ctx.type !== 'data' || ctx.yStarted) {
                    return 0;
                }
                ctx.yStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        }
    };
    const valueReport = {
        Length,
        PriceUnitId,
        TypeId,
    }
    function getDataReport() {
        let items = JSON.parse(String(sessionStorage.getItem('dataReport')));
        return items ? items : ''


    }
    function getDataReportValue() {
        let items = JSON.parse(String(localStorage.getItem('valueDataReportOrder')));
        return items ? items : ''


    }
    const GetReport = async () => {

        try {
            const { data, status } = await GetPeriodicSalesReport(TypeId, PriceUnitId, Length)

            setDatas(data.result.ordersPerSchedule)
            dataReport.datas = data.result.ordersPerSchedule
            sessionStorage.setItem('dataReport', JSON.stringify(dataReport));

        } catch (e) {
            console.log(e)
        }

    }
    useEffect(() => {

        if (getDataReport().expiresAt < new Date().toUTCString()) {
            sessionStorage.removeItem("dataReport")

        }
        if (!getDataReport().expiresAt) {
            GetReport()
            sessionStorage.setItem('dataReport', JSON.stringify(dataReport));

        } else if (TypeId || PriceUnitId || Length) {
            GetReport()

        }
        localStorage.setItem('valueDataReportOrder', JSON.stringify(valueReport));

    }, [TypeId, PriceUnitId, Length])


    return (
        <div className=" row sales mt-3 ">

            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12  ">
                <LazyLoad threshold={1} offset={1000}>

                    <ChartLineCount Length={Length} setLength={setLength} animation={animation} TypeId={TypeId} datas={datas} setTypeId={setTypeId} />
                </LazyLoad>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12  ">
                <LazyLoad threshold={1} offset={1000}>

                    <ChartLineValue Length={Length} setLength={setLength} PriceUnitId={PriceUnitId} setPriceUnitId={setPriceUnitId} animation={animation} TypeId={TypeId} datas={datas} setTypeId={setTypeId} />
                </LazyLoad>
            </div>
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12  ">
                <LazyLoad threshold={1} offset={1200}>

                    <ChartPayment />
                </LazyLoad>
            </div>
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12  ">
                <LazyLoad threshold={1} offset={1200}>

                    <ChartShippingReport />
                </LazyLoad>

              
            </div>
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12  ">
                <LazyLoad threshold={1} offset={1200}>

                <PolarChart />
                </LazyLoad>

              
            </div>

        </div>
    )
}
export default ChartMain