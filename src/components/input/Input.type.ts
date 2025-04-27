import { TextInputProps } from 'react-native';
import { TouchableProps } from '../button';
import { BoxProps } from '../box';
import { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { TextProps } from '../text';

export interface InputProps extends TextInputProps {
  label?: string;
  require?: boolean;
  startIcon?: (color: string) => React.ReactNode;
  endIcon?: (color: string) => React.ReactNode;
  error?: boolean | string;
  layout?: 'horizontal' | 'vertical';
  $containerProps?: TouchableProps;
  $wrapperProps?: BoxProps;
  $labelProps?: TextProps;
  $errorProps?: TextProps;
}

type TRule = Omit<
  RegisterOptions,
  'valueAsNumber' | 'valueAsDate' | 'setValueAs'
>;

export type InputControllerType<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: TRule;
};

export interface ControlledInputProps<T extends FieldValues>
  extends InputProps,
    InputControllerType<T> {}
