import React, { Fragment, useEffect, useState } from 'react'
import {
    useTable,
    useFilters,
    useGlobalFilter,
    useAsyncDebounce,
    useRowSelect,
    useSortBy,
    usePagination
} from 'react-table';
import { useMemo } from "react";

const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = React.useRef()
        const resolvedRef = ref || defaultRef

        React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
        }, [resolvedRef, indeterminate])

        return (
            <>
                <input type="checkbox" ref={resolvedRef} {...rest} />
            </>
        )
    }
)

const TakhsisTableForClients = ({ columns, data, getData, bulkJob, rowProps = () => ({}) }) => {

    const [selectFunc, setSelectFunc] = useState(0);

    useEffect(()=>{
        const script = document.createElement("script");
        const scriptText = document.createTextNode(`

        
        
        $('#tableTakhsisclient th').each(function(idx, el) {
            var check = !!$('#tableTakhsisclient tbody tr').find('td:eq(' + idx + ')').filter(function() {
              return $.trim($(this).html()).length;
            }).length;
           
              
              $('#tableTakhsisclient tr').find('td:eq(' + idx + '), th:eq(' + idx + ')').show();
              if (!check) {
                  $('#tableTakhsisclient tr').find('td:eq(' + idx + '), th:eq(' + idx + ')').hide();
              }
            
          
          })`)

              script.appendChild(scriptText);
              document.head.appendChild(script);


          return(
                ()=>document.head.removeChild(script)
              )
    },[data])
    

    const filterTypes = useMemo(
        () => ({
            multiple: (rows, id, filterValue) => {
                return rows.filter((row) => {
                    const rowValue = row.values[id];
                    return rowValue !== undefined
                        ? filterValue.includes(rowValue)
                        : undefined;
                });
            }
        }),
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
       
        selectedFlatRows,
        state: { selectedRowIds }
    } = useTable({
        columns, data,
        filterTypes
    }, useGlobalFilter, useFilters, useRowSelect, hooks => {
        hooks.visibleColumns.push(columns => [
            // Let's make a column for selection

            ...columns,
        ])
    })
    // useEffect(() => {
    //     getData(selectedFlatRows);
    // }, [selectedRowIds])

    return (
        <>

            {/*<GlobalFilter filter={globalfilter} setFilter={setGlobalFilter} />*/}
            {/* <div className='d-block clearfix mt-3 '> */}
            {/* <span className=" py-3" style={{fontSize: 'smaller'}}> اقدام دسته جمعی: </span>

                <select
                    // style={{height:'20px'}}
                    className='btn m-1  non-hover  bg-transparent shadow-none  p-0 '
                    style={{fontSize: 'smaller'}}
                    value={selectFunc}
                    onChange={e => {
                        setSelectFunc(Number(e.target.value))
                    }}
                >
                    {[{id:1,name:'انتخاب'},{id: 2, name: 'صدور حواله '},{id: 3, name: 'صدور صورتحساب بر اساس جزییات سفارش '}].map(item => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>

                    ))}
                </select>
                <button className='btn-sm btn-light' onClick={() => bulkJob(selectFunc)}>ثبت</button>
            </div>> */}
            <div className=" containerTFull">




                <table id="tableTakhsisclient" className='table responsive m-1 table-striped text-center  fixed_header ' {...getTableProps()}>
                    <thead >
                        {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>

                                    {
                                        headerGroup.headers.map(column => (
                                            <th  {...column.getHeaderProps()}>

                                                {
                                                    column.render('Header')
                                                }
                                                {column.canFilter ? column.render('Filter') : null}

                                            </th>
                                        ))}
                                </tr>
                            ))}
                    </thead>
                    <tbody id="tableTakhsisclient" {...getTableBodyProps()}>
                        {rows.map((row, index) => {
                            prepareRow(row)
                            return (
                                <tr key={index+'_12'} id={row.original.id} {...row.getRowProps(rowProps(row))}>
                                    {row.cells.map((cell,index) => {

                                        if (typeof (cell.value) === typeof ('') && cell.value.length > 27) {


                                            return (
                                                <td key={index} className='pr-2' title={cell.value}>{cell.value.substring(0, 20)}</td>
                                            )

                                        }
                                        else {
                                            return (<td key={index} className='pr-2'>{cell.render('Cell')}</td>)
                                        }
                                    }
                                    )}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <hr />
                <div className='d-block m-2  '>



                </div>
            </div>

        </>
    );

}
// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
    return rows.filter(row => {
        const rowValue = row.values[id]
        return rowValue >= filterValue
    })
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = val => typeof val !== 'number'



export default TakhsisTableForClients