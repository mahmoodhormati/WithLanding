import React, { Fragment, useEffect, useState } from 'react'
import { useTable, useGlobalFilter, useSortBy, usePagination, useRowSelect, useExpanded } from 'react-table';
import CheckBox from './CheckBox';
import GlobalFilter from './GlobalFilter';
import ModalGroupWork from "../Common/ModalGroupWork";
import { disabled } from "react-widgets/PropTypes";
import { MeasureUnitSample } from './../../Enums/MeasureUnitSample';
import { formatter } from '../../../Utils/Formatter';
import { FcShipped } from 'react-icons/fc';
import './tooltipReport.css'
import { ShippingCompanySource } from './../../Enums/ShippingCompanySourceId';


const MyClickableReport = ({ columns, data, getData, bulkJob, formatRowProps, show, rowProps = (row) => ({}) }) => {

    const [selectFunc, setSelectFunc] = useState(0);
    const [Func, SetFunc] = useState([]);
    const formattedvalues = [];



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
        state: { selectedRowIds, expander }

    } = useTable({
        columns, data, initialState: {

            hiddenColumns: Func
        },
    }, useGlobalFilter, useSortBy, useExpanded, usePagination, useRowSelect, (hooks) => {
        hooks.visibleColumns.push((columns) => {


            console.log(columns)
            return [{// Build our expander column
                id: "expander", // Make sure it has an ID
                Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
                    <span className="Expanded" {...getToggleAllRowsExpandedProps()}>

                    </span>
                ), Cell: ({ row }) => (

                    // Use Cell to render an expander for each row.
                    // We can use the getToggleRowExpandedProps prop-getter
                    // to build the expander.

                    <span className="Expanded" {...row.getToggleRowExpandedProps()}>

                        {row.isExpanded ?
                            <svg {...row.getRowProps(formatRowProps && formatRowProps(row))} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                className="bi bi-chevron-down" viewBox="0 0 16 16">
                                <path fillRule="evenodd"
                                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" /></svg>
                            : <svg  {...row.getRowProps(formatRowProps && formatRowProps(row))} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                className="bi bi-chevron-left" viewBox="0 0 16 16">
                                <path fillRule="evenodd"
                                    d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" /></svg>}
                    </span>
                )
            },

            ...columns,
            ]
        })
    })




    const handelNewTab=(id)=>{
        window.open(`${window.location.origin}/admin/orderDetail/${id}`)
    }
    const values = Object.values(rows.map(i => i.values));
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
    useEffect(() => {
        getData(selectedFlatRows);
    }, [selectedRowIds])


    const { globalfilter, pageIndex, pageSize } = state;
    let item = page.length * pageSize + 1
    return (
        <Fragment>

            <GlobalFilter filter={globalfilter} setFilter={setGlobalFilter} />

            <div className="table-responsive "
                style={{ overflowX: 'auto' }}
            >
                <div className='d-block clearfix mt-3 float-right'>
                    <span className=" py-3" style={{ fontSize: 'smaller' }} > تعداد نمایش در صفحه : </span>
                    <select
                        // style={{height:'20px'}}
                        className='btn m-1  non-hover  bg-transparent shadow-none  p-0 '
                        value={pageSize}
                        onChange={e => {
                            setPageSize(Number(e.target.value))
                        }}
                    >
                        {[10, 25, 50, 100, 10000].map(pageSize => (
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

                <table id='no-id' className='table responsive mb-4 ' {...getTableProps()}
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
                    <tbody className='text-center' {...getTableBodyProps()}>
                        { // loop over the rows

                            page.map((row) => {
                                prepareRow(row)

                                return (

                                    <Fragment >
                                        <tr  {...row.getRowProps()}  >
                                            { // loop over the rows cells
                                                row.cells.map((cell, index) => {






                                                    return (

                                                        <td aria-label={headerGroups.map(headerGroup => (headerGroup.headers.map((column) => column.Header)).filter((item, i) => i > 0 && i === index).map((item, i) => (item))[0])} className='pr-2'>{cell.render('Cell')}</td>
                                                    )

                                                }

                                                )
                                            }

                                            <span className="hideMobile" {...row.getToggleRowExpandedProps()}>

                                                {row.isExpanded ?
                                                    <svg {...row.getRowProps(formatRowProps && formatRowProps(row))} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                        className="bi bi-chevron-down" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd"
                                                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" /></svg>
                                                    : <svg  {...row.getRowProps(formatRowProps && formatRowProps(row))} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                        className="bi bi-chevron-left" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd"
                                                            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" /></svg>}
                                            </span>
{(row.id === show.id) && show.isExpanded ?
                                            <div className='hideMobile ' >
                                                <div colSpan={18} className="fadeInt  
                                                    " >
                                                    {(row.id === show.id) && show.isExpanded ?
                                                        <div className="  expanded  rounded   " >
                                                            {show.original.shippingReportRecords.length > 0 ?
                                                                <div className="w-100   responsive  ">
                                                                    <table className="  table    header-green "  >
                                                                        <thead style={{ color: 'white' }}>
                                                                            <tr>
                                                                                <th bgcolor=''>  شناسه سفارش</th>
                                                                                <th bgcolor='' >  ش ج سفارش</th>
                                                                                <th bgcolor=''> نام شرکت</th>
                                                                                <th bgcolor=''> کالا</th>
                                                                                <th bgcolor="">واحد</th>
                                                                                <th bgcolor=""> تاریخ </th>
                                                                                <th bgcolor=""> ارزش</th>
                                                                                <th bgcolor="">مقدار اعلامی</th>
                                                                                <th bgcolor="" > مقدار حمل شده</th>
                                                                                <th bgcolor="">مقدار بارنامه</th>
                                                                                <th bgcolor="">اطلاعات حمل</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className='table table-stripped' >
                                                                            {show.original.shippingReportRecords.map((item, index) => (
                                                                                <tr key={index + 1000000}>
                                                                                    
                                                                                    <td aria-label=' شناسه سفارش' ><button className='border-0 bg-transparent text-primary' onClick={()=>handelNewTab(item.orderId)}>{item.orderId}</button></td>
                                                                                    <td aria-label=' ش ج سفارش'>{item.orderDetaiId}</td>
                                                                                    <td aria-label=' نام شرکت'>{item.companyName}</td>
                                                                                    <td aria-label='کالا'>{item.productName}</td>
                                                                                    <td aria-label='واحد'>{MeasureUnitSample.filter(i => i.id === item.measureUnitId).map(i => i.name)}</td>
                                                                                    <td aria-label='تاریخ'>{new Date(item.createDate).toLocaleDateString('fa-IR')}</td>
                                                                                    <td aria-label='ارزش'>{formatter.format(item.shippingValue)}</td>
                                                                                    <td aria-label='مقدار اعلامی'>{formatter.format(item.plannedQuantity)}</td>
                                                                                    {/*The unit price must be read from the backend*/}
                                                                                    <td aria-label='مقدار حمل شده'> {formatter.format(item.shippedQuantity)}</td>
                                                                                    <td aria-label='مقدار بارنامه'>{formatter.format(item.shippingQuantity)}</td>

                                                                                    <td aria-label='اطلاعات حمل'>
                                                                                        <div className="con-tooltip right" title='' >


                                                                                            <p> <FcShipped size={20} /></p>

                                                                                            <div className='tooltipShipReport'>
                                                                                                <p></p>
                                                                                                <p>{`شماره بارنامه: ${item.deliverer.shippingNumber} | سریال بارنامه: ${item.deliverer.shippingSerial} |  نام راننده : ${item.deliverer.delivererName} |
                                                                                                 تلفن راننده : ${item.deliverer.delivererNumber} | پلاک : ${item.deliverer.delivererPlaque} | کرایه : ${formatter.format(item.deliverer.shippingCost)} | سامانه :${ShippingCompanySource.filter(i => i.id === item.deliverer.shippingCompanySourceId).map(i => i.name)[0]}`}</p>

                                                                                                {/* <p>{`   توضیحات: ${cottageCode && rows.row.original.productSupplyId !== null ? cottageCode.filter((i: any) => i.id === rows.row.original.productSupplyId).map((i: any) => i.comment)[0] : ''} `}</p> */}
                                                                                                <p></p>

                                                                                            </div>

                                                                                        </div>
                                                                                    </td>
                                                                                </tr>)
                                                                            )}
                                                                        </tbody>

                                                                    </table>
                                                                </div> : ''}
                                                            {/* {row.original.shippingStatusId===2?null:<Suspense><LazyShippingCom  id={row.original.id}/></Suspense>} */}

                                                        </div> : ''}
                                                </div>
                                            </div> : ''}
                                        </tr>
                                        {(row.id === show.id) && show.isExpanded ?
                                            <tr className='Expanded' >
                                                <td colSpan={18} className="fadeInt   m-3    " >
                                                    {(row.id === show.id) && show.isExpanded ?
                                                        <div className="  expanded  rounded p-2  " >
                                                            {show.original.shippingReportRecords.length > 0 ?
                                                                <div className="w-85  containerTFull responsive  ">
                                                                    <table className="  table p-2   header-green "  >
                                                                        <thead style={{ color: 'white' }}>
                                                                            <tr>
                                                                                <th bgcolor=''>  شناسه سفارش</th>
                                                                                <th bgcolor='' >  ش ج سفارش</th>
                                                                                <th bgcolor=''> نام شرکت</th>
                                                                                <th bgcolor=''> کالا</th>
                                                                                <th bgcolor="">واحد</th>
                                                                                <th bgcolor=""> تاریخ </th>
                                                                                <th bgcolor=""> ارزش</th>
                                                                                <th bgcolor="">مقدار اعلامی</th>
                                                                                <th bgcolor="" > مقدار حمل شده</th>
                                                                                <th bgcolor="">مقدار بارنامه</th>
                                                                                <th bgcolor="">اطلاعات حمل</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className='table table-stripped' >
                                                                            {show.original.shippingReportRecords.map((item, index) => (
                                                                                <tr key={index + 1000000}>
                                                                                    <td aria-label=' شناسه سفارش' ><button className='border-0 bg-transparent text-primary' onClick={()=>handelNewTab(item.orderId)}>{item.orderId}</button></td>
                                                                                    <td aria-label=' ش ج سفارش'>{item.orderDetaiId}</td>
                                                                                    <td aria-label=' نام شرکت'>{item.companyName}</td>
                                                                                    <td aria-label='کالا'>{item.productName}</td>
                                                                                    <td aria-label='واحد'>{MeasureUnitSample.filter(i => i.id === item.measureUnitId).map(i => i.name)}</td>
                                                                                    <td aria-label='تاریخ'>{new Date(item.createDate).toLocaleDateString('fa-IR')}</td>
                                                                                    <td aria-label='ارزش'>{formatter.format(item.shippingValue)}</td>
                                                                                    <td aria-label='مقدار اعلامی'>{formatter.format(item.plannedQuantity)}</td>
                                                                                    {/*The unit price must be read from the backend*/}
                                                                                    <td aria-label='مقدار حمل شده'> {formatter.format(item.shippedQuantity)}</td>
                                                                                    <td aria-label='مقدار بارنامه'>{formatter.format(item.shippingQuantity)}</td>

                                                                                    <td aria-label='اطلاعات حمل'>
                                                                                        <div className="con-tooltip right" title='' >


                                                                                            <p> <FcShipped size={20} /></p>

                                                                                            <div className='tooltipShipReport'>
                                                                                                <p></p>
                                                                                                <p>{`شماره بارنامه: ${item.deliverer.shippingNumber} | سریال بارنامه: ${item.deliverer.shippingSerial} |  نام راننده : ${item.deliverer.delivererName} |
                                                                                                 تلفن راننده : ${item.deliverer.delivererNumber} | پلاک : ${item.deliverer.delivererPlaque} | کرایه : ${formatter.format(item.deliverer.shippingCost)} | سامانه :${ShippingCompanySource.filter(i => i.id === item.deliverer.shippingCompanySourceId).map(i => i.name)[0]}`}</p>

                                                                                                {/* <p>{`   توضیحات: ${cottageCode && rows.row.original.productSupplyId !== null ? cottageCode.filter((i: any) => i.id === rows.row.original.productSupplyId).map((i: any) => i.comment)[0] : ''} `}</p> */}
                                                                                                <p></p>

                                                                                            </div>

                                                                                        </div>
                                                                                    </td>
                                                                                </tr>)
                                                                            )}
                                                                        </tbody>

                                                                    </table>
                                                                </div> : ''}
                                                            {/* {row.original.shippingStatusId===2?null:<Suspense><LazyShippingCom  id={row.original.id}/></Suspense>} */}

                                                        </div> : ''}
                                                </td>
                                            </tr> : ''}
                                    </Fragment>)

                            })
                        }

                    </tbody>


                </table>
                <hr />
                <div className='d-block m-2   float-right'>
                    <span className=" " style={{ fontSize: 'small' }} >
                        نمایش
                        {""}  {page.length}  {""}

                        آیتم از
                        {""}   {rows.length}  {""}
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

export default MyClickableReport