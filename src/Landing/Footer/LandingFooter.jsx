import React from 'react'

import './style.css'
import { BsFacebook, BsGithub, BsInstagram, BsTwitter, BsYoutube } from 'react-icons/bs'

const LandingFooter = () => {
  return (
   
    <footer id="Footer"  style={{minHeight:'30vh'}}>

        
      <div  className=" text-center text-md-left">
        <div className="row">
          <div className="col-md-4 mx-auto">
           
            <h5 className="text-uppercase font-weight-bold mt-3 mb-4">درباره ما</h5>
            <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{width: '70px'}}/>
            <p>
              ما خیلی انیم تمام
            </p>
          </div>
          
          <div id="link10" className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 className="text-uppercase font-weight-bold">محصولات</h6>
            
            <p>
              <a href="#!">کنجاله</a>
            </p>
            <p>
              <a href="#!">روغن</a>
            </p>
            <p>
              <a href="#!">ذرت</a>
            </p>
            <p>
              <a href="#!">جو</a>
            </p>
          </div>
         
          <div id="link10" className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 className="text-uppercase font-weight-bold">لینک های مرتبط</h6>
          
            <p>
              <a href="#!">وبلاگ </a>
            </p>
            <p>
              <a href="#!">بازارگاه</a>
            </p>
            <p>
              <a href="#!">گمرک</a>
            </p>
            <p>
              <a href="#!">باربری</a>
            </p>
          </div>
         
          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
            <h6 className="text-uppercase font-weight-bold">آدرس</h6>
            <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{width: '60px'}}/>
            <p>
              <i className="fas fa-home "></i>تهران ، بلوار آفریقا ، کوچه گلخانه پلاک 14</p>
            <p>
               </p>
            <p>
              <i className="fas fa-phone "></i>2852 21 +</p>
            <p>
              <i className="fas fa-print mr-3"></i> </p>
          </div>


          
        </div>
       
      
     
        <div className="hover-effect1 d-flex justify-content-center ">
      <ul   className="list-unstyled list-inline text-center">
        <li className="">
          <a href="https://www.facebook.com/codewithfaraz" title="Facebook"><BsFacebook/></a>
        </li>
        <li className="">
          <a href="https://www.twitter.com/codewithfaraz" title="Twitter"><BsTwitter/></a>
        </li>
        <li className="">
          <a href="https://www.instagram.com/codewithfaraz" title="Instagram"><BsInstagram/></a>
        </li>
        <li className="">
          <a href="https://www.youtube.com/@codewithfaraz" title="Youtube"><BsYoutube/></a>
        </li>
        <li className="">
          <a href="#." title="Github"><BsGithub/></a>
        </li>
      </ul>
    </div>
      </div>
   
     
      
     
     
      <div   className="footer-copyright text-center py-3">
        Copyright© 2023: Design and Develop by Faraz
      </div>
      
    </footer>

  )
}

export default LandingFooter