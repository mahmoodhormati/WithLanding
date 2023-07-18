import styled from '@emotion/styled';
import React from 'react';
import { ImExit } from 'react-icons/im';
import { NavLink } from 'react-router-dom';


interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  collapsed?: boolean;
}




export const SidebarFooter: React.FC<SidebarFooterProps> = ({ children, collapsed, ...rest }) => {
  return (
    <div
     className='logOut'
    >

      {collapsed ? (
        <NavLink to='/logout'>  <ImExit size="2rem"/></NavLink>
      ) : (
        <NavLink to='/logout'> <ImExit size="2rem"/> </NavLink>
      )}
    </div>
  );
};