import React, { useRef } from 'react';
import { ScreenShell } from '@/components/screen-shell';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import AnimatedHeader, {
  useAnimatedHeaderHeight,
} from '@/components/AnimatedHeader';
import { Box } from '@/components/box';
import { Text } from '@/components/text';
import { rgba } from '@/shared/utils/common';
import { screenWidth } from '@/shared/theme';
import { navigationHelper } from '@/shared/utils/navigationHelper';
import { SCREEN_NAME } from '@/config';
import { Touchable } from '@/components/button';
import { Bookmark } from '@/types/models/movie';
import { ListRenderItem, Platform, StyleSheet, ViewStyle } from 'react-native';
import { useBookmark } from '@/shared/contexts/bookmarkContext';
import TurboImage from '@/components/TurboImage';
import { useRoute } from '@react-navigation/native';

const BookmarkScreen = () => {
  const animatedHeaderHeight = useAnimatedHeaderHeight();
  const { bookmarks } = useBookmark();
  const route = useRoute<any>();

  const from = route.params?.from;

  const scrollOffset = useSharedValue(0);
  const isMomentumScrolling = useRef(false);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollOffset.value = event.contentOffset.y;
  });

  const _renderItem: ListRenderItem<Bookmark> = ({
    item,
    index: itemIndex,
  }) => {
    const renderItemStyle = (index: number, length: number) => {
      const gap = 2;
      const containerSize = (screenWidth - 45) / 2;
      const halfSize =
        Platform.OS === 'ios'
          ? (containerSize - gap) / 2
          : Math.floor((containerSize - gap) / 2);
      const fullSize = containerSize;

      if (length === 1) {
        return { width: fullSize, height: fullSize };
      } else if (length === 2) {
        return { width: halfSize, height: fullSize };
      } else if (length === 3) {
        if (index < 2) {
          return { width: halfSize, height: halfSize };
        } else {
          return { width: fullSize, height: halfSize };
        }
      } else {
        return { width: halfSize, height: halfSize };
      }
    };

    const thumbnails =
      itemIndex === 0
        ? item.movies.slice(0, 4).map((movie) => movie.poster_url)
        : item.movies[0].poster_url;

    return (
      <Touchable.Animated
        onPress={() => {
          navigationHelper.push(SCREEN_NAME.BookmarkDetail, { id: item.id });
        }}
      >
        <Box gap={10} size={(screenWidth - 45) / 2}>
          {itemIndex === 0 ? (
            <Box
              wFull
              aspectRatio={1}
              row
              flexWrap="wrap"
              rounded={8}
              overflow="hidden"
              gap={2}
              center
            >
              {thumbnails.length ? (
                (thumbnails as string[]).map((img, itemIdx) => (
                  <Box
                    key={itemIdx}
                    style={[
                      renderItemStyle(itemIdx, thumbnails.length) as ViewStyle,
                    ]}
                  >
                    <TurboImage
                      width={'100%'}
                      height={'100%'}
                      source={{
                        uri: img,
                      }}
                    />
                    {itemIdx === 3 && (
                      <Box
                        bg={rgba('#000000', 0.7)}
                        absolute
                        style={StyleSheet.absoluteFill}
                        center
                      >
                        <Text size={13} fontFamily={Text.fonts.inter.semiBold}>
                          +{item.movies.length - 3}
                        </Text>
                      </Box>
                    )}
                  </Box>
                ))
              ) : (
                <Box wFull hFull bg={'#212121'} />
              )}
            </Box>
          ) : (
            <Box wFull aspectRatio={1} bg={'red'} rounded={8} />
          )}
        </Box>
        <Box mt={10}>
          <Text numberOfLines={1} size={15}>
            {item.name}
          </Text>
        </Box>
      </Touchable.Animated>
    );
  };

  return (
    <ScreenShell scrollable={false}>
      <AnimatedHeader
        showBack
        backTitle={from || 'Cài đặt'}
        title={'Danh sách đã thích'}
        scrollOffset={scrollOffset}
      />
      <Animated.FlatList
        contentContainerStyle={{
          gap: 15,
          paddingHorizontal: 15,
          justifyContent: 'space-between',
          paddingBottom: 60,
          paddingTop: animatedHeaderHeight + 10,
        }}
        columnWrapperStyle={{ gap: 15 }}
        ListHeaderComponent={
          <AnimatedHeader.SubTitle
            title={'Danh sách đã thích'}
            scrollOffset={scrollOffset}
            ml={0}
          />
        }
        numColumns={2}
        data={bookmarks}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => `${index}`}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        renderItem={_renderItem}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onEndReachedThreshold={0.01}
      />
    </ScreenShell>
  );
};

export default BookmarkScreen;
