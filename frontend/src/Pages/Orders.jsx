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
  const [error, setError] = useState(null);

  useEffect(() => {

    const getSaveOrder = async () => {
    await requestHandler(
      () => fetchOrders(""), 
      
      setLoading,
      (data) => {
        setOrders(data?.data || [])
      },
      
      (error) => {
        setError(error);
      }
    )}
    getSaveOrder();
  }, []);

  if (loading) return <div className="text-center mt-10"><Loader /></div>;
  if (!orders.length) return <div className="text-center mt-10 text-red-500">No orders found.</div>;

  return (
    <>
      <HeaderPage />

      <div className="flex  min-h-screen">

        <SideBar />


        <div className=" bg-gray-100 p-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Orders</h2>


            <div className=" ">
              <div className="flex overflow-x-auto container space-x-6 pb-4">
                {orders.map((order) => (
                  <div 
                    key={order._id} 
                    className="bg-white shadow-md rounded-lg p-6 min-w-[350px] max-w-[400px]"
                  >
                  <Link to ={`order/${order._id}` }>
                    <div className="border-b pb-4">
                      <p className="text-gray-600">Order ID: <span className="font-semibold">{order._id}</span></p>
                      <p className="text-gray-600">
                        Status: 
                        <span className={`font-semibold ${order.status === "Paid" ? "text-green-600" : "text-red-600"}`}>
                          {order.status}
                        </span>
                      </p>
                      <p className="text-lg font-semibold text-gray-800 mt-2">Total: ₹{order.totalPrice.toLocaleString('en-IN')}</p>
                    </div>
                    </Link>



                    <h3 className="mt-4 text-lg font-semibold text-gray-700">Items Purchased</h3>
                    <div className="mt-2">
                      {order.cartItems.map((item) => (
                        <Link to={`order/${order._id}`}>
                        <div key={item.productId} className="flex items-center bg-gray-50 p-3 rounded-lg mb-2">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg mr-3" />
                          <div>
                            <p className="text-gray-800 font-medium">{item.name}</p>
                            <p className="text-gray-600 text-sm">Qty: {item.quantity} | ₹{item.price}</p>
                          </div>
                        </div>
                        </Link>
              
                      ))}
                    </div>


                    {order.addressDetails && (
                      <>
                        <h3 className="mt-4 text-lg font-semibold text-gray-700 ">Shipping Address</h3>
                        <div className="text-gray-600 text-sm mt-3 p-3 border rounded-lg bg-gray-50 space-y-1">
                          <div><span className="font-semibold">Street:</span> {order.addressDetails.addressLine.street}</div>
                          <div><span className="font-semibold">House Number:</span> {order.addressDetails.addressLine.houseNumber}</div>
                          <div><span className="font-semibold">ApartMent Number:</span> {order.addressDetails.addressLine.apartmentNumber}</div>
                          <div><span className="font-semibold">Locality:</span> {order.addressDetails.addressLine.locality}</div>
                          <div><span className="font-semibold">City:</span> {order.addressDetails.addressLine.city}</div>
                          <div><span className="font-semibold">District:</span> {order.addressDetails.addressLine.district}</div>
                          <div><span className="font-semibold">Pincode:</span> {order.addressDetails.addressLine.pincode}</div>
                          <div><span className="font-semibold">State:</span> {order.addressDetails.state}</div>
                          <div><span className="font-semibold">Pincode:</span> {order.addressDetails.pincode}</div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Orders;
