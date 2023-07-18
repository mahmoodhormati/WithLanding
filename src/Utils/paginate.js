import _ from 'lodash';

export const paginate=(totalData,currentPage,perPage)=>{


const startIndex=(currentPage-1)*perPage;
_(totalData).slice(startIndex).take(perPage).value;


}