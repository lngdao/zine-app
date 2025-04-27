import React from 'react';
import { View } from 'react-native';
import { BoxProps } from './Box.type';
import { propsToStyleResolver } from './Box.utils';
import Animated from 'react-native-reanimated';
import { useTheme } from '@/shared/contexts/themeContext';

const Box = React.forwardRef<View, BoxProps>(({ children, ...rest }, ref) => {
  const { restProps, style } = propsToStyleResolver(rest);

  return (
    <View ref={ref} {...restProps} style={[style, restProps.style]}>
      {children}
    </View>
  );
});

const Row = ({ children, ...rest }: BoxProps) => {
  return (
    <Box row {...rest}>
      {children}
    </Box>
  );
};

const AnimatedComponent = Animated.createAnimatedComponent(Box);
const Separator = () => {
  const { themeColors } = useTheme();

  return <Box wFull h={1} backgroundColor={themeColors.separator} />;
};

export default Object.assign(Box, {
  Row,
  Animated: AnimatedComponent,
  Separator,
});
