import { useState } from 'react'

import './App.css'
import LandingPage from './Components/LandingPage'
import { Router, Routes, Route } from 'react-router-dom'
import RegisterForm from './Components/Form/RegisterForm'
import LoginForm from './Components/Form/LoginForm'
import CheckOut from './Pages/CheckOut'
import Profile from './Pages/Profile'
import Address from './Pages/Address'
import WishList from './Pages/WishList'
import DashBoard from './Pages/DashBoard'
import UserDashboard from './Pages/UserDashboard'
import Account from './Pages/Account'
import Orders from './Pages/Orders'
import Home from './Pages/Home'
import Products from './Components/Products'
import Cart from './Components/Cart'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/" element={<Home/>}/>
        <Route path="/products" element={<Products/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path='/checkout' element = {<CheckOut/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/profile/dashboard' element={<DashBoard/>}/>
        <Route path='/profile/account' element={<Account/>}/>
        <Route path='/profile/addresses' element={<Address/>}/>
        <Route path='/profile/UserDashboard' element={<UserDashboard/>}/>
        <Route path='/profile/order' element={<Orders/>}/>
        <Route path='/profile/wishlist' element={<WishList/>}/>
        <Route path='/profile/userDashboard' element={<UserDashboard/>}/>
        
        
      </Routes>
    

      
    </>
  )
}

export default App  
