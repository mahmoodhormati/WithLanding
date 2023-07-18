import React from 'react'
import { Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import MyTable from '../../Common/Shared/Form/MyTable';
import QueryString from 'qs';
import { GetWalletHistories } from '../../services/walletService';
import { EntityTypes}  from '../../Common/Enums/EntityTypesEnums';
import { PriceUnitEnums } from '../../Common/Enums/PriceUnit';
import { formatter } from '../../Utils/Formatter';

const WalletHistories: React.FC = () => {
    const [PageNumber, setPageNumber] = useState(0)
    const [PageSize, setPageSize] = useState(10)
    const [selectedRows, setSelectedRows] = useState([])
    const [totalCount, setTotalCount] = useState(0);
    const [walletHistory, SetwalletHistory] = useState<any>([])
    const params = useParams()
    let arrayOfSelectedData = [];
    const getSelectedData = (data: any) => {

        arrayOfSelectedData = data.map((item: any) => item.original);


        return (arrayOfSelectedData)

    }
    const DeleteSelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < arrayOfData.length; i++) {




        }

    }
    const copySelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        const copyData = arrayOfData.map((item: any) => {
            return { ...item, id: 0, active: true, createDate: new Date() }
        })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {



        }


    }
    const enableSelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        const copyData = arrayOfData.map((item: any) => {
            return { ...item, active: true }
        })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {




        }


    }
    const disableSelectedItem = async () => {
        const arrayOfData = getSelectedData(selectedRows);
        const copyData = arrayOfData.map((item: any) => {
            return { ...item, active: false }
        })

        let successCount = 0;
        let errorCount = 0;
        for (let i = 0; i < copyData.length; i++) {




        }


    }
    const getDataByPage = async () => {
        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {



                WalletId: params.id,
                IsAdmin: true,
                PageNumber,
                PageSize


            }
            ,
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }

        };

        try {
            const { data, status } = await GetWalletHistories(config);
            if (status === 200) {
                SetwalletHistory(data.result.walletHistories.values)
                setTotalCount(data.result.walletHistories.totalCount)




            }

        } catch (err) {
            console.log(err)
            SetwalletHistory(null)

        }
    }






    const columns = useMemo(() => [

        { Header: 'تاریخ ', accessor: 'createDate' ,Cell:(rows:any)=>{
            if(rows.row.original.createDate){

                return (new Date(rows.row.original.createDate).toLocaleDateString('fa-IR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }))
            }
            else{
                return(null)
            }
        }},
        { Header: 'شناسه ', accessor: 'entityId' },
        { Header: 'مرتبط با ', accessor: 'entityTypeId' ,Cell:(rows:any)=>{

            if(rows.row.original.entityTypeId){

                return(EntityTypes.filter((i:any)=>i.id===rows.row.original.entityTypeId).map((i:any)=>i.name))
            }
            else{
                return(null)
            }

        }},
        { Header: 'مبلغ ', accessor: 'price' ,Cell:rows=>{

return(formatter.format(rows.row.original.price))

        }},
        { Header: 'واحد ', accessor: 'priceUnitId',Cell:(rows:any)=>{

            if(rows.row.original.priceUnitId){

                return(PriceUnitEnums.filter((i:any)=>i.id===rows.row.original.priceUnitId).map((i:any)=>i.name))
            }
            else{
                return(null)
            }

        } },
        { Header: 'توضیحات ', accessor: 'comment' }



    ], [])
    const data = useMemo(() => walletHistory, [walletHistory])


    return (
        <Fragment>
            <div className='user-progress'>
                <div>

                    <div className=" statbox widget-content widget-content-area text-dark ">
                        <div className=' row col-lg-12 col-md-12 col-sm-12 col-xs-12 p-4 text-dark rounded  border' style={{ margin: "0" }}>


                            < div className=" OrderCustomerInfo col-lg-12   border-dark p-2 "  >
                                <div className='  col-lg-12 col-md-4 col-sm-12 col-xs-12 row '>
                                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center'>

                                        <h6>سوابق کیف پول شماره {params.id}</h6>
                                    </div>


                                </div>

                                <div className='  col-lg-12 col-md-4 col-sm-12 col-xs-12  '>
                                </div>
                            </div>



                        </div>
                    </div>

                    <div className=" statbox widget-content widget-content-area text-dark mt-4 mb-4 ">
                        {walletHistory ? <div>
                            <MyTable columns={columns} data={data} getData={(rows: any) => setSelectedRows(rows)} bulkJob={null}
                                total={totalCount}
                                setPageSize={setPageSize}
                                PageSize={PageSize}
                                getDataBySearch={getDataByPage}
                                setPageNumber={setPageNumber}
                                PageNumber={PageNumber}
                            />
                        </div> : <div className='text-center mt-5'>
                            <h5>اطلاعاتی جهت نمایش موجود نیست</h5>
                        </div>}

                    </div>

                </div>

            </div>
        </Fragment>
    )
}

export default WalletHistories