import { ScrollViewProps } from 'react-native';
import { BoxProps } from '../box';

export interface ScreenShellProps<T extends boolean> {
  header?: React.ReactNode;
  bgColor?: string;
  scrollable?: T;
  renderScrollComponent?: (props: ScrollViewProps) => React.ReactNode;
  error?: Error | boolean | string;
  loading?: boolean;
  noData?: boolean;
  $wrapperProps?: BoxProps;
  $containerProps?: T extends true ? ScrollViewProps : BoxProps;
}
