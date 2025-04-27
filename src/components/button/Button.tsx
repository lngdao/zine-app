import React, { forwardRef, useState } from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { propsToStyleResolver } from '../box';
import {
  ButtonProps,
  ButtonSizes,
  ButtonVariants,
  TouchableProps,
} from './Button.type';
import { radius } from '@/shared/theme';
import { useTheme } from '@/shared/contexts/themeContext';
import { buttonStyles } from './Button.style';
import { Text } from '../text';
import Animated from 'react-native-reanimated';

const TouchableComponent = forwardRef<View, TouchableProps>(
  ({ children, disableFeedback, ...rest }, ref) => {
    const { restProps, style } = propsToStyleResolver(rest);

    return (
      <TouchableOpacity
        ref={ref}
        activeOpacity={disableFeedback ? 1 : undefined}
        {...restProps}
        style={[style, restProps.style]}
      >
        {children}
      </TouchableOpacity>
    );
  },
);

const ButtonComponent = forwardRef<View, ButtonProps>((props, ref) => {
  const {
    children,
    disabled,
    size = ButtonSizes.MD,
    variant = ButtonVariants.FLAT,
    $textProps,
    ...rest
  } = props;

  const { themeColors } = useTheme();
  const [isPressIn, setIsPressIn] = useState(false);

  const { disabled_style, press_in, sizeStyle, variantStyle } = buttonStyles(
    themeColors,
    variant,
    size,
  );

  const Children = (() => {
    if (
      typeof children === 'string' ||
      (typeof children === 'undefined' && $textProps?.t)
    ) {
      return (
        <Text color={themeColors.button.content} {...$textProps}>
          {children}
        </Text>
      );
    } else if (typeof children === 'function') {
      return children(themeColors.button.content);
    } else {
      return children;
    }
  })();

  const handleOnPressIn = (e: GestureResponderEvent) => {
    setIsPressIn(true);
    rest.onPressIn && rest.onPressIn(e);
  };

  const handleOnPressOut = (e: GestureResponderEvent) => {
    setIsPressIn(false);
    rest.onPressOut && rest.onPressOut(e);
  };

  const pressInStyle = (() => {
    if (isPressIn) {
      return press_in;
    } else {
      return {};
    }
  })();

  const disabledStyle = (() => {
    if (disabled) {
      return disabled_style;
    } else {
      return {};
    }
  })();

  const styleProps = StyleSheet.flatten([
    sizeStyle,
    variantStyle,
    pressInStyle,
    rest.style,
    disabledStyle,
  ]);

  return (
    <Touchable
      ref={ref}
      wFit
      center
      disabled={disabled}
      rounded={radius.xs}
      {...styleProps}
      {...rest}
      onPressIn={handleOnPressIn}
      onPressOut={handleOnPressOut}
    >
      {Children}
    </Touchable>
  );
});

const TouchableAnimated = Animated.createAnimatedComponent(TouchableComponent);
const ButtonAnimated = Animated.createAnimatedComponent(ButtonComponent);

const Touchable = Object.assign(TouchableComponent, {
  Animated: TouchableAnimated,
});

const Button = Object.assign(ButtonComponent, {
  Sizes: ButtonSizes,
  Variants: ButtonVariants,
  Animated: ButtonAnimated,
});

export { Touchable, Button };
