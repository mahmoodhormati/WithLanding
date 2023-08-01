import React, { Fragment, useEffect, useState, Suspense } from 'react'
import { useTable, useGlobalFilter, useSortBy, usePagination, useRowSelect, useExpanded } from 'react-table';
import { GetAllProductSupply } from "../../../services/productSupplyService";
import { GetShoppingsAdmin } from "../../../services/ShippingService";
import ShippingSelected from "../Common/shippingSelected";
import PageSizeTable from "../../../Utils/PageSize";
import Pagination from "../../../Utils/pagination";
import { formatter } from '../../../Utils/Formatter';
import { MdFormatListNumberedRtl } from 'react-icons/md';
import { getExtraData } from '../../../services/extraService';




const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = React.useRef()
        const resolvedRef = ref || defaultRef

        React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
        }, [resolvedRef, indeterminate])

        return (
            <>
                <input type="checkbox" className='' ref={resolvedRef} {...rest} />
            </>
        )
    }
)
const MyTableClick = ({ showAddress, columns, data, getData, bulkJob, formatRowProps, show, address, Detail, setPageNumber, PageNumber, setPageSize, PageSize, getDataBySearch, total, clickableHeader }) => {
    const [cottageCode, setcottageCode] = useState('');
    const [Shippings, SetShippings] = useState([])
    const [Shippingcheck, SetShippingCheck] = useState([])
    const [extData, setexdData] = useState([])
    const [orderId, setOrderId] = useState(0)
    let FilnalArr = [];
    const getSupplyCode = async () => {

        try {
            const { data, status } = await GetAllProductSupply(Detail[0].productSupplyId)
            setcottageCode(data.result.productSupply.cottageCode)
            setOrderId(Detail[0].orderId)
        } catch (e) {
            console.log(e)
        }

    }

    useEffect(() => {

        getSupplyCode()
    }, [Detail])

    useEffect(() => {
        const script = document.createElement("script");
        const scriptText = document.createTextNode(`

        
        
        $('#Order th').each(function(idx, el) {
            var check = !!$('#Order tbody tr').find('td:eq(' + idx + ')').filter(function() {
              return $.trim($(this).html()).length;
            }).length;
           
              
              $('#Order tr').find('td:eq(' + idx + '), th:eq(' + idx + ')').show();
              if (!check) {
                  $('#Order tr').find('td:eq(' + idx + '), th:eq(' + idx + ')').hide();
              }
            
          
          })`)

        script.appendChild(scriptText);
        document.body.appendChild(script);

        return (
            () => document.body.removeChild(script)
        )

    }, [data])



    const GetExternalData = async () => {

        setexdData([])

        const { id } = show

        if (id !== 0) {
            if (show.original.extId > 0) {
                const { data, status } = await getExtraData(show.original.extId, 1)
                if (data.result.extraData !== null) {
                    setexdData(JSON.parse(data.result.extraData.data))
                }
                else {
                    setexdData([])

                }
            }
        }

    }
    useEffect(() => {

        GetExternalData()

    }, [show])


    const [selectFunc, setSelectFunc] = useState(0);
    const [Func, SetFunc] = useState([]);
    const formattedvalues = [];

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        page,
        state,
        selectedFlatRows,
        state: { selectedRowIds, expanded }

    } = useTable({
        columns
        , data
        , initialState: {

            hiddenColumns: Func
        },

    }, useGlobalFilter, useSortBy, useExpanded, usePagination, useRowSelect, (hooks) => {
        hooks.visibleColumns.push((columns) => {
            return [
                // Let's make a column for selection
                {
                    id: 'selection',
                    accessor: 'انتخاب',
                    header: 'انتخاب',

                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <div className="Expanded">
                            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                        </div >
                    ),

                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({ row }) => (
                        <div className="Expanded">
                            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                        </div>
                    ),
                }
                ,
                {// Build our expander column
                    id: "expander", // Make sure it has an ID
                    Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
                        <span {...getToggleAllRowsExpandedProps()}>

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
                }
                ,
                {
                    // Build our expander column
                    id: "", // Make sure it has an ID
                    Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
                        <div {...getToggleAllRowsExpandedProps()}>
                        </div>
                    ), Cell: ({ row }) => (
                        // Use Cell to render an expander for each row.
                        // We can use the getToggleRowExpandedProps prop-getter
                        // to build the expander.
                        //    console.log(row)
                        <div className='row ml-2 Expanded'>
                            {row.original.extId > 0 ? <div className='text-center' data-title="بازارگاه" style={{
                                width: '.15rem',
                                height: "2rem",
                                backgroundColor: 'greenyellow'
                            }}></div>
                                : <div className='text-center' data-title="سیستمی" style={{ width: '.15rem', height: "2rem", backgroundColor: 'deepskyblue' }}>

                                </div>
                            }
                            {row.original.reserved === true ? <div className='text-center pl-1 ml-1 ' data-title="رزرو شده" style={{
                                width: '.15rem',
                                height: "2rem",

                                backgroundColor: 'orange'
                            }}></div> : ''

                            }
                           {row.original.duplicateId!==null ? <div className='text-center pl-1 ml-1 ' data-title={`تکرار سفارش ${row.original.duplicateId}`} style={{
                                width: '.15rem',
                                height: "2rem",

                                backgroundColor: 'red'
                            }}></div> : ''

                            }
                        </div>
                    ),




                },
                ...columns,]
        })
    })
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
    //     SetFunc( notNullable === 0 ?  formattedvalues:notNullable2 === 0 ? formattedvalues:notNullable3 === 0 ? formattedvalues:[])
    //
    //
    //
    // }, [rows])
    console.log(show);

    useEffect(() => {
        getData(selectedFlatRows);
    }, [selectedRowIds])

    return (
        <Fragment>
            <div className="table-responsive table-striped" style={{ overflowX: 'auto' }}>
                <div className='d-block clearfix mt-3 float-right'>
                    <PageSizeTable getDataBySearch={getDataBySearch} pageSize={PageSize} total={total} setPageSize={setPageSize} />
                </div>
                <div className='d-block clearfix mt-3 float-left'>
                    <span className=" py-3" style={{ fontSize: 'smaller' }}> اقدام دسته جمعی: </span>
                    {rows.find(item => item.original.active === true || item.original.active === false) ?
                        <select
                            // style={{height:'20px'}}
                            className='btn m-1  non-hover  bg-transparent shadow-none  p-0 '
                            style={{ fontSize: 'smaller' }}
                            value={selectFunc}
                            onChange={e => {
                                setSelectFunc(Number(e.target.value))
                            }}
                        >
                            {[{ id: 1, name: 'انتخاب' }, { id: 2, name: 'فعال ' }, { id: 5, name: 'غیرفعال ' }, {
                                id: 3,
                                name: 'کپی'
                            }, { id: 4, name: 'حذف' }].map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>

                            ))}
                        </select> : <select

                            // style={{height:'20px'}}
                            className='btn m-1  non-hover  bg-transparent shadow-none  p-0 '
                            style={{ fontSize: 'smaller' }}
                            value={selectFunc}
                            onChange={e => {
                                setSelectFunc(Number(e.target.value))
                            }}
                        >
                            {[{ id: 1, name: 'انتخاب' }, { id: 3, name: 'کپی' }, { id: 4, name: 'حذف' }].map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>

                            ))}
                        </select>}
                    <button className='btn-sm btn-light' onClick={() => bulkJob(selectFunc)}>ثبت</button>
                </div>
                <table id="Order" className='table responsive  mb-4  ' {...getTableProps()}>
                    <thead className='text-center'>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th className='' {...clickableHeader(column)}>{column.render("Header")}
                                        <span>
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? ' 🔽'
                                                    : ' 🔼'
                                                : ''}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className='' {...getTableBodyProps()}>
                        { // loop over the rows
                            rows.map((row, i) => {
                                prepareRow(row)
                                return (
                                    <Fragment key={i + "_frag"}>
                                        <tr  {...row.getRowProps()}  >
                                            { // loop over the rows cells
                                                row.cells.map((cell,index) => {

                                                    if (typeof (cell.value) === typeof ('') && cell.value.length > 35) {


                                                        return (
                                                            <td className='pr-2' aria-label={headerGroups.map(headerGroup => (headerGroup.headers.map((column)=>column.Header)).filter((item,i)=>i>2 && i===index).map((item,i)=>(item))[0])}
                                                         title={cell.value}>{cell.value.substring(0, 20)}</td>
                                                        )

                                                    }
                                                    else {
                                                        return (<td className='pr-2' aria-label={headerGroups.map(headerGroup => (headerGroup.headers.map((column)=>column.Header)).filter((item,i)=>i>2 && i===index).map((item,i)=>(item))[0])}>{cell.render('Cell')}</td>)
                                                    }
                                                }
                                                )
                                            }


                                        </tr>
                                        {(row.id === show.id) && show.isExpanded ?
                                            <tr >
                                                <td colSpan={18} className="fadeInt   m-3    " >
                                                    {(row.id === show.id) && show.isExpanded ?
                                                        <div className="  expanded shadow rounded p-2  " >
                                                            {Detail.length !== 0 ?
                                                                <div className="w-85  containerT  ">
                                                                    <table className={row.original.extId > 0 ? "  table m-1   header-green " : "table m-1 header-blue"} >
                                                                        <thead style={{ color: 'white' }}>
                                                                            <tr>
                                                                                <th bgcolor=''>  عرضه</th>
                                                                                <th bgcolor='' >  کوتاژ</th>
                                                                                <th bgcolor=''> کالا</th>
                                                                                <th bgcolor=''> وزن خرید</th>
                                                                                <th bgcolor=""> تاریخ </th>
                                                                                <th bgcolor="">فی</th>
                                                                                <th bgcolor="">آدرس</th>
                                                                                <th bgcolor="" > کد پستی</th>
                                                                                <th bgcolor="">تلفن</th>
                                                                                <th bgcolor="">موبایل</th>
                                                                                <th bgcolor="">خریدار</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className='table table-stripped' >
                                                                            {Detail.map((item, index) => (
                                                                                <tr key={index + 1000000}>
                                                                                    <td>{item.productSupplyId}</td>
                                                                                    <td>{cottageCode ? cottageCode : ""}</td>
                                                                                    <td>{item.product ? item.product.name : null}</td>
                                                                                    <td>{formatter.format(item.quantity)}</td>
                                                                                    <td>{new Date(item.createDate).toLocaleDateString('fa-IR')}</td>
                                                                                    {/*The unit price must be read from the backend*/}
                                                                                    <td>{formatter.format(item.basePrice)}</td>
                                                                                    <td title={item.fullAddress}>{item.fullAddress ? item.fullAddress.substring(0, 20) + "..." : ""}</td>
                                                                                    <td>{item.postalCode}</td>
                                                                                    <td>{item.receiverTel}</td>
                                                                                    <td>{item.receiverMobile ? item.receiverMobile : ""}</td>
                                                                                    <td title={item.receiverName} >{item.receiverName ? item.receiverName.substring(0, 20) + " ..." : ""}</td>
                                                                                </tr>)
                                                                            )}
                                                                        </tbody>

                                                                    </table>
                                                                </div> : ''}
                                                            {/* {row.original.shippingStatusId===2?null:<Suspense><LazyShippingCom  id={row.original.id}/></Suspense>} */}
                                                            {row.original.extId > 0 && extData.length > 0 ?
                                                                <div className=" w-85  table  ">
                                                                    <table className={row.original.extId > 0 ? "  table m-1   fixed_header header-green " : "table m-1   fixed_header  header-blue"} >
                                                                        <thead style={{ color: 'white' }}>
                                                                            <tr >
                                                                                <th bgcolor=""> کد تخصیص</th>
                                                                                <th bgcolor=""> شناسه بازارگاه</th>
                                                                                <th bgcolor="">وزن خرید </th>
                                                                                <th bgcolor="">وزن بارنامه شده</th>
                                                                                <th bgcolor="">وزن بارنامه نشده </th>
                                                                                <th bgcolor="">شناسه واریز</th>
                                                                                <th bgcolor="">شماره پیگیری</th>
                                                                                <th bgcolor="">کد ملی تحویل گیرنده</th>
                                                                                <th bgcolor="">کد یکتا</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {extData.length === 0 ? null : extData.map((address, index) => (
                                                                                <tr key={index + 2000}>
                                                                                    <td>
                                                                                        {address.AllocationId}
                                                                                    </td>
                                                                                    <td >
                                                                                        {address.Id}
                                                                                    </td>
                                                                                    <td  >
                                                                                        {formatter.format(address.Qty)}
                                                                                    </td>  <td >
                                                                                        {formatter.format(address.WBarnameShode)}
                                                                                    </td>
                                                                                    <td >
                                                                                        {formatter.format(address.WBarnameNashode)}
                                                                                    </td>
                                                                                    <td>
                                                                                        {address.SellerAcc}
                                                                                    </td>
                                                                                    <td>
                                                                                        {address.TraceCode}
                                                                                    </td>
                                                                                    <td>
                                                                                        {address.ReceiverId}
                                                                                    </td>
                                                                                    <td>
                                                                                        {address.BuyerUniqueId}
                                                                                    </td>
                                                                                </tr>)
                                                                            )}
                                                                        </tbody>
                                                                    </table>
                                                                </div> : ''}
                                                        </div> : ''}
                                                </td>
                                            </tr> : ''}
                                    </Fragment>)
                            })
                        }
                    </tbody>

<tfoot>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
</tfoot>
                </table>
                <hr />
                <br />
                <div className='d-block m-2   float-right'>
                    <span className=" " style={{ fontSize: 'small' }}>
                        نمایش
                        {""} {PageSize >= total ? total : PageSize} {""}

                        آیتم از
                        {""} {total === 0 ? rows.length : total} {""}
                    </span>
                </div>
            </div>
            <Pagination setPageNumber={setPageNumber} PageNumber={PageNumber} getDataBySearch={getDataBySearch} PageSize={PageSize} total={total} />
        </Fragment>
    );

}

export default MyTableClick