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

            const res = await axios.post(`/api/v1/cart/add-to-cart/${productId}`, { userId, productId, quantity });
            // console.log(res);
            
            return res.data;  
        }
    );

    export const fetchCartItem = createAsyncThunk(
        "cart/fetchCartItem",
        async () => {

            const res = await axios.get(`/api/v1/cart/get-cart`);
            // console.log(res.data);
            
            return res.data.data.items;  
        }
    );

    export const removeCartItem = createAsyncThunk(
        "cart/removeCartItem",
        async ({ productId }) => {

            // console.log("Removing from cart:", productId);  
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
                    // console.log("Add to Cart Response:", action.payload);
                
                    if (action.payload && action.payload.data && action.payload.data.items) {
                        state.cartItems = action.payload.data.items;  // ✅ Update cart with full item list
                    } else {
                        console.error("Unexpected API response format:", action.payload);
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
                state.cartItems = action.payload;


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
                    
                    if (action.payload && action.payload.data && action.payload.data.items) {

                        state.cartItems = action.payload.data.items;
                    } else {

                        const { productId } = action.meta.arg;
                        state.cartItems = state.cartItems.filter((item) => item.productId !== productId);
                    }
                })
                .addCase(removeCartItem.rejected, (state, action) => {
                    state.isLoading = false;
                    state.error = action.error.message || "Failed to remove cart item";
                });
                
        }
    });

    export const store = configureStore({ reducer: { cart: cartSlice.reducer } });
