import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LocalStorage } from "../Utils/app";
import cookie from "js-cookie";
import { useAuth } from "../Utils/AuthContext";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

const HeaderPage = () => {
  const [isLoggin, setLoggin] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [user, setUser] = useState(null);
  const [textColor, setTextColor] = useState("#000000");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setTextColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const token = cookie.get("accessToken");
    if (token) {
      setLoggin(true);
      try {
        setUser(jwtDecode(token));
      } catch (error) {
        console.error("Invalid token", error);
      }
    }

    const checkCookieIsStore = setInterval(() => {
      if (!cookie.get("accessToken")) {
        LocalStorage.clear();
        setLoggin(false);
        clearInterval(checkCookieIsStore);
      }
    }, 1000);
  }, []);

  const { logout } = useAuth();
  const { login } = useAuth();

  const handleLogout = () => {
    logout();
    setLoggin(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
   <header className="font-sans tracking-wide">
  <section className="flex items-center bg-gray-500 min-h-[70px] z-40">
    <div className="flex w-full items-center justify-between">
      {/* Profile and Avatar */}
      {isLoggin && user?.avatar && (
        <Link to="/profile">
          <motion.div
            className="flex items-center gap-4 p-3 border-b border-gray-300 rounded-lg shadow-md"
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 50 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-12 h-10 rounded-full object-cover border border-white shadow"
            />
            <p className="font-semibold text-lg">
              <span className="text-gray-700" style={{ color: textColor }}>
                {user?.storedUserName}
              </span>
            </p>
          </motion.div>
        </Link>
      )}

      {/* Company Name */}
      <motion.h1
  className="text-3xl font-bold md:text-3xl font-poppins text-white
  drop-shadow-lg tracking-widest uppercase"
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, ease: "easeOut" }}
>
Timber Trend
</motion.h1>

      {/* Navigation & Auth Buttons */}
      <div className="flex items-center">
        {isLoggin ? (
          <motion.button
            onClick={handleLogout}
            className="bg-[#011228] px-4 py-2 text-white rounded font-bold transition hover:bg-red-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Logout
          </motion.button>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-gray-800 hover:text-[#ffffff]">
              Login
            </Link>
            <span className="text-2xl">&#47;</span>
            <Link to="/register" className="text-sm font-bold text-gray-800 hover:text-[#ffffff]">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  </section>
</header>


      <div
        id="collapseMenu"
        className={`lg:sticky  lg:top-0 lg:z-50 bg-white shadow-md transition-all duration-300 ${
          scrolled ? "py-2 text-white" : "py-3 text-black"
        }`}
        style={{ backgroundColor: scrolled ? "#111721" : "#c0c0c6" } }
      >
        <ul className="nav gap-4 flex flex-wrap items-center justify-center px-15 py-6">
          <li className="px-5">
            <Link
              to="/"
              className="hover:text-white hover:font-serif    text-[15px] font-medium block"
            >
              Home
            </Link>
          </li>
          <li className="px-3">
            <Link
              to="/about"
              className="hover:text-white hover:font-serif    text-[15px] font-medium block"
            >
              About
            </Link>
          </li>
          <li className="px-3">
            <Link
              to="/contact"
              className="hover:text-white hover:font-serif    text-[15px] font-medium block"
            >
              Contact
            </Link>
          </li>
          <li className="px-3">
            <Link
              to="/profile/order"
              className="hover:text-white hover:font-serif    text-[15px] font-medium block"
            >
              Orders
            </Link>
          </li>
          <li className="px-3">
            <Link
              to="/products"
              className="hover:text-white hover:font-serif    text-[15px] font-medium block"
            >
              Products
            </Link>
          </li>
          <li className="px-3">
            <Link
              to="/cart/show-cart"
              className="hover:text-white hover:font-serif    text-[15px] font-medium block"
            >
              Carts
            </Link>
          </li>
          
        </ul>
      </div>
    </>
  );
};

export default HeaderPage;
