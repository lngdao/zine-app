import { TouchableOpacityProps } from 'react-native';
import { BoxProps } from '../box';
import { TextProps } from '../text';

export enum ButtonSizes {
  XS = 'XS',
  SM = 'SM',
  MD = 'MD',
  LG = 'LG',
}

export enum ButtonVariants {
  GHOST = 'GHOST',
  FLAT = 'FLAT',
  OUTLINE = 'OUTLINE',
  DANGER = 'DANGER',
}

export interface TouchableProps
  extends Omit<BoxProps, 'hitSlop' | 'size'>,
    TouchableOpacityProps {
  disableFeedback?: boolean;
}

export interface ButtonProps extends Omit<TouchableProps, 'children'> {
  size?: ButtonSizes;
  variant?: ButtonVariants;
  $textProps?: TextProps;
  children?:
    | string
    | React.ReactNode
    | ((contentColor: string) => React.ReactNode);
}
