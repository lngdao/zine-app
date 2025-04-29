import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Box } from '../box';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Text } from '../text';
import { Button, Touchable } from '../button';
import PagerView from 'react-native-pager-view';
import Monicon from '@monicon/native';
import MainFilterPage, { FilterShowHideProps } from './MainFilterPage';
import DetailFilterPage from './DetailFilterPage';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import { Filter, FilterType, MovieFilter } from './_types';
import { DeviceEventEmitter } from 'react-native';

interface Props extends FilterShowHideProps {
  Trigger: (actions: { show: TFunction; hide: TFunction }) => React.ReactNode;
  onApply: (movieFilter: MovieFilter) => void;
  filterTitle?: string;
  filters: MovieFilter;
}

const FilterModal = (props: Props) => {
  const {
    Trigger,
    filterTitle = 'Bộ lọc phim',
    onApply,
    filters,
    ...rest
  } = props;

  const [isShowDetailFilter, setIsShowDetailFilter] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.Type);
  const [movieFilter, setMovieFilter] = useState<MovieFilter>({});

  const sheetRef = useRef<BottomSheetModal>(null);
  const pagerRef = useRef<PagerView>(null);

  // const snapPoints = useMemo(() => ['45%'], []);

  const show = () => {
    DeviceEventEmitter.emit('emitter_filter_open');
    sheetRef.current?.present();
  };

  const hide = () => {
    sheetRef.current?.close();
  };

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        setIsShowDetailFilter(false);
        DeviceEventEmitter.emit('emitter_filter_close');
      }

      setMovieFilter(filters);
    },
    [filters],
  );

  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const handleNavigateToDetailFilterPage = () => {
    requestAnimationFrame(() => pagerRef.current?.setPage(1));
    setIsShowDetailFilter(true);
  };

  const handleOnFilterChange = (type: FilterType, filter: Filter) => {
    switch (type) {
      case FilterType.Type:
        return setMovieFilter((prev) => ({ ...prev, type: filter }));
      case FilterType.Genre:
        return setMovieFilter((prev) => ({ ...prev, genre: filter }));
      case FilterType.Region:
        return setMovieFilter((prev) => ({ ...prev, region: filter }));
      case FilterType.Sub:
      case FilterType.Sort:
      case FilterType.Year:
        return setMovieFilter((prev) => ({ ...prev, year: filter }));
    }
  };

  const selectedFilter = (() => {
    switch (filterType) {
      case FilterType.Type:
        return movieFilter?.type;
      case FilterType.Genre:
        return movieFilter?.genre;
      case FilterType.Region:
        return movieFilter?.region;
      case FilterType.Sub:
      case FilterType.Sort:
      case FilterType.Year:
        return movieFilter?.year;
    }
  })();

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
      />
    ),
    [],
  );

  const renderHeader = () => {
    return (
      <Box h={26} center row alignItems="center" gap={10}>
        <Box flex>
          {isShowDetailFilter && (
            <Touchable.Animated
              entering={FadeIn}
              ml={10}
              onPress={() => {
                requestAnimationFrame(() => pagerRef.current?.setPage(0));
                setIsShowDetailFilter(false);
              }}
            >
              <Monicon name="ri:arrow-left-s-line" size={26} color="#FFF" />
            </Touchable.Animated>
          )}
        </Box>
        <Box flex={4} center>
          <Text
            numberOfLines={1}
            fontFamily={Text.fonts.inter.medium}
            size={18}
          >
            {filterTitle}
          </Text>
        </Box>
        <Box flex alignItems="flex-end">
          <Touchable center flex onPress={handleClosePress} mr={15}>
            <Text
              size={16}
              color="#1f6efc"
              fontFamily={Text.fonts.inter.medium}
            >
              Xong
            </Text>
          </Touchable>
        </Box>
      </Box>
    );
  };

  const renderContent = useCallback(() => {
    return (
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        scrollEnabled={false}
      >
        <MainFilterPage
          {...rest}
          movieFilter={movieFilter}
          onTypePress={() => {
            setFilterType(FilterType.Type);
            handleNavigateToDetailFilterPage();
          }}
          onGenrePress={() => {
            setFilterType(FilterType.Genre);
            handleNavigateToDetailFilterPage();
          }}
          onRegionPress={() => {
            setFilterType(FilterType.Region);
            handleNavigateToDetailFilterPage();
          }}
          onSubPress={() => {
            setFilterType(FilterType.Sub);
            handleNavigateToDetailFilterPage();
          }}
          onSortPress={() => {
            setFilterType(FilterType.Sort);
            handleNavigateToDetailFilterPage();
          }}
          onYearPress={() => {
            setFilterType(FilterType.Year);
            handleNavigateToDetailFilterPage();
          }}
        />
        <DetailFilterPage
          initialFilter={selectedFilter}
          type={filterType}
          onChange={handleOnFilterChange}
        />
      </PagerView>
    );
  }, [filterType, movieFilter, rest]);

  const renderAction = () => {
    return (
      <Box.Animated entering={FadeIn} exiting={FadeOut} row px={15} gap={10}>
        <Button.Animated
          variant={Button.Variants.GHOST}
          onPress={() => {
            setMovieFilter({});
            onApply({});
          }}
          flex
          row
          gap={8}
        >
          <Monicon name="ri:reset-left-fill" color="#FFF" />
          <Text fontFamily={Text.fonts.inter.semiBold}>Đặt lại</Text>
        </Button.Animated>
        <Button.Animated
          onPress={() => {
            onApply(movieFilter);
            hide();
          }}
          flex
          row
          gap={8}
        >
          <Monicon name="ri:checkbox-circle-fill" color="#FFF" />
          <Text fontFamily={Text.fonts.inter.semiBold}>Áp dụng</Text>
        </Button.Animated>
      </Box.Animated>
    );
  };

  return (
    <Box>
      {Trigger({ show, hide })}
      <BottomSheetModal
        ref={sheetRef}
        onChange={handleSheetChanges}
        index={0}
        snapPoints={[]}
        enablePanDownToClose
        enableContentPanningGesture={false}
        enableDynamicSizing
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: '#323434' }}
        handleIndicatorStyle={{ backgroundColor: '#a4a9b2' }}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
      >
        <BottomSheetView style={{ minHeight: 400 }}>
          <Box flex gap={20}>
            {renderHeader()}
            {!isShowDetailFilter && renderAction()}
            {renderContent()}
          </Box>
        </BottomSheetView>
      </BottomSheetModal>
    </Box>
  );
};

export default FilterModal;
