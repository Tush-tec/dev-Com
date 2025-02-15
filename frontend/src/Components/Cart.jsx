import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartItem,
  addToCart,
  removeCartItem,
} from "../Utils/Store/CartSlice";
import Loader from "./Loader";
import { LocalStorage } from "../Utils/app";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems = [], isLoading, error } = useSelector((state) => state.cart);
  const userId = LocalStorage.get("Token");

  useEffect(() => {
    dispatch(fetchCartItem());
  }, [dispatch]);

  // console.log("Cart Items from Redux:", cartItems); 

  const handleRemove = (id) => {
    dispatch(removeCartItem({ userId, productId: id }));
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity > 0) {
      dispatch(addToCart({ userId, productId: id, quantity }));
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500">{error.message}</p>;

  return (
    <div className="w-80 h-screen bg-gray-100 p-4 shadow-lg right-0 top-0 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <ul className="space-y-4">
          {(Array.isArray(cartItems) ? cartItems : []).map((item, index) => (

            <li key={index} className="p-4 bg-white shadow-md rounded-lg flex flex-col">
              <img src={item.mainImage} alt="" />
              <h4 className="font-medium text-gray-800">{item.name ?? "Unknown Product"}</h4>
              <p className="text-gray-600 text-sm">Price:&#8377;{(item.price ?? 0).toLocaleString("en-IN")}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item._id, Math.max(1, Number(item.quantity) || 1) - 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 bg-gray-100 rounded">{Number(item.quantity) || 1}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, (Number(item.quantity) || 1) + 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
