import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from 'react'
import { ComponentTypes } from "../../../Common/Enums/ComponentTypeEnums";
import { ComponentTypeSpecific } from "../../../Common/Enums/ComponentTypeSpecific";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const LandingSortableItem = (props) => {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: props.id})

    let style = {
        transform: CSS.Transform.toString(transform),
        transition:''
    }



    const navigate=useNavigate()

    const handeltoNavigate=(id)=>{
        navigate(`/admin/component/${id}`)
    }
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="m-4">

            <div  className="card text-center ">
                <img className="card-img-top" />
                <div className="card-block">
                    <h5 className="card-title">{`نام: ${props.name}`}</h5>
                    <div className="meta">
                        <p href="#">{`ارتفاع : ${props.height} درصد `}</p>
                    </div>
                    <div className="card-text">
                       {`توضیحات : ${props.description}`}
                    </div>
                </div>
                <div className="card-footer d-flex justify-content-around">
                <span 
                        title="ویرایش"
                       onDoubleClick={(e)=>handeltoNavigate(props.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-edit-2">
                            <path
                                d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                    </span>
                    <span className="">{`نوع قالب : ${ComponentTypes.filter(i=>i.id=== props.componentTypeId).map(i=>i.name)[0]}`}</span>
                    <span className=""><i className=""></i>{`مشخصه قالب : ${ComponentTypeSpecific.filter(i=>i.id=== props.componentTypeSpecificId).map(i=>i.name)[0]}`}</span>
                </div>
            </div>
        </div>

   
  )
}

export default LandingSortableItem