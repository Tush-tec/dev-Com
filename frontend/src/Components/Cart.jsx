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

  return (
    <div className="w-80 max-h-800 bg-gray-100 p-4 shadow-lg right-0 top-0 overflow-auto">
      <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        An empty cart? What a lonely place. Go on, give it some company! 🛒
      </p>
      ) : (
        <ul className="space-y-4">
          {(Array.isArray(cartItems) ? cartItems : []).map((item, index) => (

            <li key={index} className="p-4 bg-white shadow-md rounded-lg flex flex-col">
              <img src={item.mainImage} alt="" />
              <h4 className="font-medium text-gray-800">{item.name ?? "Unknown Product"}</h4>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  {/* <button
                    onClick={() => handleQuantityChange(item._id, Math.max(1, Number(item.quantity) || 1) - 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button> */}
                 <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                    <p className="text-gray-600 text-sm">Price:&#8377;{(item.price ?? 0).toLocaleString("en-IN")}</p>

                      <span className="font-medium text-gray-700">Quantity:</span>
                      <span className="px-1 py-1 bg-gray-100 rounded">{Number(item.quantity) || 1}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-700">Total Price:</span>
                      <span className="px-1 py-1 bg-gray-100 rounded">
                        ₹{(Number(item.quantity) * item.price).toLocaleString("en-IN") || 1}
                      </span>
                    </div>
                  </div>
                  {/* <button
                    onClick={() => handleQuantityChange(item._id, (Number(item.quantity) || 1) + 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button> */}
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
