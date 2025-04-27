import { ButtonProps } from '../button';

export interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  style?: unknown;
}

export interface IconSvgProps<T> extends IconProps {
  source: React.ComponentType<T>;
  size?: number;
  $buttonProps?: Omit<ButtonProps, 'onPress'>;
  onPress?: TFunction;
}
