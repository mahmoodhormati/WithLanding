import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io'
import { Link } from 'react-router-dom';
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa'
import './LeftSlider.css'

const LeftSideBanner = ({ slides, time, height }) => {
    const [current, SetCurrent] = useState(0)
    const autoPlayRef = useRef()
    const length = slides.length
    const nextSlide = () => {
        SetCurrent(current === length - 1 ? 0 : current + 1)
    }
    const prevSlide = () => {
        SetCurrent(current === 0 ? length - 1 : current - 1)
    }


    useEffect(() => {

        autoPlayRef.current = nextSlide

    })

    useEffect(() => {
        const play = () => {
            autoPlayRef.current()
        }

        const interval = setInterval(play, time * 1000)
        return () => clearInterval(interval)
    }, [])

    if (!Array.isArray(slides) || slides.length <= 0) {
        return null
    }


    return (
        <div className='  rounded'  style={{ height: `${height}` }} >
            <div className='sliderLeft ' >
                <div className='afterSlider '>



                    <div >
                      <h3>جزییات</h3>
                    </div>

                    <div>
                        تست
                    </div>
                    <div>
                       <button className='btn btn-success'><Link to='#'>لینک</Link></button> 
                    </div>



                </div>
                <div className='slider_control-LeftBanner' onClick={nextSlide} />
                <div className='slider_control--right-LeftBanner' onClick={prevSlide} />
                {slides.map((item, index) => {

                    return (

                        <div className={index === current ? 'slide active' : 'slide'} key={index}>
                            {index === current && (<img src={item.img} alt='travel image' className='image' />)}

                        </div>
                    )
                })

                }


            </div>

        </div>
    )
}

export default LeftSideBanner