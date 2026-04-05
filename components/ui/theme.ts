export const darkColors = {
  primary: '#e63946',
  primaryDark: '#c1121f',
  secondary: '#1a1a2e',
  secondaryLight: '#16213e',
  accent: '#f77f00',
  background: '#0f0f1a',
  surface: '#1a1a2e',
  surfaceLight: '#252547',
  text: '#ffffff',
  textSecondary: '#a0a0b8',
  textMuted: '#6c6c80',
  success: '#06d6a0',
  warning: '#ffd166',
  error: '#ef476f',
  border: '#2a2a4a',
  inputBackground: '#1e1e3a',
};

export const lightColors = {
  primary: '#e63946',
  primaryDark: '#c1121f',
  secondary: '#f5f5f7',
  secondaryLight: '#e8e8ed',
  accent: '#f77f00',
  background: '#ffffff',
  surface: '#f5f5f7',
  surfaceLight: '#e8e8ed',
  text: '#1a1a2e',
  textSecondary: '#555570',
  textMuted: '#8888a0',
  success: '#06d6a0',
  warning: '#f59e0b',
  error: '#ef476f',
  border: '#dddde5',
  inputBackground: '#f0f0f5',
};

// Default to dark - this gets swapped by the theme context
export let colors = darkColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  hero: 40,
};

export const gradients = {
  primary: ['#e63946', '#c1121f'],
  accent: ['#f77f00', '#e36414'],
  success: ['#06d6a0', '#05b384'],
  card: ['#1e1e3a', '#252547'],
  cardBorder: ['#e63946', '#f77f00'],
  premium: ['#e63946', '#f77f00', '#ffd166'],
  dark: ['#1a1a2e', '#0f0f1a'],
  headerBg: ['#1a1a2e', '#0f0f1a'],
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  }),
};
