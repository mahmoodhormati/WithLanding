import { NavLink } from "react-router-dom";
import News from "../../../Common/Shared/News/news";
import { Fragment, useState } from "react";
import BlockReport from "../../Reports/BlockReport";
import { GridLoader } from "react-spinners";


const DashbordCustomer: React.FC = () => {
  const [loading, setLoading] = useState(true);

  return (
    <Fragment>
       {loading ? <div className="loadingAddress">
        <div className="boxloadingAddress">
          <GridLoader loading={loading} color="#4236d6" />
        </div>
      </div> : null}
      <BlockReport setLoading={setLoading} />
   
      <hr /> 
      <News setloading={setLoading} />
    </Fragment>
  );
};
export default DashbordCustomer;
