import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchCartItem } from "../Utils/Store/CartSlice";
import HeaderPage from "../Components/HeaderPage";
import Footer from "../Components/Footer";
import {
  createAddress,
  getAllSaveAddress,
  createOrderWithRazorPay,
  verifyRazorpayOrder,
  createOrder,
} from "../Api/api";
import { requestHandler } from "../Utils/app";
import Loader from "../Components/Loader";

const CheckOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, isLoading } = useSelector((state) => state.cart);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street: "",
    houseNumber: "",
    apartmentNumber: "",
    locality: "",
    district: "",
    city: "",
    pincode: "",
    state: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    dispatch(fetchCartItem()); 
    fetchAddresses();
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(cartItems) && cartItems.length > 0) {
      const total = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setTotalPrice(total);
    } else {
      setTotalPrice(0); 
    }
  }, [cartItems]);
  

  const fetchAddresses = () => {
    requestHandler(
      getAllSaveAddress,
      null,
      (data) => {
        console.log(data);
        setSavedAddresses(data.data.addresses);
      },
      (error) => setErrors(error)
    );
  };

  const handleAddressSelection = (e) => {
    setSelectedAddress(e.target.value);
  };

  const handleChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors("");
    requestHandler(
      () =>
        createAddress({
          addressLine: { ...newAddress },
          state: newAddress.state,
          phoneNumber: newAddress.phoneNumber,
        }),
      setIsProcessing,
      (data) => {
        setSavedAddresses([...savedAddresses, data.data]);
        setShowAddressForm(false);
        setSelectedAddress(data.data._id);
      },
      (error) => setErrors(error)
    );
  };

  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      setErrors("Please select or add an address.");
      return;
    }

    if (!paymentMethod) {
      setErrors("Please select a payment method.");
      return;
    }

    if (paymentMethod === "Razorpay") {
      requestHandler(
        () => createOrderWithRazorPay(selectedAddress),
        setIsProcessing,
        (data) => {
          const { razorpayPaymentId, totalAmount } = data.data;
          if (!razorpayPaymentId || !totalAmount) {
            throw new Error("Invalid Razorpay order details received");
          }

          const options = {
            key: import.meta.env.VITE_RAZORPAY_API_KEY,
            totalAmount,
            currency: "INR",
            name: "DevCom",
            description: "Secure Payment",
            order_id: razorpayPaymentId,
            handler: async function (paymentResponse) {
              requestHandler(
                () => verifyRazorpayOrder(paymentResponse),
                null,
                () => {
                  alert("Payment Successful! 🎉");
                  dispatch(fetchCartItem());
                  navigate("/profile/order");
                },
                (error) => alert(error)
              );
            },
            prefill: {
              name: "Customer Name",
              email: "customer@example.com",
              contact: "",
            },
            theme: { color: "#3399cc" },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
          rzp.on("payment.failed", function (response) {
            alert(response.error.description);
          });
        },
        (error) => setErrors(error)
      );
    } else {
      // COD API Call
      requestHandler(
        () => createOrder(selectedAddress, paymentMethod),

        setIsProcessing,
        () => {
          alert("Order placed successfully with Cash on Delivery!");
          dispatch(fetchCartItem());
          navigate("/profile/order");
        },
        (error) => setErrors(error)
      );
    }
  };

  return (
    <>
      {isProcessing && <Loader />}
      <HeaderPage />
      <div className="max-w-6xl shadow mx-auto  bg-gray-100 min-h-screen">
        <h2 className="text-3xl font-bold text-center mb-6">Checkout</h2>

        {isLoading && <Loader />}

        <div className="grid md:grid-cols-2 gap-8 p-8 space-y-">
          {/* Address & Payment Section - Left Side */}
          {/* Address & Payment Section - Left Side */}
          <div className="flex flex-col bg-white rounded-lg space-y-5 h-[90vh] p-10 space-y-1">
          {errors && <p className="text-center text-xl text-red-500 p-6">{errors}</p>}

            <h2 className="text-2xl font-semibold mb-4">Select Address</h2>

            {/* Scrollable Address List */}
            <div className="overflow-y-auto h-[90vh] pr-2 space-y-6">
              {savedAddresses.length > 0 ? (
                savedAddresses.map((addr) => (
                  <label
                    key={addr._id}
                    className="flex items-start gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-100 transition shadow-sm h-30 overflow-y-auto "
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr._id}
                      className="mt-1 w-5 h-5 accent-black"
                      onChange={handleAddressSelection}
                    />
                    <div className="text-gray-700 space-y-1">
                      <p>
                        <span className="font-semibold">House Number:</span>{" "}
                        {addr.addressLine.houseNumber}
                      </p>
                      <p>
                        <span className="font-semibold">Apartment Number:</span>{" "}
                        {addr.addressLine.apartmentNumber}
                      </p>
                      <p>
                        <span className="font-semibold">Street:</span>{" "}
                        {addr.addressLine.street}
                      </p>
                      <p>
                        <span className="font-semibold">Locality:</span>{" "}
                        {addr.addressLine.locality}
                      </p>
                      <p>
                        <span className="font-semibold">City:</span>{" "}
                        {addr.addressLine.city}
                      </p>
                      <p>
                        <span className="font-semibold">District:</span>{" "}
                        {addr.addressLine.district}
                      </p>
                      <p>
                        <span className="font-semibold">State:</span>{" "}
                        {addr.state}
                      </p>
                      <p>
                        <span className="font-semibold">Pincode:</span>{" "}
                        {addr.addressLine.pincode}
                      </p>
                      <p>
                        <span className="font-semibold">Phone:</span>{" "}
                        {addr.phoneNumber}
                      </p>
                    </div>
                  </label>
                ))
              ) : (
                <p className="text-gray-500">No saved addresses found.</p>
              )}
            </div>

            <Link
              className=" w-full text-center bg-black px-2 py-3 rounded-md text-white"
              to="/address/create-address"
            >
              Add New Address
            </Link>
          </div>

          {/* Cart Section - Right Side */}
          <div className="bg-white shadow-lg p-6 rounded-lg h-[90vh] flex flex-col">
            <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>

            <div className="flex-1 overflow-y-auto">
              {cartItems?.length > 0 ? (
                <>
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between items-center gap-4 p-3 border-b"
                    >
                      <div className="flex items-center gap-4">
                        <img
  src={item.image.replace("/upload/", "/upload/w_200,h_200,c_fill,q_auto,f_auto/")}
  alt={item.name}
  className="w-16 h-16 object-cover rounded-md"
                        />
                        <div>
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <p>Price: ₹{item.price.toLocaleString("en-IN")}</p>
                          <p>Quantity: {item.quantity}</p>

                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-gray-500">No items in cart.</p>
              )}
            </div>

            {cartItems?.length > 0 && (
              <>
                <div className="text-xl font-bold mt-4">
                Total Price: ₹{totalPrice.toLocaleString("en-IN")}
                </div>

                <h2 className="text-2xl font-semibold mt-6 mb-4">
                  Payment Method
                </h2>
                <div className="flex flex-col gap-4 bg-gray-100 p-4 rounded-lg shadow-md">
                  <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-200 transition">
                    <input
                      type="radio"
                      name="payment"
                      value="Razorpay"
                      className="w-5 h-5 accent-black"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="text-gray-700 font-medium">Razorpay</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-200 transition">
                    <input
                      type="radio"
                      name="payment"
                      value="Cash on Delivery"
                      className="w-5 h-5 accent-black"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="text-gray-700 font-medium">
                      Cash on Delivery
                    </span>
                  </label>
                </div>

                <button
                  onClick={handleProceedToPayment}
                  className="mt-6 px-6 py-3 bg-black text-white rounded-md w-full hover:bg-gray-800"
                >
                  Proceed to Payment
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckOut;
