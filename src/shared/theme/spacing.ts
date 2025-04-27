import { mScale, mvScale } from '../utils/size';

export const spacing = {
  xxxs: 2,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  scale: (n: number) => mScale(n),
  vScale: (n: number) => mvScale(n),
} as const;
