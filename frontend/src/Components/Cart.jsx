import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartItem, addToCart, removeCartItem } from '../Utils/Store/CartSlice';
import Loader from './Loader';

const Cart = () => {
    const dispatch = useDispatch();
    const { cartItems, isLoading, error } = useSelector(state => state.cart);

    useEffect(() => {
        dispatch(fetchCartItem("userId")); 
    }, [dispatch]);

    const handleRemove = (id) => {
        dispatch(removeCartItem({ userId: "userId", productId: id })); 
    };

    const handleQuantityChange = (id, quantity) => {
        if (quantity > 0) {
            dispatch(addToCart({ userId: "userId", productId: id, quantity }));
        }
    };

    if (isLoading) return <Loader />;
    if (error) return <p className="text-red-500">{error.message}</p>;

    return (
        <div className="cart-container">
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cartItems.map(item => (
                        <li key={item._id} className="cart-item">
                            <img src={item.mainImage} alt={item.name} width="50" />
                            <div>
                                <h4>{item.name}</h4>
                                <p>Price: ${item.price}</p>
                                <div>
                                    <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>+</button>
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
