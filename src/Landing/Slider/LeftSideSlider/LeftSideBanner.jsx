import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io'
import { Link } from 'react-router-dom';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa'
import './LeftSlider.css'
import { GetAttachmentsWithoutoken } from '../../../services/attachmentService';
import  QueryString  from 'qs';

const attachmetURL = (window ).globalThis.stie_att;

const LeftSideBanner = ({ slides, time, height, data }) => {
    const [current, SetCurrent] = useState(0)
    const autoPlayRef = useRef()
    const[images,SetImages]=useState([])
    const length = data.componentDetails.length

    const nextSlide = () => {
        SetCurrent(current === length - 1 ? 0 : current + 1)
    }
    const prevSlide = () => {
        SetCurrent(current === 0 ? length - 1 : current - 1)
    }
    const entities=[...new Set(data.componentDetails.map((item) => item.id))]
    const GetSlideAttachments=async()=>{

        let localImage=[]
        
            
       
        try {
          for (let i = 0; i < entities.length; i++) {
            let configs = {
              headers: { "Content-Type": "application/json" },
              params: {
    
                EntityTypeId:25,
                EntityId:entities[i]
               
    
    
              },
              paramsSerializer: (params) => {
                return QueryString.stringify(params);
              },
            };
    
    const {data,status}=await GetAttachmentsWithoutoken(configs)
    
    localImage.push(data.result.globalAttachments.map(x=>({...x,id:entities[i]}))[0]);
            
          }
    
          SetImages(localImage)
          
        } catch (error) {
          
        }
    
    
      }
      

    useEffect(() => {

        autoPlayRef.current = nextSlide

    })

    useEffect(() => {

        setTimeout(() => {
            GetSlideAttachments()
          }, 5000);
        const play = () => {
            autoPlayRef.current()
        }

        const interval = setInterval(play, time * 1000)
        return () => clearInterval(interval)
    }, [])

    // if (!Array.isArray(data.componentDetails) || data.componentDetails.length <= 0) {
    //     return (
    //         <div className='  m-1 radiusss' style={{ height: `${height}` }} >
    //             <div className='sliderLeft ' >
    //                 <div className='afterSlider '>



    //                     <div >
    //                         <h3>جزییات</h3>
    //                     </div>

    //                     <p className='text-center mt-1 mb-3'>
    //                         تست
    //                     </p>
    //                     <div>
    //                         <button className='btn btn-success'><Link to='#'>لینک</Link></button>
    //                     </div>



    //                 </div>
    //                 {/* <div className='slider_control-LeftBanner' onClick={nextSlide} />
    //             <div className='slider_control--right-LeftBanner' onClick={prevSlide} /> */}
    //                 <div className='sliderContainer'>
    //                 </div>
    //             </div>
    //         </div>

    //     )
    // }


    return (
        <div className='  m-1 radiusss' style={{ height: `${height}vh` ,minHeight:'45vh'}} >
            <div className='sliderLeft ' >

                {data.componentDetails.map((item, index) => {


                    return (

                        <div className={index === current ? 'slide active ' : 'slide '} key={index} >
                            {index === current && (


                                <div className='row' style={{height:'100%'}}>
                                    <div className='afterSlider text-center d-flex flex-column justify-content-around'>



                                        <div >
                                            <h3>{item.title}</h3>
                                        </div>

                                        <p className='text-center mt-1 mb-3'>
                                           {item.description}
                                        </p>
                                        <div>
                                            <button className='btn btn-success'><Link to='#'>لینک</Link></button>
                                        </div>



                                    </div>

                                    <div className={images.length>0?'sliderLeftContainer ':'sliderLeftContainer sliderLeftContainerWithoutImage'} style={{ backgroundImage: `${images.length>0?`url(${attachmetURL}${images.filter(b=>b.id===item.id).map(x=>x.path)[0]})`:''}`,backgroundRepeat:'no-repeat',backgroundSize:'100% 100%', }} >

                                
                                    </div>

                                </div>)}
                        </div>
                    )
                })}






            </div>
        </div>

    )
}

export default LeftSideBanner