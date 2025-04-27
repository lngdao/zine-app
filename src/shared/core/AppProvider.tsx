import React, { FC, PropsWithChildren, ReactNode } from 'react';
import BookmarkProvider from '@/components/BookmarkProvider';
import NetworkProvider from '@/components/NetworkProvider';
import PlayerProvider from '@/components/PlayerProvider';
import ThemeProvider from '@/components/ThemeProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import { KeyboardProvider } from 'react-native-keyboard-controller';

type ProviderComponent = FC<{ children: ReactNode }>;

const providers: ProviderComponent[] = [
  ErrorBoundary,
  KeyboardProvider,
  ThemeProvider,
  NetworkProvider,
  PlayerProvider,
  BookmarkProvider,
];

const AppProviders = ({ children }: PropsWithChildren) => {
  return providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children,
  );
};

export default AppProviders;
