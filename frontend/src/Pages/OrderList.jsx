import React, { useEffect, useState } from "react";
import Footer from "../Components/Footer";
import HeaderPage from "../Components/HeaderPage";

const OrderList = () => {
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
    <>
    <HeaderPage/>
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <div className="bg-white p-4 shadow rounded-lg mb-6">
        <p className="font-serif ">`Hello <span className="font-semibold"></span>{userData.email}  From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.`</p>
      </div>
      <h2 className="text-xl font-semibold mb-2">Orders</h2>
      {userData.orders.map((order) => (
        <div key={order._id} className="border p-4 mb-4 rounded-lg">
          <p className="font-semibold">Order ID: {order._id}</p>
          <p>Payment Method: {order.paymentMethod}</p>
          <p>Status: {order.status}</p>
          <p>Total Amount: ₹{order.totalAmount}</p>
          <p>Date: {new Date(order.createdAt).toLocaleString()}</p>

          <h3 className="mt-2 font-semibold">Cart Items</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {order.cartDetails[0].items.map((item) => (
              <div key={item._id} className="border p-2 rounded-lg flex">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg mr-2" />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="mt-2 font-semibold">Shipping Address</h3>
          <p>
            {order.addressDetails[0].addressLine.street}, {order.addressDetails[0].addressLine.locality}, {order.addressDetails[0].addressLine.city}, {order.addressDetails[0].addressLine.pincode}
          </p>
        </div>
      ))}
    </div>
    <Footer/>
    </>
  );
};

export default OrderList;