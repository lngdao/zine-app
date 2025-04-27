import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from '@/components/text';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Box } from '@/components/box';
import { delay } from '@/shared/utils/common';
import { isIpad, isIphoneX } from '@/config';

interface Props {
  onDone: () => void;
}

const StartupScreen = ({ onDone }: Props) => {
  const loadOpacity = useSharedValue(0);
  const screenOpacity = useSharedValue(1);

  useEffect(() => {
    loadOpacity.value = withDelay(
      200,
      withTiming(1, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      }),
    );

    setTimeout(async () => {
      screenOpacity.value = withTiming(0, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      });

      await delay(300);

      onDone();
    }, 2500);
  }, []);

  const loadStyle = useAnimatedStyle(() => ({
    opacity: loadOpacity.value,
  }));

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  return (
    <Box.Animated
      style={[screenStyle, StyleSheet.absoluteFillObject]}
      flex
      bg={'#121212'}
      center
    >
      <Text size={64} fontFamily={Text.fonts.inter.black} color={'#FFFFFF'}>
        ZINE
      </Text>
      <Box wFull absolute center bottom={isIphoneX || isIpad() ? 30 : 20}>
        <Box.Animated style={loadStyle}>
          <ActivityIndicator size={'small'} />
        </Box.Animated>
        <Box w={'75%'} mt={15}>
          <Text size={10} color={'#747474'} textAlign={'center'}>
            {/* ZINE is a mobile application focused on streaming movies, offering a
            seamless and immersive viewing experience */}
            ZINE là một ứng dụng di động tập trung vào việc xem phim trực tuyến,
            mang đến trải nghiệm xem liền mạch và nhanh chóng
          </Text>
        </Box>
      </Box>
    </Box.Animated>
  );
};

export default StartupScreen;
