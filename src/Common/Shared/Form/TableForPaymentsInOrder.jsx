import React, { Fragment,useEffect,useState } from 'react'
import { useTable, useGlobalFilter, useSortBy, usePagination, useRowSelect } from 'react-table';
import CheckBox from './CheckBox';
import GlobalFilter from './GlobalFilter';
import ModalGroupWork from "../Common/ModalGroupWork";
import {disabled} from "react-widgets/PropTypes";


const TableForPaymentsInOrder = ({ columns, data , rowProps = (row) => ({}),}) => {

    const [selectFunc,setSelectFunc]=useState(0);
    const [Func, SetFunc] = useState([]);
    const formattedvalues = [];


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        setPageSize,
        rows,
        footerGroups,
        prepareRow,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        gotoPage,
        pageOptions,
        pageCount,
        state,
        setGlobalFilter,
        selectedFlatRows,
        state: { selectedRowIds }

    } = useTable({ columns, data ,initialState: {

            hiddenColumns:  Func
        }, }, useGlobalFilter, useSortBy, usePagination, useRowSelect, hooks => {
        hooks.visibleColumns.push(columns => [
            // Let's make a column for selection
            // {
            //     id: 'selection',
            //     // The header can use the table's getToggleAllRowsSelectedProps method
            //     // to render a checkbox
            //     Header: ({ getToggleAllPageRowsSelectedProps }) => (
            //         <div>
                        
            //             <CheckBox {...getToggleAllPageRowsSelectedProps()} />
            //         </div>
            //     ),
            //     // The cell can use the individual row's getToggleRowSelectedProps method
            //     // to the render a checkbox
            //     Cell: ({ row }) => (
            //         <div>
            //             <CheckBox {...row.getToggleRowSelectedProps()} />
            //         </div>
            //     ),
            // },
            ...columns,
        ])
    })
    useEffect(()=>{
        const script = document.createElement("script");
        const scriptText = document.createTextNode(`

        
        
        $('#paymentOrder th').each(function(idx, el) {
            var check = !!$('#paymentOrder tbody tr').find('td:eq(' + idx + ')').filter(function() {
              return $.trim($(this).html()).length;
            }).length;
           
              
              $('#paymentOrder tr').find('td:eq(' + idx + '), th:eq(' + idx + ')').show();
              if (!check) {
                  $('#paymentOrder tr').find('td:eq(' + idx + '), th:eq(' + idx + ')').hide();
              }
            
          
          })`)

              script.appendChild(scriptText);
              document.head.appendChild(script);

              return(
                ()=>document.head.removeChild(script)
              )
        
    },[data])
   
    const { globalfilter, pageIndex, pageSize } = state;
    let item = page.length * pageSize + 1
    return (
        <Fragment>

        

            <div className="table-responsive "
                
            >
              
                {/* <div className='d-block clearfix mt-3 float-left'>
                    <span  className=" py-3" style={{fontSize:'smaller'}} > اقدام دسته جمعی: </span>
                    {page.find(item =>item.original.active === true || item.original.active === false) ?
                        <select
                        // style={{height:'20px'}}
                        className='btn m-1  non-hover  bg-transparent shadow-none  p-0 '
                        style={{fontSize:'smaller'}}
                        value={selectFunc}
                        onChange={e => {
                            setSelectFunc(Number(e.target.value))
                        }}
                    >
                        {[ {id:1,name:'انتخاب'} ,  {id: 2, name: 'فعال '},{id:5,name:'غیرفعال '},{id:3,name:'کپی'},{id:4,name:'حذف'} ].map(item => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>

                        ))}
                    </select> :   <select
                            // style={{height:'20px'}}
                            className='btn m-1  non-hover  bg-transparent shadow-none  p-0 '
                            style={{fontSize:'smaller'}}
                            value={selectFunc}
                            onChange={e => {
                                setSelectFunc(Number(e.target.value))
                            }}
                        >
                            {[ {id:1,name:'انتخاب'},{id:3,name:'کپی'},{id:4,name:'حذف'} ].map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>

                            ))}
                        </select> }
                    <button className='btn-sm btn-light' onClick={()=>bulkJob(selectFunc)}>ثبت</button>
                </div> */}

                <table id='paymentOrder' className='table responsive mb-4 ' {...getTableProps()}
                    // style={{ transform:'rotateX(180deg)'}}
                >

                    <thead className=''>
                    {
                        headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {
                                    headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                            {
                                                column.render('Header')
                                            }
                                            
                                        </th>
                                    ))
                                }
                            </tr>
                        ))
                    }
                    </thead>
                    <tbody className='' {...getTableBodyProps()}>
                    { // loop over the rows

                        rows.map((row) => {
                            prepareRow(row)

                            return (
                                <tr className='' {...row.getRowProps(rowProps(row))}>
                                    { // loop over the rows cells
                                             row.cells.map((cell,index) => {

                                                if (typeof (cell.value) === typeof ('') && cell.value.length > 27) {
    
    
                                                    return (
                                                        <td className='pr-2' aria-label={headerGroups.map(headerGroup => (headerGroup.headers.map((column)=>column.Header)).filter((item,i)=>i>0 && i===index).map((item,i)=>(item))[0])} title={cell.value}>{cell.value.substring(0, 20)}</td>
                                                    )
    
                                                }
                                                else {
                                                    return (<td className='pr-2' aria-label={headerGroups.map(headerGroup => (headerGroup.headers.map((column)=>column.Header)).filter((item,i)=>i>0 && i===index).map((item,i)=>(item))[0])}>{cell.render('Cell')}</td>)
                                                }
                                            }
                                            )
                                    }

                                </tr>
                            )
                        })
                    }

                    </tbody>
                    <tfoot>
                        {footerGroups.map(group => (
                            <tr {...group.getFooterGroupProps()}>
                                {group.headers.map(column => (
                                    <td {...column.getFooterProps()}>{column.render('Footer')}</td>
                                ))}
                            </tr>
                        ))}
                    </tfoot>
                </table>
                <hr/>
              
            </div>

            {/*<pre>*/}
            {/*  <code>*/}
            {/*    {*/}
            {/*      JSON.stringify(*/}
            {/*        {*/}
            {/*          selectedFlatRows: selectedFlatRows.map((row) => row.original),*/}
            {/*        }, null, 2*/}
            {/*      )*/}
            {/*    }*/}
            {/*  </code>*/}
            {/*</pre>*/}

          
        </Fragment>
    );

}

export default TableForPaymentsInOrder