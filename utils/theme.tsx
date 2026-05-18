import React, { createContext, useContext, useState } from "react";

type Theme = {
  dark: boolean;
  colors: {
    background: string;
    card: string;
    text: string;
    subtext: string;
    border: string;
    primary: string;
    header: string;
    input: string;
    placeholder: string;
  };
};

const lightTheme: Theme = {
  dark: false,
  colors: {
    background: "#f0f4f0",
    card: "#ffffff",
    text: "#1a1a1a",
    subtext: "#666666",
    border: "#eeeeee",
    primary: "#2ecc71",
    header: "#27ae60",
    input: "#f9f9f9",
    placeholder: "#999999",
  },
};

const darkTheme: Theme = {
  dark: true,
  colors: {
    background: "#0a0a0a",
    card: "#1a1a1a",
    text: "#ffffff",
    subtext: "#aaaaaa",
    border: "#333333",
    primary: "#2ecc71",
    header: "#1a1a1a",
    input: "#2a2a2a",
    placeholder: "#666666",
  },
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider
      value={{ theme: isDark ? darkTheme : lightTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
