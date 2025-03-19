import { useState } from "react";

import "./App.css";
import LandingPage from "./Components/LandingPage";
import { Router, Routes, Route } from "react-router-dom";
import RegisterForm from "./Components/Form/RegisterForm";
import LoginForm from "./Components/Form/LoginForm";
import CheckOut from "./Pages/CheckOut";
import Profile from "./Pages/Profile";
import Address from "./Pages/Address";
import WishList from "./Pages/WishList";
import DashBoard from "./Pages/DashBoard";
import UserDashboard from "./Pages/UserDashboard";
import Account from "./Pages/Account";
import Orders from "./Pages/Orders";
import Home from "./Pages/Home";
import Products from "./Components/Products";
import Cart from "./Components/Cart";
import Personalnfo from "./Pages/Personalnfo";
import ChangePassword from "./Pages/ChangePassword";
import ProductDetails from "./Pages/ProductDetails";
import Category from "./Pages/Category";
import CategoryProduct from "./Pages/CategoryProduct";
import CreateAddress from "./Pages/CreateAddress";
import AboutUs from "./Pages/AboutUs";
import Contact from "./Pages/Contact";
import ShowCartItem from "./Pages/ShowCartItem";
import Product from "./Components/Product";
import PrivateRoute from "./Utils/PrivateRoute";

function App() {
  return (
    <>
      <Routes>
        {/* Public Route  */}
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />

        {/* Private Route  */}

        <Route path="/" element={ <PrivateRoute element={<LandingPage />}/>} />
        <Route path="/home" element={ <PrivateRoute element={ <Home />}/>} />
        <Route path="/products" element={ <PrivateRoute  element={ <Product />}/>} />
        <Route path="/cart/show-cart" element={<PrivateRoute element={ <Cart />}/>} />

        <Route
          path="/checkout"
          element={<PrivateRoute element={<CheckOut />} />}
        />
        <Route
          path="/profile"
          element={<PrivateRoute element={<Profile />} />}
        />
        <Route
          path="/profile/dashboard"
          element={<PrivateRoute element={<DashBoard />} />}
        />
        <Route
          path="/profile/account"
          element={<PrivateRoute element={<Account />} />}
        />
        <Route
          path="/profile/addresses"
          element={<PrivateRoute element={<Address />} />}
        />
        <Route
          path="/profile/UserDashboard"
          element={<PrivateRoute element={<UserDashboard />} />}
        />
        <Route
          path="/profile/order"
          element={<PrivateRoute element={<Orders />} />}
        />
        <Route
          path="/profile/wishlist"
          element={<PrivateRoute element={<WishList />} />}
        />
        <Route
          path="/profile/userDashboard"
          element={<PrivateRoute element={<UserDashboard />} />}
        />
        <Route
          path="/profile/personal-info"
          element={<PrivateRoute element={<Personalnfo />} />}
        />
        <Route
          path="/profile/change-password"
          element={<PrivateRoute element={<ChangePassword />} />}
        />
        <Route
          path="/profile/address/:addressId"
          element={<PrivateRoute element={<Address />} />}
        />
        <Route
          path="/product/:productId"
          element={<PrivateRoute element={<ProductDetails />} />}
        />
        <Route
          path="/categories"
          element={<PrivateRoute element={<Category />} />}
        />
        <Route
          path="/categories/get-product-with-category/:categoryId"
          element={<PrivateRoute element={<CategoryProduct />} />}
        />
        <Route
          path="/address/create-address"
          element={<PrivateRoute element={<CreateAddress />} />}
        />

      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />

      </Routes>

      {/* <Route path='/cart/show-cart' element={<ShowCartItem/>}/> */}
    </>
  );
}

export default App;
