import React, { useEffect, useReducer, useRef, useState } from 'react'
import Sunburst from "sunburst-chart";

import SunburstChart from '../../../Utils/SunburstChart';
import { scaleOrdinal, schemeSet3 } from 'd3';
import QueryString from 'qs';
import { GetorderSunburst } from '../../../services/reportService';
import Select from 'react-select';
import { ComboDays } from '../../../Utils/OptionSelectBoxDays';
import { ClipLoader, GridLoader } from 'react-spinners';
import { node } from 'prop-types';




const NewSunburstChart = () => {
    const [orderSunburst, SetorderSunburst] = useState()
    const [ScheduleTypeId, SetScheduleTypeId] = useState(3)
    const [PriceUnitId, SetPriceUnitId] = useState()
    const [loading, setLoading] = useState(true)
    const [updateValue, ForceUpdate] = useReducer(x => x + 1, 0)
    const [Length , setLength]=useState(7)




    const getSunburstData = async () => {
        try {
            setLoading(true)
            let config = {

                headers: { 'Content-Type': 'application/json' },

                params: {
                    ScheduleTypeId,
                    Length




                },
                paramsSerializer: (params) => {

                    return QueryString.stringify(params)
                }



            }
            const { data, status } = await GetorderSunburst(config)
            if (status === 200) {
                ForceUpdate()
                if (data.result) {
                    SetorderSunburst(data.result.orderSunburst)
                    setLoading(false)
                }
                else {
                    SetorderSunburst(null)
                }

            }
        } catch (error) {

        }



    }


    useEffect(() => {

        getSunburstData()
    }, [ScheduleTypeId,Length])
    const myRef = useRef()
    let Chart = Sunburst()
    const color = scaleOrdinal(schemeSet3);
    const description = (node) => {
        const { description } = node.data
        return (description)
    }

    const nameShow=(node)=>{
        const{size}=node.data
       return(size)
    }
    const onchangeSelect = (e) => {


        if (e.value !== ScheduleTypeId) {
            SetorderSunburst(null)
            SetScheduleTypeId(e.value)
        }

    }

    console.log(color());
    useEffect(() => {
        Sunburst().data([])
        if (orderSunburst) {

            Sunburst()
                .tooltipContent((d, node) => description(node)).tooltipTitle((d,node)=>node.data.name).showTooltip(() => true)
                .data(orderSunburst)
                .label('name').size('size')
               .handleNonFittingLabel((label, availablePx) => {
                    const numFitChars = Math.round(availablePx / 5); // ~7px per char
                    return numFitChars < 5
                      ? null
                      : `${label.slice(0, Math.round(numFitChars) - 3)}...`;
                  })
                .color((d, node) => color(()=>node?node.data.name:null))

                (document.getElementById('chartSun'))

        }
        else {
            Sunburst().data([])
        }



    }, [updateValue])


    if (loading === false) {
        if (orderSunburst) {
            return (
                <div id="chartArea" className="" >
                    <div className="widget ">
                        <div className="widget-heading ">
                            <div className='row mb-4'>
                              
                                <div className=" form-control-sm col-md-2 col-6  text-left textOnInput">
                                    <div className="quantity-field w-100">
                                        <button className="value-button increase-button" onClick={() => Length >= (ScheduleTypeId === 1 ? 3 : ScheduleTypeId === 2 ? 12 : ScheduleTypeId === 3 ? 30 : ScheduleTypeId === 4 ? 24 : 60) ? setLength(ScheduleTypeId === 1 ? 3 : ScheduleTypeId === 2 ? 12 : ScheduleTypeId === 3 ? 30 : ScheduleTypeId === 4 ? 24 : 60) : setLength(Number(Length) + 1)}>+
                                        </button>
                                        <input className="number" onKeyUp={() => Length > (ScheduleTypeId === 1 ? 3 : ScheduleTypeId === 2 ? 12 : ScheduleTypeId === 3 ? 30 : ScheduleTypeId === 4 ? 24 : 60) ? setLength(ScheduleTypeId === 1 ? 3 : ScheduleTypeId === 2 ? 12 : ScheduleTypeId === 3 ? 30 : ScheduleTypeId === 4 ? 24 : 60) : Length} type="number" placeholder="بازه زمانی"
                                            min={1} value={Length} onChange={(e) => setLength(e.target.value)} />
                                        <button className="value-button decrease-button " onClick={() => Length > 1 ? setLength(Number(Length) - 1) : setLength(1)}> --
                                        </button>
                                    </div>
                                </div>
                                <div className=" form-control-sm col-md-2 col-6 text-left textOnInput">
                                    <label>  برنامه زمانی </label>

                                    <Select
                                        menuShouldScrollIntoView={false}
                                        placeholder="  برنامه زمانی  "
                                        options={ComboDays().filter(item=>item.value<4)}
                                        onChange={(e) => onchangeSelect(e)}
                                        defaultValue={ComboDays().filter((i) => i.value === ScheduleTypeId).map((i) => i)}
                                    />
                                </div>
                            </div>
                            <br/>
                            <div className="d-flex justify-content-center mt-4">
                                <div className='' id='chartSun' >

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            )
        }
        else {
            return null
        }
    }
    else {

        return (
            <div id="chartArea" className="" >
                <div className="widget ">
                <div className="widget-heading ">
                <div className='row'>
                              
                <div className=" form-control-sm col-md-2 col-6  text-left textOnInput">
                                  <div className="quantity-field w-100">
                                      <button className="value-button increase-button" onClick={() => Length >= (ScheduleTypeId === 1 ? 3 : ScheduleTypeId === 2 ? 12 : ScheduleTypeId === 3 ? 30 : ScheduleTypeId === 4 ? 24 : 60) ? setLength(ScheduleTypeId === 1 ? 3 : ScheduleTypeId === 2 ? 12 : ScheduleTypeId === 3 ? 30 : ScheduleTypeId === 4 ? 24 : 60) : setLength(Number(Length) + 1)}>+
                                      </button>
                                      <input className="number" onKeyUp={() => Length > (ScheduleTypeId === 1 ? 3 : ScheduleTypeId === 2 ? 12 : ScheduleTypeId === 3 ? 30 : ScheduleTypeId === 4 ? 24 : 60) ? setLength(ScheduleTypeId === 1 ? 3 : ScheduleTypeId === 2 ? 12 : ScheduleTypeId === 3 ? 30 : ScheduleTypeId === 4 ? 24 : 60) : Length} type="number" placeholder="بازه زمانی"
                                          min={1} value={Length} onChange={(e) => setLength(e.target.value)} />
                                      <button className="value-button decrease-button " onClick={() => Length > 1 ? setLength(Number(Length) - 1) : setLength(1)}> --
                                      </button>
                                  </div>
                              </div>
                              <div className=" form-control-sm col-md-2 col-6  text-left textOnInput">
                                  <label>  برنامه زمانی </label>

                                  <Select
                                      menuShouldScrollIntoView={false}
                                      placeholder="  برنامه زمانی  "
                                      options={ComboDays().filter(item=>item.value<4)}
                                      onChange={(e) => onchangeSelect(e)}
                                      defaultValue={ComboDays().filter((i) => i.value === ScheduleTypeId).map((i) => i)}
                                  />
                              </div>
                          </div>
                            <div className="d-flex justify-content-center">
                            <GridLoader loading={loading} color="#4236d6" />

                            </div>
                        </div>
                </div>
            </div>
        )
    }
}

export default NewSunburstChart