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
  }, [dispatch, isAuthenticated, cartItems.length]);

  const handleRemove = (id) => {
    dispatch(removeCartItem({ userId, productId: id }));
  };

  const handleQuantityChange = async (id, quantity) => {
    if (quantity > 0) {
      try {
        await dispatch(addToCart({ userId, productId: id, quantity })).unwrap();
         dispatch(fetchCartItem());
      } catch (error) {
        console.error("Failed to update cart:", error);
      }
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500">{error.message}</p>;

  const subtotal = Array.isArray(cartItems)
  ? cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)
  : 0;


  return (
    <>
      <HeaderPage />

      <div className="container mx-auto mt-10 mb-10 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 p-6 bg-white rounded-lg shadow-md h-[500px] overflow-y-auto">
            <h2 className="text-xl font-semibold pb-3 border-b mb-4">Shopping Cart</h2>

            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 bg-gradient-to-r from-gray-400 via-black-900
to-gray-900 text-white rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Oops! Your cart is empty. 😅</h3>
                <p className="mb-6 text-center">Looks like you've been adding items to your wishlist instead of your cart! Let's fix that. 🛒</p>
                <Link to="/products">
                  <button className="bg-white text-black px-5 py-2 rounded-md hover:bg-gray-100">Explore Products</button>
                </Link>
              </div>
            ) : (
              <>
                <div className="hidden md:grid grid-cols-6 gap-4 font-semibold border-b pb-3 mb-3 text-gray-700">
                  <span className="col-span-2">Product</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Subtotal</span>
                  <span>Remove</span>
                </div>
                <div className="space-y-6">
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center border-b pb-4"
                    >
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
                      <p className="text-gray-600 text-sm md:text-base text-center md:text-left">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
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
                      <p className="font-medium text-sm md:text-base text-center md:text-left">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
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
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold pb-3 border-b mb-4">Cart Totals</h2>
            <div className="flex justify-between text-lg font-medium border-b pb-3">
              <span>Subtotal:</span> <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
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

      <Footer />
    </>
  );
};

export default Cart;
