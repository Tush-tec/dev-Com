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
  <SideBar setActivePage={setActivePage} activePage={activePage} /> 
  <div className="flex-grow p-10"> {/* Ensures it takes up the remaining width */}
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
