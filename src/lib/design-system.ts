/**
 * 阿布吉300任務網站 — 設計系統 Token
 * 依據 docs/ui-design.md 建立
 */

export const colors = {
  // 品牌色
  brand: {
    blue: {
      DEFAULT: '#2563EB',
      dark: '#1D4ED8',
      light: '#3B82F6',
    },
  },
  // 功能色
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
  },
  // 中性色 - Light Mode
  neutral: {
    900: '#111827',
    700: '#374151',
    500: '#6B7280',
    300: '#D1D5DB',
    100: '#F3F4F6',
    50: '#F9FAFB',
  },
  // 中性色 - Dark Mode
  dark: {
    bg: '#0F172A',
    surface: '#1E293B',
    border: '#334155',
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
  },
} as const

export const typography = {
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
    mono: 'JetBrains Mono, "Fira Code", monospace',
  },
  fontSize: {
    display: {
      lg: { size: '48px', lineHeight: '1.2', fontWeight: '700' },
      md: { size: '36px', lineHeight: '1.25', fontWeight: '700' },
    },
    heading: {
      xl: { size: '30px', lineHeight: '1.3', fontWeight: '600' },
      lg: { size: '24px', lineHeight: '1.35', fontWeight: '600' },
      md: { size: '20px', lineHeight: '1.4', fontWeight: '600' },
    },
    body: {
      lg: { size: '18px', lineHeight: '1.6', fontWeight: '400' },
      md: { size: '16px', lineHeight: '1.6', fontWeight: '400' },
      sm: { size: '14px', lineHeight: '1.5', fontWeight: '400' },
    },
    caption: { size: '12px', lineHeight: '1.4', fontWeight: '500' },
  },
} as const

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const

export const borderRadius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const

export const shadows = {
  card: '0 1px 3px rgba(0, 0, 0, 0.1)',
  'card-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
  modal: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
} as const

export const transitions = {
  duration: {
    instant: '50ms',
    fast: '150ms',
    normal: '250ms',
    slow: '400ms',
    page: '500ms',
  },
  easing: {
    out: 'cubic-bezier(0.16, 1, 0.3, 1)',
    'in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

export const grid = {
  maxWidth: '1280px',
  columns: 12,
  gutter: '24px',
} as const

// Button Tokens
export const button = {
  primary: {
    bg: '#2563EB',
    'bg-hover': '#1D4ED8',
    text: '#FFFFFF',
  },
  secondary: {
    bg: '#FFFFFF',
    text: '#374151',
    border: '#D1D5DB',
  },
  ghost: {
    bg: 'transparent',
    text: '#374151',
  },
  danger: {
    bg: '#EF4444',
    text: '#FFFFFF',
  },
  sizes: {
    sm: { height: '32px', padding: '0 12px', fontSize: '14px', radius: '6px' },
    md: { height: '40px', padding: '0 16px', fontSize: '14px', radius: '8px' },
    lg: { height: '48px', padding: '0 24px', fontSize: '16px', radius: '8px' },
  },
} as const

// Input Tokens
export const input = {
  borderColor: '#D1D5DB',
  focusBorder: '#2563EB',
  focusRing: 'rgba(37, 99, 235, 0.2)',
  sizes: {
    sm: { height: '32px', padding: '0 10px', fontSize: '14px' },
    md: { height: '40px', padding: '0 12px', fontSize: '14px' },
    lg: { height: '48px', padding: '0 14px', fontSize: '16px' },
  },
} as const

// Card Tokens
export const card = {
  light: {
    bg: '#FFFFFF',
    border: '#E5E7EB',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    'hover-shadow': '0 4px 12px rgba(0, 0, 0, 0.15)',
    radius: '12px',
    padding: '20px',
  },
  dark: {
    bg: '#1E293B',
    border: '#334155',
  },
} as const

// 預設匯出完整設計系統
export const designSystem = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  grid,
  button,
  input,
  card,
} as const

export default designSystem
