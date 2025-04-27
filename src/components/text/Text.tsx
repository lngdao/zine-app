import React, { forwardRef } from 'react';
import { Text as RNText, TextStyle } from 'react-native';
import { useTheme } from '@/shared/contexts/themeContext';
import { useI18n } from '@/shared/hooks/useI18n';
import { TextProps } from './Text.type';
import { propsToStyleResolver } from '../box';
import { mScale } from '@/shared/utils/size';
import Animated from 'react-native-reanimated';

const fonts = {
  inter: {
    thin: 'Inter-Thin',
    extraLight: 'Inter-ExtraLight',
    light: 'Inter-Light',
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    extraBold: 'Inter-ExtraBold',
    black: 'Inter-Black',
  },
};

const Text = forwardRef<RNText, TextProps>((props, ref) => {
  const { themeColors } = useTheme();
  const { t: translate } = useI18n();

  const {
    t,
    size = 14,
    color = '#FFFFFF',
    font = fonts.inter.regular,
    transform,
    children,
    ...rest
  } = props;

  const { restProps, style: textStyle } = propsToStyleResolver(rest, 'text');

  const style: TextStyle = {
    fontSize: mScale(size),
    fontFamily: font,
    color,
    textTransform: transform,
  };

  const translation = children ? children : t ? translate(t) : '';

  return (
    <RNText
      ref={ref}
      {...restProps}
      style={[style, textStyle, restProps.style]}
    >
      {translation}
    </RNText>
  );
});

const TextAnimated = Animated.createAnimatedComponent(Text);

export default Object.assign(Text, { fonts, Animated: TextAnimated });
