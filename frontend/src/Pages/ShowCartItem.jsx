import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartItem,
  removeCartItem,
} from "../Utils/Store/CartSlice";
import Loader from "../Components/Loader";
import Footer from "../Components/Footer";
import HeaderPage from "../Components/HeaderPage";
import { LocalStorage } from "../Utils/app";

const ShowCartItem = () => {
  const dispatch = useDispatch();
  const { cartItems = [], isLoading, error } = useSelector(
    (state) => state.cart
  );
  const userId = LocalStorage.get("Token");

  useEffect(() => {
    const cart = dispatch(fetchCartItem());
    console.log(cart);
    

  }, [dispatch]);

  // Function to remove item from cart
//   const handleRemove = (id) => {
//     dispatch(removeCartItem({ userId, productId: id }));
//   };

  const subtotal = cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toLocaleString("en-IN");

  return (
    <>
      <HeaderPage />
      <div className="container mt-10 mb-10 mx-auto p-4">
        {isLoading && <Loader />}
        {error && <div className="text-red-500">{error.message}</div>}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Cart Items */}
          <div className="w-full md:w-3/4 p-4 border rounded-lg bg-white shadow-md">
            <h2 className="text-xl text-center font-semibold border-b pb-2 mb-4">
              Shopping Cart
            </h2>
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b py-4"
                >
                  <img
                    src={item.image.replace(
                      "/upload/",
                      "/upload/w_600,h_750,c_fill/"
                    )}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">
                      Price: ₹{item.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="flex items-center border rounded-md">
                    {/* Add Quantity Control (if needed) */}
                    {/* <button onClick={() => handleQuantityChange(item.productId, "decrease", item.quantity)} disabled={item.quantity <= 1}>-</button> */}
                    {/* <span>{item.quantity}</span> */}
                    {/* <button onClick={() => handleQuantityChange(item.productId, "increase", item.quantity)}>+</button> */}
                  </div>
                  <p className="font-semibold">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                  {/* <button
                    onClick={() => handleRemove(item.productId)}
                    className="text-red-500 ml-4"   
                  >
                    Remove
                  </button> */}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Cart is Empty</p>
            )}
          </div>

          {/* Cart Totals */}
          <div className="w-full md:w-1/4 p-4 border rounded-lg bg-white shadow-md flex flex-col justify-between">
            <div>
              <p className="flex justify-between text-lg font-semibold py-2  border-b  ">
                <span>Total:</span> <span>₹{subtotal}</span>
              </p>
              <p className="flex justify-between text-lg font-semibold   mt-80 py-5 border-t border-b   ">
                <span>Subtotal:</span> <span>₹{subtotal}</span>
              </p>
            </div>
            <button className="w-full bg-black text-white py-2 mt-4 rounded-md hover:bg-gray-800 mb-10">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShowCartItem;
