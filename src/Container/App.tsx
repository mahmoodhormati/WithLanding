import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Router, Routes,Navigate, HashRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AdminPannel from './AdminPannel';
import Login from '../Common/Shared/Login/Login';
import { decodeToken } from '../Utils/decodeToken';
import { RefreshToken } from '../services/userService';
import CodeForMobile from '../Common/Shared/Login/CodeForMobile';
import SubmitInfo from '../Common/Shared/Login/SubmitInfo';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProSidebarProvider } from 'react-pro-sidebar';








const App:React.FC=()=>{
 
 


  const [currentUser, setCurrentUser] = useState({}); 

  return (
    <BrowserRouter>
    <ProSidebarProvider >
      <AdminPannel />
      <ToastContainer position="top-right"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss={false}
        draggable
         />
        </ProSidebarProvider>
    </BrowserRouter>
  )
}

export default App;
