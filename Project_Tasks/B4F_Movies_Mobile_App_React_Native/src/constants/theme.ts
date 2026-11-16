/**
 * ألوان ومسافات التطبيق — Cinema App theme.
 * التطبيق يظهر بالوضع الداكن دائماً (مظهر سينمائي).
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#14161B',
    background: '#F6F7F9',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E6E8ED',
    textSecondary: '#5B616E',
    border: '#E2E4E9',
    card: '#FFFFFF',
    primary: '#E50914',
    accent: '#F5C518',
    danger: '#E53935',
  },
  dark: {
    text: '#F2F3F5',
    background: '#0B0D12',
    backgroundElement: '#161922',
    backgroundSelected: '#242938',
    textSecondary: '#9BA1AC',
    border: '#242936',
    card: '#14171F',
    primary: '#E50914',
    accent: '#F5C518',
    danger: '#FF5252',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

/** المسافة أسفل المحتوى لتفادي شريط التبويبات السفلي */
export const BottomTabInset = Platform.select({ ios: 50, android: 80, web: 84 }) ?? 0;
export const MaxContentWidth = 800;
