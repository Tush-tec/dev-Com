import React, { useEffect, useState } from "react";
import Loader from "../Components/Loader";
import HeaderPage from "../Components/HeaderPage";
import Footer from "../Components/Footer";

const Orders = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/users/account-details", {
          credentials: "include",
        });
        const data = await response.json();
        console.log("API Response:", data.data.userData.orders[0].cartDetails); // Debugging API response

        if (data?.data?.userData) {
          setUserData(data.data.userData);
          console.log();
          
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div className="text-center mt-10"><Loader /></div>;
  if (!userData) return <div className="text-center mt-10 text-red-500">Failed to load user data.</div>;

  return (
    <>
      <HeaderPage />
      <div className="max-w-7xl mx-auto p-6 bg-gray-100 min-h-screen">
        {/* User Info */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome, {userData.name?.charAt(0).toUpperCase() + userData.name?.slice(1).toLowerCase()}
          </h2>
        </div>

        {/* Orders Section */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Orders</h2>

        {userData.orders?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData.orders.map((order) => (
              <div key={order._id} className="bg-white shadow-md rounded-lg p-6">
                <div className="border-b pb-4">
                  <p className="text-gray-600">Order ID: <span className="font-semibold">{order._id}</span></p>
                  <p className="text-gray-600">
                    Status: 
                    <span className={`font-semibold ${order.status === "Paid" ? "text-green-600" : "text-red-600"}`}>
                      {order.status}
                    </span>
                  </p>
                  <p className="text-lg font-semibold text-gray-800 mt-2">Total: ₹{order.totalAmount}</p>
                </div>

                {/* Cart Items */}
                <h3 className="mt-4 text-lg font-semibold text-gray-700">Items Purchased</h3>
                <div className="mt-2">
                  {order.cartDetails?.map((cart, index) => (
                    <div key={index}>
                      {cart.items?.map((item) => (
                        <div key={item._id} className="flex items-center bg-gray-50 p-3 rounded-lg mb-2">
                          
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg mr-3" />
                          <div>
                            <p className="text-gray-800 font-medium">{item.name}</p>
                            <p className="text-gray-600 text-sm">Qty: {item.quantity} | ₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Address */}
                {order.addressDetails?.length > 0 && (
                  <>
                    <h3 className="mt-4 text-lg font-semibold text-gray-700">Shipping Address</h3>
                    <div className="text-gray-600 text-sm mt-1">
                      <div><span className="font-semibold">House No.:</span> {order.addressDetails[0]?.addressLine?.houseNumber}</div>
                      <div><span className="font-semibold">Street No.:</span> {order.addressDetails[0]?.addressLine?.street}</div>
                      <div><span className="font-semibold">Locality:</span> {order.addressDetails[0]?.addressLine?.locality}</div>
                      <div><span className="font-semibold">City:</span> {order.addressDetails[0]?.addressLine?.city}</div>
                      <div><span className="font-semibold">Pincode:</span> {order.addressDetails[0]?.addressLine?.pincode}</div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-6">No orders found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Orders;
