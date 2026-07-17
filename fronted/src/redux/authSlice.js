import { createSlice } from "@reduxjs/toolkit";

/**
 * Helper to safely get from localStorage
 */
const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem("userInfo");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage", error);
    return null;
  }
};

const getTokenFromStorage = () => {
  try {
    return localStorage.getItem("token") || null;
  } catch (error) {
    return null;
  }
};

/**
 * authSlice
 * ---------
 * Redux Toolkit slice for managing authentication state.
 * Handles storing the current user and JWT token, integrating with localStorage
 * to persist sessions across page reloads.
 */
const initialState = {
  user: getUserFromStorage(),
  token: getTokenFromStorage(),
  isAuthenticated: !!getTokenFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      
      // Persist to local storage
      localStorage.setItem("userInfo", JSON.stringify(user));
      if (token) {
        localStorage.setItem("token", token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // Clear local storage
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("userInfo", JSON.stringify(state.user));
    }
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;

export default authSlice.reducer;
