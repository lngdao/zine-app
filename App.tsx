import React from 'react';
import Application from '@/Application';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initNetInfoConfiguration } from '@/shared/utils/common';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { SingletonHooksContainer } from 'react-singleton-hook';
import RNOrientationDirector, {
  Orientation,
} from 'react-native-orientation-director';
import AppProviders from '@/shared/core/AppProvider';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

enableScreens(true);
initNetInfoConfiguration();

RNOrientationDirector.lockTo(Orientation.portrait);

const App = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <AppProviders>
          <Application />
          <SingletonHooksContainer />
        </AppProviders>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
