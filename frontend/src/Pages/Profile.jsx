import React, { useState } from 'react';
import HeaderPage from '../Components/HeaderPage';
import SideBar from '../Components/Sidebar';
import Footer from '../Components/Footer';
import DashBoard from './DashBoard';
import Orders from './Orders';
import WishList from './WishList';
import Account from './Account';
import Address from './Address';

const Profile = () => {
  const [activePage, setActivePage] = useState('dashboard'); // Default page

  return (
    <>
      <HeaderPage />
      <div className="flex">
        {/* Pass setActivePage to SideBar */}
        <SideBar setActivePage={setActivePage} activePage={activePage} /> 
        <div className=" flex p-10">
          {activePage === 'dashboard' && <DashBoard />}
          {activePage === 'account' && <Account />}
          {activePage === 'orders' && <Orders />}
          {activePage === 'wishlist' && <WishList />}
          {activePage === 'address' && <Address />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
