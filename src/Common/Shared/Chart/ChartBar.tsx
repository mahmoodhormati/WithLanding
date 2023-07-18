import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,

    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import {GetShippingsReport} from "../../../services/reportService";
import {useEffect, useState} from "react";
import { RiDatabase2Fill } from 'react-icons/ri';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,

    Title,
    Tooltip,
    Filler,
    Legend
);
interface Props {
    data1: any;
    data2: any;

    labels: any;
    data3:any,
    data4:any
  }
export function ChartBar({ data1, data2, labels  ,data3,data4
}: Props) {
   
 const data:any = {
        labels: labels,
        datasets: [
          {
            
            data: [data1 , data2 , data3,data4],
            backgroundColor: [
                
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)',
                'rgba(128, 128, 128, 0.2)',

              ],
              borderColor: [
                
              
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)',
                'rgb(128, 128, 128)',
              ],
              borderWidth: 1,
              // barThickness:20
          }
          
        ]
      };
      const config:any = {
        type: 'bar',
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
                display: false,

                  rtl: true,
                  labels: {
                      yPadding: '10',
                      position: 'left',
                      usePointStyle: true,
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
                    stacked: true,

                  barPercentage: 1.6,
                  grid: {
                      // borderDash: [10, 10],
                      drawBorder: false,
      
                      display: true,
                      zeroLineColor: "transparent"
                  },
                  ticks: {
                    // stepSize: 2000,
                      padding: 4,
                      font: {
                          family: "diroz", // Add your font here to change the font of your x axis
                          size: 8
                      },
      
                      major: {
                          enable: true
                      },
                      beginAtZero: true,
                      
                     
                  },
              
              },
              xAxes: {
                barThickness: 1,  // number (pixels) or 'flex'
                maxBarThickness: 1, // number (pixels)

                  barPercentage: 0.6,
                  grid: {
                      borderDash: [10, 10],
                      display: false,
                      zeroLineColor: "transparent"
                  },
                  ticks: {
                    
                      padding: 4,
                      font: {
                          family: "diroz", // Add your font here to change the font of your x axis
                          size: 10
                      },
      
                      major: {
                          enable: false
                      }
                  }
              }
          }
      };
    return (
        <div id="chartArea" className="col-xl-12 layout-spacing">
            <div className="widget widget-chart-three">
              
               
                
                <div className=""  >

                <Bar options={config} data={data} style={{height: "20rem"}}/>
            </div>
            </div>
        </div>
    )
    
}
