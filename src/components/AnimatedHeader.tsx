import { Platform, StatusBar, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import Animated, {
  Extrapolate,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { BlurView } from '@react-native-community/blur';
import { Text, TextProps } from './text';
import { Box } from './box';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Touchable } from './button';
import Monicon from '@monicon/native';
import { navigationHelper } from '@/shared/utils/navigationHelper';
import { isIpad, isIphoneX } from '@/config';
import { useScreenOrientation } from '@/shared/hooks/useScreenOrientation';
import { isIos, rgba } from '@/shared/utils/common';
import DeviceInfo from 'react-native-device-info';

const ANIMATED_HEADER_HEIGHT =
  Platform.OS === 'ios'
    ? isIphoneX
      ? 90
      : 60
    : DeviceInfo.hasNotch()
      ? 90
      : 40;

const ANIMATED_HEADER_CONTENT_HEIGHT = (() => {
  if (isIos) {
    if (isIphoneX) return 40;
    return 50;
  } else {
    return 50;
  }
})();

export const useAnimatedHeaderHeight = () => {
  const { isLandscape } = useScreenOrientation();

  if (isIos) {
    if (isLandscape) {
      return 60;
    } else {
      if (isIphoneX) return 90;
      else if (isIpad()) return 90;
      else return 60;
    }
  } else {
    // if (DeviceInfo.hasNotch()) {
    //   return 90;
    // }
    // return 60;
    return ANIMATED_HEADER_CONTENT_HEIGHT + (StatusBar?.currentHeight || 0);
  }
};

const AnimatedLargeTitle = ({
  scrollOffset,
  title,
  ...textProps
}: {
  scrollOffset: SharedValue<number>;
  title: string;
} & TextProps) => {
  const largeTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [0, 30],
      [1, 0],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
    };
  });

  return (
    <Text.Animated
      size={34}
      ml={15}
      fontFamily={Text.fonts.inter.bold}
      style={largeTitleStyle}
      numberOfLines={1}
      {...textProps}
    >
      {title}
    </Text.Animated>
  );
};

const AnimatedSubTitle = ({
  scrollOffset,
  title,
  ...textProps
}: {
  scrollOffset: SharedValue<number>;
  title: string;
} & TextProps) => {
  const largeTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [0, 30],
      [1, 0],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
    };
  });

  return (
    <Text.Animated
      size={30}
      ml={15}
      fontFamily={Text.fonts.inter.bold}
      style={largeTitleStyle}
      numberOfLines={1}
      {...textProps}
    >
      {title}
    </Text.Animated>
  );
};

const AnimatedHeader = ({
  scrollOffset,
  title,
  showBack = false,
  backTitle,
  rightComponent,
  range = 100,
}: {
  scrollOffset: SharedValue<number>;
  title: string;
  showBack?: boolean;
  backTitle?: string;
  rightComponent?: React.ReactNode;
  range?: number;
}) => {
  const { top: topInset } = useSafeAreaInsets();
  const animatedHeaderHeight = useAnimatedHeaderHeight();

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [0, range],
      [0, 1],
      Extrapolation.CLAMP,
    );

    const zIndex = interpolate(
      scrollOffset.value,
      [0, 30],
      [5, 11],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      zIndex,
    };
  });

  const backTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [0, 30],
      [1, 0],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
    };
  });

  return (
    <Box style={styles.header} zIndex={20}>
      {showBack && (
        <Box style={styles.header} zIndex={10}>
          <Box h={animatedHeaderHeight - ANIMATED_HEADER_CONTENT_HEIGHT} />
          <Box h={ANIMATED_HEADER_CONTENT_HEIGHT} row>
            <Box
              flex
              row
              alignItems="center"
              justifyContent="space-between"
              gap={50}
            >
              <Touchable
                onPress={() => navigationHelper.goBack()}
                ml={10}
                row
                alignItems="center"
                flex
                // alignSelf="flex-start"
              >
                <Monicon
                  name="ri:arrow-left-s-line"
                  size={26}
                  color="#1f6efc"
                />
                <Text.Animated
                  size={18}
                  color="#1f6efc"
                  style={backTitleStyle}
                  fontFamily={Text.fonts.inter.medium}
                  numberOfLines={1}
                  flex={1}
                >
                  {backTitle}
                </Text.Animated>
              </Touchable>
              <Box pr={15} alignItems="flex-end">
                {rightComponent && rightComponent}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      <Box.Animated
        style={[styles.header, { height: animatedHeaderHeight }, headerStyle]}
        bg={Platform.OS === 'android' ? rgba('#19191b', 0.95) : 'transparent'}
      >
        {isIos && (
          <BlurView
            style={StyleSheet.absoluteFill}
            overlayColor={'#00000000'}
            blurType={Platform.OS === 'ios' ? 'chromeMaterialDark' : 'dark'}
            blurAmount={10}
            renderToHardwareTextureAndroid
            reducedTransparencyFallbackColor="black"
          />
        )}
        <Box h={animatedHeaderHeight - ANIMATED_HEADER_CONTENT_HEIGHT} />
        <Box h={ANIMATED_HEADER_CONTENT_HEIGHT} row>
          <Box flex justifyContent="center">
            {showBack && (
              <Touchable
                wFit
                alignSelf="flex-start"
                onPress={() => navigationHelper.goBack()}
                ml={10}
              >
                <Monicon
                  name="ri:arrow-left-s-line"
                  size={26}
                  color="#1f6efc"
                />
              </Touchable>
            )}
          </Box>
          <Box flex={4} center>
            <Text.Animated
              numberOfLines={1}
              size={18}
              fontFamily={Text.fonts.inter.medium}
            >
              {title}
            </Text.Animated>
          </Box>
          <Box flex justifyContent="center">
            {rightComponent && (
              <Box wFit alignSelf="flex-end" mr={15}>
                {rightComponent}
              </Box>
            )}
          </Box>
        </Box>
      </Box.Animated>
    </Box>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Object.assign(AnimatedHeader, {
  LargeTitle: AnimatedLargeTitle,
  SubTitle: AnimatedSubTitle,
  ANIMATED_HEADER_HEIGHT,
});
