import React, { useRef, useState } from 'react';
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
  TextStyle,
} from 'react-native';
import { Box } from '../box';
import { radius } from '@/shared/theme';
import { useTheme } from '@/shared/contexts/themeContext';
import { Text } from '../text';
import { Touchable } from '../button';
import { mergeRefs } from '@/shared/utils/common';
import { ControlledInputProps, InputProps } from './Input.type';
import { FieldValues, useController } from 'react-hook-form';
import { mScale } from '@/shared/utils/size';
import { useI18n } from '@/shared/hooks/useI18n';
import { AllTranslationKeys } from '@/shared/i18n';

const Input = React.forwardRef<TextInput, InputProps>((props, ref) => {
  const { themeColors } = useTheme();

  const {
    label,
    require,
    startIcon,
    endIcon,
    layout = 'horizontal',
    error,
    $wrapperProps,
    $containerProps,
    $labelProps,
    $errorProps,
    ...rest
  } = props;

  const [isFocus, setIsFocus] = useState(false);

  const inputRef = useRef<TextInput>(null);

  const isHorizontalLayout = (() => {
    if (startIcon && label) {
      return false;
    }

    return layout === 'horizontal';
  })();

  const borderColor = (() => {
    if (error) {
      return themeColors.state.error;
    } else if (isFocus) {
      return themeColors.state.active;
    } else {
      return themeColors.border;
    }
  })();

  const labelColor = (() => {
    if (error) {
      return themeColors.state.error;
    } else if (isFocus) {
      return themeColors.state.active;
    } else {
      return themeColors.text.secondary;
    }
  })();

  const inputStyle: TextStyle = {
    color: themeColors.text.secondary,
    flex: 1,
    fontSize: mScale(14),
  };

  const ErrorMsg = (() => {
    if (error && typeof error === 'string') {
      return (
        <Text size={12} mt={8} color={themeColors.state.error} {...$errorProps}>
          {error}
        </Text>
      );
    }

    return null;
  })();

  const handleOnInputFocus = (
    e: NativeSyntheticEvent<TextInputFocusEventData>,
  ) => {
    setIsFocus(true);
    rest.onFocus && rest.onFocus(e);
  };

  const handleOnInputBlur = (
    e: NativeSyntheticEvent<TextInputFocusEventData>,
  ) => {
    setIsFocus(false);
    rest.onBlur && rest.onBlur(e);
  };

  const handleOnWrapperPress = (e: GestureResponderEvent) => {
    inputRef.current?.focus();
    $containerProps?.onPress && $containerProps.onPress(e);
  };

  return (
    <Touchable
      p={10}
      disableFeedback
      rounded={radius.xs}
      borderWidth={1}
      borderColor={borderColor}
      {...$containerProps}
      onPress={handleOnWrapperPress}
    >
      <Box
        row={isHorizontalLayout}
        alignItems={isHorizontalLayout ? 'center' : 'baseline'}
        gap={8}
        overflow="hidden"
        {...$wrapperProps}
      >
        {label && (
          <Text color={labelColor} size={15} numberOfLines={1} {...$labelProps}>
            {label}
            {require ? '*' : ''}
          </Text>
        )}
        <Box.Row flex center gap={8}>
          {startIcon && startIcon(labelColor)}
          <TextInput
            ref={mergeRefs([inputRef, ref])}
            placeholderTextColor={themeColors.placeholder}
            style={inputStyle}
            {...rest}
            onFocus={handleOnInputFocus}
            onBlur={handleOnInputBlur}
          />
          {endIcon && endIcon(labelColor)}
        </Box.Row>
      </Box>
      {ErrorMsg}
    </Touchable>
  );
});

const ControlledInput = <T extends FieldValues>(
  props: ControlledInputProps<T>,
) => {
  const { name, control, rules, ...inputProps } = props;

  const { t } = useI18n();
  const { field, fieldState } = useController({ control, name, rules });

  return (
    <Input
      ref={field.ref}
      onChangeText={field.onChange}
      value={(field.value as string) || ''}
      error={
        t(fieldState.error?.message as AllTranslationKeys) ||
        fieldState.error?.message
      }
      {...inputProps}
    />
  );
};

export { Input, ControlledInput };
