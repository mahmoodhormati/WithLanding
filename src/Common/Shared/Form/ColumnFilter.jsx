import './styleInput.css'
import Select from "react-select";
import {Fragment, useEffect, useMemo, useRef, useState} from "react";
import {RxDotsVertical} from "react-icons/rx"
import {HiFilter} from "react-icons/hi"

 function SelectColumnFilter({column: { filterValue=[], setFilter, preFilteredRows, id },}) {
    // Calculate the options for filtering
    // using the preFilteredRows
     const ref = useRef([]);
     const refAll = useRef([]);

     const [show, setShow] = useState( false)
     const [FilterValue, setFilterValue] = useState( {
         Values: [],
         response: [],
     });

     const handleChange = (e) => {
         // Destructuring
         const { value, checked } = e.target;
         const { Values } = FilterValue;



         // Case 1 : The user checks the box
         if (checked) {
             setFilterValue({
                 Values: [ ...Values, value],
                 response: [...Values, value],
             });
         }

         // Case 2  : The user unchecks the box
         else {
             setFilterValue({
                 Values: Values.filter((e) => e !== value),
                 response: Values.filter((e) => e !== value),
             });
         }
     };
    const options = useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })
        return [...options.values()]
    }, [id, preFilteredRows])
const submit = () => {
    let value=[]

    for (let i=0; i< FilterValue.response.length ; i++){
            value.push(Number(FilterValue.response[i]))


    }


    setFilter( value.length > 0 ? value : undefined)

setShow(false)

}
const deleteValue = () => {

    for (let i = 0; i < ref.current.length; i++) {

        ref.current[i].checked = false;
    }
    refAll.current[0].checked = false;

    setFilter(undefined)
    setShow(false)
}
const chackAllValue = () => {

    for (let i = 0; i < ref.current.length; i++) {

        ref.current[i].checked = true;
    }

}
return (
        <Fragment>
            <RxDotsVertical size="1rem" onClick={()=>setShow(!show)}/>

            <div className={show?" Filter Open ":"Filter  "} >
                <div className="parent1">
                    <div className="parent2">
                        <div className="parent3">
                <div className="mx-0 my-auto input-Filter border-bottom text-dark">
                    <div className="m-1  text-left ">
                    <input
                        ref={(element) => { refAll.current[0] = element }}

                        type="checkbox"
                        onChange={chackAllValue}/>
                        <label className="position-static">همه</label>
                    </div>
                {options.map((option, i) => (
                    <div key={i} className="m-1  text-left ">

                        <input
                            ref={(element) => { ref.current[i] = element }}
value={option}
type="checkbox"
onChange={handleChange}
                        />
                        <label className="position-static">{option}</label>

                    </div>

                ))}
                </div>
                <div className="  row ">
                    <div className="p-1 col-6">
                        <button className="btn btn-sm btn-primary float-right" onClick={submit}>فیلتر</button>
                    </div>
                    <div className="p-1 col-6">
                        <button className="btn btn-sm btn-danger   float-left" onClick={deleteValue} style={{fontSize:"smaller"}}>حذف </button>

                    </div>

                </div>
                        </div>
                    </div>
                </div>
            </div>

        {/*<select*/}
        {/*    required*/}
        {/*    className="border-0 rounded bg-transparent text-primary "*/}
        {/*    value={sessionStorage.getItem("filterValuePirce")}*/}
        {/*    onChange={e => {*/}
        {/*        sessionStorage.setItem("filterValuePirce" , e.target.value)*/}

        {/*        setFilter(e.target.value || undefined)*/}
        {/*    }}*/}
        {/*    // style={{minWidth:"10px" , maxWidth:"auto"}}*/}
        {/*>*/}
        {/*    <option style={{width:"0px"}} value="">&nbsp;</option>*/}
        {/*    {options.map((option, i) => (*/}
        {/*        <option key={i} value={option}>*/}
        {/*            {option}*/}
        {/*        </option>*/}
        {/*    ))}*/}
        {/*</select>*/}
        </Fragment>
    )
}


export default SelectColumnFilter