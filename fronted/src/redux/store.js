import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import productReducer from "./productSlice";
import orderReducer from "./orderSlice";
import aiReducer from "./aiSlice";

/**
 * Redux Store Configuration
 * -------------------------
 * Configures the centralized Redux store.
 * Combines all feature reducers including Auth, Cart, Product, Order, and AI slices.
 */
const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
    order: orderReducer,
    ai: aiReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
