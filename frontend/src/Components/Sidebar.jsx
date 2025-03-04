import React from "react";
import { FaHome, FaUser, FaMapMarkerAlt, FaClipboardList, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const SideBar = ({ setActivePage, activePage }) => {
  return (
    <div className="relative">
      <div className="w-64 h-screen bg-gray-700 p-6 border-r">
        <div className="absolute top-20">
          <ul className="space-y-6">
            <Link
            to="/profile/dashboard"
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
            to="/profile/address"
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
            to='/profile/wishlist'
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
    </div>
  );
};

export default SideBar;
