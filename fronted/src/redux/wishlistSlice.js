import { createSlice } from "@reduxjs/toolkit";

const getWishlistFromStorage = () => {
  try {
    const wishlist = localStorage.getItem("wishlist");
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error("Error parsing wishlist from localStorage", error);
    return [];
  }
};

const initialState = {
  wishlistItems: getWishlistFromStorage(),
  loading: false,
  error: null,
};

/**
 * wishlistSlice
 * -------------
 * Redux Toolkit slice for managing the customer's wishlist.
 * Syncs the wishlist state with localStorage.
 */
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    wishlistFetchRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    wishlistFetchSuccess: (state, action) => {
      state.loading = false;
      state.wishlistItems = action.payload;
      localStorage.setItem("wishlist", JSON.stringify(state.wishlistItems));
    },
    wishlistFetchFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addToWishlist: (state, action) => {
      const item = action.payload;
      const existItem = state.wishlistItems.find((x) => (x._id || x.id) === (item._id || item.id));

      if (!existItem) {
        state.wishlistItems.push(item);
      }
      localStorage.setItem("wishlist", JSON.stringify(state.wishlistItems));
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.wishlistItems = state.wishlistItems.filter(
        (x) => (x._id || x.id) !== productId
      );
      localStorage.setItem("wishlist", JSON.stringify(state.wishlistItems));
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
      localStorage.removeItem("wishlist");
    },
  },
});

export const {
  wishlistFetchRequest,
  wishlistFetchSuccess,
  wishlistFetchFail,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
