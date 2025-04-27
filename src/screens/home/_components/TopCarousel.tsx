import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Box } from '@/components/box';
import { Text } from '@/components/text';
import LinearGradient from 'react-native-linear-gradient';
import {
  Easing,
  FadeIn,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import Image from 'react-native-fast-image';
import { Skeleton } from 'moti/skeleton';
import { isIpad, SCREEN_NAME } from '@/config';
import { MovieBanner } from '@/types/models/movie';
import { Touchable } from '@/components/button';
import { navigationHelper } from '@/shared/utils/navigationHelper';
import { useScreenOrientation } from '@/shared/hooks/useScreenOrientation';
import useScreenDimensions from '@/shared/hooks/useScreenDimensions';

interface ItemProps {
  index: number;
  item: MovieBanner;
  animationValue: SharedValue<number>;
}

const CarouselItem: React.FC<ItemProps> = ({ item, animationValue }) => {
  const maskStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animationValue.value,
      [-1, 0, 1],
      ['#000000dd', 'transparent', '#000000dd'],
    );

    return {
      backgroundColor,
    };
  }, [animationValue]);

  return (
    <Box flex>
      <Touchable
        flex
        disableFeedback
        onPress={() =>
          navigationHelper.navigate(SCREEN_NAME.Detail, {
            _id: item._id,
            slug: item.slug,
            thumb: item.thumb_url,
            // description: item.description,
          })
        }
      >
        <Image
          style={{ flex: 1 }}
          source={{
            uri: item.thumb_url,
          }}
        />
      </Touchable>
      <Box.Animated
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, maskStyle]}
      />
    </Box>
  );
};

interface Props {
  scrollOffset: SharedValue<number>;
  isFetching: boolean;
  data: MovieBanner[];
}

const TopCarousel = ({ scrollOffset, data, isFetching }: Props) => {
  const { isLandscape } = useScreenOrientation();
  const { screenWidth, screenHeight } = useScreenDimensions();

  const CAROUSEL_IMG_HEIGHT = isLandscape
    ? screenWidth / 3.2
    : screenHeight / 2.2;

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const isChangeSlide = useRef<boolean>(false);

  const textAnimationProgress = useSharedValue(1);

  const activeCarouselMovie: MovieBanner = useMemo(() => {
    return data[activeIndex];
  }, [data, activeIndex]);

  const handleScrollStart = () => {
    isChangeSlide.current = false;

    textAnimationProgress.value = withTiming(0, {
      duration: 350,
      easing: Easing.inOut(Easing.ease),
    });

    setTimeout(() => {
      if (!isChangeSlide.current) {
        textAnimationProgress.value = withTiming(1, {
          duration: 300,
          easing: Easing.inOut(Easing.ease),
        });
      }
    }, 1200);
  };

  const handleScrollEnd = () => {
    isChangeSlide.current = true;

    textAnimationProgress.value = withTiming(1, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const contentAnimatedStyle = useAnimatedStyle(() => {
    'worklet';

    const opacity = interpolate(textAnimationProgress.value, [0, 1], [0, 1]);
    const translateY = interpolate(
      textAnimationProgress.value,
      [0, 1],
      [10, 0],
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const carouselWrapperAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-CAROUSEL_IMG_HEIGHT, 0, CAROUSEL_IMG_HEIGHT],
            [-CAROUSEL_IMG_HEIGHT / 2, 0, CAROUSEL_IMG_HEIGHT * 0.7],
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-CAROUSEL_IMG_HEIGHT, 0, CAROUSEL_IMG_HEIGHT],
            [2, 1, 1],
          ),
        },
      ],
    };
  });

  const carouselAnimationStyle = React.useCallback((value: number) => {
    'worklet';

    const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
    const translateX = interpolate(
      value,
      [-1.5, 0, 1],
      [-screenWidth, 0, screenWidth],
    );

    return {
      transform: [{ translateX }],
      zIndex,
    };
  }, []);

  if (isLandscape && !isIpad()) {
    return <Box h={20} />;
  }

  return (
    <Box>
      {!isFetching && (
        <Box.Animated
          wFull
          entering={FadeIn}
          absolute
          top={0}
          h={CAROUSEL_IMG_HEIGHT}
          style={carouselWrapperAnimatedStyle}
        >
          <Carousel
            loop
            autoPlay
            onScrollStart={handleScrollStart}
            onScrollEnd={handleScrollEnd}
            onSnapToItem={(index) => setActiveIndex(index)}
            autoPlayInterval={5000}
            style={{ width: screenWidth, height: CAROUSEL_IMG_HEIGHT }}
            width={screenWidth}
            data={data}
            renderItem={({ index, item, animationValue }) => {
              return (
                <CarouselItem
                  key={index}
                  index={index}
                  item={item}
                  animationValue={animationValue}
                />
              );
            }}
            customAnimation={carouselAnimationStyle}
            scrollAnimationDuration={800}
            onConfigurePanGesture={(gestureChain) =>
              gestureChain.activeOffsetX([-10, 10])
            }
          />
        </Box.Animated>
      )}
      <Box w={screenWidth} h={CAROUSEL_IMG_HEIGHT} pointerEvents="none">
        <Skeleton show={isFetching} width={'100%'} height={'100%'} radius={0}>
          <Box wFull absolute bottom={0}>
            <Box>
              <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 1)']}
                style={StyleSheet.absoluteFillObject}
              />
              <Box p={15} gap={5}>
                <Text.Animated
                  size={24}
                  fontFamily={Text.fonts.inter.extraBold}
                  style={contentAnimatedStyle}
                  numberOfLines={1}
                >
                  {activeCarouselMovie?.name}
                </Text.Animated>
                <Text.Animated
                  color={'#dbdbdb'}
                  fontFamily={Text.fonts.inter.medium}
                  style={contentAnimatedStyle}
                  numberOfLines={1}
                >
                  {[activeCarouselMovie?.origin_name]
                    .filter(Boolean)
                    .join(' | ')}
                </Text.Animated>
                {activeCarouselMovie?.year && (
                  <Text.Animated
                    style={contentAnimatedStyle}
                    color={'#dbdbdb'}
                    size={13}
                    numberOfLines={3}
                  >
                    {activeCarouselMovie.year}
                  </Text.Animated>
                )}
              </Box>
            </Box>
          </Box>
        </Skeleton>
      </Box>
    </Box>
  );
};

export default TopCarousel;
