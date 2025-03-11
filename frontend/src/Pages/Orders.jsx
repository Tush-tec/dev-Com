import React, { useEffect, useState } from "react";
import Loader from "../Components/Loader";
import HeaderPage from "../Components/HeaderPage";
import Footer from "../Components/Footer";
import SideBar from "../Components/Sidebar";
import { LocalStorage, requestHandler } from "../Utils/app";
import { fetchOrders } from "../Api/api";
import { Link } from "react-router-dom";
import { useAuth } from "../Utils/AuthContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  
  const {isAuthenticated} = useAuth()


  // Fetch orders only if user is logged in
  useEffect(() => {

    if(!isAuthenticated) {
      setLoading(false)
      return
    }

    const getSaveOrder = async () => {
    
        await requestHandler(
          () => fetchOrders(getToken),
          setLoading,
          (data) => {
            console.log(data);
            setOrders(data?.data);
          },
          (error) => {
            console.error(error);
            setError(error);
          }
        );
      
    };

    if (isAuthenticated !== false) getSaveOrder(); // Only run when `isLoggin` is determined
  }, [isAuthenticated]);

  if (loading)
    return (
      <div className="text-center mt-10">
        <Loader />
      </div>
    );

  return (
    <>
      <HeaderPage />
      {isAuthenticated ? (
        <>
          {/* Logged-in UI */}
          <div className="flex min-h-screen">
            <SideBar className="w-64" />
            <div className="bg-gray-100 p-6 flex-1">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Orders
                </h2>
                {error && <div className="text-red-500">{error}</div>}

                {orders.length > 0 ? (
                  <div className="space-y-6 h-[90vh] overflow-y-auto">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="bg-white p-6 shadow-md rounded-lg"
                      >
                        <div className="flex justify-between items-center border-b">
                          <p className="text-gray-600 font-semibold mb-5 inline-block">
                            Order ID:{" "}
                            <span className="text-black">{order._id}</span>
                          </p>

                          <span
                            className={`px-3 py-1 text-white text-sm font-semibold rounded-full ${
                              order.status === "In Progress"
                                ? "bg-blue-500"
                                : order.status === "Delivered" ||
                                  order.status === "Paid"
                                ? "bg-green-500"
                                : order.status === "Shipped"
                                ? "bg-orange-500"
                                : "bg-red-500"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-4 gap-4">
                          <div className="flex gap-3">
                            {order.cartItems?.map((item, index) => (
                              <img
                                key={index}
                                src={item.image.replace(
                                  "/upload/",
                                  "/upload/w_600,h_750,c_fill/"
                                )}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-md border"
                              />
                            ))}
                          </div>
                          <div className="flex-1 flex justify-between items-center">
                            <div>
                              <p className="text-gray-600">Order Placed</p>
                              <p className="font-semibold text-black">
                                {new Date(order.createdAt).toLocaleString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                  }
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Order Value</p>
                              <p className="font-semibold text-black">
                                ₹{order.totalPrice.toLocaleString("en-IN")}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Payment Method</p>
                              <p
                                className={`font-semibold ${
                                  order.paymentMethod === "Razorpay"
                                    ? "text-blue-500"
                                    : "text-black"
                                }`}
                              >
                                {order.paymentMethod}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-red-500 mt-10">
                    No orders found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Not Logged-in UI */}
          <section className="container flex items-center justify-center h-screen mx-auto bg-gradient-to-l from-[#162130] to-[#737982]">
            <div className="w-full max-w-md p-8 bg-white text-center shadow-2xl rounded-2xl border border-gray-300">
              <h2 className="text-3xl font-bold text-[#162130] mb-4">
                Access Required
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Please log in to place an order and enjoy seamless shopping!
              </p>
              <div className="flex justify-center">
                <Link to="/login">
                  <button className="bg-[#162130] hover:bg-[#1E293B] text-white py-2 px-5 rounded-full transition-transform hover:scale-105 shadow-md">
                    Redirect to Login
                  </button>
                </Link>
              </div>
              <div className="mt-6 text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-[#162130] hover:text-[#1E293B] font-semibold hover:underline"
                >
                  Sign up here
                </Link>
                .
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </>
  );
};

export default Orders;
