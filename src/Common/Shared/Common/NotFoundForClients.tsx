import  React  from 'react';
import { Link,useNavigate } from 'react-router-dom';


const NotFoundForClients:React.FC = () => {


    const navigate=useNavigate()

  return( <div className="page-wrap d-flex flex-row align-items-center">
  <div className="container">
      <div className="row justify-content-center">
          <div className="col-md-12 text-center">
              <h2 className="display-1 d-block">404</h2>
              <div className="mb-4 mt-4 lead">صفحه مورد نظر یافت نشد</div>
              <Link to='#'  className="btn btn-primary" onClick={()=>navigate(-1)}>بازگشت به صفحه قبل</Link>
          </div>
      </div>
  </div>
</div>)
}
export default NotFoundForClients