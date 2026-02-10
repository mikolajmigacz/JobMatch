import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

const GlobalStyles = createGlobalStyle`
  /* ============================================
     RESET & BASE STYLES
     ============================================ */
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${theme.typography.fonts.primary};
    font-size: ${theme.typography.sizes.base};
    font-weight: ${theme.typography.weights.normal};
    line-height: ${theme.typography.lineHeights.normal};
    color: ${theme.colors.semantic.text.primary};
    background-color: ${theme.colors.semantic.background};
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    transition: background-color ${theme.transitions.normal};
  }

  /* ============================================
     TYPOGRAPHY
     ============================================ */

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: ${theme.typography.weights.bold};
    line-height: ${theme.typography.lineHeights.tight};
    margin: 0;
    color: ${theme.colors.semantic.text.primary};
  }

  h1 {
    font-size: ${theme.typography.sizes['5xl']};
    letter-spacing: ${theme.typography.letterSpacing.tight};
    
    @media (max-width: ${theme.breakpoints.tablet}) {
      font-size: ${theme.typography.sizes['4xl']};
    }
  }

  h2 {
    font-size: ${theme.typography.sizes['4xl']};
    letter-spacing: ${theme.typography.letterSpacing.tight};
    
    @media (max-width: ${theme.breakpoints.tablet}) {
      font-size: ${theme.typography.sizes['3xl']};
    }
  }

  h3 {
    font-size: ${theme.typography.sizes['3xl']};
    letter-spacing: ${theme.typography.letterSpacing.tight};
    
    @media (max-width: ${theme.breakpoints.tablet}) {
      font-size: ${theme.typography.sizes['2xl']};
    }
  }

  h4 {
    font-size: ${theme.typography.sizes['2xl']};
    
    @media (max-width: ${theme.breakpoints.tablet}) {
      font-size: ${theme.typography.sizes.xl};
    }
  }

  h5 {
    font-size: ${theme.typography.sizes.xl};
  }

  h6 {
    font-size: ${theme.typography.sizes.lg};
  }

  p {
    margin: 0;
    color: ${theme.colors.semantic.text.primary};
  }

  /* ============================================
     LINKS & INTERACTIVE
     ============================================ */

  a {
    color: ${theme.colors.accent.pink};
    text-decoration: none;
    cursor: pointer;
    transition: color ${theme.transitions.fast};

    &:hover {
      color: ${theme.colors.accent.red};
      text-decoration: underline;
    }

    &:active {
      color: ${theme.colors.accent.purple};
    }

    &:focus-visible {
      outline: 2px solid ${theme.colors.accent.pink};
      outline-offset: 2px;
      border-radius: ${theme.borderRadius.sm};
    }
  }

  button {
    font-family: ${theme.typography.fonts.primary};
    cursor: pointer;
    border: none;
    background: none;
    transition: all ${theme.transitions.fast};

    &:focus-visible {
      outline: 2px solid ${theme.colors.accent.pink};
      outline-offset: 2px;
      border-radius: ${theme.borderRadius.md};
    }
  }

  input,
  textarea,
  select {
    font-family: ${theme.typography.fonts.primary};
    font-size: ${theme.typography.sizes.base};
    color: ${theme.colors.semantic.text.primary};
    background-color: ${theme.colors.semantic.surface};
    border: 1px solid ${theme.colors.semantic.border};
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing[8]} ${theme.spacing[12]};
    transition: all ${theme.transitions.fast};

    &:hover {
      border-color: ${theme.colors.semantic.borderLight};
    }

    &:focus {
      outline: none;
      border-color: ${theme.colors.accent.pink};
      box-shadow: 0 0 0 3px rgba(208, 39, 82, 0.1);
    }

    &::placeholder {
      color: ${theme.colors.semantic.text.tertiary};
    }

    /* Dark mode specific */
    &:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 30px ${theme.colors.semantic.surface} inset !important;
      -webkit-text-fill-color: ${theme.colors.semantic.text.primary} !important;
    }
  }

  /* ============================================
     LISTS
     ============================================ */

  ul,
  ol {
    color: ${theme.colors.semantic.text.primary};
  }

  li {
    color: ${theme.colors.semantic.text.primary};
  }

  /* ============================================
     SCROLLBAR (for webkit browsers)
     ============================================ */

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.semantic.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.semantic.borderLight};
    border-radius: ${theme.borderRadius.full};
    transition: background ${theme.transitions.fast};

    &:hover {
      background: ${theme.colors.accent.purple};
    }
  }

  /* ============================================
     SELECTION
     ============================================ */

  ::selection {
    background-color: ${theme.colors.accent.pink};
    color: ${theme.colors.semantic.text.primary};
  }

  ::-moz-selection {
    background-color: ${theme.colors.accent.pink};
    color: ${theme.colors.semantic.text.primary};
  }

  /* ============================================
     BREAKPOINT UTILITIES
     ============================================ */

  @media (max-width: ${theme.breakpoints.tablet}) {
    html {
      font-size: 14px;
    }

    body {
      font-size: ${theme.typography.sizes.sm};
    }
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    html {
      font-size: 13px;
    }
  }
`;

export default GlobalStyles;
