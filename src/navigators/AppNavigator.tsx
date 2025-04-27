import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { navigationHelper } from '@/shared/utils/navigationHelper';

import { MainStack } from './AppStack';

const AppNavigator = () => {
  const navigationRef = navigationHelper.getRef();
  const routeNameRef = useRef<string | undefined>('');

  const handleOnNavigationStateChange = () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

    if (previousRouteName !== currentRouteName) {
    }

    // For dev log
    if (__DEV__) {
      console.group('SCREEN CHANGE:', currentRouteName);
      console.log('▶ Previous:\t', previousRouteName);
      console.log('▶ Current:\t', currentRouteName);
      console.groupEnd();
    }

    routeNameRef.current = currentRouteName;
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={handleOnNavigationStateChange}
    >
      <MainStack />
    </NavigationContainer>
  );
};

export default AppNavigator;
