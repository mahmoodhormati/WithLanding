import { GetAllWallets } from "../../../services/walletService";
import React, { useState } from "react";
import QueryString from "qs";
import { PriceUnitEnums } from "../../../Common/Enums/PriceUnit";
import Pagination from "../../../Utils/pagination";
import { AiOutlineWarning } from "react-icons/ai";
import { TbListDetails } from "react-icons/tb"
import { Link } from "react-router-dom";
import it from "node:test";
const WalletList: React.FC = () => {
    const [PageNumber, setPageNumber] = useState(getPage().PageNumber ? getPage().PageNumber : 0)
    const [PageSize, setPageSize] = useState(getPage().PageSize ? getPage().PageSize : 10)
    const [totalCount, setTotalCount] = useState(0)
    const [wallets, setWallets] = useState<any>([])
    const param = { PageSize, PageNumber }

    function getPage() {
        let items = JSON.parse(String(sessionStorage.getItem(`param${window.location.pathname}`)));
        return items ? items : ''


    }

    const GetWallet = async () => {
        let config = {

            headers: { 'Content-Type': 'application/json' },
            params: {
                PageNumber,
                PageSize
            }
            ,
            paramsSerializer: (params: any) => {

                return QueryString.stringify(params)
            }

        };

        try {
            const { data, status } = await GetAllWallets(config);
            if (status === 200) {
                setWallets(data.result.wallets.values)
                setTotalCount(data.result.wallets.totalCount)

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

                                            <div className="col-lg-9">
                                                <div className="row">
                                                   
                                                <span className="col-lg-8 m-auto p-2">
                                                        <b>نزد شرکت </b>  {item.companyName}
                                                   
                                                        {" "}
                                                        موجودی  کیف پول شما<b>  {`${formatterForMoney.format(item.price)} ${PriceUnitEnums.filter(
                                                            (i: any) => i.id === item.priceUnitId
                                                        ).map((i: any) => i.name)} `}</b> می باشد.
                                                    </span>
                                                    
                                                   

                                                </div>
                                            </div>
                                            <span className="col-lg-2 text-center  m-auto button-auction">
                                                <Link className="border-0 bg-transparent non-hover edit-btn" title="تاریخچه کیف پول" to={`/client/walletHistory/${item.id}`}>

                                                    <TbListDetails size="1.5rem" />
                                                </Link>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <br />
                        <br />
                        <Pagination
                            setPageNumber={setPageNumber}
                            PageNumber={PageNumber}
                            getDataBySearch={GetWallet}
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
                    <AiOutlineWarning size="5rem " color="gold" />
                    <div>اطلاعاتی برای نمایش وجود ندارد</div>
                </div>
            </div>
        );
    }

}
export default WalletList