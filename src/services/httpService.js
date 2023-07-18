import axios from "axios";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { decodeToken } from '../Utils/decodeToken';

let configure = window.globalThis.site_url;


axios.defaults.headers.get["Content-Type"] = "application/json";
axios.defaults.headers.delete["Content-Type"] = "application/json";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.put["Content-Type"] = "application/json";
const token = localStorage.getItem('token');

if (token) {

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}


const refresh = localStorage.getItem('refresh');
const connect = localStorage.getItem('connect')

const refreshR = {
  token
  , refresh
}


  axios.interceptors.response.use(

    resp => resp, async error => {

      if (error.response.status === 401 && !connect) {
        window.location.reload()
      }
      if (error.response.status === 401 && !token) {
        window.location.replace('/logout')

      }
      if (error.response.status === 401 && token) {


        axios.interceptors.response.eject()

        await axios.post(`${configure}/User/Refresh`, refreshR).then(response => {
          if (response.status === 200) {

            localStorage.setItem('token', response.data.result.token);
            localStorage.setItem('refresh', response.data.result.refresh);
            axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.result.token}`

            window.location.reload()

          }

        }).catch(err => {



          localStorage.clear()
          localStorage.setItem('error', JSON.stringify(err.response))
          window.location.replace('/logout')

        });





      }






    if (error.response.status === 500) {

    if (error.response.data.error.errorCode >= 400 && error.response.data.error.errorCode <= 499) {

      toast.warning(error.response.data.error.message, {
        position: "top-right",
        closeOnClick: true
      });
    }
    else if (error.response.data.error.errorCode === 500 && error.response.data.error.message !== "") {

      toast.error(error.response.data.error.message, {
        position: "top-right",
        closeOnClick: true
      });
    }
    else {
      toast.error('سرور پاسخگو نیست', {
        position: "top-right",
        closeOnClick: true
      });
    }


  }


  return Promise.reject(error);
});

const axiosWithTokenRefresh = config =>
  axios(config).catch(error =>
    error.hasRefreshedToken ? axios(config) : Promise.reject(error)
  );

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete
};
