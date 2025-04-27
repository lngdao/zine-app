import React from 'react';
import { Appearance, StatusBar } from 'react-native';
import { useImmer } from 'use-immer';
import { useI18n } from './shared/hooks/useI18n';
import {
  AppContext,
  AppContextProps,
} from './shared/contexts/applicationContext';
import AppNavigator from './navigators/AppNavigator';
import StartupScreen from './screens/startup/StartupScreen';
import { Toaster } from 'sonner-native';
import { RNAlert } from './components/RNAlert/RNAlert';

Appearance.setColorScheme('dark');

const Application = () => {
  const { currentLng } = useI18n();
  const [isGlobalLoading, updateGlobalLoading] = useImmer(false);

  const [isAppReady, updateAppReady] = useImmer(false);

  const contextValue: AppContextProps = {
    locale: currentLng || 'vi',
    isGlobalLoading,
    updateGlobalLoading,
  };

  // if (!isAppReady) {
  //   return <StartupScreen onDone={() => updateAppReady(true)} />;
  // }

  return (
    <AppContext.Provider value={contextValue}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={'light-content'}
      />
      <AppNavigator />
      <Toaster position="bottom-center" />
      <RNAlert />
      {!isAppReady && <StartupScreen onDone={() => updateAppReady(true)} />}
    </AppContext.Provider>
  );
};

export default Application;
