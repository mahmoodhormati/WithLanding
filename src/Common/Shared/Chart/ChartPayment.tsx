import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { GetPaymentsReport, GetPeriodicSalesReport } from "../../../services/reportService";
import { useEffect, useState } from "react";
import QueryString from 'qs';
import { ScheduleTypes } from '../../Enums/scheduleTypes';
import { formatter } from '../../../Utils/Formatter';
import Select from "react-select";
import { ComboDays } from "../../../Utils/OptionSelectBoxDays";
import { ComboPrice } from "../../../Utils/OptionSelectBoxPrice";


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);



export function ChartPayment() {
    const [datas, setDatas] = useState<any>([])
    const [ScheduleTypeId, setScheduleTypeId] = useState(getDataReportValue().ScheduleTypeId ? getDataReportValue().ScheduleTypeId : 3)
    const [PriceUnitId, setPriceUnitId] = useState(getDataReportValue().PriceUnitId ? getDataReportValue().PriceUnitId : 4)
    const [show, setShow] = useState(false)
    const [Length, setLength] = useState(getDataReportValue().Length ? getDataReportValue().Length : 7)
    const [PaymentMethodId, setPaymentMethodId] = useState<any>(getDataReportValue().PaymentMethodId ? getDataReportValue().PaymentMethodId : 0)
    const valueReport = {
        Length,
        PriceUnitId,
        ScheduleTypeId,
        PaymentMethodId,

    }
    function getDataReportValue() {
        let items = JSON.parse(String(localStorage.getItem('valueDataReportPayment')));
        return items ? items : ''


    }
    const totalDuration = 2000;
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


    useEffect(() => {
        const GetReport = async () => {
            try {
                let config = {

                    headers: { 'Content-Type': 'application/json' },

                    params: {
                        ScheduleTypeId,
                        PaymentMethodId,
                        PriceUnitId,
                        Length

                    },
                    paramsSerializer: (params: any) => {

                        return QueryString.stringify(params)
                    }


                };
                const { data, status } = await GetPaymentsReport(config)

                setDatas(data.result.paymentsPerSchedule)

            } catch (e) {
                console.log(e)
            }

        }

        if (ScheduleTypeId || PaymentMethodId || PriceUnitId || Length) {
            GetReport()
        }
        localStorage.setItem('valueDataReportPayment', JSON.stringify(valueReport));

    }, [ScheduleTypeId, PaymentMethodId, PriceUnitId, Length])

    if (datas && datas.length > 0) {


        let labels = datas.map((item: any) => item.current === true ? item.scheduleName + " " + "(اکنون)" : item.scheduleName)

        const data: any = {
            labels: labels,
            datasets: [
                {
                    label: 'پرداخت شده',
                    data: datas.map((i: any) => i.paid),
                    borderColor: 'rgb(70,194,101)',
                    backgroundColor: 'rgb(70,194,101,0.2)',
                    fill: true,
                    pointStyle: 'circle',

                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBorderColor: "#ffffff",
                    pointBackgroundColor: 'OliveDrab',
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowOffsetY: 4,

                }, {
                    label: 'پرداخت نشده',
                    data: datas.map((i: any) => i.notPaid),
                    borderColor: "red",
                    backgroundColor: "#e7515a87",
                    fill: true,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBorderColor: "#ffffff",
                    pointBackgroundColor: 'red',
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowOffsetY: 4,
                }, {
                    label: 'کل',
                    data: datas.map((i: any) => i.total),

                    borderColor: 'rgb(27, 85, 226)',
                    backgroundColor: "rgb(27, 85, 226 ,0.2)",
                    fill: true,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBorderColor: "#ffffff",
                    pointBackgroundColor: 'blue',
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowOffsetY: 4,
                },

            ]
        };

        const config: any = {
            responsive: true,
            maintainAspectRatio: false,

            animation,
            interaction: {
                intersect: false
            },
            elements: {
                point: {
                    radius: 0,
                    hoverRadius: 5,
                    hitRadius: 20,

                },
                line: {
                    tension: 0.4
                }
            },
            plugins: {

                legend: {
                    rtl: true,
                    display: false,
                    labels: {
                        yPadding: '10',
                        position: 'left',
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                            family: "diroz"
                        }
                    },

                },
                dataLabels: {
                    display: true,
                    color: "white",
                },
                tooltip: {
                    previousBodyPadding: 'circle',
                    usePointStyle: true,
                    backgroundColor: "rgba(23,21,21,0.78)",
                    Color: "#333",
                    bodyFontColor: "#666",
                    bodySpacing: 4,
                    xPadding: 12,
                    mode: "nearest",
                    intersect: 0,
                    position: "nearest",
                    bodyFont: {
                        family: "diroz",
                        size: 8


                    },
                    titleFont: {
                        family: "diroz",
                        size: 10

                    }
                },

            },

            scales: {

                yAxes: {

                    barPercentage: 1.6,
                    grid: {
                        // borderDash: [10, 10],
                        drawBorder: false,

                        display: true,
                        zeroLineColor: "transparent"
                    },
                    ticks: {
                        callback: function (value: any, index: any, array: any) { return formatter.format(value) },
                        padding: 4,
                        font: {
                            family: "diroz", // Add your font here to change the font of your x axis
                            size: 8
                        },

                        major: {
                            enable: false
                        }
                    },

                },
                xAxes: {


                    barPercentage: 1.6,
                    grid: {
                        borderDash: [10, 10],
                        display: (c: any) => {

                            return c.scale.ticks.map((i: any) => i.label.includes("اکنون")) ? false : true
                        },
                        zeroLineColor: "transparent"
                    },
                    ticks: {

                        rtl: false,
                        color: (c: any) => {
                            return c.tick.label.includes('اکنون') ? "red" : "gray"
                        },
                        padding: 4,
                        font: {
                            family: "diroz", // Add your font here to change the font of your x axis
                            size: 8,
                            weight: 500,
                        },

                        major: {
                            enable: false
                        }
                    }
                }
            }
        };
        const ChangHandler = (e: any) => {
            setScheduleTypeId(e.value)
            setLength(
                e.value === 1 ? Length > 3 ? 3 : Length : e.value === 2 ? Length > 12 ? 12 : Length : e.value === 3 ? Length > 30 ? 30 : Length : e.value === 4 ? Length > 24 ? 24 : Length : 60

            )

        }
        return (
            <div id="chartArea" className="col-xl-12 layout-spacing">
                <div className="widget widget-chart-three">
                    <div className="widget-heading ">
                        <div className="d-inline float-left">
                            <h5 className=""> گزارش پرداخت ها</h5>
                        </div>
                        <div className="d-inline float-left px-2">
                            <span >{Length + " " + ScheduleTypes.filter((i: any) => i.value === `${ScheduleTypeId}`).map((i: any) => i.label) + " " + "اخیر"}
                                {" "}
                                در مقیاس
                                {" "}
                                {PriceUnitId === 1 ? "ریال" : PriceUnitId === 2 ? "تومان" : PriceUnitId === 4 ? "  میلیون تومان" : null}
                            </span>
                        </div>

                        <div className="   d-inline float-right ">

                            <svg onClick={() => setShow(!show)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className="feather feather-more-horizontal">
                                <circle cx="12" cy="12" r="1"></circle>
                                <circle cx="19" cy="12" r="1"></circle>
                                <circle cx="5" cy="12" r="1"></circle>
                            </svg>



                            {show ?
                                <div className="dashboard-widget p-3 position-absolute dwrap" >
                                    <div className='row form-row mb-4 '>
                                        <div className='col-md-4 mt-4 '>

                                            <div className="quantity-field w-100">
                                                <button className="value-button increase-button" onClick={() => Length >= (ScheduleTypeId === 1 ? 3 : ScheduleTypeId === 2 ? 12 : ScheduleTypeId === 3 ? 30 : ScheduleTypeId === 4 ? 24 : 60) ? setLength(ScheduleTypeId === 1 ? 3 : ScheduleTypeId === 2 ? 12 : ScheduleTypeId === 3 ? 30 : ScheduleTypeId === 4 ? 24 : 60) : setLength(Number(Length) + 1)}>+
                                                </button>
                                                <input className="number" onKeyUp={() => Length > (ScheduleTypeId === 1 ? 3 : ScheduleTypeId === 2 ? 12 : ScheduleTypeId === 3 ? 30 : ScheduleTypeId === 4 ? 24 : 60) ? setLength(ScheduleTypeId === 1 ? 3 : ScheduleTypeId === 2 ? 12 : ScheduleTypeId === 3 ? 30 : ScheduleTypeId === 4 ? 24 : 60) : Length} type="number" placeholder="بازه زمانی"
                                                    min={1} value={Length} onChange={(e: any) => setLength(e.target.value)} />
                                                <button className="value-button decrease-button " onClick={() => Length > 1 ? setLength(Number(Length) - 1) : setLength(1)}> --
                                                </button>
                                            </div>
                                        </div>
                                        <div className='col-md-4 mt-4 textOnInput form-group' >
                                            <div className=" form-control-sm">
                                                <label>  برنامه زمانی </label>

                                                <Select
                                                    menuShouldScrollIntoView={false}
                                                    placeholder="  برنامه زمانی  "
                                                    options={ComboDays()}
                                                    onChange={(e: any) => ChangHandler(e)}
                                                    defaultValue={ComboDays().filter((i: any) => i.value === ScheduleTypeId).map((i: any) => i)}
                                                />
                                            </div>

                                        </div>
                                        <div className='col-md-4 mt-4  textOnInput form-group' >
                                            <div className=" form-control-sm">
                                                <label> واحد قیمت </label>

                                                <Select
                                                    menuShouldScrollIntoView={false}
                                                    placeholder="  واحد قیمت  "
                                                    options={ComboPrice()}
                                                    onChange={(e: any) => setPriceUnitId(e.value)}
                                                    defaultValue={ComboPrice().filter((i: any) => i.value === PriceUnitId).map((i: any) => i)}

                                                />
                                            </div>

                                        </div>

                                    </div>




                                </div> : null}
                        </div>
                    </div>





                    <div className="btn-group m-2" role="group" aria-label="Basic example">
                    </div>
                    <div className="widget-heading ">
                        <span className="m-auto text-dark">نحوه پرداخت</span> :
                        <div className='d-inline p-2 '>

                            <input type="radio" className='mx-1' checked={PaymentMethodId === 0} onChange={() => setPaymentMethodId(0)} />
                            کل
                        </div>
                        <div className='d-inline p-2 '>

                            <input type="radio" className='mx-1' checked={PaymentMethodId === 2} onChange={() => setPaymentMethodId(2)} />
                            نقدی
                        </div>
                        <div className='d-inline p-2 '>

                            <input type="radio" className='mx-1' checked={PaymentMethodId === 4} onChange={() => setPaymentMethodId(4)} />
                            اعتباری(چک)
                        </div>



                    </div>
                    <div className="widget-content  pt-3 border-top" style={{ height: "300px" }}>

                        <Line options={config} data={data} />
                    </div>
                </div>
            </div>
        )
    } else {
        return (<div className="text-center dashboard-widget p-3 my-2">

            <div>اطلاعاتی برای نمایش وجود ندارد</div>
        </div>)
    }
}
