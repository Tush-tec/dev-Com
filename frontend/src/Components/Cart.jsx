import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItem, addToCart, removeCartItem } from "../Utils/Store/CartSlice";
import Loader from "./Loader";
import { LocalStorage } from "../Utils/app";
import HeaderPage from "./HeaderPage";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import { useAuth } from "../Utils/AuthContext";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems = [], isLoading, error } = useSelector((state) => state.cart);
  const userId = LocalStorage.get("Token");

  const {isAuthenticated} = useAuth()

  useEffect(() => {
    if (!isAuthenticated) return
    dispatch(fetchCartItem());
  }, [dispatch, isAuthenticated]);

  const handleRemove = (id) => {
    dispatch(removeCartItem({ userId, productId: id }));
  };

  const handleQuantityChange = async (id, quantity) => {
    if (quantity > 0) {
      try {
        await dispatch(addToCart({ userId, productId: id, quantity })).unwrap();
        await dispatch(fetchCartItem());
      } catch (error) {
        console.error("Failed to update cart:", error);
      }
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500">{error.message}</p>;

  // Calculate subtotal
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      <HeaderPage />

      {
        isAuthenticated ? (
          // True Section

          <div className="container mx-auto mt-10 mb-10 p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Section: Cart Items */}
            <div className="col-span-2 p-6 bg-white rounded-lg shadow-md h-[500px] overflow-y-auto">
  
              <h2 className="text-xl font-semibold pb-3 border-b mb-4">Shopping Cart</h2>
  
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty.</p>
              ) : (
                <>
                  {/* Table Header - Hidden on Small Screens */}
                  <div className="hidden md:grid grid-cols-6 gap-4 font-semibold border-b pb-3 mb-3 text-gray-700">
                    <span className="col-span-2">Product</span>
                    <span>Price</span>
                    <span>Quantity</span>
                    <span>Subtotal</span>
                    <span>Remove</span>
                  </div>
  
                  {/* Cart Items */}
                  <div className="space-y-6">
                    {cartItems.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center border-b pb-4"
                      >
                        {/* Product Image & Name */}
                        <div className="flex items-center col-span-2 md:col-span-2">
                          <img
                            src={item.image.replace("/upload/", "/upload/w_600,h_750,c_fill/")}
                            alt={item.name}
                            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md"
                          />
                          <div className="ml-3 md:ml-4">
                            <h4 className="font-medium text-sm md:text-base">{item.name}</h4>
                          </div>
                        </div>
  
                        {/* Price */}
                        <p className="text-gray-600 text-sm md:text-base text-center md:text-left">
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>
  
                        {/* Quantity Controls */}
                        <div className="flex justify-center md:justify-start items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            className="px-3 py-1 bg-gray-200 rounded-md text-sm md:text-base"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-4 py-1 bg-gray-100 rounded-md text-sm md:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            className="px-3 py-1 bg-gray-200 rounded-md text-sm md:text-base"
                          >
                            +
                          </button>
                        </div>
  
                        {/* Subtotal */}
                        <p className="font-medium text-sm md:text-base text-center md:text-left">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
  
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="text-red-500 hover:text-red-700 text-lg md:text-xl"
                        >
                          ✖
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
  
              {/* Coupon Code Section */}
             
            </div>
  
            {/* Right Section: Cart Totals */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-lg font-semibold pb-3 border-b mb-4">Cart Totals</h2>
              <div className="flex justify-between text-lg font-medium border-b pb-3">
                <span>Subtotal:</span> <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
  
              {/* Shipping Options */}
              {/* <div className="mt-4">
                <h3 className="font-medium">Shipping</h3>
                <div className="mt-2 space-y-2 text-sm">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="shipping" className="form-radio" defaultChecked />
                    <span>Collect From Shop</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="shipping" className="form-radio" />
                    <span>Cash On Delivery: ₹150.00</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="shipping" className="form-radio" />
                    <span>Free Shipping (for prepaid orders only)</span>
                  </label>
                </div>
              </div> */}
  
              <p className="flex justify-between text-lg font-semibold mt-100 border-t pt-4">
                <span>Total:</span> <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </p>
                <Link to='/checkout'>
              <button className="w-full bg-black text-white py-3 mt-4 rounded-md hover:bg-gray-800">
                PROCEED TO CHECKOUT
              </button>
              </Link>
            </div>
          </div>
        </div>



        ) : (
          <>


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
                            <button className="bg-[#162130] hover:bg-[#1E293B] text-white py-2 px-5 rounded-full transition-transform transform hover:scale-105 shadow-md">
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
        )
      }
   
      <Footer />
    </>
  );
};

export default Cart;
