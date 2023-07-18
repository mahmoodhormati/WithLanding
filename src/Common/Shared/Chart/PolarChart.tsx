
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChartControl, ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';
import { GetCustomersDue } from '../../../services/reportService';
import QueryString from 'qs';
import { interpolateHsl, scaleOrdinal, schemeSet3 } from 'd3';
import { PolarArea } from 'react-chartjs-2';
import { formatter } from './../../../Utils/Formatter';
import Select from 'react-select';
import { ComboDays } from '../../../Utils/OptionSelectBoxDays';
import { ComboPrice } from '../../../Utils/OptionSelectBoxPrice';
import { PriceUnitEnums } from '../../Enums/PriceUnit';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);








export function PolarChart() {
  const [reportData, SetReportData] = useState<any>()
  const [customerDues, SetcustomerDues] = useState<any>([])
  const [PriceUnitId, setPriceUnitId] = useState(getDataReportValue().PriceUnitId ? getDataReportValue().PriceUnitId : 2)
  const [show, setShow] = useState(false)

  function getDataReportValue() {
    let items = JSON.parse(String(localStorage.getItem('valueDataReportCustoersDue')));
    return items ? items : ''


}
  const getReport = async () => {
    try {

      let config = {

        headers: { 'Content-Type': 'application/json' },

        params: {

          PriceUnitId


        },
        paramsSerializer: (params: any) => {

          return QueryString.stringify(params)
        }


      };
      const { data, status } = await GetCustomersDue(config)

      SetReportData(data.result.dues)
      SetcustomerDues(data.result.dues.customerDues)
      localStorage.setItem('valueDataReportCustoersDue', JSON.stringify(PriceUnitId));
    } catch (e) {
      console.log(e)
    }

  }

  useEffect(() => {
    getReport()
  }, [PriceUnitId])

  if (reportData && customerDues.length > 0) {
    const color: any = scaleOrdinal(schemeSet3);

    const { totalDue } = reportData


    console.log(totalDue);

    const data: any = {

      labels: customerDues.map((item: any) => item.customerName) as any,
      datasets: [{
        label: customerDues.map((item: any) => item.invoiceIds.map((i: any) => i)),
        data: customerDues.map((item: any) => (item.currentDue)) as any,
        backgroundColor: customerDues.map((item: any, index: any) => color(index))
      }]
    };

    const config: any = {
      responsive: true,
      maintainAspectRatio: false,
      

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
          display: true,
          position: 'right',
         
          labels: {
            // This more specific font property overrides the global property

            font: {
                size: 13,
                family:'diroz'
            }
        }


        },
        dataLabels: {
          display: true,
          color: "blue",
        },
        tooltip: {
          //   callbacks: {
          //     label: function() {
          //        //return text to render for an individual item in the tooltip
          //        return customerDues.map((item: any) => item.invoiceIds.map((i:any)=>i)) 
          //     }
          //  },
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
            size: 10


          },
          titleFont: {
            family: "diroz",
            size: 10

          }
        },

      },
   
      scales: {
        r: {
          ticks: {
            display: true,
            backdropColor:'transparent',
            color:'#BDBDD7'
             // Remove vertical numbers
          },
          grid: {
            display: true ,
            color:'#BDBDD7',
            
            label:{
              color:'red'
            }
            // Removes the circulair lines
          }
        },
       
        
    },
    
    
    
    };


    return (
      <div id="chartArea" className="col-xl-12 layout-spacing">
        <div className="widget widget-chart-three">
          <div className="widget-heading ">
            <div className="row">
              <div className="col-4">
                <h5 className=""> گزارش بدهی ها و اعتبارات در جریان</h5>
              </div>
              <div className="col-4 text-center ">
               
                 <span> {`مجموع :${reportData.totalDue ? ` ${formatter.format(reportData.totalDue)} ${ComboPrice().filter(i=>i.value===PriceUnitId).map(i=>i.label)[0]}` : ''}`}</span>
                
              </div>

              <div className="col-4 text-right">

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
                                      
                                        
                                            <div className=" form-control-sm textOnInput ">
                                                <label> واحد قیمت </label>

                                                <Select
                                                    menuShouldScrollIntoView={false}
                                                    placeholder="  واحد قیمت  "
                                                    options={ComboPrice().filter(i=>i.value!==4)}
                                                    onChange={(e: any) =>{ setPriceUnitId(e.value)
                                                    
                                                    setShow(false)
                                                    }}
                                                    defaultValue={ComboPrice().filter((i: any) => i.value === PriceUnitId).map((i: any) => i)}

                                                />
                                            </div>

                                       

                                    </div>




                                </div> : null}
                        </div>
            </div>

          </div>





          <div className="btn-group m-2" role="group" aria-label="Basic example">
          </div>

          <div className="widget-content  pt-3 border-top text-center" style={{ height: '70vh' }}>

            <PolarArea options={config} data={data} />
          </div>
        </div>
      </div>

    )
  }
  else {
    return (<div className="text-center dashboard-widget p-3 my-2">

      <div>اطلاعاتی برای نمایش وجود ندارد</div>
    </div>)
  }
}
