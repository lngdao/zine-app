import React, { useCallback, useState } from 'react';
import { Box, BoxProps } from './box';
import FastImage, {
  FastImageProps,
  OnProgressEvent,
  Source,
} from 'react-native-fast-image';
import { Svg, Circle } from 'react-native-svg';
import {
  DimensionValue,
  ImageRequireSource,
  LayoutChangeEvent,
  StyleSheet,
  unstable_batchedUpdates,
} from 'react-native';
import Monicon from '@monicon/native';

interface TurboImageProps {
  width?: DimensionValue;
  height?: DimensionValue;
  ratio?: number;
  rounded?: number;
  source?: Source | ImageRequireSource;
  $fastImageProps?: Omit<FastImageProps, 'source'>;
  $wrapperProps?: Omit<BoxProps, 'rounded'>;
}

const TurboImage = ({
  width,
  height,
  source,
  ratio,
  rounded,
  $fastImageProps,
  $wrapperProps,
}: TurboImageProps) => {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [isError, setIsError] = useState(false);

  const handleOnLayout = useCallback((event: LayoutChangeEvent) => {
    const { width: layoutWidth, height: layoutHeight } =
      event.nativeEvent.layout;

    setSize({ width: layoutWidth, height: layoutHeight });
  }, []);

  const handleOnProgress = useCallback((e: OnProgressEvent) => {
    const percent = e.nativeEvent.loaded / e.nativeEvent.total;

    if (percent > 0 && percent < 1) {
      setProgress(percent);
    }
  }, []);

  const handleOnError = useCallback(() => {
    unstable_batchedUpdates(() => {
      setLoading(false);
      setIsError(true);
    });
  }, []);

  return (
    <Box
      overflow="hidden"
      {...$wrapperProps}
      rounded={rounded}
      w={width}
      h={height}
      aspectRatio={ratio}
      onLayout={handleOnLayout}
    >
      {loading && size.width > 0 && size.height > 0 && (
        <Box absolute style={StyleSheet.absoluteFill}>
          <Svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${size.width} ${size.height}`}
          >
            <Circle
              cx={size.width / 2}
              cy={size.height / 2}
              r={Math.min(size.width, size.height) / 8}
              stroke="#ddd"
              strokeWidth={2}
              fill="none"
            />
            <Circle
              cx={size.width / 2}
              cy={size.height / 2}
              r={Math.min(size.width, size.height) / 8}
              // stroke="#1f6efc"
              stroke="#000"
              strokeWidth={3}
              fill="none"
              strokeDasharray={
                Math.PI * (Math.min(size.width, size.height) / 2)
              }
              strokeDashoffset={
                (1 - progress) *
                Math.PI *
                (Math.min(size.width, size.height) / 2)
              }
              strokeLinecap="round"
            />
          </Svg>
        </Box>
      )}

      {isError && !loading && (
        <Box flex center bg={'#222'} gap={5}>
          <Monicon name="ic:round-broken-image" size={32} color="#727272" />
        </Box>
      )}

      {!isError && (
        <FastImage
          style={{ flex: 1 }}
          resizeMode={FastImage.resizeMode.cover}
          {...$fastImageProps}
          source={source}
          onLoadStart={() => {
            setProgress(0);
            setLoading(true);
          }}
          onError={handleOnError}
          onProgress={handleOnProgress}
          onLoadEnd={() => {
            setLoading(false);
          }}
        />
      )}
    </Box>
  );
};

export default TurboImage;
