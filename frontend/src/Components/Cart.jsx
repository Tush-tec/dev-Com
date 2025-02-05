import React from 'react'
import {useDispatch, useSelector} from "@reduxjs/toolkit"
import { addToCartApi } from '../Utils/SliceStore/CartSlice'


const Cart = () => {
    const dispatch = useDispatch()
    const {userCart, isLoading, error } = useSelector((state) => state.cart)

    const handleToCart = () => {
        dispatch(addToCartApi(
            {
                ProductId : product._id,
                quantity : 1
            }
        ))
    }

  return (
    <div>
    <h3>{product.name}</h3>
    <button onClick={handleToCart}>Add to Cart</button>
  </div>
  )
}

export default Cart