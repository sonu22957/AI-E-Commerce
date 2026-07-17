import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  productDetails: null,
  loading: false,
  error: null,
  success: false,
};

/**
 * productSlice
 * ------------
 * Redux Toolkit slice for managing product state.
 * Handles product listing, detailed views, and administrative operations
 * like product creation, deletion, or modification.
 */
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    productListRequest: (state) => {
      state.loading = true;
      state.products = [];
      state.error = null;
    },
    productListSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload;
    },
    productListFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    productDetailsRequest: (state) => {
      state.loading = true;
      state.productDetails = null;
      state.error = null;
    },
    productDetailsSuccess: (state, action) => {
      state.loading = false;
      state.productDetails = action.payload;
    },
    productDetailsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    productDeleteRequest: (state) => {
      state.loading = true;
      state.success = false;
    },
    productDeleteSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    productDeleteFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    productCreateRequest: (state) => {
      state.loading = true;
      state.success = false;
    },
    productCreateSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.productDetails = action.payload;
    },
    productCreateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    productCreateReset: (state) => {
      state.success = false;
      state.productDetails = null;
    },
    productUpdateRequest: (state) => {
      state.loading = true;
      state.success = false;
    },
    productUpdateSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.productDetails = action.payload;
    },
    productUpdateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    productUpdateReset: (state) => {
      state.success = false;
      state.productDetails = null;
    },
  },
});

export const {
  productListRequest,
  productListSuccess,
  productListFail,
  productDetailsRequest,
  productDetailsSuccess,
  productDetailsFail,
  productDeleteRequest,
  productDeleteSuccess,
  productDeleteFail,
  productCreateRequest,
  productCreateSuccess,
  productCreateFail,
  productCreateReset,
  productUpdateRequest,
  productUpdateSuccess,
  productUpdateFail,
  productUpdateReset,
} = productSlice.actions;

export default productSlice.reducer;
