export interface AttachmentType {

    attachmentId?: number,
    name?: string,
    attachmentTypeId?: number,
    trackingCode?: string,
    value?: string,
    dueDate?: string

}
export interface Attachment {

    id?: number,
    name?: string,
    path?: string,
    deleted?: true,
    attachmentTypeId?: number,
    trackingCode?: string,
    value?: string,
    dueDate?: string

}
export interface Attachments extends Array<Attachment>{
    
}