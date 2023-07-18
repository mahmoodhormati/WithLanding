import React, {useState} from "react";
import QueryString from "qs";
import {GetAllWallets, GetWalletHistories} from "../../../services/walletService";
import {Link, useParams} from "react-router-dom";
import {PriceUnitEnums} from "../../../Common/Enums/PriceUnit";
import {TbListDetails} from "react-icons/tb";
import Pagination from "../../../Utils/pagination";
import {AiOutlineWarning} from "react-icons/ai";

const WalletHistories:React.FC = () => {
    const params =useParams()
    const [PageNumber, setPageNumber] = useState(getPage().PageNumber ? getPage().PageNumber : 0)
    const [PageSize, setPageSize] = useState(getPage().PageSize ? getPage().PageSize : 10)
    const [totalCount, setTotalCount] = useState(0)
    const [wallets, setWallets] = useState<any>([])
    const param = {PageSize, PageNumber}

    function getPage() {
        let items = JSON.parse(String(sessionStorage.getItem(`param${window.location.pathname}`)));
        return items ? items : ''


    }
  const GetHistory =async () => {
      let config = {

          headers: {'Content-Type': 'application/json'},
          params: {
              WalletId:params.id,
              PageNumber,
              PageSize
          }
          ,
          paramsSerializer: (params: any) => {

              return QueryString.stringify(params)
          }

      };

      try {
          const {data, status} = await GetWalletHistories(config);
          if (status === 200) {
              setWallets(data.result.walletHistories.values)
              setTotalCount(data.result.walletHistories.totalCount)

              sessionStorage.setItem(`param${window.location.pathname}`, JSON.stringify(param));


          }

      } catch (err) {
          console.log(err)
          setWallets(null)

      }
  }
    let formatterForMoney = new Intl.NumberFormat('fa-IR', {

        currency: 'IRR'


    });
    if (wallets) {
        return (
            <div>

                <div className=" text-right ">

                    <div>
                        {wallets.map((item: any, index: any) => (
                            <div key={index} className="col-sm-10 col-md-12 m-1">
                                <div className="  auction-item-2 text-center  ">
                                    <div className="auction-content">
                                        <div className=" row bid-area">

                                            <div className="col-lg-12">
                                                <div className="row">
         
                                                    <span className=" col-lg-2 m-auto p-2 ">
                            {" "}
                                                        <b>تاریخ</b>: {new Date(item.createDate).toLocaleDateString("fa-IR")}
                          </span>
                                                    <span className="col-lg-2 m-auto p-2">
                            {" "}
                                                        <b>قیمت </b>: : {`${formatterForMoney.format(item.price)} ${PriceUnitEnums.filter(
                                                            (i: any) => i.id === item.priceUnitId
                                                        ).map((i: any) => i.name)}`}
                          </span>
                                                
                                                    <span className="col-lg-2 m-auto p-2">
                            <b>توضیحات  </b> : {item.comment}
                          </span>

                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <br/>
                        <br/>
                        <Pagination
                            setPageNumber={setPageNumber}
                            PageNumber={PageNumber}
                            getDataBySearch={GetHistory}
                            PageSize={PageSize}
                            total={totalCount}
                        />
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div>

                <div className="text-center dashboard-widget">
                    <AiOutlineWarning size="5rem " color="gold"/>
                    <div>اطلاعاتی برای نمایش وجود ندارد</div>
                </div>
            </div>
        );
    }

}
export default WalletHistories