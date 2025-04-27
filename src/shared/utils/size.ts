// Base on https://github.com/nirsky/react-native-size-matters/blob/master/lib/scaling-utils.js
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

export const scale = (size: number) =>
  (shortDimension / guidelineBaseWidth) * size + 0.0001;
export const vScale = (size: number) =>
  (longDimension / guidelineBaseHeight) * size + 0.0001;

export const mScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;
export const mvScale = (size: number, factor = 0.5) =>
  size + (vScale(size) - size) * factor;
