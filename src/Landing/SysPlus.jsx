import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './style.css'
import { Fragment } from 'react';
import ProductCarousel from './ProductCarousel/ProductCarousel';
import ReactDOM from 'react-dom/client';

import FullSizeBanner from './Slider/FullSlider/FullSizeBanner';

import LandingFooter from './Footer/LandingFooter';
import { GetHomeComponents } from '../services/homeService';
import { ComponentTypeSpecific } from './Enums/ComponentTypeSpecific';

import ContainerTypeA from './ChildComponent/ContainerTypeA';
import LeftSideBanner from './Slider/LeftSideSlider/LeftSideBanner';

import LandingHeader from './Header/LandingHeader';
import { ComponentMapper } from './ComponentsMapper';

const video = require("../Common/Shared/Assets/img/Home.mp4")


const SysPlus = () => {

  const [components, SetComponents] = useState([])


  const getHomeComponents = async () => {


    try {
      const { data, status } = await GetHomeComponents()
      if (status === 200) {


        let Types = ComponentTypeSpecific.map((item) => ({ id: item.id, ComponentTypeName: item.name }))

        let mergeById = (a1, a2) =>
          a1.map((itm) => ({
            ...a2.find((item) => (item.id === itm.componentTypeSpecificId) && item),
            ...itm
          }));


        let newData = data.result.components


        console.log(mergeById(newData, Types))
        SetComponents(mergeById(newData, Types))
      }
    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {

    getHomeComponents()

  }, [])

  const slides = [
    {
      city: 'Paris',
      country: 'France',
      img: require('./Images/shanghai.jpg'),
    },
    {
      city: 'Singapore',
      img: require('./Images/new_york.jpg'),
    },
    {
      city: 'Prague',
      country: 'Czech Republic',
      img: require('./Images/london830775.jpg'),
    },

  ];


  //   const getComponentByNme = (components:any) => {

  //     for (let i = 0; i < components.length; i++) {

  //     return(  SwitchFunction(components[i].ComponentTypeName,components[i].height))

  //     }
  //   }


  // const SwitchFunction=(names:any,height:any)=>{


  //   if(names==='ContainerTypeA'){
  //     return(<ChildOne  height={`${height}%`} />)

  //   }


  // }





  return (
    <Fragment>
      <LandingHeader />
      <div className='video' >



        {components.map((Item) => {
          const ComponentNames = ComponentMapper[Item.ComponentTypeName];

          if(Item.componentTypeSpecificId>=200){



            return(<ComponentNames  height={`${Item.height}%`} />)
           
          }
          else{
            return(<ComponentNames slides={slides} time={4} height={`${Item.height}%`} />)
          }
          
        })}
       




        <LandingFooter />
      </div>

    </Fragment >
  )
}

export default SysPlus