import React from "react";

const SideBar = ({ setActivePage, activePage }) => {
  return (
    <div className= "relative">
        <div className=" w-50 h-screen    bg-gray-700 p-6 border-r">
            <div className="absolute top-20">
          <ul className="space-y-8   ">
            <li
              className={`flex items-center  p-2 px- rounded ${
                activePage === "dashboard" ? "bg-gray-300 text-gray-900" : "text-white hover:bg-gray-300 hover:text-gray-900"
              }`}
              onClick={() => setActivePage("dashboard")}
            >
              Dashboard
            </li>
            <li
              className={`flex items-center p-2 rounded ${
                activePage === "account" ? "bg-gray-300 text-gray-900" : "text-white hover:bg-gray-300 hover:text-gray-900"
              }`}
              onClick={() => setActivePage("account")}
            >
              Account Details
            </li>
            {/* <h1 className="text-center text-2xl p-2">Profile Pages</h1> */}
            <li
              className={`flex items-center p-2 rounded ${
                activePage === "address" ? "bg-gray-300 text-gray-900" : "text-white hover:bg-gray-300 hover:text-gray-900"
              }`}
              onClick={() => setActivePage("address")}
            >
              Addresses
            </li>
            <li
              className={`flex items-center p-2 rounded ${
                activePage === "orders" ? "bg-gray-300 text-gray-900" : "text-white hover:bg-gray-300 hover:text-gray-900"
              }`}
              onClick={() => setActivePage("orders")}
            >
              Orders
            </li>
            <li
              className={`flex items-center p-2 rounded ${
                activePage === "wishlist" ? "bg-gray-300 text-gray-900" : "text-white hover:bg-gray-300 hover:text-gray-900"
              }`}
              onClick={() => setActivePage("wishlist")}
            >
              Wish List
            </li>
          </ul>
          </div>
        </div>
        
      </div>
  );
};

export default SideBar;
