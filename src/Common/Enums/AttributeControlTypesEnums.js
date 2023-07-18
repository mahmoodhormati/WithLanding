import { DateObject } from "react-multi-date-picker";
import { Multiselect } from "react-widgets";

export const AttributeControlTypes=[
{name:'جعبه نوشته',id:1,value:<input type='text'/>},
{name:'رادیو',id:2,value:<input type='radio'/>},
{name:'تیک',id:3,value:<input type='checkbox'/>},
{name:'رنگ',id:4,value:<input type='color'/>},
{name:'تاریخ',id:5,value:<DateObject/>},
{name:' انتخاب گر',id:6,value:<select/>},
{name:'انتخاب گر چندتایی',id:7,value:<Multiselect/>}


]





// {
//     Text = 1,
//     RadioButton,
//     ChechkBox,
//     Color,
//     Date,
//     Select,
//     MultiSelect
// }


// public enum AttachmentTypes
// {
//     None = 0,
//     Contract,
//     Financial,
//     ProfilePic
// }