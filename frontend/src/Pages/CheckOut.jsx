import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchCartItem } from "../Utils/Store/CartSlice";
import HeaderPage from "../Components/HeaderPage";
import Footer from "../Components/Footer";

const CheckOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, isLoading, error } = useSelector((state) => state.cart);

  const [address, setAddress] = useState({
    street: "",
    district: "",
    city: "",
    pincode: "",
    state: "",
    phoneNumber: "",
  });

  useEffect(() => {
    dispatch(fetchCartItem());
  }, [dispatch]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = async () => {
    try {
      const response = await axios.post("/api/v1/address/create-address", address);

      if (response.data.success) {
        const totalAmount = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0) * 100;

        var options = {
          key: "your_razorpay_key",
          amount: totalAmount,
          currency: "INR",
          name: "Your Shop",
          description: "Test Transaction",
          handler: function (response) {
            alert("Payment Successful!");
            navigate("/order-success");
          },
          prefill: {
            name: "Customer Name",
            email: "customer@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#3399cc",
          },
        };

        var rzp1 = new window.Razorpay(options);
        rzp1.open();
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  return (
    <>
    <HeaderPage/>
    <div className="max-w-10xl 
     mx-auto p-8 bg-gray-100 min-h-screen my-8"    >

      {isLoading && <p className="text-center">Loading cart items...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Side: Billing Details */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Billing Address</h2>
          <div className="space-y-4">
            {[
              { label: "Street", name: "street" },
              { label: "District", name: "district" },
              { label: "City", name: "city" },
              { label: "Pincode", name: "pincode" },
              { label: "State", name: "state" },
              { label: "Phone Number", name: "phoneNumber" },
            ].map(({ label, name }) => (
              <div key={name}>
                <label className="block text-gray-700 font-medium">{label}</label>
                <input
                  type="text"
                  name={name}
                  placeholder={label}
                  onChange={handleChange}
                  className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex items-center justify-between p-2 border-b">
                <img
                  src={item.image.replace("/upload/", "/upload/w_400,h_200,c_fill/")}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md border"
                />
                <div className="flex-1 px-4">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">Qty: {item.quantity}</p>
                  <p className="text-gray-600">₹{(item.price ?? 0).toLocaleString("en-IN")}</p>
                </div>
                <p className="font-semibold text-lg">₹{(item.quantity * item.price).toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t pt-4">
            <h3 className="text-xl font-bold text-right">Subtotal: ₹{subtotal.toLocaleString("en-IN")}</h3>
          </div>
          <button
            onClick={handleProceedToPayment}
            className="mt-6 w-full px-6 bg-blue-500 hover:bg-blue-700 text-white py-3 rounded-md text-lg font-semibold transition duration-300 ease-in-out"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
      <Footer/>
    </>
  );
};

export default CheckOut;
