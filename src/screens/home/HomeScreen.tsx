import React, { useEffect, useState } from 'react';
import { ScreenShell } from '@/components/screen-shell';
import { useI18n } from '@/shared/hooks/useI18n';
import Animated, {
  useAnimatedRef,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { Box } from '@/components/box';
// import RecentUpdateSection from './_components/RecentUpdateSection';
import TopCarousel from './_components/TopCarousel';
import { screenHeight } from '@/shared/theme';
import {
  IMG_HEADER_HEIGHT,
  movieCountries,
  movieFormat,
  movieGenres,
  movieYear,
  TAB_BAR_HEIGHT,
} from '@/config';
import HorizontalSection from './_components/HorizontalSection';
import { callAPIHelper } from '@/shared/utils/callAPIHelper';
import fetcher from '@/shared/services';
import { MovieBanner, MovieCommon } from '@/types/models/movie';
import { delay, shuffle } from '@/shared/utils/common';
import {
  DeviceEventEmitter,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

const HomeScreen = () => {
  const { t } = useI18n();

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const [isOnTop, setIsOnTop] = useState(true);

  const [recentData, setRecentData] = useState<MovieBanner[]>([]);
  const [isFetchingRecent, setIsFetchingRecent] = useState(true);

  const [bannerData, setBannerData] = useState<MovieBanner[]>([]);
  const [isFetchingBanner, setIsFetchingBanner] = useState(false);

  const [formatData, setFormatData] = useState<{
    name: string;
    data: MovieCommon[];
    slug: string;
  }>({ name: '', data: [], slug: '' });
  const [isFetchingFormat, setIsFetchingFormat] = useState(true);

  const [yearData, setYearData] = useState<{
    name: string;
    data: MovieCommon[];
    slug: string;
  }>({ name: '', data: [], slug: '' });
  const [isFetchingYear, setIsFetchingYear] = useState(true);

  const [genreData, setGenreData] = useState<{
    name: string;
    data: MovieCommon[];
    slug: string;
  }>({ name: '', data: [], slug: '' });
  const [isFetchingGenre, setIsFetchingGenre] = useState(true);

  const [countryData, setCountryData] = useState<{
    name: string;
    data: MovieCommon[];
    slug: string;
  }>({ name: '', data: [], slug: '' });
  const [isFetchingCountry, setIsFetchingCountry] = useState(true);

  const getHomeData = async (type?: string) => {
    if (type === 'refetch') {
      setTimeout(() => {
        DeviceEventEmitter.emit('home-refetch', { refetchStatus: false });
      }, 1500);
    }

    callAPIHelper({
      API: fetcher.movie.getRecentMoviesV3,
      payload: {},
      beforeSend: () => {
        setIsFetchingBanner(true);
      },
      onSuccess: (res) => {
        if (res.items.length > 7) {
          const shuffleData = shuffle(res.items);
          setBannerData(shuffleData.slice(0, 7));
        } else {
          setBannerData(res.items);
        }
      },
      onFinally: () => {
        setIsFetchingBanner(false);
      },
    });

    callAPIHelper({
      API: fetcher.movie.getRecentMoviesV2,
      payload: {},
      beforeSend: () => {
        setIsFetchingRecent(true);
      },
      onSuccess: (res) => {
        setRecentData(res.items);
      },
      onFinally: () => {
        setIsFetchingRecent(false);
      },
    });

    const randomMovieGenre =
      movieGenres[
        shuffle(Object.keys(movieGenres))[0] as keyof typeof movieGenres
      ];

    callAPIHelper({
      API: fetcher.movie.getMoviesByGenre,
      payload: { genre: randomMovieGenre.slug },
      beforeSend: () => {
        setIsFetchingGenre(true);
      },
      onSuccess: (res) => {
        setGenreData({
          name: randomMovieGenre.name,
          data: res.data.items,
          slug: randomMovieGenre.slug,
        });
      },
      onError: (err) => {
        console.log(err);
      },
      onFinally: () => {
        setIsFetchingGenre(false);
      },
    });

    await delay(200);
    const randomMovieFormat =
      movieFormat[
        shuffle(Object.keys(movieFormat))[0] as keyof typeof movieFormat
      ];

    callAPIHelper({
      API: fetcher.movie.getMovies,
      payload: { type_list: randomMovieFormat.slug },
      beforeSend: () => {
        setIsFetchingFormat(true);
      },
      onSuccess: (res) => {
        setFormatData({
          name: randomMovieFormat.name,
          data: res.data.items,
          slug: randomMovieFormat.slug,
        });
      },
      onError: (err) => {
        console.log(err);
      },
      onFinally: () => {
        setIsFetchingFormat(false);
      },
    });

    await delay(500);
    const randomMovieCountry =
      movieCountries[
        shuffle(Object.keys(movieCountries))[0] as keyof typeof movieCountries
      ];

    callAPIHelper({
      API: fetcher.movie.getMoviesByRegion,
      payload: { region: randomMovieCountry.slug },
      beforeSend: () => {
        setIsFetchingCountry(true);
      },
      onSuccess: (res) => {
        setCountryData({
          name: randomMovieCountry.name,
          data: res.data.items,
          slug: randomMovieCountry.slug,
        });
      },
      onError: (err) => {
        console.log(err);
      },
      onFinally: () => {
        setIsFetchingCountry(false);
      },
    });

    await delay(700);
    const randomMovieYear =
      movieYear[shuffle(Object.keys(movieYear))[0] as keyof typeof movieYear];

    callAPIHelper({
      API: fetcher.movie.getMoviesByYear,
      payload: { year: randomMovieYear.slug },
      beforeSend: () => {
        setIsFetchingYear(true);
      },
      onSuccess: (res) => {
        setYearData({
          name: randomMovieYear.name,
          data: res.data.items,
          slug: randomMovieYear.slug,
        });
      },
      onError: (err) => {
        console.log(err);
      },
      onFinally: () => {
        setIsFetchingYear(false);
      },
    });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    setIsOnTop(offsetY <= 0);
  };

  useEffect(() => {
    getHomeData();
  }, []);

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('Home', (action) => {
      if (isOnTop) {
        DeviceEventEmitter.emit('home-refetch', { refetchStatus: true });
        getHomeData('refetch');
      } else {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
      }
    });

    return () => {
      listener.remove();
    };
  }, [isOnTop]);

  return (
    <ScreenShell scrollable={false}>
      <Animated.ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        <TopCarousel
          scrollOffset={scrollOffset}
          data={bannerData}
          isFetching={isFetchingBanner}
        />
        <Box
          bg={'#000'}
          minH={screenHeight - IMG_HEADER_HEIGHT}
          py={15}
          gap={30}
        >
          <HorizontalSection
            type="recent"
            data={recentData}
            isFetching={isFetchingRecent}
            title="Phim mới cập nhật"
          />
          <HorizontalSection
            type="genre"
            data={genreData.data}
            isFetching={isFetchingGenre}
            title={genreData.name}
            slug={genreData.slug}
          />
          <HorizontalSection
            type="category"
            data={formatData.data}
            isFetching={isFetchingFormat}
            title={formatData.name}
            slug={formatData.slug}
          />
          <HorizontalSection
            type="country"
            data={countryData.data}
            isFetching={isFetchingCountry}
            title={countryData.name}
            slug={countryData.slug}
          />
          <HorizontalSection
            type="year"
            data={yearData.data}
            isFetching={isFetchingYear}
            title={yearData.name}
            slug={yearData.slug}
          />
        </Box>
      </Animated.ScrollView>
    </ScreenShell>
  );
};

export default HomeScreen;
