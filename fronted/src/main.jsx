import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./redux/store";
import "./index.css";

/**
 * Main Application Entry Point
 * -----------------------------
 * Mounts the React application to the DOM root element.
 * Wraps the top-level App component in the Redux Provider to make the store globally accessible.
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
