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
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { ScreenShell } from '@/components/screen-shell';
import AnimatedHeader, {
  useAnimatedHeaderHeight,
} from '@/components/AnimatedHeader';
import { navigationHelper } from '@/shared/utils/navigationHelper';
import { SCREEN_NAME } from '@/config';
import { decodeHtmlEntities, isValidURL } from '@/shared/utils/common';
import UrlManager from '@/libs/url-manager';
import { FlashList } from '@shopify/flash-list';
import { Skeleton } from 'moti/skeleton';
import useScreenDimensions from '@/shared/hooks/useScreenDimensions';
import { LegendListRenderItemProps } from '@legendapp/list';
import { AnimatedLegendList } from '@legendapp/list/reanimated';
import FilterModal from '@/components/filter/FilterModal';
import Monicon from '@monicon/native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { MovieFilter } from '@/components/filter/_types';
import _ from 'lodash';

const LazyTurboImage = React.lazy(() => import('@/components/TurboImage'));
const REACH_END_THRESHOLD = 50;

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList<MovieCommon | MovieBanner>,
);

const ListScreenComponent = () => {
  const { screenWidth } = useScreenDimensions();
  const animatedHeaderHeight = useAnimatedHeaderHeight();

  const route = useRoute<any>();

  const type = route.params?.type;
  const name = route.params?.name;
  const slug = route.params?.slug;
  const from = route.params?.from;

  const [data, setData] = React.useState<MovieCommon[] | MovieBanner[]>([]);
  const [page, setPage] = React.useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isLoadmore, setIsLoadmore] = useState(false);
  const [filters, setFilters] = useState<MovieFilter>({});
  const [isShowFilter] = useState(type !== 'recent');
  const [isShowGenreFilter] = useState(type !== 'genre');
  const [isShowRegionFilter] = useState(type !== 'country');
  const [isShowYearFilter] = useState(type !== 'year');

  const scrollOffset = useSharedValue(0);
  const isMomentumScrolling = useRef(false);

  const handleMomentumScrollBegin = () => {
    isMomentumScrolling.current = true;
  };

  const getData = () => {
    if (isLoadmore) return;

    const payload: any = { page, limit: 16 };

    if (filters.genre) {
      payload.category = filters.genre.slug;
    }

    if (filters.region) {
      payload.country = filters.region.slug;
    }

    if (filters.year) {
      payload.year = filters.year.slug;
    }

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
      beforeSend: () => {
        setIsLoadmore(true);
      },
      payload,
      onSuccess: (res: unknown) => {
        if (type === 'recent') {
          const resData = res as ApiRecentResponsePagination<MovieBanner>;

          setIsLastPage(page >= resData.pagination.totalPages);
          setData((prev) => [...prev, ...resData.items]);
        } else {
          const resData = res as ApiResponsePagination<MovieCommon>;

          setIsLastPage(page >= resData.data.params.pagination.totalPages);

          if (page === 1) {
            setData(resData.data.items);
          } else {
            setData((prev) => [...prev, ...resData.data.items]);
          }
        }
      },
      onFinally: () => {
        setIsLoadmore(false);
        setIsFirstLoad(false);
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
  });

  useEffect(() => {
    getData();
  }, [page, type, slug, filters]);

  useEffect(() => {
    setPage(1);
    setIsFirstLoad(true);
  }, [filters]);

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
                  {decodeHtmlEntities(item.origin_name)}
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
        rightComponent={
          isShowFilter && (
            <FilterModal
              Trigger={({ show }) => (
                <Touchable onPress={show}>
                  <Monicon
                    name="ri:filter-3-fill"
                    color={_.isEmpty(filters) ? '#FFF' : '#1f6efc'}
                    size={22}
                  />
                </Touchable>
              )}
              filters={filters}
              onApply={(_filters) => {
                setFilters(_filters);
              }}
              showTypeFilter={false}
              showSubFilter={false}
              showGenreFilter={isShowGenreFilter}
              showRegionFilter={isShowRegionFilter}
              showYearFilter={isShowYearFilter}
            />
          )
        }
      />
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
          renderItem={_renderItem}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          onEndReached={loadMoreItems}
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

const ListScreen = () => {
  return (
    <BottomSheetModalProvider>
      <ListScreenComponent />
    </BottomSheetModalProvider>
  );
};

export default ListScreen;
