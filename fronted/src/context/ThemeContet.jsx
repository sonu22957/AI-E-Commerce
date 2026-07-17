import React, { createContext, useState, useEffect, useMemo } from "react";

/**
 * ThemeContext – provides a simple dark/light mode toggle for the entire app.
 * It stores the user's preference in localStorage so the choice persists across
 * page reloads. The context exposes:
 *   - theme: 'light' | 'dark'
 *   - toggleTheme: () => void
 *   - setTheme: (t: 'light' | 'dark') => void
 */
export const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
  setTheme: (t) => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Initialise from localStorage or system preference
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // Update HTML root class and persist
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const contextValue = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};
