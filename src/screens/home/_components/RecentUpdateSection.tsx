import React, { useEffect, useState } from 'react';
import { Box } from '@/components/box';
import { Text } from '@/components/text';
import { Touchable } from '@/components/button';
import { ScrollView, StyleSheet } from 'react-native';
import { Skeleton } from 'moti/skeleton';
import { SCREEN_NAME, SkeletonCommonProps } from '@/config';
import Animated, {
  FadeIn,
  LinearTransition,
  SharedTransition,
} from 'react-native-reanimated';
import { callAPIHelper } from '@/shared/utils/callAPIHelper';
import fetcher from '@/shared/services';
import { MovieCommon } from '@/types/models/movie';
import Image from 'react-native-fast-image';
import { navigationHelper } from '@/shared/utils/navigationHelper';
import LinearGradient from 'react-native-linear-gradient';

// const customTransition = SharedTransition.custom((values) => {
//   'worklet';
//   return {
//     opacity: values.,
//   };
// });

const RecentUpdateSection = () => {
  const [data, setData] = useState<MovieCommon[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const getData = () => {
    callAPIHelper({
      API: fetcher.movie.getRecentMovies,
      payload: {},
      beforeSend: () => {
        setIsFetching(true);
      },
      onSuccess: (data) => {
        setData(data.items);
      },
      onFinally: () => {
        setIsFetching(false);
      },
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box>
      <Box row justifyContent="space-between" px={15}>
        <Text size={16} fontFamily={Text.fonts.inter.semiBold}>
          Phim mới cập nhật
        </Text>
        <Touchable alignSelf="flex-end">
          <Text color="#747474" size={13}>
            Xem thêm
          </Text>
        </Touchable>
      </Box>
      <Box mt={15}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15, gap: 15 }}
        >
          {data.map((item, index) => (
            <Box.Animated
              key={index}
              entering={FadeIn.delay(index * 150)}
              layout={LinearTransition.delay(index * 100)}
              w={200}
            >
              <Skeleton
                show={isFetching}
                width={200}
                // height={120}
                radius={10}
                // {...SkeletonCommonProps}
              >
                {item && (
                  <Touchable
                    onPress={() => {
                      navigationHelper.navigate(SCREEN_NAME.Detail, {
                        slug: item.slug,
                        sharedTag: item.slug,
                        thumb: item.poster_url,
                        description: item.description,
                      });
                    }}
                  >
                    <Animated.Image
                      style={{ width: 200, height: 120 }}
                      source={{ uri: item.poster_url }}
                      sharedTransitionTag={item.slug}
                      borderRadius={6}
                    />
                    <Box mt={10}>
                      <Text
                        size={13}
                        numberOfLines={1}
                        fontFamily={Text.fonts.inter.medium}
                      >
                        {item.name}
                      </Text>
                      <Text color="#747474" mt={3} size={11} numberOfLines={1}>
                        {item.casts}
                      </Text>
                    </Box>
                  </Touchable>
                )}
              </Skeleton>
            </Box.Animated>
          ))}
        </ScrollView>
        <Box.Animated absolute pointerEvents={'none'} w={'10%'} hFull right={0}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
            colors={[
              'transparent',
              'rgba(18, 18, 18, 0.2)',
              'rgba(18, 18, 18, 0.4)',
              'rgba(18, 18, 18, 0.6)',
              'rgba(18, 18, 18, 0.8)',
              'rgba(18, 18, 18, 1)',
            ]}
          />
        </Box.Animated>
      </Box>
    </Box>
  );
};

export default RecentUpdateSection;
