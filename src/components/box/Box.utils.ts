/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { TextProps, TextStyle, ViewProps, ViewStyle } from 'react-native';
import { BoxProps, CustomStyleProps } from './Box.type';

const viewStyleKeys: Array<keyof ViewStyle> = [
  'alignContent',
  'alignItems',
  'alignSelf',
  'aspectRatio',
  'borderBottomWidth',
  'borderEndWidth',
  'borderLeftWidth',
  'borderRightWidth',
  'borderStartWidth',
  'borderTopWidth',
  'borderWidth',
  'bottom',
  'columnGap',
  'direction',
  'display',
  'end',
  'flex',
  'flexBasis',
  'flexDirection',
  'flexGrow',
  'flexShrink',
  'flexWrap',
  'gap',
  'height',
  'justifyContent',
  'left',
  'margin',
  'marginBottom',
  'marginEnd',
  'marginHorizontal',
  'marginLeft',
  'marginRight',
  'marginStart',
  'marginTop',
  'marginVertical',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'overflow',
  'padding',
  'paddingBottom',
  'paddingEnd',
  'paddingHorizontal',
  'paddingLeft',
  'paddingRight',
  'paddingStart',
  'paddingTop',
  'paddingVertical',
  'position',
  'right',
  'rowGap',
  'start',
  'top',
  'width',
  'zIndex',
  'shadowColor',
  'shadowOffset',
  'shadowOpacity',
  'shadowRadius',
  'transform',
  'backfaceVisibility',
  'backgroundColor',
  'borderBottomColor',
  'borderBottomEndRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'borderBottomStartRadius',
  'borderColor',
  'borderCurve',
  'borderEndColor',
  'borderEndEndRadius',
  'borderEndStartRadius',
  'borderLeftColor',
  'borderRadius',
  'borderRightColor',
  'borderStartColor',
  'borderStartEndRadius',
  'borderStartStartRadius',
  'borderStyle',
  'borderTopColor',
  'borderTopEndRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderTopStartRadius',
  'elevation',
  'opacity',
  'pointerEvents',
];

const textStyleKeys: Array<keyof TextStyle> = [
  ...viewStyleKeys,
  'color',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'includeFontPadding',
  'letterSpacing',
  'lineHeight',
  'textAlign',
  'textAlignVertical',
  'textDecorationColor',
  'textDecorationLine',
  'textDecorationStyle',
  'textShadowColor',
  'textShadowOffset',
  'textShadowRadius',
  'textTransform',
  'userSelect',
  'verticalAlign',
  'writingDirection',
];

type StyleMapper = (value: any) => ViewStyle | TextStyle;
type ShorthandMapping = {
  [K in keyof CustomStyleProps]?: keyof (ViewStyle & TextStyle) | StyleMapper;
};

const shorthandMap: ShorthandMapping = {
  m: 'margin',
  ml: 'marginLeft',
  mr: 'marginRight',
  mb: 'marginBottom',
  mt: 'marginTop',
  mx: 'marginHorizontal',
  my: 'marginVertical',
  p: 'padding',
  pl: 'paddingLeft',
  pr: 'paddingRight',
  pb: 'paddingBottom',
  pt: 'paddingTop',
  px: 'paddingHorizontal',
  py: 'paddingVertical',
  border: (value) => ({
    borderWidth: typeof value === 'boolean' ? (value ? 1 : 0) : Number(value),
  }),
  borderX: (value) => ({
    borderLeftWidth:
      typeof value === 'boolean' ? (value ? 1 : 0) : Number(value),
    borderRightWidth:
      typeof value === 'boolean' ? (value ? 1 : 0) : Number(value),
  }),
  borderY: (value) => ({
    borderTopWidth:
      typeof value === 'boolean' ? (value ? 1 : 0) : Number(value),
    borderBottomWidth:
      typeof value === 'boolean' ? (value ? 1 : 0) : Number(value),
  }),
  rounded: (value) => ({ borderRadius: value === 'full' ? 9999 : value }),
  w: 'width',
  wFit: (value) => ({ alignSelf: value ? 'center' : undefined }),
  wFull: (value) => ({ width: value ? '100%' : undefined }),
  h: 'height',
  hFull: (value) => ({ height: value ? '100%' : undefined }),
  minW: 'minWidth',
  minH: 'minHeight',
  maxW: 'maxWidth',
  maxH: 'maxHeight',
  size: (value) => ({ width: value, height: value }),
  flex: (value) => ({
    flex: typeof value === 'boolean' ? (value ? 1 : undefined) : value,
  }),
  row: (value) => ({ flexDirection: value ? 'row' : undefined }),
  rowReverse: (value) => ({ flexDirection: value ? 'row-reverse' : undefined }),
  colReverse: (value) => ({
    flexDirection: value ? 'column-reverse' : undefined,
  }),
  center: (value) =>
    value ? { alignItems: 'center', justifyContent: 'center' } : {},
  absolute: (value) => ({ position: value ? 'absolute' : undefined }),
  relative: (value) => ({ position: value ? 'relative' : undefined }),
  bg: 'backgroundColor',
  ratio: (value) => ({ aspectRatio: value === 'square' ? 1 : value }),
};

type PropsToStyleResolver<T extends 'view' | 'text'> = (
  props: BoxProps,
  target: T,
) => {
  style: T extends 'view' ? ViewStyle : TextStyle;
  restProps: T extends 'view' ? ViewProps : TextProps;
};

export const propsToStyleResolver = <T extends 'view' | 'text' = 'view'>(
  props: Parameters<PropsToStyleResolver<T>>[0],
  target: T = 'view' as T,
): ReturnType<PropsToStyleResolver<T>> => {
  const style: ViewStyle | TextStyle = {};
  let restProps: ViewProps | TextProps = {};
  const targetStyleKeys = target === 'view' ? viewStyleKeys : textStyleKeys;

  const { style: inputStyle, ...otherProps } = props;

  for (const key in otherProps) {
    if (Object.prototype.hasOwnProperty.call(otherProps, key)) {
      const value = otherProps[key as keyof typeof otherProps];
      const mapping = shorthandMap[key as keyof CustomStyleProps];

      if (mapping) {
        if (typeof mapping === 'function') {
          Object.assign(style, mapping(value));
        } else {
          // @ts-ignore
          style[mapping as keyof (ViewStyle & TextStyle)] = value;
        }
      } else if (
        targetStyleKeys.includes(key as keyof (ViewStyle & TextStyle))
      ) {
        // @ts-ignore
        style[key as keyof (ViewStyle & TextStyle)] = value;
      } else {
        restProps = { ...restProps, [key]: value };
      }
    }
  }

  if (inputStyle) {
    if (Array.isArray(inputStyle)) {
      inputStyle.forEach((s) => Object.assign(style, s));
    } else {
      Object.assign(style, inputStyle);
    }
  }

  const cleanRestProps = { ...restProps };
  delete cleanRestProps.style;
  return { style, restProps: cleanRestProps };
};
