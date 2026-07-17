import { createSlice } from "@reduxjs/toolkit";

/**
 * aiSlice
 * -------
 * Redux Toolkit slice for managing the state of AI features.
 * Includes state for the AI chatbot's conversation history and loading indicators,
 * as well as cached AI recommendations to prevent unnecessary API calls.
 */
const initialState = {
  chatHistory: [
    {
      sender: "ai",
      text: "Hello! I'm your AI shopping assistant. How can I help you find the perfect product today?",
      timestamp: new Date().toISOString(),
    }
  ],
  isTyping: false,
  recommendations: [],
  recommendationsLoading: false,
  error: null,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    // Chatbot actions
    addMessage: (state, action) => {
      state.chatHistory.push({
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    clearChatHistory: (state) => {
      state.chatHistory = initialState.chatHistory;
    },

    // Recommendations actions
    setRecommendationsLoading: (state, action) => {
      state.recommendationsLoading = action.payload;
    },
    setRecommendations: (state, action) => {
      state.recommendations = action.payload;
      state.error = null;
      state.recommendationsLoading = false;
    },
    setAiError: (state, action) => {
      state.error = action.payload;
      state.recommendationsLoading = false;
      state.isTyping = false;
    },
  },
});

export const {
  addMessage,
  setTyping,
  clearChatHistory,
  setRecommendationsLoading,
  setRecommendations,
  setAiError,
} = aiSlice.actions;

export default aiSlice.reducer;
