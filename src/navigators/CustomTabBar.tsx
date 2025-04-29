/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import React, { useCallback, useEffect } from 'react';
import { Platform, DeviceEventEmitter } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Monicon from '@monicon/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_BAR_HEIGHT } from '@/config';
import { Touchable } from '@/components/button';
import { Text } from '@/components/text';
import { Box } from '@/components/box';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { rgba } from '@/shared/utils/common';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { bottom: bottomInset } = useSafeAreaInsets();
  const translateY = useSharedValue(0);

  const [isHomeTabRefetch, setIsHomeTabRefetch] = React.useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleTabTap = useCallback((tabName: string) => {
    DeviceEventEmitter.emit(`${tabName}`);
  }, []);

  useEffect(() => {
    const eventFilterOpen = DeviceEventEmitter.addListener(
      'emitter_filter_open',
      () => {
        translateY.value = withTiming(TAB_BAR_HEIGHT + 20, { duration: 300 });
      },
    );

    const eventFilterClose = DeviceEventEmitter.addListener(
      'emitter_filter_close',
      () => {
        translateY.value = withTiming(0, { duration: 300 });
      },
    );

    const listener = DeviceEventEmitter.addListener(
      'home-refetch',
      ({ refetchStatus }) => {
        setIsHomeTabRefetch(refetchStatus);
      },
    );

    return () => {
      eventFilterOpen.remove();
      eventFilterClose.remove();
      listener.remove();
    };
  }, []);

  return (
    <Box.Animated
      absolute
      height={TAB_BAR_HEIGHT}
      bottom={0}
      wFull
      row
      bg={Platform.OS === 'android' ? rgba('#000000', 0.5) : 'transparent'}
      style={animatedStyle}
    >
      <BlurView
        overlayColor={'#00000000'}
        style={[{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0 }]}
        blurType={Platform.OS === 'ios' ? 'chromeMaterialDark' : 'dark'}
        // renderToHardwareTextureAndroid
        blurAmount={15}
        reducedTransparencyFallbackColor="#FFF"
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          ReactNativeHapticFeedback.trigger('impactLight');

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }

          if (isFocused) {
            handleTabTap(options.tabNameEng);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Box key={route.key} pt={8} flex>
            <Touchable
              disableFeedback
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              center
              flex
            >
              <Box flex center justifyContent="flex-start" gap={5}>
                <Monicon
                  name={
                    (isHomeTabRefetch && options.tabNameEng === 'Home'
                      ? 'ri:reset-left-fill'
                      : isFocused
                        ? options.tabIconFocus
                        : options.tabIcon) as string
                  }
                  size={24}
                  color={isFocused ? '#1f6efc' : '#7b7879'}
                />
                <Text
                  size={10}
                  fontFamily={Text.fonts.inter.medium}
                  color={isFocused ? '#1f6efc' : '#7b7879'}
                >
                  {options.tabName}
                </Text>
              </Box>
            </Touchable>
          </Box>
        );
      })}
    </Box.Animated>
  );
};

export default CustomTabBar;
