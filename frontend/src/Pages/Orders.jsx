import React, { useEffect, useState } from "react";
import Loader from "../Components/Loader";
import HeaderPage from "../Components/HeaderPage";
import Footer from "../Components/Footer";
import SideBar from "../Components/Sidebar";
import { requestHandler } from "../Utils/app";
import { fetchOrders } from "../Api/api";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getSaveOrder = async () => {
      await requestHandler(
        () => fetchOrders(""),
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
    getSaveOrder();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-10">
        <Loader />
      </div>
    );

  if (!orders.length)
    return (
      <div className="text-center mt-10 text-red-500">No orders found.</div>
    );

  return (
    <>
      <HeaderPage />
      <div className="flex min-h-screen flex-col md:flex-row">
        <SideBar className="w-full md:w-64" />
        <div className="bg-gray-100 p-4 md:p-6 flex-1">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Orders</h2>
            {error && <div className="text-red-500">{error}</div>}

            <div className="space-y-6 max-h-[90vh] overflow-y-auto">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white p-4 md:p-6 shadow-md rounded-lg"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-3">
                    <p className="text-gray-600 font-semibold mb-2 md:mb-0">
                      Order ID: <span className="text-black">{order._id}</span>
                    </p>
                    <span
                      className={`px-3 py-1 text-white text-sm font-semibold rounded-full inline-block transform scale-95 hover:scale-105 duration-200 ${
                        order.status === "In Progress" || order.status === "Shipped"
                          ? "bg-blue-500"
                          : order.status === "Delivered" || order.status === "Paid"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-4">
                    <div className="flex gap-2 md:gap-3 flex-wrap">
                      {order.cartItems.map((item, index) => (
                        <img
                        key={index}
                        src={(item.image || "").replace(
                          "/upload/",
                          "/upload/w_300,h_375,c_fill/"
                        )}
                        alt={item.name || "Product Image"}
                          className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-md border"
                        />
                      ))}
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                      <div>
                        <p className="text-gray-600">Order Placed</p>
                        <p className="font-semibold text-black">
                          {new Date(order.createdAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })}
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
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Orders;
