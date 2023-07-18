import {useState} from "react";
import {ClipLoader} from "react-spinners";

interface Props{
    loading:any , modalInfo:any , submitHandler:any ,closeModal:any,quantity:any, setquantity:any , formatter:any, productSupplyConditionId:any
}


const ModalSubmit:React.FC<Props> = ({ loading , modalInfo , submitHandler ,closeModal,quantity, setquantity , formatter, productSupplyConditionId }) => {
    const [check,setCheck]=useState(false)
    return(
      <div className="modalAddToCart text-center">
          <div className="d-block clearfix mb-2" onClick={closeModal}><svg
              xmlns="http://www.w3.org/2000/svg"
              width="24" height="24"
              viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-x close"
              data-dismiss="alert"><line x1="18" y1="6"
                                         x2="6"
                                         y2="18"></line><line
              x1="6" y1="6" x2="18" y2="18"></line></svg></div>
          <h4 className="text-center mb-2">{modalInfo.product.name}</h4>
          <p className="text-center text-primary">لطفا مقدار درخواست را به کیلوگرم وارد کنید</p>
          <p className="quantity-field" >

              <button className="value-button increase-button" onClick={() => setquantity(Number(quantity) + 1000)}>+
              </button>
              <input  className="number" placeholder="وزن سفارش" step={100}
                      type="text" value={quantity} onChange={(e:any) => setquantity(Number(e.target.value))} />
              <button className="value-button decrease-button "  onClick={() =>quantity>=1000 ?setquantity(Number(quantity) - 1000):""}>--
              </button>
          </p>
          {modalInfo.productSupplyConditions.length !==0 ? (
              <div>
                  { quantity >= modalInfo.productSupplyConditions.filter((i:any)=> i.id === productSupplyConditionId ).map((item:any)=>item.minSellableAmount) ? (<p></p>) : (
                      <p className="text-danger text-center mt-3">مقدار از حداقل مجاز سفارش کمتراست</p>)}
                  { quantity <= modalInfo.productSupplyConditions.filter((i:any)=> i.id === productSupplyConditionId ).map((item:any)=> item.maxSellableAmount) ? (<p></p>) : (
                      <p className="text-danger text-center mt-3">مقدار از حداکثر مجاز سفارش بیشتراست</p>)}
                  {modalInfo.comment  ?<div className="form-group" >
                      <p ><b style={{fontSize: 'medium'}}> توضیحات</b> : {  modalInfo.comment}</p>
                      <p className="text-center">

                          <label className="text-danger" style={{fontSize:'small'}}>توضیحات و شرایط را قبول دارم</label>
                          <input className="form-check-inline m-1 " type='checkbox' onChange={(e)=>setCheck(e.target.checked)}/>


                      </p>
                  </div>: modalInfo.productSupplyConditions && modalInfo.productSupplyConditions.filter((i:any)=> i.id === productSupplyConditionId ).map((item:any)=>item.comment)[0] ? <div className="form-group" >
                  <p ><b style={{fontSize: 'medium'}}> توضیحات</b> : { modalInfo.productSupplyConditions.filter((i:any)=> i.id === productSupplyConditionId ).map((item:any)=>item.comment) }</p>
                  <p className="text-center">

                      <label className="text-danger" style={{fontSize:'small'}}>توضیحات و شرایط را قبول دارم</label>
                      <input className="form-check-inline m-1 " type='checkbox' onChange={(e)=>setCheck(e.target.checked)}/>


                  </p>
              </div>:""}
                  <h5 className="text-center mt-2  ">قیمت کل :   { modalInfo.productSupplyConditions.filter((i:any)=> i.id === productSupplyConditionId ).map((item:any)=>item.price) ? formatter.format( modalInfo.productSupplyConditions.filter((i:any)=> i.id === productSupplyConditionId ).map((item:any)=>item.price)* quantity ):formatter.format( modalInfo.price * quantity)}</h5>
                  {modalInfo.comment ? <button disabled={  loading ?true : quantity >=  modalInfo.productSupplyConditions.filter((i:any)=> i.id === productSupplyConditionId ).map((item:any)=> item.minSellableAmount) && quantity <= modalInfo.productSupplyConditions.filter((i:any)=> i.id === productSupplyConditionId ).map((item:any)=> item.maxSellableAmount) && check  ? false : true}
                                               className="btn btn-success  " onClick={submitHandler}>اضافه به سبدخرید
                          <ClipLoader

                              loading={loading}
                              color="#ffff"
                              size={15}
                          /></button>:
                      <button disabled={  loading ?true :quantity >=  modalInfo.productSupplyConditions.filter((i:any)=> i.id === productSupplyConditionId ).map((item:any)=> item.minSellableAmount) && quantity <= modalInfo.productSupplyConditions.filter((i:any)=> i.id === productSupplyConditionId ).map((item:any)=> item.maxSellableAmount)  ? false : true}
                              className="btn btn-success m-auto d-block " onClick={submitHandler}>اضافه به سبدخرید
                          <ClipLoader

                              loading={loading}
                              color="#ffff"
                              size={15}
                          /></button>
                  }


                   </div>):(<div><h5 className="text-center m-auto d-block ">قیمت کل :   {formatter.format(modalInfo.price * quantity)}</h5> <button className="btn btn-primary text-sm-center d-block m-auto" onClick={submitHandler}>اضافه به سبدخرید
          </button>  </div>) }

      </div>
  )
}
export  default  ModalSubmit