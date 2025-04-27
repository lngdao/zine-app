import { Box } from '@/components/box';
import { Touchable } from '@/components/button';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AppState,
  GestureResponderEvent,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { Text } from '@/components/text';
import { SCREEN_NAME } from '@/config';
import { usePlayer } from '@/shared/contexts/playerContext';
import useScreenDimensions from '@/shared/hooks/useScreenDimensions';
import { useScreenOrientation } from '@/shared/hooks/useScreenOrientation';
import {
  formatTime,
  isIos,
  triggerUntilCondition,
} from '@/shared/utils/common';
import { navigationHelper } from '@/shared/utils/navigationHelper';
import { ServerDatum } from '@/types/models/movie';
import Monicon from '@monicon/native';
import { Slider } from 'react-native-awesome-slider';
import RNOrientationDirector, {
  Orientation,
} from 'react-native-orientation-director';
import { FadeIn, FadeOut, useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video, { VideoRef } from 'react-native-video';
import ControlButton from './_components/ControlButton';
import SystemNavigationBar from 'react-native-system-navigation-bar';

enum SeekType {
  Forward = 0,
  Backward,
}

const AUTO_HIDE_TIMEOUT = 3000;

const PlayerScreen = () => {
  const route = useRoute<any>();
  const { useWebViewPlayer } = usePlayer();

  const { isLandscape } = useScreenOrientation();
  const { screenWidth } = useScreenDimensions();

  const movieTitle = route.params?.title;
  const selectedIndex = route.params?.selectedIndex as number;
  const episodes = route.params?.episodes as ServerDatum[];

  const [selectedEpisodeIndex, setSelectedEpisodeIndex] =
    useState(selectedIndex);

  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [previewSeekTime, setPreviewSeekTime] = useState('00:00');
  // const [volume, setVolume] = useState(0.2);
  const [controlsVisible, setControlsVisible] = useState(false);
  const lastTapRef = useRef<number>(0);

  const duration = useSharedValue(0);

  const progress = useSharedValue(30);
  const min = useSharedValue(0);

  const videoRef = useRef<VideoRef>(null);
  const autoHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentEpisode = useMemo(
    () => episodes[selectedEpisodeIndex],
    [episodes, selectedEpisodeIndex],
  );

  const nextEpisode = useMemo(() => {
    if (episodes[selectedEpisodeIndex + 1]) {
      return episodes[selectedEpisodeIndex + 1];
    }

    return null;
  }, [selectedEpisodeIndex]);

  const prevEpisode = useMemo(() => {
    if (episodes[selectedEpisodeIndex - 1]) {
      return episodes[selectedEpisodeIndex - 1];
    }

    return null;
  }, [selectedEpisodeIndex]);

  // const resetAutoHideTimer = () => {
  //   setControlsVisible(true);
  //   if (autoHideTimeoutRef.current) clearTimeout(autoHideTimeoutRef.current);
  //   autoHideTimeoutRef.current = setTimeout(() => {
  //     setControlsVisible(false);
  //   }, AUTO_HIDE_TIMEOUT);
  // };

  const clearTimeoutHideControl = () => {
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current);
    }
  };

  const resetHideControlsTimer = useCallback(() => {
    clearTimeoutHideControl();

    autoHideTimeoutRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, AUTO_HIDE_TIMEOUT);
  }, []);

  const handleControlInteraction = useCallback(() => {
    setControlsVisible(true);
    resetHideControlsTimer();
  }, [resetHideControlsTimer]);

  const handleOnSeek = (type: SeekType) => {
    setIsPaused(true);
    if (type === SeekType.Backward) {
      const newTime = Math.max(currentTime - 10, 0);
      videoRef.current?.seek(newTime);
      setCurrentTime(newTime);
    }

    if (type === SeekType.Forward) {
      const newTime = Math.min(currentTime + 10, duration.value);
      videoRef.current?.seek(newTime);
      setCurrentTime(newTime);
    }

    setTimeout(() => {
      setIsPaused(false);
    }, 0);

    handleControlInteraction();
  };

  const handleTap = (event: GestureResponderEvent) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      const { locationX } = event.nativeEvent;
      if (locationX < screenWidth / 2) {
        handleOnSeek(SeekType.Backward);
      } else {
        handleOnSeek(SeekType.Forward);
      }
    } else {
      if (controlsVisible) setControlsVisible(false);
      else {
        setControlsVisible(true);
        resetHideControlsTimer();
      }
    }
    lastTapRef.current = now;
  };

  useFocusEffect(
    React.useCallback(() => {
      RNOrientationDirector.lockTo(Orientation.landscape);

      return () => {
        setIsPaused(true);
        SystemNavigationBar.stickyImmersive(false);
        RNOrientationDirector.lockTo(Orientation.portrait);
      };
    }, []),
  );

  useEffect(() => {
    SystemNavigationBar.stickyImmersive();

    const appStateListener = AppState.addEventListener(
      'change',
      (nextAppState) => {
        if (nextAppState === 'active') {
          if (!isPaused) {
            setIsPaused(true);
            setTimeout(() => {
              setIsPaused(false);
            }, 0);
          }
        }
      },
    );
    return () => {
      appStateListener?.remove();
    };
  }, [isPaused]);

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <Box flex>
        {currentEpisode.link_m3u8 && (
          <Video
            ref={videoRef}
            style={styles.backgroundVideo}
            source={{
              uri: currentEpisode.link_m3u8,
            }}
            muted={false}
            enterPictureInPictureOnLeave
            ignoreSilentSwitch={'ignore'}
            paused={isPaused}
            fullscreen={Platform.OS === 'android' ? false : true}
            resizeMode="contain"
            preventsDisplaySleepDuringVideoPlayback
            onEnd={() => {
              if (nextEpisode) {
                setIsPaused(true);
                setSelectedEpisodeIndex((prev) => prev + 1);
                setTimeout(() => setIsPaused(false), 0);
              } else {
                navigationHelper.goBack();
              }
            }}
            onBuffer={(buffer) => setIsBuffering(buffer.isBuffering)}
            onError={() =>
              useWebViewPlayer
                ? navigationHelper.replace(SCREEN_NAME.WebViewPlayer, {
                    url: currentEpisode.link_embed,
                    hideUrl: true,
                  })
                : navigationHelper.goBack()
            }
            onProgress={(data) => {
              setCurrentTime(data.currentTime);
              progress.set(data.currentTime);
            }}
            onLoad={(data) => duration.set(data.duration)}
          />
        )}

        {/* controls */}
        {controlsVisible && (
          <Box.Animated
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            absolute
            style={StyleSheet.absoluteFill}
            bg={'rgba(0,0,0, 0.6)'}
            zIndex={20}
          >
            <SafeAreaView style={{ height: '100%', justifyContent: 'center' }}>
              <Box
                h={isLandscape ? '100%' : '95%'}
                px={isLandscape ? (isIos ? 10 : 40) : 15}
                center
              >
                <Box absolute top={0} wFull pt={isLandscape ? 10 : 0}>
                  <Box
                    row
                    alignItems="center"
                    justifyContent="space-between"
                    gap={50}
                  >
                    <Text
                      size={18}
                      fontFamily={Text.fonts.inter.semiBold}
                      numberOfLines={2}
                      flex={1}
                    >
                      {movieTitle}
                    </Text>
                    <Box row gap={10}>
                      <ControlButton
                        onPress={() => {
                          videoRef.current?.enterPictureInPicture();
                        }}
                        icon="ri:picture-in-picture-line"
                        size={18}
                        rounded={'full'}
                      />
                      <ControlButton
                        onPress={() => {
                          setIsPaused(true);
                          RNOrientationDirector.lockTo(Orientation.portrait);

                          setTimeout(() => {
                            navigationHelper.goBack();
                          }, 0);
                        }}
                        icon="ph:x"
                        size={18}
                        rounded={'full'}
                      />
                    </Box>
                  </Box>
                  <Text mt={3} size={13} color="#bababa">
                    {currentEpisode.name}
                  </Text>
                </Box>
                {!isSliding && (
                  <Box center row gap={isLandscape ? 85 : 65}>
                    <Touchable onPress={() => handleOnSeek(SeekType.Backward)}>
                      <Monicon
                        name="ri:replay-10-line"
                        color="#FFF"
                        size={34}
                      />
                    </Touchable>
                    <Touchable
                      onPress={() => {
                        setIsPaused((prev) => {
                          handleControlInteraction();

                          return !prev;
                        });
                      }}
                    >
                      <Monicon
                        name={!isPaused ? 'fe:pause' : 'fe:play'}
                        color="#FFF"
                        size={54}
                      />
                    </Touchable>
                    <Touchable onPress={() => handleOnSeek(SeekType.Forward)}>
                      <Monicon
                        name="ri:forward-10-line"
                        color="#FFF"
                        size={34}
                      />
                    </Touchable>
                  </Box>
                )}
                <Box absolute bottom={0} wFull py={10}>
                  {!isSliding && (
                    <Box row gap={2} mb={15}>
                      <Text color="#FFF" size={12}>
                        {formatTime(currentTime)}
                      </Text>
                      <Text size={12}>/</Text>
                      <Text size={12} color="#747474">
                        {formatTime(duration.value)}
                      </Text>
                    </Box>
                  )}
                  {isSliding && (
                    <Box
                      mb={15}
                      rounded={'full'}
                      bg={'rgba(0,0,0,.6)'}
                      px={12}
                      py={6}
                      alignSelf="center"
                    >
                      <Text size={13}>{previewSeekTime}</Text>
                    </Box>
                  )}
                  <Slider
                    renderBubble={() => null}
                    theme={{
                      disableMinTrackTintColor: '#fff',
                      maximumTrackTintColor: '#747474',
                      minimumTrackTintColor: '#1f6efc',
                      cacheTrackTintColor: '#333',
                      bubbleBackgroundColor: '#1f6efc',
                      heartbeatColor: '#999',
                    }}
                    onValueChange={(value) => {
                      handleControlInteraction();
                      setPreviewSeekTime(formatTime(value));
                    }}
                    onSlidingStart={() => {
                      setIsSliding(true);
                      setIsPaused(true);
                    }}
                    onSlidingComplete={(value) => {
                      setIsPaused(true);
                      videoRef.current?.seek(value);

                      setTimeout(() => {
                        setIsPaused(false);
                        setIsSliding(false);
                      }, 0);
                    }}
                    bubble={(s) => formatTime(s)}
                    progress={progress}
                    minimumValue={min}
                    maximumValue={duration}
                    containerStyle={{ height: 2 }}
                  />
                  {isSliding ? (
                    <Box h={32} mt={15} />
                  ) : (
                    <Box
                      mt={15}
                      alignItems="center"
                      justifyContent="space-between"
                      row
                    >
                      <Box>
                        <ControlButton
                          onPress={() => {
                            handleControlInteraction();

                            if (isLandscape) {
                              triggerUntilCondition(
                                () => {
                                  RNOrientationDirector.lockTo(
                                    Orientation.portrait,
                                  );
                                },
                                200,
                                () => !isLandscape,
                              );
                            } else {
                              triggerUntilCondition(
                                () => {
                                  RNOrientationDirector.lockTo(
                                    Orientation.landscape,
                                  );
                                },
                                200,
                                () => isLandscape,
                              );
                            }
                          }}
                          icon="ph:device-rotate-duotone"
                        />
                      </Box>
                      <Box row gap={8}>
                        <ControlButton
                          disabled={!prevEpisode}
                          onPress={() => {
                            setIsPaused(true);
                            setSelectedEpisodeIndex((prev) => prev - 1);
                            setTimeout(() => setIsPaused(false), 0);
                            handleControlInteraction();
                          }}
                          icon="ph:arrow-circle-left-duotone"
                        />
                        <ControlButton
                          disabled={!nextEpisode}
                          onPress={() => {
                            setIsPaused(true);
                            setSelectedEpisodeIndex((prev) => prev + 1);
                            setTimeout(() => setIsPaused(false), 0);
                            handleControlInteraction();
                          }}
                          icon="ph:arrow-circle-right-duotone"
                        />
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </SafeAreaView>
          </Box.Animated>
        )}
      </Box>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
  },
});

export default PlayerScreen;
