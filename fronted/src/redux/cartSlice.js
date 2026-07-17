import { createSlice } from "@reduxjs/toolkit";

/**
 * Helper to safely get cart data from localStorage
 */
const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : {
      cartItems: [],
      shippingAddress: {},
      paymentMethod: "PayPal",
    };
  } catch (error) {
    console.error("Error parsing cart from localStorage", error);
    return {
      cartItems: [],
      shippingAddress: {},
      paymentMethod: "PayPal",
    };
  }
};

const initialState = getCartFromStorage();

/**
 * Helper to calculate prices and save to localStorage
 */
const updateCart = (state) => {
  // Calculate Item Price
  state.itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Calculate Shipping (Free over $100, else $10)
  state.shippingPrice = state.itemsPrice > 100 ? 0 : 10;

  // Calculate Tax (15%)
  state.taxPrice = Number((0.15 * state.itemsPrice).toFixed(2));

  // Calculate Total Price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(state));
};

/**
 * cartSlice
 * ---------
 * Redux Toolkit slice for managing shopping cart state.
 * Handles adding/removing items, updating quantities, and storing shipping/payment info.
 */
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => (x._id || x.id) === (item._id || item.id));

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          (x._id || x.id) === (existItem._id || existItem.id) ? item : x
        );
      } else {
        state.cartItems.push(item);
      }
      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => (x._id || x.id) !== action.payload);
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      return updateCart(state);
    },
    updateItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((x) => (x._id || x.id) === id);
      if (item) {
        item.quantity = quantity;
      }
      return updateCart(state);
    },
    applyCoupon: (state, action) => {
      state.couponCode = action.payload.code;
      state.discount = action.payload.discountAmount;
      return updateCart(state);
    },
    removeCoupon: (state) => {
      state.couponCode = null;
      state.discount = 0;
      return updateCart(state);
    }
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  updateItemQuantity,
  applyCoupon,
  removeCoupon
} = cartSlice.actions;

// Aliases used by CartItem.jsx and useCart.js
export const addItem = addToCart;
export const removeItem = removeFromCart;
export const clearCart = clearCartItems;

// Selectors
export const selectCartItems = (state) => state.cart.cartItems;

export default cartSlice.reducer;
