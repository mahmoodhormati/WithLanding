

import { useEffect, useRef, useState } from "react";
import { classNames } from "@react-pdf-viewer/core";

import './sliderStyl.css'
import { GetAttachmentsWithoutoken } from "../../../services/attachmentService";
import  QueryString  from 'qs';

const attachmetURL = (window ).globalThis.stie_att;

const FullSizeBanner = ({slides,time,height,data})=> {
  const [activeSlide, setActiveSlide] = useState(0)
  const[images,SetImages]=useState([])
  
  const [current, SetCurrent] = useState(0)
  const length = data.componentDetails.length
  const [sliderReady, setSliderReady] = useState(true)
  const IMAGE_PARTS = 4;
  let changeTO = null;
  const AUTOCHANGE_TIME = 1;
 
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
  

 
  const nextSlide = () => {
    SetCurrent(current === length - 1 ? 0 : current + 1)
    setActiveSlide(current === length - 1 ? 0 : current + 1)
}
const prevSlide = () => {
    SetCurrent(current === 0 ? length - 1 : current - 1)
    setActiveSlide(current === 0 ? length - 1 : current - 1)

}
 
  const autoPlayRef = useRef()

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


     
        
          

          const interval = setInterval(play, time*1000)
     
    
    return () => {
      clearInterval(interval)
    }
  }, [])
  
  return (
    <div className={`${images.length>0? ` slider m-1 radiusss ${classNames( { 's--ready': sliderReady })}`:` sliderWithoutimage slider m-1 radiusss ${classNames( { 's--ready': sliderReady })}`}`} style={{height:`${height}vh` ,minHeight:'50vh'} }>
  
      <div className="slider__slides">
        {data.componentDetails.map((slide, index) => (
          <div
            className={`slider__slide ${classNames( { 's--active': activeSlide === index, 's--prev': prevSlide === index  })}`}
            key={slide.id}
            >
            <div className="slider__slide-content">
             
              <h2 className="slider__slide-subheading">
                {slide.title}
              </h2>
              <p className="slider__slide-subheading ">{slide.description}</p>
              <button  className="slider__slide-readmore btn btn-success">{slide.buttonName}</button>
            </div>
            <div className="slider__slide-parts">
              {[...Array(IMAGE_PARTS).fill()].map((x, i) => (
                <div className="slider__slide-part" key={i}>
                  <div className="slider__slide-part-inner" style={{ backgroundImage: `url(${attachmetURL}${images.filter(b=>b.id===slide.id).map(x=>x.path)[0]})` }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* <div className="slider__control" onClick={prevSlide} />
      <div className="slider__control slider__control--right" onClick={nextSlide} /> */}
    </div>
  );
}


export default FullSizeBanner 