import React, { useEffect, useState } from "react";

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/users/account-details", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUserData(data.data.userData))
      .catch((err) => console.error("Error fetching user data:", err));
  }, []);

  if (!userData) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 min-h-screen">
      {/* User Info */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Welcome, {userData.name}</h2>
        <p className="text-gray-600">{userData.email}</p>
      </div>

      {/* Orders */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Orders</h2>
      {userData.orders.map((order) => (
        <div key={order._id} className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <p className="text-gray-600">Order ID: <span className="font-semibold">{order._id}</span></p>
              <p className="text-gray-600">Status: <span className={`font-semibold ${order.status === "Paid" ? "text-green-600" : "text-red-600"}`}>{order.status}</span></p>
            </div>
            <p className="text-lg font-semibold text-gray-800">Total: ₹{order.totalAmount}</p>
          </div>
          
          {/* Cart Items */}
          <h3 className="mt-4 text-lg font-semibold text-gray-700">Items Purchased</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {order.cartDetails[0].items.map((item) => (
              <div key={item._id} className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg mr-4" />
                <div>
                  <p className="text-gray-800 font-medium">{item.name}</p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-gray-600">Price: ₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Address */}
          <h3 className="mt-4 text-lg font-semibold text-gray-700">Shipping Address</h3>
          <p className="text-gray-600 mt-1">
            {order.addressDetails[0].addressLine.houseNumber}, {order.addressDetails[0].addressLine.street}, {order.addressDetails[0].addressLine.locality}, {order.addressDetails[0].addressLine.city} - {order.addressDetails[0].addressLine.pincode}
          </p>
        </div>
      ))}
    </div>
  );
};

export default UserDashboard;
