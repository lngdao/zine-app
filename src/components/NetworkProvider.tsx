import React, { PropsWithChildren, useEffect } from 'react';
import { NetworkContext } from '@/shared/contexts/networkContext';
import NetInfo from '@react-native-community/netinfo';
import { useImmer } from 'use-immer';

const NetworkProvider = ({ children }: PropsWithChildren) => {
  const [isOffline, updateIsOffline] = useImmer(false);
  const contextValue = { isOffline, updateIsOffline };

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const _isOffline = !state.isConnected || !state.isInternetReachable;
      updateIsOffline(_isOffline);
    });

    return () => {
      removeNetInfoSubscription();
    };
  }, []);

  return (
    <NetworkContext.Provider value={contextValue}>
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;
