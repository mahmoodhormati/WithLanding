import React from 'react'
import './Carouselstyle.css'
import ProductCard from '../Cards/ProductCard'

const ProductCarousel = () => {
    return (
        <div className=''>

            <div className='text-center '>
                <input type="radio" autoFocus name="position"  />
                <input type="radio" name="position" />
                <input type="radio" name="position" />
                <input type="radio" name="position" />
                <input type="radio" name="position" />
            <main id="carousel">
                <div className="item"><ProductCard /></div>
                <div className="item"><ProductCard /></div>
                <div className="item"><ProductCard /></div>
                <div className="item"><ProductCard /></div>
                <div className="item"><ProductCard /></div>
            </main>

            </div>



        </div>
    )
}

export default ProductCarousel