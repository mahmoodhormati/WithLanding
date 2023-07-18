

interface Props{
    order:any , product:any , customerDetail:any , customerName:any
}



const OrderCustomerInfo:React.FC<Props> =({order , product , customerDetail , customerName})=>{


    let extraD=(order.extraData)?JSON.parse(order.extraData.data):null
    return(                <div className=' row col-lg-12 col-md-12 col-sm-12 col-xs-12 p-4 text-dark ' style={{margin:"0"}}>


            < div className=" OrderCustomerInfo col-lg-3 rounded border  border-dark m-auto p-2 " style={{background:'#f7fdff'}} >
                <div className='  col-lg-12 col-md-4 col-sm-12 col-xs-12 '>
                    <b className="float-right">شماره سفارش : {order.id}</b>
                    <b className="float-start"> تاریخ : {new Date(order.createDate).toLocaleDateString('fa-IR')}</b>

                </div>
                <div className='  col-lg-12 col-md-4 col-sm-12 col-xs-12 mt-2'>
                    <b>شناسه بازارگاه: {extraD?extraD[0].Id:"--"}</b>
                </div>
                <div className='  col-lg-12 col-md-4 col-sm-12 col-xs-12  '>
                </div>
            </div>
            < div className=" OrderCustomerInfo col-lg-3 rounded border  border-dark m-auto p-2" style={{background:'#f7fdff'}} >

                <div className='  col-lg-12 col-md-4 col-sm-12 col-xs-12 text-center ' >
                    <b> نام کالا :{product.name }</b>
                </div>
                <div className='  col-lg-12 col-md-4 col-sm-12 col-xs-12  '>
                    <b>  <br/></b>
                </div>


            </div>
            < div className=" OrderCustomerInfo col-lg-3 rounded border  border-dark  m-auto p-2 " style={{background:'#f7fdff'}}>

                <div className='  col-lg-12 col-md-4 col-sm-12 col-xs-12  '>
                    <b>تلفن خریدار : {customerDetail.userName}</b>
                </div>
                <div className='  col-lg-12 col-md-4 col-sm-12 col-xs-12  '>
                    <b>خریدار : {customerName()}  </b>

                </div>

            </div>
        </div>
    )
}
export default OrderCustomerInfo