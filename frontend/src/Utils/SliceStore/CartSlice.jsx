// src/redux/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { requestHandler } from "../utils/requestHandler"; // import the requestHandler utility
import axios from "axios";

// Axios instance to simplify API requests
const api = axios.create({
  baseURL: "http://localhost:8080/api/v1/cart", // Base URL for your API
});

// Thunks to handle API requests

// Add product to cart
export const addToCartApi = createAsyncThunk(
  "cart/addToCartApi",
  async ({ productId, quantity }, { rejectWithValue }) => {
    const apiFunc = () => api.post(`/add-to-cart/${productId}`, { quantity });

    // Call requestHandler with onSuccess and onError callbacks
    await requestHandler(
      apiFunc,
      (data) => {
        return data.cart; // Success, return the updated cart
      },
      (error) => {
        throw rejectWithValue(error); // Error, reject the action
      }
    );
  }
);

// Get the current cart
export const getCartApi = createAsyncThunk(
  "cart/getCartApi",
  async (_, { rejectWithValue }) => {
    const apiFunc = () => api.get("/get-cart");

    await requestHandler(
      apiFunc,
      (data) => {
        return data.cart;
      },
      (error) => {
        throw rejectWithValue(error);
      }
    );
  }
);

// Remove product from cart
export const removeFromCartApi = createAsyncThunk(
  "cart/removeFromCartApi",
  async (productId, { rejectWithValue }) => {
    const apiFunc = () => api.delete(`/remove-from-cart/${productId}`);

    await requestHandler(
      apiFunc,
      (data) => {
        return data.cart;
      },
      (error) => {
        throw rejectWithValue(error);
      }
    );
  }
);

// Clear cart
export const clearCartApi = createAsyncThunk(
  "cart/clearCartApi",
  async (_, { rejectWithValue }) => {
    const apiFunc = () => api.delete("/clear-cart");

    await requestHandler(
      apiFunc,
      (data) => {
        return []; // Clear cart and return empty cart
      },
      (error) => {
        throw rejectWithValue(error);
      }
    );
  }
);

// Cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Keep the local cart actions
    addToCart: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.userCart.find((item) => item.productId === productId);
      if (item) {
        item.quantity += quantity;
      } else {
        state.userCart.push({ productId, quantity });
      }
    },
    removeFromCart: (state, action) => {
      state.userCart = state.userCart.filter(
        (item) => item.productId !== action.payload
      );
    },
    updateCart: (state, action) => {
      state.userCart = action.payload;
    },
    resetCart: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCartApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userCart = action.payload;
      })
      .addCase(addToCartApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(getCartApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userCart = action.payload;
      })
      .addCase(getCartApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(removeFromCartApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromCartApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userCart = action.payload;
      })
      .addCase(removeFromCartApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(clearCartApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearCartApi.fulfilled, (state) => {
        state.isLoading = false;
        state.userCart = [];
      })
      .addCase(clearCartApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { addToCart, removeFromCart, updateCart, resetCart } = cartSlice.actions;

export default cartSlice.reducer;
