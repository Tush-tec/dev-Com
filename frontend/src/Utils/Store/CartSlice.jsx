import { configureStore, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;

const initialState = {
    cartItems: [],
    isLoading: false,
    error: null
};


export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ userId, productId, quantity }) => {
        const res = await axios.post("/api/v1/cart/add-to-cart/" + productId, { userId, productId, quantity });
        return res.data;
    }
);

export const fetchCartItem = createAsyncThunk(
    "cart/fetchCartItem",
    async (userId) => {
        const res = await axios.get(`/api/v1/cart/get-cart`);
        return res.data;
    }
);  

export const removeCartItem = createAsyncThunk(
    "cart/removeCartItem",
    async ({ userId, productId }) => {
        const res = await axios.delete(`URL/${userId}/${productId}`);
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
                console.log("Fetched cart items:", action.payload);
                state.isLoading = false;
                const newProduct = action.payload; // This is the new product with updated quantity

                // Check if the product already exists in the cart
                const existingProductIndex = state.cartItems.findIndex(item => item._id === newProduct._id);
            
            
                    // Product does not exist, add it to the cart
                    state.cartItems.push(newProduct);
                
        })
            .addCase(addToCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error;
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
                state.error = action.error;
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
                state.error = action.error;
            });
    }
});


export const store = configureStore({reducer:{cart:cartSlice.reducer}})