import React from 'react';
import { useSelector } from 'react-redux';
import DashbordCustomer from '../../../Client/Dashboard/Component/dashbordCustomer';
import DashbordGuess from '../../../Client/Dashboard/Component/dashbordGuess';
import DashbordAdmin from '../../../Admin/Dashboard/dashbordAdmin';
import { AppDispatch, RootState } from '../../../store';



const Dashboard :React.FC= () => {
    const roles=useSelector((state:RootState) => state.roles);

  if (roles.length>0 && roles.includes(1)) {
    return (
      <DashbordGuess/>
    )
  }
  else if (roles.length===1 && roles[0]===2) {
    return(
    <DashbordCustomer/>)
  }
  else if (roles.some((item:any)=>item>2)) {
    return(
    <DashbordAdmin/>)
  }
  else{
    return(
    <div></div>
    )
  }
}

export default Dashboard