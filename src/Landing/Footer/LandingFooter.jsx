import React from 'react'

import './style.css'

const LandingFooter = () => {
  return (
   
    <footer id="Footer" style={{backgroundColor:'#292c2f'}} className="page-footer font-small stylish-color-dark pt-4">

        
      <div style={{backgroundColor:'#292c2f'}} className=" text-center text-md-left">
        <div className="row">
          <div className="col-md-4 mx-auto">
           
            <h5 className="text-uppercase font-weight-bold mt-3 mb-4">About our Company</h5>
            <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{width: '70px'}}/>
            <p>Here you can use rows and columns to organize your footer content. Lorem ipsum dolor sit amet,
              consectetur
              adipisicing elit.</p>
          </div>
          <hr className="clearfix w-100 d-md-none"/>
          <div id="link10" className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 className="text-uppercase font-weight-bold">Products</h6>
            <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{width: '70px'}}/>
            <p>
              <a href="#!">Travelling</a>
            </p>
            <p>
              <a href="#!">About</a>
            </p>
            <p>
              <a href="#!">BrandFlow</a>
            </p>
            <p>
              <a href="#!">Services</a>
            </p>
          </div>
          <hr className="clearfix w-100 d-md-none"/>
          <div id="link10" className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 className="text-uppercase font-weight-bold">Useful links</h6>
            <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{width: '70px'}}/>
            <p>
              <a href="#!">Your Account</a>
            </p>
            <p>
              <a href="#!">Become an Affiliate</a>
            </p>
            <p>
              <a href="#!">Shipping Rates</a>
            </p>
            <p>
              <a href="#!">Help</a>
            </p>
          </div>
          <hr className="clearfix w-100 d-md-none"/>
          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
            <h6 className="text-uppercase font-weight-bold">Contact</h6>
            <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{width: '60px'}}/>
            <p>
              <i className="fas fa-home mr-3"></i> Mumbai, Maharashtra</p>
            <p>
              <i className="fas fa-envelope mr-3"></i> collab@codewithfaraz.com</p>
            <p>
              <i className="fas fa-phone mr-3"></i> + 91 80254 52xxx</p>
            <p>
              <i className="fas fa-print mr-3"></i> + 91 80254 55xxx</p>
          </div>
        </div>
      </div>
      <hr/>
   
      <ul style={{backgroundColor:'#292c2f'}}className="list-unstyled list-inline text-center py-2">
        <li className="list-inline-item">
          <h5 className="mb-1">Register for free</h5>
        </li>
        <li className="list-inline-item">
          <a href="#Contact" className="btn btn-outline-danger btn-rounded">Sign up!</a>
        </li>
      </ul>
      <hr/>
      
      <div className="hover-effect1">
      <ul  style={{backgroundColor:'#292c2f'}} className="list-unstyled list-inline text-center">
        <li className="list-inline-item">
          <a href="https://www.facebook.com/codewithfaraz" title="Facebook"><i className="fa fa-facebook"></i></a>
        </li>
        <li className="list-inline-item">
          <a href="https://www.twitter.com/codewithfaraz" title="Twitter"><i className="fa fa-twitter"></i></a>
        </li>
        <li className="list-inline-item">
          <a href="https://www.instagram.com/codewithfaraz" title="Instagram"><i className="fa fa-instagram"></i></a>
        </li>
        <li className="list-inline-item">
          <a href="https://www.youtube.com/@codewithfaraz" title="Youtube"><i className="fa fa-youtube"></i></a>
        </li>
        <li className="list-inline-item">
          <a href="#." title="Github"><i className="fa fa-github"></i></a>
        </li>
      </ul>
    </div>
     
      <div   className="footer-copyright text-center py-3">
        Copyright© 2023: Design and Develop by Faraz
      </div>
      
    </footer>

  )
}

export default LandingFooter