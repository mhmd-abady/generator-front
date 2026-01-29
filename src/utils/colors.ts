// Color themes for the application
export const COLOR_THEMES = {
  TEAL_GOLD: {
    primary: "#008080",
    secondary: "#20b2aa",
    accent: "#fffacd",
    accentLight: "#ffffe0",
    dark: "#004d4d",
    darker: "#006666",
    text: "#fffacd",
    textSubtle: "#e0ffff",
    border: "#fffacd",
    placeholder: "#a0c8c8",
    labelText: "#c0e0e0",
    error: "#ff6b6b",
    disabled: "#4a7a7a",
    disabledText: "#a0c8c8",
  },
  BLACK_GOLD: {
    primary: "#0a0e27",
    secondary: "#1a0033",
    accent: "#d4af37",
    accentLight: "#ffd700",
    dark: "#1a1a2e",
    darker: "#16213e",
    text: "#d4af37",
    textSubtle: "#b8a6db",
    border: "#d4af37",
    placeholder: "#8a5ba6",
    labelText: "#b8a6db",
    error: "#ff6b6b",
    disabled: "#3d2d5c",
    disabledText: "#8a5ba6",
  },
} as const;

export type ColorTheme = keyof typeof COLOR_THEMES;
export type ColorThemeValues = typeof COLOR_THEMES[ColorTheme];

// Default theme
export const DEFAULT_THEME: ColorTheme = "TEAL_GOLD";
