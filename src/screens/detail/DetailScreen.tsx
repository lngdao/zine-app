import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Box } from '@/components/box';
import Image from 'react-native-fast-image';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import Animated, {
  FadeIn,
  FadeInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { callAPIHelper } from '@/shared/utils/callAPIHelper';
import fetcher from '@/shared/services';
import { Episode, Movie, ServerDatum } from '@/types/models/movie';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from '@/components/text';
import { BlurView } from '@react-native-community/blur';
import { Button, Touchable } from '@/components/button';
import { navigationHelper } from '@/shared/utils/navigationHelper';
import { decodeHtmlEntities, isIos } from '@/shared/utils/common';
import {
  BOOKMARD_DEFAULT_ID,
  BOTTOM_INSET,
  IMG_HEADER_HEIGHT,
  isIpad,
  isIphoneX,
  SCREEN_NAME,
} from '@/config';
import MovieDescCollapsibleText from './_components/MovieDescCollapsibleText';
import ListEpisode from './_components/ListEpisode';
import { Monicon } from '@monicon/native';
import AnimatedHeader, {
  useAnimatedHeaderHeight,
} from '@/components/AnimatedHeader';
import { usePlayer } from '@/shared/contexts/playerContext';
import AllEpisodeBottomSheet from './_components/AllEpisodeModal';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import _ from 'lodash';
import { useBookmark } from '@/shared/contexts/bookmarkContext';
import { toast } from 'sonner-native';
import useScreenDimensions from '@/shared/hooks/useScreenDimensions';
import { useScreenOrientation } from '@/shared/hooks/useScreenOrientation';
import { showToast } from '@/components/Toast';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const DetailScreenComponent = () => {
  const { screenWidth, screenHeight } = useScreenDimensions();
  const { isLandscape } = useScreenOrientation();

  const animatedHeaderHeight = useAnimatedHeaderHeight();

  const CAROUSEL_IMG_HEIGHT = isLandscape
    ? screenHeight / 1.2
    : screenHeight / 2.2;

  const [data, setData] = useState<Movie | null>(null);
  const [movieEpisodes, setMovieEpisodes] = useState<Episode[]>();
  const [selectedServerData, setSelectedServerData] = useState<ServerDatum[]>(
    [],
  );

  const [isFocus, setIsFocus] = useState(false);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const sheetRef = useRef<BottomSheetModal>(null);
  const sheetDescRef = useRef<BottomSheetModal>(null);

  const route = useRoute<any>();
  const { openPlayer } = usePlayer();

  const _id = route.params?._id;
  const slug = route.params?.slug;
  const sharedTag = route.params?.sharedTag;
  const thumb = route.params?.thumb;
  const isFromList = route.params?.isFromList;

  const { isBookmarked, bookmarkMovie, unBookmarkMovie } = useBookmark(_id);

  const playMovie = (episodes: ServerDatum[], selectedIndex: number) => {
    openPlayer({ title: data?.name, episodes: episodes, selectedIndex });
  };

  const handleOpenFullListEpisode = () => {
    sheetRef.current?.present();
  };

  const youtubeUrlData = useMemo(() => {
    if (data && data?.trailer_url) {
      const match = data.trailer_url.match(
        /(?:\?v=|\/shorts\/|\/embed\/|\/v\/|youtu\.be\/)([^&?/]+)/,
      );
      const videoId = match ? match[1] : null;

      return {
        thumbnail: `http://img.youtube.com/vi/${videoId}/0.jpg`,
        id: videoId,
      };
    }

    return { thumbnail: '', id: '' };
  }, [data?.trailer_url]);

  const handleOnBookmarkPress = () => {
    if (!data) return;

    if (isBookmarked) {
      unBookmarkMovie(BOOKMARD_DEFAULT_ID, [
        {
          _id,
          poster_url: data.poster_url,
          thumb_url: data.thumb_url,
          name: data.name,
          origin_name: data.origin_name,
          slug: data.slug,
          content: data.content,
        },
      ]);
      showToast({
        msg: 'Đã xoá khỏi danh sách đã thích',
        icon: 'ri:emotion-normal-line',
      });
    } else {
      bookmarkMovie(BOOKMARD_DEFAULT_ID, [
        {
          _id,
          poster_url: data.poster_url,
          thumb_url: data.thumb_url,
          name: data.name,
          origin_name: data.origin_name,
          slug: data.slug,
          content: data.content,
        },
      ]);

      showToast({
        msg: 'Đã thêm vào danh sách đã thích',
        icon: 'ri:emotion-line',
        $right: (_toast, _toastId) => (
          <Touchable
            onPress={() => {
              navigationHelper.navigate(SCREEN_NAME.Bookmark, {
                from: data.name,
              });
              setTimeout(() => _toast.dismiss(_toastId), 200);
            }}
          >
            <Text color="#1f6efc" fontFamily={Text.fonts.inter.semiBold}>
              Xem
            </Text>
          </Touchable>
        ),
      });
    }
  };

  const getData = async () => {
    callAPIHelper({
      API: fetcher.movie.getMovie,
      payload: { slug },
      onSuccess(res) {
        setData(res.movie);
        setMovieEpisodes(res.episodes);
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        setIsFocus(true);
      }, 700);

      return () => {
        setIsFocus(false);
      };
    }, []),
  );

  useEffect(() => {
    getData();
  }, [slug]);

  // useEffect(() => {
  //   Orientation.lockToPortraitUpsideDown();
  // }, []);

  const posterAnimatedStyle = useAnimatedStyle(() => {
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

  const wrapperPosterStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollOffset.value,
        [0, CAROUSEL_IMG_HEIGHT + (Platform.OS === 'ios' ? 90 : 50)],
        [1, 0],
      ),
    };
  });

  return (
    <Box flex bg={'#000'}>
      <AnimatedHeader
        showBack
        title={data?.name || ''}
        scrollOffset={scrollOffset}
        range={CAROUSEL_IMG_HEIGHT - animatedHeaderHeight}
        rightComponent={
          <Touchable onPress={handleOnBookmarkPress}>
            <Monicon
              name={isBookmarked ? 'ri:bookmark-fill' : 'ri:bookmark-line'}
              color="#1f6efc"
              size={22}
            />
          </Touchable>
        }
      />
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: data ? '#1c1c1e' : '#000' }}
        contentContainerStyle={{
          paddingBottom: BOTTOM_INSET,
        }}
      >
        <Box>
          <Box.Animated
            absolute
            w={screenWidth}
            h={CAROUSEL_IMG_HEIGHT}
            style={posterAnimatedStyle}
          >
            {thumb && (
              // <Animated.Image
              <AnimatedImage
                // sharedTransitionTag={sharedTag}
                style={[{ flex: 1 }]}
                source={{
                  uri: thumb,
                }}
                resizeMode={'cover'}
              />
            )}
            {/* Overlay blur */}
            <Box.Animated
              entering={FadeIn.delay(300).duration(650)}
              style={StyleSheet.absoluteFillObject}
            >
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType="dark"
                blurAmount={15}
                reducedTransparencyFallbackColor="white"
              />
            </Box.Animated>
          </Box.Animated>

          {/* Content header */}
          <Box w={screenWidth} h={CAROUSEL_IMG_HEIGHT}>
            {/* Overlay fade */}
            <Box.Animated
              entering={FadeInDown.delay(300).duration(600)}
              absolute
              wFull
              hFull
              // h={'60%'}
              bottom={0}
            >
              <LinearGradient
                style={StyleSheet.absoluteFillObject}
                // colors={['transparent', 'rgba(18, 18, 18, 1)']}
                colors={['transparent', 'rgba(0, 0, 0, 1)']}
              />
            </Box.Animated>
            <Box.Animated
              style={[StyleSheet.absoluteFillObject, wrapperPosterStyle]}
              center
            >
              <Box h={animatedHeaderHeight} />
              <AnimatedImage
                // entering={FadeIn.delay(300).duration(800)}
                style={{
                  aspectRatio: 300 / 430,
                  flex: 1,
                  marginTop: 5,
                  marginBottom: 15,
                  borderRadius: 8,
                }}
                source={{
                  uri: data?.poster_url ? data.poster_url : 'data:image/png',
                }}
              />
              <Box.Animated
                entering={
                  isIos
                    ? FadeInDown.withInitialValues({
                        transform: [{ translateY: 5 }],
                      })
                        .delay(300)
                        .duration(600)
                    : undefined
                }
                // h={70}
                w={'90%'}
                mt={isIpad() ? 10 : 0}
                center
              >
                <Text.Animated
                  numberOfLines={1}
                  size={18}
                  fontFamily={Text.fonts.inter.semiBold}
                >
                  {data?.name}
                </Text.Animated>
                <Text.Animated
                  size={16}
                  mt={5}
                  color={'#dbdbdb'}
                  numberOfLines={1}
                >
                  {data?.origin_name}
                </Text.Animated>
                <Text.Animated
                  mt={7}
                  size={12}
                  color={'#7a7a7a'}
                  numberOfLines={1}
                >
                  {[data?.quality, data?.year].filter(Boolean).join(' | ')}
                </Text.Animated>
              </Box.Animated>
            </Box.Animated>
          </Box>
        </Box>

        {/* Main content */}
        <Box.Animated
          bg={'#000'}
          pt={20}
          minHeight={screenHeight - IMG_HEADER_HEIGHT}
          entering={FadeIn.delay(300).duration(600)}
        >
          <Box mb={12}>
            <Animated.ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 15, gap: 7 }}
            >
              {data?.category?.map((item, index) => (
                <Touchable.Animated
                  entering={FadeIn.delay(150 * index)}
                  bg={'#2e2e35'}
                  key={item.slug}
                  px={8}
                  py={4}
                  rounded={4}
                  onPress={() => {
                    if (isFromList) {
                      navigationHelper.push(SCREEN_NAME.List, {
                        type: 'genre',
                        name: `Phim ${item.name}`,
                        slug: item.slug,
                        from: data?.name,
                      });
                    } else {
                      navigationHelper.navigate(SCREEN_NAME.List, {
                        type: 'genre',
                        name: `Phim ${item.name}`,
                        slug: item.slug,
                        from: data?.name,
                      });
                    }
                  }}
                >
                  <Text
                    color="#9f9fa2"
                    size={12}
                    fontFamily={Text.fonts.inter.medium}
                  >
                    {item.name}
                  </Text>
                </Touchable.Animated>
              ))}
            </Animated.ScrollView>
          </Box>
          {!_.isEmpty(data) && (
            <Box wFull px={15}>
              <Button.Animated
                disabled={!movieEpisodes?.length}
                onPress={() => {
                  if (movieEpisodes?.[0].server_data[0].link_embed)
                    playMovie(movieEpisodes?.[0].server_data, 0);
                }}
                wFull
                row
                gap={8}
              >
                <Monicon name="ri:play-large-fill" color="#FFF" />
                <Text fontFamily={Text.fonts.inter.semiBold}>Xem ngay</Text>
              </Button.Animated>
            </Box>
          )}

          {data?.content && (
            <Box.Animated px={15} mt={15}>
              {/* <CollapsibleText
                value={decodeHtmlEntities(data.content)}
                collapsedNumberOfLines={3}
              /> */}
              <Touchable
                disableFeedback
                onPress={() => {
                  sheetDescRef.current?.present();
                }}
              >
                <Text numberOfLines={4} color="#9f9fa2" textAlign="justify">
                  {decodeHtmlEntities(data.content)}
                </Text>
              </Touchable>
            </Box.Animated>
          )}

          {!!movieEpisodes?.length && (
            <Box mt={25}>
              <Box.Animated
                row
                gap={7}
                px={15}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                {/* <Box w={5} rounded={1} hFull bg={'#1f6efc'} /> */}
                <Text
                  size={22}
                  fontFamily={Text.fonts.inter.semiBold}
                  color="#FFFFFF"
                >
                  Danh sách
                </Text>

                <Touchable onPress={handleOpenFullListEpisode}>
                  <Text color="#747474" size={13}>
                    Hiển thị tất cả
                  </Text>
                </Touchable>
              </Box.Animated>

              <ListEpisode
                onEpisodeDataChange={(serverData) => {
                  setSelectedServerData(serverData);
                }}
                title={data!.name}
                episodeData={movieEpisodes || []}
                handleOpenFullListEpisode={handleOpenFullListEpisode}
              />
            </Box>
          )}

          {data?.trailer_url && (
            <Box wFull px={15} mt={30}>
              <Text
                size={22}
                fontFamily={Text.fonts.inter.semiBold}
                color="#FFFFFF"
              >
                Trailer
              </Text>
              <Touchable
                mt={12}
                wFit
                alignSelf="flex-start"
                onPress={() =>
                  navigationHelper.navigate(SCREEN_NAME.WebViewPlayer, {
                    url: `https://www.youtube.com/embed/${youtubeUrlData.id}`,
                  })
                }
              >
                <Box
                  w={isLandscape ? 210 : screenWidth / 2.3}
                  aspectRatio={1.78}
                  rounded={8}
                  overflow="hidden"
                >
                  <Image
                    style={{ flex: 1 }}
                    source={{ uri: youtubeUrlData.thumbnail }}
                  />
                  <Box absolute style={StyleSheet.absoluteFill} center>
                    <Monicon name="ri:play-large-fill" color="#FFF" size={32} />
                  </Box>
                </Box>
              </Touchable>
            </Box>
          )}

          {data && (
            <Box
              px={15}
              pt={15}
              pb={isIphoneX ? 20 : 0}
              mt={30}
              bg={'#1c1c1e'}
              gap={20}
            >
              <Box gap={15}>
                <Text
                  size={22}
                  fontFamily={Text.fonts.inter.semiBold}
                  color="#FFFFFF"
                >
                  Thông Tin
                </Text>
                {data?.type && (
                  <Box gap={3}>
                    <Text.Animated
                      fontFamily={Text.fonts.inter.semiBold}
                      color={'#dbdbdb'}
                      size={13}
                    >
                      Thể loại
                    </Text.Animated>
                    <Text color="#9f9fa2" size={12}>
                      {data.type === 'series' ? 'Nhiều tập' : 'Phim lẻ'}
                    </Text>
                  </Box>
                )}
                {data?.status && (
                  <Box gap={3}>
                    <Text.Animated
                      fontFamily={Text.fonts.inter.semiBold}
                      color={'#dbdbdb'}
                      size={13}
                    >
                      Tình trạng
                    </Text.Animated>
                    <Text color="#9f9fa2" size={12}>
                      {data.status === 'ongoing' ? 'Đang chiếu' : 'Hoàn thành'}
                    </Text>
                  </Box>
                )}
                {data?.country.length && (
                  <Box gap={3}>
                    <Text.Animated
                      fontFamily={Text.fonts.inter.semiBold}
                      color={'#dbdbdb'}
                      size={13}
                    >
                      Quốc gia
                    </Text.Animated>
                    <Text color="#9f9fa2" size={12}>
                      {data?.country.map((item) => item.name).join(', ')}
                    </Text>
                  </Box>
                )}
              </Box>
              <Box gap={15}>
                <Text
                  size={22}
                  fontFamily={Text.fonts.inter.semiBold}
                  color="#FFFFFF"
                >
                  Diễn Viên & Đoàn Làm Phim
                </Text>
                {data?.director.length && (
                  <Box gap={3}>
                    <Text.Animated
                      fontFamily={Text.fonts.inter.semiBold}
                      color={'#dbdbdb'}
                      size={13}
                    >
                      Đạo diễn
                    </Text.Animated>
                    <Text color="#9f9fa2" size={12}>
                      {data.director.join(', ')}
                    </Text>
                  </Box>
                )}
                {data?.actor.length && (
                  <Box gap={3}>
                    <Text.Animated
                      fontFamily={Text.fonts.inter.semiBold}
                      color={'#dbdbdb'}
                      size={13}
                    >
                      Diễn viên
                    </Text.Animated>
                    <Text color="#9f9fa2" size={12}>
                      {data.actor.join(', ')}
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box.Animated>
      </Animated.ScrollView>

      {!!(movieEpisodes?.length && selectedServerData.length && isFocus) && (
        <AllEpisodeBottomSheet
          sheetRef={sheetRef}
          data={selectedServerData}
          movieTitle={data?.name || ''}
        />
      )}

      {!!(data?.content && data?.name && isFocus) && (
        <MovieDescCollapsibleText
          sheetRef={sheetDescRef}
          value={decodeHtmlEntities(data.content)}
          title={data.name}
        />
      )}
    </Box>
  );
};

const DetailScreen = () => {
  return (
    <BottomSheetModalProvider>
      <DetailScreenComponent />
    </BottomSheetModalProvider>
  );
};

export default DetailScreen;
