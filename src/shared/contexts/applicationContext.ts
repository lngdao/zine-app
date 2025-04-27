import { createContext, useContext } from 'react';
import { Updater } from 'use-immer';
import i18next from 'i18next';

export interface AppContextProps {
  locale: string;
  isGlobalLoading: boolean;
  updateGlobalLoading: Updater<boolean>;
}

export const AppContext = createContext<AppContextProps>({
  locale: i18next.language,
  isGlobalLoading: false,
  updateGlobalLoading: () => {},
});

export const useAppContext = () => useContext(AppContext);
