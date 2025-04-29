import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScreenShell } from '@/components/screen-shell';
import { Box } from '@/components/box';
import { Keyboard, RefreshControl, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Monicon from '@monicon/native';
import { callAPIHelper } from '@/shared/utils/callAPIHelper';
import fetcher from '@/shared/services';
import { MovieBanner, MovieCommon } from '@/types/models/movie';
import { Touchable } from '@/components/button';
import { Text } from '@/components/text';
import { movieGenres, TAB_BAR_HEIGHT } from '@/config';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import _ from 'lodash';
import { randomInRange, shuffle } from '@/shared/utils/common';
import { useAnimatedHeaderHeight } from '@/components/AnimatedHeader';
import { LegendList, LegendListRenderItemProps } from '@legendapp/list';
import { Skeleton } from 'moti/skeleton';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import SearchItem from './_components/SearchItem';
import FilterModal from '@/components/filter/FilterModal';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { MovieFilter } from '@/components/filter/_types';

const CHUNK_SIZE = 16;
const movieGenreValues = Object.values(movieGenres);

const SearchScreenComponent = () => {
  const { top: topInset } = useSafeAreaInsets();

  const [data, setData] = useState<MovieCommon[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [textSearchSubmit, setTextSearchSubmit] = useState('');

  const [chunkIndex, setChunkIndex] = useState(0);
  const [displayedItems, setDisplayedItems] = useState<MovieCommon[]>([]);
  const [recommendData, setRecommendData] = useState<MovieBanner[]>([]);
  const [isFirstFetching, setIsFirstFetching] = useState(true);
  const [isSearchInputFocus, setIsSearchInputFocus] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState<MovieFilter>({});

  const isShowFilter = !isSearchInputFocus && Boolean(textSearchSubmit.length);

  const _searchIconTranslateX = useSharedValue(0);
  const _inputTranslateX = useSharedValue(0);
  const _searchIconOpacity = useSharedValue(1);

  const isMomentumScrolling = useRef<boolean>(false);

  const debouncedCheck = useMemo(
    () =>
      _.debounce((value: string) => {
        if (value === '') setTextSearchSubmit('');
      }, 300),
    [],
  );

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

  const handleOnSearch = () => {
    if (!textSearchSubmit.length) {
      setData([]);
      setDisplayedItems([]);
      setChunkIndex(0);
    }

    const payload: any = { keyword: textSearchSubmit, limit: 64 };

    if (filters.genre) {
      payload.category = filters.genre.slug;
    }

    if (filters.region) {
      payload.country = filters.region.slug;
    }

    if (filters.year) {
      payload.year = filters.year.slug;
    }

    callAPIHelper({
      API: fetcher.movie.getMoviesByKeyword,
      payload,
      beforeSend() {
        setIsSearching(true);
      },
      onSuccess: (res) => {
        setData(res.data.items);
        setChunkIndex(0);

        setDisplayedItems(res.data.items.slice(0, CHUNK_SIZE));
      },
      onFinally() {
        setIsSearching(false);
      },
    });
  };

  const getRecommendMovie = () => {
    callAPIHelper({
      API: fetcher.movie.getRecentMoviesV2,
      payload: { limit: 16, page: randomInRange(1, 500) },
      beforeSend() {
        setIsFirstFetching(true);
      },
      onSuccess(res) {
        const shuffedData = shuffle(res.items);
        setRecommendData(shuffedData);
      },
      onFinally() {
        setIsFirstFetching(false);
      },
    });
  };

  useEffect(() => {
    _searchIconTranslateX.value = withTiming(isSearchInputFocus ? -20 : 0, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
    _searchIconOpacity.value = withTiming(isSearchInputFocus ? 0 : 1, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
    _inputTranslateX.value = withTiming(isSearchInputFocus ? -20 : 0, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
  }, [isSearchInputFocus]);

  useEffect(() => {
    getRecommendMovie();
  }, []);

  useEffect(() => {
    handleOnSearch();
  }, [textSearchSubmit, filters]);

  useEffect(() => {
    debouncedCheck(inputValue);

    return () => {
      debouncedCheck.cancel();
    };
  }, [inputValue, debouncedCheck]);

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: _searchIconTranslateX.value }],
      opacity: _searchIconOpacity.value,
    };
  });

  const inputStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: _inputTranslateX.value }],
    };
  });

  const _renderItem = ({ item }: LegendListRenderItemProps<MovieCommon>) => {
    return <SearchItem item={item} />;
  };

  const _renderPlaceholder = () => {
    return (
      <Box>
        {[...Array(12).keys()].map((_, index) => (
          <Box key={index} row gap={12}>
            <Box flex={1} py={8}>
              <Box wFull ratio={1.78}>
                <Skeleton width={'100%'} height={'100%'} />
              </Box>
            </Box>
            <Box
              justifyContent="center"
              flex={2}
              py={8}
              borderBottomWidth={1}
              borderBottomColor={'#3d3d3f'}
              gap={5}
            >
              <Skeleton width={'80%'} height={18} />
              <Skeleton width={'60%'} height={18} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  const renderRecommendMovies = () => {
    return (
      <Animated.ScrollView
        style={{ marginTop: 15 }}
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT + 20,
          paddingHorizontal: 15,
        }}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={getRecommendMovie} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Text mb={5} size={15} fontFamily={Text.fonts.inter.medium}>
          Gợi ý
        </Text>
        {isFirstFetching ? (
          _renderPlaceholder()
        ) : (
          <Box gap={5}>
            {recommendData.map((item, index) => (
              <SearchItem key={index} item={item} />
            ))}
          </Box>
        )}
      </Animated.ScrollView>
    );
  };

  const renderSearchResult = () => {
    return isSearching ? (
      <Box px={15} mt={10}>
        {_renderPlaceholder()}
      </Box>
    ) : (
      <LegendList
        estimatedItemSize={82}
        style={{ marginTop: 10 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingBottom: TAB_BAR_HEIGHT + 10,
        }}
        data={displayedItems}
        keyExtractor={(_, index) => `${index}`}
        renderItem={_renderItem}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.01}
        onMomentumScrollBegin={handleMomentumScrollBegin}
      />
    );
  };

  return (
    <ScreenShell scrollable={false} header={<Box h={topInset + 10} />}>
      <Box px={15} row alignItems="center" gap={12}>
        <Box
          row
          flex
          bg={'#2c2c2e'}
          px={10}
          rounded={8}
          alignItems="center"
          overflow="hidden"
        >
          <Box
            flex
            gap={5}
            row
            pr={inputValue.length && 10}
            alignItems="center"
            h={44}
          >
            <Box.Animated style={iconStyle}>
              <Monicon name="ri:search-line" color="#9f9fa2" size={18} />
            </Box.Animated>
            <Box.Animated style={inputStyle} flex>
              <TextInput
                value={inputValue}
                onChangeText={setInputValue}
                style={{
                  color: '#FFF',
                  fontSize: 16,
                  paddingVertical: 10,
                  fontFamily: Text.fonts.inter.regular,
                }}
                placeholder="Chương trình, phim, v.v"
                placeholderTextColor={'#9f9fa2'}
                onFocus={() => {
                  ReactNativeHapticFeedback.trigger('impactLight');
                  setIsSearchInputFocus(true);
                }}
                onBlur={() => {
                  setIsSearchInputFocus(false);
                }}
                returnKeyType="search"
                enablesReturnKeyAutomatically
                onSubmitEditing={(submitEvent) => {
                  setFilters({});
                  setTextSearchSubmit(submitEvent.nativeEvent.text);
                }}
              />
            </Box.Animated>
          </Box>
          {Boolean(!!inputValue.length && isSearchInputFocus) && (
            <Touchable.Animated
              entering={FadeIn.duration(300)}
              onPress={() => {
                setInputValue('');
                setTextSearchSubmit('');
              }}
            >
              <Monicon name="ri:close-circle-fill" color="#FFF" size={18} />
            </Touchable.Animated>
          )}
        </Box>
        {isSearchInputFocus && (
          <Touchable.Animated
            entering={FadeIn}
            onPress={() => {
              setIsSearchInputFocus(false);
              Keyboard.dismiss();
            }}
          >
            <Text size={15}>Hủy</Text>
          </Touchable.Animated>
        )}
        {isShowFilter && (
          <FilterModal
            Trigger={({ show }) => (
              <Touchable.Animated
                entering={FadeIn}
                onPress={show}
                bg={'#272729'}
                w={44}
                h={44}
                rounded={8}
                center
              >
                <Monicon
                  name="ri:filter-3-fill"
                  color={_.isEmpty(filters) ? '#FFF' : '#1f6efc'}
                  size={22}
                />
              </Touchable.Animated>
            )}
            filters={filters}
            onApply={(_filters) => {
              setFilters(_filters);
            }}
            showTypeFilter={false}
            showSubFilter={false}
          />
        )}
      </Box>
      {isSearchInputFocus || textSearchSubmit.length
        ? renderSearchResult()
        : renderRecommendMovies()}
    </ScreenShell>
  );
};

const SearchScreen = () => {
  return (
    <BottomSheetModalProvider>
      <SearchScreenComponent />
    </BottomSheetModalProvider>
  );
};

export default SearchScreen;
