import http from './httpService'

let configure=window.globalThis.site_url;

export const GetAllAttributes=(entityTypeId)=>{

    return http.get(`${configure}/Attribute/GetAttributes?EntityTypeId=${entityTypeId}`)
}
export const GetAttribute=(Id)=>{

    return http.get(`${configure}/Attribute/GetAttribute?Id=${Id}`)
}

export const SetAttribute=(attribute)=>{

    return http.post(`${configure}/Attribute/SetAttribute`,JSON.stringify(attribute))
}

export const SetAttributeValues=(attribute)=>{

    return http.post(`${configure}/Attribute/SetAttributeValues`,JSON.stringify(attribute))
}

export const GetAttributeValues=(attributeId,EntityId)=>{

    return http.get(`${configure}/Attribute/GetAttributeValue?AttributeTypeId=${attributeId}&EntityId=${EntityId}`)
}
