import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa'
import './RightSlider.css'
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io'
import  QueryString  from 'qs';
import { GetAttachmentsWithoutoken } from '../../../services/attachmentService';

const attachmetURL = (window ).globalThis.stie_att;

const RightSideBanner = ({ slides, time, height, data }) => {
    const [current, SetCurrent] = useState(0)
    const length = data.componentDetails.length

    const[images,SetImages]=useState([])
    const autoPlayRef = useRef()

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


    // return (
    //     <div className=' rounded' style={{height:`${height}`}}>
    //         <div className='sliderRight'>

    //             {/* <div className='slider_control-sliderRight' onClick={nextSlide} />
    //             <div className='slider_control--right-sliderRight' onClick={prevSlide} /> */}
    //             {slides.map((item, index) => {

    //                 return (

    //                     <div className={index === current ? 'slide active' : 'slide'} key={index}>
    //                         {index === current && (<img src={item.img} alt='travel image' className='image' />)}

    //                     </div>
    //                 )
    //             })

    //             }

    //             <div className='afterSliderRight'>
    //             <div className=''>
    //             <h3>جزییات</h3>
    //                 </div>

    //                 <div>
    //                     تست
    //                 </div>
    //                 <div>
    //                 <button className='btn btn-success'><Link to='#'>لینک</Link></button> 
    //                 </div>
    //             </div>
    //         </div>

    //     </div>
    // )
    return (
        <div className='  m-1 radiusss' style={{ height: `${height}vh` ,minHeight:'45vh'}} >
            <div className='sliderRight ' >

                {data.componentDetails.map((item, index) => {


                    return (

                        <div className={index === current ? 'slide active ' : 'slide '} key={index} >
                            {index === current && (


                                <div className='row' style={{ height: '100%' }}>
                                    <div className={images.length > 0 ? 'sliderRightContainer ' : 'sliderRightContainer sliderRightContainerWithoutImage'} style={{ backgroundImage: `${images.length > 0 ? `url(${attachmetURL}${images.filter(b => b.id === item.id).map(x => x.path)[0]})` : ''}`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }} >


                                    </div>
                                    <div className='afterSliderRight text-center d-flex flex-column justify-content-around'>



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



                                </div>)}
                        </div>
                    )
                })}






            </div>
        </div>

    )
}

export default RightSideBanner