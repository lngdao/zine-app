import React, { memo } from 'react';
import { useTheme } from '@/shared/contexts/themeContext';
import { IconProps, IconSvgProps } from './IconSvg.type';
import { Touchable } from '../button';
import isEqual from 'react-fast-compare';
import { mScale } from '@/shared/utils/size';

const IconSvgComponent = (props: IconSvgProps<IconProps>) => {
  const { themeColors } = useTheme();

  const {
    width,
    height,
    color = themeColors.text.primary,
    source,
    size = 20,
    onPress,
    $buttonProps,
  } = props;
  const Icon = source;
  const scaledSize = mScale(size);

  return (
    <Touchable disabled={!onPress} onPress={onPress} {...$buttonProps}>
      <Icon
        width={width ?? scaledSize}
        height={height ?? scaledSize}
        style={{ color }}
      />
    </Touchable>
  );
};

export const IconSvg = memo(IconSvgComponent, isEqual);
