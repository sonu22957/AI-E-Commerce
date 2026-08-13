import axios from "axios";

/**
 * Axios Instance Setup
 * --------------------
 * Configures the base instance for API requests.
 * 1. Sets the default baseURL from environment variables or defaults to localhost.
 * 2. Attaches request interceptor to append JWT bearer tokens automatically.
 * 3. Handles global response errors (e.g., token expiration).
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Auth Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle unwrapping and Authentication Expiration (401)
axiosInstance.interceptors.response.use(
  (response) => {
    // Unwrap the ApiResponse structure from the backend
    // Only unwrap if a 'data' key is explicitly present (to avoid breaking
    // non-standard responses like the AI chat endpoint that return
    // reply/products/intent directly at the top level).
    if (
      response.data &&
      typeof response.data.success === 'boolean' &&
      response.data.success &&
      Object.prototype.hasOwnProperty.call(response.data, 'data')
    ) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear storage
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
      
      // Optionally trigger reload or dispatch actions depending on context
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
