import { configureStore, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;

const initialState = {
    cartItems: [],
    isLoading: false,
    error: null,
};

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ userId, productId, quantity }) => {
        // Ensure productId is passed as a string (if necessary)
        const res = await axios.post(`/api/v1/cart/add-to-cart/${productId}`, { userId, productId, quantity });
        return res.data;  // Ensure the response is in the expected format (with items)
    }
);

export const fetchCartItem = createAsyncThunk(
    "cart/fetchCartItem",
    async () => {
        const res = await axios.get(`/api/v1/cart/get-cart`);
        return res.data.data.items;  // Ensure correct path to items
    }
);

export const removeCartItem = createAsyncThunk(
    "cart/removeCartItem",
    async ({ productId }) => {
        console.log("Removing from cart:", productId);  
        const res = await axios.delete(`/api/v1/cart/remove-from-cart/${productId}`);
        return res.data;
    }
);


const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                
                const newProduct = action.payload;
                console.log(newProduct);
                
                const existingProductIndex = state.cartItems.findIndex(item => item.productId === newProduct.productId);

                if (existingProductIndex !== -1) {
                    // Update quantity if product already exists in the cart
                    state.cartItems[existingProductIndex].quantity += newProduct.quantity;
                } else {
                    // Add new product to the cart
                    state.cartItems.push(newProduct);
                }
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to add to cart';
            })
            .addCase(fetchCartItem.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCartItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchCartItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch cart items';
            })
            .addCase(removeCartItem.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to remove from cart';
            });
    }
});

export const store = configureStore({ reducer: { cart: cartSlice.reducer } });
