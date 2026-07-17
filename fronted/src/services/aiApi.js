import axiosInstance from "./axios";

/**
 * AI API Service
 * --------------
 * Provides API integrations for various AI features including:
 * 1. Chatbot messages
 * 2. Personalized recommendations
 * 3. Review summaries
 * 4. Smart search queries
 */
export const sendChatMessage = async (message, chatHistory = []) => {
  try {
    const response = await axiosInstance.post("/api/ai/chat", {
      message,
      history: chatHistory,
    });
    return response.data;
  } catch (error) {
    console.error("AI Chat API error:", error);
    throw error;
  }
};

export const getAIRecommendations = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/ai/recommendations?userId=${userId || ""}`);
    return response.data;
  } catch (error) {
    console.error("AI Recommendations API error:", error);
    throw error;
  }
};

export const getProductReviewSummary = async (productId) => {
  try {
    const response = await axiosInstance.get(`/api/ai/reviews-summary/${productId}`);
    return response.data;
  } catch (error) {
    console.error("AI Reviews Summary API error:", error);
    throw error;
  }
};

export const performAISmartSearch = async (query) => {
  try {
    const response = await axiosInstance.post("/api/ai/search", { query });
    return response.data;
  } catch (error) {
    console.error("AI Smart Search API error:", error);
    throw error;
  }
};

const aiApi = {
  sendChatMessage,
  getAIRecommendations,
  getProductReviewSummary,
  performAISmartSearch,
};

export default aiApi;
