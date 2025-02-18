  import React, { useEffect, useState } from "react";
  import { useSelector, useDispatch } from "react-redux";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";
  import { fetchCartItem } from "../Utils/Store/CartSlice";
  import HeaderPage from "../Components/HeaderPage";
  import Footer from "../Components/Footer";
  import { createAddress } from "../Api/api";

  const AddressForm = ({ address, handleChange, handleSubmit, errors }) => (
    <div className="bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Billing Address</h2>
      {errors && <p className="text-red-500 text-center">{errors}</p>}
      <div className="space-y-4">
        {[
          { label: "Street", name: "street" },
          { label: "House Number", name: "houseNumber" },
          { label: "Apartment Number", name: "apartmentNumber" },
          { label: "Locality", name: "locality" },
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
        <button
          className="px-5 py-3 bg-black text-white rounded-md hover:bg-gray-800"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );

  const OrderSummary = ({ cartItems, subtotal, totalQuantity, handleProceedToPayment }) => (
    <div className="bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
      <div className="space-y-4 max-h-175 overflow-auto">
        {cartItems.map((item) => (
          <div key={item.productId} className="flex items-center justify-between p-2 border-b">
            <img src={item.image.replace("/upload/", "/upload/w_400,h_200,c_fill/")} alt={item.name} className="w-20 h-20 object-cover rounded-md border" />
            <div className="flex-1 px-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-600">Qty: {item.quantity}</p>
              <p className="text-gray-600">₹{item.price.toLocaleString("en-IN")}</p>
            </div>
            <p className="font-semibold text-lg">₹{(item.quantity * item.price).toLocaleString("en-IN")}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t pt-4">
        <div className="flex justify-between text-lg font-sans mb-5 ">
          <span>Total Quantity of Product:</span>
          <span>{totalQuantity}</span>
        </div>
        <div className="flex justify-between text-xl font-serif mt-2 border-b  ">
          <span>Subtotal:</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
      </div>
      <div className="grid place-items-center">
        <button onClick={handleProceedToPayment} className="mt-6 px-6 bg-black text-white py-3 rounded-md text-lg transition duration-300 ease-in-out">
          Proceed to Payment
        </button>
      </div>
    </div>
  );

  const CheckOut = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems, isLoading } = useSelector((state) => state.cart);

    const [address, setAddress] = useState({
      street: "", houseNumber: "", apartmentNumber: "", locality: "", district: "",
      city: "", pincode: "", state: "", phoneNumber: "",
    });

    const [errors, setErrors] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => { dispatch(fetchCartItem()); }, [dispatch]);

    const handleChange = (e) => {
      setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {

      e.preventDefault();
      setErrors("");

      try {
        
        const response = await createAddress({ addressLine: { ...address }, state: address.state, phoneNumber: address.phoneNumber });
        // console.log("response", response.data.data._id);
        if (response.data.success) {

          setAddress({ ...address, _id: response.data.data._id }); 
          
          alert("Address saved successfully. You can proceed to payment.");
        } else {
          setErrors(response.data.errors || {});
        }
      } catch (error) {
        setErrors(error.response?.data?.message || "An error occurred");
      }
    };

    const handleProceedToPayment = async () => {

      // console.log("click");/
      
      if (!address.street || !address.pincode || !address.phoneNumber) {
        setErrors("Please fill in all required address fields.");
        return;
      }

      console.log(address._id);
      

      setErrors("");  
      setIsProcessing(true); 

      try {

        const { data } = await axios.post("http://localhost:8080/api/v1/orders/create-order",  {
        
          addressId: address._id,  
          paymentMethod: "Online",
        }, {withCredentials: true});
        
        console.log(data);
        
        if (!data.success) {
          throw new Error(data.message || "Order creation failed!");
        }

        const { id: razorpayOrderId, amount } = data.data;  

        // Step 2: Initialize Razorpay Payment

        const options = {
          key:import.meta.env.RAZORPAY_API_KEY ,  
          amount,  
          currency: "INR",  
          name: "DevCom",  
          description: "Secure Payment", 
          order_id: razorpayOrderId,  
          handler: async function (paymentResponse) {

            try {
              // Step 3: Verify Payment with Backend

              const verifyRes = await axios.post("http://localhost:8080/api/v1/orders/verify-payment", {

                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,

              });

              if (verifyRes.data.success) {
                alert("Payment Successful! 🎉");
                navigate("/order-success");  
              } else {
                throw new Error("Payment verification failed. Please contact support.");
              }
            } catch (error) {
              console.error("Error verifying payment:", error);
              alert("Payment verification failed.");
            }
          },
          prefill: {
            name: "Customer Name",  
            email: "customer@example.com",  
            contact: address.phoneNumber,  
          },
          theme: { color: "#3399cc" },  
        };

        // Open the Razorpay payment gateway
        const rzp = new window.Razorpay(options);
        rzp.open();

        rzp.on('payment.failed', function (response){
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
  });

      } catch (error) {

        console.error("Error processing payment:",  error.response.data.message);
        // alert(error.message || "Something went wrong. Please try again.");

      } finally {
        setIsProcessing(false); 
      }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
      <>
        <HeaderPage />
        <div className="max-w-10xl mx-auto p-20 bg-gray-100 min-h-screen my-8">
          {isLoading && <p className="text-center">Loading cart items...</p>}
          <div className="grid md:grid-cols-2 gap-8">
            <AddressForm address={address} handleChange={handleChange} handleSubmit={handleSubmit} errors={errors} />
            <OrderSummary cartItems={cartItems} subtotal={subtotal} totalQuantity={totalQuantity} handleProceedToPayment={handleProceedToPayment} />
          </div>
        </div>
        <Footer />
      </>
    );
  };

  export default CheckOut;
