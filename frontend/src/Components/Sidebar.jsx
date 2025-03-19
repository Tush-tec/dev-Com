import React, { useEffect, useState } from "react";
import { FaHome, FaUser, FaMapMarkerAlt, FaClipboardList, FaHeart, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { fetchUserAllInfo } from "../Api/api";
import { requestHandler } from "../Utils/app";

const SideBar = ({ setActivePage, activePage }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
      const fetchData = async () => {
        await requestHandler(
          fetchUserAllInfo,
          setLoading,
          (data) => {
            setUserInfo(data?.data?.userData); 
          },
          setError
        );
      };
      fetchData();
    }, []);

    const userAddressId = userInfo?.addressDetails?.[0]?._id || "";

    return (
      <div className="relative">
        <button
          className="md:hidden p-3 bg-gray-700 text-white w-full text-left"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />} Menu
        </button>

        <div className={`absolute md:relative w-64 h-screen bg-gray-700 p-6 border-r transform md:translate-x-0 transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <ul className="space-y-6">
            <Link
              to="/profile"
              className={`flex items-center p-2 rounded cursor-pointer ${
                activePage === "dashboard"
                  ? "bg-gray-300 text-gray-900"
                  : "text-white hover:bg-gray-300 hover:text-gray-900"
              }`}
              onClick={() => setActivePage("dashboard")}
            >
              <FaHome className="mr-2" /> Dashboard
            </Link>
            <Link
              to="/profile/account"
              className={`flex items-center p-2 rounded cursor-pointer ${
                activePage === "account"
                  ? "bg-gray-300 text-gray-900"
                  : "text-white hover:bg-gray-300 hover:text-gray-900"
              }`}
              onClick={() => setActivePage("account")}
            >
              <FaUser className="mr-2" /> Account Details
            </Link>
            <Link
              to="/profile/addresses"
              className={`flex items-center p-2 rounded cursor-pointer ${
                activePage === "address"
                  ? "bg-gray-300 text-gray-900"
                  : "text-white hover:bg-gray-300 hover:text-gray-900"
              }`}
              onClick={() => setActivePage("address")}
            >
              <FaMapMarkerAlt className="mr-2" /> Addresses
            </Link>
            <Link
              to="/profile/order"
              className={`flex items-center p-2 rounded cursor-pointer ${
                activePage === "orders"
                  ? "bg-gray-300 text-gray-900"
                  : "text-white hover:bg-gray-300 hover:text-gray-900"
              }`}
              onClick={() => setActivePage("orders")}
            >
              <FaClipboardList className="mr-2" /> Orders
            </Link>
            <Link
              to="/profile/wishlist"
              className={`flex items-center p-2 rounded cursor-pointer ${
                activePage === "wishlist"
                  ? "bg-gray-300 text-gray-900"
                  : "text-white hover:bg-gray-300 hover:text-gray-900"
              }`}
              onClick={() => setActivePage("wishlist")}
            >
              <FaHeart className="mr-2" /> Wish List
            </Link>
          </ul>
        </div>
      </div>
    );
};

export default SideBar;
