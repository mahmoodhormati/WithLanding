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
import {Line} from 'react-chartjs-2';
import {GetPeriodicSalesReport} from "../../../services/reportService";
import {useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import { ScheduleTypes } from '../../Enums/scheduleTypes';
import Select from "react-select";
import {ComboDays} from "../../../Utils/OptionSelectBoxDays";
import {ComboPrice} from "../../../Utils/OptionSelectBoxPrice";

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
let delayed;




export function ChartLineCount({datas , setTypeId, TypeId , animation , setLength , Length}) {
    const [show ,setShow] =useState(false)

if (datas && datas.length >0){
    const labels =datas.map(item=>item.scheduleName)
    const options = {
        responsive: true,
        maintainAspectRatio: false,
    backgroundColor: "blue",
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
                    padding: 4,
                    font: {
                        family: "diroz", // Add your font here to change the font of your x axis
                        size: 8
                    },
    
                    major: {
                        enable: true
                    }
                }
            },
            xAxes: {
                barPercentage: 1.6,
                grid: {
                    borderDash: [10, 10],
                    display: false,
                    zeroLineColor: "transparent"
                },
                ticks: {
                    padding: 4,
                    font: {
                        family: "diroz", // Add your font here to change the font of your x axis
                        size: 8
                    },
    
                    major: {
                        enable: false
                    }
                }
            }
        }
    };
    
    const data = {
        labels,
        datasets: [
            {
                fill: true,
                // label: " سفارشات",
                data: datas.map(item=>item.orderCount),
                borderColor: 'rgb(27, 85, 226)',
                backgroundColor: "rgb(27, 85, 226 ,0.2)",
                pointStyle: 'circle',
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBorderColor:"#ffffff",
                pointBackgroundColor:'rgb(27, 85, 226)',
               shadowBlur : 10,
                shadowOffsetX : 0,
                shadowOffsetY : 4,
            },


        ],
    };
    const ChangHandler = (e) =>{
        setTypeId(e.value)
        setLength(
            e.value === 1 ? Length > 3? 3 : Length : e.value === 2 ?Length > 12? 12 : Length : e.value === 3 ? Length > 30? 30 : Length   :e.value ===4? Length > 24? 24 : Length  : 60

        )

    }
    return (
    <div id="chartArea" className="col-xl-12 layout-spacing">
        <div className="widget widget-chart-three">
            <div className="widget-heading">
                <div className="d-inline float-left">
                    <h5 className=""> تعداد سفارشات</h5>
                </div>
                <div className="d-inline float-left px-2">
                <span >{Length  + " "+ ScheduleTypes.filter(i=> i.value === `${TypeId}`).map(i=> i.label) + " "+ "اخیر"}</span>
                </div>
                <div className="   d-inline float-right ">

                    <svg onClick={()=> setShow(!show)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         className="feather feather-more-horizontal">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                    </svg>



                    {show?
                        <div className="dashboard-widget p-3 position-absolute dwrap" >
                            <div  className='row form-row textOnInput mb-4'>
                                <div className='col-md-6 mt-4 '>
                                    <div className="quantity-field w-100">
                                        <button className="value-button increase-button" onClick={() => Length >= (TypeId === 1 ? 3 : TypeId === 2 ? 12: TypeId === 3 ? 30 :TypeId ===4 ? 24 : 60) ? setLength(TypeId === 1 ? 3 : TypeId === 2 ? 12: TypeId === 3 ? 30 :TypeId ===4? 24 : 60):  setLength(Number(Length) + 1)}>+
                                        </button>
                                        <input   className="number"  onKeyUp={() => Length > (TypeId === 1 ? 3 : TypeId === 2 ? 12: TypeId === 3 ? 30 :TypeId ===4 ? 24 : 60) ? setLength(TypeId === 1 ? 3 : TypeId === 2 ? 12: TypeId === 3 ? 30 :TypeId ===4? 24 : 60): Length} type="number" placeholder="بازه زمانی"
                                                 min={1}  value={Length} onChange={(e)  => setLength(e.target.value)} />
                                        <button className="value-button decrease-button "  onClick={() =>Length > 1 ? setLength(Number(Length) - 1) : setLength(1)}> --
                                        </button>
                                    </div>
                                </div>
                                <div className='col-md-6 mt-4  textOnInput form-group' >
                                    <div className=" form-control-sm">
                                        <label>  برنامه زمانی </label>

                                        <Select
                                            menuShouldScrollIntoView ={false}
                                            placeholder="  برنامه زمانی  "
                                            options={ComboDays()}
                                            onChange={(e)=> ChangHandler(e)}
                                            defaultValue={ComboDays().filter((i)=> i.value === TypeId).map((i)=> i)}

                                        />
                                    </div>

                                </div>


                            </div>




                        </div>: null}
                </div>
            </div>
            <div className="btn-group m-2" role="group" aria-label="Basic example">
            </div>
            {/*<div className="widget-heading">*/}
            {/*    <h5 className="">درآمد</h5>*/}

            {/*</div>*/}
            <div className="widget-content  pt-3 border-top" style={{height: "300px"}}>

                <Line options={options} data={data}/>
            </div>
        </div>
    </div>
)}else {
    return null
}

}
