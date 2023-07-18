import React, {Fragment, useEffect, useState} from 'react'
import {useTable, useGlobalFilter, useSortBy, usePagination, useRowSelect, useExpanded} from 'react-table';
import {GetAllProductSupply} from "../../../services/productSupplyService";

import PageSizeTable from "../../../Utils/PageSize";
import Pagination from "../../../Utils/pagination";



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
const TableOrderCustomer = ({showAddress ,columns, data, getData, bulkJob, formatRowProps, show,Detail, setPageNumber,PageNumber ,setPageSize, PageSize,getDataBySearch , total}) => {
    const [cottageCode, setcottageCode] = useState('');


    const getSupplyCode = async () => {
        try {
            const {data , status}= await GetAllProductSupply(Detail[0].productSupplyId)
            setcottageCode(data.result.productSupply.cottageCode)
        }catch (e) {
            console.log(e)
        }

    }

useEffect(()=>{
    // getSupplyCode()
},[Detail])



    const [selectFunc, setSelectFunc] = useState(0);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        page,
        state,
        selectedFlatRows,
        state: {selectedRowIds}

    } = useTable({
        columns
        , data,

    }, useGlobalFilter, useSortBy, useExpanded, usePagination, useRowSelect, hooks => {
        hooks.visibleColumns.push(columns => [
            // Let's make a column for selection
            {
                id: 'selection',
                // The header can use the table's getToggleAllRowsSelectedProps method
                // to render a checkbox
                Header: ({ getToggleAllRowsSelectedProps }) => (
                    <div>
                        <IndeterminateCheckbox{...getToggleAllRowsSelectedProps()} />
                    </div>
                ),
                // The cell can use the individual row's getToggleRowSelectedProps method
                // to the render a checkbox
                Cell: ({row}) => (
                    <div>
                        <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                    </div>
                ),
            },
            {
                // Build our expander column
                id: "expander", // Make sure it has an ID
                Header:({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
                    <span {...getToggleAllRowsExpandedProps()}>

                  </span>
            ), Cell:({row}) => (

                // Use Cell to render an expander for each row.
                // We can use the getToggleRowExpandedProps prop-getter
                // to build the expander.

                <span className="Expanded" {...row.getToggleRowExpandedProps()}>
             {row.isExpanded ?
                <svg {...row.getRowProps(formatRowProps && formatRowProps(row))} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                      className="bi bi-chevron-down" viewBox="0 0 16 16">
                    <path fillRule="evenodd"
                          d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg>
                : <svg  {...row.getRowProps(formatRowProps && formatRowProps(row))} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  className="bi bi-chevron-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd"
                          d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg>}
          </span>
                )
            },{
                // Build our expander column
                id: "", // Make sure it has an ID
                Header: ({getToggleAllRowsExpandedProps, isAllRowsExpanded}) => (
                    <span {...getToggleAllRowsExpandedProps()}>

                      </span>

                ),
                Cell: ({row}) => (
                    // Use Cell to render an expander for each row.
                    // We can use the getToggleRowExpandedProps prop-getter
                    // to build the expander.
                    <span {...row.getToggleRowExpandedProps()}>
                        { row.original.extId >0  ? <div data-title="بازارگاه" style={{width:'10px' , height:"10px", backgroundColor: 'greenyellow'}}></div> : <div style={{width:'10px' , height:"10px", backgroundColor: 'deepskyblue'}}></div>
                        }
          </span>
                )
            },
            ...columns,
        ])
    })


    useEffect(() => {
        getData(selectedFlatRows);
    }, [selectedRowIds])

    // useEffect(()=>{
    //     const script = document.createElement("script");
    //     const scriptText = document.createTextNode(`

        
        
        
    //     $('#zero-config th').each(function(idx, el) {
    //         var check = !!$('#zero-config tbody tr').find('td:eq(' + idx + ')').filter(function() {
    //           return $.trim($(this).html()).length;
    //         }).length;
    //         console.log(check)
              
    //           $('#zero-config tr').find('td:eq(' + idx + '), th:eq(' + idx + ')').show();
    //           if (!check) {
    //               $('#zero-config tr').find('td:eq(' + idx + '), th:eq(' + idx + ')').hide();
    //           }
            
          
    //       })`)

    //           script.appendChild(scriptText);
    //           document.head.appendChild(script);
        
    // },[data])

    return (
        <Fragment>


            <div className="table-responsive table-striped"
                 style={{overflowX: 'auto'}}
            >
                <div className='d-block clearfix mt-3 float-right'>

                    <PageSizeTable getDataBySearch={getDataBySearch} pageSize={PageSize} setPageSize={setPageSize}/>

                </div>
                <div className='d-block clearfix mt-3 float-left'>
                    <span className=" py-3" style={{fontSize: 'smaller'}}> اقدام دسته جمعی: </span>
                    {rows.find(item => item.original.active === true || item.original.active === false) ?
                        <select
                            // style={{height:'20px'}}
                            className='btn m-1  non-hover  bg-transparent shadow-none  p-0 '
                            style={{fontSize: 'smaller'}}
                            value={selectFunc}
                            onChange={e => {
                                setSelectFunc(Number(e.target.value))
                            }}
                        >
                            {[{id: 1, name: 'انتخاب'}, {id: 2, name: 'فعال '}, {id: 5, name: 'غیرفعال '}, {
                                id: 3,
                                name: 'کپی'
                            }, {id: 4, name: 'حذف'}].map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>

                            ))}
                        </select> : <select
                            // style={{height:'20px'}}
                            className='btn m-1  non-hover  bg-transparent shadow-none  p-0 '
                            style={{fontSize: 'smaller'}}
                            value={selectFunc}
                            onChange={e => {
                                setSelectFunc(Number(e.target.value))
                            }}
                        >
                            {[{id: 1, name: 'انتخاب'}, {id: 3, name: 'کپی'}, {id: 4, name: 'حذف'}].map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>

                            ))}
                        </select>}
                    <button className='btn-sm btn-light' onClick={() => bulkJob(selectFunc)}>ثبت</button>
                </div>

                <table id="zero-config" className='table mb-4  ' {...getTableProps()}
                    // style={{ transform:'rotateX(180deg)'}}
                >

                    <thead className='text-center'>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}
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
                    <tbody className='text-center' {...getTableBodyProps()}>
                    { // loop over the rows
                        rows.map((row , i) => {

                            prepareRow(row)
                            return (
                                <Fragment key={i + "_frag"}>
                                    <tr {...row.getRowProps()} key={row.id}>
                                        { // loop over the rows cells
                                               row.cells.map(cell => {

                                                if (typeof (cell.value) === typeof ('') && cell.value.length > 27) {
    
    
                                                    return (
                                                        <td className='pr-2' title={cell.value}>{cell.value.substring(0, 20)}</td>
                                                    )
    
                                                }
                                                else {
                                                    return (<td className='pr-2'>{cell.render('Cell')}</td>)
                                                }
                                            }
                                            )
                                        }


                                    </tr>
                                    {row.id === show && showAddress && row.isExpanded ?
                                    <tr className="p-4 m-3 ">
                                        <td    colSpan={15}   className="fadeInt   m-3    " >
                                    {row.id === show && showAddress && row.isExpanded ?

                                                    <div className="  shadow rounded p-2  " >


                                                        <div  className="w-85  table table-responsive   ">

                                                            <table   className="  w-100 " >

                                                                <thead  style={{color:'white'}}>
                                                                <tr>
                                                                    <th bgcolor='#247881'>  عرضه</th>
                                                                    <th bgcolor='#247881' >  کوتاژ</th>
                                                                    <th bgcolor='#247881'> کالا</th>
                                                                    <th bgcolor='#247881'> وزن خرید</th>
                                                                    <th bgcolor="#247881"> تاریخ </th>
                                                                    <th bgcolor="#247881">فی</th>
                                                                    <th bgcolor="#247881">آدرس</th>
                                                                    <th bgcolor="#247881">کد پستی</th>
                                                                    <th bgcolor="#247881">تلفن</th>
                                                                    <th bgcolor="#247881">موبایل</th>
                                                                    <th bgcolor="#247881">خریدار</th>


                                                                </tr>
                                                                </thead>
                                                                <tbody className='table table-stripped' >
                                                                {Detail.map((item ,i)=>
                                                                <tr  key={i}>
                                                                    <td >{item.productSupplyId}</td>
                                                                    <td >{cottageCode}</td>
                                                                    <td >{item.product ?item.product.name :null}</td>
                                                                    <td >{item.quantity}</td>
                                                                    <td >{new  Date(item.createDate).toLocaleDateString('fa-IR')}</td>
                                                                    {/*The unit price must be read from the backend*/}
                                                                    <td >{item.price / item.quantity}</td>
                                                                    <td title={item.fullAddress}>{item.fullAddress?item.fullAddress.substring(0,20)+ "...":""}</td>
                                                                    <td >{item.postalCode}</td>
                                                                    <td >{item.receiverTel}</td>
                                                                    <td >{item.receiverMobile}</td>
                                                                    <td title={item.receiverName} >{item.receiverName? item.receiverName.substring(0,20) +" ...": ""}</td>

                                                                </tr>
                                                                )}
                                                                </tbody>


                                                            </table>
                                                        </div>


                                                    </div> :null}
                                        </td>
                                    </tr>:null}

                                </Fragment>
                            )
                        })
                    }

                    </tbody>

                </table>

                <hr/>
                <div className='d-block m-2   float-right'>
               <span className=" " style={{fontSize: 'small'}}>
                  نمایش
                   {""} {PageSize >= total ? page.length : PageSize} {""}

                   آیتم از
                   {""} {total === 0 ? rows.length : total} {""}
              </span>
                </div>
            </div>

            <Pagination setPageNumber={setPageNumber} PageNumber={PageNumber}  getDataBySearch={getDataBySearch} PageSize={PageSize} total={total}/>


        </Fragment>
    );

}

export default TableOrderCustomer