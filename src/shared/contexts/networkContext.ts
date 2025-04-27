import { createContext, useContext } from 'react';
import { Updater } from 'use-immer';

export interface NetworkContextProps {
  isOffline: boolean;
  updateIsOffline: Updater<boolean>;
}

export const NetworkContext = createContext<NetworkContextProps>({
  isOffline: false,
  updateIsOffline: () => {},
});

export const useNetworkContext = () => useContext(NetworkContext);
