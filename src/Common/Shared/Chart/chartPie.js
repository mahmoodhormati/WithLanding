import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend, ArcElement,
} from 'chart.js';
import {Pie} from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);


const options = {
    height:24,
    width:24,
    // responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
            rtl: true,
            display: true,
            yPadding: 20,
            ymargin:'auto',

            labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                font: {
                    family: "diroz",
                    size: 8

                }
            },

        },
        tooltip: {
            previousBodyPadding: 'circle',
            usePointStyle: true,

            backgroundColor: "rgba(23,21,21,0.78)",
            Color: "#333",
            bodyFontColor: "#666",
            bodySpacing: 4,
            xPadding: 20,
            mode: "nearest",
            intersect: 0,
            position: "nearest",
            bodyFont: {
                family: "diroz",
                size: 8

            },
            titleFont: {
                family: "diroz",
                size: 8

            }
        },
    },


    scales: {
        yAxes: {
            display: false,

        },
        xAxes: {
            display: false,


        }
    }
};


export const data = {
    labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'],
    datasets: [
        {
            fill: true,
            label: 'فروش کالا 1',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(10,6,192,0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(10,6,192,1)',

            ],
            borderWidth:2,
        },
    ],
};

export function ChartPie() {
    return (
        <div id="chartArea" className="col-xl-12 layout-spacing " >
            <div className="statbox widget box-shadow   pie">

                <div className="widget-content m-auto">

                <Pie   options={options} data={data}/>
            </div>
            </div>
        </div>
    )
}