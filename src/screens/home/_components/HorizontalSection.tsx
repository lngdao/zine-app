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
import { MovieBanner, MovieCommon } from '@/types/models/movie';
import Image from 'react-native-fast-image';
import { navigationHelper } from '@/shared/utils/navigationHelper';
import LinearGradient from 'react-native-linear-gradient';
import Monicon from '@monicon/native';
import UrlManager from '@/libs/url-manager';
import { isValidURL } from '@/shared/utils/common';
import TurboImage from '@/components/TurboImage';

interface Props {
  data: MovieCommon[] | MovieBanner[];
  isFetching: boolean;
  title: string;
  type: string;
  slug?: string;
}

const HorizontalSection = ({ data, isFetching, title, slug, type }: Props) => {
  if (isFetching) {
    return (
      <Box px={15}>
        <Box row wFull gap={50}>
          <Box flex={3}>
            <Skeleton width={'100%'} height={25} />
          </Box>
          <Box flex={1}>
            <Skeleton width={'100%'} height={25} />
          </Box>
        </Box>
        <Box wFull row mt={15} gap={15}>
          {[...Array(10).keys()].map((index) => (
            <Box width={200} key={index}>
              <Skeleton width={200} height={120} radius={6} />
              <Box gap={5} mt={8}>
                <Skeleton width={'100%'} height={25} radius={6} />
                <Skeleton width={'80%'} height={25} radius={6} />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box row justifyContent="space-between" alignItems="center" px={15}>
        <Text size={20} fontFamily={Text.fonts.inter.semiBold}>
          {title}
        </Text>
        <Touchable
          onPress={() => {
            navigationHelper.navigate(SCREEN_NAME.List, {
              type,
              name: title,
              slug: slug,
              from: 'Trang chủ',
            });
          }}
        >
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
              w={210}
            >
              <Touchable
                onPress={() => {
                  navigationHelper.navigate(SCREEN_NAME.Detail, {
                    _id: item._id,
                    slug: item.slug,
                    // sharedTag: `${item.slug}-${type}`,
                    thumb: isValidURL(item.poster_url)
                      ? item.thumb_url
                      : UrlManager._APP_CDN_IMG_DOMAIN + item.thumb_url,
                  });
                }}
              >
                <TurboImage
                  width={210}
                  ratio={1.78}
                  rounded={6}
                  source={{
                    uri: isValidURL(item.thumb_url)
                      ? item.thumb_url
                      : UrlManager._APP_CDN_IMG_DOMAIN + item.thumb_url,
                    priority: 'high',
                  }}
                />
                <Box mt={10} gap={3}>
                  <Text
                    // size={13}
                    numberOfLines={1}
                    fontFamily={Text.fonts.inter.medium}
                  >
                    {item?.name}
                  </Text>
                  <Text color="#747474" mt={3} size={12} numberOfLines={1}>
                    {item?.origin_name}
                  </Text>
                </Box>
              </Touchable>
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
              'rgba(0, 0, 0, 0.2)',
              'rgba(0, 0, 0, 0.4)',
              'rgba(0, 0, 0, 0.6)',
              'rgba(0, 0, 0, 0.8)',
              'rgba(0, 0, 0, 1)',
            ]}
          />
        </Box.Animated>
      </Box>
    </Box>
  );
};

export default HorizontalSection;
