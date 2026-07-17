import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  loading: false,
  error: null,
  success: false,
};

/**
 * userSlice
 * ---------
 * Redux Toolkit slice for admin user management.
 * Tracks user listings, role updates, and account deletion states.
 */
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userListRequest: (state) => {
      state.loading = true;
      state.users = [];
      state.error = null;
    },
    userListSuccess: (state, action) => {
      state.loading = false;
      state.users = action.payload;
    },
    userListFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    userDeleteRequest: (state) => {
      state.loading = true;
      state.success = false;
    },
    userDeleteSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    userDeleteFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    userUpdateRequest: (state) => {
      state.loading = true;
      state.success = false;
    },
    userUpdateSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    userUpdateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    userUpdateReset: (state) => {
      state.success = false;
    },
  },
});

export const {
  userListRequest,
  userListSuccess,
  userListFail,
  userDeleteRequest,
  userDeleteSuccess,
  userDeleteFail,
  userUpdateRequest,
  userUpdateSuccess,
  userUpdateFail,
  userUpdateReset,
} = userSlice.actions;

export default userSlice.reducer;
