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
import ContainerTypeB from './ChildComponent/ContainerTypeB';
import ContainerTypeC from './ChildComponent/ContainerTypeC';
import ContainerTypeE from './ChildComponent/ContainerTypeE';
import ContainerTypeF from './ChildComponent/ContainerTypeF';
import ContainerTypeG from './ChildComponent/ContainerTypeG';
import ContainerTypeH from './ChildComponent/ContainerTypeH';
import ContainerTypeI from './ChildComponent/ContainerTypeI';
import { GetAttachmentsWithoutoken } from '../services/attachmentService';
import QueryString from 'qs';


const video = require("../Common/Shared/Assets/img/Home.mp4")

const attachmetURL = window.globalThis.stie_att;

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

  ];

  useEffect(()=>{

    const script = document.createElement("script");
    const scriptText = document.createTextNode(`
    var BaseUrl=window.globalThis.stie_att
    function GetImages(entitytypeId, entityId){

      
      var AjaxUrl=BaseUrl+'api/v1/Home/GetAttachments'
      return new Promise((resolve) => {
          $.ajax({
          url: AjaxUrl,
          data: { 
              "EntityTypeId": entitytypeId, 
              "EntityId": entityId
          },
          cache: true,
          type: "GET",
          success: function(rsp) {
          resolve(rsp)
          }
      });
  });
  }
    function GetComponentImages()
{
    var divs = $("[id^=CMPD]");
    for (let index = 0; index < divs.length; index++) 
    {
        setTimeout(() => 
        {
            try {
                var div = divs[index];
                var id = div.id.replace('CMPD','')
                GetImages(25,parseInt(id)).then((rsp) => {
                    var images = rsp.result.globalAttachments;
                    if(images && images.length > 0){
                        var image = images[images.length - 1]
                        //append
                       
                        var ImageUrl='url('+ BaseUrl + image.path +')'
                        
                        div.style.backgroundImage=ImageUrl
                        div.style.borderRadius='0.5rem'
                        div.style.backgroundSize='cover'
                        div.style.backgroundPosition='center'

                        //remove default backGround
                        div.classList.remove('defaultBakground')
                    }
                  });
            }
            catch (error) {}
        }, (index + 1 ) * 1000);
    }
}

setTimeout(GetComponentImages(), 5000)

`)

    script.appendChild(scriptText);
    document.body.appendChild(script);

    return (
        () => document.body.removeChild(script)
    )
  },[components])

  


 



  return (
    <Fragment>
      <LandingHeader />
      <div className='video' >



        {components.map((Item) => {
          const ComponentNames = ComponentMapper[Item.ComponentTypeName];

          if (Item.componentTypeSpecificId >= 200) {



            return (

              <ComponentNames height={`${Item.height}`} data={Item} />

            )

          }
          else {
            return (

              <ComponentNames slides={slides} time={10} height={`${Item.height}`} data={Item} />


            )
          }

        })}
   

        
        <div>
        <LandingFooter />
        </div>
      </div>
      
    </Fragment >
  )
}

export default SysPlus