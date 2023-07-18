import React, { Fragment,useEffect,useState } from 'react'
import { useTable, useGlobalFilter, useSortBy, usePagination, useRowSelect } from 'react-table';
import CheckBox from './CheckBox';
import GlobalFilter from './GlobalFilter';
import ModalGroupWork from "../Common/ModalGroupWork";
import {disabled} from "react-widgets/PropTypes";


const MyReportTable = ({ columns, data ,getData,bulkJob ,  rowProps = (row) => ({}) }) => {

    const [selectFunc,setSelectFunc]=useState(0);
    const [Func, SetFunc] = useState([]);
    const formattedvalues = [];
    // useEffect(()=>{
    //     const script = document.createElement("script");
    //     const scriptText = document.createTextNode(`

        
        
    //     $('#ReportTabel th').each(function(idx, el) {
    //         var check = !!$('#ReportTabel tbody tr').find('td:eq(' + idx + ')').filter(function() {
    //           return $.trim($(this).html()).length;
    //         }).length;
           
              
    //           $('#ReportTabel tr').find('td:eq(' + idx + '), th:eq(' + idx + ')').show();
    //           if (!check) {
    //               $('#ReportTabel tr').find('td:eq(' + idx + '), th:eq(' + idx + ')').hide();
    //           }
            
          
    //       })`)

    //           script.appendChild(scriptText);
    //           document.head.appendChild(script);

    //           return(
    //             ()=>document.head.removeChild(script)
    //           )
        
    // },[data])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        setPageSize,
        rows,

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
    const values= Object.values(rows.map(i =>  i.values));
    // useEffect(() => {
    //     const notNullable = values.reduce((r, o) =>
    //             r + +!Object.values(o).includes("")
    //         , 0);
    //
    //     const notNullable2 = values.reduce((r, o) =>
    //             r + +!Object.values(o).includes('  ')
    //         , 0);
    //     const notNullable3 = values.reduce((r, o) =>
    //             r + +!Object.values(o).includes(null)
    //         , 0);
    //
    //     values.forEach(task =>
    //         Object.entries(task).forEach(([key, value]) =>
    //             value ===  null  ? formattedvalues.push(key): value ===  ""  ? formattedvalues.push(key): value ===  '  '  ? formattedvalues.push(key):null
    //         )
    //     );
    //     SetFunc(notNullable === 0 ?  formattedvalues:notNullable2 === 0 ? formattedvalues:notNullable3 === 0 ? formattedvalues:[])
    //
    //
    //
    // }, [rows])
    useEffect(()=>{
        getData(selectedFlatRows);
    },[selectedRowIds])
    const { globalfilter, pageIndex, pageSize } = state;
    let item = page.length * pageSize + 1
    return (
        <Fragment>

            {/* <GlobalFilter filter={globalfilter} setFilter={setGlobalFilter} /> */}

            <div className="table-responsive "
                 style={{overflowX:'auto' }}
            >
                <div className='d-block clearfix mt-3 float-right'>
                    <span  className=" py-3" style={{fontSize:'smaller'}} > تعداد نمایش در صفحه : </span>
                    <select
                        // style={{height:'20px'}}
                        className='btn m-1  non-hover  bg-transparent shadow-none  p-0 '
                        value={pageSize}
                        onChange={e => {
                            setPageSize(Number(e.target.value))
                        }}
                    >
                        {[10,25,50,100,10000].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>

                        ))}
                    </select>
                </div>
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

                <table id='ReportTabel' className='table responsive mb-4 ' {...getTableProps()}
                    // style={{ transform:'rotateX(180deg)'}}
                >

                    <thead className='text-center'>
                    {
                        headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {
                                    headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                            {
                                                column.render('Header')
                                            }
                                            <span>
                        {column.isSorted
                            ? column.isSortedDesc
                                ? ' 🔽'
                                : ' 🔼'
                            : ''}
                      </span>
                                        </th>
                                    ))
                                }
                            </tr>
                        ))
                    }
                    </thead>
                    <tbody className='text-center ' {...getTableBodyProps()}>
                    { // loop over the rows

                        page.map((row) => {
                            prepareRow(row)

                            return (
                                <tr {...row.getRowProps(rowProps(row))}>
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

                </table>
                <hr/>
                <div className='d-block m-2   float-right'>
              <span  className=" " style={{fontSize:'small'}} >
                  نمایش
                  {""}  {  page.length }  {""}

                  آیتم از
                  {""}   { rows.length  }  {""}
              </span>

                </div>
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

            <div className='d-flex justify-content-center'>

                <button className=' btn Pagination    m-1' onClick={() => gotoPage(0)} disabled={!canPreviousPage} data-title='صفحه اول'>صفحه اول</button>
                <button className='   btn Pagination  m-1' data-title='صفحه قبلی' onClick={() => previousPage()} disabled={!canPreviousPage}> قبلی</button>
                <strong className='m-2'>
                    {pageIndex + 1} از {pageOptions.length}
                </strong>{'  '}
                <button className='   btn  Pagination m-1' data-title='صفحه بعدی' onClick={() => nextPage()} disabled={!canNextPage}> بعدی</button>
                <button className='  btn Pagination  m-1' onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} data-title='صفحه اول'>صفحه آخر</button>

            </div>

        </Fragment>
    );

}

export default MyReportTable