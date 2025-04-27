import { TextStyle, type TextProps as RNTextProps } from 'react-native';
import { AllTranslationKeys } from '@/shared/i18n';
import { BoxProps } from '../box';

export interface TextProps
  extends RNTextProps,
    TextStyle,
    Omit<BoxProps, 'flex' | 'style'> {
  size?: number;
  font?: string;
  color?: string;
  t?: AllTranslationKeys;
  transform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
}
