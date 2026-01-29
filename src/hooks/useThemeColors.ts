import { useTheme as useThemeContext } from "../context/ThemeContext";

// Re-export the theme hook from context for backward compatibility
export const useTheme = useThemeContext;
