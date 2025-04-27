import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Box } from '@/components/box';
import { ScreenShell } from '@/components/screen-shell';
import AnimatedHeader, {
  useAnimatedHeaderHeight,
} from '@/components/AnimatedHeader';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useRoute } from '@react-navigation/native';
import { useBookmark } from '@/shared/contexts/bookmarkContext';
import { Touchable } from '@/components/button';
import { navigationHelper } from '@/shared/utils/navigationHelper';
import { SCREEN_NAME } from '@/config';
import { BookmarkMovie } from '@/types/models/movie';
import { isValidURL } from '@/shared/utils/common';
import UrlManager from '@/libs/url-manager';
import { screenWidth } from '@/shared/theme';
import { Skeleton } from 'moti/skeleton';
import { Text } from '@/components/text';
import { FlashList } from '@shopify/flash-list';
import { AnimatedLegendList } from '@legendapp/list/reanimated';
import { LegendListRenderItemProps } from '@legendapp/list';

const LazyTurboImage = React.lazy(() => import('@/components/TurboImage'));
const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList<BookmarkMovie>,
);

const CHUNK_SIZE = 16;

const BookmarkDetailScreen = () => {
  const route = useRoute<any>();
  const { bookmarks } = useBookmark();
  const animatedHeaderHeight = useAnimatedHeaderHeight();

  const bookmarkId = route.params?.id;
  const data = useMemo(
    () => bookmarks.find((item) => item.id === bookmarkId)?.movies || [],
    [bookmarks, bookmarkId],
  );

  const [chunkIndex, setChunkIndex] = useState(0);
  const [displayedItems, setDisplayedItems] = useState<BookmarkMovie[]>([]);

  const isMomentumScrolling = useRef<boolean>(false);

  const scrollOffset = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollOffset.value = event.contentOffset.y;
  });

  const handleMomentumScrollBegin = () => {
    isMomentumScrolling.current = true;
  };

  const loadMoreItems = () => {
    if (!isMomentumScrolling) return;

    const nextChunkIndex = chunkIndex + 1;
    const startIndex = nextChunkIndex * CHUNK_SIZE;
    const endIndex = startIndex + CHUNK_SIZE;

    setDisplayedItems((prevDisplayedItems) => [
      ...prevDisplayedItems,
      ...data.slice(startIndex, endIndex),
    ]);

    setChunkIndex(nextChunkIndex);

    isMomentumScrolling.current = false;
  };

  useEffect(() => {
    setDisplayedItems(data.slice(0, CHUNK_SIZE));
  }, [data]);

  const _renderItem = useCallback(
    ({ item, index }: LegendListRenderItemProps<BookmarkMovie>) => {
      return (
        <Box
          w={'100%'}
          alignItems={index % 2 === 0 ? 'flex-start' : 'flex-end'}
        >
          <Touchable.Animated
            onPress={() => {
              navigationHelper.push(SCREEN_NAME.Detail, {
                _id: item._id,
                slug: item.slug,
                // sharedTag: `${item.slug}-${type}`,
                thumb: isValidURL(item.thumb_url)
                  ? item.thumb_url
                  : UrlManager._APP_CDN_IMG_DOMAIN + item.thumb_url,
                isFromList: true,
              });
            }}
          >
            <Box gap={10} w={(screenWidth - 45) / 2}>
              <Suspense
                fallback={
                  <Skeleton
                    width={'100%'}
                    height={(screenWidth - 45) / 2 / 1.78}
                  />
                }
              >
                <LazyTurboImage
                  width={'100%'}
                  ratio={1.78}
                  rounded={6}
                  source={{
                    uri: isValidURL(item.thumb_url)
                      ? item.thumb_url
                      : UrlManager._APP_CDN_IMG_DOMAIN + item.thumb_url,
                    priority: 'high',
                  }}
                />
              </Suspense>
              <Box gap={3}>
                <Text numberOfLines={1}>{item.name}</Text>
                <Text color="#747474" size={12} numberOfLines={1}>
                  {item.origin_name}
                </Text>
              </Box>
            </Box>
          </Touchable.Animated>
        </Box>
      );
    },
    [],
  );

  return (
    <ScreenShell scrollable={false}>
      <AnimatedHeader
        showBack
        backTitle={'Danh sách đã thích'}
        title={'Tất cả phim'}
        scrollOffset={scrollOffset}
      />
      <AnimatedLegendList
        estimatedItemSize={156}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingBottom: 60,
          paddingTop: animatedHeaderHeight + 10,
        }}
        ListHeaderComponent={
          <AnimatedHeader.SubTitle
            title={'Tất cả phim'}
            scrollOffset={scrollOffset}
            ml={0}
            mb={15}
          />
        }
        numColumns={2}
        removeClippedSubviews
        data={displayedItems}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => `${index}`}
        renderItem={_renderItem}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.01}
        onMomentumScrollBegin={handleMomentumScrollBegin}
        ItemSeparatorComponent={() => <Box h={15} />}
      />
    </ScreenShell>
  );
};

export default BookmarkDetailScreen;
