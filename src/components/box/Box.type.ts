import { TextStyle, ViewProps, ViewStyle } from 'react-native';

export interface CustomStyleProps {
  m?: ViewStyle['margin'];
  ml?: ViewStyle['marginLeft'];
  mr?: ViewStyle['marginRight'];
  mb?: ViewStyle['marginBottom'];
  mt?: ViewStyle['marginTop'];
  mx?: ViewStyle['marginHorizontal'];
  my?: ViewStyle['marginVertical'];
  p?: ViewStyle['padding'];
  pl?: ViewStyle['paddingLeft'];
  pr?: ViewStyle['paddingRight'];
  pb?: ViewStyle['paddingBottom'];
  pt?: ViewStyle['paddingTop'];
  px?: ViewStyle['paddingHorizontal'];
  py?: ViewStyle['paddingVertical'];
  border?: boolean | number;
  borderX?: boolean | number;
  borderY?: boolean | number;
  rounded?: number | 'full';
  w?: ViewStyle['width'];
  wFit?: boolean;
  wFull?: boolean;
  h?: ViewStyle['height'];
  hFull?: boolean;
  minW?: ViewStyle['minWidth'];
  minH?: ViewStyle['minHeight'];
  maxW?: ViewStyle['maxWidth'];
  maxH?: ViewStyle['maxHeight'];
  size?: number;
  flex?: boolean | number;
  row?: boolean;
  rowReverse?: boolean;
  colReverse?: boolean;
  center?: boolean;
  absolute?: boolean;
  relative?: boolean;
  bg?: ViewStyle['backgroundColor'];
  ratio?: number | 'square';
}

export interface BoxProps
  extends CustomStyleProps,
    Omit<ViewStyle, 'flex'>,
    Omit<TextStyle, 'flex'>,
    ViewProps {}
