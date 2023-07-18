import { useEffect } from "react"
import { Link, NavLink } from "react-router-dom"
import {AiOutlineMenu} from "react-icons/ai"
const HeaderClientMian:React.FC = () => {
 
return(
    <nav className="navbar navbar-mian navbar-expand-lg navbar-client " >
        <a className="navbar-brand" href="#">
        {/* <NavLink to="/client">
                            <img src="/assets/img/afralogo.png" className="navbar-logo" alt="logo" />
                        </NavLink> */}
        </a>

    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"><AiOutlineMenu size="2rem" /></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarText">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item ">
          <Link className="nav-link" to="/">صفحه اصلی <span className="sr-only">(current)</span></Link>
        </li>
        
        </ul>
      <span className="navbar-text">
      </span>
    </div>
    
  </nav>

)
}
export default HeaderClientMian