import { ActivityIndicator } from 'react-native';
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRoute } from '@react-navigation/native';
import { MovieBanner, MovieCommon } from '@/types/models/movie';
import { callAPIHelper, FetcherFunction } from '@/shared/utils/callAPIHelper';
import fetcher from '@/shared/services';
import { Touchable } from '@/components/button';
import { Box } from '@/components/box';
import { Text } from '@/components/text';
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { ScreenShell } from '@/components/screen-shell';
import AnimatedHeader, {
  useAnimatedHeaderHeight,
} from '@/components/AnimatedHeader';
import { navigationHelper } from '@/shared/utils/navigationHelper';
import { SCREEN_NAME } from '@/config';
import { isValidURL } from '@/shared/utils/common';
import UrlManager from '@/libs/url-manager';
import { FlashList } from '@shopify/flash-list';
import { Skeleton } from 'moti/skeleton';
import { SquircleView } from 'react-native-figma-squircle';
import useScreenDimensions from '@/shared/hooks/useScreenDimensions';
import { LegendListRenderItemProps } from '@legendapp/list';
import { AnimatedLegendList } from '@legendapp/list/reanimated';
import TurboImage from 'react-native-turbo-image';

const LazyTurboImage = React.lazy(() => import('@/components/TurboImage'));
const REACH_END_THRESHOLD = 50;

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList<MovieCommon | MovieBanner>,
);

const ListScreen = () => {
  const { screenWidth } = useScreenDimensions();
  const animatedHeaderHeight = useAnimatedHeaderHeight();

  const [data, setData] = React.useState<MovieCommon[] | MovieBanner[]>([]);
  const [page, setPage] = React.useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isLoadmore, setIsLoadmore] = useState(false);

  const scrollOffset = useSharedValue(0);
  const isMomentumScrolling = useRef(false);

  const route = useRoute<any>();

  const type = route.params?.type;
  const name = route.params?.name;
  const slug = route.params?.slug;
  const from = route.params?.from;

  const handleMomentumScrollBegin = () => {
    isMomentumScrolling.current = true;
  };

  const getData = () => {
    if (isLoadmore) return;

    const payload: any = { page, limit: 16 };

    const targetAPI = (() => {
      if (type === 'recent') {
        return fetcher.movie.getRecentMoviesV2;
      }
      if (type === 'category') {
        payload.type_list = slug;
        return fetcher.movie.getMovies;
      }
      if (type === 'genre') {
        payload.genre = slug;
        return fetcher.movie.getMoviesByGenre;
      }
      if (type === 'country') {
        payload.region = slug;
        return fetcher.movie.getMoviesByRegion;
      }
      if (type === 'year') {
        payload.year = slug;
        return fetcher.movie.getMoviesByYear;
      }
    })();

    callAPIHelper({
      API: targetAPI as FetcherFunction,
      // API: fetcher.movie.getMoviesByGenre,
      beforeSend: () => setIsLoadmore(true),
      payload,
      onSuccess: (res: unknown) => {
        if (type === 'recent') {
          const resData = res as ApiRecentResponsePagination<MovieBanner>;

          setIsLastPage(page >= resData.pagination.totalPages);
          setData((prev) => [...prev, ...resData.items]);
        } else {
          const resData = res as ApiResponsePagination<MovieCommon>;

          setIsLastPage(page >= resData.data.params.pagination.totalPages);
          setData((prev) => [...prev, ...resData.data.items]);
        }
      },
      onFinally: () => {
        setIsLoadmore(false);

        if (isFirstLoad) {
          setIsFirstLoad(false);
        }
      },
    });
  };

  const loadMoreItems = () => {
    if (isLastPage || !isMomentumScrolling.current || isLoadmore) {
      return;
    }

    setPage(page + 1);

    isMomentumScrolling.current = false;
  };

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollOffset.value = event.contentOffset.y;

    // const { contentOffset, contentSize, layoutMeasurement } = event;

    // const numberOfPixelsFromBottomThreshold = REACH_END_THRESHOLD;
    // const isNearBottom =
    //   contentOffset.y + layoutMeasurement.height >=
    //   contentSize.height / 2 - numberOfPixelsFromBottomThreshold;

    // if (isNearBottom) {
    //   runOnJS(loadMoreItems)();
    // }
  });

  useEffect(() => {
    getData();
  }, [page, type, slug]);

  const _renderItem = useCallback(
    ({ item, index }: LegendListRenderItemProps<MovieCommon | MovieBanner>) => {
      return (
        <Box
          w={'100%'}
          alignItems={index % 2 === 0 ? 'flex-start' : 'flex-end'}
          // mb={15}
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
        backTitle={from}
        title={name}
        scrollOffset={scrollOffset}
      />
      {/* <Animated.FlatList
        // estimatedItemSize={145}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingBottom: 60,
          paddingTop: animatedHeaderHeight + 10,
        }}
        columnWrapperStyle={{ gap: 15 }}
        ListHeaderComponent={
          <AnimatedHeader.LargeTitle
            title={name}
            scrollOffset={scrollOffset}
            ml={0}
            mb={15}
          />
        }
        numColumns={2}
        removeClippedSubviews
        data={isFirstLoad ? [...Array(16).keys()] : data}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => `${index}`}
        // initialNumToRender={10}
        // maxToRenderPerBatch={10}
        renderItem={_renderItem}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onEndReached={loadMoreItems}
        // onEndReachedThreshold={0.00001}
        onEndReachedThreshold={0.01}
        onMomentumScrollBegin={handleMomentumScrollBegin}
        ItemSeparatorComponent={() => <Box h={15} />}
        ListFooterComponent={() =>
          isLoadmore ? (
            <Box center mt={15}>
              <ActivityIndicator size={'small'} />
            </Box>
          ) : null
        }
      /> */}
      {isFirstLoad ? (
        <Box mt={animatedHeaderHeight + 10} px={15}>
          <AnimatedHeader.LargeTitle
            title={name}
            scrollOffset={scrollOffset}
            ml={0}
            mb={15}
          />
          <Box row flexWrap="wrap" gap={15}>
            {[...Array(24).keys()].map((_, index) => (
              <Box key={index} width={(screenWidth - 45) / 2}>
                <Skeleton
                  width={'100%'}
                  height={(screenWidth - 45) / 2 / 1.78}
                />
                <Box wFull mt={10} gap={3}>
                  <Skeleton width={'90%'} height={20} />
                  <Skeleton width={'70%'} height={20} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <AnimatedLegendList
          estimatedItemSize={159}
          contentContainerStyle={{
            paddingHorizontal: 15,
            paddingBottom: 30,
            paddingTop: animatedHeaderHeight + 10,
          }}
          // columnWrapperStyle={{ gap: 15 }}
          ListHeaderComponent={
            <AnimatedHeader.LargeTitle
              title={name}
              scrollOffset={scrollOffset}
              ml={0}
              mb={15}
            />
          }
          numColumns={2}
          removeClippedSubviews
          data={data}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => `${index}`}
          // initialNumToRender={10}
          // maxToRenderPerBatch={10}
          renderItem={_renderItem}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          onEndReached={loadMoreItems}
          // onEndReachedThreshold={0.00001}
          onEndReachedThreshold={0.4}
          onMomentumScrollBegin={handleMomentumScrollBegin}
          ItemSeparatorComponent={() => <Box h={15} />}
          ListFooterComponent={() =>
            isLoadmore ? (
              <Box center mt={15}>
                <ActivityIndicator size={'small'} />
              </Box>
            ) : null
          }
        />
      )}
    </ScreenShell>
  );
};

export default ListScreen;
