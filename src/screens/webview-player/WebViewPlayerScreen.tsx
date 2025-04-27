import React, { useState } from 'react';
import { Box } from '@/components/box';
import WebView from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
import { Touchable } from '@/components/button';
import { navigationHelper } from '@/shared/utils/navigationHelper';
import { Text } from '@/components/text';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

const WebViewPlayerScreen = () => {
  const route = useRoute<any>();
  const { top: topInset } = useSafeAreaInsets();

  const url = route.params?.url;
  const hideUrl = route.params?.hideUrl;

  const [currentUrl, setCurrentUrl] = useState(url);
  const progress = useSharedValue(0);

  const progressBarStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
      opacity: progress.value < 1 ? 1 : withTiming(0, { duration: 300 }),
    };
  });

  const handleNavigationStateChange = (navState: any) => {
    setCurrentUrl(navState.url);
  };

  return (
    <Box flex bg={'#000'}>
      {Platform.OS === 'android' && <Box h={topInset} />}
      <Box>
        <Box
          row
          py={15}
          wFull
          gap={25}
          alignItems="center"
          justifyContent="space-between"
          px={15}
        >
          {hideUrl ? (
            <Box />
          ) : (
            <Text flex={1} size={15} numberOfLines={1} color="#dbdbdb">
              {currentUrl}
            </Text>
          )}
          <Touchable
            center
            onPress={() => navigationHelper.goBack()}
            // alignSelf="flex-end"
            // mr={15}
          >
            <Text
              size={16}
              color="#1f6efc"
              fontFamily={Text.fonts.inter.medium}
            >
              Xong
            </Text>
          </Touchable>
        </Box>
        <Box.Animated bg={'#1f6efc'} wFull h={1} style={progressBarStyle} />
      </Box>
      {url && (
        <WebView
          source={{ uri: url }}
          style={{ flex: 1, backgroundColor: '#000' }}
          javaScriptEnabled
          domStorageEnabled
          scalesPageToFit={false}
          injectedJavaScript={`
          const meta = document.createElement('meta'); 
          meta.setAttribute('name', 'viewport'); 
          meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'); 
          document.getElementsByTagName('head')[0].appendChild(meta);
          true;
          `}
          onLoadStart={() => {
            progress.value = withTiming(0);
          }}
          onLoadProgress={({ nativeEvent }) => {
            progress.value = withTiming(nativeEvent.progress);
          }}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          allowsFullscreenVideo
          onNavigationStateChange={handleNavigationStateChange}
          onError={(e) => console.log('Error:', e)}
        />
      )}
    </Box>
  );
};

export default WebViewPlayerScreen;
