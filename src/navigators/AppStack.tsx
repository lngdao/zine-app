import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SCREEN_NAME } from '@/config';

import HomeScreen from '@/screens/home/HomeScreen';
import StartupScreen from '@/screens/startup/StartupScreen';
import DetailScreen from '@/screens/detail/DetailScreen';
import { Platform } from 'react-native';
import PlayerScreen from '@/screens/player/PlayerScreen';
import TabStack from './TabStack';
import ListScreen from '@/screens/list/ListScreen';
import WebViewPlayerScreen from '@/screens/webview-player/WebViewPlayerScreen';
import BookmarkScreen from '@/screens/bookmark/BookmarkScreen';
import BookmarkDetailScreen from '@/screens/bookmark-detail/BookmarkDetailScreen';

const AppStack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'android' ? 'none' : undefined,
      }}
    >
      <AppStack.Screen name={'Main'} component={TabStack} />
      <AppStack.Screen
        name={SCREEN_NAME.Detail}
        component={DetailScreen}
        // options={{
        //   animation: 'fade',
        //   presentation: Platform.OS === 'ios' ? 'transparentModal' : 'card',
        // }}
      />
      <AppStack.Screen name={SCREEN_NAME.List} component={ListScreen} />
      <AppStack.Screen name={SCREEN_NAME.Bookmark} component={BookmarkScreen} />
      <AppStack.Screen
        name={SCREEN_NAME.BookmarkDetail}
        component={BookmarkDetailScreen}
      />
      <AppStack.Screen
        name={SCREEN_NAME.Player}
        component={PlayerScreen}
        options={{ autoHideHomeIndicator: true, gestureEnabled: false }}
      />
      <AppStack.Screen
        name={SCREEN_NAME.WebViewPlayer}
        component={WebViewPlayerScreen}
        options={{
          autoHideHomeIndicator: true,
          presentation: 'formSheet',
        }}
      />
    </AppStack.Navigator>
  );
};

export { MainStack };
