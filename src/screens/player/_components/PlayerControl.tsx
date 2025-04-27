import React, { useCallback, useRef, useState } from 'react';
import { GestureResponderEvent, StyleSheet } from 'react-native';
import { Box } from '@/components/box';
import { FadeIn, FadeOut, SharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/text';
import Monicon from '@monicon/native';
import { Touchable } from '@/components/button';
import { navigationHelper } from '@/shared/utils/navigationHelper';
import { VideoRef } from 'react-native-video';
import { Slider } from 'react-native-awesome-slider';
import { screenWidth } from '@/shared/theme';
import { formatTime } from '@/shared/utils/common';
import { ServerDatum } from '@/types/models/movie';

interface Props {
  movieTitle: string;
  episodeName: string;
  videoRef: React.RefObject<VideoRef>;
  duration: SharedValue<number>;
  isPaused: boolean;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  controlsVisible: boolean;
  setControlsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedEpisodeIndex: React.Dispatch<React.SetStateAction<number>>;
  nextEpisode: ServerDatum | null;
  progress: SharedValue<number>;
  min: SharedValue<number>;
}

enum SeekType {
  Forward = 0,
  Backward,
}

const AUTO_HIDE_TIMEOUT = 3000;

const PlayerControl = ({
  controlsVisible,
  setControlsVisible,
  movieTitle,
  episodeName,
  videoRef,
  duration,
  isPaused,
  setIsPaused,
  nextEpisode,
  setSelectedEpisodeIndex,
  progress,
  min,
  currentTime,
  setCurrentTime,
}: Props) => {
  const [isBuffering, setIsBuffering] = useState(false);
  const [previewSeekTime, setPreviewSeekTime] = useState('00:00');
  const [isSliding, setIsSliding] = useState(false);

  const autoHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<number>(0);

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

  if (!controlsVisible) {
    return null;
  }

  return (
    <Box.Animated
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      absolute
      style={StyleSheet.absoluteFill}
      bg={'rgba(0,0,0, 0.7)'}
      zIndex={20}
    >
      <SafeAreaView style={{ height: '100%' }}>
        <Box flex center>
          <Box absolute top={0} wFull py={10}>
            <Box
              row
              alignItems="center"
              justifyContent="space-between"
              gap={50}
            >
              <Text
                size={17}
                fontFamily={Text.fonts.inter.semiBold}
                numberOfLines={2}
                flex={1}
              >
                {movieTitle}
              </Text>
              <Box row gap={15}>
                <Touchable
                  onPress={() => {
                    videoRef.current?.enterPictureInPicture();
                  }}
                >
                  <Box bg={'rgba(29,29,29, 0.7)'} p={6} rounded={'full'}>
                    <Monicon
                      name="ri:picture-in-picture-line"
                      color="#FFF"
                      size={18}
                    />
                  </Box>
                </Touchable>
                <Touchable
                  onPress={() => {
                    setTimeout(() => {
                      navigationHelper.goBack();
                    }, 0);
                  }}
                >
                  <Box bg={'rgba(29,29,29, 0.7)'} p={6} rounded={'full'}>
                    <Monicon name="ri:close-fill" color="#FFF" size={18} />
                  </Box>
                </Touchable>
              </Box>
            </Box>
            <Text mt={3} size={13} color="#bababa">
              {episodeName}
            </Text>
          </Box>
          {!isSliding && (
            <Box center row gap={85}>
              <Touchable onPress={() => handleOnSeek(SeekType.Backward)}>
                <Monicon name="ri:replay-10-line" color="#FFF" size={34} />
              </Touchable>
              <Touchable
                onPress={() => {
                  setIsPaused((prev) => {
                    // if (prev) {
                    handleControlInteraction();
                    // } else {
                    //   setControlsVisible(true);
                    //   clearTimeoutHideControl();
                    // }

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
                <Monicon name="ri:forward-10-line" color="#FFF" size={34} />
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
              <Box h={20} mt={15} />
            ) : (
              <Box mt={15} alignItems="center" justifyContent="flex-end" row>
                <Touchable
                  disabled={!nextEpisode}
                  onPress={() => {
                    setIsPaused(true);
                    setSelectedEpisodeIndex((prev) => prev + 1);
                    setTimeout(() => setIsPaused(false), 0);
                    handleControlInteraction();
                  }}
                >
                  <Box row center gap={7}>
                    <Monicon
                      name="ri:skip-forward-line"
                      color={!nextEpisode ? '#747474' : '#FFF'}
                      size={20}
                    />
                    <Text
                      size={13}
                      color={!nextEpisode ? '#747474' : '#FFF'}
                      fontFamily={Text.fonts.inter.medium}
                    >
                      Tập tiếp theo
                    </Text>
                  </Box>
                </Touchable>
              </Box>
            )}
          </Box>
        </Box>
      </SafeAreaView>
    </Box.Animated>
  );
};

export default PlayerControl;
