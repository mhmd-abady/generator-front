import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { COLOR_THEMES, DEFAULT_THEME, type ColorTheme, type ColorThemeValues } from "../utils/colors";

interface ThemeContextType {
  colors: ColorThemeValues;
  theme: ColorTheme;
  switchTheme: (newTheme: ColorTheme) => void;
  toggleTheme: () => void;
  // Professional styling utilities
  getResponsiveSpacing: (base: number) => { xs: number; sm: number; md: number; lg: number; xl: number };
  getResponsiveFontSize: (base: string) => { xs: string; sm: string; md: string; lg: string; xl: string };
  getGradient: (direction?: string) => string;
  getShadow: (intensity?: 'light' | 'medium' | 'strong') => string;
  getBorderRadius: (size?: 'small' | 'medium' | 'large') => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ColorTheme>(() => {
    const savedTheme = localStorage.getItem("appTheme") as ColorTheme;
    return savedTheme || DEFAULT_THEME;
  });

  const colors: ColorThemeValues = COLOR_THEMES[theme];

  const switchTheme = useCallback((newTheme: ColorTheme) => {
    setTheme(newTheme);
    localStorage.setItem("appTheme", newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme: ColorTheme = theme === "TEAL_GOLD" ? "BLACK_GOLD" : "TEAL_GOLD";
    switchTheme(newTheme);
  }, [theme, switchTheme]);

  // Professional styling utilities
  const getResponsiveSpacing = useCallback((base: number) => ({
    xs: base * 0.5,
    sm: base * 0.75,
    md: base,
    lg: base * 1.25,
    xl: base * 1.5,
  }), []);

  const getResponsiveFontSize = useCallback((base: string) => ({
    xs: `calc(${base} * 0.8)`,
    sm: `calc(${base} * 0.9)`,
    md: base,
    lg: `calc(${base} * 1.1)`,
    xl: `calc(${base} * 1.2)`,
  }), []);

  const getGradient = useCallback((direction: string = '135deg') => 
    `linear-gradient(${direction}, ${colors.primary} 0%, ${colors.secondary} 100%)`, [colors]);

  const getShadow = useCallback((intensity: 'light' | 'medium' | 'strong' = 'medium') => {
    const shadows = {
      light: `0 2px 8px ${colors.primary}20`,
      medium: `0 4px 16px ${colors.primary}30`,
      strong: `0 8px 32px ${colors.primary}40`,
    };
    return shadows[intensity];
  }, [colors]);

  const getBorderRadius = useCallback((size: 'small' | 'medium' | 'large' = 'medium') => {
    const radii = {
      small: '6px',
      medium: '12px',
      large: '20px',
    };
    return radii[size];
  }, []);

  useEffect(() => {
    // Apply theme to body or root for global styles if needed
    document.body.style.color = colors.text;
    document.body.style.background = `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.secondary}05 100%)`;
  }, [colors]);

  return (
    <ThemeContext.Provider value={{ 
      colors, 
      theme, 
      switchTheme, 
      toggleTheme,
      getResponsiveSpacing,
      getResponsiveFontSize,
      getGradient,
      getShadow,
      getBorderRadius,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};