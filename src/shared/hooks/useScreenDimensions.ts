import { useWindowDimensions } from 'react-native';
import { useScreenOrientation } from './useScreenOrientation';

const useScreenDimensions = () => {
  const { width, height } = useWindowDimensions();

  let actualWidth = width;
  let actualHeight = height;

  const { isLandscape } = useScreenOrientation();

  if (isLandscape) {
    if (actualWidth < actualHeight) {
      actualWidth = height;
      actualHeight = width;
    }
  } else {
    if (actualWidth > actualHeight) {
      actualWidth = height;
      actualHeight = width;
    }
  }

  return {
    screenWidth: actualWidth,
    screenHeight: actualHeight,
  };
};

export default useScreenDimensions;
