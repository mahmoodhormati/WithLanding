

import { useEffect, useRef, useState } from "react";
import { classNames } from "@react-pdf-viewer/core";

import './sliderStyl.css'



const FullSizeBanner = ({slides,time,height})=> {
  const [activeSlide, setActiveSlide] = useState(0)
  
  const [current, SetCurrent] = useState(0)
  const length = slides.length
  const [sliderReady, setSliderReady] = useState(true)
  const IMAGE_PARTS = 3;
  let changeTO = null;
  const AUTOCHANGE_TIME = 1;
 
  
 
  
  const nextSlide = () => {
    SetCurrent(current === length - 1 ? 0 : current + 1)
    setActiveSlide(current === length - 1 ? 0 : current + 1)
}
const prevSlide = () => {
    SetCurrent(current === 0 ? length - 1 : current - 1)
    setActiveSlide(current === 0 ? length - 1 : current - 1)

}
  const changeSlides = (change) => {
    window.clearTimeout(changeTO);
    const { length } = slides;
    
    
    let activeSlideNew = prevSlide + change;
    if (activeSlideNew < 0) activeSlideNew = length - 1;
    if (activeSlideNew >= length) activeSlideNew = 0;
    setActiveSlide(activeSlideNew)
    
  }
  const autoPlayRef = useRef()

  useEffect(() => {
    autoPlayRef.current = nextSlide

    
  })
  useEffect(() => {
    const play = () => {
      autoPlayRef.current()
    }


     
        
          

          const interval = setInterval(play, time*1000)
     
    
    return () => {
      clearInterval(interval)
    }
  }, [])
  
  return (
    <div className={`ltr slider ${classNames( { 's--ready': sliderReady })}`} style={{height:`${height}`}}>
  
      <div className="slider__slides">
        {slides.map((slide, index) => (
          <div
            className={`slider__slide ${classNames( { 's--active': activeSlide === index, 's--prev': prevSlide === index  })}`}
            key={slide.city}
            >
            <div className="slider__slide-content">
              <h3 className="slider__slide-subheading ">{slide.country || slide.city}</h3>
              <h2 className="slider__slide-heading">
                {slide.city.split('').map(l => <span>{l}</span>)}
              </h2>
              <p className="slider__slide-readmore">read more</p>
            </div>
            <div className="slider__slide-parts">
              {[...Array(IMAGE_PARTS).fill()].map((x, i) => (
                <div className="slider__slide-part" key={i}>
                  <div className="slider__slide-part-inner" style={{ backgroundImage: `url(${slide.img})` }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="slider__control" onClick={prevSlide} />
      <div className="slider__control slider__control--right" onClick={nextSlide} />
    </div>
  );
}


export default FullSizeBanner 