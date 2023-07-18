import {useEffect} from "react";

const InputMask = ({onChange , value , placeholder , className}) => {

   useEffect(()=>{
       let input = document.querySelectorAll('.start')[0];

       let dateInputMask = function dateInputMask(elm) {
           elm.addEventListener('keypress', function(e) {
               if(e.keyCode < 47 || e.keyCode > 57) {
                   e.preventDefault();
               }

               let len = elm.value.length;

               // If we're at a particular place, let the user type the slash
               // i.e., 12/12/1212
               if(len !== 1 || len !==3) {
                   if(e.keyCode === 47) {
                       e.preventDefault();
                   }
               }

               // If they don't add the slash, do it for them...
               if(len === 4) {
                   elm.value += '/';
               len = elm.value.length

               }
               // If they don't add the slash, do it for them...
               if(len === 7) {
                   elm.value += '/';
               }
           });
       };

       dateInputMask(input);
       let input2 = document.querySelectorAll('.end')[0];

       let dateInputMask2 = function dateInputMask(elm2) {
           elm2.addEventListener('keypress', function(e) {
               if(e.keyCode < 47 || e.keyCode > 57) {
                   e.preventDefault();
               }

               let len = elm2.value.length;

               // If we're at a particular place, let the user type the slash
               // i.e., 12/12/1212
               if(len !== 1 || len !==3) {
                   if(e.keyCode === 47) {
                       e.preventDefault();
                   }
               }

               // If they don't add the slash, do it for them...
               if(len === 4) {
                   elm2.value += '/';
               len = elm2.value.length

               }
               // If they don't add the slash, do it for them...
               if(len === 7) {
                   elm2.value += '/';
               }
           });
       };

       dateInputMask2(input2);
   },[])

    return(

                <input value={ value}   onChange={onChange} placeholder={`${new Date().toLocaleDateString("fa-IR")}`} type="text" className={className} maxLength="10"/>

)
}
export default InputMask