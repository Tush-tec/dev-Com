import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartItem,
  addToCart,
  removeCartItem,
} from "../Utils/Store/CartSlice";
import Loader from "./Loader";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems, isLoading, error } = useSelector((state) => state.cart);
  const userId = "your_actual_user_id"; // Replace with the actual user ID

  useEffect(() => {
    dispatch(fetchCartItem());
  }, [dispatch]);

  // Remove item from cart
  const handleRemove = (id) => {
    dispatch(removeCartItem({ userId, productId: id }));
  };

  // Update item quantity in cart
  const handleQuantityChange = (id, quantity) => {
    if (quantity > 0) {
      dispatch(addToCart({ userId, productId: id, quantity }));
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500">{error.message}</p>;

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? ( // Fixed empty cart condition
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item, index) => (
            // console.log(item), 
            <li key={index} className="cart-item">
              <div>
                <h4>{item.name}</h4>
                <p>Price: ${item.price}</p>
                <div>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button onClick={() => handleRemove(item._id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
