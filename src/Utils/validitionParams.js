export function validateEmail(value) {
    let error;
    if (!value) {
        error = 'پرکردن این فیلد الزامی می باشد';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        error = 'ایمیل معتبر نیست';
    }
    return error;
}
export function validateRequired(value) {
    let error;
    if (!value) {
        error = 'پرکردن این فیلد الزامی می باشد';
    }
    return error;
}
export function validatAlpha(value) {
    let error;
    if (!value) {
        error = 'پرکردن این فیلد الزامی می باشد';
    } else if (!/^[A-Z  ك 1234567890 ئوئ/پ|\- آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]+$/i.test(value)) {
        error = 'از حروف استفاده کنید';
    }
    return error;

}
export function validatENAlpha(value) {
    let error;
    if (!value) {
        error = 'پرکردن این فیلد الزامی می باشد';
    } else if (!/^[A-Z 1234567890 ]+$/i.test(value)) {
        error = 'از حروف انگلیسی استفاده کنید';
    }
    return error;

}
export function validatNumber(value) {
    let error;
    if (!value) {
        error = 'پرکردن این فیلد الزامی می باشد';
    } else if (!/^[u06F0-u06F9]+$/i.test(value)) {
        error = 'از اعداد  استفاده کنید';
    }
    return error;

}
export function validatWithoutFillNumber(value) {
    let error;
 
    if (!/^[u06F0-u06F9]+$/i.test(value)) {
        error = 'از اعداد  استفاده کنید';
    }
    return error;

}
export function validatMobail(value) {
    let error;
    if (!value) {
        error = 'پرکردن این فیلد الزامی می باشد';
    } else if (value.length !== 11) {
        error = 'شماره موبایل وارد شده صحیح نیست';
    }
    return error;

}
export function validatmin10(value) {
    let error;
    if (!value) {
        error = 'پرکردن این فیلد الزامی می باشد';
    } else if (value.length < 10 ) {
        error = 'کد وارد شده صحیح نیست';
    }
    else if(value.length>11){
        error = 'کد وارد شده صحیح نیست';
    }
    return error;

}
export function validatPassword(value) {
    let error;
    if (!value) {
        error = 'پرکردن این فیلد الزامی می باشد';
    }
    return error;

}