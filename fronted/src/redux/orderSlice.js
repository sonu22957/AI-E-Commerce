import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  orderDetails: null,
  loading: false,
  success: false,
  error: null,
};

/**
 * orderSlice
 * ----------
 * Redux Toolkit slice for managing order state.
 * Tracks user order history, order details (for single order view), 
 * and loading/success states for order operations.
 */
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    orderCreateRequest: (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    orderCreateSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.orderDetails = action.payload;
    },
    orderCreateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    orderCreateReset: (state) => {
      state.success = false;
      state.error = null;
    },
    orderDetailsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    orderDetailsSuccess: (state, action) => {
      state.loading = false;
      state.orderDetails = action.payload;
    },
    orderDetailsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    orderListMyRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    orderListMySuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    orderListMyFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    orderListAllRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    orderListAllSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    orderListAllFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  orderCreateRequest,
  orderCreateSuccess,
  orderCreateFail,
  orderCreateReset,
  orderDetailsRequest,
  orderDetailsSuccess,
  orderDetailsFail,
  orderListMyRequest,
  orderListMySuccess,
  orderListMyFail,
  orderListAllRequest,
  orderListAllSuccess,
  orderListAllFail,
} = orderSlice.actions;

export default orderSlice.reducer;
