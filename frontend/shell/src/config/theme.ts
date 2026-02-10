/**
 * Global Theme Configuration
 * Dark Mode Color Palette & Typography System
 */

export const colors = {
  // Primary Colors
  primary: {
    darkest: '#111F35', // Deep navy - main background
    dark: '#1a2942', // Slightly lighter navy
    medium: '#2a3d52', // Medium navy
    light: '#3a4d62', // Light navy
  },

  // Accent Colors
  accent: {
    purple: '#8A244B', // Deep purple
    pink: '#D02752', // Vibrant pink - primary CTA
    red: '#F63049', // Bright red - hover/active states
  },

  // Neutral Colors (for text & borders)
  neutral: {
    white: '#FFFFFF',
    light: '#F5F6F7',
    gray100: '#E8EAEC',
    gray200: '#D1D5DB',
    gray300: '#9CA3AF',
    gray400: '#6B7280',
    gray500: '#4B5563',
    dark: '#1F2937',
  },

  // Status Colors
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#F63049',
    info: '#3B82F6',
  },

  // Semantic Colors (for easy usage)
  semantic: {
    background: '#111F35',
    surface: '#1a2942',
    surfaceHover: '#2a3d52',
    text: {
      primary: '#F5F6F7',
      secondary: '#D1D5DB',
      tertiary: '#9CA3AF',
    },
    border: '#2a3d52',
    borderLight: '#3a4d62',
  },
} as const;

export const typography = {
  // Font Families
  fonts: {
    primary:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    mono: '"Fira Code", "Courier New", monospace',
  },

  // Font Sizes
  sizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
  },

  // Font Weights
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line Heights
  lineHeights: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0em',
    wide: '0.02em',
  },
} as const;

export const spacing = {
  0: '0',
  2: '2px',
  4: '4px',
  6: '6px',
  8: '8px',
  12: '12px',
  16: '16px',
  20: '20px',
  24: '24px',
  28: '28px',
  32: '32px',
  36: '36px',
  40: '40px',
  44: '44px',
  48: '48px',
  52: '52px',
  56: '56px',
  60: '60px',
  64: '64px',
  68: '68px',
  72: '72px',
  76: '76px',
  80: '80px',
} as const;

export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
  ultraWide: '1536px',
} as const;

export const shadows = {
  xs: '0 1px 2px rgba(0, 0, 0, 0.15)',
  sm: '0 2px 4px rgba(0, 0, 0, 0.15)',
  md: '0 4px 8px rgba(0, 0, 0, 0.15)',
  lg: '0 8px 16px rgba(0, 0, 0, 0.15)',
  xl: '0 12px 24px rgba(0, 0, 0, 0.2)',
  '2xl': '0 20px 32px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
} as const;

export const borderRadius = {
  none: '0',
  sm: '2px',
  base: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  '3xl': '20px',
  full: '9999px',
} as const;

export const transitions = {
  fast: '150ms ease-in-out',
  normal: '300ms ease-in-out',
  slow: '500ms ease-in-out',
} as const;

export const theme = {
  colors,
  typography,
  spacing,
  breakpoints,
  shadows,
  borderRadius,
  transitions,
} as const;

export type Theme = typeof theme;
