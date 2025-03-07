import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCartItem } from "../Utils/Store/CartSlice";
import HeaderPage from "../Components/HeaderPage";
import Footer from "../Components/Footer";
import { createAddress, getSaveAddress, createOrderWithRazorPay, verifyRazorpayOrder, getAllSaveAddress } from "../Api/api";
import { requestHandler } from "../Utils/app";

const CheckOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, isLoading } = useSelector((state) => state.cart);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "", houseNumber: "", apartmentNumber: "", locality: "", district: "",
    city: "", pincode: "", state: "", phoneNumber: "",
  });
  const [errors, setErrors] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    dispatch(fetchCartItem());
    console.log(fetchCartItem);
    
    fetchAddresses();
  }, [dispatch]);

  const fetchAddresses = () => {
    requestHandler(
      getAllSaveAddress,
      null,
      (data) => {
        console.log(data.data.addresses)
        setSavedAddresses(data.data.addresses)
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
      () => createAddress({ addressLine: { ...newAddress }, state: newAddress.state, phoneNumber: newAddress.phoneNumber }),
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
            prefill: { name: "Customer Name", email: "customer@example.com", contact: "" },
            theme: { color: "#3399cc" },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
          rzp.on('payment.failed', function (response) { alert(response.error.description); });
        },
        (error) => setErrors(error)
      );
    } else {
      alert("Order placed successfully with Cash on Delivery!");
      navigate("/profile/order");
    }
  };

  return (
    <>
      <HeaderPage />
      <div className="max-w-10xl mx-auto p-20 bg-gray-100 min-h-screen my-8">
        {isLoading && <p className="text-center">Loading cart items...</p>}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Select Address</h2>
            {savedAddresses.length > 0 ? (
              savedAddresses.map((addr) => (
                <div key={addr._id} className="flex items-center gap-2">
                  <input type="radio" name="address" value={addr._id} onChange={handleAddressSelection} />
                  <span>{addr.addressLine.street}, {addr.city}, {addr.state} - {addr.pincode}</span>
                </div>
              ))
            ) : (
              <p>No saved addresses found.</p>
            )}
            <button className="text-blue-500 mt-4" onClick={() => setShowAddressForm(!showAddressForm)}>
              {showAddressForm ? "Cancel" : "Add New Address"}
            </button>

            {showAddressForm && (
              <form onSubmit={handleSubmit} className="mt-4">
                {Object.keys(newAddress).map((key) => (
                  <input key={key} type="text" name={key} placeholder={key} onChange={handleChange} className="border p-3 w-full rounded-md mb-2" />
                ))}
                <button type="submit" className="px-5 py-3 bg-black text-white rounded-md hover:bg-gray-800">Submit</button>
              </form>
            )}
          </div>

          <div className="bg-white shadow-lg p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" value="Razorpay" onChange={(e) => setPaymentMethod(e.target.value)} /> Razorpay
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" value="Cash on Delivery" onChange={(e) => setPaymentMethod(e.target.value)} /> Cash on Delivery
              </label>
            </div>
            <button onClick={handleProceedToPayment} className="mt-6 px-6 bg-black text-white py-3 rounded-md">Proceed to Payment</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckOut;
