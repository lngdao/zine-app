// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from './CustomTabBar';
import HomeScreen from '@/screens/home/HomeScreen';
import SearchScreen from '@/screens/search/SearchScreen';
import { TAB_NAME } from '@/config';
import ProfileScreen from '@/screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabStack = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name={TAB_NAME.Home}
        component={HomeScreen}
        options={{
          tabIcon: 'ri:home-5-line',
          tabIconFocus: 'ri:home-5-fill',
          tabName: 'Trang chủ',
          tabNameEng: 'Home',
        }}
      />
      <Tab.Screen
        name={TAB_NAME.Search}
        component={SearchScreen}
        options={{
          tabIcon: 'ri:search-line',
          tabIconFocus: 'ri:search-fill',
          tabName: 'Tìm kiếm',
          tabNameEng: 'Search',
        }}
      />
      <Tab.Screen
        name={TAB_NAME.Profile}
        component={ProfileScreen}
        options={{
          tabIcon: 'ri:settings-4-line',
          tabIconFocus: 'ri:settings-4-fill',
          tabName: 'Thêm',
          tabNameEng: 'Setting',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabStack;
