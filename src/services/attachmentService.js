import http from "./httpService";

let configure=window.globalThis.site_url;


export const attachmentUpload=(formData)=>{

    return http.post(`${configure}/Attachment/Upload`,formData,{
        headers:'Content-Type: multipart/form-data'
    });
}
export const SetAttachmentType=(params)=>{

    return http.post(`${configure}/Attachment/SetAttachmentType` , JSON.stringify(params))
}


export const GetAttachments=(searchParams)=>{



    return http.get(`${configure}/Attachment/GetAttachments`,searchParams)
}
export const DeleteAttachments=(deleteid)=>{
    let config={headers:
            {
                Authorization:`Bearer ${localStorage.getItem('token')}`
            },
        data:{
            attachmentId:(deleteid)
        }
    }

    return http.delete(`${configure}/Attachment/DeleteAttachments`,config)
}